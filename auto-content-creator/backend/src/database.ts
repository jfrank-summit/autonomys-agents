import Database from 'better-sqlite3';
import dotenv from 'dotenv';

dotenv.config();

const dbName = process.env.DATABASE_NAME || 'database.sqlite';
console.log(`Initializing database: ${dbName}`);
const db = new Database(dbName);

export const initializeDatabase = (): void => {
  console.log('Initializing database tables');
  db.exec(`
    CREATE TABLE IF NOT EXISTS content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT,
      topic TEXT,
      contentType TEXT,
      finalContent TEXT,
      research TEXT,
      reflections TEXT,
      drafts TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('Database tables initialized');
};

export const insertContent = (
  category: string,
  topic: string,
  contentType: string,
  finalContent: string,
  research: string,
  reflections: string,
  drafts: string
): number => {
  console.log(`Inserting new content. Category: ${category}, Topic: ${topic}`);
  const stmt = db.prepare(`
    INSERT INTO content (category, topic, contentType, finalContent, research, reflections, drafts, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `);
  const result = stmt.run(category, topic, contentType, finalContent, research, reflections, drafts);
  console.log(`Content inserted with ID: ${result.lastInsertRowid}`);
  return result.lastInsertRowid as number;
};

export const getContentById = (id: number): any => {
  console.log(`Fetching content with ID: ${id}`);
  const stmt = db.prepare('SELECT *, datetime(createdAt) as createdAt FROM content WHERE id = ?');
  const result = stmt.get(id);
  console.log(result ? `Content found for ID: ${id}` : `No content found for ID: ${id}`);
  return result;
};

export const getAllContent = (page: number, limit: number): { contents: any[]; total: number } => {
  console.log(`Fetching all content. Page: ${page}, Limit: ${limit}`);
  const offset = (page - 1) * limit;

  const countStmt = db.prepare('SELECT COUNT(*) as total FROM content');
  const { total } = countStmt.get() as { total: number };

  const stmt = db.prepare(`
    SELECT *, datetime(createdAt) as createdAt FROM content
    ORDER BY createdAt DESC
    LIMIT ? OFFSET ?
  `);
  const contents = stmt.all(limit, offset);

  console.log(`Fetched ${contents.length} contents. Total items: ${total}`);
  return { contents, total };
};
