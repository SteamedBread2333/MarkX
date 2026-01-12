# 超长数学公式测试文档

这是一个用于测试 PDF 导出功能的测试文档，包含超长的数学公式。

## 测试说明

本文档包含多个超长的数学公式，用于测试：
- 数学公式的渲染和显示
- 超长公式的分行和换行处理
- PDF 导出时公式的格式保持
- LaTeX 数学公式的复杂嵌套

## 1. 多重积分公式

### 三重积分

$$
\iiint_V f(x, y, z) \, dx \, dy \, dz = \int_{a_1}^{a_2} \int_{b_1(x)}^{b_2(x)} \int_{c_1(x,y)}^{c_2(x,y)} f(x, y, z) \, dz \, dy \, dx
$$

### 高维积分

$$
\int_{-\infty}^{\infty} \int_{-\infty}^{\infty} \int_{-\infty}^{\infty} \int_{-\infty}^{\infty} \exp\left(-\frac{x_1^2 + x_2^2 + x_3^2 + x_4^2}{2\sigma^2}\right) \, dx_1 \, dx_2 \, dx_3 \, dx_4 = (2\pi\sigma^2)^2
$$

## 2. 级数展开公式

### 泰勒级数展开

$$
f(x) = \sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n!}(x-a)^n = f(a) + f'(a)(x-a) + \frac{f''(a)}{2!}(x-a)^2 + \frac{f'''(a)}{3!}(x-a)^3 + \cdots + \frac{f^{(n)}(a)}{n!}(x-a)^n + \cdots
$$

### 傅里叶级数

$$
f(x) = \frac{a_0}{2} + \sum_{n=1}^{\infty} \left[a_n \cos\left(\frac{2\pi nx}{T}\right) + b_n \sin\left(\frac{2\pi nx}{T}\right)\right]
$$

其中：

$$
a_n = \frac{2}{T} \int_{0}^{T} f(x) \cos\left(\frac{2\pi nx}{T}\right) \, dx, \quad b_n = \frac{2}{T} \int_{0}^{T} f(x) \sin\left(\frac{2\pi nx}{T}\right) \, dx
$$

### 复指数形式的傅里叶级数

$$
f(x) = \sum_{n=-\infty}^{\infty} c_n e^{i\frac{2\pi nx}{T}}, \quad \text{其中} \quad c_n = \frac{1}{T} \int_{0}^{T} f(x) e^{-i\frac{2\pi nx}{T}} \, dx
$$

## 3. 矩阵运算公式

### 矩阵行列式

$$
\det(A) = \sum_{\sigma \in S_n} \operatorname{sgn}(\sigma) \prod_{i=1}^{n} a_{i,\sigma(i)} = \sum_{j=1}^{n} (-1)^{i+j} a_{ij} \det(A_{ij})
$$

### 矩阵的特征值分解

$$
A = P \Lambda P^{-1} = \begin{bmatrix} \mathbf{v}_1 & \mathbf{v}_2 & \cdots & \mathbf{v}_n \end{bmatrix} \begin{bmatrix} \lambda_1 & 0 & \cdots & 0 \\ 0 & \lambda_2 & \cdots & 0 \\ \vdots & \vdots & \ddots & \vdots \\ 0 & 0 & \cdots & \lambda_n \end{bmatrix} \begin{bmatrix} \mathbf{v}_1 & \mathbf{v}_2 & \cdots & \mathbf{v}_n \end{bmatrix}^{-1}
$$

### 矩阵的奇异值分解

$$
A = U \Sigma V^T = \sum_{i=1}^{r} \sigma_i \mathbf{u}_i \mathbf{v}_i^T = \begin{bmatrix} \mathbf{u}_1 & \mathbf{u}_2 & \cdots & \mathbf{u}_m \end{bmatrix} \begin{bmatrix} \sigma_1 & 0 & \cdots & 0 & 0 \\ 0 & \sigma_2 & \cdots & 0 & 0 \\ \vdots & \vdots & \ddots & \vdots & \vdots \\ 0 & 0 & \cdots & \sigma_r & 0 \\ 0 & 0 & \cdots & 0 & 0 \end{bmatrix} \begin{bmatrix} \mathbf{v}_1^T \\ \mathbf{v}_2^T \\ \vdots \\ \mathbf{v}_n^T \end{bmatrix}
$$

