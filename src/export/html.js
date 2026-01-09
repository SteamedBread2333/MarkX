/**
 * HTML 导出模块
 */

import { AppState } from '../core/state.js';
import { elements } from '../core/elements.js';
import { setStatus } from '../core/ui-utils.js';
import { t } from '../core/i18n.js';

/**
 * 导出 HTML
 */
export async function exportHTML() {
    // 克隆预览区内容，避免修改原始 DOM
    const previewClone = elements.preview.cloneNode(true);
    
    // 移除所有 .mermaid 元素的 mermaid 类，避免 Mermaid 脚本再次渲染
    const mermaidElements = previewClone.querySelectorAll('.mermaid');
    mermaidElements.forEach(el => {
        el.classList.remove('mermaid');
    });
    
    // 移除导出工具栏（导出的 HTML 不需要这些按钮）
    const toolbars = previewClone.querySelectorAll('.mermaid-export-toolbar, .echarts-export-toolbar');
    toolbars.forEach(toolbar => toolbar.remove());
    
    // 处理 ECharts 图表：将 Canvas 转换为图片
    const echartsWrappers = previewClone.querySelectorAll('.echarts-wrapper');
    const originalEchartsWrappers = elements.preview.querySelectorAll('.echarts-wrapper');
    
    for (let i = 0; i < echartsWrappers.length; i++) {
        const wrapper = echartsWrappers[i];
        const originalWrapper = originalEchartsWrappers[i];
        
        if (!originalWrapper) {
            console.warn('找不到原始 ECharts wrapper，索引:', i);
            continue;
        }
        
        // 查找原始图表实例（优先从 wrapper 获取，如果没有则从父元素获取）
        let originalChart = originalWrapper._chart;
        if (!originalChart) {
            // 尝试从父元素 .echarts 获取
            const parentEcharts = originalWrapper.closest('.echarts');
            if (parentEcharts && parentEcharts._chart) {
                originalChart = parentEcharts._chart;
            }
        }
        
        if (!originalChart) {
            console.warn('找不到 ECharts 图表实例，索引:', i);
            continue;
        }
        
        // 获取图表容器的 Canvas
        let chartDom;
        try {
            chartDom = originalChart.getDom();
        } catch (error) {
            console.error('获取 ECharts DOM 失败:', error);
            continue;
        }
        
        if (!chartDom) {
            console.warn('ECharts DOM 为空，索引:', i);
            continue;
        }
        
        const canvas = chartDom.querySelector('canvas');
        if (!canvas) {
            console.warn('找不到 ECharts Canvas，索引:', i);
            continue;
        }
        
        // 将 Canvas 转换为图片
        try {
            // 确保图表已完全渲染
            originalChart.resize();
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const dataURL = canvas.toDataURL('image/png', 1.0);
            if (!dataURL || dataURL === 'data:,') {
                console.warn('Canvas 转换为图片失败，数据为空，索引:', i);
                continue;
            }
            
            const img = document.createElement('img');
            img.src = dataURL;
            img.style.width = '100%';
            img.style.height = 'auto';
            img.style.display = 'block';
            img.style.maxWidth = '100%';
            
            // 替换 wrapper 内容
            wrapper.innerHTML = '';
            wrapper.className = 'echarts-wrapper';
            const contentDiv = document.createElement('div');
            contentDiv.className = 'echarts-content';
            contentDiv.style.padding = '16px';
            contentDiv.appendChild(img);
            wrapper.appendChild(contentDiv);
        } catch (error) {
            console.error('ECharts 图表转换失败，索引:', i, error);
        }
    }
    
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${AppState.currentFileName.replace('.md', '')}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github.min.css">
    <style>
        body {
            max-width: 900px;
            margin: 40px auto;
            padding: 0 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #24292f;
        }
        .markdown-body { color: #24292f; }
        .markdown-body h1, .markdown-body h2 { border-bottom: 1px solid #d0d7de; padding-bottom: 0.3em; }
        .markdown-body code { background: #f6f8fa; padding: 0.2em 0.4em; border-radius: 6px; }
        .markdown-body pre { background: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x: auto; }
        .markdown-body table { border-collapse: collapse; width: 100%; }
        .markdown-body table th, .markdown-body table td { border: 1px solid #d0d7de; padding: 6px 13px; }
        .mermaid-wrapper { margin: 24px 0; }
        .mermaid-content { padding: 16px; }
        .mermaid-content svg { display: block; }
        .echarts-wrapper { margin: 24px 0; }
        .echarts-content { padding: 16px; }
        .echarts-content img { display: block; width: 100%; height: auto; max-width: 100%; }
    </style>
</head>
<body>
    <div class="markdown-body">
        ${previewClone.innerHTML}
    </div>
    <!-- 不需要 Mermaid 和 ECharts 脚本，因为 SVG 和图片已经渲染好了 -->
</body>
</html>`;
    
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = AppState.currentFileName.replace('.md', '.html');
    a.click();
    URL.revokeObjectURL(url);
    
    setStatus(t('messages.htmlExported'));
}

/**
 * 复制 Markdown
 */
export async function copyMarkdown() {
    try {
        const { getEditorContent } = await import('../editor/ace-editor.js');
        const content = getEditorContent();
        await navigator.clipboard.writeText(content);
        setStatus(t('messages.markdownCopied'));
    } catch (err) {
        console.error('复制失败:', err);
        setStatus(t('messages.copyFailed'), 3000);
    }
}

/**
 * 复制 HTML
 */
export async function copyHTML() {
    try {
        await navigator.clipboard.writeText(elements.preview.innerHTML);
        setStatus(t('messages.htmlCopied'));
    } catch (err) {
        console.error('复制失败:', err);
        setStatus(t('messages.copyFailed'), 3000);
    }
}

/**
 * 清空内容
 */
export async function clearContent() {
    if (!confirm(t('messages.clearConfirm'))) {
        return;
    }
    const { setEditorContent } = await import('../editor/ace-editor.js');
    const { renderMarkdown } = await import('../renderer/markdown.js');
    // 清空内容，不填充默认模板
    setEditorContent('');
    AppState.isDirty = false;
    await renderMarkdown();
    setStatus(t('messages.contentCleared'));
}
