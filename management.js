const accessCard = document.querySelector("#accessCard");
const workspace = document.querySelector("#workspace");
const adminKeyInput = document.querySelector("#adminKey");
const chapterSelect = document.querySelector("#chapterSelect");
let adminKey = sessionStorage.getItem("folio-admin-key") || "";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

async function adminRequest(path, options = {}) {
  const response = await fetch(path, { ...options, headers: { "Content-Type": "application/json", "X-Folio-Admin-Key": adminKey, ...options.headers } });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || `Request failed (${response.status})`);
  return payload;
}

function renderStructure(chapters) {
  chapterSelect.innerHTML = chapters.map(chapter => `<option value="${escapeHtml(chapter.id)}">${escapeHtml(chapter.number)} · ${escapeHtml(chapter.title)}</option>`).join("");
  chapterSelect.disabled = !chapters.length;
  document.querySelector("#topicForm button").disabled = !chapters.length;
  document.querySelector("#structure").innerHTML = chapters.map(chapter => `
    <article class="chapter-row"><span class="chapter-number">${escapeHtml(chapter.number)}</span><div><h3>${escapeHtml(chapter.title)}</h3>
    <div class="topics">${chapter.topics.length ? chapter.topics.map(topic => `<span class="topic">${escapeHtml(topic.number)} · ${escapeHtml(topic.title)}</span>`).join("") : '<span class="empty">No topics yet</span>'}</div></div></article>`).join("");
}

async function unlock() {
  const content = await adminRequest("/api/admin/content");
  sessionStorage.setItem("folio-admin-key", adminKey);
  renderStructure(content.chapters);
  accessCard.hidden = true;
  workspace.hidden = false;
}

document.querySelector("#accessForm").addEventListener("submit", async event => {
  event.preventDefault();
  adminKey = adminKeyInput.value;
  try { await unlock(); } catch (error) { showToast(error.message); }
});

document.querySelector("#lockButton").addEventListener("click", () => {
  adminKey = ""; sessionStorage.removeItem("folio-admin-key"); workspace.hidden = true; accessCard.hidden = false; adminKeyInput.value = "";
});

document.querySelector("#chapterForm").addEventListener("submit", async event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  try {
    await adminRequest("/api/admin/chapters", { method: "POST", body: JSON.stringify(Object.fromEntries(form)) });
    event.currentTarget.reset(); await unlock(); showToast("Chapter added");
  } catch (error) { showToast(error.message); }
});

document.querySelector("#topicForm").addEventListener("submit", async event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  try {
    await adminRequest("/api/admin/topics", { method: "POST", body: JSON.stringify(Object.fromEntries(form)) });
    event.currentTarget.reset(); await unlock(); showToast("Topic added");
  } catch (error) { showToast(error.message); }
});

if (adminKey) unlock().catch(() => sessionStorage.removeItem("folio-admin-key"));
