#!/bin/bash

# 版本更新脚本
# 使用方法: ./update-version.sh <新版本号>
# 示例: ./update-version.sh 1.0.2

if [ -z "$1" ]; then
    echo "错误: 请提供版本号"
    echo "使用方法: ./update-version.sh <新版本号>"
    echo "示例: ./update-version.sh 1.0.2"
    exit 1
fi

NEW_VERSION="$1"
BUILD_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

echo "正在更新版本号到 $NEW_VERSION..."
echo "构建时间: $BUILD_TIME"

# 更新 index.html 中的版本号
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/window.APP_VERSION = '[^']*'/window.APP_VERSION = '$NEW_VERSION'/g" index.html
    sed -i '' "s/window.APP_BUILD_TIME = '[^']*'/window.APP_BUILD_TIME = '$BUILD_TIME'/g" index.html
    sed -i '' "s/href=\"src\/css\/styles.css?v=[^\"]*\"/href=\"src\/css\/styles.css?v=$NEW_VERSION\"/g" index.html
    sed -i '' "s/src=\"src\/app.js?v=[^\"]*\"/src=\"src\/app.js?v=$NEW_VERSION\"/g" index.html
else
    # Linux
    sed -i "s/window.APP_VERSION = '[^']*'/window.APP_VERSION = '$NEW_VERSION'/g" index.html
    sed -i "s/window.APP_BUILD_TIME = '[^']*'/window.APP_BUILD_TIME = '$BUILD_TIME'/g" index.html
    sed -i "s/href=\"src\/css\/styles.css?v=[^\"]*\"/href=\"src\/css\/styles.css?v=$NEW_VERSION\"/g" index.html
    sed -i "s/src=\"src\/app.js?v=[^\"]*\"/src=\"src\/app.js?v=$NEW_VERSION\"/g" index.html
fi

# 更新 package.json 中的版本号（如果存在）
if [ -f "package.json" ]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/\"version\": \"[^\"]*\"/\"version\": \"$NEW_VERSION\"/g" package.json
    else
        sed -i "s/\"version\": \"[^\"]*\"/\"version\": \"$NEW_VERSION\"/g" package.json
    fi
fi

echo "✅ 版本号已更新到 $NEW_VERSION"
echo ""
echo "请检查以下文件确保更新成功:"
echo "  - index.html (APP_VERSION, APP_BUILD_TIME, CSS/JS 版本号查询参数)"
if [ -f "package.json" ]; then
    echo "  - package.json (version)"
fi
echo ""
echo "下一步:"
echo "  1. 检查更改: git diff"
echo "  2. 提交更改: git commit -m 'chore: bump version to $NEW_VERSION'"
echo "  3. 推送到远程: git push"
