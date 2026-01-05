# 超长数学公式块测试文档

这是一个用于测试 PDF 导出功能的测试文档，包含超长的数学公式块。

## 测试说明

本文档包含多个超长的数学公式块，用于测试：
- 数学公式块超过一页高度时的截断功能
- 分页逻辑是否正确处理超长数学公式块
- 数学公式块应该允许截断（和 Mermaid 一样的分页逻辑）

## 线性代数公式块测试

$$
\begin{aligned}
\mathbf{A} \mathbf{x} &= \mathbf{b} \\
\begin{bmatrix}
a_{11} & a_{12} & a_{13} & \cdots & a_{1n} \\
a_{21} & a_{22} & a_{23} & \cdots & a_{2n} \\
a_{31} & a_{32} & a_{33} & \cdots & a_{3n} \\
\vdots & \vdots & \vdots & \ddots & \vdots \\
a_{m1} & a_{m2} & a_{m3} & \cdots & a_{mn}
\end{bmatrix}
\begin{bmatrix}
x_1 \\ x_2 \\ x_3 \\ \vdots \\ x_n
\end{bmatrix}
&=
\begin{bmatrix}
b_1 \\ b_2 \\ b_3 \\ \vdots \\ b_m
\end{bmatrix} \\
\mathbf{x} &= \mathbf{A}^{-1} \mathbf{b} \\
\det(\mathbf{A}) &= \sum_{\sigma \in S_n} \operatorname{sgn}(\sigma) \prod_{i=1}^{n} a_{i,\sigma(i)} \\
\mathbf{A}^T &= \begin{bmatrix}
a_{11} & a_{21} & a_{31} & \cdots & a_{m1} \\
a_{12} & a_{22} & a_{32} & \cdots & a_{m2} \\
a_{13} & a_{23} & a_{33} & \cdots & a_{m3} \\
\vdots & \vdots & \vdots & \ddots & \vdots \\
a_{1n} & a_{2n} & a_{3n} & \cdots & a_{mn}
\end{bmatrix} \\
\mathbf{A} \mathbf{A}^T &= \mathbf{I} \\
\|\mathbf{x}\|_2 &= \sqrt{\sum_{i=1}^{n} x_i^2} \\
\|\mathbf{x}\|_1 &= \sum_{i=1}^{n} |x_i| \\
\|\mathbf{x}\|_\infty &= \max_{1 \leq i \leq n} |x_i| \\
\mathbf{x} \cdot \mathbf{y} &= \sum_{i=1}^{n} x_i y_i \\
\mathbf{x} \times \mathbf{y} &= \begin{vmatrix}
\mathbf{i} & \mathbf{j} & \mathbf{k} \\
x_1 & x_2 & x_3 \\
y_1 & y_2 & y_3
\end{vmatrix} \\
\operatorname{span}(\mathbf{v}_1, \mathbf{v}_2, \ldots, \mathbf{v}_k) &= \left\{ \sum_{i=1}^{k} c_i \mathbf{v}_i : c_i \in \mathbb{R} \right\} \\
\dim(\operatorname{span}(\mathbf{v}_1, \mathbf{v}_2, \ldots, \mathbf{v}_k)) &= \operatorname{rank}(\mathbf{A}) \\
\mathbf{A} = \mathbf{P} \mathbf{D} \mathbf{P}^{-1} \\
\mathbf{D} &= \begin{bmatrix}
\lambda_1 & 0 & 0 & \cdots & 0 \\
0 & \lambda_2 & 0 & \cdots & 0 \\
0 & 0 & \lambda_3 & \cdots & 0 \\
\vdots & \vdots & \vdots & \ddots & \vdots \\
0 & 0 & 0 & \cdots & \lambda_n
\end{bmatrix}
\end{aligned}
$$

## 微积分公式块测试

