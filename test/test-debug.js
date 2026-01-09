// 调试测试场景1
const html = '<h2 id="价格-123">价格$123</h2>';

// 处理 &nbsp; 占位符
let processedHTML = html.replace(/&nbsp;/g, (match) => {
    return `<!--MARKX_NBSP_0-->`;
});

console.log('处理后HTML:', processedHTML);

// 价格正则
const priceRegex = /(^|[\s<(\[]|<!--MARKX_NBSP_\d+-->|[\u4e00-\u9fa5])\$(\d+\.?\d*)([\s>.,;:!?]|]|\)|，|。|；|：|！|？|$|<\/)/g;

let match;
let matches = [];
while ((match = priceRegex.exec(processedHTML)) !== null) {
    matches.push({
        fullMatch: match[0],
        beforeChar: match[1],
        priceValue: match[2],
        afterChar: match[3],
        index: match.index
    });
    console.log('匹配到:', match[0], 'beforeChar:', match[1], 'priceValue:', match[2], 'afterChar:', match[3]);
}

console.log('总匹配数:', matches.length);

// 尝试不同的正则
console.log('\n尝试匹配中文字符后的$:');
const testRegex = /[\u4e00-\u9fa5]\$/g;
let testMatch;
while ((testMatch = testRegex.exec(processedHTML)) !== null) {
    console.log('找到:', testMatch[0], '位置:', testMatch.index);
}
