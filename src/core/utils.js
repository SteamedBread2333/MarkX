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
 * 简化版本：使用更可靠的匹配方式
 */
export function preprocessMathFormulas(markdown) {
    const codeBlocks = [];
    const codeBlockPlaceholders = [];
    let codeBlockIndex = 0;
    
    // 第一步：提取所有代码块（使用简单的正则，支持 3+ 个反引号）
    // 匹配格式：```language 或 ``````language（4个反引号）等
    const codeBlockRegex = /(```+|~~~+)([\s\S]*?)\1/g;
    let match;
    
    while ((match = codeBlockRegex.exec(markdown)) !== null) {
        const fullMatch = match[0];
        const placeholder = `\x01CODE_BLOCK_${codeBlockIndex++}\x01`;
        codeBlocks.push({
            placeholder: placeholder,
            content: fullMatch
        });
        codeBlockPlaceholders.push({
            placeholder: placeholder,
            original: fullMatch
        });
    }
    
    // 替换代码块为占位符（从后往前，避免索引变化）
    let processedMarkdown = markdown;
    codeBlockPlaceholders.sort((a, b) => {
        const aIndex = processedMarkdown.indexOf(a.original);
        const bIndex = processedMarkdown.indexOf(b.original);
        return bIndex - aIndex;
    });
    
    codeBlockPlaceholders.forEach(item => {
        processedMarkdown = processedMarkdown.replace(item.original, item.placeholder);
    });
    
    // 第二步：在非代码块区域处理数学公式
    const blockMathPlaceholders = [];
    const inlineMathPlaceholders = [];
    let blockMathIndex = 0;
    let inlineMathIndex = 0;
    
    // 先处理块级公式 $$...$$
    const blockMathRegex = /\$\$([\s\S]*?)\$\$/g;
    const blockMatches = [];
    
    while ((match = blockMathRegex.exec(processedMarkdown)) !== null) {
        blockMatches.push({
            start: match.index,
            end: match.index + match[0].length,
            formula: match[1].trim()
        });
    }
    
    // 从后往前替换
    blockMatches.sort((a, b) => b.start - a.start);
    blockMatches.forEach(item => {
        const placeholder = `\x01BLOCK_MATH_${blockMathIndex++}\x01`;
        blockMathPlaceholders.push({
            placeholder: placeholder,
            formula: item.formula
        });
        processedMarkdown = processedMarkdown.substring(0, item.start) + 
                           placeholder + 
                           processedMarkdown.substring(item.end);
    });
    
    // 再处理行内公式 $...$
    const inlineMathRegex = /\$([\s\S]*?)\$/g;
    const inlineMatches = [];
    
    while ((match = inlineMathRegex.exec(processedMarkdown)) !== null) {
        // 跳过块级公式占位符
        if (match[0].includes('\x01BLOCK_MATH_')) {
            continue;
        }
        
        // 检查前后是否有另一个$（避免匹配到$$）
        const beforeChar = match.index > 0 ? processedMarkdown[match.index - 1] : '';
        const afterChar = match.index + match[0].length < processedMarkdown.length ? 
                          processedMarkdown[match.index + match[0].length] : '';
        
        if (beforeChar === '$' || afterChar === '$') {
            continue;
        }
        
        inlineMatches.push({
            start: match.index,
            end: match.index + match[0].length,
            formula: match[1].trim()
        });
    }
    
    // 从后往前替换
    inlineMatches.sort((a, b) => b.start - a.start);
    inlineMatches.forEach(item => {
        const placeholder = `\x01INLINE_MATH_${inlineMathIndex++}\x01`;
        inlineMathPlaceholders.push({
            placeholder: placeholder,
            formula: item.formula
        });
        processedMarkdown = processedMarkdown.substring(0, item.start) + 
                           placeholder + 
                           processedMarkdown.substring(item.end);
    });
    
    // 返回处理后的 markdown 和恢复函数
    return {
        markdown: processedMarkdown,
        restore: (html, markedParser) => {
            // 恢复行内数学公式
            inlineMathPlaceholders.forEach(item => {
                html = html.split(item.placeholder).join(`<span class="katex-inline">${escapeHtml(item.formula)}</span>`);
            });
            
            // 恢复块级数学公式
            blockMathPlaceholders.forEach(item => {
                html = html.split(item.placeholder).join(`<div class="katex-block">${escapeHtml(item.formula)}</div>`);
            });
            
            // 恢复代码块
            if (markedParser) {
                codeBlocks.forEach(item => {
                    const codeBlockHtml = markedParser.parse(item.content);
                    html = html.split(item.placeholder).join(codeBlockHtml);
                });
            } else {
                codeBlocks.forEach(item => {
                    html = html.split(item.placeholder).join(item.content);
                });
            }
            
            return html;
        }
    };
}
