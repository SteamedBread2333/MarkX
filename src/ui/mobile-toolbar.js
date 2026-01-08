/**
 * 移动端悬浮工具栏
 */

/**
 * 初始化移动端悬浮工具栏
 */
export function initMobileToolbar() {
    const fab = document.getElementById('mobileToolbarFab');
    const panel = document.getElementById('mobileToolbarPanel');
    const overlay = document.getElementById('mobileToolbarOverlay');
    const closeBtn = document.getElementById('mobileToolbarClose');
    
    if (!fab || !panel || !overlay || !closeBtn) {
        console.warn('移动端工具栏元素未找到');
        return;
    }
    
    // 打开面板
    function openPanel() {
        panel.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    }
    
    // 关闭面板
    function closePanel() {
        panel.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // 恢复滚动
    }
    
    // 关闭所有下拉菜单
    function closeAllDropdowns() {
        document.querySelectorAll('.mobile-toolbar-dropdown').forEach(dropdown => {
            dropdown.remove();
        });
    }
    
    // 切换移动端下拉菜单显示/隐藏
    function toggleMobileDropdown(type, triggerBtn) {
        // 先关闭所有其他下拉菜单
        document.querySelectorAll('.mobile-toolbar-dropdown').forEach(dropdown => {
            if (dropdown.id !== `mobile-${type}-dropdown`) {
                dropdown.remove();
            }
        });
        
        // 检查当前下拉菜单是否存在
        const existingDropdown = document.getElementById(`mobile-${type}-dropdown`);
        if (existingDropdown) {
            // 如果存在，关闭它
            existingDropdown.remove();
            return;
        }
        
        // 如果不存在，创建并显示下拉菜单
        const dropdown = document.createElement('div');
        dropdown.id = `mobile-${type}-dropdown`;
        dropdown.className = 'mobile-toolbar-dropdown';
        
        const items = type === 'mermaid' 
            ? document.querySelectorAll('[data-mermaid]')
            : document.querySelectorAll('[data-math]');
        
        items.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'mobile-toolbar-dropdown-item';
            btn.textContent = item.textContent.trim();
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                // 触发原始菜单项的点击事件
                item.dispatchEvent(new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                }));
                // 立即关闭下拉菜单和面板
                closeAllDropdowns();
                closePanel();
            });
            dropdown.appendChild(btn);
        });
        
        // 插入到触发按钮的父容器中
        const section = triggerBtn.closest('.mobile-toolbar-section');
        if (section) {
            section.appendChild(dropdown);
        }
    }
    
    // 绑定事件
    fab.addEventListener('click', (e) => {
        e.stopPropagation();
        openPanel();
    });
    
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closePanel();
    });
    
    overlay.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllDropdowns();
        closePanel();
    });
    
    // 处理面板内容区域的点击事件
    panel.addEventListener('click', (e) => {
        const target = e.target;
        // 如果点击的不是按钮、下拉菜单或下拉菜单项，关闭所有下拉菜单
        if (!target.closest('.mobile-toolbar-btn') && 
            !target.closest('.mobile-toolbar-dropdown') && 
            !target.closest('.mobile-toolbar-dropdown-item')) {
            closeAllDropdowns();
        }
        // 阻止事件冒泡到overlay，防止关闭面板
        e.stopPropagation();
    });
    
    // 将移动端按钮的事件委托到原始按钮
    const buttonMappings = {
        'mobileNewBtn': 'newBtn',
        'mobileOpenBtn': 'openBtn',
        'mobileSaveBtn': 'saveBtn',
        'mobileBoldBtn': 'boldBtn',
        'mobileItalicBtn': 'italicBtn',
        'mobileHeadingBtn': 'headingBtn',
        'mobileLinkBtn': 'linkBtn',
        'mobileImageBtn': 'imageBtn',
        'mobileCodeBtn': 'codeBtn',
        'mobileTableBtn': 'tableBtn',
        'mobileMermaidBtn': 'mermaidBtn',
        'mobileMathBtn': 'mathBtn'
    };
    
    // 绑定移动端按钮点击事件
    Object.entries(buttonMappings).forEach(([mobileId, originalId]) => {
        const mobileBtn = document.getElementById(mobileId);
        const originalBtn = document.getElementById(originalId);
        
        if (mobileBtn && originalBtn) {
            mobileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // 特殊处理 Mermaid 和 Math 下拉菜单
                if (mobileId === 'mobileMermaidBtn' || mobileId === 'mobileMathBtn') {
                    // 切换下拉菜单显示/隐藏
                    toggleMobileDropdown(mobileId === 'mobileMermaidBtn' ? 'mermaid' : 'math', mobileBtn);
                } else {
                    // 先关闭所有下拉菜单
                    closeAllDropdowns();
                    // 触发原始按钮的点击事件
                    originalBtn.click();
                    // 点击后关闭面板
                    closePanel();
                }
            });
        }
    });
    
    // 初始化移动端设置面板
    initMobileSettingsPanel();
}

