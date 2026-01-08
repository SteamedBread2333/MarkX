/**
 * 编辑器调整大小模块
 */

import { AppState } from '../core/state.js';
import { elements } from '../core/elements.js';

let resizeState = {
    isDragging: false,
    startX: 0,
    startY: 0,
    startEditorWidth: 0,
    startEditorHeight: 0,
    startPreviewWidth: 0,
    startPreviewHeight: 0,
    isVertical: false
};

/**
 * 检测是否为移动端或垂直布局
 */
function isVerticalLayout() {
    return window.innerWidth <= 768 || 
           AppState.currentLayout === 'vertical' ||
           document.body.classList.contains('layout-vertical');
}

/**
 * 初始化编辑器拖拽功能（支持水平和垂直方向）
 */
export function initEditorResize() {
    if (!elements.editorContainer || !elements.previewContainer) {
        console.warn('编辑器容器未找到，无法初始化拖拽功能');
        return;
    }
    
    // 水平拖拽处理（桌面端左右分割）
    const handleHorizontalDrag = (clientX) => {
        const deltaX = clientX - resizeState.startX;
        const totalWidth = resizeState.startEditorWidth + resizeState.startPreviewWidth;
        
        // 计算新宽度（限制最小宽度）
        const minWidth = 200;
        const newEditorWidth = Math.max(minWidth, Math.min(totalWidth - minWidth, resizeState.startEditorWidth + deltaX));
        const newPreviewWidth = totalWidth - newEditorWidth;
        
        // 使用 flex-basis 设置宽度
        elements.editorContainer.style.flex = `0 0 ${newEditorWidth}px`;
        elements.previewContainer.style.flex = `0 0 ${newPreviewWidth}px`;
    };
    
    // 垂直拖拽处理（移动端上下分割）
    const handleVerticalDrag = (clientY) => {
        const deltaY = clientY - resizeState.startY;
        const totalHeight = resizeState.startEditorHeight + resizeState.startPreviewHeight;
        
        // 计算新高度（限制最小高度）
        const minHeight = 150;
        const newEditorHeight = Math.max(minHeight, Math.min(totalHeight - minHeight, resizeState.startEditorHeight + deltaY));
        const newPreviewHeight = totalHeight - newEditorHeight;
        
        // 使用 flex-basis 设置高度
        elements.editorContainer.style.flex = `0 0 ${newEditorHeight}px`;
        elements.previewContainer.style.flex = `0 0 ${newPreviewHeight}px`;
    };
    
    // 鼠标移动时检查是否在拖拽区域
    const handleMouseMove = (e) => {
        const vertical = isVerticalLayout();
        const isSplitLayout = AppState.currentLayout === 'split' || vertical;
        
        if (!isSplitLayout) return;
        
        if (vertical) {
            // 垂直布局：检查底部边框
            const rect = elements.editorContainer.getBoundingClientRect();
            const clickY = e.clientY;
            const bottomEdge = rect.bottom;
            
            // 移动端使用更大的检测区域（16px），桌面端使用8px
            const touchThreshold = window.innerWidth <= 768 ? 8 : 4;
            
            // 如果鼠标在底部边框附近，改变光标
            if (clickY >= bottomEdge - touchThreshold && clickY <= bottomEdge + touchThreshold && !resizeState.isDragging) {
                document.body.style.cursor = 'row-resize';
            } else if (!resizeState.isDragging) {
                document.body.style.cursor = '';
            }
            
            // 如果正在拖拽，调整大小
            if (resizeState.isDragging) {
                handleVerticalDrag(e.clientY);
                e.preventDefault();
            }
        } else {
            // 水平布局：检查右侧边框
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
                handleHorizontalDrag(e.clientX);
                e.preventDefault();
            }
        }
    };
    
    // 触摸移动处理
    const handleTouchMove = (e) => {
        if (!resizeState.isDragging) return;
        
        const vertical = isVerticalLayout();
        const touch = e.touches[0];
        
        if (vertical) {
            handleVerticalDrag(touch.clientY);
        } else {
            handleHorizontalDrag(touch.clientX);
        }
        
        e.preventDefault();
    };
    
    // 鼠标按下事件
    const handleMouseDown = (e) => {
        const vertical = isVerticalLayout();
        const isSplitLayout = AppState.currentLayout === 'split' || vertical;
        
        if (!isSplitLayout) return;
        
        let shouldStartDrag = false;
        
        if (vertical) {
            // 垂直布局：检查底部边框
            const rect = elements.editorContainer.getBoundingClientRect();
            const clickY = e.clientY;
            const bottomEdge = rect.bottom;
            
            // 移动端使用更大的检测区域（16px），桌面端使用8px
            const touchThreshold = window.innerWidth <= 768 ? 8 : 4;
            
            // 如果点击在底部边框附近，开始拖拽
            if (clickY >= bottomEdge - touchThreshold && clickY <= bottomEdge + touchThreshold) {
                shouldStartDrag = true;
                resizeState.isVertical = true;
                resizeState.startY = e.clientY;
                
                // 获取当前容器高度
                const editorRect = elements.editorContainer.getBoundingClientRect();
                const previewRect = elements.previewContainer.getBoundingClientRect();
                resizeState.startEditorHeight = editorRect.height;
                resizeState.startPreviewHeight = previewRect.height;
            }
        } else {
            // 水平布局：检查右侧边框
            const rect = elements.editorContainer.getBoundingClientRect();
            const clickX = e.clientX;
            const rightEdge = rect.right;
            
            // 如果点击在右边框附近 8px 范围内，开始拖拽
            if (clickX >= rightEdge - 4 && clickX <= rightEdge + 4) {
                shouldStartDrag = true;
                resizeState.isVertical = false;
                resizeState.startX = e.clientX;
                
                // 获取当前容器宽度
                const editorRect = elements.editorContainer.getBoundingClientRect();
                const previewRect = elements.previewContainer.getBoundingClientRect();
                resizeState.startEditorWidth = editorRect.width;
                resizeState.startPreviewWidth = previewRect.width;
            }
        }
        
        if (shouldStartDrag) {
            resizeState.isDragging = true;
            
            // 添加拖拽样式
            elements.editorContainer.classList.add('dragging');
            document.body.style.cursor = vertical ? 'row-resize' : 'col-resize';
            document.body.style.userSelect = 'none';
            
            // 禁用过渡动画（拖拽时）
            elements.editorContainer.style.transition = 'none';
            elements.previewContainer.style.transition = 'none';
            
            e.preventDefault();
            e.stopPropagation();
        }
    };
    
    // 触摸开始处理
    const handleTouchStart = (e) => {
        const vertical = isVerticalLayout();
        const isSplitLayout = AppState.currentLayout === 'split' || vertical;
        
        if (!isSplitLayout) return;
        
        const touch = e.touches[0];
        let shouldStartDrag = false;
        
        if (vertical) {
            // 垂直布局：检查底部边框
            const rect = elements.editorContainer.getBoundingClientRect();
            const touchY = touch.clientY;
            const bottomEdge = rect.bottom;
            
            // 移动端使用更大的检测区域（16px）
            const touchThreshold = 8;
            
            // 如果触摸在底部边框附近，开始拖拽
            if (touchY >= bottomEdge - touchThreshold && touchY <= bottomEdge + touchThreshold) {
                shouldStartDrag = true;
                resizeState.isVertical = true;
                resizeState.startY = touch.clientY;
                
                // 获取当前容器高度
                const editorRect = elements.editorContainer.getBoundingClientRect();
                const previewRect = elements.previewContainer.getBoundingClientRect();
                resizeState.startEditorHeight = editorRect.height;
                resizeState.startPreviewHeight = previewRect.height;
            }
        } else {
            // 水平布局：检查右侧边框
            const rect = elements.editorContainer.getBoundingClientRect();
            const touchX = touch.clientX;
            const rightEdge = rect.right;
            
            // 如果触摸在右边框附近 8px 范围内，开始拖拽
            if (touchX >= rightEdge - 4 && touchX <= rightEdge + 4) {
                shouldStartDrag = true;
                resizeState.isVertical = false;
                resizeState.startX = touch.clientX;
                
                // 获取当前容器宽度
                const editorRect = elements.editorContainer.getBoundingClientRect();
                const previewRect = elements.previewContainer.getBoundingClientRect();
                resizeState.startEditorWidth = editorRect.width;
                resizeState.startPreviewWidth = previewRect.width;
            }
        }
        
        if (shouldStartDrag) {
            resizeState.isDragging = true;
            
            // 添加拖拽样式
            elements.editorContainer.classList.add('dragging');
            document.body.style.userSelect = 'none';
            
            // 禁用过渡动画（拖拽时）
            elements.editorContainer.style.transition = 'none';
            elements.previewContainer.style.transition = 'none';
            
            e.preventDefault();
        }
    };
    
    // 鼠标/触摸释放事件
    const handleEnd = () => {
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
    document.addEventListener('mouseup', handleEnd);
    
    // 触摸事件支持
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchend', handleEnd);
    document.addEventListener('touchcancel', handleEnd);
    
}
