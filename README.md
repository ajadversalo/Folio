# Folio

An offline-friendly interactive reader with durable reader-state persistence in Turso.

## Run locally

```sh
npm install
npm run dev
```

Without configuration, Folio creates a local `folio.db` SQLite-compatible database. Open `http://localhost:4173`.

## Connect Turso

Copy `.env.example` to `.env`, add your database URL and token, then expose those variables to the Node process before running the app:

```sh
TURSO_DATABASE_URL=libsql://your-database-your-org.turso.io
TURSO_AUTH_TOKEN=your-token
npm run dev
```

The server creates the `reader_state` table on startup. Credentials stay on the server and are never sent to the browser. Each browser installation gets an anonymous ID used to sync page progress, theme, text size, sound preference, expanded sections, and bookmarks. Local storage remains as an offline cache.

## Verify

```sh
npm run build
```
