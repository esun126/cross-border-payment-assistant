FROM node:18-alpine

# 创建工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 创建.env文件（如果不存在）
RUN if [ ! -f .env ]; then cp .env.example .env; fi

# 暴露端口
EXPOSE 3001

# 启动应用
CMD ["npm", "start"]
