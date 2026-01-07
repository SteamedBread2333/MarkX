/**
 * Mermaid 渲染和导出模块
 */

import { mermaid, initMermaid } from '../config/mermaid.js';
import { elements } from '../core/elements.js';
import { AppState } from '../core/state.js';
import { escapeHtml } from '../core/utils.js';
import { setStatus } from '../core/ui-utils.js';

/**
 * 渲染所有 Mermaid 图表
 */
export async function renderMermaidCharts() {
    const mermaidElements = elements.preview.querySelectorAll('.mermaid');
    
    if (mermaidElements.length === 0) return;
    
    // 重新初始化 Mermaid（以应用主题）
    initMermaid();
    
    // 渲染每个图表
    for (let i = 0; i < mermaidElements.length; i++) {
        const element = mermaidElements[i];
        let code = element.textContent;
        
        // 自动修复常见的 gitGraph 语法错误
        const trimmedCode = code.trim();
        if (trimmedCode.toLowerCase().startsWith('gitgraph')) {
            // 修复 gitgraph: 或 gitgraph 为 gitGraph（注意大小写）
            code = code.replace(/^gitgraph:/gim, 'gitGraph');
            code = code.replace(/^gitgraph(\s|$)/gim, 'gitGraph\n');
            
            // 如果是一行代码（没有换行），尝试格式化
            if (!code.includes('\n') || code.split('\n').length < 3) {
                // 在一行代码中，在关键字前添加换行和缩进
                code = code
                    .replace(/\s+commit\s+/g, '\n    commit ')
                    .replace(/\s+branch\s+/g, '\n    branch ')
                    .replace(/\s+checkout\s+/g, '\n    checkout ')
                    .replace(/\s+merge\s+/g, '\n    merge ');
                // 确保 gitGraph 后面有换行
                code = code.replace(/^gitGraph\s*/, 'gitGraph\n');
            }
            
            console.log('🔧 已自动修复 gitGraph 语法');
        }
        
        try {
            // 生成唯一 ID
            const id = `mermaid-${Date.now()}-${i}`;
            
            // 渲染图表
            const { svg } = await mermaid.render(id, code);
            
            // 创建容器包装 SVG 和导出按钮
            const wrapper = document.createElement('div');
            wrapper.className = 'mermaid-wrapper';
            wrapper.innerHTML = `
                <div class="mermaid-content">${svg}</div>
                <div class="mermaid-export-toolbar">
                    <button class="mermaid-export-btn" data-format="svg" title="导出为 SVG 矢量图（推荐）">
                        <svg class="icon"><use href="#icon-download"></use></svg>
                        <span class="text">SVG</span>
                    </button>
                    <button class="mermaid-export-btn" data-format="png" title="导出为 PNG 图片（高清 2x）&#10;如无反应请重试或使用 SVG">
                        <svg class="icon"><use href="#icon-image-download"></use></svg>
                        <span class="text">PNG</span>
                    </button>
                    <button class="mermaid-export-btn" data-action="fullscreen" title="全屏查看（支持缩放和拖拽）">
                        <svg class="icon"><use href="#icon-fullscreen"></use></svg>
                        <span class="text">全屏</span>
                    </button>
                </div>
            `;
            
            // 替换元素内容
            element.innerHTML = '';
            element.appendChild(wrapper);
            
            // 绑定导出事件
            bindMermaidExportEvents(wrapper, id);
            
        } catch (error) {
            console.error('Mermaid 渲染错误:', error);
            element.innerHTML = `
                <div class="mermaid-error">
                    <div class="mermaid-error-title">Mermaid 图表渲染失败</div>
                    <div>${escapeHtml(error.message)}</div>
                    <pre><code>${escapeHtml(code)}</code></pre>
                </div>
            `;
        }
    }
}

/**
 * 绑定 Mermaid 图表导出事件
 */
