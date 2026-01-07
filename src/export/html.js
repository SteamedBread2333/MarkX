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
export function exportHTML() {
    // 克隆预览区内容，避免修改原始 DOM
    const previewClone = elements.preview.cloneNode(true);
    
    // 移除所有 .mermaid 元素的 mermaid 类，避免 Mermaid 脚本再次渲染
    const mermaidElements = previewClone.querySelectorAll('.mermaid');
    mermaidElements.forEach(el => {
        el.classList.remove('mermaid');
    });
    
    // 移除导出工具栏（导出的 HTML 不需要这些按钮）
    const toolbars = previewClone.querySelectorAll('.mermaid-export-toolbar');
    toolbars.forEach(toolbar => toolbar.remove());
    
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
    </style>
</head>
<body>
    <div class="markdown-body">
        ${previewClone.innerHTML}
    </div>
    <!-- 不需要 Mermaid 脚本，因为 SVG 已经渲染好了 -->
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
    setEditorContent('');
    AppState.isDirty = false;
    await renderMarkdown();
    setStatus(t('messages.contentCleared'));
}