## 4. 微分方程

### 二阶线性齐次微分方程的通解

$$
y(x) = C_1 e^{r_1 x} + C_2 e^{r_2 x} = C_1 e^{\frac{-b + \sqrt{b^2 - 4ac}}{2a} x} + C_2 e^{\frac{-b - \sqrt{b^2 - 4ac}}{2a} x}
$$

### 偏微分方程 - 热传导方程

$$
\frac{\partial u}{\partial t} = \alpha \nabla^2 u = \alpha \left(\frac{\partial^2 u}{\partial x^2} + \frac{\partial^2 u}{\partial y^2} + \frac{\partial^2 u}{\partial z^2}\right)
$$

### 波动方程

$$
\frac{\partial^2 u}{\partial t^2} = c^2 \nabla^2 u = c^2 \left(\frac{\partial^2 u}{\partial x^2} + \frac{\partial^2 u}{\partial y^2} + \frac{\partial^2 u}{\partial z^2}\right)
$$

## 5. 概率论公式

### 贝叶斯定理

$$
P(A|B) = \frac{P(B|A) P(A)}{P(B)} = \frac{P(B|A) P(A)}{\sum_{i=1}^{n} P(B|A_i) P(A_i)} = \frac{P(B|A) P(A)}{P(B|A) P(A) + P(B|\neg A) P(\neg A)}
$$

### 全概率公式

$$
P(B) = \sum_{i=1}^{n} P(B|A_i) P(A_i) = P(B|A_1) P(A_1) + P(B|A_2) P(A_2) + \cdots + P(B|A_n) P(A_n)
$$

### 多维正态分布

$$
f(\mathbf{x}) = \frac{1}{\sqrt{(2\pi)^k |\boldsymbol{\Sigma}|}} \exp\left(-\frac{1}{2}(\mathbf{x} - \boldsymbol{\mu})^T \boldsymbol{\Sigma}^{-1} (\mathbf{x} - \boldsymbol{\mu})\right)
$$

其中 $\mathbf{x} \in \mathbb{R}^k$，$\boldsymbol{\mu}$ 是均值向量，$\boldsymbol{\Sigma}$ 是协方差矩阵。

## 6. 统计学公式

### 线性回归的最小二乘估计

$$
\hat{\boldsymbol{\beta}} = (\mathbf{X}^T \mathbf{X})^{-1} \mathbf{X}^T \mathbf{y} = \arg\min_{\boldsymbol{\beta}} \|\mathbf{y} - \mathbf{X}\boldsymbol{\beta}\|^2 = \arg\min_{\boldsymbol{\beta}} \sum_{i=1}^{n} (y_i - \mathbf{x}_i^T \boldsymbol{\beta})^2
$$

### 协方差矩阵

$$
\boldsymbol{\Sigma} = \begin{bmatrix} \sigma_{11} & \sigma_{12} & \cdots & \sigma_{1n} \\ \sigma_{21} & \sigma_{22} & \cdots & \sigma_{2n} \\ \vdots & \vdots & \ddots & \vdots \\ \sigma_{n1} & \sigma_{n2} & \cdots & \sigma_{nn} \end{bmatrix}
$$

其中 $\sigma_{ij} = \operatorname{Cov}(X_i, X_j) = E[(X_i - \mu_i)(X_j - \mu_j)]$。

## 7. 复变函数

### 柯西积分公式

$$
f(z_0) = \frac{1}{2\pi i} \oint_C \frac{f(z)}{z - z_0} \, dz = \frac{1}{2\pi i} \int_{0}^{2\pi} \frac{f(z_0 + re^{i\theta})}{re^{i\theta}} \cdot ire^{i\theta} \, d\theta
$$

### 留数定理

$$
\oint_C f(z) \, dz = 2\pi i \sum_{k=1}^{n} \operatorname{Res}(f, z_k) = 2\pi i \sum_{k=1}^{n} \lim_{z \to z_k} \frac{1}{(m_k - 1)!} \frac{d^{m_k - 1}}{dz^{m_k - 1}} \left[(z - z_k)^{m_k} f(z)\right]
$$

## 8. 量子力学公式

### 薛定谔方程