function bindMermaidExportEvents(wrapper, diagramId) {
    const exportButtons = wrapper.querySelectorAll('.mermaid-export-btn');
    
    exportButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // 防止重复点击
            if (btn.disabled) {
                console.log('按钮已禁用，忽略点击');
                return;
            }
            
            const action = btn.getAttribute('data-action');
            const format = btn.getAttribute('data-format');
            const svgElement = wrapper.querySelector('svg');
            
            if (!svgElement) {
                console.error('找不到 SVG 元素');
                setStatus('操作失败：找不到图表 ❌', 3000);
                return;
            }
            
            // 处理全屏按钮
            if (action === 'fullscreen') {
                openMermaidFullscreenViewer(svgElement, diagramId, wrapper);
                return;
            }
            
            // 禁用按钮，防止重复点击
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
            
            // 延迟后恢复按钮状态
            const enableButton = () => {
                setTimeout(() => {
                    btn.disabled = false;
                    btn.style.opacity = '';
                    btn.style.cursor = '';
                }, 1000);
            };
            
            if (format === 'svg') {
                exportMermaidAsSVG(svgElement, diagramId);
                enableButton();
            } else if (format === 'png') {
                exportMermaidAsPNG(svgElement, diagramId);
                enableButton();
            }
        });
    });
}

/**
 * 导出 Mermaid 图表为 SVG
 */
function exportMermaidAsSVG(svgElement, diagramId) {
    try {
        setStatus('正在导出 SVG...');
        
        // 克隆 SVG 元素
        const svgClone = svgElement.cloneNode(true);
        
        // 获取 SVG 字符串
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgClone);
        
        // 添加 XML 声明和样式
        const fullSvg = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
${svgString}`;
        
        // 创建 Blob 并下载
        const blob = new Blob([fullSvg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${diagramId}.svg`;
        a.click();
        URL.revokeObjectURL(url);
        
        setStatus('SVG 导出成功 ✅');
    } catch (error) {
        console.error('SVG 导出失败:', error);
        setStatus('SVG 导出失败 ❌', 3000);
    }
}

/**
 * 导出 Mermaid 图表为 PNG
 */
function exportMermaidAsPNG(svgElement, diagramId) {
    try {
        setStatus('正在导出 PNG...');
        console.log('开始导出 PNG:', diagramId);
        
        // 获取 SVG 尺寸
        const bbox = svgElement.getBoundingClientRect();
        const width = Math.floor(bbox.width);
        const height = Math.floor(bbox.height);
        
        console.log('SVG 尺寸:', width, 'x', height);
        
        // 检查尺寸是否有效
        if (width <= 0 || height <= 0) {
            throw new Error('SVG 尺寸无效');
        }
        
        // 创建 canvas
        const canvas = document.createElement('canvas');
        const scale = 2; // 提高清晰度
        canvas.width = width * scale;
        canvas.height = height * scale;
        const ctx = canvas.getContext('2d');
        ctx.scale(scale, scale);
        
        // 根据当前主题设置背景色
        const bgColor = AppState.currentTheme === 'dark' ? '#0d1117' : '#ffffff';
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
        
        // 将 SVG 转换为图片
        const svgClone = svgElement.cloneNode(true);
        
        // 确保 SVG 有正确的命名空间
        if (!svgClone.getAttribute('xmlns')) {
            svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        }
        
        const serializer = new XMLSerializer();
        let svgString = serializer.serializeToString(svgClone);
        
        // 编码 SVG 为 data URL（更可靠）
        const svgBase64 = btoa(unescape(encodeURIComponent(svgString)));
        const dataUrl = `data:image/svg+xml;base64,${svgBase64}`;
        
        const img = new Image();
        
        // 设置超时（10秒）
        const timeout = setTimeout(() => {
            console.error('PNG 导出超时');
            setStatus('PNG 导出超时 ⏱️ 请重试或使用 SVG 格式', 5000);
            alert('PNG 导出超时\n\n可能原因：\n1. 图表太大或太复杂\n2. 浏览器性能限制\n\n建议：\n• 再次点击重试\n• 或使用 SVG 格式导出');
        }, 10000);
        
        img.onload = () => {
            clearTimeout(timeout);
            console.log('图片加载成功');
            
            try {
                ctx.drawImage(img, 0, 0, width, height);
                
                // 导出为 PNG
                canvas.toBlob((blob) => {
                    if (!blob) {
                        console.error('Canvas toBlob 失败');
                        setStatus('PNG 转换失败 ❌', 3000);
                        return;
                    }
                    
                    console.log('PNG Blob 创建成功，大小:', blob.size);
                    
                    const pngUrl = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = pngUrl;
                    a.download = `${diagramId}.png`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    
                    // 延迟释放 URL
                    setTimeout(() => {
                        URL.revokeObjectURL(pngUrl);
                    }, 100);
                    
                    setStatus('PNG 导出成功 ✅');
                    console.log('PNG 导出完成');
                }, 'image/png');
            } catch (err) {
                clearTimeout(timeout);
                console.error('绘制或导出失败:', err);
                setStatus('PNG 导出失败 ❌', 3000);
            }
        };
        
        img.onerror = (err) => {
            clearTimeout(timeout);
            console.error('图片加载失败:', err);
            setStatus('PNG 导出失败 ❌ 建议使用 SVG 格式', 5000);
            
            // 提示用户
            if (confirm('PNG 导出失败\n\n建议改用 SVG 格式导出（矢量图，质量更好）\n\n是否立即导出为 SVG？')) {
                exportMermaidAsSVG(svgElement, diagramId);
            }
        };
        
        // 设置图片源
        img.src = dataUrl;
        
    } catch (error) {
        console.error('PNG 导出异常:', error);
        setStatus(`PNG 导出失败 ❌`, 5000);
        
        // 显示详细错误信息
        alert(`PNG 导出失败\n\n错误信息：${error.message}\n\n可能的解决方案：\n1. 刷新页面后重试\n2. 使用 SVG 格式导出\n3. 尝试缩小图表大小\n4. 使用其他浏览器\n\n如果问题持续，请打开浏览器控制台（F12）查看详细日志。`);
    }
}

