const PING_URL = "https://wetherappbackend.onrender.com/ping";
const APP_URL  = "https://wetherappbackend.onrender.com/app";
const MAX_WAIT = 60; // one full cycle = 60s

document.addEventListener("DOMContentLoaded", () => {
  // ================== CLOCK ==================
  const circle = document.getElementById("countdown-progress");
  const text = document.getElementById("countdown-text");
  const radius = circle.r.baseVal.value; // read actual <circle r="">
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
  }, 10000); // every 10s

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
});


/* const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
let w, h, t=0;
function resize() { w=canvas.width=window.innerWidth; h=canvas.height=window.innerHeight; }
resize(); window.onresize=resize;

function draw() {
  t += 0.01;
  ctx.clearRect(0,0,w,h);
  for (let i=0;i<20;i++) {
    ctx.fillStyle=`hsl(${(i*20+t*50)%360},70%,50%)`;
    ctx.beginPath();
    ctx.arc(
      w/2 + Math.sin(t+i)*w/3,
      h/2 + Math.cos(t+i)*h/3,
      200,0,Math.PI*2
    );
    ctx.fill();
  }
  requestAnimationFrame(draw);
}
draw(); */