$$
i\hbar \frac{\partial}{\partial t} \Psi(\mathbf{r}, t) = \hat{H} \Psi(\mathbf{r}, t) = \left[-\frac{\hbar^2}{2m} \nabla^2 + V(\mathbf{r}, t)\right] \Psi(\mathbf{r}, t)
$$

### 时间无关的薛定谔方程

$$
\hat{H} \psi(\mathbf{r}) = E \psi(\mathbf{r}) \quad \Rightarrow \quad -\frac{\hbar^2}{2m} \nabla^2 \psi(\mathbf{r}) + V(\mathbf{r}) \psi(\mathbf{r}) = E \psi(\mathbf{r})
$$

### 不确定性原理

$$
\sigma_x \sigma_p \geq \frac{\hbar}{2}, \quad \sigma_E \sigma_t \geq \frac{\hbar}{2}
$$

## 9. 电磁学公式

### 麦克斯韦方程组

$$
\begin{aligned}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\varepsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0 \mathbf{J} + \mu_0 \varepsilon_0 \frac{\partial \mathbf{E}}{\partial t}
\end{aligned}
$$

### 洛伦兹力

$$
\mathbf{F} = q(\mathbf{E} + \mathbf{v} \times \mathbf{B}) = q\mathbf{E} + q(\mathbf{v} \times \mathbf{B}) = q\left[\mathbf{E} + (\mathbf{v} \times \mathbf{B})\right]
$$

## 10. 泛函分析

### 变分法 - 欧拉-拉格朗日方程

$$
\frac{\partial L}{\partial q} - \frac{d}{dt} \frac{\partial L}{\partial \dot{q}} = 0 \quad \Rightarrow \quad \frac{\partial L}{\partial q_i} - \frac{d}{dt} \frac{\partial L}{\partial \dot{q}_i} = 0, \quad i = 1, 2, \ldots, n
$$

### 泛函的变分

$$
\delta J[y] = \int_{a}^{b} \left[\frac{\partial F}{\partial y} - \frac{d}{dx} \frac{\partial F}{\partial y'}\right] \delta y \, dx + \left[\frac{\partial F}{\partial y'} \delta y\right]_{a}^{b}
$$

## 11. 数论公式

### 黎曼 ζ 函数

$$
\zeta(s) = \sum_{n=1}^{\infty} \frac{1}{n^s} = \prod_{p \text{ prime}} \frac{1}{1 - p^{-s}} = \frac{1}{\Gamma(s)} \int_{0}^{\infty} \frac{x^{s-1}}{e^x - 1} \, dx
$$

### 欧拉乘积公式

$$
\sum_{n=1}^{\infty} \frac{1}{n^s} = \prod_{p \text{ prime}} \left(1 + \frac{1}{p^s} + \frac{1}{p^{2s}} + \frac{1}{p^{3s}} + \cdots\right) = \prod_{p \text{ prime}} \frac{1}{1 - p^{-s}}
$$

## 12. 组合数学

### 斯特林数

$$
S(n, k) = \frac{1}{k!} \sum_{j=0}^{k} (-1)^{k-j} \binom{k}{j} j^n = \sum_{j=0}^{k} \frac{(-1)^{k-j} j^n}{j!(k-j)!}
$$

### 生成函数

$$
G(x) = \sum_{n=0}^{\infty} a_n x^n = a_0 + a_1 x + a_2 x^2 + a_3 x^3 + \cdots + a_n x^n + \cdots
$$

## 13. 超长积分公式

### 高斯积分

$$
\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}, \quad \int_{-\infty}^{\infty} e^{-ax^2 + bx + c} \, dx = \sqrt{\frac{\pi}{a}} e^{\frac{b^2}{4a} + c}
$$

### 费曼路径积分

$$
\langle x_f, t_f | x_i, t_i \rangle = \int \mathcal{D}[x(t)] \exp\left(\frac{i}{\hbar} \int_{t_i}^{t_f} L(x(t), \dot{x}(t), t) \, dt\right)
$$

### 多重高斯积分

$$
\int_{-\infty}^{\infty} \cdots \int_{-\infty}^{\infty} \exp\left(-\frac{1}{2} \sum_{i,j=1}^{n} A_{ij} x_i x_j + \sum_{i=1}^{n} b_i x_i\right) \, dx_1 \cdots dx_n = \sqrt{\frac{(2\pi)^n}{\det(A)}} \exp\left(\frac{1}{2} \mathbf{b}^T A^{-1} \mathbf{b}\right)
$$