/**
 * 打开 Mermaid 全屏查看器（支持缩放和拖拽）
 */
function openMermaidFullscreenViewer(svgElement, diagramId, originalWrapper) {
    // 获取当前主题
    const currentTheme = document.body.getAttribute('data-theme') || 'light';
    
    // 获取 SVG 的实际尺寸（使用多种方法确保准确性）
    let svgWidth, svgHeight;
    
    // 方法1: 从 getBoundingClientRect 获取（最准确，反映实际渲染尺寸）
    const rect = svgElement.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
        svgWidth = rect.width;
        svgHeight = rect.height;
    }
    
    // 方法2: 从 getBBox 获取（SVG 内部尺寸）
    if ((!svgWidth || svgWidth === 0) && svgElement.getBBox) {
        try {
            const bbox = svgElement.getBBox();
            if (bbox.width > 0 && bbox.height > 0) {
                svgWidth = bbox.width;
                svgHeight = bbox.height;
            }
        } catch (e) {
            // getBBox 可能失败，继续尝试其他方法
        }
    }
    
    // 方法3: 从 viewBox 获取
    if (!svgWidth || svgWidth === 0) {
        const viewBox = svgElement.getAttribute('viewBox');
        if (viewBox) {
            const vb = viewBox.split(/\s+|,/).filter(v => v);
            if (vb.length >= 4) {
                svgWidth = parseFloat(vb[2]);
                svgHeight = parseFloat(vb[3]);
            }
        }
    }
    
    // 方法4: 从 width/height 属性获取
    if (!svgWidth || svgWidth === 0) {
        const widthAttr = svgElement.getAttribute('width');
        const heightAttr = svgElement.getAttribute('height');
        if (widthAttr && heightAttr) {
            svgWidth = parseFloat(widthAttr);
            svgHeight = parseFloat(heightAttr);
        }
    }
    
    // 如果还是没有尺寸，使用默认值
    if (!svgWidth || svgWidth === 0) {
        svgWidth = 800;
        svgHeight = 600;
        console.warn('无法获取 SVG 尺寸，使用默认值', {
            rect: rect,
            viewBox: svgElement.getAttribute('viewBox'),
            width: svgElement.getAttribute('width'),
            height: svgElement.getAttribute('height')
        });
    }
    
    console.log('获取到的 SVG 尺寸:', { svgWidth, svgHeight });
    
    // 创建全屏容器
    const viewer = document.createElement('div');
    viewer.className = 'mermaid-fullscreen-viewer';
    viewer.setAttribute('data-theme', currentTheme);
    viewer.id = `mermaid-viewer-${diagramId}`;
    
    // 创建查看器内容
    viewer.innerHTML = `
        <div class="mermaid-viewer-header">
            <div class="mermaid-viewer-title">Mermaid 图表查看器</div>
            <div class="mermaid-viewer-controls">
                <button class="mermaid-viewer-btn" data-action="zoom-in" title="放大 (滚轮向上)">
                    <svg class="icon"><use href="#icon-zoom-in"></use></svg>
                </button>
                <button class="mermaid-viewer-btn" data-action="zoom-out" title="缩小 (滚轮向下)">
                    <svg class="icon"><use href="#icon-zoom-out"></use></svg>
                </button>
                <button class="mermaid-viewer-btn" data-action="reset" title="重置视图">
                    <svg class="icon"><use href="#icon-reset-alt"></use></svg>
                </button>
                <button class="mermaid-viewer-btn" data-action="close" title="关闭 (ESC)">
                    <svg class="icon"><use href="#icon-close"></use></svg>
                </button>
            </div>
        </div>
        <div class="mermaid-viewer-content">
            <div class="mermaid-viewer-svg-container">
                <div class="mermaid-viewer-svg-wrapper"></div>
            </div>
        </div>
        <div class="mermaid-viewer-footer">
            <span class="mermaid-viewer-hint">鼠标滚轮：缩放 | 鼠标拖拽：平移 | ESC：关闭</span>
        </div>
    `;
    
    // 添加到 body
    document.body.appendChild(viewer);
    document.body.classList.add('mermaid-viewer-active');
    
    // 克隆 SVG 而不是移动它（避免恢复问题）
    const svgClone = svgElement.cloneNode(true);
    
    // 确保克隆的 SVG 有正确的尺寸属性
    if (!svgClone.getAttribute('width') || svgClone.getAttribute('width') === '0') {
        svgClone.setAttribute('width', svgWidth);
    }
    if (!svgClone.getAttribute('height') || svgClone.getAttribute('height') === '0') {
        svgClone.setAttribute('height', svgHeight);
    }
    
    // 获取包装器并添加克隆的 SVG
    const wrapper = viewer.querySelector('.mermaid-viewer-svg-wrapper');
    wrapper.appendChild(svgClone);
    
    // 保存信息到 viewer
    viewer._svgWidth = svgWidth;
    viewer._svgHeight = svgHeight;
    
    // 确保 SVG 立即可见
    svgElement.style.display = 'block';
    svgElement.style.visibility = 'visible';
    svgElement.style.maxWidth = 'none';
    svgElement.style.maxHeight = 'none';
    
    // 如果 SVG 没有明确的尺寸属性，立即设置
    if (!svgElement.getAttribute('width') || svgElement.getAttribute('width') === '0') {
        svgElement.setAttribute('width', svgWidth);
    }
    if (!svgElement.getAttribute('height') || svgElement.getAttribute('height') === '0') {
        svgElement.setAttribute('height', svgHeight);
    }
    
    // 等待 DOM 渲染完成后再初始化
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            setTimeout(() => {
                // 再次验证尺寸
                if (!viewer._svgWidth || viewer._svgWidth === 0) {
                    const newRect = svgElement.getBoundingClientRect();
                    if (newRect.width > 0 && newRect.height > 0) {
                        viewer._svgWidth = newRect.width;
                        viewer._svgHeight = newRect.height;
                        console.log('重新获取 SVG 尺寸:', { width: viewer._svgWidth, height: viewer._svgHeight });
                    }
                }
                initMermaidViewer(viewer, svgClone);
            }, 100);
        });
    });
    
    setStatus('已打开全屏查看器');
}

