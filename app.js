/**
 * MarkX - 专业 Markdown + Mermaid 编辑器
 * 完整的前端应用逻辑
 */

// ==================== 导入依赖库 ====================
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import mermaid from 'mermaid';
import hljs from 'highlight.js';

// Ace Editor 通过全局变量 window.ace 加载，无需 import

// ==================== 应用状态管理 ====================
const AppState = {
    currentTheme: 'light',
    currentLayout: 'split', // split, editor-only, preview-only, vertical
    autoSaveTimer: null,
    currentFileName: 'untitled.md',
    isDirty: false,
};

// ==================== 配置 Marked.js ====================
const renderer = new marked.Renderer();

// 自定义代码块渲染 - 处理 Mermaid
renderer.code = function(code, language) {
    const lang = language || '';
    
    // 检测 Mermaid 代码块
    if (lang === 'mermaid' || lang === 'mmd') {
        return `<div class="mermaid">${code}</div>`;
    }
    
    // 其他代码使用 highlight.js 高亮
    if (lang && hljs.getLanguage(lang)) {
        try {
            const highlighted = hljs.highlight(code, { language: lang }).value;
            return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`;
        } catch (err) {
            console.error('代码高亮失败:', err);
        }
    }
    
    // 默认代码块
    return `<pre><code>${escapeHtml(code)}</code></pre>`;
};

// 自定义标题渲染 - 添加 ID 用于目录跳转
renderer.heading = function(text, level) {
    const id = generateHeadingId(text);
    return `<h${level} id="${id}">${text}</h${level}>`;
};

// 配置 Marked 选项
marked.setOptions({
    renderer: renderer,
    gfm: true, // GitHub Flavored Markdown
    breaks: true, // 支持换行
    pedantic: false,
    smartLists: true,
    smartypants: true,
});

// ==================== 配置 Mermaid ====================
function initMermaid() {
    const theme = AppState.currentTheme === 'dark' ? 'dark' : 'default';
    
    mermaid.initialize({
        startOnLoad: false,
        theme: theme,
        securityLevel: 'loose',
        fontFamily: 'var(--font-family)',
        themeVariables: {
            primaryColor: AppState.currentTheme === 'dark' ? '#2f81f7' : '#0969da',
            primaryTextColor: AppState.currentTheme === 'dark' ? '#e6edf3' : '#24292f',
            primaryBorderColor: AppState.currentTheme === 'dark' ? '#30363d' : '#d0d7de',
            lineColor: AppState.currentTheme === 'dark' ? '#484f58' : '#d0d7de',
            secondaryColor: AppState.currentTheme === 'dark' ? '#161b22' : '#f6f8fa',
            tertiaryColor: AppState.currentTheme === 'dark' ? '#0d1117' : '#ffffff',
        },
    });
}

// ==================== DOM 元素引用 ====================
const elements = {
    editor: document.getElementById('editor'),
    editorTextarea: document.getElementById('editorTextarea'),
    preview: document.getElementById('preview'),
    editorContainer: document.getElementById('editorContainer'),
    previewContainer: document.getElementById('previewContainer'),
    themeBtn: document.getElementById('themeBtn'),
    layoutBtn: document.getElementById('layoutBtn'),
    newBtn: document.getElementById('newBtn'),
    openBtn: document.getElementById('openBtn'),
    saveBtn: document.getElementById('saveBtn'),
    fileInput: document.getElementById('fileInput'),
    statusMessage: document.getElementById('statusMessage'),
    charCount: document.getElementById('charCount'),
    wordCount: document.getElementById('wordCount'),
    lineCount: document.getElementById('lineCount'),
    readTime: document.getElementById('readTime'),
};

// ==================== Ace Editor 编辑器 ====================

// 全局编辑器实例
let aceEditor = null;

// 默认文档内容
const defaultContent = `# 欢迎使用 MarkX！

现代化的 Markdown 编辑器，支持 **Mermaid 图表** 和 **KaTeX 数学公式**！

## ✨ 特色功能

- ✅ 实时预览
- ✅ Mermaid 图表支持
- ✅ KaTeX 数学公式
- ✅ 代码高亮
- ✅ 暗色/亮色主题
- ✅ 文件导入导出
- ✅ 自动保存草稿

---

## 📊 Mermaid 图表示例

点击工具栏的「图表」按钮快速插入模板！

\`\`\`mermaid
graph TD
    A[开始] --> B{是否喜欢?}
    B -->|是| C[太棒了!]
    B -->|否| D[试试其他功能]
    C --> E[分享给朋友]
    D --> E
\`\`\`

---

## 🧮 数学公式示例

点击工具栏的「公式」按钮快速插入模板！

**行内公式**：质能方程 $E = mc^2$，勾股定理 $a^2 + b^2 = c^2$

**块级公式**：

$$
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$

$$
\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}
$$

---

试试编辑内容，右侧会实时更新！🚀`;

/**
 * 初始化 Ace Editor
 */
function initEditor() {
    try {
        // 确保 Ace 已加载
        if (typeof window.ace === 'undefined') {
            console.error('❌ Ace Editor 未加载');
            return;
        }
        
        // 创建编辑器实例
        aceEditor = window.ace.edit('editor', {
            mode: 'ace/mode/markdown',
            theme: 'ace/theme/github',
            value: defaultContent,
            fontSize: '15px',
            showPrintMargin: false,
            highlightActiveLine: true,
            highlightGutterLine: true,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: false,
            enableSnippets: true,
            wrap: true,
            wrapBehavioursEnabled: true,
            tabSize: 4,
            useSoftTabs: true,
            showFoldWidgets: true,
            showLineNumbers: true,
            showGutter: true,
            displayIndentGuides: true,
            animatedScroll: true,
            vScrollBarAlwaysVisible: false,
            hScrollBarAlwaysVisible: false,
            scrollPastEnd: 0.5,
            behavioursEnabled: true,
            wrapBehavioursEnabled: true
        });
        
        // 获取 session
        const session = aceEditor.getSession();
        
        // 设置编辑器选项
        session.setUseWrapMode(true);
        
        // 监听内容变化
        aceEditor.session.on('change', () => {
            AppState.isDirty = true;
            debouncedRender();
        });
        
        // 自定义快捷键
        aceEditor.commands.addCommand({
            name: 'save',
            bindKey: { win: 'Ctrl-S', mac: 'Cmd-S' },
            exec: () => {
                saveFile();
            }
        });
        
        console.log('✅ Ace Editor 初始化成功');
        
    } catch (error) {
        console.error('❌ Ace Editor 初始化失败:', error);
        throw error;
    }
}

/**
 * 更新编辑器主题
 */
function updateEditorTheme(isDark) {
    if (!aceEditor) return;
    
    try {
        aceEditor.setTheme(isDark ? 'ace/theme/one_dark' : 'ace/theme/github');
    } catch (error) {
        console.error('更新主题失败:', error);
    }
}

/**
 * 获取编辑器内容
 */
function getEditorContent() {
    return aceEditor ? aceEditor.getValue() : '';
}

/**
 * 设置编辑器内容
 */
function setEditorContent(content) {
    if (!aceEditor) return;
    
    const cursorPosition = aceEditor.getCursorPosition();
    aceEditor.setValue(content, -1); // -1 移动光标到开始
    
    // 尝试恢复光标位置
    try {
        aceEditor.moveCursorToPosition(cursorPosition);
    } catch (e) {
        // 如果恢复失败，移动到文档开始
        aceEditor.moveCursorTo(0, 0);
    }
}

// ==================== 工具函数 ====================

/**
 * 防抖函数
 */
function debounce(func, wait) {
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

/**
 * 从标题文本生成 ID
 */
function generateHeadingId(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * 设置状态消息
 */
function setStatus(message, duration = 3000) {
    elements.statusMessage.textContent = message;
    if (duration > 0) {
        setTimeout(() => {
            elements.statusMessage.textContent = '就绪';
        }, duration);
    }
}

/**
 * 更新统计信息
 */
function updateStats(text) {
    // 字符数
    const charCount = text.length;
    elements.charCount.textContent = `${charCount.toLocaleString()} 字符`;
    
    // 词数（中英文混合）
    const chineseWords = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
    const totalWords = chineseWords + englishWords;
    elements.wordCount.textContent = `${totalWords.toLocaleString()} 词`;
    
    // 行数
    const lineCount = text.split('\n').length;
    elements.lineCount.textContent = `${lineCount.toLocaleString()} 行`;
    
    // 预计阅读时间（假设每分钟 200 中文字或 300 英文词）
    const readMinutes = Math.max(1, Math.ceil((chineseWords / 200) + (englishWords / 300)));
    elements.readTime.textContent = `预计阅读 ${readMinutes} 分钟`;
}

// ==================== Markdown 渲染 ====================

/**
 * 渲染 Markdown 为 HTML
 */
async function renderMarkdown() {
    let markdown = getEditorContent();
    
    try {
        // 预处理：保护数学公式不被 Markdown 解析器破坏
        const mathBlocks = [];
        let processedMarkdown = markdown;
        
        // 1. 先提取并保护块级公式 $$...$$（包括多行）
        processedMarkdown = processedMarkdown.replace(/\$\$([\s\S]+?)\$\$/g, (match, formula) => {
            const index = mathBlocks.length;
            mathBlocks.push({ type: 'display', formula: formula.trim() });
            return `MATH_BLOCK_PLACEHOLDER_${index}`;
        });
        
        // 2. 提取并保护行内公式 $...$（单行，不包含换行）
        processedMarkdown = processedMarkdown.replace(/\$([^\$\n]+?)\$/g, (match, formula) => {
            const index = mathBlocks.length;
            mathBlocks.push({ type: 'inline', formula: formula.trim() });
            return `MATH_INLINE_PLACEHOLDER_${index}`;
        });
        
        // 使用 Marked 解析 Markdown
        let html = marked.parse(processedMarkdown);
        
        // 还原数学公式占位符（在 DOMPurify 之前）
        mathBlocks.forEach((mathBlock, index) => {
            const placeholder = mathBlock.type === 'display' 
                ? `MATH_BLOCK_PLACEHOLDER_${index}`
                : `MATH_INLINE_PLACEHOLDER_${index}`;
            
            if (mathBlock.type === 'display') {
                // 块级公式用 div 包裹，确保独立成行
                html = html.replace(placeholder, `<div class="katex-block">$$${mathBlock.formula}$$</div>`);
            } else {
                // 行内公式直接替换
                html = html.replace(placeholder, `$${mathBlock.formula}$`);
            }
        });
        
        // 使用 DOMPurify 清理 HTML（防止 XSS）
        html = DOMPurify.sanitize(html, {
            ADD_TAGS: ['iframe', 'div'], 
            ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'class'],
        });
        
        // 更新预览区
        elements.preview.innerHTML = html;
        
        // 渲染数学公式 (KaTeX)
        if (window.renderMathInElement) {
            try {
                renderMathInElement(elements.preview, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true},   // 块级公式
                        {left: '$', right: '$', display: false},    // 行内公式
                        {left: '\\[', right: '\\]', display: true}, // 备用块级
                        {left: '\\(', right: '\\)', display: false} // 备用行内
                    ],
                    throwOnError: false,
                    errorColor: '#cc0000'
                });
            } catch (error) {
                console.warn('KaTeX 渲染失败:', error);
            }
        }
        
        // 渲染 Mermaid 图表
        await renderMermaidCharts();
        
        // 更新统计信息
        updateStats(markdown);
        
        setStatus('预览已更新');
        
    } catch (error) {
        console.error('渲染错误:', error);
        elements.preview.innerHTML = `
            <div class="mermaid-error">
                <div class="mermaid-error-title">渲染失败</div>
                <div>${escapeHtml(error.message)}</div>
            </div>
        `;
        setStatus('渲染失败', 5000);
    }
}

/**
 * 渲染所有 Mermaid 图表
 */
async function renderMermaidCharts() {
    const mermaidElements = elements.preview.querySelectorAll('.mermaid');
    
    if (mermaidElements.length === 0) return;
    
    // 重新初始化 Mermaid（以应用主题）
    initMermaid();
    
    // 渲染每个图表
    for (let i = 0; i < mermaidElements.length; i++) {
        const element = mermaidElements[i];
        const code = element.textContent;
        
        try {
            // 生成唯一 ID
            const id = `mermaid-${Date.now()}-${i}`;
            
            // 渲染图表
            const { svg } = await mermaid.render(id, code);
            
            // 创建容器包装 SVG 和导出按钮
            const wrapper = document.createElement('div');
            wrapper.className = 'mermaid-wrapper';
            wrapper.innerHTML = `
                <div class="mermaid-content">${svg}</div>
                <div class="mermaid-export-toolbar">
                    <button class="mermaid-export-btn" data-format="svg" title="导出为 SVG 矢量图（推荐）">
                        <svg class="icon"><use href="#icon-download"></use></svg>
                        <span class="text">SVG</span>
                    </button>
                    <button class="mermaid-export-btn" data-format="png" title="导出为 PNG 图片（高清 2x）&#10;如无反应请重试或使用 SVG">
                        <svg class="icon"><use href="#icon-image-download"></use></svg>
                        <span class="text">PNG</span>
                    </button>
                    <button class="mermaid-export-btn" data-action="fullscreen" title="全屏查看（支持缩放和拖拽）">
                        <svg class="icon"><use href="#icon-fullscreen"></use></svg>
                        <span class="text">全屏</span>
                    </button>
                </div>
            `;
            
            // 替换元素内容
            element.innerHTML = '';
            element.appendChild(wrapper);
            
            // 绑定导出事件
            bindMermaidExportEvents(wrapper, id);
            
        } catch (error) {
            console.error('Mermaid 渲染错误:', error);
            element.innerHTML = `
                <div class="mermaid-error">
                    <div class="mermaid-error-title">Mermaid 图表渲染失败</div>
                    <div>${escapeHtml(error.message)}</div>
                    <pre><code>${escapeHtml(code)}</code></pre>
                </div>
            `;
        }
    }
}

/**
 * 绑定 Mermaid 图表导出事件
 */
function bindMermaidExportEvents(wrapper, diagramId) {
    const exportButtons = wrapper.querySelectorAll('.mermaid-export-btn');
    
    exportButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // 防止重复点击
            if (btn.disabled) {
                console.log('按钮已禁用，忽略点击');
                return;
            }
            
            const action = btn.getAttribute('data-action');
            const format = btn.getAttribute('data-format');
            const svgElement = wrapper.querySelector('svg');
            
            if (!svgElement) {
                console.error('找不到 SVG 元素');
                setStatus('操作失败：找不到图表 ❌', 3000);
                return;
            }
            
            // 处理全屏按钮
            if (action === 'fullscreen') {
                openMermaidFullscreenViewer(svgElement, diagramId, wrapper);
                return;
            }
            
            // 禁用按钮，防止重复点击
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
            
            // 延迟后恢复按钮状态
            const enableButton = () => {
                setTimeout(() => {
                    btn.disabled = false;
                    btn.style.opacity = '';
                    btn.style.cursor = '';
                }, 1000);
            };
            
            if (format === 'svg') {
                exportMermaidAsSVG(svgElement, diagramId);
                enableButton();
            } else if (format === 'png') {
                exportMermaidAsPNG(svgElement, diagramId);
                enableButton();
            }
        });
    });
}

