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
import { renderEChartsCharts } from './echarts.js';
import { t } from '../core/i18n.js';

/**
 * 渲染 Markdown 为 HTML
 */
export async function renderMarkdown() {
    let markdown = getEditorContent();
    
    try {
        // 使用 Marked 解析 Markdown
        // 数学公式通过 ```katex 代码块处理，在 marked.js 的 renderer.code 中实现
        let html = marked.parse(markdown);
        
        // 使用 DOMPurify 清理 HTML（防止 XSS）
        html = DOMPurify.sanitize(html, {
            ADD_TAGS: ['iframe', 'div', 'span'], 
            ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'class'],
        });
        
        // 更新预览区
        elements.preview.innerHTML = html;
        
        // 渲染数学公式 (KaTeX)
        // 只渲染 .katex-block 和 .katex-inline 容器中的公式
        if (window.katex) {
            try {
                // 渲染块级公式
                const mathBlocks = elements.preview.querySelectorAll('.katex-block');
                mathBlocks.forEach(block => {
                    const formula = block.textContent.trim();
                    if (formula) {
                        try {
                            window.katex.render(formula, block, {
                                displayMode: true,
                                throwOnError: false,
                                errorColor: '#cc0000'
                            });
                        } catch (error) {
                            console.warn('KaTeX 渲染失败:', error);
                            block.innerHTML = `<span class="katex-error">${escapeHtml(formula)}</span>`;
                        }
                    }
                });
                
                // 渲染行内公式
                const mathInlines = elements.preview.querySelectorAll('.katex-inline');
                mathInlines.forEach(inline => {
                    const formula = inline.textContent.trim();
                    if (formula) {
                        try {
                            window.katex.render(formula, inline, {
                                displayMode: false,
                                throwOnError: false,
                                errorColor: '#cc0000'
                            });
                        } catch (error) {
                            console.warn('KaTeX 渲染失败:', error);
                            inline.innerHTML = `<span class="katex-error">${escapeHtml(formula)}</span>`;
                        }
                    }
                });
            } catch (error) {
                console.warn('KaTeX 渲染失败:', error);
            }
        }
        
        // 渲染 Mermaid 图表
        await renderMermaidCharts();
        
        // 渲染 ECharts 图表
        await renderEChartsCharts();
        
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
