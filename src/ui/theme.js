/**
 * 主题切换模块
 */

import { AppState } from '../core/state.js';
import { elements } from '../core/elements.js';
import { setStatus } from '../core/ui-utils.js';
import { updateEditorTheme } from '../editor/ace-editor.js';
import { renderMarkdown } from '../renderer/markdown.js';

/**
 * 切换主题
 */
export function toggleTheme() {
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
export function initTheme() {
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
    } else {
        lightTheme.disabled = false;
        darkTheme.disabled = true;
    }
}