/**
 * 导出 Mermaid 图表为 SVG
 */
function exportMermaidAsSVG(svgElement, diagramId) {
    try {
        setStatus('正在导出 SVG...');
        
        // 克隆 SVG 元素
        const svgClone = svgElement.cloneNode(true);
        
        // 获取 SVG 字符串
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgClone);
        
        // 添加 XML 声明和样式
        const fullSvg = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
${svgString}`;
        
        // 创建 Blob 并下载
        const blob = new Blob([fullSvg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${diagramId}.svg`;
        a.click();
        URL.revokeObjectURL(url);
        
        setStatus('SVG 导出成功 ✅');
    } catch (error) {
        console.error('SVG 导出失败:', error);
        setStatus('SVG 导出失败 ❌', 3000);
    }
}

/**
 * 导出 Mermaid 图表为 PNG
 */
function exportMermaidAsPNG(svgElement, diagramId) {
    try {
        setStatus('正在导出 PNG...');
        console.log('开始导出 PNG:', diagramId);
        
        // 获取 SVG 尺寸
        const bbox = svgElement.getBoundingClientRect();
        const width = Math.floor(bbox.width);
        const height = Math.floor(bbox.height);
        
        console.log('SVG 尺寸:', width, 'x', height);
        
        // 检查尺寸是否有效
        if (width <= 0 || height <= 0) {
            throw new Error('SVG 尺寸无效');
        }
        
        // 创建 canvas
        const canvas = document.createElement('canvas');
        const scale = 2; // 提高清晰度
        canvas.width = width * scale;
        canvas.height = height * scale;
        const ctx = canvas.getContext('2d');
        ctx.scale(scale, scale);
        
        // 根据当前主题设置背景色
        const bgColor = AppState.currentTheme === 'dark' ? '#0d1117' : '#ffffff';
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
        
        // 将 SVG 转换为图片
        const svgClone = svgElement.cloneNode(true);
        
        // 确保 SVG 有正确的命名空间
        if (!svgClone.getAttribute('xmlns')) {
            svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        }
        
        const serializer = new XMLSerializer();
        let svgString = serializer.serializeToString(svgClone);
        
        // 编码 SVG 为 data URL（更可靠）
        const svgBase64 = btoa(unescape(encodeURIComponent(svgString)));
        const dataUrl = `data:image/svg+xml;base64,${svgBase64}`;
        
        const img = new Image();
        
        // 设置超时（10秒）
        const timeout = setTimeout(() => {
            console.error('PNG 导出超时');
            setStatus('PNG 导出超时 ⏱️ 请重试或使用 SVG 格式', 5000);
            alert('PNG 导出超时\n\n可能原因：\n1. 图表太大或太复杂\n2. 浏览器性能限制\n\n建议：\n• 再次点击重试\n• 或使用 SVG 格式导出');
        }, 10000);
        
        img.onload = () => {
            clearTimeout(timeout);
            console.log('图片加载成功');
            
            try {
                ctx.drawImage(img, 0, 0, width, height);
                
                // 导出为 PNG
                canvas.toBlob((blob) => {
                    if (!blob) {
                        console.error('Canvas toBlob 失败');
                        setStatus('PNG 转换失败 ❌', 3000);
                        return;
                    }
                    
                    console.log('PNG Blob 创建成功，大小:', blob.size);
                    
                    const pngUrl = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = pngUrl;
                    a.download = `${diagramId}.png`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    
                    // 延迟释放 URL
                    setTimeout(() => {
                        URL.revokeObjectURL(pngUrl);
                    }, 100);
                    
                    setStatus('PNG 导出成功 ✅');
                    console.log('PNG 导出完成');
                }, 'image/png');
            } catch (err) {
                clearTimeout(timeout);
                console.error('绘制或导出失败:', err);
                setStatus('PNG 导出失败 ❌', 3000);
            }
        };
        
        img.onerror = (err) => {
            clearTimeout(timeout);
            console.error('图片加载失败:', err);
            setStatus('PNG 导出失败 ❌ 建议使用 SVG 格式', 5000);
            
            // 提示用户
            if (confirm('PNG 导出失败\n\n建议改用 SVG 格式导出（矢量图，质量更好）\n\n是否立即导出为 SVG？')) {
                exportMermaidAsSVG(svgElement, diagramId);
            }
        };
        
        // 设置图片源
        img.src = dataUrl;
        
    } catch (error) {
        console.error('PNG 导出异常:', error);
        setStatus(`PNG 导出失败 ❌`, 5000);
        
        // 显示详细错误信息
        alert(`PNG 导出失败\n\n错误信息：${error.message}\n\n可能的解决方案：\n1. 刷新页面后重试\n2. 使用 SVG 格式导出\n3. 尝试缩小图表大小\n4. 使用其他浏览器\n\n如果问题持续，请打开浏览器控制台（F12）查看详细日志。`);
    }
}