/**
 * 初始化移动端设置面板
 */
function initMobileSettingsPanel() {
    const settingsBtn = document.getElementById('mobileSettingsBtn');
    const settingsPanel = document.getElementById('mobileSettingsPanel');
    const settingsOverlay = document.getElementById('mobileSettingsOverlay');
    const settingsCloseBtn = document.getElementById('mobileSettingsClose');
    
    if (!settingsBtn || !settingsPanel || !settingsOverlay || !settingsCloseBtn) {
        return;
    }
    
    // 打开设置面板
    function openSettingsPanel() {
        settingsPanel.classList.add('active');
        settingsOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // 关闭设置面板
    function closeSettingsPanel() {
        settingsPanel.classList.remove('active');
        settingsOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // 绑定事件
    settingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openSettingsPanel();
    });
    
    settingsCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeSettingsPanel();
    });
    
    settingsOverlay.addEventListener('click', (e) => {
        e.stopPropagation();
        closeSettingsPanel();
    });
    
    // 阻止设置面板内容区域的点击事件冒泡
    settingsPanel.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // 绑定设置面板按钮事件
    const settingsButtonMappings = {
        'mobileLangEnBtn': () => {
            const langBtn = document.getElementById('langBtn');
            if (langBtn) {
                const enBtn = langBtn.parentElement.querySelector('[data-lang="en"]');
                if (enBtn) enBtn.click();
            }
            closeSettingsPanel();
        },
        'mobileLangZhBtn': () => {
            const langBtn = document.getElementById('langBtn');
            if (langBtn) {
                const zhBtn = langBtn.parentElement.querySelector('[data-lang="zh"]');
                if (zhBtn) zhBtn.click();
            }
            closeSettingsPanel();
        },
        'mobileLayoutBtn': 'layoutBtn',
        'mobileFullscreenBtn': 'fullscreenBtn',
        'mobileThemeBtn': 'themeBtn',
        'mobileHelpBtn': 'helpBtn',
        'mobileExportPdfDefaultBtn': 'exportPdfDefaultBtn',
        'mobileExportPdfFullPageBtn': 'exportPdfFullPageBtn',
        'mobileExportPdfBtn': 'exportPdfBtn',
        'mobileExportHtmlBtn': 'exportHtmlBtn',
        'mobileCopyMdBtn': 'copyMdBtn',
        'mobileCopyHtmlBtn': 'copyHtmlBtn',
        'mobileClearBtn': 'clearBtn'
    };
    
    Object.entries(settingsButtonMappings).forEach(([mobileId, originalIdOrHandler]) => {
        const mobileBtn = document.getElementById(mobileId);
        if (!mobileBtn) return;
        
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (typeof originalIdOrHandler === 'function') {
                originalIdOrHandler();
            } else {
                const originalBtn = document.getElementById(originalIdOrHandler);
                if (originalBtn) {
                    originalBtn.click();
                    closeSettingsPanel();
                }
            }
        });
    });
}
