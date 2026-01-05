/**
 * MarkX - 专业 Markdown + Mermaid 编辑器
 * 新的模块化主入口文件
 * 
 * 注意：这是一个渐进式重构的入口文件
 * 逐步将原 app.js 的功能拆分到各个模块中
 */

// 导入核心模块
import { AppState } from './core/state.js';
import { DEFAULT_CONTENT } from './core/constants.js';
import { debounce, escapeHtml, generateHeadingId } from './core/utils.js';
import { elements } from './core/elements.js';
import { setStatus, updateStats } from './core/ui-utils.js';

// 导入配置模块
import { marked } from './config/marked.js';
import { initMermaid, mermaid } from './config/mermaid.js';

// 临时：从原 app.js 导入其他功能
// 这些功能将在后续逐步拆分到对应的模块文件中
// 为了不影响原有功能，暂时保留在原 app.js 中

// 将核心模块导出到全局，供原 app.js 使用
window.MarkXModules = {
    AppState,
    DEFAULT_CONTENT,
    debounce,
    escapeHtml,
    generateHeadingId,
    elements,
    setStatus,
    updateStats,
    marked,
    initMermaid,
    mermaid,
};

// 导出供其他模块使用
export {
    AppState,
    DEFAULT_CONTENT,
    debounce,
    escapeHtml,
    generateHeadingId,
    elements,
    setStatus,
    updateStats,
    marked,
    initMermaid,
    mermaid,
};
