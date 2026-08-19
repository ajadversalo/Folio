(() => {
  const panel = document.querySelector("#sidebarManagement");
  const contents = document.querySelector("#contents");
  const access = document.querySelector("#sidebarAccess");
  const workspace = document.querySelector("#sidebarWorkspace");
  const keyInput = document.querySelector("#sidebarAdminKey");
  const chapterSelect = document.querySelector("#sidebarChapterSelect");
  const structure = document.querySelector("#sidebarStructure");
  let adminKey = sessionStorage.getItem("folio-admin-key") || "";

  function toast(message) {
    const element = document.querySelector("#toast");
    element.textContent = message;
    element.classList.add("show");
    setTimeout(() => element.classList.remove("show"), 2200);
  }

  async function request(path, options = {}) {
    const response = await fetch(path, {
      ...options,
      headers: { "Content-Type": "application/json", "X-Folio-Admin-Key": adminKey, ...options.headers }
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || `Request failed (${response.status})`);
    return payload;
  }

  function showEditor() {
    panel.hidden = false;
    contents.hidden = true;
    sessionStorage.setItem("folio-management-open", "1");
    document.body.classList.add("menu-open");
  }

  function hideEditor() {
    panel.hidden = true;
    contents.hidden = false;
    sessionStorage.removeItem("folio-management-open");
  }

  function renderChapters(chapters) {
    chapterSelect.innerHTML = chapters.map(chapter => {
      const option = document.createElement("option");
      option.value = chapter.id;
      option.textContent = `${chapter.number} · ${chapter.title}`;
      return option.outerHTML;
    }).join("");
    chapterSelect.disabled = !chapters.length;
    document.querySelector("#sidebarTopicForm button").disabled = !chapters.length;
    structure.replaceChildren(...chapters.map(chapter => {
      const group = document.createElement("div");
      group.className = "sidebar-content-group";
      const chapterRow = document.createElement("div");
      chapterRow.className = "sidebar-content-row chapter";
      const chapterName = document.createElement("strong");
      chapterName.textContent = `${chapter.number} · ${chapter.title}`;
      const chapterDelete = document.createElement("button");
      chapterDelete.type = "button";
      chapterDelete.textContent = "Delete";
      chapterDelete.dataset.deleteChapter = chapter.id;
      chapterDelete.dataset.label = chapter.title;
      chapterRow.append(chapterName, chapterDelete);
      group.append(chapterRow);
      chapter.topics.forEach(topic => {
        const topicRow = document.createElement("div");
        topicRow.className = "sidebar-content-row topic";
        const topicName = document.createElement("span");
        topicName.textContent = `${topic.number} · ${topic.title}`;
        const topicDelete = document.createElement("button");
        topicDelete.type = "button";
        topicDelete.textContent = "Delete";
        topicDelete.dataset.deleteTopic = topic.id;
        topicDelete.dataset.label = topic.title;
        topicRow.append(topicName, topicDelete);
        group.append(topicRow);
      });
      return group;
    }));
  }

  async function unlock() {
    const content = await request("/api/admin/content");
    sessionStorage.setItem("folio-admin-key", adminKey);
    renderChapters(content.chapters);
    access.hidden = true;
    workspace.hidden = false;
  }

  document.querySelector("#sidebarEditButton").addEventListener("click", showEditor);
  document.querySelector("#sidebarEditorClose").addEventListener("click", hideEditor);
  document.querySelector("#settingsManageButton").addEventListener("click", () => {
    document.querySelector("#settingsDialog").close();
    showEditor();
  });
  document.querySelector("#sidebarAccessForm").addEventListener("submit", async event => {
    event.preventDefault();
    adminKey = keyInput.value;
    try { await unlock(); } catch (error) { toast(error.message); }
  });
  document.querySelector("#sidebarLockButton").addEventListener("click", () => {
    adminKey = "";
    sessionStorage.removeItem("folio-admin-key");
    workspace.hidden = true;
    access.hidden = false;
    keyInput.value = "";
  });
  document.querySelector("#sidebarChapterForm").addEventListener("submit", async event => {
    event.preventDefault();
    try {
      await request("/api/admin/chapters", { method: "POST", body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) });
      location.reload();
    } catch (error) { toast(error.message); }
  });
  document.querySelector("#sidebarTopicForm").addEventListener("submit", async event => {
    event.preventDefault();
    try {
      await request("/api/admin/topics", { method: "POST", body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) });
      location.reload();
    } catch (error) { toast(error.message); }
  });
  structure.addEventListener("click", async event => {
    const button = event.target.closest("[data-delete-chapter],[data-delete-topic]");
    if (!button) return;
    const isChapter = Boolean(button.dataset.deleteChapter);
    const id = isChapter ? button.dataset.deleteChapter : button.dataset.deleteTopic;
    const kind = isChapter ? "chapter" : "topic";
    const nestedWarning = isChapter ? " and all of its topics and pages" : " and all of its pages";
    if (!window.confirm(`Delete the ${kind} “${button.dataset.label}”${nestedWarning}? This cannot be undone.`)) return;
    button.disabled = true;
    try {
      await request(`/api/admin/${isChapter ? "chapters" : "topics"}`, { method: "DELETE", body: JSON.stringify({ id }) });
      location.reload();
    } catch (error) {
      button.disabled = false;
      toast(error.message);
    }
  });

  if (sessionStorage.getItem("folio-management-open") === "1") showEditor();
  if (adminKey) unlock().catch(() => {
    adminKey = "";
    sessionStorage.removeItem("folio-admin-key");
  });
})();
