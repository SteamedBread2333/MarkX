/**
 * Markdown 渲染模块
 */

import DOMPurify from 'dompurify';
import { marked } from '../config/marked.js';
import { elements } from '../core/elements.js';
import { escapeHtml } from '../core/utils.js';
import { setStatus, updateStats } from '../core/ui-utils.js';
import { getEditorContent } from '../editor/ace-editor.js';
import { renderMermaidCharts } from './mermaid.js';
import { t } from '../core/i18n.js';

/**
 * 渲染 Markdown 为 HTML
 */
export async function renderMarkdown() {
    let markdown = getEditorContent();
    
    try {
        // 预处理：保护数学公式不被 Markdown 解析器破坏
        const mathBlocks = [];
        let processedMarkdown = markdown;
        
        // 1. 先提取并保护块级公式 $$...$$（包括多行）
        processedMarkdown = processedMarkdown.replace(/\$\$([\s\S]+?)\$\$/g, (match, formula) => {
            const index = mathBlocks.length;
            mathBlocks.push({ type: 'display', formula: formula.trim() });
            return `MATH_BLOCK_PLACEHOLDER_${index}`;
        });
        
        // 2. 提取并保护行内公式 $...$（单行，不包含换行）
        processedMarkdown = processedMarkdown.replace(/\$([^\$\n]+?)\$/g, (match, formula) => {
            const index = mathBlocks.length;
            mathBlocks.push({ type: 'inline', formula: formula.trim() });
            return `MATH_INLINE_PLACEHOLDER_${index}`;
        });
        
        // 使用 Marked 解析 Markdown
        let html = marked.parse(processedMarkdown);
        
        // 还原数学公式占位符（在 DOMPurify 之前）
        mathBlocks.forEach((mathBlock, index) => {
            const placeholder = mathBlock.type === 'display' 
                ? `MATH_BLOCK_PLACEHOLDER_${index}`
                : `MATH_INLINE_PLACEHOLDER_${index}`;
            
            if (mathBlock.type === 'display') {
                // 块级公式用 div 包裹，确保独立成行
                html = html.replace(placeholder, `<div class="katex-block">$$${mathBlock.formula}$$</div>`);
            } else {
                // 行内公式直接替换
                html = html.replace(placeholder, `$${mathBlock.formula}$`);
            }
        });
        
        // 使用 DOMPurify 清理 HTML（防止 XSS）
        html = DOMPurify.sanitize(html, {
            ADD_TAGS: ['iframe', 'div'], 
            ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'class'],
        });
        
        // 更新预览区
        elements.preview.innerHTML = html;
        
        // 渲染数学公式 (KaTeX)
        if (window.renderMathInElement) {
            try {
                renderMathInElement(elements.preview, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true},   // 块级公式
                        {left: '$', right: '$', display: false},    // 行内公式
                        {left: '\\[', right: '\\]', display: true}, // 备用块级
                        {left: '\\(', right: '\\)', display: false} // 备用行内
                    ],
                    throwOnError: false,
                    errorColor: '#cc0000'
                });
            } catch (error) {
                console.warn('KaTeX 渲染失败:', error);
            }
        }
        
        // 渲染 Mermaid 图表
        await renderMermaidCharts();
        
        // 更新统计信息
        updateStats(markdown);
        
        setStatus(t('messages.previewUpdated'));
        
    } catch (error) {
        console.error('渲染错误:', error);
        elements.preview.innerHTML = `
            <div class="mermaid-error">
                <div class="mermaid-error-title">${t('messages.renderFailed')}</div>
                <div>${escapeHtml(error.message)}</div>
            </div>
        `;
        setStatus(t('messages.renderFailed'), 5000);
    }
}
