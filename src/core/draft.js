/**
 * 草稿管理模块（自动保存）
 */

import { AppState } from './state.js';
import { elements } from './elements.js';
import { setStatus } from './ui-utils.js';
import { getEditorContent, setEditorContent } from '../editor/ace-editor.js';
import { renderMarkdown } from '../renderer/markdown.js';
import { t } from './i18n.js';

/**
 * 保存草稿到 localStorage
 */
export function saveDraft() {
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
export function loadDraft() {
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
                    setStatus(t('messages.draftAutoRestored'));
                } else if (autoRestore === 'never') {
                    // 永不恢复，不提示
                    return;
                } else {
                    // 首次或每次询问
                    const timeStr = time.toLocaleString('zh-CN');
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
                ${t('draft.foundTitle')}
            </h3>
            <p>${t('draft.lastEditTime', { time: timeStr })}</p>
            <div class="draft-dialog-actions">
                <label class="draft-dialog-checkbox">
                    <input type="checkbox" id="draftRemember">
                    <span>${t('draft.rememberChoice')}</span>
                </label>
                <div class="draft-dialog-buttons">
                    <button class="draft-btn draft-btn-secondary" id="draftIgnore">${t('draft.ignore')}</button>
                    <button class="draft-btn draft-btn-primary" id="draftRestore">${t('draft.restore')}</button>
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
        setStatus(t('messages.draftRestored'));
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
export function startAutoSave() {
    AppState.autoSaveTimer = setInterval(() => {
        // 使用全局编辑器实例（避免循环依赖）
        const aceEditor = window.__aceEditorInstance;
        if (AppState.isDirty || (aceEditor && aceEditor.getValue())) {
            saveDraft();
        }
    }, 30000); // 每 30 秒保存一次
}
