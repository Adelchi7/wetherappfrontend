// script.js → only waiting/progress functionality


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

const PING_URL = "https://wetherappbackend.onrender.com/ping";
const APP_URL  = "https://wetherappbackend.onrender.com/app";
const MAX_WAIT = 60; // seconds

document.addEventListener("DOMContentLoaded", () => {
  const circle = document.getElementById("countdown-progress");
  const text = document.getElementById("countdown-text");
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = circumference;

  let elapsed = 0;

  // Circle animation and text update every second
  const timer = setInterval(() => {
    elapsed++;
    if (elapsed > MAX_WAIT) elapsed = MAX_WAIT;
    text.textContent = `${elapsed}s`;
    circle.style.strokeDashoffset = circumference * (1 - elapsed / MAX_WAIT);
  }, 1000);

  // Poll backend independently
  const poll = setInterval(async () => {
    try {
      const res = await fetch(PING_URL, { cache: "no-cache" });
      if (res.ok) {
        clearInterval(timer);
        clearInterval(poll);
        window.location.href = APP_URL;
      }
    } catch (e) {
      console.log("Backend not ready yet...");
    }
  }, 1000);
});