## 14. 超长求和公式

### 多重求和

$$
\sum_{i_1=1}^{n_1} \sum_{i_2=1}^{n_2} \cdots \sum_{i_k=1}^{n_k} a_{i_1 i_2 \cdots i_k} = \sum_{i_1=1}^{n_1} \left[\sum_{i_2=1}^{n_2} \left[\cdots \left[\sum_{i_k=1}^{n_k} a_{i_1 i_2 \cdots i_k}\right]\right]\right]
$$

### 二项式定理

$$
(x + y)^n = \sum_{k=0}^{n} \binom{n}{k} x^{n-k} y^k = \sum_{k=0}^{n} \frac{n!}{k!(n-k)!} x^{n-k} y^k
$$

### 超几何级数

$$
{}_2F_1(a, b; c; z) = \sum_{n=0}^{\infty} \frac{(a)_n (b)_n}{(c)_n} \frac{z^n}{n!} = 1 + \frac{ab}{c} \frac{z}{1!} + \frac{a(a+1)b(b+1)}{c(c+1)} \frac{z^2}{2!} + \cdots
$$

其中 $(a)_n = a(a+1)(a+2) \cdots (a+n-1)$ 是 Pochhammer 符号。

## 15. 超长矩阵公式

### 矩阵的幂级数展开

$$
e^A = \sum_{n=0}^{\infty} \frac{A^n}{n!} = I + A + \frac{A^2}{2!} + \frac{A^3}{3!} + \cdots + \frac{A^n}{n!} + \cdots
$$

### 矩阵的对数

$$
\ln(I + A) = \sum_{n=1}^{\infty} \frac{(-1)^{n+1}}{n} A^n = A - \frac{A^2}{2} + \frac{A^3}{3} - \frac{A^4}{4} + \cdots
$$

### 矩阵的逆（Neumann 级数）

$$
(I - A)^{-1} = \sum_{n=0}^{\infty} A^n = I + A + A^2 + A^3 + \cdots, \quad \text{当} \quad \|A\| < 1
$$

## 16. 超长微分公式

### 链式法则（多变量）

$$
\frac{\partial f}{\partial x_i} = \sum_{j=1}^{m} \frac{\partial f}{\partial y_j} \frac{\partial y_j}{\partial x_i} = \frac{\partial f}{\partial y_1} \frac{\partial y_1}{\partial x_i} + \frac{\partial f}{\partial y_2} \frac{\partial y_2}{\partial x_i} + \cdots + \frac{\partial f}{\partial y_m} \frac{\partial y_m}{\partial x_i}
$$

### 高阶偏导数

$$
\frac{\partial^n f}{\partial x_1^{n_1} \partial x_2^{n_2} \cdots \partial x_k^{n_k}} = \frac{\partial^{n_1 + n_2 + \cdots + n_k} f}{\partial x_1^{n_1} \partial x_2^{n_2} \cdots \partial x_k^{n_k}}
$$

## 17. 超长极限公式

### L'Hôpital 法则（高阶）

$$
\lim_{x \to a} \frac{f(x)}{g(x)} = \lim_{x \to a} \frac{f'(x)}{g'(x)} = \lim_{x \to a} \frac{f''(x)}{g''(x)} = \cdots = \lim_{x \to a} \frac{f^{(n)}(x)}{g^{(n)}(x)}
$$

### 重要极限

$$
\lim_{n \to \infty} \left(1 + \frac{1}{n}\right)^n = e, \quad \lim_{x \to 0} \frac{\sin x}{x} = 1, \quad \lim_{x \to 0} \frac{e^x - 1}{x} = 1
$$

## 18. 超长连分数

$$
x = a_0 + \cfrac{1}{a_1 + \cfrac{1}{a_2 + \cfrac{1}{a_3 + \cfrac{1}{a_4 + \cfrac{1}{a_5 + \cfrac{1}{a_6 + \cfrac{1}{a_7 + \cfrac{1}{a_8 + \cfrac{1}{a_9 + \cfrac{1}{a_{10} + \cdots}}}}}}}}}}
$$

