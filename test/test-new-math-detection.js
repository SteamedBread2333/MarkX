/**
 * 测试新方案：使用优化后的数学公式识别方案
 * 适配 Node.js 环境（使用正则表达式提取代码块，不依赖 DOM）
 */

// 读取优化后的实现代码
const fs = require('fs');
const path = require('path');

// 模拟 Marked 解析（简化版）
function mockMarkedParse(markdown) {
    let html = markdown;
    
    // 处理标题
    html = html.replace(/^#\s+(.+)$/gm, (match, text) => {
        const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-+|-+$/g, '');
        const textWithSpaces = text.replace(/ /g, '&nbsp;');
        return `<h1 id="${id}">${textWithSpaces}</h1>`;
    });
    
    html = html.replace(/^##\s+(.+)$/gm, (match, text) => {
        const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-+|-+$/g, '');
        const textWithSpaces = text.replace(/ /g, '&nbsp;');
        return `<h2 id="${id}">${textWithSpaces}</h2>`;
    });
    
    // 处理粗体
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // 处理段落
    html = html.split('\n\n').map(para => {
        para = para.trim();
        if (para && !para.startsWith('<')) {
            // 处理单行段落
            para = para.replace(/\n/g, '<br>');
            return `<p>${para}</p>`;
        }
        return para;
    }).join('\n');
    
    // 处理换行
    html = html.replace(/\n/g, '<br>');
    
    return html;
}