/**
 * 打开 Mermaid 全屏查看器（支持缩放和拖拽）
 * 采用新方法：直接移动 SVG 元素，避免克隆导致的尺寸和样式问题
 */
function openMermaidFullscreenViewer(svgElement, diagramId, originalWrapper) {
    // 获取当前主题
    const currentTheme = document.body.getAttribute('data-theme') || 'light';
    
    // 获取 SVG 的实际尺寸（使用多种方法确保准确性）
    let svgWidth, svgHeight;
    
    // 方法1: 从 getBoundingClientRect 获取（最准确，反映实际渲染尺寸）
    const rect = svgElement.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
        svgWidth = rect.width;
        svgHeight = rect.height;
    }
    
    // 方法2: 从 getBBox 获取（SVG 内部尺寸）
    if ((!svgWidth || svgWidth === 0) && svgElement.getBBox) {
        try {
            const bbox = svgElement.getBBox();
            if (bbox.width > 0 && bbox.height > 0) {
                svgWidth = bbox.width;
                svgHeight = bbox.height;
            }
        } catch (e) {
            // getBBox 可能失败，继续尝试其他方法
        }
    }
    
    // 方法3: 从 viewBox 获取
    if (!svgWidth || svgWidth === 0) {
        const viewBox = svgElement.getAttribute('viewBox');
        if (viewBox) {
            const vb = viewBox.split(/\s+|,/).filter(v => v);
            if (vb.length >= 4) {
                svgWidth = parseFloat(vb[2]);
                svgHeight = parseFloat(vb[3]);
            }
        }
    }
    
    // 方法4: 从 width/height 属性获取
    if (!svgWidth || svgWidth === 0) {
        const widthAttr = svgElement.getAttribute('width');
        const heightAttr = svgElement.getAttribute('height');
        if (widthAttr && heightAttr) {
            svgWidth = parseFloat(widthAttr);
            svgHeight = parseFloat(heightAttr);
        }
    }
    
    // 如果还是没有尺寸，使用默认值
    if (!svgWidth || svgWidth === 0) {
        svgWidth = 800;
        svgHeight = 600;
        console.warn('无法获取 SVG 尺寸，使用默认值', {
            rect: rect,
            viewBox: svgElement.getAttribute('viewBox'),
            width: svgElement.getAttribute('width'),
            height: svgElement.getAttribute('height')
        });
    }
    
    console.log('获取到的 SVG 尺寸:', { svgWidth, svgHeight });
    
    // 创建全屏容器
    const viewer = document.createElement('div');
    viewer.className = 'mermaid-fullscreen-viewer';
    viewer.setAttribute('data-theme', currentTheme);
    viewer.id = `mermaid-viewer-${diagramId}`;
    
    // 创建查看器内容
    viewer.innerHTML = `
        <div class="mermaid-viewer-header">
            <div class="mermaid-viewer-title">Mermaid 图表查看器</div>
            <div class="mermaid-viewer-controls">
                <button class="mermaid-viewer-btn" data-action="zoom-in" title="放大 (滚轮向上)">
                    <svg class="icon"><use href="#icon-zoom-in"></use></svg>
                </button>
                <button class="mermaid-viewer-btn" data-action="zoom-out" title="缩小 (滚轮向下)">
                    <svg class="icon"><use href="#icon-zoom-out"></use></svg>
                </button>
                <button class="mermaid-viewer-btn" data-action="reset" title="重置视图">
                    <svg class="icon"><use href="#icon-reset-alt"></use></svg>
                </button>
                <button class="mermaid-viewer-btn" data-action="close" title="关闭 (ESC)">
                    <svg class="icon"><use href="#icon-close"></use></svg>
                </button>
            </div>
        </div>
        <div class="mermaid-viewer-content">
            <div class="mermaid-viewer-svg-container">
                <div class="mermaid-viewer-svg-wrapper"></div>
            </div>
        </div>
        <div class="mermaid-viewer-footer">
            <span class="mermaid-viewer-hint">鼠标滚轮：缩放 | 鼠标拖拽：平移 | ESC：关闭</span>
        </div>
    `;
    
    // 添加到 body
    document.body.appendChild(viewer);
    document.body.classList.add('mermaid-viewer-active');
    
    // 克隆 SVG 而不是移动它（避免恢复问题）
    // 使用 outerHTML 克隆可以保留所有样式和属性
    const svgClone = svgElement.cloneNode(true);
    
    // 确保克隆的 SVG 有正确的尺寸属性
    if (!svgClone.getAttribute('width') || svgClone.getAttribute('width') === '0') {
        svgClone.setAttribute('width', svgWidth);
    }
    if (!svgClone.getAttribute('height') || svgClone.getAttribute('height') === '0') {
        svgClone.setAttribute('height', svgHeight);
    }
    
    // 获取包装器并添加克隆的 SVG
    const wrapper = viewer.querySelector('.mermaid-viewer-svg-wrapper');
    wrapper.appendChild(svgClone);
    
    // 保存信息到 viewer（不需要恢复，因为原始 SVG 没有被移动）
    viewer._svgWidth = svgWidth;
    viewer._svgHeight = svgHeight;
    
    // 确保 SVG 立即可见，避免尺寸为 0
    svgElement.style.display = 'block';
    svgElement.style.visibility = 'visible';
    svgElement.style.maxWidth = 'none';
    svgElement.style.maxHeight = 'none';
    
    // 如果 SVG 没有明确的尺寸属性，立即设置
    if (!svgElement.getAttribute('width') || svgElement.getAttribute('width') === '0') {
        svgElement.setAttribute('width', svgWidth);
    }
    if (!svgElement.getAttribute('height') || svgElement.getAttribute('height') === '0') {
        svgElement.setAttribute('height', svgHeight);
    }
    
    // 等待 DOM 渲染完成后再初始化（使用多个 requestAnimationFrame 确保完全渲染）
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            setTimeout(() => {
                // 再次验证尺寸，如果保存的尺寸无效，尝试重新获取
                if (!viewer._svgWidth || viewer._svgWidth === 0) {
                    const newRect = svgElement.getBoundingClientRect();
                    if (newRect.width > 0 && newRect.height > 0) {
                        viewer._svgWidth = newRect.width;
                        viewer._svgHeight = newRect.height;
                        console.log('重新获取 SVG 尺寸:', { width: viewer._svgWidth, height: viewer._svgHeight });
                    }
                }
                initMermaidViewer(viewer, svgClone);
            }, 100);
        });
    });
    
    setStatus('已打开全屏查看器');
}