## 19. 超长乘积公式

### 无穷乘积

$$
\prod_{n=1}^{\infty} \left(1 + a_n\right) = \lim_{N \to \infty} \prod_{n=1}^{N} (1 + a_n) = (1 + a_1)(1 + a_2)(1 + a_3) \cdots (1 + a_n) \cdots
$$

### 欧拉乘积

$$
\prod_{p \text{ prime}} \frac{1}{1 - p^{-s}} = \prod_{p \text{ prime}} \left(1 + \frac{1}{p^s} + \frac{1}{p^{2s}} + \frac{1}{p^{3s}} + \cdots\right) = \sum_{n=1}^{\infty} \frac{1}{n^s}
$$

## 20. 超长嵌套公式

### 多重嵌套积分

$$
I = \int_{a_1}^{b_1} \int_{a_2(x_1)}^{b_2(x_1)} \int_{a_3(x_1,x_2)}^{b_3(x_1,x_2)} \cdots \int_{a_n(x_1,\ldots,x_{n-1})}^{b_n(x_1,\ldots,x_{n-1})} f(x_1, x_2, \ldots, x_n) \, dx_n \cdots dx_2 \, dx_1
$$

### 多重嵌套求和

$$
S = \sum_{i_1=1}^{m_1} \sum_{i_2=1}^{m_2} \sum_{i_3=1}^{m_3} \cdots \sum_{i_n=1}^{m_n} a_{i_1, i_2, \ldots, i_n} \prod_{j=1}^{n} w_{i_j}^{(j)}
$$

## 21. 超长分式公式

$$
\frac{a_0 + a_1 x + a_2 x^2 + a_3 x^3 + \cdots + a_n x^n}{b_0 + b_1 x + b_2 x^2 + b_3 x^3 + \cdots + b_m x^m} = \frac{\sum_{i=0}^{n} a_i x^i}{\sum_{j=0}^{m} b_j x^j}
$$

## 22. 超长根式公式

$$
\sqrt{a_0 + \sqrt{a_1 + \sqrt{a_2 + \sqrt{a_3 + \sqrt{a_4 + \sqrt{a_5 + \sqrt{a_6 + \sqrt{a_7 + \sqrt{a_8 + \sqrt{a_9 + \sqrt{a_{10} + \cdots}}}}}}}}}}}
$$

## 23. 超长指数公式

$$
e^{x + y + z + w + u + v} = e^x \cdot e^y \cdot e^z \cdot e^w \cdot e^u \cdot e^v = \prod_{i=1}^{6} e^{x_i}
$$

$$
\exp\left(\sum_{i=1}^{n} x_i\right) = \prod_{i=1}^{n} \exp(x_i) = \exp(x_1) \cdot \exp(x_2) \cdot \exp(x_3) \cdots \exp(x_n)
$$

## 24. 超长对数公式

$$
\ln\left(\prod_{i=1}^{n} x_i\right) = \sum_{i=1}^{n} \ln(x_i) = \ln(x_1) + \ln(x_2) + \ln(x_3) + \cdots + \ln(x_n)
$$

$$
\log_a \left(\frac{x_1 \cdot x_2 \cdot x_3 \cdots x_n}{y_1 \cdot y_2 \cdot y_3 \cdots y_m}\right) = \sum_{i=1}^{n} \log_a(x_i) - \sum_{j=1}^{m} \log_a(y_j)
$$

## 25. 超长三角函数公式

### 多角公式

$$
\sin(n\theta) = \sum_{k=0}^{\lfloor n/2 \rfloor} (-1)^k \binom{n}{2k+1} \cos^{n-2k-1}(\theta) \sin^{2k+1}(\theta)
$$

$$
\cos(n\theta) = \sum_{k=0}^{\lfloor n/2 \rfloor} (-1)^k \binom{n}{2k} \cos^{n-2k}(\theta) \sin^{2k}(\theta)
$$

### 积化和差

$$
\sin(\alpha) \sin(\beta) = \frac{1}{2}[\cos(\alpha - \beta) - \cos(\alpha + \beta)]
$$

$$
\cos(\alpha) \cos(\beta) = \frac{1}{2}[\cos(\alpha - \beta) + \cos(\alpha + \beta)]
$$

