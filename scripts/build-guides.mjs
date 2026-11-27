// Builds the parent guide pages in guide/ and the sitemap.xml from the app's own content in data.js,
// so search engines (Google, Bing) can find and show the same answers the app gives.
// Run it after changing data.js:  node scripts/build-guides.mjs
// A GitHub Action (.github/workflows/build-guides.yml) also runs it whenever data.js changes on main.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://pocketirishdance.com";

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "data.js"), "utf8"), sandbox);
const D = sandbox.window.PID_DATA;

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const ldText = (s) => String(s ?? "");
const orgById = Object.fromEntries(D.organizations.map((o) => [o.id, o]));
const SLUG = { clrg: "clrg", comhdhail: "an-comhdhail", wida: "wida", crn: "crn", crdm: "crdm", idtana: "idtana" };
const listJoin = (a) => (a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]);
const sentence = (s) => { s = String(s || "").trim(); return s && !/[.!?)]$/.test(s) ? s + "." : s; };
const clip = (s, n = 158) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(" ", n - 1)).replace(/[,;:]$/, "") + "…");

let lastmod = new Date().toISOString().slice(0, 10);
try { const d = execSync("git log -1 --format=%cs -- data.js", { cwd: ROOT }).toString().trim(); if (d) lastmod = d; } catch (e) {}

const pages = [];

function page({ slug, base = "guide", title, description, h1, lede, body, crumbs = [], ld = [], appLink = "/app.html", appLabel = "Open this in the app" }) {
  const url = `${SITE}/${base}/${slug ? slug + "/" : ""}`;
  const hub = base === "guide" ? { name: "Parent guide", url: SITE + "/guide/" } : { name: "Feis calendar", url: SITE + "/feis/" };
  const trail = [{ name: "Home", url: SITE + "/" }, ...(slug ? [hub] : []), ...crumbs];
  const breadcrumb = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [...trail, ...(slug ? [{ name: h1, url }] : [])].map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.url }))
  };
  const lds = [breadcrumb, ...ld].map((x) => `<script type="application/ld+json">${JSON.stringify(x).replace(/</g, "\\u003c")}</script>`).join("\n  ");
  const crumbHtml = trail.map((c) => `<a href="${esc(c.url.replace(SITE, ""))}">${esc(c.name)}</a>`).join(" › ") + (slug ? ` › <span>${esc(h1)}</span>` : "");
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${url}">
  <meta name="theme-color" content="#024445">
  <meta property="og:site_name" content="Pocket Irish Dance">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:type" content="article">
  <meta property="og:image" content="${SITE}/site/social.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Pocket Irish Dance: Irish dance, finally explained for parents">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/icons/favicon-32.png" type="image/png" sizes="32x32">
  <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
  <link rel="manifest" href="/manifest.webmanifest">
  <link rel="preload" href="/site/fonts/fraunces.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/site/fonts/nunito.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/site/guide.css">
  ${lds}
</head>
<body>
<!-- Made by scripts/build-guides.mjs from data.js. Edit data.js, not this file. -->
<header class="top"><div class="wrap">
  <a class="brand" href="/"><img src="/icons/wordmark-white.png" alt="Pocket Irish Dance" width="720" height="194"></a>
  <a class="btn" href="/#get">Get the free app</a>
</div></header>
<main class="wrap">
  <nav class="crumbs" aria-label="Breadcrumb">${crumbHtml}</nav>
  <h1>${esc(h1)}</h1>
  ${lede ? `<p class="lede">${esc(lede)}</p>` : ""}
  ${body}
  <section class="cta">
    <h2>Keep this in your pocket</h2>
    <p>Pocket Irish Dance is a free app for Irish dance parents: words with how to say them, levels, rules, the feis calendar and a private score tracker with judge history.</p>
    <a class="btn" href="/#get">Get the free app</a>
    <p class="small" style="margin:12px 0 0"><a style="color:#fff" href="${esc(appLink)}">${esc(appLabel)}</a></p>
  </section>
</main>
<footer><div class="wrap">
  <nav aria-label="More">
    <a href="/">Home</a>
    <a href="/guide/">Parent guide</a>
    <a href="/feis/">Feis calendar</a>
    <a href="/app.html#/privacy">Privacy policy</a>
    <a href="/app.html#/terms">Terms of use</a>
    <a href="mailto:pocketirishdance@gmail.com">Contact us</a>
  </nav>
  <p>Pocket Irish Dance is an independent guide for parents. It is not an official publication of, or endorsed by, any Irish dance organization. Always check important decisions with your teacher and the current official rules.</p>
  <p style="margin:0">© ${new Date().getFullYear()} Pocket Irish Dance</p>
