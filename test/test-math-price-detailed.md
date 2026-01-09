# 详细测试场景

## 测试场景 1：价格在标题中

## 价格<span class="price">$123</span>

应该显示：标题中的 <span class="price">$123</span> 不应该被解析为数学公式

## 测试场景 2：价格和数学公式混合

**混合使用**：

$E = mc^2$ 是质能方程。

应该显示：$E = mc^2$ 应该被解析为数学公式

## 测试场景 3：多个价格

价格 <span class="price">$100</span> 和 <span class="price">$200</span> 都很便宜。

应该显示：两个价格都不应该被解析为数学公式

## 测试场景 4：价格和数学公式在同一行

价格 <span class="price">$50</span>，公式 $x = y + z$ 是数学公式。

应该显示：<span class="price">$50</span> 是价格，$x = y + z$ 是数学公式

## 测试场景 5：价格在段落中

这是一个价格 <span class="price">$99.99</span>，后面是数学公式 $a^2 + b^2 = c^2$。

应该显示：<span class="price">$99.99</span> 是价格，$a^2 + b^2 = c^2$ 是数学公式

## 测试场景 6：复杂数学公式

$E = mc^2$ 和 $\sum_{i=1}^{n} x_i$ 都是数学公式。

应该显示：两个都是数学公式

## 测试场景 7：价格格式边界

(<span class="price">$100</span>) 和 [<span class="price">$200</span>] 都是价格。

应该显示：两个都是价格

## 测试场景 8：价格后跟标点

价格 <span class="price">$123.45</span>，价格 <span class="price">$67.89</span>；价格 <span class="price">$10.00</span>。

应该显示：三个都是价格

## 测试场景 9：标题中有多个价格

## 价格 <span class="price">$100</span> 和 <span class="price">$200</span>

应该显示：两个价格都不应该被解析为数学公式

## 测试场景 10：标题和正文都有价格和公式

## 标题价格 <span class="price">$50</span>

正文价格 <span class="price">$30</span>，数学公式 $f(x) = x^2$。

应该显示：两个价格都不是公式，$f(x) = x^2$ 是公式
