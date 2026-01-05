/**
 * Marked.js 配置
 */

import { marked } from 'marked';
import hljs from 'highlight.js';
import { escapeHtml, generateHeadingId } from '../core/utils.js';

// 创建自定义渲染器
const renderer = new marked.Renderer();

// 自定义代码块渲染 - 处理 Mermaid
renderer.code = function(code, language) {
    const lang = language || '';
    
    // 检测 Mermaid 代码块
    if (lang === 'mermaid' || lang === 'mmd') {
        return `<div class="mermaid">${code}</div>`;
    }
    
    // 其他代码使用 highlight.js 高亮
    if (lang && hljs.getLanguage(lang)) {
        try {
            const highlighted = hljs.highlight(code, { language: lang }).value;
            return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`;
        } catch (err) {
            console.error('代码高亮失败:', err);
        }
    }
    
    // 默认代码块
    return `<pre><code>${escapeHtml(code)}</code></pre>`;
};

// 自定义标题渲染 - 添加 ID 用于目录跳转，并保留空格
renderer.heading = function(text, level) {
    const id = generateHeadingId(text);
    // 将标题中的空格转换为 &nbsp; HTML 实体，确保空格被保留
    // 这样在 PDF 导出时也能正确显示空格
    const textWithSpaces = text.replace(/ /g, '&nbsp;');
    return `<h${level} id="${id}">${textWithSpaces}</h${level}>`;
};

// 配置 Marked 选项
marked.setOptions({
    renderer: renderer,
    gfm: true, // GitHub Flavored Markdown
    breaks: true, // 支持换行
    pedantic: false,
    smartLists: true,
    smartypants: true,
});

export { marked };
