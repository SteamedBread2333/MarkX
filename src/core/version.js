/**
 * 应用版本号
 * 每次发布新版本时，请更新此版本号
 * 这将强制浏览器重新加载所有资源
 */

export const APP_VERSION = '1.0.1';

/**
 * 获取带版本号的资源路径
 * @param {string} path - 资源路径
 * @returns {string} 带版本号的资源路径
 */
export function getVersionedPath(path) {
    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}v=${APP_VERSION}`;
}
