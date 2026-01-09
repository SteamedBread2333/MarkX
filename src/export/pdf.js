/**
 * PDF 导出模块
 */

import { t } from '../core/i18n.js';

import { AppState } from '../core/state.js';
import { elements } from '../core/elements.js';
import { setStatus } from '../core/ui-utils.js';

/**
 * 智能分页：找到最佳分页点
 * - Mermaid 图表、代码块、数学公式块如果超过一页高度，不做分页优化，直接完整显示
 * - 其他元素（表格、标题等）避免在中间分页
 */
function findPageBreaks(elements, containerRect, pageHeightPx, scale = 2) {
    const breaks = [0]; // 第一页从0开始（canvas坐标，已缩放）
    let currentPageTop = 0; // 当前页顶部位置（容器坐标）
    
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top - containerRect.top;
        const elementHeight = rect.height;
        const elementBottom = elementTop + elementHeight;
        const elementWidth = rect.width;
        
        // 跳过不可见或高度为0的元素
        if (elementHeight <= 0 || elementWidth <= 0) {
            continue;
        }
        
        // 判断元素类型（按优先级顺序检测）
        // 先检测特殊块，避免被误判为文字元素
        
        // 数学块：检测 .katex-block（块级公式）、.katex-inline（行内公式）、.katex-display（KaTeX 渲染后）
        const isMathBlock = element.matches('.katex-display, .katex-block, .katex-inline') || 
            element.closest('.katex-display, .katex-block, .katex-inline') ||
            (element.classList && element.classList.contains('katex') && element.querySelector('.katex-display'));
        
        // 代码块（使用 closest 确保子元素也能被识别）
        const isCodeBlock = element.matches('pre') || element.closest('pre');
        
        // SVG 和 Mermaid 包装器
        const isSvg = element.matches('svg') || (element.querySelector && element.querySelector('svg'));
        const isSvgWrapper = element.matches('.mermaid-wrapper, .mermaid-content') ||
            element.closest('.mermaid-wrapper, .mermaid-content');
        
        // ECharts 包装器（包括转换后的图片）
        const isEChartsWrapper = element.matches('.echarts-wrapper, .echarts-content, .echarts') ||
            element.closest('.echarts-wrapper, .echarts-content, .echarts') ||
            element.hasAttribute('data-echarts-chart') ||
            element.hasAttribute('data-echarts-content') ||
            element.hasAttribute('data-echarts-image') ||
            (element.matches('img') && element.closest('.echarts-wrapper, .echarts-content'));
        
        // 其他不应该被分割的元素
        const shouldAvoidBreak = element.matches('table, h1, h2, h3, h4, h5, h6, blockquote');
        
        // 文字元素：包含文本内容的块级或行内元素（排除已检测的特殊块）
        const isTextElement = !isMathBlock && !isCodeBlock && !isSvg && !isSvgWrapper && !isEChartsWrapper && !shouldAvoidBreak &&
            (element.matches('p, li, span, strong, em, a, code:not(pre code), b, i, u, mark, del, ins') ||
            (element.textContent && element.textContent.trim().length > 0 && 
             !element.matches('pre, table, svg, .mermaid-wrapper, .mermaid-content, .echarts-wrapper, .echarts-content, .katex-display, .katex-block, .katex-inline, h1, h2, h3, h4, h5, h6, blockquote')));
        
        // 计算当前页剩余空间
        const currentPageBottom = currentPageTop + pageHeightPx;
        
        // 如果元素底部超过当前页底部
        if (elementBottom > currentPageBottom) {
            if (isTextElement && !isSvg && !isSvgWrapper && !isCodeBlock && !isMathBlock) {
                // 文字元素：不能在中间截断，必须在元素之前分页
                if (elementBottom > currentPageBottom) {
                    // 元素底部超过当前页底部，需要在元素之前分页
                    if (elementTop > currentPageTop) {
                        // 元素顶部不在当前页顶部，在元素之前分页
                        breaks.push(elementTop * scale);
                        currentPageTop = elementTop;
                    }
                    
                    // 如果文字元素本身超过一页高度，这是极端情况
                    // 我们仍然不允许截断，让它完整显示在新页
                    // 如果下一页还是放不下，继续分页（但保持元素完整，不截断）
                    if (elementHeight > pageHeightPx) {
                        // 文字元素超过一页，让它完整显示在新页
                        // 如果下一页还是放不下，继续分页（但保持元素完整）
                        while (elementBottom > currentPageTop + pageHeightPx) {
                            // 移动到下一页，但保持元素完整（不截断）
                            breaks.push((currentPageTop + pageHeightPx) * scale);
                            currentPageTop += pageHeightPx;
                        }
                    }
                }
            } else if (isSvg || isSvgWrapper || isEChartsWrapper || isCodeBlock || isMathBlock) {
                // Mermaid 图表、ECharts 图表、代码块、数学公式块：只要可能被截断就提前分页
                // 在元素之前分页，避免跨页截断
                if (elementTop > currentPageTop) {
                    breaks.push(elementTop * scale);
                    currentPageTop = elementTop;
                }
                
                // 如果元素仍然超过新页底部，继续分页（元素超过一页高度的情况）
                // 但要注意：对于 ECharts 图表，即使超过一页高度，也要保持完整，不能截断
                if (isEChartsWrapper) {
                    // ECharts 图表：如果超过一页，让它完整显示在新页，即使需要多页
                    while (elementBottom > currentPageTop + pageHeightPx) {
                        breaks.push((currentPageTop + pageHeightPx) * scale);
                        currentPageTop += pageHeightPx;
                    }
                } else {
                    // 其他元素：如果超过一页高度，继续分页
                    while (elementBottom > currentPageTop + pageHeightPx) {
                        breaks.push((currentPageTop + pageHeightPx) * scale);
                        currentPageTop += pageHeightPx;
                    }
                }
            } else if (shouldAvoidBreak) {
                // 不应该被分割的元素：在它之前分页
                if (elementTop > currentPageTop) {
                    breaks.push(elementTop * scale);
                    currentPageTop = elementTop;
                }
                
                // 如果元素仍然超过新页底部，继续分页（但这种情况应该很少）
                while (elementBottom > currentPageTop + pageHeightPx) {
                    breaks.push((currentPageTop + pageHeightPx) * scale);
                    currentPageTop += pageHeightPx;
                }
            } else {
                // 其他元素：在当前页底部分页
                breaks.push(currentPageBottom * scale);
                currentPageTop = currentPageBottom;
                
                // 如果元素仍然超过新页底部，继续分页
                while (elementBottom > currentPageTop + pageHeightPx) {
                    breaks.push((currentPageTop + pageHeightPx) * scale);
                    currentPageTop += pageHeightPx;
                }
            }
        }
    }
    
    return breaks;
}