/**
 * 初始化 Mermaid 查看器（缩放和拖拽功能）
 */
function initMermaidViewer(viewer, svgElement) {
    const container = viewer.querySelector('.mermaid-viewer-svg-container');
    const wrapper = viewer.querySelector('.mermaid-viewer-svg-wrapper');
    const svg = svgElement;
    
    if (!container || !wrapper || !svg) {
        console.error('查看器初始化失败：找不到容器或 SVG', { container, wrapper, svg });
        return;
    }
    
    // 获取 SVG 尺寸（优先使用保存的尺寸）
    let svgWidth = viewer._svgWidth;
    let svgHeight = viewer._svgHeight;
    
    // 如果保存的尺寸无效，尝试从当前 SVG 获取
    if (!svgWidth || svgWidth === 0) {
        // 方法1: 从 getBBox 获取（SVG 内部尺寸，最可靠）
        if (svg.getBBox) {
            try {
                const bbox = svg.getBBox();
                if (bbox.width > 0 && bbox.height > 0) {
                    svgWidth = bbox.width;
                    svgHeight = bbox.height;
                }
            } catch (e) {
                console.warn('无法从 getBBox 获取尺寸', e);
            }
        }
        
        // 方法2: 从 viewBox 获取
        if (!svgWidth || svgWidth === 0) {
            const viewBox = svg.getAttribute('viewBox');
            if (viewBox) {
                const vb = viewBox.split(/\s+|,/).filter(v => v);
                if (vb.length >= 4) {
                    svgWidth = parseFloat(vb[2]);
                    svgHeight = parseFloat(vb[3]);
                }
            }
        }
        
        // 方法3: 从属性获取
        if (!svgWidth || svgWidth === 0) {
            const widthAttr = svg.getAttribute('width');
            const heightAttr = svg.getAttribute('height');
            if (widthAttr && heightAttr) {
                svgWidth = parseFloat(widthAttr);
                svgHeight = parseFloat(heightAttr);
            }
        }
        
        // 方法4: 从 getBoundingClientRect 获取（可能不准确，因为 SVG 刚移动）
        if (!svgWidth || svgWidth === 0) {
            const rect = svg.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                svgWidth = rect.width;
                svgHeight = rect.height;
            }
        }
        
        // 如果还是没有尺寸，使用默认值
        if (!svgWidth || svgWidth === 0) {
            svgWidth = 800;
            svgHeight = 600;
            console.warn('无法获取 SVG 尺寸，使用默认值');
        }
    }
    
    // 确保 SVG 有明确的尺寸属性（如果缺失则添加）
    if (!svg.getAttribute('width') || svg.getAttribute('width') === '0') {
        svg.setAttribute('width', svgWidth);
    }
    if (!svg.getAttribute('height') || svg.getAttribute('height') === '0') {
        svg.setAttribute('height', svgHeight);
    }
    
    // 确保 SVG 可见且有尺寸
    svg.style.display = 'block';
    svg.style.visibility = 'visible';
    svg.style.maxWidth = 'none';
    svg.style.maxHeight = 'none';
    
    console.log('初始化时的 SVG 尺寸:', { 
        svgWidth, 
        svgHeight, 
        savedSize: { width: viewer._svgWidth, height: viewer._svgHeight },
        attrSize: { width: svg.getAttribute('width'), height: svg.getAttribute('height') },
        viewBox: svg.getAttribute('viewBox'),
        bbox: svg.getBBox ? (() => {
            try {
                const b = svg.getBBox();
                return { width: b.width, height: b.height };
            } catch (e) {
                return null;
            }
        })() : null
    });
    
    // 查看器状态
    const state = {
        scale: 1,
        translateX: 0,
        translateY: 0,
        isDragging: false,
        startX: 0,
        startY: 0,
        startTranslateX: 0,
        startTranslateY: 0,
        minScale: 0.1,
        maxScale: 5,
        svgWidth: svgWidth,
        svgHeight: svgHeight
    };
    
    // 更新 SVG 包装器的变换
    function updateTransform() {
        wrapper.style.transform = `translate(${state.translateX}px, ${state.translateY}px) scale(${state.scale})`;
        wrapper.style.transformOrigin = '0 0';
    }
    
    // 居中显示函数
    function centerView() {
        const containerRect = container.getBoundingClientRect();
        const actualWidth = state.svgWidth * state.scale;
        const actualHeight = state.svgHeight * state.scale;
        
        state.translateX = (containerRect.width - actualWidth) / 2;
        state.translateY = (containerRect.height - actualHeight) / 2;
        updateTransform();
    }
    
    // 重置视图并居中
    function resetView() {
        state.scale = 1;
        centerView();
        
        // 延迟再次居中，确保 SVG 完全渲染
        setTimeout(() => {
            centerView();
        }, 50);
    }
    
    // 缩放
    function zoom(delta, clientX, clientY) {
        const rect = container.getBoundingClientRect();
        
        // 计算鼠标相对于容器的位置
        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;
        
        // 计算鼠标相对于当前 SVG 的位置（考虑当前的变换）
        const svgX = (mouseX - state.translateX) / state.scale;
        const svgY = (mouseY - state.translateY) / state.scale;
        
        const oldScale = state.scale;
        const newScale = Math.max(state.minScale, Math.min(state.maxScale, state.scale + delta));
        
        if (newScale === oldScale) return;
        
        // 以鼠标位置为中心缩放
        state.translateX = mouseX - svgX * newScale;
        state.translateY = mouseY - svgY * newScale;
        state.scale = newScale;
        
        updateTransform();
    }
    
    // 鼠标滚轮缩放
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const delta = -e.deltaY * 0.01;
        zoom(delta, e.clientX, e.clientY);
    }, { passive: false });
    
    // 也监听 viewer-content 的滚轮事件
    const content = viewer.querySelector('.mermaid-viewer-content');
    if (content) {
        content.addEventListener('wheel', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const delta = -e.deltaY * 0.01;
            zoom(delta, e.clientX, e.clientY);
        }, { passive: false });
    }
    
    // 鼠标拖拽
    const handleMouseDown = (e) => {
        if (e.button !== 0) return; // 只处理左键
        // 如果点击的是按钮，不触发拖拽
        if (e.target.closest('.mermaid-viewer-btn')) return;
        
        state.isDragging = true;
        state.startX = e.clientX;
        state.startY = e.clientY;
        state.startTranslateX = state.translateX;
        state.startTranslateY = state.translateY;
        container.style.cursor = 'grabbing';
        wrapper.style.cursor = 'grabbing';
        e.preventDefault();
    };
    
    const handleMouseMove = (e) => {
        if (!state.isDragging) return;
        state.translateX = state.startTranslateX + (e.clientX - state.startX);
        state.translateY = state.startTranslateY + (e.clientY - state.startY);
        updateTransform();
    };
    
    const handleMouseUp = () => {
        if (state.isDragging) {
            state.isDragging = false;
            container.style.cursor = 'grab';
            wrapper.style.cursor = 'grab';
        }
    };
    
    container.addEventListener('mousedown', handleMouseDown);
    wrapper.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // 按钮事件
    const zoomInBtn = viewer.querySelector('[data-action="zoom-in"]');
    const zoomOutBtn = viewer.querySelector('[data-action="zoom-out"]');
    const resetBtn = viewer.querySelector('[data-action="reset"]');
    const closeBtn = viewer.querySelector('[data-action="close"]');
    
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            const rect = container.getBoundingClientRect();
            zoom(0.1, rect.left + rect.width / 2, rect.top + rect.height / 2);
        });
    }
    
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            const rect = container.getBoundingClientRect();
            zoom(-0.1, rect.left + rect.width / 2, rect.top + rect.height / 2);
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetView);
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeMermaidViewer(viewer);
        });
    }
    
    // ESC 键关闭
    const handleEsc = (e) => {
        if (e.key === 'Escape' && document.body.contains(viewer)) {
            closeMermaidViewer(viewer);
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
    
    // 保存状态和事件处理器
    viewer._viewerState = state;
    viewer._viewerEscHandler = handleEsc;
    
    // 初始化样式
    container.style.cursor = 'grab';
    wrapper.style.cursor = 'grab';
    wrapper.style.display = 'inline-block';
    wrapper.style.willChange = 'transform';
    
    // 初始居中显示
    centerView();
    
    // 延迟再次居中，确保 SVG 完全渲染
    setTimeout(centerView, 100);
    setTimeout(centerView, 300);
    
    updateTransform();
}

/**
 * 关闭 Mermaid 查看器（不需要恢复，因为使用的是克隆的 SVG）
 */
function closeMermaidViewer(viewer) {
    // 清理事件监听器
    if (viewer._viewerEscHandler) {
        document.removeEventListener('keydown', viewer._viewerEscHandler);
    }
    
    // 移除查看器（克隆的 SVG 会随着查看器一起被移除）
    if (document.body.contains(viewer)) {
        document.body.removeChild(viewer);
    }
    document.body.classList.remove('mermaid-viewer-active');
    
    setStatus('已关闭全屏查看器');
}

/**
 * 防抖渲染（避免输入时频繁渲染）
 */
const debouncedRender = debounce(renderMarkdown, 300);

// ==================== 主题切换 ====================

/**
 * 切换主题
 */
function toggleTheme() {
    AppState.currentTheme = AppState.currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', AppState.currentTheme);
    
    // 更新主题图标
    const themeIcon = elements.themeBtn.querySelector('use');
    themeIcon.setAttribute('href', 
        AppState.currentTheme === 'dark' ? '#icon-theme-light' : '#icon-theme-dark');
    
    // 更新 CodeMirror 主题
    updateEditorTheme(AppState.currentTheme === 'dark');
    
    // 切换代码高亮主题
    const lightTheme = document.getElementById('highlight-light');
    const darkTheme = document.getElementById('highlight-dark');
    if (AppState.currentTheme === 'dark') {
        lightTheme.disabled = true;
        darkTheme.disabled = false;
    } else {
        lightTheme.disabled = false;
        darkTheme.disabled = true;
    }
    
    // 保存到 localStorage
    localStorage.setItem('markx-theme', AppState.currentTheme);
    
    // 重新渲染 Mermaid 图表（应用新主题）
    renderMarkdown();
    
    setStatus(`已切换到${AppState.currentTheme === 'dark' ? '暗色' : '亮色'}模式`);
}

/**
 * 初始化主题
 */
function initTheme() {
    // 从 localStorage 读取主题设置
    const savedTheme = localStorage.getItem('markx-theme');
    if (savedTheme) {
        AppState.currentTheme = savedTheme;
    } else {
        // 检测系统主题偏好
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            AppState.currentTheme = 'dark';
        }
    }
    
    document.body.setAttribute('data-theme', AppState.currentTheme);
    const themeIcon = elements.themeBtn.querySelector('use');
    themeIcon.setAttribute('href', 
        AppState.currentTheme === 'dark' ? '#icon-theme-light' : '#icon-theme-dark');
    
    // 更新 CodeMirror 主题
    updateEditorTheme(AppState.currentTheme === 'dark');
    
    // 设置代码高亮主题
    const lightTheme = document.getElementById('highlight-light');
    const darkTheme = document.getElementById('highlight-dark');
    if (AppState.currentTheme === 'dark') {
        lightTheme.disabled = true;
        darkTheme.disabled = false;
    }
}

