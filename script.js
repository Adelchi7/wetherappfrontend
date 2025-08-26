const PING_URL = "https://wetherappbackend.onrender.com/ping";
const APP_URL = "https://wetherappbackend.onrender.com/app";
const RETRY_INTERVAL = 60; // seconds

async function waitForService() {
  let ready = false;

  while (!ready) {
    const progressBar = document.getElementById("progress-bar");
    const countdownText = document.getElementById("countdown");

    let secondsElapsed = 0;
    progressBar.style.width = "0%";
    countdownText.textContent = `Next retry in ${RETRY_INTERVAL}s`;

    // Step animation every second
    await new Promise(resolve => {
      const interval = setInterval(() => {
        secondsElapsed++;
        progressBar.style.width = `${(secondsElapsed / RETRY_INTERVAL) * 100}%`;
        countdownText.textContent = `Next retry in ${RETRY_INTERVAL - secondsElapsed}s`;

        if (secondsElapsed >= RETRY_INTERVAL) {
          clearInterval(interval);
          resolve();
        }
      }, 1000);
    });

    // Ping backend after animation
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

async function submitInput(data) {
  await fetch("/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}