</div></footer>
<script src="/count.js"></script>
<script>if (window.PID_COUNT && PID_COUNT.guide) PID_COUNT.guide(${JSON.stringify((base === "guide" ? "" : base + "-") + (slug || "home").replace(/\//g, "-"))}, ${JSON.stringify(h1)});</script>
</body>
</html>
`;
  pages.push({ base, slug, url, title, description, h1, html });
}

const orgTag = (ids) => (ids && ids.length ? ids.map((id) => `<span class="tag">${esc((orgById[id] || {}).name || id)} only</span>`).join("") : "");
const sayHtml = (s) => (s ? ` <span class="say">(say “${esc(s)}”)</span>` : "");

// ---------- Organizations ----------
const orgs = D.organizations.filter((o) => o.active);
const levelOrgs = orgs.filter((o) => D.levels.some((l) => l.org === o.id));
const ruleOrgs = orgs.filter((o) => D.rules.some((r) => r.orgId === o.id && !r.draft));
const orgLinks = (o) => {
  const a = [];
  if (levelOrgs.includes(o)) a.push(`<a href="/guide/${SLUG[o.id]}-levels/">${esc(o.name)} levels</a>`);
  if (ruleOrgs.includes(o)) a.push(`<a href="/guide/${SLUG[o.id]}-rules/">${esc(o.name)} rules</a>`);
  if (o.link) a.push(`<a href="${esc(o.link)}" rel="noopener">Official website</a>`);
  if (o.schoolsLink) a.push(`<a href="${esc(o.schoolsLink)}" rel="noopener">Official school list</a>`);
  return a.length ? `<p class="small">${a.join(" · ")}</p>` : "";
};
page({
  slug: "organizations",
  title: "Irish dance organizations explained: " + orgs.filter((o) => o.pick).slice(0, 3).map((o) => o.name).join(", ") + " and more",
  description: clip(`What ${listJoin(orgs.filter((o) => o.pick).map((o) => o.name))} are, where they run, what their teachers' letters mean and which major championships they hold. A plain guide for Irish dance parents.`),
  h1: "Irish dance organizations, explained",
  lede: "Irish dance schools each belong to an organization, and each organization has its own teachers, levels, rules and championships. Your teacher can tell you which one your school is in.",
  appLink: "/app.html#/orgs",
  body: orgs.map((o) => `
  <section class="card" id="${SLUG[o.id]}">
    <h2 style="margin-top:0">${esc(o.name)}${o.fullName && o.fullName !== o.name ? ` <span class="muted" style="font-size:.6em">${esc(o.fullName)}</span>` : ""}</h2>
    ${o.say ? `<p class="small">${sayHtml(o.say).trim()}</p>` : ""}
    <p>${esc(sentence(o.summary))}</p>
    <dl>
      ${o.where ? `<dt>Where</dt><dd>${esc(o.where)}</dd>` : ""}
      ${o.partOf ? `<dt>Part of</dt><dd>${esc(o.partOf)}</dd>` : ""}
      ${o.teachers ? `<dt>Teachers</dt><dd>${esc(o.teachers)}</dd>` : ""}
      ${o.majors ? `<dt>Major events</dt><dd>${esc(o.majors)}</dd>` : ""}
    </dl>
    ${orgLinks(o)}
  </section>`).join("")
});

// ---------- Levels, one page per organization ----------
const NA_NOTE = {
  clrg: "These are the CLRG level names used at feiseanna in North America (the United States, Canada and Mexico). Great Britain, Ireland and Australia use different names for the lower levels (see the links below). At the lower levels a dancer moves up one dance at a time, so they can be at different levels in different dances."
};
// CLRG level names in other countries: same levels, local names (data.js clrgLadders).
const LADDERS = (D.clrgLadders || []).filter((c) => c.levels);
const ladderSlug = (c) => `clrg-levels-${c.region.toLowerCase().replace(/[^a-z]+/g, "-")}`;
const ladderLevels = (c) => D.levels.filter((l) => l.org === "clrg" && (!l.only || l.only === c.region))
  .map((l) => Object.assign({}, l, (c.levels || {})[l.id] || {}, { naName: l.name })).sort((a, b) => a.order - b.order);
const ladderLinks = () => `<p>Outside North America: ${LADDERS.map((c) => `<a href="/guide/${ladderSlug(c)}/">CLRG levels in ${esc(c.region)}</a>`).join(" · ")}.</p>`;
for (const o of levelOrgs) {
  const lv = D.levels.filter((l) => l.org === o.id && !l.only).sort((a, b) => a.order - b.order);
  const youth = lv.filter((l) => !l.adult);
  const anyCheck = lv.some((l) => l.check);
  page({
    slug: `${SLUG[o.id]}-levels`,
    title: `${o.name} Irish dance levels explained: ${youth[0].name} to ${youth[youth.length - 1].name}`,
    description: clip(`Every ${o.name} Irish dance level in plain words (${listJoin(lv.map((l) => l.name))}): what dancers dance, how they move up, and what parents need to know.`),
    h1: `${o.name} Irish dance levels, explained`,
    lede: `The ${o.name} level ladder from ${youth[0].name} to ${youth[youth.length - 1].name}${lv.length > youth.length ? ", plus the adult championships" : ""}: what each level dances, how a dancer moves up, and what it means for parents.`,
    crumbs: [{ name: "Organizations", url: `${SITE}/guide/organizations/` }],
    appLink: "/app.html#/levels",
    body: `
  ${NA_NOTE[o.id] ? `<p class="note">${esc(NA_NOTE[o.id])}</p>` : ""}
  <ul class="toc">${lv.map((l) => `<li><a href="#${l.id}">${esc(l.name)}</a></li>`).join("")}</ul>
  ${lv.map((l, i) => `
  <section class="card" id="${l.id}">
    <h2 style="margin-top:0"><span class="step">${l.adult ? "A" : i + 1}</span>${esc(l.name)}</h2>
    ${l.alt ? `<p class="muted small">${esc(l.alt.charAt(0).toUpperCase() + l.alt.slice(1))}</p>` : ""}
    <dl>
      <dt>What they dance</dt><dd>${esc(sentence(l.danced))}</dd>
      <dt>Moving up</dt><dd>${esc(sentence(l.moveUp))}</dd>
      ${l.parents ? `<dt>For parents</dt><dd>${esc(sentence(l.parents))}</dd>` : ""}
      ${l.older ? `<dt>Older dancers</dt><dd>${esc(sentence(l.older))}</dd>` : ""}
    </dl>
  </section>`).join("")}
  ${anyCheck ? `<p class="small muted">Some of these rules differ by region. Your teacher and the feis syllabus have the final word.</p>` : ""}
  ${o.id === "clrg" ? ladderLinks() : ""}
  <p>${ruleOrgs.includes(o) ? `More questions? See <a href="/guide/${SLUG[o.id]}-rules/">${esc(o.name)} rules in plain words</a>, or ` : "See "}<a href="/guide/how-championships-are-judged/">how championships are judged</a>.</p>`
  });
}

// ---------- CLRG levels in Great Britain, Ireland and Australia ----------
for (const c of LADDERS) {
  const lv = ladderLevels(c);
  const grades = lv.filter((l) => l.perDance);
  page({
    slug: ladderSlug(c),
    title: `Irish dance levels in ${c.region} (CLRG): ${listJoin(grades.map((l) => l.name))} explained`,
    description: clip(`The CLRG Irish dance grades in ${c.region}, ${listJoin(grades.map((l) => l.name))}, in plain words: how dancers move up, and how each matches the North American levels.`),
    h1: `CLRG Irish dance levels in ${c.region}, explained`,
    lede: `${c.intro}`,
    crumbs: [{ name: "Organizations", url: `${SITE}/guide/organizations/` }, { name: "CLRG levels", url: `${SITE}/guide/clrg-levels/` }],
    appLink: "/app.html#/levels",
    body: `
  ${c.warn ? `<p class="note">${esc(c.warn)}</p>` : ""}
  <h2>How the names match</h2>
  <table class="table"><thead><tr><th>${esc(c.region)}</th><th>North America</th></tr></thead><tbody>
  ${lv.filter((l) => !l.adult).map((l) => `<tr><td>${esc(l.name)}</td><td>${l.naName && l.naName !== l.name ? esc(l.naName) : l.only ? "No match" : esc(l.name)}</td></tr>`).join("")}
  </tbody></table>
  <ul class="toc">${lv.map((l) => `<li><a href="#${l.id}">${esc(l.name)}</a></li>`).join("")}</ul>
  ${lv.map((l, i) => `
  <section class="card" id="${l.id}">
    <h2 style="margin-top:0"><span class="step">${l.adult ? "A" : i + 1}</span>${esc(l.name)}</h2>
    ${l.alt ? `<p class="muted small">${esc(l.alt.charAt(0).toUpperCase() + l.alt.slice(1))}</p>` : ""}
    <dl>
      <dt>What they dance</dt><dd>${esc(sentence(l.danced))}</dd>
      <dt>Moving up</dt><dd>${esc(sentence(l.moveUp))}</dd>
      ${l.parents ? `<dt>For parents</dt><dd>${esc(sentence(l.parents))}</dd>` : ""}
    </dl>
  </section>`).join("")}
  ${c.unconfirmed ? `<p class="small muted">${esc(c.unconfirmed)}</p>` : ""}
  <p class="small muted">Moving-up rules are set by each regional council and can change. Your teacher and the feis syllabus have the final word.</p>
  <h2>Sources</h2>
  <ul class="small">${(c.sources || []).map((x) => `<li><a href="${esc(x.url)}" rel="noopener">${esc(x.name)}</a></li>`).join("")}</ul>
  <p>See also: <a href="/guide/clrg-levels/">CLRG levels in North America</a> and <a href="/guide/how-championships-are-judged/">how championships are judged</a>.</p>`
  });
}

// ---------- Rules, one page per organization ----------
for (const o of ruleOrgs) {
  const rules = D.rules.filter((r) => r.orgId === o.id && !r.draft);
  const topics = [...new Set(rules.map((r) => r.topic))];
  const slugT = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const region = (r) => (r.regions && r.regions.length ? (r.regions.length === 3 && r.regions.includes("Mexico") ? "North America" : r.regions.join(", ")) : "");
  page({
    slug: `${SLUG[o.id]}-rules`,
    title: `${o.name} Irish dance rules in plain words, for parents`,
    description: clip(`${rules.length} common parent questions about ${o.name} rules, answered simply: ${listJoin(topics.map((t) => t.toLowerCase()))}.`),
    h1: `${o.name} rules in plain words`,
    lede: `Short answers to the questions parents ask most about ${o.fullName && o.fullName !== o.name ? o.fullName + " (" + o.name + ")" : o.name} rules.${o.rulesName ? " Taken from the " + o.rulesName + "." : ""}`,
    crumbs: [{ name: "Organizations", url: `${SITE}/guide/organizations/` }],
    appLink: "/app.html#/rules",
    ld: [{
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: rules.map((r) => ({ "@type": "Question", name: ldText(r.q), acceptedAnswer: { "@type": "Answer", text: ldText(r.a) } }))
    }],
    body: `
  ${o.rulesHow && !o.rulesLink ? `<p class="note">${esc(o.rulesHow)}</p>` : ""}
  <ul class="toc">${topics.map((t) => `<li><a href="#${slugT(t)}">${esc(t)}</a></li>`).join("")}</ul>
  ${topics.map((t) => `
  <h2 id="${slugT(t)}">${esc(t)}</h2>
  ${rules.filter((r) => r.topic === t).map((r) => `
  <div class="qa">
    <h3>${esc(r.q)}</h3>
    <p>${esc(r.a)}</p>
    ${r.sec || region(r) ? `<p class="small muted">${[r.sec ? "Rulebook section " + esc(r.sec) : "", region(r) ? esc(region(r)) : ""].filter(Boolean).join(" · ")}</p>` : ""}
  </div>`).join("")}`).join("")}
  ${o.rulesLink ? `<p class="small">Read the full rules: <a href="${esc(o.rulesLink)}" rel="noopener">${esc(o.rulesName || o.name + " rulebook")}</a>.</p>` : ""}
  ${levelOrgs.includes(o) ? `<p>See also: <a href="/guide/${SLUG[o.id]}-levels/">${esc(o.name)} levels, explained</a>.</p>` : ""}`
  });
}

// ---------- Words (glossary) ----------
const groups = D.glossaryGroups.filter((g) => D.glossary.some((w) => w.g === g.id));
const wordId = (w) => "w-" + w.term.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + (w.orgs && w.orgs.length ? "-" + w.orgs.join("-") : "");
const wordCard = (w) => `
  <div class="qa" id="${wordId(w)}">
    <h3>${esc(w.term)}${w.alt ? ` <span class="muted" style="font-weight:600">(${esc(w.alt)})</span>` : ""}${orgTag(w.orgs)}</h3>
    <p>${w.say ? `<span class="say">Say “${esc(w.say)}”.</span> ` : ""}${esc(sentence(w.means))}${w.why ? ` <span class="muted">${esc(sentence(w.why))}</span>` : ""}</p>
  </div>`;
page({
  slug: "irish-dance-words",
  title: "Irish dance words explained, with how to say them",
  description: clip(`${D.glossary.length} Irish dance words for parents, from feis, feiseanna and Oireachtas to ghillies, recalls and round placings, with simple pronunciation.`),
  h1: "Irish dance words, explained",
  lede: `${D.glossary.length} words you'll hear at class and at the feis, what they mean, why they matter, and how to say the Irish ones.`,
  appLink: "/app.html#/words",
  appLabel: "Hear them said out loud in the app",
  ld: [{
    "@context": "https://schema.org", "@type": "DefinedTermSet", name: "Irish dance words for parents", url: `${SITE}/guide/irish-dance-words/`,
    hasDefinedTerm: D.glossary.map((w) => ({ "@type": "DefinedTerm", name: ldText(w.term), description: ldText(sentence(w.means)), url: `${SITE}/guide/irish-dance-words/#${wordId(w)}` }))
  }],
  body: `
  <ul class="toc">${groups.map((g) => `<li><a href="#${g.id}">${esc(g.name)}</a></li>`).join("")}</ul>
  ${groups.map((g) => `
  <h2 id="${g.id}">${esc(g.name)}</h2>
  ${D.glossary.filter((w) => w.g === g.id).map(wordCard).join("")}`).join("")}`
});

// ---------- How championships are judged ----------
const JUDGING = ["Grades", "Championship", "Light round", "Heavy round", "Round placing", "Overall place", "Raw score", "Irish points", "Recall", "Placement", "Adjudicator", "Results posting", "World qualifier", "National qualifier"];
const judgingWords = JUDGING.map((t) => D.glossary.find((w) => w.term === t && !(w.orgs && w.orgs.length))).filter(Boolean);
const champLevels = D.levels.filter((l) => l.org === "clrg" && (l.id === "pc" || l.id === "oc"));
page({
  slug: "how-championships-are-judged",
  title: "How Irish dance championships are judged, explained for parents",
  description: "Why a round placing can differ from the overall place, how a panel of judges decides an Irish dance championship, and what recalls and Irish points mean.",
  h1: "How Irish dance championships are judged",
  lede: "Grade competitions and championships are judged differently. That is why your dancer's round placings can look nothing like their overall result.",
  appLink: "/app.html#/scores",
  appLabel: "Track each judge's placings in the app",
  body: `
  <p class="note">In grade competitions, each dance is its own competition. In a championship, a panel of judges decides one overall place. For each round, one judge from the panel is picked at random, and that judge's placings become everyone's placing for that round. So a round placing reflects only one judge, and can be very different from the overall place.</p>
  ${champLevels.length ? `<h2>CLRG championships</h2>${champLevels.map((l) => `
  <div class="qa"><h3>${esc(l.name)}</h3><p>${esc(sentence(l.danced))}</p></div>`).join("")}` : ""}
  <h2>The words you'll see on results</h2>
  ${judgingWords.map(wordCard).join("")}
  <h2>Why tracking each judge helps</h2>
  <p>Because each round placing comes from one judge, looking at the same judge over several feiseanna tells you much more than one result on its own. The Pocket Irish Dance score tracker keeps every round placing with the judge who gave it, so you can see how each adjudicator has placed your dancer over time. Everything stays on your phone.</p>
  <p>See also: <a href="/guide/clrg-levels/">CLRG levels, explained</a> and <a href="/guide/irish-dance-words/">all the Irish dance words</a>.</p>`
});

// ---------- Checklists ----------
page({
  slug: "feis-checklists",
  title: "Feis checklists for Irish dance parents: what to bring and expect",
  description: clip(`${D.checklists.length} checklists for Irish dance parents: ${listJoin(D.checklists.map((c) => c.name.toLowerCase()))}. What to ask, what to pack and what to expect.`),
  h1: "Checklists for Irish dance parents",
  lede: "From your dancer's first class to traveling to a major championship: what to ask, what to pack, and what to expect.",
  appLink: "/app.html#/guide",
  appLabel: "Tick them off in the app",
  body: `
  <ul class="toc">${D.checklists.map((c) => `<li><a href="#${c.id}">${esc(c.icon)} ${esc(c.name)}</a></li>`).join("")}</ul>
  ${D.checklists.map((c) => `
  <h2 id="${c.id}">${esc(c.icon)} ${esc(c.name)}</h2>
  ${c.blurb ? `<p class="muted">${esc(c.blurb)}</p>` : ""}
  ${c.sections.map((s) => `
  <h3>${esc(s.title)}</h3>
  <ul class="list">${s.items.map((it) => `<li>${esc(it.t)}${it.tip ? `<br><span class="small muted">${esc(it.tip)}</span>` : ""}</li>`).join("")}</ul>`).join("")}`).join("")}`
});

// ---------- Answer pages for the questions parents search most ----------
// Topics chosen from the questions parents ask most often (school FAQs, parent articles and forums).
// Every answer is built from the app's own words in data.js, so the pages never say anything the app doesn't.
const W = (term) => {
  const w = D.glossary.find((x) => x.term === term);
  if (!w) throw new Error(`Glossary word not found: ${term}`);
  return w;
};
const CK = (id) => {
  const c = D.checklists.find((x) => x.id === id);
  if (!c) throw new Error(`Checklist not found: ${id}`);
  return c;
};
const item = (cid, k) => {
  for (const s of CK(cid).sections) { const i = s.items.find((x) => x.k === k); if (i) return i; }
  throw new Error(`Checklist item not found: ${cid}:${k}`);
};
const words = (...terms) => terms.map((t) => wordCard(W(t))).join("");
const checklistHtml = (cid, titles) => CK(cid).sections.filter((s) => !titles || titles.includes(s.title)).map((s) => `
  <h3>${esc(s.title)}</h3>
  <ul class="list">${s.items.filter((it) => it.k !== "app" && it.k !== "track" && it.k !== "levels").map((it) => `<li>${esc(it.t)}${it.tip ? `<br><span class="small muted">${esc(it.tip)}</span>` : ""}</li>`).join("")}</ul>`).join("");
const lower1 = (s) => s.charAt(0).toLowerCase() + s.slice(1);
const ANSWER_TITLES = {};

function answerPage({ slug, title, description, h1, short, body, faqs = [], related = [], appLink, appLabel }) {
  ANSWER_TITLES[slug] = h1;
  page({
    slug, title, description, h1, appLink, appLabel,
    ld: faqs.length ? [{
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))
    }] : [],
    body: `
  <p class="note" style="font-size:17px">${short}</p>
  ${body}
  ${faqs.length ? `<h2>Quick answers</h2>${faqs.map((f) => `<div class="qa"><h3>${esc(f.q)}</h3><p>${esc(f.a)}</p></div>`).join("")}` : ""}
  ${related.length ? `<p>See also: ${related.map((r) => `<a href="/${r[0]}">${esc(r[1])}</a>`).join(" · ")}</p>` : ""}`
  });
}

