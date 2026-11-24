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
    ["set", /\b(own\s*choice(\s*set)?|non[\s-]*trad(itional)?\.?\s*set|open\s*set|contemporary\s*set)\b/],
    ["tradset", /\b(trad(itional)?\.?\s*set|st\.?\s*patrick'?s\s*day|blackbird|job\s*of\s*journeywork|garden\s*of\s*daisies|king\s*of\s*the\s*fairies|jockey\s*to\s*the\s*fair|three\s*sea\s*captains)\b/],
    ["prelim", /\b(prelim(inary)?\.?\s*champ(ionship)?s?|prelim)\b/],
    ["open", /\b(open\s*champ(ionship)?s?)\b/],
    ["treblejig", /\b(treble\s*jig|t\.?\s*jig|heavy\s*jig)\b/],
    ["lightjig", /\b(light\s*jig|l\.?\s*jig)\b/],
    ["slipjig", /\b(slip\s*jig|s\.?\s*jig)\b/],
    ["singlejig", /\b(single\s*jig|hop\s*jig)\b/],
    ["hornpipe", /\b(horn\s*pipe|hompipe|hornplpe|hpipe|h\.?\s*pipe)\b/],
    ["reel", /(?<!treble\s)(?<!treble)\breel\b/],
    ["set", /\bset\s*dance\b|\bset\b(?!\s*\d)/],
    // Short forms some results sites use
    ["lightjig", /\b(lj|lt\.?\s*jig)\b/], ["slipjig", /\b(sj)\b/], ["treblejig", /\b(tj|trbl\.?\s*jig)\b/],
    ["hornpipe", /\b(hp|hrnpipe)\b/], ["singlejig", /\b(sgl\.?\s*jig)\b/], ["tradset", /\b(ts|tset)\b/],
    // FeisWorx competition codes: 511TJ, 511HP, 511RL2...
    ["treblejig", /\b\d{2,4}tj\d?\b/], ["hornpipe", /\b\d{2,4}hp\d?\b/], ["reel", /\b\d{2,4}rl\d?\b/],
    ["slipjig", /\b\d{2,4}sj\d?\b/], ["lightjig", /\b\d{2,4}lj\d?\b/], ["tradset", /\b\d{2,4}ts\d?\b/],
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
      .replace(/\bp[nr]?[iln]?ze\s*winner/g, "prizewinner")  // "Pnzewinner", "Przewinner"
      .replace(/\bt[rn]?[e3c][bh8][l1i!|][e3c]\b/g, "treble")   // "Trebie", "Treb1e", "Trehle"
      .replace(/\b(treble|slip|light|single|hop|heavy)\s*j[il1!|]?[gq9]\b/g, "$1 jig") // "Jg", "J1g", "Jlg"
      .replace(/\bsl[il1!|]p\b/g, "slip")
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

  // Several judges' marks on one line: "85, 82, 80"
  function scoreList(l) {
    const m = l.match(/(?:^|[\s(])(\d{2,3}(?:\.\d{1,2})?(?:\s*[,;\/]\s*\d{2,3}(?:\.\d{1,2})?){1,5})(?![\d.])/);
    if (!m) return null;
    const xs = m[1].split(/\s*[,;\/]\s*/).map(Number);
    return xs.every((n) => n >= 20 && n <= 100) ? xs : null;
  }
  // Words written after the last number on a results line are the judge's comments:
  // "... (3) 85, 82, 80 NICE LEG EXTENSION; HIGHER UP ON TOES"
  function trailingComment(raw) {
    const m = raw.match(/\d[\d.,;\s)\]]*\s+([A-Za-z\u00c0-\u024f][^\d]{7,})$/);
    if (!m) return "";
    const t = m[1].replace(/^[\s|:;,.)\]-]+|[\s|]+$/g, "").trim();
    if (t.split(/\s+/).length < 2 || findDance(clean(t)) || /\b(recall(ed)?|not placed|no place|dancers|competitors|entrants|of)\b/i.test(t)) return "";
    // Shouted capitals read better as a sentence.
    const out = t === t.toUpperCase() ? t.toLowerCase().replace(/(^|[.;!?]\s*)([a-z])/g, (a, b, c) => b + c.toUpperCase()) : t;
    return out.slice(0, 500);
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
      if (/\b(feis|feiseanna|oireachtas|feile|f[eé]ile|championships?|festival|classic)\b/.test(l) && !findDance(l) && raw.length < 70 && !/\bresults?\s*$/.test(l) && !/\b(your place|your score|adjudicator|competition|dancers)\b/.test(l)) {
        return raw.replace(/\b(results?|my results)\b/ig, "").replace(/[^\p{L}\p{N}' &.-]/gu, " ").replace(/\s+/g, " ").trim();
      }
    }
    return "";
  }

  // "Adjudicator: Mary Smith", "Judges: A. Byrne, C. Walsh", "Judge 2 - Sean Kelly 78"
  const NOT_NAMES = /^(place|placing|score|scores|marks?|points|comp|competition|result|results|name|dancer|school|total|rank|age|level|dance|comments?|remarks?|notes?|sheet|panel)$/i;
  // "Adjudicator", plus the ways the reader often gets it slightly wrong (Adjudlcator, Adjudicat0r),
  // "Judge", "Judged by", "Adj." and "Examiner".
  const JUDGE_LABEL = /\b(adj[a-z0-9]{0,10}?(?:\(s\))?|judge[ds]?(?:\s+by)?|examiner)\b\.?\s*(?:#?\d\s*)?(?:name)?\s*(?:[:\-–=]|\s)\s*(.*)$/i;
  const LABEL_ONLY = /^\W*(adj[a-z0-9]{0,10}(?:\(s\))?|judge[ds]?(?:\s+by)?|examiner)\W*(name)?\W*$/i;
  // Letters after a teacher's or judge's name: ADCRG, TCRG, SDCRG, BDCRG, TMRF...
  const QUALS = /\b(A|S|B|T)?D?CRG\b|\bTMRF\b|\bADCRG\b|\bTCRG\b/g;
  function findJudges(raw) {
    const m = raw.replace(QUALS, " ").match(JUDGE_LABEL);
    if (!m || /^adjust/i.test(m[1])) return null;
    const out = [];
    m[2].split(/\s*(?:,|;|&|\/|\band\b|\|)\s*/i).forEach((part) => {
      const sc = part.match(/(\d{1,3}(?:\.\d{1,2})?)\s*$/);
      const name = part.replace(/(\d{1,3}(?:\.\d{1,2})?)\s*$/, "").replace(/[^\p{L}' .-]/gu, " ").replace(/\s+/g, " ").trim();
      if (name.length >= 3 && /\p{L}{2}/u.test(name) && !NOT_NAMES.test(name)) out.push({ name, marks: sc ? sc[1] : "" });
    });
    return out.length ? out : null;
  }

  // ---------- championships ----------
  // A championship is one competition with an overall place from the whole panel, plus a
  // placing for each round from the one judge picked for that round.
  const ROUND_RE = /\b(?:round|rnd|rd)\s*\.?\s*#?\s*([1-3])\b|(?:^|\s)r([1-3])\b/;
  function ordNum(t) {
    let m;
    if ((m = t.match(/\b(\d{1,3})(?:st|nd|rd|th)\b/))) return +m[1];
    if ((m = t.match(/\bplace[ds]?\s*:?\s*(\d{1,3})\b/))) return +m[1];
    if ((m = t.match(/(?:^|[\s:=(-])(\d{1,3})(?![\d.])/))) return +m[1] <= 200 ? +m[1] : "";
    return "";
  }
  function roundsIn(raw) {
    const l = clean(raw);
    // Compact: "R1 1st R2 3rd R3 3rd"
    const many = [...l.matchAll(/\b(?:round|rnd|rd|r)\s*\.?\s*([1-3])\s*[:=-]?\s*(\d{1,3})(?:st|nd|rd|th)?\b/g)];
    if (many.length > 1) return many.map((m) => ({ n: +m[1], place: +m[2], judge: "" }));
    const m = l.match(ROUND_RE); if (!m) return null;
    const n = +(m[1] || m[2]);
    // Work on the original text after "Round 1" so names keep their capitals.
    const idx = raw.toLowerCase().search(/\b(round|rnd|rd)\s*\.?\s*#?\s*[1-3]\b|(^|\s)r[1-3]\b/);
    let rest = raw.slice(idx).replace(/^\s*(round|rnd|rd|r)\s*\.?\s*#?\s*[1-3]/i, "");
    rest = rest.replace(/\((soft|hard|heavy|light)\s*shoe\)|\b(soft|hard|heavy)\s*shoe\b|\b(reel|slip jig|treble jig|hornpipe|set dance|set|jig)\b/ig, " ");
    const place = ordNum(clean(rest));
    const js = findJudges(rest);
    let judge = js ? js[0].name : rest.replace(/\b\d{1,3}(st|nd|rd|th)?\b|\b(place[ds]?|placing|judge[ds]?|adjudicator|adj|of)\b|[^\p{L}' .-]/giu, " ").replace(/\s+/g, " ").trim().replace(/^[\s.'-]+|[\s'-]+$/g, "");
    if (!/\p{L}{2,}.*\s.*\p{L}|\p{L}\.\s*\p{L}{2,}/u.test(judge)) judge = "";
    return [{ n, place, judge }];
  }

  // text: what was read. ctx.levels: this organization's levels.
  // ---------- FeisWorx "Personal Solo Results" ----------
  // Each result is two rows:
  //   Cherokee Capital Feis - 2026 | 2 | 82 | Iris Gray Sharnick, ADCRG      (feis, place, your score, judge)
  //   511RL Prizewinner, Reel (U11) | 9 (3) | 85, 82, 80 | NICE LEG EXTENSION (dance, dancers (places given), top scores, comments)
  // The reader often drops decimal points (72.5 -> 725), so scores over 100 get them back.
  function fixScore(t) {
    const n = Number(String(t).replace(",", "."));
    if (!isFinite(n)) return "";
    if (n > 100 && /^\d{3}$/.test(t)) return String(n / 10);
    if (n > 100 && /^\d{4}$/.test(t)) return String(n / 100);
    return n >= 20 && n <= 100 ? String(n) : "";
  }
  function fwTop(raw) {
    const m = raw.match(/^[^a-z]*([a-z][a-z' .&-]*?\s*[-–]?\s*(20\d\d))[\s|\[\]:;'"`*.-]*(did\s*not\s*place|dnp|\d{1,3})[\s|\[\]:;'"`*-]+(\d{2,4}(?:[.,]\d{1,2})?)[\s|\[\]:;'"`*-]+([a-z].+)$/i);
    if (!m) return null;
    const judge = m[5].replace(QUALS, " ").split(",")[0].replace(/[^\p{L}' .-]/gu, " ").replace(/\s+/g, " ").trim();
    return {
      feis: m[1].replace(/\s*[-–]\s*(20\d\d)$/, " - $1").replace(/\s+/g, " ").trim(),
      place: /^\d/.test(m[3]) ? +m[3] : "", np: !/^\d/.test(m[3]),
      marks: fixScore(m[4]),
      judges: judge.split(" ").length >= 2 && /\p{L}{2}/u.test(judge) ? [{ name: judge, marks: "" }] : []
    };
  }
  // When the top row is too garbled for fwTop, still rescue what we can: the judge before ", ADCRG",
  // "Did Not Place", and the feis name.
  function fwTopLoose(raw) {
    if (!/\b20\d\d\b/.test(raw) && !/[a-z]{2}\s*,?\s*[a-z]?d?c?r\s*g\b/i.test(raw)) return null;
    raw = raw.replace(/did\s*not\s*place/i, " dnp ");
    const jm = raw.match(/([A-Z][\p{Ll}'’.-]+(?:\s+[A-Z][\p{Ll}'’.-]+){1,3})\s*[,.]?\s*(?:A|S|B|T)?D?C?R\s*[G6]\b/u);
    if (!jm) return null;
    const fm = raw.match(/^[^a-z]*([a-z][a-z' .&-]*?\s*[-–]?\s*20\d\d)/i);
    const after = fm ? raw.slice(raw.indexOf(fm[1]) + fm[1].length, raw.indexOf(jm[1])) : "";
    const np = /\bdnp\b/.test(after);
    const nums = after.match(/\d{1,4}(?:[.,]\d{1,2})?/g) || [];
    let place = "", marks = "";
    if (np) marks = nums.length ? fixScore(nums[nums.length - 1]) : "";
    else if (nums.length >= 2) { place = +nums[0] <= 200 ? +nums[0] : ""; marks = fixScore(nums[nums.length - 1]); }
    return { feis: fm ? fm[1].replace(/\s*[-–]?\s*(20\d\d)$/, " - $1").trim() : "", place, np, marks, judges: [{ name: jm[1].trim(), marks: "" }], loose: true };
  }
  // Names read slightly differently on different rows ("Iris Gray Shamick") are the same judge:
  // use the spelling seen most often on the sheet, or one already saved in the app.
  function tidyJudgeNames(found, known) {
    const count = {};
    found.forEach((x) => x.judges.forEach((j) => { count[j.name] = (count[j.name] || 0) + 1; }));
    const byCount = Object.keys(count).sort((a, b) => count[b] - count[a]);
    const close = (a, b) => editDist(squash(a), squash(b)) <= Math.max(2, Math.floor(squash(b).length / 6));
    found.forEach((x) => x.judges.forEach((j) => {
      const saved = (known || []).find((k) => k !== j.name && close(j.name, k));
      const common = byCount.find((n) => n !== j.name && count[n] > count[j.name] && close(j.name, n));
      if (saved) j.name = saved; else if (common) j.name = common;
    }));
  }
  function fwBottom(raw) {
    const after = raw.replace(/^.*?\((?:u|o|under|over)\s*\d{1,2}\)\s*\)?/i, "");
    let m = after.match(/(?:^|\s)(\d{1,2})\s*\((\d{1,2})\)/) || after.match(/(?:^|\s)(\d)\(?(\d)\)/);
    const entrants = m ? +m[1] : "";
    const rest = m ? after.slice(after.indexOf(m[0]) + m[0].length) : after;
    // Comments are the words after the last number on the row.
    const c = rest.match(/^[^A-Za-z\u00c0-\u024f]*([A-Za-z\u00c0-\u024f][^\d]*)$/) || rest.match(/\d[^A-Za-z\u00c0-\u024f\d]*([A-Za-z\u00c0-\u024f][^\d]*)$/);
    let note = c ? c[1].replace(/[\s|:;,.]+$/, "").trim() : "";
    if (note.length < 3 || !/[a-z]{3}/i.test(note)) note = "";
    if (note && note === note.toUpperCase()) note = note.toLowerCase().replace(/(^|[.;!?]\s*)([a-z])/g, (a, b, ch) => b + ch.toUpperCase());
    return { entrants, note: note.slice(0, 500) };
  }
  function editDist(a, b) {
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }
  // "Rea Fern Feis - 2026" and "Red Fem Fors 2026" are misreads of "Red Fern Feis - 2026": use the most common spelling.
  const squash = (t) => t.toLowerCase().replace(/[^a-z0-9]/g, "");
  function tidyFeisNames(found) {
    const count = {}; found.forEach((x) => { if (x.feis) count[x.feis] = (count[x.feis] || 0) + 1; });
    const names = Object.keys(count).sort((a, b) => count[b] - count[a]);
    found.forEach((x) => {
      if (!x.feis) return;
      const best = names.find((n) => count[n] > (count[x.feis] || 0) && editDist(squash(n), squash(x.feis)) <= Math.max(3, squash(n).length / 3));
      if (best) x.feis = best;
    });
  }

  // "Comments: Lovely timing, watch your turnout" (and the lines after it, until the next heading)
  const COMMENT_LABEL = /^\W*(adjudicator'?s?\s+)?(comments?|remarks?|notes?|feedback|critique)\b\s*[:\-–]?\s*(.*)$/i;
  function parse(text, ctx) {
    const raw = String(text || "").split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    // A label on its own line ("Adjudicator") with the name on the next line.
    const lines = [];
    for (let i = 0; i < raw.length; i++) {
      if (LABEL_ONLY.test(raw[i]) && raw[i + 1] && !findDance(clean(raw[i + 1]))) { lines.push(raw[i].replace(/\W*$/, "") + ": " + raw[i + 1]); i++; }
      else lines.push(raw[i]);
    }
    // Comments: pull them out, remembering which line they came after.
    const comments = []; const isComment = lines.map(() => false);
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(COMMENT_LABEL); if (!m) continue;
      const parts = [m[3]]; isComment[i] = true;
      for (let j = i + 1; j < lines.length && j <= i + 6; j++) {
        if (findDance(clean(lines[j])) || findJudges(lines[j]) || COMMENT_LABEL.test(lines[j]) || /^\W*(round|overall|place|score|total)\b/i.test(lines[j])) break;
        parts.push(lines[j]); isComment[j] = true;
      }
      const t = parts.join(" ").replace(/\s+/g, " ").trim();
      if (t.length > 2) comments.push({ at: i, text: t.slice(0, 500) });
    }
    const levelOf = levelMatcher((ctx && ctx.levels) || []);
    const found = [];
    const judgeAt = lines.map(findJudges);
    let current = null;
    // Is the judge named above each group of results, or underneath each result?
    const firstJudge = judgeAt.findIndex(Boolean);
    const firstDance = lines.findIndex((x, n) => !isComment[n] && findDance(clean(x)));
    const fwSheet = /your\s*place|top\s*scores|max\s*place|feisworx/i.test(text) || lines.filter((x) => fwTop(x)).length >= 2;
    const judgeAbove = firstJudge >= 0 && firstJudge < firstDance;
    for (let i = 0; i < lines.length; i++) {
      if (isComment[i]) continue;
      const l = clean(lines[i]);
      const d = findDance(l);
      if (!d) { if (judgeAt[i]) current = judgeAt[i]; continue; }
      let judges = judgeAt[i];
      if (d.id === "prelim" || d.id === "open") {
        // Read the whole championship block: rounds, overall, panel.
        const ch = { dance: d.id, level: levelOf(l) || levelOf(d.text), place: "", entrants: findEntrants(l), marks: findMarks(l), recall: /\brecall(ed)?\b/.test(l), judges: judges || [], rounds: [], line: lines[i] };
        let sure = false, j = i;
        const ov0 = l.match(/\b(?:overall|final|result)\s*(?:place|placing)?\s*:?\s*(\d{1,3})(?:st|nd|rd|th)?\b/);
        if (ov0) { ch.place = +ov0[1]; sure = true; }
        for (j = i + 1; j < lines.length && j <= i + 12; j++) {
          const n = clean(lines[j]);
          const rr = roundsIn(lines[j]);
          if (rr) { rr.forEach((x) => { if (!ch.rounds.some((y) => y.n === x.n)) ch.rounds.push(x); }); }
          const ov = n.match(/\b(?:overall|final|result)\s*(?:place|placing)?\s*:?\s*(\d{1,3})(?:st|nd|rd|th)?\b/);
          if (ov) { ch.place = +ov[1]; sure = true; }
          if (!rr && findDance(n)) break;
          if (!ch.entrants) ch.entrants = findEntrants(n);
          if (!ch.marks) { const mk = n.match(/\b(?:overall|total|irish points|score)\s*(?:score|points)?\s*:?\s*(\d{1,4}(?:\.\d{1,2})?)\b/); if (mk) ch.marks = mk[1]; else if (!rr && !judgeAt[j]) ch.marks = findMarks(n); }
          ch.recall = ch.recall || /\brecall(ed)?\b/.test(n);
          if (!ch.level) ch.level = levelOf(n);
          if (judgeAt[j] && !rr) ch.judges = judgeAt[j];
          if (!sure && !rr && !judgeAt[j]) { const p2 = findPlace(n.replace(/\b\d{1,3}\s*(dancers|competitors|entrants|entries|danced)\b/, ""), ""); if (p2 && p2.sure) { ch.place = p2.place; sure = true; } }
        }
        if (!sure) { const p0 = findPlace(l, d.text); if (p0) { ch.place = p0.place; sure = p0.sure; } }
        if (!ch.judges.length && judgeAbove && current) ch.judges = current;
        // Round judges are on the panel too.
        ch.rounds.sort((a, b) => a.n - b.n).forEach((x) => { if (x.judge && !ch.judges.some((y) => y.name.toLowerCase() === x.judge.toLowerCase())) ch.judges = ch.judges.concat([{ name: x.judge, marks: "" }]); });
        ch.check = !sure || !ch.level;
        found.push(ch);
        i = j - 1;
        continue;
      }
      // The top row is just above; a line of screen noise can sit between them.
      const prev2ok = i > 1 && !findDance(clean(lines[i - 1]));
      let top = (i > 0 && fwTop(lines[i - 1])) || (prev2ok && fwTop(lines[i - 2])) || null;
      // On a FeisWorx sheet (or a row that looks like one), fall back to the loose reader.
      if (!top && (fwSheet || /\(\s*u\s*\d{1,2}\s*\)/i.test(lines[i]))) top = (i > 0 && fwTopLoose(lines[i - 1])) || (prev2ok && fwTopLoose(lines[i - 2])) || null;
      if (top) {
        const bot = fwBottom(lines[i]);
        found.push({ dance: d.id, level: levelOf(l), place: top.place, entrants: bot.entrants, marks: top.marks, recall: false,
          judges: top.judges, rounds: [], note: bot.note, feis: top.feis, check: !levelOf(l) || d.guess || (!top.place && !top.np) || !!top.loose, line: lines[i] });
        continue;
      }
      const note = trailingComment(lines[i]);
      const lineNoNote = note ? clean(lines[i].slice(0, lines[i].length - (lines[i].match(/\s+[A-Za-z\u00c0-\u024f][^\d]{7,}$/) || [""])[0].length)) : l;
      let level = levelOf(lineNoNote);
      let p = findPlace(lineNoNote, d.text);
      const list = scoreList(lineNoNote);
      let entrants = findEntrants(lineNoNote), marks = list ? list.join(", ") : findMarks(lineNoNote), recall = /\brecall(ed)?\b/.test(lineNoNote);
      // Card layouts put the place on the next line or two.
      for (let j = i + 1; j <= i + 2 && j < lines.length; j++) {
        const n = clean(lines[j]); if (findDance(n)) break;
        if (!p || !p.sure) { const np = findPlace(n.replace(/\b\d{1,3}\s*(dancers|competitors|entrants|entries|danced)\b/, ""), ""); if (np && (np.sure || !p)) p = np; }
        if (!entrants) entrants = findEntrants(n);
        if (!marks && !list) marks = findMarks(n);
        if (!level) level = levelOf(n);
        recall = recall || /\brecall(ed)?\b/.test(n);
        if (!judges && !judgeAbove && judgeAt[j]) judges = judgeAt[j];
      }
      if (judgeAbove) judges = judges || current;
      // Championship lines name the level; the dance is the championship itself.
      if (!level && (d.id === "prelim" || d.id === "open")) level = levelOf(d.text);
      // One mark per judge, in the order the judges are listed.
      if (list && judges && judges.length === list.length) judges = judges.map((jj, n) => ({ name: jj.name, marks: String(list[n]) }));
      found.push({
        dance: d.id, level, place: p ? p.place : "", entrants, marks, recall, judges: judges || [], rounds: [], note,
        check: !p || !p.sure || d.guess || !level,
        line: lines[i]
      });
    }
    // Judges listed only after the results belong to all of them.
    const later = judgeAt.find(Boolean);
    if (later) found.forEach((x) => { if (!x.judges.length) x.judges = later; });
    // Each comment goes with the result just above it; comments above every result go with all of them.
    const starts = found.map((x) => lines.indexOf(x.line));
    found.forEach((x) => { x.notes = x.note || ""; delete x.note; });
    tidyFeisNames(found);
    tidyJudgeNames(found, ctx && ctx.judges);
    comments.forEach((c) => {
      let k = -1; starts.forEach((st, n) => { if (st >= 0 && st < c.at) k = n; });
      const add = (x) => { x.notes = x.notes ? x.notes + " " + c.text : c.text; };
      if (k >= 0) add(found[k]); else found.forEach(add);
    });
    const rowFeis = (found.find((x) => x.feis) || {}).feis;
    return { results: found, date: findDate(text), feis: rowFeis || findFeis(lines), text: lines.join("\n") };
  }

  root.PID_READER = { readText, parse };
  if (typeof module !== "undefined") module.exports = { parse };
})(typeof window !== "undefined" ? window : globalThis);