$$
\begin{aligned}
\frac{d}{dx}[f(x) + g(x)] &= f'(x) + g'(x) \\
\frac{d}{dx}[f(x) \cdot g(x)] &= f'(x) g(x) + f(x) g'(x) \\
\frac{d}{dx}\left[\frac{f(x)}{g(x)}\right] &= \frac{f'(x) g(x) - f(x) g'(x)}{[g(x)]^2} \\
\frac{d}{dx}[f(g(x))] &= f'(g(x)) \cdot g'(x) \\
\int_a^b f(x) \, dx &= F(b) - F(a) \quad \text{where } F'(x) = f(x) \\
\int u \, dv &= uv - \int v \, du \\
\int \frac{1}{x} \, dx &= \ln|x| + C \\
\int e^x \, dx &= e^x + C \\
\int \sin x \, dx &= -\cos x + C \\
\int \cos x \, dx &= \sin x + C \\
\int \tan x \, dx &= -\ln|\cos x| + C \\
\int \sec^2 x \, dx &= \tan x + C \\
\int \csc^2 x \, dx &= -\cot x + C \\
\int \sec x \tan x \, dx &= \sec x + C \\
\int \csc x \cot x \, dx &= -\csc x + C \\
\int \frac{1}{\sqrt{1-x^2}} \, dx &= \arcsin x + C \\
\int \frac{1}{1+x^2} \, dx &= \arctan x + C \\
\int \frac{1}{x\sqrt{x^2-1}} \, dx &= \operatorname{arcsec} x + C \\
\lim_{h \to 0} \frac{f(x+h) - f(x)}{h} &= f'(x) \\
\lim_{x \to a} \frac{f(x) - f(a)}{x - a} &= f'(a) \\
f''(x) &= \frac{d}{dx}[f'(x)] \\
f^{(n)}(x) &= \frac{d^n}{dx^n}[f(x)] \\
\int_a^b \int_{g_1(x)}^{g_2(x)} f(x,y) \, dy \, dx \\
\int_{\alpha}^{\beta} \int_{h_1(\theta)}^{h_2(\theta)} f(r,\theta) \, r \, dr \, d\theta \\
\iiint_V f(x,y,z) \, dV \\
\nabla f &= \left( \frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}, \frac{\partial f}{\partial z} \right) \\
\nabla \cdot \mathbf{F} &= \frac{\partial F_x}{\partial x} + \frac{\partial F_y}{\partial y} + \frac{\partial F_z}{\partial z} \\
\nabla \times \mathbf{F} &= \begin{vmatrix}
\mathbf{i} & \mathbf{j} & \mathbf{k} \\
\frac{\partial}{\partial x} & \frac{\partial}{\partial y} & \frac{\partial}{\partial z} \\
F_x & F_y & F_z
\end{vmatrix}
\end{aligned}
$$

## 概率论与统计学公式块测试

$$
\begin{aligned}
P(A \cup B) &= P(A) + P(B) - P(A \cap B) \\
P(A \cap B) &= P(A) \cdot P(B|A) = P(B) \cdot P(A|B) \\
P(A|B) &= \frac{P(A \cap B)}{P(B)} = \frac{P(B|A) \cdot P(A)}{P(B)} \\
P(\overline{A}) &= 1 - P(A) \\
P(A_1 \cup A_2 \cup \cdots \cup A_n) &= \sum_{i=1}^{n} P(A_i) - \sum_{1 \leq i < j \leq n} P(A_i \cap A_j) \\
&\quad + \sum_{1 \leq i < j < k \leq n} P(A_i \cap A_j \cap A_k) - \cdots + (-1)^{n+1} P(A_1 \cap A_2 \cap \cdots \cap A_n) \\
E[X] &= \sum_{i=1}^{n} x_i P(x_i) = \int_{-\infty}^{\infty} x f(x) \, dx \\
E[g(X)] &= \sum_{i=1}^{n} g(x_i) P(x_i) = \int_{-\infty}^{\infty} g(x) f(x) \, dx \\
E[aX + b] &= aE[X] + b \\
E[X + Y] &= E[X] + E[Y] \\
E[XY] &= E[X] \cdot E[Y] \quad \text{(if X and Y are independent)} \\
\operatorname{Var}(X) &= E[(X - E[X])^2] = E[X^2] - (E[X])^2 \\
\operatorname{Var}(aX + b) &= a^2 \operatorname{Var}(X) \\
\operatorname{Var}(X + Y) &= \operatorname{Var}(X) + \operatorname{Var}(Y) + 2\operatorname{Cov}(X, Y) \\
\operatorname{Cov}(X, Y) &= E[(X - E[X])(Y - E[Y])] = E[XY] - E[X]E[Y] \\
\rho_{X,Y} &= \frac{\operatorname{Cov}(X, Y)}{\sqrt{\operatorname{Var}(X) \operatorname{Var}(Y)}} \\
f_X(x) &= \int_{-\infty}^{\infty} f_{X,Y}(x, y) \, dy \\
f_{X|Y}(x|y) &= \frac{f_{X,Y}(x, y)}{f_Y(y)} \\
F_X(x) &= P(X \leq x) = \int_{-\infty}^{x} f_X(t) \, dt \\
f_X(x) &= \frac{d}{dx} F_X(x) \\
P(a \leq X \leq b) &= F_X(b) - F_X(a) = \int_a^b f_X(x) \, dx \\
\mu &= \frac{1}{n} \sum_{i=1}^{n} x_i \\
\sigma^2 &= \frac{1}{n} \sum_{i=1}^{n} (x_i - \mu)^2 \\
s^2 &= \frac{1}{n-1} \sum_{i=1}^{n} (x_i - \bar{x})^2 \\
\bar{x} &= \frac{1}{n} \sum_{i=1}^{n} x_i \\
s &= \sqrt{\frac{1}{n-1} \sum_{i=1}^{n} (x_i - \bar{x})^2} \\
z &= \frac{x - \mu}{\sigma} \\
t &= \frac{\bar{x} - \mu}{s / \sqrt{n}} \\
\chi^2 &= \sum_{i=1}^{n} \frac{(O_i - E_i)^2}{E_i} \\
F &= \frac{s_1^2 / \sigma_1^2}{s_2^2 / \sigma_2^2} \\
CI_{\mu} &= \bar{x} \pm z_{\alpha/2} \frac{\sigma}{\sqrt{n}} \\
CI_{\mu} &= \bar{x} \pm t_{\alpha/2, n-1} \frac{s}{\sqrt{n}} \\
CI_p &= \hat{p} \pm z_{\alpha/2} \sqrt{\frac{\hat{p}(1-\hat{p})}{n}} \\
H_0: \mu = \mu_0 \quad \text{vs.} \quad H_1: \mu \neq \mu_0 \\
z_{\text{test}} &= \frac{\bar{x} - \mu_0}{\sigma / \sqrt{n}} \\
t_{\text{test}} &= \frac{\bar{x} - \mu_0}{s / \sqrt{n}} \\
p\text{-value} &= P(|Z| \geq |z_{\text{test}}|) \\
\text{Reject } H_0 \text{ if } p\text{-value} < \alpha
\end{aligned}
$$

