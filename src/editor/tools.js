/**
 * 编辑器工具模块（Markdown 格式化工具）
 */

import { AppState } from '../core/state.js';
import { setStatus } from '../core/ui-utils.js';
import { getEditorInstance } from './ace-editor.js';
import { debounce } from '../core/utils.js';
import { renderMarkdown } from '../renderer/markdown.js';

// 防抖渲染
const debouncedRender = debounce(renderMarkdown, 300);

/**
 * 在编辑器中插入文本
 */
export function insertText(before, after = '', placeholder = '') {
    const aceEditor = getEditorInstance();
    if (!aceEditor) return;
    
    const selectedText = aceEditor.getSelectedText();
    const textToInsert = before + (selectedText || placeholder) + after;
    
    // 插入文本
    aceEditor.insert(textToInsert);
    
    // 如果没有选中文本且有占位符，选中占位符
    if (!selectedText && placeholder) {
        const cursor = aceEditor.getCursorPosition();
        const Range = window.ace.require('ace/range').Range;
        const startCol = cursor.column - after.length - placeholder.length;
        const endCol = cursor.column - after.length;
        aceEditor.selection.setRange(new Range(cursor.row, startCol, cursor.row, endCol));
    }
    
    aceEditor.focus();
    AppState.isDirty = true;
    debouncedRender();
}

/**
 * Mermaid 模板
 */
export const mermaidTemplates = {
    flowchart: `\`\`\`mermaid
graph TD
    A[开始] --> B{判断条件}
    B -->|是| C[执行操作1]
    B -->|否| D[执行操作2]
    C --> E[结束]
    D --> E
\`\`\`\n\n`,
    
    sequence: `\`\`\`mermaid
sequenceDiagram
    participant A as 用户
    participant B as 系统
    participant C as 数据库
    
    A->>B: 发送请求
    B->>C: 查询数据
    C-->>B: 返回结果
    B-->>A: 响应数据
\`\`\`\n\n`,
    
    gantt: `\`\`\`mermaid
gantt
    title 项目时间线
    dateFormat  YYYY-MM-DD
    section 阶段一
    需求分析           :a1, 2024-01-01, 7d
    设计方案           :after a1, 5d
    section 阶段二
    开发实现           :2024-01-15, 14d
    测试优化           :7d
\`\`\`\n\n`,
    
    class: `\`\`\`mermaid
classDiagram
    class Animal {
        +String name
        +int age
        +eat()
        +sleep()
    }
    class Dog {
        +bark()
    }
    class Cat {
        +meow()
    }
    Animal <|-- Dog
    Animal <|-- Cat
\`\`\`\n\n`,
    
    state: `\`\`\`mermaid
stateDiagram-v2
    [*] --> 待处理
    待处理 --> 处理中: 开始处理
    处理中 --> 已完成: 处理成功
    处理中 --> 失败: 处理失败
    失败 --> 待处理: 重试
    已完成 --> [*]
\`\`\`\n\n`,
};

/**
 * 数学公式模板
 * 使用 ```katex 代码块格式，内部使用 $...$ (行内) 和 $$...$$ (块级) 格式
 */
export const mathTemplates = {
    inline: '```katex\n$x$\n```\n',
    block: '```katex\n$$\nx\n$$\n```\n\n',
    fraction: '```katex\n$\\frac{a}{b}$\n```\n',
    sqrt: '```katex\n$\\sqrt{x}$\n```\n',
    sum: '```katex\n$\\sum_{i=1}^{n} a_i$\n```\n',
    integral: '```katex\n$\\int_{a}^{b} f(x)dx$\n```\n',
    limit: '```katex\n$\\lim_{x \\to \\infty} f(x)$\n```\n',
    matrix: '```katex\n$$\n\\begin{bmatrix}\na & b \\\\\nc & d\n\\end{bmatrix}\n$$\n```\n\n'
};
