# Development Plan — 时光印记（Web 演示版）

> 本文件记录项目的开发阶段划分、当前进度和剩余工作。
> 新 session 启动时应首先阅读此文件，了解项目状态后再继续开发。

---

## 序：关于演示版

这是一个 Web 演示版/原型，非生产级移动 App。目标是在浏览器中完整跑通用户流程，展示产品概念和核心交互。

2026-05-26 起，前端展示目标调整为 **C 端 / AI 产品经理面试展示型 Demo**：默认进入手机 App Demo，不做作品集落地页；首页需要承担面试讲解功能，让面试官在 30 秒内看懂用户问题、AI 价值、核心路径和产品经理思考。

**演示版与原版的差异：**
- AI 功能使用 Mock 模拟，不调用实际模型
- 图片存储使用本地文件系统，不上传云端
- 数据库使用 SQLite，零安装
- 分享功能使用 Web 原生分享 API 或复制链接
- 仅针对桌面端浏览器优化（Chrome/Firefox/Edge），不做移动端适配
- 短信登录模拟为任意验证码均可登录

---

## Phase 1: 项目骨架 + 用户系统

**交付内容**：
- 使用 Vite + React + TypeScript 搭建前端项目
- 使用 Express + TypeScript 搭建后端项目
- SQLite 数据库初始化（users 表 + 基础配置）
- 手机号验证码登录（模拟：任意验证码皆可）
- 用户个人资料设置（昵称、头像上传）
- 底部 Tab 栏导航（4 个 Tab：时光机、探索、消息、我的）
- React Router 页面路由 + 登录态守卫
- Tailwind CSS 全局样式 + 语义色彩变量（白天/夜间双主题）

**关键文件**：
- `client/` — React 前端项目根目录
  - `client/src/main.tsx` — 入口
  - `client/src/App.tsx` — 路由 + 布局
  - `client/src/components/layout/BottomNav.tsx` — 底部 Tab 栏
  - `client/src/components/layout/AppLayout.tsx` — 登录态守卫 + 主布局
  - `client/src/pages/Login.tsx` — 手机号登录页
  - `client/src/pages/Home.tsx` — 首页（时光机），空白占位
  - `client/src/pages/Explore.tsx` — 探索页，空白占位
  - `client/src/pages/Messages.tsx` — 消息页，空白占位
  - `client/src/pages/Profile.tsx` — 个人页，空白占位
  - `client/src/hooks/useAuth.ts` — 登录状态管理
  - `client/src/index.css` — Tailwind 入口 + 主题变量
- `server/` — Express 后端项目根目录
  - `server/src/index.ts` — Express 入口
  - `server/src/routes/auth.ts` — 登录/注册 API
  - `server/src/routes/user.ts` — 用户资料 API
  - `server/src/db/index.ts` — SQLite 初始化
  - `server/src/middleware/auth.ts` — JWT 验证中间件
- `package.json` — 根目录 workspace 配置

**验收标准**：
- `npm run dev` 一键启动前后端
- 浏览器打开 http://localhost:5173 看到登录页
- 输入手机号 + 任意验证码可登录
- 登录后进入首页，底部 4 个 Tab 可切换
- 夜间/白天模式切换正常

---

## Phase 2: 数据库扩展 + 基础数据模型

**交付内容**：
- 创建寻人信息表（missing_persons）
- 创建私信表（messages）
- 创建通知表（notifications）
- 创建订阅/会员表（subscriptions）
- 完整 RESTful CRUD API 基础架构
- 文件上传 API（图片存储到本地 uploads/ 目录）

**关键文件**：
- `server/src/db/schema.ts` — 所有表定义
- `server/src/routes/upload.ts` — 文件上传 API
- `server/src/middleware/upload.ts` — multer 配置

**验收标准**：
- 所有表通过 SQLite 自动创建
- 文件上传 API 可接收图片并存入本地

---

## Phase 3: 发布寻人流程

