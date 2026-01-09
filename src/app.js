/**
 * MarkX - 专业 Markdown + Mermaid 编辑器
 * 主入口文件 - 整合所有模块
 */

// ==================== 导入核心模块 ====================
import { AppState } from './core/state.js';
import { elements } from './core/elements.js';
import { setStatus, updateStats } from './core/ui-utils.js';
import { loadDraft, startAutoSave } from './core/draft.js';
import { initI18n, t, setLanguage, getLanguage } from './core/i18n.js';

// 导出 t 函数供其他模块使用
window.t = t;

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
import { initFullscreen, toggleFullscreen } from './ui/fullscreen.js';
import { initScrollSync } from './ui/scroll-sync.js';
import { initMobileToolbar } from './ui/mobile-toolbar.js';

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
    
    // F11 全屏切换
    if (event.key === 'F11') {
        event.preventDefault();
        toggleFullscreen();
        return false;
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
        insertText('**', '**', t('insertText.bold'));
    });
    
    document.getElementById('italicBtn').addEventListener('click', () => {
        insertText('*', '*', t('insertText.italic'));
    });
    
    document.getElementById('headingBtn').addEventListener('click', () => {
        insertText('## ', '', t('insertText.heading'));
    });
    
    document.getElementById('linkBtn').addEventListener('click', () => {
        insertText('[', '](https://example.com)', t('insertText.link'));
    });
    
    document.getElementById('imageBtn').addEventListener('click', () => {
        insertText('![', '](https://example.com/image.jpg)', t('insertText.image'));
    });
    
    document.getElementById('codeBtn').addEventListener('click', () => {
        insertText('```javascript\n', '\n```\n', t('insertText.code'));
    });
    
    document.getElementById('tableBtn').addEventListener('click', () => {
        insertText(t('insertText.table'));
    });
    
    // Mermaid 模板按钮（使用 mousedown 事件以避免菜单过早关闭）
    document.querySelectorAll('[data-mermaid]').forEach(btn => {
        btn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const type = btn.getAttribute('data-mermaid');
            insertText(mermaidTemplates[type]);
            const templateName = btn.textContent.trim();
            setStatus(t('messages.insertedTemplate', { name: templateName }));
        });
    });
    
    // 数学公式按钮（使用 mousedown 事件以避免菜单过早关闭）
    document.querySelectorAll('[data-math]').forEach(btn => {
        btn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const type = btn.getAttribute('data-math');
            const templateConfig = mathTemplates[type];
            if (!templateConfig) return;
            
            const aceEditor = getEditorInstance();
            if (!aceEditor) return;
            
            // 支持新的模板格式（对象）和旧格式（字符串）
            let template, selectStart, selectEnd;
            if (typeof templateConfig === 'object' && templateConfig.template) {
                template = templateConfig.template;
                selectStart = templateConfig.selectStart;
                selectEnd = templateConfig.selectEnd;
            } else {
                template = templateConfig;
            }
            
            // 如果有选中文本，替换模板中的第一个变量
            const selectedText = aceEditor.getSelectedText();
            if (selectedText) {
                template = template.replace(/\$x\$|x|y|a|b|c|d|1|2|3|4/, selectedText);
            }
            
            // 记录插入位置
            const cursor = aceEditor.getCursorPosition();
            const insertRow = cursor.row;
            const insertCol = cursor.column;
            
            // 插入文本
            aceEditor.insert(template);
            
            // 如果有指定选中范围，选中该范围
            if (!selectedText && selectStart !== undefined && selectEnd !== undefined) {
                const Range = window.ace.require('ace/range').Range;
                const lines = template.split('\n');
                let charCount = 0;
                let startRow, startCol, endRow, endCol;
                
                for (let i = 0; i < lines.length; i++) {
                    const lineLength = lines[i].length;
                    const lineLengthWithNewline = lineLength + (i < lines.length - 1 ? 1 : 0);
                    
                    if (charCount <= selectStart && charCount + lineLength >= selectStart) {
                        startRow = insertRow + i;
                        startCol = insertCol + (selectStart - charCount);
                    }
                    
                    if (charCount <= selectEnd && charCount + lineLength >= selectEnd) {
                        endRow = insertRow + i;
                        endCol = insertCol + (selectEnd - charCount);
                        break;
                    }
                    
                    charCount += lineLengthWithNewline;
                }
                
                if (startRow !== undefined && endRow !== undefined) {
                    aceEditor.selection.setRange(new Range(startRow, startCol, endRow, endCol));
                }
            }
            
            aceEditor.focus();
            AppState.isDirty = true;
            debouncedRender();
            
            // 获取翻译后的名称用于状态提示
            const mathNameKey = `toolbar.mathTypes.${type}`;
            const mathName = t(mathNameKey) || btn.textContent.split(' ')[0].trim();
            setStatus(t('messages.insertedMath', { name: mathName }));
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
    initLanguageSwitcher();
    
    // 文件输入
    elements.fileInput.addEventListener('change', handleFileSelect);
    
    // 注意：updateUITexts() 和 initHelpModalContent() 已在 initApp() 中调用
    // 这里不需要重复调用，避免语言闪烁
    
    // 监听语言变化事件
    window.addEventListener('languagechange', () => {
        updateUITexts();
        updateHelpModalContent();
    });
}

/**
 * 初始化并更新帮助文档内容
 */
function initHelpModalContent() {
    updateHelpModalContent();
}

function updateHelpModalContent() {
    // 更新快捷键标签
    const shortcuts = [
        { key: 'Ctrl+S', i18n: 'ui.help.sections.shortcuts.items.save' },
        { key: 'Ctrl+O', i18n: 'ui.help.sections.shortcuts.items.open' },
        { key: 'Ctrl+N', i18n: 'ui.help.sections.shortcuts.items.new' },
        { key: 'Ctrl+B', i18n: 'ui.help.sections.shortcuts.items.bold' },
        { key: 'Ctrl+I', i18n: 'ui.help.sections.shortcuts.items.italic' },
        { key: 'Ctrl+K', i18n: 'ui.help.sections.shortcuts.items.link' }
    ];
    
    const shortcutCards = document.querySelectorAll('.help-shortcut-card');
    shortcutCards.forEach((card, index) => {
        if (index < shortcuts.length) {
            const label = card.querySelector('.help-shortcut-label');
            if (label) {
                label.textContent = t(shortcuts[index].i18n);
            }
        }
    });
    
    // 更新自动完成快捷键卡片
    const autocompleteCards = [
        { selector: '.help-autocomplete-card.highlight .help-card-title', i18n: 'ui.help.sections.autocompleteShortcuts.items.manualTrigger.title' },
        { selector: '.help-autocomplete-card.highlight .help-card-desc', i18n: 'ui.help.sections.autocompleteShortcuts.items.manualTrigger.desc' },
        { selector: '.help-autocomplete-card:nth-child(2) .help-card-title', i18n: 'ui.help.sections.autocompleteShortcuts.items.navigate.title' },
        { selector: '.help-autocomplete-card:nth-child(2) .help-card-desc', i18n: 'ui.help.sections.autocompleteShortcuts.items.navigate.desc' },
        { selector: '.help-autocomplete-card:nth-child(3) .help-card-title', i18n: 'ui.help.sections.autocompleteShortcuts.items.confirm.title' },
        { selector: '.help-autocomplete-card:nth-child(3) .help-card-desc', i18n: 'ui.help.sections.autocompleteShortcuts.items.confirm.desc' },
        { selector: '.help-autocomplete-card:nth-child(4) .help-card-title', i18n: 'ui.help.sections.autocompleteShortcuts.items.jumpPlaceholder.title' },
        { selector: '.help-autocomplete-card:nth-child(4) .help-card-desc', i18n: 'ui.help.sections.autocompleteShortcuts.items.jumpPlaceholder.desc' },
        { selector: '.help-autocomplete-card:nth-child(5) .help-card-title', i18n: 'ui.help.sections.autocompleteShortcuts.items.closeMenu.title' },
        { selector: '.help-autocomplete-card:nth-child(5) .help-card-desc', i18n: 'ui.help.sections.autocompleteShortcuts.items.closeMenu.desc' }
    ];
    
    autocompleteCards.forEach(({ selector, i18n }) => {
        const el = document.querySelector(selector);
        if (el) {
            el.innerHTML = t(i18n);
        }
    });
    
    // 更新功能说明
    const featureItems = [
        { selector: '.help-feature-item:nth-child(1) .help-feature-title', i18n: 'ui.help.sections.autocompleteFeatures.items.smartTrigger.title' },
        { selector: '.help-feature-item:nth-child(1) .help-feature-desc', i18n: 'ui.help.sections.autocompleteFeatures.items.smartTrigger.desc' },
        { selector: '.help-feature-item:nth-child(2) .help-feature-title', i18n: 'ui.help.sections.autocompleteFeatures.items.manualTrigger.title' },
        { selector: '.help-feature-item:nth-child(2) .help-feature-desc', i18n: 'ui.help.sections.autocompleteFeatures.items.manualTrigger.desc' },
        { selector: '.help-feature-item:nth-child(3) .help-feature-title', i18n: 'ui.help.sections.autocompleteFeatures.items.contextAware.title' },
        { selector: '.help-feature-item:nth-child(3) .help-feature-desc', i18n: 'ui.help.sections.autocompleteFeatures.items.contextAware.desc' }
    ];
    
    featureItems.forEach(({ selector, i18n }) => {
        const el = document.querySelector(selector);
        if (el) {
            el.innerHTML = t(i18n);
        }
    });
    
    // 更新类别标题和描述
    const categories = [
        { selector: '.help-template-category:nth-child(1) .help-category-title', i18n: 'ui.help.sections.templates.categories.basic.title' },
        { selector: '.help-template-category:nth-child(1) .help-category-desc', i18n: 'ui.help.sections.templates.categories.basic.desc' },
        { selector: '.help-template-category:nth-child(2) .help-category-title', i18n: 'ui.help.sections.templates.categories.list.title' },
        { selector: '.help-template-category:nth-child(2) .help-category-desc', i18n: 'ui.help.sections.templates.categories.list.desc' },
        { selector: '.help-template-category:nth-child(3) .help-category-title', i18n: 'ui.help.sections.templates.categories.table.title' },
        { selector: '.help-template-category:nth-child(3) .help-category-desc', i18n: 'ui.help.sections.templates.categories.table.desc' },
        { selector: '.help-template-category:nth-child(4) .help-category-title', i18n: 'ui.help.sections.templates.categories.code.title' },
        { selector: '.help-template-category:nth-child(4) .help-category-desc', i18n: 'ui.help.sections.templates.categories.code.desc' },
        { selector: '.help-template-category:nth-child(5) .help-category-title', i18n: 'ui.help.sections.templates.categories.mermaid.title' },
        { selector: '.help-template-category:nth-child(5) .help-category-desc', i18n: 'ui.help.sections.templates.categories.mermaid.desc' },
        { selector: '.help-template-category:nth-child(6) .help-category-title', i18n: 'ui.help.sections.templates.categories.math.title' },
        { selector: '.help-template-category:nth-child(6) .help-category-desc', i18n: 'ui.help.sections.templates.categories.math.desc' },
        { selector: '.help-template-category:nth-child(7) .help-category-title', i18n: 'ui.help.sections.templates.categories.other.title' },
        { selector: '.help-template-category:nth-child(7) .help-category-desc', i18n: 'ui.help.sections.templates.categories.other.desc' }
    ];
    
    categories.forEach(({ selector, i18n }) => {
        const el = document.querySelector(selector);
        if (el) {
            el.textContent = t(i18n);
        }
    });
    
    // 更新模板项描述
    document.querySelectorAll('.help-template-item').forEach(item => {
        const tag = item.querySelector('.help-template-tag');
        if (tag) {
            const tagName = tag.textContent.trim();
            const desc = item.querySelector('.help-template-desc');
            if (desc) {
                const i18nKey = `ui.help.sections.templates.items.${tagName}`;
                const translated = t(i18nKey);
                if (translated !== i18nKey) {
                    desc.textContent = translated;
                }
            }
        }
    });
    
    // 更新章节标题
    const sectionTitles = [
        { selector: '.help-section:nth-child(1) h3', i18n: 'ui.help.sections.shortcuts.title' },
        { selector: '.help-section:nth-child(2) h3', i18n: 'ui.help.sections.autocompleteShortcuts.title' },
        { selector: '.help-section:nth-child(3) h3', i18n: 'ui.help.sections.autocompleteFeatures.title' },
        { selector: '.help-section:nth-child(4) h3', i18n: 'ui.help.sections.templates.title' }
    ];
    
    sectionTitles.forEach(({ selector, i18n }) => {
        const el = document.querySelector(selector);
        if (el) {
            el.textContent = t(i18n);
        }
    });
}

/**
 * 初始化语言切换器
 */
function initLanguageSwitcher() {
    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');
    
    if (!langBtn || !langDropdown) return;
    
    // 更新当前语言标记
    function updateLangIndicator() {
        const currentLang = getLanguage();
        const items = langDropdown.querySelectorAll('.dropdown-item');
        items.forEach(item => {
            if (item.getAttribute('data-lang') === currentLang) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    // 语言切换
    langDropdown.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const lang = item.getAttribute('data-lang');
            if (lang) {
                setLanguage(lang);
                updateLangIndicator();
            }
        });
    });
    
    updateLangIndicator();
}

