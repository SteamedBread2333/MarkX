<div align="center">
    <h3>专业的 Markdown + Mermaid 编辑器</h3>
    <p>现代化 · 开箱即用 · 功能强大</p>
</div>
<div align="center">
<img src="./logo-banner.svg" alt="MarkX Banner" width="100%">
</div>

[在线演示](https://steamedbread2333.github.io/MarkX)

## 🚀 快速开始

### 方法一：直接使用（推荐）

1. **克隆仓库**
```bash
git clone https://github.com/yourusername/markx.git
cd markx
```

2. **启动本地服务器**

由于使用了 ES 模块和 Import Maps，需要通过 HTTP 服务器访问：

```bash
# 使用 Python (推荐)
python3 -m http.server 8000

# 或使用 Node.js http-server
npx http-server -p 8000

# 或使用 PHP
php -S localhost:8000
```

3. **打开浏览器**

访问 `http://localhost:8000` 即可使用！

### 方法二：在线部署

#### 部署到 GitHub Pages

1. Fork 本仓库
2. 进入仓库设置 → Pages
3. Source 选择 `main` 分支
4. 保存后等待几分钟即可访问

#### 部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/markx)

1. 点击上方按钮
2. 登录 Vercel 账号
3. 一键部署完成

#### 部署到 Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/markx)

1. 点击上方按钮
2. 登录 Netlify 账号
3. 自动部署完成

---

## 📖 使用指南

### 基础操作

#### 编辑 Markdown
在左侧编辑器输入 Markdown 内容，右侧实时预览：

```markdown
# 一级标题
## 二级标题

**加粗文本** *斜体文本* ~~删除线~~

- 无序列表项 1
- 无序列表项 2

1. 有序列表项 1
2. 有序列表项 2

[链接文本](https://example.com)
![图片描述](image.jpg)
```

#### 插入 Mermaid 图表

**方法一：使用工具栏**
1. 点击工具栏的「图表」按钮
2. 选择需要的图表类型
3. 自动插入模板，修改内容即可

**方法二：手动输入**

````markdown
```mermaid
graph TD
    A[开始] --> B{判断}
    B -->|是| C[结果1]
    B -->|否| D[结果2]
```
````

#### 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl + S` | 保存文件 |
| `Ctrl + O` | 打开文件 |
| `Ctrl + N` | 新建文档 |
| `Ctrl + B` | 加粗 |
| `Ctrl + I` | 斜体 |
| `Ctrl + K` | 插入链接 |

### 高级功能

#### 表格
```markdown
| 列1 | 列2 | 列3 |
| --- | --- | --- |
| 单元格1 | 单元格2 | 单元格3 |
| 内容A | 内容B | 内容C |
```

#### 任务列表
```markdown
- [x] 已完成任务
- [ ] 待完成任务
- [ ] 另一个任务
```

#### 代码块
````markdown
```javascript
function hello() {
    console.log('Hello, MarkX!');
}
```
````

---

## 🎨 Mermaid 图表示例

### 流程图
````markdown
```mermaid
graph LR
    A[方形] --> B(圆角)
    B --> C{菱形}
    C -->|选项1| D[结果1]
    C -->|选项2| E[结果2]
```
````

### 时序图
````markdown
```mermaid
sequenceDiagram
    Alice->>John: 你好，John！
    John-->>Alice: 你好，Alice！
    Alice-)John: 再见！
```
````

### 甘特图
````markdown
```mermaid
gantt
    title 项目进度
    dateFormat  YYYY-MM-DD
    section 设计
    需求分析      :a1, 2024-01-01, 7d
    原型设计      :after a1, 5d
    section 开发
    前端开发      :2024-01-15, 10d
    后端开发      :2024-01-15, 12d
```
````

### 类图
````markdown
```mermaid
classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    class Duck{
        +String beakColor
        +swim()
        +quack()
    }
    class Fish{
        -int sizeInFeet
        -canEat()
    }
```
````

---

## 🛠️ 技术栈

### 核心库
- **[Marked.js](https://marked.js.org/)** `v11.1.1` - Markdown 解析
- **[Mermaid.js](https://mermaid.js.org/)** `v10.6.1` - 图表渲染
- **[DOMPurify](https://github.com/cure53/DOMPurify)** `v3.0.8` - XSS 防护
- **[Highlight.js](https://highlightjs.org/)** `v11.9.0` - 代码高亮

### 架构特点
- ✅ **零构建** - 无需 Webpack/Vite，直接运行
- ✅ **ES Modules** - 原生 JavaScript 模块
- ✅ **Import Maps** - CDN 依赖管理
- ✅ **纯静态** - 可部署到任何静态托管平台

### 浏览器兼容性
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ 移动端浏览器（iOS Safari 14+, Chrome Mobile）

---

## 📂 项目结构

```
markx/
├── index.html          # 主页面（HTML 结构）
├── styles.css          # 样式文件（CSS + 主题）
├── app.js              # 应用逻辑（JavaScript）
├── README.md           # 项目文档（本文件）
├── LICENSE             # MIT 许可证
├── .gitignore          # Git 忽略文件
└── screenshots/        # 截图目录
    ├── light-mode.png
    ├── dark-mode.png
    └── mobile.png
```

---

<div align="center">

<img src="./logo.svg" width="150">

<br><br>

**如果觉得 MarkX 有帮助，请给个 ⭐️ Star 支持一下！**

<br>

[![Star History](https://img.shields.io/github/stars/yourusername/markx?style=social)](https://github.com/yourusername/markx/stargazers)
[![Fork](https://img.shields.io/github/forks/yourusername/markx?style=social)](https://github.com/yourusername/markx/fork)
[![Watch](https://img.shields.io/github/watchers/yourusername/markx?style=social)](https://github.com/yourusername/markx/watchers)

<br>

Made with 💙 by [MarkX Contributors](https://github.com/yourusername/markx/graphs/contributors)

<br>

**[⬆ 回到顶部](#)**

</div>

