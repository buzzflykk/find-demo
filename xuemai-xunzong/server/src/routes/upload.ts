import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDb } from '../db/index.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('不支持的文件格式，请上传 jpg/png/gif/webp/bmp'));
    }
  },
});

const router = Router();

router.post('/', authMiddleware, upload.single('file'), (req: AuthRequest, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: '请选择文件' });
    return;
  }

  const db = getDb();
  const id = uuidv4();
  const filePath = `/uploads/${req.file.filename}`;

  db.run(
    `INSERT INTO uploads (id, user_id, original_name, file_path, mime_type, file_size)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, req.userId, req.file.originalname, filePath, req.file.mimetype, req.file.size]
  );
  saveDb();

  res.json({ id, filePath, originalName: req.file.originalname });
});

export default router;
