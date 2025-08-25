// Use your Render backend URL here
const PING_URL = "https://wetherappbackend.onrender.com/ping";
const APP_URL = "https://wetherappbackend.onrender.com/app";

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
      await new Promise(r => setTimeout(r, 60000)); // retry every 5s
    }
  }

  document.getElementById("loading").style.display = "none";

  // Fetch /app content and show it in page
  const appRes = await fetch(APP_URL);
  const appText = await appRes.text();
  document.getElementById("app").innerHTML = appText;
}

waitForService();


