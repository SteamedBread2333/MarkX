<div align="center">
    <h3>专业的 Markdown + Mermaid + ECharts + KaTeX 编辑器</h3>
    <p>现代化 · 开箱即用 · 功能强大</p>
</div>
<div align="center">
<img src="./assets/images/logo-banner-zh.svg" alt="MarkX Banner" width="100%">
</div>

[English](README.md) | **中文**

[在线演示](https://steamedbread2333.github.io/MarkX)

---

## ✨ 核心特性

<table>
<tr>
<td width="33%">

### 📊 Mermaid 图表

完美集成 Mermaid.js：

- ✅ **流程图** - 可视化流程
- ✅ **时序图** - 展示交互
- ✅ **甘特图** - 项目管理
- ✅ **类图** - UML 关系
- ✅ **状态图** - 状态机
- ✅ **导出工具** - SVG/PNG 导出和全屏

</td>
<td width="33%">

### 📈 ECharts 图表

强大的数据可视化：

- ✅ **柱状图** - 柱形和条形图
- ✅ **折线图** - 趋势分析
- ✅ **饼图** - 比例数据
- ✅ **散点图** - 相关性分析
- ✅ **自定义图表** - 完整 ECharts API
- ✅ **JavaScript 语法** - 代码高亮和自动完成
- ✅ **导出支持** - HTML/PDF 导出为图片

</td>
<td width="33%">

### 🧮 KaTeX 数学

强大的数学公式渲染：

- ✅ **行内公式** - `$E=mc^2$` 
- ✅ **块级公式** - `$$\int_0^\infty$$`
- ✅ **丰富符号** - 积分、求和、矩阵
- ✅ **实时渲染** - 输入即显示
- ✅ **LaTeX 语法** - 标准排版
- ✅ **快速插入** - 内置模板

</td>
</tr>
</table>

### 🎯 更多功能

- 📝 **GFM 支持** - 完整的 GitHub Flavored Markdown
- 🎨 **主题切换** - 亮色/暗色护眼模式
- 💾 **自动保存** - 每 30 秒自动保存草稿
- 📊 **实时统计** - 字数、行数、阅读时间
- 🔒 **安全防护** - DOMPurify XSS 防护
- 📱 **响应式** - 完美适配桌面和移动端
- 📄 **导出 PDF** - 三种导出模式：默认截断、整张长图、智能分页
- 🌐 **导出 HTML** - 导出渲染后的内容为独立 HTML 文件
- 📋 **复制功能** - 快速复制 Markdown 或 HTML 内容到剪贴板

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

#### 📊 插入 Mermaid 图表

**方法一：使用工具栏**
1. 点击工具栏的「图表」按钮
2. 选择需要的图表类型（流程图/时序图/甘特图/类图/状态图）
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

**💡 导出功能：** 将鼠标悬停在任何 Mermaid 图表上，会显示导出工具栏：
- **SVG 导出** - 导出为矢量图（推荐，可无损缩放）
- **PNG 导出** - 导出为高清图片（2倍分辨率）
- **全屏查看** - 全屏查看，支持缩放和拖拽

---

#### 📈 插入 ECharts 图表

**方法：手动输入**

使用 `echarts` 代码块创建交互式图表。代码支持 JSON 格式和 JavaScript 对象字面量：

````markdown
```echarts
{
  "title": {
    "text": "月度销售额",
    "left": "center"
  },
  "xAxis": {
    "type": "category",
    "data": ["1月", "2月", "3月", "4月", "5月", "6月"]
  },
  "yAxis": {
    "type": "value"
  },
  "series": [{
    "type": "bar",
    "data": [120, 200, 150, 80, 70, 110]
  }]
}
```
````

**💡 特性**：
- **JavaScript 语法高亮** - ECharts 块使用 JavaScript 语法高亮，编辑体验更好
- **JSON 或 JavaScript** - 支持 JSON 格式和 JavaScript 对象字面量
- **完整 ECharts API** - 支持所有 ECharts 图表类型和配置选项
- **导出支持** - 导出 HTML/PDF 时自动转换为图片
- **主题支持** - 自动适配亮色/暗色主题

**常用图表类型**：
- 柱状图 (`"type": "bar"`)
- 折线图 (`"type": "line"`)
- 饼图 (`"type": "pie"`)
- 散点图 (`"type": "scatter"`)
- 以及更多...

---

#### 🧮 插入数学公式

**方法一：使用工具栏**
1. 点击工具栏的「公式」按钮
2. 选择公式类型（行内/块级/分数/根号/求和/积分/极限/矩阵）
3. 自动插入模板，修改内容即可

**方法二：手动输入**

**行内公式**（使用单个 `$` 包裹）：
```markdown
质能方程：$E = mc^2$，勾股定理：$a^2 + b^2 = c^2$
```

**块级公式**（使用双 `$$` 包裹，独立成行）：
```markdown
二次方程求根公式：

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

矩阵示例：

$$
\begin{bmatrix}
a & b \\
c & d
\end{bmatrix}
$$
```

**💡 重要提示**：
- 块级公式的 `$$` 符号必须单独占一行
- 公式内容可以跨越多行
- 前后要有空行以确保正确渲染

**常用示例**：
```markdown
- 分数：$\frac{a}{b}$
- 根号：$\sqrt{x}$ 或 $\sqrt[3]{x}$
- 求和：$\sum_{i=1}^{n} i$
- 积分：$\int_{0}^{\infty} e^{-x}dx$
- 极限：$\lim_{x \to \infty} \frac{1}{x} = 0$
```
---

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

#### 📄 导出功能

**导出 PDF** - 点击工具栏的「更多」按钮（三个点），然后选择 PDF 导出选项：

1. **导出 PDF（默认截断）** - 自然页面截断，适合快速导出
2. **导出 PDF（整张长图）** - 导出为单张长图，不分页，适合演示展示
3. **导出 PDF（智能分页）** - 智能分页，避免截断 Mermaid 图表、代码块和数学公式

**导出 HTML** - 将渲染后的内容导出为独立的 HTML 文件，可在任何浏览器中打开。

**复制功能** - 快速复制 Markdown 源码或渲染后的 HTML 到剪贴板，方便分享。

---

## 🎨 图表示例

### 📈 ECharts 示例

#### 柱状图
````markdown
```echarts
{
  "title": { "text": "月度销售额", "left": "center" },
  "xAxis": { "type": "category", "data": ["1月", "2月", "3月", "4月", "5月", "6月"] },
  "yAxis": { "type": "value" },
  "series": [{ "type": "bar", "data": [120, 200, 150, 80, 70, 110] }]
}
```
````

#### 折线图
````markdown
```echarts
{
  "title": { "text": "用户增长趋势", "left": "center" },
  "xAxis": { "type": "category", "data": ["周一", "周二", "周三", "周四", "周五", "周六", "周日"] },
  "yAxis": { "type": "value" },
  "series": [{ "type": "line", "smooth": true, "data": [120, 132, 101, 134, 90, 230, 210] }]
}
```
````

#### 饼图
````markdown
```echarts
{
  "title": { "text": "市场份额", "left": "center" },
  "series": [{
    "type": "pie",
    "data": [
      { "value": 335, "name": "产品A" },
      { "value": 310, "name": "产品B" },
      { "value": 234, "name": "产品C" }
    ]
  }]
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
- **[ECharts](https://echarts.apache.org/)** `v5.4.3` - 数据可视化图表
- **[KaTeX](https://katex.org/)** - 数学公式渲染
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
├── src/                # 源代码目录
│   ├── app.js          # 应用入口文件
│   ├── css/            # 样式文件（模块化 CSS）
│   │   ├── styles.css  # 主样式文件（导入所有模块）
│   │   ├── variables.css
│   │   ├── base.css
│   │   ├── toolbar.css
│   │   ├── editor.css
│   │   ├── preview.css
│   │   ├── markdown.css
│   │   ├── mermaid.css
│   │   ├── katex.css
│   │   ├── components.css
│   │   ├── statusbar.css
│   │   ├── github-corner.css
│   │   ├── animations.css
│   │   └── responsive.css
│   ├── core/           # 核心模块
│   ├── editor/         # 编辑器模块
│   ├── renderer/       # 渲染器模块
│   ├── export/         # 导出模块
│   ├── file/           # 文件操作
│   ├── ui/             # UI 模块
│   └── config/         # 配置
├── assets/             # 静态资源
│   └── images/         # 图片（Logo、Favicon）
│       ├── favicon.svg
│       ├── logo.svg
│       ├── logo-en.svg
│       ├── logo-zh.svg
│       ├── logo-dark.svg
│       ├── logo-banner.svg
│       ├── logo-banner-en.svg
│       └── logo-banner-zh.svg
├── README.md           # 项目文档（英文版）
├── README.zh-CN.md     # 项目文档（中文版，本文件）
├── LICENSE             # MIT 许可证
└── .gitignore          # Git 忽略文件
```

---

<div align="center">

<img src="./assets/images/logo-zh.svg" width="150">

<br><br>

**如果觉得 MarkX 有帮助，请给个 ⭐️ Star 支持一下！**

</div>