// ==================== 布局切换 ====================

/**
 * 切换布局模式
 */
function toggleLayout() {
    const layouts = ['split', 'editor-only', 'preview-only', 'vertical'];
    const currentIndex = layouts.indexOf(AppState.currentLayout);
    const nextIndex = (currentIndex + 1) % layouts.length;
    AppState.currentLayout = layouts[nextIndex];
    
    // 移除所有布局类
    document.body.classList.remove(
        'layout-editor-only',
        'layout-preview-only',
        'layout-vertical'
    );
    
    // 添加新布局类
    if (AppState.currentLayout !== 'split') {
        document.body.classList.add(`layout-${AppState.currentLayout}`);
    }
    
    const layoutNames = {
        'split': '分屏',
        'editor-only': '仅编辑器',
        'preview-only': '仅预览',
        'vertical': '上下分屏'
    };
    
    setStatus(`布局: ${layoutNames[AppState.currentLayout]}`);
}

// ==================== 文件操作 ====================

/**
 * 新建文档
 */
function newDocument() {
    if (AppState.isDirty) {
        if (!confirm('当前文档未保存，确定要新建吗？')) {
            return;
        }
    }
    
    setEditorContent('');
    AppState.currentFileName = 'untitled.md';
    AppState.isDirty = false;
    renderMarkdown();
    setStatus('已新建文档');
}

