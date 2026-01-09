/**
 * Ace Editor 自动完成配置模块
 * 为 Markdown 编辑器提供智能自动完成功能
 */

import { t } from '../core/i18n.js';

/**
 * 检测光标是否在字符串内
 */
function isInsideString(session, pos) {
    try {
        const line = session.getLine(pos.row);
        const beforeCursor = line.substring(0, pos.column);
        
        // 检测单引号、双引号、反引号
        let inSingleQuote = false;
        let inDoubleQuote = false;
        let inBacktick = false;
        let escapeNext = false;
        
        for (let i = 0; i < beforeCursor.length; i++) {
            const char = beforeCursor[i];
            
            if (escapeNext) {
                escapeNext = false;
                continue;
            }
            
            if (char === '\\') {
                escapeNext = true;
                continue;
            }
            
            if (char === "'" && !inDoubleQuote && !inBacktick) {
                inSingleQuote = !inSingleQuote;
            } else if (char === '"' && !inSingleQuote && !inBacktick) {
                inDoubleQuote = !inDoubleQuote;
            } else if (char === '`' && !inSingleQuote && !inDoubleQuote) {
                inBacktick = !inBacktick;
            }
        }
        
        return inSingleQuote || inDoubleQuote || inBacktick;
    } catch (error) {
        return false;
    }
}

/**
 * 检测光标是否在代码块或引用块内，并返回代码块的语言类型
 * @returns {Object} { inCodeBlock: boolean, language: string|null, inBlockquote: boolean }
 */
