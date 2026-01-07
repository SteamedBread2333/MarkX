/**
 * 文件操作模块
 */

import { AppState } from '../core/state.js';
import { elements } from '../core/elements.js';
import { setStatus } from '../core/ui-utils.js';
import { getEditorContent, setEditorContent } from '../editor/ace-editor.js';
import { renderMarkdown } from '../renderer/markdown.js';
import { t } from '../core/i18n.js';

/**
 * 新建文档
 */
export function newDocument() {
    if (AppState.isDirty) {
        if (!confirm(t('file.newConfirm'))) {
            return;
        }
    }
    
    setEditorContent('');
    AppState.currentFileName = 'untitled.md';
    AppState.isDirty = false;
    renderMarkdown();
    setStatus(t('file.new'));
}

/**
 * 打开文件
 */
export function openFile() {
    elements.fileInput.click();
}

/**
 * 处理文件选择
 */
export function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        setEditorContent(e.target.result);
        AppState.currentFileName = file.name;
        AppState.isDirty = false;
        renderMarkdown();
        setStatus(t('file.opened', { filename: file.name }));
    };
    reader.onerror = () => {
        setStatus(t('file.readError'), 5000);
    };
    reader.readAsText(file);
    
    // 重置 input 以允许重复选择同一文件
    event.target.value = '';
}

/**
 * 保存文件
 */
export function saveFile() {
    // 提取当前文件名（不含扩展名）
    const currentName = AppState.currentFileName.replace('.md', '');
    
    // 弹出对话框让用户输入文件名
    const fileName = prompt(t('file.savePrompt'), currentName);
    
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
    setStatus(t('file.saved', { filename: fullFileName }));
}
