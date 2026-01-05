/**
 * UI 工具函数
 */

import { elements } from './elements.js';

/**
 * 设置状态消息
 */
export function setStatus(message, duration = 3000) {
    elements.statusMessage.textContent = message;
    if (duration > 0) {
        setTimeout(() => {
            elements.statusMessage.textContent = '就绪';
        }, duration);
    }
}

/**
 * 更新统计信息
 */
export function updateStats(text) {
    // 字符数
    const charCount = text.length;
    elements.charCount.textContent = `${charCount.toLocaleString()} 字符`;
    
    // 词数（中英文混合）
    const chineseWords = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
    const totalWords = chineseWords + englishWords;
    elements.wordCount.textContent = `${totalWords.toLocaleString()} 词`;
    
    // 行数
    const lineCount = text.split('\n').length;
    elements.lineCount.textContent = `${lineCount.toLocaleString()} 行`;
    
    // 预计阅读时间（假设每分钟 200 中文字或 300 英文词）
    const readMinutes = Math.max(1, Math.ceil((chineseWords / 200) + (englishWords / 300)));
    elements.readTime.textContent = `预计阅读 ${readMinutes} 分钟`;
}