// 导入优化后的实现（简化版，适配 Node.js）
function processMathInHTML(html) {
    let processedHTML = html;
    
    // ========== 阶段 1：代码块保护（最高优先级）==========
    const codeBlocks = extractAndProtectCodeBlocks(processedHTML);
    processedHTML = codeBlocks.processedHTML;
    
    // ========== 阶段 2：HTML 标签保护（高优先级）==========
    const htmlTags = extractAndProtectHtmlTags(processedHTML);
    processedHTML = htmlTags.processedHTML;
    
    // ========== 阶段 3：处理 HTML 实体编码的 $ ==========
    processedHTML = processedHTML.replace(/&#36;/g, '$');
    
    // ========== 阶段 4：处理块级公式 $$...$$ ==========
    const blockMath = extractAndProtectBlockMath(processedHTML);
    processedHTML = blockMath.processedHTML;
    
    // ========== 阶段 5：价格格式识别和保护（中优先级）==========
    const prices = extractAndProtectPrices(processedHTML);
    console.log('\n=== 价格识别结果 ===');
    console.log(`识别到 ${prices.placeholders.length} 个价格:`);
    prices.placeholders.forEach((p, i) => {
        console.log(`  ${i + 1}. $${p.priceValue} (位置: ${p.original.substring(0, 30)})`);
    });
    processedHTML = prices.processedHTML;
    
    // ========== 阶段 6：行内数学公式识别（低优先级，但最复杂）==========
    const mathFormulas = extractMathFormulas(processedHTML);
    processedHTML = replaceMathFormulas(processedHTML, mathFormulas);
    
    // ========== 阶段 7：恢复占位符 ==========
    processedHTML = restorePlaceholders(processedHTML, {
        blockMath: blockMath.placeholders,
        prices: prices.placeholders,
        nbsp: prices.nbspPlaceholders,
        htmlTags: htmlTags.placeholders,
        codeBlocks: codeBlocks.placeholders
    });
    
    return {
        html: processedHTML,
        mathFormulas: mathFormulas.map(m => m.formula),
        prices: prices.placeholders.map(p => p.priceValue),
        mathCount: mathFormulas.length,
        priceCount: prices.placeholders.length
    };
}

// 预编译的正则表达式
const REGEXES = {
    codeBlock: /<(pre|code)[^>]*>[\s\S]*?<\/\1>|<div[^>]*class="[^"]*mermaid[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
    htmlTag: /<[^>]+>/g,
    nbsp: /&nbsp;/g,
    price: /(^|[\s<(\[]|<!--MARKX_NBSP_\d+-->|[\u4e00-\u9fa5])\$(\d+\.?\d{0,2})([\s>.,;:!?]|]|\)|，|。|；|：|！|？|[\u4e00-\u9fa5]|$|<\/)/g,
    inlineMath: /\$([\s\S]*?)\$/g,
    blockMath: /\$\$([\s\S]*?)\$\$/g,
    latexCommand: /\\[a-zA-Z]+|\\[^a-zA-Z]|[\^_\{]|frac|sum|int|sqrt|lim|sin|cos|tan|log|ln|exp|pi|alpha|beta|gamma|delta|theta|lambda|mu|sigma|phi|omega|infty|pm|mp|times|div|leq|geq|neq|approx|equiv|in|notin|subset|supset|cup|cap|emptyset|forall|exists|nabla|partial|cdot|cdots|ldots|vdots|ddots/,
    mathOperators: /[+\-*/=<>≤≥≠≈≡±×÷]/,
    variableExpression: /[a-zA-Z]\s*[+\-*/=<>≤≥≠≈≡±×÷]\s*[a-zA-Z0-9]/,
    functionCall: /[a-zA-Z]\s*\([^)]*\)/,
    superscriptSubscript: /[a-zA-Z0-9]\s*[\^_]\s*[a-zA-Z0-9{}]/,
    formattingTags: /<(strong|em|b|i|u|h[1-6]|p|div|span|a|img|code|pre|ul|ol|li|table|tr|td|th|blockquote)[\s>\/]/i,
    markdownPattern: /\*\*|\*\s+\*|_\s+_|#+\s|```|`/,
    pureNumber: /^\d+\.?\d*$/
};

function extractAndProtectCodeBlocks(html) {
    // 使用正则表达式提取代码块（不依赖 DOM）
    const codeBlockRegex = /<(pre|code)[^>]*>[\s\S]*?<\/\1>|<div[^>]*class="[^"]*mermaid[^"]*"[^>]*>[\s\S]*?<\/div>|<div[^>]*class="[^"]*echarts[^"]*"[^>]*>[\s\S]*?<\/div>/gi;
    
    const matches = [];
    let match;
    
    codeBlockRegex.lastIndex = 0;
    while ((match = codeBlockRegex.exec(html)) !== null) {
        matches.push({
            start: match.index,
            end: match.index + match[0].length,
            content: match[0]
        });
    }
    
    const placeholders = [];
    let index = 0;
    
    // 从后往前替换
    matches.sort((a, b) => b.start - a.start);
    matches.forEach(item => {
        const placeholder = `<!--MARKX_CODE_${index++}-->`;
        placeholders.push({
            placeholder: placeholder,
            content: item.content
        });
        html = html.substring(0, item.start) + 
               placeholder + 
               html.substring(item.end);
    });
    
    return { processedHTML: html, placeholders };
}

function extractAndProtectHtmlTags(html) {
    const matches = [];
    let match;
    
    REGEXES.htmlTag.lastIndex = 0;
    
    while ((match = REGEXES.htmlTag.exec(html)) !== null) {
        if (match[0].includes('<!--MARKX_CODE_')) {
            continue;
        }
        
        matches.push({
            start: match.index,
            end: match.index + match[0].length,
            content: match[0]
        });
    }
    
    const placeholders = [];
    let index = 0;
    
    matches.sort((a, b) => b.start - a.start);
    matches.forEach(item => {
        const placeholder = `<!--MARKX_HTML_TAG_${index++}-->`;
        placeholders.push({
            placeholder: placeholder,
            content: item.content
        });
        html = html.substring(0, item.start) + 
               placeholder + 
               html.substring(item.end);
    });
    
    return { processedHTML: html, placeholders };
}

function extractAndProtectBlockMath(html) {
    html = html.replace(/<p>\s*\$\$([\s\S]*?)\$\$\s*<\/p>/gi, (match, formula) => {
        const cleanedFormula = formula.replace(/<br\s*\/?>/gi, '\n');
        return `$$${cleanedFormula}$$`;
    });
    
    const matches = [];
    let match;
    
    REGEXES.blockMath.lastIndex = 0;
    
    while ((match = REGEXES.blockMath.exec(html)) !== null) {
        if (match[0].includes('<!--MARKX_')) {
            continue;
        }
        
        let formula = match[1];
        formula = formula.replace(/<br\s*\/?>/gi, '\n');
        formula = formula.replace(/<[^>]+>/g, '');
        formula = formula
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'")
            .replace(/&#x27;/g, "'")
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&');
        formula = formula.replace(/[ \t]+/g, ' ').trim();
        
        if (!formula) {
            continue;
        }
        
        matches.push({
            start: match.index,
            end: match.index + match[0].length,
            formula: formula,
            original: match[0]
        });
    }
    
    const placeholders = [];
    let index = 0;
    
    matches.sort((a, b) => b.start - a.start);
    matches.forEach(item => {
        const placeholder = `<!--MARKX_BLOCK_MATH_${index++}-->`;
        placeholders.push({
            placeholder: placeholder,
            formula: item.formula,
            original: item.original
        });
        html = html.substring(0, item.start) + 
               placeholder + 
               html.substring(item.end);
    });
    
    return { processedHTML: html, placeholders };
}

function extractAndProtectPrices(html) {
    const nbspPlaceholders = [];
    let nbspIndex = 0;
    html = html.replace(REGEXES.nbsp, (match) => {
        const placeholder = `<!--MARKX_NBSP_${nbspIndex++}-->`;
        nbspPlaceholders.push({
            placeholder: placeholder,
            original: match
        });
        return placeholder;
    });
    
    const priceMatches = [];
    let priceMatch;
    
    REGEXES.price.lastIndex = 0;
    
    while ((priceMatch = REGEXES.price.exec(html)) !== null) {
        const beforeChar = priceMatch[1];
        const afterChar = priceMatch[3];
        
        if (REGEXES.mathOperators.test(beforeChar)) {
            continue;
        }
        
        if (/[\^_{}]/.test(afterChar)) {
            continue;
        }
        
        const beforeIsLetter = /[a-zA-Z]/.test(beforeChar);
        const afterIsLetter = /[a-zA-Z]/.test(afterChar);
        if (beforeIsLetter && afterIsLetter) {
            continue;
        }
        
        priceMatches.push({
            start: priceMatch.index,
            end: priceMatch.index + priceMatch[0].length,
            fullMatch: priceMatch[0],
            beforeChar: priceMatch[1],
            priceValue: priceMatch[2],
            afterChar: priceMatch[3]
        });
    }
    
    const placeholders = [];
    let priceIndex = 0;
    
    priceMatches.sort((a, b) => b.start - a.start);
    priceMatches.forEach(item => {
        const placeholder = `<!--MARKX_PRICE_${priceIndex++}-->`;
        placeholders.push({
            placeholder: placeholder,
            original: item.fullMatch,
            beforeChar: item.beforeChar,
            priceValue: item.priceValue,
            afterChar: item.afterChar
        });
        html = html.substring(0, item.start) + 
               `${item.beforeChar}${placeholder}${item.afterChar}` + 
               html.substring(item.end);
    });
    
    return { 
        processedHTML: html, 
        placeholders,
        nbspPlaceholders 
    };
}

function extractMathFormulas(html) {
    const mathMatches = [];
    let match;
    
    // 调试：显示处理后的 HTML 片段
    console.log('\n=== 开始识别数学公式 ===');
    console.log('处理后的 HTML 片段（包含数学公式的部分）:');
    // 查找所有包含 $ 的片段
    const dollarMatches = [];
    let dollarIndex = 0;
    while ((dollarIndex = html.indexOf('$', dollarIndex)) !== -1) {
        const start = Math.max(0, dollarIndex - 20);
        const end = Math.min(html.length, dollarIndex + 50);
        dollarMatches.push(html.substring(start, end));
        dollarIndex++;
        if (dollarMatches.length >= 10) break;
    }
    dollarMatches.forEach((section, i) => {
        console.log(`  ${i + 1}. ${section.replace(/\n/g, '\\n')}`);
    });
    
    // 改进的匹配策略：先找到所有 $ 符号的位置，然后尝试匹配成对的 $
    const dollarPositions = [];
    let pos = 0;
    while ((pos = html.indexOf('$', pos)) !== -1) {
        dollarPositions.push(pos);
        pos++;
    }
    
    console.log(`\n找到 ${dollarPositions.length} 个 $ 符号位置`);
    // 显示所有 $ 符号的位置和上下文
    dollarPositions.forEach((pos, i) => {
        const context = html.substring(Math.max(0, pos - 10), Math.min(html.length, pos + 30));
        console.log(`  ${i+1}. 位置 ${pos}: ...${context.replace(/\n/g, '\\n')}...`);
    });
    
    // 尝试匹配成对的 $
    const usedPositions = new Set();
    
    for (let i = 0; i < dollarPositions.length; i++) {
        if (usedPositions.has(dollarPositions[i])) {
            continue;
        }
        
        const startPos = dollarPositions[i];
        
        // 检查前后是否有另一个 $（避免匹配到 $$）
        const beforeChar = startPos > 0 ? html[startPos - 1] : '';
        const afterChar = startPos + 1 < html.length ? html[startPos + 1] : '';
        
        if (beforeChar === '$' || afterChar === '$') {
            continue;
        }
        
        // 从当前位置开始，查找匹配的结束 $
        for (let j = i + 1; j < dollarPositions.length; j++) {
            const endPos = dollarPositions[j];
            
            if (usedPositions.has(endPos)) {
                continue;
            }
            
            // 检查结束位置前后是否有另一个 $（避免匹配到 $$）
            const endBeforeChar = endPos > 0 ? html[endPos - 1] : '';
            const endAfterChar = endPos + 1 < html.length ? html[endPos + 1] : '';
            
            if (endBeforeChar === '$' || endAfterChar === '$') {
                continue;
            }
            
            // 提取公式内容
            const formulaContent = html.substring(startPos + 1, endPos);
            
            // 检查内容是否跨越了占位符（关键修复）
            if (formulaContent.includes('<!--MARKX_')) {
                // 如果跨越了占位符，跳过这个匹配
                continue;
            }
            
            // 检查内容是否跨越了价格占位符
            if (formulaContent.includes('<!--MARKX_PRICE_')) {
                continue;
            }
            
            // 创建匹配对象
            const match = {
                index: startPos,
                0: html.substring(startPos, endPos + 1),
                1: formulaContent
            };
            
            const rawFormula = match[1];
            const cleanedFormula = cleanFormula(rawFormula);
            
            // 调试：显示包含 a^2, b^2, c^2 的公式
            if (cleanedFormula.includes('a^2') || cleanedFormula.includes('b^2') || cleanedFormula.includes('c^2')) {
                const beforeChar = startPos > 0 ? html[startPos - 1] : '';
                const afterChar = endPos + 1 < html.length ? html[endPos + 1] : '';
                console.log(`\n尝试匹配公式: '${match[0]}' -> '${cleanedFormula}'`);
                console.log(`  位置: ${startPos}-${endPos}`);
                console.log(`  前后字符: '${beforeChar}' (${beforeChar.charCodeAt(0)}) ... '${afterChar}' (${afterChar.charCodeAt(0)})`);
                const isValid = isValidMathFormula(match, html);
                console.log(`  是否有效: ${isValid}`);
                if (!isValid) {
                    const hasFeatures = hasMathFeatures(cleanedFormula);
                    const isMis = isMisMatch(rawFormula, cleanedFormula);
                    const hasContext = hasValidContext(match, html);
                    console.log(`  有数学特征: ${hasFeatures}`);
                    console.log(`  是误匹配: ${isMis}`);
                    console.log(`  上下文有效: ${hasContext}`);
                }
            }
            
            if (isValidMathFormula(match, html)) {
                const formula = cleanFormula(match[1]);
                console.log(`✓ 识别数学公式: ${formula} (位置 ${startPos}-${endPos})`);
                mathMatches.push({
                    start: startPos,
                    end: endPos + 1,
                    formula: formula,
                    original: match[0]
                });
                
                // 标记这两个位置已使用
                usedPositions.add(startPos);
                usedPositions.add(endPos);
                break; // 找到匹配的结束 $，跳出内层循环
            }
        }
    }
    
    console.log('\n=== 数学公式识别完成 ===\n');
    return mathMatches;
}

function isValidMathFormula(match, context) {
    const rawFormula = match[1];
    const cleanedFormula = cleanFormula(rawFormula);
    
    if (!hasMathFeatures(cleanedFormula)) {
        return false;
    }
    
    if (isMisMatch(rawFormula, cleanedFormula)) {
        return false;
    }
    
    if (!hasValidContext(match, context)) {
        return false;
    }
    
    return true;
}

function hasMathFeatures(formula) {
    if (REGEXES.latexCommand.test(formula)) {
        return true;
    }
    
    if (REGEXES.mathOperators.test(formula)) {
        return true;
    }
    
    if (REGEXES.variableExpression.test(formula)) {
        return true;
    }
    
    if (REGEXES.functionCall.test(formula)) {
        return true;
    }
    
    if (REGEXES.superscriptSubscript.test(formula)) {
        return true;
    }
    
    return false;
}

function cleanFormula(formula) {
    formula = formula
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&');
    
    formula = formula.replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ').trim();
    
    return formula;
}

function isMisMatch(rawFormula, cleanFormula) {
    if (REGEXES.pureNumber.test(cleanFormula)) {
        return true;
    }
    
    if (REGEXES.formattingTags.test(rawFormula)) {
        return true;
    }
    
    if (REGEXES.markdownPattern.test(rawFormula)) {
        return true;
    }
    
    const lineBreakCount = (rawFormula.match(/<br\s*\/?>/gi) || []).length;
    if (lineBreakCount > 1) {
        return true;
    }
    
    if (cleanFormula.length < 2 && !hasMathFeatures(cleanFormula)) {
        return true;
    }
    
    if (cleanFormula.length > 100 && !hasMathFeatures(cleanFormula)) {
        return true;
    }
    
    return false;
}

function hasValidContext(match, context) {
    const beforeChar = match.index > 0 ? context[match.index - 1] : '';
    const afterChar = match.index + match[0].length < context.length ? 
                      context[match.index + match[0].length] : '';
    
    // 检查前后字符是否是占位符的一部分（应该允许）
    const beforeIsPlaceholder = beforeChar === '-' && context.substring(Math.max(0, match.index - 50), match.index).includes('<!--MARKX_');
    const afterIsPlaceholder = afterChar === '-' && context.substring(match.index + match[0].length, Math.min(context.length, match.index + match[0].length + 50)).includes('<!--MARKX_');
    
    // 数学公式前通常是：空格、标点（中英文）、行首、HTML 标签结束、占位符结束
    // 数学公式后通常是：空格、标点（中英文）、行尾、HTML 标签开始、占位符开始
    // 中文标点：，。；：！？等
    const validBefore = /^[\s.,;:!?)\]}>，。；：！？]|^$/.test(beforeChar) || beforeIsPlaceholder;
    const validAfter = /^[\s.,;:!?)\]}>，。；：！？]|^$/.test(afterChar) || afterIsPlaceholder;
    
    return validBefore && validAfter;
}

