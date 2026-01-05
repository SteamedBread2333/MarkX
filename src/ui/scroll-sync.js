/**
 * 滚动同步模块
 */

import { AppState } from '../core/state.js';
import { elements } from '../core/elements.js';
import { getEditorInstance } from '../editor/ace-editor.js';

// 滚动同步状态
const scrollSyncState = {
    isSyncing: false,
    lastEditorScrollTop: 0,
    editorScrollHandler: null,
    previewScrollHandler: null,
    pollingInterval: null
};

/**
 * 初始化滚动同步功能
 */
export function initScrollSync() {
    const aceEditor = getEditorInstance();
    
    // 如果编辑器还没初始化，延迟重试
    if (!aceEditor) {
        setTimeout(() => {
            const editor = getEditorInstance();
            if (editor) {
                initScrollSync();
            }
        }, 1000);
        return;
    }
    
    if (!elements.previewContainer) {
        console.warn('预览容器未找到，无法初始化滚动同步');
        return;
    }
    
    // 移除旧的事件监听器（如果存在）
    if (scrollSyncState.editorScrollHandler) {
        // 尝试多种方式移除事件监听器
        try {
            aceEditor.off('changeScrollTop', scrollSyncState.editorScrollHandler);
        } catch (e) {}
        try {
            aceEditor.renderer.off('scroll', scrollSyncState.editorScrollHandler);
        } catch (e) {}
        try {
            aceEditor.renderer.container.removeEventListener('scroll', scrollSyncState.editorScrollHandler);
        } catch (e) {}
    }
    if (scrollSyncState.previewScrollHandler) {
        elements.previewContainer.removeEventListener('scroll', scrollSyncState.previewScrollHandler);
    }
    
    // 获取编辑器的滚动信息
    const getEditorScrollInfo = () => {
        try {
            const renderer = aceEditor.renderer;
            const session = aceEditor.getSession();
            const scrollTop = renderer.getScrollTop();
            const lineHeight = renderer.lineHeight;
            const screenLines = session.getScreenLength();
            const container = renderer.container;
            const clientHeight = container.clientHeight;
            const maxScroll = Math.max(0, (screenLines * lineHeight) - clientHeight);
            return { scrollTop, maxScroll };
        } catch (error) {
            // 备用方法：使用容器的 scrollHeight
            const container = aceEditor.renderer.container;
            const scrollTop = container.scrollTop;
            const maxScroll = Math.max(0, container.scrollHeight - container.clientHeight);
            return { scrollTop, maxScroll };
        }
    };
    
    // 设置编辑器的滚动位置
    const setEditorScrollTop = (scrollTop) => {
        try {
            // 尝试使用 renderer.setScrollTop
            if (typeof aceEditor.renderer.setScrollTop === 'function') {
                aceEditor.renderer.setScrollTop(scrollTop);
            } else {
                // 使用 session.setScrollTop
                aceEditor.getSession().setScrollTop(scrollTop);
            }
        } catch (error) {
            // 最后尝试直接设置容器的 scrollTop
            aceEditor.renderer.container.scrollTop = scrollTop;
        }
    };
    
    // 编辑器滚动同步到预览区
    scrollSyncState.editorScrollHandler = () => {
        if (scrollSyncState.isSyncing || AppState.currentLayout !== 'split') return;
        scrollSyncState.isSyncing = true;
        
        try {
            const { scrollTop, maxScroll } = getEditorScrollInfo();
            
            // 更新最后滚动位置
            scrollSyncState.lastEditorScrollTop = scrollTop;
            
            // 计算滚动百分比（避免除以零）
            if (maxScroll <= 0) {
                scrollSyncState.isSyncing = false;
                return;
            }
            const scrollPercent = Math.max(0, Math.min(1, scrollTop / maxScroll));
            
            // 同步到预览区
            const previewScrollHeight = elements.previewContainer.scrollHeight;
            const previewClientHeight = elements.previewContainer.clientHeight;
            const previewMaxScroll = previewScrollHeight - previewClientHeight;
            if (previewMaxScroll > 0) {
                const targetScrollTop = scrollPercent * previewMaxScroll;
                // 只有在值真正改变时才设置，避免循环触发
                if (Math.abs(elements.previewContainer.scrollTop - targetScrollTop) > 1) {
                    elements.previewContainer.scrollTop = targetScrollTop;
                }
            }
        } catch (error) {
            console.warn('编辑器滚动同步失败:', error);
        }
        
        requestAnimationFrame(() => {
            scrollSyncState.isSyncing = false;
        });
    };
    
    // 预览区滚动同步到编辑器
    scrollSyncState.previewScrollHandler = () => {
        if (scrollSyncState.isSyncing || AppState.currentLayout !== 'split') return;
        scrollSyncState.isSyncing = true;
        
        try {
            const scrollTop = elements.previewContainer.scrollTop;
            const scrollHeight = elements.previewContainer.scrollHeight;
            const clientHeight = elements.previewContainer.clientHeight;
            
            // 计算滚动百分比（避免除以零）
            const maxScroll = scrollHeight - clientHeight;
            if (maxScroll <= 0) {
                scrollSyncState.isSyncing = false;
                return;
            }
            const scrollPercent = Math.max(0, Math.min(1, scrollTop / maxScroll));
            
            // 同步到编辑器
            const { maxScroll: editorMaxScroll } = getEditorScrollInfo();
            if (editorMaxScroll > 0) {
                const targetScrollTop = scrollPercent * editorMaxScroll;
                setEditorScrollTop(targetScrollTop);
            }
        } catch (error) {
            console.warn('预览区滚动同步失败:', error);
        }
        
        requestAnimationFrame(() => {
            scrollSyncState.isSyncing = false;
        });
    };
    
    // 初始化编辑器滚动位置
    scrollSyncState.lastEditorScrollTop = aceEditor.renderer.getScrollTop();
    
    // 监听编辑器滚动 - 使用多种方式确保能捕获到滚动事件
    // 方式1: Ace Editor 的 changeScrollTop 事件
    try {
        aceEditor.on('changeScrollTop', scrollSyncState.editorScrollHandler);
    } catch (e) {
        console.warn('无法绑定 changeScrollTop 事件:', e);
    }
    
    // 方式2: 监听 renderer 的 scroll 事件
    try {
        aceEditor.renderer.on('scroll', scrollSyncState.editorScrollHandler);
    } catch (e) {
        console.warn('无法绑定 renderer scroll 事件:', e);
    }
    
    // 方式3: 监听容器的 scroll 事件
    try {
        aceEditor.renderer.container.addEventListener('scroll', scrollSyncState.editorScrollHandler, { passive: true });
    } catch (e) {
        console.warn('无法绑定容器 scroll 事件:', e);
    }
    
    // 方式4: 使用轮询检测编辑器滚动（最可靠的方法）
    if (scrollSyncState.pollingInterval) {
        clearInterval(scrollSyncState.pollingInterval);
    }
    scrollSyncState.pollingInterval = setInterval(() => {
        if (AppState.currentLayout !== 'split' || scrollSyncState.isSyncing) return;
        
        try {
            const editor = getEditorInstance();
            if (!editor) return;
            const currentScrollTop = editor.renderer.getScrollTop();
            if (Math.abs(currentScrollTop - scrollSyncState.lastEditorScrollTop) > 1) {
                scrollSyncState.lastEditorScrollTop = currentScrollTop;
                scrollSyncState.editorScrollHandler();
            }
        } catch (e) {
            // 忽略错误
        }
    }, 50); // 每 50ms 检查一次
    
    // 监听预览区滚动
    elements.previewContainer.addEventListener('scroll', scrollSyncState.previewScrollHandler, { passive: true });
    
    console.log('✅ 滚动同步已初始化', {
        aceEditor: !!aceEditor,
        previewContainer: !!elements.previewContainer,
        renderer: !!aceEditor.renderer,
        container: !!aceEditor.renderer.container,
        pollingInterval: !!scrollSyncState.pollingInterval
    });
}