const feis = W("Feis"), feiseanna = W("Feiseanna"), oir = W("Oireachtas");
const enterTip = item("enter", "deadline").tip;
const ageTip = item("enter", "age").tip;

answerPage({
  slug: "what-is-a-feis",
  title: "What is a feis? How to say it, and what happens at one",
  description: "A feis (say “fesh”) is a local Irish dance competition. What happens on the day, how entering works, and the words you'll hear, explained for parents.",
  h1: "What is a feis?",
  short: `A <strong>feis</strong> (say “${esc(feis.say)}”) is ${esc(lower1(sentence(feis.means)))} More than one feis are <strong>feiseanna</strong> (say “${esc(feiseanna.say)}”). Dancers enter the dances their teacher has approved, at their own level and age group, and each competition is judged on its own stage.`,
  body: `
  <h2>What happens at a feis</h2>
  ${words("Syllabus", "Stage", "Competitor number", "Marshalling", "Grades", "Championship", "Specials", "Results posting", "Placement", "Sash", "Parade of Champions")}
  <h2>Different kinds of feis</h2>
  ${words("First Feis", "School feis", "Blackout feis", "Oireachtas", "Majors")}
  <h2>Entering a feis</h2>
  ${checklistHtml("enter", ["Choose and enter"])}
  <p>Looking for one? See the <a href="/feis/">upcoming feis calendar</a>.</p>`,
  faqs: [
    { q: "What is a feis?", a: `A feis is ${lower1(sentence(feis.means))} ${sentence(feis.why)}` },
    { q: "How do you pronounce feis?", a: `Feis is said “${feis.say}”. The plural, feiseanna, is said “${feiseanna.say}”.` },
    { q: "How do I enter my dancer in a feis?", a: `Check with the teacher first, then read the syllabus. ${enterTip}` },
    { q: "Which age group does my dancer compete in?", a: ageTip }
  ],
  related: [["guide/what-to-bring-to-a-feis/", "What to bring to a feis"], ["guide/first-feis/", "Your first feis"], ["guide/irish-dance-words/", "All the Irish dance words"]],
  appLink: "/app.html#/feis", appLabel: "See upcoming feiseanna in the app"
});

