const PING_URL = "https://wetherappbackend.onrender.com/ping"; // your backend URL
const APP_URL = "https://wetherappbackend.onrender.com/app";
const RETRY_INTERVAL = 60000; // 1 minute

async function waitForService() {
  let ready = false;

  while (!ready) {
    try {
      let res = await fetch(PING_URL, { cache: "no-cache" });
      if (res.ok) ready = true;
    } catch (e) {
      console.log("Service not ready yet...");
    }

    if (!ready) {
      // Animate progress bar
      const progressBar = document.getElementById("progress-bar");
      let startTime = Date.now();

      function animate() {
        const elapsed = Date.now() - startTime;
        const percent = Math.min((elapsed / RETRY_INTERVAL) * 100, 100);
        progressBar.style.width = percent + "%";
        if (elapsed < RETRY_INTERVAL) requestAnimationFrame(animate);
      }
      animate();

      // Wait 1 minute
      await new Promise(r => setTimeout(r, RETRY_INTERVAL));

      // Reset progress bar for next retry
      progressBar.style.width = "0%";
    }
  }

  document.getElementById("loading").style.display = "none";

  // Fetch /app content and display in same tab
  const appRes = await fetch(APP_URL);
  const appText = await appRes.text();
  document.getElementById("app").innerHTML = appText;
}

waitForService();



