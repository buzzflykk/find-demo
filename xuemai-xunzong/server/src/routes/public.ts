import { Router, Request, Response } from 'express';
import { getDb, saveDb } from '../db/index.js';

const router = Router();

// 公开寻人详情页（无需登录）
router.get('/missing/:id', (req: Request, res: Response) => {
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

  // 增加浏览量（公开访问也计数）
  db.run(`UPDATE missing_persons SET view_count = view_count + 1 WHERE id = '${req.params.id}'`);
  saveDb();

  res.json(item);
});

export default router;