function checkIfInsideBlock(session, pos) {
    const lines = session.getLines(0, pos.row + 1);
    let inCodeBlock = false;
    let inBlockquote = false;
    let codeBlockMarker = null;
    let codeBlockLanguage = null;
    let codeBlockOriginalLanguage = null;
    let codeBlockStartRow = -1;
    
    // 检查当前行及之前的行
    for (let i = 0; i <= pos.row; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();
        
        // 检测代码块开始/结束
        if (trimmedLine.startsWith('```')) {
            if (inCodeBlock && codeBlockMarker === '```') {
                // 代码块结束
                if (i < pos.row) {
                    inCodeBlock = false;
                    codeBlockMarker = null;
                    codeBlockLanguage = null;
                    codeBlockOriginalLanguage = null;
                    codeBlockStartRow = -1;
                } else {
                    // 当前行是结束标记，但光标可能在标记上
                    return { 
                        inCodeBlock: true, 
                        language: codeBlockLanguage, 
                        originalLanguage: codeBlockOriginalLanguage,
                        inBlockquote: false 
                    };
                }
            } else {
                // 代码块开始，提取语言类型
                inCodeBlock = true;
                codeBlockMarker = '```';
                codeBlockStartRow = i;
                // 提取语言：```language 或 ```language:title
                const match = trimmedLine.match(/^```(\w+)/);
                codeBlockOriginalLanguage = match ? match[1].toLowerCase() : null;
                codeBlockLanguage = codeBlockOriginalLanguage;
                // echarts 块使用 JavaScript 语法高亮
                if (codeBlockLanguage === 'echarts') {
                    codeBlockLanguage = 'javascript';
                }
                // katex 块使用 katex 自动完成
                if (codeBlockLanguage === 'katex') {
                    codeBlockLanguage = 'katex';
                }
            }
        } else if (trimmedLine.startsWith('~~~')) {
            if (inCodeBlock && codeBlockMarker === '~~~') {
                // 代码块结束
                if (i < pos.row) {
                    inCodeBlock = false;
                    codeBlockMarker = null;
                    codeBlockLanguage = null;
                    codeBlockOriginalLanguage = null;
                    codeBlockStartRow = -1;
                } else {
                    return { 
                        inCodeBlock: true, 
                        language: codeBlockLanguage, 
                        originalLanguage: codeBlockOriginalLanguage,
                        inBlockquote: false 
                    };
                }
            } else {
                inCodeBlock = true;
                codeBlockMarker = '~~~';
                codeBlockStartRow = i;
                // 提取语言：~~~language
                const match = trimmedLine.match(/^~~~(\w+)/);
                codeBlockOriginalLanguage = match ? match[1].toLowerCase() : null;
                codeBlockLanguage = codeBlockOriginalLanguage;
                // echarts 块使用 JavaScript 语法高亮
                if (codeBlockLanguage === 'echarts') {
                    codeBlockLanguage = 'javascript';
                }
                // katex 块使用 katex 自动完成
                if (codeBlockLanguage === 'katex') {
                    codeBlockLanguage = 'katex';
                }
            }
        }
        
        // 检测引用块（以 > 开头）
        if (trimmedLine.startsWith('>') && !inCodeBlock) {
            inBlockquote = true;
        } else if (!trimmedLine.startsWith('>') && !trimmedLine.startsWith(' ') && trimmedLine.length > 0 && !inCodeBlock) {
            // 如果遇到非引用行且不是空行或缩进行，则退出引用块
            if (i < pos.row) {
                inBlockquote = false;
            }
        }
    }
    
    // 如果当前行在代码块内
    if (inCodeBlock && pos.row >= 0 && pos.row > codeBlockStartRow) {
        return { 
            inCodeBlock: true, 
            language: codeBlockLanguage, 
            originalLanguage: codeBlockOriginalLanguage === 'echarts' ? 'echarts' : null,
            inBlockquote: false 
        };
    }
    
    // 如果当前行在引用块内
    if (inBlockquote && pos.row >= 0) {
        const currentLine = lines[pos.row];
        if (currentLine.trim().startsWith('>')) {
            return { inCodeBlock: false, language: null, originalLanguage: null, inBlockquote: true };
        }
    }
    
    return { inCodeBlock: false, language: null, originalLanguage: null, inBlockquote: false };
}

/**
 * 获取占位符文本的辅助函数
 */
function ph(key) {
    return t(`autocomplete.placeholders.${key}`);
}

/**
 * 获取 Markdown 自动完成项配置
 * 根据当前语言返回相应的完成项
 */
function getMarkdownCompletions() {
    return [
    // ==================== 标题 ====================
    { name: 'h1', value: `# \${1:${ph('heading')}}`, meta: t('ui.help.sections.templates.items.h1-h6'), score: 1000 },
    { name: 'h2', value: `## \${1:${ph('heading')}}`, meta: t('ui.help.sections.templates.items.h1-h6'), score: 1000 },
    { name: 'h3', value: `### \${1:${ph('heading')}}`, meta: t('ui.help.sections.templates.items.h1-h6'), score: 1000 },
    { name: 'h4', value: `#### \${1:${ph('heading')}}`, meta: t('ui.help.sections.templates.items.h1-h6'), score: 1000 },
    { name: 'h5', value: `##### \${1:${ph('heading')}}`, meta: t('ui.help.sections.templates.items.h1-h6'), score: 1000 },
    { name: 'h6', value: `###### \${1:${ph('heading')}}`, meta: t('ui.help.sections.templates.items.h1-h6'), score: 1000 },
    
    // ==================== 文本格式 ====================
    { name: 'bold', value: `**\${1:${ph('text')}}**`, meta: t('ui.help.sections.templates.items.bold'), score: 950 },
    { name: 'italic', value: `*\${1:${ph('text')}}*`, meta: t('ui.help.sections.templates.items.italic'), score: 950 },
    { name: 'bold-italic', value: `***\${1:${ph('text')}}***`, meta: t('autocomplete.meta.boldItalic'), score: 900 },
    { name: 'strikethrough', value: `~~\${1:${ph('text')}}~~`, meta: t('autocomplete.meta.strikethrough'), score: 900 },
    { name: 'code-inline', value: '`${1:' + ph('code') + '}`', meta: t('ui.help.sections.templates.items.code-inline'), score: 950 },
    { name: 'mark', value: `==\${1:${ph('text')}}==`, meta: t('autocomplete.meta.mark'), score: 850 },
    
    // ==================== 链接和图片 ====================
    { name: 'link', value: `[\${1:${ph('linkText')}}](\${2:${ph('url')}})`, meta: t('ui.help.sections.templates.items.link'), score: 950 },
    { name: 'image', value: `![\${1:${ph('imageDesc')}}](\${2:${ph('imageUrl')}})`, meta: t('ui.help.sections.templates.items.image'), score: 950 },
    { name: 'reference-link', value: `[\${1:${ph('linkText')}}][\${2:${ph('reference')}}]`, meta: t('autocomplete.meta.referenceLink'), score: 850 },
    { name: 'auto-link', value: `<\${1:${ph('url')}}>`, meta: t('autocomplete.meta.autoLink'), score: 800 },
    
    // ==================== 列表 ====================
    { name: 'ul', value: `- \${1:${ph('listItem')}}`, meta: t('ui.help.sections.templates.items.ul'), score: 950 },
    { name: 'ol', value: `1. \${1:${ph('listItem')}}`, meta: t('ui.help.sections.templates.items.ol'), score: 950 },
    { name: 'task', value: `- [ ] \${1:${ph('taskItem')}}`, meta: t('ui.help.sections.templates.items.task'), score: 950 },
    { name: 'nested-ul', value: `- \${1:${ph('listItem')}}\n  - \${2:${ph('subItem')}}`, meta: t('ui.help.sections.templates.items.nested-ul'), score: 850 },
    
    // ==================== 代码块 ====================
    { name: 'code-block', value: '```${1:' + ph('language') + '}\n${2:' + ph('code') + '}\n```', meta: t('ui.help.sections.templates.items.code-block'), score: 950 },
    { name: 'code-js', value: '```javascript\n${1:' + ph('cCode') + '}\n```', meta: 'JavaScript', score: 900 },
    { name: 'code-ts', value: '```typescript\n${1:' + ph('cCode') + '}\n```', meta: 'TypeScript', score: 900 },
    { name: 'code-python', value: '```python\n${1:' + ph('pythonCode') + '}\n```', meta: 'Python', score: 900 },
    { name: 'code-java', value: '```java\n${1:' + ph('cCode') + '}\n```', meta: 'Java', score: 900 },
    { name: 'code-cpp', value: '```cpp\n${1:' + ph('cCode') + '}\n```', meta: 'C++', score: 900 },
    { name: 'code-css', value: '```css\n${1:' + ph('cssStyle') + '}\n```', meta: 'CSS', score: 900 },
    { name: 'code-html', value: '```html\n${1:' + ph('htmlComment') + '}\n```', meta: 'HTML', score: 900 },
    { name: 'code-json', value: '```json\n${1:{\n  "key": "value"\n}}\n```', meta: 'JSON', score: 900 },
    { name: 'code-echarts', value: '```echarts\n' + '{\n  "title": {\n    "text": "Monthly Sales",\n    "left": "center"\n  },\n  "xAxis": {\n    "type": "category",\n    "data": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]\n  },\n  "yAxis": {\n    "type": "value"\n  },\n  "series": [{\n    "type": "bar",\n    "data": [120, 200, 150, 80, 70, 110]\n  }]\n}\n' + '```', meta: 'ECharts', score: 900 },
    { name: 'code-bash', value: '```bash\n${1:' + ph('bashCmd') + '}\n```', meta: 'Bash/Shell', score: 900 },
    { name: 'code-sql', value: '```sql\n${1:' + ph('sqlQuery') + '}\n```', meta: 'SQL', score: 900 },
    { name: 'code-go', value: '```go\n${1:' + ph('goCode') + '}\n```', meta: 'Go', score: 900 },
    { name: 'code-yaml', value: '```yaml\n${1:' + ph('yamlConfig') + '}\n```', meta: 'YAML', score: 900 },
    
    // ==================== 表格 ====================
    { name: 'table', value: '| ${1:' + ph('column1') + '} | ${2:' + ph('column2') + '} | ${3:' + ph('column3') + '} |\n| --- | --- | --- |\n| ${4:' + ph('cell1') + '} | ${5:' + ph('cell2') + '} | ${6:' + ph('cell3') + '} |', meta: t('ui.help.sections.templates.items.table'), score: 950 },
    { name: 'table-2col', value: '| ${1:' + ph('column1') + '} | ${2:' + ph('column2') + '} |\n| --- | --- |\n| ${3:' + ph('cell1') + '} | ${4:' + ph('cell2') + '} |', meta: t('ui.help.sections.templates.items.table-2col'), score: 950 },
    
    // ==================== 引用 ====================
    { name: 'blockquote', value: '> ${1:' + ph('quoteContent') + '}', meta: t('ui.help.sections.templates.items.blockquote'), score: 950 },
    
    // ==================== 分隔线 ====================
    { name: 'hr', value: '---\n', meta: t('ui.help.sections.templates.items.hr'), score: 900 },
    
    // ==================== Mermaid 图表 ====================
    { name: 'mermaid-flowchart', value: '```mermaid\ngraph TD\n    A[${1:' + ph('start') + '}] --> B{${2:' + ph('condition') + '}}\n    B -->|${3:' + ph('yes') + '}| C[${4:' + ph('action1') + '}]\n    B -->|${5:' + ph('no') + '}| D[${6:' + ph('action2') + '}]\n    C --> E[${7:' + ph('end') + '}]\n    D --> E\n```\n', meta: t('ui.help.sections.templates.items.mermaid-flowchart'), score: 900 },
    { name: 'mermaid-sequence', value: '```mermaid\nsequenceDiagram\n    participant A as ${1:' + ph('user') + '}\n    participant B as ${2:' + ph('system') + '}\n    participant C as ${3:' + ph('database') + '}\n    \n    A->>B: ${4:' + ph('sendRequest') + '}\n    B->>C: ${5:' + ph('queryData') + '}\n    C-->>B: ${6:' + ph('returnResult') + '}\n    B-->>A: ${7:' + ph('responseData') + '}\n```\n', meta: t('ui.help.sections.templates.items.mermaid-sequence'), score: 900 },
    { name: 'mermaid-gantt', value: '```mermaid\ngantt\n    title ${1:' + ph('projectTimeline') + '}\n    dateFormat  YYYY-MM-DD\n    section ${2:' + ph('phase1') + '}\n    ${3:' + ph('requirementAnalysis') + '}           :a1, 2024-01-01, 7d\n    ${4:' + ph('designPlan') + '}           :after a1, 5d\n    section ${5:' + ph('phase2') + '}\n    ${6:' + ph('development') + '}           :2024-01-15, 14d\n    ${7:' + ph('testOptimize') + '}           :7d\n```\n', meta: t('ui.help.sections.templates.items.mermaid-gantt'), score: 900 },
    { name: 'mermaid-class', value: '```mermaid\nclassDiagram\n    class ${1:Animal} {\n        +String name\n        +int age\n        +eat()\n        +sleep()\n    }\n    class ${2:Dog} {\n        +bark()\n    }\n    class ${3:Cat} {\n        +meow()\n    }\n    ${1:Animal} <|-- ${2:Dog}\n    ${1:Animal} <|-- ${3:Cat}\n```\n', meta: t('ui.help.sections.templates.items.mermaid-class'), score: 900 },
    
    // ==================== 数学公式 ====================
    { name: 'math-inline', value: '$${1:x}$', meta: t('ui.help.sections.templates.items.math-inline'), score: 950 },
    { name: 'math-block', value: '$$\n${1:x}\n$$', meta: t('ui.help.sections.templates.items.math-block'), score: 950 },
    { name: 'math-fraction', value: '$\\frac{${1:a}}{${2:b}}$', meta: t('ui.help.sections.templates.items.math-fraction'), score: 900 },
    { name: 'math-sqrt', value: '$\\sqrt{${1:x}}$', meta: t('ui.help.sections.templates.items.math-sqrt'), score: 900 },
    { name: 'math-sum', value: '$\\sum_{${1:i=1}}^{${2:n}} ${3:a_i}$', meta: t('ui.help.sections.templates.items.math-sum'), score: 900 },
    { name: 'math-integral', value: '$\\int_{${1:a}}^{${2:b}} ${3:f(x)}dx$', meta: t('ui.help.sections.templates.items.math-integral'), score: 900 },
    { name: 'math-limit', value: '$\\lim_{${1:x} \\to ${2:\\infty}} ${3:f(x)}$', meta: t('ui.help.sections.templates.items.math-limit'), score: 900 },
    { name: 'math-matrix', value: '$$\n\\begin{bmatrix}\n${1:a} & ${2:b} \\\\\n${3:c} & ${4:d}\n\\end{bmatrix}\n$$', meta: t('ui.help.sections.templates.items.math-matrix'), score: 900 },
    { name: 'math-equation', value: '$$\n\\begin{align}\n${1:y} &= ${2:ax + b} \\\\\n&= ${3:' + ph('result') + '}\n\\end{align}\n$$', meta: t('autocomplete.meta.mathEquation'), score: 850 },
    { name: 'math-cases', value: '$$\n${1:f(x)} = \\begin{cases}\n  ${2:x} & \\text{if } ${3:x > 0} \\\\\n  ${4:0} & \\text{otherwise}\n\\end{cases}\n$$', meta: t('autocomplete.meta.mathCases'), score: 850 },
    
    // ==================== HTML 标签 ====================
    { name: 'html-div', value: '<div>\n  ${1:' + ph('content') + '}\n</div>', meta: t('ui.help.sections.templates.items.html-div'), score: 800 },
    { name: 'html-span', value: '<span>${1:' + ph('content') + '}</span>', meta: t('autocomplete.meta.htmlSpan'), score: 800 },
    { name: 'html-br', value: '<br>', meta: t('autocomplete.meta.htmlBr'), score: 850 },
    { name: 'html-details', value: '<details>\n  <summary>${1:' + ph('summary') + '}</summary>\n  ${2:' + ph('details') + '}\n</details>', meta: t('autocomplete.meta.htmlDetails'), score: 750 },
    
    // ==================== 脚注和定义 ====================
    { name: 'footnote', value: '[^${1:' + ph('footnote') + '}]', meta: t('autocomplete.meta.footnote'), score: 850 },
    { name: 'footnote-def', value: '[^${1:' + ph('footnote') + '}]: ${2:' + ph('footnoteContent') + '}', meta: t('autocomplete.meta.footnoteDef'), score: 850 },
    { name: 'definition-list', value: '${1:' + ph('term') + '}\n: ${2:' + ph('definition') + '}', meta: t('autocomplete.meta.definitionList'), score: 800 },
    
    // ==================== 其他常用语法 ====================
    { name: 'toc', value: '[TOC]', meta: t('autocomplete.meta.toc'), score: 800 },
    { name: 'kbd', value: '<kbd>${1:Ctrl}</kbd>+<kbd>${2:C}</kbd>', meta: t('autocomplete.meta.kbd'), score: 800 },
    
    // ==================== 常用模板 ====================
    { name: 'template-readme', value: '# ${1:' + ph('projectName') + '}\n\n${2:' + ph('projectDesc') + '}\n\n## ' + t('autocomplete.templates.readme.features') + '\n\n- ${3:' + ph('feature1') + '}\n- ${4:' + ph('feature2') + '}\n\n## ' + t('autocomplete.templates.readme.install') + '\n\n```bash\n${5:' + ph('installCmd') + '}\n```\n\n## ' + t('autocomplete.templates.readme.usage') + '\n\n${6:' + ph('usage') + '}\n\n## ' + t('autocomplete.templates.readme.license') + '\n\n${7:' + ph('license') + '}\n', meta: t('ui.help.sections.templates.items.template-readme'), score: 800 },
    { name: 'template-changelog', value: '# Changelog\n\n## [${1:' + ph('version') + '}] - ${2:' + ph('date') + '}\n\n### Added\n- ${3:' + ph('newFeature') + '}\n\n### Changed\n- ${4:' + ph('change') + '}\n\n### Fixed\n- ${5:' + ph('fix') + '}\n', meta: t('ui.help.sections.templates.items.template-changelog'), score: 800 },
    { name: 'template-issue', value: '## ' + t('autocomplete.templates.issue.problemDesc') + '\n\n${1:' + ph('content') + '}\n\n## ' + t('autocomplete.templates.issue.steps') + '\n\n1. ${2:' + ph('step1') + '}\n2. ${3:' + ph('step2') + '}\n\n## ' + t('autocomplete.templates.issue.expected') + '\n\n${4:' + ph('content') + '}\n\n## ' + t('autocomplete.templates.issue.actual') + '\n\n${5:' + ph('content') + '}\n', meta: t('autocomplete.meta.templateIssue'), score: 750 },
    { name: 'template-pr', value: '## ' + t('autocomplete.templates.pr.changeTitle') + '\n\n${1:' + ph('describeChange') + '}\n\n## ' + t('autocomplete.templates.pr.changeType') + '\n\n- [ ] ' + t('autocomplete.templates.pr.bugFix') + '\n- [ ] ' + t('autocomplete.templates.pr.newFeature') + '\n- [ ] ' + t('autocomplete.templates.pr.docUpdate') + '\n- [ ] ' + t('autocomplete.templates.pr.refactor') + '\n\n## ' + t('autocomplete.templates.pr.test') + '\n\n${2:' + ph('testDesc') + '}\n', meta: t('autocomplete.meta.templatePr'), score: 750 },
    ];
}

/**
 * Markdown 自动完成项配置（导出为函数调用结果）
 */
export const markdownCompletions = getMarkdownCompletions();

/**
 * 创建自定义自动完成器
 */
export function createMarkdownCompleter() {
    return {
        getCompletions: function(editor, session, pos, prefix, callback) {
            // 检测是否在字符串内
            if (isInsideString(session, pos)) {
                callback(null, []);
                return;
            }
            
            // 检测是否在块内
            const blockInfo = checkIfInsideBlock(session, pos);
            
            // 如果在代码块内且指定了语言，不显示 Markdown 自动完成（会使用语言特定的自动完成器）
            if (blockInfo.inCodeBlock && blockInfo.language) {
                callback(null, []);
                return;
            }
            
            // 获取当前行的文本
            const line = session.getLine(pos.row);
            const beforeCursor = line.substring(0, pos.column);
            const lastChar = beforeCursor.slice(-1);
            
            // 根据块类型过滤选项（动态获取当前语言的完成项）
            let availableCompletions = getMarkdownCompletions();
            
            if (blockInfo.inCodeBlock && !blockInfo.language) {
                // 在代码块内（无语言）：只显示代码块相关的选项
                availableCompletions = availableCompletions.filter(item => 
                    item.name.includes('code') || item.meta.toLowerCase().includes('code') || item.meta.toLowerCase().includes('代码')
                );
            } else if (blockInfo.inBlockquote) {
                // 在引用块内：只显示引用块相关的选项
                availableCompletions = markdownCompletions.filter(item => 
                    item.name.includes('blockquote')
                );
            }
            
            // 特殊字符触发：输入 #, *, [, !, -, >, `, |, $, ^, ~, =, _, +, :, < 等字符时自动触发
            const triggerChars = ['#', '*', '[', '!', '-', '>', '`', '|', '$', '^', '~', '=', '_', '+', ':', '<'];
            const isSpecialCharTrigger = triggerChars.includes(lastChar) && prefix.length <= 1;
            
            // 如果前缀为空，但用户手动触发了自动完成（Ctrl+Space）或输入了特殊字符
            if (prefix.length === 0 || isSpecialCharTrigger) {
                // 检查是否是手动触发（通过检查是否在单词边界）
                const isManualTrigger = beforeCursor.trim().length === 0 || 
                                       beforeCursor.endsWith(' ') || 
                                       beforeCursor.endsWith('\n');
                
                if (isManualTrigger || isSpecialCharTrigger) {
                    // 根据特殊字符过滤相关项
                    let filteredItems = availableCompletions;
                    
                    if (isSpecialCharTrigger) {
                        filteredItems = availableCompletions.filter(item => {
                            const metaLower = item.meta.toLowerCase();
                            if (lastChar === '#') {
                                return item.name.startsWith('h') || metaLower.includes('heading') || metaLower.includes('标题');
                            } else if (lastChar === '*') {
                                return item.name.includes('bold') || item.name.includes('italic') || 
                                       item.name.includes('ul-star') || item.name.includes('hr-star') ||
                                       metaLower.includes('bold') || metaLower.includes('italic') || 
                                       metaLower.includes('list') || metaLower.includes('separator') ||
                                       metaLower.includes('加粗') || metaLower.includes('斜体') || 
                                       metaLower.includes('列表') || metaLower.includes('分隔');
                            } else if (lastChar === '[') {
                                return item.name.includes('link') || item.name.includes('image') || 
                                       item.name.includes('reference') || item.name.includes('footnote') ||
                                       metaLower.includes('link') || metaLower.includes('image') || 
                                       metaLower.includes('reference') || metaLower.includes('footnote') ||
                                       metaLower.includes('链接') || metaLower.includes('图片') || 
                                       metaLower.includes('引用') || metaLower.includes('脚注');
                            } else if (lastChar === '!') {
                                return item.name.includes('image') || metaLower.includes('image') || metaLower.includes('图片');
                            } else if (lastChar === '-') {
                                return item.name.includes('ul') || item.name.includes('task') || 
                                       item.name.includes('hr') || item.name.includes('nested') ||
                                       metaLower.includes('list') || metaLower.includes('separator') || 
                                       metaLower.includes('task') || metaLower.includes('列表') || 
                                       metaLower.includes('分隔') || metaLower.includes('任务');
                            } else if (lastChar === '>') {
                                return item.name.includes('blockquote') || metaLower.includes('quote') || metaLower.includes('引用');
                            } else if (lastChar === '`') {
                                return item.name.includes('code') || metaLower.includes('code') || metaLower.includes('代码');
                            } else if (lastChar === '|') {
                                return item.name.includes('table') || metaLower.includes('table') || metaLower.includes('表格');
                            } else if (lastChar === '$') {
                                return item.name.includes('math') || metaLower.includes('formula') || metaLower.includes('公式');
                            } else if (lastChar === '^') {
                                return item.name.includes('math') || item.name.includes('footnote') ||
                                       metaLower.includes('formula') || metaLower.includes('footnote') ||
                                       metaLower.includes('superscript') || metaLower.includes('公式') || 
                                       metaLower.includes('脚注') || metaLower.includes('上标');
                            } else if (lastChar === '~') {
                                return item.name.includes('math') || item.name.includes('strikethrough') ||
                                       metaLower.includes('formula') || metaLower.includes('strikethrough') ||
                                       metaLower.includes('subscript') || metaLower.includes('公式') || 
                                       metaLower.includes('删除线') || metaLower.includes('下标');
                            } else if (lastChar === '=') {
                                return item.name.includes('mark') || item.name.includes('h1-alt') ||
                                       item.name.includes('h2-alt') || metaLower.includes('highlight') ||
                                       metaLower.includes('heading') || metaLower.includes('高亮') ||
                                       metaLower.includes('标题');
                            } else if (lastChar === '_') {
                                return item.name.includes('italic') || item.name.includes('hr-underscore') ||
                                       metaLower.includes('italic') || metaLower.includes('separator') ||
                                       metaLower.includes('斜体') || metaLower.includes('分隔');
                            } else if (lastChar === '+') {
                                return item.name.includes('ul-plus') || metaLower.includes('list') || metaLower.includes('列表');
                            } else if (lastChar === ':') {
                                return item.name.includes('emoji') || item.name.includes('abbr') ||
                                       metaLower.includes('emoji') || metaLower.includes('abbreviation') ||
                                       metaLower.includes('缩写');
                            } else if (lastChar === '<') {
                                return item.name.includes('html') || item.name.includes('auto-link') ||
                                       item.name.includes('email-link') || item.name.includes('kbd') ||
                                       metaLower.includes('html') || metaLower.includes('link') ||
                                       metaLower.includes('keyboard') || metaLower.includes('链接') ||
                                       metaLower.includes('键盘');
                            }
                            return true;
                        });
                    } else {
                        // 手动触发时显示最常用的项
                        filteredItems = availableCompletions.filter(item => item.score >= 900);
                    }
                    
                    // 显示过滤后的自动完成项
                    const commonCompletions = filteredItems
                        .slice(0, 25)  // 限制数量
                        .map(item => ({
                            caption: item.name,
                            snippet: item.value,
                            meta: item.meta,
                            score: item.score,
                            type: 'markdown'
                        }));
                    
                    callback(null, commonCompletions);
                    return;
                } else {
                    callback(null, []);
                    return;
                }
            }
            
            // 过滤匹配的自动完成项
            const completions = availableCompletions
                .filter(item => {
                    // 匹配名称或元数据
                    const nameMatch = item.name.toLowerCase().includes(prefix.toLowerCase());
                    const metaMatch = item.meta.toLowerCase().includes(prefix.toLowerCase());
                    
                    // 也检查值是否包含前缀（用于匹配特殊字符，如 #, *, [, ! 等）
                    const valueMatch = item.value.toLowerCase().startsWith(prefix.toLowerCase());
                    
                    return nameMatch || metaMatch || valueMatch;
                })
                .map(item => ({
                    caption: item.name,
                    snippet: item.value,
                    meta: item.meta,
                    score: item.score,
                    type: 'markdown'
                }));
            
            // 按分数排序，然后按匹配度排序
            completions.sort((a, b) => {
                // 优先显示完全匹配的项
                const aExactMatch = a.caption.toLowerCase() === prefix.toLowerCase() || 
                                   a.meta.toLowerCase() === prefix.toLowerCase();
                const bExactMatch = b.caption.toLowerCase() === prefix.toLowerCase() || 
                                   b.meta.toLowerCase() === prefix.toLowerCase();
                
                if (aExactMatch && !bExactMatch) return -1;
                if (!aExactMatch && bExactMatch) return 1;
                
                return b.score - a.score;
            });
            
            callback(null, completions);
        },
        
        getDocTooltip: function(item) {
            if (!item.docHTML) {
                // 转义 HTML 特殊字符
                const escapeHtml = (text) => {
                    const div = document.createElement('div');
                    div.textContent = text;
                    return div.innerHTML;
                };
                
                item.docHTML = [
                    '<div class="ace-doc-tooltip">',
                    '<b>', escapeHtml(item.meta || item.caption), '</b>',
                    '<hr></hr>',
                    '<pre>', escapeHtml(item.snippet || item.value || ''), '</pre>',
                    '</div>'
                ].join('');
            }
        }
    };
}
