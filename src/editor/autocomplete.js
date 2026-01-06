/**
 * Ace Editor 自动完成配置模块
 * 为 Markdown 编辑器提供智能自动完成功能
 */

/**
 * Markdown 自动完成项配置
 * 包含所有常用的 Markdown 语法和模板
 */
export const markdownCompletions = [
    // ==================== 标题 ====================
    { name: 'h1', value: '# ${1:标题}', meta: '一级标题', score: 1000 },
    { name: 'h2', value: '## ${1:标题}', meta: '二级标题', score: 1000 },
    { name: 'h3', value: '### ${1:标题}', meta: '三级标题', score: 1000 },
    { name: 'h4', value: '#### ${1:标题}', meta: '四级标题', score: 1000 },
    { name: 'h5', value: '##### ${1:标题}', meta: '五级标题', score: 1000 },
    { name: 'h6', value: '###### ${1:标题}', meta: '六级标题', score: 1000 },
    { name: 'h1-alt', value: '${1:标题}\n=========', meta: '一级标题（下划线）', score: 800 },
    { name: 'h2-alt', value: '${1:标题}\n---------', meta: '二级标题（下划线）', score: 800 },
    
    // ==================== 文本格式 ====================
    { name: 'bold', value: '**${1:文本}**', meta: '加粗', score: 950 },
    { name: 'italic', value: '*${1:文本}*', meta: '斜体', score: 950 },
    { name: 'italic-alt', value: '_${1:文本}_', meta: '斜体（下划线）', score: 900 },
    { name: 'bold-italic', value: '***${1:文本}***', meta: '加粗斜体', score: 900 },
    { name: 'bold-italic-alt', value: '___${1:文本}___', meta: '加粗斜体（下划线）', score: 850 },
    { name: 'strikethrough', value: '~~${1:文本}~~', meta: '删除线', score: 900 },
    { name: 'code-inline', value: '`${1:代码}`', meta: '行内代码', score: 950 },
    { name: 'mark', value: '==${1:文本}==', meta: '高亮标记', score: 850 },
    { name: 'subscript', value: '~${1:下标}~', meta: '下标', score: 800 },
    { name: 'superscript', value: '^${1:上标}^', meta: '上标', score: 800 },
    
    // ==================== 链接和图片 ====================
    { name: 'link', value: '[${1:链接文本}](${2:https://example.com})', meta: '链接', score: 950 },
    { name: 'link-title', value: '[${1:链接文本}](${2:https://example.com} "${3:标题}")', meta: '带标题的链接', score: 900 },
    { name: 'image', value: '![${1:图片描述}](${2:https://example.com/image.jpg})', meta: '图片', score: 950 },
    { name: 'image-title', value: '![${1:图片描述}](${2:https://example.com/image.jpg} "${3:标题}")', meta: '带标题的图片', score: 900 },
    { name: 'image-size', value: '![${1:图片描述}](${2:https://example.com/image.jpg} =${3:300x200})', meta: '指定尺寸的图片', score: 850 },
    { name: 'reference-link', value: '[${1:链接文本}][${2:引用}]', meta: '引用链接', score: 850 },
    { name: 'reference-image', value: '![${1:图片描述}][${2:引用}]', meta: '引用图片', score: 850 },
    { name: 'auto-link', value: '<${1:https://example.com}>', meta: '自动链接', score: 800 },
    { name: 'email-link', value: '<${1:email@example.com}>', meta: '邮箱链接', score: 800 },
    { name: 'link-ref-def', value: '[${1:引用}]: ${2:https://example.com} "${3:标题}"', meta: '链接引用定义', score: 750 },
    
    // ==================== 列表 ====================
    { name: 'ul', value: '- ${1:列表项}', meta: '无序列表（-）', score: 950 },
    { name: 'ul-star', value: '* ${1:列表项}', meta: '无序列表（*）', score: 950 },
    { name: 'ul-plus', value: '+ ${1:列表项}', meta: '无序列表（+）', score: 950 },
    { name: 'ol', value: '1. ${1:列表项}', meta: '有序列表', score: 950 },
    { name: 'task', value: '- [ ] ${1:任务项}', meta: '任务列表（未完成）', score: 950 },
    { name: 'task-done', value: '- [x] ${1:任务项}', meta: '任务列表（已完成）', score: 950 },
    { name: 'nested-ul', value: '- ${1:列表项}\n  - ${2:子项}', meta: '嵌套无序列表', score: 850 },
    { name: 'nested-ol', value: '1. ${1:列表项}\n   1. ${2:子项}', meta: '嵌套有序列表', score: 850 },
    { name: 'mixed-list', value: '- ${1:列表项}\n  1. ${2:子项}', meta: '混合列表', score: 800 },
    
    // ==================== 代码块 ====================
    { name: 'code-block', value: '```${1:language}\n${2:代码}\n```', meta: '代码块', score: 950 },
    { name: 'code-js', value: '```javascript\n${1:// 代码}\n```', meta: 'JavaScript', score: 900 },
    { name: 'code-ts', value: '```typescript\n${1:// 代码}\n```', meta: 'TypeScript', score: 900 },
    { name: 'code-python', value: '```python\n${1:# 代码}\n```', meta: 'Python', score: 900 },
    { name: 'code-java', value: '```java\n${1:// 代码}\n```', meta: 'Java', score: 900 },
    { name: 'code-cpp', value: '```cpp\n${1:// 代码}\n```', meta: 'C++', score: 900 },
    { name: 'code-c', value: '```c\n${1:// 代码}\n```', meta: 'C', score: 900 },
    { name: 'code-css', value: '```css\n${1:/* 样式 */}\n```', meta: 'CSS', score: 900 },
    { name: 'code-html', value: '```html\n${1:<!-- HTML -->}\n```', meta: 'HTML', score: 900 },
    { name: 'code-json', value: '```json\n${1:{\n  "key": "value"\n}}\n```', meta: 'JSON', score: 900 },
    { name: 'code-xml', value: '```xml\n${1:<!-- XML -->}\n```', meta: 'XML', score: 900 },
    { name: 'code-bash', value: '```bash\n${1:# 命令}\n```', meta: 'Bash/Shell', score: 900 },
    { name: 'code-sql', value: '```sql\n${1:-- SQL 查询}\n```', meta: 'SQL', score: 900 },
    { name: 'code-go', value: '```go\n${1:// Go 代码}\n```', meta: 'Go', score: 900 },
    { name: 'code-rust', value: '```rust\n${1:// Rust 代码}\n```', meta: 'Rust', score: 900 },
    { name: 'code-php', value: '```php\n${1:<?php\n// PHP 代码\n?>\n```', meta: 'PHP', score: 900 },
    { name: 'code-ruby', value: '```ruby\n${1:# Ruby 代码}\n```', meta: 'Ruby', score: 900 },
    { name: 'code-swift', value: '```swift\n${1:// Swift 代码}\n```', meta: 'Swift', score: 900 },
    { name: 'code-kotlin', value: '```kotlin\n${1:// Kotlin 代码}\n```', meta: 'Kotlin', score: 900 },
    { name: 'code-dart', value: '```dart\n${1:// Dart 代码}\n```', meta: 'Dart', score: 900 },
    { name: 'code-yaml', value: '```yaml\n${1:# YAML 配置}\n```', meta: 'YAML', score: 900 },
    { name: 'code-toml', value: '```toml\n${1:# TOML 配置}\n```', meta: 'TOML', score: 850 },
    { name: 'code-markdown', value: '```markdown\n${1:Markdown 内容}\n```', meta: 'Markdown', score: 850 },
    { name: 'code-diff', value: '```diff\n${1:- 删除的行\n+ 添加的行}\n```', meta: 'Diff', score: 850 },
    { name: 'code-text', value: '```text\n${1:纯文本}\n```', meta: '纯文本', score: 800 },
    { name: 'code-no-lang', value: '```\n${1:代码}\n```', meta: '代码块（无语言）', score: 800 },
    
    // ==================== 表格 ====================
    { name: 'table', value: '| ${1:列1} | ${2:列2} | ${3:列3} |\n| --- | --- | --- |\n| ${4:单元格1} | ${5:单元格2} | ${6:单元格3} |', meta: '3列表格', score: 950 },
    { name: 'table-2col', value: '| ${1:列1} | ${2:列2} |\n| --- | --- |\n| ${3:单元格1} | ${4:单元格2} |', meta: '2列表格', score: 950 },
    { name: 'table-4col', value: '| ${1:列1} | ${2:列2} | ${3:列3} | ${4:列4} |\n| --- | --- | --- | --- |\n| ${5:单元格1} | ${6:单元格2} | ${7:单元格3} | ${8:单元格4} |', meta: '4列表格', score: 900 },
    { name: 'table-left', value: '| ${1:列1} | ${2:列2} |\n| :--- | :--- |\n| ${3:左对齐} | ${4:左对齐} |', meta: '左对齐表格', score: 850 },
    { name: 'table-right', value: '| ${1:列1} | ${2:列2} |\n| ---: | ---: |\n| ${3:右对齐} | ${4:右对齐} |', meta: '右对齐表格', score: 850 },
    { name: 'table-center', value: '| ${1:列1} | ${2:列2} |\n| :---: | :---: |\n| ${3:居中} | ${4:居中} |', meta: '居中对齐表格', score: 850 },
    { name: 'table-mixed', value: '| ${1:列1} | ${2:列2} | ${3:列3} |\n| :--- | :---: | ---: |\n| ${4:左对齐} | ${5:居中} | ${6:右对齐} |', meta: '混合对齐表格', score: 800 },
    
    // ==================== 引用 ====================
    { name: 'blockquote', value: '> ${1:引用内容}', meta: '引用块', score: 950 },
    { name: 'blockquote-multi', value: '> ${1:引用内容}\n> \n> ${2:更多内容}', meta: '多行引用', score: 900 },
    { name: 'blockquote-nested', value: '> ${1:引用内容}\n> > ${2:嵌套引用}', meta: '嵌套引用', score: 850 },
    { name: 'blockquote-with-author', value: '> ${1:引用内容}\n> \n> — ${2:作者}', meta: '带作者的引用', score: 850 },
    
    // ==================== 分隔线 ====================
    { name: 'hr', value: '---\n', meta: '分隔线（三个减号）', score: 900 },
    { name: 'hr-star', value: '***\n', meta: '分隔线（三个星号）', score: 900 },
    { name: 'hr-underscore', value: '___\n', meta: '分隔线（三个下划线）', score: 900 },
    { name: 'hr-long', value: '----\n', meta: '分隔线（四个减号）', score: 800 },
    
    // ==================== Mermaid 图表 ====================
    { name: 'mermaid-flowchart', value: '```mermaid\ngraph TD\n    A[${1:开始}] --> B{${2:判断条件}}\n    B -->|${3:是}| C[${4:执行操作1}]\n    B -->|${5:否}| D[${6:执行操作2}]\n    C --> E[${7:结束}]\n    D --> E\n```\n', meta: 'Mermaid 流程图', score: 900 },
    { name: 'mermaid-flowchart-lr', value: '```mermaid\ngraph LR\n    A[${1:开始}] --> B[${2:中间}]\n    B --> C[${3:结束}]\n```\n', meta: 'Mermaid 横向流程图', score: 850 },
    { name: 'mermaid-sequence', value: '```mermaid\nsequenceDiagram\n    participant A as ${1:用户}\n    participant B as ${2:系统}\n    participant C as ${3:数据库}\n    \n    A->>B: ${4:发送请求}\n    B->>C: ${5:查询数据}\n    C-->>B: ${6:返回结果}\n    B-->>A: ${7:响应数据}\n```\n', meta: 'Mermaid 时序图', score: 900 },
    { name: 'mermaid-gantt', value: '```mermaid\ngantt\n    title ${1:项目时间线}\n    dateFormat  YYYY-MM-DD\n    section ${2:阶段一}\n    ${3:需求分析}           :a1, 2024-01-01, 7d\n    ${4:设计方案}           :after a1, 5d\n    section ${5:阶段二}\n    ${6:开发实现}           :2024-01-15, 14d\n    ${7:测试优化}           :7d\n```\n', meta: 'Mermaid 甘特图', score: 900 },
    { name: 'mermaid-class', value: '```mermaid\nclassDiagram\n    class ${1:Animal} {\n        +String name\n        +int age\n        +eat()\n        +sleep()\n    }\n    class ${2:Dog} {\n        +bark()\n    }\n    class ${3:Cat} {\n        +meow()\n    }\n    ${1:Animal} <|-- ${2:Dog}\n    ${1:Animal} <|-- ${3:Cat}\n```\n', meta: 'Mermaid 类图', score: 900 },
    { name: 'mermaid-state', value: '```mermaid\nstateDiagram-v2\n    [*] --> ${1:待处理}\n    ${1:待处理} --> ${2:处理中}: ${3:开始处理}\n    ${2:处理中} --> ${4:已完成}: ${5:处理成功}\n    ${2:处理中} --> ${6:失败}: ${7:处理失败}\n    ${6:失败} --> ${1:待处理}: ${8:重试}\n    ${4:已完成} --> [*]\n```\n', meta: 'Mermaid 状态图', score: 900 },
    { name: 'mermaid-er', value: '```mermaid\nerDiagram\n    CUSTOMER ||--o{ ORDER : places\n    ORDER ||--|{ LINE-ITEM : contains\n    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses\n```\n', meta: 'Mermaid ER 图', score: 850 },
    { name: 'mermaid-pie', value: '```mermaid\npie title ${1:饼图标题}\n    "${2:标签1}" : ${3:30}\n    "${4:标签2}" : ${5:20}\n    "${6:标签3}" : ${7:50}\n```\n', meta: 'Mermaid 饼图', score: 850 },
    { name: 'mermaid-gitgraph', value: '```mermaid\ngitgraph:\n    commit id: "${1:初始提交}"\n    branch ${2:develop}\n    checkout ${2:develop}\n    commit id: "${3:功能开发}"\n    checkout main\n    merge ${2:develop}\n```\n', meta: 'Mermaid Git 图', score: 850 },
    { name: 'mermaid-journey', value: '```mermaid\njourney\n    title ${1:用户旅程}\n    section ${2:阶段1}\n      ${3:步骤1}: 5: ${4:用户}\n      ${5:步骤2}: 4: ${4:用户}\n    section ${6:阶段2}\n      ${7:步骤3}: 3: ${4:用户}\n```\n', meta: 'Mermaid 用户旅程图', score: 800 },
    { name: 'mermaid-c4', value: '```mermaid\nC4Context\n    title ${1:系统上下文图}\n    Person(user, "${2:用户}")\n    System(system, "${3:系统}")\n    Rel(user, system, "${4:使用}")\n```\n', meta: 'Mermaid C4 图', score: 750 },
    
    // ==================== 数学公式 ====================
    { name: 'math-inline', value: ' $${1:x}$ ', meta: '行内公式', score: 950 },
    { name: 'math-block', value: '$$\n${1:x}\n$$\n', meta: '块级公式', score: 950 },
    { name: 'math-fraction', value: '$\\frac{${1:a}}{${2:b}}$ ', meta: '分数', score: 900 },
    { name: 'math-sqrt', value: '$\\sqrt{${1:x}}$ ', meta: '平方根', score: 900 },
    { name: 'math-nth-root', value: '$\\sqrt[${1:n}]{${2:x}}$ ', meta: 'n次根', score: 850 },
    { name: 'math-sum', value: '$\\sum_{${1:i=1}}^{${2:n}} ${3:a_i}$ ', meta: '求和', score: 900 },
    { name: 'math-product', value: '$\\prod_{${1:i=1}}^{${2:n}} ${3:a_i}$ ', meta: '连乘', score: 850 },
    { name: 'math-integral', value: '$\\int_{${1:a}}^{${2:b}} ${3:f(x)}dx$ ', meta: '积分', score: 900 },
    { name: 'math-double-integral', value: '$\\iint_{${1:D}} ${2:f(x,y)}dxdy$ ', meta: '二重积分', score: 800 },
    { name: 'math-limit', value: '$\\lim_{${1:x} \\to ${2:\\infty}} ${3:f(x)}$ ', meta: '极限', score: 900 },
    { name: 'math-derivative', value: '$\\frac{d${1:f}}{d${2:x}}$ ', meta: '导数', score: 850 },
    { name: 'math-partial', value: '$\\frac{\\partial ${1:f}}{\\partial ${2:x}}$ ', meta: '偏导数', score: 850 },
    { name: 'math-matrix', value: '$$\n\\begin{bmatrix}\n${1:a} & ${2:b} \\\\\n${3:c} & ${4:d}\n\\end{bmatrix}\n$$\n', meta: '矩阵', score: 900 },
    { name: 'math-determinant', value: '$\\begin{vmatrix}\n${1:a} & ${2:b} \\\\\n${3:c} & ${4:d}\n\\end{vmatrix}$ ', meta: '行列式', score: 850 },
    { name: 'math-vector', value: '$\\vec{${1{v}}}$ ', meta: '向量', score: 850 },
    { name: 'math-norm', value: '$\\|${1{x}}\\|$ ', meta: '范数', score: 800 },
    { name: 'math-set', value: '$\\{${1:1, 2, 3}\\}$ ', meta: '集合', score: 850 },
    { name: 'math-set-operations', value: '$${1:A} \\cup ${2:B}$ ', meta: '集合运算', score: 800 },
    { name: 'math-binomial', value: '$\\binom{${1:n}}{${2:k}}$ ', meta: '二项式系数', score: 800 },
    { name: 'math-equation', value: '$$\n\\begin{align}\n${1:y} &= ${2:ax + b} \\\\\n&= ${3:结果}\n\\end{align}\n$$\n', meta: '对齐公式', score: 850 },
    { name: 'math-cases', value: '$$\n${1:f(x)} = \\begin{cases}\n  ${2:x} & \\text{if } ${3:x > 0} \\\\\n  ${4:0} & \\text{otherwise}\n\\end{cases}\n$$\n', meta: '分段函数', score: 850 },
    
    // ==================== HTML 标签 ====================
    { name: 'html-div', value: '<div>\n  ${1:内容}\n</div>', meta: 'HTML div', score: 800 },
    { name: 'html-span', value: '<span>${1:内容}</span>', meta: 'HTML span', score: 800 },
    { name: 'html-p', value: '<p>${1:段落内容}</p>', meta: 'HTML 段落', score: 800 },
    { name: 'html-br', value: '<br>', meta: 'HTML 换行', score: 850 },
    { name: 'html-hr', value: '<hr>', meta: 'HTML 分隔线', score: 800 },
    { name: 'html-img', value: '<img src="${1:image.jpg}" alt="${2:描述}" width="${3:300}">', meta: 'HTML 图片', score: 800 },
    { name: 'html-a', value: '<a href="${1:https://example.com}">${2:链接文本}</a>', meta: 'HTML 链接', score: 800 },
    { name: 'html-strong', value: '<strong>${1:加粗文本}</strong>', meta: 'HTML 加粗', score: 800 },
    { name: 'html-em', value: '<em>${1:斜体文本}</em>', meta: 'HTML 斜体', score: 800 },
    { name: 'html-code', value: '<code>${1:代码}</code>', meta: 'HTML 代码', score: 800 },
    { name: 'html-pre', value: '<pre>${1:预格式化文本}</pre>', meta: 'HTML 预格式化', score: 800 },
    { name: 'html-blockquote', value: '<blockquote>\n  ${1:引用内容}\n</blockquote>', meta: 'HTML 引用', score: 800 },
    { name: 'html-ul', value: '<ul>\n  <li>${1:列表项}</li>\n</ul>', meta: 'HTML 无序列表', score: 800 },
    { name: 'html-ol', value: '<ol>\n  <li>${1:列表项}</li>\n</ol>', meta: 'HTML 有序列表', score: 800 },
    { name: 'html-table', value: '<table>\n  <tr>\n    <th>${1:表头}</th>\n  </tr>\n  <tr>\n    <td>${2:单元格}</td>\n  </tr>\n</table>', meta: 'HTML 表格', score: 800 },
    { name: 'html-details', value: '<details>\n  <summary>${1:摘要}</summary>\n  ${2:详细内容}\n</details>', meta: 'HTML 折叠', score: 750 },
    { name: 'html-comment', value: '<!-- ${1:注释} -->', meta: 'HTML 注释', score: 750 },
    
    // ==================== 脚注和定义 ====================
    { name: 'footnote', value: '[^${1:1}]', meta: '脚注引用', score: 850 },
    { name: 'footnote-def', value: '[^${1:1}]: ${2:脚注内容}', meta: '脚注定义', score: 850 },
    { name: 'definition-list', value: '${1:术语}\n: ${2:定义内容}', meta: '定义列表', score: 800 },
    
    // ==================== 其他常用语法 ====================
    { name: 'toc', value: '[TOC]', meta: '目录（自动生成）', score: 800 },
    { name: 'toc-alt', value: '<!-- TOC -->', meta: '目录注释', score: 750 },
    { name: 'abbr', value: '*[${1:HTML}]: ${2:HyperText Markup Language}', meta: '缩写定义', score: 750 },
    { name: 'abbr-use', value: '${1:HTML}', meta: '使用缩写', score: 700 },
    { name: 'kbd', value: '<kbd>${1:Ctrl}</kbd>+<kbd>${2:C}</kbd>', meta: '键盘按键', score: 800 },
    { name: 'mark', value: '==${1:高亮文本}==', meta: '高亮文本', score: 850 },
    { name: 'emoji', value: ':${1:smile}:', meta: 'Emoji（如果支持）', score: 700 },
    
    // ==================== 常用模板 ====================
    { name: 'template-readme', value: '# ${1:项目名称}\n\n${2:项目描述}\n\n## 功能特性\n\n- ${3:特性1}\n- ${4:特性2}\n\n## 安装\n\n```bash\n${5:安装命令}\n```\n\n## 使用\n\n${6:使用说明}\n\n## 许可证\n\n${7:MIT License}\n', meta: 'README 模板', score: 800 },
    { name: 'template-changelog', value: '# Changelog\n\n## [${1:1.0.0}] - ${2:2024-01-01}\n\n### Added\n- ${3:新功能}\n\n### Changed\n- ${4:变更内容}\n\n### Fixed\n- ${5:修复内容}\n', meta: '更新日志模板', score: 800 },
    { name: 'template-issue', value: '## 问题描述\n\n${1:详细描述问题}\n\n## 复现步骤\n\n1. ${2:步骤1}\n2. ${3:步骤2}\n\n## 预期行为\n\n${4:预期结果}\n\n## 实际行为\n\n${5:实际结果}\n', meta: 'Issue 模板', score: 750 },
    { name: 'template-pr', value: '## 变更说明\n\n${1:描述本次 PR 的变更内容}\n\n## 变更类型\n\n- [ ] Bug 修复\n- [ ] 新功能\n- [ ] 文档更新\n- [ ] 重构\n\n## 测试\n\n${2:测试说明}\n', meta: 'PR 模板', score: 750 },
];