$$
\sin(\alpha) \cos(\beta) = \frac{1}{2}[\sin(\alpha + \beta) + \sin(\alpha - \beta)]
$$

## 26. 超长组合公式

### 多重组合

$$
\binom{n}{k_1, k_2, \ldots, k_m} = \frac{n!}{k_1! k_2! \cdots k_m!} = \frac{n!}{\prod_{i=1}^{m} k_i!}
$$

其中 $k_1 + k_2 + \cdots + k_m = n$。

### 二项式系数的性质

$$
\sum_{k=0}^{n} \binom{n}{k} = 2^n, \quad \sum_{k=0}^{n} (-1)^k \binom{n}{k} = 0, \quad \sum_{k=0}^{n} k \binom{n}{k} = n \cdot 2^{n-1}
$$

## 27. 超长向量公式

### 向量三重积

$$
\mathbf{a} \times (\mathbf{b} \times \mathbf{c}) = (\mathbf{a} \cdot \mathbf{c}) \mathbf{b} - (\mathbf{a} \cdot \mathbf{b}) \mathbf{c}
$$

### 向量场的散度和旋度

$$
\nabla \cdot \mathbf{F} = \frac{\partial F_x}{\partial x} + \frac{\partial F_y}{\partial y} + \frac{\partial F_z}{\partial z}
$$

$$
\nabla \times \mathbf{F} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ \frac{\partial}{\partial x} & \frac{\partial}{\partial y} & \frac{\partial}{\partial z} \\ F_x & F_y & F_z \end{vmatrix} = \left(\frac{\partial F_z}{\partial y} - \frac{\partial F_y}{\partial z}\right) \mathbf{i} - \left(\frac{\partial F_z}{\partial x} - \frac{\partial F_x}{\partial z}\right) \mathbf{j} + \left(\frac{\partial F_y}{\partial x} - \frac{\partial F_x}{\partial y}\right) \mathbf{k}
$$

## 28. 超长张量公式

### 爱因斯坦求和约定

$$
A_{ij} B_{jk} C_{kl} = \sum_{j=1}^{n} \sum_{k=1}^{n} A_{ij} B_{jk} C_{kl}
$$

### 张量的缩并

$$
T^{i_1 i_2 \cdots i_p}_{j_1 j_2 \cdots j_q} \delta^{j_k}_{i_l} = T^{i_1 \cdots \hat{i_l} \cdots i_p}_{j_1 \cdots \hat{j_k} \cdots j_q}
$$

## 29. 超长微分几何公式

### 第一基本形式

$$
ds^2 = E \, du^2 + 2F \, du \, dv + G \, dv^2 = \sum_{i,j=1}^{2} g_{ij} \, dx^i \, dx^j
$$

### 第二基本形式

$$
L \, du^2 + 2M \, du \, dv + N \, dv^2 = \sum_{i,j=1}^{2} h_{ij} \, dx^i \, dx^j
$$

### 高斯曲率

$$
K = \frac{LN - M^2}{EG - F^2} = \frac{\det(h_{ij})}{\det(g_{ij})}
$$

## 30. 超长统计物理公式

### 配分函数

$$
Z = \sum_{i} e^{-\beta E_i} = \int e^{-\beta H(\mathbf{q}, \mathbf{p})} \, d\mathbf{q} \, d\mathbf{p}
$$

### 玻尔兹曼分布

$$
P_i = \frac{e^{-\beta E_i}}{Z} = \frac{e^{-E_i / k_B T}}{\sum_{j} e^{-E_j / k_B T}}
$$

### 自由能

$$
F = -k_B T \ln Z = -k_B T \ln \left(\sum_{i} e^{-\beta E_i}\right) = -k_B T \ln \left(\int e^{-\beta H(\mathbf{q}, \mathbf{p})} \, d\mathbf{q} \, d\mathbf{p}\right)
$$

---

## 总结

本文档包含了各种超长的数学公式，涵盖了：
- 多重积分和级数
- 矩阵运算和线性代数
- 微分方程和偏微分方程
- 概率论和统计学
- 复变函数和泛函分析
- 量子力学和电磁学
- 数论和组合数学
- 以及其他各种复杂的数学表达式

这些公式可以用来测试 Markdown 编辑器和 PDF 导出功能对复杂数学公式的处理能力。
