function runStealthMode() {
  localStorage.setItem("stealthModeEnabled", "false");
  const cloak = localStorage.getItem("auraaCloak") || "default";
  let title = "Auraa";
  let icon = "icon.png";
  if (cloak !== "default") {
    const parts = cloak.split("|");
    if (parts.length === 2) {
      icon = parts[0];
      title = parts[1];
    }
  }
  const src = window.location.href;
  const popup = window.open("about:blank", "_blank");
  if (!popup || popup.closed) {
    alert("Popup blocked. Please allow popups for Cloaking to work.");
    return;
  }
  popup.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <link rel="icon" href="${icon}">
        <style>
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
          }
          iframe {
            width: 100%;
            height: 100%;
            border: none;
          }
        </style>
      </head>
      <body>
        <iframe src="${src}"></iframe>
      </body>
    </html>
  `);
  popup.document.close();
  window.location.href = "https://www.google.com";
}

function generateSearchUrl(query) {
  try {
    const url = new URL(query);
    return url.toString();
  } catch {
    try {
      const url = new URL(`https://${query}`);
      if (url.hostname.includes('.')) return url.toString();
    } catch {}
  }
  return `https://startpage.com/search?q=${encodeURIComponent(query)}&source=web`;
}

function formatUrl(input) {
  input = input.trim();
  if (!input) return "https://google.com";
  if (typeof __uv$config !== "undefined") {
    const encoded = __uv$config.encodeUrl(input.startsWith("http") ? input : "https://" + input);
    return __uv$config.prefix + encoded;
  } else {
    return input.startsWith("http") ? input : "https://" + input;
  }
}

const tabBar = document.getElementById('tabBar');
const iframeContainer = document.getElementById('iframeContainer');
const urlInput = document.getElementById('urlInput');
const addTabBtn = document.getElementById('addTabBtn');

let tabCount = 0;
let currentTabId = null;

function createTab(url = "https://google.com") {
  const tabId = "tab" + tabCount++;
  const tabName = "Tab " + tabCount;

  const tabBtn = document.createElement("button");
  tabBtn.className = "tab";
  tabBtn.dataset.tab = tabId;
  tabBtn.innerHTML = `${tabName} <span class="closeBtn">&times;</span>`;
  tabBar.insertBefore(tabBtn, addTabBtn);

  const iframe = document.createElement("iframe");
  iframe.className = "tabIframe";
  iframe.dataset.tab = tabId;
  iframe.src = formatUrl(url);
  iframeContainer.appendChild(iframe);

  tabBtn.addEventListener("click", (e) => {
    if (e.target.classList.contains("closeBtn")) {
      closeTab(tabId);
    } else {
      setActiveTab(tabId);
    }
  });

  setActiveTab(tabId);
}

function setActiveTab(tabId) {
  currentTabId = tabId;
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.tab === tabId));
  document.querySelectorAll(".tabIframe").forEach(i => i.classList.toggle("active", i.dataset.tab === tabId));
  const activeIframe = document.querySelector(`.tabIframe[data-tab="${tabId}"]`);
  if (activeIframe) {
    const url = activeIframe.src;
    if (urlInput) urlInput.value = decodeURIComponent(url.replace(__uv$config?.prefix || "", ""));
  }
}

function closeTab(tabId) {
  const btn = document.querySelector(`.tab[data-tab="${tabId}"]`);
  const iframe = document.querySelector(`.tabIframe[data-tab="${tabId}"]`);
  if (btn) btn.remove();
  if (iframe) iframe.remove();
  if (currentTabId === tabId) {
    const remainingTabs = document.querySelectorAll('.tab');
    if (remainingTabs.length > 0) {
      setActiveTab(remainingTabs[0].dataset.tab);
    } else {
      currentTabId = null;
      if (urlInput) urlInput.value = "";
    }
  }
}

if (addTabBtn) {
  addTabBtn.addEventListener("click", () => {
    createTab();
  });
}

const searchForm = document.getElementById("searchForm");
if (searchForm) {
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const input = urlInput.value.trim();
    if (!input) return;
    if (!currentTabId) {
      createTab(input);
    } else {
      const iframe = document.querySelector(`.tabIframe[data-tab="${currentTabId}"]`);
      if (iframe) iframe.src = formatUrl(input);
    }
  });
}

