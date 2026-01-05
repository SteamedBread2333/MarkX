# 超长代码块测试文档

这是一个用于测试 PDF 导出功能的测试文档，包含超长的代码块。

## 测试说明

本文档包含多个超长的代码块，用于测试：
- 代码块超过一页高度时的截断功能
- 分页逻辑是否正确处理超长代码块
- 代码块应该允许截断（和 Mermaid 一样的分页逻辑）

## JavaScript 超长代码块测试

```javascript
// 这是一个非常长的 JavaScript 代码块，用于测试 PDF 导出时的分页功能
// 代码块应该允许截断，如果超过一页高度，应该被分页显示

// 导入必要的模块
import React from 'react';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import moment from 'moment';
import lodash from 'lodash';

// 定义常量
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_COUNT = 3;
const TIMEOUT_DURATION = 5000;
const DEFAULT_PAGE_SIZE = 20;

// 定义类型接口
interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    stock: number;
    rating: number;
}

interface Order {
    id: string;
    userId: string;
    products: Product[];
    totalAmount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}

// 工具函数
function formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

function formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
    return moment(date).format(format);
}

function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;
    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// API 服务类
class ApiService {
    private baseURL: string;
    private defaultHeaders: Record<string, string>;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    async get<T>(endpoint: string, config?: any): Promise<T> {
        try {
            const response = await axios.get(`${this.baseURL}${endpoint}`, {
                ...config,
                headers: { ...this.defaultHeaders, ...config?.headers }
            });
            return response.data;
        } catch (error) {
            console.error('GET request failed:', error);
            throw error;
        }
    }

    async post<T>(endpoint: string, data?: any, config?: any): Promise<T> {
        try {
            const response = await axios.post(
                `${this.baseURL}${endpoint}`,
                data,
                {
                    ...config,
                    headers: { ...this.defaultHeaders, ...config?.headers }
                }
            );
            return response.data;
        } catch (error) {
            console.error('POST request failed:', error);
            throw error;
        }
    }

    async put<T>(endpoint: string, data?: any, config?: any): Promise<T> {
        try {
            const response = await axios.put(
                `${this.baseURL}${endpoint}`,
                data,
                {
                    ...config,
                    headers: { ...this.defaultHeaders, ...config?.headers }
                }
            );
            return response.data;
        } catch (error) {
            console.error('PUT request failed:', error);
            throw error;
        }
    }

    async delete<T>(endpoint: string, config?: any): Promise<T> {
        try {
            const response = await axios.delete(`${this.baseURL}${endpoint}`, {
                ...config,
                headers: { ...this.defaultHeaders, ...config?.headers }
            });
            return response.data;
        } catch (error) {
            console.error('DELETE request failed:', error);
            throw error;
        }
    }
}

// React 组件
const UserProfile: React.FC<{ userId: string }> = ({ userId }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const apiService = useMemo(() => new ApiService(API_BASE_URL), []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const userData = await apiService.get<User>(`/users/${userId}`);
                setUser(userData);
                setError(null);
            } catch (err) {
                setError('Failed to load user data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId, apiService]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!user) return <div>User not found</div>;

    return (
        <div className="user-profile">
            <img src={user.avatar || '/default-avatar.png'} alt={user.name} />
            <h1>{user.name}</h1>
            <p>{user.email}</p>
            <p>Joined: {formatDate(user.createdAt)}</p>
        </div>
    );
};

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const apiService = useMemo(() => new ApiService(API_BASE_URL), []);

    const fetchProducts = useCallback(async (pageNum: number) => {
        try {
            setLoading(true);
            const response = await apiService.get<{
                products: Product[];
                hasMore: boolean;
            }>(`/products?page=${pageNum}&size=${DEFAULT_PAGE_SIZE}`);
            setProducts((prev) => [...prev, ...response.products]);
            setHasMore(response.hasMore);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    }, [apiService]);

    useEffect(() => {
        fetchProducts(page);
    }, [page, fetchProducts]);

    const lastProductElementRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loading) return;
            if (observerRef.current) observerRef.current.disconnect();
            observerRef.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => prev + 1);
                }
            });
            if (node) observerRef.current.observe(node);
        },
        [loading, hasMore]
    );

    return (
        <div className="product-list">
            {products.map((product, index) => (
                <div
                    key={product.id}
                    ref={index === products.length - 1 ? lastProductElementRef : null}
                    className="product-card"
                >
                    <img src={product.images[0]} alt={product.name} />
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <p>{formatCurrency(product.price)}</p>
                    <p>Rating: {product.rating}/5</p>
                </div>
            ))}
            {loading && <div>Loading more products...</div>}
        </div>
    );
};

// 导出组件
export default UserProfile;
export { ProductList, ApiService, formatCurrency, formatDate };
```

## Python 超长代码块测试

