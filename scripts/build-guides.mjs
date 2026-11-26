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

function page({ slug, title, description, h1, lede, body, crumbs = [], ld = [], appLink = "/app.html", appLabel = "Open this in the app" }) {
  const url = `${SITE}/guide/${slug ? slug + "/" : ""}`;
  const trail = [{ name: "Home", url: SITE + "/" }, { name: "Parent guide", url: SITE + "/guide/" }, ...crumbs];
  if (!slug) trail.pop();
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
    <a href="/app.html#/privacy">Privacy policy</a>
    <a href="/app.html#/terms">Terms of use</a>
    <a href="mailto:pocketirishdance@gmail.com">Contact us</a>
  </nav>
  <p>Pocket Irish Dance is an independent guide for parents. It is not an official publication of, or endorsed by, any Irish dance organization. Always check important decisions with your teacher and the current official rules.</p>
  <p style="margin:0">© ${new Date().getFullYear()} Pocket Irish Dance</p>
</div></footer>
<script src="/count.js"></script>
<script>if (window.PID_COUNT && PID_COUNT.guide) PID_COUNT.guide(${JSON.stringify(slug || "home")}, ${JSON.stringify(h1)});</script>
</body>
</html>
`;
  pages.push({ slug, url, title, description, h1, html });
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
  clrg: "These are the CLRG level names used at feiseanna in North America (the United States, Canada and Mexico). Great Britain, Ireland and Australia use different names for the lower levels. At the lower levels a dancer moves up one dance at a time, so they can be at different levels in different dances."
};
for (const o of levelOrgs) {
  const lv = D.levels.filter((l) => l.org === o.id).sort((a, b) => a.order - b.order);
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
  <p>${ruleOrgs.includes(o) ? `More questions? See <a href="/guide/${SLUG[o.id]}-rules/">${esc(o.name)} rules in plain words</a>, or ` : "See "}<a href="/guide/how-championships-are-judged/">how championships are judged</a>.</p>`
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

// ---------- Guide home ----------
const cards = pages.map((p) => ({ href: `/guide/${p.slug}/`, title: p.h1, text: p.description }));
const order = ["organizations", "irish-dance-words", "how-championships-are-judged", "feis-checklists"];
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
  <div class="grid">${cards.map((c) => `<a class="card" href="${c.href}"><h3>${esc(c.title)}</h3><p>${esc(c.text)}</p></a>`).join("")}</div>`
});

// ---------- Write files ----------
const guideDir = path.join(ROOT, "guide");
fs.rmSync(guideDir, { recursive: true, force: true });
for (const p of pages) {
  const dir = path.join(guideDir, p.slug);
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
  console.log(`guide/${p.slug}${p.slug ? "/" : ""}  ${warn ? "(" + warn + ")" : ""}`);
}
console.log(`${pages.length} guide pages and sitemap.xml written.`);
