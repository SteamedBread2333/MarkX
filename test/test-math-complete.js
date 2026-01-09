/**
 * 完整测试：验证所有场景的价格和数学公式处理
 */

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
    const priceRegex = /(^|[\s<(\[]|<!--MARKX_NBSP_\d+-->)\$(\d+\.?\d*)([\s>.,;:!?]|]|\)|，|。|；|：|！|？|$|<\/)/g;
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
        
        // 验证是否是数学公式
        const latexCommandPattern = /\\[a-zA-Z]+|\\[^a-zA-Z]|[\^_\{]|frac|sum|int|sqrt|lim|sin|cos|tan|log|ln|exp|pi|alpha|beta|gamma|delta|theta|lambda|mu|sigma|phi|omega|infty|pm|mp|times|div|leq|geq|neq|approx|equiv|in|notin|subset|supset|cup|cap|emptyset|forall|exists|nabla|partial|cdot|cdots|ldots|vdots|ddots/;
        const isLikelyMath = latexCommandPattern.test(formula) || 
                            /[+\-*/=<>≤≥≠≈≡±×÷]/.test(formula) ||
                            /[a-zA-Z]\s*[+\-*/=<>≤≥≠≈≡±×÷]\s*[a-zA-Z0-9]/.test(formula);
        
        if (isLikelyMath && formula.length < 100) {
            mathMatches.push({
                start: match.index,
                end: match.index + match[0].length,
                formula: formula,
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

// 所有测试场景
const tests = [
    {
        name: '测试场景 1：价格在标题中',
        html: '<h2>价格&nbsp;$123</h2>',
        expectedPrices: 1,
        expectedFormulas: 0
    },
    {
        name: '测试场景 2：价格和数学公式混合',
        html: '<p><strong>混合使用</strong>：</p><p>$E = mc^2$ 是质能方程。</p>',
        expectedPrices: 0,
        expectedFormulas: 1
    },
    {
        name: '测试场景 3：价格和数学公式在同一行',
        html: '<p>价格 $50，公式 $x = y + z$ 是数学公式。</p>',
        expectedPrices: 1,
        expectedFormulas: 1
    },
    {
        name: '测试场景 4：标题和正文都有价格和公式',
        html: '<h2>标题价格&nbsp;$50</h2><p>正文价格 $30，数学公式 $f(x) = x^2$。</p>',
        expectedPrices: 2,
        expectedFormulas: 1
    },
    {
        name: '测试场景 5：多个价格',
        html: '<p>价格 $100 和 $200 都很便宜。</p>',
        expectedPrices: 2,
        expectedFormulas: 0
    },
    {
        name: '测试场景 6：复杂数学公式',
        html: '<p>$E = mc^2$ 和 $\\sum_{i=1}^{n} x_i$ 都是数学公式。</p>',
        expectedPrices: 0,
        expectedFormulas: 2
    },
    {
        name: '测试场景 7：价格格式边界',
        html: '<p>($100) 和 [$200] 都是价格。</p>',
        expectedPrices: 2,
        expectedFormulas: 0
    },
    {
        name: '测试场景 8：价格后跟标点',
        html: '<p>价格 $123.45，价格 $67.89；价格 $10.00。</p>',
        expectedPrices: 3,
        expectedFormulas: 0
    }
];

let allPassed = true;
tests.forEach((test, index) => {
    const result = mockProcessMathInHTML(test.html);
    const pricesMatch = result.priceCount === test.expectedPrices;
    const formulasMatch = result.formulaCount === test.expectedFormulas;
    const passed = pricesMatch && formulasMatch;
    
    if (!passed) {
        allPassed = false;
    }
    
    console.log(`\n${test.name}:`);
    console.log(`  价格: ${result.priceCount}/${test.expectedPrices} ${pricesMatch ? '✓' : '✗'}`);
    console.log(`  数学公式: ${result.formulaCount}/${test.expectedFormulas} ${formulasMatch ? '✓' : '✗'}`);
    if (!passed) {
        console.log(`  价格列表: [${result.prices.join(', ')}]`);
        console.log(`  公式列表: [${result.formulas.join(', ')}]`);
    }
});

console.log(`\n${allPassed ? '✓ 所有测试通过！' : '✗ 部分测试失败'}`);
