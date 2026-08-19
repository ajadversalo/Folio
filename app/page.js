import LegacyScripts from "./legacy-scripts";

const readerScripts = ["/constants.js", "/reader.js", "/sidebar-management.js"];

export default function ReaderPage() {
  return <>
    <link rel="stylesheet" href="/reader.css" />
    <link rel="stylesheet" href="/typography.css" />
    <div className="app-shell">
      <header className="topbar">
        <button className="icon-button menu-button" id="menuButton" aria-label="Open contents"><span /><span /></button>
        <a className="brand" href="#" aria-label="Folio home"><span className="brand-mark">F</span><span>Folio</span></a>
        <div className="top-actions">
          <button className="text-button font-control" id="fontDecrease" aria-label="Decrease page font size">A−</button>
          <button className="text-button" id="themeButton" aria-label="Change reading theme">Aa</button>
          <button className="text-button font-control" id="fontIncrease" aria-label="Increase page font size">A+</button>
          <button className="icon-button bookmark-button" id="bookmarkButton" aria-label="Bookmark this page">◇</button>
          <button className="icon-button settings-button" id="settingsButton" aria-label="Open settings" title="Settings">⚙</button>
        </div>
      </header>
      <aside className="sidebar" id="sidebar" aria-label="Book contents">
        <div className="sidebar-head"><span className="eyebrow">Currently reading</span><div className="sidebar-head-actions"><button className="sidebar-edit-button" id="sidebarEditButton" aria-label="Edit contents">Edit</button><button className="close-button" id="closeButton" aria-label="Close contents">×</button></div></div>
        <h1 id="bookTitle">Folio</h1><p className="book-byline">Principles for maintainable software</p>
        <div className="progress-copy"><span id="progressLabel">0% complete</span><span>6 min read</span></div>
        <div className="progress-track"><span id="progressBar" /></div>
        <section className="sidebar-management" id="sidebarManagement" hidden>
          <div className="sidebar-management-head"><div><span className="eyebrow">Content management</span><h2>Edit contents</h2></div><button id="sidebarEditorClose" aria-label="Close editor">×</button></div>
          <div id="sidebarAccess">
            <p>Enter the admin key configured on the server.</p>
            <form id="sidebarAccessForm"><label>Admin key<input id="sidebarAdminKey" type="password" autoComplete="current-password" required /></label><button type="submit">Unlock</button></form>
          </div>
          <div id="sidebarWorkspace" hidden>
            <form className="sidebar-editor-form" id="sidebarChapterForm"><h3>Add chapter</h3><label>Number<input name="number" placeholder="08" maxLength="120" required /></label><label>Title<input name="title" placeholder="Architecture" maxLength="120" required /></label><button type="submit">Add chapter</button></form>
            <form className="sidebar-editor-form" id="sidebarTopicForm"><h3>Add topic</h3><label>Chapter<select name="chapterId" id="sidebarChapterSelect" required /></label><label>Number<input name="number" placeholder="01" maxLength="120" required /></label><label>Title<input name="title" placeholder="Fundamentals" maxLength="120" required /></label><button type="submit">Add topic</button></form>
            <section className="sidebar-content-list"><h3>Existing content</h3><div id="sidebarStructure" /></section>
            <button className="sidebar-lock-button" id="sidebarLockButton">Lock management</button>
          </div>
        </section>
        <nav id="contents" />
        <div className="sidebar-footer"><span>Folio No. 01</span><span>2026</span></div>
      </aside>
      <main className="reader">
        <div className="ambient-shape shape-one" /><div className="ambient-shape shape-two" />
        <article id="page" tabIndex="-1" />
        <footer className="page-controls">
          <button id="prevButton" aria-label="Previous page">← <span>Previous</span></button>
          <div className="page-count"><span id="currentPage">1</span><i /><span id="totalPages">1</span></div>
          <button id="nextButton" aria-label="Next page"><span>Next</span> →</button>
        </footer>
      </main>
    </div>
    <div className="scrim" id="scrim" />
    <dialog className="settings-dialog" id="settingsDialog" aria-labelledby="settingsTitle">
      <div className="settings-head"><div><span className="eyebrow">Preferences</span><h2 id="settingsTitle">Reading settings</h2></div><button className="close-button settings-close" id="settingsCloseButton" aria-label="Close settings">×</button></div>
      <label className="setting-row" htmlFor="pageSoundToggle"><span><strong>Page sound</strong><small>Play a short beep when switching pages</small></span><input type="checkbox" id="pageSoundToggle" /><i aria-hidden="true" /></label>
      <button className="setting-row management-link" id="settingsManageButton"><span><strong>Content management</strong><small>Add chapters and topics in the sidebar</small></span><b aria-hidden="true">→</b></button>
    </dialog>
    <div className="toast" id="toast" role="status" />
    <LegacyScripts scripts={readerScripts} />
  </>;
}
