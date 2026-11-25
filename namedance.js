/* Name that dance: hear a short tune and guess the dance.
   Tunes are made on the phone (Web Audio), a new made-up melody every round,
   so it works offline and uses no recordings. Best score stays on this phone. */
(function () {
  "use strict";

  // bpm = feis speed; pulses = beats per bar; sub = notes per beat; swing = long-short feel.
  const DANCES = [
    { id: "reel", name: "Reel", bpm: 113, pulses: 2, sub: 4, swing: 0, why: "Reels are fast and smooth: four even notes to every beat, in 4/4." },
    { id: "lightjig", name: "Light jig", bpm: 115, pulses: 2, sub: 3, swing: 0, why: "Light jigs are quick, with notes in threes: “1-2-3, 4-5-6”, in 6/8." },
    { id: "slipjig", name: "Slip jig", bpm: 113, pulses: 3, sub: 3, swing: 0, why: "Slip jigs have three beats in a bar, each split in three, in 9/8. They feel graceful and flowing." },
    { id: "hornpipe", name: "Hornpipe", bpm: 113, pulses: 2, sub: 4, swing: 0.4, why: "Hornpipes have a bouncy long-short, long-short feel (dotted rhythm)." },
    { id: "treble", name: "Treble jig", bpm: 73, pulses: 2, sub: 3, swing: 0, why: "Treble jigs are slow, heavy jigs in 6/8, danced in hard shoes." }
  ];
  const ROUNDS = 10;
  const BARS = 4;
  const KEY = "pid.namedance";
  const SCALE = [293.66, 329.63, 369.99, 392.0, 440.0, 493.88, 554.37, 587.33, 659.25, 739.99, 783.99, 880.0];

  const ls = {
    load() { try { return Object.assign({ best: 0, played: 0 }, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { return { best: 0, played: 0 }; } },
    save(N) { try { localStorage.setItem(KEY, JSON.stringify(N)); } catch (e) { /* still playable */ } }
  };

  function melody(d, seed) {
    let s = seed >>> 0;
    const r = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    const per = d.pulses * d.sub * 2; // two-bar phrase
    const out = []; let at = [0, 2, 4][Math.floor(r() * 3)];
    for (let i = 0; i < per; i++) {
      if (i % d.sub === 0 && r() < 0.55) at = [0, 2, 4, 7, 9][Math.floor(r() * 5)];
      else at = Math.max(0, Math.min(SCALE.length - 1, at + [-2, -1, -1, 1, 1, 2][Math.floor(r() * 6)]));
      out.push(at);
    }
    out[per - 1] = 0;
    return out;
  }

  window.PID_NAMEDANCE = function (A) {
    const { esc } = A;
    let N = ls.load();
    let game = null; // { order: [danceIdx], round, score, answered, seed }
    let ctx = null;

    function stopAudio() { if (ctx) { try { ctx.close(); } catch (e) { /* ignore */ } ctx = null; } }

    function play(d, seed) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) { A.toast("This phone can't play the music"); return; }
      stopAudio();
      ctx = new AC();
      if (ctx.state === "suspended") ctx.resume();
      const master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
      const beat = 60 / d.bpm;
      const notes = melody(d, seed);
      const t0 = ctx.currentTime + 0.15;
      const note = (t, f, len) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "triangle"; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.24, t + 0.01); g.gain.exponentialRampToValueAtTime(0.001, t + Math.max(0.08, len * 0.95));
        o.connect(g); g.connect(master); o.start(t); o.stop(t + len);
      };
      const drum = (t, strong) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine"; o.frequency.setValueAtTime(strong ? 140 : 100, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
        g.gain.setValueAtTime(strong ? 0.7 : 0.4, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.16);
      };
      for (let bar = 0; bar < BARS; bar++) {
        for (let p = 0; p < d.pulses; p++) {
          const bt = t0 + (bar * d.pulses + p) * beat;
          drum(bt, p === 0);
          for (let k = 0; k < d.sub; k++) {
            let off = k / d.sub, len = 1 / d.sub;
            if (d.swing && d.sub === 4) { const pair = Math.floor(k / 2), first = k % 2 === 0; const long = 0.5 * (0.5 + d.swing / 2); off = pair * 0.5 + (first ? 0 : long); len = first ? long : 0.5 - long; }
            const idx = ((bar % 2) * d.pulses + p) * d.sub + k;
            note(bt + off * beat, SCALE[notes[idx % notes.length]], len * beat);
          }
        }
      }
      const end = t0 + BARS * d.pulses * beat;
      note(end, SCALE[0], beat); drum(end, true);
      const pad = document.getElementById("ndPlay");
      if (pad) { pad.classList.add("playing"); setTimeout(() => { const p2 = document.getElementById("ndPlay"); if (p2) p2.classList.remove("playing"); }, (end - ctx.currentTime + beat) * 1000); }
    }

    function newGame() {
      // Every dance comes up twice, in a random order.
      const order = [];
      for (let i = 0; i < ROUNDS; i++) order.push(i % DANCES.length);
      for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
      game = { order, round: 0, score: 0, answered: false, seed: Math.floor(Math.random() * 1e9), picks: [] };
    }

    function screen() {
      N = ls.load();
      if (!game) {
        return {
          title: "Name that dance", tab: "home", back: true,
          html: `
          <section class="card nd-intro">
            <div class="tq-big" aria-hidden="true">🎶</div>
            <h3>Can you tell a reel from a jig?</h3>
            <p class="muted">You'll hear ${ROUNDS} short tunes. Listen to the rhythm and guess which dance it's for: reel, light jig, slip jig, hornpipe or treble jig.</p>
            <button type="button" class="btn block" data-nd-start>Start</button>
            ${N.best ? `<p class="small muted" style="margin:10px 0 0">Your best: ${N.best} of ${ROUNDS}</p>` : ""}
          </section>
          <div class="card small"><strong>Listening tips</strong>
            ${DANCES.map((d) => `<div style="margin-top:6px"><strong>${esc(d.name)}:</strong> <span class="muted">${esc(d.why)}</span></div>`).join("")}
          </div>
          <p class="small muted" style="text-align:center">🔊 Turn your sound up. On iPhone, check the silent switch is off.</p>`
        };
      }
      if (game.round >= ROUNDS) {
        const sc = game.score;
        return {
          title: "Name that dance", tab: "home", back: true,
          html: `
          <section class="card tq-done">
            <div class="tq-big">${sc >= 9 ? "☘️☘️☘️" : sc >= 6 ? "☘️☘️" : "☘️"}</div>
            <h3>${sc} of ${ROUNDS} right</h3>
            <p class="muted">${sc === ROUNDS ? "Perfect ears! You know your dances." : sc >= 6 ? "Great listening!" : "Tricky, isn't it? Try listening for threes (jigs) or fours (reels)."}</p>
            <p class="small">Your best: ${Math.max(N.best, sc)} of ${ROUNDS}</p>
            <button type="button" class="btn block" data-nd-start>Play again</button>
          </section>`
        };
      }
      const d = DANCES[game.order[game.round]];
      return {
        title: "Name that dance", tab: "home", back: true,
        html: `
        <div class="row between ws-stats small"><span>Tune ${game.round + 1} of ${ROUNDS}</span><span>${game.score} right</span></div>
        <div class="tq-dots">${game.order.map((_, i) => `<i class="${i < game.round ? (game.picks[i] ? "ok" : "no") : i === game.round ? "now" : ""}"></i>`).join("")}</div>
        <div class="rt-stage">
          <button type="button" class="rt-pad nd-play" id="ndPlay" data-nd-play aria-label="Play the tune">▶︎<span class="small" style="display:block;font-size:14px">${game.heard ? "Play again" : "Play"}</span></button>
        </div>
        <p class="small muted" style="text-align:center;margin:4px 0 10px">Which dance is this tune for?</p>
        <div class="stack" id="ndOpts">${DANCES.map((x, i) => `<button type="button" class="btn ghost block tq-opt" data-nd="${i}" ${game.answered ? "disabled" : ""}>${esc(x.name)}</button>`).join("")}</div>
        <div id="ndWhy" class="tq-why" hidden></div>`
      };
    }

    function answer(i) {
      if (!game || game.answered) return;
      const right = game.order[game.round];
      const ok = i === right;
      game.answered = true; game.picks[game.round] = ok; if (ok) game.score++;
      document.querySelectorAll("[data-nd]").forEach((b, k) => { b.disabled = true; if (k === right) b.classList.add("right"); else if (k === i) b.classList.add("wrong"); });
      const why = document.getElementById("ndWhy"); why.hidden = false;
      const last = game.round + 1 >= ROUNDS;
      why.innerHTML = `<p><strong>${ok ? "Yes! 🎉" : `It was a ${esc(DANCES[right].name.toLowerCase())}.`}</strong> ${esc(DANCES[right].why)}</p><button type="button" class="btn block" data-nd-next>${last ? "See my score" : "Next tune"}</button>`;
      if (navigator.vibrate) try { navigator.vibrate(ok ? 15 : [10, 40, 10]); } catch (e) { /* ignore */ }
      try { why.scrollIntoView({ behavior: "smooth", block: "end" }); } catch (e) { /* ignore */ }
    }

    function next() {
      stopAudio();
      game.round++; game.answered = false; game.heard = false; game.seed = Math.floor(Math.random() * 1e9);
      if (game.round >= ROUNDS) {
        N.played = (N.played || 0) + 1;
        const newBest = game.score > (N.best || 0);
        if (newBest) N.best = game.score;
        ls.save(N);
        if (game.score === ROUNDS && window.PID_CELEBRATE) setTimeout(() => window.PID_CELEBRATE("Perfect ears!", `All ${ROUNDS} dances named. Amazing listening! 🎶`), 300);
        else if (newBest && N.played > 1) A.toast(`New best: ${game.score} of ${ROUNDS}`);
      }
      A.rerender();
    }

    document.getElementById("app").addEventListener("click", (e) => {
      const t = e.target.closest("[data-nd-start], [data-nd-play], [data-nd], [data-nd-next]"); if (!t) return;
      if (t.dataset.ndStart !== undefined) { newGame(); A.rerender(); game.heard = true; play(DANCES[game.order[0]], game.seed); return; } // play inside the tap so phones allow sound
      if (t.dataset.ndPlay !== undefined) { play(DANCES[game.order[game.round]], game.seed); game.heard = true; const s = t.querySelector("span"); if (s) s.textContent = "Play again"; return; }
      if (t.dataset.nd !== undefined) { answer(Number(t.dataset.nd)); return; }
      if (t.dataset.ndNext !== undefined) { next(); if (game.round < ROUNDS) { game.heard = true; play(DANCES[game.order[game.round]], game.seed); } }
    });
    window.addEventListener("hashchange", () => { stopAudio(); if (!/^#\/games\/namedance/.test(location.hash)) game = null; });
    window.PID_NAMEDANCE.current = () => game; // for tests

    return {
      screen,
      status() { N = ls.load(); return N.best ? `Best: ${N.best} of ${ROUNDS}` : "Hear a tune, guess the dance"; }
    };
  };
})();
