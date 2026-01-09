/**
 * 真实场景测试：使用 Marked 解析 Markdown，然后测试 processMathInHTML
 * 这个测试更接近实际运行情况
 */

// 模拟 marked 的基本功能
function mockMarkedParse(markdown) {
    // 简单的 Marked 模拟，处理标题和段落
    let html = markdown;
    
    // 处理标题
    html = html.replace(/^##\s+(.+)$/gm, (match, text) => {
        const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-+|-+$/g, '');
        const textWithSpaces = text.replace(/ /g, '&nbsp;');
        return `<h2 id="${id}">${textWithSpaces}</h2>`;
    });
    
    // 处理粗体
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // 处理段落（简单处理）
    html = html.split('\n\n').map(para => {
        if (para.trim() && !para.trim().startsWith('<')) {
            return `<p>${para.trim()}</p>`;
        }
        return para;
    }).join('\n');
    
    // 处理换行
    html = html.replace(/\n/g, '<br>');
    
    return html;
}

// 模拟 processMathInHTML 的核心逻辑（简化版）
function mockProcessMathInHTML(html) {
    let processedHTML = html;
    
    // 1. 处理 HTML 实体编码的 $
    processedHTML = processedHTML.replace(/&#36;/g, '$');
    
    // 2. 处理 &nbsp; 占位符
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
    
    // 3. 识别价格格式
    const pricePlaceholders = [];
    let priceIndex = 0;
    // 匹配价格格式：行首/空格/&nbsp;占位符/</(/[/中文字符 后的 $数字
    const priceRegex = /(^|[\s<(\[]|<!--MARKX_NBSP_\d+-->|[\u4e00-\u9fa5])\$(\d+\.?\d*)([\s>.,;:!?]|]|\)|，|。|；|：|！|？|$|<\/)/g;
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
    
    // 4. 替换价格格式为占位符
    pricePlaceholders.sort((a, b) => {
        const aIndex = processedHTML.lastIndexOf(a.original);
        const bIndex = processedHTML.lastIndexOf(b.original);
        return bIndex - aIndex;
    });
    
    pricePlaceholders.forEach(item => {
        processedHTML = processedHTML.replace(item.original, `${item.beforeChar}${item.placeholder}${item.afterChar}`);
    });
    
    // 5. 匹配数学公式
    const inlineMathRegex = /\$([\s\S]*?)\$/g;
    const mathMatches = [];
    let match;
    
    while ((match = inlineMathRegex.exec(processedHTML)) !== null) {
        // 跳过占位符
        if (match[0].includes('<!--MARKX_CODE_') || 
            match[0].includes('<!--MARKX_PRICE_') || 
            match[0].includes('<!--MARKX_NBSP_')) {
            continue;
        }
        
        // 检查前后是否有另一个$（避免匹配到$$）
        const beforeChar = match.index > 0 ? processedHTML[match.index - 1] : '';
        const afterChar = match.index + match[0].length < processedHTML.length ? 
                          processedHTML[match.index + match[0].length] : '';
        
        if (beforeChar === '$' || afterChar === '$') {
            continue;
        }
        
        const formula = match[1].trim();
        
        // 清理 HTML 标签
        let cleanFormula = formula.replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ').trim();
        cleanFormula = cleanFormula
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'")
            .replace(/&#x27;/g, "'")
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&');
        
        // 验证是否是数学公式
        const latexCommandPattern = /\\[a-zA-Z]+|\\[^a-zA-Z]|[\^_\{]|frac|sum|int|sqrt|lim|sin|cos|tan|log|ln|exp|pi|alpha|beta|gamma|delta|theta|lambda|mu|sigma|phi|omega|infty|pm|mp|times|div|leq|geq|neq|approx|equiv|in|notin|subset|supset|cup|cap|emptyset|forall|exists|nabla|partial|cdot|cdots|ldots|vdots|ddots/;
        const isLikelyMath = latexCommandPattern.test(cleanFormula) || 
                            /[+\-*/=<>≤≥≠≈≡±×÷]/.test(cleanFormula) ||
                            /[a-zA-Z]\s*[+\-*/=<>≤≥≠≈≡±×÷]\s*[a-zA-Z0-9]/.test(cleanFormula);
        
        if (isLikelyMath && cleanFormula.length < 100) {
            mathMatches.push({
                start: match.index,
                end: match.index + match[0].length,
                formula: cleanFormula,
                original: match[0]
            });
        }
    }
    
    // 6. 替换数学公式
    mathMatches.sort((a, b) => b.start - a.start);
    mathMatches.forEach(item => {
        processedHTML = processedHTML.substring(0, item.start) + 
                       `<span class="katex-inline">${item.formula}</span>` + 
                       processedHTML.substring(item.end);
    });
    
    // 7. 恢复价格占位符
    pricePlaceholders.sort((a, b) => {
        const aIndex = processedHTML.lastIndexOf(a.placeholder);
        const bIndex = processedHTML.lastIndexOf(b.placeholder);
        return bIndex - aIndex;
    });
    pricePlaceholders.forEach(item => {
        processedHTML = processedHTML.replace(item.placeholder, `$${item.priceValue}`);
    });
    
    // 8. 恢复 &nbsp; 占位符
    nbspPlaceholders.forEach(item => {
        processedHTML = processedHTML.replace(item.placeholder, item.original);
    });
    
    return {
        result: processedHTML,
        prices: pricePlaceholders.map(p => p.priceValue),
        formulas: mathMatches.map(m => m.formula),
        priceCount: pricePlaceholders.length,
        formulaCount: mathMatches.length
    };
}

// 测试场景
const testCases = [
    {
        name: '测试场景 1：价格在标题中',
        markdown: '## 价格$123',
        expectedPrices: 1,
        expectedFormulas: 0
    },
    {
        name: '测试场景 2：价格和数学公式混合',
        markdown: '**混合使用**：\n\n$E = mc^2$ 是质能方程。',
        expectedPrices: 0,
        expectedFormulas: 1
    },
    {
        name: '测试场景 3：价格和数学公式在同一行',
        markdown: '价格 $50，公式 $x = y + z$ 是数学公式。',
        expectedPrices: 1,
        expectedFormulas: 1
    },
    {
        name: '测试场景 4：标题和正文都有价格和公式',
        markdown: '## 标题价格 $50\n\n正文价格 $30，数学公式 $f(x) = x^2$。',
        expectedPrices: 2,
        expectedFormulas: 1
    }
];

console.log('=== 真实场景测试（使用 Marked 解析）===\n');

testCases.forEach((test, index) => {
    const html = mockMarkedParse(test.markdown);
    console.log(`\n${test.name}:`);
    console.log(`Markdown: ${test.markdown}`);
    console.log(`HTML: ${html}`);
    
    const result = mockProcessMathInHTML(html);
    const pricesMatch = result.priceCount === test.expectedPrices;
    const formulasMatch = result.formulaCount === test.expectedFormulas;
    const passed = pricesMatch && formulasMatch;
    
    console.log(`  价格: ${result.priceCount}/${test.expectedPrices} ${pricesMatch ? '✓' : '✗'}`);
    console.log(`  数学公式: ${result.formulaCount}/${test.expectedFormulas} ${formulasMatch ? '✓' : '✗'}`);
    console.log(`  价格列表: [${result.prices.join(', ')}]`);
    console.log(`  公式列表: [${result.formulas.join(', ')}]`);
    console.log(`  结果: ${result.result.substring(0, 200)}...`);
    
    if (!passed) {
        console.log(`  ❌ 测试失败！`);
    }
});
