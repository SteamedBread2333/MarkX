/**
 * ECharts 渲染和导出模块
 */

import { elements } from '../core/elements.js';
import { AppState } from '../core/state.js';
import { escapeHtml } from '../core/utils.js';
import { setStatus } from '../core/ui-utils.js';
import { t } from '../core/i18n.js';

/**
 * 等待 ECharts 加载完成
 */
async function waitForECharts(maxRetries = 10, delay = 100) {
    for (let i = 0; i < maxRetries; i++) {
        if (window.echarts && typeof window.echarts.init === 'function') {
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    return false;
}

/**
 * 等待容器有有效尺寸
 */
async function waitForContainerSize(container, maxRetries = 20, delay = 100) {
    const isMobile = window.innerWidth <= 768;
    const maxWait = isMobile ? maxRetries * 2 : maxRetries;
    
    for (let i = 0; i < maxWait; i++) {
        const rect = container.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    console.warn('容器尺寸检测超时，但继续尝试渲染 ECharts');
    return true;
}

/**
 * 渲染所有 ECharts 图表
 */
export async function renderEChartsCharts() {
    const echartsElements = elements.preview.querySelectorAll('.echarts');
    
    if (echartsElements.length === 0) return;
    
    // 等待 ECharts 加载完成
    const echartsReady = await waitForECharts();
    if (!echartsReady) {
        console.error('ECharts 未正确加载，等待超时');
        echartsElements.forEach(element => {
            element.innerHTML = `
                <div class="echarts-error">
                    <div class="echarts-error-title">${t('messages.echartsRenderFailed')}</div>
                    <div>ECharts 库未正确加载，请刷新页面重试</div>
                </div>
            `;
        });
        return;
    }
    
    // 移动端：等待容器有有效尺寸
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        await waitForContainerSize(elements.preview);
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // 渲染每个图表
    for (let i = 0; i < echartsElements.length; i++) {
        const element = echartsElements[i];
        const code = element.getAttribute('data-echarts-code');
        
        if (!code || !code.trim()) {
            element.innerHTML = `
                <div class="echarts-error">
                    <div class="echarts-error-title">${t('messages.echartsRenderFailed')}</div>
                    <div>ECharts 配置代码为空</div>
                </div>
            `;
            continue;
        }
        
        // 移动端首次加载时，使用重试机制
        const maxRetries = isMobile ? 2 : 1;
        let renderSuccess = false;
        let lastError = null;
        
        for (let retry = 0; retry < maxRetries && !renderSuccess; retry++) {
            try {
                if (retry > 0) {
                    await new Promise(resolve => setTimeout(resolve, 300));
                    await waitForContainerSize(elements.preview, 10, 50);
                }
                
                await renderSingleEChartsChart(element, code, i);
                renderSuccess = true;
            } catch (error) {
                lastError = error;
                console.warn(`ECharts 渲染失败 (尝试 ${retry + 1}/${maxRetries}):`, error);
                if (retry < maxRetries - 1) {
                    continue;
                }
            }
        }
        
        // 如果所有重试都失败，显示错误
        if (!renderSuccess && lastError) {
            element.innerHTML = `
                <div class="echarts-error">
                    <div class="echarts-error-title">${t('messages.echartsRenderFailed')}</div>
                    <div>${escapeHtml(lastError.message)}</div>
                    <pre><code>${escapeHtml(code)}</code></pre>
                </div>
            `;
        }
    }
}

/**
 * 渲染单个 ECharts 图表
 */
async function renderSingleEChartsChart(element, code, index) {
    try {
        // 确保代码不为空
        if (!code || !code.trim()) {
            throw new Error('ECharts 配置代码为空');
        }
        
        // 确保 ECharts 可用
        if (!window.echarts || typeof window.echarts.init !== 'function') {
            throw new Error('ECharts 库未正确加载');
        }
        
        // 移动端：确保元素可见且有尺寸
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            element.style.visibility = 'visible';
            element.style.display = 'block';
            
            await waitForContainerSize(element, 10, 50);
            
            const rect = element.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) {
                element.style.minWidth = '100%';
                element.style.minHeight = '400px';
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        
        // 创建图表容器 ID
        const chartId = `echarts-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${index}`;
        
        // 解析配置代码（支持 JSON 格式和 JavaScript 对象字面量）
        let option;
        let parseError = null;
        
        try {
            // 尝试作为 JSON 解析
            option = JSON.parse(code);
        } catch (e) {
            parseError = e;
            // 如果不是 JSON，尝试作为 JavaScript 代码执行
            try {
                // 使用 Function 构造函数安全地执行代码
                // 将代码包装在括号中，支持多行对象字面量
                const wrappedCode = code.trim().startsWith('{') ? '(' + code + ')' : code;
                const func = new Function('return ' + wrappedCode);
                option = func();
                
                // 验证返回的是对象
                if (typeof option !== 'object' || option === null) {
                    throw new Error('ECharts 配置必须是一个对象');
                }
            } catch (e2) {
                // 提供更详细的错误信息
                const jsonErrorMsg = parseError ? `JSON 解析失败: ${parseError.message}` : '';
                const jsErrorMsg = `JavaScript 执行失败: ${e2.message}`;
                const combinedError = jsonErrorMsg && jsErrorMsg ? `${jsonErrorMsg}; ${jsErrorMsg}` : (jsonErrorMsg || jsErrorMsg);
                throw new Error(`ECharts 配置代码格式错误：${combinedError}`);
            }
        }
        
        // 创建包装器
        const wrapper = document.createElement('div');
        wrapper.className = 'echarts-wrapper';
        wrapper.innerHTML = `
            <div class="echarts-content">
                <div id="${chartId}" style="width: 100%; height: 400px;"></div>
            </div>
            <div class="echarts-export-toolbar">
                <button class="echarts-export-btn" data-format="svg" title="${t('messages.exportSvgTooltip')}">
                    <svg class="icon"><use href="#icon-download"></use></svg>
                </button>
                <button class="echarts-export-btn" data-format="png" title="${t('messages.exportPngTooltip')}">
                    <svg class="icon"><use href="#icon-image-download"></use></svg>
                </button>
                <button class="echarts-export-btn" data-action="fullscreen" title="${t('messages.fullscreenViewTooltip')}">
                    <svg class="icon"><use href="#icon-fullscreen"></use></svg>
                </button>
            </div>
        `;
        
        // 替换元素内容
        element.innerHTML = '';
        element.appendChild(wrapper);
        
        // 等待容器渲染
        await new Promise(resolve => requestAnimationFrame(resolve));
        await new Promise(resolve => requestAnimationFrame(resolve));
        
        // 获取容器并初始化图表
        const chartContainer = wrapper.querySelector(`#${chartId}`);
        if (!chartContainer) {
            throw new Error('无法找到图表容器');
        }
        
        // 使用 SVG 渲染器，以便支持 SVG 导出
        const chart = window.echarts.init(
            chartContainer, 
            AppState.currentTheme === 'dark' ? 'dark' : null,
            { renderer: 'svg' }
        );
        chart.setOption(option);
        
        // 响应式调整
        const resizeHandler = () => {
            chart.resize();
        };
        window.addEventListener('resize', resizeHandler);
        
        // 保存 resize 处理器和图表实例到元素和 wrapper 上，以便后续清理和 PDF 导出
        element._resizeHandler = resizeHandler;
        element._chart = chart;
        wrapper._chart = chart; // 也保存到 wrapper 上，方便 PDF 导出时获取
        
        // 绑定导出事件
        bindEChartsExportEvents(wrapper, chart, chartId);
        
    } catch (error) {
        throw error;
    }
}

/**
 * 绑定 ECharts 图表导出事件
 */
function bindEChartsExportEvents(wrapper, chart, chartId) {
    const exportButtons = wrapper.querySelectorAll('.echarts-export-btn');
    
    exportButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // 防止重复点击
            if (btn.disabled) {
                return;
            }
            
            const action = btn.getAttribute('data-action');
            const format = btn.getAttribute('data-format');
            
            // 处理全屏按钮
            if (action === 'fullscreen') {
                openEChartsFullscreenViewer(chart, chartId, wrapper);
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
                exportEChartsAsSVG(chart, chartId);
                enableButton();
            } else if (format === 'png') {
                exportEChartsAsPNG(chart, chartId);
                enableButton();
            }
        });
    });
}

