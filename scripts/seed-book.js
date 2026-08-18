require("dotenv").config({ path: [".env.local", ".env"], quiet: true });

const { createClient } = require("@libsql/client");
const { SCHEMA_SQL } = require("../db");

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;
const bookId = "oop-guide";

async function main() {
  if (!tursoUrl || !tursoToken) {
    throw new Error("Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in .env.local or .env before importing content.");
  }
  if (tursoUrl.startsWith("file:")) throw new Error("TURSO_DATABASE_URL must point to a remote Turso database.");

  require("../constants.js");
  const book = globalThis.FOLIO_BOOK;
  if (!book?.chapters) throw new Error("constants.js did not provide valid book content.");

  const remote = createClient({ url: tursoUrl, authToken: tursoToken });
  try {
    await remote.executeMultiple(SCHEMA_SQL);
    const statements = [
      { sql: "DELETE FROM pages WHERE book_id = ?", args: [bookId] },
      { sql: "DELETE FROM sections WHERE book_id = ?", args: [bookId] },
      { sql: "DELETE FROM topics WHERE book_id = ?", args: [bookId] },
      { sql: "DELETE FROM chapters WHERE book_id = ?", args: [bookId] },
      {
        sql: `INSERT INTO books (id, topic, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
              ON CONFLICT(id) DO UPDATE SET topic = excluded.topic, updated_at = CURRENT_TIMESTAMP`,
        args: [bookId, book.topic]
      }
    ];
    let topicCount = 0;
    let sectionCount = 0;
    let pageCount = 0;

    book.chapters.forEach((chapter, chapterIndex) => {
      const chapterId = `${bookId}:c:${chapterIndex}`;
      statements.push({
        sql: "INSERT INTO chapters (id, book_id, number, title, sort_order) VALUES (?, ?, ?, ?, ?)",
        args: [chapterId, bookId, chapter.number, chapter.title, chapterIndex]
      });
      (chapter.topics || []).forEach((topic, topicIndex) => {
        topicCount += 1;
        const topicId = `${chapterId}:t:${topicIndex}`;
        statements.push({
          sql: "INSERT INTO topics (id, book_id, chapter_id, number, title, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
          args: [topicId, bookId, chapterId, topic.number, topic.title, topicIndex]
        });
        (topic.sections || []).forEach((section, sectionIndex) => {
          sectionCount += 1;
          const sectionId = `${topicId}:s:${sectionIndex}`;
          statements.push({
            sql: "INSERT INTO sections (id, book_id, topic_id, number, title, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
            args: [sectionId, bookId, topicId, section.number, section.title, sectionIndex]
          });
          (section.pages || []).forEach((page, pageIndex) => {
            pageCount += 1;
            statements.push({
              sql: `INSERT INTO pages
                      (id, book_id, section_id, kicker, title, lead, content, sort_order)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              args: [`${sectionId}:p:${pageIndex}`, bookId, sectionId, page.kicker || "", page.title, page.lead || "", page.content || "", pageIndex]
            });
          });
        });
      });
    });

    await remote.batch(statements, "write");
    console.log(`Book import complete: ${book.chapters.length} chapter(s), ${topicCount} topic(s), ${sectionCount} section(s), and ${pageCount} page(s).`);
  } finally {
    remote.close();
  }
}

main().catch(error => {
  console.error(`Book import failed: ${error.message}`);
  process.exitCode = 1;
});
