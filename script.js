// Use your Render backend URL here
const PING_URL = "https://your-backend.onrender.com/ping";

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
      await new Promise(r => setTimeout(r, 5000)); // retry every 5s
    }
  }

  document.getElementById("loading").style.display = "none";
  window.location.href = "https://your-backend.onrender.com/app";
}

waitForService();