window.onload = function () {
  const loaderEl = document.getElementById("loader");
  const contentEl = document.getElementById("content");
  if (loaderEl) loaderEl.style.display = "none";
  if (contentEl) contentEl.style.display = "block";

  if (navigator.getBattery) {
    navigator.getBattery().then(battery => {
      function updateBattery() {
        const batteryEl = document.getElementById("battery");
        if (batteryEl) batteryEl.textContent = `Battery: ${Math.round(battery.level * 100)}% ⚡`;
      }
      updateBattery();
      battery.addEventListener("levelchange", updateBattery);
    });
  }

  function updateTime() {
    const now = new Date();
    const timeEl = document.getElementById("time");
    if (timeEl) timeEl.textContent = "Time: " + now.toLocaleTimeString();
  }
  setInterval(updateTime, 1000);
  updateTime();

  const checkbox = document.getElementById("blankMode");
  if (checkbox) {
    const stealthEnabled = JSON.parse(localStorage.getItem("stealthModeEnabled")) || false;
    checkbox.checked = stealthEnabled;
    let stealthModeOpened = JSON.parse(localStorage.getItem("stealthModeOpened")) || false;
    if (stealthEnabled && !stealthModeOpened) {
      runStealthMode();
      localStorage.setItem("stealthModeOpened", "true");
    }
    checkbox.addEventListener("change", function () {
      const isChecked = checkbox.checked;
      localStorage.setItem("stealthModeEnabled", JSON.stringify(isChecked));
      if (isChecked) {
        if (!stealthModeOpened) {
          runStealthMode();
          localStorage.setItem("stealthModeOpened", "true");
          stealthModeOpened = true;
        }
      } else {
        localStorage.setItem("stealthModeOpened", "false");
        stealthModeOpened = false;
      }
    });
  }

  const messages = [
    "Sydney was here",
    "bebby was here",
    "Unlimited Aura.",
    "aura level 10000"
  ];
  const randomIndex = Math.floor(Math.random() * messages.length);
  const msgEl = document.getElementById("randomMessage");
  if (msgEl) msgEl.textContent = messages[randomIndex];

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`)
        .then(res => res.json())
        .then(data => {
          const current = data.current_weather;
          if (!current) throw new Error("No weather data");
          const temp = current.temperature;
          const code = current.weathercode;
          const icon = getWeatherEmoji(code);
          const desc = getWeatherDescription(code);
          const iconEl = document.getElementById("weatherIcon");
          const tempEl = document.getElementById("temperature");
          const textEl = document.getElementById("weatherText");
          if (iconEl) iconEl.textContent = icon;
          if (tempEl) tempEl.textContent = `${temp}°C`;
          if (textEl) textEl.textContent = desc;
        })
        .catch(() => {});
    }, () => {}, {timeout: 10000});
  }

  function getWeatherEmoji(code) {
    if ([0,1].includes(code)) return "☀️";
    if ([2,3].includes(code)) return "⛅";
    if ([45,48].includes(code)) return "🌫️";
    if ([51,53,55,56,57].includes(code)) return "🌧️";
    if ([61,63,65,66,67,80,81,82].includes(code)) return "🌦️";
    if ([71,73,75,77,85,86].includes(code)) return "❄️";
    if ([95,96,99].includes(code)) return "⛈️";
    return "❓";
  }

  function getWeatherDescription(code) {
    const map = {
      0: "Clear sky",
      1: "Mostly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      56: "Light freezing drizzle",
      57: "Dense freezing drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      66: "Light freezing rain",
      67: "Heavy freezing rain",
      71: "Slight snowfall",
      73: "Moderate snowfall",
      75: "Heavy snowfall",
      77: "Snow grains",
      80: "Light rain showers",
      81: "Moderate rain showers",
      82: "Heavy rain showers",
      85: "Light snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with light hail",
      99: "Thunderstorm with heavy hail"
    };
    return map[code] || "Unknown";
  }
};