/**
 * 更新页面 title 和 meta 标签
 * 根据当前语言动态更新内容
 */
function updatePageMeta() {
    // 更新 title
    document.title = t('meta.title');
    
    // 更新 meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', t('meta.description'));
    }
    
    // 更新 meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
        metaKeywords.setAttribute('content', t('meta.keywords'));
    }
}

/**
 * 更新所有 UI 文本
 */
function updateUITexts() {
    // 更新所有带有 data-i18n 属性的元素
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key) {
            // 检查是否有参数
            const paramsAttr = el.getAttribute('data-i18n-params');
            let params = {};
            if (paramsAttr) {
                try {
                    params = JSON.parse(paramsAttr);
                } catch (e) {
                    console.warn('Invalid i18n params:', paramsAttr);
                }
            }
            // 检查是否是嵌套键（如 toolbar.newTooltip）
            let translationKey = key;
            if (key.startsWith('toolbar.') && !key.startsWith('ui.toolbar.')) {
                // toolbar.newTooltip, toolbar.mermaidTypes.xxx 等保持原样（在根级别）
                // toolbar.new, toolbar.open 等转换为 ui.toolbar.new（在ui.toolbar下）
                // 检查是否是 tooltip 或 Types（这些在根级别）
                if (key.includes('Tooltip') || key.includes('Types') || key.includes('Chart') || key.includes('Formula')) {
                    translationKey = key; // 保持原样
                } else {
                    translationKey = `ui.${key}`; // 转换为 ui.toolbar.xxx
                }
            } else if (!key.startsWith('ui.') && !key.startsWith('toolbar.') && !key.startsWith('messages.') && !key.startsWith('insertText.') && !key.startsWith('file.') && !key.startsWith('autocomplete.')) {
                // 其他键添加 ui. 前缀
                translationKey = `ui.${key}`;
            }
            const translated = t(translationKey, params);
            el.textContent = translated;
        }
    });
    
    // 更新所有带有 data-i18n-title 属性的元素
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (key) {
            // 检查是否是嵌套键
            let translationKey = key;
            if (key.startsWith('toolbar.') && !key.startsWith('ui.toolbar.')) {
                // 将 toolbar.xxx 转换为 ui.toolbar.xxx
                translationKey = `ui.${key}`;
            } else if (!key.startsWith('ui.') && !key.startsWith('toolbar.') && !key.startsWith('messages.') && !key.startsWith('insertText.') && !key.startsWith('file.') && !key.startsWith('autocomplete.')) {
                // 其他键添加 ui. 前缀
                translationKey = `ui.${key}`;
            }
            const translated = t(translationKey);
            el.setAttribute('title', translated);
        }
    });
    
    // 更新所有带有 data-i18n-placeholder 属性的元素
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (key) {
            let translationKey = key;
            if (key.startsWith('toolbar.') && !key.startsWith('ui.toolbar.')) {
                translationKey = `ui.${key}`;
            } else if (!key.startsWith('ui.') && !key.startsWith('toolbar.') && !key.startsWith('messages.') && !key.startsWith('insertText.') && !key.startsWith('file.') && !key.startsWith('autocomplete.')) {
                translationKey = `ui.${key}`;
            }
            const translated = t(translationKey);
            el.setAttribute('placeholder', translated);
        }
    });
    
    // 更新所有带有 data-i18n-aria-label 属性的元素
    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria-label');
        if (key) {
            let translationKey = key;
            if (key.startsWith('toolbar.') && !key.startsWith('ui.toolbar.')) {
                translationKey = `ui.${key}`;
            } else if (!key.startsWith('ui.') && !key.startsWith('toolbar.') && !key.startsWith('messages.') && !key.startsWith('insertText.') && !key.startsWith('file.') && !key.startsWith('autocomplete.')) {
                translationKey = `ui.${key}`;
            }
            const translated = t(translationKey);
            el.setAttribute('aria-label', translated);
        }
    });
    
    // 更新页面 title 和 meta 标签
    updatePageMeta();
    
    // 更新版本号显示（将时间戳转换为可读格式）
    if (elements.versionDisplay && window.APP_VERSION) {
        const version = window.APP_VERSION;
        // 版本号格式：YYYY.MM.DD.HHMMSS，例如：2026.01.07.052239
        // 转换为：2026-01-07 05:22:39
        const versionMatch = version.match(/^(\d{4})\.(\d{2})\.(\d{2})\.(\d{2})(\d{2})(\d{2})$/);
        if (versionMatch) {
            const [, year, month, day, hour, minute, second] = versionMatch;
            const readableTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
            elements.versionDisplay.textContent = `v${readableTime}`;
        } else if (window.APP_BUILD_TIME) {
            // 如果有构建时间，使用构建时间
            const buildTime = new Date(window.APP_BUILD_TIME);
            const readableTime = buildTime.toISOString().replace('T', ' ').substring(0, 19);
            elements.versionDisplay.textContent = `v${readableTime}`;
        } else {
            // 如果不是标准格式，直接显示原版本号
            elements.versionDisplay.textContent = `v${version}`;
        }
    }
    
    // 更新状态栏
    if (elements.statusMessage) {
        elements.statusMessage.textContent = t('ui.statusbar.ready');
    }
    
    // 初始化状态栏统计信息（使用空内容，避免显示错误的默认值）
    if (elements.charCount) {
        elements.charCount.textContent = t('ui.statusbar.characters', { count: 0 });
    }
    if (elements.wordCount) {
        elements.wordCount.textContent = t('ui.statusbar.words', { count: 0 });
    }
    if (elements.lineCount) {
        elements.lineCount.textContent = t('ui.statusbar.lines', { count: 0 });
    }
    if (elements.readTime) {
        elements.readTime.textContent = t('ui.statusbar.readTime', { minutes: 1 });
    }
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
            searchResult.textContent = t('ui.help.sections.templates.searchResult', { count: matchCount });
            searchResult.style.display = 'block';
            
            // 滚动到第一个匹配项
            const firstMatch = templatesContainer.querySelector('.help-template-match');
            if (firstMatch) {
                setTimeout(() => {
                    firstMatch.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            }
        } else {
            searchResult.textContent = t('ui.help.sections.templates.searchNoResult');
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
    
    // 更新搜索框占位符
    function updateSearchPlaceholder() {
        searchInput.setAttribute('placeholder', t('ui.help.sections.templates.searchPlaceholder'));
    }
    
    updateSearchPlaceholder();
    window.addEventListener('languagechange', updateSearchPlaceholder);
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
    
    // 编辑器变化监听器将在编辑器初始化后设置
}

/**
 * 设置编辑器内容变化监听器（在编辑器初始化后调用）
 */
function setupEditorChangeListener() {
    const aceEditor = getEditorInstance();
    if (aceEditor) {
        // 直接监听编辑器变化事件，实时更新统计
        aceEditor.session.on('change', () => {
            // 检查是否为程序性更新（如语言切换、文件打开等）
            // 如果是程序性更新，不设置 isDirty，并确保重置标志
            if (aceEditor._isProgrammaticUpdate) {
                // 重置标志和 isDirty
                aceEditor._isProgrammaticUpdate = false;
                AppState.isDirty = false;
            } else {
                // 只有真正的用户编辑才设置 isDirty
                AppState.isDirty = true;
            }
            
            // 实时更新统计信息
            const content = aceEditor.getValue();
            updateStats(content);
            // 渲染 Markdown
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
        // 初始化 i18n（必须在最前面）
        initI18n();
        
        // 初始化编辑器
        initEditor();
        
        // 将编辑器实例暴露到全局（供其他模块使用）
        window.__aceEditorInstance = getEditorInstance();
        
        // 初始化主题
        initTheme();
        
        // 初始化全屏功能
        initFullscreen();
        
        // 初始化移动端工具栏
        initMobileToolbar();
        
        // 初始化 Mermaid
        initMermaid();
        
        // 加载草稿
        loadDraft();
        
        // 立即更新 UI 文本，确保使用正确的语言（在绑定事件前）
        updateUITexts();
        
        // 更新帮助文档内容（必须在 updateUITexts() 之后）
        initHelpModalContent();
        
        // 绑定事件（需要在编辑器初始化后）
        initEventListeners();
        
        // 设置编辑器内容变化监听器（必须在编辑器初始化后）
        setupEditorChangeListener();
        
        // 初始渲染和统计更新（必须在 updateUITexts() 之后，确保使用正确语言）
        const editor = getEditorInstance();
        if (editor) {
            const initialContent = editor.getValue();
            updateStats(initialContent);
        }
        await renderMarkdown();
        
        // 初始化编辑器右侧拖拽调整大小
        initEditorResize();
        
        // 延迟初始化滚动同步，确保编辑器完全加载
        setTimeout(() => {
            initScrollSync();
        }, 1000);
        
        // 启动自动保存
        startAutoSave();
        
        console.log('✅ MarkX 启动成功！');
        setStatus(t('messages.ready'));
        
    } catch (error) {
        console.error('❌ 启动失败:', error);
        setStatus(t('messages.startupFailed'), 0);
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
