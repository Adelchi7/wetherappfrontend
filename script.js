const PING_URL = "https://wetherappbackend.onrender.com/ping"; // your backend
const APP_URL = "https://wetherappbackend.onrender.com/app";
const RETRY_INTERVAL = 60000; // 1 minute

function startProgressBar() {
  const progressBar = document.getElementById("progress-bar");
  progressBar.style.width = "0%";

  let startTime = Date.now();

  return setInterval(() => {
    const elapsed = Date.now() - startTime;
    const percent = Math.min((elapsed / RETRY_INTERVAL) * 100, 100);
    progressBar.style.width = percent + "%";
  }, 100); // update every 100ms
}

async function waitForService() {
  let ready = false;

  while (!ready) {
    // Start visual progress bar
    const interval = startProgressBar();

    try {
      const res = await fetch(PING_URL, { cache: "no-cache" });
      if (res.ok) ready = true;
    } catch (e) {
      console.log("Service not ready yet...");
    }

    clearInterval(interval); // stop progress bar

    if (!ready) {
      // reset progress bar
      document.getElementById("progress-bar").style.width = "0%";
      // wait full minute before next retry
      await new Promise(r => setTimeout(r, RETRY_INTERVAL));
    }
  }

  document.getElementById("loading").style.display = "none";

  // Show backend response in same tab
  const appRes = await fetch(APP_URL);
  const appText = await appRes.text();
  document.getElementById("app").innerHTML = appText;
}

waitForService();




