/**
 * UI 工具函数
 */

import { elements } from './elements.js';
import { t } from './i18n.js';

/**
 * 设置状态消息
 */
export function setStatus(message, duration = 3000) {
    elements.statusMessage.textContent = message;
    if (duration > 0) {
        setTimeout(() => {
            elements.statusMessage.textContent = t('ui.statusbar.ready');
        }, duration);
    }
}

/**
 * 更新统计信息
 */
export function updateStats(text) {
    // 字符数
    const charCount = text.length;
    elements.charCount.textContent = t('ui.statusbar.characters', { count: charCount.toLocaleString() });
    
    // 词数（中英文混合）
    const chineseWords = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
    const totalWords = chineseWords + englishWords;
    elements.wordCount.textContent = t('ui.statusbar.words', { count: totalWords.toLocaleString() });
    
    // 行数
    const lineCount = text.split('\n').length;
    elements.lineCount.textContent = t('ui.statusbar.lines', { count: lineCount.toLocaleString() });
    
    // 预计阅读时间（假设每分钟 200 中文字或 300 英文词）
    const readMinutes = Math.max(1, Math.ceil((chineseWords / 200) + (englishWords / 300)));
    elements.readTime.textContent = t('ui.statusbar.readTime', { minutes: readMinutes });
}
