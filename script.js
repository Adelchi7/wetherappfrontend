const PING_URL = "https://wetherappbackend.onrender.com/ping";
const APP_URL  = "https://wetherappbackend.onrender.com/app";

const RETRY_INTERVAL = 10; // seconds (you can change this)

async function waitForService() {
  const progressBar = document.getElementById("progress-bar");
  const countdownText = document.getElementById("countdown");

  let ready = false;

  while (!ready) {
    try {
      const res = await fetch(PING_URL, { cache: "no-cache" });
      if (res.ok) {
        ready = true;
        break; // backend is ready, exit loop
      }
    } catch (e) {
      console.log("Service not ready yet...");
    }

    // Animate progress bar for RETRY_INTERVAL seconds
    const intervalMs = 100; // update every 0.1s
    const steps = (RETRY_INTERVAL * 1000) / intervalMs; // total steps
    for (let i = 0; i <= steps; i++) {
      const percent = (i / steps) * 100;
      progressBar.style.width = `${percent}%`;

      const secondsLeft = Math.ceil(RETRY_INTERVAL - (i * intervalMs) / 1000);
      countdownText.textContent = `Next retry in ${secondsLeft}s`;

      await new Promise(r => setTimeout(r, intervalMs));
    }

    // Reset bar for next retry loop if backend not ready
    progressBar.style.width = "0%";
  }

  // Backend is awake → redirect
  window.location.href = APP_URL;
}


// Run when page loads
waitForService();

window.chooseColor = async function(color) {
  const res = await fetch("/api/choice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ color })
  });

  const data = await res.json();
  document.getElementById("result").innerHTML =
    `You chose <b style="color:${data.color}">${data.color}</b><br>` +
    `Location: ${data.location}`;
};

async function testBar() {
  const progressBar = document.getElementById("progress-bar");
  const countdownText = document.getElementById("countdown");

  for (let i = 0; i <= 100; i++) {
    progressBar.style.width = `${i}%`;
    countdownText.textContent = `Progress ${i}%`;
    await new Promise(r => setTimeout(r, 50));
  }
}
testBar();


async function submitInput(data) {
  await fetch("/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}





