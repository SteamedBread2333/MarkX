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
 * @param {string} before - 插入文本的前缀，或完整的模板字符串
 * @param {string} after - 插入文本的后缀
 * @param {string} placeholder - 占位符文本
 * @param {Object} options - 选项
 * @param {boolean} options.selectPlaceholder - 是否选中占位符（默认 true）
 * @param {number} options.selectStart - 选中范围的起始位置（相对于插入位置，字符索引）
 * @param {number} options.selectEnd - 选中范围的结束位置（相对于插入位置，字符索引）
 */
export function insertText(before, after = '', placeholder = '', options = {}) {
    const aceEditor = getEditorInstance();
    if (!aceEditor) return;
    
    const { selectPlaceholder = true, selectStart, selectEnd } = options;
    const selectedText = aceEditor.getSelectedText();
    
    // 如果 before 是完整模板（包含换行符），直接使用
    let textToInsert;
    if (before.includes('\n') && !after && !placeholder) {
        // 完整模板，如果有选中文本，替换第一个占位符
        textToInsert = selectedText ? before.replace(/\$x\$|x|y|a|b|c|d|1|2|3|4/, selectedText) : before;
    } else {
        // 传统格式：before + placeholder + after
        textToInsert = before + (selectedText || placeholder) + after;
    }
    
    // 记录插入位置
    const cursor = aceEditor.getCursorPosition();
    const insertRow = cursor.row;
    const insertCol = cursor.column;
    
    // 插入文本
    aceEditor.insert(textToInsert);
    
    // 如果没有选中文本，尝试选中指定范围或占位符
    if (!selectedText) {
        const Range = window.ace.require('ace/range').Range;
        let startRow, startCol, endRow, endCol;
        
        if (selectStart !== undefined && selectEnd !== undefined) {
            // 使用指定的选中范围（字符索引）
            const lines = textToInsert.split('\n');
            let charCount = 0;
            let foundStart = false;
            let foundEnd = false;
            
            for (let i = 0; i < lines.length; i++) {
                const lineLength = lines[i].length + 1; // +1 for newline
                
                if (!foundStart && charCount + lineLength > selectStart) {
                    startRow = insertRow + i;
                    startCol = insertCol + (selectStart - charCount);
                    foundStart = true;
                }
                
                if (!foundEnd && charCount + lineLength > selectEnd) {
                    endRow = insertRow + i;
                    endCol = insertCol + (selectEnd - charCount);
                    foundEnd = true;
                    break;
                }
                
                charCount += lineLength;
            }
            
            if (foundStart && foundEnd) {
                aceEditor.selection.setRange(new Range(startRow, startCol, endRow, endCol));
            }
        } else if (selectPlaceholder && placeholder) {
            // 选中占位符（传统方式）
            const beforeLines = before.split('\n');
            const beforeLastLineLength = beforeLines[beforeLines.length - 1].length;
            
            startRow = insertRow + beforeLines.length - 1;
            startCol = insertCol + beforeLastLineLength;
            
            const placeholderLines = placeholder.split('\n');
            endRow = insertRow + beforeLines.length + placeholderLines.length - 2;
            endCol = placeholderLines.length > 1 
                ? placeholderLines[placeholderLines.length - 1].length
                : startCol + placeholder.length;
            
            aceEditor.selection.setRange(new Range(startRow, startCol, endRow, endCol));
        }
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
 * 使用标准的 $...$ (行内) 和 $$...$$ (块级) 格式
 * 优化：使用更实用的默认值和更好的占位符
 */
export const mathTemplates = {
    inline: {
        template: '$x$',
        selectStart: 1, // 选中 $x$ 中的 x
        selectEnd: 2
    },
    block: {
        template: '$$\nx = y\n$$',
        selectStart: 4, // 选中 x = y 中的 x
        selectEnd: 8
    },
    fraction: {
        template: '$\\frac{1}{2}$',
        selectStart: 7, // 选中 \frac{1}{2} 中的 1
        selectEnd: 8
    },
    sqrt: {
        template: '$\\sqrt{x}$',
        selectStart: 6, // 选中 \sqrt{x} 中的 x
        selectEnd: 7
    },
    sum: {
        template: '$\\sum_{i=1}^{n} x_i$',
        selectStart: 1, // 选中整个公式（从 $ 开始）
        selectEnd: 19
    },
    integral: {
        template: '$\\int_{0}^{\\infty} f(x) dx$',
        selectStart: 1, // 选中整个公式（从 $ 开始）
        selectEnd: 29
    },
    limit: {
        template: '$\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1$',
        selectStart: 1, // 选中整个公式（从 $ 开始）
        selectEnd: 39
    },
    matrix: {
        template: '$$\n\\begin{bmatrix}\n1 & 2 \\\\\n3 & 4\n\\end{bmatrix}\n$$',
        selectStart: 9, // 选中矩阵第一个元素 1
        selectEnd: 10
    },
    // 新增常用公式
    equation: {
        template: '$$\n\\begin{align}\nx &= a + b \\\\\ny &= c \\cdot d\n\\end{align}\n$$',
        selectStart: 9, // 选中第一个等式的 x
        selectEnd: 10
    },
    vector: {
        template: '$\\vec{v} = (x, y, z)$',
        selectStart: 1, // 选中整个公式（从 $ 开始）
        selectEnd: 19
    },
    derivative: {
        template: '$\\frac{d}{dx}f(x)$',
        selectStart: 11, // 选中 f(x) 中的 f
        selectEnd: 12
    },
    partial: {
        template: '$\\frac{\\partial f}{\\partial x}$',
        selectStart: 15, // 选中 f
        selectEnd: 16
    }
};
