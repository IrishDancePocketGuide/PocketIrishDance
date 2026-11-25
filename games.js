/* Games: boredom busters for the long waits at a feis.
   The daily word search is made from today's date, so everyone gets the same puzzle,
   it changes at midnight, and it works offline. Progress stays on this phone. */
(function () {
  "use strict";

  // Words to find. "w" is what goes in the grid (letters only); "t" is the hint shown once found.
  const WORDS = [
    { w: "Feis", t: "A local Irish dance competition, usually one day." },
    { w: "Feiseanna", t: "More than one feis." },
    { w: "Oireachtas", t: "The big regional championship, once a year." },
    { w: "Nationals", t: "A national championship, like North American Nationals." },
    { w: "Worlds", t: "The World Championships." },
    { w: "Reel", t: "A fast soft shoe dance, often the first one a dancer learns." },
    { w: "Light jig", t: "A quick, light soft shoe dance." },
    { w: "Slip jig", t: "A graceful soft shoe dance in 9/8 time." },
    { w: "Single jig", t: "A bouncy soft shoe dance." },
    { w: "Treble jig", t: "A slower hard shoe dance, full of beats." },
    { w: "Hornpipe", t: "A hard shoe dance with a strong rhythm." },
    { w: "Set dance", t: "A hard shoe dance to its own special tune." },
    { w: "Trad set", t: "A traditional set dance, everyone dances the same steps." },
    { w: "Ceili", t: "A group dance, or a social dance night." },
    { w: "Figure", t: "A figure dance is a group dance for a team." },
    { w: "Ghillies", t: "Soft shoes that lace up, worn by girls." },
    { w: "Reel shoes", t: "Soft shoes worn by boys, with a heel that clicks." },
    { w: "Hard shoe", t: "Shoes with tips and heels that make the beats." },
    { w: "Soft shoe", t: "Light, quiet shoes for reels and jigs." },
    { w: "Steps", t: "The pieces of a dance a dancer learns." },
    { w: "Stage", t: "Where dancers perform at a feis." },
    { w: "Wig", t: "The curly wig many solo dancers wear." },
    { w: "Curls", t: "Bouncy curls, real or from a wig." },
    { w: "Tiara", t: "A sparkly headpiece some dancers wear." },
    { w: "Sock glue", t: "Keeps poodle socks from slipping down." },
    { w: "Socks", t: "Poodle socks are the white, bumpy ones." },
    { w: "Solo dress", t: "A dancer's own sparkly competition dress." },
    { w: "Costume", t: "School costume: the dress every dancer in a school wears." },
    { w: "Tan", t: "Fake tan some dancers wear on stage." },
    { w: "Number", t: "The competitor number pinned on for each feis." },
    { w: "Recall", t: "In championships, being called back to dance another round." },
    { w: "Medal", t: "A prize for placing well." },
    { w: "Trophy", t: "A big prize for a top placing." },
    { w: "Sash", t: "A ribbon worn across the body for a big win." },
    { w: "Judge", t: "Also called an adjudicator. They place the dancers." },
    { w: "Results", t: "The placings posted after each competition." },
    { w: "Placing", t: "Where your dancer finished, like 1st or 3rd." },
    { w: "Grades", t: "All the levels below championship." },
    { w: "Novice", t: "A grade level, after Beginner." },
    { w: "Prelim", t: "Preliminary Championship, the first championship level." },
    { w: "Open", t: "Open Championship, the top level." },
    { w: "Champs", t: "Short for championships." },
    { w: "TCRG", t: "A qualified Irish dance teacher." },
    { w: "ADCRG", t: "A qualified Irish dance judge." },
    { w: "Teacher", t: "The person who teaches the steps." },
    { w: "Class", t: "Where dancers practise each week." },
    { w: "Practice", t: "What makes the steps better!" },
    { w: "Musician", t: "Plays the tunes for the dancers." },
    { w: "Fiddle", t: "A violin, a classic Irish dance instrument." },
    { w: "Accordion", t: "A squeezebox, often heard at a feis." },
    { w: "Tune", t: "The music a dance is danced to." },
    { w: "Beats", t: "The sounds hard shoes make." },
    { w: "Click", t: "Clicking heels together in the air." },
    { w: "Leap", t: "A big jump across the stage." },
    { w: "Bicycle", t: "A move where the legs pedal in the air." },
    { w: "Turnout", t: "Feet and knees turned out, a key part of good technique." },
    { w: "Toes", t: "Dancers dance up on their toes." },
    { w: "Point", t: "Pointed toes are a must!" },
    { w: "Bow", t: "Dancers bow to the judge before and after." },
    { w: "Shamrock", t: "The three-leaf clover of Ireland." },
    { w: "Celtic", t: "Celtic knots are often on dresses." },
    { w: "Ireland", t: "Where Irish dance comes from." },
    { w: "Rince", t: "The Irish word for dance (say RIN-kuh)." },
    { w: "Rhythm", t: "Keeping in time with the music." },
    { w: "Warm up", t: "Get those muscles ready before dancing!" },
    { w: "Stretch", t: "Keeps dancers flexible and safe." },
    { w: "Snack", t: "Every feis bag needs one." },
    { w: "Feis bag", t: "The bag with shoes, socks, glue and snacks." }
  ].map((x) => ({ w: x.w.toUpperCase().replace(/[^A-Z]/g, ""), label: x.w, t: x.t }));

  const LEVELS = {
    easy: { name: "Easy", size: 10, count: 8, dirs: [[1, 0], [0, 1], [1, 1]], note: "Words go across, down or diagonally." },
    tricky: { name: "Tricky", size: 12, count: 10, dirs: [[1, 0], [0, 1], [1, 1], [1, -1], [-1, 0], [0, -1], [-1, -1], [-1, 1]], note: "Words can go any direction, even backwards." }
  };
  // Feis day bingo: kind, fun things to spot at a feis. "e" is the picture, "t" the words on the square.
  const BINGO = [
    ["💎", "Found a loose gem"], ["🌈", "A rainbow dress"], ["👔", "A boy in a blue tie"], ["🥇", "Someone wearing a medal"],
    ["🏆", "A giant trophy"], ["🧦", "Socks slipping down"], ["🧴", "Sock glue in action"], ["👞", "Clicks in the hallway"],
    ["🎻", "A fiddle player"], ["🪗", "An accordion player"], ["7️⃣", "A competitor number with a 7"], ["0️⃣", "A number ending in 0"],
    ["💇", "A wig being brushed"], ["👑", "A sparkly tiara"], ["👯", "Matching school costumes"], ["💗", "A pink dress"],
    ["💜", "A purple dress"], ["💙", "A blue dress"], ["💚", "A green dress"], ["❤️", "A red dress"],
    ["🖤", "A black dress with sparkles"], ["🦋", "A dress with butterflies"], ["🌟", "A dress with stars"], ["🍀", "A shamrock on something"],
    ["🇮🇪", "An Irish flag"], ["☕", "A parent holding two coffees"], ["🥨", "A dancer eating a snack"], ["😴", "A dancer napping on a chair"],
    ["🧘", "A dancer stretching"], ["🦶", "Steps in the hallway"], ["🎀", "A big hair bow"], ["🪞", "A dancer checking the mirror"],
    ["🧳", "A rolling dress bag"], ["📋", "Results posted on the wall"], ["📣", "Stage numbers called"], ["🤞", "Wishing someone luck"],
    ["🫶", "A friendly hug"], ["🎉", "Someone cheering loudly"], ["📸", "A family photo with a medal"], ["🧒", "A tiny first-feis dancer"],
    ["👦", "A boy dancing"], ["🩰", "Ghillies being laced up"], ["🧥", "A dance school jacket"], ["🍀", "A lucky charm"],
    ["🎟️", "A raffle table"], ["🛍️", "A dance shop stall"], ["🎵", "A hornpipe playing"], ["🎶", "A reel playing"],
    ["💧", "A water bottle refill"], ["🧸", "A teddy or mascot"], ["🎒", "A huge feis bag"], ["🙇", "A dancer bowing"],
    ["🎗️", "A winner's sash"], ["💐", "Flowers for a dancer"], ["🍪", "A bake sale"], ["⏰", "A stage running late"],
    ["🩹", "Tape on a hard shoe"], ["🌀", "Curls bouncing"], ["😊", "A dancer smiling on stage"], ["🙌", "A teacher giving a high five"],
    ["👚", "A mom in a feis mom shirt"], ["👕", "A dad in a feis dad shirt"], ["🏈", "A sports team blanket"], ["👠", "A teacher in high heels"]
  ].map(([e, t]) => ({ e, t }));
  const KEY = "pid.games";
  const FILL = "ABCDEFGHIJKLMNOPRSTUWY"; // filler letters (skips Q, V, X, Z so it looks less random)

  // ---------- small helpers ----------
  const fresh = () => ({ ws: {}, bingo: {}, streak: { last: "", count: 0, best: 0 }, level: "easy" });
  function load() { try { return Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { return fresh(); } }
  function store(G) {
    const keys = Object.keys(G.ws).sort(); // keep the last 20 puzzles only
    while (keys.length > 20) delete G.ws[keys.shift()];
    const bk = Object.keys(G.bingo || {}).sort(); // and the last 7 bingo cards
    while (bk.length > 7) delete G.bingo[bk.shift()];
    try { localStorage.setItem(KEY, JSON.stringify(G)); } catch (e) { /* private mode: still playable */ }
  }
  function localDate(offsetDays) { const d = new Date(); d.setDate(d.getDate() + (offsetDays || 0)); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); }
  function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const mmss = (s) => Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0");

  // ---------- puzzle maker ----------
  function makePuzzle(seedText, levelId) {
    const L = LEVELS[levelId] || LEVELS.easy;
    const r = rng(hash(seedText + "|" + levelId));
    const n = L.size;
    const pool = WORDS.filter((x) => x.w.length <= n).slice();
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    const grid = Array.from({ length: n }, () => Array(n).fill(""));
    const placed = [];
    for (const word of pool) {
      if (placed.length >= L.count) break;
      if (placed.some((p) => p.w.includes(word.w) || word.w.includes(p.w))) continue; // no word hiding inside another
      for (let tries = 0; tries < 80; tries++) {
        const [dx, dy] = L.dirs[Math.floor(r() * L.dirs.length)];
        const len = word.w.length;
        const x0 = Math.floor(r() * n), y0 = Math.floor(r() * n);
        const x1 = x0 + dx * (len - 1), y1 = y0 + dy * (len - 1);
        if (x1 < 0 || x1 >= n || y1 < 0 || y1 >= n) continue;
        let ok = true;
        for (let i = 0; i < len && ok; i++) { const c = grid[y0 + dy * i][x0 + dx * i]; if (c && c !== word.w[i]) ok = false; }
        if (!ok) continue;
        const cells = [];
        for (let i = 0; i < len; i++) { grid[y0 + dy * i][x0 + dx * i] = word.w[i]; cells.push((y0 + dy * i) * n + (x0 + dx * i)); }
        placed.push(Object.assign({ cells }, word));
        break;
      }
    }
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!grid[y][x]) grid[y][x] = FILL[Math.floor(r() * FILL.length)];
    placed.sort((a, b) => a.label.localeCompare(b.label));
    return { n, letters: grid.flat(), words: placed, level: levelId };
  }

  // 5 x 5 card, the middle square is free. The seed mixes today's date with this phone's id.
  function makeCard(seedText) {
    const r = rng(hash("bingo|" + seedText));
    const pool = BINGO.slice();
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    const squares = pool.slice(0, 24);
    squares.splice(12, 0, { e: "☘️", t: "Free: you made it to the feis!", free: true });
    return squares;
  }
  const LINES = (() => {
    const L = [];
    for (let i = 0; i < 5; i++) { L.push([0, 1, 2, 3, 4].map((k) => i * 5 + k)); L.push([0, 1, 2, 3, 4].map((k) => k * 5 + i)); }
    L.push([0, 6, 12, 18, 24], [4, 8, 12, 16, 20]);
    return L;
  })();

  window.PID_GAMES = function (A) {
    const { ext, esc, toast } = A;
    let G = load();
    const RT = window.PID_RHYTHM ? window.PID_RHYTHM(A) : null; // rhythm.js
    const TQ = window.PID_TRIVIA ? window.PID_TRIVIA(A) : null; // trivia.js
    const ND = window.PID_NAMEDANCE ? window.PID_NAMEDANCE(A) : null; // namedance.js
    const GW = window.PID_GAELIC ? window.PID_GAELIC(A) : null; // gaelic.js
    const SY = window.PID_SYMBOLS ? window.PID_SYMBOLS(A) : null; // symbols.js
    const CM = window.PID_COUNTIES ? window.PID_COUNTIES(A) : null; // counties.js
    let timer = null;

    function puzzleKey(kind, level) { return kind === "bonus" ? "bonus-" + level : localDate() + "-" + level; }
    function progressFor(key) { return G.ws[key] || null; }

    // ---------- hub ----------
    function hub() {
      const lv = G.level in LEVELS ? G.level : "easy";
      const p = progressFor(puzzleKey("daily", lv));
      const total = LEVELS[lv].count;
      const status = !p ? "A new puzzle is ready" : p.done ? `Solved in ${mmss(p.secs)} ✓` : `${p.found.length} of ${total} words found`;
      const st = G.streak || {};
      const streakOn = st.count && (st.last === localDate() || st.last === localDate(-1));
      return {
        title: "Games", tab: "home", back: true,
        html: `
        <section class="hero">
          <h2>Boredom busters</h2>
          <p>Quick games for the long waits between dances. They work without signal, too.</p>
        </section>
        ${GW ? `<a class="card game-card" href="#/games/gaelic">
          <span class="ico" aria-hidden="true">☘️</span>
          <span class="game-body"><strong>Learning Irish</strong>
            <span class="small muted">Word flashcards: see a word in Irish (Gaeilge) and pick what it means</span>
            <span class="small game-status">${esc(GW.status())}</span></span>
          <span class="btn sm">Play</span>
        </a>` : ""}
        ${SY ? `<a class="card game-card" href="#/games/symbols">
          <span class="ico" aria-hidden="true">🍀</span>
          <span class="game-body"><strong>Irish symbols</strong>
            <span class="small muted">Name the harp, Claddagh, trinity knot and more</span>
            <span class="small game-status">${esc(SY.status())}</span></span>
          <span class="btn sm">Play</span>
        </a>` : ""}
        ${CM ? `<a class="card game-card" href="#/games/counties">
          <span class="ico" aria-hidden="true">🗺️</span>
          <span class="game-body"><strong>Irish counties</strong>
            <span class="small muted">Find the county on the map, or pick its province</span>
            <span class="small game-status">${esc(CM.status())}</span></span>
          <span class="btn sm">Play</span>
        </a>` : ""}
        ${TQ ? `<a class="card game-card" href="#/games/trivia">
          <span class="ico" aria-hidden="true">❓</span>
          <span class="game-body"><strong>Daily feis trivia</strong>
            <span class="small muted">5 Irish dance questions a day. Keep your streak going!</span>
            <span class="small game-status">${esc(TQ.status())}${TQ.streak() ? ` · 🔥 ${TQ.streak()}` : ""}</span></span>
          <span class="btn sm">Play</span>
        </a>` : ""}
        <a class="card game-card" href="#/games/wordsearch">
          <span class="ico" aria-hidden="true">🔎</span>
          <span class="game-body"><strong>Daily word search</strong>
            <span class="small muted">Irish dance words, a new puzzle every day</span>
            <span class="small game-status">${esc(status)}</span></span>
          <span class="btn sm">${p && p.done ? "View" : p ? "Keep going" : "Play"}</span>
        </a>
        <a class="card game-card" href="#/games/bingo">
          <span class="ico" aria-hidden="true">🎯</span>
          <span class="game-body"><strong>Feis day bingo</strong>
            <span class="small muted">Spot things around the feis and race your friends. A new card every day</span>
            <span class="small game-status">${esc(bingoStatus())}</span></span>
          <span class="btn sm">${(G.bingo[localDate()] || {}).marks ? "Keep going" : "Play"}</span>
        </a>
        ${RT ? `<a class="card game-card" href="#/games/rhythm">
          <span class="ico" aria-hidden="true">🥁</span>
          <span class="game-body"><strong>Rhythm tap</strong>
            <span class="small muted">Tap on the beat of a reel, jig, slip jig or hornpipe</span>
            <span class="small game-status">${esc(RT.bestText())}</span></span>
          <span class="btn sm">Play</span>
        </a>` : ""}
        ${ND ? `<a class="card game-card" href="#/games/namedance">
          <span class="ico" aria-hidden="true">🎶</span>
          <span class="game-body"><strong>Name that dance</strong>
            <span class="small muted">Hear a tune and guess: reel, jig, slip jig or hornpipe?</span>
            <span class="small game-status">${esc(ND.status())}</span></span>
          <span class="btn sm">Play</span>
        </a>` : ""}
        ${streakOn ? `<p class="small muted" style="text-align:center">🔥 ${st.count} day${st.count === 1 ? "" : "s"} in a row${st.best > st.count ? ` · best ${st.best}` : ""}</p>` : ""}
        <div class="card" style="text-align:center">
          <p class="small muted" style="margin:0">More games are on the way. Got an idea for one? Tell us in Settings, Help and feedback.</p>
        </div>`
      };
    }

    // ---------- feis day bingo ----------
    function bingoState() { const d = localDate(); return G.bingo[d] || (G.bingo[d] = { marks: [], lines: 0 }); }
    function linesDone(marks) { const m = new Set(marks.concat(12)); return LINES.filter((l) => l.every((i) => m.has(i))).length; }
    function bingoStatus() {
      const b = G.bingo[localDate()];
      if (!b || !b.marks.length) return "Today's card is ready";
      const n = linesDone(b.marks);
      return b.marks.length >= 24 ? "Full card! ✓" : n ? `Bingo! ${n} line${n === 1 ? "" : "s"} ✓` : `${b.marks.length} spotted`;
    }
    // Each phone gets its own card (so families can race each other), still new every day.
    function deviceId() { if (!G.dev) { G.dev = Math.random().toString(36).slice(2, 10); store(G); } return G.dev; }
    function bingo() {
      const card = makeCard(localDate() + "|" + deviceId());
      const cardNo = 1000 + (hash(localDate() + deviceId()) % 9000);
      const b = bingoState();
      const dateLabel = new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
      const sq = card.map((c, i) => `<button type="button" class="bingo-sq${c.free || b.marks.includes(i) ? " on" : ""}${c.free ? " free" : ""}" data-bingo="${i}" aria-pressed="${c.free || b.marks.includes(i)}"${c.free ? " disabled" : ""}><span class="bingo-e" aria-hidden="true">${c.e}</span><span class="bingo-t">${esc(c.t)}</span></button>`).join("");
      return {
        title: "Feis day bingo", tab: "home", back: true,
        html: `
        <div class="row between ws-top">
          <div><strong>${esc(dateLabel)}</strong><div class="small muted ws-note">Spot it at the feis, then tap the square. Everyone's card is different, so race your friends to 5 in a row!</div></div>
          <span class="chip">Card ${cardNo}</span>
        </div>
        <div class="row between ws-stats small"><span id="bingoCount">${esc(bingoStatus())}</span><span>A new card every day</span></div>
        <div class="bingo-grid" id="bingoGrid">${sq}</div>
        <p class="small muted ws-help">Tapped one by mistake? Tap it again to clear it.</p>
        ${b.marks.length ? `<button class="btn ghost block" type="button" data-bingo-clear>Clear my card</button>` : ""}`
      };
    }
    function tapBingo(i) {
      const b = bingoState();
      const before = linesDone(b.marks);
      if (b.marks.includes(i)) b.marks = b.marks.filter((x) => x !== i); else b.marks.push(i);
      const after = linesDone(b.marks);
      store(G);
      const el = document.querySelector(`[data-bingo="${i}"]`);
      if (el) { const on = b.marks.includes(i); el.classList.toggle("on", on); el.setAttribute("aria-pressed", on); }
      const ct = document.getElementById("bingoCount"); if (ct) ct.textContent = bingoStatus();
      document.querySelectorAll(".bingo-sq.win").forEach((x) => x.classList.remove("win"));
      const m = new Set(b.marks.concat(12));
      LINES.filter((l) => l.every((k) => m.has(k))).forEach((l) => l.forEach((k) => { const x = document.querySelector(`[data-bingo="${k}"]`); if (x) x.classList.add("win"); }));
      if (navigator.vibrate) try { navigator.vibrate(15); } catch (e) { /* ignore */ }
      if (b.marks.length === 24 && !b.full) { b.full = true; store(G); if (window.PID_CELEBRATE) window.PID_CELEBRATE("Full card!", "You spotted everything on today's card. Feis day champion! 🏆"); }
      else if (after > before && after > (b.lines || 0)) {
        b.lines = after; store(G);
        if (window.PID_CELEBRATE) window.PID_CELEBRATE("Bingo!", after === 1 ? "Five in a row! Keep going for another line, or the whole card." : `That's ${after} lines! Can you fill the whole card?`);
      }
    }

    // ---------- word search ----------
    function wordsearch(kind) {
      const lv = G.level in LEVELS ? G.level : "easy";
      const key = puzzleKey(kind, lv);
      let prog = progressFor(key);
      let seed = kind === "bonus" ? (prog && prog.seed) || String(Date.now()) : localDate();
      if (!prog) { prog = { found: [], secs: 0, done: false, seed }; G.ws[key] = prog; store(G); }
      const P = makePuzzle(seed, lv);
      const n = P.n;
      const dateLabel = new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });

      const cellsHtml = P.letters.map((c, i) => `<div class="ws-cell" data-i="${i}">${c}</div>`).join("");
      const listHtml = P.words.map((w) => `<li data-w="${w.w}">${esc(w.label)}</li>`).join("");

      return {
        title: kind === "bonus" ? "Bonus word search" : "Daily word search", tab: "home", back: true,
        html: `
        <div class="row between wrap ws-top">
          <div><strong>${kind === "bonus" ? "Bonus puzzle" : esc(dateLabel)}</strong><div class="small muted ws-note">${esc(LEVELS[lv].note)}</div></div>
          <div class="pill-tabs" role="group" aria-label="Difficulty">${Object.keys(LEVELS).map((k) => `<button type="button" data-ws-level="${k}" class="${k === lv ? "on" : ""}">${LEVELS[k].name}</button>`).join("")}</div>
        </div>
        <ul class="ws-words" id="wsWords" aria-label="Words to find">${listHtml}</ul>
        <div class="row between ws-stats small"><span id="wsCount"></span><span id="wsTime" aria-label="Time"></span></div>
        <div class="ws-grid" id="wsGrid" style="--n:${n}" role="grid" aria-label="Word search letters">${cellsHtml}</div>
        <div class="card ws-hint" id="wsHint" hidden></div>
        <p class="small muted ws-help">Drag across a word, or tap its first letter and then its last.</p>
        <div class="stack" id="wsDone" ${prog.done ? "" : "hidden"}>
          <button class="btn block" type="button" data-ws-bonus>Play a bonus puzzle</button>
          ${kind === "bonus" ? `<a class="btn ghost block" href="#/games/wordsearch">Back to today's puzzle</a>` : `<p class="small muted" style="text-align:center;margin:0">A new daily puzzle arrives at midnight.</p>`}
        </div>`,
        after: () => wire(P, prog, key, kind)
      };
    }

    function wire(P, prog, key, kind) {
      const n = P.n;
      const gridEl = document.getElementById("wsGrid");
      const cells = Array.from(gridEl.children);
      const countEl = document.getElementById("wsCount"), timeEl = document.getElementById("wsTime");
      const hintEl = document.getElementById("wsHint");
      const byWord = {}; P.words.forEach((w, i) => { byWord[w.w] = Object.assign({ color: i % 6 }, w); });

      function paintFound(w) {
        const info = byWord[w]; if (!info) return;
        info.cells.forEach((i) => { cells[i].classList.add("found"); cells[i].dataset.c = info.color; });
        const li = document.querySelector(`#wsWords li[data-w="${w}"]`); if (li) li.classList.add("got");
      }
      prog.found = prog.found.filter((w) => byWord[w]);
      prog.found.forEach(paintFound);
      const showCount = () => { countEl.textContent = `${prog.found.length} of ${P.words.length} found`; };
      showCount();

      // Timer counts only while this page is open and the puzzle isn't finished.
      clearInterval(timer);
      const showTime = () => { timeEl.textContent = "⏱ " + mmss(prog.secs); };
      showTime();
      if (!prog.done) {
        timer = setInterval(() => {
          if (!document.body.contains(gridEl)) { clearInterval(timer); store(G); return; }
          if (document.hidden) return;
          prog.secs++; showTime();
          if (prog.secs % 10 === 0) store(G);
        }, 1000);
      }

      // ----- choosing letters -----
      let anchor = -1, cur = -1, dragging = false, moved = false;
      const xy = (i) => [i % n, Math.floor(i / n)];
      function line(a, b) {
        const [x0, y0] = xy(a), [x1, y1] = xy(b);
        const dx = Math.sign(x1 - x0), dy = Math.sign(y1 - y0);
        const len = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
        if (!(x0 === x1 || y0 === y1 || Math.abs(x1 - x0) === Math.abs(y1 - y0))) return null;
        const out = []; for (let k = 0; k <= len; k++) out.push((y0 + dy * k) * n + (x0 + dx * k));
        return out;
      }
      function highlight(list) { cells.forEach((c) => c.classList.remove("sel")); (list || []).forEach((i) => cells[i].classList.add("sel")); }
      function cellAt(e) { const el = document.elementFromPoint(e.clientX, e.clientY); return el && el.classList.contains("ws-cell") && gridEl.contains(el) ? Number(el.dataset.i) : -1; }
      function check(a, b) {
        const ln = line(a, b); highlight(null);
        if (!ln || ln.length < 2) return;
        const s = ln.map((i) => P.letters[i]).join("");
        const rev = s.split("").reverse().join("");
        const hit = P.words.find((w) => (w.w === s || w.w === rev) && sameCells(w.cells, ln));
        const anyHit = hit || P.words.find((w) => w.w === s || w.w === rev);
        if (!anyHit) { gridEl.classList.remove("nope"); void gridEl.offsetWidth; gridEl.classList.add("nope"); return; }
        if (prog.found.includes(anyHit.w)) { toast(`Already found ${anyHit.label}`); return; }
        prog.found.push(anyHit.w);
        if (!hit) byWord[anyHit.w].cells = ln; // found it somewhere else by chance: that counts too
        paintFound(anyHit.w); showCount();
        hintEl.hidden = false;
        hintEl.innerHTML = `<strong>${esc(anyHit.label)}</strong> <span class="muted">· ${esc(anyHit.t)}</span>`;
        if (navigator.vibrate) try { navigator.vibrate(20); } catch (e) { /* ignore */ }
        if (prog.found.length === P.words.length) finish();
        store(G);
      }
      function sameCells(a, b) { if (a.length !== b.length) return false; const sa = a.slice().sort().join(), sb = b.slice().sort().join(); return sa === sb; }

      function finish() {
        prog.done = true; clearInterval(timer); showTime();
        if (kind !== "bonus") {
          const st = G.streak || (G.streak = { last: "", count: 0, best: 0 });
          if (st.last !== localDate()) { st.count = st.last === localDate(-1) ? st.count + 1 : 1; st.last = localDate(); st.best = Math.max(st.best || 0, st.count); }
        }
        store(G);
        document.getElementById("wsDone").hidden = false;
        const st = G.streak;
        const line2 = `You found all ${P.words.length} words in ${mmss(prog.secs)}.` + (kind !== "bonus" && st.count > 1 ? ` That's ${st.count} days in a row! 🔥` : "");
        if (window.PID_CELEBRATE) window.PID_CELEBRATE("Puzzle solved!", line2); else toast(line2);
      }

      gridEl.addEventListener("pointerdown", (e) => {
        if (prog.done) return;
        const i = cellAt(e); if (i < 0) return;
        e.preventDefault();
        if (anchor >= 0 && !dragging && i !== anchor) { check(anchor, i); anchor = -1; return; } // second tap
        anchor = i; cur = i; dragging = true; moved = false; highlight([i]);
        try { gridEl.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      });
      gridEl.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        const i = cellAt(e); if (i < 0 || i === cur) return;
        cur = i; moved = true;
        const ln = line(anchor, cur); if (ln) highlight(ln);
      });
      const end = () => {
        if (!dragging) return; dragging = false;
        if (moved && cur !== anchor) { check(anchor, cur); anchor = -1; }
        else highlight([anchor]); // a tap: wait for the last letter
      };
      gridEl.addEventListener("pointerup", end);
      gridEl.addEventListener("pointercancel", () => { dragging = false; anchor = -1; highlight(null); });
    }

    // ---------- buttons ----------
    document.getElementById("app").addEventListener("click", (e) => {
      const t = e.target.closest("[data-ws-level], [data-ws-bonus], [data-bingo], [data-bingo-clear]"); if (!t) return;
      if (t.dataset.bingo !== undefined) { tapBingo(Number(t.dataset.bingo)); return; }
      if (t.dataset.bingoClear !== undefined) { if (!confirm("Clear all the squares on today's card?")) return; G.bingo[localDate()] = { marks: [], lines: 0 }; store(G); A.rerender(); return; }
      if (t.dataset.wsLevel) { G.level = t.dataset.wsLevel; store(G); A.rerender(); return; }
      if (t.dataset.wsBonus !== undefined) {
        const lv = G.level in LEVELS ? G.level : "easy";
        G.ws[puzzleKey("bonus", lv)] = { found: [], secs: 0, done: false, seed: String(Date.now()) };
        store(G);
        if (location.hash === "#/games/wordsearch/bonus") A.rerender(); else location.hash = "#/games/wordsearch/bonus";
      }
    });

    ext.games = (parts) => {
      G = load();
      if (parts[1] === "bingo") return bingo();
      if (parts[1] === "rhythm" && RT) return RT.screen();
      if (parts[1] === "trivia" && TQ) return TQ.screen();
      if (parts[1] === "namedance" && ND) return ND.screen();
      if (parts[1] === "gaelic" && GW) return GW.screen();
      if (parts[1] === "symbols" && SY) return SY.screen();
      if (parts[1] === "counties" && CM) return CM.screen();
      if (parts[1] === "wordsearch") return wordsearch(parts[2] === "bonus" ? "bonus" : "daily");
      return hub();
    };
  };

  window.PID_GAMES.makePuzzle = makePuzzle; // for tests
  window.PID_GAMES.makeCard = makeCard;
})();
