const { createClient } = require("@libsql/client");

const url = process.env.TURSO_DATABASE_URL || "file:folio.db";
const db = createClient({
  url,
  authToken: process.env.TURSO_AUTH_TOKEN || undefined
});

async function migrate() {
  await db.executeMultiple(`
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
  `);
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

module.exports = { migrate, getReaderState, saveReaderState };
