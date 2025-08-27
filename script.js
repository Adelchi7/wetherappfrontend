// script.js → only waiting/progress functionality

const PING_URL = "https://wetherappbackend.onrender.com/ping";
const APP_URL  = "https://wetherappbackend.onrender.com/app";

/* const RETRY_INTERVAL = 10; // seconds

async function waitForService() {
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

async function waitForService() {
  const countdownCircle = document.getElementById("countdown-progress");
  const countdownText = document.getElementById("countdown-text");

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

    // Animate circular countdown
    const intervalMs = 100;
    const steps = (RETRY_INTERVAL * 1000) / intervalMs;
    for (let i = 0; i <= steps; i++) {
      const percent = i / steps;
      const dashoffset = 314 - 314 * percent; // 314 = circumference
      countdownCircle.style.strokeDashoffset = dashoffset;

      const secondsLeft = Math.ceil(RETRY_INTERVAL - (i * intervalMs) / 1000);
      countdownText.textContent = `${secondsLeft}s`;

      await new Promise(r => setTimeout(r, intervalMs));
    }

    // Reset circle if still not ready
    countdownCircle.style.strokeDashoffset = 314;
  }

  window.location.href = APP_URL;
}



// run on load
waitForService();