/**
 * 导出 ECharts 图表为 SVG
 */
function exportEChartsAsSVG(chart, chartId) {
    try {
        setStatus(t('messages.exportingSvg'));
        
        // 获取图表的 DOM 容器
        const chartDom = chart.getDom();
        if (!chartDom) {
            throw new Error('无法获取图表 DOM');
        }
        
        // 直接获取 SVG 元素（更可靠）
        const svgElement = chartDom.querySelector('svg');
        if (!svgElement) {
            // 如果没有 SVG，尝试使用 getDataURL（可能是 Canvas 渲染器）
            const dataURL = chart.getDataURL({
                type: 'svg',
                pixelRatio: 1,
                backgroundColor: AppState.currentTheme === 'dark' ? '#0d1117' : '#ffffff'
            });
            
            if (!dataURL || dataURL === 'data:,') {
                throw new Error('SVG 导出失败，数据为空');
            }
            
            // 解析 data URL
            let svgContent = '';
            if (dataURL.startsWith('data:image/svg+xml;base64,')) {
                const base64Content = dataURL.split(',')[1];
                try {
                    svgContent = decodeURIComponent(escape(atob(base64Content)));
                } catch (e) {
                    svgContent = atob(base64Content);
                }
            } else if (dataURL.startsWith('data:image/svg+xml;charset=utf-8,')) {
                svgContent = decodeURIComponent(dataURL.split(',')[1]);
            } else if (dataURL.startsWith('data:image/svg+xml,')) {
                svgContent = decodeURIComponent(dataURL.split(',')[1]);
            } else {
                throw new Error('不支持的 data URL 格式');
            }
            
            svgContent = svgContent.trim();
            if (!svgContent || (!svgContent.startsWith('<svg') && !svgContent.startsWith('<?xml'))) {
                throw new Error('SVG 内容格式无效');
            }
            
            // 处理 XML 声明和命名空间
            let finalSvgContent = '';
            if (svgContent.startsWith('<?xml')) {
                const xmlDeclEnd = svgContent.indexOf('?>');
                if (xmlDeclEnd !== -1) {
                    const afterDecl = svgContent.substring(xmlDeclEnd + 2).trim();
                    finalSvgContent = `${svgContent.substring(0, xmlDeclEnd + 2)}\n${afterDecl}`;
                } else {
                    finalSvgContent = svgContent;
                }
            } else {
                finalSvgContent = `<?xml version="1.0" encoding="UTF-8"?>\n${svgContent}`;
            }
            
            if (!finalSvgContent.includes('xmlns=')) {
                finalSvgContent = finalSvgContent.replace(/<svg(\s|>)/, '<svg xmlns="http://www.w3.org/2000/svg"$1');
            }
            
            // 创建 Blob 并下载
            const blob = new Blob([finalSvgContent], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${chartId}.svg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 100);
            
            setStatus(t('messages.svgExportSuccess'));
            return;
        }
        
        // 克隆 SVG 元素
        const svgClone = svgElement.cloneNode(true);
        
        // 确保 SVG 有正确的命名空间
        if (!svgClone.getAttribute('xmlns')) {
            svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        }
        
        // 获取 SVG 尺寸并确保有明确的尺寸属性
        const bbox = svgElement.getBoundingClientRect();
        if (bbox.width > 0 && bbox.height > 0) {
            if (!svgClone.getAttribute('width') || svgClone.getAttribute('width') === '0') {
                svgClone.setAttribute('width', Math.floor(bbox.width).toString());
            }
            if (!svgClone.getAttribute('height') || svgClone.getAttribute('height') === '0') {
                svgClone.setAttribute('height', Math.floor(bbox.height).toString());
            }
        }
        
        // 序列化 SVG 为字符串
        const serializer = new XMLSerializer();
        let svgString = serializer.serializeToString(svgClone);
        
        // 添加 XML 声明
        const finalSvg = `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n${svgString}`;
        
        // 创建 Blob 并下载
        const blob = new Blob([finalSvg], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${chartId}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // 延迟释放 URL
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 100);
        
        setStatus(t('messages.svgExportSuccess'));
    } catch (error) {
        console.error('SVG 导出失败:', error);
        setStatus(t('messages.svgExportFailed'), 3000);
    }
}

