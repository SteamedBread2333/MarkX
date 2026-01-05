# MarkX 模块化重构说明

## 目录结构

```
src/
├── core/              # 核心模块
│   ├── state.js      # 应用状态管理
│   ├── constants.js   # 常量定义
│   ├── utils.js      # 工具函数
│   ├── elements.js   # DOM 元素引用
│   └── ui-utils.js    # UI 工具函数
├── config/            # 配置模块
│   ├── marked.js     # Marked.js 配置
│   └── mermaid.js    # Mermaid 配置
├── editor/            # 编辑器模块（待拆分）
│   ├── ace-editor.js # Ace Editor 相关
│   └── resize.js     # 编辑器调整大小
├── renderer/          # 渲染模块（待拆分）
│   ├── markdown.js   # Markdown 渲染
│   └── mermaid.js    # Mermaid 渲染和导出
├── ui/                # UI 模块（待拆分）
│   ├── theme.js      # 主题切换
│   ├── layout.js     # 布局切换
│   └── scroll-sync.js # 滚动同步
├── export/            # 导出模块（待拆分）
│   ├── pdf.js        # PDF 导出
│   └── html.js       # HTML 导出
├── file/              # 文件操作模块（待拆分）
│   └── operations.js # 文件操作
└── app.js             # 主入口文件（待创建）
```

## 重构进度

- ✅ 核心模块（state, constants, utils, elements, ui-utils）
- ✅ 配置模块（marked, mermaid）
- ⏳ 编辑器模块（待拆分）
- ⏳ 渲染模块（待拆分）
- ⏳ UI 模块（待拆分）
- ⏳ 导出模块（待拆分）
- ⏳ 文件操作模块（待拆分）

## 使用说明

当前重构采用渐进式方式，已创建的模块可以直接使用，其他功能暂时保留在原 `app.js` 中。

## 下一步计划

1. 拆分编辑器模块
2. 拆分渲染模块
3. 拆分 UI 模块
4. 拆分导出模块
5. 拆分文件操作模块
6. 创建新的主入口文件整合所有模块
