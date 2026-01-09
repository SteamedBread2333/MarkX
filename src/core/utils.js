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
        const placeholder = `<!--MARKX_CODE_BLOCK_${codeBlockIndex++}-->`;
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
        const placeholder = `<!--MARKX_CODE_${codeIndex++}-->`;
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
    // 注意：需要处理 Marked 的 breaks 选项可能插入的 <br> 标签
    // 以及 Marked 可能将公式包裹在 <p> 标签中的情况
    
    // 首先，处理被 <p> 标签包裹的公式块
    // 查找形如 <p>$$...$$</p> 的模式，并临时移除 <p> 标签以便后续匹配
    processedHTML = processedHTML.replace(/<p>\s*\$\$([\s\S]*?)\$\$\s*<\/p>/gi, (match, formula) => {
        // 清理公式中的 <br> 标签
        const cleanedFormula = formula.replace(/<br\s*\/?>/gi, '\n');
        return `$$${cleanedFormula}$$`;
    });
    
    // 现在匹配所有块级公式（包括处理后的和原本就没有 <p> 标签的）
    const blockMathRegex = /\$\$([\s\S]*?)\$\$/g;
    const blockMatches = [];
    let match;
    
    // 重置正则表达式的 lastIndex，确保从头开始匹配
    blockMathRegex.lastIndex = 0;
    
    while ((match = blockMathRegex.exec(processedHTML)) !== null) {
        // 清理公式中的 HTML 标签和实体
        let formula = match[1];
        
        // 将 <br> 和 <br/> 标签转换为换行符
        formula = formula.replace(/<br\s*\/?>/gi, '\n');
        
        // 移除其他 HTML 标签
        formula = formula.replace(/<[^>]+>/g, '');
        
        // 解码常见的 HTML 实体
        // 注意：&amp; 必须最后解码，否则会干扰其他实体的解码
        formula = formula
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'")
            .replace(/&#x27;/g, "'")
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&');
        
        // 清理多余的空白字符，但保留换行符
        formula = formula.replace(/[ \t]+/g, ' ').trim();
        
        blockMatches.push({
            start: match.index,
            end: match.index + match[0].length,
            formula: formula,
            original: match[0]
        });
    }
    
    // 从后往前替换块级公式
    blockMatches.sort((a, b) => b.start - a.start);
    blockMatches.forEach(item => {
        // 转义公式中的 < 和 > 字符，防止被浏览器解释为 HTML 标签
        // 其他字符不需要转义，因为公式会被 KaTeX 处理
        const safeFormula = item.formula
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        const replacement = `<div class="katex-block">${safeFormula}</div>`;
        processedHTML = processedHTML.substring(0, item.start) + 
                        replacement + 
                        processedHTML.substring(item.end);
    });
    
    // 再处理行内公式 $...$
    const inlineMathRegex = /\$([\s\S]*?)\$/g;
    const inlineMatches = [];
    
    while ((match = inlineMathRegex.exec(processedHTML)) !== null) {
        // 跳过代码块占位符
        if (match[0].includes('<!--MARKX_CODE_')) {
            continue;
        }
        
        // 检查前后是否有另一个$（避免匹配到$$）
        const beforeChar = match.index > 0 ? processedHTML[match.index - 1] : '';
        const afterChar = match.index + match[0].length < processedHTML.length ? 
                          processedHTML[match.index + match[0].length] : '';
        
        if (beforeChar === '$' || afterChar === '$') {
            continue;
        }
        
        // 清理公式中的 <br> 和 <br/> 标签，将它们转换为空格
        // 行内公式不应该包含换行，所以转换为空格
        let formula = match[1].trim();
        formula = formula.replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ').trim();
        
        inlineMatches.push({
            start: match.index,
            end: match.index + match[0].length,
            formula: formula,
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
