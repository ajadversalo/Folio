const book = globalThis.FOLIO_BOOK;
const pages = book.chapters.flatMap((chapter, chapterIndex) =>
  chapter.topics.flatMap((topic, topicIndex) =>
    topic.sections.flatMap((section, sectionIndex) =>
      section.pages.map((page, pageIndex) => ({
        ...page,
        chapterIndex,
        topicIndex,
        sectionIndex,
        pageIndex
      }))
    )
  )
);
let current = Math.min(Number(localStorage.getItem("folio-page") || 0), pages.length - 1);
const defaultExpandedGroups = book.chapters.flatMap((chapter, ci) => [
  `chapter-${ci}`,
  ...chapter.topics.flatMap((topic, ti) => [
    `topic-${ci}-${ti}`,
    ...topic.sections.map((section, si) => `section-${ci}-${ti}-${si}`)
  ])
]);
let expandedGroups;
try {
  const savedGroups = JSON.parse(localStorage.getItem("folio-expanded-groups"));
  expandedGroups = new Set(Array.isArray(savedGroups) ? savedGroups : defaultExpandedGroups);
} catch {
  expandedGroups = new Set(defaultExpandedGroups);
}
let theme = localStorage.getItem("folio-theme") || "paper";
let readerSize = Math.max(14, Math.min(22, Number(localStorage.getItem("folio-font-size") || 16)));
let pageSoundEnabled = localStorage.getItem("folio-page-sound") !== "0";
const pageEl = document.querySelector("#page");
const settingsDialog = document.querySelector("#settingsDialog");
const pageSoundToggle = document.querySelector("#pageSoundToggle");
let pageAudioContext;
let pageSoundBuffer;
let activePageSound;

function createPageSoundBuffer(audioContext) {
  const duration = 0.12;
  const sampleCount = Math.ceil(audioContext.sampleRate * duration);
  const buffer = audioContext.createBuffer(1, sampleCount, audioContext.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let i = 0; i < sampleCount; i += 1) {
    const time = i / audioContext.sampleRate;
    const attack = Math.min(1, time / 0.006);
    const decay = Math.pow(1 - (i / sampleCount), 2.4);
    const tone = Math.sin(2 * Math.PI * 680 * time) + (0.2 * Math.sin(2 * Math.PI * 1360 * time));
    samples[i] = tone * attack * decay * 0.28;
  }
  return buffer;
}

async function playPageSound() {
  if (!pageSoundEnabled) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  pageAudioContext ||= new AudioContextClass();
  if (pageAudioContext.state === "suspended") {
    try { await pageAudioContext.resume(); }
    catch { return; }
  }
  pageSoundBuffer ||= createPageSoundBuffer(pageAudioContext);
  if (activePageSound) {
    try { activePageSound.stop(); }
    catch {}
  }
  const source = pageAudioContext.createBufferSource();
  activePageSound = source;
  source.buffer = pageSoundBuffer;
  source.connect(pageAudioContext.destination);
  source.start();
  source.addEventListener("ended", () => {
    source.disconnect();
    if (activePageSound === source) activePageSound = null;
  });
}

function setPage(index) {
  const next = Math.max(0, Math.min(pages.length - 1, index));
  if (next === current) return;
  current = next;
  playPageSound();
  render();
}

