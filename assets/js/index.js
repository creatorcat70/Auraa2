  function runStealthMode() {
    const title = "Calculator - Google Search";
    const icon = "ixlicon.png";
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

    window.location.href = "https://www.ixl.com";
  }

 window.onload = function () {
  // Hide loader, show content
  document.getElementById('loader').style.display = 'none';
  document.getElementById('content').style.display = 'block';

  // Stealth mode setup
  const stealth = JSON.parse(localStorage.getItem("stealthModeEnabled")) || false;
  const checkbox = document.getElementById("blankMode");
  checkbox.checked = stealth;

  if (stealth) runStealthMode();

  checkbox.addEventListener("change", function () {
    const isChecked = checkbox.checked;
    localStorage.setItem("stealthModeEnabled", JSON.stringify(isChecked));
    if (isChecked) runStealthMode();
  });

  // 🌠 Meteor spawner
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
};


  document.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      var gameName = link.textContent;
      console.log("Loading " + gameName + "...");

      document.getElementById('loader').style.display = 'block';
      document.getElementById('content').style.display = 'none';

      var iframe = document.getElementById('gameFrame');
      if (iframe) {
        iframe.onload = function () {
          document.getElementById('loader').style.display = 'none';
          document.getElementById('content').style.display = 'block';
        };
      }
    });
  });

  document.getElementById('searchForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    let query = document.getElementById('urlInput').value.trim();
    if (!query) return;

    const rawUrl = generateSearchUrl(query);
    const encoded = __uv$config.encodeUrl(rawUrl);
    const proxyUrl = __uv$config.prefix + encoded;

    document.getElementById('loader').style.display = 'block';
    document.getElementById('content').style.display = 'none';

    window.location.href = proxyUrl;
  });

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