```python
# 这是一个非常长的 Python 代码块，用于测试 PDF 导出时的分页功能
# 代码块应该允许截断，如果超过一页高度，应该被分页显示

import os
import sys
import json
import logging
from typing import List, Dict, Optional, Tuple, Any
from datetime import datetime, timedelta
from dataclasses import dataclass, field
from enum import Enum
from abc import ABC, abstractmethod
import asyncio
import aiohttp
from functools import wraps, lru_cache
import hashlib
import base64
import uuid

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# 定义枚举类型
class OrderStatus(Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class PaymentMethod(Enum):
    CREDIT_CARD = "credit_card"
    DEBIT_CARD = "debit_card"
    PAYPAL = "paypal"
    BANK_TRANSFER = "bank_transfer"

# 定义数据类
@dataclass
class User:
    id: str
    name: str
    email: str
    avatar: Optional[str] = None
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)

@dataclass
class Product:
    id: str
    name: str
    description: str
    price: float
    category: str
    images: List[str] = field(default_factory=list)
    stock: int = 0
    rating: float = 0.0

@dataclass
class Order:
    id: str
    user_id: str
    products: List[Product] = field(default_factory=list)
    total_amount: float = 0.0
    status: OrderStatus = OrderStatus.PENDING
    payment_method: PaymentMethod = PaymentMethod.CREDIT_CARD
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)

# 工具函数
def format_currency(amount: float, currency: str = "USD") -> str:
    """格式化货币金额"""
    return f"{currency} ${amount:,.2f}"

def format_date(date: datetime, format_str: str = "%Y-%m-%d") -> str:
    """格式化日期"""
    return date.strftime(format_str)

def calculate_hash(data: str) -> str:
    """计算字符串的 SHA256 哈希值"""
    return hashlib.sha256(data.encode()).hexdigest()

def generate_uuid() -> str:
    """生成 UUID"""
    return str(uuid.uuid4())

@lru_cache(maxsize=128)
def expensive_computation(n: int) -> int:
    """昂贵的计算函数，使用缓存优化"""
    result = 0
    for i in range(n):
        result += i ** 2
    return result

# 装饰器
def retry(max_attempts: int = 3, delay: float = 1.0):
    """重试装饰器"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return await func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
                    logger.warning(f"Attempt {attempt + 1} failed: {e}")
                    await asyncio.sleep(delay * (attempt + 1))
        return wrapper
    return decorator

def timing_decorator(func):
    """计时装饰器"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = datetime.now()
        result = func(*args, **kwargs)
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        logger.info(f"{func.__name__} took {duration:.2f} seconds")
        return result
    return wrapper

# 抽象基类
class Database(ABC):
    @abstractmethod
    async def connect(self) -> None:
        """连接数据库"""
        pass

    @abstractmethod
    async def disconnect(self) -> None:
        """断开数据库连接"""
        pass

    @abstractmethod
    async def query(self, sql: str, params: Dict[str, Any]) -> List[Dict]:
        """执行查询"""
        pass

    @abstractmethod
    async def execute(self, sql: str, params: Dict[str, Any]) -> int:
        """执行更新操作"""
        pass

# 具体实现类
class MySQLDatabase(Database):
    def __init__(self, host: str, port: int, database: str, user: str, password: str):
        self.host = host
        self.port = port
        self.database = database
        self.user = user
        self.password = password
        self.connection = None

    async def connect(self) -> None:
        """连接 MySQL 数据库"""
        logger.info(f"Connecting to MySQL at {self.host}:{self.port}")
        # 实际的连接逻辑
        self.connection = "connected"

    async def disconnect(self) -> None:
        """断开 MySQL 数据库连接"""
        logger.info("Disconnecting from MySQL")
        self.connection = None

    async def query(self, sql: str, params: Dict[str, Any]) -> List[Dict]:
        """执行 MySQL 查询"""
        logger.info(f"Executing query: {sql}")
        # 实际的查询逻辑
        return []

    async def execute(self, sql: str, params: Dict[str, Any]) -> int:
        """执行 MySQL 更新操作"""
        logger.info(f"Executing update: {sql}")
        # 实际的更新逻辑
        return 0

# API 服务类
class ApiService:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.session: Optional[aiohttp.ClientSession] = None

    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()

    @retry(max_attempts=3, delay=1.0)
    async def get(self, endpoint: str, params: Optional[Dict] = None) -> Dict:
        """发送 GET 请求"""
        url = f"{self.base_url}{endpoint}"
        async with self.session.get(url, params=params) as response:
            response.raise_for_status()
            return await response.json()

    @retry(max_attempts=3, delay=1.0)
    async def post(self, endpoint: str, data: Optional[Dict] = None) -> Dict:
        """发送 POST 请求"""
        url = f"{self.base_url}{endpoint}"
        async with self.session.post(url, json=data) as response:
            response.raise_for_status()
            return await response.json()

# 主函数
async def main():
    """主函数"""
    db = MySQLDatabase(
        host="localhost",
        port=3306,
        database="testdb",
        user="testuser",
        password="testpass"
    )
    
    await db.connect()
    
    try:
        users = await db.query("SELECT * FROM users WHERE active = :active", {"active": True})
        logger.info(f"Found {len(users)} active users")
    finally:
        await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
```

