/**
 * Mermaid 配置
 */

import mermaid from 'mermaid';
import { AppState } from '../core/state.js';

/**
 * 初始化 Mermaid
 */
export function initMermaid() {
    const theme = AppState.currentTheme === 'dark' ? 'dark' : 'default';
    
    mermaid.initialize({
        startOnLoad: false,
        theme: theme,
        securityLevel: 'loose',
        fontFamily: 'var(--font-family)',
        themeVariables: {
            primaryColor: AppState.currentTheme === 'dark' ? '#2f81f7' : '#0969da',
            primaryTextColor: AppState.currentTheme === 'dark' ? '#e6edf3' : '#24292f',
            primaryBorderColor: AppState.currentTheme === 'dark' ? '#30363d' : '#d0d7de',
            lineColor: AppState.currentTheme === 'dark' ? '#484f58' : '#d0d7de',
            secondaryColor: AppState.currentTheme === 'dark' ? '#161b22' : '#f6f8fa',
            tertiaryColor: AppState.currentTheme === 'dark' ? '#0d1117' : '#ffffff',
        },
    });
}

export { mermaid };
