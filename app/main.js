import { trimUrl, isValidUrl } from "./utils.js";
let pages = [];
chrome.storage.local.get("pages").then((p) => {
  pages = p.pages || [];
  renderPages();
});

function setPages(p) {
  chrome.storage.local.set({ pages: p });
  pages = p;
  renderPages();
}
const trashIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`;

function removePage(id) {
  setPages(pages.filter((page) => page.id !== id));
  showMessage("Page removed", "success");
}

function removePageButton(id) {
  const button = document.createElement("button");
  button.classList.add("trash-button");
  button.innerHTML = trashIcon;
  button.addEventListener("click", () => removePage(id));

  return button;
}

const messages = document.getElementById("logs");
function showMessage(log, type) {
  if (messages.children.length >= 2) {
    messages.removeChild(messages.children[0]);
  }

  const randId = Math.random().toString(36).substring(7);

  const el = document.createElement("div");
  el.classList.add("log", type === "error" ? "log-error" : "log-success");
  el.textContent = log;
  el.id = randId;

  messages.appendChild(el);

  setTimeout(() => {
    const el = document.getElementById(randId);
    if (!el) return;
    messages.removeChild(el);
  }, 3000);
}

document.getElementById("addPageButton").addEventListener("click", addPage);
function addPage() {
  const urlInput = document.getElementById("newPageUrl");
  const url = trimUrl(urlInput.value);
  const urlValidity = isValidUrl(url, pages);
  if (urlValidity !== true) {
    showMessage(urlValidity, "error");
    return;
  }

  setPages([{ id: Date.now(), url: url }, ...pages]);
  urlInput.value = "";
  showMessage("Page added", "success");
}

document
  .getElementById("addCurrentPageButton")
  .addEventListener("click", addCurrentPage);
function addCurrentPage() {
  //get current tab url
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.log(tabs);
    const url = trimUrl(tabs[0].url);
    const urlValidity = isValidUrl(url, pages);
    if (urlValidity !== true) {
      showMessage(urlValidity, "error");
      return;
    }

    setPages([{ id: Date.now(), url: url }, ...pages]);
    showMessage("Page added", "success");
  });
}

function renderPages() {
  const pageList = document.getElementById("page-list");
  pageList.innerHTML = "";
  pages.forEach((page) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = page.url;
    li.appendChild(span);
    li.appendChild(removePageButton(page.id));
    pageList.appendChild(li);
  });
}

const aboutLink = document.getElementById("about-link");
aboutLink.addEventListener("click", (e) => {
  e.preventDefault();
  chrome.tabs.create({ url: "https://tivoku.com/website-blocker" });
});
