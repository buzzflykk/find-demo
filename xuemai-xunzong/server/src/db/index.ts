import initSqlJs from 'sql.js';
import type { Database as SqlJsDatabase } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', '..', 'data', 'xuemai.db');

let db: SqlJsDatabase;

function ensureDbDir() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function saveDb() {
  ensureDbDir();
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

function initSchema() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      phone TEXT UNIQUE NOT NULL,
      nickname TEXT DEFAULT '',
      avatar TEXT DEFAULT '',
      membership TEXT DEFAULT 'free',
      ai_usage_restore INTEGER DEFAULT 3,
      ai_usage_ocr INTEGER DEFAULT 3,
      ai_usage_poster INTEGER DEFAULT 3,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS missing_persons (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT DEFAULT '',
      status TEXT DEFAULT 'active',
      photos TEXT DEFAULT '[]',
      letters TEXT DEFAULT '[]',
      ai_keywords TEXT DEFAULT '[]',
      target_name TEXT DEFAULT '',
      target_nickname TEXT DEFAULT '',
      lost_time TEXT DEFAULT '',
      lost_location TEXT DEFAULT '',
      lost_type TEXT DEFAULT '',
      description TEXT DEFAULT '',
      poster_image TEXT DEFAULT '',
      text_only TEXT DEFAULT '',
      view_count INTEGER DEFAULT 0,
      match_count INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Migration: add text_only column for existing databases
  try { db.run(`ALTER TABLE missing_persons ADD COLUMN text_only TEXT DEFAULT ''`); } catch {}

  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      sender_id TEXT NOT NULL,
      receiver_id TEXT NOT NULL,
      missing_person_id TEXT NOT NULL,
      content TEXT DEFAULT '',
      msg_type TEXT DEFAULT 'text',
      image_url TEXT DEFAULT '',
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT DEFAULT '',
      content TEXT DEFAULT '',
      related_id TEXT DEFAULT '',
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      plan TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      start_date TEXT DEFAULT (datetime('now')),
      end_date TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS uploads (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      original_name TEXT DEFAULT '',
      file_path TEXT NOT NULL,
      mime_type TEXT DEFAULT '',
      file_size INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  saveDb();
}

export async function initDb(): Promise<void> {
  const SQL = await initSqlJs();
  ensureDbDir();
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  initSchema();
}

export function getDb(): SqlJsDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.');
  }
  return db;
}

export function closeDb() {
  if (db) {
    saveDb();
    db.close();
  }
}

export { saveDb };
