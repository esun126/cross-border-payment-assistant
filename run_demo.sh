#!/bin/bash

# 确保脚本在出错时停止执行
set -e

# 显示欢迎信息
echo "=================================================="
echo "跨境支付监管助手 - 启动脚本"
echo "=================================================="

# 检查是否存在.env文件，如果不存在则从.env.example创建
if [ ! -f .env ]; then
  echo "创建.env文件..."
  cp .env.example .env
  echo ".env文件已创建，请根据需要修改配置"
fi

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
  echo "安装依赖..."
  npm install
fi

# 启动服务
echo "启动跨境支付监管助手服务..."
node api_service.js
