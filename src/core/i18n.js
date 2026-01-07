/**
 * 国际化 (i18n) 模块
 * 支持多语言切换，易于扩展
 */

// 支持的语言列表
export const SUPPORTED_LANGUAGES = {
    en: 'English',
    zh: '中文'
};

// 默认语言
export const DEFAULT_LANGUAGE = 'en';

// 语言资源文件
import en from './locales/en.js';
import zh from './locales/zh.js';

const translations = {
    en,
    zh
};

// 当前语言
let currentLanguage = DEFAULT_LANGUAGE;

/**
 * 初始化 i18n 系统
 */
export function initI18n() {
    // 从 localStorage 读取用户设置的语言
    const savedLanguage = localStorage.getItem('markx-language');
    if (savedLanguage && translations[savedLanguage]) {
        currentLanguage = savedLanguage;
    } else {
        // 检测浏览器语言
        const browserLang = navigator.language.split('-')[0];
        if (translations[browserLang]) {
            currentLanguage = browserLang;
        }
    }
    
    // 应用语言
    applyLanguage(currentLanguage);
}

/**
 * 获取翻译文本
 * @param {string} key - 翻译键，支持点号分隔的嵌套键（如 'ui.toolbar.save'）
 * @param {Object} params - 参数对象，用于替换占位符
 * @returns {string} 翻译后的文本
 */
export function t(key, params = {}) {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    // 遍历嵌套键
    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        } else {
            // 如果当前语言找不到，回退到英文
            if (currentLanguage !== 'en') {
                value = translations.en;
                for (const k2 of keys) {
                    if (value && typeof value === 'object' && k2 in value) {
                        value = value[k2];
                    } else {
                        return key; // 如果英文也找不到，返回键名
                    }
                }
            } else {
                return key; // 如果英文也找不到，返回键名
            }
        }
    }
    
    // 如果值是字符串，替换参数
    if (typeof value === 'string') {
        return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
            return params[paramKey] !== undefined ? params[paramKey] : match;
        });
    }
    
    return value || key;
}

/**
 * 切换语言
 * @param {string} lang - 语言代码（如 'en', 'zh'）
 */
export function setLanguage(lang) {
    if (!translations[lang]) {
        console.warn(`Language ${lang} is not supported`);
        return;
    }
    
    currentLanguage = lang;
    localStorage.setItem('markx-language', lang);
    applyLanguage(lang);
    
    // 触发语言变化事件
    window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: lang } }));
}

/**
 * 获取当前语言
 * @returns {string} 当前语言代码
 */
export function getLanguage() {
    return currentLanguage;
}

/**
 * 应用语言到页面
 * @param {string} lang - 语言代码
 */
function applyLanguage(lang) {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('data-lang', lang);
}

/**
 * 获取所有支持的语言
 * @returns {Object} 语言代码到语言名称的映射
 */
export function getSupportedLanguages() {
    return SUPPORTED_LANGUAGES;
}
