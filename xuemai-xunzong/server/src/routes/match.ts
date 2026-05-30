import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDb } from '../db/index.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';
import { runMatch, getMatchInputFromDb } from '../services/match-engine.js';
import type { MatchInput } from '../services/match-engine.js';

const router = Router();

// 对指定寻人信息运行匹配
router.post('/run/:missingPersonId', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const missingPersonId = req.params.missingPersonId as string;

  const source = getMatchInputFromDb(db, missingPersonId);
  if (!source) {
    res.status(404).json({ error: '寻人信息未找到' });
    return;
  }

  // 获取所有活跃的寻人信息作为候选（排除自己的）
  const candidates = db.exec(`
    SELECT id FROM missing_persons WHERE status = 'active' AND user_id != '${req.userId}'
  `);

  const candidateInputs: MatchInput[] = [];
  for (const row of candidates[0]?.values || []) {
    const input = getMatchInputFromDb(db, row[0]);
    if (input) candidateInputs.push(input);
  }

  const matches = runMatch(source, candidateInputs);

  // 保存匹配结果到数据库（同时存双方记录）
  for (const match of matches) {
    // 为当前用户生成通知
    db.run(`
      INSERT INTO notifications (id, user_id, type, title, content, related_id)
      VALUES ('${uuidv4()}', '${req.userId}', 'match',
        '发现可能的匹配线索',
        '匹配度 ${match.score}%，查看共同线索',
        '${match.matchedPersonId}')
    `);

    // 更新匹配数
    db.run(`UPDATE missing_persons SET match_count = match_count + 1 WHERE id = '${missingPersonId}'`);
  }
  saveDb();

  res.json({ matches, total: matches.length });
});

// 获取某条寻人信息的匹配结果
router.get('/results/:missingPersonId', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const missingPersonId = req.params.missingPersonId as string;

  const source = getMatchInputFromDb(db, missingPersonId);
  if (!source) {
    res.status(404).json({ error: '寻人信息未找到' });
    return;
  }

  const candidates = db.exec(`
    SELECT id FROM missing_persons WHERE status = 'active' AND user_id != '${req.userId}'
  `);

  const candidateInputs: MatchInput[] = [];
  for (const row of candidates[0]?.values || []) {
    const input = getMatchInputFromDb(db, row[0]);
    if (input) candidateInputs.push(input);
  }

  const matches = runMatch(source, candidateInputs);

  // 获取匹配到的寻人信息详情
  const enriched = matches.map(m => {
    const detail = db.exec(`SELECT id, title, photos, target_name, lost_time, lost_location, description, user_id FROM missing_persons WHERE id = '${m.matchedPersonId}'`)[0];
    const matched: Record<string, any> = {};
    if (detail) {
      detail.columns.forEach((name: string, i: number) => {
        matched[name] = detail.values[0][i];
      });
      try { matched.photos = JSON.parse(matched.photos); } catch { matched.photos = []; }
    }
    return {
      ...m,
      matchedPerson: matched,
    };
  });

  res.json({ matches: enriched, total: enriched.length });
});

// 标记匹配确认并初始化私信对话
router.post('/confirm/:matchedPersonId', authMiddleware, (req: AuthRequest, res: Response) => {
  const { matchedPersonId } = req.params;
  const { missingPersonId } = req.body;
  const db = getDb();

  // 检查两条寻人信息是否存在
  const source = db.exec(`SELECT user_id FROM missing_persons WHERE id = '${missingPersonId}'`);
  const target = db.exec(`SELECT user_id FROM missing_persons WHERE id = '${matchedPersonId}'`);
  if (!source.length || !target.length) {
    res.status(404).json({ error: '寻人信息未找到' });
    return;
  }

  const targetUserId = target[0].values[0][0];

  // 为对方也生成一条通知
  db.run(`
    INSERT INTO notifications (id, user_id, type, title, content, related_id)
    VALUES ('${uuidv4()}', '${targetUserId}', 'match',
      '有用户确认了匹配',
      '对方确认与你的寻人信息匹配，可以开始私信沟通了',
      '${missingPersonId}')
  `);
  saveDb();

  res.json({
    message: '匹配已确认',
    matchedUserId: targetUserId,
    missingPersonId,
  });
});

// 标记已找到
router.post('/found/:missingPersonId', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const missingPersonId = req.params.missingPersonId as string;

  const existing = db.exec(`SELECT user_id FROM missing_persons WHERE id = '${missingPersonId}'`);
  if (!existing.length) {
    res.status(404).json({ error: '未找到' });
    return;
  }
  if (existing[0].values[0][0] !== req.userId) {
    res.status(403).json({ error: '无权操作' });
    return;
  }

  db.run(`UPDATE missing_persons SET status = 'found', updated_at = datetime('now') WHERE id = '${missingPersonId}'`);
  saveDb();
  res.json({ message: '已标记为已找到' });
});

export default router;
