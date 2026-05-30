import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from './routes/auth.js';
import uploadRouter from './routes/upload.js';
import missingPersonsRouter from './routes/missing-persons.js';
import messagesRouter from './routes/messages.js';
import matchRouter from './routes/match.js';
import notificationsRouter from './routes/notifications.js';
import subscriptionsRouter from './routes/subscriptions.js';
import publicRouter from './routes/public.js';
import { authMiddleware } from './middleware/auth.js';
import { initDb, closeDb } from './db/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// auth 路由
app.use('/api/auth', authRouter);

// 文件上传
app.use('/api/upload', uploadRouter);

// 寻人信息
app.use('/api/missing-persons', missingPersonsRouter);

// 站内私信
app.use('/api/messages', messagesRouter);

// AI 匹配
app.use('/api/match', matchRouter);

// 通知
app.use('/api/notifications', notificationsRouter);

// 订阅/会员
app.use('/api/subscriptions', subscriptionsRouter);

// 公开 API（无需登录）
app.use('/api/public', publicRouter);

async function start() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`[server] 时光印记 API 运行在 http://localhost:${PORT}`);
  });
}

start().catch(console.error);

process.on('SIGINT', () => {
  closeDb();
  process.exit(0);
});

process.on('SIGTERM', () => {
  closeDb();
  process.exit(0);
});
