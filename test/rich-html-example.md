# 富含HTML的Markdown文档示例

这是一个展示如何在Markdown中嵌入HTML元素的示例文档。

## 1. 基础HTML元素

### 按钮和交互元素

<button onclick="alert('Hello!')" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
    点击我
</button>

<button style="padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">
    成功按钮
</button>

### 彩色文本和样式

<p style="color: #e74c3c; font-size: 18px; font-weight: bold;">
    这是红色的粗体文本
</p>

<p style="color: #3498db; font-size: 16px; font-style: italic;">
    这是蓝色的斜体文本
</p>

<p style="background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; border-radius: 8px;">
    渐变背景的文本块
</p>

## 2. 表格和布局

### 自定义样式表格

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <thead>
        <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
            <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">产品</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">价格</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">状态</th>
        </tr>
    </thead>
    <tbody>
        <tr style="background: #f8f9fa;">
            <td style="padding: 10px; border: 1px solid #ddd;">高级版</td>
            <td style="padding: 10px; border: 1px solid #ddd;">$99</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><span style="background: #28a745; color: white; padding: 4px 8px; border-radius: 4px;">可用</span></td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">专业版</td>
            <td style="padding: 10px; border: 1px solid #ddd;">$199</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><span style="background: #ffc107; color: #000; padding: 4px 8px; border-radius: 4px;">即将推出</span></td>
        </tr>
    </tbody>
</table>

## 3. 卡片和容器

<div style="display: flex; gap: 20px; margin: 20px 0; flex-wrap: wrap;">
    <div style="flex: 1; min-width: 200px; background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="margin-top: 0; color: #333;">卡片 1</h3>
        <p style="color: #666;">这是一个漂亮的卡片组件，使用了阴影和圆角。</p>
    </div>
    <div style="flex: 1; min-width: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h3 style="margin-top: 0;">卡片 2</h3>
        <p>这个卡片使用了渐变背景和白色文字。</p>
    </div>
    <div style="flex: 1; min-width: 200px; background: #f8f9fa; border-left: 4px solid #007bff; border-radius: 4px; padding: 20px;">
        <h3 style="margin-top: 0; color: #007bff;">卡片 3</h3>
        <p style="color: #666;">这个卡片有左侧边框强调。</p>
    </div>
</div>

## 4. 进度条和状态指示器

<div style="margin: 20px 0;">
    <p>技能进度：</p>
    <div style="background: #e9ecef; border-radius: 10px; height: 25px; margin: 10px 0;">
        <div style="background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); height: 100%; width: 75%; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
            75%
        </div>
    </div>
    <div style="background: #e9ecef; border-radius: 10px; height: 25px; margin: 10px 0;">
        <div style="background: #28a745; height: 100%; width: 90%; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
            90%
        </div>
    </div>
</div>

## 5. 徽章和标签

<div style="margin: 20px 0;">
    <span style="background: #007bff; color: white; padding: 5px 12px; border-radius: 20px; font-size: 14px; margin-right: 10px;">标签1</span>
    <span style="background: #28a745; color: white; padding: 5px 12px; border-radius: 20px; font-size: 14px; margin-right: 10px;">标签2</span>
    <span style="background: #ffc107; color: #000; padding: 5px 12px; border-radius: 20px; font-size: 14px; margin-right: 10px;">标签3</span>
    <span style="background: #dc3545; color: white; padding: 5px 12px; border-radius: 20px; font-size: 14px; margin-right: 10px;">标签4</span>
</div>

## 6. 警告框和信息框

<div style="background: #d1ecf1; border-left: 4px solid #0c5460; padding: 15px; margin: 20px 0; border-radius: 4px;">
    <strong style="color: #0c5460;">信息提示：</strong>
    <p style="color: #0c5460; margin: 5px 0 0 0;">这是一个信息提示框，用于显示重要信息。</p>
</div>

<div style="background: #fff3cd; border-left: 4px solid #856404; padding: 15px; margin: 20px 0; border-radius: 4px;">
    <strong style="color: #856404;">警告：</strong>
    <p style="color: #856404; margin: 5px 0 0 0;">这是一个警告提示框，用于显示警告信息。</p>
</div>

<div style="background: #d4edda; border-left: 4px solid #155724; padding: 15px; margin: 20px 0; border-radius: 4px;">
    <strong style="color: #155724;">成功：</strong>
    <p style="color: #155724; margin: 5px 0 0 0;">这是一个成功提示框，用于显示成功信息。</p>
</div>

<div style="background: #f8d7da; border-left: 4px solid #721c24; padding: 15px; margin: 20px 0; border-radius: 4px;">
    <strong style="color: #721c24;">错误：</strong>
    <p style="color: #721c24; margin: 5px 0 0 0;">这是一个错误提示框，用于显示错误信息。</p>
</div>

## 7. 代码块样式

<div style="background: #282c34; color: #abb2bf; padding: 20px; border-radius: 8px; margin: 20px 0; font-family: 'Courier New', monospace;">
    <div style="color: #c678dd;">function</div> <span style="color: #61afef;">greet</span>(<span style="color: #e06c75;">name</span>) {
    <div style="margin-left: 20px; color: #98c379;">console</span>.<span style="color: #e5c07b;">log</span>(<span style="color: #98c379;">`Hello, ${name}!`</span>);
}
</div>