**交付内容**：
- Step 1：媒体上传页（上传老照片或信件照片，支持预览）+「仅文字描述」切换模式（输入文字描述失联信息，跳过 AI 处理步骤）
- Step 2：AI 处理中动画（显影动画 + 进度条，Mock 模拟 3 秒；仅上传照片/信件路径需要）
- Step 3：AI 提取结果展示（Mock 模拟修复对比 + Mock 模拟 OCR 关键词提取；仅照片/信件路径需要）
- Step 4：补充描述表单（目标人物姓名、失联时间地点、特征描述、其他线索）
- Step 5：海报编辑预览（Mock 海报模板切换）
- Step 6：发布确认（发布到公共池 + 社交媒体分享选项）
- 顶部步骤进度指示器
- 发布成功后跳转到寻人详情页

**关键文件**：
- `client/src/pages/Publish.tsx` — 发布页面容器（步骤管理）
- `client/src/pages/PublishStep1.tsx` — 媒体上传
- `client/src/pages/PublishStep2.tsx` — AI 处理动画
- `client/src/pages/PublishStep3.tsx` — AI 结果展示
- `client/src/pages/PublishStep4.tsx` — 补充描述表单
- `client/src/pages/PublishStep5.tsx` — 海报编辑预览
- `client/src/pages/PublishStep6.tsx` — 发布确认
- `client/src/pages/MissingDetail.tsx` — 寻人详情页
- `client/src/components/publish/StepIndicator.tsx` — 步骤进度条
- `client/src/components/publish/PosterPreview.tsx` — 海报预览组件
- `client/src/hooks/usePublish.ts` — 发布状态管理
- `server/src/routes/missing-persons.ts` — 寻人信息 CRUD API

**验收标准**：
- 从首页点击"发布新寻人"开始 6 步流程
- 每一步可前进/后退
- AI 处理阶段显示显影动画和进度条
- 发布成功后跳转到详情页
- 数据库中可查到新创建的寻人记录

---

## Phase 4: 首页信息流 + 探索页

**交付内容**：
- 首页（时光机）寻人卡片信息流（按时间倒序）
- 右下角悬浮"发布新寻人"按钮（FAB，始终可见）
- 寻人卡片组件（缩略图 + 标题 + 发布时间 + 匹配数 + 状态标签）
- 探索页双列瀑布流布局
- 搜索栏（关键词搜索）
- 筛选栏：地区筛选、时间范围、失联类型（标签/Chip 形式）
- 空状态：温暖手绘插画 + 引导文案（无数据时）

**关键文件**：
- `client/src/pages/Home.tsx` — 首页（升级：真实信息流 + FAB）
- `client/src/pages/Explore.tsx` — 探索页（升级：瀑布流 + 搜索 + 筛选）
- `client/src/components/home/PosterCard.tsx` — 寻人卡片组件
- `client/src/components/explore/SearchBar.tsx` — 搜索栏
- `client/src/components/explore/FilterBar.tsx` — 筛选栏
- `client/src/components/common/EmptyState.tsx` — 空状态组件
- `client/src/hooks/useMissingPersons.ts` — 寻人数据查询
- `server/src/routes/search.ts` — 搜索 + 筛选 API

**验收标准**：
- 首页按时间倒序显示已发布的寻人卡片
- FAB 按钮不随滚动消失，点击跳转到发布页
- 探索页双列瀑布流正常展示
- 搜索和筛选功能可用
- 无数据时显示空状态插图

---

## Phase 5: AI 功能 Mock 模块

**交付内容**：
- 老照片修复 Mock：上传后展示"修复前后"对比（模拟效果，实际不做模型处理）
- 信件 OCR Mock：上传后展示 Mock 提取的关键信息标签（人名、地名、时间）
- AI 生成海报 Mock：提供 3 套模板，将照片 + 文字信息渲染为海报预览图
- 人脸匹配 Mock：匹配时展示模拟的匹配度百分比

**关键文件**：
- `client/src/services/ai-mock.ts` — AI Mock 服务（延迟 + 模拟数据）
- `client/src/components/ai/PhotoComparison.tsx` — 修复前后对比组件
- `client/src/components/ai/OCRResult.tsx` — OCR 关键词标签展示
- `client/src/components/ai/PosterTemplates.tsx` — 海报模板选择

