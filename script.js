const PING_URL = "https://wetherappbackend.onrender.com/ping";
const APP_URL = "https://wetherappbackend.onrender.com/app";
const RETRY_INTERVAL = 60; // seconds

async function waitForService() {
  const progressBar = document.getElementById("progress-bar");
  const countdownText = document.getElementById("countdown");

  let ready = false;

  while (!ready) {
    try {
      const res = await fetch(PING_URL, { cache: "no-cache" });
      if (res.ok) {
        ready = true;
        break; // exit loop immediately
      }
    } catch (e) {
      console.log("Service not ready yet...");
    }

    // Animate progress bar for retry interval
    for (let i = 0; i < RETRY_INTERVAL; i++) {
      progressBar.style.width = `${(i / RETRY_INTERVAL) * 100}%`;
      countdownText.textContent = `Next retry in ${RETRY_INTERVAL - i}s`;
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  // Backend awake → hide loading and fetch app
  document.getElementById("loading").style.display = "none";
  const appRes = await fetch(APP_URL);
  const appText = await appRes.text();
  document.getElementById("app").innerHTML = appText;
}

waitForService();

async function submitInput(data) {
  await fetch("/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}





