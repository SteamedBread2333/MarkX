/**
 * MarkX - 专业 Markdown + Mermaid 编辑器
 * 主入口文件 - 整合所有模块
 */

// 导入核心模块
export { AppState } from './core/state.js';
export { DEFAULT_CONTENT } from './core/constants.js';
export { debounce, escapeHtml, generateHeadingId } from './core/utils.js';
export { elements } from './core/elements.js';
export { setStatus, updateStats } from './core/ui-utils.js';

// 导入配置模块
export { marked } from './config/marked.js';
export { initMermaid, mermaid } from './config/mermaid.js';

// 注意：其他模块（编辑器、渲染器、UI、导出、文件操作）由于代码量大，
// 暂时保留在原 app.js 中，通过重新导出方式整合
// 后续可以逐步将这些模块拆分到对应的文件中

// 从原 app.js 导入所有其他功能
// 这里需要确保原 app.js 中的所有导出都被重新导出
// 为了不影响原有功能，我们暂时保留原 app.js 的结构
