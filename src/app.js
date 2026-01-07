/**
 * MarkX - 专业 Markdown + Mermaid 编辑器
 * 主入口文件 - 整合所有模块
 */

// ==================== 导入核心模块 ====================
import { AppState } from './core/state.js';
import { elements } from './core/elements.js';
import { setStatus } from './core/ui-utils.js';
import { loadDraft, startAutoSave } from './core/draft.js';

// ==================== 导入配置模块 ====================
import { initMermaid } from './config/mermaid.js';

// ==================== 导入编辑器模块 ====================
import { initEditor, getEditorInstance, setEditorChangeListener } from './editor/ace-editor.js';
import { initEditorResize } from './editor/resize.js';
import { insertText, mermaidTemplates, mathTemplates } from './editor/tools.js';

// ==================== 导入渲染模块 ====================
import { renderMarkdown } from './renderer/markdown.js';

// ==================== 导入 UI 模块 ====================
import { toggleTheme, initTheme } from './ui/theme.js';
import { toggleLayout } from './ui/layout.js';
import { initScrollSync } from './ui/scroll-sync.js';

// ==================== 导入文件操作模块 ====================
import { newDocument, openFile, saveFile, handleFileSelect } from './file/operations.js';

// ==================== 导入导出模块 ====================
import { exportPDF, exportPDFDefault, exportPDFFullPage } from './export/pdf.js';
import { exportHTML, copyMarkdown, copyHTML, clearContent } from './export/html.js';

// ==================== 键盘快捷键 ====================

/**
 * 处理键盘快捷键
 */
function handleKeyboard(event) {
    const ctrl = event.ctrlKey || event.metaKey;
    const key = event.key.toLowerCase();
    
    // 优先处理，阻止默认行为
    if (ctrl && key === 's') {
        event.preventDefault();
        event.stopPropagation();
        saveFile();
        return false;
    } else if (ctrl && key === 'o') {
        event.preventDefault();
        event.stopPropagation();
        openFile();
        return false;
    } else if (ctrl && key === 'n') {
        event.preventDefault();
        event.stopPropagation();
        newDocument();
        return false;
    } else if (ctrl && key === 'b') {
        // 只在编辑器聚焦时处理，避免与浏览器书签快捷键冲突
        const editor = getEditorInstance();
        if (editor && editor.isFocused()) {
            event.preventDefault();
            event.stopPropagation();
            insertText('**', '**', '加粗文本');
            return false;
        }
    } else if (ctrl && key === 'i') {
        // 只在编辑器聚焦时处理
        const editor = getEditorInstance();
        if (editor && editor.isFocused()) {
            event.preventDefault();
            event.stopPropagation();
            insertText('*', '*', '斜体文本');
            return false;
        }
    } else if (ctrl && key === 'k') {
        // 只在编辑器聚焦时处理
        const editor = getEditorInstance();
        if (editor && editor.isFocused()) {
            event.preventDefault();
            event.stopPropagation();
            insertText('[', '](https://example.com)', '链接文本');
            return false;
        }
    }
}

// ==================== 事件绑定 ====================

/**
 * 初始化所有事件监听器
 */
function initEventListeners() {
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
    document.getElementById('exportPdfBtn').addEventListener('click', exportPDF);
    document.getElementById('exportPdfDefaultBtn').addEventListener('click', exportPDFDefault);
    document.getElementById('exportPdfFullPageBtn').addEventListener('click', exportPDFFullPage);
    document.getElementById('exportHtmlBtn').addEventListener('click', exportHTML);
    document.getElementById('copyMdBtn').addEventListener('click', copyMarkdown);
    document.getElementById('copyHtmlBtn').addEventListener('click', copyHTML);
    document.getElementById('clearBtn').addEventListener('click', clearContent);
    
    // 帮助文档按钮
    function initHelpModal() {
        const helpBtn = document.getElementById('helpBtn');
        const helpModal = document.getElementById('helpModal');
        const helpModalClose = document.getElementById('helpModalClose');
        
        if (!helpBtn || !helpModal || !helpModalClose) {
            return;
        }
        
        // 使用 mousedown 事件，确保能捕获
        helpBtn.addEventListener('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleHelpModal(true);
        });
        
        helpBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleHelpModal(true);
        });
        
        helpModalClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleHelpModal(false);
        });
        
        helpModal.addEventListener('click', function(e) {
            if (e.target === helpModal) {
                toggleHelpModal(false);
            }
        });
        
        // ESC 键关闭帮助文档
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && helpModal.style.display === 'flex') {
                toggleHelpModal(false);
            }
        });
        
        function toggleHelpModal(show) {
            if (show) {
                helpModal.style.display = 'flex';
                helpModal.style.setProperty('display', 'flex', 'important');
                document.body.style.overflow = 'hidden';
            } else {
                helpModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        }
    }
    
    initHelpModal();
    initTemplateSearch();
    
    // 文件输入
    elements.fileInput.addEventListener('change', handleFileSelect);
}

/**
 * 初始化模板搜索功能
 */
