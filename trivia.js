/* Daily feis trivia: 5 questions a day about Irish dance, the same for everyone that day.
   Picked from the date, so it works offline. Answers and the streak stay on this phone. */
(function () {
  "use strict";

  // q = question, a = answers (the first one is right; they are shuffled on screen), why = shown after answering.
  const QUESTIONS = [
    { q: "What is a feis?", a: ["A local Irish dance competition", "A type of dance shoe", "A fast jig"], why: "A feis (say “fesh”) is a local Irish dance competition, usually one day." },
    { q: "What is the plural of feis?", a: ["Feiseanna", "Feises", "Feisi"], why: "One feis, two feiseanna (say “FESH-uh-nuh”)." },
    { q: "How do you say “feis”?", a: ["Fesh", "Fees", "Fays"], why: "It rhymes with “mesh”." },
    { q: "Which language does the word “feis” come from?", a: ["Irish", "French", "Latin"], why: "Lots of Irish dance words come from the Irish language." },
    { q: "Which shoes make the clicking and tapping sounds?", a: ["Hard shoes", "Ghillies", "Ballet slippers"], why: "Hard shoes have tips and heels that make the beats." },
    { q: "What are the lace-up soft shoes that girls wear called?", a: ["Ghillies", "Clogs", "Brogues"], why: "Ghillies are soft shoes with long laces that wrap around the foot." },
    { q: "What time signature is a slip jig?", a: ["9/8", "6/8", "4/4"], why: "A slip jig has three beats in every bar, written as 9/8." },
    { q: "What time signature is a light jig?", a: ["6/8", "9/8", "3/4"], why: "Jigs are in 6/8: two beats a bar, each split in three." },
    { q: "Which of these is a hard shoe dance?", a: ["Treble jig", "Slip jig", "Light jig"], why: "The treble jig is danced in hard shoes. Slip jigs and light jigs are soft shoe dances." },
    { q: "Which of these is a soft shoe dance?", a: ["Light jig", "Hornpipe", "Treble jig"], why: "The light jig is danced in soft shoes. Hornpipes and treble jigs are hard shoe dances." },
    { q: "Which of these is NOT a soft shoe dance?", a: ["Hornpipe", "Reel", "Slip jig"], why: "The hornpipe is a hard shoe dance." },
    { q: "What is the Oireachtas?", a: ["A big regional championship", "A dance move", "A type of costume"], why: "The Oireachtas (say “oh-ROCK-tus”) is the regional championship, held once a year." },
    { q: "What does TCRG mean?", a: ["A qualified Irish dance teacher", "A qualified judge", "A feis musician"], why: "TCRG is the teaching qualification. Judges are ADCRG." },
    { q: "What does ADCRG mean?", a: ["A qualified Irish dance judge", "A beginner dancer", "A dance school"], why: "An ADCRG is a qualified adjudicator, which means judge." },
    { q: "Who decides the placings at a feis?", a: ["Adjudicators (judges)", "The musicians", "The parents"], why: "Adjudicators watch each dancer and give the placings." },
    { q: "What is a set dance?", a: ["A hard shoe solo to its own special tune", "A group dance", "A warm-up"], why: "Each set dance has its own named tune, like “St. Patrick's Day”." },
    { q: "Which of these is a traditional set dance?", a: ["St. Patrick's Day", "The Grand March", "The Flying Feet"], why: "St. Patrick's Day is one of the traditional sets. Others include The Blackbird and Job of Journeywork." },
    { q: "Which traditional set dance has a bird in its name?", a: ["The Blackbird", "The Robin's Reel", "The Swan"], why: "The Blackbird is a well-known traditional set dance." },
    { q: "What does “trad set” stand for?", a: ["Traditional set dance", "Trading sets", "Training set"], why: "In a traditional set, everyone dances the same steps to the same tune." },
    { q: "What is a ceili dance?", a: ["A group dance", "A solo hard shoe dance", "A dance for judges only"], why: "Ceili (say “KAY-lee”) dances are social group dances." },
    { q: "Who dances a figure dance?", a: ["A team", "One dancer", "Only the teacher"], why: "Figure dances are team dances, often with 2, 3, 4 or 8 dancers." },
    { q: "What are poodle socks?", a: ["White, bumpy dance socks", "Socks with dogs on them", "Warm-up leg warmers"], why: "Poodle socks are the white, textured socks many dancers wear." },
    { q: "What is sock glue for?", a: ["Keeping socks from slipping down", "Fixing shoes", "Sticking on numbers"], why: "A little sock glue keeps poodle socks in place." },
    { q: "What do dancers do to the judges before and after they dance?", a: ["Bow", "Wave", "Clap"], why: "Bowing is a polite way to start and finish." },
    { q: "Where are dancers' arms during most solo dancing?", a: ["Straight down by their sides", "Up in the air", "On their hips"], why: "Still, straight arms are a classic part of Irish step dance." },
    { q: "What is “turnout”?", a: ["Feet and knees turned outwards", "Turning around on stage", "How many people came to the feis"], why: "Good turnout is something judges look for." },
    { q: "What is a “bicycle” in Irish dance?", a: ["A move where the legs pedal in the air", "A warm-up bike ride", "A dance for two"], why: "Bicycles are a fun move seen in soft shoe dances." },
    { q: "What is a “click”?", a: ["Clicking heels together in the air", "A camera sound", "A type of shoe buckle"], why: "Clicks are a flashy move in reels and hard shoe dances." },
    { q: "What is the Irish word for dance?", a: ["Rince", "Ceol", "Craic"], why: "Rince (say “RIN-kuh”) means dance. Ceol means music." },
    { q: "What does “ceol” mean?", a: ["Music", "Dance", "Shoe"], why: "Ceol (say “kyole”) is the Irish word for music." },
    { q: "Which instrument is often heard at a feis?", a: ["Accordion", "Trumpet", "Bagpipes made of glass"], why: "The accordion, fiddle and keyboard are common feis instruments." },
    { q: "What is the competitor number for?", a: ["So judges know who is dancing", "To show your age", "To pick your stage"], why: "Each dancer wears a number so the judges can mark the right person." },
    { q: "What does “recall” mean at a big championship?", a: ["Being called back to dance another round", "Being sent home", "Having a costume check"], why: "Dancers who do well in the first rounds are recalled to dance again." },
    { q: "In CLRG, what is the first championship level?", a: ["Preliminary Championship", "Open Championship", "Novice"], why: "Prelim comes first, then Open Championship." },
    { q: "What is the top championship level?", a: ["Open Championship", "Prelim", "Beginner"], why: "Open Championship (OC) is the highest level." },
    { q: "In grade competitions, how does each dance work?", a: ["Each dance is its own competition", "All dances are added together", "Only the last dance counts"], why: "In grades, every dance has its own result and award." },
    { q: "How many judges usually score a championship at a regular feis?", a: ["Three", "One", "Ten"], why: "Usually a panel of three. Big championships often have more." },
    { q: "How many Irish points does 1st place get?", a: ["100", "50", "10"], why: "1st place gets 100 Irish points, 2nd gets 75 and 3rd gets 65." },
    { q: "In a championship, what happens to each judge's placings?", a: ["They become Irish points and are added up", "Only the kindest judge counts", "The judges vote by hand"], why: "Irish points from all the judges are added together for the final result." },
    { q: "What does “moving up” mean?", a: ["Going to the next level after doing well", "Moving to a new stage", "Standing at the back"], why: "Placing well enough moves a dancer up to the next level." },
    { q: "What is a stage at a feis?", a: ["The area where a competition is danced", "A level of dance", "A dancer's bag"], why: "Big feiseanna have lots of stages running at once." },
    { q: "Who runs a feis?", a: ["A feis committee, often volunteers", "The judges", "The musicians"], why: "Feis committees do a huge amount of work. Say thank you!" },
    { q: "Why do dancers warm up and stretch?", a: ["To get muscles ready and stay safe", "To look busy", "Because the judges ask"], why: "Warm muscles help dancers dance their best and avoid injury." },
    { q: "What does “Go n-éirí leat” mean in Irish?", a: ["Good luck", "Good night", "Well done"], why: "Say “guh NYE-ree lat” to wish a friend good luck." },
    { q: "What do many solo dancers wear on their heads?", a: ["A curly wig", "A cap", "A helmet"], why: "Curly wigs are popular, though not every dancer wears one." },
    { q: "What do newer dancers often wear before a solo dress?", a: ["School costume or class outfit", "A wedding dress", "A tracksuit"], why: "Solo dresses usually come later, when the teacher says it's time." },
    { q: "Which dance is slow and heavy, danced in hard shoes, in 6/8?", a: ["Treble jig", "Reel", "Slip jig"], why: "The treble jig is the slow, heavy hard shoe jig." },
    { q: "What time signature is a reel?", a: ["4/4", "9/8", "6/8"], why: "Reels are in 4/4 (sometimes written 2/2)." },
    { q: "Which dance has a bouncy long-short feel and is danced in hard shoes?", a: ["Hornpipe", "Light jig", "Slip jig"], why: "Hornpipes have a dotted, bouncy rhythm." },
    { q: "Which country does Irish dance come from?", a: ["Ireland", "Scotland", "Spain"], why: "Irish dance comes from Ireland and is now danced all over the world." },
    { q: "What should you do if your dancer has a tough day at a feis?", a: ["Give a hug and remember the next feis", "Quit dancing", "Argue with the judge"], why: "Every dancer has hard days. Results change a lot from feis to feis." },
    { q: "What does a judge look at?", a: ["Timing, technique and presentation", "Only the dress", "Only the hair"], why: "Timing, technique and how a dancer presents matter most." },
    { q: "When do results usually go up?", a: ["After each competition finishes", "The next month", "Before the dancing starts"], why: "Results are posted on a board, a screen or online when they're ready." }
  ];
  const PER_DAY = 5;
  const KEY = "pid.trivia";

  function load() { try { return Object.assign({ days: {}, streak: { last: "", count: 0, best: 0 }, total: 0 }, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { return { days: {}, streak: { last: "", count: 0, best: 0 }, total: 0 }; } }
  function save(T) {
    const k = Object.keys(T.days).sort(); while (k.length > 14) delete T.days[k.shift()];
    try { localStorage.setItem(KEY, JSON.stringify(T)); } catch (e) { /* still playable */ }
  }
  function localDate(off) { const d = new Date(); d.setDate(d.getDate() + (off || 0)); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); }
  function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function shuffle(arr, r) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  // Today's questions. Days are numbered so the whole bank is used before any question repeats.
  function todays(date) {
    const day = Math.floor(Date.parse(date + "T12:00:00Z") / 86400000);
    const cycle = Math.floor(day * PER_DAY / QUESTIONS.length);
    const order = shuffle(QUESTIONS.map((_, i) => i), rng(hash("trivia|" + cycle)));
    const start = (day * PER_DAY) % QUESTIONS.length;
    const out = [];
    for (let k = 0; k < PER_DAY; k++) out.push(order[(start + k) % QUESTIONS.length]);
    const r = rng(hash("opts|" + date));
    return out.map((qi) => { const Q = QUESTIONS[qi]; const opts = shuffle(Q.a.map((t, i) => ({ t, ok: i === 0 })), r); return { q: Q.q, why: Q.why, opts }; });
  }

  window.PID_TRIVIA = function (A) {
    const { esc } = A;
    let T = load();

    function status() {
      T = load();
      const d = T.days[localDate()];
      if (!d || !d.picks.length) return "Today's 5 questions are ready";
      const right = d.right || 0;
      return d.picks.length >= PER_DAY ? `Today: ${right} of ${PER_DAY} right ✓` : `${d.picks.length} of ${PER_DAY} answered`;
    }
    function streakOn() { const s = T.streak; return s.count && (s.last === localDate() || s.last === localDate(-1)) ? s.count : 0; }

    function screen() {
      T = load();
      const date = localDate();
      const qs = todays(date);
      const d = T.days[date] || { picks: [], right: 0 };
      const n = d.picks.length;
      const done = n >= PER_DAY;
      const streak = streakOn();
      const head = `<div class="row between ws-top">
          <div><strong>${esc(new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" }))}</strong><div class="small muted ws-note">5 new questions every day. Answer them all to keep your streak going.</div></div>
          ${streak ? `<span class="chip">🔥 ${streak}</span>` : ""}
        </div>
        <div class="tq-dots" aria-label="Progress">${qs.map((_, i) => `<i class="${i < n ? (qs[i].opts[d.picks[i]].ok ? "ok" : "no") : i === n ? "now" : ""}"></i>`).join("")}</div>`;

      let body;
      if (done) {
        const r = d.right;
        body = `<section class="card tq-done">
            <div class="tq-big">${r === PER_DAY ? "🏆" : r >= 3 ? "🌟" : "☘️"}</div>
            <h3>${r} of ${PER_DAY} right</h3>
            <p class="muted">${r === PER_DAY ? "A perfect score! You really know your feis." : r >= 3 ? "Great job! Come back tomorrow for 5 more." : "Every day you'll learn something new. Come back tomorrow!"}</p>
            <p class="small"><strong>🔥 ${streak || 1} day${(streak || 1) === 1 ? "" : "s"} in a row</strong>${T.streak.best > (streak || 1) ? ` · best ${T.streak.best}` : ""}</p>
          </section>
          <h3 class="tq-review-h">Today's answers</h3>
          ${qs.map((Q, i) => { const pick = Q.opts[d.picks[i]]; const right = Q.opts.find((o) => o.ok); return `<div class="card tq-review"><strong>${esc(Q.q)}</strong><div class="small">${pick.ok ? `✅ ${esc(right.t)}` : `❌ You picked “${esc(pick.t)}”. The answer is <strong>${esc(right.t)}</strong>.`}</div><div class="small muted">${esc(Q.why)}</div></div>`; }).join("")}`;
      } else {
        const Q = qs[n];
        body = `<section class="card tq-card">
            <div class="small muted">Question ${n + 1} of ${PER_DAY}</div>
            <h3 class="tq-q">${esc(Q.q)}</h3>
            <div class="stack" id="tqOpts">${Q.opts.map((o, i) => `<button type="button" class="btn ghost block tq-opt" data-tq="${i}">${esc(o.t)}</button>`).join("")}</div>
            <div id="tqWhy" class="tq-why" hidden></div>
          </section>`;
      }
      return { title: "Feis trivia", tab: "home", back: true, html: head + body };
    }

    function answer(i) {
      const date = localDate();
      const qs = todays(date);
      const d = T.days[date] || (T.days[date] = { picks: [], right: 0 });
      const n = d.picks.length; if (n >= PER_DAY) return;
      const Q = qs[n]; const ok = Q.opts[i].ok;
      d.picks.push(i); if (ok) d.right++;
      T.total = (T.total || 0) + (ok ? 1 : 0);
      const finished = d.picks.length >= PER_DAY;
      if (finished) {
        const s = T.streak;
        if (s.last !== date) { s.count = s.last === localDate(-1) ? s.count + 1 : 1; s.last = date; s.best = Math.max(s.best || 0, s.count); }
      }
      save(T);
      // Show right and wrong, the explanation, then a Next button.
      document.querySelectorAll(".tq-opt").forEach((b, k) => {
        b.disabled = true;
        if (Q.opts[k].ok) b.classList.add("right"); else if (k === i) b.classList.add("wrong");
      });
      const why = document.getElementById("tqWhy");
      why.hidden = false;
      why.innerHTML = `<p><strong>${ok ? "Correct! 🎉" : "Not quite."}</strong> ${esc(Q.why)}</p><button type="button" class="btn block" data-tq-next>${finished ? "See my score" : "Next question"}</button>`;
      if (navigator.vibrate) try { navigator.vibrate(ok ? 15 : [10, 40, 10]); } catch (e) { /* ignore */ }
      if (finished && d.right === PER_DAY && window.PID_CELEBRATE) setTimeout(() => window.PID_CELEBRATE("Perfect score!", `5 out of 5! That's ${T.streak.count} day${T.streak.count === 1 ? "" : "s"} in a row. 🔥`), 400);
    }

    document.getElementById("app").addEventListener("click", (e) => {
      const t = e.target.closest("[data-tq], [data-tq-next]"); if (!t) return;
      if (t.dataset.tq !== undefined) { answer(Number(t.dataset.tq)); return; }
      A.rerender();
    });

    return { screen, status, streak: () => { T = load(); return streakOn(); } };
  };
  window.PID_TRIVIA.todays = todays; // for tests
  window.PID_TRIVIA.count = QUESTIONS.length;
})();
