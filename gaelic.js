/* Learning Irish word flashcards: see an Irish word, pick what it means.
   Works offline. Best score stays on this phone. The speaker button
   (data-say) is handled by app.js and is just for learning, not scored. */
(function () {
  "use strict";

  // ga = Irish spelling, say = how it sounds (English letters), means = answer, note = shown after.
  const WORDS = [
    { ga: "rince", say: "RIN-kuh", means: "Dance", note: "You'll see it in An Coimisiún le Rincí Gaelacha: the Commission for Irish Dances." },
    { ga: "ceol", say: "kyohl", means: "Music", note: "Ceol agus rince means music and dance." },
    { ga: "rinceoir", say: "RIN-kyore", means: "Dancer", note: "It's rince (dance) with -oir on the end, which means a person who does it." },
    { ga: "croí", say: "kree", means: "Heart", note: "Mo chroí (muh kree) means my heart." },
    { ga: "grá", say: "graw", means: "Love", note: "Mo ghrá (muh graw) means my love." },
    { ga: "feis", say: "fesh", means: "Festival", note: "That's why a dance competition is called a feis. More than one is feiseanna." },
    { ga: "céilí", say: "KAY-lee", means: "A dance party", note: "A céilí is a social night of group dancing, and céilí dances are the team dances." },
    { ga: "cara", say: "KAR-uh", means: "Friend", note: "Your dance friends are your cairde (KAR-juh)." },
    { ga: "ádh mór", say: "aw MORE", means: "Good luck", note: "A perfect thing to say to a friend before they dance!" },
    { ga: "fáilte", say: "FAWL-chuh", means: "Welcome", note: "Céad míle fáilte means a hundred thousand welcomes." },
    { ga: "sláinte", say: "SLAWN-chuh", means: "Health", note: "People say it like cheers when they raise a glass." },
    { ga: "Éire", say: "AIR-uh", means: "Ireland", note: "Where Irish dance comes from." }
  ];
  const KEY = "pid.gaelic";

  const ls = {
    load() { try { return Object.assign({ best: 0, played: 0 }, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { return { best: 0, played: 0 }; } },
    save(N) { try { localStorage.setItem(KEY, JSON.stringify(N)); } catch (e) { /* still playable */ } }
  };
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const speaker = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 8.5a4.5 4.5 0 0 1 0 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  window.PID_GAELIC = function (A) {
    const { esc } = A;
    const TOTAL = WORDS.length;
    let N = ls.load();
    let game = null; // { order: [wordIdx], opts: [[wordIdx x4]], round, score, answered, picks }

    function newGame() {
      const order = shuffle(WORDS.map((_, i) => i));
      const opts = order.map((w) => shuffle([w, ...shuffle(WORDS.map((_, i) => i).filter((i) => i !== w)).slice(0, 3)]));
      game = { order, opts, round: 0, score: 0, answered: false, picks: [] };
    }

    function screen() {
      N = ls.load();
      if (!game) {
        return {
          title: "Learning Irish", tab: "home", back: true,
          html: `
          <section class="card nd-intro">
            <div class="tq-big" aria-hidden="true">☘️</div>
            <h3>How many Irish words do you know?</h3>
            <p class="muted">You'll see ${TOTAL} words in Irish (Gaeilge, said GAYL-gyuh). Pick what each one means. Tap the speaker to hear how it sounds.</p>
            <button type="button" class="btn block" data-gw-start>Start</button>
            ${N.best ? `<p class="small muted" style="margin:10px 0 0">Your best: ${N.best} of ${TOTAL}</p>` : ""}
          </section>`
        };
      }
      if (game.round >= TOTAL) {
        const sc = game.score;
        return {
          title: "Learning Irish", tab: "home", back: true,
          html: `
          <section class="card tq-done">
            <div class="tq-big">${sc === TOTAL ? "☘️☘️☘️" : sc >= 8 ? "☘️☘️" : "☘️"}</div>
            <h3>${sc} of ${TOTAL} words right</h3>
            <p class="muted">${sc === TOTAL ? "Maith thú! (mah HOO), that means well done!" : sc >= 8 ? "Great job! You know lots of Irish." : "Every dancer starts somewhere. Play again to learn them all."}</p>
            <p class="small">Your best: ${Math.max(N.best, sc)} of ${TOTAL}</p>
            <button type="button" class="btn block" data-gw-start>Play again</button>
          </section>
          <h3 class="tq-review-h">All the words</h3>
          ${WORDS.map((w) => `<div class="card tq-review"><strong>${esc(w.ga)}</strong> <span class="muted">· ${esc(w.means)}</span>
            <div class="small"><button type="button" class="say" data-say="${esc(w.say)}" aria-label="Hear it: ${esc(w.say)}">${speaker}${esc(w.say)}</button></div></div>`).join("")}`
        };
      }
      const w = WORDS[game.order[game.round]];
      return {
        title: "Learning Irish", tab: "home", back: true,
        html: `
        <div class="row between ws-stats small"><span>Word ${game.round + 1} of ${TOTAL}</span><span>${game.score} right</span></div>
        <div class="tq-dots gw-dots">${game.order.map((_, i) => `<i class="${i < game.round ? (game.picks[i] ? "ok" : "no") : i === game.round ? "now" : ""}"></i>`).join("")}</div>
        <section class="card gw-card">
          <div class="gw-word" lang="ga">${esc(w.ga)}</div>
          <button type="button" class="say" data-say="${esc(w.say)}" aria-label="Hear it: ${esc(w.say)}">${speaker}${esc(w.say)}</button>
        </section>
        <p class="small muted" style="text-align:center;margin:4px 0 10px">What does it mean?</p>
        <div class="stack">${game.opts[game.round].map((k) => `<button type="button" class="btn ghost block tq-opt" data-gw="${k}" ${game.answered ? "disabled" : ""}>${esc(WORDS[k].means)}</button>`).join("")}</div>
        <div id="gwWhy" class="tq-why" hidden></div>`
      };
    }

    function answer(k) {
      if (!game || game.answered) return;
      const right = game.order[game.round];
      const ok = k === right;
      game.answered = true; game.picks[game.round] = ok; if (ok) game.score++;
      document.querySelectorAll("[data-gw]").forEach((b) => { const v = Number(b.dataset.gw); b.disabled = true; if (v === right) b.classList.add("right"); else if (v === k) b.classList.add("wrong"); });
      const w = WORDS[right];
      const why = document.getElementById("gwWhy"); why.hidden = false;
      const last = game.round + 1 >= TOTAL;
      why.innerHTML = `<p><strong>${ok ? "Yes! 😀" : `${esc(w.ga)} means ${esc(w.means.toLowerCase())}.`}</strong> ${esc(w.note)}</p><button type="button" class="btn block" data-gw-next>${last ? "See my score" : "Next word"}</button>`;
      if (navigator.vibrate) try { navigator.vibrate(ok ? 15 : [10, 40, 10]); } catch (e) { /* ignore */ }
      try { why.scrollIntoView({ behavior: "smooth", block: "end" }); } catch (e) { /* ignore */ }
    }

    function next() {
      game.round++; game.answered = false;
      if (game.round >= TOTAL) {
        N.played = (N.played || 0) + 1;
        const newBest = game.score > (N.best || 0);
        if (newBest) N.best = game.score;
        ls.save(N);
        if (game.score === TOTAL && window.PID_CELEBRATE) setTimeout(() => window.PID_CELEBRATE("Maith thú!", `All ${TOTAL} Irish words right. Well done! ☘️`, { shamrocks: true }), 300);
        else if (newBest && N.played > 1) A.toast(`New best: ${game.score} of ${TOTAL}`);
      }
      A.rerender();
      try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }
    }

    document.getElementById("app").addEventListener("click", (e) => {
      const t = e.target.closest("[data-gw-start], [data-gw], [data-gw-next]"); if (!t) return;
      if (t.dataset.gwStart !== undefined) { newGame(); A.rerender(); return; }
      if (t.dataset.gw !== undefined) { answer(Number(t.dataset.gw)); return; }
      if (t.dataset.gwNext !== undefined) next();
    });
    window.addEventListener("hashchange", () => { if (!/^#\/games\/gaelic/.test(location.hash)) game = null; });
    window.PID_GAELIC.current = () => game; // for tests

    return {
      screen,
      status() { N = ls.load(); return N.best ? `Best: ${N.best} of ${TOTAL}` : `${TOTAL} words to learn`; }
    };
  };
})();
