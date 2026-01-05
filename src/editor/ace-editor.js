/**
 * Ace Editor 编辑器模块
 */

import { AppState } from '../core/state.js';
import { DEFAULT_CONTENT } from '../core/constants.js';
import { elements } from '../core/elements.js';

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