/**
 * 导出 ECharts 图表为 PNG
 */
function exportEChartsAsPNG(chart, chartId) {
    try {
        setStatus(t('messages.exportingPng'));
        
        // 获取图表的 DOM 容器
        const chartDom = chart.getDom();
        if (!chartDom) {
            throw new Error('无法获取图表 DOM');
        }
        
        // 获取 SVG 元素
        const svgElement = chartDom.querySelector('svg');
        if (!svgElement) {
            // 如果没有 SVG，尝试使用 getDataURL（可能是 Canvas 渲染器）
            const dataURL = chart.getDataURL({
                type: 'png',
                pixelRatio: 2,
                backgroundColor: AppState.currentTheme === 'dark' ? '#0d1117' : '#ffffff'
            });
            
            if (!dataURL || dataURL === 'data:,') {
                throw new Error('PNG 导出失败，数据为空');
            }
            
            // 直接下载 data URL
            const a = document.createElement('a');
            a.href = dataURL;
            a.download = `${chartId}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setStatus(t('messages.pngExportSuccess'));
            return;
        }
        
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
        const scale = 2; // 提高清晰度（2x 分辨率）
        canvas.width = width * scale;
        canvas.height = height * scale;
        const ctx = canvas.getContext('2d');
        ctx.scale(scale, scale);
        
        // 根据当前主题设置背景色
        const bgColor = AppState.currentTheme === 'dark' ? '#0d1117' : '#ffffff';
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
        
        // 克隆 SVG 元素
        const svgClone = svgElement.cloneNode(true);
        
        // 确保 SVG 有正确的命名空间
        if (!svgClone.getAttribute('xmlns')) {
            svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        }
        
        // 确保 SVG 有明确的尺寸属性
        if (!svgClone.getAttribute('width')) {
            svgClone.setAttribute('width', width.toString());
        }
        if (!svgClone.getAttribute('height')) {
            svgClone.setAttribute('height', height.toString());
        }
        
        // 序列化 SVG 为字符串
        const serializer = new XMLSerializer();
        let svgString = serializer.serializeToString(svgClone);
        
        // 编码 SVG 为 data URL
        const svgBase64 = btoa(unescape(encodeURIComponent(svgString)));
        const dataUrl = `data:image/svg+xml;base64,${svgBase64}`;
        
        const img = new Image();
        
        // 设置超时（10秒）
        const timeout = setTimeout(() => {
            console.error('PNG 导出超时');
            setStatus(t('messages.pngExportTimeout'), 5000);
        }, 10000);
        
        img.onload = () => {
            clearTimeout(timeout);
            
            try {
                // 将图片绘制到 canvas
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
                    a.download = `${chartId}.png`;
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
            
            // 提示用户使用 SVG 导出
            if (confirm(t('messages.pngExportFailedConfirm'))) {
                exportEChartsAsSVG(chart, chartId);
            }
        };
        
        // 设置图片源
        img.src = dataUrl;
        
    } catch (error) {
        console.error('PNG 导出异常:', error);
        setStatus(t('messages.pngExportFailed'), 3000);
    }
}

/**
 * 打开 ECharts 全屏查看器（支持缩放和拖拽）
 */
function openEChartsFullscreenViewer(chart, chartId, originalWrapper) {
    // 获取当前主题
    const currentTheme = document.body.getAttribute('data-theme') || 'light';
    
    // 获取图表的配置选项
    const option = chart.getOption();
    
    // 创建全屏容器
    const viewer = document.createElement('div');
    viewer.className = 'echarts-fullscreen-viewer';
    viewer.setAttribute('data-theme', currentTheme);
    viewer.id = `echarts-viewer-${chartId}`;
    
    // 创建查看器内容
    viewer.innerHTML = `
        <div class="echarts-viewer-header">
            <div class="echarts-viewer-title">${t('messages.echartsViewerTitle')}</div>
            <div class="echarts-viewer-controls">
                <button class="echarts-viewer-btn" data-action="zoom-in" title="放大 (滚轮向上)">
                    <svg class="icon"><use href="#icon-zoom-in"></use></svg>
                </button>
                <button class="echarts-viewer-btn" data-action="zoom-out" title="缩小 (滚轮向下)">
                    <svg class="icon"><use href="#icon-zoom-out"></use></svg>
                </button>
                <button class="echarts-viewer-btn" data-action="reset" title="重置视图">
                    <svg class="icon"><use href="#icon-reset-alt"></use></svg>
                </button>
                <button class="echarts-viewer-btn" data-action="close" title="关闭 (ESC)">
                    <svg class="icon"><use href="#icon-close"></use></svg>
                </button>
            </div>
        </div>
        <div class="echarts-viewer-content">
            <div class="echarts-viewer-chart-container">
                <div id="echarts-viewer-chart-${chartId}" style="width: 100%; height: 100%;"></div>
            </div>
        </div>
        <div class="echarts-viewer-footer">
            <span class="echarts-viewer-hint">鼠标滚轮：缩放 | 鼠标拖拽：平移 | ESC：关闭</span>
        </div>
    `;
    
    // 添加到 body
    document.body.appendChild(viewer);
    document.body.classList.add('echarts-viewer-active');
    
    // 等待 DOM 渲染完成后再初始化图表
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            setTimeout(() => {
                initEChartsViewer(viewer, option, chartId, currentTheme);
            }, 100);
        });
    });
    
    setStatus(t('messages.fullscreenOpened'));
}

/**
 * 初始化 ECharts 查看器（缩放和拖拽功能）
 */
function initEChartsViewer(viewer, option, chartId, theme) {
    const container = viewer.querySelector('.echarts-viewer-chart-container');
    const chartContainer = viewer.querySelector(`#echarts-viewer-chart-${chartId}`);
    
    if (!container || !chartContainer) {
        console.error('查看器初始化失败：找不到容器', { container, chartContainer });
        return;
    }
    
    // 初始化 ECharts 图表（使用 SVG 渲染器）
    const viewerChart = window.echarts.init(
        chartContainer, 
        theme === 'dark' ? 'dark' : null,
        { renderer: 'svg' }
    );
    viewerChart.setOption(option);
    
    // 响应式调整
    const resizeHandler = () => {
        viewerChart.resize();
    };
    window.addEventListener('resize', resizeHandler);
    
    // 保存图表实例和处理器
    viewer._chart = viewerChart;
    viewer._resizeHandler = resizeHandler;
    
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
        minScale: 0.5,
        maxScale: 3
    };
    
    // 更新容器的变换
    function updateTransform() {
        chartContainer.style.transform = `translate(${state.translateX}px, ${state.translateY}px) scale(${state.scale})`;
        chartContainer.style.transformOrigin = 'center center';
    }
    
    // 居中显示函数
    function centerView() {
        const containerRect = container.getBoundingClientRect();
        state.translateX = 0;
        state.translateY = 0;
        state.scale = 1;
        updateTransform();
        viewerChart.resize();
    }
    
    // 重置视图并居中
    function resetView() {
        centerView();
        setTimeout(() => {
            viewerChart.resize();
        }, 50);
    }
    
    // 缩放
    function zoom(delta, clientX, clientY) {
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const oldScale = state.scale;
        const newScale = Math.max(state.minScale, Math.min(state.maxScale, state.scale + delta));
        
        if (newScale === oldScale) return;
        
        // 以中心点缩放
        const scaleDelta = newScale / oldScale;
        state.translateX = (state.translateX - centerX + rect.width / 2) * scaleDelta + centerX - rect.width / 2;
        state.translateY = (state.translateY - centerY + rect.height / 2) * scaleDelta + centerY - rect.height / 2;
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
    
    // 鼠标拖拽
    const handleMouseDown = (e) => {
        if (e.button !== 0) return; // 只处理左键
        // 如果点击的是按钮，不触发拖拽
        if (e.target.closest('.echarts-viewer-btn')) return;
        
        state.isDragging = true;
        state.startX = e.clientX;
        state.startY = e.clientY;
        state.startTranslateX = state.translateX;
        state.startTranslateY = state.translateY;
        container.style.cursor = 'grabbing';
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
        }
    };
    
    container.addEventListener('mousedown', handleMouseDown);
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
            closeEChartsViewer(viewer);
        });
    }
    
    // ESC 键关闭
    const handleEsc = (e) => {
        if (e.key === 'Escape' && document.body.contains(viewer)) {
            closeEChartsViewer(viewer);
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
    
    // 保存状态和事件处理器
    viewer._viewerState = state;
    viewer._viewerEscHandler = handleEsc;
    
    // 初始化样式
    container.style.cursor = 'grab';
    chartContainer.style.willChange = 'transform';
    
    // 初始居中显示
    centerView();
    
    updateTransform();
}

/**
 * 关闭 ECharts 查看器
 */
function closeEChartsViewer(viewer) {
    // 清理事件监听器
    if (viewer._viewerEscHandler) {
        document.removeEventListener('keydown', viewer._viewerEscHandler);
    }
    
    // 清理图表实例
    if (viewer._chart) {
        viewer._chart.dispose();
    }
    
    // 清理 resize 处理器
    if (viewer._resizeHandler) {
        window.removeEventListener('resize', viewer._resizeHandler);
    }
    
    // 移除查看器
    if (document.body.contains(viewer)) {
        document.body.removeChild(viewer);
    }
    document.body.classList.remove('echarts-viewer-active');
    
    setStatus(t('messages.fullscreenClosed'));
}