function renderContents() {
  document.querySelector("#contents").innerHTML = book.chapters.map((chapter, ci) =>
    `<section class="chapter-group">
      <button class="chapter-title group-toggle" data-toggle="chapter-${ci}" aria-expanded="${expandedGroups.has(`chapter-${ci}`)}" aria-controls="chapter-${ci}-content"><span>${chapter.number}</span>${chapter.title}<i aria-hidden="true"></i></button>
      <div id="chapter-${ci}-content" class="group-children" ${expandedGroups.has(`chapter-${ci}`) ? "" : "hidden"}>
      ${chapter.topics.map((topic, ti) => {
        const topicKey = `topic-${ci}-${ti}`;
        return `<div class="topic-group">
          <button class="topic-title group-toggle" data-toggle="${topicKey}" aria-expanded="${expandedGroups.has(topicKey)}" aria-controls="${topicKey}-content"><span>${topic.number}</span>${topic.title}<i aria-hidden="true"></i></button>
          <div id="${topicKey}-content" class="group-children" ${expandedGroups.has(topicKey) ? "" : "hidden"}>
          ${topic.sections.map((section, si) => {
            const sectionKey = `section-${ci}-${ti}-${si}`;
            return `<div class="section-group">
              <button class="section-title group-toggle ${pages[current].sectionIndex === si && pages[current].topicIndex === ti && pages[current].chapterIndex === ci ? "active" : ""}" data-toggle="${sectionKey}" aria-expanded="${expandedGroups.has(sectionKey)}" aria-controls="${sectionKey}-content"><span>${section.number}</span>${section.title}<i aria-hidden="true"></i></button>
              <div id="${sectionKey}-content" class="group-children" ${expandedGroups.has(sectionKey) ? "" : "hidden"}>
              ${section.pages.map((page, pi) => {
                const i = pages.findIndex(p => p.chapterIndex === ci && p.topicIndex === ti && p.sectionIndex === si && p.pageIndex === pi);
                return `<button class="page-link ${i === current ? "active" : ""}" data-page="${i}"><span>${String(pi + 1).padStart(2,"0")}</span>${page.title}</button>`;
              }).join("")}
              </div>
            </div>`;
          }).join("")}
          </div>
        </div>`
      }).join("")}
      </div>
    </section>`
  ).join("");
  document.querySelectorAll("[data-toggle]").forEach(button => button.addEventListener("click", () => {
    const key = button.dataset.toggle;
    if (expandedGroups.has(key)) expandedGroups.delete(key);
    else expandedGroups.add(key);
    localStorage.setItem("folio-expanded-groups", JSON.stringify([...expandedGroups]));
    renderContents();
  }));
  document.querySelectorAll("[data-page]").forEach(button => button.addEventListener("click", () => { setPage(Number(button.dataset.page)); closeMenu(); }));
}
function render() {
  const p = pages[current];
  pageEl.classList.remove("turning"); void pageEl.offsetWidth; pageEl.classList.add("turning");
  pageEl.innerHTML = `<div class="page-number">${String(current + 1).padStart(2,"0")}</div><p class="kicker">${p.kicker}</p><h2>${p.title}</h2><p class="lead">${p.lead}</p><div class="rule"><span></span></div><div class="page-content">${p.content}</div>`;
  document.querySelector("#currentPage").textContent = current + 1;
  document.querySelector("#totalPages").textContent = pages.length;
  document.querySelector("#prevButton").disabled = current === 0;
  document.querySelector("#nextButton").disabled = current === pages.length - 1;
  const progress = Math.round(((current + 1) / pages.length) * 100);
  document.querySelector("#progressLabel").textContent = `${progress}% complete`;
  document.querySelector("#progressBar").style.width = `${progress}%`;
  localStorage.setItem("folio-page", current); renderContents(); pageEl.focus({preventScroll:true});
}
function move(step) { setPage(current + step); }
function openMenu() { document.body.classList.add("menu-open"); }
function closeMenu() { document.body.classList.remove("menu-open"); }
document.querySelector("#prevButton").addEventListener("click", () => move(-1));
document.querySelector("#nextButton").addEventListener("click", () => move(1));
document.querySelector("#menuButton").addEventListener("click", openMenu);
document.querySelector("#closeButton").addEventListener("click", closeMenu);
document.querySelector("#scrim").addEventListener("click", closeMenu);
document.addEventListener("keydown", e => { if (!settingsDialog.open && e.key === "ArrowRight") move(1); if (!settingsDialog.open && e.key === "ArrowLeft") move(-1); if (e.key === "Escape") closeMenu(); });
document.querySelector("#themeButton").addEventListener("click", () => { theme = theme === "paper" ? "night" : theme === "night" ? "mist" : "paper"; document.body.dataset.theme = theme; localStorage.setItem("folio-theme", theme); });
function applyReaderSize() {
  document.documentElement.style.setProperty("--reader-size", `${readerSize}px`);
  document.documentElement.style.setProperty("--code-size", `${Math.max(11, readerSize - 3)}px`);
  document.querySelector("#fontDecrease").disabled = readerSize === 14;
  document.querySelector("#fontIncrease").disabled = readerSize === 22;
  localStorage.setItem("folio-font-size", readerSize);
}
function changeReaderSize(change) {
  readerSize = Math.max(14, Math.min(22, readerSize + change));
  applyReaderSize();
  showToast(`Reading text: ${readerSize}px`);
}
document.querySelector("#fontDecrease").addEventListener("click", () => changeReaderSize(-1));
document.querySelector("#fontIncrease").addEventListener("click", () => changeReaderSize(1));
document.querySelector("#bookmarkButton").addEventListener("click", e => { const key = `folio-bookmark-${current}`; const on = localStorage.getItem(key) !== "1"; localStorage.setItem(key, on ? "1" : "0"); e.currentTarget.classList.toggle("saved", on); showToast(on ? "Page saved" : "Bookmark removed"); });
document.querySelector("#settingsButton").addEventListener("click", () => settingsDialog.showModal());
document.querySelector("#settingsCloseButton").addEventListener("click", () => settingsDialog.close());
settingsDialog.addEventListener("click", event => { if (event.target === settingsDialog) settingsDialog.close(); });
pageSoundToggle.addEventListener("change", () => {
  pageSoundEnabled = pageSoundToggle.checked;
  localStorage.setItem("folio-page-sound", pageSoundEnabled ? "1" : "0");
  if (pageSoundEnabled) playPageSound();
});
function showToast(message) { const toast = document.querySelector("#toast"); toast.textContent = message; toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 1800); }
pageSoundToggle.checked = pageSoundEnabled;
document.body.dataset.theme = theme; applyReaderSize(); render();
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js"));