## 复变函数公式块测试

$$
\begin{aligned}
z &= x + iy = r(\cos \theta + i \sin \theta) = re^{i\theta} \\
|z| &= \sqrt{x^2 + y^2} = r \\
\arg(z) &= \arctan\left(\frac{y}{x}\right) = \theta \\
\overline{z} &= x - iy = re^{-i\theta} \\
z_1 + z_2 &= (x_1 + x_2) + i(y_1 + y_2) \\
z_1 \cdot z_2 &= r_1 r_2 e^{i(\theta_1 + \theta_2)} \\
\frac{z_1}{z_2} &= \frac{r_1}{r_2} e^{i(\theta_1 - \theta_2)} \\
z^n &= r^n e^{in\theta} = r^n (\cos n\theta + i \sin n\theta) \\
\sqrt[n]{z} &= \sqrt[n]{r} e^{i(\theta + 2k\pi)/n}, \quad k = 0, 1, \ldots, n-1 \\
e^z &= e^x (\cos y + i \sin y) \\
\sin z &= \frac{e^{iz} - e^{-iz}}{2i} \\
\cos z &= \frac{e^{iz} + e^{-iz}}{2} \\
\tan z &= \frac{\sin z}{\cos z} \\
\sinh z &= \frac{e^z - e^{-z}}{2} \\
\cosh z &= \frac{e^z + e^{-z}}{2} \\
\ln z &= \ln r + i(\theta + 2k\pi), \quad k \in \mathbb{Z} \\
f'(z) &= \lim_{\Delta z \to 0} \frac{f(z + \Delta z) - f(z)}{\Delta z} \\
\frac{\partial u}{\partial x} &= \frac{\partial v}{\partial y} \quad \text{(Cauchy-Riemann equations)} \\
\frac{\partial u}{\partial y} &= -\frac{\partial v}{\partial x} \\
\int_C f(z) \, dz &= \int_a^b f(z(t)) z'(t) \, dt \\
\oint_C f(z) \, dz &= 2\pi i \sum_{k=1}^{n} \operatorname{Res}(f, z_k) \\
\operatorname{Res}(f, z_0) &= \frac{1}{(n-1)!} \lim_{z \to z_0} \frac{d^{n-1}}{dz^{n-1}} [(z - z_0)^n f(z)] \\
f(z) &= \sum_{n=0}^{\infty} a_n (z - z_0)^n \\
a_n &= \frac{1}{2\pi i} \oint_C \frac{f(\zeta)}{(\zeta - z_0)^{n+1}} \, d\zeta \\
f(z) &= \sum_{n=-\infty}^{\infty} a_n (z - z_0)^n \\
a_n &= \frac{1}{2\pi i} \oint_C \frac{f(\zeta)}{(\zeta - z_0)^{n+1}} \, d\zeta
\end{aligned}
$$

