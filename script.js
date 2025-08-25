const PING_URL = "https://wetherappbackend.onrender.com/ping";
const APP_URL = "https://wetherappbackend.onrender.com/app";
const RETRY_INTERVAL = 60; // seconds

async function waitForService() {
  let ready = false;

  while (!ready) {
    // Animate progress bar and countdown
    const progressBar = document.getElementById("progress-bar");
    const countdownText = document.getElementById("countdown");

    progressBar.style.width = "0%";

    for (let i = 0; i <= RETRY_INTERVAL; i++) {
      progressBar.style.width = `${(i / RETRY_INTERVAL) * 100}%`;
      countdownText.textContent = `Next retry in ${RETRY_INTERVAL - i}s`;
      await new Promise(r => setTimeout(r, 1000)); // wait 1 second
    }

    // Try ping
    try {
      const res = await fetch(PING_URL, { cache: "no-cache" });
      if (res.ok) ready = true;
    } catch (e) {
      console.log("Service not ready yet...");
    }
  }

  // Backend awake
  document.getElementById("loading").style.display = "none";

  const appRes = await fetch(APP_URL);
  const appText = await appRes.text();
  document.getElementById("app").innerHTML = appText;
}

waitForService();




