/**
 * Mermaid 渲染和导出模块
 */

import { mermaid, initMermaid } from '../config/mermaid.js';
import { elements } from '../core/elements.js';
import { AppState } from '../core/state.js';
import { escapeHtml } from '../core/utils.js';
import { setStatus } from '../core/ui-utils.js';
import { t } from '../core/i18n.js';

/**
 * 等待 Mermaid 加载完成
 */
async function waitForMermaid(maxRetries = 10, delay = 100) {
    for (let i = 0; i < maxRetries; i++) {
        if (mermaid && typeof mermaid.initialize === 'function' && typeof mermaid.render === 'function') {
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    return false;
}

/**
 * 等待容器有有效尺寸（移动端可能需要更多时间）
 */
async function waitForContainerSize(container, maxRetries = 20, delay = 100) {
    const isMobile = window.innerWidth <= 768;
    const maxWait = isMobile ? maxRetries * 2 : maxRetries; // 移动端等待更长时间
    
    for (let i = 0; i < maxWait; i++) {
        const rect = container.getBoundingClientRect();
        // 检查容器是否有有效尺寸（宽度和高度都大于0）
        if (rect.width > 0 && rect.height > 0) {
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    // 即使超时也返回 true，让 Mermaid 尝试渲染（可能容器是隐藏的）
    console.warn('容器尺寸检测超时，但继续尝试渲染 Mermaid');
    return true;
}

/**
 * 渲染所有 Mermaid 图表
 */
export async function renderMermaidCharts() {
    const mermaidElements = elements.preview.querySelectorAll('.mermaid');
    
    if (mermaidElements.length === 0) return;
    
    // 移动端：等待容器有有效尺寸（首次加载时可能需要更多时间）
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        await waitForContainerSize(elements.preview);
        // 额外等待，确保移动端布局完全稳定
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // 等待 Mermaid 加载完成（版本更新后可能需要等待）
    const mermaidReady = await waitForMermaid();
    if (!mermaidReady) {
        console.error('Mermaid 未正确加载，等待超时');
        mermaidElements.forEach(element => {
            element.innerHTML = `
                <div class="mermaid-error">
                    <div class="mermaid-error-title">${t('messages.mermaidRenderFailed')}</div>
                    <div>Mermaid 库未正确加载，请刷新页面重试</div>
                </div>
            `;
        });
        return;
    }
    
    // 重新初始化 Mermaid（以应用主题）
    try {
        initMermaid();
    } catch (error) {
        console.error('Mermaid 初始化失败:', error);
        mermaidElements.forEach(element => {
            element.innerHTML = `
                <div class="mermaid-error">
                    <div class="mermaid-error-title">${t('messages.mermaidRenderFailed')}</div>
                    <div>${escapeHtml(error.message)}</div>
                </div>
            `;
        });
        return;
    }
    
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
        }
        
        // 移动端首次加载时，使用重试机制
        const isMobile = window.innerWidth <= 768;
        const maxRetries = isMobile ? 2 : 1;
        let renderSuccess = false;
        let lastError = null;
        
        for (let retry = 0; retry < maxRetries && !renderSuccess; retry++) {
            try {
                if (retry > 0) {
                    // 重试前等待更长时间
                    await new Promise(resolve => setTimeout(resolve, 300));
                    // 重新检查容器尺寸
                    await waitForContainerSize(elements.preview, 10, 50);
                }
                
                await renderSingleMermaidChart(element, code, i);
                renderSuccess = true;
            } catch (error) {
                lastError = error;
                console.warn(`Mermaid 渲染失败 (尝试 ${retry + 1}/${maxRetries}):`, error);
                if (retry < maxRetries - 1) {
                    // 不是最后一次重试，继续
                    continue;
                }
            }
        }
        
        // 如果所有重试都失败，显示错误
        if (!renderSuccess && lastError) {
            element.innerHTML = `
                <div class="mermaid-error">
                    <div class="mermaid-error-title">${t('messages.mermaidRenderFailed')}</div>
                    <div>${escapeHtml(lastError.message)}</div>
                    <pre><code>${escapeHtml(code)}</code></pre>
                </div>
            `;
        }
    }
}

/**
 * 渲染单个 Mermaid 图表
 */
async function renderSingleMermaidChart(element, code, index) {
    try {
            // 确保代码不为空
            if (!code || !code.trim()) {
                throw new Error('Mermaid 代码为空');
            }
            
            // 生成唯一 ID（使用更可靠的 ID 生成方式）
            const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}`;
            
            // 确保 Mermaid render 方法可用
            if (!mermaid.render || typeof mermaid.render !== 'function') {
                throw new Error('Mermaid render 方法不可用');
            }
            
            // 移动端：确保元素可见且有尺寸
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
                // 确保元素可见
                element.style.visibility = 'visible';
                element.style.display = 'block';
                
                // 等待元素有有效尺寸
                await waitForContainerSize(element, 10, 50);
                
                // 如果元素仍然没有尺寸，设置最小尺寸
                const rect = element.getBoundingClientRect();
                if (rect.width === 0 || rect.height === 0) {
                    element.style.minWidth = '100%';
                    element.style.minHeight = '200px';
                    // 再次等待
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }
            
            // 渲染图表（添加超时保护）
            const renderPromise = mermaid.render(id, code);
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Mermaid 渲染超时')), 30000)
            );
            
            const { svg } = await Promise.race([renderPromise, timeoutPromise]);
            
            // 创建容器包装 SVG 和导出按钮
            const wrapper = document.createElement('div');
            wrapper.className = 'mermaid-wrapper';
            wrapper.innerHTML = `
                <div class="mermaid-content">${svg}</div>
                <div class="mermaid-export-toolbar">
                    <button class="mermaid-export-btn" data-format="svg" title="${t('messages.exportSvgTooltip')}">
                        <svg class="icon"><use href="#icon-download"></use></svg>
                    </button>
                    <button class="mermaid-export-btn" data-format="png" title="${t('messages.exportPngTooltip')}">
                        <svg class="icon"><use href="#icon-image-download"></use></svg>
                    </button>
                    <button class="mermaid-export-btn" data-action="fullscreen" title="${t('messages.fullscreenViewTooltip')}">
                        <svg class="icon"><use href="#icon-fullscreen"></use></svg>
                    </button>
                </div>
            `;
            
            // 替换元素内容
            element.innerHTML = '';
            element.appendChild(wrapper);
            
            // 绑定导出事件
            bindMermaidExportEvents(wrapper, id);
            
        } catch (error) {
            // 重新抛出错误，让调用者处理重试逻辑
            throw error;
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
                return;
            }
            
            const action = btn.getAttribute('data-action');
            const format = btn.getAttribute('data-format');
            const svgElement = wrapper.querySelector('svg');
            
            if (!svgElement) {
                console.error('找不到 SVG 元素');
                setStatus(t('messages.chartNotFound'), 3000);
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
        setStatus(t('messages.exportingSvg'));
        
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
        
        setStatus(t('messages.svgExportSuccess'));
    } catch (error) {
        console.error('SVG 导出失败:', error);
        setStatus(t('messages.svgExportFailed'), 3000);
    }
}

/**
 * 导出 Mermaid 图表为 PNG
 */
function exportMermaidAsPNG(svgElement, diagramId) {
    try {
        setStatus(t('messages.exportingPng'));
        
        // 获取 SVG 尺寸
        const bbox = svgElement.getBoundingClientRect();
        const width = Math.floor(bbox.width);
        const height = Math.floor(bbox.height);
        
        
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
            setStatus(t('messages.pngExportTimeout'), 5000);
            alert(t('messages.pngExportTimeoutDetails'));
        }, 10000);
        
        img.onload = () => {
            clearTimeout(timeout);
            
            try {
                ctx.drawImage(img, 0, 0, width, height);
                
                // 导出为 PNG
                canvas.toBlob((blob) => {
                    if (!blob) {
                        console.error('Canvas toBlob 失败');
                        setStatus(t('messages.pngConvertFailed'), 3000);
                        return;
                    }
                    
                    
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
                    
                    setStatus(t('messages.pngExportSuccess'));
                }, 'image/png');
            } catch (err) {
                clearTimeout(timeout);
                console.error('绘制或导出失败:', err);
                setStatus(t('messages.pngExportFailed'), 3000);
            }
        };
        
        img.onerror = (err) => {
            clearTimeout(timeout);
            console.error('图片加载失败:', err);
            setStatus(t('messages.pngExportFailedSuggestSvg'), 5000);
            
            // 提示用户
            if (confirm(t('messages.pngExportFailedConfirm'))) {
                exportMermaidAsSVG(svgElement, diagramId);
            }
        };
        
        // 设置图片源
        img.src = dataUrl;
        
    } catch (error) {
        console.error('PNG 导出异常:', error);
        setStatus(t('messages.pngExportFailed'), 5000);
        
        // 显示详细错误信息
        alert(t('messages.pngExportFailedDetails', { message: error.message }));
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
    
    
    // 创建全屏容器
    const viewer = document.createElement('div');
    viewer.className = 'mermaid-fullscreen-viewer';
    viewer.setAttribute('data-theme', currentTheme);
    viewer.id = `mermaid-viewer-${diagramId}`;
    
    // 创建查看器内容
    viewer.innerHTML = `
        <div class="mermaid-viewer-header">
            <div class="mermaid-viewer-title">${t('messages.mermaidViewerTitle')}</div>
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
                    }
                }
                initMermaidViewer(viewer, svgClone);
            }, 100);
        });
    });
    
    setStatus(t('messages.fullscreenOpened'));
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
    
    setStatus(t('messages.fullscreenClosed'));
}
