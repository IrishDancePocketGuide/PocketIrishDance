/* Rhythm tap: tap along to the beat of an Irish dance tune.
   The music is made on the phone (Web Audio): short original tunes and a drum on each beat,
   so it works offline and uses no recordings. Best scores stay on this phone. */
(function () {
  "use strict";

  // Speeds are the usual feis speeds (beats per minute, counted the way dancers count).
  // pulses = taps per bar; sub = notes per tap; swing = long-short feel (hornpipe).
  const DANCES = [
    { id: "reel", name: "Reel", time: "4/4", bpm: 113, pulses: 2, sub: 4, swing: 0, tip: "Two strong beats in every bar. Count “1 and 2 and”." },
    { id: "lightjig", name: "Light jig", time: "6/8", bpm: 115, pulses: 2, sub: 3, swing: 0, tip: "Two beats a bar, each split in three: “1-2-3, 4-5-6”." },
    { id: "slipjig", name: "Slip jig", time: "9/8", bpm: 113, pulses: 3, sub: 3, swing: 0, tip: "Three beats a bar. Smooth and graceful, a little like a waltz." },
    { id: "hornpipe", name: "Hornpipe", time: "4/4", bpm: 113, pulses: 2, sub: 4, swing: 0.33, tip: "Two beats a bar with a bouncy long-short feel." },
    { id: "treble", name: "Treble jig", time: "6/8", bpm: 73, pulses: 2, sub: 3, swing: 0, tip: "A slow, heavy jig. Wait for each beat!" }
  ];
  const SPEEDS = [
    { id: "practice", name: "Practice", f: 0.8 },
    { id: "feis", name: "Feis speed", f: 1 },
    { id: "fast", name: "Extra fast", f: 1.2 }
  ];
  const TAPS = 32; // about how many beats to tap in a round (after one bar of count-in)
  const PERFECT = 0.07, GOOD = 0.14, WINDOW = 0.25; // seconds
  const KEY = "pid.rhythm";

  const ls = {
    load() { try { return Object.assign({ best: {}, dance: "reel", speed: "practice" }, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { return { best: {}, dance: "reel", speed: "practice" }; } },
    save(R) { try { localStorage.setItem(KEY, JSON.stringify(R)); } catch (e) { /* still playable */ } }
  };

  // Notes of D major over two octaves, for the made-up tunes.
  const SCALE = [293.66, 329.63, 369.99, 392.0, 440.0, 493.88, 554.37, 587.33, 659.25, 739.99, 783.99, 880.0];
  function tune(dance) {
    // A simple original tune: wanders up and down the scale, same every time for a dance.
    let seed = 0; for (const c of dance.id) seed = (seed * 31 + c.charCodeAt(0)) >>> 0;
    const r = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const per = dance.pulses * dance.sub * 2; // a two-bar phrase
    const notes = []; let at = 4;
    for (let i = 0; i < per; i++) {
      if (i % dance.sub === 0 && r() < 0.5) at = [0, 2, 4, 7][Math.floor(r() * 4)]; // land on D, F#, A or high D on the beat
      else at = Math.max(0, Math.min(SCALE.length - 1, at + [-2, -1, 1, 1, 2][Math.floor(r() * 5)]));
      notes.push(at);
    }
    notes[per - 1] = 0; notes[per - 2] = 2; // end the phrase home on D
    return notes;
  }

  window.PID_RHYTHM = function (A) {
    const { esc, toast } = A;
    let R = ls.load();
    let game = null; // the round being played

    function stars(pct) { return pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 40 ? 1 : 0; }
    const starText = (n) => n ? `${"☘️".repeat(n)} (${n} of 3)` : "(0 of 3 ☘️)"; // scored in shamrocks, not stars

    function screen() {
      R = ls.load();
      const d = DANCES.find((x) => x.id === R.dance) || DANCES[0];
      const sp = SPEEDS.find((x) => x.id === R.speed) || SPEEDS[0];
      const best = R.best[d.id + "-" + sp.id];
      return {
        title: "Rhythm tap", tab: "home", back: true,
        html: `
        <p class="small muted" style="margin:0 2px 8px">Tap the big button on every beat. Listen to the count-in first, then keep time with the music.</p>
        <div class="pill-tabs rt-pills" role="group" aria-label="Dance">${DANCES.map((x) => `<button type="button" data-rt-dance="${x.id}" class="${x.id === d.id ? "on" : ""}">${esc(x.name)}</button>`).join("")}</div>
        <div class="pill-tabs rt-pills" role="group" aria-label="Speed">${SPEEDS.map((x) => `<button type="button" data-rt-speed="${x.id}" class="${x.id === sp.id ? "on" : ""}">${esc(x.name)}</button>`).join("")}</div>
        <div class="card rt-info small"><strong>${esc(d.name)}</strong> · ${esc(d.time)} time · ${Math.round(d.bpm * sp.f)} beats a minute<div class="muted">${esc(d.tip)}</div></div>
        <div class="rt-stage">
          <div class="rt-msg" id="rtMsg" aria-live="polite">${best ? `Your best: ${best.score} points ${starText(best.stars)}` : "Ready when you are"}</div>
          <div class="rt-dots" id="rtDots" aria-hidden="true"></div>
          <button type="button" class="rt-pad" id="rtPad" aria-label="Tap on the beat">
            <span id="rtPadText">Start</span>
          </button>
          <div class="row between small rt-score"><span id="rtScore"></span><span id="rtCombo"></span></div>
        </div>
        <p class="small muted" style="text-align:center">🔊 Turn your sound up. On iPhone, check the silent switch is off.</p>`,
        after: wire
      };
    }

    function wire() {
      const pad = document.getElementById("rtPad");
      const tap = (e) => {
        e.preventDefault();
        if (!game || game.done) start(); else hit();
      };
      pad.addEventListener("pointerdown", tap);
      pad.addEventListener("keydown", (e) => { if (e.key === " " || e.key === "Enter") tap(e); });
    }

    function start() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) { toast("This phone can't play the music"); return; }
      stop();
      const d = DANCES.find((x) => x.id === R.dance) || DANCES[0];
      const sp = SPEEDS.find((x) => x.id === R.speed) || SPEEDS[0];
      const ctx = new AC();
      if (ctx.state === "suspended") ctx.resume();
      const beat = 60 / (d.bpm * sp.f);
      const t0 = ctx.currentTime + 0.35;
      const notes = tune(d);
      const master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);

      const drum = (t, strong) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine"; o.frequency.setValueAtTime(strong ? 150 : 110, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
        g.gain.setValueAtTime(strong ? 0.9 : 0.6, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.16);
      };
      const tick = (t, strong) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "square"; o.frequency.value = strong ? 1600 : 1100;
        g.gain.setValueAtTime(0.18, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.06);
      };
      const note = (t, f, len) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "triangle"; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.22, t + 0.01); g.gain.exponentialRampToValueAtTime(0.001, t + Math.max(0.08, len * 0.95));
        o.connect(g); g.connect(master); o.start(t); o.stop(t + len);
      };

      // Count-in bar: ticks only.
      for (let p = 0; p < d.pulses; p++) tick(t0 + p * beat, p === 0);
      const start1 = t0 + d.pulses * beat;
      const beats = [];
      const BARS = Math.ceil(TAPS / d.pulses);
      for (let bar = 0; bar < BARS; bar++) {
        for (let p = 0; p < d.pulses; p++) {
          const bt = start1 + (bar * d.pulses + p) * beat;
          beats.push(bt); drum(bt, p === 0);
          for (let s = 0; s < d.sub; s++) {
            // swing: in pairs, the first note is longer than the second
            let off = s / d.sub, len = 1 / d.sub;
            if (d.swing && d.sub === 4) { const pair = Math.floor(s / 2), first = s % 2 === 0; off = pair * 0.5 + (first ? 0 : 0.5 * (0.5 + d.swing / 2)); len = 0.5 * (first ? 0.5 + d.swing / 2 : 0.5 - d.swing / 2); }
            const idx = ((bar % 2) * d.pulses + p) * d.sub + s;
            note(bt + off * beat, SCALE[notes[idx % notes.length]], len * beat);
          }
        }
      }
      const end = beats[beats.length - 1] + beat;
      note(end, SCALE[0] / 2, beat * 1.5); drum(end, true);

      const lat = (ctx.outputLatency || 0) + (ctx.baseLatency || 0);
      game = { ctx, beats, beat, d, sp, hits: new Array(beats.length).fill(null), score: 0, combo: 0, maxCombo: 0, done: false, lat, end, start1, t0 };
      document.getElementById("rtPadText").textContent = "Tap!";
      document.getElementById("rtPad").classList.add("live");
      document.getElementById("rtDots").innerHTML = beats.map(() => "<i></i>").join("");
      show("Listen… " + Array.from({ length: d.pulses }, (_, i) => i + 1).join(" "), "");
      updateScore();
      loop();
    }

    function loop() {
      if (!game || game.done) return;
      const pad = document.getElementById("rtPad");
      if (!pad) { stop(); return; } // left the page
      const now = game.ctx.currentTime - game.lat;
      // pulse the pad on each beat (count-in too)
      const k = Math.floor((now - game.t0) / game.beat);
      const phase = (now - game.t0) / game.beat - k;
      pad.style.setProperty("--pulse", now >= game.t0 ? Math.max(0, 1 - phase * 3).toFixed(2) : 0);
      if (now >= game.start1 - 0.05 && !game.started) { game.started = true; show("Go! Tap on the beat", ""); }
      // beats that passed without a tap are misses
      game.beats.forEach((bt, i) => {
        if (game.hits[i] === null && now > bt + WINDOW) { game.hits[i] = "miss"; game.combo = 0; mark(i, "miss"); updateScore(); }
      });
      if (now > game.end + 0.2) { finish(); return; }
      requestAnimationFrame(loop);
    }

    function hit() {
      const now = game.ctx.currentTime - game.lat;
      let best = -1, bestD = 9;
      game.beats.forEach((bt, i) => { const dd = Math.abs(now - bt); if (game.hits[i] === null && dd < bestD) { best = i; bestD = dd; } });
      const pad = document.getElementById("rtPad");
      pad.classList.remove("pop"); void pad.offsetWidth; pad.classList.add("pop");
      if (best < 0 || bestD > WINDOW) { show(now < game.start1 ? "Wait for the music…" : "Oops, no beat there", "off"); game.combo = 0; updateScore(); return; }
      const early = now < game.beats[best];
      let kind, pts;
      if (bestD <= PERFECT) { kind = "perfect"; pts = 100; }
      else if (bestD <= GOOD) { kind = "good"; pts = 50; }
      else { kind = "off"; pts = 10; }
      game.hits[best] = kind;
      game.combo = kind === "off" ? 0 : game.combo + 1; game.maxCombo = Math.max(game.maxCombo, game.combo);
      game.score += pts + (kind === "perfect" ? Math.min(game.combo, 10) * 5 : 0);
      mark(best, kind);
      show(kind === "perfect" ? "Perfect!" : kind === "good" ? (early ? "Good, a little early" : "Good, a little late") : (early ? "Too early" : "Too late"), kind);
      updateScore();
    }

    function mark(i, kind) { const dot = document.querySelectorAll("#rtDots i")[i]; if (dot) dot.className = kind; }
    function show(text, kind) { const m = document.getElementById("rtMsg"); if (m) { m.textContent = text; m.className = "rt-msg " + (kind || ""); } }
    function updateScore() {
      const s = document.getElementById("rtScore"), c = document.getElementById("rtCombo");
      if (s) s.textContent = game ? `${game.score} points` : "";
      if (c) c.textContent = game && game.combo > 2 ? `🔥 ${game.combo} in a row` : "";
    }

    function finish() {
      game.done = true;
      const n = game.beats.length;
      const perfect = game.hits.filter((h) => h === "perfect").length, good = game.hits.filter((h) => h === "good").length;
      const pct = Math.round(((perfect + good * 0.6) / n) * 100);
      const st = stars(pct);
      const key = game.d.id + "-" + game.sp.id;
      const prev = R.best[key];
      const newBest = !prev || game.score > prev.score;
      if (newBest) { R.best[key] = { score: game.score, stars: st, pct }; ls.save(R); }
      try { game.ctx.close(); } catch (e) { /* ignore */ }
      const pad = document.getElementById("rtPad");
      if (pad) { pad.classList.remove("live"); pad.style.setProperty("--pulse", 0); }
      const pt = document.getElementById("rtPadText"); if (pt) pt.textContent = "Play again";
      show(`${starText(st)}  ${perfect} perfect · ${good} good · ${pct}% on the beat${newBest && prev ? " · New best!" : ""}`, "");
      if (newBest && st === 3 && window.PID_CELEBRATE) window.PID_CELEBRATE("Spot on!", `${game.score} points in the ${game.d.name.toLowerCase()}. You've got great timing!`, { shamrocks: true });
      else if (newBest && prev) toast(`New best score: ${game.score}`);
    }

    function stop() { if (game && !game.done) { game.done = true; try { game.ctx.close(); } catch (e) { /* ignore */ } } }

    document.getElementById("app").addEventListener("click", (e) => {
      const t = e.target.closest("[data-rt-dance], [data-rt-speed]"); if (!t) return;
      stop();
      if (t.dataset.rtDance) R.dance = t.dataset.rtDance; else R.speed = t.dataset.rtSpeed;
      ls.save(R); game = null; A.rerender();
    });
    window.addEventListener("hashchange", stop);
    window.PID_RHYTHM.current = () => game; // for tests

    return {
      screen,
      bestText() {
        R = ls.load();
        const all = Object.values(R.best);
        if (!all.length) return "Tap along to a reel, jig or hornpipe";
        const top = all.reduce((a, b) => (b.score > a.score ? b : a));
        return `Best score ${top.score} ${starText(top.stars)}`;
      }
    };
  };
  window.PID_RHYTHM.DANCES = DANCES;
})();
