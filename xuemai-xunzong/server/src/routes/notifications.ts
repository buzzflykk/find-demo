import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDb } from '../db/index.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();

// 获取通知列表
router.get('/', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const result = db.exec(`
    SELECT * FROM notifications WHERE user_id = '${req.userId}'
    ORDER BY created_at DESC LIMIT 50
  `);

  const items: any[] = [];
  if (result.length > 0) {
    const row = result[0];
    for (const val of result[0].values) {
      const item: Record<string, any> = {};
      row.columns.forEach((name: string, i: number) => {
        item[name] = val[i];
      });
      items.push(item);
    }
    // 如果有剩余行
    for (let r = 1; r < result.length; r++) {
      const item: Record<string, any> = {};
      row.columns.forEach((name: string, i: number) => {
        item[name] = result[r].values[0][i];
      });
      items.push(item);
    }
  }

  res.json({ items });
});

// 标记通知为已读
router.post('/read/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDb();
  db.run(`UPDATE notifications SET is_read = 1 WHERE id = '${req.params.id}' AND user_id = '${req.userId}'`);
  saveDb();
  res.json({ message: '已标记' });
});

// 标记所有通知为已读
router.post('/read-all', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDb();
  db.run(`UPDATE notifications SET is_read = 1 WHERE user_id = '${req.userId}'`);
  saveDb();
  res.json({ message: '全部已标记' });
});

// 获取未读通知数
router.get('/unread/count', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const result = db.exec(`SELECT COUNT(*) as cnt FROM notifications WHERE user_id = '${req.userId}' AND is_read = 0`);
  const count = result.length > 0 ? (result[0].values[0][0] as number) : 0;
  res.json({ count });
});

export default router;