**验收标准**：
- 上传老照片后显示模拟修复对比
- 上传信件后显示模拟关键词提取
- 海报选择后可在预览区看到合成效果
- 所有"AI 处理"有明显进度提示，用户感知正常

---

## Phase 6: 站内私信

**交付内容**：
- 私信列表页（匹配成功的对话列表）
- 私信详情页（气泡式对话界面）
- 发送文字消息 + 图片消息
- 私信仅匹配双方可见
- 已读/未读状态

**关键文件**：
- `client/src/pages/Messages.tsx` — 升级为真实私信列表
- `client/src/pages/ChatDetail.tsx` — 私信对话页
- `client/src/components/messages/ChatBubble.tsx` — 消息气泡组件
- `client/src/hooks/useMessages.ts` — 私信状态管理
- `server/src/routes/messages.ts` — 私信 API

**验收标准**：
- 进入消息 Tab 显示私信对话列表
- 点击对话进入详情，可发送和接收消息
- 匹配双方才能看到对话

---

## Phase 7: AI 匹配引擎（Mock）

**交付内容**：
- Mock 匹配算法：基于时间 + 地点 + 关键词的简单字符串匹配
- 匹配结果页面：展示匹配百分比 + 左右对比共同线索
- 匹配通知触发：匹配成功时生成系统通知
- 用户确认匹配后可发起私信
- "已找到"标记：更新寻人信息状态，从公共池移除

**关键文件**：
- `server/src/services/match-engine.ts` — Mock 匹配逻辑
- `client/src/pages/MatchResult.tsx` — 匹配结果详情页
- `client/src/components/match/ClueComparison.tsx` — 线索对比组件
- `server/src/routes/match.ts` — 匹配 API + 标记已找到

**验收标准**：
- 匹配引擎运行时产出匹配结果（基于模拟数据）
- 匹配结果页展示匹配百分比和共同线索
- 点击"发起私信"可进入对话
- 标记已找到后该信息不在公共池显示

---

## Phase 8: 通知中心 + 个人页 + 会员中心

**交付内容**：
- 通知中心：匹配结果、私信提醒、系统消息列表
- 通知红点标记
- 个人页：头像 + 昵称 + 会员状态
- 我的寻人列表（区分寻人中/已找到）
- 已找到档案（已归档的记录）
- 族谱入口占位（"即将上线"暖色卡片）
- 设置页：账号管理、退出登录
- 会员中心页：会员状态、订阅方案选择、免费剩余次数

**关键文件**：
- `client/src/pages/Profile.tsx` — 升级为真实个人页
- `client/src/pages/MyMissing.tsx` — 我的寻人列表
- `client/src/pages/FoundArchive.tsx` — 已找到档案
- `client/src/pages/Settings.tsx` — 设置页
- `client/src/pages/Membership.tsx` — 会员中心
- `client/src/pages/Notifications.tsx` — 通知列表
- `client/src/hooks/useNotifications.ts` — 通知状态管理
- `server/src/routes/notifications.ts` — 通知 API
- `server/src/routes/subscriptions.ts` — 订阅 API

**验收标准**：
- 收到匹配通知后显示红点
- 个人页展示用户信息和状态
- 我的寻人可筛选寻人中/已找到
- 族谱入口显示"即将上线"占位
- 会员中心展示方案选择

---

## Phase 9: 寻人海报分享

**交付内容**：
- 分享海报生成（将海报页面生成为图片格式）
- Web 原生分享面板（支持复制链接、分享到社交平台）
- 海报页面 URL 可被外部访问（无需登录可查看寻人详情页）
- 分享统计：浏览量计数

**关键文件**：
- `client/src/services/share.ts` — 分享逻辑（html2canvas + Web Share API）
- `client/src/pages/PublicMissingPage.tsx` — 公开分享页（无需登录）
- `server/src/routes/public.ts` — 公开页面 API

**验收标准**：
- 点击分享可复制链接或呼起分享面板
- 公开链接无需登录可查看寻人详情
- 浏览量计数递增

---

## Phase 10: UI 打磨 + Design Brief 落地

