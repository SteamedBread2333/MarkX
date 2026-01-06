/**
 * Ace Editor 编辑器模块
 */

import { AppState } from '../core/state.js';
import { DEFAULT_CONTENT } from '../core/constants.js';
import { elements } from '../core/elements.js';
import { setStatus } from '../core/ui-utils.js';
import { createMarkdownCompleter } from './autocomplete.js';

// 全局编辑器实例
let aceEditor = null;

/**
 * 初始化 Ace Editor
 */
export function initEditor() {
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
            value: DEFAULT_CONTENT,
            fontSize: '14px',  // 改为偶数，避免中文输入时光标错位
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
        
        // 修复中文输入法（IME）光标错位问题
        fixIMEComposition(aceEditor);
        
        // 配置自动完成功能
        setupAutocompletion(aceEditor);
        
        console.log('✅ Ace Editor 初始化成功');
        
    } catch (error) {
        console.error('❌ Ace Editor 初始化失败:', error);
        throw error;
    }
}

/**
 * 更新编辑器主题
 */
export function updateEditorTheme(isDark) {
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
export function getEditorContent() {
    return aceEditor ? aceEditor.getValue() : '';
}

/**
 * 设置编辑器内容
 */
export function setEditorContent(content) {
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

/**
 * 获取编辑器实例（供其他模块使用）
 */
export function getEditorInstance() {
    return aceEditor;
}

/**
 * 设置编辑器内容变化监听器
 */
export function setEditorChangeListener(callback) {
    if (!aceEditor) return;
    
    aceEditor.session.on('change', () => {
        AppState.isDirty = true;
        callback();
    });
}

/**
 * 设置编辑器保存快捷键
 */
export function setEditorSaveCommand(saveCallback) {
    if (!aceEditor) return;
    
    aceEditor.commands.addCommand({
        name: 'save',
        bindKey: { win: 'Ctrl-S', mac: 'Cmd-S' },
        exec: () => {
            saveCallback();
        }
    });
}

/**
 * 修复中文输入法（IME）组合状态下的光标错位问题
 */
function fixIMEComposition(editor) {
    if (!editor) return;
    
    // 标记是否正在使用输入法组合
    let isComposing = false;
    let compositionTimeout = null;
    
    // 获取 Ace Editor 的 textarea 输入元素
    const textInput = editor.textInput.getElement();
    if (!textInput) return;
    
    // 监听输入法组合开始事件
    textInput.addEventListener('compositionstart', function(e) {
        isComposing = true;
        // 在组合期间临时禁用实时自动完成
        const currentLiveAutocomplete = editor.getOption('enableLiveAutocompletion');
        editor._imeLiveAutocompleteState = currentLiveAutocomplete;
        editor.setOptions({
            enableLiveAutocompletion: false
        });
    }, true);
    
    // 监听输入法组合更新事件
    textInput.addEventListener('compositionupdate', function(e) {
        isComposing = true;
    }, true);
    
    // 监听输入法组合结束事件
    textInput.addEventListener('compositionend', function(e) {
        isComposing = false;
        
        // 清除之前的定时器
        if (compositionTimeout) {
            clearTimeout(compositionTimeout);
        }
        
        // 延迟恢复自动完成设置，确保输入法组合完全结束
        compositionTimeout = setTimeout(() => {
            const pos = editor.getCursorPosition();
            const session = editor.getSession();
            const isInsideBlock = checkIfInsideBlock(session, pos);
            
            // 恢复之前的自动完成状态（如果不在块内）
            const previousState = editor._imeLiveAutocompleteState !== undefined 
                ? editor._imeLiveAutocompleteState 
                : !isInsideBlock;
            
            editor.setOptions({
                enableLiveAutocompletion: previousState && !isInsideBlock
            });
            
            editor._imeLiveAutocompleteState = undefined;
        }, 150);
    }, true);
    
    // 监听输入事件，确保在输入法组合时不触发自动完成
    textInput.addEventListener('input', function(e) {
        if (isComposing) {
            // 在组合期间，确保自动完成被禁用
            if (editor.getOption('enableLiveAutocompletion')) {
                editor.setOptions({
                    enableLiveAutocompletion: false
                });
            }
        }
    }, true);
}

/**
 * 检测光标是否在代码块或引用块内
 */
function checkIfInsideBlock(session, pos) {
    const lines = session.getLines(0, pos.row + 1);
    let inCodeBlock = false;
    let inBlockquote = false;
    let codeBlockMarker = null;
    
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
                } else {
                    // 当前行是结束标记，但光标可能在标记上
                    return true;
                }
            } else {
                // 代码块开始
                inCodeBlock = true;
                codeBlockMarker = '```';
            }
        } else if (trimmedLine.startsWith('~~~')) {
            if (inCodeBlock && codeBlockMarker === '~~~') {
                // 代码块结束
                if (i < pos.row) {
                    inCodeBlock = false;
                    codeBlockMarker = null;
                } else {
                    return true;
                }
            } else {
                inCodeBlock = true;
                codeBlockMarker = '~~~';
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
    if (inCodeBlock && pos.row >= 0) {
        return true;
    }
    
    // 如果当前行在引用块内
    if (inBlockquote && pos.row >= 0) {
        const currentLine = lines[pos.row];
        if (currentLine.trim().startsWith('>')) {
            return true;
        }
    }
    
    return false;
}

/**
 * 显示/隐藏自动完成提示（在状态栏显示）
 */
let hintTimeout = null;
function showAutocompleteHint(editor, show) {
    // 清除之前的定时器
    if (hintTimeout) {
        clearTimeout(hintTimeout);
        hintTimeout = null;
    }
    
    if (show) {
        // 检测操作系统，显示对应的快捷键
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const shortcut = isMac ? 'Cmd+E' : 'Ctrl+E';
        
        // 在状态栏显示提示，带图标和样式
        const statusElement = elements.statusMessage;
        statusElement.className = 'autocomplete-hint-active';
        statusElement.innerHTML = `💡 在代码块内编辑，按 <kbd>${shortcut}</kbd> 手动触发自动完成`;
        
        // 添加样式（如果还没有添加）
        if (!document.getElementById('autocomplete-status-style')) {
            const style = document.createElement('style');
            style.id = 'autocomplete-status-style';
            style.textContent = `
                #statusMessage.autocomplete-hint-active {
                    color: var(--accent-color);
                    animation: pulseHint 2s ease-in-out infinite;
                }
                #statusMessage.autocomplete-hint-active kbd {
                    background: var(--bg-tertiary);
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-family: var(--font-mono);
                    font-size: 11px;
                    border: 1px solid var(--border-color);
                    color: var(--text-primary);
                    margin: 0 2px;
                    transition: all 0.2s ease;
                }
                #statusMessage.autocomplete-hint-active kbd:hover {
                    background: var(--bg-hover);
                    border-color: var(--accent-color);
                }
                @keyframes pulseHint {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.75;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // 5秒后恢复为"就绪"
        hintTimeout = setTimeout(() => {
            statusElement.textContent = '就绪';
            statusElement.className = '';
        }, 5000);
    } else {
        // 立即恢复为"就绪"
        elements.statusMessage.textContent = '就绪';
        elements.statusMessage.className = '';
    }
}

/**
 * 配置自动完成功能
 */
function setupAutocompletion(editor) {
    try {
        // 确保 language_tools 扩展已加载
        if (typeof window.ace === 'undefined' || !window.ace.require) {
            console.warn('⚠️ Ace Editor language_tools 扩展未加载，自动完成功能可能不可用');
            return;
        }
        
        // 延迟加载，确保扩展已完全加载
        setTimeout(() => {
            try {
                const langTools = window.ace.require('ace/ext/language_tools');
                
                if (!langTools) {
                    console.error('❌ 无法加载 language_tools 扩展');
                    return;
                }
                
                // 创建 Markdown 自动完成器
                const markdownCompleter = createMarkdownCompleter();
                
                // 设置自动完成器（Markdown 编辑器主要使用自定义完成器）
                langTools.setCompleters([markdownCompleter]);
                
                // 动态控制实时自动完成
                let lastCursorPos = { row: 0, column: 0 };
                
                // 监听光标位置变化，动态调整自动完成设置
                editor.on('changeSelection', function() {
                    const pos = editor.getCursorPosition();
                    const session = editor.getSession();
                    
                    // 检测是否在块内
                    const isInsideBlock = checkIfInsideBlock(session, pos);
                    
                    // 根据是否在块内动态调整自动完成
                    if (isInsideBlock) {
                        // 在块内：禁用实时自动完成，只允许手动触发
                        editor.setOptions({
                            enableBasicAutocompletion: true,
                            enableLiveAutocompletion: false,  // 禁用实时自动完成
                            enableSnippets: true
                        });
                        
                        // 显示提示
                        showAutocompleteHint(editor, true);
                    } else {
                        // 不在块内：启用实时自动完成
                        editor.setOptions({
                            enableBasicAutocompletion: true,
                            enableLiveAutocompletion: true,  // 启用实时自动完成
                            enableSnippets: true
                        });
                        
                        // 隐藏提示
                        showAutocompleteHint(editor, false);
                    }
                    
                    lastCursorPos = pos;
                });
                
                // 初始设置
                editor.setOptions({
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,  // 默认启用实时自动完成
                    enableSnippets: true
                });
                
                // 确保快捷键正确绑定（使用 Ctrl+E / Cmd+E，常用且方便）
                // 支持切换：再次按快捷键时关闭自动完成菜单
                editor.commands.addCommand({
                    name: 'triggerAutocomplete',
                    bindKey: { win: 'Ctrl-E', mac: 'Cmd-E' },
                    exec: function(editor) {
                        // 检查自动完成菜单是否已经打开
                        let isAutocompleteOpen = false;
                        
                        // 方法1：检查 completer 的 popup 状态
                        if (editor.completer && editor.completer.popup) {
                            isAutocompleteOpen = editor.completer.popup.isOpen === true;
                        }
                        
                        // 方法2：检查 DOM 中是否存在可见的 autocomplete popup 元素
                        if (!isAutocompleteOpen) {
                            const autocompleteElement = editor.container.querySelector('.ace_autocomplete');
                            if (autocompleteElement) {
                                const style = window.getComputedStyle(autocompleteElement);
                                isAutocompleteOpen = style.display !== 'none' && style.visibility !== 'hidden';
                            }
                        }
                        
                        if (isAutocompleteOpen) {
                            // 如果已经打开，关闭它
                            if (editor.completer) {
                                try {
                                    editor.completer.detach();
                                    editor.completer.cancel();
                                } catch (e) {
                                    // 如果 detach 失败，尝试隐藏 DOM 元素
                                    const autocompleteElement = editor.container.querySelector('.ace_autocomplete');
                                    if (autocompleteElement) {
                                        autocompleteElement.style.display = 'none';
                                    }
                                }
                            }
                        } else {
                            // 如果没有打开，打开它
                            editor.execCommand('startAutocomplete');
                        }
                        
                        // 触发后隐藏提示
                        showAutocompleteHint(editor, false);
                    }
                });
                
                console.log('✅ 自动完成功能已配置');
                console.log('📝 使用方法：');
                console.log('   1. 输入关键词（如：标题、链接、表格）后会自动显示提示');
                console.log('   2. 按 Ctrl+E (Windows/Linux) 或 Cmd+E (Mac) 手动触发');
                console.log('   3. 使用方向键选择，Enter 确认，Tab 跳转到下一个占位符');
            } catch (error) {
                console.error('❌ 配置自动完成功能时出错:', error);
                console.error('错误详情:', error.stack);
            }
        }, 300);  // 增加延迟时间，确保扩展完全加载
    } catch (error) {
        console.error('❌ 设置自动完成功能失败:', error);
    }
}