answerPage({
  slug: "what-to-bring-to-a-feis",
  title: "What to bring to a feis: the Irish dance feis bag checklist",
  description: "The complete feis bag packing list for Irish dance parents: shoes and socks, costume, wig and hair, a fix-it kit, first aid, food and paperwork.",
  h1: "What to bring to a feis",
  short: `${esc(CK("bag").blurb)} The short version: both pairs of shoes, socks and sock glue, the costume on a hanger, the competitor number and pins, hair things, a small fix-it kit, plenty of food and water, and a charged phone.`,
  body: checklistHtml("bag"),
  faqs: [
    { q: "What should be in a feis bag?", a: `Shoes and socks (with spares and sock glue), the costume and competitor number, hair and wig supplies, a fix-it kit, first aid, food and drink, and your phone and paperwork. ${item("bag", "snacks").tip}` },
    { q: "Why bring tape to a feis?", a: item("bag", "tape").tip }
  ],
  related: [["guide/first-feis/", "Your first feis"], ["guide/what-is-a-feis/", "What is a feis?"], ["guide/feis-checklists/", "All the parent checklists"]],
  appLink: "/app.html#/guide", appLabel: "Tick it off in the app"
});

answerPage({
  slug: "first-feis",
  title: "Your dancer's first feis: what to expect, step by step",
  description: "A parent's guide to the first Irish dance feis: entering, the week before, feis day from parking to results, and the unwritten feis manners.",
  h1: "Your dancer's first feis",
  short: `Read the syllabus, register before the deadline, and arrive early. ${esc(item("day", "early").tip)} Get your dancer to side stage when the competition before theirs starts, then cheer, and start the ride home with “I loved watching you dance”.`,
  body: `
  <h2>Before the day</h2>
  ${checklistHtml("enter")}
  <h2>On the day</h2>
  ${checklistHtml("day")}
  <h2>Feis manners</h2>
  ${checklistHtml("manners")}`,
  faqs: [
    { q: "How early should we arrive at a feis?", a: `${item("day", "early").t}. ${item("day", "early").tip}` },
    { q: "Can I film my dancer at a feis?", a: item("manners", "video").tip },
    { q: "What if my dancer misses their turn?", a: item("day", "side").tip }
  ],
  related: [["guide/what-to-bring-to-a-feis/", "What to bring to a feis"], ["guide/how-championships-are-judged/", "How judging works"]],
  appLink: "/app.html#/guide", appLabel: "Use the checklists in the app"
});

