const PING_URL = "https://wetherappbackend.onrender.com/ping";
const APP_URL  = "https://wetherappbackend.onrender.com/app";
const MAX_WAIT = 60; // one full cycle = 60s

document.addEventListener("DOMContentLoaded", () => {
  
  // ================== CLOCK ==================
  const circle = document.getElementById("countdown-progress");
  const text = document.getElementById("countdown-text");
  const radius = circle.r.baseVal.value; 
  const circumference = 2 * Math.PI * radius;

  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = circumference;

  let elapsed = 0;
  const timer = setInterval(() => {
    elapsed++;
    if (elapsed > MAX_WAIT) elapsed = 1;
    text.textContent = `${elapsed}s`;
    circle.style.strokeDashoffset = circumference * (1 - elapsed / MAX_WAIT);
  }, 1000);

  // ================== POLLING ==================
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
  }, 10000);

  // ================== LAVA LAMP ==================
  const canvas = document.getElementById("bg");
  const ctx = canvas.getContext("2d");
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.onresize = resize;

  const blobs = Array.from({length: 8}, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: 100 + Math.random() * 100,
    dx: (Math.random() - 0.5) * 1.5,
    dy: (Math.random() - 0.5) * 1.5,
    color: `hsl(${Math.random() * 360},70%,60%)`
  }));

  function drawLava() {
    ctx.clearRect(0, 0, w, h);
    ctx.globalAlpha = 0.6;

    blobs.forEach(b => {
      const grad = ctx.createRadialGradient(b.x, b.y, b.r * 0.3, b.x, b.y, b.r);
      grad.addColorStop(0, b.color);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();

      b.x += b.dx;
      b.y += b.dy;
      if (b.x < -b.r || b.x > w + b.r) b.dx *= -1;
      if (b.y < -b.r || b.y > h + b.r) b.dy *= -1;
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(drawLava);
  }
  drawLava();

  // ================== BACKGROUND SLIDESHOW ==================
  const carousel = document.getElementById("carousel");
  const motto = document.querySelector(".motto");

  async function loadMottoAndCarousel() {
    let mottos = [];
    
    // ====== Load mottos from JSON ======
    try {
      const res = await fetch("news/mottos.json");
      if (!res.ok) throw new Error("Failed to fetch mottos");
      mottos = await res.json();

      if (mottos.length > 0 && motto) {
        const randomIndex = Math.floor(Math.random() * mottos.length);
        motto.textContent = mottos[randomIndex];
      }
    } catch (err) {
      console.warn(err);
      if (motto) motto.textContent = "Feel the world, one color at a time."; // fallback
    }

    // ====== Load carousel images ======
    if (!carousel) return;

    const extensions = ["avif", "jpg", "jpeg", "png", "webp"];
    let index = 0;

    async function detectImages() {
      const files = [];
      let i = 1;

      while (true) {
        let found = false;
        for (const ext of extensions) {
          try {
            const res = await fetch(`news/${i}.${ext}`, { method: "HEAD" });
            if (res.ok) {
              files.push(`${i}.${ext}`);
              found = true;
              break;
            }
          } catch {}
        }
        if (!found) break;
        i++;
      }
      return files;
    }

    const files = await detectImages();
    if (files.length === 0) return;

    // shuffle files randomly
    files.sort(() => Math.random() - 0.5);

    // preload first image
    const firstImg = new Image();
    firstImg.src = `news/${files[0]}`;
    firstImg.onload = () => {
      firstImg.classList.add("active");
      carousel.appendChild(firstImg);

      // fade out motto
      if (motto) {
        motto.style.transition = "opacity 1s ease";
        motto.style.opacity = 0;
      }

      // append the rest of images
      files.slice(1).forEach(file => {
        const img = document.createElement("img");
        img.src = `news/${file}`;
        carousel.appendChild(img);
      });

      // start slideshow
      setInterval(() => {
        const imgs = carousel.querySelectorAll("img");
        imgs[index].classList.remove("active");
        index = (index + 1) % imgs.length;
        imgs[index].classList.add("active");
      }, 5000);
    };
  }
  // call the function immediately
  loadMottoAndCarousel();
});
