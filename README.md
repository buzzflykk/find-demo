# 时光印记

一个面向 C 端寻人 / 旧友失联场景的产品经理面试 Demo。项目重点展示从“模糊线索”到“可发布、可传播、可反馈”的核心产品闭环。

## Demo 主链路

1. 开屏页进入 App
2. 浏览首页 / 发现页公共线索池
3. 发布寻人线索，支持图片或文字输入
4. 整理线索并生成分享卡
5. 发布后同步到首页、发现页、我的寻人
6. 进入详情页，私聊提供线索
7. 消息同步到消息列表

## 在线访问

GitHub Pages 部署完成后，访问：

[https://buzzflykk.github.io/find-demo/](https://buzzflykk.github.io/find-demo/)

## 项目结构

```text
.
├── Product-Spec.md
├── Design-Brief.md
├── DEV-PLAN.md
├── Portfolio.md
├── Demo-Guide.md
└── xuemai-xunzong
    ├── client     # React + Vite 前端 Demo
    └── server     # Express 演示服务端
```

## 本地运行

安装依赖：

```bash
cd xuemai-xunzong
npm run install:all
```

启动开发环境：

```bash
npm run dev
```

只构建前端：

```bash
cd xuemai-xunzong/client
npm run build
```

## 技术栈

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Express
- sql.js

## Demo 说明

当前版本以普通 C 端产品经理展示为主，AI 能力作为后续增强方向处理。图片上传、线索整理、消息和发布记录均使用本地演示数据，便于面试现场稳定展示。

服务端包含开发默认 JWT secret，仅用于本地 Demo，不可直接用于生产环境。