answerPage({
  slug: "how-much-does-irish-dance-cost",
  title: "How much does Irish dance cost? What parents pay for, level by level",
  description: "What Irish dance families pay for, from class fees and soft shoes to feis entries, solo dresses, wigs and major championships, and the easiest ways to save.",
  h1: "How much does Irish dance cost?",
  short: "It depends a lot on your school, your country and how far your dancer goes. Costs start small, with class fees and soft shoes, and grow as dancers move up: hard shoes, feis entry fees, then a solo dress, a wig and travel to major championships. Ask your teacher for the school's yearly costs before you start.",
  body: `
  <h2>When your dancer starts</h2>
  <p>${esc(item("new", "fees").tip)}</p>
  ${checklistHtml("new", ["Buy (only what you need)"])}
  <h2>Feis entries</h2>
  ${words("Syllabus", "Specials")}
  <p>${esc(enterTip)}</p>
  <h2>As your dancer moves up</h2>
  ${words("Hard shoe", "Solo dress", "Wig", "Tan")}
  ${checklistHtml("solo", ["Before you buy"])}
  <p>${esc(item("solo", "fees").t)}.</p>
  <h2>Championships and majors</h2>
  <p>${esc(item("champ", "costs").t)}.</p>
  ${words("Majors")}
  <h2>Ways to save</h2>
  <ul class="list">
    <li>${esc(item("new", "wait").t)}. ${esc(item("new", "wait").tip)}</li>
    <li>${esc(item("solo", "budget").tip)}</li>
    <li>${esc(W("Blackout feis").means)}. ${esc(W("Blackout feis").why)}.</li>
    <li>${esc(W("School feis").means)}. ${esc(W("School feis").why)}.</li>
    <li>Register before the deadline: late entries often cost extra.</li>
  </ul>`,
  faqs: [
    { q: "What are the biggest costs in Irish dance?", a: `Class fees, shoes and feis entries are the regular costs. The solo dress is ${lower1(W("Solo dress").why)}, and championship dancers add travel to majors.` },
    { q: "Should I buy a second-hand solo dress?", a: item("solo", "budget").tip },
    { q: "When should we buy hard shoes, a wig or a dress?", a: `${item("new", "wait").t}. ${item("new", "wait").tip}` }
  ],
  related: [["guide/irish-dance-costumes-and-wigs/", "Costumes, solo dresses and wigs"], ["guide/irish-dance-shoes/", "Irish dance shoes"]]
});

answerPage({
  slug: "oireachtas-explained",
  title: "What is an Oireachtas? Irish dance regional championships explained",
  description: "The Oireachtas (say “oh-ROCK-tus”) is the yearly regional Irish dance championship. Qualifying, recalls, Nationals and Worlds explained for parents.",
  h1: "The Oireachtas, explained",
  short: `The <strong>Oireachtas</strong> (say “${esc(oir.say)}”), also called Regionals, is ${esc(lower1(sentence(oir.means)))} ${esc(sentence(oir.why))}`,
  body: `
  <h2>The words around it</h2>
  ${words("Region", "Majors", "Recall", "World qualifier", "National qualifier", "Nationals", "NAIDC", "Worlds", "All-Irelands")}
  <h2>Getting ready</h2>
  ${checklistHtml("champ")}`,
  faqs: [
    { q: "How do you pronounce Oireachtas?", a: `Oireachtas is said “${oir.say}”.` },
    { q: "Who registers my dancer for the Oireachtas?", a: item("champ", "elig").tip || "" },
    { q: "What is a recall?", a: `${sentence(W("Recall").means)} ${sentence(W("Recall").why)}` }
  ].filter((f) => f.a),
  related: [["guide/how-championships-are-judged/", "How championships are judged"], ["guide/clrg-levels/", "CLRG levels"]]
});

{
  const orgsWithLevels = levelOrgs.map((o) => ({ o, lv: D.levels.filter((l) => l.org === o.id && !l.adult && !l.only).sort((a, b) => a.order - b.order) }));
  answerPage({
    slug: "moving-up-in-irish-dance",
    title: "How moving up works in Irish dance, for every organization",
    description: `When and how Irish dancers move up a level in ${listJoin(levelOrgs.map((o) => o.name))}: the placings needed at each level, side by side.`,
    h1: "How moving up works in Irish dance",
    short: "At the lower levels, dancers usually move up one dance at a time, by placing high enough in that dance. So a dancer can be at one level in reel and another in light jig. The placing needed, and how many dancers must be in the competition, depends on your organization.",
    body: orgsWithLevels.map(({ o, lv }) => `
  <h2>${esc(o.name)}</h2>
  ${NA_NOTE[o.id] ? `<p class="small muted">${esc(NA_NOTE[o.id].split(". ")[0])}.</p>` : ""}
  ${lv.map((l) => `<div class="qa"><h3>${esc(l.name)}</h3><p>${esc(sentence(l.moveUp))}</p></div>`).join("")}
  <p class="small"><a href="/guide/${SLUG[o.id]}-levels/">Everything about ${esc(o.name)} levels</a></p>
  ${o.id === "clrg" ? ladderLinks() : ""}`).join(""),
    faqs: orgsWithLevels.map(({ o, lv }) => ({ q: `How do dancers move up in ${o.name}?`, a: lv.filter((l) => l.moveUpPlace).map((l) => `${l.name}: ${lower1(sentence(l.moveUp))}`).join(" ") })).filter((f) => f.a),
    related: [["guide/how-championships-are-judged/", "How championships are judged"]],
    appLink: "/app.html#/levels"
  });
}

answerPage({
  slug: "irish-dance-shoes",
  title: "Irish dance shoes explained: ghillies, reel shoes and hard shoes",
  description: "Soft shoes, ghillies, reel shoes and hard shoes: what each one is for, when dancers usually get hard shoes, and how they should fit.",
  h1: "Irish dance shoes, explained",
  short: `Irish dancers wear two kinds of shoes. <strong>Soft shoes</strong> are ghillies for girls and reel shoes for boys. <strong>Hard shoes</strong> have fiberglass tips and heels that make the rhythm. ${esc(item("new", "soft").tip)}`,
  body: `
  <h2>The shoes</h2>
  ${words("Soft shoe", "Ghillies", "Reel shoes", "Hard shoe", "Buckles", "Elastics")}
  <h2>Socks</h2>
  ${words("Poodle socks", "Sock glue")}
  <h2>Shoe tips from other parents</h2>
  <ul class="list">
    <li>${esc(item("new", "name").t)}</li>
    <li>${esc(item("solo", "shoes").t)}</li>
    <li>${esc(item("bag", "laces").t)}</li>
    <li>${esc(item("bag", "marker").t)}</li>
  </ul>`,
  faqs: [
    { q: "When do Irish dancers get hard shoes?", a: `Usually once the teacher says so, often around CLRG's Beginner 2 level. ${item("new", "wait").tip}` },
    { q: "How should ghillies fit?", a: item("new", "soft").tip }
  ],
  related: [["guide/how-much-does-irish-dance-cost/", "How much Irish dance costs"], ["guide/what-to-bring-to-a-feis/", "What to bring to a feis"]]
});