/**
 * 导出 PDF - 使用 jsPDF + html2canvas 实现智能分页
 */
export async function exportPDF() {
    // 检查库是否已加载
    if (typeof window.jspdf === 'undefined' || typeof html2canvas === 'undefined') {
        setStatus(t('messages.pdfLibNotLoaded'), 5000);
        return;
    }
    
    // 检查预览区是否有内容
    if (!elements.preview || !elements.preview.innerHTML.trim()) {
        setStatus('预览区为空，请先编辑内容', 3000);
        return;
    }
    
    setStatus(t('messages.generatingPdf'));
    
    try {
        // 克隆预览区内容（深度克隆，包括SVG）
        const previewClone = elements.preview.cloneNode(true);
        
        // 移除导出工具栏
        const toolbars = previewClone.querySelectorAll('.mermaid-export-toolbar, .echarts-export-toolbar');
        toolbars.forEach(toolbar => toolbar.remove());
        
        // 确保标题中的空格被保留
        const headings = previewClone.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            heading.style.whiteSpace = 'pre-wrap';
            
            const originalHTML = heading.innerHTML;
            if (originalHTML.includes(' ') && !originalHTML.match(/&nbsp;/)) {
                let newHTML = '';
                let inTag = false;
                for (let i = 0; i < originalHTML.length; i++) {
                    const char = originalHTML[i];
                    if (char === '<') {
                        inTag = true;
                        newHTML += char;
                    } else if (char === '>') {
                        inTag = false;
                        newHTML += char;
                    } else if (char === ' ' && !inTag) {
                        newHTML += '&nbsp;';
                    } else {
                        newHTML += char;
                    }
                }
                heading.innerHTML = newHTML;
            }
        });
        
        // 处理 ECharts 图表：将 Canvas 转换为图片
        const echartsWrappers = previewClone.querySelectorAll('.echarts-wrapper');
        const originalEchartsWrappers = elements.preview.querySelectorAll('.echarts-wrapper');
        
        for (let i = 0; i < echartsWrappers.length; i++) {
            const wrapper = echartsWrappers[i];
            const originalWrapper = originalEchartsWrappers[i];
            
            if (!originalWrapper) continue;
            
            // 查找原始图表实例
            const originalChart = originalWrapper._chart;
            if (!originalChart) continue;
            
            // 获取图表容器的 Canvas
            const chartDom = originalChart.getDom();
            if (!chartDom) continue;
            
            const canvas = chartDom.querySelector('canvas');
            if (!canvas) continue;
            
            // 将 Canvas 转换为图片
            try {
                const dataURL = canvas.toDataURL('image/png');
                const img = document.createElement('img');
                img.src = dataURL;
                img.style.width = '100%';
                img.style.height = 'auto';
                img.style.display = 'block';
                
                // 替换 wrapper 内容
                wrapper.innerHTML = '';
                wrapper.className = 'echarts-wrapper';
                const contentDiv = document.createElement('div');
                contentDiv.className = 'echarts-content';
                contentDiv.appendChild(img);
                wrapper.appendChild(contentDiv);
            } catch (error) {
                console.error('ECharts 图表转换失败:', error);
            }
        }
        
        // 确保Mermaid SVG被正确包含并保持原始尺寸
        const mermaidWrappers = previewClone.querySelectorAll('.mermaid-wrapper');
        const originalWrappers = elements.preview.querySelectorAll('.mermaid-wrapper');
        
        mermaidWrappers.forEach((wrapper, index) => {
            const svg = wrapper.querySelector('svg');
            if (svg && originalWrappers[index]) {
                const originalSvg = originalWrappers[index].querySelector('svg');
                if (originalSvg) {
                    const originalRect = originalSvg.getBoundingClientRect();
                    const originalWidth = originalSvg.getAttribute('width');
                    const originalHeight = originalSvg.getAttribute('height');
                    const originalViewBox = originalSvg.getAttribute('viewBox');
                    
                    if (originalWidth && originalHeight) {
                        svg.setAttribute('width', originalWidth);
                        svg.setAttribute('height', originalHeight);
                    } else if (originalViewBox) {
                        const viewBoxValues = originalViewBox.split(/\s+|,/).filter(v => v);
                        if (viewBoxValues.length >= 4) {
                            const vbWidth = parseFloat(viewBoxValues[2]);
                            const vbHeight = parseFloat(viewBoxValues[3]);
                            if (vbWidth > 0 && vbHeight > 0) {
                                const scale = Math.min(originalRect.width / vbWidth, originalRect.height / vbHeight);
                                svg.setAttribute('width', (vbWidth * scale) + 'px');
                                svg.setAttribute('height', (vbHeight * scale) + 'px');
                            }
                        }
                    } else if (originalRect.width > 0 && originalRect.height > 0) {
                        svg.setAttribute('width', originalRect.width + 'px');
                        svg.setAttribute('height', originalRect.height + 'px');
                    }
                    
                    if (originalViewBox) {
                        svg.setAttribute('viewBox', originalViewBox);
                    }
                }
                
                svg.style.display = 'block';
                svg.style.maxWidth = '100%';
                svg.style.width = svg.getAttribute('width') || 'auto';
                svg.style.height = svg.getAttribute('height') || 'auto';
                svg.style.margin = '0 auto';
                
                const paths = svg.querySelectorAll('path, circle, rect, line, polygon, polyline, text');
                paths.forEach(el => {
                    if (!el.getAttribute('fill') && !el.getAttribute('stroke')) {
                        el.setAttribute('fill', '#24292f');
                    }
                });
            }
        });
        
        // 创建独立的PDF导出容器
        const pdfContainer = document.createElement('div');
        pdfContainer.id = 'pdf-export-wrapper';
        pdfContainer.style.cssText = `
            position: absolute;
            left: 0;
            top: 0;
            width: 794px;
            padding: 40px;
            background-color: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #24292f;
            z-index: 99999;
            overflow: visible;
            box-sizing: border-box;
        `;
        
        // 创建内容包装器
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'markdown-body';
        contentWrapper.style.cssText = `
            width: 100%;
            margin: 0;
            padding: 0;
            color: #24292f;
            line-height: 1.6;
            font-size: 14px;
        `;
        contentWrapper.innerHTML = previewClone.innerHTML;
        
        // 添加完整的样式表（简化版，完整样式见原 app.js）
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            #pdf-export-wrapper { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif; }
            #pdf-export-wrapper .markdown-body { color: #24292f; line-height: 1.6; font-size: 14px; white-space: normal; }
            #pdf-export-wrapper .markdown-body h1, #pdf-export-wrapper .markdown-body h2, #pdf-export-wrapper .markdown-body h3,
            #pdf-export-wrapper .markdown-body h4, #pdf-export-wrapper .markdown-body h5, #pdf-export-wrapper .markdown-body h6 {
                margin-top: 24px; margin-bottom: 16px; font-weight: 600; line-height: 1.25; color: #24292f;
                white-space: pre-wrap !important; word-wrap: break-word; overflow-wrap: break-word;
            }
            #pdf-export-wrapper .markdown-body h1 { font-size: 2em; border-bottom: 1px solid #d0d7de; padding-bottom: 0.3em; }
            #pdf-export-wrapper .markdown-body h2 { font-size: 1.5em; border-bottom: 1px solid #d0d7de; padding-bottom: 0.3em; }
            #pdf-export-wrapper .markdown-body h3 { font-size: 1.25em; }
            #pdf-export-wrapper .markdown-body h4 { font-size: 1em; }
            #pdf-export-wrapper .markdown-body h5 { font-size: 0.875em; }
            #pdf-export-wrapper .markdown-body h6 { font-size: 0.85em; color: #57606a; }
            #pdf-export-wrapper .markdown-body p { margin-top: 0; margin-bottom: 16px; color: #24292f; white-space: pre-wrap; }
            #pdf-export-wrapper .markdown-body a { color: #0969da; text-decoration: none; }
            #pdf-export-wrapper .markdown-body strong { font-weight: 600; }
            #pdf-export-wrapper .markdown-body em { font-style: italic; }
            #pdf-export-wrapper .markdown-body code { padding: 0.2em 0.4em; margin: 0; font-size: 85%; background: #f6f8fa; border-radius: 6px; font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace; color: #24292f; }
            #pdf-export-wrapper .markdown-body pre { padding: 16px; overflow: visible; overflow-wrap: break-word; word-wrap: break-word; white-space: pre-wrap; font-size: 85%; line-height: 1.45; background: #f6f8fa; border-radius: 6px; margin-bottom: 16px; }
            #pdf-export-wrapper .markdown-body pre code { background: transparent; padding: 0; margin: 0; font-size: 100%; border-radius: 0; white-space: pre-wrap; word-wrap: break-word; color: #24292f; }
            #pdf-export-wrapper .markdown-body blockquote { margin: 0 0 16px 0; padding: 0 1em; color: #57606a; border-left: 4px solid #d0d7de; white-space: pre-wrap; }
            #pdf-export-wrapper .markdown-body ul, #pdf-export-wrapper .markdown-body ol { padding-left: 2em; margin-bottom: 16px; }
            #pdf-export-wrapper .markdown-body li { margin-bottom: 0.25em; color: #24292f; white-space: pre-wrap; }
            #pdf-export-wrapper .markdown-body table { border-spacing: 0; border-collapse: collapse; margin-bottom: 16px; width: 100%; page-break-inside: avoid; break-inside: avoid; }
            #pdf-export-wrapper .markdown-body table th, #pdf-export-wrapper .markdown-body table td { padding: 6px 13px; border: 1px solid #d0d7de; }
            #pdf-export-wrapper .markdown-body table th { font-weight: 600; background: #f6f8fa; }
            #pdf-export-wrapper .markdown-body table tr { background: #ffffff; }
            #pdf-export-wrapper .markdown-body table tr:nth-child(2n) { background: #f6f8fa; }
            #pdf-export-wrapper .markdown-body img { max-width: 100%; height: auto; border-radius: 6px; }
            #pdf-export-wrapper .markdown-body hr { height: 0.25em; padding: 0; margin: 24px 0; background-color: #d0d7de; border: 0; }
            #pdf-export-wrapper .mermaid-wrapper { margin: 24px 0; page-break-inside: avoid; break-inside: avoid; overflow: visible; }
            #pdf-export-wrapper .mermaid { page-break-inside: avoid; break-inside: avoid; overflow: visible; text-align: center; margin: 24px 0; padding: 0; background: #f6f8fa; border-radius: 8px; }
            #pdf-export-wrapper .mermaid-content { padding: 16px; overflow: visible; }
        #pdf-export-wrapper .mermaid-content svg { display: block !important; max-width: 100% !important; width: auto !important; height: auto !important; visibility: visible !important; opacity: 1 !important; margin: 0 auto; }
        #pdf-export-wrapper .mermaid-content svg * { visibility: visible !important; opacity: 1 !important; }
        #pdf-export-wrapper .echarts-wrapper { margin: 24px 0; page-break-inside: avoid; break-inside: avoid; overflow: visible; }
        #pdf-export-wrapper .echarts { page-break-inside: avoid; break-inside: avoid; overflow: visible; text-align: center; margin: 24px 0; padding: 0; background: #f6f8fa; border-radius: 8px; }
        #pdf-export-wrapper .echarts-content { padding: 16px; overflow: visible; }
        #pdf-export-wrapper .echarts-content img { display: block !important; max-width: 100% !important; width: auto !important; height: auto !important; visibility: visible !important; opacity: 1 !important; margin: 0 auto; }
        #pdf-export-wrapper .katex { font-size: 1.05em; color: #24292f; }
            #pdf-export-wrapper .katex-display { margin: 1.5em 0 !important; padding: 1.2em; background: #f6f8fa; border-radius: 8px; border-left: 4px solid #0969da; overflow: visible; text-align: center; }
            #pdf-export-wrapper .hljs { background: #f6f8fa; color: #24292f; }
        `;
        
        pdfContainer.appendChild(styleSheet);
        pdfContainer.appendChild(contentWrapper);
        document.body.appendChild(pdfContainer);
        
        // 强制重排，确保内容渲染
        pdfContainer.offsetHeight;
        
        // 等待内容渲染和图片加载
        await new Promise(resolve => {
            const images = pdfContainer.querySelectorAll('img');
            const svgs = pdfContainer.querySelectorAll('svg');
            let loadedCount = 0;
            const totalCount = images.length + svgs.length;
            
            if (totalCount === 0) {
                setTimeout(resolve, 500);
                return;
            }
            
            const checkComplete = () => {
                loadedCount++;
                if (loadedCount >= totalCount) {
                    setTimeout(resolve, 500);
                }
            };
            
            images.forEach(img => {
                if (img.complete) {
                    checkComplete();
                } else {
                    img.onload = checkComplete;
                    img.onerror = checkComplete;
                }
            });
            
            svgs.forEach(svg => {
                checkComplete();
            });
        });
        
        // 等待布局稳定
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // 获取实际内容高度
        const containerRect = pdfContainer.getBoundingClientRect();
        const wrapperRect = contentWrapper.getBoundingClientRect();
        const scrollHeight = Math.max(
            pdfContainer.scrollHeight,
            contentWrapper.scrollHeight,
            wrapperRect.height,
            containerRect.height
        );
        
        const finalHeight = scrollHeight + 100;
        pdfContainer.style.height = finalHeight + 'px';
        pdfContainer.style.minHeight = finalHeight + 'px';
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const finalScrollHeight = Math.max(
            pdfContainer.scrollHeight,
            contentWrapper.scrollHeight
        );
        
        // A4 纸张尺寸（毫米）
        const A4_WIDTH_MM = 210;
        const A4_HEIGHT_MM = 297;
        const MARGIN_MM = 10;
        const CONTENT_WIDTH_MM = A4_WIDTH_MM - MARGIN_MM * 2;
        const CONTENT_HEIGHT_MM = A4_HEIGHT_MM - MARGIN_MM * 2;
        
        // 计算像素到毫米的转换比例
        const mmToPx = (mm) => mm / 0.264583;
        const pageHeightPx = mmToPx(CONTENT_HEIGHT_MM);
        
        // 创建 PDF 文档
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait',
            compress: true
        });
        
        // 在渲染前，再次检查标题的空格是否被正确保留
        const headingsBeforeRender = pdfContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headingsBeforeRender.forEach(heading => {
            const html = heading.innerHTML;
            if (html.includes(' ') && !html.match(/&nbsp;/)) {
                let newHTML = '';
                let inTag = false;
                for (let i = 0; i < html.length; i++) {
                    const char = html[i];
                    if (char === '<') {
                        inTag = true;
                        newHTML += char;
                    } else if (char === '>') {
                        inTag = false;
                        newHTML += char;
                    } else if (char === ' ' && !inTag) {
                        newHTML += '&nbsp;';
                    } else {
                        newHTML += char;
                    }
                }
                heading.innerHTML = newHTML;
            }
        });
        
        // 使用 html2canvas 一次性渲染整个内容
        const canvas = await html2canvas(pdfContainer, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            width: pdfContainer.scrollWidth,
            height: finalScrollHeight,
            allowTaint: false,
            scrollX: 0,
            scrollY: 0,
            windowWidth: pdfContainer.scrollWidth,
            windowHeight: finalScrollHeight,
            onclone: (clonedDoc) => {
                // 确保克隆文档中的SVG可见并保持正确尺寸
                const clonedSvgs = clonedDoc.querySelectorAll('svg');
                clonedSvgs.forEach(svg => {
                    svg.style.display = 'block';
                    svg.style.visibility = 'visible';
                    svg.style.opacity = '1';
                    svg.style.maxWidth = '100%';
                    svg.style.width = 'auto';
                    svg.style.height = 'auto';
                    svg.style.margin = '0 auto';
                    
                    const elements = svg.querySelectorAll('*');
                    elements.forEach(el => {
                        if (el.style) {
                            el.style.visibility = 'visible';
                            el.style.opacity = '1';
                        }
                    });
                });
                
                // 确保克隆文档中的标题空格被保留
                const clonedHeadings = clonedDoc.querySelectorAll('h1, h2, h3, h4, h5, h6');
                clonedHeadings.forEach(heading => {
                    heading.style.whiteSpace = 'pre-wrap';
                    
                    const originalHTML = heading.innerHTML;
                    if (originalHTML.includes(' ')) {
                        let newHTML = '';
                        let inTag = false;
                        for (let i = 0; i < originalHTML.length; i++) {
                            const char = originalHTML[i];
                            if (char === '<') {
                                inTag = true;
                                newHTML += char;
                            } else if (char === '>') {
                                inTag = false;
                                newHTML += char;
                            } else if (char === ' ' && !inTag) {
                                newHTML += '&nbsp;';
                            } else {
                                newHTML += char;
                            }
                        }
                        heading.innerHTML = newHTML;
                    }
                    
                    const computedStyle = clonedDoc.defaultView.getComputedStyle(heading);
                    const fontSize = parseFloat(computedStyle.fontSize) || 16;
                    heading.style.letterSpacing = (fontSize * 0.1) + 'px';
                    
                    // 遍历所有文本节点，确保空格都被转换为 &nbsp;
                    const walker = clonedDoc.createTreeWalker(
                        heading,
                        NodeFilter.SHOW_TEXT,
                        null,
                        false
                    );
                    
                    const textNodes = [];
                    let node;
                    while (node = walker.nextNode()) {
                        textNodes.push(node);
                    }
                    
                    textNodes.forEach(textNode => {
                        const originalText = textNode.textContent;
                        if (originalText.includes(' ') && originalText.trim().length > 0) {
                            const tempSpan = clonedDoc.createElement('span');
                            tempSpan.textContent = originalText;
                            const escapedHTML = tempSpan.innerHTML;
                            const fixedHTML = escapedHTML.replace(/ /g, '&nbsp;');
                            
                            const wrapper = clonedDoc.createElement('span');
                            wrapper.innerHTML = fixedHTML;
                            
                            if (textNode.parentNode) {
                                textNode.parentNode.replaceChild(wrapper, textNode);
                            }
                        }
                    });
                });
                
                // 确保克隆文档的容器高度正确
                const clonedContainer = clonedDoc.getElementById('pdf-export-wrapper');
                if (clonedContainer) {
                    clonedContainer.style.height = finalScrollHeight + 'px';
                    clonedContainer.style.minHeight = finalScrollHeight + 'px';
                }
            }
        });
        
        // 智能分页：找到最佳分页点
        const allElements = Array.from(contentWrapper.querySelectorAll('*'));
        const contentElements = allElements.filter(el => {
            const rect = el.getBoundingClientRect();
            if (rect.height <= 0 || rect.width <= 0) {
                return false;
            }
            
            const isChildOfSpecialElement = el.closest('pre, .katex-display, .katex-block, .katex-inline, .mermaid-wrapper, .mermaid-content, .mermaid, .echarts-wrapper, .echarts-content, .echarts');
            if (isChildOfSpecialElement && isChildOfSpecialElement !== el) {
                return false;
            }
            
            return true;
        });
        
        const canvasScale = 2;
        const pageBreaks = findPageBreaks(contentElements, containerRect, pageHeightPx, canvasScale);
        
        // 计算总高度和宽度
        const totalHeightPx = canvas.height;
        const totalWidthPx = canvas.width;
        
        // 逐页添加内容
        for (let pageIndex = 0; pageIndex < pageBreaks.length; pageIndex++) {
            if (pageIndex > 0) {
                pdf.addPage();
            }
            
            const pageStartY = pageBreaks[pageIndex];
            const pageEndY = pageIndex < pageBreaks.length - 1 
                ? pageBreaks[pageIndex + 1] 
                : totalHeightPx;
            const pageHeight = pageEndY - pageStartY;
            
            // 创建临时canvas来裁剪当前页的内容
            const pageCanvas = document.createElement('canvas');
            pageCanvas.width = totalWidthPx;
            pageCanvas.height = pageHeight;
            const pageCtx = pageCanvas.getContext('2d');
            
            // 从原始canvas中提取当前页的内容
            pageCtx.drawImage(
                canvas,
                0, pageStartY,
                totalWidthPx, pageHeight,
                0, 0,
                totalWidthPx, pageHeight
            );
            
            // 将canvas转换为图片并添加到PDF
            const imgData = pageCanvas.toDataURL('image/jpeg', 0.95);
            
            // 计算在PDF中的尺寸（保持宽高比）
            const imgWidthMM = CONTENT_WIDTH_MM;
            const imgHeightMM = (pageHeight / totalWidthPx) * CONTENT_WIDTH_MM;
            
            pdf.addImage(imgData, 'JPEG', MARGIN_MM, MARGIN_MM, imgWidthMM, imgHeightMM);
        }
        
        // 保存PDF
        pdf.save(AppState.currentFileName.replace('.md', '.pdf'));
        
        // 清理临时容器
        if (document.body.contains(pdfContainer)) {
            document.body.removeChild(pdfContainer);
        }
        
        setStatus(t('messages.pdfExportSuccess'));
    } catch (err) {
        console.error('PDF 导出失败:', err);
        setStatus(t('messages.pdfExportFailed', { error: err.message || t('messages.unknownError') }), 5000);
        
        // 确保清理临时容器
        const pdfContainer = document.getElementById('pdf-export-wrapper');
        if (pdfContainer && document.body.contains(pdfContainer)) {
            document.body.removeChild(pdfContainer);
        }
    }
}

/**
 * 准备 PDF 导出容器（公共函数）
 */
async function preparePDFContainer() {
    // 克隆预览区内容（深度克隆，包括SVG）
    const previewClone = elements.preview.cloneNode(true);
    
    // 移除导出工具栏
    const toolbars = previewClone.querySelectorAll('.mermaid-export-toolbar, .echarts-export-toolbar');
    toolbars.forEach(toolbar => toolbar.remove());
    
    // 确保标题中的空格被保留
    const headings = previewClone.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
        heading.style.whiteSpace = 'pre-wrap';
        
        const originalHTML = heading.innerHTML;
        if (originalHTML.includes(' ') && !originalHTML.match(/&nbsp;/)) {
            let newHTML = '';
            let inTag = false;
            for (let i = 0; i < originalHTML.length; i++) {
                const char = originalHTML[i];
                if (char === '<') {
                    inTag = true;
                    newHTML += char;
                } else if (char === '>') {
                    inTag = false;
                    newHTML += char;
                } else if (char === ' ' && !inTag) {
                    newHTML += '&nbsp;';
                } else {
                    newHTML += char;
                }
            }
            heading.innerHTML = newHTML;
        }
    });
    
    // 处理 ECharts 图表：将 Canvas 转换为图片
    const echartsWrappers = previewClone.querySelectorAll('.echarts-wrapper');
    const originalEchartsWrappers = elements.preview.querySelectorAll('.echarts-wrapper');
    
    for (let i = 0; i < echartsWrappers.length; i++) {
        const wrapper = echartsWrappers[i];
        const originalWrapper = originalEchartsWrappers[i];
        
        if (!originalWrapper) {
            console.warn('找不到原始 ECharts wrapper，索引:', i);
            continue;
        }
        
        // 查找原始图表实例（优先从 wrapper 获取，如果没有则从父元素获取）
        let originalChart = originalWrapper._chart;
        if (!originalChart) {
            // 尝试从父元素 .echarts 获取
            const parentEcharts = originalWrapper.closest('.echarts');
            if (parentEcharts && parentEcharts._chart) {
                originalChart = parentEcharts._chart;
            }
        }
        
        if (!originalChart) {
            console.warn('找不到 ECharts 图表实例，索引:', i);
            continue;
        }
        
        // 获取图表容器的 Canvas
        let chartDom;
        try {
            chartDom = originalChart.getDom();
        } catch (error) {
            console.error('获取 ECharts DOM 失败:', error);
            continue;
        }
        
        if (!chartDom) {
            console.warn('ECharts DOM 为空，索引:', i);
            continue;
        }
        
        const canvas = chartDom.querySelector('canvas');
        if (!canvas) {
            console.warn('找不到 ECharts Canvas，索引:', i);
            continue;
        }
        
        // 将 Canvas 转换为图片
        try {
            // 确保图表已完全渲染
            originalChart.resize();
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const dataURL = canvas.toDataURL('image/png', 1.0);
            if (!dataURL || dataURL === 'data:,') {
                console.warn('Canvas 转换为图片失败，数据为空，索引:', i);
                continue;
            }
            
            const img = document.createElement('img');
            img.src = dataURL;
            img.style.width = '100%';
            img.style.height = 'auto';
            img.style.display = 'block';
            img.style.maxWidth = '100%';
            
            // 替换 wrapper 内容
            wrapper.innerHTML = '';
            wrapper.className = 'echarts-wrapper';
            wrapper.setAttribute('data-echarts-chart', 'true'); // 添加标记，方便识别
            const contentDiv = document.createElement('div');
            contentDiv.className = 'echarts-content';
            contentDiv.style.padding = '16px';
            contentDiv.setAttribute('data-echarts-content', 'true'); // 添加标记
            img.setAttribute('data-echarts-image', 'true'); // 添加标记
            contentDiv.appendChild(img);
            wrapper.appendChild(contentDiv);
        } catch (error) {
            console.error('ECharts 图表转换失败，索引:', i, error);
        }
    }
    
    // 确保Mermaid SVG被正确包含并保持原始尺寸
    const mermaidWrappers = previewClone.querySelectorAll('.mermaid-wrapper');
    const originalWrappers = elements.preview.querySelectorAll('.mermaid-wrapper');
    
    mermaidWrappers.forEach((wrapper, index) => {
        const svg = wrapper.querySelector('svg');
        if (svg && originalWrappers[index]) {
            const originalSvg = originalWrappers[index].querySelector('svg');
            if (originalSvg) {
                const originalRect = originalSvg.getBoundingClientRect();
                const originalWidth = originalSvg.getAttribute('width');
                const originalHeight = originalSvg.getAttribute('height');
                const originalViewBox = originalSvg.getAttribute('viewBox');
                
                if (originalWidth && originalHeight) {
                    svg.setAttribute('width', originalWidth);
                    svg.setAttribute('height', originalHeight);
                } else if (originalViewBox) {
                    const viewBoxValues = originalViewBox.split(/\s+|,/).filter(v => v);
                    if (viewBoxValues.length >= 4) {
                        const vbWidth = parseFloat(viewBoxValues[2]);
                        const vbHeight = parseFloat(viewBoxValues[3]);
                        if (vbWidth > 0 && vbHeight > 0) {
                            const scale = Math.min(originalRect.width / vbWidth, originalRect.height / vbHeight);
                            svg.setAttribute('width', (vbWidth * scale) + 'px');
                            svg.setAttribute('height', (vbHeight * scale) + 'px');
                        }
                    }
                } else if (originalRect.width > 0 && originalRect.height > 0) {
                    svg.setAttribute('width', originalRect.width + 'px');
                    svg.setAttribute('height', originalRect.height + 'px');
                }
                
                if (originalViewBox) {
                    svg.setAttribute('viewBox', originalViewBox);
                }
            }
            
            svg.style.display = 'block';
            svg.style.maxWidth = '100%';
            svg.style.width = svg.getAttribute('width') || 'auto';
            svg.style.height = svg.getAttribute('height') || 'auto';
            svg.style.margin = '0 auto';
            
            const paths = svg.querySelectorAll('path, circle, rect, line, polygon, polyline, text');
            paths.forEach(el => {
                if (!el.getAttribute('fill') && !el.getAttribute('stroke')) {
                    el.setAttribute('fill', '#24292f');
                }
            });
        }
    });
    
    // 创建独立的PDF导出容器
    const pdfContainer = document.createElement('div');
    pdfContainer.id = 'pdf-export-wrapper';
    pdfContainer.style.cssText = `
        position: absolute;
        left: 0;
        top: 0;
        width: 794px;
        padding: 40px;
        background-color: #ffffff;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
        font-size: 14px;
        line-height: 1.6;
        color: #24292f;
        z-index: 99999;
        overflow: visible;
        box-sizing: border-box;
    `;
    
    // 创建内容包装器
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'markdown-body';
    contentWrapper.style.cssText = `
        width: 100%;
        margin: 0;
        padding: 0;
        color: #24292f;
        line-height: 1.6;
        font-size: 14px;
    `;
    contentWrapper.innerHTML = previewClone.innerHTML;
    
    // 添加完整的样式表
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        #pdf-export-wrapper { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif; }
        #pdf-export-wrapper .markdown-body { color: #24292f; line-height: 1.6; font-size: 14px; white-space: normal; }
        #pdf-export-wrapper .markdown-body h1, #pdf-export-wrapper .markdown-body h2, #pdf-export-wrapper .markdown-body h3,
        #pdf-export-wrapper .markdown-body h4, #pdf-export-wrapper .markdown-body h5, #pdf-export-wrapper .markdown-body h6 {
            margin-top: 24px; margin-bottom: 16px; font-weight: 600; line-height: 1.25; color: #24292f;
            white-space: pre-wrap !important; word-wrap: break-word; overflow-wrap: break-word;
        }
        #pdf-export-wrapper .markdown-body h1 { font-size: 2em; border-bottom: 1px solid #d0d7de; padding-bottom: 0.3em; }
        #pdf-export-wrapper .markdown-body h2 { font-size: 1.5em; border-bottom: 1px solid #d0d7de; padding-bottom: 0.3em; }
        #pdf-export-wrapper .markdown-body h3 { font-size: 1.25em; }
        #pdf-export-wrapper .markdown-body h4 { font-size: 1em; }
        #pdf-export-wrapper .markdown-body h5 { font-size: 0.875em; }
        #pdf-export-wrapper .markdown-body h6 { font-size: 0.85em; color: #57606a; }
        #pdf-export-wrapper .markdown-body p { margin-top: 0; margin-bottom: 16px; color: #24292f; white-space: pre-wrap; }
        #pdf-export-wrapper .markdown-body a { color: #0969da; text-decoration: none; }
        #pdf-export-wrapper .markdown-body strong { font-weight: 600; }
        #pdf-export-wrapper .markdown-body em { font-style: italic; }
        #pdf-export-wrapper .markdown-body code { padding: 0.2em 0.4em; margin: 0; font-size: 85%; background: #f6f8fa; border-radius: 6px; font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace; color: #24292f; }
        #pdf-export-wrapper .markdown-body pre { padding: 16px; overflow: visible; overflow-wrap: break-word; word-wrap: break-word; white-space: pre-wrap; font-size: 85%; line-height: 1.45; background: #f6f8fa; border-radius: 6px; margin-bottom: 16px; }
        #pdf-export-wrapper .markdown-body pre code { background: transparent; padding: 0; margin: 0; font-size: 100%; border-radius: 0; white-space: pre-wrap; word-wrap: break-word; color: #24292f; }
        #pdf-export-wrapper .markdown-body blockquote { margin: 0 0 16px 0; padding: 0 1em; color: #57606a; border-left: 4px solid #d0d7de; white-space: pre-wrap; }
        #pdf-export-wrapper .markdown-body ul, #pdf-export-wrapper .markdown-body ol { padding-left: 2em; margin-bottom: 16px; }
        #pdf-export-wrapper .markdown-body li { margin-bottom: 0.25em; color: #24292f; white-space: pre-wrap; }
        #pdf-export-wrapper .markdown-body table { border-spacing: 0; border-collapse: collapse; margin-bottom: 16px; width: 100%; page-break-inside: avoid; break-inside: avoid; }
        #pdf-export-wrapper .markdown-body table th, #pdf-export-wrapper .markdown-body table td { padding: 6px 13px; border: 1px solid #d0d7de; }
        #pdf-export-wrapper .markdown-body table th { font-weight: 600; background: #f6f8fa; }
        #pdf-export-wrapper .markdown-body table tr { background: #ffffff; }
        #pdf-export-wrapper .markdown-body table tr:nth-child(2n) { background: #f6f8fa; }
        #pdf-export-wrapper .markdown-body img { max-width: 100%; height: auto; border-radius: 6px; }
        #pdf-export-wrapper .markdown-body hr { height: 0.25em; padding: 0; margin: 24px 0; background-color: #d0d7de; border: 0; }
        #pdf-export-wrapper .mermaid-wrapper { margin: 24px 0; page-break-inside: avoid; break-inside: avoid; overflow: visible; }
        #pdf-export-wrapper .mermaid { page-break-inside: avoid; break-inside: avoid; overflow: visible; text-align: center; margin: 24px 0; padding: 0; background: #f6f8fa; border-radius: 8px; }
        #pdf-export-wrapper .mermaid-content { padding: 16px; overflow: visible; }
        #pdf-export-wrapper .mermaid-content svg { display: block !important; max-width: 100% !important; width: auto !important; height: auto !important; visibility: visible !important; opacity: 1 !important; margin: 0 auto; }
        #pdf-export-wrapper .mermaid-content svg * { visibility: visible !important; opacity: 1 !important; }
        #pdf-export-wrapper .echarts-wrapper { margin: 24px 0; page-break-inside: avoid; break-inside: avoid; overflow: visible; }
        #pdf-export-wrapper .echarts { page-break-inside: avoid; break-inside: avoid; overflow: visible; text-align: center; margin: 24px 0; padding: 0; background: #f6f8fa; border-radius: 8px; }
        #pdf-export-wrapper .echarts-content { padding: 16px; overflow: visible; }
        #pdf-export-wrapper .echarts-content img { display: block !important; max-width: 100% !important; width: auto !important; height: auto !important; visibility: visible !important; opacity: 1 !important; margin: 0 auto; }
        #pdf-export-wrapper .katex { font-size: 1.05em; color: #24292f; }
        #pdf-export-wrapper .katex-display { margin: 1.5em 0 !important; padding: 1.2em; background: #f6f8fa; border-radius: 8px; border-left: 4px solid #0969da; overflow: visible; text-align: center; }
        #pdf-export-wrapper .hljs { background: #f6f8fa; color: #24292f; }
    `;
    
    pdfContainer.appendChild(styleSheet);
    pdfContainer.appendChild(contentWrapper);
    document.body.appendChild(pdfContainer);
    
    return { pdfContainer, contentWrapper };
}

