/**
 * 编辑器调整大小模块
 */

import { AppState } from '../core/state.js';
import { elements } from '../core/elements.js';

let resizeState = {
    isDragging: false,
    startX: 0,
    startEditorWidth: 0,
    startPreviewWidth: 0
};

/**
 * 初始化编辑器右侧拖拽功能
 */
export function initEditorResize() {
    if (!elements.editorContainer || !elements.previewContainer) {
        console.warn('编辑器容器未找到，无法初始化拖拽功能');
        return;
    }
    
    // 鼠标移动时检查是否在拖拽区域
    const handleMouseMove = (e) => {
        if (AppState.currentLayout !== 'split') return;
        
        const rect = elements.editorContainer.getBoundingClientRect();
        const clickX = e.clientX;
        const rightEdge = rect.right;
        
        // 如果鼠标在右边框附近，改变光标
        if (clickX >= rightEdge - 4 && clickX <= rightEdge + 4 && !resizeState.isDragging) {
            document.body.style.cursor = 'col-resize';
        } else if (!resizeState.isDragging) {
            document.body.style.cursor = '';
        }
        
        // 如果正在拖拽，调整大小
        if (resizeState.isDragging) {
            const deltaX = e.clientX - resizeState.startX;
            const totalWidth = resizeState.startEditorWidth + resizeState.startPreviewWidth;
            
            // 计算新宽度（限制最小宽度）
            const minWidth = 200;
            const newEditorWidth = Math.max(minWidth, Math.min(totalWidth - minWidth, resizeState.startEditorWidth + deltaX));
            const newPreviewWidth = totalWidth - newEditorWidth;
            
            // 使用 flex-basis 设置宽度
            elements.editorContainer.style.flex = `0 0 ${newEditorWidth}px`;
            elements.previewContainer.style.flex = `0 0 ${newPreviewWidth}px`;
            
            // 禁用过渡动画（拖拽时）
            elements.editorContainer.style.transition = 'none';
            elements.previewContainer.style.transition = 'none';
            
            e.preventDefault();
        }
    };
    
    // 鼠标按下事件
    const handleMouseDown = (e) => {
        if (AppState.currentLayout !== 'split') return;
        
        const rect = elements.editorContainer.getBoundingClientRect();
        const clickX = e.clientX;
        const rightEdge = rect.right;
        
        // 如果点击在右边框附近 8px 范围内，开始拖拽
        if (clickX >= rightEdge - 4 && clickX <= rightEdge + 4) {
            resizeState.isDragging = true;
            resizeState.startX = e.clientX;
            
            // 获取当前容器宽度
            const editorRect = elements.editorContainer.getBoundingClientRect();
            const previewRect = elements.previewContainer.getBoundingClientRect();
            resizeState.startEditorWidth = editorRect.width;
            resizeState.startPreviewWidth = previewRect.width;
            
            // 添加拖拽样式
            elements.editorContainer.classList.add('dragging');
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
            
            e.preventDefault();
            e.stopPropagation();
        }
    };
    
    // 鼠标释放事件
    const handleMouseUp = () => {
        if (resizeState.isDragging) {
            resizeState.isDragging = false;
            elements.editorContainer.classList.remove('dragging');
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            
            // 恢复过渡动画
            elements.editorContainer.style.transition = '';
            elements.previewContainer.style.transition = '';
        }
    };
    
    // 绑定事件到文档级别，确保能捕获到事件
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    
    console.log('✅ 编辑器拖拽功能已初始化', {
        editorContainer: !!elements.editorContainer,
        previewContainer: !!elements.previewContainer
    });
}
