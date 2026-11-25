/* Irish symbols flashcards: see a symbol, pick its name.
   Symbols are original drawings (inline SVG), so it works offline. Best score stays on this phone. */
(function () {
  "use strict";

  const SYMBOLS = [
    { id: "shamrock", name: "Shamrock", fact: "Legend says St Patrick used its three leaves to explain the Holy Trinity. It's one of the best-known symbols of Ireland.",
      svg: "<path d=\"M50 54Q51 76 63 92\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"5\" stroke-linecap=\"round\"/><path d=\"M50 52C38 44 27 34 33 23C38 15 47 17 50 25C53 17 62 15 67 23C73 34 62 44 50 52Z\" transform=\"rotate(0 50 52)\" fill=\"currentColor\"/><path d=\"M50 52C38 44 27 34 33 23C38 15 47 17 50 25C53 17 62 15 67 23C73 34 62 44 50 52Z\" transform=\"rotate(-105 50 52)\" fill=\"currentColor\"/><path d=\"M50 52C38 44 27 34 33 23C38 15 47 17 50 25C53 17 62 15 67 23C73 34 62 44 50 52Z\" transform=\"rotate(105 50 52)\" fill=\"currentColor\"/>" },
    { id: "harp", name: "Harp", fact: "The harp is Ireland's official national emblem. You'll find it on Irish euro coins and on Irish passports.",
      svg: "<path d=\"M30 25L30 32.7M35 27.1L35 40.7M40 28.7L40 48.7M44.9 29.5L44.9 56.5M50 29.7L50 64.6M55 29.2L55 72.5M60 28.1L60 80.4\" stroke=\"currentColor\" stroke-width=\"1.6\" fill=\"none\"/><path d=\"M22 20L66 90\" stroke=\"currentColor\" stroke-width=\"9\" stroke-linecap=\"round\" fill=\"none\"/><path d=\"M22 20Q52 42 84 14\" stroke=\"currentColor\" stroke-width=\"6\" stroke-linecap=\"round\" fill=\"none\"/><path d=\"M84 14Q94 60 66 90\" stroke=\"currentColor\" stroke-width=\"7\" stroke-linecap=\"round\" fill=\"none\"/>" },
    { id: "celticcross", name: "Celtic cross", fact: "A cross with a ring around the middle. Tall stone high crosses like this were carved in Ireland over 1,000 years ago.",
      svg: "<circle cx=\"50\" cy=\"36\" r=\"21\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"6\"/><path d=\"M44 6h12v24h26v12H56v42H44V42H18V30h26z\" fill=\"currentColor\"/><path d=\"M36 84h28l4 10H32z\" fill=\"currentColor\"/>" },
    { id: "trinity", name: "Trinity knot", fact: "Also called the triquetra. Its three loops are one unbroken line, and Christians traditionally see it as the Holy Trinity. You'll often spot it on solo dresses.",
      svg: "<path d=\"M50 18 L48.3 18.7 L46.6 19.5 L45 20.3 L43.5 21.3 L42 22.4 L40.5 23.5 L39.1 24.7 L37.8 26 L36.6 27.4 L35.5 28.9 L34.4 30.4 L33.5 31.9 L32.6 33.5 L31.8 35.2 L31.2 36.9 L30.6 38.7 L30.1 40.4 L29.7 42.2 L29.5 44.1 L29.3 45.9 L29.3 47.7 L29.3 49.6 L29.5 51.4 L29.8 53.2 L30.1 55 L30.6 56.8 L31.2 58.5 L31.9 60.2 L32.6 61.9 L33.5 63.5 L34.5 65.1 L35.5 66.6 L36.7 68 L37.9 69.4 L39.2 70.7 L40.6 71.9 L42 73.1 L43.5 74.1 L45.1 75.1 L46.7 76 L48.3 76.7 L50.1 77.4 L51.8 78 L53.6 78.5 L55.4 78.9 L57.2 79.1 L59 79.3 L60.9 79.3 L62.7 79.3 L64.5 79.1 L66.3 78.9 L68.1 78.5 L69.9 78 L71.7 77.5 L73.4 76.8 L75 76 L76.7 75.1 L78.2 74.2 L79.7 73.1 L81.2 72M81.2 72 L81.4 70.2 L81.6 68.4 L81.6 66.5 L81.6 64.7 L81.4 62.8 L81.1 61 L80.8 59.2 L80.3 57.5 L79.7 55.7 L79 54 L78.2 52.3 L77.4 50.7 L76.4 49.2 L75.3 47.7 L74.2 46.2 L73 44.9 L71.7 43.6 L70.3 42.3 L68.9 41.2 L67.4 40.1 L65.8 39.2 L64.2 38.3 L62.5 37.5 L60.8 36.9 L59.1 36.3 L57.3 35.8 L55.5 35.4 L53.7 35.2 L51.8 35 L50 35 L48.2 35 L46.3 35.2 L44.5 35.4 L42.7 35.8 L40.9 36.3 L39.2 36.9 L37.5 37.5 L35.8 38.3 L34.2 39.2 L32.6 40.1 L31.1 41.2 L29.7 42.3 L28.3 43.6 L27 44.9 L25.8 46.2 L24.7 47.7 L23.6 49.2 L22.6 50.7 L21.8 52.3 L21 54 L20.3 55.7 L19.7 57.5 L19.2 59.2 L18.9 61 L18.6 62.8 L18.4 64.7 L18.4 66.5 L18.4 68.4 L18.6 70.2 L18.8 72M18.8 72 L20.3 73.1 L21.8 74.2 L23.3 75.1 L25 76 L26.6 76.8 L28.3 77.5 L30.1 78 L31.9 78.5 L33.7 78.9 L35.5 79.1 L37.3 79.3 L39.1 79.3 L41 79.3 L42.8 79.1 L44.6 78.9 L46.4 78.5 L48.2 78 L49.9 77.4 L51.7 76.7 L53.3 76 L54.9 75.1 L56.5 74.1 L58 73.1 L59.4 71.9 L60.8 70.7 L62.1 69.4 L63.3 68 L64.5 66.6 L65.5 65.1 L66.5 63.5 L67.4 61.9 L68.1 60.2 L68.8 58.5 L69.4 56.8 L69.9 55 L70.2 53.2 L70.5 51.4 L70.7 49.6 L70.7 47.7 L70.7 45.9 L70.5 44.1 L70.3 42.2 L69.9 40.4 L69.4 38.7 L68.8 36.9 L68.2 35.2 L67.4 33.5 L66.5 31.9 L65.6 30.4 L64.5 28.9 L63.4 27.4 L62.2 26 L60.9 24.7 L59.5 23.5 L58 22.4 L56.5 21.3 L55 20.3 L53.4 19.5 L51.7 18.7 L50 18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>" },
    { id: "triskele", name: "Triskele", fact: "A triple spiral. Spirals like this are carved at Newgrange in County Meath, a tomb over 5,000 years old, which makes it older than the pyramids of Egypt.",
      svg: "<path d=\"M49.4 28.2 L49.4 28 L49.5 27.7 L49.6 27.5 L49.8 27.2 L50 27 L50.3 26.8 L50.6 26.7 L50.9 26.6 L51.3 26.6 L51.7 26.6 L52.2 26.7 L52.6 26.9 L53 27.1 L53.4 27.4 L53.7 27.8 L54 28.2 L54.3 28.7 L54.5 29.3 L54.6 29.9 L54.7 30.5 L54.6 31.2 L54.5 31.8 L54.2 32.5 L53.9 33.1 L53.4 33.7 L52.9 34.3 L52.3 34.8 L51.6 35.3 L50.8 35.6 L50 35.8 L49.1 36 L48.2 36 L47.3 35.9 L46.3 35.7 L45.4 35.3 L44.5 34.8 L43.7 34.2 L42.9 33.5 L42.2 32.7 L41.6 31.7 L41.2 30.7 L40.8 29.6 L40.6 28.4 L40.6 27.2 L40.7 26 L41 24.8 L41.4 23.6 L42 22.4 L42.8 21.3 L43.7 20.3 L44.7 19.4 L45.9 18.7 L47.2 18 L48.6 17.6 L50 17.3 L51.5 17.2 L53 17.3 L54.5 17.6 L56 18.1 L57.5 18.7 L58.8 19.6 L60.1 20.7 L61.2 21.9 L62.2 23.3 L63 24.8 L63.6 26.4 L64 28.1 L64.2 29.9 L64.2 31.7 L63.9 33.5 L63.4 35.3 L62.7 37.1 L61.7 38.7 L60.6 40.2 L59.2 41.6 L57.6 42.8 L55.9 43.9 L54 44.7 L52.1 45.3 L50 45.6 L50 50M69.2 60.4 L69.4 60.5 L69.6 60.7 L69.7 60.9 L69.8 61.2 L69.9 61.5 L69.9 61.8 L69.9 62.2 L69.8 62.5 L69.6 62.9 L69.4 63.2 L69.1 63.5 L68.7 63.8 L68.3 64 L67.9 64.2 L67.4 64.3 L66.8 64.4 L66.3 64.4 L65.7 64.3 L65.1 64.1 L64.5 63.8 L64 63.4 L63.5 62.9 L63.1 62.4 L62.7 61.8 L62.3 61.1 L62.1 60.4 L62 59.6 L62 58.8 L62.1 57.9 L62.3 57.1 L62.6 56.2 L63 55.4 L63.6 54.7 L64.2 54 L65 53.4 L65.9 52.8 L66.8 52.4 L67.8 52.1 L68.9 51.9 L70 51.9 L71.1 52 L72.3 52.3 L73.4 52.7 L74.4 53.3 L75.4 54 L76.4 54.8 L77.2 55.8 L77.9 56.9 L78.5 58.1 L78.9 59.4 L79.1 60.7 L79.2 62.1 L79.1 63.5 L78.8 65 L78.3 66.4 L77.7 67.7 L76.8 69 L75.8 70.1 L74.7 71.2 L73.3 72.1 L71.9 72.8 L70.4 73.4 L68.7 73.8 L67.1 73.9 L65.3 73.9 L63.6 73.6 L61.9 73.1 L60.3 72.4 L58.8 71.4 L57.3 70.3 L56 69 L54.9 67.5 L53.9 65.8 L53.2 64 L52.7 62.1 L52.4 60.2 L52.4 58.2 L52.6 56.1 L53.1 54.1 L53.8 52.2 L50 50M31.4 61.4 L31.2 61.5 L31 61.6 L30.7 61.6 L30.4 61.6 L30.1 61.5 L29.8 61.3 L29.5 61.1 L29.3 60.9 L29.1 60.6 L28.9 60.2 L28.8 59.8 L28.7 59.3 L28.7 58.9 L28.8 58.4 L28.9 57.9 L29.1 57.4 L29.4 56.9 L29.8 56.5 L30.3 56.1 L30.8 55.7 L31.4 55.4 L32 55.2 L32.7 55.1 L33.5 55.1 L34.2 55.1 L35 55.3 L35.7 55.6 L36.4 56 L37.1 56.5 L37.7 57.1 L38.3 57.8 L38.8 58.6 L39.2 59.4 L39.4 60.3 L39.6 61.3 L39.6 62.3 L39.5 63.4 L39.3 64.4 L38.9 65.4 L38.3 66.4 L37.7 67.3 L36.9 68.1 L36 68.9 L35 69.5 L33.8 70.1 L32.6 70.4 L31.4 70.6 L30.1 70.7 L28.8 70.6 L27.4 70.3 L26.1 69.9 L24.9 69.2 L23.7 68.4 L22.6 67.5 L21.7 66.4 L20.8 65.1 L20.2 63.8 L19.6 62.3 L19.3 60.8 L19.2 59.2 L19.3 57.6 L19.6 55.9 L20.1 54.4 L20.8 52.8 L21.7 51.4 L22.8 50 L24 48.8 L25.5 47.7 L27.1 46.9 L28.8 46.2 L30.6 45.7 L32.4 45.5 L34.4 45.5 L36.3 45.7 L38.2 46.2 L40 47 L41.8 48 L43.4 49.2 L44.9 50.6 L46.2 52.2 L50 50\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>" },
    { id: "brigid", name: "St Brigid's cross", fact: "Woven from rushes for St Brigid's Day on 1 February. Traditionally it's hung in the home to keep it safe from harm.",
      svg: "<path d=\"M40 6V62M44 6V62M48 6V62M52 38V94M56 38V94M60 38V94M6 52H62M6 56H62M6 60H62M38 40H94M38 44H94M38 48H94\" stroke=\"currentColor\" stroke-width=\"2.8\" fill=\"none\" stroke-linecap=\"round\"/><rect x=\"37\" y=\"37\" width=\"26\" height=\"26\" rx=\"2\" fill=\"currentColor\"/><path d=\"M37 16h14M49 84h14M16 49v14M84 37v14\" stroke=\"currentColor\" stroke-width=\"4.5\" stroke-linecap=\"round\"/>" },
    { id: "tree", name: "Tree of life", fact: "In Irish it's Crann Bethadh. The branches and roots join in a circle, and traditionally it stands for strength, long life and the link between earth and sky.",
      svg: "<circle cx=\"50\" cy=\"50\" r=\"43\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"5\"/><path d=\"M50 46Q36.2 38.2 10.5 35.6M50 46Q39.6 26.7 20.3 20.3M50 46Q45 19.4 35.6 10.5M50 46Q50 17.5 50 8M50 46Q55 19.4 64.4 10.5M50 46Q60.4 26.7 79.7 20.3M50 46Q63.8 38.2 89.5 35.6M50 64Q36.2 64.3 10.5 64.4M50 64Q39.6 75 20.3 79.7M50 64Q45 81.8 35.6 89.5M50 64Q50 83.6 50 92M50 64Q55 81.8 64.4 89.5M50 64Q60.4 75 79.7 79.7M50 64Q63.8 64.3 89.5 64.4\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3.2\" stroke-linecap=\"round\"/><path d=\"M46 66V44h8v22z\" fill=\"currentColor\"/>" },
    { id: "claddagh", name: "Claddagh", fact: "Named after a fishing village in Galway. The heart stands for love, the hands for friendship and the crown for loyalty.",
      svg: "<path d=\"M14 92C6 70 8 54 16 44M86 92C94 70 92 54 84 44\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"7\" stroke-linecap=\"round\"/><path d=\"M50 80C34 68 24 58 24 46C24 37 31 31 38 31C44 31 48 35 50 39C52 35 56 31 62 31C69 31 76 37 76 46C76 58 66 68 50 80Z\" fill=\"currentColor\"/><path d=\"M34 28L32 12L42 20L50 8L58 20L68 12L66 28Z\" fill=\"currentColor\"/><path d=\"M16 44C20 38 26 40 26 48C26 58 32 66 40 70M84 44C80 38 74 40 74 48C74 58 68 66 60 70\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"6\" stroke-linecap=\"round\" class=\"bg-stroke\"/><path d=\"M10 62h12M78 62h12\" stroke=\"currentColor\" stroke-width=\"4\" stroke-linecap=\"round\"/>" },
    { id: "knot", name: "Celtic knot", fact: "The lines weave over and under with no start and no end, so it's traditionally a sign of eternity. Knots like these fill the Book of Kells and lots of solo dresses.",
      svg: "<g fill=\"none\" stroke-width=\"5\"><circle cx=\"70\" cy=\"50\" r=\"18\" class=\"kn\"/><circle cx=\"50\" cy=\"70\" r=\"18\" class=\"kn\"/><circle cx=\"30\" cy=\"50\" r=\"18\" class=\"kn\"/><circle cx=\"50\" cy=\"30\" r=\"18\" class=\"kn\"/><rect x=\"29\" y=\"29\" width=\"42\" height=\"42\" transform=\"rotate(45 50 50)\" class=\"kn\"/></g>" }
  ];
  const KEY = "pid.symbols";

  const ls = {
    load() { try { return Object.assign({ best: 0, played: 0 }, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { return { best: 0, played: 0 }; } },
    save(N) { try { localStorage.setItem(KEY, JSON.stringify(N)); } catch (e) { /* still playable */ } }
  };
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pic = (s, cls) => `<svg class="${cls}" viewBox="0 0 100 100" role="img" aria-label="An Irish symbol">${s.svg}</svg>`;

  window.PID_SYMBOLS = function (A) {
    const { esc } = A;
    const TOTAL = SYMBOLS.length;
    let N = ls.load();
    let game = null; // { order, opts, round, score, answered, picks }

    function newGame() {
      const idx = SYMBOLS.map((_, i) => i);
      const order = shuffle(idx.slice());
      const opts = order.map((w) => shuffle([w, ...shuffle(idx.filter((i) => i !== w)).slice(0, 3)]));
      game = { order, opts, round: 0, score: 0, answered: false, picks: [] };
    }

    function screen() {
      N = ls.load();
      const head = { title: "Irish symbols", tab: "home", back: true };
      if (!game) {
        return Object.assign(head, { html: `
          <section class="card nd-intro">
            <div class="sy-row" aria-hidden="true">${[0, 3, 5].map((i) => pic(SYMBOLS[i], "sy-mini")).join("")}</div>
            <h3>Do you know your Irish symbols?</h3>
            <p class="muted">You'll see ${TOTAL} symbols, from the harp to the Claddagh. Pick the name of each one and learn what it means. Lots of them turn up on solo dresses!</p>
            <button type="button" class="btn block" data-sy-start>Start</button>
            ${N.best ? `<p class="small muted" style="margin:10px 0 0">Your best: ${N.best} of ${TOTAL}</p>` : ""}
          </section>` });
      }
      if (game.round >= TOTAL) {
        const sc = game.score;
        return Object.assign(head, { html: `
          <section class="card tq-done">
            <div class="tq-big">${sc === TOTAL ? "☘️☘️☘️" : sc >= 6 ? "☘️☘️" : "☘️"}</div>
            <h3>${sc} of ${TOTAL} symbols right</h3>
            <p class="muted">${sc === TOTAL ? "Perfect! You know them all." : sc >= 6 ? "Great job! You've got a sharp eye." : "Have another go. They'll be easy to spot on dresses soon."}</p>
            <p class="small">Your best: ${Math.max(N.best, sc)} of ${TOTAL}</p>
            <button type="button" class="btn block" data-sy-start>Play again</button>
          </section>
          <h3 class="tq-review-h">All the symbols</h3>
          ${SYMBOLS.map((s) => `<div class="card tq-review sy-review">${pic(s, "sy-mini")}<div><strong>${esc(s.name)}</strong><div class="small muted">${esc(s.fact)}</div></div></div>`).join("")}` });
      }
      const s = SYMBOLS[game.order[game.round]];
      return Object.assign(head, { html: `
        <div class="row between ws-stats small"><span>Symbol ${game.round + 1} of ${TOTAL}</span><span>${game.score} right</span></div>
        <div class="tq-dots">${game.order.map((_, i) => `<i class="${i < game.round ? (game.picks[i] ? "ok" : "no") : i === game.round ? "now" : ""}"></i>`).join("")}</div>
        <section class="card sy-card">${pic(s, "sy-big")}</section>
        <p class="small muted" style="text-align:center;margin:4px 0 10px">What is this symbol called?</p>
        <div class="stack">${game.opts[game.round].map((k) => `<button type="button" class="btn ghost block tq-opt" data-sy="${k}" ${game.answered ? "disabled" : ""}>${esc(SYMBOLS[k].name)}</button>`).join("")}</div>
        <div id="syWhy" class="tq-why" hidden></div>` });
    }

    function answer(k) {
      if (!game || game.answered) return;
      const right = game.order[game.round];
      const ok = k === right;
      game.answered = true; game.picks[game.round] = ok; if (ok) game.score++;
      document.querySelectorAll("[data-sy]").forEach((b) => { const v = Number(b.dataset.sy); b.disabled = true; if (v === right) b.classList.add("right"); else if (v === k) b.classList.add("wrong"); });
      const s = SYMBOLS[right];
      const why = document.getElementById("syWhy"); why.hidden = false;
      const last = game.round + 1 >= TOTAL;
      why.innerHTML = `<p><strong>${ok ? "Yes! 😀" : `It's the ${esc(s.name)}.`}</strong> ${esc(s.fact)}</p><button type="button" class="btn block" data-sy-next>${last ? "See my score" : "Next symbol"}</button>`;
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
        if (game.score === TOTAL && window.PID_CELEBRATE) setTimeout(() => window.PID_CELEBRATE("Perfect!", `All ${TOTAL} Irish symbols named. ☘️`, { shamrocks: true }), 300);
        else if (newBest && N.played > 1) A.toast(`New best: ${game.score} of ${TOTAL}`);
      }
      A.rerender();
      try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }
    }

    document.getElementById("app").addEventListener("click", (e) => {
      const t = e.target.closest("[data-sy-start], [data-sy], [data-sy-next]"); if (!t) return;
      if (t.dataset.syStart !== undefined) { newGame(); A.rerender(); return; }
      if (t.dataset.sy !== undefined) { answer(Number(t.dataset.sy)); return; }
      if (t.dataset.syNext !== undefined) next();
    });
    window.addEventListener("hashchange", () => { if (!/^#\/games\/symbols/.test(location.hash)) game = null; });
    window.PID_SYMBOLS.current = () => game; // for tests

    return {
      screen,
      status() { N = ls.load(); return N.best ? `Best: ${N.best} of ${TOTAL}` : `${TOTAL} symbols to spot`; }
    };
  };
})();
