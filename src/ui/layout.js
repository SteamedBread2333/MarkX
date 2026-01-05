/**
 * 布局切换模块
 */

import { AppState } from '../core/state.js';
import { setStatus } from '../core/ui-utils.js';

/**
 * 切换布局模式
 */
export function toggleLayout() {
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