function initTemplateSearch() {
    const searchInput = document.getElementById('templateSearchInput');
    const searchClear = document.getElementById('templateSearchClear');
    const searchResult = document.getElementById('templateSearchResult');
    const templatesContainer = document.getElementById('helpTemplates');
    
    if (!searchInput || !searchClear || !searchResult || !templatesContainer) {
        return;
    }
    
    // 搜索功能
    function performSearch(query) {
        const searchTerm = query.trim().toLowerCase();
        
        if (!searchTerm) {
            // 清空搜索
            searchClear.style.display = 'none';
            searchResult.style.display = 'none';
            searchResult.textContent = '';
            
            // 显示所有模板并移除高亮
            const allItems = templatesContainer.querySelectorAll('.help-template-item');
            allItems.forEach(item => {
                item.style.display = '';
                item.classList.remove('help-template-match');
            });
            
            const allCategories = templatesContainer.querySelectorAll('.help-template-category');
            allCategories.forEach(category => {
                category.style.display = '';
            });
            
            return;
        }
        
        // 显示清除按钮
        searchClear.style.display = 'flex';
        
        // 搜索所有模板项
        const allItems = templatesContainer.querySelectorAll('.help-template-item');
        let matchCount = 0;
        const matchedCategories = new Set();
        
        allItems.forEach(item => {
            const tag = item.querySelector('.help-template-tag');
            const desc = item.querySelector('.help-template-desc');
            
            if (!tag || !desc) return;
            
            const tagText = tag.textContent.toLowerCase();
            const descText = desc.textContent.toLowerCase();
            
            // 检查是否匹配
            let matches = tagText.includes(searchTerm) || descText.includes(searchTerm);
            
            // 特殊处理：处理范围标签（如 h1-h6）
            if (!matches) {
                // 如果搜索的是 h1-h6 中的某个，且标签是 h1-h6，应该匹配
                if (/^h[1-6]$/.test(searchTerm) && tagText.includes('h1-h6')) {
                    matches = true;
                }
                // 如果搜索的是数字（如 2、3、4），且标签包含范围（如 h1-h6、table-2col），检查是否在范围内
                else if (/^\d+$/.test(searchTerm)) {
                    const num = parseInt(searchTerm);
                    // 检查标签中是否包含范围，如 "h1-h6" 或 "table-2col"
                    const rangeMatch = tagText.match(/(\d+)-(\d+)/);
                    if (rangeMatch) {
                        const start = parseInt(rangeMatch[1]);
                        const end = parseInt(rangeMatch[2]);
                        if (num >= start && num <= end) {
                            matches = true;
                        }
                    }
                }
                // 如果搜索词是标签的一部分（如搜索 "h2" 匹配 "h1-h6"）
                else if (tagText.includes('-')) {
                    // 检查搜索词是否匹配标签中的任何部分
                    const parts = tagText.split(/[-_]/);
                    if (parts.some(part => part.includes(searchTerm) || searchTerm.includes(part))) {
                        matches = true;
                    }
                }
            }
            
            if (matches) {
                item.style.display = '';
                item.classList.add('help-template-match');
                matchCount++;
                
                // 标记父类别
                const category = item.closest('.help-template-category');
                if (category) {
                    matchedCategories.add(category);
                }
            } else {
                item.style.display = 'none';
                item.classList.remove('help-template-match');
            }
        });
        
        // 显示/隐藏类别
        const allCategories = templatesContainer.querySelectorAll('.help-template-category');
        allCategories.forEach(category => {
            const hasVisibleItems = Array.from(category.querySelectorAll('.help-template-item'))
                .some(item => item.style.display !== 'none');
            
            if (hasVisibleItems || matchedCategories.has(category)) {
                category.style.display = '';
            } else {
                category.style.display = 'none';
            }
        });
        
        // 显示搜索结果统计
        if (matchCount > 0) {
            searchResult.textContent = `找到 ${matchCount} 个匹配项`;
            searchResult.style.display = 'block';
            
            // 滚动到第一个匹配项
            const firstMatch = templatesContainer.querySelector('.help-template-match');
            if (firstMatch) {
                setTimeout(() => {
                    firstMatch.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            }
        } else {
            searchResult.textContent = '未找到匹配的模板';
            searchResult.style.display = 'block';
        }
    }
    
    // 输入事件
    searchInput.addEventListener('input', (e) => {
        performSearch(e.target.value);
    });
    
    // 清除按钮
    searchClear.addEventListener('click', () => {
        searchInput.value = '';
        performSearch('');
        searchInput.focus();
    });
    
    // Enter 键跳转到第一个结果
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const firstMatch = templatesContainer.querySelector('.help-template-match');
            if (firstMatch) {
                firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}

// ==================== 其他事件监听 ====================

function initOtherEventListeners() {
    // 键盘快捷键 - 使用 capture 模式确保优先捕获
    document.addEventListener('keydown', handleKeyboard, true);
    
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
    
    // 设置编辑器内容变化监听器
    const aceEditor = getEditorInstance();
    if (aceEditor) {
        setEditorChangeListener(() => {
            renderMarkdown();
        });
    }
}

// 初始化其他事件监听
initOtherEventListeners();

// ==================== 应用初始化 ====================

/**
 * 初始化应用
 */
async function initApp() {
    console.log('🚀 MarkX 正在启动...');
    
    try {
        // 初始化编辑器
        initEditor();
        
        // 将编辑器实例暴露到全局（供其他模块使用）
        window.__aceEditorInstance = getEditorInstance();
        
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
        
        // 初始化编辑器右侧拖拽调整大小
        initEditorResize();
        
        // 延迟初始化滚动同步，确保编辑器完全加载
        setTimeout(() => {
            initScrollSync();
        }, 1000);
        
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
