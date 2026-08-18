require("dotenv").config({ path: [".env.local", ".env"], quiet: true });

const fs = require("fs");
const path = require("path");
const { createClient } = require("@libsql/client");
const { SCHEMA_SQL } = require("../db");

const projectRoot = path.resolve(__dirname, "..");
const localDatabasePath = path.resolve(projectRoot, process.env.LOCAL_DATABASE_PATH || "folio.db");
const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

async function main() {
  if (!fs.existsSync(localDatabasePath)) {
    throw new Error(`Local database not found: ${localDatabasePath}`);
  }
  if (!tursoUrl || !tursoToken) {
    throw new Error("Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in .env before migrating data.");
  }
  if (tursoUrl.startsWith("file:")) {
    throw new Error("TURSO_DATABASE_URL must point to a remote Turso database, not a local file.");
  }

  const local = createClient({ url: `file:${localDatabasePath}` });
  const remote = createClient({ url: tursoUrl, authToken: tursoToken });

  try {
    const source = await local.execute(`
      SELECT client_id, current_page, theme, font_size, page_sound,
             expanded_groups, bookmarks, updated_at
      FROM reader_state
    `);

    await remote.executeMultiple(SCHEMA_SQL);
    let changed = 0;

    for (const row of source.rows) {
      const result = await remote.execute({
        sql: `INSERT INTO reader_state
                (client_id, current_page, theme, font_size, page_sound,
                 expanded_groups, bookmarks, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
              ON CONFLICT(client_id) DO UPDATE SET
                current_page = excluded.current_page,
                theme = excluded.theme,
                font_size = excluded.font_size,
                page_sound = excluded.page_sound,
                expanded_groups = excluded.expanded_groups,
                bookmarks = excluded.bookmarks,
                updated_at = excluded.updated_at
              WHERE excluded.updated_at > reader_state.updated_at`,
        args: [
          row.client_id,
          row.current_page,
          row.theme,
          row.font_size,
          row.page_sound,
          row.expanded_groups,
          row.bookmarks,
          row.updated_at
        ]
      });
      changed += result.rowsAffected;
    }

    console.log(`Migration complete: ${source.rows.length} local row(s) scanned, ${changed} Turso row(s) inserted or updated.`);
  } finally {
    local.close();
    remote.close();
  }
}

main().catch(error => {
  console.error(`Migration failed: ${error.message}`);
  process.exitCode = 1;
});
