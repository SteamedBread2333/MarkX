#!/bin/bash

# MarkX 启动脚本
# 自动检测并启动本地服务器

echo "🚀 MarkX 启动脚本"
echo "=================="
echo ""

# 检测 Python 3
if command -v python3 &> /dev/null; then
    echo "✅ 检测到 Python 3"
    echo "📡 启动服务器: http://localhost:8000"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo ""
    python3 -m http.server 8000
    exit 0
fi

# 检测 Python 2
if command -v python &> /dev/null; then
    echo "✅ 检测到 Python 2"
    echo "📡 启动服务器: http://localhost:8000"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo ""
    python -m SimpleHTTPServer 8000
    exit 0
fi

# 检测 Node.js
if command -v node &> /dev/null; then
    echo "✅ 检测到 Node.js"
    echo "📡 启动服务器: http://localhost:8000"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo ""
    npx http-server -p 8000
    exit 0
fi

# 检测 PHP
if command -v php &> /dev/null; then
    echo "✅ 检测到 PHP"
    echo "📡 启动服务器: http://localhost:8000"
    echo ""
    echo "按 Ctrl+C 停止服务器"
    echo ""
    php -S localhost:8000
    exit 0
fi

# 没有找到任何服务器
echo "❌ 未检测到可用的服务器"
echo ""
echo "请安装以下任一工具："
echo "  - Python 3: https://www.python.org/downloads/"
echo "  - Node.js: https://nodejs.org/"
echo "  - PHP: https://www.php.net/downloads"
echo ""
exit 1