/**
 * 打开文件
 */
function openFile() {
    elements.fileInput.click();
}

/**
 * 处理文件选择
 */
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        setEditorContent(e.target.result);
        AppState.currentFileName = file.name;
        AppState.isDirty = false;
        renderMarkdown();
        setStatus(`已打开 ${file.name}`);
    };
    reader.onerror = () => {
        setStatus('文件读取失败', 5000);
    };
    reader.readAsText(file);
    
    // 重置 input 以允许重复选择同一文件
    event.target.value = '';
}

/**
 * 保存文件
 */
function saveFile() {
    // 提取当前文件名（不含扩展名）
    const currentName = AppState.currentFileName.replace('.md', '');
    
    // 弹出对话框让用户输入文件名
    const fileName = prompt('请输入文件名（无需输入 .md 扩展名）:', currentName);
    
    // 如果用户取消或输入为空，则不保存
    if (!fileName || fileName.trim() === '') {
        return;
    }
    
    // 清理文件名，添加 .md 扩展名
    const cleanFileName = fileName.trim();
    const fullFileName = cleanFileName.endsWith('.md') ? cleanFileName : `${cleanFileName}.md`;
    
    // 更新当前文件名
    AppState.currentFileName = fullFileName;
    
    // 保存文件
    const content = getEditorContent();
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fullFileName;
    a.click();
    URL.revokeObjectURL(url);
    
    AppState.isDirty = false;
    setStatus(`已保存 ${fullFileName}`);
}