/**
 * 等待内容渲染完成
 */
async function waitForContentRender(pdfContainer) {
    // 强制重排，确保内容渲染
    pdfContainer.offsetHeight;
    
    // 等待内容渲染和图片加载
    await new Promise(resolve => {
        const images = pdfContainer.querySelectorAll('img');
        const svgs = pdfContainer.querySelectorAll('svg');
        let loadedCount = 0;
        const totalCount = images.length + svgs.length;
        
        if (totalCount === 0) {
            setTimeout(resolve, 500);
            return;
        }
        
        const checkComplete = () => {
            loadedCount++;
            if (loadedCount >= totalCount) {
                setTimeout(resolve, 500);
            }
        };
        
        images.forEach(img => {
            if (img.complete) {
                checkComplete();
            } else {
                img.onload = checkComplete;
                img.onerror = checkComplete;
            }
        });
        
        svgs.forEach(svg => {
            checkComplete();
        });
    });
    
    // 等待布局稳定
    await new Promise(resolve => setTimeout(resolve, 200));
}

/**
 * 导出 PDF - 默认模式：不使用智能分页，自然截断
 */
export async function exportPDFDefault() {
    // 检查库是否已加载
    if (typeof window.jspdf === 'undefined' || typeof html2canvas === 'undefined') {
        setStatus(t('messages.pdfLibNotLoaded'), 5000);
        return;
    }
    
    // 检查预览区是否有内容
    if (!elements.preview || !elements.preview.innerHTML.trim()) {
        setStatus('预览区为空，请先编辑内容', 3000);
        return;
    }
    
    setStatus(t('messages.generatingPdfDefault'));
    
    try {
        const { pdfContainer, contentWrapper } = await preparePDFContainer();
        
        // 等待内容渲染
        await waitForContentRender(pdfContainer);
        
        // 获取实际内容高度
        const containerRect = pdfContainer.getBoundingClientRect();
        const wrapperRect = contentWrapper.getBoundingClientRect();
        const scrollHeight = Math.max(
            pdfContainer.scrollHeight,
            contentWrapper.scrollHeight,
            wrapperRect.height,
            containerRect.height
        );
        
        const finalHeight = scrollHeight + 100;
        pdfContainer.style.height = finalHeight + 'px';
        pdfContainer.style.minHeight = finalHeight + 'px';
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const finalScrollHeight = Math.max(
            pdfContainer.scrollHeight,
            contentWrapper.scrollHeight
        );
        
        // A4 纸张尺寸（毫米）
        const A4_WIDTH_MM = 210;
        const A4_HEIGHT_MM = 297;
        const MARGIN_MM = 10;
        const CONTENT_WIDTH_MM = A4_WIDTH_MM - MARGIN_MM * 2;
        const CONTENT_HEIGHT_MM = A4_HEIGHT_MM - MARGIN_MM * 2;
        
        // 计算像素到毫米的转换比例
        const mmToPx = (mm) => mm / 0.264583;
        const pageHeightPx = mmToPx(CONTENT_HEIGHT_MM);
        
        // 创建 PDF 文档
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait',
            compress: true
        });
        
        // 使用 html2canvas 渲染整个内容
        const canvas = await html2canvas(pdfContainer, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            width: pdfContainer.scrollWidth,
            height: finalScrollHeight,
            allowTaint: false,
            scrollX: 0,
            scrollY: 0,
            windowWidth: pdfContainer.scrollWidth,
            windowHeight: finalScrollHeight,
            onclone: (clonedDoc) => {
                // 确保克隆文档中的SVG可见
                const clonedSvgs = clonedDoc.querySelectorAll('svg');
                clonedSvgs.forEach(svg => {
                    svg.style.display = 'block';
                    svg.style.visibility = 'visible';
                    svg.style.opacity = '1';
                    svg.style.maxWidth = '100%';
                    svg.style.width = 'auto';
                    svg.style.height = 'auto';
                    svg.style.margin = '0 auto';
                    
                    const elements = svg.querySelectorAll('*');
                    elements.forEach(el => {
                        if (el.style) {
                            el.style.visibility = 'visible';
                            el.style.opacity = '1';
                        }
                    });
                });
                
                // 确保克隆文档的容器高度正确
                const clonedContainer = clonedDoc.getElementById('pdf-export-wrapper');
                if (clonedContainer) {
                    clonedContainer.style.height = finalScrollHeight + 'px';
                    clonedContainer.style.minHeight = finalScrollHeight + 'px';
                }
            }
        });
        
        // 计算总高度和宽度
        const totalHeightPx = canvas.height;
        const totalWidthPx = canvas.width;
        
        // 按页面高度自然截断分页
        const pageBreaks = [];
        for (let y = 0; y < totalHeightPx; y += pageHeightPx * 2) { // 乘以2是因为scale=2
            pageBreaks.push(y);
        }
        if (pageBreaks[pageBreaks.length - 1] < totalHeightPx) {
            pageBreaks.push(totalHeightPx);
        }
        
        // 逐页添加内容
        for (let pageIndex = 0; pageIndex < pageBreaks.length - 1; pageIndex++) {
            if (pageIndex > 0) {
                pdf.addPage();
            }
            
            const pageStartY = pageBreaks[pageIndex];
            const pageEndY = pageBreaks[pageIndex + 1];
            const pageHeight = pageEndY - pageStartY;
            
            // 创建临时canvas来裁剪当前页的内容
            const pageCanvas = document.createElement('canvas');
            pageCanvas.width = totalWidthPx;
            pageCanvas.height = pageHeight;
            const pageCtx = pageCanvas.getContext('2d');
            
            // 从原始canvas中提取当前页的内容
            pageCtx.drawImage(
                canvas,
                0, pageStartY,
                totalWidthPx, pageHeight,
                0, 0,
                totalWidthPx, pageHeight
            );
            
            // 将canvas转换为图片并添加到PDF
            const imgData = pageCanvas.toDataURL('image/jpeg', 0.95);
            
            // 计算在PDF中的尺寸（保持宽高比）
            const imgWidthMM = CONTENT_WIDTH_MM;
            const imgHeightMM = (pageHeight / totalWidthPx) * CONTENT_WIDTH_MM;
            
            pdf.addImage(imgData, 'JPEG', MARGIN_MM, MARGIN_MM, imgWidthMM, imgHeightMM);
        }
        
        // 保存PDF
        pdf.save(AppState.currentFileName.replace('.md', '.pdf'));
        
        // 清理临时容器
        if (document.body.contains(pdfContainer)) {
            document.body.removeChild(pdfContainer);
        }
        
        setStatus(t('messages.pdfExportSuccessDefault'));
    } catch (err) {
        console.error('PDF 导出失败:', err);
        setStatus(t('messages.pdfExportFailed', { error: err.message || t('messages.unknownError') }), 5000);
        
        // 确保清理临时容器
        const pdfContainer = document.getElementById('pdf-export-wrapper');
        if (pdfContainer && document.body.contains(pdfContainer)) {
            document.body.removeChild(pdfContainer);
        }
    }
}

