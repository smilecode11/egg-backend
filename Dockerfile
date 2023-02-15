# 使用 node16
FROM node:16-alpine
# 创建工作区
RUN mkdir -p /usr/src/app
# 设置工作区
WORKDIR /usr/src/app
# 执行一次拷贝任务, 当依赖发生变化(package.json 改变)时执行资源下载
COPY package.json package-lock.json /usr/src/app/
# 执行下载命令 - 使用淘宝源下载 
RUN npm install --registry=https://registry.npm.taobao.org
# 拷贝当前目录到工作区
COPY . /usr/src/app/
# 执行 npm 命令, 转化 ts 为 js
RUN npm run tsc
# 暴露端口
EXPOSE 7001
# 启动项目
CMD npx egg-scripts start --title=smile-backend
