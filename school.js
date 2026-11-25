/* Schools and teachers: pick each dancer's school, teachers claim their school (checked by hand by
   the app team), and families can agree to share a dancer's results with that teacher.
   Sharing is off until a parent agrees, for one dancer, to a named teacher. Once agreed, all that
   dancer's results are shared and kept up to date, until the parent turns it off.
   Uses the same account as Friends. Privacy rules live in supabase/schools.sql. */
(function () {
  "use strict";

  const ORGS = [
    { id: "clrg", name: "CLRG" },
    { id: "comhdhail", name: "An Comhdháil" },
    { id: "wida", name: "WIDA" },
    { id: "idtana", name: "IDTANA" },
    { id: "other", name: "Other or not sure" }
  ];
  const orgName = (id) => (ORGS.find((o) => o.id === id) || {}).name || "";
  const COUNTRIES = ["United States", "Canada", "Mexico", "Ireland", "Northern Ireland", "England", "Scotland", "Wales", "Australia", "New Zealand", "Other"];

  window.PID_SCHOOL = function (A) {
    const { ext, esc, toast, rerender, fmtDate, ordinal } = A;
    const acct = A.acct;
    if (!acct) return;
    const sb = acct.sb;
    const S = () => A.S();
    const myId = () => (acct.user() || {}).id;
    const shares = () => (S().teacherShare = S().teacherShare || {});
    const notices = () => (S().teacherNotice = S().teacherNotice || {});

    const T = {
      schools: {},      // id -> school (with teacher_name and claim_id of the approved teacher)
      mine: null,       // my score_shares rows from the server
      found: null, q: "", adding: false,
      claims: null, isAdmin: false, teach: null, admin: null, err: ""
    };

    const hash = (s) => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return String(h >>> 0); };
    const ago = (iso) => {
      if (!iso) return "not yet";
      const s = (Date.now() - new Date(iso).getTime()) / 1000;
      if (s < 90) return "just now"; if (s < 3600) return Math.floor(s / 60) + " min ago";
      if (s < 86400) return Math.floor(s / 3600) + " h ago";
      return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" });
    };
    const page = (title, html, after, back) => ({ title, tab: "scores", back: back !== false, html, after });
    const loading = (title) => page(title, `<div class="empty"><span class="spinner" aria-hidden="true"></span><p>Loading…</p></div>`);
    const appLink = (hash) => location.origin + location.pathname + hash;
    const mailto = (subject, body) => `mailto:${A.contactEmail}?subject=${encodeURIComponent("Pocket Irish Dance: " + subject)}&body=${encodeURIComponent(body || "")}`;
    const where = (sc) => [sc.town, sc.country].filter(Boolean).join(", ");

    async function getSchool(id, force) {
      if (T.schools[id] && !force) return T.schools[id];
      const { data, error } = await sb.rpc("get_school", { sid: id });
      if (error) throw error;
      if (data && data[0]) T.schools[id] = data[0];
      return T.schools[id] || null;
    }
    function loadThen(promise) { promise.then(rerender, (err) => { T.err = "Couldn't reach the school list. Check your connection and try again."; acct.fail(err); rerender(); }); }

    // ---------- keeping the shared copy up to date ----------
    let lastCheck = 0, syncTimer = null, syncing = null;

    // Match what's on this phone with what's on the server.
    async function reconcile() {
      if (!sb || !acct.profile()) return;
      const { data, error } = await sb.from("score_shares").select("id, dancer_key, dancer_name, school_id, claim_id, agreed_at, synced_at").eq("user_id", myId());
      if (error) throw error;
      T.mine = data;
      const st = S(); let changed = false;
      Object.keys(shares()).forEach((did) => {
        const loc = shares()[did];
        const srv = data.find((x) => x.dancer_key === did);
        if (!srv) {
          // Stopped somewhere else, or the school's teacher changed or left (which deletes the share).
          notices()[did] = `Sharing with ${loc.teacher || "the teacher"} has stopped. This happens if the school's teacher changed or left the app. Nothing is shared now. You can choose to share again below.`;
          delete shares()[did]; changed = true;
        } else if (srv.claim_id !== loc.claimId) { loc.claimId = srv.claim_id; loc.hash = ""; changed = true; }
      });
      // Shared from this account on another phone (or before a restore): pick it back up if the dancer is here.
      data.forEach((srv) => {
        if (!shares()[srv.dancer_key] && st.dancers.some((d) => d.id === srv.dancer_key)) {
          shares()[srv.dancer_key] = { shareId: srv.id, schoolId: srv.school_id, claimId: srv.claim_id, teacher: "", since: srv.agreed_at, hash: "" };
          changed = true;
        }
      });
      if (changed) A.save();
    }

    async function syncNow() {
      if (!sb || !acct.profile()) return;
      const st = S(); let changed = false;
      for (const did of Object.keys(shares())) {
        const loc = shares()[did];
        if (!st.dancers.some((d) => d.id === did)) continue;
        const rows = A.shareRows(did);
        const h = hash(JSON.stringify(rows));
        if (h === loc.hash) continue;
        const { error } = await sb.rpc("sync_shared_results", { sh: loc.shareId, items: rows });
        if (error) throw error;
        loc.hash = h; loc.syncedAt = new Date().toISOString(); changed = true;
      }
      if (changed) A.save();
    }

    function checkAndSync(force) {
      if (!sb || !acct.profile() || syncing) return syncing;
      if (!force && Date.now() - lastCheck < 60000) { scheduleSync(); return null; }
      lastCheck = Date.now();
      syncing = reconcile().then(syncNow).catch((err) => console.warn("Teacher sharing", err)).finally(() => { syncing = null; });
      return syncing;
    }
    function scheduleSync() {
      if (!Object.keys(shares()).length) return;
      clearTimeout(syncTimer);
      syncTimer = setTimeout(() => { if (!syncing) syncNow().catch((err) => console.warn("Teacher sharing", err)); }, 3000);
    }
    A.onSave(scheduleSync);
    A.onAccountReady = () => { checkAndSync(false); };
    A.onDancerDeleted = (did) => {
      if (!shares()[did]) return;
      delete shares()[did];
      if (sb) sb.rpc("stop_sharing", { dkey: did }).then(({ error }) => { if (error) console.warn(error); });
    };

    // ---------- the card on each dancer's Scores page ----------
    ext.schoolCard = (dn) => {
      if (!acct.ready) return "";
      const sc = dn.school, sh = shares()[dn.id], note = notices()[dn.id];
      const line = sh ? `✓ Sharing ${esc(dn.name)}'s results with ${esc(sh.teacher || "the teacher")}`
        : sc ? "Not shared with the teacher" : `Add ${esc(dn.name)}'s school. You can choose to share results with the teacher.`;
      return `${note ? `<div class="banner">ℹ️ ${esc(note)}</div>` : ""}
        <a class="card group-link" href="#/school/${esc(dn.id)}" style="margin-top:10px"><strong>🏫 ${sc ? esc(sc.name) : "School"}</strong><span class="small muted" style="display:block">${line}</span></a>`;
    };

    // ---------- finding and adding a school ----------
    function pickerHtml(mode, back) {
      const list = T.found;
      return `
        <form class="card" data-sform="search" data-mode="${mode}">
          <label class="field"><span>School name or town</span><input name="q" value="${esc(T.q)}" placeholder="For example: Trinity, Chicago or Mid America" required minlength="2" autocomplete="off"></label>
          <button class="btn block">Search</button>
        </form>
        ${list ? (list.length ? list.map((sc) => `<button class="card" data-s="pick" data-mode="${mode}" data-id="${esc(sc.id)}" style="display:block;width:100%;text-align:left;cursor:pointer;font:inherit;color:inherit">
            <strong>${esc(sc.name)}</strong>
            <span class="small muted" style="display:block">${esc([where(sc), orgName(sc.org)].filter(Boolean).join(" · "))}</span>
            <span class="small" style="display:block;margin-top:2px">${sc.teacher_name ? "🎓 Teacher: " + esc(sc.teacher_name) : '<span class="muted">Teacher hasn\'t joined yet</span>'}</span>
          </button>`).join("") : `<p class="muted center">No schools matched "${esc(T.q)}".</p>`) : ""}
        ${T.adding ? addSchoolForm(mode) : `<button class="btn plain block" data-s="adding">My school isn't listed</button>`}
        ${back ? `<button class="btn plain block" data-s="cancel-pick">Cancel</button>` : ""}`;
    }
    function addSchoolForm(mode) {
      const org = (S().profile || {}).org || "";
      return `<form class="card" data-sform="addschool" data-mode="${mode}">
        <h3>Add your school</h3>
        <p class="small muted" style="margin-top:0">Irish dance schools only. Please use the school's full name, as it appears on its website.</p>
        <label class="field"><span>School name</span><input name="name" required minlength="3" maxlength="80" placeholder="For example: Trinity Irish Dance Academy"></label>
        <label class="field"><span>Organization</span><select name="org" required>${ORGS.map((o) => `<option value="${o.id}" ${o.id === org ? "selected" : ""}>${esc(o.name)}</option>`).join("")}</select></label>
        <label class="field"><span>Town or city</span><input name="town" required minlength="2" maxlength="60"></label>
        <label class="field"><span>Country</span><select name="country" required>${COUNTRIES.map((c) => `<option>${esc(c)}</option>`).join("")}</select></label>
        <label class="field"><span>School website (optional)</span><input name="website" type="url" maxlength="200" placeholder="https://"></label>
        <button class="btn block">Add school</button>
      </form>`;
    }

    // ---------- a dancer's school (parents) ----------
    ext.school = (parts) => {
      const st = S();
      const dn = st.dancers.find((d) => d.id === parts[1]);
      if (!dn) return page("School", `<div class="empty">That dancer isn't on this phone.</div>`);
      const g = acct.need("School", { title: "School", html: `<div class="hero"><h2>${esc(dn.name)}'s school</h2><p>Pick ${esc(dn.name)}'s school, and if you like, share results with the teacher.</p></div>
        <div class="card"><ul class="small" style="margin:0;padding-left:18px;line-height:1.6">
          <li>Sharing is off until you agree to it.</li>
          <li>Only the school's teacher, checked by us, can see what you share.</li>
          <li>You can stop sharing at any time, and everything shared is deleted.</li>
        </ul></div>` });
      if (g) return g;
      if (!dn.school || parts[2] === "pick") {
        return page("Choose a school", `<h2 style="margin-top:0">Which school does ${esc(dn.name)} dance with?</h2>${pickerHtml("dancer:" + dn.id, !!dn.school)}`,
          () => { const i = document.querySelector('[data-sform="search"] input'); if (i && !T.found) i.focus(); });
      }
      const sc = T.schools[dn.school.id];
      if (!sc) { loadThen(getSchool(dn.school.id)); return T.err ? page("School", `<div class="banner">${esc(T.err)}</div>`) : loading("School"); }
      const sh = shares()[dn.id];
      const srv = T.mine && T.mine.find((x) => x.dancer_key === dn.id);
      const note = notices()[dn.id];
      const head = `<div class="card"><h2 style="margin:0">${esc(sc.name)}</h2><p class="small muted" style="margin:2px 0 0">${esc([where(sc), orgName(sc.org)].filter(Boolean).join(" · "))}</p>
        ${sc.teacher_name ? `<p style="margin:8px 0 0">🎓 Teacher: <strong>${esc(sc.teacher_name)}</strong> <span class="chip">Checked</span></p>` : ""}</div>`;
      let body;
      if (sh && sh.claimId === sc.claim_id) {
        body = `<div class="card" style="border:2px solid var(--green)">
          <h3 style="margin-top:0">✓ Sharing with ${esc(sc.teacher_name)}</h3>
          <p class="small" style="margin:0">All of ${esc(dn.name)}'s results are shared with ${esc(sc.teacher_name)}, including new ones you add. Shared since ${esc(fmtDate((sh.since || "").slice(0, 10)))}.</p>
          <p class="small muted" style="margin:6px 0 0">Last updated ${esc(ago((srv && srv.synced_at) || sh.syncedAt))}.</p>
          <button class="btn danger block" data-s="stop" data-dancer="${esc(dn.id)}" style="margin-top:12px">Stop sharing</button>
        </div>
        ${whatShared(dn)}
        <p class="small center"><a href="${mailto("Not our teacher", `The app shows ${sc.teacher_name} as the teacher for ${sc.name} (${where(sc)}). I don't think that's right because:\n\n`)}">Is this not your teacher? Tell us</a></p>`;
      } else if (sc.claim_id) {
        body = `${note ? `<div class="banner">ℹ️ ${esc(note)}</div>` : ""}
        <form class="card" data-sform="share" data-dancer="${esc(dn.id)}" data-school="${esc(sc.id)}" data-claim="${esc(sc.claim_id)}" data-teacher="${esc(sc.teacher_name)}">
          <h3 style="margin-top:0">Share ${esc(dn.name)}'s results with ${esc(sc.teacher_name)}?</h3>
          <p class="small" style="margin-top:0">${esc(sc.teacher_name)} could see how ${esc(dn.name)} is doing at every feis, and which judges placed ${esc(dn.name)} where. This is optional. Nothing is shared unless you agree.</p>
          <label class="field"><span>${esc(dn.name)}'s name, as the teacher knows them</span><input name="dname" value="${esc(dn.name)}" maxlength="40" required></label>
          <p class="small muted" style="margin-top:-4px">For example a first name and the first letter of the surname, so the teacher can tell dancers apart.</p>
          <label class="toggle top"><input type="checkbox" name="agree" required> <span>I'm ${esc(dn.name)}'s parent or guardian. I agree to share all of ${esc(dn.name)}'s results with ${esc(sc.teacher_name)} at ${esc(sc.name)}: the ones already in the app and every new one I add, until I turn this off.</span></label>
          <button class="btn block">Agree and share</button>
        </form>
        ${whatShared(dn)}
        <p class="small center"><a href="${mailto("Not our teacher", `The app shows ${sc.teacher_name} as the teacher for ${sc.name} (${where(sc)}). I don't think that's right because:\n\n`)}">Is this not your teacher? Tell us</a></p>`;
      } else {
        body = `<div class="card"><h3 style="margin-top:0">Your teacher hasn't joined yet</h3>
          <p class="small" style="margin-top:0">When ${esc(sc.name)}'s teacher joins and we've checked them, you'll be able to choose to share ${esc(dn.name)}'s results with them. Until then nothing is shared.</p>
          <button class="btn ghost block" data-s="invite-teacher" data-name="${esc(sc.name)}">Tell the teacher about the app</button></div>`;
      }
      return page("School", head + body + `<button class="btn plain block" data-s="change" data-dancer="${esc(dn.id)}" style="margin-top:10px">Change school</button>`,
        () => { if (!T.mine) checkAndSync(true).then(() => { if (location.hash.startsWith("#/school/")) rerender(); }); });
    };

    function whatShared(dn) {
      return `<details class="card small"><summary style="cursor:pointer;font-weight:700">What the teacher sees</summary>
        <p><strong>Shared:</strong> ${esc(dn.name)}'s name as you typed it, and for each result: the feis, date, dance, level, placing, number of dancers, score, recall, each judge's name and placing, and the judges' written comments.</p>
        <p style="margin-bottom:0"><strong>Never shared:</strong> photos, your own notes, the journal, what you wrote about judges, your other dancers (unless you share them too), and your email address.</p>
      </details>`;
    }

    // ---------- teachers ----------
    async function loadTeach() {
      const [cl, adm] = await Promise.all([
        sb.from("school_claims").select("id, school_id, teacher_name, status, created_at, decided_at, schools(name, town, country, org)").eq("user_id", myId()).in("status", ["pending", "approved"]).order("created_at"),
        sb.rpc("is_admin")
      ]);
      if (cl.error) throw cl.error;
      T.claims = cl.data; T.isAdmin = !adm.error && adm.data === true;
      const ok = T.claims.filter((c) => c.status === "approved").map((c) => c.id);
      if (ok.length) {
        const sh = await sb.from("score_shares").select("id, claim_id, dancer_name, agreed_at, synced_at, shared_results(*)").in("claim_id", ok).order("dancer_name");
        if (sh.error) throw sh.error;
        T.teach = sh.data;
      } else T.teach = [];
      if (T.isAdmin) { const a = await sb.rpc("admin_claims"); T.admin = a.error ? null : a.data; }
    }

    const teachIntro = { title: "For teachers", html: `<div class="hero"><h2>For Irish dance teachers</h2><p>See the results your dancers' families choose to share with you.</p></div>
      <div class="card"><ul class="small" style="margin:0;padding-left:18px;line-height:1.6">
        <li>Claim your school. We check every teacher by hand before anything is shared.</li>
        <li>Families decide whether to share, one dancer at a time, and can stop at any time.</li>
        <li>You see each shared dancer's placings, scores, judges and judges' comments.</li>
      </ul></div>` };

    ext.teach = (parts) => {
      const g = acct.need("For teachers", teachIntro); if (g) return g;
      if (parts[1] === "pick") return page("Claim your school", `<h2 style="margin-top:0">Find your school</h2>${pickerHtml("teach", true)}`);
      if (parts[1] === "claim") return claimForm(parts[2]);
      if (!T.claims) { loadThen(loadTeach()); return T.err ? page("For teachers", `<div class="banner">${esc(T.err)}</div>`) : loading("For teachers"); }
      if (parts[1] === "dancer") return teachDancer(parts[2]);
      return teachHome();
    };

    function claimForm(sid) {
      const sc = T.schools[sid];
      if (!sc) { loadThen(getSchool(sid)); return loading("Claim your school"); }
      if (sc.claim_id) return page("Claim your school", `<div class="card"><h3 style="margin-top:0">${esc(sc.name)} already has a teacher</h3>
        <p class="small">${esc(sc.teacher_name)} is the checked teacher for this school. Only one teacher can hold a school in the app for now.</p>
        <a class="btn ghost block" href="${mailto("School teacher", `I'm a teacher at ${sc.name} (${where(sc)}) and would like access too. My name and qualification:\n\n`)}">Email us about it</a></div>`);
      return page("Claim your school", `
        <div class="card"><h2 style="margin:0">${esc(sc.name)}</h2><p class="small muted" style="margin:2px 0 0">${esc([where(sc), orgName(sc.org)].filter(Boolean).join(" · "))}</p></div>
        <form class="card" data-sform="claim" data-school="${esc(sc.id)}">
          <label class="field"><span>Your name, as families know you</span><input name="name" required minlength="2" maxlength="60" placeholder="For example: Mary Byrne"></label>
          <label class="field"><span>Your teaching qualification</span><input name="cred" maxlength="80" placeholder="For example: TCRG, ADCRG, or your registration number"></label>
          <label class="field"><span>How can we check you teach here?</span><textarea name="proof" maxlength="500" rows="3" placeholder="For example: I'm listed on the school website (link), or email me at the school's address"></textarea></label>
          <p class="small muted">Next you'll email us your teaching credentials, and we'll check them by hand, usually within a few days. Families only see your name once you're approved.</p>
          <label class="toggle top"><input type="checkbox" name="agree" required> <span>I'm a teacher at this school. I'll only use what families share to help their dancers, and I won't pass it on to anyone else.</span></label>
          <button class="btn block">Send request</button>
        </form>`);
    }

    function teachHome() {
      const n = (T.admin || []).filter((c) => c.status === "pending").length;
      const claims = T.claims;
      return page("For teachers", `
        ${T.isAdmin ? `<a class="card group-link" href="#/admin"><strong>🛡️ App team: teacher requests</strong><span class="small muted" style="display:block">${n ? `${n} waiting for you to check` : "Nothing waiting"}</span></a>` : ""}
        ${claims.length ? claims.map((c) => c.status === "pending" ? `<div class="card">
            <div class="row between"><strong>${esc(c.schools.name)}</strong><span class="chip gold">Waiting</span></div>
            <p class="small" style="margin:6px 0 0"><strong>Next step:</strong> email us your teaching credentials, ideally from the school's own email address. Once we've checked them, families at ${esc(c.schools.name)} can choose to share with you.</p>
            <a class="btn block" style="margin-top:8px" href="${mailto("Teacher credentials", `School: ${c.schools.name} (${[c.schools.town, c.schools.country].filter(Boolean).join(", ")})\nMy name: ${c.teacher_name}\nApp sign-in email: ${(acct.user() || {}).email || ""}\n\nMy teaching qualification (for example TCRG, ADCRG or registration number), and a link to where the school lists me:\n\n`)}">✉️ Email us your credentials</a>
            <button class="btn plain sm" data-s="end-claim" data-id="${esc(c.id)}" data-pending="1" style="margin-top:6px">Withdraw request</button></div>`
          : teachSchool(c)).join("") : `<div class="card"><p style="margin:0">Claim your school, and once we've checked you, families can choose to share their dancers' results with you.</p></div>`}
        <a class="btn ${claims.length ? "ghost" : ""} block" href="#/teach/pick" style="margin-top:10px">🎓 Claim ${claims.length ? "another" : "your"} school</a>
        <p class="small muted center" style="margin-top:14px">What families share is for helping their dancers. Please don't share it with anyone else. <a href="#/terms">Terms of use</a></p>`);
    }

    function teachSchool(c) {
      const sh = T.teach.filter((x) => x.claim_id === c.id);
      const latest = sh.flatMap((x) => x.shared_results.map((r) => Object.assign({ who: x.dancer_name }, r)))
        .sort((a, b) => String(b.feis_date || "").localeCompare(String(a.feis_date || ""))).slice(0, 10);
      return `<div class="card">
          <div class="row between"><strong>${esc(c.schools.name)}</strong><span class="chip">Approved</span></div>
          <p class="small muted" style="margin:4px 0 0">${sh.length} dancer${sh.length === 1 ? "" : "s"} shared with you</p>
        </div>
        ${sh.length ? `<div class="card" style="padding:4px 14px">${sh.map((x) => `<a class="dance-row" href="#/teach/dancer/${esc(x.id)}" style="text-decoration:none;color:inherit"><span class="name">${esc(x.dancer_name)}</span><span class="small muted">${x.shared_results.length} result${x.shared_results.length === 1 ? "" : "s"} ›</span></a>`).join("")}</div>
          ${latest.length ? `<h3 style="margin-top:16px">Latest results</h3>${latest.map((r) => resultCard(r, r.who)).join("")}` : ""}`
          : `<div class="card small"><p style="margin-top:0">No families have shared yet. Let them know you're on the app: they pick ${esc(c.schools.name)} on their dancer's Scores page, and choose to share.</p>
            <button class="btn ghost block" data-s="invite-families" data-name="${esc(c.schools.name)}">Tell families</button></div>`}
        <button class="btn plain sm block" data-s="end-claim" data-id="${esc(c.id)}">Stop being this school's teacher in the app</button>`;
    }

    function judgeLine(j) {
      const what = j.kind === "round" ? `${["", "Soft shoe", "Hard shoe", "Set"][j.round] || "Round " + j.round} round` : j.kind === "panel" ? "Judge's rank" : "";
      return `${esc(j.name)}: ${j.place ? esc(ordinal(j.place)) : "?"}${what ? ` <span class="muted">(${what})</span>` : ""}${j.marks ? ` · ${esc(j.marks)}` : ""}`;
    }
    function resultCard(r, who) {
      const p = Number(r.place);
      const details = [r.level !== r.dance && r.level, r.feis, r.feis_date && fmtDate(r.feis_date), r.entrants && `${r.entrants} dancers`, r.marks && `score ${r.marks}`, r.recall && "Recalled ✨"].filter(Boolean).join(" · ");
      return `<article class="card"><div class="result" style="margin:0">
        <span class="place ${["", "p1", "p2", "p3"][p] || ""}">${p ? esc(ordinal(p)) : "–"}</span>
        <div class="meta"><strong>${who ? esc(who) + " · " : ""}${esc(r.dance || "Result")}</strong>${details ? `<span class="small muted">${esc(details)}</span>` : ""}</div></div>
        ${(r.judges || []).length ? `<div class="small" style="margin-top:6px">${r.judges.map(judgeLine).join("<br>")}</div>` : ""}
        ${(r.comments || []).length ? `<ul class="msgs">${r.comments.map((c) => `<li><strong>${esc(c.judge || "Judge")}:</strong> ${esc(c.text)}</li>`).join("")}</ul>` : ""}
      </article>`;
    }

    function teachDancer(id) {
      const x = (T.teach || []).find((s) => s.id === id);
      if (!x) return page("Dancer", `<div class="empty">This dancer isn't shared with you any more.</div>`);
      const rs = x.shared_results.slice().sort((a, b) => String(b.feis_date || "").localeCompare(String(a.feis_date || "")));
      const by = {};
      rs.forEach((r) => (r.judges || []).forEach((j) => {
        const k = String(j.name || "").toLowerCase().replace(/[^a-z]/g, ""); if (!k) return;
        const g = (by[k] = by[k] || { name: j.name, ps: [] }); if (j.place) g.ps.push(j.place); else g.ps.push(0);
      }));
      const judges = Object.values(by).sort((a, b) => b.ps.length - a.ps.length || a.name.localeCompare(b.name));
      const view = teachDancer.view || "results";
      return page(x.dancer_name, `
        <p class="small muted" style="margin-top:0">Shared by the family since ${esc(fmtDate(x.agreed_at.slice(0, 10)))}. Updated ${esc(ago(x.synced_at))}.</p>
        <div class="pill-tabs"><button data-s="tview" data-v="results" class="${view === "results" ? "on" : ""}">Results (${rs.length})</button><button data-s="tview" data-v="judges" class="${view === "judges" ? "on" : ""}">By judge</button></div>
        ${view === "judges" ? (judges.length ? judges.map((g) => { const placed = g.ps.filter((n) => n > 0);
            return `<div class="card"><strong>${esc(g.name)}</strong><p class="small muted" style="margin:2px 0 0">${[`judged ${g.ps.length} time${g.ps.length === 1 ? "" : "s"}`, placed.length && `best ${ordinal(Math.min(...placed))}`, placed.length && `average place ${(placed.reduce((a, b) => a + b, 0) / placed.length).toFixed(1)}`].filter(Boolean).join(" · ")}</p></div>`; }).join("")
            : `<div class="empty">No judges recorded yet.</div>`)
          : rs.length ? rs.map((r) => resultCard(r)).join("") : `<div class="empty">No results yet.</div>`}`);
    }

    // ---------- the app team: checking teachers ----------
    ext.admin = () => {
      const g = acct.need("Teacher requests", teachIntro); if (g) return g;
      if (!T.claims) { loadThen(loadTeach()); return loading("Teacher requests"); }
      if (!T.isAdmin) return page("Teacher requests", `<div class="empty">This page is for the app team.</div>`);
      const list = T.admin || [];
      const pending = list.filter((c) => c.status === "pending"), approved = list.filter((c) => c.status === "approved");
      const card = (c) => `<div class="card">
        <div class="row between"><strong>${esc(c.teacher_name)}</strong><span class="chip ${c.status === "pending" ? "gold" : ""}">${c.status === "pending" ? "Waiting" : "Approved"}</span></div>
        <dl class="facts small" style="margin-top:6px">
          <dt>School</dt><dd>${esc(c.school_name)}<div class="muted">${esc([c.school_town, c.school_country, orgName(c.school_org)].filter(Boolean).join(" · "))}</div>${c.school_website ? `<a href="${esc(c.school_website)}" target="_blank" rel="noopener">Open the school website ↗</a>` : ""}${c.school_source ? `<div class="muted">From: ${esc(c.school_source)}</div>` : ""}</dd>
          ${c.listed_teachers ? `<dt>Listed teachers</dt><dd>${esc(c.listed_teachers)}</dd>` : ""}
          ${c.school_email ? `<dt>School's email</dt><dd><a href="mailto:${esc(c.school_email)}">${esc(c.school_email)}</a></dd>` : ""}
          <dt>Qualification</dt><dd>${esc(c.credential || "Not given")}</dd>
          <dt>How to check</dt><dd>${esc(c.proof || "Not given")}</dd>
          <dt>Their email</dt><dd>${c.email ? `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>` : "?"}</dd>
          <dt>Sent</dt><dd>${esc(fmtDate(c.created_at.slice(0, 10)))}</dd>
          ${c.status === "approved" ? `<dt>Families sharing</dt><dd>${esc(c.families)}</dd>` : ""}
        </dl>
        ${c.other_teacher ? `<div class="banner" style="margin:8px 0">⚠️ ${esc(c.other_teacher)} is already the approved teacher for this school.</div>` : ""}
        ${c.status === "pending" ? `<div class="row" style="gap:8px;margin-top:8px"><button class="btn" style="flex:1" data-s="decide" data-id="${esc(c.id)}" data-ok="1" data-name="${esc(c.teacher_name)}">Approve</button><button class="btn ghost" style="flex:1" data-s="decide" data-id="${esc(c.id)}" data-name="${esc(c.teacher_name)}">Decline</button></div>`
          : `<button class="btn plain sm" data-s="remove-teacher" data-id="${esc(c.id)}" data-name="${esc(c.teacher_name)}">Remove this teacher</button>`}
      </div>`;
      return page("Teacher requests", `
        <details class="card small"><summary style="cursor:pointer;font-weight:700">How to check a teacher</summary>
          <ul style="margin-bottom:0;padding-left:18px;line-height:1.6">
            <li>Open the school website. Does it name this teacher?</li>
            <li>Does their email match the school's email from the organization's list, or use the school's own web address?</li>
            <li>Not sure? Email them from ${esc(A.contactEmail)} at the school's public email address, and approve once they reply from it.</li>
            <li>Approving lets them see what families choose to share. If in doubt, don't approve yet.</li>
          </ul></details>
        <h2>Waiting (${pending.length})</h2>
        ${pending.length ? pending.map(card).join("") : `<p class="muted">Nothing waiting.</p>`}
        <h2 style="margin-top:22px">Approved teachers (${approved.length})</h2>
        ${approved.length ? approved.map(card).join("") : `<p class="muted">None yet.</p>`}`);
    };

    // ---------- forms ----------
    document.addEventListener("submit", async (e) => {
      const f = e.target.closest("[data-sform]"); if (!f || !sb) return;
      e.preventDefault();
      const btn = f.querySelector("button:not([type=button])"); if (btn) btn.disabled = true;
      try {
        switch (f.dataset.sform) {
          case "search": {
            T.q = f.q.value.trim();
            const { data, error } = await sb.rpc("find_schools", { q: T.q });
            if (error) throw error;
            T.found = data; data.forEach((sc) => { T.schools[sc.id] = sc; });
            rerender(); break;
          }
          case "addschool": {
            const name = f.name.value.trim();
            if (!/irish/i.test(name)) throw new Error('Only Irish dance schools can be added. The name should include "Irish".');
            const { data, error } = await sb.rpc("add_school", { school_name: name, school_org: f.org.value, school_town: f.town.value.trim(), school_country: f.country.value, school_website: f.website.value.trim() });
            if (error) throw error;
            T.adding = false; T.found = null;
            const sc = await getSchool(data.id, true);
            picked(f.dataset.mode, sc); break;
          }
          case "share": {
            const did = f.dataset.dancer, teacher = f.dataset.teacher;
            const { data, error } = await sb.rpc("share_with_teacher", { sid: f.dataset.school, expected_claim: f.dataset.claim, dkey: did, dname: f.dname.value.trim() });
            if (error) { delete T.schools[f.dataset.school]; throw error; }
            shares()[did] = { shareId: data.id, schoolId: data.school_id, claimId: data.claim_id, teacher, since: data.agreed_at, hash: "" };
            delete notices()[did]; A.save();
            await syncNow(); await reconcile();
            toast(`Sharing with ${teacher}`); rerender(); break;
          }
          case "claim": {
            const { error } = await sb.rpc("claim_school", { sid: f.dataset.school, name: f.name.value.trim(), cred: f.cred.value.trim(), how_to_check: f.proof.value.trim() });
            if (error) throw error;
            T.claims = null; toast("Request saved. Now email us your credentials."); location.hash = "#/teach"; break;
          }
        }
      } catch (err) { acct.fail(err); }
      if (btn && document.body.contains(btn)) btn.disabled = false;
    });

    // A school was chosen from the list (or just added).
    function picked(mode, sc) {
      T.found = null; T.q = "";
      if (mode === "teach") { location.hash = "#/teach/claim/" + sc.id; return; }
      const did = mode.split(":")[1];
      const dn = S().dancers.find((d) => d.id === did); if (!dn) return;
      dn.school = { id: sc.id, name: sc.name, town: sc.town };
      A.save(); toast("Saved");
      if (location.hash === "#/school/" + did) rerender(); else location.hash = "#/school/" + did;
    }

    async function stopSharing(did) {
      const { error } = await sb.rpc("stop_sharing", { dkey: did });
      if (error) throw error;
      delete shares()[did]; A.save();
      if (T.mine) T.mine = T.mine.filter((x) => x.dancer_key !== did);
    }

    // ---------- buttons ----------
    document.addEventListener("click", async (e) => {
      const t = e.target.closest("[data-s]"); if (!t || !sb) return;
      try {
        switch (t.dataset.s) {
          case "pick": { const sc = T.schools[t.dataset.id]; if (sc) picked(t.dataset.mode, sc); break; }
          case "adding": T.adding = true; rerender(); break;
          case "cancel-pick": T.found = null; T.adding = false; history.back(); break;
          case "change": {
            const did = t.dataset.dancer, sh = shares()[did];
            if (sh && !confirm(`Change school? This stops sharing with ${sh.teacher || "the teacher"}, and deletes what was shared.`)) return;
            if (sh) await stopSharing(did);
            location.hash = "#/school/" + did + "/pick"; break;
          }
          case "stop": {
            const did = t.dataset.dancer, sh = shares()[did];
            const dn = S().dancers.find((d) => d.id === did) || { name: "this dancer" };
            if (!confirm(`Stop sharing? ${sh && sh.teacher ? sh.teacher : "The teacher"} won't see any of ${dn.name}'s results any more. Everything shared is deleted straight away.`)) return;
            t.disabled = true; await stopSharing(did); toast("Sharing stopped"); rerender(); break;
          }
          case "invite-teacher": {
            const text = `Hi! I use Pocket Irish Dance to keep track of results. If you claim ${t.dataset.name} in the app, families can choose to share their dancers' results with you.`;
            const link = appLink("#/teach");
            if (navigator.share) { try { await navigator.share({ title: "Pocket Irish Dance", text, url: link }); } catch (err) { /* closed */ } }
            else { await navigator.clipboard.writeText(text + "\n" + link); toast("Copied. Paste it in a message to your teacher."); }
            break;
          }
          case "invite-families": {
            const text = `${t.dataset.name} is on Pocket Irish Dance. If you'd like me to see your dancer's feis results, pick ${t.dataset.name} on your dancer's Scores page and choose to share. It's up to you, and you can stop any time.`;
            const link = appLink("#/scores");
            if (navigator.share) { try { await navigator.share({ title: "Pocket Irish Dance", text, url: link }); } catch (err) { /* closed */ } }
            else { await navigator.clipboard.writeText(text + "\n" + link); toast("Copied. Paste it in your school's group chat or email."); }
            break;
          }
          case "end-claim": {
            const msg = t.dataset.pending ? "Withdraw this request?" : "Stop being this school's teacher in the app? Everything families shared with you is deleted, and they'd need to agree again.";
            if (!confirm(msg)) return;
            const { error } = await sb.rpc("end_my_claim", { c: t.dataset.id }); if (error) throw error;
            T.claims = null; toast("Done"); rerender(); break;
          }
          case "tview": teachDancer.view = t.dataset.v; rerender(); break;
          case "decide": {
            const ok = !!t.dataset.ok;
            if (!confirm(ok ? `Approve ${t.dataset.name}? Families at this school will see their name and can choose to share with them.` : `Decline ${t.dataset.name}'s request?`)) return;
            t.disabled = true;
            const { error } = await sb.rpc("admin_decide_claim", { c: t.dataset.id, approve: ok }); if (error) throw error;
            T.claims = null; T.schools = {}; toast(ok ? "Approved" : "Declined"); rerender(); break;
          }
          case "remove-teacher": {
            if (!confirm(`Remove ${t.dataset.name} as the teacher? Everything families shared with them is deleted.`)) return;
            const { error } = await sb.rpc("admin_remove_teacher", { c: t.dataset.id }); if (error) throw error;
            T.claims = null; T.schools = {}; toast("Removed"); rerender(); break;
          }
        }
      } catch (err) { acct.fail(err); t.disabled = false; }
    });

    document.addEventListener("visibilitychange", () => { if (!document.hidden && acct.profile()) checkAndSync(false); });
  };
})();
