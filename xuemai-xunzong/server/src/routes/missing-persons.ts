import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDb } from '../db/index.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();

// 获取所有公开寻人信息（探索页/首页用）
router.get('/', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = (page - 1) * limit;

  const total = db.exec("SELECT COUNT(*) as count FROM missing_persons WHERE status = 'active'");
  const count = total[0]?.values[0][0] || 0;

  const result = db.exec(`
    SELECT id, title, photos, target_name, lost_location, lost_type, status,
           view_count, match_count, created_at
    FROM missing_persons
    WHERE status = 'active'
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `);

  const columns = ['id', 'title', 'photos', 'target_name', 'lost_location', 'lost_type', 'status', 'view_count', 'match_count', 'created_at'];
  const items = result[0]?.values.map((row: any[]) => {
    const item: Record<string, any> = {};
    columns.forEach((col, i) => { item[col] = row[i]; });
    try { item.photos = JSON.parse(item.photos); } catch { item.photos = []; }
    return item;
  }) || [];

  res.json({ items, total: count, page, limit });
});

// 搜索
router.get('/search', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const q = (req.query.q as string) || '';
  const location = (req.query.location as string) || '';
  const lostType = (req.query.lost_type as string) || '';
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = (page - 1) * limit;

  let where = "WHERE status = 'active'";
  const params: any[] = [];

  if (q) {
    where += " AND (target_name LIKE ? OR description LIKE ? OR lost_location LIKE ?)";
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  if (location) {
    where += " AND lost_location LIKE ?";
    params.push(`%${location}%`);
  }
  if (lostType) {
    where += " AND lost_type = ?";
    params.push(lostType);
  }

  // sql.js doesn't support parameterized queries in exec for LIKE, use simple approach
  const result = db.exec(`SELECT id, title, photos, target_name, lost_location, lost_type, status, view_count, match_count, created_at FROM missing_persons ${where} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`);

  const columns = ['id', 'title', 'photos', 'target_name', 'lost_location', 'lost_type', 'status', 'view_count', 'match_count', 'created_at'];
  const items = result[0]?.values.map((row: any[]) => {
    const item: Record<string, any> = {};
    columns.forEach((col, i) => { item[col] = row[i]; });
    try { item.photos = JSON.parse(item.photos); } catch { item.photos = []; }
    return item;
  }) || [];

  res.json({ items });
});

// 获取单条寻人详情
router.get('/:id', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const result = db.exec(`SELECT * FROM missing_persons WHERE id = '${req.params.id}'`);
  if (result.length === 0) {
    res.status(404).json({ error: '未找到' });
    return;
  }

  const row = result[0];
  const item: Record<string, any> = {};
  row.columns.forEach((name: string, i: number) => {
    item[name] = row.values[0][i];
  });
  try { item.photos = JSON.parse(item.photos); } catch { item.photos = []; }
  try { item.letters = JSON.parse(item.letters); } catch { item.letters = []; }
  try { item.ai_keywords = JSON.parse(item.ai_keywords); } catch { item.ai_keywords = []; }

  // 增加浏览量
  db.run(`UPDATE missing_persons SET view_count = view_count + 1 WHERE id = '${req.params.id}'`);
  saveDb();

  res.json(item);
});

// 创建寻人信息（发布流程最后一步调用）
router.post('/', authMiddleware, (req: AuthRequest, res: Response) => {
  const {
    title, photos, letters, text_only, ai_keywords,
    target_name, target_nickname, lost_time, lost_location, lost_type,
    description, poster_image,
  } = req.body;

  if (!title && !target_name) {
    res.status(400).json({ error: '请至少填写寻人标题或目标姓名' });
    return;
  }

  const db = getDb();
  const id = uuidv4();

  db.run(`
    INSERT INTO missing_persons (id, user_id, title, photos, letters, text_only, ai_keywords,
      target_name, target_nickname, lost_time, lost_location, lost_type, description, poster_image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    id, req.userId, title || `寻找${target_name}`,
    JSON.stringify(photos || []), JSON.stringify(letters || []), text_only || '', JSON.stringify(ai_keywords || []),
    target_name || '', target_nickname || '', lost_time || '', lost_location || '',
    lost_type || '', description || '', poster_image || '',
  ]);
  saveDb();

  res.json({ id, message: '发布成功' });
});

// 更新寻人信息
router.put('/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const existing = db.exec(`SELECT user_id FROM missing_persons WHERE id = '${req.params.id}'`);
  if (existing.length === 0) {
    res.status(404).json({ error: '未找到' });
    return;
  }
  if (existing[0].values[0][0] !== req.userId) {
    res.status(403).json({ error: '无权修改' });
    return;
  }

  const fields = ['title', 'target_name', 'target_nickname', 'lost_time', 'lost_location', 'lost_type', 'description', 'poster_image', 'status'];
  const updates: string[] = [];
  const params: any[] = [];

  for (const field of fields) {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = ?`);
      params.push(req.body[field]);
    }
  }

  if (updates.length > 0) {
    updates.push("updated_at = datetime('now')");
    db.run(`UPDATE missing_persons SET ${updates.join(', ')} WHERE id = ?`, [...params, req.params.id]);
    saveDb();
  }

  res.json({ message: '已更新' });
});

// 标记已找到
router.post('/:id/found', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const existing = db.exec(`SELECT user_id FROM missing_persons WHERE id = '${req.params.id}'`);
  if (existing.length === 0) {
    res.status(404).json({ error: '未找到' });
    return;
  }
  if (existing[0].values[0][0] !== req.userId) {
    res.status(403).json({ error: '无权操作' });
    return;
  }

  db.run(`UPDATE missing_persons SET status = 'found', updated_at = datetime('now') WHERE id = '${req.params.id}'`);
  saveDb();
  res.json({ message: '已标记为已找到' });
});

// 获取当前用户的寻人列表
router.get('/my/list', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const result = db.exec(`
    SELECT id, title, photos, status, view_count, match_count, created_at
    FROM missing_persons WHERE user_id = '${req.userId}'
    ORDER BY created_at DESC
  `);

  const columns = ['id', 'title', 'photos', 'status', 'view_count', 'match_count', 'created_at'];
  const items = result[0]?.values.map((row: any[]) => {
    const item: Record<string, any> = {};
    columns.forEach((col, i) => { item[col] = row[i]; });
    try { item.photos = JSON.parse(item.photos); } catch { item.photos = []; }
    return item;
  }) || [];

  res.json({ items });
});

export default router;
