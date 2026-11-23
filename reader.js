// Reads a results screenshot or photo on the phone and turns the text into suggested results.
// The reading engine (Tesseract, open source) is stored with the app in vendor/ocr,
// so the picture never leaves the phone. It's only downloaded the first time it's used.
(function (root) {
  "use strict";

  // ---------- reading the picture ----------
  let workerP = null;
  function abs(p) { return new URL(p, location.href).href.replace(/\/$/, ""); }

  function loadScript(src) {
    return new Promise((res, rej) => {
      if (root.Tesseract) return res();
      const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = () => rej(new Error("load"));
      document.head.appendChild(s);
    });
  }

  let progressCb = null;
  function getWorker() {
    if (!workerP) {
      workerP = loadScript("vendor/ocr/tesseract.min.js").then(() => root.Tesseract.createWorker("eng", 1, {
        workerPath: abs("vendor/ocr/worker.min.js"),
        corePath: abs("vendor/ocr/core"),
        langPath: abs("vendor/ocr/lang"),
        workerBlobURL: false,
        logger: (m) => { if (progressCb) progressCb(m); }
      })).catch((e) => { workerP = null; throw e; });
    }
    return workerP;
  }

  // Phone photos of paper sheets read better a bit larger and in grey.
  function prepare(file) {
    return new Promise((res) => {
      const img = new Image(); const url = URL.createObjectURL(file);
      img.onload = () => {
        const long = Math.max(img.width, img.height);
        const k = long < 1400 ? 1400 / long : long > 2800 ? 2800 / long : 1;
        const c = document.createElement("canvas"); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        const g = c.getContext("2d"); g.filter = "grayscale(1) contrast(1.2)"; g.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url); res(c);
      };
      img.onerror = () => { URL.revokeObjectURL(url); res(file); };
      img.src = url;
    });
  }

  async function readText(file, onProgress) {
    progressCb = (m) => {
      if (!onProgress) return;
      if (m.status === "recognizing text") onProgress("Reading the results…", m.progress);
      else onProgress("Getting the reader ready (only slow the first time)…", m.progress || 0);
    };
    onProgress && onProgress("Getting the reader ready (only slow the first time)…", 0);
    const w = await getWorker();
    const pic = await prepare(file);
    const { data } = await w.recognize(pic);
    progressCb = null;
    return data.text || "";
  }

  // ---------- understanding the text ----------
  const DANCES = [
    ["tradset", /\b(trad(itional)?\.?\s*set|set\s*dance|st\.?\s*patrick'?s\s*day|blackbird|job\s*of\s*journeywork|garden\s*of\s*daisies|king\s*of\s*the\s*fairies|jockey\s*to\s*the\s*fair|three\s*sea\s*captains)\b/],
    ["prelim", /\b(prelim(inary)?\.?\s*champ(ionship)?s?|prelim)\b/],
    ["open", /\b(open\s*champ(ionship)?s?)\b/],
    ["treblejig", /\b(treble\s*jig|t\.?\s*jig|heavy\s*jig)\b/],
    ["lightjig", /\b(light\s*jig|l\.?\s*jig)\b/],
    ["slipjig", /\b(slip\s*jig|s\.?\s*jig)\b/],
    ["singlejig", /\b(single\s*jig|hop\s*jig)\b/],
    ["hornpipe", /\b(horn\s*pipe|hpipe|h\.?\s*pipe)\b/],
    ["reel", /(?<!treble\s)(?<!treble)\breel\b/],
    // Short forms some results sites use
    ["lightjig", /\b(lj|lt\.?\s*jig)\b/], ["slipjig", /\b(sj)\b/], ["treblejig", /\b(tj|trbl\.?\s*jig)\b/],
    ["hornpipe", /\b(hp|hrnpipe)\b/], ["singlejig", /\b(sgl\.?\s*jig)\b/], ["tradset", /\b(ts|tset)\b/],
    ["lightjig", /\bjig\b/]
  ];

  // Extra spellings seen on results sites, by level id. Each level's own name is added too.
  const LEVEL_WORDS = {
    b1: ["beginner 1", "beginner i", "beginner one", "first feis", "bun grad", "beginner", "beg 1", "beg"],
    b2: ["beginner 2", "beginner ii", "beginner two", "advanced beginner", "adv beginner", "adv. beginner", "adv beg", "tus grad", "beg 2"],
    novice: ["novice", "nov"],
    pw: ["open prizewinner", "prizewinner", "prize winner", "prizewinners", "pw"],
    pc: ["preliminary championship", "prelim championship", "prelim champ", "prelim", "pc"],
    oc: ["open championship", "open champ", "oc"],
    w_b: ["beginner", "beg"], w_p: ["primary"], w_i: ["intermediate", "inter"], w_o: ["open"],
    w_pc: ["preliminary championship", "prelim champ", "prelim"], w_oc: ["open championship", "open champ"],
    ac_a: ["beginners a", "beginner a", "beg a"], ac_b: ["beginners b", "beginner b", "beg b"], ac_c: ["beginners c", "beginner c", "beg c"],
    ac_po: ["pre-open", "pre open", "preopen"], ac_open: ["open"], ac_ch: ["championship", "champ"]
  };

  const WORD_PLACES = { first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8, ninth: 9, tenth: 10 };
  const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  function clean(line) {
    return line.toLowerCase()
      .replace(/[|]/g, " ").replace(/[‘’`]/g, "'").replace(/[–—]/g, "-")
      .replace(/(\d)\s+(st|nd|rd|th)\b/g, "$1$2")        // "1 st" -> "1st"
      .replace(/\b[il](st)\b/g, "1$1")                    // "lst" -> "1st"
      .replace(/\s+/g, " ").trim();
  }

  function findDance(l) {
    for (const [id, re] of DANCES) { const m = l.match(re); if (m) return { id, guess: re.source === "\\bjig\\b" || /^\\b\(\w\w\)/.test(re.source), text: m[0] }; }
    return null;
  }

  function levelMatcher(levels) {
    const list = [];
    levels.forEach((lv) => {
      const words = new Set([(lv.name || "").toLowerCase()].concat(LEVEL_WORDS[lv.id] || []));
      words.forEach((w) => { if (w) list.push({ id: lv.id, w, re: new RegExp("(^|[^a-z0-9-])" + esc(w) + "(?![a-z0-9])") }); });
    });
    list.sort((a, b) => b.w.length - a.w.length);
    return (l) => { for (const x of list) if (x.re.test(l)) return x.id; return ""; };
  }

  function findPlace(l, danceText) {
    let m;
    if (/\b(not placed|no place|unplaced|n\/p|dnp|np)\b/.test(l)) return { place: "", sure: true, np: true };
    if ((m = l.match(/\bplace[ds]?\s*:?\s*#?\s*(\d{1,3})\b/))) return { place: +m[1], sure: true };
    if ((m = l.match(/\b(\d{1,3})(st|nd|rd|th)\b/))) return { place: +m[1], sure: true };
    if ((m = l.match(/\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)\b/))) return { place: WORD_PLACES[m[1]], sure: true };
    // Otherwise: a small number after the dance name that isn't an age, a year, or the competition number.
    const after = danceText ? l.slice(l.indexOf(danceText) + danceText.length) : l;
    const nums = [...after.matchAll(/(^|[^a-z0-9.\/:-])(\d{1,2})(?![\d.:\/-])/g)]
      .filter((x) => !/(u|under|o|over|age|ages)\s*$/.test(after.slice(0, x.index + x[1].length)))
      .map((x) => +x[2]).filter((n) => n >= 1 && n <= 60);
    if (nums.length) return { place: nums[0], sure: false };
    return null;
  }

  function findEntrants(l) {
    let m;
    if ((m = l.match(/\b(?:of|out of)\s*(\d{1,3})\b/))) return +m[1];
    if ((m = l.match(/\b\d{1,3}(?:st|nd|rd|th)?\s*\/\s*(\d{1,3})\b/))) return +m[1];
    if ((m = l.match(/\b(\d{1,3})\s*(?:dancers|competitors|entrants|entries|danced)\b/))) return +m[1];
    return "";
  }

  function findMarks(l) {
    const m = l.match(/\b(?:score|marks?|points|pts|total)\s*:?\s*(\d{1,4}(?:\.\d{1,2})?)\b/) || l.match(/\b(\d{2,3}\.\d{1,2})\b/);
    return m ? m[1] : "";
  }

  function findDate(text) {
    const t = text.toLowerCase();
    let m;
    if ((m = t.match(/\b(20\d\d)-(\d\d)-(\d\d)\b/))) return `${m[1]}-${m[2]}-${m[3]}`;
    const mon = "(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\\.?";
    if ((m = t.match(new RegExp("\\b" + mon + "\\s+(\\d{1,2})(?:st|nd|rd|th)?,?\\s+(20\\d\\d)\\b"))))
      return iso(+m[3], MONTHS.indexOf(m[1]) + 1, +m[2]);
    if ((m = t.match(new RegExp("\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(?:of\\s+)?" + mon + ",?\\s+(20\\d\\d)\\b"))))
      return iso(+m[3], MONTHS.indexOf(m[2]) + 1, +m[1]);
    if ((m = t.match(/\b(\d{1,2})[\/.](\d{1,2})[\/.](20\d\d|\d\d)\b/))) {
      let a = +m[1], b = +m[2]; const y = m[3].length === 2 ? 2000 + +m[3] : +m[3];
      const us = /^en-(us|ca)/i.test((typeof navigator !== "undefined" && navigator.language) || "en-US");
      let mo = us ? a : b, d = us ? b : a;
      if (mo > 12 && d <= 12) [mo, d] = [d, mo];
      return iso(y, mo, d);
    }
    return "";
  }
  function iso(y, mo, d) {
    if (!(mo >= 1 && mo <= 12 && d >= 1 && d <= 31)) return "";
    return `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }

  function findFeis(lines) {
    for (const raw of lines) {
      const l = raw.toLowerCase();
      if (/\b(feis|feiseanna|oireachtas|feile|f[eé]ile|championships?|festival|classic)\b/.test(l) && !findDance(l) && raw.length < 70 && !/\bresults?\s*$/.test(l)) {
        return raw.replace(/\b(results?|my results)\b/ig, "").replace(/[^\p{L}\p{N}' &.-]/gu, " ").replace(/\s+/g, " ").trim();
      }
    }
    return "";
  }

  // "Adjudicator: Mary Smith", "Judges: A. Byrne, C. Walsh", "Judge 2 - Sean Kelly 78"
  const NOT_NAMES = /^(place|placing|score|scores|marks?|points|comp|competition|result|results|name|dancer|school|total|rank|age|level|dance)$/i;
  function findJudges(raw) {
    const m = raw.match(/\b(adjudicators?|judges?|adj)\b\.?\s*(?:#?\d\s*)?(?:[:\-–=]|\s)\s*(.*)$/i);
    if (!m) return null;
    const out = [];
    m[2].split(/\s*(?:,|;|&|\/|\band\b|\|)\s*/i).forEach((part) => {
      const sc = part.match(/(\d{1,3}(?:\.\d{1,2})?)\s*$/);
      const name = part.replace(/(\d{1,3}(?:\.\d{1,2})?)\s*$/, "").replace(/[^\p{L}' .-]/gu, " ").replace(/\s+/g, " ").trim();
      if (name.length >= 3 && /\p{L}{2}/u.test(name) && !NOT_NAMES.test(name)) out.push({ name, marks: sc ? sc[1] : "" });
    });
    return out.length ? out : null;
  }

  // text: what was read. ctx.levels: this organization's levels.
  function parse(text, ctx) {
    const lines = String(text || "").split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    const levelOf = levelMatcher((ctx && ctx.levels) || []);
    const found = [];
    const judgeAt = lines.map(findJudges);
    let current = null;
    // Is the judge named above each group of results, or underneath each result?
    const firstJudge = judgeAt.findIndex(Boolean);
    const firstDance = lines.findIndex((x) => findDance(clean(x)));
    const judgeAbove = firstJudge >= 0 && firstJudge < firstDance;
    for (let i = 0; i < lines.length; i++) {
      const l = clean(lines[i]);
      const d = findDance(l);
      if (!d) { if (judgeAt[i]) current = judgeAt[i]; continue; }
      let judges = judgeAt[i];
      let level = levelOf(l);
      let p = findPlace(l, d.text);
      let entrants = findEntrants(l), marks = findMarks(l), recall = /\brecall(ed)?\b/.test(l);
      // Card layouts put the place on the next line or two.
      for (let j = i + 1; j <= i + 2 && j < lines.length; j++) {
        const n = clean(lines[j]); if (findDance(n)) break;
        if (!p || !p.sure) { const np = findPlace(n.replace(/\b\d{1,3}\s*(dancers|competitors|entrants|entries|danced)\b/, ""), ""); if (np && (np.sure || !p)) p = np; }
        if (!entrants) entrants = findEntrants(n);
        if (!marks) marks = findMarks(n);
        if (!level) level = levelOf(n);
        recall = recall || /\brecall(ed)?\b/.test(n);
        if (!judges && !judgeAbove && judgeAt[j]) judges = judgeAt[j];
      }
      if (judgeAbove) judges = judges || current;
      // Championship lines name the level; the dance is the championship itself.
      if (!level && (d.id === "prelim" || d.id === "open")) level = levelOf(d.text);
      found.push({
        dance: d.id, level, place: p ? p.place : "", entrants, marks, recall, judges: judges || [],
        check: !p || !p.sure || d.guess || !level,
        line: lines[i]
      });
    }
    // Judges listed only after the results belong to all of them.
    const later = judgeAt.find(Boolean);
    if (later) found.forEach((x) => { if (!x.judges.length) x.judges = later; });
    return { results: found, date: findDate(text), feis: findFeis(lines), text: lines.join("\n") };
  }

  root.PID_READER = { readText, parse };
  if (typeof module !== "undefined") module.exports = { parse };
})(typeof window !== "undefined" ? window : globalThis);