/**
 * 创建自定义自动完成器
 */
export function createMarkdownCompleter() {
    return {
        getCompletions: function(editor, session, pos, prefix, callback) {
            // 获取当前行的文本
            const line = session.getLine(pos.row);
            const beforeCursor = line.substring(0, pos.column);
            const lastChar = beforeCursor.slice(-1);
            
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
                    let filteredItems = markdownCompletions;
                    
                    if (isSpecialCharTrigger) {
                        filteredItems = markdownCompletions.filter(item => {
                            if (lastChar === '#') {
                                return item.name.startsWith('h') || item.meta.includes('标题');
                            } else if (lastChar === '*') {
                                return item.name.includes('bold') || item.name.includes('italic') || 
                                       item.name.includes('ul-star') || item.name.includes('hr-star') ||
                                       item.meta.includes('加粗') || item.meta.includes('斜体') || 
                                       item.meta.includes('列表') || item.meta.includes('分隔');
                            } else if (lastChar === '[') {
                                return item.name.includes('link') || item.name.includes('image') || 
                                       item.name.includes('reference') || item.name.includes('footnote') ||
                                       item.meta.includes('链接') || item.meta.includes('图片') || 
                                       item.meta.includes('引用') || item.meta.includes('脚注');
                            } else if (lastChar === '!') {
                                return item.name.includes('image') || item.meta.includes('图片');
                            } else if (lastChar === '-') {
                                return item.name.includes('ul') || item.name.includes('task') || 
                                       item.name.includes('hr') || item.name.includes('nested') ||
                                       item.meta.includes('列表') || item.meta.includes('分隔') || 
                                       item.meta.includes('任务');
                            } else if (lastChar === '>') {
                                return item.name.includes('blockquote') || item.meta.includes('引用');
                            } else if (lastChar === '`') {
                                return item.name.includes('code') || item.meta.includes('代码');
                            } else if (lastChar === '|') {
                                return item.name.includes('table') || item.meta.includes('表格');
                            } else if (lastChar === '$') {
                                return item.name.includes('math') || item.meta.includes('公式');
                            } else if (lastChar === '^') {
                                return item.name.includes('math') || item.name.includes('footnote') ||
                                       item.meta.includes('公式') || item.meta.includes('脚注') ||
                                       item.meta.includes('上标');
                            } else if (lastChar === '~') {
                                return item.name.includes('math') || item.name.includes('strikethrough') ||
                                       item.meta.includes('公式') || item.meta.includes('删除线') ||
                                       item.meta.includes('下标');
                            } else if (lastChar === '=') {
                                return item.name.includes('mark') || item.name.includes('h1-alt') ||
                                       item.name.includes('h2-alt') || item.meta.includes('高亮') ||
                                       item.meta.includes('标题');
                            } else if (lastChar === '_') {
                                return item.name.includes('italic') || item.name.includes('hr-underscore') ||
                                       item.meta.includes('斜体') || item.meta.includes('分隔');
                            } else if (lastChar === '+') {
                                return item.name.includes('ul-plus') || item.meta.includes('列表');
                            } else if (lastChar === ':') {
                                return item.name.includes('emoji') || item.name.includes('abbr') ||
                                       item.meta.includes('Emoji') || item.meta.includes('缩写');
                            } else if (lastChar === '<') {
                                return item.name.includes('html') || item.name.includes('auto-link') ||
                                       item.name.includes('email-link') || item.name.includes('kbd') ||
                                       item.meta.includes('HTML') || item.meta.includes('链接') ||
                                       item.meta.includes('键盘');
                            }
                            return true;
                        });
                    } else {
                        // 手动触发时显示最常用的项
                        filteredItems = markdownCompletions.filter(item => item.score >= 900);
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
            const completions = markdownCompletions
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
