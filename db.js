const { createClient } = require("@libsql/client");

const url = process.env.TURSO_DATABASE_URL || "file:folio.db";
const db = createClient({
  url,
  authToken: process.env.TURSO_AUTH_TOKEN || undefined
});

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS reader_state (
    client_id TEXT PRIMARY KEY,
    current_page INTEGER NOT NULL DEFAULT 0 CHECK (current_page >= 0),
    theme TEXT NOT NULL DEFAULT 'paper' CHECK (theme IN ('paper', 'night', 'mist')),
    font_size INTEGER NOT NULL DEFAULT 16 CHECK (font_size BETWEEN 14 AND 22),
    page_sound INTEGER NOT NULL DEFAULT 1 CHECK (page_sound IN (0, 1)),
    expanded_groups TEXT NOT NULL DEFAULT '[]',
    bookmarks TEXT NOT NULL DEFAULT '[]',
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS books (
    id TEXT PRIMARY KEY,
    topic TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS chapters (
    id TEXT PRIMARY KEY,
    book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    number TEXT NOT NULL,
    title TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    UNIQUE (book_id, sort_order)
  );
  CREATE TABLE IF NOT EXISTS topics (
    id TEXT PRIMARY KEY,
    book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    chapter_id TEXT NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    number TEXT NOT NULL,
    title TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    UNIQUE (chapter_id, sort_order)
  );
  CREATE TABLE IF NOT EXISTS sections (
    id TEXT PRIMARY KEY,
    book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    number TEXT NOT NULL,
    title TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    UNIQUE (topic_id, sort_order)
  );
  CREATE TABLE IF NOT EXISTS pages (
    id TEXT PRIMARY KEY,
    book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    section_id TEXT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    kicker TEXT NOT NULL DEFAULT '',
    title TEXT NOT NULL,
    lead TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL,
    UNIQUE (section_id, sort_order)
  );
  CREATE INDEX IF NOT EXISTS idx_chapters_book ON chapters(book_id, sort_order);
  CREATE INDEX IF NOT EXISTS idx_topics_chapter ON topics(chapter_id, sort_order);
  CREATE INDEX IF NOT EXISTS idx_sections_topic ON sections(topic_id, sort_order);
  CREATE INDEX IF NOT EXISTS idx_pages_section ON pages(section_id, sort_order);
`;

async function migrate() {
  await db.executeMultiple(SCHEMA_SQL);
}

async function getReaderState(clientId) {
  const result = await db.execute({
    sql: `SELECT current_page, theme, font_size, page_sound, expanded_groups, bookmarks, updated_at
          FROM reader_state WHERE client_id = ?`,
    args: [clientId]
  });
  if (!result.rows.length) return null;
  const row = result.rows[0];
  return {
    currentPage: Number(row.current_page),
    theme: String(row.theme),
    fontSize: Number(row.font_size),
    pageSound: Boolean(row.page_sound),
    expandedGroups: JSON.parse(String(row.expanded_groups)),
    bookmarks: JSON.parse(String(row.bookmarks)),
    updatedAt: String(row.updated_at)
  };
}

async function saveReaderState(clientId, state) {
  await db.execute({
    sql: `INSERT INTO reader_state
            (client_id, current_page, theme, font_size, page_sound, expanded_groups, bookmarks, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
          ON CONFLICT(client_id) DO UPDATE SET
            current_page = excluded.current_page,
            theme = excluded.theme,
            font_size = excluded.font_size,
            page_sound = excluded.page_sound,
            expanded_groups = excluded.expanded_groups,
            bookmarks = excluded.bookmarks,
            updated_at = CURRENT_TIMESTAMP`,
    args: [
      clientId,
      state.currentPage,
      state.theme,
      state.fontSize,
      state.pageSound ? 1 : 0,
      JSON.stringify(state.expandedGroups),
      JSON.stringify(state.bookmarks)
    ]
  });
  return getReaderState(clientId);
}

async function getBook(bookId = "oop-guide") {
  const bookResult = await db.execute({ sql: "SELECT id, topic FROM books WHERE id = ?", args: [bookId] });
  if (!bookResult.rows.length) return null;
  const [chapterResult, topicResult, sectionResult, pageResult] = await Promise.all([
    db.execute({ sql: "SELECT id, number, title FROM chapters WHERE book_id = ? ORDER BY sort_order", args: [bookId] }),
    db.execute({ sql: "SELECT id, chapter_id, number, title FROM topics WHERE book_id = ? ORDER BY chapter_id, sort_order", args: [bookId] }),
    db.execute({ sql: "SELECT id, topic_id, number, title FROM sections WHERE book_id = ? ORDER BY topic_id, sort_order", args: [bookId] }),
    db.execute({ sql: "SELECT section_id, kicker, title, lead, content FROM pages WHERE book_id = ? ORDER BY section_id, sort_order", args: [bookId] })
  ]);
  const pagesBySection = new Map();
  for (const row of pageResult.rows) {
    if (!pagesBySection.has(row.section_id)) pagesBySection.set(row.section_id, []);
    pagesBySection.get(row.section_id).push({ kicker: row.kicker, title: row.title, lead: row.lead, content: row.content });
  }
  const sectionsByTopic = new Map();
  for (const row of sectionResult.rows) {
    if (!sectionsByTopic.has(row.topic_id)) sectionsByTopic.set(row.topic_id, []);
    sectionsByTopic.get(row.topic_id).push({ number: row.number, title: row.title, pages: pagesBySection.get(row.id) || [] });
  }
  const topicsByChapter = new Map();
  for (const row of topicResult.rows) {
    if (!topicsByChapter.has(row.chapter_id)) topicsByChapter.set(row.chapter_id, []);
    topicsByChapter.get(row.chapter_id).push({ number: row.number, title: row.title, sections: sectionsByTopic.get(row.id) || [] });
  }
  return {
    topic: String(bookResult.rows[0].topic),
    chapters: chapterResult.rows.map(row => ({ number: row.number, title: row.title, topics: topicsByChapter.get(row.id) || [] }))
  };
}

module.exports = { SCHEMA_SQL, migrate, getBook, getReaderState, saveReaderState };