answerPage({
  slug: "irish-dance-costumes-and-wigs",
  title: "Irish dance costumes, solo dresses and wigs explained for parents",
  description: "School costumes, solo dresses, wigs, tan and blackout: what Irish dancers wear at each stage and what parents should check before buying.",
  h1: "Irish dance costumes, solo dresses and wigs",
  short: "Most dancers start in the school costume, in the school's colors. A solo dress, wig and tan usually come later, as dancers move up, and the rules on when they're allowed depend on your organization, region and level. Talk to the teacher before ordering anything.",
  body: `
  <h2>What dancers wear</h2>
  ${words("School costume", "Solo dress", "Wig", "Headband", "Tan", "Blackout costume", "Waistcoat", "Kick pants")}
  <h2>Before you buy a solo dress</h2>
  ${checklistHtml("solo", ["Before you buy", "When it arrives"])}`,
  faqs: [
    { q: "When can my dancer wear a solo dress?", a: item("solo", "rules").tip },
    { q: "Do Irish dancers have to wear wigs?", a: `${sentence(W("Wig").means)} ${sentence(W("Wig").why)}` }
  ],
  related: [["guide/how-much-does-irish-dance-cost/", "How much Irish dance costs"]]
});

answerPage({
  slug: "irish-dances-explained",
  title: "The Irish dances explained: reel, jigs, hornpipe and set dances",
  description: "Reel, light jig, slip jig, single jig, treble jig, hornpipe, traditional and own choice sets, and team dances, explained simply for parents.",
  h1: "The Irish dances, explained",
  short: `Irish dancers learn soft shoe dances first (${esc(lower1(W("Soft shoe").means.split(": ")[1] || "reel, light jig, slip jig and single jig"))}), then hard shoe dances (${esc(W("Hard shoe").means.split(": ")[1] || "treble jig and hornpipe")}). Set dances and team dances come later.`,
  body: `
  <h2>Soft shoe dances</h2>
  ${words("Reel", "Light jig", "Slip jig", "Single jig")}
  <h2>Hard shoe dances</h2>
  ${words("Treble jig", "Hornpipe", "Treble reel", "Traditional speed")}
  <h2>Set dances</h2>
  ${words("Set dance", "Traditional set", "Own choice set")}
  <h2>Team dances</h2>
  ${words("Ceili", "Figure dance", "Two-hand", "Eight-hand")}
  <h2>The look</h2>
  ${words("Carriage", "Turnout", "Steps")}`,
  related: [["guide/irish-dance-shoes/", "Irish dance shoes"], ["guide/irish-dance-words/", "All the Irish dance words"]]
});

answerPage({
  slug: "tcrg-adcrg-meaning",
  title: "What TCRG, ADCRG and other Irish dance teacher letters mean",
  description: "TCRG, ADCRG, SDCRG, TMRF and CRN's TMCRN and ADCRN: what the letters after an Irish dance teacher's or judge's name mean.",
  h1: "What TCRG, ADCRG and the other letters mean",
  short: `<strong>TCRG</strong> means ${esc(lower1(sentence(W("TCRG").means)))} <strong>ADCRG</strong> means ${esc(lower1(sentence(W("ADCRG").means)))}`,
  body: `
  <h2>The letters</h2>
  ${D.glossary.filter((w) => w.g === "people" && /^[A-Z-]{4,}$/.test(w.term)).map(wordCard).join("")}
  ${words("Adjudicator", "Feis committee")}`,
  faqs: [
    { q: "What does TCRG mean?", a: `${sentence(W("TCRG").means)} ${sentence(W("TCRG").why)}` },
    { q: "What does ADCRG mean?", a: `${sentence(W("ADCRG").means)} ${sentence(W("ADCRG").why)}` }
  ],
  related: [["guide/organizations/", "The Irish dance organizations"]]
});

// ---------- Feis calendar pages (feis/) ----------
// Built from feis.json, which a GitHub Action refreshes from the organizations' own calendars every 6 hours.
// Only upcoming feiseanna are shown. Places are matched to a country and state or province where the text makes it clear.
const FEIS = JSON.parse(fs.readFileSync(path.join(ROOT, "feis.json"), "utf8"));
const today = new Date().toISOString().slice(0, 10);
const upcoming = FEIS.events.filter((e) => (e.end || e.start) >= today).sort((a, b) => a.start.localeCompare(b.start) || a.name.localeCompare(b.name));
const appJs = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");
const CLRG_REGIONS = [...(appJs.match(/CLRG_REGION_CALENDARS = \[([\s\S]*?)\];/) || ["", ""])[1].matchAll(/\["([^"]+)", "([^"]+)"\]/g)].map((m) => ({ name: m[1], url: m[2] }));
const ORG_CAL = Object.fromEntries(FEIS.sources.filter((s) => s.org !== "all" && s.url).map((s) => [s.org, s]));

const US = { AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California", CO: "Colorado", CT: "Connecticut", DE: "Delaware", DC: "Washington DC", FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming" };
const CA = { AB: "Alberta", BC: "British Columbia", MB: "Manitoba", NB: "New Brunswick", NL: "Newfoundland and Labrador", NS: "Nova Scotia", ON: "Ontario", PE: "Prince Edward Island", QC: "Quebec", SK: "Saskatchewan" };
const UK_PARTS = {
  "Northern Ireland": ["northern ireland", "belfast", "antrim", "derry", "londonderry", "armagh", "tyrone", "fermanagh", "larne", "carrickfergus", "newry", "lisburn", "ballymena", "coleraine", "omagh", "enniskillen", "portrush"],
  Scotland: ["scotland", "glasgow", "edinburgh", "aberdeen", "dundee", "falkirk", "rothesay", "inverness", "stirling"],
  Wales: ["wales", "cardiff", "swansea", "wrexham"],
  England: ["england", "london", "birmingham", "manchester", "liverpool", "leeds", "bristol", "kent", "surrey", "essex", "wiltshire", "swindon", "evesham", "enfield", "bexley", "coventry", "leicester", "nottingham", "sheffield", "newcastle", "oxford", "luton", "watford", "croydon", "furness", "lancashire", "yorkshire", "cheshire", "devon", "cornwall", "sussex", "hampshire"]
};
const IE_PLACES = ["ireland", "dublin", "cork", "galway", "limerick", "waterford", "kilkenny", "wexford", "gorey", "enniscorthy", "carlow", "kildare", "meath", "louth", "dundalk", "drogheda", "westmeath", "mullingar", "longford", "roscommon", "lecarrow", "sligo", "mayo", "leitrim", "donegal", "letterkenny", "cavan", "monaghan", "offaly", "laois", "tipperary", "ennis", "kerry", "tralee", "killarney", "wicklow", "ashbourne", "ballinasloe", "athlone", "leinster", "munster", "connacht"];
const OTHER = ["Australia", "New Zealand", "Mexico", "Germany", "Netherlands", "Belgium", "France", "Italy", "Spain", "Portugal", "Switzerland", "Austria", "Poland", "Czech Republic", "Hungary", "Russia", "Belarus", "Ukraine", "Sweden", "Norway", "Denmark", "Finland", "Japan", "China", "South Africa", "Argentina", "Brazil"];
const CITY_COUNTRY = { budapest: "Hungary", moscow: "Russia", "st petersburg": "Russia", "saint petersburg": "Russia", minsk: "Belarus", sydney: "Australia", melbourne: "Australia", brisbane: "Australia", perth: "Australia", adelaide: "Australia", auckland: "New Zealand", paris: "France", rome: "Italy", florence: "Italy", berlin: "Germany", munich: "Germany", prague: "Czech Republic", warsaw: "Poland", amsterdam: "Netherlands" };
const has = (t, w) => new RegExp(`(^|[^a-z])${w.replace(/ /g, "\\s+")}([^a-z]|$)`).test(t);

