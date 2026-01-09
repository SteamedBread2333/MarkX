/**
 * Marked.js 配置
 */

import { marked } from 'marked';
import hljs from 'highlight.js';
import { escapeHtml, generateHeadingId } from '../core/utils.js';

// 创建自定义渲染器
const renderer = new marked.Renderer();

// 自定义代码块渲染 - 处理 Mermaid、ECharts 和 KaTeX
renderer.code = function(code, language) {
    const lang = language || '';
    
    // 检测 Mermaid 代码块
    if (lang === 'mermaid' || lang === 'mmd') {
        return `<div class="mermaid">${code}</div>`;
    }
    
    // 检测 ECharts 代码块
    if (lang === 'echarts') {
        return `<div class="echarts" data-echarts-code="${escapeHtml(code)}"></div>`;
    }
    
    // 检测 KaTeX 数学公式块
    // 只有顶层的 ```katex 代码块才会被解析为数学公式
    // 嵌套在其他代码块中的 ```katex 不会被解析（由 Marked 自动处理）
    // 支持在 ```katex 块中使用 $...$ (行内) 和 $$...$$ (块级) 格式
    if (lang === 'katex') {
        const trimmedCode = code.trim();
        const formulas = [];
        
        // 先提取所有 $$...$$ 格式的块级公式（优先级更高）
        const blockRegex = /\$\$([\s\S]*?)\$\$/g;
        let blockMatch;
        const blockMatches = [];
        const usedRanges = []; // 记录已使用的字符范围
        
        while ((blockMatch = blockRegex.exec(trimmedCode)) !== null) {
            const start = blockMatch.index;
            const end = blockRegex.lastIndex;
            blockMatches.push({
                start: start,
                end: end,
                formula: blockMatch[1].trim(),
                type: 'block'
            });
            // 记录这个范围，避免行内公式匹配到这里
            usedRanges.push({ start: start, end: end });
        }
        
        // 提取所有 $...$ 格式的行内公式（排除已经被 $$...$$ 匹配的部分）
        // 注意：行内公式通常不跨行，但为了兼容性，我们允许跨行
        const inlineRegex = /\$([\s\S]*?)\$/g;
        let inlineMatch;
        
        // 重置正则表达式的 lastIndex
        inlineRegex.lastIndex = 0;
        
        while ((inlineMatch = inlineRegex.exec(trimmedCode)) !== null) {
            const start = inlineMatch.index;
            const end = inlineRegex.lastIndex;
            
            // 检查这个行内公式是否与任何块级公式的范围重叠
            const isOverlapping = usedRanges.some(range => 
                (start >= range.start && start < range.end) ||
                (end > range.start && end <= range.end) ||
                (start <= range.start && end >= range.end)
            );
            
            // 还要检查这个 $ 是否是 $$ 的一部分（即前面或后面紧跟着另一个 $）
            const isPartOfDoubleDollar = 
                (start > 0 && trimmedCode[start - 1] === '$') ||
                (end < trimmedCode.length && trimmedCode[end] === '$');
            
            if (!isOverlapping && !isPartOfDoubleDollar) {
                blockMatches.push({
                    start: start,
                    end: end,
                    formula: inlineMatch[1].trim(),
                    type: 'inline'
                });
                // 记录这个范围，避免重复匹配
                usedRanges.push({ start: start, end: end });
            }
        }
        
        // 按位置排序
        blockMatches.sort((a, b) => a.start - b.start);
        
        // 生成 HTML
        if (blockMatches.length > 0) {
            return blockMatches.map((item) => {
                if (item.type === 'block') {
                    return `<div class="katex-block">${item.formula}</div>`;
                } else {
                    return `<span class="katex-inline">${item.formula}</span>`;
                }
            }).join('');
        }
        
        // 如果没有匹配到任何公式格式，按单个公式处理
        // 判断是块级公式还是行内公式
        if (trimmedCode.includes('\n') || trimmedCode.length > 50) {
            return `<div class="katex-block">${trimmedCode}</div>`;
        } else {
            return `<span class="katex-inline">${trimmedCode}</span>`;
        }
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
