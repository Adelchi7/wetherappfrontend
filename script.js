const PING_URL = "https://wetherappbackend.onrender.com/ping";
const APP_URL  = "https://wetherappbackend.onrender.com/app";

const RETRY_INTERVAL = 6; // seconds (you can change this)

async function waitForService() {
  const progressBar = document.getElementById("progress-bar");
  const countdownText = document.getElementById("countdown");

  let ready = false;

  while (!ready) {
    try {
      const res = await fetch(PING_URL, { cache: "no-cache" });
      if (res.ok) {
        ready = true;
        break;
      }
    } catch (e) {
      console.log("Service not ready yet...");
    }

    // Animate progress bar for RETRY_INTERVAL seconds
    const steps = RETRY_INTERVAL * 10; // 10 updates/sec
    for (let i = 0; i <= steps; i++) {
      progressBar.style.width = `${(i / steps) * 100}%`;
      countdownText.textContent = `Next retry in ${Math.ceil(RETRY_INTERVAL - (i / 10))}s`;
      await new Promise(r => setTimeout(r, 100));
    }
    // reset bar for next retry
    progressBar.style.width = "0%";
  }

  // Backend awake → redirect user
  window.location.href = APP_URL;
}

// Run when page loads
waitForService();

async function chooseColor(color) {
  const res = await fetch("/api/choice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ color })
  });

  const data = await res.json();
  document.getElementById("result").innerHTML =
    `You chose <b style="color:${data.color}">${data.color}</b><br>` +
    `Location: ${data.location}`;
}

async function submitInput(data) {
  await fetch("/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}