function whereIs(e) {
  const raw = [e.place, e.region].filter(Boolean).join(", ");
  const t = raw.toLowerCase();
  if (!t || /crimea|sevastopol/.test(t)) return null;
  for (const [code, name] of Object.entries(CA)) if (has(t, name.toLowerCase()) || new RegExp(`(^|, )${code}(,|$)`, "i").test(raw.replace(/\s*,\s*/g, ", "))) return { country: "Canada", sub: name };
  if (has(t, "canada")) return { country: "Canada" };
  for (const [code, name] of Object.entries(US)) {
    if (code === "WA" && /washington dc/.test(t)) continue;
    if (has(t, name.toLowerCase()) || new RegExp(`(^|, )${code}(,|$)`).test(raw.replace(/\s*,\s*/g, ", "))) return { country: "United States", sub: name };
  }
  if (/\busa\b|united states|\bus\b|mid america|north america east/.test(t)) return { country: "United States" };
  for (const [part, list] of Object.entries(UK_PARTS)) if (list.some((w) => has(t, w))) return { country: "United Kingdom", sub: part };
  if (/\buk\b|united kingdom|great britain/.test(t)) return { country: "United Kingdom" };
  if (IE_PLACES.some((w) => has(t, w))) return { country: "Ireland" };
  for (const c of OTHER) if (has(t, c.toLowerCase())) return { country: c };
  for (const [city, c] of Object.entries(CITY_COUNTRY)) if (has(t, city)) return { country: c };
  return null;
}
const slugify = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const fmtDate = (d) => new Date(d + "T12:00:00Z").toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
const fmtRange = (e) => (e.end && e.end !== e.start ? `${fmtDate(e.start)} to ${fmtDate(e.end)}` : fmtDate(e.start));
const tidyPlace = (p) => String(p || "").replace(/^Venue:\s*/i, "").replace(/\.$/, "").trim();
upcoming.forEach((e) => { e._where = whereIs(e); });

const eventLd = (e) => {
  const w = e._where;
  if (!w) return null;
  const online = /digital|online|virtual/i.test(e.name);
  return {
    "@context": "https://schema.org", "@type": "Event",
    name: e.name, startDate: e.start, endDate: e.end || e.start,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: online ? "https://schema.org/OnlineEventAttendanceMode" : "https://schema.org/OfflineEventAttendanceMode",
    location: online ? { "@type": "VirtualLocation", url: e.url } : {
      "@type": "Place", name: tidyPlace(e.place) || w.sub || w.country,
      address: { "@type": "PostalAddress", ...(w.sub && w.country !== "United Kingdom" ? { addressRegion: w.sub } : {}), addressCountry: w.country }
    },
    description: `An Irish dance competition (feis)${orgById[e.org] ? " run under " + orgById[e.org].name + " rules" : ""}.`,
    organizer: { "@type": "Organization", name: e.host || (orgById[e.org] || {}).fullName || "Feis committee", ...(e.url ? { url: e.url } : {}) },
    ...(e.url ? { url: e.url } : {})
  };
};
const eventCard = (e) => {
  const where = tidyPlace(e.place) || e.region || "";
  const o = orgById[e.org];
  return `
  <div class="qa">
    <h3>${e.url ? `<a href="${esc(e.url)}" rel="noopener nofollow">${esc(e.name)}</a>` : esc(e.name)}${o ? `<span class="tag">${esc(o.name)}</span>` : ""}</h3>
    <p style="margin-bottom:.4em"><strong>${esc(fmtRange(e))}</strong>${where ? ` · ${esc(where)}` : ""}</p>
    ${e.kind || e.host ? `<p class="small muted">${[e.kind ? esc(e.kind) : "", e.host ? "Hosted by " + esc(e.host) : ""].filter(Boolean).join(" · ")}</p>` : ""}
  </div>`;
};
const byMonth = (list) => {
  const months = {};
  for (const e of list) (months[e.start.slice(0, 7)] = months[e.start.slice(0, 7)] || []).push(e);
  return Object.entries(months).map(([m, es]) => `
  <h2>${esc(new Date(m + "-15T12:00:00Z").toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" }))}</h2>
  ${es.map(eventCard).join("")}`).join("");
};
const checkedNote = `<p class="small muted">From the organizations' official calendars and regional feis lists, last checked ${esc(fmtDate((FEIS.checked || today).slice(0, 10)))}. Dates and details can change, so always check the feis's own page and syllabus before entering.</p>`;
const officialCalendars = (orgIds) => {
  const rows = orgIds.map((id) => ORG_CAL[id]).filter(Boolean).map((s) => `<li><a href="${esc(s.url)}" rel="noopener">${esc(s.name)}</a></li>`);
  if (orgIds.includes("clrg")) CLRG_REGIONS.forEach((r) => rows.push(`<li><a href="${esc(r.url)}" rel="noopener">CLRG ${esc(r.name)} region feis calendar</a></li>`));
  return rows.length ? `<h2>Official calendars</h2><p>Most local feiseanna are listed on these calendars:</p><ul class="list">${rows.join("")}</ul>` : "";
};
const years = (list) => { const y = [...new Set(list.map((e) => e.start.slice(0, 4)))].sort(); return y.length ? (y.length > 1 ? `${y[0]}–${y[y.length - 1].slice(2)}` : y[0]) : today.slice(0, 4); };
const feisPages = [];