function replaceMathFormulas(html, mathMatches) {
    mathMatches.sort((a, b) => b.start - a.start);
    mathMatches.forEach(item => {
        const safeFormula = escapeHtml(item.formula);
        const replacement = `<span class="katex-inline">${safeFormula}</span>`;
        html = html.substring(0, item.start) + 
               replacement + 
               html.substring(item.end);
    });
    return html;
}

function restorePlaceholders(html, placeholders) {
    placeholders.blockMath.sort((a, b) => {
        const aIndex = html.lastIndexOf(a.placeholder);
        const bIndex = html.lastIndexOf(b.placeholder);
        return bIndex - aIndex;
    });
    placeholders.blockMath.forEach(item => {
        const safeFormula = escapeHtml(item.formula)
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        html = html.replace(item.placeholder, `<div class="katex-block">${safeFormula}</div>`);
    });
    
    placeholders.prices.sort((a, b) => {
        const aIndex = html.lastIndexOf(a.placeholder);
        const bIndex = html.lastIndexOf(b.placeholder);
        return bIndex - aIndex;
    });
    placeholders.prices.forEach(item => {
        html = html.replace(item.placeholder, `$${item.priceValue}`);
    });
    
    placeholders.nbsp.forEach(item => {
        html = html.replace(item.placeholder, item.original);
    });
    
    placeholders.htmlTags.forEach(item => {
        html = html.split(item.placeholder).join(item.content);
    });
    
    placeholders.codeBlocks.forEach(item => {
        html = html.split(item.placeholder).join(item.content);
    });
    
    return html;
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// 主测试函数
function testMathDetection() {
    const testFile = path.join(__dirname, 'test-math-price.md');
    const markdown = fs.readFileSync(testFile, 'utf-8');
    
    console.log('=== 测试文件：test-math-price.md ===\n');
    console.log('原始 Markdown:');
    console.log(markdown);
    console.log('\n' + '='.repeat(80) + '\n');
    
    // 转换为 HTML
    const html = mockMarkedParse(markdown);
    console.log('转换后的 HTML:');
    console.log(html);
    console.log('\n' + '='.repeat(80) + '\n');
    
    // 使用新方案识别数学公式
    const result = processMathInHTML(html);
    
    console.log('识别结果:');
    console.log(`  数学公式数量: ${result.mathCount}`);
    console.log(`  价格数量: ${result.priceCount}`);
    console.log('\n识别到的数学公式:');
    if (result.mathFormulas.length > 0) {
        result.mathFormulas.forEach((formula, index) => {
            console.log(`  ${index + 1}. ${formula}`);
        });
    } else {
        console.log('  （无）');
    }
    console.log('\n识别到的价格:');
    if (result.prices.length > 0) {
        result.prices.forEach((price, index) => {
            console.log(`  ${index + 1}. $${price}`);
        });
    } else {
        console.log('  （无）');
    }
    console.log('\n' + '='.repeat(80) + '\n');
    console.log('处理后的 HTML（前 500 字符）:');
    console.log(result.html.substring(0, 500) + '...');
}

// 运行测试
testMathDetection();