/**
 * 导出 HTML
 */
function exportHTML() {
    // 克隆预览区内容，避免修改原始 DOM
    const previewClone = elements.preview.cloneNode(true);
    
    // 移除所有 .mermaid 元素的 mermaid 类，避免 Mermaid 脚本再次渲染
    const mermaidElements = previewClone.querySelectorAll('.mermaid');
    mermaidElements.forEach(el => {
        el.classList.remove('mermaid');
    });
    
    // 移除导出工具栏（导出的 HTML 不需要这些按钮）
    const toolbars = previewClone.querySelectorAll('.mermaid-export-toolbar');
    toolbars.forEach(toolbar => toolbar.remove());
    
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${AppState.currentFileName.replace('.md', '')}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github.min.css">
    <style>
        body {
            max-width: 900px;
            margin: 40px auto;
            padding: 0 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #24292f;
        }
        .markdown-body { color: #24292f; }
        .markdown-body h1, .markdown-body h2 { border-bottom: 1px solid #d0d7de; padding-bottom: 0.3em; }
        .markdown-body code { background: #f6f8fa; padding: 0.2em 0.4em; border-radius: 6px; }
        .markdown-body pre { background: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x: auto; }
        .markdown-body table { border-collapse: collapse; width: 100%; }
        .markdown-body table th, .markdown-body table td { border: 1px solid #d0d7de; padding: 6px 13px; }
        .mermaid-wrapper { margin: 24px 0; }
        .mermaid-content { padding: 16px; }
        .mermaid-content svg { display: block; }
    </style>
</head>
<body>
    <div class="markdown-body">
        ${previewClone.innerHTML}
    </div>
    <!-- 不需要 Mermaid 脚本，因为 SVG 已经渲染好了 -->
</body>
</html>`;
    
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = AppState.currentFileName.replace('.md', '.html');
    a.click();
    URL.revokeObjectURL(url);
    
    setStatus('已导出 HTML');
}

/**
 * 复制 Markdown
 */
async function copyMarkdown() {
    try {
        await navigator.clipboard.writeText(getEditorContent());
        setStatus('Markdown 已复制到剪贴板');
    } catch (err) {
        console.error('复制失败:', err);
        setStatus('复制失败', 3000);
    }
}

/**
 * 复制 HTML
 */
async function copyHTML() {
    try {
        await navigator.clipboard.writeText(elements.preview.innerHTML);
        setStatus('HTML 已复制到剪贴板');
    } catch (err) {
        console.error('复制失败:', err);
        setStatus('复制失败', 3000);
    }
}

/**
 * 清空内容
 */
function clearContent() {
    if (!confirm('确定要清空所有内容吗？此操作不可恢复。')) {
        return;
    }
    setEditorContent('');
    AppState.isDirty = false;
    renderMarkdown();
    setStatus('已清空内容');
}

// ==================== Markdown 编辑工具 ====================

/**
 * 在编辑器中插入文本
 */
function insertText(before, after = '', placeholder = '') {
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
const mermaidTemplates = {
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
 */
const mathTemplates = {
    inline: ' $x$ ',
    block: '\n$$\nx\n$$\n\n',
    fraction: '$\\frac{a}{b}$ ',
    sqrt: '$\\sqrt{x}$ ',
    sum: '$\\sum_{i=1}^{n} a_i$ ',
    integral: '$\\int_{a}^{b} f(x)dx$ ',
    limit: '$\\lim_{x \\to \\infty} f(x)$ ',
    matrix: '\n$$\n\\begin{bmatrix}\na & b \\\\\nc & d\n\\end{bmatrix}\n$$\n\n'
};

// ==================== 本地存储（自动保存） ====================

/**
 * 保存草稿到 localStorage
 */
function saveDraft() {
    try {
        localStorage.setItem('markx-draft', getEditorContent());
        localStorage.setItem('markx-draft-time', new Date().toISOString());
    } catch (err) {
        console.error('保存草稿失败:', err);
    }
}

/**
 * 加载草稿
 */
function loadDraft() {
    try {
        const draft = localStorage.getItem('markx-draft');
        const draftTime = localStorage.getItem('markx-draft-time');
        const autoRestore = localStorage.getItem('markx-auto-restore');
        
        if (draft && draftTime) {
            const time = new Date(draftTime);
            const now = new Date();
            const diffMinutes = (now - time) / 1000 / 60;
            
            // 如果草稿是最近 7 天内的
            if (diffMinutes < 7 * 24 * 60) {
                // 检查是否设置了自动恢复
                if (autoRestore === 'always') {
                    // 自动恢复，不提示
                    setEditorContent(draft);
                    renderMarkdown();
                    setStatus('已自动恢复草稿');
                } else if (autoRestore === 'never') {
                    // 永不恢复，不提示
                    return;
                } else {
                    // 首次或每次询问
                    const timeStr = time.toLocaleString('zh-CN');
                    const message = `发现 ${timeStr} 的草稿，是否恢复？\n\n提示：可以在下方选择记住此操作`;
                    
                    // 创建自定义对话框
                    showDraftRestoreDialog(draft, timeStr);
                }
            }
        }
    } catch (err) {
        console.error('加载草稿失败:', err);
    }
}

/**
 * 显示草稿恢复对话框
 */
function showDraftRestoreDialog(draft, timeStr) {
    // 创建对话框容器
    const dialog = document.createElement('div');
    dialog.className = 'draft-dialog';
    dialog.innerHTML = `
        <div class="draft-dialog-overlay"></div>
        <div class="draft-dialog-content">
            <h3>
                <svg style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;"><use href="#icon-save"></use></svg>
                发现未保存的草稿
            </h3>
            <p>上次编辑时间：${timeStr}</p>
            <div class="draft-dialog-actions">
                <label class="draft-dialog-checkbox">
                    <input type="checkbox" id="draftRemember">
                    <span>记住我的选择</span>
                </label>
                <div class="draft-dialog-buttons">
                    <button class="draft-btn draft-btn-secondary" id="draftIgnore">忽略</button>
                    <button class="draft-btn draft-btn-primary" id="draftRestore">恢复草稿</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    // 绑定事件
    const remember = dialog.querySelector('#draftRemember');
    const ignoreBtn = dialog.querySelector('#draftIgnore');
    const restoreBtn = dialog.querySelector('#draftRestore');
    
    ignoreBtn.addEventListener('click', () => {
        if (remember.checked) {
            localStorage.setItem('markx-auto-restore', 'never');
        }
        document.body.removeChild(dialog);
    });
    
    restoreBtn.addEventListener('click', () => {
        if (remember.checked) {
            localStorage.setItem('markx-auto-restore', 'always');
        }
        setEditorContent(draft);
        renderMarkdown();
        setStatus('已恢复草稿');
        document.body.removeChild(dialog);
    });
    
    // ESC 键关闭
    const handleEsc = (e) => {
        if (e.key === 'Escape' && document.body.contains(dialog)) {
            document.body.removeChild(dialog);
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
}

/**
 * 定期自动保存
 */
function startAutoSave() {
    AppState.autoSaveTimer = setInterval(() => {
        if (AppState.isDirty || elements.editor.value) {
            saveDraft();
        }
    }, 30000); // 每 30 秒保存一次
}

// ==================== 键盘快捷键 ====================

/**
 * 处理键盘快捷键
 */
function handleKeyboard(event) {
    const ctrl = event.ctrlKey || event.metaKey;
    
    if (ctrl && event.key === 's') {
        event.preventDefault();
        saveFile();
    } else if (ctrl && event.key === 'o') {
        event.preventDefault();
        openFile();
    } else if (ctrl && event.key === 'n') {
        event.preventDefault();
        newDocument();
    } else if (ctrl && event.key === 'b') {
        event.preventDefault();
        insertText('**', '**', '加粗文本');
    } else if (ctrl && event.key === 'i') {
        event.preventDefault();
        insertText('*', '*', '斜体文本');
    } else if (ctrl && event.key === 'k') {
        event.preventDefault();
        insertText('[', '](https://example.com)', '链接文本');
    }
}

// ==================== 事件绑定 ====================

/**
 * 初始化所有事件监听器
 */
function initEventListeners() {
    // Ace Editor 的输入和键盘事件已在编辑器初始化时设置
    
    // 工具栏按钮
    elements.newBtn.addEventListener('click', newDocument);
    elements.openBtn.addEventListener('click', openFile);
    elements.saveBtn.addEventListener('click', saveFile);
    elements.themeBtn.addEventListener('click', toggleTheme);
    elements.layoutBtn.addEventListener('click', toggleLayout);
    
    // Markdown 格式化按钮
    document.getElementById('boldBtn').addEventListener('click', () => {
        insertText('**', '**', '加粗文本');
    });
    
    document.getElementById('italicBtn').addEventListener('click', () => {
        insertText('*', '*', '斜体文本');
    });
    
    document.getElementById('headingBtn').addEventListener('click', () => {
        insertText('## ', '', '标题');
    });
    
    document.getElementById('linkBtn').addEventListener('click', () => {
        insertText('[', '](https://example.com)', '链接文本');
    });
    
    document.getElementById('imageBtn').addEventListener('click', () => {
        insertText('![', '](https://example.com/image.jpg)', '图片描述');
    });
    
    document.getElementById('codeBtn').addEventListener('click', () => {
        insertText('```javascript\n', '\n```\n', '代码');
    });
    
    document.getElementById('tableBtn').addEventListener('click', () => {
        const table = '| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| 单元格1 | 单元格2 | 单元格3 |\n\n';
        insertText(table);
    });
    
    // Mermaid 模板按钮（使用 mousedown 事件以避免菜单过早关闭）
    document.querySelectorAll('[data-mermaid]').forEach(btn => {
        btn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const type = btn.getAttribute('data-mermaid');
            insertText(mermaidTemplates[type]);
            setStatus(`已插入${btn.textContent}模板`);
        });
    });
    
    // 数学公式按钮（使用 mousedown 事件以避免菜单过早关闭）
    document.querySelectorAll('[data-math]').forEach(btn => {
        btn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const type = btn.getAttribute('data-math');
            insertText(mathTemplates[type]);
            setStatus(`已插入${btn.textContent.split(' ')[0]}`);
        });
    });
    
    // 更多选项按钮
    document.getElementById('exportHtmlBtn').addEventListener('click', exportHTML);
    document.getElementById('copyMdBtn').addEventListener('click', copyMarkdown);
    document.getElementById('copyHtmlBtn').addEventListener('click', copyHTML);
    document.getElementById('clearBtn').addEventListener('click', clearContent);
    
    // 文件输入
    elements.fileInput.addEventListener('change', handleFileSelect);
    
    // 键盘快捷键
    document.addEventListener('keydown', handleKeyboard);
    
    // 页面离开警告（有未保存内容时）
    window.addEventListener('beforeunload', (e) => {
        if (AppState.isDirty) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
    
    // 系统主题变化监听
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('markx-theme')) {
                AppState.currentTheme = e.matches ? 'dark' : 'light';
                document.body.setAttribute('data-theme', AppState.currentTheme);
                renderMarkdown();
            }
        });
    }
}

// ==================== 应用初始化 ====================

/**
 * 初始化应用
 */
async function initApp() {
    console.log('🚀 MarkX 正在启动...');
    
    try {
        // 初始化编辑器
        initEditor();
        
        // 初始化主题
        initTheme();
        
        // 初始化 Mermaid
        initMermaid();
        
        // 加载草稿
        loadDraft();
        
        // 初始渲染
        await renderMarkdown();
        
        // 绑定事件
        initEventListeners();
        
        // 启动自动保存
        startAutoSave();
        
        console.log('✅ MarkX 启动成功！');
        setStatus('就绪');
        
    } catch (error) {
        console.error('❌ 启动失败:', error);
        setStatus('启动失败', 0);
    }
}

// ==================== 启动应用 ====================

// 等待 DOM 完全加载后启动
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// 导出供调试使用
window.MarkX = {
    state: AppState,
    render: renderMarkdown,
    version: '1.0.0',
};

