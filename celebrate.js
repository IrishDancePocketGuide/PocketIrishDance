// Fireworks and a congratulations card for 1st places. Tap anywhere to close.
// Pass { shamrocks: true } for shamrock fireworks (perfect game scores).
(function () {
  "use strict";
  const ALL_COLORS = ["#f5c542", "#ff5d73", "#4fd1c5", "#7c5cff", "#3ddc84", "#ff9f43", "#ffffff"];
  const GREENS = ["#3ddc84", "#2ecc71", "#7bd88f", "#1fae5f", "#b6f2a6", "#f5c542"];

  function celebrate(title, line, opts) {
    const clover = !!(opts && opts.shamrocks);
    const COLORS = clover ? GREENS : ALL_COLORS;
    const old = document.getElementById("celebrate"); if (old) old.remove();
    const calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wrap = document.createElement("div");
    wrap.id = "celebrate"; wrap.className = "celebrate"; wrap.setAttribute("role", "dialog"); wrap.setAttribute("aria-label", title);
    wrap.innerHTML = `<canvas aria-hidden="true"></canvas>
      <div class="celebrate-card">
        <div class="celebrate-medal" aria-hidden="true">${clover ? "☘️" : "🥇"}</div>
        <h2></h2><p></p>
        <button type="button" class="btn block">Yay! 🎉</button>
      </div>`;
    wrap.querySelector("h2").textContent = title;
    wrap.querySelector("p").textContent = line || "";
    document.body.appendChild(wrap);

    const cv = wrap.querySelector("canvas"); const g = cv.getContext("2d");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    function size() { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0); }
    size(); addEventListener("resize", size);

    // A little shamrock: three round leaves and a stem, size r, turned by rot.
    function shamrock(x, y, r, rot) {
      g.save(); g.translate(x, y); g.rotate(rot); g.beginPath();
      for (let k = 0; k < 3; k++) { const a = -Math.PI / 2 + k * (Math.PI * 2 / 3); g.moveTo(Math.cos(a) * r * 0.55 + r * 0.45, Math.sin(a) * r * 0.55); g.arc(Math.cos(a) * r * 0.55, Math.sin(a) * r * 0.55, r * 0.45, 0, 7); }
      g.fill(); g.lineWidth = r * 0.18; g.strokeStyle = g.fillStyle; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(r * 0.2, r * 0.7, r * 0.6, r * 1.1); g.stroke(); g.restore();
    }
    const rockets = [], sparks = [];
    let launched = 0, running = true, last = performance.now();
    const total = calm ? 0 : 14;

    function launch() {
      rockets.push({ x: innerWidth * (0.15 + Math.random() * 0.7), y: innerHeight, vy: -(innerHeight * (0.9 + Math.random() * 0.35)),
        ty: innerHeight * (0.15 + Math.random() * 0.3), c: COLORS[(Math.random() * COLORS.length) | 0] });
      launched++;
    }
    function burst(x, y, c) {
      const n = clover ? 26 + ((Math.random() * 10) | 0) : 60 + ((Math.random() * 30) | 0); const c2 = COLORS[(Math.random() * COLORS.length) | 0];
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2, s = 120 + Math.random() * 160;
        sparks.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, fade: 0.55 + Math.random() * 0.4, c: i % 3 ? c : c2, rot: Math.random() * 7, spin: (Math.random() - 0.5) * 6 });
      }
    }
    const timer = setInterval(() => { if (launched < total) launch(); else clearInterval(timer); }, 260);
    if (!calm) { launch(); launch(); }

    function frame(now) {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      g.globalCompositeOperation = "destination-out"; g.fillStyle = "rgba(0,0,0,0.22)"; g.fillRect(0, 0, innerWidth, innerHeight);
      g.globalCompositeOperation = "lighter";
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i]; r.y += r.vy * dt; r.vy *= 0.985;
        g.fillStyle = r.c; g.beginPath(); g.arc(r.x, r.y, 2.5, 0, 7); g.fill();
        if (r.y <= r.ty) { burst(r.x, r.y, r.c); rockets.splice(i, 1); }
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i]; p.vx *= 0.97; p.vy = p.vy * 0.97 + 140 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= p.fade * dt;
        if (p.life <= 0) { sparks.splice(i, 1); continue; }
        g.globalAlpha = p.life; g.fillStyle = p.c;
        if (clover) { p.rot += p.spin * dt; shamrock(p.x, p.y, 7, p.rot); } else { g.beginPath(); g.arc(p.x, p.y, 2.2, 0, 7); g.fill(); }
      }
      g.globalAlpha = 1;
      if (launched >= total && !rockets.length && !sparks.length) { running = false; return; }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    function close() { running = false; clearInterval(timer); removeEventListener("resize", size); wrap.classList.add("out"); setTimeout(() => wrap.remove(), 250); }
    wrap.addEventListener("click", close);
    wrap.querySelector("button").focus();
    if (navigator.vibrate) try { navigator.vibrate([60, 40, 60]); } catch (e) { /* not supported */ }
  }

  window.PID_CELEBRATE = celebrate;
})();
