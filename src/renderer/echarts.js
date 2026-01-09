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
        try {
            // 尝试作为 JSON 解析
            option = JSON.parse(code);
        } catch (e) {
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
                throw new Error('ECharts 配置代码格式错误：' + e2.message);
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
                <button class="echarts-export-btn" data-action="resize" title="${t('messages.resizeChartTooltip')}">
                    <svg class="icon"><use href="#icon-reset-alt"></use></svg>
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
        
        const chart = window.echarts.init(chartContainer, AppState.currentTheme === 'dark' ? 'dark' : null);
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
    const resizeBtn = wrapper.querySelector('[data-action="resize"]');
    
    if (resizeBtn) {
        resizeBtn.addEventListener('click', () => {
            chart.resize();
            setStatus(t('messages.chartResized'));
        });
    }
}
