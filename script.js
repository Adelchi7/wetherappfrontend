const PING_URL = "https://wetherappbackend.onrender.com/ping"; // your backend URL
const APP_URL = "https://wetherappbackend.onrender.com/app";
const RETRY_INTERVAL = 60000; // 1 minute

async function waitForService() {
  let ready = false;

  while (!ready) {
    try {
      const res = await fetch(PING_URL, { cache: "no-cache" });
      if (res.ok) ready = true;
    } catch (e) {
      console.log("Service not ready yet...");
    }

    if (!ready) {
      const progressBar = document.getElementById("progress-bar");
      progressBar.style.width = "0%";

      let startTime = Date.now();

      // Animate the progress bar over 60 seconds
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const percent = Math.min((elapsed / RETRY_INTERVAL) * 100, 100);
        progressBar.style.width = percent + "%";
        if (percent >= 100) {
          clearInterval(interval); // stop animation after 1 minute
        }
      }, 100); // update every 100ms

      // Wait full 1 minute before next retry
      await new Promise(r => setTimeout(r, RETRY_INTERVAL));
    }
  }

  document.getElementById("loading").style.display = "none";

  // Fetch /app content and display in same tab
  const appRes = await fetch(APP_URL);
  const appText = await appRes.text();
  document.getElementById("app").innerHTML = appText;
}

waitForService();