/**
 * 导出 PDF - 整张模式：导出 PDF 长图，不分页
 */
export async function exportPDFFullPage() {
    // 检查库是否已加载
    if (typeof window.jspdf === 'undefined' || typeof html2canvas === 'undefined') {
        setStatus(t('messages.pdfLibNotLoaded'), 5000);
        return;
    }
    
    // 检查预览区是否有内容
    if (!elements.preview || !elements.preview.innerHTML.trim()) {
        setStatus('预览区为空，请先编辑内容', 3000);
        return;
    }
    
    setStatus(t('messages.generatingPdfFullPage'));
    
    try {
        const { pdfContainer, contentWrapper } = await preparePDFContainer();
        
        // 等待内容渲染
        await waitForContentRender(pdfContainer);
        
        // 获取实际内容高度
        const containerRect = pdfContainer.getBoundingClientRect();
        const wrapperRect = contentWrapper.getBoundingClientRect();
        const scrollHeight = Math.max(
            pdfContainer.scrollHeight,
            contentWrapper.scrollHeight,
            wrapperRect.height,
            containerRect.height
        );
        
        const finalHeight = scrollHeight + 100;
        pdfContainer.style.height = finalHeight + 'px';
        pdfContainer.style.minHeight = finalHeight + 'px';
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const finalScrollHeight = Math.max(
            pdfContainer.scrollHeight,
            contentWrapper.scrollHeight
        );
        
        // A4 纸张尺寸（毫米）
        const A4_WIDTH_MM = 210;
        const MARGIN_MM = 10;
        const CONTENT_WIDTH_MM = A4_WIDTH_MM - MARGIN_MM * 2;
        
        // 计算像素到毫米的转换比例
        const mmToPx = (mm) => mm / 0.264583;
        const pageWidthPx = mmToPx(CONTENT_WIDTH_MM);
        
        // 创建 PDF 文档（使用自定义尺寸）
        const { jsPDF } = window.jspdf;
        
        // 计算PDF页面高度（毫米）
        const pageHeightMM = (finalScrollHeight / pageWidthPx) * CONTENT_WIDTH_MM;
        
        const pdf = new jsPDF({
            unit: 'mm',
            format: [A4_WIDTH_MM, pageHeightMM], // 自定义高度
            orientation: 'portrait',
            compress: true
        });
        
        // 使用 html2canvas 渲染整个内容
        const canvas = await html2canvas(pdfContainer, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            width: pdfContainer.scrollWidth,
            height: finalScrollHeight,
            allowTaint: false,
            scrollX: 0,
            scrollY: 0,
            windowWidth: pdfContainer.scrollWidth,
            windowHeight: finalScrollHeight,
            onclone: (clonedDoc) => {
                // 确保克隆文档中的SVG可见
                const clonedSvgs = clonedDoc.querySelectorAll('svg');
                clonedSvgs.forEach(svg => {
                    svg.style.display = 'block';
                    svg.style.visibility = 'visible';
                    svg.style.opacity = '1';
                    svg.style.maxWidth = '100%';
                    svg.style.width = 'auto';
                    svg.style.height = 'auto';
                    svg.style.margin = '0 auto';
                    
                    const elements = svg.querySelectorAll('*');
                    elements.forEach(el => {
                        if (el.style) {
                            el.style.visibility = 'visible';
                            el.style.opacity = '1';
                        }
                    });
                });
                
                // 确保克隆文档的容器高度正确
                const clonedContainer = clonedDoc.getElementById('pdf-export-wrapper');
                if (clonedContainer) {
                    clonedContainer.style.height = finalScrollHeight + 'px';
                    clonedContainer.style.minHeight = finalScrollHeight + 'px';
                }
            }
        });
        
        // 计算总高度和宽度
        const totalHeightPx = canvas.height;
        const totalWidthPx = canvas.width;
        
        // 将整个canvas转换为图片并添加到PDF（单页）
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        
        // 计算在PDF中的尺寸（保持宽高比）
        const imgWidthMM = CONTENT_WIDTH_MM;
        const imgHeightMM = (totalHeightPx / totalWidthPx) * CONTENT_WIDTH_MM;
        
        pdf.addImage(imgData, 'JPEG', MARGIN_MM, MARGIN_MM, imgWidthMM, imgHeightMM);
        
        // 保存PDF
        pdf.save(AppState.currentFileName.replace('.md', '.pdf'));
        
        // 清理临时容器
        if (document.body.contains(pdfContainer)) {
            document.body.removeChild(pdfContainer);
        }
        
        setStatus(t('messages.pdfExportSuccessFullPage'));
    } catch (err) {
        console.error('PDF 导出失败:', err);
        setStatus(t('messages.pdfExportFailed', { error: err.message || t('messages.unknownError') }), 5000);
        
        // 确保清理临时容器
        const pdfContainer = document.getElementById('pdf-export-wrapper');
        if (pdfContainer && document.body.contains(pdfContainer)) {
            document.body.removeChild(pdfContainer);
        }
    }
}
