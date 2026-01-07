/**
 * 全屏模式模块
 */

import { AppState } from '../core/state.js';
import { elements } from '../core/elements.js';
import { setStatus } from '../core/ui-utils.js';
import { t } from '../core/i18n.js';

/**
 * 切换全屏模式
 */
export function toggleFullscreen() {
    if (!document.fullscreenElement) {
        // 进入全屏
        enterFullscreen();
    } else {
        // 退出全屏
        exitFullscreen();
    }
}

/**
 * 进入全屏
 */
function enterFullscreen() {
    const element = document.documentElement;
    
    if (element.requestFullscreen) {
        element.requestFullscreen().then(() => {
            updateFullscreenButton(true);
            setStatus(t('messages.fullscreenEntered'));
        }).catch(err => {
            console.error('进入全屏失败:', err);
            setStatus(t('messages.fullscreenFailed'), 3000);
        });
    } else if (element.webkitRequestFullscreen) {
        // Safari
        element.webkitRequestFullscreen();
        updateFullscreenButton(true);
        setStatus(t('messages.fullscreenEntered'));
    } else if (element.msRequestFullscreen) {
        // IE/Edge
        element.msRequestFullscreen();
        updateFullscreenButton(true);
        setStatus(t('messages.fullscreenEntered'));
    } else {
        setStatus(t('messages.fullscreenNotSupported'), 3000);
    }
}

/**
 * 退出全屏
 */
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
            updateFullscreenButton(false);
            setStatus(t('messages.fullscreenExited'));
        }).catch(err => {
            console.error('退出全屏失败:', err);
        });
    } else if (document.webkitExitFullscreen) {
        // Safari
        document.webkitExitFullscreen();
        updateFullscreenButton(false);
        setStatus(t('messages.fullscreenExited'));
    } else if (document.msExitFullscreen) {
        // IE/Edge
        document.msExitFullscreen();
        updateFullscreenButton(false);
        setStatus(t('messages.fullscreenExited'));
    }
}

/**
 * 更新全屏按钮图标
 */
function updateFullscreenButton(isFullscreen) {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (!fullscreenBtn) return;
    
    const icon = fullscreenBtn.querySelector('use');
    if (icon) {
        icon.setAttribute('href', isFullscreen ? '#icon-fullscreen-exit' : '#icon-fullscreen');
    }
}

/**
 * 初始化全屏功能
 */
export function initFullscreen() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (!fullscreenBtn) return;
    
    // 点击按钮切换全屏
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    
    // 监听全屏状态变化
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    
    // 初始化按钮状态
    updateFullscreenButton(!!document.fullscreenElement);
}

/**
 * 处理全屏状态变化
 */
function handleFullscreenChange() {
    const isFullscreen = !!(document.fullscreenElement || 
                           document.webkitFullscreenElement || 
                           document.msFullscreenElement);
    updateFullscreenButton(isFullscreen);
    
    // 添加/移除全屏类
    if (isFullscreen) {
        document.body.classList.add('fullscreen-mode');
    } else {
        document.body.classList.remove('fullscreen-mode');
    }
}
