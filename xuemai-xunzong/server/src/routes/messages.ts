import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDb } from '../db/index.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();

// 获取私信对话列表（按最新消息排序）
router.get('/conversations', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const userId = req.userId;

  // 找出当前用户参与的所有对话（按 missing_person_id + 对方用户分组）
  const result = db.exec(`
    SELECT m.id as last_msg_id, m.sender_id, m.receiver_id, m.content, m.msg_type,
           m.image_url, m.is_read, m.created_at as last_msg_at,
           m.missing_person_id,
           CASE WHEN m.sender_id = '${userId}' THEN m.receiver_id ELSE m.sender_id END as other_user_id,
           mp.title as missing_title, mp.photos as missing_photos
    FROM messages m
    JOIN missing_persons mp ON m.missing_person_id = mp.id
    WHERE m.id IN (
      SELECT MAX(m2.id) FROM messages m2
      WHERE m2.sender_id = '${userId}' OR m2.receiver_id = '${userId}'
      GROUP BY m2.missing_person_id,
        CASE WHEN m2.sender_id = '${userId}' THEN m2.receiver_id ELSE m2.sender_id END
    )
    ORDER BY m.created_at DESC
  `);

  const columns = ['last_msg_id', 'sender_id', 'receiver_id', 'content', 'msg_type',
    'image_url', 'is_read', 'last_msg_at', 'missing_person_id', 'other_user_id',
    'missing_title', 'missing_photos'];
  const conversations = result[0]?.values.map((row: any[]) => {
    const item: Record<string, any> = {};
    columns.forEach((col, i) => { item[col] = row[i]; });
    try { item.missing_photos = JSON.parse(item.missing_photos); } catch { item.missing_photos = []; }
    return item;
  }) || [];

  // 获取每个对话的未读数量
  const enriched = conversations.map((conv: any) => {
    const unreadResult = db.exec(
      `SELECT COUNT(*) as cnt FROM messages WHERE missing_person_id = '${conv.missing_person_id}' AND receiver_id = '${userId}' AND is_read = 0`
    );
    conv.unread_count = unreadResult[0]?.values[0][0] || 0;

    // 获取对方用户信息
    const userResult = db.exec(`SELECT nickname, avatar FROM users WHERE id = '${conv.other_user_id}'`);
    if (userResult.length > 0) {
      conv.other_user_name = userResult[0].values[0][0];
      conv.other_user_avatar = userResult[0].values[0][1];
    }
    return conv;
  });

  res.json({ items: enriched });
});

// 获取某个对话的消息列表
router.get('/:missingPersonId/:otherUserId', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const userId = req.userId;
  const { missingPersonId, otherUserId } = req.params;

  // 标记该对话中接收的消息为已读
  db.run(`
    UPDATE messages SET is_read = 1
    WHERE missing_person_id = '${missingPersonId}'
      AND sender_id = '${otherUserId}'
      AND receiver_id = '${userId}'
      AND is_read = 0
  `);
  saveDb();

  const result = db.exec(`
    SELECT id, sender_id, receiver_id, content, msg_type, image_url, is_read, created_at
    FROM messages
    WHERE missing_person_id = '${missingPersonId}'
      AND ((sender_id = '${userId}' AND receiver_id = '${otherUserId}')
        OR (sender_id = '${otherUserId}' AND receiver_id = '${userId}'))
    ORDER BY created_at ASC
  `);

  const columns = ['id', 'sender_id', 'receiver_id', 'content', 'msg_type', 'image_url', 'is_read', 'created_at'];
  const items = result[0]?.values.map((row: any[]) => {
    const item: Record<string, any> = {};
    columns.forEach((col, i) => { item[col] = row[i]; });
    return item;
  }) || [];

  res.json({ items });
});

// 发送消息
router.post('/', authMiddleware, (req: AuthRequest, res: Response) => {
  const { receiver_id, missing_person_id, content, msg_type, image_url } = req.body;
  if (!receiver_id || !missing_person_id) {
    res.status(400).json({ error: '缺少必要参数' });
    return;
  }

  if (!content && msg_type !== 'image') {
    res.status(400).json({ error: '消息内容不能为空' });
    return;
  }

  const db = getDb();
  const id = uuidv4();

  db.run(`
    INSERT INTO messages (id, sender_id, receiver_id, missing_person_id, content, msg_type, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [id, req.userId, receiver_id, missing_person_id, content || '', msg_type || 'text', image_url || '']);
  saveDb();

  res.json({ id, message: '发送成功' });
});

// 获取未读消息总数
router.get('/unread/total', authMiddleware, (req: AuthRequest, res: Response) => {
  const db = getDb();
  const result = db.exec(`SELECT COUNT(*) as cnt FROM messages WHERE receiver_id = '${req.userId}' AND is_read = 0`);
  const total = result[0]?.values[0][0] || 0;
  res.json({ total });
});

export default router;
