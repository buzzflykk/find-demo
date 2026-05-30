import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDb } from '../db/index.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();

// 获取订阅方案列表（硬编码）
router.get('/plans', (_req, res: Response) => {
  res.json({
    plans: [
      {
        id: 'free',
        name: '免费版',
        price: 0,
        priceLabel: '免费',
        features: [
          '发布 3 条寻人信息',
          'AI 修复 3 次',
          'AI OCR 3 次',
          'AI 海报 3 次',
          '站内私信',
        ],
      },
      {
        id: 'monthly',
        name: '月度会员',
        price: 19.9,
        priceLabel: '19.9 元/月',
        features: [
          '不限量发布寻人信息',
          '不限量 AI 修复',
          '不限量 AI OCR',
          '不限量 AI 海报',
          '站内私信',
          '优先匹配推送',
          '专属客服',
        ],
        popular: true,
      },
      {
        id: 'yearly',
        name: '年度会员',
        price: 199,
        priceLabel: '199 元/年',
        features: [
          '不限量发布寻人信息',
          '不限量 AI 修复',
          '不限量 AI OCR',
          '不限量 AI 海报',
          '站内私信',
          '优先匹配推送',
          '专属客服',
          '爱心徽章标识',
        ],
        badge: '最超值',
      },
    ],
  });
});

// 订阅/升级
router.post('/subscribe', authMiddleware, (req: AuthRequest, res: Response) => {
  const { plan } = req.body;
  if (!['monthly', 'yearly'].includes(plan)) {
    res.status(400).json({ error: '无效的订阅方案' });
    return;
  }

  const db = getDb();
  const id = uuidv4();
  const endDate = plan === 'monthly'
    ? new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
    : new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0];

  db.run(`
    INSERT INTO subscriptions (id, user_id, plan, status, end_date)
    VALUES ('${id}', '${req.userId}', '${plan}', 'active', '${endDate}')
  `);
  db.run(`UPDATE users SET membership = 'paid' WHERE id = '${req.userId}'`);
  saveDb();

  res.json({
    message: plan === 'monthly' ? '月度会员订阅成功' : '年度会员订阅成功',
    subscriptionId: id,
    endDate,
  });
});

// 获取当前用户订阅信息
router.get('/my', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const result = db.exec(
    `SELECT * FROM subscriptions WHERE user_id = '${req.userId}' ORDER BY created_at DESC LIMIT 1`,
  );

  let subscription = null;
  if (result.length > 0) {
    const row = result[0];
    const item: Record<string, any> = {};
    row.columns.forEach((name: string, i: number) => {
      item[name] = row.values[0][i];
    });
    subscription = item;
  }

  // 获取用户免费额度使用情况
  const userResult = db.exec(`SELECT * FROM users WHERE id = '${req.userId}'`);
  let usage = null;
  if (userResult.length > 0) {
    const row = userResult[0];
    const item: Record<string, any> = {};
    row.columns.forEach((name: string, i: number) => {
      item[name] = row.values[0][i];
    });
    usage = {
      ai_usage_restore: item.ai_usage_restore,
      ai_usage_ocr: item.ai_usage_ocr,
      ai_usage_poster: item.ai_usage_poster,
    };
  }

  res.json({ subscription, usage, membership: subscription ? 'paid' : 'free' });
});

export default router;
