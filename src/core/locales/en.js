/**
 * English translations
 */

export default {
    ui: {
        toolbar: {
            new: 'New',
            open: 'Open',
            save: 'Save',
            help: 'Shortcuts & Help',
            layout: 'Toggle Layout',
            theme: 'Toggle Theme',
            more: 'More',
            exportPdfDefault: 'Export PDF (Default)',
            exportPdfFullPage: 'Export PDF (Full Page)',
            exportPdfSmart: 'Export PDF (Smart Pagination) 🚧',
            exportHtml: 'Export HTML',
            copyMd: 'Copy Markdown',
            copyHtml: 'Copy HTML',
            clear: 'Clear Content'
        },
        statusbar: {
            ready: 'Ready',
            characters: '{{count}} characters',
            words: '{{count}} words',
            lines: '{{count}} lines',
            readTime: 'Estimated {{minutes}} min read'
        },
        editor: {
            placeholder: `# Welcome to MarkX!

A modern Markdown editor with **Mermaid Charts** and **KaTeX Math** support!

## ✨ Features

- ✅ Live Preview
- ✅ Mermaid Chart Support
- ✅ KaTeX Math Formulas
- ✅ Code Highlighting
- ✅ Dark/Light Theme
- ✅ File Import/Export
- ✅ Auto-save Drafts

---

## 📊 Mermaid Chart Example

Click the "Chart" button in the toolbar to quickly insert templates!

\`\`\`mermaid
graph TD
    A[Start] --> B{Do you like it?}
    B -->|Yes| C[Awesome!]
    B -->|No| D[Try other features]
    C --> E[Share with friends]
    D --> E
\`\`\`

---

## 🧮 Math Formula Example

Click the "Formula" button in the toolbar to quickly insert templates!

**Inline formula**: Mass-energy equivalence $E = mc^2$, Pythagorean theorem $a^2 + b^2 = c^2$

**Block formula**:

$$
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$

$$
\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}
$$

---

Try editing the content, and the right side will update in real-time! 🚀`
        },
        help: {
            title: 'Shortcuts & Autocomplete',
            close: 'Close (ESC)',
            sections: {
                shortcuts: {
                    title: 'Editor Shortcuts',
                    items: {
                        save: 'Save File',
                        open: 'Open File',
                        new: 'New Document',
                        bold: 'Bold Text',
                        italic: 'Italic Text',
                        link: 'Insert Link'
                    }
                },
                autocompleteShortcuts: {
                    title: 'Autocomplete Shortcuts',
                    items: {
                        manualTrigger: {
                            title: 'Manual Trigger',
                            desc: 'Manually trigger the autocomplete menu anywhere. When editing within a code block or quote block, a prompt will be displayed in the bottom status bar.'
                        },
                        navigate: {
                            title: 'Navigate Selection',
                            desc: 'Move up and down selection items in the autocomplete menu'
                        },
                        confirm: {
                            title: 'Confirm Selection',
                            desc: 'Confirm the currently selected autocomplete item and insert it'
                        },
                        jumpPlaceholder: {
                            title: 'Jump Placeholder',
                            desc: 'Jump to the next placeholder position in the template'
                        },
                        closeMenu: {
                            title: 'Close Menu',
                            desc: 'Close the autocomplete menu, cancel current operation'
                        }
                    }
                },
                autocompleteFeatures: {
                    title: 'Autocomplete Features',
                    items: {
                        smartTrigger: {
                            title: 'Smart Trigger',
                            desc: 'Automatically display related templates when entering Markdown keywords or special characters (<code>#</code>, <code>*</code>, <code>[</code>, <code>`</code>, etc.). You can also enter keywords (such as "title", "table", "code") to search for templates.'
                        },
                        manualTrigger: {
                            title: 'Manual Trigger',
                            desc: 'Press <kbd>Ctrl+E</kbd> (Mac: <kbd>Cmd+E</kbd>) to manually trigger the autocomplete menu at any time to view all available templates.'
                        },
                        contextAware: {
                            title: 'Context Aware',
                            desc: 'When editing within a code block or quote block, automatically filter to show only relevant options. The status bar will display prompt information.'
                        }
                    }
                },
                templates: {
                    title: 'Supported Templates',
                    searchPlaceholder: 'Search template keywords or descriptions...',
                    searchResult: 'Found {{count}} matches',
                    searchNoResult: 'No matching templates found',
                    usage: 'Usage: Enter the keywords above or corresponding Chinese descriptions (such as "title", "table", "code") to quickly find related templates. After selecting a template, use <kbd>Tab</kbd> to jump between placeholders, and <kbd>Enter</kbd> to confirm insertion.',
                    categories: {
                        basic: {
                            title: 'Basic Syntax',
                            desc: 'Titles, text formatting, links and images, and other basic Markdown syntax'
                        },
                        list: {
                            title: 'Lists',
                            desc: 'Ordered lists, unordered lists, and task lists'
                        },
                        table: {
                            title: 'Tables',
                            desc: 'Tables with various column counts and alignment options'
                        },
                        code: {
                            title: 'Code Blocks',
                            desc: 'Code block templates supporting multiple programming languages'
                        },
                        mermaid: {
                            title: 'Mermaid Charts',
                            desc: 'Flowcharts, sequence diagrams, Gantt charts and other visual charts'
                        },
                        math: {
                            title: 'Math Formulas',
                            desc: 'Inline formulas, block-level formulas and common mathematical symbols'
                        },
                        other: {
                            title: 'Others',
                            desc: 'Quote blocks, separators, footnotes and common templates'
                        }
                    },
                    items: {
                        'h1-h6': 'Titles (Level 1 to 6)',
                        bold: 'Bold Text',
                        italic: 'Italic Text',
                        'code-inline': 'Inline Code',
                        link: 'Link',
                        image: 'Image',
                        ul: 'Unordered List (using -, *, or +)',
                        ol: 'Ordered List (numbered)',
                        task: 'Task List (checkbox)',
                        'nested-ul': 'Nested Unordered List',
                        'nested-ol': 'Nested Ordered List',
                        table: '3-Column Table',
                        'table-2col': '2-Column Table',
                        'table-4col': '4-Column Table',
                        'table-left': 'Left-Aligned Table',
                        'table-right': 'Right-Aligned Table',
                        'table-center': 'Center-Aligned Table',
                        'code-block': 'Generic Code Block (language can be specified)',
                        'code-js': 'JavaScript Code Block',
                        'code-python': 'Python Code Block',
                        'code-java': 'Java Code Block',
                        'code-cpp': 'C++ Code Block',
                        'code-css': 'CSS Code Block',
                        'code-html': 'HTML Code Block',
                        'code-json': 'JSON Code Block',
                        'code-sql': 'SQL Code Block',
                        'code-bash': 'Bash/Shell Code Block',
                        'code-go': 'Go Code Block',
                        'code-rust': 'Rust Code Block',
                        'code-yaml': 'YAML Code Block',
                        'mermaid-flowchart': 'Flowchart (vertical direction)',
                        'mermaid-sequence': 'Sequence Diagram',
                        'mermaid-gantt': 'Gantt Chart (project timeline)',
                        'mermaid-class': 'Class Diagram (UML)',
                        'mermaid-state': 'State Diagram',
                        'mermaid-pie': 'Pie Chart',
                        'mermaid-gitgraph': 'Git Branch Diagram',
                        'mermaid-er': 'ER Diagram (Entity Relationship)',
                        'math-inline': 'Inline Formula ($...$)',
                        'math-block': 'Block-Level Formula ($$...$$)',
                        'math-fraction': 'Fraction',
                        'math-sqrt': 'Square Root',
                        'math-sum': 'Summation Symbol',
                        'math-integral': 'Integral',
                        'math-matrix': 'Matrix',
                        'math-equation': 'Aligned Equation Group',
                        blockquote: 'Quote Block',
                        hr: 'Separator',
                        footnote: 'Footnote',
                        'html-div': 'HTML div Tag',
                        'html-table': 'HTML Table',
                        'template-readme': 'README Template',
                        'template-changelog': 'Changelog Template'
                    }
                }
            },
            footer: {
                macNote: 'Mac users: Replace <kbd>Ctrl</kbd> with <kbd>Cmd</kbd>'
            }
        }
    },
    file: {
        new: 'New Document',
        newConfirm: 'Current document is not saved. Are you sure you want to create a new one?',
        open: 'Open File',
        opened: 'Opened {{filename}}',
        save: 'Save File',
        savePrompt: 'Enter filename (no need to enter .md extension):',
        saved: 'Saved {{filename}}',
        readError: 'Failed to read file',
        saveError: 'Failed to save file'
    },
    autocomplete: {
        hint: {
            inCodeBlock: '💡 Editing in {{language}} code block, press <kbd>{{shortcut}}</kbd> to manually trigger autocomplete',
            inCodeBlockNoLang: '💡 Editing in code block, press <kbd>{{shortcut}}</kbd> to manually trigger autocomplete',
            inBlockquote: '💡 Editing in quote block, press <kbd>{{shortcut}}</kbd> to manually trigger autocomplete'
        },
        placeholders: {
            heading: 'Heading',
            text: 'Text',
            code: 'Code',
            linkText: 'Link Text',
            imageDesc: 'Image Description',
            title: 'Title',
            listItem: 'List Item',
            taskItem: 'Task Item',
            subItem: 'Sub Item',
            language: 'language',
            column1: 'Column1',
            column2: 'Column2',
            column3: 'Column3',
            column4: 'Column4',
            cell1: 'Cell1',
            cell2: 'Cell2',
            cell3: 'Cell3',
            cell4: 'Cell4',
            leftAlign: 'Left Align',
            rightAlign: 'Right Align',
            center: 'Center',
            quoteContent: 'Quote Content',
            moreContent: 'More Content',
            nestedQuote: 'Nested Quote',
            author: 'Author',
            start: 'Start',
            condition: 'Condition',
            yes: 'Yes',
            no: 'No',
            action1: 'Action 1',
            action2: 'Action 2',
            end: 'End',
            middle: 'Middle',
            user: 'User',
            system: 'System',
            database: 'Database',
            sendRequest: 'Send Request',
            queryData: 'Query Data',
            returnResult: 'Return Result',
            responseData: 'Response Data',
            projectTimeline: 'Project Timeline',
            phase1: 'Phase 1',
            phase2: 'Phase 2',
            requirementAnalysis: 'Requirement Analysis',
            designPlan: 'Design Plan',
            development: 'Development',
            testOptimize: 'Test & Optimize',
            pending: 'Pending',
            processing: 'Processing',
            completed: 'Completed',
            failed: 'Failed',
            startProcess: 'Start Process',
            processSuccess: 'Process Success',
            processFailed: 'Process Failed',
            retry: 'Retry',
            pieTitle: 'Pie Chart Title',
            label1: 'Label 1',
            label2: 'Label 2',
            label3: 'Label 3',
            value1: '30',
            value2: '20',
            value3: '50',
            initialCommit: 'Initial Commit',
            develop: 'develop',
            featureDev: 'Feature Development',
            userJourney: 'User Journey',
            step1: 'Step 1',
            step2: 'Step 2',
            step3: 'Step 3',
            systemContext: 'System Context',
            content: 'Content',
            description: 'Description',
            width: '300',
            strongText: 'Bold Text',
            emText: 'Italic Text',
            preText: 'Preformatted Text',
            summary: 'Summary',
            details: 'Details',
            comment: 'Comment',
            footnote: '1',
            footnoteContent: 'Footnote Content',
            term: 'Term',
            definition: 'Definition',
            projectName: 'Project Name',
            projectDesc: 'Project Description',
            feature1: 'Feature 1',
            feature2: 'Feature 2',
            installCmd: 'Install Command',
            usage: 'Usage Instructions',
            license: 'MIT License',
            version: '1.0.0',
            date: '2024-01-01',
            newFeature: 'New Feature',
            change: 'Change',
            fix: 'Fix',
            describeChange: 'Describe PR Changes',
            testDesc: 'Test Description',
            subscript: 'Subscript',
            superscript: 'Superscript',
            highlight: 'Highlight Text',
            reference: 'Reference',
            email: 'email@example.com',
            url: 'https://example.com',
            imageUrl: 'https://example.com/image.jpg',
            size: '300x200',
            deleteLine: 'Deleted Line',
            addLine: 'Added Line',
            plainText: 'Plain Text',
            markdownContent: 'Markdown Content',
            yamlConfig: 'YAML Config',
            tomlConfig: 'TOML Config',
            cCode: '// Code',
            pythonCode: '# Code',
            sqlQuery: '-- SQL Query',
            goCode: '// Go Code',
            rustCode: '// Rust Code',
            phpCode: '<?php\n// PHP Code\n?>',
            rubyCode: '# Ruby Code',
            swiftCode: '// Swift Code',
            kotlinCode: '// Kotlin Code',
            dartCode: '// Dart Code',
            cssStyle: '/* Style */',
            htmlComment: '<!-- HTML -->',
            xmlComment: '<!-- XML -->',
            bashCmd: '# Command',
            result: 'result',
            tableHeader: 'Header'
        },
        meta: {
            h1Alt: 'Level 1 Heading (Underline)',
            h2Alt: 'Level 2 Heading (Underline)',
            italicAlt: 'Italic (Underscore)',
            boldItalic: 'Bold Italic',
            boldItalicAlt: 'Bold Italic (Underscore)',
            strikethrough: 'Strikethrough',
            mark: 'Highlight Mark',
            subscript: 'Subscript',
            superscript: 'Superscript',
            linkTitle: 'Link with Title',
            imageTitle: 'Image with Title',
            imageSize: 'Image with Size',
            referenceLink: 'Reference Link',
            referenceImage: 'Reference Image',
            autoLink: 'Auto Link',
            emailLink: 'Email Link',
            linkRefDef: 'Link Reference Definition',
            ulStar: 'Unordered List (*)',
            ulPlus: 'Unordered List (+)',
            taskDone: 'Task List (Done)',
            mixedList: 'Mixed List',
            codeNoLang: 'Code Block (No Language)',
            blockquoteMulti: 'Multi-line Quote',
            blockquoteNested: 'Nested Quote',
            blockquoteWithAuthor: 'Quote with Author',
            hrStar: 'Separator (Three Asterisks)',
            hrUnderscore: 'Separator (Three Underscores)',
            hrLong: 'Separator (Four Dashes)',
            mermaidFlowchartLr: 'Mermaid Horizontal Flowchart',
            mermaidEr: 'Mermaid ER Diagram',
            mermaidPie: 'Mermaid Pie Chart',
            mermaidGitgraph: 'Mermaid Git Graph',
            mermaidJourney: 'Mermaid User Journey',
            mermaidC4: 'Mermaid C4 Diagram',
            mathNthRoot: 'nth Root',
            mathProduct: 'Product',
            mathDoubleIntegral: 'Double Integral',
            mathDerivative: 'Derivative',
            mathPartial: 'Partial Derivative',
            mathDeterminant: 'Determinant',
            mathVector: 'Vector',
            mathNorm: 'Norm',
            mathSet: 'Set',
            mathSetOperations: 'Set Operations',
            mathBinomial: 'Binomial Coefficient',
            mathEquation: 'Aligned Equation',
            mathCases: 'Piecewise Function',
            htmlSpan: 'HTML span',
            htmlP: 'HTML Paragraph',
            htmlBr: 'HTML Line Break',
            htmlHr: 'HTML Separator',
            htmlImg: 'HTML Image',
            htmlA: 'HTML Link',
            htmlStrong: 'HTML Bold',
            htmlEm: 'HTML Italic',
            htmlCode: 'HTML Code',
            htmlPre: 'HTML Preformatted',
            htmlBlockquote: 'HTML Quote',
            htmlUl: 'HTML Unordered List',
            htmlOl: 'HTML Ordered List',
            htmlDetails: 'HTML Collapse',
            htmlComment: 'HTML Comment',
            footnote: 'Footnote Reference',
            footnoteDef: 'Footnote Definition',
            definitionList: 'Definition List',
            toc: 'Table of Contents (Auto-generated)',
            tocAlt: 'TOC Comment',
            abbr: 'Abbreviation Definition',
            abbrUse: 'Use Abbreviation',
            kbd: 'Keyboard Key',
            emoji: 'Emoji (if supported)',
            templateIssue: 'Issue Template',
            templatePr: 'PR Template',
            codeText: 'Plain Text',
            mixedTable: 'Mixed Alignment Table',
            markText: 'Highlight Text'
        },
        templates: {
            pr: {
                changeTitle: 'Change Description',
                changeDesc: '${placeholder}',
                changeType: 'Change Type',
                bugFix: 'Bug Fix',
                newFeature: 'New Feature',
                docUpdate: 'Documentation Update',
                refactor: 'Refactor',
                test: 'Test'
            },
            readme: {
                title: 'Project Name',
                desc: 'Project Description',
                features: 'Features',
                feature1: 'Feature 1',
                feature2: 'Feature 2',
                install: 'Installation',
                installCmd: 'Install Command',
                usage: 'Usage',
                usageDesc: 'Usage Instructions',
                license: 'License'
            },
            changelog: {
                version: '1.0.0',
                date: '2024-01-01',
                added: 'New Feature',
                changed: 'Change',
                fixed: 'Fix'
            },
            issue: {
                problemDesc: 'Problem Description',
                describeProblem: 'Describe the problem in detail',
                steps: 'Reproduction Steps',
                step1: 'Step 1',
                step2: 'Step 2',
                expected: 'Expected Behavior',
                expectedResult: 'Expected Result',
                actual: 'Actual Behavior',
                actualResult: 'Actual Result'
            }
        }
    },
    toolbar: {
        newTooltip: 'New Document (Ctrl+N)',
        openTooltip: 'Open File (Ctrl+O)',
        saveTooltip: 'Save File (Ctrl+S)',
        boldTooltip: 'Bold (Ctrl+B)',
        italicTooltip: 'Italic (Ctrl+I)',
        headingTooltip: 'Heading',
        linkTooltip: 'Link (Ctrl+K)',
        imageTooltip: 'Image',
        codeTooltip: 'Code Block',
        tableTooltip: 'Table',
        mermaidTooltip: 'Mermaid Charts',
        mermaidChart: 'Chart',
        mathTooltip: 'Math Formula (KaTeX)',
        mathFormula: 'Formula',
        mermaidTypes: {
            flowchart: 'Flowchart',
            sequence: 'Sequence Diagram',
            gantt: 'Gantt Chart',
            class: 'Class Diagram',
            state: 'State Diagram'
        },
        mathTypes: {
            inline: 'Inline Formula $x$',
            block: 'Block Formula $$x$$',
            fraction: 'Fraction $\\frac{a}{b}$',
            sqrt: 'Square Root $\\sqrt{x}$',
            sum: 'Summation $\\sum$',
            integral: 'Integral $\\int$',
            limit: 'Limit $\\lim$',
            matrix: 'Matrix'
        }
    },
    messages: {
        insertedTemplate: 'Inserted {{name}} template',
        insertedMath: 'Inserted {{name}}',
        startupSuccess: 'MarkX started successfully!',
        startupFailed: 'Startup failed',
        ready: 'Ready',
        previewUpdated: 'Preview updated',
        renderFailed: 'Render failed',
        mermaidRenderFailed: 'Mermaid chart render failed',
        chartNotFound: 'Operation failed: Chart not found ❌',
        exportingSvg: 'Exporting SVG...',
        svgExportSuccess: 'SVG exported successfully ✅',
        svgExportFailed: 'SVG export failed ❌',
        exportingPng: 'Exporting PNG...',
        pngExportSuccess: 'PNG exported successfully ✅',
        pngExportFailed: 'PNG export failed ❌',
        pngConvertFailed: 'PNG conversion failed ❌',
        pngExportTimeout: 'PNG export timeout ⏱️ Please retry or use SVG format',
        pngExportTimeoutDetails: 'PNG export timeout\n\nPossible reasons:\n1. Chart too large or complex\n2. Browser performance limitations\n\nSuggestions:\n• Click again to retry\n• Or use SVG format export',
        pngExportFailedSuggestSvg: 'PNG export failed ❌ Suggest using SVG format',
        pngExportFailedConfirm: 'PNG export failed\n\nSuggest switching to SVG format export (vector graphics, better quality)\n\nExport as SVG now?',
        pngExportFailedDetails: 'PNG export failed\n\nError: {{message}}\n\nPossible solutions:\n1. Refresh the page and try again\n2. Use SVG format export\n3. Try reducing chart size\n4. Use another browser\n\nIf the problem persists, open browser console (F12) to view detailed logs.',
        mermaidViewerTitle: 'Mermaid Chart Viewer',
        fullscreenOpened: 'Fullscreen viewer opened',
        fullscreenClosed: 'Fullscreen viewer closed',
        exportSvgTooltip: 'Export as SVG (Recommended)',
        exportPngTooltip: 'Export as PNG (High Quality 2x)',
        fullscreenViewTooltip: 'Fullscreen View (Zoom & Drag)',
        htmlExported: 'HTML exported',
        markdownCopied: 'Markdown copied to clipboard',
        htmlCopied: 'HTML copied to clipboard',
        copyFailed: 'Copy failed',
        contentCleared: 'Content cleared',
        pdfExportSuccess: 'PDF exported successfully',
        pdfExportSuccessDefault: 'PDF exported successfully (default mode)',
        pdfExportSuccessFullPage: 'PDF exported successfully (full page mode)',
        pdfExportFailed: 'PDF export failed: {{error}}',
        pdfLibNotLoaded: 'PDF export library not loaded, please refresh the page and try again',
        generatingPdf: 'Generating PDF, please wait...',
        generatingPdfDefault: 'Generating PDF (default mode), please wait...',
        generatingPdfFullPage: 'Generating PDF (full page mode), please wait...',
        unknownError: 'Unknown error',
        draftSaved: 'Draft saved',
        draftRestored: 'Draft restored',
        draftAutoRestored: 'Draft auto-restored',
        themeSwitched: 'Switched to {{theme}} mode',
        themeDark: 'dark',
        themeLight: 'light',
        clearConfirm: 'Are you sure you want to clear all content? This action cannot be undone.'
    },
    draft: {
        foundTitle: 'Unsaved Draft Found',
        lastEditTime: 'Last edited: {{time}}',
        rememberChoice: 'Remember my choice',
        ignore: 'Ignore',
        restore: 'Restore Draft'
    },
    insertText: {
        bold: 'Bold Text',
        italic: 'Italic Text',
        heading: 'Heading',
        link: 'Link Text',
        image: 'Image Description',
        code: 'Code',
        table: '| Column1 | Column2 | Column3 |\n| --- | --- | --- |\n| Cell1 | Cell2 | Cell3 |\n\n'
    }
};
