/**
 * 工具函数
 */

/**
 * 防抖函数
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 转义 HTML 特殊字符
 */
export function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * 从标题文本生成 ID
 */
export function generateHeadingId(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * 预处理 Markdown，保护代码块并处理数学公式
 * 新方案：只提取代码块，数学公式在 HTML 解析后处理
 */
export function preprocessMathFormulas(markdown) {
    const codeBlocks = [];
    let codeBlockIndex = 0;
    
    // 提取所有代码块（使用简单的正则，支持 3+ 个反引号）
    const codeBlockRegex = /(```+|~~~+)([\s\S]*?)\1/g;
    let match;
    const codeBlockMatches = [];
    
    while ((match = codeBlockRegex.exec(markdown)) !== null) {
        codeBlockMatches.push({
            start: match.index,
            end: match.index + match[0].length,
            content: match[0]
        });
    }
    
    // 从后往前替换代码块为占位符
    let processedMarkdown = markdown;
    codeBlockMatches.sort((a, b) => b.start - a.start);
    
    codeBlockMatches.forEach((block) => {
        const placeholder = `\u200B\u200B\u200BCODE_BLOCK_${codeBlockIndex++}\u200B\u200B\u200B`;
        codeBlocks.push({
            placeholder: placeholder,
            content: block.content
        });
        processedMarkdown = processedMarkdown.substring(0, block.start) + 
                           placeholder + 
                           processedMarkdown.substring(block.end);
    });
    
    // 返回处理后的 markdown 和恢复函数
    return {
        markdown: processedMarkdown,
        restore: (html, markedParser) => {
            // 恢复代码块
            if (markedParser) {
                codeBlocks.forEach((item) => {
                    if (html.includes(item.placeholder)) {
                        const codeBlockHtml = markedParser.parse(item.content);
                        html = html.split(item.placeholder).join(codeBlockHtml);
                    }
                });
            } else {
                codeBlocks.forEach((item) => {
                    if (html.includes(item.placeholder)) {
                        html = html.split(item.placeholder).join(item.content);
                    }
                });
            }
            
            return html;
        },
        // 导出代码块信息，供后续处理数学公式使用
        codeBlocks: codeBlocks
    };
}

/**
 * 在 HTML 中处理数学公式（排除代码块中的内容）
 * 使用字符串替换方法，更可靠
 */
export function processMathInHTML(html) {
    // 创建临时 DOM 来提取代码块内容
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // 提取所有代码块，并用占位符替换
    const codeBlocks = [];
    const codePlaceholders = [];
    let codeIndex = 0;
    
    tempDiv.querySelectorAll('pre, code, .mermaid, .echarts').forEach(el => {
        const placeholder = `__MARKX_CODE_${codeIndex++}__`;
        codeBlocks.push({
            placeholder: placeholder,
            content: el.outerHTML
        });
        codePlaceholders.push({
            placeholder: placeholder,
            original: el.outerHTML
        });
    });
    
    // 从后往前替换代码块为占位符
    codePlaceholders.sort((a, b) => {
        const aIndex = html.lastIndexOf(a.original);
        const bIndex = html.lastIndexOf(b.original);
        return bIndex - aIndex;
    });
    
    let processedHTML = html;
    codePlaceholders.forEach(item => {
        processedHTML = processedHTML.replace(item.original, item.placeholder);
    });
    
    // 现在在非代码块区域处理数学公式
    // 先处理块级公式 $$...$$
    const blockMathRegex = /\$\$([\s\S]*?)\$\$/g;
    const blockMatches = [];
    let match;
    
    while ((match = blockMathRegex.exec(processedHTML)) !== null) {
        blockMatches.push({
            start: match.index,
            end: match.index + match[0].length,
            formula: match[1].trim(),
            original: match[0]
        });
    }
    
    // 从后往前替换块级公式
    blockMatches.sort((a, b) => b.start - a.start);
    blockMatches.forEach(item => {
        const replacement = `<div class="katex-block">${escapeHtml(item.formula)}</div>`;
        processedHTML = processedHTML.substring(0, item.start) + 
                        replacement + 
                        processedHTML.substring(item.end);
    });
    
    // 再处理行内公式 $...$
    const inlineMathRegex = /\$([\s\S]*?)\$/g;
    const inlineMatches = [];
    
    while ((match = inlineMathRegex.exec(processedHTML)) !== null) {
        // 跳过代码块占位符
        if (match[0].includes('__MARKX_CODE_')) {
            continue;
        }
        
        // 检查前后是否有另一个$（避免匹配到$$）
        const beforeChar = match.index > 0 ? processedHTML[match.index - 1] : '';
        const afterChar = match.index + match[0].length < processedHTML.length ? 
                          processedHTML[match.index + match[0].length] : '';
        
        if (beforeChar === '$' || afterChar === '$') {
            continue;
        }
        
        inlineMatches.push({
            start: match.index,
            end: match.index + match[0].length,
            formula: match[1].trim(),
            original: match[0]
        });
    }
    
    // 从后往前替换行内公式
    inlineMatches.sort((a, b) => b.start - a.start);
    inlineMatches.forEach(item => {
        const replacement = `<span class="katex-inline">${escapeHtml(item.formula)}</span>`;
        processedHTML = processedHTML.substring(0, item.start) + 
                       replacement + 
                       processedHTML.substring(item.end);
    });
    
    // 恢复代码块
    codeBlocks.forEach(item => {
        processedHTML = processedHTML.split(item.placeholder).join(item.content);
    });
    
    return processedHTML;
}
