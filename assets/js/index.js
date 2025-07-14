function waitForUVConfig() {
  return new Promise(resolve => {
    const check = () => {
      if (typeof __uv$config !== "undefined" && typeof __uv$config.encodeUrl === "function") {
        resolve();
      } else {
        setTimeout(check, 20);
      }
    };
    check();
  });
}

function runStealthMode() {
  const title = "Calculator - Google Search";
  const icon = "ixlicon.png"; // Ensure this icon exists in your project root or update path
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

  // Cloak current window
  window.location.href = "https://www.ixl.com";
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
  return `https://duckduckgo.com/search?q=${encodeURIComponent(query)}&source=web`;
}

window.onload = async function () {
  await waitForUVConfig();

  // Show main UI
  const loader = document.getElementById('loader');
  const content = document.getElementById('content');
  if (loader) loader.style.display = 'none';
  if (content) content.style.display = 'block';

  // Stealth mode setup
  const checkbox = document.getElementById("blankMode");
  const stealth = JSON.parse(localStorage.getItem("stealthModeEnabled")) || false;
  if (checkbox) {
    checkbox.checked = stealth;

    if (stealth) runStealthMode();

    checkbox.addEventListener("change", function () {
      const isChecked = checkbox.checked;
      localStorage.setItem("stealthModeEnabled", JSON.stringify(isChecked));
      if (isChecked) runStealthMode();
    });
  }

  // Meteor animation (optional)
  function spawnMeteor() {
    const zone = document.getElementById("meteorZone");
    if (!zone) return;

    zone.innerHTML = "";

    const meteor = document.createElement("div");
    meteor.className = "meteor";
    meteor.style.left = Math.random() * window.innerWidth + "px";
    meteor.style.top = "0px";

    zone.appendChild(meteor);
  }

  spawnMeteor();
  setInterval(spawnMeteor, 10000);

  // Game loading animation (optional, for game links)
  document.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      const gameName = link.textContent;
      console.log("Loading " + gameName + "...");

      if (loader) loader.style.display = 'block';
      if (content) content.style.display = 'none';

      const iframe = document.getElementById('gameFrame');
      if (iframe) {
        iframe.onload = function () {
          if (loader) loader.style.display = 'none';
          if (content) content.style.display = 'block';
        };
      }
    });
  });

  // Main search form (UV-proxied browsing)
  const searchForm = document.getElementById('searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const input = document.getElementById('urlInput');
      if (!input) return;

      let query = input.value.trim();
      if (!query) return;

      const rawUrl = generateSearchUrl(query);
      const encoded = __uv$config.encodeUrl(rawUrl);
      const proxyUrl = __uv$config.prefix + encoded;

      if (loader) loader.style.display = 'block';
      if (content) content.style.display = 'none';

      window.location.href = proxyUrl;
    });
  }
};
