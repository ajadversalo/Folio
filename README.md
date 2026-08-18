# Folio

An offline-friendly interactive reader with durable reader-state persistence in Turso.

## Run locally

```sh
npm install
npm run dev
```

Without configuration, Folio creates a local `folio.db` SQLite-compatible database. Open `http://localhost:4173`.

## Connect Turso

Copy `.env.example` to `.env.local` (or `.env`) and add your database URL and token before running the app:

```sh
TURSO_DATABASE_URL=libsql://your-database-your-org.turso.io
TURSO_AUTH_TOKEN=your-token
npm run dev
```

The server creates the `reader_state` table on startup. Credentials stay on the server and are never sent to the browser. Each browser installation gets an anonymous ID used to sync page progress, theme, text size, sound preference, expanded sections, and bookmarks. Local storage remains as an offline cache.

## Import and manage book content

Import the complete hierarchy from `constants.js` into Turso:

```sh
npm run db:seed-book
```

The import transaction upserts the `books`, `chapters`, `topics`, `sections`, and `pages` records from the bundled source. It preserves empty hierarchy entries, display order, and records created through management. The reader loads this content from `/api/book`; bundled content remains available as an offline fallback.

Run this command again after changing bundled content. Once Turso is the editorial source of truth, content can instead be changed directly in those tables without rebuilding the application.

## Content management

Set a long random management secret in `.env.local` or in the deployment environment:

```env
FOLIO_ADMIN_KEY=choose-a-long-random-secret
```

Start Folio and open `http://localhost:4173/management.html`. Enter the secret to create empty chapters and topics. Management writes are validated and authorized on the server; the entered key is retained only for the current browser tab.

## Migrate an existing local database

After configuring the remote Turso credentials in `.env.local` or `.env`, run:

```sh
npm run db:migrate-data
```

This reads `folio.db` and upserts its reader-state rows into Turso. Existing Turso rows are only replaced when the local row has a newer `updated_at` timestamp, so the command is safe to run again. Set `LOCAL_DATABASE_PATH` in `.env` if the local database is elsewhere.

## Verify

```sh
npm run build
```
