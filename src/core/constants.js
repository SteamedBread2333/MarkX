/**
 * 应用常量定义
 */

import { t } from './i18n.js';

/**
 * 获取默认文档内容（根据当前语言）
 */
export function getDefaultContent() {
    return t('ui.editor.placeholder');
}

// 为了向后兼容，保留常量导出（使用英文作为默认值）
export const DEFAULT_CONTENT = getDefaultContent();