## 8. 引用和引用块

<blockquote style="border-left: 4px solid #667eea; padding: 15px 20px; margin: 20px 0; background: #f8f9fa; border-radius: 4px; font-style: italic;">
    <p style="margin: 0;">"设计不仅仅是它看起来怎么样和感觉怎么样，设计是它如何工作的。"</p>
    <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">— 史蒂夫·乔布斯</p>
</blockquote>

## 9. 列表样式

<ul style="list-style: none; padding: 0;">
    <li style="padding: 10px; margin: 5px 0; background: #f8f9fa; border-left: 3px solid #667eea; border-radius: 4px;">
        <strong>项目 1：</strong> 这是一个自定义样式的列表项
    </li>
    <li style="padding: 10px; margin: 5px 0; background: #f8f9fa; border-left: 3px solid #28a745; border-radius: 4px;">
        <strong>项目 2：</strong> 每个项目都有不同的边框颜色
    </li>
    <li style="padding: 10px; margin: 5px 0; background: #f8f9fa; border-left: 3px solid #ffc107; border-radius: 4px;">
        <strong>项目 3：</strong> 使用了圆角和阴影效果
    </li>
</ul>

## 10. 图片和媒体

<div style="text-align: center; margin: 20px 0;">
    <div style="display: inline-block; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="width: 200px; height: 150px; background: rgba(255,255,255,0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
            图片占位符
        </div>
    </div>
</div>

## 11. 表单元素

<div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="margin-top: 0;">联系表单</h3>
    <form>
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">姓名：</label>
            <input type="text" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;" placeholder="请输入您的姓名">
        </div>
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">邮箱：</label>
            <input type="email" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;" placeholder="your@email.com">
        </div>
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">消息：</label>
            <textarea style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; min-height: 100px;" placeholder="请输入您的消息"></textarea>
        </div>
        <button type="submit" style="padding: 12px 30px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; font-weight: bold;">
            提交
        </button>
    </form>
</div>

## 12. 动画效果（CSS动画）

<div style="text-align: center; margin: 30px 0;">
    <div style="display: inline-block; padding: 20px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 50px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
        悬停我查看效果
    </div>
</div>

## 13. 网格布局

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0;">
    <div style="background: #667eea; color: white; padding: 30px; border-radius: 8px; text-align: center;">
        <h3 style="margin: 0 0 10px 0;">网格 1</h3>
        <p style="margin: 0;">响应式网格布局</p>
    </div>
    <div style="background: #28a745; color: white; padding: 30px; border-radius: 8px; text-align: center;">
        <h3 style="margin: 0 0 10px 0;">网格 2</h3>
        <p style="margin: 0;">自动适应屏幕</p>
    </div>
    <div style="background: #ffc107; color: #000; padding: 30px; border-radius: 8px; text-align: center;">
        <h3 style="margin: 0 0 10px 0;">网格 3</h3>
        <p style="margin: 0;">灵活的布局系统</p>
    </div>
</div>

## 14. 时间线和步骤

<div style="position: relative; padding-left: 30px; margin: 20px 0;">
    <div style="position: absolute; left: 0; top: 0; width: 20px; height: 20px; background: #667eea; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 3px #667eea;"></div>
    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h4 style="margin: 0 0 5px 0;">步骤 1</h4>
        <p style="margin: 0; color: #666;">这是第一个步骤的描述</p>
    </div>
    
    <div style="position: absolute; left: 0; top: 40px; width: 2px; height: 60px; background: #ddd;"></div>
    
    <div style="position: absolute; left: 0; top: 100px; width: 20px; height: 20px; background: #28a745; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 3px #28a745;"></div>
    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h4 style="margin: 0 0 5px 0;">步骤 2</h4>
        <p style="margin: 0; color: #666;">这是第二个步骤的描述</p>
    </div>
</div>

## 15. 统计卡片

<div style="display: flex; gap: 20px; margin: 20px 0; flex-wrap: wrap;">
    <div style="flex: 1; min-width: 150px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 36px; font-weight: bold; color: #667eea; margin-bottom: 10px;">1,234</div>
        <div style="color: #666;">总用户数</div>
    </div>
    <div style="flex: 1; min-width: 150px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 36px; font-weight: bold; color: #28a745; margin-bottom: 10px;">567</div>
        <div style="color: #666;">活跃用户</div>
    </div>
    <div style="flex: 1; min-width: 150px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 36px; font-weight: bold; color: #ffc107; margin-bottom: 10px;">89</div>
        <div style="color: #666;">新用户</div>
    </div>
</div>

---

## 总结

这个文档展示了如何在Markdown中嵌入各种HTML元素，包括：

- ✅ 按钮和交互元素
- ✅ 样式化的文本和容器
- ✅ 表格和布局
- ✅ 卡片组件
- ✅ 进度条和状态指示器
- ✅ 徽章和标签
- ✅ 警告框和信息框
- ✅ 代码块样式
- ✅ 引用块
- ✅ 自定义列表
- ✅ 表单元素
- ✅ 动画效果
- ✅ 网格布局
- ✅ 时间线
- ✅ 统计卡片

所有这些HTML元素都可以在Markdown文档中使用，为文档添加丰富的视觉效果和交互性！