function feisPage({ slug, place, list, intro, orgIds, crumbs = [], extra = "", title, h1 }) {
  const n = list.length;
  feisPages.push({ slug, place, n });
  page({
    base: "feis", slug,
    title: title || `Irish dance competitions in ${place}: feis calendar ${years(list)}`,
    description: clip(n ? `${n} upcoming Irish dance competition${n === 1 ? "" : "s"} (feiseanna) in ${place}, with dates, places and links, from the official organization calendars. Updated every day.` : `Where to find Irish dance competitions (feiseanna) in ${place}: the official organization calendars, kept up to date.`),
    h1: h1 || `Irish dance competitions in ${place}`,
    lede: intro || `Upcoming feiseanna in ${place}, from the organizations' official calendars.`,
    crumbs,
    appLink: "/app.html#/feis", appLabel: "See the feis calendar in the app",
    ld: list.map(eventLd).filter(Boolean),
    body: `
  ${n ? byMonth(list) : `<p class="note">No upcoming feiseanna in ${esc(place)} are on the calendars we read right now. Check the official calendars below, which list local feiseanna as soon as they're announced.</p>`}
  ${checkedNote}
  ${extra}
  ${officialCalendars(orgIds)}
  <p>New to it all? Read <a href="/guide/what-is-a-feis/">what a feis is</a> and <a href="/guide/what-to-bring-to-a-feis/">what to bring</a>.</p>`
  });
}

// Countries, with states, provinces and UK nations under them when they have feiseanna.
const ALWAYS = ["United States", "Canada", "Ireland", "United Kingdom"];
const countries = [...new Set([...ALWAYS, ...upcoming.filter((e) => e._where).map((e) => e._where.country)])];
const COUNTRY_ORGS = { "United States": ["clrg", "crn", "crdm"], Canada: ["clrg", "crn"], Ireland: ["clrg", "comhdhail", "crn", "crdm", "wida"], "United Kingdom": ["clrg", "comhdhail", "crn", "crdm", "wida"] };
const countryName = (c) => (c === "United States" ? "the United States" : c === "United Kingdom" ? "the United Kingdom" : c === "Netherlands" ? "the Netherlands" : c);
for (const c of countries) {
  const list = upcoming.filter((e) => e._where && e._where.country === c);
  const subs = [...new Set(list.map((e) => e._where.sub).filter(Boolean))].sort();
  const cslug = slugify(c);
  const subLinks = subs.length ? `<h2>By ${c === "United States" ? "state" : c === "Canada" ? "province" : "nation"}</h2><ul class="toc">${subs.map((s) => `<li><a href="/feis/${cslug}/${slugify(s)}/">${esc(s)}</a></li>`).join("")}</ul>` : "";
  feisPage({
    slug: cslug, place: countryName(c), list, orgIds: COUNTRY_ORGS[c] || [...new Set(list.map((e) => e.org))],
    intro: `Upcoming feiseanna in ${countryName(c)}, from the organizations' official calendars${c === "United States" || c === "Canada" ? " and regional feis lists" : ""}.`,
    extra: subLinks
  });
  for (const s of subs) {
    const sl = list.filter((e) => e._where.sub === s);
    feisPage({
      slug: `${cslug}/${slugify(s)}`, place: s, list: sl, orgIds: [...new Set(sl.map((e) => e.org))],
      crumbs: [{ name: c, url: `${SITE}/feis/${cslug}/` }],
      extra: `<p>See all <a href="/feis/${cslug}/">Irish dance competitions in ${esc(countryName(c))}</a>.</p>`
    });
  }
}

// Organizations.
for (const o of orgs.filter((x) => ORG_CAL[x.id] || upcoming.some((e) => e.org === x.id))) {
  const list = upcoming.filter((e) => e.org === o.id);
  feisPage({
    slug: SLUG[o.id], place: `${o.name} feiseanna`, list, orgIds: [o.id],
    title: `${o.name} feis calendar: upcoming Irish dance competitions ${years(list)}`,
    h1: `${o.name} feis calendar`,
    intro: `Upcoming ${o.name}${o.fullName && o.fullName !== o.name ? " (" + o.fullName + ")" : ""} feiseanna and championships, from its official calendar${o.id === "clrg" ? " and the North American regional feis lists" : ""}.`,
    extra: `<p>About ${esc(o.name)}: <a href="/guide/organizations/#${SLUG[o.id]}">the organization</a>${levelOrgs.includes(o) ? ` · <a href="/guide/${SLUG[o.id]}-levels/">its levels</a>` : ""}${ruleOrgs.includes(o) ? ` · <a href="/guide/${SLUG[o.id]}-rules/">its rules</a>` : ""}.</p>`
  });
}

// Feis calendar home.
{
  const cList = countries.map((c) => ({ c, n: upcoming.filter((e) => e._where && e._where.country === c).length }));
  page({
    base: "feis", slug: "",
    title: `Irish dance feis calendar ${years(upcoming)}: upcoming competitions by place`,
    description: clip(`${upcoming.length} upcoming Irish dance competitions (feiseanna) in the US, Canada, Ireland, the UK and beyond, from the official ${listJoin(orgs.filter((o) => ORG_CAL[o.id]).map((o) => o.name))} calendars. Updated every day.`),
    h1: "Irish dance feis calendar",
    lede: "Upcoming feiseanna and championships from the organizations' own calendars and regional feis lists, checked several times a day.",
    appLink: "/app.html#/feis", appLabel: "Open the feis calendar in the app",
    body: `
  <h2>By country</h2>
  <div class="grid">${cList.map(({ c, n }) => `<a class="card" href="/feis/${slugify(c)}/"><h3>${esc(c)}</h3><p>${n ? `${n} upcoming` : "Official calendars"}</p></a>`).join("")}</div>
  <h2>By organization</h2>
  <div class="grid">${orgs.filter((o) => ORG_CAL[o.id] || upcoming.some((e) => e.org === o.id)).map((o) => `<a class="card" href="/feis/${SLUG[o.id]}/"><h3>${esc(o.name)}</h3><p>${upcoming.filter((e) => e.org === o.id).length} upcoming</p></a>`).join("")}</div>
  <h2>Coming up next</h2>
  ${upcoming.slice(0, 12).map(eventCard).join("")}
  ${checkedNote}`
  });
}

// ---------- Guide home ----------
const cards = pages.filter((p) => p.base === "guide").map((p) => ({ href: `/guide/${p.slug}/`, title: p.h1, text: p.description }));
const order = ["what-is-a-feis", "first-feis", "what-to-bring-to-a-feis", "how-much-does-irish-dance-cost", "moving-up-in-irish-dance", "how-championships-are-judged", "oireachtas-explained", "organizations", "irish-dance-words", "irish-dances-explained", "irish-dance-shoes", "irish-dance-costumes-and-wigs", "tcrg-adcrg-meaning", "feis-checklists"];
cards.sort((a, b) => {
  const ia = order.findIndex((s) => a.href.includes("/" + s + "/")), ib = order.findIndex((s) => b.href.includes("/" + s + "/"));
  return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
});
page({
  slug: "",
  title: "Irish dance explained for parents: levels, rules, words and feis tips",
  description: "Plain-language guides for Irish dance parents: levels and moving up, rules for CLRG, An Comhdháil, WIDA, CRN and CRDM, feis words and checklists.",
  h1: "Irish dance, explained for parents",
  lede: "New to Irish dance? These guides explain the organizations, levels, rules and words in plain language, so feis day makes sense.",
  body: `
  <p><a class="btn teal" href="/feis/">Find a feis near you</a></p>
  <div class="grid">${cards.map((c) => `<a class="card" href="${c.href}"><h3>${esc(c.title)}</h3><p>${esc(c.text)}</p></a>`).join("")}</div>`
});

// ---------- Write files ----------
for (const b of ["guide", "feis"]) fs.rmSync(path.join(ROOT, b), { recursive: true, force: true });
for (const p of pages) {
  const dir = path.join(ROOT, p.base, p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), p.html);
}

const urls = [{ loc: SITE + "/", priority: "1.0" }, ...pages.map((p) => ({ loc: p.url, priority: p.slug ? "0.8" : "0.9" }))];
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${lastmod}</lastmod><priority>${u.priority}</priority></url>`).join("\n")}
</urlset>
`);

for (const p of pages) {
  const warn = [p.title.length > 70 ? `title ${p.title.length} chars` : "", p.description.length > 160 ? `description ${p.description.length} chars` : ""].filter(Boolean).join(", ");
  console.log(`${p.base}/${p.slug}${p.slug ? "/" : ""}  ${warn ? "(" + warn + ")" : ""}`);
}
console.log(`${pages.length} pages and sitemap.xml written.`);
