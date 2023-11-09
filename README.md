# flow-demo

基于 vue3 + vite + elementui plus + sass

### 快速开始

```bash
# 克隆项目
git clone https://github.com/cuichangxin/flow-demo.git

# 进入项目目录
cd flow-demo

# 安装依赖(建议使用yarn：https://classic.yarnpkg.com/en/)
yarn install 或者 npm i

#启动
npm run dev
```

### 部署
```bash
#初次部署
docker build -t flow-demo-vue-docker .
docker run -d -p 16380:16380 --name flow-demo-vue-docker flow-demo-vue-docker
```

### 更新
```bash
# 停止容器
docker stop [容器id]

# 删除容器
docker rm [容器id]

# 删除镜像
docker rmi [镜像名称:版本 or 镜像id]

#更新镜像
// 执行初次部署命令
```
### 镜像常用命令

```bash
docker pull [镜像名称:版本] 拉取镜像
docker images  镜像列表
docker rmi [镜像名称:版本] 删除镜像
docker history [镜像名称] 镜像操作记录
docker tag [镜像名称:版本][新镜像名称:新版本]
docker inspect [镜像名称:版本] 查看镜像详细
docker search [关键字] 搜索镜像
docker login 镜像登陆
```

### 容器常用命令

```bash
docker ps -a 容器列表(所有容器)
docker ps  查看所有(运行的)容器
docker exec -ti <id> bash  以 bash 命令进入容器内
docker run -ti --name [容器名称][镜像名称:版本] bash 启动容器并进入
docker logs 查看容器日志
docker top <container_id> 查看容器最近的一个进程
docker run -ti --name [容器名称] -p 8080:80 [镜像名称:版本] bash  端口映射
docker rm <container_id> 删除容器
docker stop <container_id> 停止容器
docker start <container_id> 开启容器
docker restart <container_id> 重启容器
docker inspect <container_id> 查看容器详情
docker commit [容器名称] my_image:v1.0  容器提交为新的镜像
```

---

### 后台仓库地址
[点我跳转](https://github.com/cuichangxin/flow-node)

---

[▲ 回顶部](#top)
