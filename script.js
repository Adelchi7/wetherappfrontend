// script.js → only waiting/progress functionality

const PING_URL = "https://wetherappbackend.onrender.com/ping";
const APP_URL  = "https://wetherappbackend.onrender.com/app";

const RETRY_INTERVAL = 10; // seconds

/*async function waitForService() {
  const progressBar = document.getElementById("progress-bar");
  const countdownText = document.getElementById("countdown");

  let ready = false;

  while (!ready) {
    try {
      const res = await fetch(PING_URL, { cache: "no-cache" });
      if (res.ok) {
        ready = true;
        break; // backend ready
      }
    } catch (e) {
      console.log("Service not ready yet...");
    }

    // animate bar
    const intervalMs = 100;
    const steps = (RETRY_INTERVAL * 1000) / intervalMs;
    for (let i = 0; i <= steps; i++) {
      const percent = (i / steps) * 100;
      progressBar.style.width = `${percent}%`;

      const secondsLeft = Math.ceil(RETRY_INTERVAL - (i * intervalMs) / 1000);
      countdownText.textContent = `Next retry in ${secondsLeft}s`;

      await new Promise(r => setTimeout(r, intervalMs));
    }
    progressBar.style.width = "0%"; // reset if still not ready
  }

  // redirect when backend is up
  window.location.href = APP_URL;
} */

const PING_URL = "/ping";          // Replace with your backend ping URL
const APP_URL = "/frontend.html";  // URL to redirect when ready
const MAX_WAIT = 60;               // Max wait in seconds

document.addEventListener("DOMContentLoaded", () => {
  const circle = document.getElementById("countdown-progress");
  const text = document.getElementById("countdown-text");
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;

  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = circumference;

  let elapsed = 0;
  let intervalId;

  async function checkBackend() {
    try {
      const res = await fetch(PING_URL, { cache: "no-cache" });
      if (res.ok) {
        clearInterval(intervalId);
        window.location.href = APP_URL;
      }
    } catch (e) {
      // Backend not ready yet
    }
  }

  function tick() {
    elapsed++;
    if (elapsed > MAX_WAIT) elapsed = MAX_WAIT;

    // Update text
    text.textContent = `${elapsed}s`;

    // Update circle
    const progress = elapsed / MAX_WAIT;
    circle.style.strokeDashoffset = circumference * (1 - progress);

    // Ping backend
    checkBackend();
  }

  intervalId = setInterval(tick, 1000);
});