## 偏微分方程公式块测试

$$
\begin{aligned}
\frac{\partial u}{\partial t} &= k \frac{\partial^2 u}{\partial x^2} \quad \text{(Heat equation)} \\
\frac{\partial^2 u}{\partial t^2} &= c^2 \frac{\partial^2 u}{\partial x^2} \quad \text{(Wave equation)} \\
\frac{\partial^2 u}{\partial x^2} + \frac{\partial^2 u}{\partial y^2} &= 0 \quad \text{(Laplace equation)} \\
\frac{\partial^2 u}{\partial x^2} + \frac{\partial^2 u}{\partial y^2} + \frac{\partial^2 u}{\partial z^2} &= 0 \\
\nabla^2 u &= \frac{\partial^2 u}{\partial x^2} + \frac{\partial^2 u}{\partial y^2} + \frac{\partial^2 u}{\partial z^2} \\
\nabla^2 u &= 0 \quad \text{(Laplace equation)} \\
\nabla^2 u &= f \quad \text{(Poisson equation)} \\
\frac{\partial u}{\partial t} + \mathbf{v} \cdot \nabla u &= \nu \nabla^2 u \\
\frac{\partial \mathbf{u}}{\partial t} + (\mathbf{u} \cdot \nabla) \mathbf{u} &= -\frac{1}{\rho} \nabla p + \nu \nabla^2 \mathbf{u} + \mathbf{g} \\
\nabla \cdot \mathbf{u} &= 0 \\
u(x,t) &= \sum_{n=1}^{\infty} B_n \sin\left(\frac{n\pi x}{L}\right) e^{-k(n\pi/L)^2 t} \\
B_n &= \frac{2}{L} \int_0^L f(x) \sin\left(\frac{n\pi x}{L}\right) \, dx \\
u(x,t) &= \sum_{n=1}^{\infty} \left[A_n \cos\left(\frac{n\pi ct}{L}\right) + B_n \sin\left(\frac{n\pi ct}{L}\right)\right] \sin\left(\frac{n\pi x}{L}\right) \\
A_n &= \frac{2}{L} \int_0^L f(x) \sin\left(\frac{n\pi x}{L}\right) \, dx \\
B_n &= \frac{2}{n\pi c} \int_0^L g(x) \sin\left(\frac{n\pi x}{L}\right) \, dx \\
u(x,y) &= \sum_{n=1}^{\infty} A_n \sinh\left(\frac{n\pi y}{L}\right) \sin\left(\frac{n\pi x}{L}\right) \\
A_n &= \frac{2}{L \sinh(n\pi H/L)} \int_0^L f(x) \sin\left(\frac{n\pi x}{L}\right) \, dx \\
u(r,\theta) &= \frac{a_0}{2} + \sum_{n=1}^{\infty} \left[a_n \cos(n\theta) + b_n \sin(n\theta)\right] r^n \\
a_n &= \frac{1}{\pi R^n} \int_0^{2\pi} f(\theta) \cos(n\theta) \, d\theta \\
b_n &= \frac{1}{\pi R^n} \int_0^{2\pi} f(\theta) \sin(n\theta) \, d\theta
\end{aligned}
$$

## 测试总结

本文档包含以下超长数学公式块：

1. **线性代数公式块**：包含矩阵运算、特征值、特征向量、范数等
2. **微积分公式块**：包含导数、积分、多重积分、向量微积分等
3. **概率论与统计学公式块**：包含概率、期望、方差、假设检验等
4. **复变函数公式块**：包含复数运算、解析函数、留数定理等
5. **偏微分方程公式块**：包含热方程、波动方程、拉普拉斯方程等

这些公式块都设计为超过一页 A4 纸的高度，用于测试 PDF 导出时的分页和截断功能。

## 测试要点

- ✅ 数学公式块超过一页高度时应该被截断
- ✅ 分页应该在合适的位置进行
- ✅ 每个公式块应该能够正确显示在 PDF 中
- ✅ 数学公式块使用和 Mermaid 一样的分页逻辑（允许截断）
