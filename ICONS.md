# MarkX 图标系统

## 🎨 设计理念

MarkX 使用完全自定义的 SVG 图标系统，特点：
- ✅ **高级酷炫** - 现代扁平设计
- ✅ **主题自适应** - 自动跟随亮色/暗色主题
- ✅ **动画效果** - 悬停时优雅动画
- ✅ **矢量图标** - 任意缩放不失真
- ✅ **性能优异** - 内联 SVG，无需额外请求

---

## 🎯 Logo 设计

### MarkX Logo - 极简现代风格
```
┌─────────┐
│ ╲   ╱  │  ← 双 M 造型
│  ╲ ╱   │  ← 简约几何
└─────────┘
```

**设计理念**：
- **极简主义** - 仅用基本几何形状
- **渐变魔法** - 蓝绿渐变（亮色）/ 紫色渐变（暗色）
- **动态效果** - 悬浮 + 光效 + 旋转动画
- **品牌识别** - 双 M 代表 Markdown + Mermaid

**视觉特点**：
- 圆角矩形（6px）
- 渐变背景（对角线 135度）
- 白色图形（95% 透明度 + 描边）
- 阴影光晕

**主题适配**：
- **亮色模式**：
  - 渐变：`#5B86E5` → `#36D1DC` (蓝绿)
  - 阴影：柔和蓝色光晕
  - 文字：蓝绿渐变
  
- **暗色模式**：
  - 渐变：`#667eea` → `#764ba2` (紫色)
  - 阴影：强烈紫色光晕
  - 文字：紫色渐变

**动画效果**：
- 悬浮动画（4秒循环）
- 悬停旋转 360° + 缩放
- 光晕强度变化

---

## 📁 Logo 文件清单

MarkX 提供了多种尺寸和用途的 Logo 文件：

| 文件 | 尺寸 | 用途 | 特点 |
|------|------|------|------|
| `favicon.svg` | 32×32 | 浏览器标签图标 | 最小化版本 |
| `logo.svg` | 200×60 | README 亮色主题 | 带文字的完整 Logo |
| `logo-dark.svg` | 200×60 | README 暗色主题 | 紫色渐变版本 |
| `logo-banner.svg` | 1200×630 | 社交分享图 | Open Graph 尺寸 |

### Logo 在不同场景的应用

```markdown
<!-- README 中使用（自动适配主题）-->
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./logo-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="./logo.svg">
  <img alt="MarkX Logo" src="./logo.svg" width="300">
</picture>

<!-- HTML 中使用 Favicon -->
<link rel="icon" type="image/svg+xml" href="./favicon.svg">

<!-- 社交分享 Meta 标签 -->
<meta property="og:image" content="./logo-banner.svg">
```

---

## 📦 图标列表

### 文件操作
| 图标 | ID | 用途 |
|------|----|----|
| 📄 → SVG | `icon-new` | 新建文档 |
| 📁 → SVG | `icon-open` | 打开文件 |
| 💾 → SVG | `icon-save` | 保存文件 |

### Markdown 格式化
| 图标 | ID | 用途 |
|------|----|----|
| **B** → SVG | `icon-bold` | 加粗 |
| *I* → SVG | `icon-italic` | 斜体 |
| **H** → SVG | `icon-heading` | 标题 |
| 🔗 → SVG | `icon-link` | 链接 |
| 🖼️ → SVG | `icon-image` | 图片 |
| </> → SVG | `icon-code` | 代码块 |
| 📊 → SVG | `icon-table` | 表格 |

### 应用功能
| 图标 | ID | 用途 |
|------|----|----|
| 📈 → SVG | `icon-chart` | Mermaid 图表 |
| ⚡ → SVG | `icon-layout` | 切换布局 |
| 🌙 → SVG | `icon-theme-dark` | 暗色主题 |
| ☀️ → SVG | `icon-theme-light` | 亮色主题 |
| ⋮ → SVG | `icon-more` | 更多选项 |

### 导出功能
| 图标 | ID | 用途 |
|------|----|----|
| 📥 → SVG | `icon-download` | 导出 SVG |
| 🖼️ → SVG | `icon-image-download` | 导出 PNG |

---

## ✨ 动画效果

### Logo 动画
- **浮动效果**：上下轻微浮动（3秒循环）
- **发光效果**：暗色模式下绿色光晕

### 工具栏按钮
- **悬停**：图标放大 1.1 倍
- **点击**：图标缩小 0.95 倍
- **渐变背景**：135度渐变效果

### 主题切换按钮
- **悬停**：旋转 15 度 + 放大
- **亮色模式**：蓝色光晕
- **暗色模式**：金色光晕

### 保存按钮
- **悬停**：左右摆动动画
- **点击反馈**：瞬间缩放

### Mermaid 导出按钮
- **SVG 按钮**：绿色阴影
- **PNG 按钮**：蓝色阴影
- **悬停**：图标上浮 + 渐变背景

---

## 🎨 颜色方案

### 亮色主题
- Logo 主色：`#4CAF50` (绿色)
- 指示点：`#2196F3` (蓝色)
- 图标颜色：`currentColor` (自适应文字颜色)

### 暗色主题
- Logo 主色：`#66BB6A` (柔和绿色)
- 指示点：`#42A5F5` (亮蓝色)
- 光晕效果：`rgba(102, 187, 106, 0.3)`

---

## 🛠️ 技术实现

### SVG Symbol 系统
```html
<svg style="display: none;">
  <symbol id="icon-name">
    <!-- 图标路径 -->
  </symbol>
</svg>
```

### 图标引用
```html
<svg class="icon">
  <use href="#icon-name"></use>
</svg>
```

### CSS 控制
```css
svg.icon {
    color: currentColor;
    fill: currentColor;
    transition: all 0.15s ease;
}
```

---

## 📊 优势

### vs Emoji
- ✅ 更专业的视觉效果
- ✅ 完美的主题适配
- ✅ 支持动画效果
- ✅ 跨平台一致性

### vs Icon Font
- ✅ 更好的性能（内联 SVG）
- ✅ 不需要额外加载字体
- ✅ 支持多色图标
- ✅ 更灵活的控制

### vs PNG/JPG
- ✅ 矢量无损
- ✅ 文件更小
- ✅ 主题自适应
- ✅ 支持 CSS 控制

---

## 🎯 使用示例

### 在 HTML 中使用
```html
<button>
  <svg class="icon"><use href="#icon-save"></use></svg>
  保存
</button>
```

### 在 CSS 中控制
```css
.my-button svg.icon {
    width: 20px;
    height: 20px;
    color: #4CAF50;
}
```

### 动画效果
```css
.my-button:hover svg.icon {
    transform: scale(1.2) rotate(15deg);
}
```

---

<div align="center">

**MarkX 图标系统 - 高级、酷炫、专业**

Made with ❤️ by MarkX Team

</div>