**交付内容**：
- Design Brief 视觉系统完整落地：色彩（暖色调白天 + 深蓝夜间）
- 温暖手作感细节：纸张纹理背景、微圆角、卡片阴影
- 字体系统统一：苹方/思源黑体优先级设置
- 页面过渡动画：渐入 + 微位移
- AI 显影动画效果优化
- 空状态插画绘制（CSS/SVG 实现）
- 响应式布局调整（至少 1024px+ 体验完整）
- 全局交互细节打磨

**关键文件**：
- `client/src/index.css` — 主题变量完善
- `client/src/components/common/ThemeProvider.tsx` — 主题切换
- `client/src/styles/animations.css` — 动画定义
- （修改已有组件，不新增）

**验收标准**：
- 白天/夜间模式视觉完整、配色统一

---

## Phase 11: 面试展示型前端改造

**交付内容**：
- 默认入口仍为手机 App Demo，避免跳到独立作品集页。
- 新增 Apple 展示机风格开屏页：根路径展示产品定位和 AI 闭环，点击任意位置进入 App。
- 登录页增加「进入面试演示版」入口，降低现场演示启动成本。
- App 顶部增加轻量演示标识，说明当前是 AI PM Case Demo。
- 首页升级为面试讲解型首页：一句话定位、用户痛点、AI 闭环、核心指标、主行动入口和演示案例信息流。
- 首页新增「本地 / 全部」分段筛选，本地模式可开启 Mock 定位并按城市匹配线索。
- 首页在接口失败或无数据时使用内置演示案例兜底，保证面试现场不空屏。
- 不新增真实 AI 调用，继续保持 Mock 演示边界。

**关键文件**：
- `client/src/pages/Login.tsx`
- `client/src/components/layout/AppLayout.tsx`
- `client/src/pages/Home.tsx`
- `client/src/index.css`

**验收标准**：
- 打开项目后仍进入手机 App 体验，而不是作品集落地页。
- 面试官在首页首屏能看懂：这是什么产品、给谁用、AI 做什么、下一步怎么演示。
- 无后端数据时首页不空白，仍能展示可讲解的演示案例。
- `npm run build` 通过。
- 所有页面符合 Design Brief 情绪关键词（温暖、手作感、克制）
- 页面切换有平滑过渡动画
- AI 处理过程中显影动画自然

---

## 技术栈

| 层级 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 前端框架 | React + Vite | React 19.x | 快速开发，HMR 热更新 |
| 语言 | TypeScript | 5.x | 类型安全 |
| UI 样式 | Tailwind CSS | 4.x | 工具类优先，主题变量支持 |
| 路由 | React Router | 7.x | 前端路由 |
| 状态管理 | React Context + useReducer | — | 演示版无需 Redux/Zustand |
| HTTP 客户端 | fetch（封装） | — | 轻量，无额外依赖 |
| 后端框架 | Express | 4.x | Node.js 轻量框架 |
| 数据库 | SQLite（better-sqlite3） | latest | 零安装，单文件 |
| 认证 | JWT（jsonwebtoken） | latest | 无状态 token |
| 文件上传 | multer | latest | 图片上传处理 |
| 包管理 | npm | — | 默认包管理器 |
| 图片转 canvas | html2canvas | latest | 海报截图分享 |

## 数据库表

| 表名 | 创建 Phase | 用途 |
|------|-----------|------|
| `users` | Phase 1 | 用户账号 + 资料 |
| `missing_persons` | Phase 2 | 寻人信息（含线索数据、状态） |
| `messages` | Phase 2 | 站内私信消息 |
| `notifications` | Phase 2 | 系统通知 |
| `subscriptions` | Phase 2 | 会员订阅记录 |
| `uploads` | Phase 2 | 上传文件记录 |

## 开发规则

- 每完成一个 Phase 执行四步走：Code Review → 测试完整性 → 编译验证 → 功能测试
- 四步走全部通过后才能 commit
- Commit message 格式：`phase-N: 简要描述`
- 包管理器：npm
- 开发启动命令：根目录 `npm run dev`，同时启动前端（:5173）和后端（:3001）
