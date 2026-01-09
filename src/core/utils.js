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
    // 注意：这必须在提取HTML标签之前进行，否则<p>标签已经被占位符替换了
    processedHTML = processedHTML.replace(/<p>\s*\$\$([\s\S]*?)\$\$\s*<\/p>/gi, (match, formula) => {
        // 清理公式中的 <br> 标签
        const cleanedFormula = formula.replace(/<br\s*\/?>/gi, '\n');
        return `$$${cleanedFormula}$$`;
    });
    
    // 提取并保护所有HTML标签（包括自闭合标签和成对标签），避免解析HTML内的$和$$
    // 这样可以确保HTML标签内的$符号不会被误匹配为数学公式
    // 注意：这必须在处理被<p>标签包裹的公式块之后进行
    const htmlTagPlaceholders = [];
    let htmlTagIndex = 0;
    
    // 匹配所有HTML标签（包括自闭合标签和成对标签）
    // 这个正则会匹配：<tag>...</tag>、<tag/>、<tag />、<tag attr="value">等
    const htmlTagRegex = /<[^>]+>/g;
    let htmlTagMatch;
    const htmlTagMatches = [];
    
    while ((htmlTagMatch = htmlTagRegex.exec(processedHTML)) !== null) {
        // 跳过代码块占位符（它们可能包含<和>）
        if (htmlTagMatch[0].includes('<!--MARKX_CODE_')) {
            continue;
        }
        
        htmlTagMatches.push({
            start: htmlTagMatch.index,
            end: htmlTagMatch.index + htmlTagMatch[0].length,
            content: htmlTagMatch[0]
        });
    }
    
    // 从后往前替换HTML标签为占位符
    htmlTagMatches.sort((a, b) => b.start - a.start);
    htmlTagMatches.forEach(tag => {
        const placeholder = `<!--MARKX_HTML_TAG_${htmlTagIndex++}-->`;
        htmlTagPlaceholders.push({
            placeholder: placeholder,
            content: tag.content
        });
        processedHTML = processedHTML.substring(0, tag.start) + 
                        placeholder + 
                        processedHTML.substring(tag.end);
    });
    
    // 现在匹配所有块级公式（包括处理后的和原本就没有 <p> 标签的）
    const blockMathRegex = /\$\$([\s\S]*?)\$\$/g;
    const blockMatches = [];
    let match;
    
    // 重置正则表达式的 lastIndex，确保从头开始匹配
    blockMathRegex.lastIndex = 0;
    
    while ((match = blockMathRegex.exec(processedHTML)) !== null) {
        // 跳过代码块占位符
        if (match[0].includes('<!--MARKX_CODE_')) {
            continue;
        }
        
        // 跳过HTML标签占位符（HTML标签内的$不应该被解析）
        if (match[0].includes('<!--MARKX_HTML_TAG_')) {
            continue;
        }
        
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
        
        // 如果公式为空，跳过
        if (!formula) {
            continue;
        }
        
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
    // 使用更严格的正则，避免误匹配正常文本中的 $ 符号（如价格 $100）
    // 注意：使用 [\s\S]*? 匹配所有内容，但在匹配后会进行严格验证
    
    // 先处理 HTML 实体编码的 $（如 &#36;），将其转换回 $
    processedHTML = processedHTML.replace(/&#36;/g, '$');
    
    // 先识别并保护价格格式（如 $123, $99.99），避免价格中的 $ 被误匹配为数学公式
    // 价格格式特征：$ 后面紧跟数字（可能包含小数点），且前后有适当的边界
    // 注意：需要处理 HTML 实体编码的情况（如 &nbsp; 后的 $）
    // 临时将 &nbsp; 转换为空格，以便匹配价格格式
    const nbspPlaceholders = [];
    let nbspIndex = 0;
    processedHTML = processedHTML.replace(/&nbsp;/g, (match) => {
        const placeholder = `<!--MARKX_NBSP_${nbspIndex++}-->`;
        nbspPlaceholders.push({
            placeholder: placeholder,
            original: match
        });
        return placeholder;
    });
    
    const pricePlaceholders = [];
    let priceIndex = 0;
    // 匹配价格格式：行首/空格/&nbsp;占位符/</(/[/中文字符 后的 $数字，然后是空格/>/标点（包括中文标点）/中文字符/行尾/HTML标签
    // 注意：需要匹配 &nbsp; 占位符后的价格，以及支持中文标点、方括号和中文字符
    // 方括号 ] 单独匹配以避免字符类转义问题
    // 中文字符范围：\u4e00-\u9fa5
    const priceRegex = /(^|[\s<(\[]|<!--MARKX_NBSP_\d+-->|[\u4e00-\u9fa5])\$(\d+\.?\d*)([\s>.,;:!?]|]|\)|，|。|；|：|！|？|[\u4e00-\u9fa5]|$|<\/)/g;
    let priceMatch;
    
    while ((priceMatch = priceRegex.exec(processedHTML)) !== null) {
        const placeholder = `<!--MARKX_PRICE_${priceIndex++}-->`;
        const fullMatch = priceMatch[0];
        const beforeChar = priceMatch[1];
        const priceValue = priceMatch[2];
        const afterChar = priceMatch[3];
        
        pricePlaceholders.push({
            placeholder: placeholder,
            original: fullMatch,
            beforeChar: beforeChar,
            priceValue: priceValue,
            afterChar: afterChar
        });
    }
    
    // 从后往前替换价格格式为占位符
    pricePlaceholders.sort((a, b) => {
        const aIndex = processedHTML.lastIndexOf(a.original);
        const bIndex = processedHTML.lastIndexOf(b.original);
        return bIndex - aIndex;
    });
    
    pricePlaceholders.forEach(item => {
        processedHTML = processedHTML.replace(item.original, `${item.beforeChar}${item.placeholder}${item.afterChar}`);
    });
    
    const inlineMathRegex = /\$([\s\S]*?)\$/g;
    const inlineMatches = [];
    
    // LaTeX 命令模式，用于验证是否是真正的数学公式
    const latexCommandPattern = /\\[a-zA-Z]+|\\[^a-zA-Z]|[\^_\{]|frac|sum|int|sqrt|lim|sin|cos|tan|log|ln|exp|pi|alpha|beta|gamma|delta|theta|lambda|mu|sigma|phi|omega|infty|pm|mp|times|div|leq|geq|neq|approx|equiv|in|notin|subset|supset|cup|cap|emptyset|forall|exists|nabla|partial|cdot|cdots|ldots|vdots|ddots/;
    
    while ((match = inlineMathRegex.exec(processedHTML)) !== null) {
        // 跳过代码块占位符
        if (match[0].includes('<!--MARKX_CODE_')) {
            continue;
        }
        
        // 跳过HTML标签占位符（HTML标签内的$不应该被解析）
        if (match[0].includes('<!--MARKX_HTML_TAG_')) {
            continue;
        }
        
        // 跳过价格占位符
        if (match[0].includes('<!--MARKX_PRICE_')) {
            continue;
        }
        
        // 跳过 &nbsp; 占位符（不应该出现在公式中，但如果出现则跳过）
        if (match[0].includes('<!--MARKX_NBSP_')) {
            continue;
        }
        
        // 检查前后是否有另一个$（避免匹配到$$）
        const beforeChar = match.index > 0 ? processedHTML[match.index - 1] : '';
        const afterChar = match.index + match[0].length < processedHTML.length ? 
                          processedHTML[match.index + match[0].length] : '';
        
        if (beforeChar === '$' || afterChar === '$') {
            continue;
        }
        
        // 获取原始公式内容（在清理之前）
        const rawFormula = match[1];
        
        // 清理公式中的 <br> 和 <br/> 标签，将它们转换为空格
        // 行内公式不应该包含换行，所以转换为空格
        let formula = rawFormula.trim();
        
        // 先解码 HTML 实体，然后再清理
        // 注意：&amp; 必须最后解码，否则会干扰其他实体的解码
        formula = formula
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'")
            .replace(/&#x27;/g, "'")
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&');
        
        // 清理 <br> 标签和多余空白
        formula = formula.replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ').trim();
        
        // 先验证是否是真正的数学公式
        // 如果公式内容看起来不像数学公式（比如只是数字或简单文本），则跳过
        // 检查条件：
        // 1. 包含 LaTeX 命令或数学符号
        // 2. 或者包含数学运算符（+, -, *, /, =, <, >）
        // 3. 或者前后有适当的边界（空格、标点、HTML 标签边界）
        const isLikelyMath = latexCommandPattern.test(formula) || 
                            /[+\-*/=<>≤≥≠≈≡±×÷]/.test(formula) ||
                            /[a-zA-Z]\s*[+\-*/=<>≤≥≠≈≡±×÷]\s*[a-zA-Z0-9]/.test(formula);
        
        // 如果确认是数学公式，跳过后续的严格检查（因为数学公式中可能包含某些字符）
        if (isLikelyMath) {
            // 对于确认的数学公式，只做最基本的检查：
            // 1. 如果公式很短（少于 100 个字符），直接添加，不做 HTML 标签检查
            // 2. 如果公式较长，检查是否包含明显的 HTML 格式化标签
            if (formula.length < 100) {
                // 短公式直接添加，不做 HTML 标签检查
                inlineMatches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    formula: formula,
                    original: match[0]
                });
                continue;
            }
            
            // 对于长公式，检查是否包含明显的 HTML 格式化标签
            let tempFormula = rawFormula.replace(/<br\s*\/?>/gi, '');
            const formattingTags = /<(strong|em|b|i|u|h[1-6]|p|div|span|a|img|code|pre|ul|ol|li|table|tr|td|th|blockquote)[\s>\/]/i;
            if (formattingTags.test(tempFormula)) {
                continue;
            }
            
            // 数学公式通过验证，添加到匹配列表
            inlineMatches.push({
                start: match.index,
                end: match.index + match[0].length,
                formula: formula,
                original: match[0]
            });
            continue;
        }
        
        // 如果不是数学公式，进行更严格的检查以避免误匹配
        
        // 检查原始内容中是否包含多个换行符或段落分隔符
        // 行内公式不应该跨越多行，如果包含多个换行，可能是误匹配
        const lineBreakCount = (rawFormula.match(/<br\s*\/?>/gi) || []).length;
        if (lineBreakCount > 1) {
            continue;
        }
        
        // 检查是否包含 Markdown 语法标记（如 **, *, _, #, [], () 等）
        // 如果包含这些标记，说明可能匹配到了非数学内容
        // 注意：只检查明显的 Markdown 语法，不检查单个字符（因为数学公式中也可能包含）
        const markdownPattern = /\*\*|\*\s+\*|_\s+_|#+\s|```|`/;
        if (markdownPattern.test(rawFormula)) {
            continue;
        }
        
        // 检查是否包含 HTML 标签（除了 <br>）
        // 如果包含其他 HTML 标签（如 <strong>, <em>, <h1> 等），说明可能匹配到了非数学内容
        const tempFormula = rawFormula.replace(/<br\s*\/?>/gi, '');
        // 检查是否是常见的 HTML 标签（不是数学公式中可能出现的）
        const commonHtmlTags = /<(strong|em|b|i|u|h[1-6]|p|div|span|a|img|code|pre|ul|ol|li|table|tr|td|th|blockquote)[\s>]/i;
        if (commonHtmlTags.test(tempFormula)) {
            continue;
        }
        
        // 检查是否是简单的价格格式（如 $100, $99.99）
        // 价格格式特征：纯数字（可能包含小数点），且前后有适当的边界
        const isPriceFormat = /^\d+\.?\d*$/.test(formula) && 
                             (beforeChar === '' || /[\s<(]/.test(beforeChar)) &&
                             (afterChar === '' || /[\s>.,;:!?)]/.test(afterChar)) &&
                             !isLikelyMath;
        
        // 如果看起来像价格格式，跳过
        if (isPriceFormat) {
            continue;
        }
        
        // 如果公式太短且不包含数学特征，可能是误匹配，跳过
        if (formula.length < 2 && !isLikelyMath) {
            continue;
        }
        
        // 如果公式内容看起来不像数学公式，跳过
        // 例如：包含太多普通文本、包含 Markdown 语法等
        if (!isLikelyMath && formula.length > 50) {
            // 如果公式很长但不包含数学特征，可能是误匹配
            continue;
        }
        
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
    
    // 恢复价格占位符（在恢复代码块之前）
    // 从后往前恢复，避免位置变化影响
    pricePlaceholders.sort((a, b) => {
        const aIndex = processedHTML.lastIndexOf(a.placeholder);
        const bIndex = processedHTML.lastIndexOf(b.placeholder);
        return bIndex - aIndex;
    });
    pricePlaceholders.forEach(item => {
        // 恢复为原始的格式：$数字
        // 注意：占位符周围已经有 beforeChar 和 afterChar，所以只需要替换占位符本身为 $数字
        processedHTML = processedHTML.replace(item.placeholder, `$${item.priceValue}`);
    });
    
    // 恢复 &nbsp; 占位符（在恢复代码块之前）
    nbspPlaceholders.forEach(item => {
        processedHTML = processedHTML.replace(item.placeholder, item.original);
    });
    
    // 恢复代码块
    codeBlocks.forEach(item => {
        processedHTML = processedHTML.split(item.placeholder).join(item.content);
    });
    
    // 恢复HTML标签占位符（最后恢复，确保所有处理都已完成）
    htmlTagPlaceholders.forEach(item => {
        processedHTML = processedHTML.split(item.placeholder).join(item.content);
    });
    
    return processedHTML;
}
