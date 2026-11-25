// Gathers upcoming feiseanna from each organization's own public calendar and writes feis.json,
// which the app reads. Runs on a schedule in GitHub Actions (see .github/workflows/update-feis.yml).
//
// Manners: one visit per calendar page per run, a named user agent, pauses between visits to the
// same site, and only pages that the site's robots.txt allows. If a site is down or its page
// changes shape, the last good listings for that organization are kept, so the app never empties.
//
// Run locally with:  node scripts/update-feis.mjs            (writes feis.json)
//                    node scripts/update-feis.mjs --from dir  (reads saved pages instead of the web)

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const UA = "PocketIrishDanceBot/1.0 (+https://irishdancepocketguide.github.io/PocketIrishDance/)";
const OUT = "feis.json";
const argFrom = process.argv.indexOf("--from") > -1 ? process.argv[process.argv.indexOf("--from") + 1] : "";

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const pad = (n) => String(n).padStart(2, "0");
const iso = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;
const todayIso = () => new Date().toISOString().slice(0, 10);

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "’", lsquo: "‘", ndash: "–", mdash: "—", hellip: "…" };
function decode(s) {
  return String(s || "")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => (ENTITIES[n.toLowerCase()] ?? m));
}
const text = (html) => decode(String(html || "").replace(/<br\s*\/?>|<\/br>/gi, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

async function get(url, saved) {
  if (argFrom) return readFileSync(join(argFrom, saved), "utf8");
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html,application/json" }, signal: AbortSignal.timeout(45000) });
  if (!res.ok) throw new Error(`${url} answered ${res.status}`);
  return await res.text();
}

// ---------- WIDA (www.irish.dance, a Squarespace events list) ----------
async function wida() {
  const base = "https://www.irish.dance";
  const html = await get(base + "/competitions-list", "wida.html");
  const startAt = html.indexOf("eventlist--upcoming");
  const pastAt = html.indexOf("eventlist--past");
  const part = html.slice(startAt > -1 ? startAt : 0, pastAt > startAt ? pastAt : undefined);
  const events = [];
  for (const a of part.split('<article class="eventlist-event').slice(1)) {
    const link = (a.match(/href="(\/competitions-list\/[^"?#]+)"/) || [])[1];
    const name = text((a.match(/class="eventlist-title-link"[^>]*>([\s\S]*?)<\/a>/) || [])[1]);
    const dates = [...a.matchAll(/<time class="event-date" datetime="(\d{4}-\d{2}-\d{2})"/g)].map((m) => m[1]);
    const desc = (a.match(/class="eventlist-description"[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/) || [])[1];
    if (!name || !dates.length) continue;
    events.push({
      org: "wida", name, start: dates[0], end: dates[dates.length - 1],
      place: text(desc).slice(0, 80), url: link ? base + link : base + "/competitions-list"
    });
  }
  return events;
}

// ---------- An Comhdháil (web.irishdancingorg.com feis calendar table) ----------
async function comhdhail() {
  const page = "https://web.irishdancingorg.com/apps/feiscalendar.php";
  const html = await get(page, "comh.html");
  const events = [];
  for (const row of html.match(/<tr[\s\S]*?<\/tr>/gi) || []) {
    const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((m) => m[1]);
    if (cells.length < 6) continue;
    const id = text(cells[0]);
    if (!/^\d{4,}$/.test(id)) continue;
    const year = 2000 + Number(id.slice(0, 2));
    const m1 = MONTHS.indexOf(text(cells[1]).slice(0, 3).toLowerCase()) + 1;
    if (!m1) continue;
    const dayText = text(cells[2]);
    const days = [...dayText.matchAll(/(\d{1,2})(?:st|nd|rd|th)?/gi)].map((m) => Number(m[1])).filter((d) => d >= 1 && d <= 31);
    if (!days.length) continue;
    const d1 = days[0], d2 = days[days.length - 1];
    const otherMonth = MONTHS.findIndex((mn) => new RegExp("\\b" + mn, "i").test(dayText)) + 1;
    let m2 = otherMonth || m1, y2 = year;
    if (!otherMonth && d2 < d1) m2 = m1 + 1;
    if (m2 < m1) y2 = year + 1;
    if (m2 > 12) { m2 = 1; y2 = year + 1; }
    const area = text(cells[5]);
    const kind = (area.match(/\(([^)]+)\)\s*$/) || [])[1] || "";
    const href = (row.match(/href="([^"]+)"/i) || [])[1];
    const status = text(cells[6] || "");
    events.push({
      org: "comhdhail", name: text(cells[3].replace(/<a[\s\S]*?<\/a>/gi, "")), start: iso(year, m1, d1), end: iso(y2, m2, d2),
      place: area.replace(/\s*\([^)]*\)\s*$/, ""), kind,
      organiser: text(cells[4]),
      url: "https://web.irishdancingorg.com/index.php/feis",
      syllabus: href ? new URL(decode(href), page).href : undefined,
      cancelled: /cancel/i.test(status) || undefined
    });
  }
  return events;
}

// ---------- IDTANA (idtana.org, CLRG feiseanna in North America) ----------
// This national list holds the bigger North American events. Most local feiseanna are on the
// regional calendars, which the app links to (see REGION_CALENDARS in app.js).
async function idtana() {
  const html = await get("https://idtana.org/feiseanna/", "idtana.html");
  const MONTH_NAMES = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  const toIso = (s) => { const m = s.match(/([A-Za-z]+) (\d{1,2}), (\d{4})/); const mi = m ? MONTH_NAMES.indexOf(m[1].toLowerCase()) + 1 : 0; return mi ? iso(m[3], mi, m[2]) : ""; };
  const events = [];
  for (const a of html.split('<article id="post-').slice(1)) {
    const art = a.slice(0, a.indexOf("</article>") > -1 ? a.indexOf("</article>") : undefined);
    const name = text((art.match(/<h3 class="elementor-heading-title[^>]*>([\s\S]*?)<\/h3>/) || [])[1]);
    const tag = (kind) => text((art.match(new RegExp('href="https://idtana\\.org/' + kind + '/[^"]*"[^>]*>([^<]+)<')) || [])[1]);
    const link = (art.match(/href="(https:\/\/idtana\.org\/events\/[^"]+)"/) || [])[1];
    const parts = art.replace(/<[^>]+>/g, "|").split("|").map((x) => text(x)).filter(Boolean);
    const di = parts.findIndex((x) => /^[A-Za-z]+ \d{1,2}, \d{4}$/.test(x));
    if (!name || di < 0) continue;
    let j = di + 1, end = "";
    if (parts[j] && /^[–-]\s*[A-Za-z]+ \d{1,2}, \d{4}$/.test(parts[j])) { end = toIso(parts[j]); j++; }
    const venue = parts[j] && !/^learn more$/i.test(parts[j]) ? parts[j] : "";
    const start = toIso(parts[di]);
    events.push({
      org: "clrg", name, start, end: end || start,
      place: [venue, tag("state"), tag("country") === "United States" ? "" : tag("country")].filter(Boolean).join(", "),
      region: tag("region"), url: link || "https://idtana.org/feiseanna/"
    });
  }
  return events;
}

// ---------- CRN (crn.feishost.com, the Feis Host entry site CRN links to from crn.ie) ----------
// Its public home page lists upcoming feiseanna with dates and a region filter. Each feis's own
// page needs a sign-in, so the app links to the list itself.
async function crn() {
  const page = "https://crn.feishost.com/home";
  const html = await get(page, "crn.html");
  const regions = {};
  for (const m of html.matchAll(/<li data-filter="\.filter-([0-9a-f-]+)"[^>]*>([\s\S]*?)<\/li>/gi)) regions[m[1]] = text(m[2]);
  const toIso = (s) => { const m = s.match(/(\d{1,2}) ([A-Za-z]{3})[a-z]* (\d{4})/); const mi = m ? MONTHS.indexOf(m[2].toLowerCase()) + 1 : 0; return mi ? iso(m[3], mi, m[1]) : ""; };
  const events = [];
  for (const item of html.split(/<div class="[^"]*portfolio-item/).slice(1)) {
    const name = text((item.match(/<h4[^>]*>([\s\S]*?)<\/h4>/) || [])[1]);
    const dates = text((item.match(/<p class="align-baseline"[^>]*>([\s\S]*?)<\/p>/) || [])[1]).split(/\s+-\s+/);
    const start = toIso(dates[0] || ""), end = toIso(dates[1] || "") || start;
    if (!name || !start) continue;
    const region = regions[(item.match(/^[^"]*filter-([0-9a-f-]+)/) || [])[1]] || "";
    events.push({ org: "crn", name, start, end, region, url: "https://crn.feishost.com/" });
  }
  return events;
}

// ---------- CRDM (crdm.ie competition dates table) ----------
// Rows read like "5th - 6th December 2026" | feis | organiser | venue | what it qualifies for.
async function crdm() {
  const page = "https://www.crdm.ie/competition-dates/";
  const html = await get(page, "crdm.html");
  const MONTH_NAMES = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  const monthOf = (w) => !w ? 0 : MONTH_NAMES.findIndex((n) => n.startsWith(String(w).toLowerCase().slice(0, 3))) + 1;
  const events = [];
  for (const row of html.match(/<tr[\s\S]*?<\/tr>/gi) || []) {
    const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((m) => text(m[1]));
    if (cells.length < 4 || !cells[1]) continue;
    // Pieces such as 31st March - 4th April 2027: numbers, month words and a year.
    const when = cells[0].replace(/(\d)(st|nd|rd|th)\b/gi, "$1");
    const year = Number((when.match(/\b(20\d\d)\b/) || [])[1]);
    const parts = when.replace(/\b20\d\d\b/, "").split(/\s*(?:-|–|&|to)\s*/i).map((x) => x.trim()).filter(Boolean);
    if (!year || !parts.length) continue;
    const read = (x) => { const d = Number((x.match(/\d{1,2}/) || [])[0]); const m = monthOf((x.match(/[A-Za-z]{3,}/) || [])[0] || ""); return { d, m }; };
    const a = read(parts[0]), b = read(parts[parts.length - 1]);
    const m2 = b.m || a.m, m1 = a.m || m2;
    if (!a.d || !m1) continue;
    const y1 = m1 > m2 ? year - 1 : year;
    const kind = /standalone/i.test(cells[4] || "") ? "Major" : /championship/i.test(cells[1]) ? "Championship" : "";
    events.push({
      org: "crdm", name: cells[1], start: iso(y1, m1, a.d), end: iso(year, m2, b.d || a.d),
      place: /^tbc$/i.test(cells[3]) ? "" : cells[3], kind, organiser: cells[2],
      url: page
    });
  }
  return events;
}

const SOURCES = [
  { id: "wida", org: "wida", name: "WIDA competitions calendar", url: "https://www.irish.dance/competitions-list", run: wida },
  { id: "comhdhail", org: "comhdhail", name: "An Comhdháil feis calendar", url: "https://web.irishdancingorg.com/index.php/feis", run: comhdhail },
  { id: "idtana", org: "clrg", name: "IDTANA Find a Feis (North America)", url: "https://idtana.org/feiseanna/", run: idtana },
  { id: "crn", org: "crn", name: "CRN feiseanna on Feis Host", url: "https://crn.feishost.com/", run: crn },
  { id: "crdm", org: "crdm", name: "CRDM competition dates", url: "https://www.crdm.ie/competition-dates/", run: crdm }
];

const previous = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : { events: [], sources: [] };
const now = new Date().toISOString();
const keepFrom = (() => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10); })();
const out = { checked: now, sources: [], events: [] };

for (const src of SOURCES) {
  const before = previous.events.filter((e) => e.source === src.id);
  const prevSrc = (previous.sources || []).find((s) => s.id === src.id) || {};
  let found = [], error = "";
  try { found = await src.run(); } catch (e) { error = String(e.message || e); }
  found = found.filter((e) => e.name && e.start && (e.end || e.start) >= keepFrom).map((e) => ({ source: src.id, ...e }));
  // A page that suddenly shows nothing usually means it changed shape, not that every feis vanished.
  const suspicious = !error && !found.length && before.length > 3;
  const ok = !error && !suspicious;
  const events = ok ? found : before.filter((e) => (e.end || e.start) >= keepFrom);
  out.events.push(...events);
  out.sources.push({
    id: src.id, org: src.org, name: src.name, url: src.url, count: events.length,
    lastGood: ok ? now : prevSrc.lastGood || "", problem: ok ? "" : error || "The page showed no feiseanna this time"
  });
  console.log(`${src.id}: ${ok ? "ok" : "KEPT OLD"} ${events.length} upcoming${error ? " (" + error + ")" : ""}`);
  if (!argFrom) await sleep(5000);
}

// Feiseanna found on regional and school websites by the weekly feis finder (see FEIS-FINDER.md).
// Shannon approves each batch before it is added to feis-found.json. Official lists win on duplicates.
const simple = (n) => String(n || "").toLowerCase().normalize("NFD").replace(/[^a-z0-9]/g, "").replace(/(feis|the|and|championships?|irish|dance)/g, "");
if (existsSync("feis-found.json")) {
  const found = JSON.parse(readFileSync("feis-found.json", "utf8")).events || [];
  let added = 0;
  const official = out.events.slice(); // compare finds only with the official lists, not with each other
  for (const e of found) {
    if (!e.name || !e.start || (e.end || e.start) < keepFrom) continue;
    const dup = official.some((o) => o.org === e.org && o.start === e.start && (simple(o.name).includes(simple(e.name)) || simple(e.name).includes(simple(o.name))));
    if (dup) continue;
    out.events.push({ source: "found", ...e, end: e.end || e.start }); added++;
  }
  out.sources.push({ id: "found", org: "all", name: "Found on regional and school websites (checked by hand)", url: "", count: added, lastGood: now, problem: "" });
  console.log(`found: ${added} upcoming from feis-found.json`);
}

out.events.sort((a, b) => a.start.localeCompare(b.start) || a.name.localeCompare(b.name));
const same = JSON.stringify(previous.events) === JSON.stringify(out.events) && JSON.stringify((previous.sources || []).map((s) => s.problem)) === JSON.stringify(out.sources.map((s) => s.problem));
// Only rewrite when something changed, or once a day so "last checked" stays honest.
if (same && previous.checked && previous.checked.slice(0, 10) === todayIso()) {
  console.log("No changes.");
} else {
  writeFileSync(OUT, JSON.stringify(out, null, 1) + "\n");
  console.log(`Wrote ${OUT}: ${out.events.length} upcoming feiseanna.`);
}
