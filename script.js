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

document.addEventListener("DOMContentLoaded", () => {
  const circle = document.getElementById("countdown-progress");
  const text = document.getElementById("countdown-text");
  const circumference = 2 * Math.PI * 50;

  async function waitForService() {
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

      await animateCountdown(RETRY_INTERVAL);
    }

    window.location.href = APP_URL;
  }

  function animateCountdown(seconds) {
    return new Promise(resolve => {
      let startTime = null;

      function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = (timestamp - startTime) / 1000;
        const progress = Math.min(elapsed / seconds, 1);

        circle.style.strokeDashoffset = circumference * (1 - progress);
        text.textContent = Math.ceil(seconds - elapsed) + "s";

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          circle.style.strokeDashoffset = circumference; // reset for next retry
          resolve();
        }
      }

      requestAnimationFrame(animate);
    });
  }

  waitForService();
});






