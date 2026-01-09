/**
 * 中文翻译
 */

export default {
    ui: {
        toolbar: {
            new: '新建',
            open: '打开',
            save: '保存',
            bold: '加粗',
            italic: '斜体',
            heading: '标题',
            link: '链接',
            image: '图片',
            code: '代码',
            table: '表格',
            mermaid: 'Mermaid',
            math: '公式',
            help: '快捷键和帮助',
            layout: '切换布局',
            fullscreen: '切换全屏',
            theme: '切换主题',
            more: '更多',
            exportPdfDefault: '导出 PDF（默认）',
            exportPdfFullPage: '导出 PDF（整张）',
            exportPdfSmart: '导出 PDF（智能分页）🚧',
            exportHtml: '导出 HTML',
            copyMd: '复制 Markdown',
            copyHtml: '复制 HTML',
            clear: '清空内容'
        },
        mobileToolbar: {
            title: '工具栏',
            close: '关闭',
            fabLabel: '工具栏菜单',
            sections: {
                files: '文件操作',
                formatting: '格式化',
                charts: '图表与公式'
            }
        },
        mobileSettings: {
            title: '设置',
            sections: {
                language: '语言',
                view: '视图',
                actions: '操作',
                more: '更多'
            }
        },
        statusbar: {
            ready: '就绪',
            characters: '{{count}} 字符',
            words: '{{count}} 词',
            lines: '{{count}} 行',
            readTime: '预计阅读 {{minutes}} 分钟'
        },
        editor: {
            placeholder: `# 欢迎使用 MarkX！

现代化的 Markdown 编辑器，支持 **Mermaid 图表** 和 **KaTeX 数学公式**！

## 特色功能

- 实时预览
- Mermaid 图表支持
- KaTeX 数学公式
- 代码高亮
- 暗色/亮色主题
- 文件导入导出
- 自动保存草稿

---

## 📊 Mermaid 图表示例

点击工具栏的「图表」按钮快速插入模板！

\`\`\`mermaid
graph TD
    A[开始] --> B{是否喜欢?}
    B -->|是| C[太棒了!]
    B -->|否| D[试试其他功能]
    C --> E[分享给朋友]
    D --> E
\`\`\`

---

## 🧮 数学公式示例

点击工具栏的「公式」按钮快速插入模板！

**行内公式**：质能方程 $E = mc^2$，勾股定理 $a^2 + b^2 = c^2$

**块级公式**：

$$
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$

$$
\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}
$$

---

试试编辑内容，右侧会实时更新！🚀`
        },
        help: {
            title: '快捷键与自动完成',
            close: '关闭 (ESC)',
            sections: {
                shortcuts: {
                    title: '编辑器快捷键',
                    items: {
                        save: '保存文件',
                        open: '打开文件',
                        new: '新建文档',
                        bold: '加粗文本',
                        italic: '斜体文本',
                        link: '插入链接'
                    }
                },
                autocompleteShortcuts: {
                    title: '自动完成快捷键',
                    items: {
                        manualTrigger: {
                            title: '手动触发',
                            desc: '在任何位置手动触发自动完成菜单。在代码块或引用块内编辑时，底部状态栏会显示提示。'
                        },
                        navigate: {
                            title: '导航选择',
                            desc: '在自动完成菜单中上下移动选择项'
                        },
                        confirm: {
                            title: '确认选择',
                            desc: '确认当前选中的自动完成项并插入'
                        },
                        jumpPlaceholder: {
                            title: '跳转占位符',
                            desc: '跳转到模板中的下一个占位符位置'
                        },
                        closeMenu: {
                            title: '关闭菜单',
                            desc: '关闭自动完成菜单，取消当前操作'
                        }
                    }
                },
                autocompleteFeatures: {
                    title: '自动完成功能',
                    items: {
                        smartTrigger: {
                            title: '智能触发',
                            desc: '输入 Markdown 关键词或特殊字符（<code>#</code>、<code>*</code>、<code>[</code>、<code>`</code> 等）时自动显示相关模板。也可以输入关键词（如"标题"、"表格"、"代码"）来搜索模板。'
                        },
                        manualTrigger: {
                            title: '手动唤起',
                            desc: '按 <kbd>Ctrl+E</kbd>（Mac: <kbd>Cmd+E</kbd>）可随时手动触发自动完成菜单，查看所有可用模板。'
                        },
                        contextAware: {
                            title: '上下文感知',
                            desc: '在代码块或引用块内编辑时，自动过滤只显示相关选项。状态栏会显示提示信息。'
                        }
                    }
                },
                templates: {
                    title: '支持的模板',
                    searchPlaceholder: '搜索模板关键词或说明...',
                    searchResult: '找到 {{count}} 个匹配项',
                    searchNoResult: '未找到匹配的模板',
                    usage: '使用方法：输入上述关键词或对应的中文描述（如"标题"、"表格"、"代码"）即可快速找到相关模板。选择模板后，使用 <kbd>Tab</kbd> 键在占位符之间跳转，<kbd>Enter</kbd> 确认插入。',
                    categories: {
                        basic: {
                            title: '基础语法',
                            desc: '标题、文本格式、链接和图片等基础 Markdown 语法'
                        },
                        list: {
                            title: '列表',
                            desc: '有序列表、无序列表和任务列表'
                        },
                        table: {
                            title: '表格',
                            desc: '各种列数和对齐方式的表格'
                        },
                        code: {
                            title: '代码块',
                            desc: '支持多种编程语言的代码块模板'
                        },
                        mermaid: {
                            title: 'Mermaid 图表',
                            desc: '流程图、时序图、甘特图等可视化图表'
                        },
                        math: {
                            title: '数学公式',
                            desc: '行内公式、块级公式和常用数学符号'
                        },
                        other: {
                            title: '其他',
                            desc: '引用块、分隔线、脚注和常用模板'
                        }
                    },
                    items: {
                        'h1-h6': '标题（一级到六级）',
                        bold: '加粗文本',
                        italic: '斜体文本',
                        'code-inline': '行内代码',
                        link: '链接',
                        image: '图片',
                        ul: '无序列表（使用 -、* 或 +）',
                        ol: '有序列表（数字编号）',
                        task: '任务列表（复选框）',
                        'nested-ul': '嵌套无序列表',
                        'nested-ol': '嵌套有序列表',
                        table: '3列表格',
                        'table-2col': '2列表格',
                        'table-4col': '4列表格',
                        'table-left': '左对齐表格',
                        'table-right': '右对齐表格',
                        'table-center': '居中对齐表格',
                        'code-block': '通用代码块（可指定语言）',
                        'code-js': 'JavaScript 代码块',
                        'code-python': 'Python 代码块',
                        'code-java': 'Java 代码块',
                        'code-cpp': 'C++ 代码块',
                        'code-css': 'CSS 代码块',
                        'code-html': 'HTML 代码块',
                        'code-json': 'JSON 代码块',
                        'code-sql': 'SQL 代码块',
                        'code-bash': 'Bash/Shell 代码块',
                        'code-go': 'Go 代码块',
                        'code-rust': 'Rust 代码块',
                        'code-yaml': 'YAML 代码块',
                        'mermaid-flowchart': '流程图（垂直方向）',
                        'mermaid-sequence': '时序图',
                        'mermaid-gantt': '甘特图（项目时间线）',
                        'mermaid-class': '类图（UML）',
                        'mermaid-state': '状态图',
                        'mermaid-pie': '饼图',
                        'mermaid-gitgraph': 'Git 分支图',
                        'mermaid-er': 'ER 图（实体关系图）',
                        'math-inline': '行内公式（$...$）',
                        'math-block': '块级公式（$$...$$）',
                        'math-fraction': '分数',
                        'math-sqrt': '平方根',
                        'math-sum': '求和符号',
                        'math-integral': '积分',
                        'math-matrix': '矩阵',
                        'math-equation': '对齐公式组',
                        blockquote: '引用块',
                        hr: '分隔线',
                        footnote: '脚注',
                        'html-div': 'HTML div 标签',
                        'html-table': 'HTML 表格',
                        'template-readme': 'README 模板',
                        'template-changelog': '更新日志模板'
                    }
                }
            },
            footer: {
                macNote: 'Mac 用户：将 <kbd>Ctrl</kbd> 替换为 <kbd>Cmd</kbd>'
            }
        }
    },
    file: {
        new: '新建文档',
        newConfirm: '当前文档未保存，确定要新建吗？',
        open: '打开文件',
        opened: '已打开 {{filename}}',
        save: '保存文件',
        savePrompt: '请输入文件名（无需输入 .md 扩展名）：',
        saved: '已保存 {{filename}}',
        readError: '文件读取失败',
        saveError: '文件保存失败'
    },
    autocomplete: {
        hint: {
            inCodeBlock: '💡 在 {{language}} 代码块内编辑，按 <kbd>{{shortcut}}</kbd> 手动触发自动完成',
            inCodeBlockNoLang: '💡 在代码块内编辑，按 <kbd>{{shortcut}}</kbd> 手动触发自动完成',
            inBlockquote: '💡 在引用块内编辑，按 <kbd>{{shortcut}}</kbd> 手动触发自动完成'
        },
        placeholders: {
            heading: '标题',
            text: '文本',
            code: '代码',
            linkText: '链接文本',
            imageDesc: '图片描述',
            title: '标题',
            listItem: '列表项',
            taskItem: '任务项',
            subItem: '子项',
            language: 'language',
            column1: '列1',
            column2: '列2',
            column3: '列3',
            column4: '列4',
            cell1: '单元格1',
            cell2: '单元格2',
            cell3: '单元格3',
            cell4: '单元格4',
            leftAlign: '左对齐',
            rightAlign: '右对齐',
            center: '居中',
            quoteContent: '引用内容',
            moreContent: '更多内容',
            nestedQuote: '嵌套引用',
            author: '作者',
            start: '开始',
            condition: '判断条件',
            yes: '是',
            no: '否',
            action1: '执行操作1',
            action2: '执行操作2',
            end: '结束',
            middle: '中间',
            user: '用户',
            system: '系统',
            database: '数据库',
            sendRequest: '发送请求',
            queryData: '查询数据',
            returnResult: '返回结果',
            responseData: '响应数据',
            projectTimeline: '项目时间线',
            phase1: '阶段一',
            phase2: '阶段二',
            requirementAnalysis: '需求分析',
            designPlan: '设计方案',
            development: '开发实现',
            testOptimize: '测试优化',
            pending: '待处理',
            processing: '处理中',
            completed: '已完成',
            failed: '失败',
            startProcess: '开始处理',
            processSuccess: '处理成功',
            processFailed: '处理失败',
            retry: '重试',
            pieTitle: '饼图标题',
            label1: '标签1',
            label2: '标签2',
            label3: '标签3',
            value1: '30',
            value2: '20',
            value3: '50',
            initialCommit: '初始提交',
            develop: 'develop',
            featureDev: '功能开发',
            userJourney: '用户旅程',
            step1: '步骤1',
            step2: '步骤2',
            step3: '步骤3',
            systemContext: '系统上下文图',
            content: '内容',
            description: '描述',
            width: '300',
            strongText: '加粗文本',
            emText: '斜体文本',
            preText: '预格式化文本',
            summary: '摘要',
            details: '详细内容',
            comment: '注释',
            footnote: '1',
            footnoteContent: '脚注内容',
            term: '术语',
            definition: '定义内容',
            projectName: '项目名称',
            projectDesc: '项目描述',
            feature1: '特性1',
            feature2: '特性2',
            installCmd: '安装命令',
            usage: '使用说明',
            license: 'MIT License',
            version: '1.0.0',
            date: '2024-01-01',
            newFeature: '新功能',
            change: '变更内容',
            fix: '修复内容',
            describeChange: '描述本次 PR 的变更内容',
            testDesc: '测试说明',
            subscript: '下标',
            superscript: '上标',
            highlight: '高亮文本',
            reference: '引用',
            email: 'email@example.com',
            url: 'https://example.com',
            imageUrl: 'https://example.com/image.jpg',
            size: '300x200',
            deleteLine: '删除的行',
            addLine: '添加的行',
            plainText: '纯文本',
            markdownContent: 'Markdown 内容',
            yamlConfig: 'YAML 配置',
            tomlConfig: 'TOML 配置',
            cCode: '// 代码',
            pythonCode: '# 代码',
            sqlQuery: '-- SQL 查询',
            goCode: '// Go 代码',
            rustCode: '// Rust 代码',
            phpCode: '<?php\n// PHP 代码\n?>',
            rubyCode: '# Ruby 代码',
            swiftCode: '// Swift 代码',
            kotlinCode: '// Kotlin 代码',
            dartCode: '// Dart 代码',
            cssStyle: '/* 样式 */',
            htmlComment: '<!-- HTML -->',
            xmlComment: '<!-- XML -->',
            bashCmd: '# 命令',
            result: '结果',
            tableHeader: '表头'
        },
        meta: {
            h1Alt: '一级标题（下划线）',
            h2Alt: '二级标题（下划线）',
            italicAlt: '斜体（下划线）',
            boldItalic: '加粗斜体',
            boldItalicAlt: '加粗斜体（下划线）',
            strikethrough: '删除线',
            mark: '高亮标记',
            subscript: '下标',
            superscript: '上标',
            linkTitle: '带标题的链接',
            imageTitle: '带标题的图片',
            imageSize: '指定尺寸的图片',
            referenceLink: '引用链接',
            referenceImage: '引用图片',
            autoLink: '自动链接',
            emailLink: '邮箱链接',
            linkRefDef: '链接引用定义',
            ulStar: '无序列表（*）',
            ulPlus: '无序列表（+）',
            taskDone: '任务列表（已完成）',
            mixedList: '混合列表',
            codeNoLang: '代码块（无语言）',
            blockquoteMulti: '多行引用',
            blockquoteNested: '嵌套引用',
            blockquoteWithAuthor: '带作者的引用',
            hrStar: '分隔线（三个星号）',
            hrUnderscore: '分隔线（三个下划线）',
            hrLong: '分隔线（四个减号）',
            mermaidFlowchartLr: 'Mermaid 横向流程图',
            mermaidEr: 'Mermaid ER 图',
            mermaidPie: 'Mermaid 饼图',
            mermaidGitgraph: 'Mermaid Git 图',
            mermaidJourney: 'Mermaid 用户旅程图',
            mermaidC4: 'Mermaid C4 图',
            mathNthRoot: 'n次根',
            mathProduct: '连乘',
            mathDoubleIntegral: '二重积分',
            mathDerivative: '导数',
            mathPartial: '偏导数',
            mathDeterminant: '行列式',
            mathVector: '向量',
            mathNorm: '范数',
            mathSet: '集合',
            mathSetOperations: '集合运算',
            mathBinomial: '二项式系数',
            mathEquation: '对齐公式',
            mathCases: '分段函数',
            htmlSpan: 'HTML span',
            htmlP: 'HTML 段落',
            htmlBr: 'HTML 换行',
            htmlHr: 'HTML 分隔线',
            htmlImg: 'HTML 图片',
            htmlA: 'HTML 链接',
            htmlStrong: 'HTML 加粗',
            htmlEm: 'HTML 斜体',
            htmlCode: 'HTML 代码',
            htmlPre: 'HTML 预格式化',
            htmlBlockquote: 'HTML 引用',
            htmlUl: 'HTML 无序列表',
            htmlOl: 'HTML 有序列表',
            htmlDetails: 'HTML 折叠',
            htmlComment: 'HTML 注释',
            footnote: '脚注引用',
            footnoteDef: '脚注定义',
            definitionList: '定义列表',
            toc: '目录（自动生成）',
            tocAlt: '目录注释',
            abbr: '缩写定义',
            abbrUse: '使用缩写',
            kbd: '键盘按键',
            emoji: 'Emoji（如果支持）',
            templateIssue: 'Issue 模板',
            templatePr: 'PR 模板',
            codeText: '纯文本',
            mixedTable: '混合对齐表格',
            markText: '高亮文本'
        },
        templates: {
            pr: {
                changeTitle: '变更说明',
                changeDesc: '${placeholder}',
                changeType: '变更类型',
                bugFix: 'Bug 修复',
                newFeature: '新功能',
                docUpdate: '文档更新',
                refactor: '重构',
                test: '测试'
            },
            readme: {
                title: '项目名称',
                desc: '项目描述',
                features: '功能特性',
                feature1: '特性1',
                feature2: '特性2',
                install: '安装',
                installCmd: '安装命令',
                usage: '使用',
                usageDesc: '使用说明',
                license: '许可证'
            },
            changelog: {
                version: '1.0.0',
                date: '2024-01-01',
                added: '新功能',
                changed: '变更内容',
                fixed: '修复内容'
            },
            issue: {
                problemDesc: '问题描述',
                describeProblem: '详细描述问题',
                steps: '复现步骤',
                step1: '步骤1',
                step2: '步骤2',
                expected: '预期行为',
                expectedResult: '预期结果',
                actual: '实际行为',
                actualResult: '实际结果'
            }
        }
    },
    toolbar: {
        newTooltip: '新建文档 (Ctrl+N)',
        openTooltip: '打开文件 (Ctrl+O)',
        saveTooltip: '保存文件 (Ctrl+S)',
        boldTooltip: '加粗 (Ctrl+B)',
        italicTooltip: '斜体 (Ctrl+I)',
        headingTooltip: '标题',
        linkTooltip: '链接 (Ctrl+K)',
        imageTooltip: '图片',
        codeTooltip: '代码块',
        tableTooltip: '表格',
        mermaidTooltip: 'Mermaid 图表',
        mermaidChart: '图表',
        mathTooltip: '数学公式 (KaTeX)',
        mathFormula: '公式',
        mermaidTypes: {
            flowchart: '流程图',
            sequence: '时序图',
            gantt: '甘特图',
            class: '类图',
            state: '状态图'
        },
        mathTypes: {
            inline: '行内公式 $x$',
            block: '块级公式 $$x$$',
            fraction: '分数 $\\frac{a}{b}$',
            sqrt: '根号 $\\sqrt{x}$',
            sum: '求和 $\\sum$',
            integral: '积分 $\\int$',
            limit: '极限 $\\lim$',
            matrix: '矩阵'
        }
    },
    messages: {
        insertedTemplate: '已插入{{name}}模板',
        insertedMath: '已插入{{name}}',
        startupSuccess: 'MarkX 启动成功！',
        startupFailed: '启动失败',
        ready: '就绪',
        previewUpdated: '预览已更新',
        renderFailed: '渲染失败',
        mermaidRenderFailed: 'Mermaid 图表渲染失败',
        echartsRenderFailed: 'ECharts 图表渲染失败',
        chartNotFound: '操作失败：找不到图表 ❌',
        chartResized: '图表已调整大小',
        resizeChartTooltip: '调整图表大小',
        exportingSvg: '正在导出 SVG...',
        svgExportSuccess: 'SVG 导出成功 ✅',
        svgExportFailed: 'SVG 导出失败 ❌',
        exportingPng: '正在导出 PNG...',
        pngExportSuccess: 'PNG 导出成功 ✅',
        pngExportFailed: 'PNG 导出失败 ❌',
        pngConvertFailed: 'PNG 转换失败 ❌',
        pngExportTimeout: 'PNG 导出超时 ⏱️ 请重试或使用 SVG 格式',
        pngExportTimeoutDetails: 'PNG 导出超时\n\n可能原因：\n1. 图表太大或太复杂\n2. 浏览器性能限制\n\n建议：\n• 再次点击重试\n• 或使用 SVG 格式导出',
        pngExportFailedSuggestSvg: 'PNG 导出失败 ❌ 建议使用 SVG 格式',
        pngExportFailedConfirm: 'PNG 导出失败\n\n建议改用 SVG 格式导出（矢量图，质量更好）\n\n是否立即导出为 SVG？',
        pngExportFailedDetails: 'PNG 导出失败\n\n错误信息：{{message}}\n\n可能的解决方案：\n1. 刷新页面后重试\n2. 使用 SVG 格式导出\n3. 尝试缩小图表大小\n4. 使用其他浏览器\n\n如果问题持续，请打开浏览器控制台（F12）查看详细日志。',
        mermaidViewerTitle: 'Mermaid 图表查看器',
        echartsViewerTitle: 'ECharts 图表查看器',
        fullscreenOpened: '已打开全屏查看器',
        fullscreenClosed: '已关闭全屏查看器',
        fullscreenEntered: '已进入全屏模式',
        fullscreenExited: '已退出全屏模式',
        fullscreenFailed: '进入全屏失败',
        fullscreenNotSupported: '此浏览器不支持全屏',
        exportSvgTooltip: '导出为 SVG 矢量图（推荐）',
        exportPngTooltip: '导出为 PNG 图片（高清 2x）',
        fullscreenViewTooltip: '全屏查看（支持缩放和拖拽）',
        htmlExported: '已导出 HTML',
        markdownCopied: 'Markdown 已复制到剪贴板',
        htmlCopied: 'HTML 已复制到剪贴板',
        copyFailed: '复制失败',
        contentCleared: '已清空内容',
        pdfExportSuccess: 'PDF 导出成功',
        pdfExportSuccessDefault: 'PDF 导出成功（默认模式）',
        pdfExportSuccessFullPage: 'PDF 导出成功（整张模式）',
        pdfExportFailed: 'PDF 导出失败：{{error}}',
        pdfLibNotLoaded: 'PDF 导出库未加载，请刷新页面重试',
        generatingPdf: '正在生成 PDF，请稍候...',
        generatingPdfDefault: '正在生成 PDF（默认模式），请稍候...',
        generatingPdfFullPage: '正在生成 PDF（整张模式），请稍候...',
        unknownError: '未知错误',
        draftSaved: '草稿已保存',
        draftRestored: '已恢复草稿',
        draftAutoRestored: '已自动恢复草稿',
        themeSwitched: '已切换到{{theme}}模式',
        themeDark: '暗色',
        themeLight: '亮色',
        clearConfirm: '确定要清空所有内容吗？此操作不可恢复。'
    },
    draft: {
        foundTitle: '发现未保存的草稿',
        lastEditTime: '上次编辑时间：{{time}}',
        rememberChoice: '记住我的选择',
        ignore: '忽略',
        restore: '恢复草稿'
    },
    insertText: {
        bold: '加粗文本',
        italic: '斜体文本',
        heading: '标题',
        link: '链接文本',
        image: '图片描述',
        code: '代码',
        table: '| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| 单元格1 | 单元格2 | 单元格3 |\n\n'
    },
    meta: {
        title: 'MarkX - 专业 Markdown + Mermaid + KaTeX 编辑器',
        description: '专业的 Markdown 编辑器，完美支持 Mermaid 图表和 KaTeX 数学公式渲染。现代化、开箱即用、功能强大。',
        keywords: 'markdown, mermaid, katex, 数学公式, editor, 编辑器, 在线编辑器, markdown editor, math formula'
    }
};