## SQL 超长代码块测试

```sql
-- 这是一个非常长的 SQL 代码块，用于测试 PDF 导出时的分页功能
-- 代码块应该允许截断，如果超过一页高度，应该被分页显示

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    phone_number VARCHAR(20),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_created_at (created_at),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建产品表
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id VARCHAR(36),
    brand VARCHAR(100),
    sku VARCHAR(100) UNIQUE,
    weight DECIMAL(8, 2),
    dimensions VARCHAR(100),
    stock_quantity INT DEFAULT 0,
    min_stock_level INT DEFAULT 10,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category_id),
    INDEX idx_price (price),
    INDEX idx_rating (rating),
    INDEX idx_is_active (is_active),
    INDEX idx_is_featured (is_featured),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建订单表
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    payment_method ENUM('credit_card', 'debit_card', 'paypal', 'bank_transfer') NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    subtotal DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    shipping_cost DECIMAL(10, 2) DEFAULT 0.00,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_address TEXT NOT NULL,
    billing_address TEXT,
    notes TEXT,
    estimated_delivery_date DATE,
    actual_delivery_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_order_number (order_number),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建订单项表
CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建分类表
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    parent_id VARCHAR(36),
    image_url VARCHAR(500),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_parent_id (parent_id),
    INDEX idx_slug (slug),
    INDEX idx_is_active (is_active),
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建产品图片表
CREATE TABLE IF NOT EXISTS product_images (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    sort_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_product_id (product_id),
    INDEX idx_is_primary (is_primary),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建评论表
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_product_id (product_id),
    INDEX idx_user_id (user_id),
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建购物车表
CREATE TABLE IF NOT EXISTS cart_items (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_product_id (product_id),
    UNIQUE KEY unique_user_product (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建优惠券表
CREATE TABLE IF NOT EXISTS coupons (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type ENUM('percentage', 'fixed_amount') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    minimum_purchase_amount DECIMAL(10, 2) DEFAULT 0.00,
    maximum_discount_amount DECIMAL(10, 2),
    usage_limit INT,
    used_count INT DEFAULT 0,
    valid_from TIMESTAMP NOT NULL,
    valid_until TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_is_active (is_active),
    INDEX idx_valid_dates (valid_from, valid_until)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 查询示例：获取用户订单详情
SELECT 
    o.id AS order_id,
    o.order_number,
    o.status,
    o.total_amount,
    o.created_at,
    u.name AS user_name,
    u.email AS user_email,
    COUNT(oi.id) AS item_count,
    GROUP_CONCAT(p.name SEPARATOR ', ') AS product_names
FROM orders o
INNER JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN products p ON oi.product_id = p.id
WHERE o.user_id = :user_id
GROUP BY o.id, o.order_number, o.status, o.total_amount, o.created_at, u.name, u.email
ORDER BY o.created_at DESC
LIMIT :limit OFFSET :offset;

-- 查询示例：获取热门产品
SELECT 
    p.id,
    p.name,
    p.price,
    p.rating,
    p.review_count,
    c.name AS category_name,
    pi.image_url AS primary_image,
    SUM(oi.quantity) AS total_sold
FROM products p
INNER JOIN categories c ON p.category_id = c.id
LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
LEFT JOIN order_items oi ON p.id = oi.product_id
INNER JOIN orders o ON oi.order_id = o.id AND o.status = 'delivered'
WHERE p.is_active = TRUE
GROUP BY p.id, p.name, p.price, p.rating, p.review_count, c.name, pi.image_url
ORDER BY total_sold DESC, p.rating DESC
LIMIT :limit;
```

## 测试总结

本文档包含以下超长代码块：

1. **JavaScript 超长代码块**：包含 React 组件、TypeScript 类型定义、API 服务类等
2. **Python 超长代码块**：包含类定义、装饰器、异步函数、数据库操作等
3. **SQL 超长代码块**：包含多个表的创建语句和复杂查询

这些代码块都设计为超过一页 A4 纸的高度，用于测试 PDF 导出时的分页和截断功能。

## 测试要点

- ✅ 代码块超过一页高度时应该被截断
- ✅ 分页应该在合适的位置进行
- ✅ 每个代码块应该能够正确显示在 PDF 中
- ✅ 代码块使用和 Mermaid 一样的分页逻辑（允许截断）
