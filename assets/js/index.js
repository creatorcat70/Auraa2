const tabBar = document.getElementById("tabBar");
const iframeContainer = document.getElementById("iframeContainer");
const urlInput = document.getElementById("urlInput");
const searchForm = document.getElementById("searchForm");
const addTabBtn = document.getElementById("addTabBtn");

let tabCount = 0;
let currentTabId = null;

function formatUrl(input) {
  input = input.trim();
  if (!input) return "https://google.com";
  const fullUrl = input.startsWith("http") ? input : "https://" + input;
  if (typeof __uv$config !== "undefined") {
    const encoded = __uv$config.encodeUrl(fullUrl);
    return __uv$config.prefix + encoded;
  } else {
    console.warn("[UV] __uv$config is not loaded.");
    return fullUrl;
  }
}

function createTab(url = "https://google.com") {
  const tabId = "tab" + tabCount++;
  const tabBtn = document.createElement("button");
  tabBtn.className = "tab";
  tabBtn.dataset.tab = tabId;
  tabBtn.textContent = "Tab " + tabCount;
  tabBar.insertBefore(tabBtn, addTabBtn);

  const iframe = document.createElement("iframe");
  iframe.dataset.tab = tabId;
  iframe.src = formatUrl(url);
  iframe.className = "active";
  iframeContainer.appendChild(iframe);

  tabBtn.addEventListener("click", () => setActiveTab(tabId));
  setActiveTab(tabId);
}

function setActiveTab(tabId) {
  currentTabId = tabId;
  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.tab === tabId);
  });
  document.querySelectorAll("iframe").forEach(frame => {
    frame.classList.toggle("active", frame.dataset.tab === tabId);
  });
  const iframe = document.querySelector(`iframe[data-tab="${tabId}"]`);
  if (iframe) {
    const url = iframe.src.replace(__uv$config?.prefix || "", "");
    urlInput.value = decodeURIComponent(url);
  }
}

if (addTabBtn) {
  addTabBtn.addEventListener("click", () => createTab());
}

if (searchForm) {
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const input = urlInput.value.trim();
    if (!input) return;

    if (!currentTabId) {
      createTab(input);
    } else {
      const iframe = document.querySelector(`iframe[data-tab="${currentTabId}"]`);
      if (iframe) iframe.src = formatUrl(input);
    }
  });
}

window.addEventListener("load", () => {
  console.log("[Auraa] Loaded. Creating default tab.");
  createTab();
});