/**
 * 初始化 Mermaid 查看器（缩放和拖拽功能）
 */
function initMermaidViewer(viewer, svgElement) {
    const container = viewer.querySelector('.mermaid-viewer-svg-container');
    const wrapper = viewer.querySelector('.mermaid-viewer-svg-wrapper');
    const svg = svgElement;
    
    if (!container || !wrapper || !svg) {
        console.error('查看器初始化失败：找不到容器或 SVG', { container, wrapper, svg });
        return;
    }
    
    // 获取 SVG 尺寸（优先使用保存的尺寸）
    let svgWidth = viewer._svgWidth;
    let svgHeight = viewer._svgHeight;
    
    // 如果保存的尺寸无效，尝试从当前 SVG 获取
    if (!svgWidth || svgWidth === 0) {
        // 方法1: 从 getBBox 获取
        if (svg.getBBox) {
            try {
                const bbox = svg.getBBox();
                if (bbox.width > 0 && bbox.height > 0) {
                    svgWidth = bbox.width;
                    svgHeight = bbox.height;
                }
            } catch (e) {
                console.warn('无法从 getBBox 获取尺寸', e);
            }
        }
        
        // 方法2: 从 viewBox 获取
        if (!svgWidth || svgWidth === 0) {
            const viewBox = svg.getAttribute('viewBox');
            if (viewBox) {
                const vb = viewBox.split(/\s+|,/).filter(v => v);
                if (vb.length >= 4) {
                    svgWidth = parseFloat(vb[2]);
                    svgHeight = parseFloat(vb[3]);
                }
            }
        }
        
        // 方法3: 从属性获取
        if (!svgWidth || svgWidth === 0) {
            const widthAttr = svg.getAttribute('width');
            const heightAttr = svg.getAttribute('height');
            if (widthAttr && heightAttr) {
                svgWidth = parseFloat(widthAttr);
                svgHeight = parseFloat(heightAttr);
            }
        }
        
        // 方法4: 从 getBoundingClientRect 获取
        if (!svgWidth || svgWidth === 0) {
            const rect = svg.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                svgWidth = rect.width;
                svgHeight = rect.height;
            }
        }
        
        // 如果还是没有尺寸，使用默认值
        if (!svgWidth || svgWidth === 0) {
            svgWidth = 800;
            svgHeight = 600;
            console.warn('无法获取 SVG 尺寸，使用默认值');
        }
    }
    
    // 确保 SVG 有明确的尺寸属性
    if (!svg.getAttribute('width') || svg.getAttribute('width') === '0') {
        svg.setAttribute('width', svgWidth);
    }
    if (!svg.getAttribute('height') || svg.getAttribute('height') === '0') {
        svg.setAttribute('height', svgHeight);
    }
    
    // 确保 SVG 可见且有尺寸
    svg.style.display = 'block';
    svg.style.visibility = 'visible';
    svg.style.maxWidth = 'none';
    svg.style.maxHeight = 'none';
    
    // 查看器状态
    const state = {
        scale: 1,
        translateX: 0,
        translateY: 0,
        isDragging: false,
        startX: 0,
        startY: 0,
        startTranslateX: 0,
        startTranslateY: 0,
        minScale: 0.1,
        maxScale: 5,
        svgWidth: svgWidth,
        svgHeight: svgHeight
    };
    
    // 更新 SVG 包装器的变换
    function updateTransform() {
        wrapper.style.transform = `translate(${state.translateX}px, ${state.translateY}px) scale(${state.scale})`;
        wrapper.style.transformOrigin = '0 0';
    }
    
    // 居中显示函数
    function centerView() {
        const containerRect = container.getBoundingClientRect();
        const actualWidth = state.svgWidth * state.scale;
        const actualHeight = state.svgHeight * state.scale;
        
        state.translateX = (containerRect.width - actualWidth) / 2;
        state.translateY = (containerRect.height - actualHeight) / 2;
        updateTransform();
    }
    
    // 重置视图并居中
    function resetView() {
        state.scale = 1;
        centerView();
        
        // 延迟再次居中，确保 SVG 完全渲染
        setTimeout(() => {
            centerView();
        }, 50);
    }
    
    // 缩放
    function zoom(delta, clientX, clientY) {
        const rect = container.getBoundingClientRect();
        
        // 计算鼠标相对于容器的位置
        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;
        
        // 计算鼠标相对于当前 SVG 的位置（考虑当前的变换）
        const svgX = (mouseX - state.translateX) / state.scale;
        const svgY = (mouseY - state.translateY) / state.scale;
        
        const oldScale = state.scale;
        const newScale = Math.max(state.minScale, Math.min(state.maxScale, state.scale + delta));
        
        if (newScale === oldScale) return;
        
        // 以鼠标位置为中心缩放
        state.translateX = mouseX - svgX * newScale;
        state.translateY = mouseY - svgY * newScale;
        state.scale = newScale;
        
        updateTransform();
    }
    
    // 鼠标滚轮缩放
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const delta = -e.deltaY * 0.01;
        zoom(delta, e.clientX, e.clientY);
    }, { passive: false });
    
    // 也监听 viewer-content 的滚轮事件
    const content = viewer.querySelector('.mermaid-viewer-content');
    if (content) {
        content.addEventListener('wheel', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const delta = -e.deltaY * 0.01;
            zoom(delta, e.clientX, e.clientY);
        }, { passive: false });
    }
    
    // 鼠标拖拽
    const handleMouseDown = (e) => {
        if (e.button !== 0) return; // 只处理左键
        // 如果点击的是按钮，不触发拖拽
        if (e.target.closest('.mermaid-viewer-btn')) return;
        
        state.isDragging = true;
        state.startX = e.clientX;
        state.startY = e.clientY;
        state.startTranslateX = state.translateX;
        state.startTranslateY = state.translateY;
        container.style.cursor = 'grabbing';
        wrapper.style.cursor = 'grabbing';
        e.preventDefault();
    };
    
    const handleMouseMove = (e) => {
        if (!state.isDragging) return;
        state.translateX = state.startTranslateX + (e.clientX - state.startX);
        state.translateY = state.startTranslateY + (e.clientY - state.startY);
        updateTransform();
    };
    
    const handleMouseUp = () => {
        if (state.isDragging) {
            state.isDragging = false;
            container.style.cursor = 'grab';
            wrapper.style.cursor = 'grab';
        }
    };
    
    container.addEventListener('mousedown', handleMouseDown);
    wrapper.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // 按钮事件
    const zoomInBtn = viewer.querySelector('[data-action="zoom-in"]');
    const zoomOutBtn = viewer.querySelector('[data-action="zoom-out"]');
    const resetBtn = viewer.querySelector('[data-action="reset"]');
    const closeBtn = viewer.querySelector('[data-action="close"]');
    
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            const rect = container.getBoundingClientRect();
            zoom(0.1, rect.left + rect.width / 2, rect.top + rect.height / 2);
        });
    }
    
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            const rect = container.getBoundingClientRect();
            zoom(-0.1, rect.left + rect.width / 2, rect.top + rect.height / 2);
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetView);
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeMermaidViewer(viewer);
        });
    }
    
    // ESC 键关闭
    const handleEsc = (e) => {
        if (e.key === 'Escape' && document.body.contains(viewer)) {
            closeMermaidViewer(viewer);
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
    
    // 保存状态和事件处理器
    viewer._viewerState = state;
    viewer._viewerEscHandler = handleEsc;
    
    // 初始化样式
    container.style.cursor = 'grab';
    wrapper.style.cursor = 'grab';
    wrapper.style.display = 'inline-block';
    wrapper.style.willChange = 'transform';
    
    // 初始居中显示
    centerView();
    
    // 延迟再次居中，确保 SVG 完全渲染
    setTimeout(centerView, 100);
    setTimeout(centerView, 300);
    
    updateTransform();
}

/**
 * 关闭 Mermaid 查看器
 */
function closeMermaidViewer(viewer) {
    // 清理事件监听器
    if (viewer._viewerEscHandler) {
        document.removeEventListener('keydown', viewer._viewerEscHandler);
    }
    
    // 移除查看器
    if (document.body.contains(viewer)) {
        document.body.removeChild(viewer);
    }
    document.body.classList.remove('mermaid-viewer-active');
    
    setStatus('已关闭全屏查看器');
}
