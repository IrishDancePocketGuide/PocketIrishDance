/* Pocket Irish Dance: a small app with no build step.
   Screens are drawn from data.js. Everything a parent saves stays on their phone. */
(function () {
  "use strict";

  const D = window.PID_DATA;
  const app = document.getElementById("app");
  const titleEl = document.getElementById("pageTitle");
  const backBtn = document.getElementById("backBtn");

  // ---------- helpers ----------
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const levelById = (id) => D.levels.find((l) => l.id === id);
  const danceById = (id) => D.dances.find((d) => d.id === id);
  const ordinal = (n) => { n = Number(n); const s = ["th", "st", "nd", "rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };
  const fmtDate = (iso) => { if (!iso) return ""; const d = new Date(iso + "T12:00:00"); return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }); };
  const today = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };
  const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  function toast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2200);
  }

  // ---------- saved data (on this phone only) ----------
  const KEY = "pid.v1";
  const blank = () => ({ profile: { org: "", region: "", level: "" }, checks: {}, dancers: [], results: [], dismissed: {} });
  let S;
  try { S = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { S = blank(); }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast("Couldn't save on this phone"); } }

  // Photos are bigger, so they go in IndexedDB.
  const photos = (function () {
    let dbp;
    function db() {
      if (!dbp) dbp = new Promise((res, rej) => {
        if (!("indexedDB" in window)) return rej(new Error("no idb"));
        const r = indexedDB.open("pid-photos", 1);
        r.onupgradeneeded = () => r.result.createObjectStore("p");
        r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
      });
      return dbp;
    }
    function tx(mode, fn) { return db().then((d) => new Promise((res, rej) => { const t = d.transaction("p", mode); const st = t.objectStore("p"); const out = fn(st); t.oncomplete = () => res(out && out.result); t.onerror = () => rej(t.error); })); }
    return {
      put: (id, blob) => tx("readwrite", (s) => s.put(blob, id)),
      get: (id) => tx("readonly", (s) => s.get(id)),
      del: (id) => tx("readwrite", (s) => s.delete(id))
    };
  })();

  // Fireworks for 1st places
  function cheer(dn, recs) {
    const firsts = recs.filter((x) => Number(x.place) === 1);
    if (!firsts.length || !window.PID_CELEBRATE) return;
    const names = firsts.map((x) => (danceById(x.dance) || { name: "a dance" }).name);
    const list = names.length === 1 ? names[0] : names.slice(0, -1).join(", ") + " and " + names[names.length - 1];
    const feis = firsts[0].feis ? " at " + firsts[0].feis : "";
    const title = firsts.length === 1 ? `1st place, ${dn.name}!` : `${firsts.length} first places, ${dn.name}!`;
    setTimeout(() => window.PID_CELEBRATE(title, `Congratulations on winning ${list}${feis}! 🎉`), 250);
  }

  // One photo can belong to several results (read from one screenshot). Delete it only when none use it.
  function releasePhoto(pid, exceptId) {
    if (!pid || S.results.some((x) => x.photoId === pid && x.id !== exceptId)) return;
    photos.del(pid).catch(() => {});
  }

  function shrinkImage(file, max = 1400) {
    return new Promise((res) => {
      const img = new Image(); const url = URL.createObjectURL(file);
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas"); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob((b) => res(b || file), "image/jpeg", 0.82);
      };
      img.onerror = () => { URL.revokeObjectURL(url); res(file); };
      img.src = url;
    });
  }

  // ---------- organization filter ----------
  // The dancer's own organization is saved in S.profile.org. viewOrg lets a parent
  // look at another organization for a while without changing their own.
  const ORGS = D.organizations.filter((o) => o.pick);
  const orgName = (id) => (D.organizations.find((o) => o.id === id) || {}).name || "";
  let viewOrg = "";
  const curOrg = () => viewOrg || S.profile.org || "";
  const orgLevels = () => D.levels.filter((l) => l.org === (curOrg() || "clrg"));
  const inOrg = (item) => { const o = curOrg(); if (!o) return true; const tags = item.orgs || (item.org && item.org.length < 12 && D.organizations.some((x) => x.id === item.org) ? [item.org] : null) || (item.orgId ? [item.orgId] : null); return !tags || tags.includes(o); };

  // ---------- pronunciation ----------
  function speak(text) {
    if (!("speechSynthesis" in window)) { toast("This phone can't speak words aloud"); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/-/g, " ").toLowerCase());
    u.rate = 0.8;
    const v = speechSynthesis.getVoices().find((x) => /en[-_](IE|GB)/i.test(x.lang));
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  }
  const speaker = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 8.5a4.5 4.5 0 0 1 0 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  const sayBtn = (say) => say ? `<button class="say" data-say="${esc(say)}" aria-label="Hear it: ${esc(say)}">${speaker}${esc(say)}</button>` : "";
  const draftTag = (x) => x && x.check ? ' <span class="draft">· draft, to check</span>' : "";

  // ---------- small pieces ----------
  const searchBox = (val, ph) => `<form class="search" data-search role="search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><input type="search" name="q" value="${esc(val || "")}" placeholder="${esc(ph || "Type any word you heard")}" autocomplete="off" enterkeyhint="search"></form>`;

  function termCard(t) {
    return `<article class="card term">
      <div class="row between wrap"><h3>${esc(t.term)}${t.alt ? ` <span class="alt">· ${esc(t.alt)}</span>` : ""}</h3>${sayBtn(t.say)}</div>
      <p>${esc(t.means)}${draftTag(t)}</p>
      ${t.why ? `<p class="why">Why it matters: ${esc(t.why)}</p>` : ""}
    </article>`;
  }

  function ruleCard(r) {
    const lv = r.levels.length ? r.levels.map((id) => `<span class="chip">${esc(levelById(id).name)}</span>`).join("") : '<span class="chip">All levels</span>';
    const rg = r.regions.length ? `<span class="chip grey">${esc(r.regions.length === 3 && r.regions.includes("Mexico") ? "North America" : r.regions.join(", "))}</span>` : "";
    const org = D.organizations.find((o) => o.id === r.orgId) || {};
    const linked = org.rulesLink && !r.draft;
    const src = linked
      ? `Source: <a href="${esc(org.rulesLink)}" target="_blank" rel="noopener">${esc(org.rulesName || org.name + " rules")}${r.sec ? ", rule " + esc(r.sec) : ""} ↗</a>. A plain-language summary; the official wording always wins.`
      : `Source: ${esc(r.org)} rules. Draft until we add their official rulebook.`;
    return `<article class="card">
      <div class="chips">${lv}${rg}${linked ? "" : '<span class="chip gold">Draft</span>'}</div>
      <h3 style="margin-top:8px">${esc(r.q)}</h3>
      <p style="margin:6px 0">${esc(r.a)}</p>
      <p class="small muted" style="margin:0">${src}</p>
    </article>`;
  }

  // ---------- screens ----------
  const screens = {};

  screens.home = function () {
    const p = S.profile; const lv = levelById(p.level);
    const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
    return {
      title: "Pocket Irish Dance", tab: "home",
      html: `
      <section class="hero">
        <h2>Irish dance, explained</h2>
        <p>The words, the levels, the rules and what to do next, in plain language.</p>
        ${searchBox("", "Type any word you heard, like feis")}
      </section>

      ${!p.org ? `<section class="card" style="border-color:var(--green)">
        <h3>Which organization is your dancer's school in?</h3>
        <p class="small muted" style="margin:2px 0 10px">The app will then show only the words, levels and rules that apply to you. You can still look at the others any time.</p>
        <div class="stack">${ORGS.map((o) => `<button class="btn ghost block" data-set-org="${o.id}">${esc(o.name)}</button>`).join("")}</div>
        <p class="small" style="margin:10px 0 0;text-align:center"><a href="#/orgs">Not sure? See how to tell</a></p>
      </section>` : !p.region ? `<a class="banner" href="#/settings" style="text-decoration:none">Showing ${esc(orgName(p.org))}. Add your region and level so the app fits your dancer. <span class="btn sm">Set up</span></a>` :
        `<p class="small muted" style="margin:0 4px 6px">Showing ${esc(orgName(p.org))} · ${esc(p.region)}${lv ? " · " + esc(lv.name) : ""} · <a href="#/settings">change</a></p>`}

      <div class="grid">
        <a class="tile" href="#/rules"><span class="ico">📘</span><strong>Rules</strong><span>What's allowed at your level, in plain words</span></a>
        <a class="tile" href="#/words"><span class="ico">🗣️</span><strong>Words</strong><span>${D.glossary.filter(inOrg).length} terms with how to say them</span></a>
        <a class="tile" href="#/levels"><span class="ico">🪜</span><strong>Levels</strong><span>Beginner to Open Championship</span></a>
        <a class="tile" href="#/orgs"><span class="ico">🌍</span><strong>Organizations</strong><span>CLRG, An Comhdháil, WIDA and more</span></a>
        <a class="tile" href="#/guide"><span class="ico">✅</span><strong>Parent checklists</strong><span>First feis, solo dress, Oireachtas</span></a>
        <a class="tile" href="#/scores"><span class="ico">🏆</span><strong>Score tracker</strong><span>Keep every result in one place</span></a>
        <a class="tile wide" href="#/schools"><span class="ico">📍</span><strong>Find a dance school</strong><span>Search for Irish dance schools near you</span></a>
      </div>

      ${standalone ? "" : `<div class="card install show" style="flex-direction:column;gap:6px">
        <strong>Put it on your home screen</strong>
        <span class="small muted" id="installHow">${/iphone|ipad|ipod/i.test(navigator.userAgent) ? "In Safari, tap the Share button, then “Add to Home Screen”." : "Open your browser menu and choose “Install app” or “Add to Home screen”."}</span>
        <button class="btn sm" id="installBtn" hidden>Install the app</button>
      </div>`}

      <p class="small muted" style="text-align:center;margin-top:18px">First test version (${esc(D.version)}). Content is being checked and may change.</p>`
    };
  };

  screens.search = function (q) {
    const n = norm(q).trim();
    let html = searchBox(q);
    if (!n) return { title: "Search", tab: "home", back: true, html };
    const all = screens.search.all;
    const ok = (x) => all || inOrg(x);
    const words = D.glossary.filter(ok).filter((t) => norm(t.term + " " + (t.alt || "") + " " + t.means + " " + (t.say || "")).includes(n));
    const rules = D.rules.filter(ok).filter((r) => norm(r.q + " " + r.a + " " + r.topic).includes(n));
    const levels = D.levels.filter(ok).filter((l) => norm(l.name + " " + (l.alt || "") + " " + l.danced).includes(n));
    const checks = [];
    D.checklists.forEach((c) => c.items.forEach((it) => { if (norm(it).includes(n)) checks.push({ c, it }); }));
    const total = words.length + rules.length + levels.length + checks.length;
    if (curOrg()) html += `<p class="small muted" style="margin:10px 4px 0">${all ? "Searching all organizations." : "Searching " + esc(orgName(curOrg())) + " only."} <button class="btn plain sm" data-search-all="${all ? "" : "1"}">${all ? "Just " + esc(orgName(curOrg())) : "Search all organizations"}</button></p>`;
    html += `<p class="muted small" style="margin:10px 4px">${total ? total + " result" + (total === 1 ? "" : "s") : "Nothing found yet. Try a different spelling, or tell us the word so we can add it."}</p>`;
    if (words.length) html += `<div class="az">WORDS</div>` + words.map(termCard).join("");
    if (rules.length) html += `<div class="az">RULES</div>` + rules.map(ruleCard).join("");
    if (levels.length) html += `<div class="az">LEVELS</div>` + levels.map((l) => `<a class="card" style="display:block;text-decoration:none;color:inherit" href="#/levels"><h3>${esc(l.name)}</h3><p class="small muted" style="margin:0">${esc(l.danced)}</p></a>`).join("");
    if (checks.length) html += `<div class="az">CHECKLISTS</div>` + checks.map((x) => `<a class="card" style="display:block;text-decoration:none;color:inherit" href="#/guide/${x.c.id}"><span class="chip">${esc(x.c.name)}</span><p style="margin:6px 0 0">${esc(x.it)}</p></a>`).join("");
    return { title: "Search", tab: "home", back: true, html };
  };

  // ----- find a school -----
  const SCHOOL_ORGS = [
    { id: "any", name: "No preference", hint: "Just show me schools near me", q: "Irish dance school" },
    { id: "clrg", name: "CLRG", hint: "Teachers have TCRG after their name", q: "Irish dance school TCRG" },
    { id: "comhdhail", name: "An Comhdháil", hint: "Mainly Ireland and Great Britain", q: "Irish dance school An Comhdháil", locator: "https://web.irishdancingorg.com/index.php/school-locator" },
    { id: "wida", name: "WIDA", hint: "Mainly mainland Europe", q: "Irish dance school WIDA", locator: "https://www.irish.dance/teachers" }
  ];
  screens.schools = function () {
    const st = screens.schools.st || { org: curOrg(), place: "" };
    screens.schools.st = st;
    if (!st.org) {
      return {
        title: "Find a school", tab: "home", back: true,
        html: `<h2>Find a dance school near you</h2>
        <p class="muted" style="margin-top:0">Do you have a preference for an organization? If you're not sure, choose “No preference”. You can read about each one in <a href="#/orgs">Organizations</a>.</p>
        ${SCHOOL_ORGS.map((o) => `<button class="card" data-school-org="${o.id}" style="display:block;width:100%;text-align:left;cursor:pointer;font:inherit;color:inherit">
          <h3>${esc(o.name)}</h3><span class="small muted">${esc(o.hint)}</span></button>`).join("")}`
      };
    }
    const o = SCHOOL_ORGS.find((x) => x.id === st.org) || SCHOOL_ORGS[0];
    return {
      title: "Find a school", tab: "home", back: true,
      html: `<div class="row between"><span class="chip">${esc(o.name)}</span><button class="btn plain sm" data-school-org="">Change</button></div>
      ${o.locator ? `<div class="card" style="margin-top:10px"><h3>Official school locator</h3>
        <p class="small muted" style="margin:0 0 8px">${esc(o.name)} has its own list of registered schools and teachers. This is the most reliable place to look.</p>
        <a class="btn block" href="${esc(o.locator)}" target="_blank" rel="noopener">Open ${esc(o.name)}'s school locator ↗</a></div>
        <p class="small muted" style="margin:14px 4px 0">Or search the map:</p>` : ""}
      ${o.id === "any" || o.id === "clrg" ? `<div class="card" style="margin-top:10px"><h3>Planxti school list</h3>
        <p class="small muted" style="margin:0 0 8px">A growing list of Irish dance schools, mostly in the US and Canada, which you can filter by region. It doesn't show which organization each school belongs to, so ask the school.</p>
        <a class="btn ghost block" href="https://planxti.com/schools" target="_blank" rel="noopener">Open the Planxti school list ↗</a></div>
        <div class="card"><h3>Irish Dancing Magazine school list</h3>
        <p class="small muted" style="margin:0 0 8px">Schools around the world, grouped by country or region (USA, Canada, Mexico, UK, Ireland, Australia, Europe and more). It doesn't show the organization either, and some listings are paid “featured” spots.</p>
        <a class="btn ghost block" href="https://irishdancing.com/resources/dance-schools" target="_blank" rel="noopener">Open the Irish Dancing Magazine list ↗</a></div>
        <p class="small muted" style="margin:14px 4px 0">Or search the map:</p>` : ""}
      <form id="schoolForm" class="card" style="margin-top:10px">
        <label class="field" style="margin-top:0"><span>Your town, city or postcode</span><input name="place" value="${esc(st.place)}" placeholder="e.g. Naperville, IL or M1 1AA" autocomplete="postal-code" maxlength="80"></label>
        <button class="btn block">Search the map</button>
        <button type="button" class="btn ghost block" id="nearMe" style="margin-top:8px">📍 Use my location</button>
        <p class="small muted" style="margin:8px 0 0">This opens Google Maps with a search for Irish dance schools. Your location goes only to Google Maps, not to this app.</p>
      </form>
      <div class="card small">
        <h3>Before you sign up, ask the school:</h3>
        <ul style="margin:6px 0 0;padding-left:18px;line-height:1.6">
          <li>Which organization are you part of? (For CLRG, is the teacher a TCRG?)</li>
          <li>Is there a beginner class for my child's age?</li>
          <li>Can we try a class first?</li>
          <li>What are the costs: classes, shoes, costume, competitions?</li>
          <li>How often do dancers compete, and is it required?</li>
        </ul>
      </div>
      ${o.id === "clrg" || o.id === "any" ? `<p class="small muted">Official CLRG information: <a href="https://www.clrg.ie" target="_blank" rel="noopener">clrg.ie ↗</a></p>` : ""}
      ${o.id === "comhdhail" ? `<p class="small muted">Official An Comhdháil information: <a href="https://www.irishdancingorg.com" target="_blank" rel="noopener">irishdancingorg.com ↗</a></p>` : ""}`,
      after() {
        const open = (where) => window.open("https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(o.q + " " + where), "_blank", "noopener");
        document.getElementById("schoolForm").addEventListener("submit", (e) => {
          e.preventDefault(); st.place = e.target.place.value.trim();
          open(st.place ? "near " + st.place : "near me");
        });
        document.getElementById("nearMe").addEventListener("click", () => {
          if (!navigator.geolocation) { open("near me"); return; }
          navigator.geolocation.getCurrentPosition(
            (pos) => window.open(`https://www.google.com/maps/search/${encodeURIComponent(o.q)}/@${pos.coords.latitude.toFixed(3)},${pos.coords.longitude.toFixed(3)},12z`, "_blank", "noopener"),
            () => open("near me"), { timeout: 8000 });
        });
      }
    };
  };

  screens.words = function () {
    const group = screens.words.group || "all";
    const allOrgs = screens.words.allOrgs;
    const list = D.glossary.filter((t) => allOrgs || inOrg(t)).filter((t) => group === "all" || t.g === group).slice().sort((a, b) => a.term.localeCompare(b.term));
    let lastLetter = "";
    const body = list.map((t) => {
      const L = t.term[0].toUpperCase(); let h = "";
      if (L !== lastLetter) { h = `<div class="az">${esc(L)}</div>`; lastLetter = L; }
      return h + termCard(t);
    }).join("");
    return {
      title: "Words", tab: "words",
      html: `${searchBox("", "Search the words")}
      <div class="pill-tabs" style="margin-top:12px">
        <button data-group="all" class="${group === "all" ? "on" : ""}">All</button>
        ${D.glossaryGroups.map((g) => `<button data-group="${g.id}" class="${group === g.id ? "on" : ""}">${esc(g.name)}</button>`).join("")}
      </div>
      ${curOrg() ? `<label class="toggle small" style="margin:10px 4px 0"><input type="checkbox" data-words-all ${allOrgs ? "checked" : ""}> Include words used by other organizations</label>` : ""}
      <p class="small muted" style="margin:8px 4px 0">Tap the gold button to hear a word. It uses your phone's voice for now; real recordings are coming.</p>
      ${body}`
    };
  };

  screens.levels = function () {
    const mine = S.profile.level;
    const o = curOrg();
    if (o && !orgLevels().length) {
      const org = D.organizations.find((x) => x.id === o);
      return {
        title: "Levels", tab: "levels",
        html: `<h2>${esc(org.name)} levels</h2>
        <div class="empty"><div class="big">🪜</div><p>The ${esc(org.name)} level ladder is being written. Its level names and moving-up rules are different from CLRG's, so we're not showing CLRG's here.</p>
        ${org.link ? `<a class="btn ghost" href="${esc(org.link)}" target="_blank" rel="noopener">${esc(org.name)} website ↗</a>` : ""}</div>`
      };
    }
    return {
      title: "Levels", tab: "levels",
      html: o && o !== "clrg" ? `<h2>The ${esc(orgName(o))} level ladder</h2>
      <p class="muted" style="margin-top:0">From the official ${esc(orgName(o))} rules. In the grades, a dancer moves up <strong>one dance at a time</strong>, so they can be at different grades in different dances.</p>
      ${o === "wida" ? `<article class="card"><h3>Grades, premierships and championships</h3>
        <p style="margin:6px 0 0">The <strong>grades</strong> are Beginner, Primary, Intermediate and Open. Each dance is its own competition.</p>
        <p style="margin:8px 0 0">A <strong>premiership</strong> is two dances with the scores added together, at your dancer's grade. Then come <strong>championships</strong>: Preliminary, then Open.</p>
        <p class="small muted" style="margin:8px 0 0">Once a dancer moves up, they can't move back down.</p></article>` : ""}
      <div class="ladder">${ladder()}</div>
      ${(D.organizations.find((x) => x.id === o) || {}).rulesLink ? `<p class="small muted"><a href="${esc(D.organizations.find((x) => x.id === o).rulesLink)}" target="_blank" rel="noopener">Official ${esc(orgName(o))} rules ↗</a></p>` : ""}` : `<h2>The ${o ? "" : "CLRG "}level ladder</h2>
      <p class="muted" style="margin-top:0">CLRG in North America (North American Feis Commission level names). At the lower levels a dancer moves up <strong>one dance at a time</strong>, so they can be at different levels in different dances.</p>
      <article class="card">
        <h3>What are “grades”?</h3>
        <p style="margin:6px 0 0">“Grades” (or <strong>grade competitions</strong>) is the name for all the levels below championship: Beginner 1, Beginner 2, Novice and Open Prizewinner. In grades, each dance is a separate competition with one judge, and your dancer moves up one dance at a time.</p>
        <p style="margin:8px 0 0">Once a dancer has moved up through the grades, they go into <strong>championships</strong> (Preliminary, then Open). There, they dance several rounds in one competition, judged by a panel, and get one overall result.</p>
        <p class="small muted" style="margin:8px 0 0">Don't confuse grades with <strong>grade exams</strong> (Grád, said “grawd”). Those are optional CLRG skills exams, separate from competitions.</p>
      </article>
      <div class="note">Great Britain, Ireland and Australia use different names for the lower levels. Their ladders are coming next.</div>
      <div class="ladder">
        ${ladder()}
      </div>`
    };
    function ladder() {
      return orgLevels().map((l) => `<article class="card rung ${l.id === mine ? "me" : ""}" data-n="${l.order}">
          <div class="row between wrap"><h3>${esc(l.name)}</h3>${l.id === mine ? '<span class="chip">Your dancer</span>' : ""}</div>
          ${l.alt ? `<p class="small muted" style="margin:0">${esc(l.alt)}</p>` : ""}
          <dl class="facts">
            <dt>Danced</dt><dd>${esc(l.danced)}</dd>
            <dt>Moving up</dt><dd>${esc(l.moveUp)}${draftTag(l)}</dd>
            <dt>Expect</dt><dd>${esc(l.parents)}</dd>
          </dl>
        </article>`).join("");
    }
  };

  screens.orgs = function () {
    return {
      title: "Organizations", tab: "home", back: true,
      html: `<h2>Who's who in Irish dance</h2>
      <p class="muted" style="margin-top:0">There isn't one Irish dance organization. Your school belongs to one, and that decides the rules, the levels and the championships your dancer can enter. Dancers from different organizations usually don't compete against each other.</p>
      <div class="card small"><strong>How to tell which one you're in:</strong> ask your teacher, or look at their title. A teacher with <strong>TCRG</strong> after their name teaches in CLRG. Your school's website or feis entry forms usually name the organization too.</div>
      ${D.organizations.map((o) => `<article class="card">
        <div class="row between wrap"><h3>${esc(o.name)}</h3>${o.partOf ? `<span class="chip grey">Part of the ${esc(o.partOf)} world</span>` : ""}</div>
        ${o.fullName !== o.name ? `<p class="small muted" style="margin:0">${esc(o.fullName)}</p>` : ""}
        ${o.say ? `<div style="margin-top:6px">${sayBtn(o.say)}</div>` : ""}
        <p style="margin:8px 0 0">${esc(o.summary)}${draftTag(o)}</p>
        <dl class="facts">
          <dt>Where</dt><dd>${esc(o.where)}</dd>
          ${o.teachers ? `<dt>Titles</dt><dd>${esc(o.teachers)}</dd>` : ""}
          ${o.majors ? `<dt>Big events</dt><dd>${esc(o.majors)}</dd>` : ""}
        </dl>
        ${o.link ? `<p class="small" style="margin:8px 0 0"><a href="${esc(o.link)}" target="_blank" rel="noopener">Official website ↗</a></p>` : ""}
        ${o.pick ? (S.profile.org === o.id ? `<p style="margin:10px 0 0"><span class="chip">✓ Your organization</span></p>` :
          `<div class="row wrap" style="margin-top:10px;gap:8px">${S.profile.org ? `<button class="btn ghost sm" data-view-org="${o.id}">Look around ${esc(o.name)}</button>` : ""}<button class="btn ${S.profile.org ? "plain" : "ghost"} sm" data-set-org="${o.id}">${S.profile.org ? "Switch to " + esc(o.name) : "This is us: " + esc(o.name)}</button></div>`) : ""}
      </article>`).join("")}`
    };
  };

  screens.rules = function () {
    const f = screens.rules.f || { level: S.profile.level || "", region: S.profile.region || "" };
    if (f.level && !orgLevels().some((l) => l.id === f.level)) f.level = "";
    screens.rules.f = f;
    const naRegions = ["United States", "Canada", "Mexico"];
    const list = D.rules.filter(inOrg).filter((r) =>
      (!f.level || !r.levels.length || r.levels.includes(f.level)) &&
      (!f.region || !r.regions.length || r.regions.includes(f.region)));
    return {
      title: "Rules", tab: "rules",
      html: `<h2>Rules library</h2>
      <p class="muted" style="margin-top:0">The rules that matter to parents, in plain language, with a link to the official rulebook.</p>
      ${(D.organizations.find((x) => x.id === curOrg()) || {}).rulesLink ? "" : `<div class="note"><strong>Coming soon:</strong> ${curOrg() && curOrg() !== "clrg" ? esc(orgName(curOrg())) + " rules will be added from its current rulebook." : "these are draft examples showing how the library will work. The full CLRG and North American Feis Commission rules will be added from the current rulebooks."}</div>`}
      ${curOrg() && curOrg() !== "clrg" ? (orgLevels().length ? `<label class="field"><span>Level</span><select data-rf="level"><option value="">All levels</option>${orgLevels().map((l) => `<option value="${l.id}" ${f.level === l.id ? "selected" : ""}>${esc(l.name)}</option>`).join("")}</select></label>` : "") : `<div class="two">
        <label class="field"><span>Level</span><select data-rf="level"><option value="">All levels</option>${orgLevels().map((l) => `<option value="${l.id}" ${f.level === l.id ? "selected" : ""}>${esc(l.name)}</option>`).join("")}</select></label>
        <label class="field"><span>Region</span><select data-rf="region"><option value="">Everywhere</option>${D.regions.map((r) => `<option ${f.region === r ? "selected" : ""}>${esc(r)}</option>`).join("")}</select></label>
      </div>`}
      ${list.length ? groupRules(list) : `<div class="empty"><div class="big">📘</div>No ${curOrg() ? esc(orgName(curOrg())) + " " : ""}rules for this level and region yet.${naRegions.includes(f.region) || !f.region ? "" : "<br>Your region's rules are coming in a later update."}</div>`}`
    };
  };

  function groupRules(list) {
    const topics = [...new Set(list.map((r) => r.topic))];
    return topics.map((t) => `<div class="az">${esc(t.toUpperCase())}</div>` + list.filter((r) => r.topic === t).map(ruleCard).join("")).join("");
  }

  screens.guide = function () {
    return {
      title: "Parent checklists", tab: "home", back: true,
      html: `<h2>What am I supposed to be doing?</h2>
      <p class="muted" style="margin-top:0">Checklists for the big moments. Ticks are saved on this phone.</p>
      ${D.checklists.map((c) => {
        const done = c.items.filter((_, i) => S.checks[c.id + ":" + i]).length;
        return `<a class="card" style="display:block;text-decoration:none;color:inherit" href="#/guide/${c.id}">
          <div class="row between"><h3>${esc(c.name)}</h3><span class="small muted">${done} of ${c.items.length}</span></div>
          <div class="progress"><i style="width:${(done / c.items.length) * 100}%"></i></div>
        </a>`;
      }).join("")}`
    };
  };

  screens.checklist = function (id) {
    const c = D.checklists.find((x) => x.id === id);
    if (!c) return screens.guide();
    return {
      title: c.name, tab: "home", back: true,
      html: `<div class="card">${c.items.map((it, i) => {
        const k = c.id + ":" + i; const on = !!S.checks[k];
        return `<label class="check ${on ? "done" : ""}"><input type="checkbox" data-check="${esc(k)}" ${on ? "checked" : ""}><span>${esc(it)}</span></label>`;
      }).join("")}</div>
      <button class="btn plain" data-reset-check="${esc(c.id)}">Clear ticks</button>`
    };
  };

  // ----- score tracker -----
  function dancerLevel(dn, danceId) { return (dn.levels && dn.levels[danceId]) || ""; }
  function nextLevel(id) { const l = levelById(id); return l && D.levels.find((x) => x.org === l.org && x.order === l.order + 1); }

  function moveUpSuggestions(dn) {
    const out = []; const seen = {};
    S.results.filter((r) => r.dancerId === dn.id).sort((a, b) => b.date.localeCompare(a.date)).forEach((r) => {
      if (seen[r.dance]) return;
      const l = levelById(r.level); const dance = danceById(r.dance);
      if (!l || !l.perDance || !dance || dance.shoe === "champ" || S.dismissed[r.id]) return;
      if (dancerLevel(dn, r.dance) !== r.level) return;
      if (l.minEntrants && r.entrants && Number(r.entrants) < l.minEntrants) return;
      if (Number(r.place) >= 1 && Number(r.place) <= l.moveUpPlace) {
        const nx = nextLevel(r.level);
        if (nx) { out.push({ r, dance, from: l, to: nx }); seen[r.dance] = true; }
      }
    });
    return out;
  }

  screens.scores = function () {
    if (!S.dancers.length) {
      return {
        title: "Score tracker", tab: "scores",
        html: `<div class="empty"><div class="big">🏆</div><h2>Track every result</h2>
          <p>Add your dancer, then log each feis result with a photo of the results sheet. You'll see their placings for each dance over time, and when they're ready to move up.</p>
          <p class="small">Everything stays private on this phone.</p>
          <a class="btn" href="#/dancer/new">Add a dancer</a></div>`
      };
    }
    if (S.dancers.length === 1) return screens.dancer(S.dancers[0].id);
    return {
      title: "Score tracker", tab: "scores",
      html: `${S.dancers.map((dn) => {
        const n = S.results.filter((r) => r.dancerId === dn.id).length;
        return `<a class="card row" style="text-decoration:none;color:inherit" href="#/dancer/${dn.id}"><span class="place">${esc(dn.name[0] || "?")}</span><div class="meta" style="flex:1"><strong>${esc(dn.name)}</strong><span class="small muted">${n} result${n === 1 ? "" : "s"}</span></div><span class="muted">›</span></a>`;
      }).join("")}
      <a class="btn ghost block" href="#/dancer/new" style="margin-top:8px">Add another dancer</a>`
    };
  };

  screens.dancerForm = function (id) {
    const dn = S.dancers.find((d) => d.id === id) || { id: "", name: "", levels: {} };
    const startLevel = S.profile.level || (orgLevels()[0] || {}).id || "b1";
    return {
      title: dn.id ? "Edit dancer" : "Add a dancer", tab: "scores", back: true,
      html: `<form id="dancerForm" class="card">
        <label class="field"><span>Dancer's first name or nickname</span><input name="name" required maxlength="40" value="${esc(dn.name)}" placeholder="For example, Ava"></label>
        <h3 style="margin-top:16px">Current level in each dance</h3>
        <p class="small muted" style="margin-top:0">Leave as “Not dancing yet” for dances they don't compete in.</p>
        ${D.dances.filter((d) => d.shoe !== "champ").map((d) => `<div class="dance-row"><span class="name">${esc(d.name)}</span>
          <select name="lv_${d.id}"><option value="">Not dancing yet</option>${orgLevels().filter((l) => l.perDance).map((l) => `<option value="${l.id}" ${(dn.id ? dancerLevel(dn, d.id) : (d.shoe === "soft" && ["reel", "lightjig"].includes(d.id) ? startLevel : "")) === l.id ? "selected" : ""}>${esc(l.name)}</option>`).join("")}</select></div>`).join("")}
        <div class="dance-row"><span class="name">Championship</span>
          <select name="lv_champ"><option value="">Not yet</option>${orgLevels().filter((l) => !l.perDance).map((l) => `<option value="${l.id}" ${dancerLevel(dn, "champ") === l.id ? "selected" : ""}>${esc(l.name)}</option>`).join("")}</select></div>
        <button class="btn block" style="margin-top:14px">${dn.id ? "Save" : "Add dancer"}</button>
        ${dn.id ? `<button type="button" class="btn danger block" data-del-dancer="${dn.id}" style="margin-top:6px">Delete this dancer and their results</button>` : ""}
      </form>`,
      after() {
        document.getElementById("dancerForm").addEventListener("submit", (e) => {
          e.preventDefault();
          const fd = new FormData(e.target); const levels = {};
          D.dances.forEach((d) => { const v = fd.get("lv_" + d.id); if (v) levels[d.id] = v; });
          if (fd.get("lv_champ")) levels.champ = fd.get("lv_champ");
          const name = String(fd.get("name")).trim(); if (!name) return;
          if (dn.id) { Object.assign(S.dancers.find((d) => d.id === dn.id), { name, levels }); }
          else { dn.id = uid(); S.dancers.push({ id: dn.id, name, levels }); }
          save(); toast("Saved"); location.hash = "#/dancer/" + dn.id;
        });
      }
    };
  };

  function placeBadge(p) { return `<span class="place ${["", "p1", "p2", "p3"][p] || ""}">${p ? esc(ordinal(p)) : "–"}</span>`; }

  function resultRow(r) {
    const d = danceById(r.dance); const l = levelById(r.level);
    const bits = [l && l.name, r.entrants && `${r.entrants} dancers`, r.marks && `${r.marks} marks`, r.recall && "Recalled ✨"].filter(Boolean);
    return `<a class="card result" href="#/result/${r.id}" style="text-decoration:none;color:inherit">${placeBadge(Number(r.place))}
      <div class="meta"><strong>${esc(d ? d.name : r.dance)}</strong><span class="small muted">${esc(r.feis || "Feis")} · ${esc(fmtDate(r.date))}</span><div class="small muted">${esc(bits.join(" · "))}</div></div>
      ${r.photoId ? `<img class="thumb" data-photo="${esc(r.photoId)}" alt="">` : ""}</a>`;
  }

  function chartFor(rs) {
    const pts = rs.filter((r) => Number(r.place) > 0).sort((a, b) => a.date.localeCompare(b.date));
    if (pts.length < 2) return "";
    const W = 320, H = 130, pl = 26, pr = 10, pt = 10, pb = 22;
    const maxP = Math.max(5, ...pts.map((r) => Math.min(Number(r.place), 15)));
    const x = (i) => pl + (i * (W - pl - pr)) / (pts.length - 1);
    const y = (p) => pt + ((Math.min(p, 15) - 1) * (H - pt - pb)) / (maxP - 1);
    const path = pts.map((r, i) => (i ? "L" : "M") + x(i).toFixed(1) + " " + y(Number(r.place)).toFixed(1)).join(" ");
    const grid = [1, Math.ceil(maxP / 2), maxP].map((p) => `<line x1="${pl}" x2="${W - pr}" y1="${y(p)}" y2="${y(p)}" stroke="var(--line)"/><text x="${pl - 6}" y="${y(p) + 3}" text-anchor="end">${ordinal(p)}</text>`).join("");
    const dots = pts.map((r, i) => `<circle cx="${x(i)}" cy="${y(Number(r.place))}" r="4.5" fill="var(--green)" stroke="var(--card)" stroke-width="2"/>`).join("");
    const first = fmtDate(pts[0].date), last = fmtDate(pts[pts.length - 1].date);
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Placings over time, from ${first} to ${last}">${grid}<path d="${path}" fill="none" stroke="var(--green)" stroke-width="2.5" stroke-linejoin="round"/>${dots}<text x="${pl}" y="${H - 6}">${esc(first)}</text><text x="${W - pr}" y="${H - 6}" text-anchor="end">${esc(last)}</text></svg>`;
  }

  screens.dancer = function (id) {
    const dn = S.dancers.find((d) => d.id === id);
    if (!dn) return screens.scores();
    const rs = S.results.filter((r) => r.dancerId === id).sort((a, b) => b.date.localeCompare(a.date));
    const sugg = moveUpSuggestions(dn);
    const tabs = screens.dancer.view || "recent";
    const dancesWithResults = D.dances.filter((d) => rs.some((r) => r.dance === d.id));
    let body;
    if (!rs.length) body = `<div class="empty"><div class="big">📸</div>No results yet. After the next feis, snap the results and add them here.</div>`;
    else if (tabs === "recent") body = rs.map(resultRow).join("");
    else body = dancesWithResults.map((d) => {
      const drs = rs.filter((r) => r.dance === d.id);
      const best = Math.min(...drs.map((r) => Number(r.place) || 99));
      return `<article class="card"><div class="row between"><h3>${esc(d.name)}</h3><span class="chip">${esc((levelById(dancerLevel(dn, d.id === "prelim" || d.id === "open" ? "champ" : d.id)) || {}).name || "")}</span></div>
        <p class="small muted" style="margin:2px 0 0">${drs.length} result${drs.length === 1 ? "" : "s"}${best < 99 ? " · best " + ordinal(best) : ""}</p>
        ${chartFor(drs) || '<p class="small muted">Add one more result to see a chart.</p>'}</article>`;
    }).join("");

    return {
      title: dn.name, tab: "scores", back: S.dancers.length > 1,
      html: `
      ${sugg.map((s) => `<div class="banner"><span>🎉 ${esc(ordinal(s.r.place))} in ${esc(s.dance.name)} at ${esc(s.from.name)}. That usually means moving up to <strong>${esc(s.to.name)}</strong> in ${esc(s.dance.name)}.</span>
        <button class="btn sm" data-moveup="${s.r.id}">Move up</button><button class="btn plain sm" data-dismiss="${s.r.id}" aria-label="Not yet">✕</button></div>`).join("")}
      <div class="row" style="gap:8px">
        <a class="btn" style="flex:1" href="#/add/${dn.id}">＋ Add a result</a>
        <a class="btn ghost" href="#/dancer/${dn.id}/edit">Levels</a>
      </div>
      <div class="card" style="padding:6px 14px">
        ${D.dances.filter((d) => dancerLevel(dn, d.id)).map((d) => `<div class="dance-row"><span class="name">${esc(d.name)}</span><span class="chip">${esc(levelById(dancerLevel(dn, d.id)).name)}</span></div>`).join("") || '<p class="small muted">No levels set yet.</p>'}
        ${dancerLevel(dn, "champ") ? `<div class="dance-row"><span class="name">Championship</span><span class="chip">${esc(levelById(dancerLevel(dn, "champ")).name)}</span></div>` : ""}
      </div>
      ${rs.length ? `<div class="pill-tabs"><button data-dview="recent" class="${tabs === "recent" ? "on" : ""}">Latest results</button><button data-dview="dance" class="${tabs === "dance" ? "on" : ""}">By dance</button></div>` : ""}
      ${body}`
    };
  };

  screens.resultForm = function (dancerId, resultId) {
    const dn = S.dancers.find((d) => d.id === dancerId);
    if (!dn) return screens.scores();
    const r = S.results.find((x) => x.id === resultId) || { id: "", date: today(), feis: (S.results.filter((x) => x.dancerId === dancerId).sort((a, b) => b.date.localeCompare(a.date))[0] || {}).feis || "", dance: "", level: "", place: "", entrants: "", marks: "", recall: false, notes: "", photoId: "" };
    const lastFeis = r.feis;
    return {
      title: r.id ? "Edit result" : "Add a result", tab: "scores", back: true,
      html: `<form id="resForm">
        <div class="card">
          <h3>Photo of the results (optional)</h3>
          <p class="small muted" style="margin:0 0 8px">Take a screenshot of the results website (QuickFeis, FeisWorx…) or a photo of the results sheet.${r.id ? "" : " The app reads it and fills everything in for you."} It stays on this phone and isn't sent anywhere.</p>
          <label class="btn ghost block" style="cursor:pointer">📷 ${r.photoId ? "Replace photo" : "Add photo"}<input type="file" accept="image/*" name="photo" hidden></label>
          <img id="photoPrev" class="photo-preview" ${r.photoId ? `data-photo="${esc(r.photoId)}"` : "hidden"} alt="Results photo">
          ${r.id ? "" : `<div id="readBox" hidden><button type="button" class="btn ghost block" id="readBtn">🔎 Try reading the photo again</button></div>
          <div id="readProg" class="read-prog" hidden><span class="spinner" aria-hidden="true"></span><span id="readMsg">Reading the results…</span></div>`}
        </div>
        <div class="card">
          <div class="two">
            <label class="field"><span>Date</span><input type="date" name="date" required value="${esc(r.date)}"></label>
            <label class="field"><span>Feis or event</span><input name="feis" value="${esc(lastFeis)}" placeholder="e.g. Feis Mid-America" maxlength="80"></label>
          </div>
        </div>
        <div id="readOut"></div>
        <div id="manual">
        <div class="card">
          <div class="two">
            <label class="field"><span>Dance</span><select name="dance" required><option value="">Choose…</option>${D.dances.map((d) => `<option value="${d.id}" ${r.dance === d.id ? "selected" : ""}>${esc(d.name)}</option>`).join("")}</select></label>
            <label class="field"><span>Level</span><select name="level" required><option value="">Choose…</option>${orgLevels().map((l) => `<option value="${l.id}" ${r.level === l.id ? "selected" : ""}>${esc(l.name)}</option>`).join("")}</select></label>
          </div>
          <div class="two">
            <label class="field"><span>Place</span><input type="number" inputmode="numeric" min="1" max="200" name="place" value="${esc(r.place)}" placeholder="e.g. 2"></label>
            <label class="field"><span>Dancers in the competition</span><input type="number" inputmode="numeric" min="1" max="500" name="entrants" value="${esc(r.entrants)}" placeholder="optional"></label>
          </div>
          <label class="field"><span>Marks or score, if shown</span><input name="marks" inputmode="decimal" value="${esc(r.marks)}" placeholder="optional" maxlength="30"></label>
          <label class="toggle"><input type="checkbox" name="recall" ${r.recall ? "checked" : ""}> Recalled (championships)</label>
          <label class="field"><span>Notes</span><textarea name="notes" maxlength="500" placeholder="Anything to remember: judges' comments, how it felt…">${esc(r.notes)}</textarea></label>
        </div>
        <button class="btn block">${r.id ? "Save changes" : "Save result"}</button>
        </div>
        ${r.id ? `<button type="button" class="btn danger block" data-del-result="${r.id}" style="margin-top:6px">Delete this result</button>` : ""}
      </form>`,
      after() {
        const f = document.getElementById("resForm");
        let newPhoto = null;
        // Pre-fill level from the dancer's level in that dance
        f.dance.addEventListener("change", () => {
          const d = danceById(f.dance.value); if (!d) return;
          const lv = dancerLevel(dn, d.shoe === "champ" ? "champ" : d.id);
          if (lv) f.level.value = lv;
        });
        let origFile = null;
        f.photo.addEventListener("change", async () => {
          const file = f.photo.files[0]; if (!file) return;
          origFile = file;
          newPhoto = await shrinkImage(file);
          const img = document.getElementById("photoPrev"); img.hidden = false; img.src = URL.createObjectURL(newPhoto);
          document.getElementById("readOut").innerHTML = "";
          if (!r.id) readPhoto();
        });
        const readBtn = document.getElementById("readBtn");
        if (readBtn) readBtn.addEventListener("click", () => readPhoto());
        async function readPhoto() {
          if (!origFile || !window.PID_READER) return;
          const prog = document.getElementById("readProg"); const box = document.getElementById("readBox"); const msgEl = document.getElementById("readMsg");
          box.hidden = true; prog.hidden = false; document.getElementById("manual").hidden = true;
          try {
            const text = await window.PID_READER.readText(origFile, (msg, pct) => { msgEl.textContent = msg + (pct ? " " + Math.round(pct * 100) + "%" : ""); });
            const out = window.PID_READER.parse(text, { levels: orgLevels() });
            prog.hidden = true;
            if (out.date) f.date.value = out.date;
            if (out.feis && (!f.feis.value || f.feis.value === lastFeis)) f.feis.value = out.feis;
            showFound(out);
          } catch (err) {
            prog.hidden = true; box.hidden = false; document.getElementById("manual").hidden = false;
            toast(navigator.onLine ? "Couldn't read this photo. You can fill it in below." : "The reader needs internet the first time. Fill it in below for now.");
          }
        }
        function showFound(out) {
          const el = document.getElementById("readOut");
          const manual = document.getElementById("manual");
          // A level read from another line of the same screenshot is the best guess for rows that don't name one.
          const lvCount = {}; out.results.forEach((x) => { if (x.level) lvCount[x.level] = (lvCount[x.level] || 0) + 1; });
          const guessLevel = Object.keys(lvCount).sort((a, b) => lvCount[b] - lvCount[a])[0] || "";
          const rows = out.results.map((x) => {
            if (!x.level) x.level = dancerLevel(dn, x.dance === "prelim" || x.dance === "open" ? "champ" : x.dance) || guessLevel;
            return x;
          });
          const said = `<details class="small" style="margin-top:8px"><summary>Show everything the app read</summary><pre class="read-text">${esc(out.text || "(no words found)")}</pre></details>`;
          manual.hidden = !!rows.length;
          if (!rows.length) {
            document.getElementById("readBox").hidden = false;
            el.innerHTML = `<div class="card"><h3>No results found</h3><p class="small muted" style="margin:0">The app couldn't spot a dance name in this photo${out.feis || out.date ? ", but it filled in the feis details above" : ""}. Try a closer, straighter photo, or fill in the result below.</p>${said}</div>`;
            return;
          }
          el.innerHTML = `<div class="card"><h3>Found ${rows.length} result${rows.length > 1 ? "s" : ""}</h3>
            <p class="small muted" style="margin:0">Everything is filled in from the photo. Have a quick look, untick any that aren't ${esc(dn.name)}'s, then save.</p>${said}</div>
            ${rows.map((x, i) => `<div class="card found-row" data-row="${i}">
              <label class="toggle" style="margin-top:0"><input type="checkbox" data-k="pick" checked> <strong>Keep this result</strong>${x.check ? ' <span class="chip gold">Check this</span>' : ""}</label>
              <div class="two">
                <label class="field"><span>Dance</span><select data-k="dance"><option value="">Choose…</option>${D.dances.map((d) => `<option value="${d.id}" ${x.dance === d.id ? "selected" : ""}>${esc(d.name)}</option>`).join("")}</select></label>
                <label class="field"><span>Level</span><select data-k="level"><option value="">Choose…</option>${orgLevels().map((l) => `<option value="${l.id}" ${x.level === l.id ? "selected" : ""}>${esc(l.name)}</option>`).join("")}</select></label>
              </div>
              <div class="two">
                <label class="field"><span>Place</span><input type="number" inputmode="numeric" min="1" max="200" data-k="place" value="${esc(x.place)}" placeholder="Not placed"></label>
                <label class="field"><span>Dancers in it</span><input type="number" inputmode="numeric" min="1" max="500" data-k="entrants" value="${esc(x.entrants)}" placeholder="optional"></label>
              </div>
              ${x.marks || x.recall ? `<div class="two"><label class="field"><span>Marks</span><input data-k="marks" value="${esc(x.marks)}" maxlength="30"></label><label class="toggle"><input type="checkbox" data-k="recall" ${x.recall ? "checked" : ""}> Recalled</label></div>` : ""}
              <p class="small muted" style="margin:4px 0 0">Read from: “${esc(x.line)}”</p>
            </div>`).join("")}
            <button type="button" class="btn block" id="saveFound">Save ${rows.length === 1 ? "this result" : "all " + rows.length + " results"}</button>
            <button type="button" class="btn ghost block" id="showManual" style="margin-top:6px">Add a result by hand instead</button>`;
          document.getElementById("showManual").addEventListener("click", () => { manual.hidden = false; manual.scrollIntoView({ behavior: "smooth" }); });
          el.querySelectorAll('[data-k="pick"]').forEach((c) => c.addEventListener("change", () => {
            const n = el.querySelectorAll('[data-k="pick"]:checked').length;
            document.getElementById("saveFound").textContent = n === 1 ? "Save this result" : n ? "Save " + n + " results" : "Nothing ticked";
          }));
          document.getElementById("saveFound").addEventListener("click", async () => {
            const date = f.date.value; const feis = String(f.feis.value || "").trim();
            if (!date) { toast("Add the date first"); f.date.focus(); return; }
            const picked = [];
            for (const row of el.querySelectorAll(".found-row")) {
              const g = (k) => row.querySelector(`[data-k="${k}"]`);
              if (!g("pick").checked) continue;
              if (!g("dance").value || !g("level").value) { toast("Choose the dance and level for each ticked result"); (g("dance").value ? g("level") : g("dance")).focus(); return; }
              picked.push({
                id: uid(), dancerId, date, feis, dance: g("dance").value, level: g("level").value,
                place: g("place").value ? Number(g("place").value) : "", entrants: g("entrants").value ? Number(g("entrants").value) : "",
                marks: g("marks") ? String(g("marks").value).trim() : "", recall: g("recall") ? g("recall").checked : false, notes: "", photoId: ""
              });
            }
            if (!picked.length) { toast("Tick at least one result"); return; }
            if (newPhoto) {
              const pid = "ph_" + picked[0].id + "_" + Date.now().toString(36);
              try { await photos.put(pid, newPhoto); picked.forEach((p) => { p.photoId = pid; }); }
              catch (err) { toast("Photo couldn't be saved, but the results were"); }
            }
            S.results.push(...picked);
            save(); toast(picked.length === 1 ? "Result saved" : picked.length + " results saved"); location.hash = "#/dancer/" + dancerId;
            cheer(dn, picked);
          });
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        f.addEventListener("submit", async (e) => {
          e.preventDefault();
          const fd = new FormData(f);
          const rec = {
            id: r.id || uid(), dancerId,
            date: fd.get("date"), feis: String(fd.get("feis") || "").trim(), dance: fd.get("dance"), level: fd.get("level"),
            place: fd.get("place") ? Number(fd.get("place")) : "", entrants: fd.get("entrants") ? Number(fd.get("entrants")) : "",
            marks: String(fd.get("marks") || "").trim(), recall: !!fd.get("recall"), notes: String(fd.get("notes") || "").trim(), photoId: r.photoId || ""
          };
          if (newPhoto) {
            const pid = "ph_" + rec.id + "_" + Date.now().toString(36);
            try { await photos.put(pid, newPhoto); releasePhoto(rec.photoId, rec.id); rec.photoId = pid; }
            catch (err) { toast("Photo couldn't be saved, but the result was"); }
          }
          const i = S.results.findIndex((x) => x.id === rec.id);
          if (i >= 0) S.results[i] = rec; else S.results.push(rec);
          save(); toast("Result saved"); location.hash = "#/dancer/" + dancerId;
          if (Number(r.place) !== 1) cheer(dn, [rec]);
        });
      }
    };
  };

  screens.result = function (id) {
    const r = S.results.find((x) => x.id === id);
    if (!r) return screens.scores();
    const d = danceById(r.dance); const l = levelById(r.level);
    return {
      title: d ? d.name : "Result", tab: "scores", back: true,
      html: `<div class="card result">${placeBadge(Number(r.place))}<div class="meta"><strong>${esc(r.feis || "Feis")}</strong><span class="small muted">${esc(fmtDate(r.date))}</span></div></div>
      <div class="card"><dl class="facts">
        <dt>Dance</dt><dd>${esc(d ? d.name : r.dance)}</dd>
        <dt>Level</dt><dd>${esc(l ? l.name : "")}</dd>
        <dt>Place</dt><dd>${r.place ? esc(ordinal(r.place)) : "Not placed"}${r.entrants ? ` of ${esc(r.entrants)}` : ""}</dd>
        ${r.marks ? `<dt>Marks</dt><dd>${esc(r.marks)}</dd>` : ""}
        ${r.recall ? `<dt>Recall</dt><dd>Yes ✨</dd>` : ""}
        ${r.notes ? `<dt>Notes</dt><dd>${esc(r.notes)}</dd>` : ""}
      </dl></div>
      ${r.photoId ? `<img class="photo-preview" data-photo="${esc(r.photoId)}" alt="Results photo" style="max-height:none">` : ""}
      <a class="btn ghost block" href="#/edit/${r.dancerId}/${r.id}" style="margin-top:10px">Edit</a>`
    };
  };

  screens.settings = function () {
    const p = S.profile;
    return {
      title: "Settings", tab: "", back: true,
      html: `<h2>Your dancer's world</h2>
      <p class="muted" style="margin-top:0">Set this once and the app shows the version that applies to you.</p>
      <form id="profForm" class="card">
        <label class="field"><span>Organization</span><select name="org"><option value="">Not sure yet</option>${ORGS.map((o) => `<option value="${o.id}" ${p.org === o.id ? "selected" : ""}>${esc(o.name)}</option>`).join("")}</select></label>
        <label class="field"><span>Country or region</span><select name="region"><option value="">Choose…</option>${D.regions.map((r) => `<option ${p.region === r ? "selected" : ""}>${esc(r)}</option>`).join("")}</select></label>
        <label class="field"><span>Main level right now</span><select name="level"><option value="">Not sure yet</option>${orgLevels().map((l) => `<option value="${l.id}" ${p.level === l.id ? "selected" : ""}>${esc(l.name)}</option>`).join("")}</select></label>
        <button class="btn block">Save</button>
      </form>

      <h2 style="margin-top:22px">Your saved results</h2>
      <p class="muted" style="margin-top:0">Results are kept only on this phone. Save a backup file now and then, so you don't lose them if you change phones.</p>
      <div class="card stack">
        <button class="btn ghost block" id="exportBtn">Save a backup file</button>
        <label class="btn ghost block" style="cursor:pointer">Restore from a backup file<input type="file" id="importFile" accept="application/json,.json" hidden></label>
        <p class="small muted" style="margin:0">Backups include results and checklist ticks, not photos.</p>
      </div>

      <h2 style="margin-top:22px">About</h2>
      <div class="card small"><p style="margin-top:0">Pocket Irish Dance is an independent guide for parents. It is not an official publication of any Irish dance organization. Always check important decisions with your teacher and the current official rules.</p>
      <p style="margin-bottom:0" class="muted">Version ${esc(D.version)}</p></div>`,
      after() {
        document.getElementById("profForm").addEventListener("submit", (e) => {
          e.preventDefault(); const fd = new FormData(e.target);
          viewOrg = ""; screens.schools.st = null; S.profile = { org: fd.get("org") || "", region: fd.get("region") || "", level: fd.get("level") || "" };
          screens.rules.f = null; save(); toast("Saved"); location.hash = "#/";
        });
        document.getElementById("exportBtn").addEventListener("click", () => {
          const blob = new Blob([JSON.stringify({ app: "pocket-irish-dance", saved: new Date().toISOString(), data: S }, null, 2)], { type: "application/json" });
          const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "irish-dance-backup-" + today() + ".json";
          document.body.appendChild(a); a.click(); a.remove();
        });
        document.getElementById("importFile").addEventListener("change", async (e) => {
          const file = e.target.files[0]; if (!file) return;
          try {
            const j = JSON.parse(await file.text()); const data = j.data || j;
            if (!Array.isArray(data.results) || !Array.isArray(data.dancers)) throw new Error("bad");
            S = Object.assign(blank(), data); save(); toast("Backup restored"); location.hash = "#/scores";
          } catch (err) { toast("That doesn't look like a backup file"); }
        });
      }
    };
  };

  // ---------- router ----------
  function route() {
    const h = location.hash.replace(/^#\/?/, "");
    const [path, qs] = h.split("?");
    const parts = path.split("/").filter(Boolean);
    const q = new URLSearchParams(qs || "").get("q") || "";
    let v;
    switch (parts[0]) {
      case undefined: v = screens.home(); break;
      case "search": v = screens.search(q); break;
      case "words": v = screens.words(); break;
      case "levels": v = screens.levels(); break;
      case "orgs": v = screens.orgs(); break;
      case "rules": v = screens.rules(); break;
      case "guide": v = parts[1] ? screens.checklist(parts[1]) : screens.guide(); break;
      case "scores": v = screens.scores(); break;
      case "dancer": v = parts[1] === "new" ? screens.dancerForm() : parts[2] === "edit" ? screens.dancerForm(parts[1]) : screens.dancer(parts[1]); break;
      case "add": v = screens.resultForm(parts[1]); break;
      case "edit": v = screens.resultForm(parts[1], parts[2]); break;
      case "result": v = screens.result(parts[1]); break;
      case "settings": v = screens.settings(); break;
      case "schools": v = screens.schools(); break;
      default: v = screens.home();
    }
    titleEl.textContent = v.title;
    document.title = v.title === "Pocket Irish Dance" ? v.title : v.title + " · Pocket Irish Dance";
    backBtn.hidden = !v.back;
    document.querySelectorAll(".tabbar a").forEach((a) => a.classList.toggle("on", a.dataset.tab === v.tab));
    app.innerHTML = (viewOrg && viewOrg !== S.profile.org ? `<div class="banner" style="margin-top:0">👀 You're looking at ${esc(orgName(viewOrg))}.<button class="btn sm" data-view-org="">Back to ${esc(orgName(S.profile.org))}</button></div>` : "") + v.html;
    if (v.after) v.after();
    loadPhotos();
    if (!route.keepScroll) window.scrollTo(0, 0);
    route.keepScroll = false;
    wireInstall();
  }
  function rerender() { route.keepScroll = true; route(); }

  function loadPhotos() {
    app.querySelectorAll("img[data-photo]").forEach((img) => {
      photos.get(img.dataset.photo).then((b) => { if (b) img.src = URL.createObjectURL(b); else img.remove(); }).catch(() => img.remove());
    });
  }

  // ---------- events ----------
  app.addEventListener("click", (e) => {
    const t = e.target.closest("button, [data-say]");
    if (!t) return;
    if (t.dataset.say) { e.preventDefault(); speak(t.dataset.say); return; }
    if (t.dataset.setOrg) { S.profile.org = t.dataset.setOrg; viewOrg = ""; screens.rules.f = null; screens.schools.st = null; save(); toast("Showing " + orgName(t.dataset.setOrg)); location.hash = "#/"; route(); return; }
    if (t.dataset.viewOrg !== undefined) { viewOrg = t.dataset.viewOrg; screens.schools.st = null; toast(viewOrg ? "Looking at " + orgName(viewOrg) : "Back to " + orgName(S.profile.org)); location.hash = "#/"; route(); return; }
    if (t.dataset.searchAll !== undefined) { screens.search.all = !!t.dataset.searchAll; rerender(); return; }
    if (t.dataset.schoolOrg !== undefined) { screens.schools.st = Object.assign(screens.schools.st || {}, { org: t.dataset.schoolOrg }); route(); return; }
    if (t.dataset.group) { screens.words.group = t.dataset.group; rerender(); return; }
    if (t.dataset.dview) { screens.dancer.view = t.dataset.dview; rerender(); return; }
    if (t.dataset.resetCheck) { Object.keys(S.checks).forEach((k) => { if (k.startsWith(t.dataset.resetCheck + ":")) delete S.checks[k]; }); save(); rerender(); return; }
    if (t.dataset.moveup) {
      const r = S.results.find((x) => x.id === t.dataset.moveup); const dn = r && S.dancers.find((d) => d.id === r.dancerId);
      const nx = r && nextLevel(r.level);
      if (dn && nx) {
        dn.levels = dn.levels || {};
        if (nx.perDance) dn.levels[r.dance] = nx.id; else dn.levels.champ = nx.id;
        save(); toast(`${dn.name} is now ${nx.name} in ${danceById(r.dance).name}`); rerender();
      }
      return;
    }
    if (t.dataset.dismiss) { S.dismissed[t.dataset.dismiss] = true; save(); rerender(); return; }
    if (t.dataset.delResult) {
      if (!confirm("Delete this result?")) return;
      const r = S.results.find((x) => x.id === t.dataset.delResult);
      S.results = S.results.filter((x) => x.id !== t.dataset.delResult); save(); toast("Deleted");
      if (r) releasePhoto(r.photoId);
      location.hash = "#/dancer/" + (r ? r.dancerId : "");
      return;
    }
    if (t.dataset.delDancer) {
      const id = t.dataset.delDancer; const dn = S.dancers.find((d) => d.id === id);
      if (!confirm(`Delete ${dn ? dn.name : "this dancer"} and all their results?`)) return;
      const gone = S.results.filter((x) => x.dancerId === id && x.photoId).map((x) => x.photoId);
      S.results = S.results.filter((x) => x.dancerId !== id); S.dancers = S.dancers.filter((d) => d.id !== id);
      gone.forEach((pid) => releasePhoto(pid));
      save(); toast("Deleted"); location.hash = "#/scores";
    }
  });

  app.addEventListener("change", (e) => {
    const t = e.target;
    if (t.dataset.check) { if (t.checked) S.checks[t.dataset.check] = true; else delete S.checks[t.dataset.check]; save(); t.closest(".check").classList.toggle("done", t.checked); }
    if (t.hasAttribute && t.hasAttribute("data-words-all")) { screens.words.allOrgs = t.checked; rerender(); return; }
    if (t.dataset.rf) { screens.rules.f[t.dataset.rf] = t.value; rerender(); }
  });

  app.addEventListener("submit", (e) => {
    const f = e.target.closest("[data-search]"); if (!f) return;
    e.preventDefault(); const q = f.q.value.trim();
    location.hash = "#/search?q=" + encodeURIComponent(q);
  });
  // Live search as you type on the search page and the Words page
  app.addEventListener("input", (e) => {
    const f = e.target.closest("[data-search]"); if (!f) return;
    const q = e.target.value;
    clearTimeout(app._st);
    app._st = setTimeout(() => {
      if (location.hash.startsWith("#/search")) {
        history.replaceState(null, "", "#/search?q=" + encodeURIComponent(q));
        const pos = e.target.selectionStart; rerender();
        const inp = app.querySelector("[data-search] input"); inp.focus(); try { inp.setSelectionRange(pos, pos); } catch (_) {}
      }
    }, 250);
  });

  backBtn.addEventListener("click", () => { if (history.length > 1) history.back(); else location.hash = "#/"; });
  window.addEventListener("hashchange", route);

  // ---------- install ----------
  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferredPrompt = e; wireInstall(); });
  function wireInstall() {
    const b = document.getElementById("installBtn"); if (!b) return;
    if (deferredPrompt) {
      b.hidden = false; const how = document.getElementById("installHow"); if (how) how.textContent = "Install it like an app. It works offline too.";
      b.onclick = async () => { deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; b.hidden = true; };
    }
  }

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }

  route();
})();
