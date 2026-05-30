import { Router, Request, Response } from 'express';
import { getDb, saveDb } from '../db/index.js';
import { generateToken, authMiddleware, AuthRequest } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.post('/send-code', (req: Request, res: Response) => {
  const { phone } = req.body;
  if (!phone || !/^1\d{10}$/.test(phone)) {
    res.status(400).json({ error: '请输入正确的手机号' });
    return;
  }
  res.json({ message: '验证码已发送', code: '123456' });
});

router.post('/login', (req: Request, res: Response) => {
  const { phone, code } = req.body;
  if (!phone || !code) {
    res.status(400).json({ error: '手机号和验证码不能为空' });
    return;
  }
  const db = getDb();
  const existing = db.exec(`SELECT * FROM users WHERE phone = '${phone}'`);

  let userId: string;
  if (existing.length > 0) {
    userId = existing[0].values[0][0] as string;
  } else {
    userId = uuidv4();
    db.run('INSERT INTO users (id, phone) VALUES (?, ?)', [userId, phone]);
    saveDb();
  }

  const token = generateToken(userId);
  res.json({ token, userId });
});

router.get('/profile', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const result = db.exec(`SELECT * FROM users WHERE id = '${req.userId}'`);
  if (result.length === 0) {
    res.status(404).json({ error: '用户不存在' });
    return;
  }
  const row = result[0];
  const profile: Record<string, unknown> = {};
  row.columns.forEach((name: string, i: number) => {
    profile[name] = row.values[0][i];
  });
  delete (profile as any).phone;
  res.json(profile);
});

router.put('/profile', authMiddleware, (req: AuthRequest, res: Response) => {
  const { nickname, avatar } = req.body;
  const db = getDb();
  const updates: string[] = [];
  const params: unknown[] = [];

  if (nickname !== undefined) {
    updates.push('nickname = ?');
    params.push(nickname);
  }
  if (avatar !== undefined) {
    updates.push('avatar = ?');
    params.push(avatar);
  }

  if (updates.length > 0) {
    updates.push("updated_at = datetime('now')");
    db.run(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, [...params, req.userId]);
    saveDb();
  }

  res.json({ message: '已更新' });
});

export default router;
