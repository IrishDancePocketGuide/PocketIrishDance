/* Rhythm tap: tap along to the beat of an Irish dance tune.
   The music is played on the phone (Web Audio) from real accordion and piano notes kept with the app,
   so it works offline. The tunes are short originals in the traditional style. Best scores stay on this phone. */
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
  const PERFECT = 0.07, GOOD = 0.14, WINDOW = 0.25; // seconds
  const KEY = "pid.rhythm";

  const ls = {
    load() { try { return Object.assign({ best: {}, dance: "reel", speed: "practice" }, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { return { best: {}, dance: "reel", speed: "practice" }; } },
    save(R) { try { localStorage.setItem(KEY, JSON.stringify(R)); } catch (e) { /* still playable */ } }
  };

  // The tunes: short original tunes written for the app in the style of traditional Irish dance music,
  // in a simple ABC-like notation. One unit = one eighth note. Capital letters = the octave from
  // middle C, small letters = the octave above; a number makes the note longer; (3 = three notes in the
  // time of two (a "roll"); z = a rest. Chords are one per beat, played by the piano the way feis
  // musicians "vamp": a bass note on the beat and a chord in between.
  const TUNES = {
    reel: { key: "D", notes: "FA(3AAA dAFA|BEED EFGE|FA(3AAA dAFA|Bcde fdd2|FA(3AAA dAFA|BEED EFGE|FA(3AAA dAFA|Bcde fdd2|f2af dfaf|e2ce Acec|d2fd Adfd|Bcde fdd2|f2af dfaf|e2ce Acec|d2fd Adfd|Bcde fdd2",
      chords: "D D|Em A|D D|G D|D D|Em A|D D|G D|D D|A A|D D|G D|D D|A A|D D|G D" },
    lightjig: { key: "G", notes: "GBd gdB|cec ABc|BGB dgb|afd def|GBd gdB|cec ABc|BdB AFA|G3 G2z|dgg fga|bge dBG|ceg Bdg|afd def|g2d e2c|BdB cAF|GBd cAF|G3 G2z",
      chords: "G G|C D|G G|D D|G G|C D|G D|G G|G D|Em G|C G|D D|G C|G D|G D|G G" },
    slipjig: { key: "D", notes: "A2F A2F d2F|B2G B2G d2B|A2F A2F d2f|e2c A2B c2e|A2F A2F d2F|B2G B2G d2B|f2d e2c d2B|A2F E2F D3|d2f a2f d2f|g2e b2g e2g|e2c a2e c2e|f2a e2c d3",
      chords: "D D D|G G G|D D D|A A A|D D D|G G G|D A G|D A D|D D D|Em Em Em|A A A|D A D" },
    hornpipe: { key: "D", notes: "AFDF Adfd|gece Aceg|fdAd fagf|ecAc e2g2|AFDF Adfd|GBdB cege|fdAF GBec|d2f2 d2z2|fedf afdf|gfeg bgeg|agfe dcBA|Bcde f2e2|fedf afdf|gfeg bgeg|afdf ecAc|d2f2 d2z2",
      chords: "D D|A A|D D|A A|D D|G A|D A|D D|D D|Em G|D A|G A|D D|Em G|D A|D D" },
    treble: { key: "D", notes: "A2F A2d|f2e d2B|A2F ABc|e2c A2c|A2F A2d|f2e d2B|A2B c2e|d3 d2z|f2d f2a|g2e g2b|a2f d2f|e2c A2c|f2d f2a|g2b a2g|f2d e2c|d3 d2z",
      chords: "D D|D G|D A|A A|D D|D G|A A|D D|D D|Em G|D D|A A|D D|G A|D A|D D" }
  };
  const PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const SHARPS = { D: ["F", "C"], G: ["F"] };
  // Turns a tune into notes: { at, len } in eighth-note units, and midi pitch.
  function parse(tn) {
    const out = []; let pos = 0, trip = 0;
    const sharp = SHARPS[tn.key] || [];
    const re = /\(3|([A-Ga-gz])(\d*)/g; let m;
    for (const bar of tn.notes.split("|")) {
      re.lastIndex = 0;
      while ((m = re.exec(bar))) {
        if (m[0] === "(3") { trip = 3; continue; }
        let len = m[2] ? +m[2] : 1;
        if (trip) { len = len * 2 / 3; trip--; }
        if (m[1] !== "z") {
          const up = m[1] === m[1].toLowerCase(), L = m[1].toUpperCase();
          out.push({ at: pos, len, midi: 60 + (up ? 12 : 0) + PC[L] + (sharp.includes(L) ? 1 : 0) });
        }
        pos += len;
      }
    }
    return { key: tn.key, notes: out, chords: tn.chords.split("|").map((b) => b.trim().split(/\s+/)), bars: tn.notes.split("|").length };
  }
  const chordPcs = (c) => { const r = PC[c[0]] + (c[1] === "#" ? 1 : 0), minor = /m$/.test(c); return [r, r + (minor ? 3 : 4), r + 7].map((x) => x % 12); };
  const inRange = (pc, lo) => lo + ((pc - lo) % 12 + 12) % 12; // the one pitch with this note name from lo up to lo+11

  // Real instrument notes (accordion and piano, recorded from the FluidR3 GM sound set, CC BY 3.0),
  // laid out one note every SLOT seconds (made by scripts/build-music.py). Kept with the app so it works offline.
  const SLOT = 1.25, LEAD = 0.05, ACC_LO = 62, ACC_HI = 86, PNO_LO = 38, PNO_HI = 69, WOOD = 32;
  const SOUND = { acc: null, pno: null, loading: null };
  function loadSounds() {
    if (SOUND.acc) return Promise.resolve(true);
    if (SOUND.loading) return SOUND.loading;
    const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!OAC || !window.fetch) return Promise.resolve(false);
    const decode = (buf) => new Promise((res, rej) => { const c = new OAC(1, 1, 44100); const p = c.decodeAudioData(buf, res, rej); if (p && p.catch) p.catch(rej); });
    // Where the first note really starts (some phones add a little silence at the front of an mp3).
    const shift = (b) => { const x = b.getChannelData(0); let i = 0; while (i < x.length && Math.abs(x[i]) < 0.01) i++; return i / b.sampleRate - LEAD; };
    SOUND.loading = Promise.all(["audio/accordion.mp3", "audio/piano.mp3"].map((u) => fetch(u).then((r) => { if (!r.ok) throw new Error(u); return r.arrayBuffer(); }).then(decode)))
      .then(([a, p]) => { a.shift = shift(a); p.shift = shift(p); SOUND.acc = a; SOUND.pno = p; return true; })
      .catch(() => { SOUND.loading = null; return false; });
    return SOUND.loading;
  }

  // A little room sound, so it isn't bone dry like a computer.
  function room(ctx) {
    const len = Math.floor(ctx.sampleRate * 1.6), ir = ctx.createBuffer(2, len, ctx.sampleRate);
    let s = 7;
    for (let ch = 0; ch < 2; ch++) { const x = ir.getChannelData(ch); for (let i = 0; i < len; i++) { s = (s * 16807) % 2147483647; x[i] = (s / 1073741823 - 1) * Math.pow(1 - i / len, 3) * Math.exp(-i / (ctx.sampleRate * 0.35)); } }
    const c = ctx.createConvolver(); c.buffer = ir; return c;
  }

  // Instruments: real samples when they've loaded, or simple made-up tones if they couldn't load.
  function instruments(ctx, out) {
    if (SOUND.acc) {
      const play = (buf, slot, t, dur, vel, rate, rel) => {
        const src = ctx.createBufferSource(), g = ctx.createGain();
        src.buffer = buf; src.playbackRate.value = rate;
        g.gain.setValueAtTime(vel, t); g.gain.setValueAtTime(vel, t + dur); g.gain.linearRampToValueAtTime(0.0001, t + dur + rel);
        src.connect(g); g.connect(out);
        src.start(t, Math.max(0, slot * SLOT + LEAD + buf.shift), Math.min(SLOT - 0.1, (dur + rel) * rate + 0.02));
        src.stop(t + dur + rel + 0.05);
      };
      const pick = (midi, lo, hi) => { while (midi < lo) midi += 12; while (midi > hi) midi -= 12; return midi - lo; };
      return {
        // Two accordion reeds tuned a touch apart, the "wet" sound of an Irish button box.
        melody(t, midi, dur, vel) { const s = pick(midi, ACC_LO, ACC_HI); play(SOUND.acc, s, t, dur, vel * 0.42, 1.0045, 0.05); play(SOUND.acc, s, t, dur, vel * 0.42, 0.9955, 0.05); },
        piano(t, midi, dur, vel) { play(SOUND.pno, pick(midi, PNO_LO, PNO_HI), t, dur, vel * 0.55, 1, 0.12); },
        click(t, strong) { play(SOUND.pno, WOOD, t, 0.12, strong ? 0.6 : 0.4, strong ? 1.25 : 1, 0.05); }
      };
    }
    const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
    const osc = (type, t, f, dur, vel) => {
      const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vel, t + 0.01); g.gain.exponentialRampToValueAtTime(0.001, t + Math.max(0.08, dur));
      o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + 0.05);
    };
    return {
      melody(t, midi, dur, vel) { osc("triangle", t, hz(midi), dur, 0.22 * vel); },
      piano(t, midi, dur, vel) { osc("sine", t, hz(midi), Math.min(dur, 0.2), 0.3 * vel); },
      click(t, strong) { osc("square", t, strong ? 1600 : 1100, 0.05, 0.15); }
    };
  }

  // Plays a dance's tune with piano from time `start1`. Returns the time of each beat to tap on.
  function playTune(ctx, out, d, beat, start1) {
    const tn = parse(TUNES[d.id] || TUNES.reel), inst = instruments(ctx, out);
    const sub = d.sub;
    // Where an eighth note lands inside a beat: hornpipes swing long-short, reels lilt a little, jigs lean on the first note.
    const lilt = d.sub === 4 ? (d.swing || 0.08) : 0;
    const warp = (p) => {
      const b = Math.floor(p / sub + 1e-9); let x = p / sub - b;
      if (sub === 4) { const h = x * 2, pair = Math.floor(h + 1e-9), y = h - pair, k = 0.5 + lilt / 2; x = (pair + (y < 0.5 ? y / 0.5 * k : k + (y - 0.5) / 0.5 * (1 - k))) / 2; }
      else { const y = x * 3, i = Math.floor(y + 1e-9), knots = [0, 0.36, 0.69, 1]; x = knots[i] + (y - i) * (knots[Math.min(3, i + 1)] - knots[i]); }
      return start1 + (b + x) * beat;
    };
    let seed = 11; const wob = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 - 0.5; };
    const scale = [0, 2, 4, 5, 7, 9, 11].map((x) => (x + PC[tn.key]) % 12);
    let prev = null;
    tn.notes.forEach((n) => {
      const t = warp(n.at), end = warp(n.at + n.len);
      const onBeat = Math.abs(n.at / sub - Math.round(n.at / sub)) < 1e-6;
      const vel = (onBeat ? 1 : Math.abs(n.len - 1) > 0.1 ? 0.8 : 0.72) + wob() * 0.08;
      let at = t;
      if (prev && prev.midi === n.midi && n.len >= 1) {
        // A "cut": a flick of the note above, the way Irish players split a repeated note.
        let g = n.midi + 1; while (g < n.midi + 3 && !scale.includes(g % 12)) g++;
        inst.melody(t, g, 0.03, vel * 0.7); at = t + 0.03;
      }
      inst.melody(at, n.midi, Math.max(0.05, (end - at) * 0.9), vel);
      prev = n;
    });
    const beats = [];
    tn.chords.forEach((bar, bi) => {
      for (let p = 0; p < d.pulses; p++) {
        const c = bar[p] || bar[bar.length - 1], bt = start1 + (bi * d.pulses + p) * beat;
        beats.push(bt);
        const pcs = chordPcs(c), sameAsLast = p > 0 && (bar[p - 1] === c);
        inst.piano(bt, inRange(sameAsLast ? pcs[2] : pcs[0], 38), beat * 0.45, p === 0 ? 1 : 0.85);
        const chordAt = sub === 4 ? warp((bi * d.pulses + p) * sub + 2) : bt + beat * (2 / 3);
        pcs.forEach((pc) => inst.piano(chordAt, inRange(pc, 55), beat * 0.25, 0.42));
      }
    });
    const end = beats[beats.length - 1] + beat, home = TUNES[d.id] ? TUNES[d.id].key : "D";
    inst.melody(end, inRange(PC[home], 67), beat * 1.6, 0.9);
    chordPcs(home).forEach((pc) => inst.piano(end, inRange(pc, 55), beat * 1.6, 0.5));
    inst.piano(end, inRange(PC[home], 38), beat * 1.8, 1);
    return { beats, end, click: inst.click };
  }

  // The sound chain: instruments -> a little room -> a gentle limiter -> speaker.
  function mixer(ctx) {
    const master = ctx.createGain(); master.gain.value = 0.9;
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4;
    const dry = ctx.createGain(), wet = ctx.createGain(), rv = room(ctx); wet.gain.value = 0.22;
    dry.connect(comp); dry.connect(rv); rv.connect(wet); wet.connect(comp); comp.connect(master); master.connect(ctx.destination);
    return dry;
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
        <p class="small muted" style="text-align:center">🔊 Turn your sound up. On iPhone, check the silent switch is off.</p>
        <p class="small muted" style="text-align:center;font-size:11px;opacity:.8">Accordion and piano sounds from the FluidR3 GM sound set by Frank Wen (CC BY 3.0). Tunes written for Pocket Irish Dance.</p>`,
        after: wire
      };
    }

    function wire() {
      const pad = document.getElementById("rtPad");
      const tap = (e) => {
        e.preventDefault();
        if (!game || game.done) start(); else if (!game.loading) hit();
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
      const ctx = new AC(); // made right on the tap, so phones allow sound
      if (ctx.state === "suspended") ctx.resume();
      const g = game = { ctx, done: false, loading: true, d, sp };
      if (!SOUND.acc) show("Getting the music ready…", "");
      loadSounds().then(() => { if (game === g && !g.done) go(g); });
    }

    function go(g) {
      const { ctx, d, sp } = g;
      const beat = 60 / (d.bpm * sp.f);
      const t0 = ctx.currentTime + 0.35;
      const out = mixer(ctx);
      const start1 = t0 + d.pulses * beat;
      const { beats, end, click } = playTune(ctx, out, d, beat, start1);
      // Count-in bar: woodblock taps only.
      for (let p = 0; p < d.pulses; p++) click(t0 + p * beat, p === 0);

      const lat = (ctx.outputLatency || 0) + (ctx.baseLatency || 0);
      Object.assign(g, { beats, beat, hits: new Array(beats.length).fill(null), score: 0, combo: 0, maxCombo: 0, lat, end, start1, t0, loading: false });
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
      const ctx = game.ctx; setTimeout(() => { try { ctx.close(); } catch (e) { /* ignore */ } }, 2500); // let the last chord ring
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
    loadSounds(); // get the music ready while they read the screen

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
  // For tests and demo recordings: play a dance's tune into any audio context.
  window.PID_RHYTHM.demo = (ctx, id, f) => loadSounds().then((ok) => { const d = DANCES.find((x) => x.id === id); const beat = 60 / (d.bpm * (f || 1)); const r = playTune(ctx, mixer(ctx), d, beat, 0.3 + d.pulses * beat); for (let p = 0; p < d.pulses; p++) r.click(0.3 + p * beat, p === 0); return Object.assign(r, { real: ok }); });
})();
