#!/bin/bash

# 自动版本更新脚本（基于时间戳）
# 使用方法: ./update-version-auto.sh
# 这会自动生成一个基于时间戳的版本号，例如：2024.01.15.143022

TIMESTAMP=$(date +"%Y.%m.%d.%H%M%S")
BUILD_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

echo "🔄 自动生成版本号: $TIMESTAMP"
echo "构建时间: $BUILD_TIME"

# 调用主更新脚本
./update-version.sh "$TIMESTAMP"
