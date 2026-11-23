/* Friends: private, invite-only groups where parents share chosen wins and send cheers.
   Only what a parent taps "Share" on goes online. The full score history stays on the phone.
   Online parts use Supabase (see supabase/schema.sql for the privacy rules). */
(function () {
  "use strict";

  const CHEERS = [
    { k: "clap", e: "👏", label: "Clap" },
    { k: "heart", e: "❤️", label: "Love" },
    { k: "shamrock", e: "☘️", label: "Shamrock" },
    { k: "star", e: "⭐", label: "Star" }
  ];
  const MESSAGES = [
    { k: "congrats", t: "Congratulations!" },
    { k: "well_danced", t: "Well danced!" },
    { k: "so_proud", t: "So proud!" },
    { k: "next_time", t: "Next time's yours!" }
  ];
  const MILESTONES = ["First feis!", "First medal!", "First recall!", "Moved up a level!", "Personal best!"];
  const SEEN_KEY = "pid.friends.seen";
  const JOIN_KEY = "pid.friends.join";
  const AFTER_KEY = "pid.friends.after";

  const ls = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  };

  window.PID_FRIENDS = function (A) {
    const { ext, esc, toast, rerender, fmtDate, ordinal } = A;
    const C = window.PID_CONFIG || {};
    const ready = !!(C.supabaseUrl && C.supabaseKey && window.supabase);
    let sb = null;
    if (ready) {
      const opts = {};
      if (C.testAccessToken) opts.accessToken = async () => C.testAccessToken; // automated tests only
      sb = window.supabase.createClient(C.supabaseUrl, C.supabaseKey, opts);
    }

    const F = { user: null, profile: undefined, groups: [], members: [], wins: [], loadedAt: 0, loading: null, step: "email", email: "", openMsg: "" };
    const onFriendsPage = () => /^#\/(friends|group|join|share)\b/.test(location.hash);
    const myId = () => F.user && F.user.id;
    const groupById = (id) => F.groups.find((g) => g.id === id);
    const isOrganiser = (gid) => F.members.some((m) => m.group_id === gid && m.user_id === myId() && m.role === "organiser");
    const nameOf = (p) => (p && p.display_name) || "A friend";
    const seenAt = () => ls.get(SEEN_KEY) || "1970-01-01T00:00:00Z";
    const ago = (iso) => {
      const s = (Date.now() - new Date(iso).getTime()) / 1000;
      if (s < 60) return "just now"; if (s < 3600) return Math.floor(s / 60) + " min ago";
      if (s < 86400) return Math.floor(s / 3600) + " h ago"; if (s < 7 * 86400) return Math.floor(s / 86400) + " d ago";
      return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" });
    };
    const fail = (err, fallback) => { console.warn(err); toast((err && err.message) || fallback || "Something went wrong. Check your connection."); };
    const inviteLink = (code) => location.origin + location.pathname + "#/join/" + code;

    // ---------- loading ----------
    async function load() {
      const uidNow = myId();
      const prof = await sb.from("profiles").select("id, display_name").eq("id", uidNow).maybeSingle();
      if (prof.error) throw prof.error;
      F.profile = prof.data;
      if (!prof.data) { F.groups = []; F.members = []; F.wins = []; return; }
      const [gs, ms] = await Promise.all([
        sb.from("groups").select("id, name, invite_code, created_at").order("created_at"),
        sb.from("group_members").select("group_id, user_id, role, joined_at, profiles(display_name)").order("joined_at")
      ]);
      if (gs.error) throw gs.error; if (ms.error) throw ms.error;
      F.groups = gs.data; F.members = ms.data;
      if (!F.groups.length) { F.wins = []; return; }
      const ws = await sb.from("wins")
        .select("*, profiles(display_name), cheers(id, user_id, kind, created_at, profiles(display_name))")
        .in("group_id", F.groups.map((g) => g.id))
        .order("created_at", { ascending: false }).limit(100);
      if (ws.error) throw ws.error;
      F.wins = ws.data;
    }

    function refresh(force) {
      if (!sb || !F.user) return Promise.resolve();
      if (F.loading) return F.loading;
      if (!force && Date.now() - F.loadedAt < 20000) return Promise.resolve();
      F.loading = load()
        .then(() => { F.loadedAt = Date.now(); F.err = ""; })
        .catch((err) => { console.warn(err); F.err = "Couldn't reach Friends. Check your connection and try again."; if (F.profile === undefined) F.profile = null; })
        .finally(() => { F.loading = null; badge(); if (onFriendsPage()) rerender(); });
      return F.loading;
    }

    function newStuff() {
      const since = seenAt(), me = myId();
      let cheers = 0, wins = 0;
      F.wins.forEach((w) => {
        if (w.user_id !== me && w.created_at > since) wins++;
        if (w.user_id === me) w.cheers.forEach((c) => { if (c.user_id !== me && c.created_at > since) cheers++; });
      });
      return { cheers, wins, total: cheers + wins };
    }

    function badge() {
      const tab = document.querySelector('.tabbar a[data-tab="friends"]');
      if (tab) tab.classList.toggle("has-new", !!(F.user && newStuff().total));
    }

    if (sb && !C.testAccessToken) {
      sb.auth.getSession().then(({ data }) => {
        F.user = data.session ? data.session.user : null;
        if (F.user) refresh(true); else if (onFriendsPage()) rerender();
      });
      sb.auth.onAuthStateChange((ev, session) => {
        const was = myId(); F.user = session ? session.user : null;
        if (myId() !== was) { F.profile = undefined; F.groups = []; F.members = []; F.wins = []; F.loadedAt = 0; if (F.user) refresh(true); else { badge(); if (onFriendsPage()) rerender(); } }
      });
    } else if (sb) {
      F.user = { id: C.testUserId, email: C.testEmail || "test@example.com" };
      refresh(true);
    }
    document.addEventListener("visibilitychange", () => { if (!document.hidden) refresh(); });

    // ---------- small pieces ----------
    const page = (title, html, after, back) => ({ title, tab: "friends", back: back !== false, html, after });
    const loadingPage = (title) => page(title || "Friends", `<div class="empty"><span class="spinner" aria-hidden="true"></span><p>Loading…</p></div>`, null, false);
    const errorNote = () => F.err ? `<div class="banner">${esc(F.err)}<button class="btn sm" data-f="retry">Try again</button></div>` : "";

    function winLine(w) {
      const what = w.dance ? (w.place ? `${ordinal(w.place)} in ${w.dance}` : w.dance) : "";
      return [what, w.milestone].filter(Boolean).join(" · ");
    }

    function winCard(w, showGroup) {
      const me = myId(), mine = w.user_id === me;
      const fresh = !mine && w.created_at > (winCard.since || seenAt());
      const counts = {}; const minek = new Set();
      w.cheers.forEach((c) => { counts[c.kind] = (counts[c.kind] || 0) + 1; if (c.user_id === me) minek.add(c.kind); });
      const msgs = w.cheers.filter((c) => MESSAGES.some((m) => m.k === c.kind)).sort((a, b) => a.created_at.localeCompare(b.created_at));
      const g = groupById(w.group_id);
      const details = [w.level, w.feis, w.feis_date && fmtDate(w.feis_date), w.entrants && `${w.entrants} dancers`].filter(Boolean).join(" · ");
      const p = Number(w.place);
      return `<article class="card win${fresh ? " fresh" : ""}" data-win="${esc(w.id)}">
        <div class="result">
          <span class="place ${["", "p1", "p2", "p3"][p] || ""}">${p ? esc(ordinal(p)) : "🎉"}</span>
          <div class="meta">
            <strong>${esc(w.dancer_name)}${winLine(w) ? " · " + esc(winLine(w)) : ""}</strong>
            ${details ? `<span class="small muted">${esc(details)}</span>` : ""}
            <div class="small muted">${mine ? "You shared" : "Shared by " + esc(nameOf(w.profiles))} · ${esc(ago(w.created_at))}${showGroup && g ? " · " + esc(g.name) : ""}${fresh ? ' <span class="chip">New</span>' : ""}</div>
          </div>
        </div>
        <div class="cheers" role="group" aria-label="Cheers">
          ${CHEERS.map((c) => `<button class="cheer${minek.has(c.k) ? " on" : ""}" data-cheer="${c.k}" aria-pressed="${minek.has(c.k)}" aria-label="${c.label}${counts[c.k] ? ", " + counts[c.k] : ""}">${c.e}${counts[c.k] ? `<span>${counts[c.k]}</span>` : ""}</button>`).join("")}
          <button class="cheer" data-f="msgs" aria-expanded="${F.openMsg === w.id}" aria-label="Send a message">💬</button>
        </div>
        ${F.openMsg === w.id ? `<div class="chips" style="margin-top:8px">${MESSAGES.map((m) => `<button class="btn sm ${minek.has(m.k) ? "" : "ghost"}" data-cheer="${m.k}">${esc(m.t)}</button>`).join("")}</div>` : ""}
        ${msgs.length ? `<ul class="msgs">${msgs.map((c) => `<li><strong>${c.user_id === me ? "You" : esc(nameOf(c.profiles))}:</strong> ${esc(MESSAGES.find((m) => m.k === c.kind).t)}</li>`).join("")}</ul>` : ""}
        <div class="row" style="justify-content:flex-end;margin-top:4px">
          ${mine || isOrganiser(w.group_id) ? `<button class="btn plain sm" data-f="unshare">${mine ? "Un-share" : "Remove"}</button>` : ""}
          ${mine ? "" : `<button class="btn plain sm muted" data-f="report">Report</button>`}
        </div>
      </article>`;
    }

    // ---------- screens ----------
    function comingSoon() {
      return page("Friends", `<div class="hero"><h2>Friends are coming soon</h2><p>Share your dancer's wins with a private group of dance-parent friends, and cheer each other on.</p></div>
        <div class="card"><p style="margin:0">Only the wins you choose to share will go online, and only to friends you invite. Everything else stays on your phone.</p></div>`, null, false);
    }

    function signIn() {
      const codeStep = F.step === "code";
      return page("Friends", `
        <div class="hero"><h2>Cheer each other on</h2><p>Share your dancer's wins with a private group of dance-parent friends.</p></div>
        <div class="card">
          <ul class="small" style="margin:0;padding-left:18px;line-height:1.6">
            <li>For parents and guardians only.</li>
            <li>Groups are private and invite-only.</li>
            <li>You choose each win to share. Everything else stays on your phone.</li>
          </ul>
        </div>
        ${codeStep ? `
        <form class="card" data-fform="code">
          <h3>Check your email</h3>
          <p class="small muted" style="margin-top:0">We sent a code to <strong>${esc(F.email)}</strong>. Type it here.</p>
          <label class="field"><span>Code</span><input name="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6,10}" maxlength="10" required></label>
          <button class="btn block">Sign in</button>
          <button type="button" class="btn plain block" data-f="restart">Use a different email</button>
        </form>` : `
        <form class="card" data-fform="email">
          <h3>Sign in or create an account</h3>
          <p class="small muted" style="margin-top:0">No password. We'll email you a code.</p>
          <label class="field"><span>Your email</span><input type="email" name="email" autocomplete="email" value="${esc(F.email)}" required></label>
          <button class="btn block">Email me a code</button>
        </form>`}
        <p class="small muted center"><a href="#/privacy">How we look after your information</a></p>`, null, false);
    }

    function setup() {
      return page("Friends", `
        <h2>Set up your account</h2>
        <form class="card" data-fform="setup">
          <label class="field"><span>Name your friends will see</span><input name="name" maxlength="40" placeholder="For example: Aoife's mum, or Sarah K" required></label>
          <p class="small muted" style="margin-top:-4px">Please don't use your dancer's full name.</p>
          <label class="toggle"><input type="checkbox" name="adult" required> I'm a parent or guardian, aged 18 or over</label>
          <label class="toggle"><input type="checkbox" name="privacy" required> I've read <a href="#/privacy">how my information is used</a></label>
          <button class="btn block">Continue</button>
        </form>
        <button class="btn plain block" data-f="signout">Sign out</button>`, null, false);
    }

    function home() {
      const n = newStuff();
      winCard.since = seenAt();
      const latest = F.wins.slice(0, 20);
      return page("Friends", `${errorNote()}
        ${n.total ? `<div class="banner">🎉 ${[n.cheers && `${n.cheers} new cheer${n.cheers === 1 ? "" : "s"} on your wins`, n.wins && `${n.wins} new win${n.wins === 1 ? "" : "s"} from friends`].filter(Boolean).join(" and ")}</div>` : ""}
        <h2>Your groups</h2>
        ${F.groups.length ? F.groups.map((g) => {
          const count = F.members.filter((m) => m.group_id === g.id).length;
          const wins = F.wins.filter((w) => w.group_id === g.id).length;
          return `<a class="card group-link" href="#/group/${esc(g.id)}"><strong>${esc(g.name)}</strong><span class="small muted">${count} ${count === 1 ? "person" : "people"} · ${wins} win${wins === 1 ? "" : "s"} shared</span></a>`;
        }).join("") : `<div class="card"><p style="margin:0">You're not in a group yet. Start one for your dance class or carpool, or join with a friend's invite code.</p></div>`}
        <div class="row" style="gap:8px;margin-top:10px">
          <a class="btn" style="flex:1" href="#/friends/new">＋ Start a group</a>
          <a class="btn ghost" style="flex:1" href="#/friends/join">Join with a code</a>
        </div>
        ${latest.length ? `<h2 style="margin-top:22px">Latest wins</h2>${latest.map((w) => winCard(w, F.groups.length > 1)).join("")}` : ""}
        <p class="center" style="margin-top:22px"><a href="#/friends/account">Your account and privacy</a></p>`,
        () => { ls.set(SEEN_KEY, new Date().toISOString()); badge(); }, false);
    }

    function newGroup() {
      return page("Start a group", `
        <form class="card" data-fform="newgroup">
          <label class="field"><span>Group name</span><input name="name" maxlength="60" placeholder="For example: Saturday class parents" required></label>
          <p class="small muted">Only people you send the invite to can join. You'll be the organiser, so you can remove people if needed.</p>
          <button class="btn block">Start group</button>
        </form>`);
    }

    function joinForm(code) {
      return page("Join a group", `
        <form class="card" data-fform="join">
          <label class="field"><span>Invite code</span><input name="code" value="${esc(code || "")}" maxlength="6" autocapitalize="characters" autocomplete="off" placeholder="6 letters, like KQ7TZM" required style="text-transform:uppercase;letter-spacing:0.15em"></label>
          <p class="small muted">Ask the friend who invited you for their group's code.</p>
          <button class="btn block">Join group</button>
        </form>`);
    }

    function group(id) {
      const g = groupById(id);
      if (!g) return F.loadedAt ? page("Group", `<div class="empty">This group isn't available. You may have left it, or been removed.</div>`) : loadingPage("Group");
      const org = isOrganiser(id);
      const mem = F.members.filter((m) => m.group_id === id);
      winCard.since = seenAt();
      const wins = F.wins.filter((w) => w.group_id === id);
      return page(g.name, `${errorNote()}
        <div class="card">
          <div class="row between wrap"><div><span class="small muted">Invite code</span><div class="code">${esc(g.invite_code)}</div></div>
          <button class="btn" data-f="invite" data-code="${esc(g.invite_code)}" data-name="${esc(g.name)}">Invite friends</button></div>
          <p class="small muted" style="margin:8px 0 0">Only send this to people you know. Anyone with the code can join.</p>
        </div>
        <div class="row" style="gap:8px"><a class="btn ghost" style="flex:1" href="#/scores">🎉 Share a win</a></div>
        ${wins.length ? wins.map((w) => winCard(w, false)).join("") : `<div class="empty"><div class="big">🏅</div>No wins shared yet. Open a result in Scores and tap "Share this win".</div>`}
        <h2 style="margin-top:22px">People (${mem.length})</h2>
        <div class="card" style="padding:4px 14px">${mem.map((m) => `<div class="dance-row"><span class="name">${m.user_id === myId() ? "You" : esc(nameOf(m.profiles))}${m.role === "organiser" ? ' <span class="chip grey">Organiser</span>' : ""}</span>
          ${org && m.user_id !== myId() ? `<button class="btn plain sm" data-f="remove" data-user="${esc(m.user_id)}" data-name="${esc(nameOf(m.profiles))}">Remove</button>` : ""}</div>`).join("")}</div>
        ${org ? `<h2 style="margin-top:22px">Organiser</h2>
        <form class="card" data-fform="rename" data-group="${esc(id)}"><label class="field"><span>Group name</span><input name="name" maxlength="60" value="${esc(g.name)}" required></label><button class="btn ghost block">Rename</button></form>
        <button class="btn ghost block" data-f="newcode" style="margin-top:10px">Make a new invite code</button>
        <p class="small muted">The old code stops working. People already in the group stay.</p>` : ""}
        <button class="btn danger block" data-f="leave" style="margin-top:14px">Leave this group</button>`,
        () => { ls.set(SEEN_KEY, new Date().toISOString()); badge(); });
    }

    function share(resultId) {
      const S = A.S();
      const r = S.results.find((x) => x.id === resultId);
      if (!r) return page("Share a win", `<div class="empty">That result isn't on this phone.</div>`);
      const dn = S.dancers.find((d) => d.id === r.dancerId) || { name: "" };
      const dance = A.danceById(r.dance), level = A.levelById(r.level);
      if (!F.groups.length) return page("Share a win", `<div class="card"><p style="margin-top:0">Join or start a group first, then come back to share this win.</p>
        <div class="row" style="gap:8px"><a class="btn" style="flex:1" href="#/friends/new">Start a group</a><a class="btn ghost" style="flex:1" href="#/friends/join">Join with a code</a></div></div>`);
      const shared = (S.shared && S.shared[r.id]) || [];
      const first = String(dn.name || "").trim().split(/\s+/)[0] || "";
      return page("Share a win", `
        <p class="muted" style="margin-top:0">Only what's shown in the preview is shared. The photo, marks and notes stay on your phone.</p>
        <form class="card" data-fform="share" data-result="${esc(r.id)}">
          <label class="field"><span>Dancer's name to show</span><input name="dancer" maxlength="30" value="${esc(first)}" required></label>
          <p class="small muted" style="margin-top:-4px">First name or a nickname only.</p>
          <label class="field"><span>Add a milestone (optional)</span><select name="milestone"><option value="">None</option>${MILESTONES.map((m) => `<option>${esc(m)}</option>`).join("")}</select></label>
          <fieldset class="field" style="border:0;padding:0;margin:12px 0"><legend class="small" style="font-weight:700;color:var(--ink-2);margin-bottom:5px">Share with</legend>
            ${F.groups.map((g) => `<label class="toggle" style="margin:6px 0"><input type="checkbox" name="g" value="${esc(g.id)}" ${shared.includes(g.id) ? "disabled" : F.groups.length === 1 ? "checked" : ""}> ${esc(g.name)}${shared.includes(g.id) ? ' <span class="chip grey">Shared</span>' : ""}</label>`).join("")}
          </fieldset>
          <h3>Preview</h3>
          <div id="sharePreview"></div>
          <button class="btn block" style="margin-top:10px">Share</button>
        </form>`,
        () => {
          const f = document.querySelector('[data-fform="share"]');
          const draw = () => {
            const w = shareRow(r, dance, level, f);
            document.getElementById("sharePreview").innerHTML = `<div class="card result" style="margin:0;background:var(--bg)"><span class="place ${["", "p1", "p2", "p3"][Number(w.place)] || ""}">${w.place ? esc(ordinal(w.place)) : "🎉"}</span><div class="meta"><strong>${esc(w.dancer_name || "…")}${winLine(w) ? " · " + esc(winLine(w)) : ""}</strong><span class="small muted">${esc([w.level, w.feis, w.feis_date && fmtDate(w.feis_date), w.entrants && w.entrants + " dancers"].filter(Boolean).join(" · "))}</span></div></div>`;
          };
          f.addEventListener("input", draw); f.addEventListener("change", draw); draw();
        });
    }

    function shareRow(r, dance, level, f) {
      const n = (v) => { const x = parseInt(v, 10); return x > 0 && x < 1000 ? x : null; };
      return {
        dancer_name: f.dancer.value.trim().slice(0, 30),
        feis: (r.feis || "").slice(0, 80) || null,
        feis_date: r.date || null,
        dance: dance ? dance.name : (r.dance || null),
        level: level ? level.name : null,
        place: n(r.place),
        entrants: n(r.entrants),
        milestone: f.milestone.value || null
      };
    }

    function account() {
      return page("Your account", `
        <form class="card" data-fform="rename-me">
          <label class="field"><span>Name your friends see</span><input name="name" maxlength="40" value="${esc(F.profile.display_name)}" required></label>
          <button class="btn ghost block">Save</button>
        </form>
        <div class="card"><p class="small muted" style="margin:0">Signed in as ${esc(F.user.email || "")}</p></div>
        <div class="card stack">
          <button class="btn ghost block" data-f="download">Download my data</button>
          <a class="btn ghost block" href="#/privacy">How we look after your information</a>
          <button class="btn ghost block" data-f="signout">Sign out</button>
        </div>
        <h2 style="margin-top:22px">Delete account</h2>
        <div class="card"><p class="small" style="margin-top:0">This deletes your account, everything you shared and your cheers, straight away. Results saved on this phone are not affected.</p>
        <button class="btn danger block" data-f="delete">Delete my account</button></div>`);
    }

    function privacy() {
      return { title: "Privacy", tab: "", back: true, html: `
        <p class="draft">Draft, to be checked before launch</p>
        <h2>How we look after your information</h2>
        <div class="card stack small">
          <p style="margin-top:0"><strong>On your phone only.</strong> Your dancers, results, photos, marks and notes are saved on your phone. They are never sent to us.</p>
          <p><strong>If you use Friends.</strong> We keep your email address (to sign you in), the name you choose to show friends, the groups you join, the wins you choose to share, and the cheers you send. A shared win holds only what you saw in the preview: a first name or nickname, the dance, level, placing, feis and date.</p>
          <p><strong>Who can see it.</strong> Only people in the same group. Groups are private and can only be joined with an invite code. We don't sell or share your information, and there are no adverts.</p>
          <p><strong>Adults only.</strong> Accounts are for parents and guardians aged 18 or over. Children should not create accounts.</p>
          <p><strong>Your choices.</strong> You can un-share a win, leave a group, download your data, or delete your account at any time in Friends › Your account. Deleting removes everything you put online straight away.</p>
          <p><strong>Where it's kept.</strong> Friends data is stored securely with our provider, Supabase, in a data centre in the United States. For families in the UK, Ireland and Europe, Supabase's data protection agreement covers moving it there.</p>
          <p style="margin-bottom:0"><strong>Questions.</strong> Contact the Pocket Irish Dance team. (Contact email to be added.)</p>
        </div>` };
    }

    // ---------- routes ----------
    function gate(title) {
      if (!ready) return comingSoon();
      if (!F.user) return signIn();
      if (F.profile === undefined) { refresh(); return loadingPage(title); }
      if (F.profile === null) return F.err ? page("Friends", errorNote(), null, false) : setup();
      refresh();
      return null;
    }

    ext.friends = (parts) => {
      const g = gate(); if (g) return g;
      if (parts[1] === "new") return newGroup();
      if (parts[1] === "join") return joinForm(parts[2]);
      if (parts[1] === "account") return account();
      return home();
    };
    ext.group = (parts) => gate("Group") || group(parts[1]);
    ext.join = (parts) => {
      if (parts[1]) ls.set(JOIN_KEY, parts[1].toUpperCase());
      return gate("Join a group") || joinForm(parts[1]);
    };
    ext.share = (parts) => { if (!F.user) ls.set(AFTER_KEY, location.hash); return gate("Share a win") || share(parts[1]); };
    ext.privacy = privacy;
    A.canShare = ready;

    // After sign-in and setup, go where the parent was heading (an invite link or a share).
    function afterSetup() {
      const code = ls.get(JOIN_KEY), after = ls.get(AFTER_KEY);
      ls.set(AFTER_KEY, null);
      if (code) location.hash = "#/friends/join/" + code;
      else if (after) location.hash = after;
      else { location.hash = "#/friends"; rerender(); }
    }

    // ---------- forms ----------
    document.addEventListener("submit", async (e) => {
      const f = e.target.closest("[data-fform]"); if (!f) return;
      e.preventDefault();
      const btn = f.querySelector("button:not([type=button])"); if (btn) btn.disabled = true;
      const kind = f.dataset.fform;
      try {
        if (kind === "email") {
          F.email = f.email.value.trim();
          const { error } = await sb.auth.signInWithOtp({ email: F.email, options: { shouldCreateUser: true } });
          if (error) throw error;
          F.step = "code"; rerender();
        } else if (kind === "code") {
          const { error } = await sb.auth.verifyOtp({ email: F.email, token: f.code.value.trim(), type: "email" });
          if (error) throw new Error("That code didn't work. Check it, or ask for a new one.");
          F.step = "email"; toast("Signed in");
          await refresh(true); if (F.profile) afterSetup();
        } else if (kind === "setup") {
          const { error } = await sb.from("profiles").insert({ id: myId(), display_name: f.name.value.trim() });
          if (error) throw error;
          await refresh(true); afterSetup();
        } else if (kind === "newgroup") {
          const { data, error } = await sb.rpc("create_group", { group_name: f.name.value.trim() });
          if (error) throw error;
          await refresh(true); toast("Group started. Now invite your friends."); location.hash = "#/group/" + data.id;
        } else if (kind === "join") {
          const { data, error } = await sb.rpc("join_group", { code: f.code.value.trim().toUpperCase() });
          if (error) throw error;
          ls.set(JOIN_KEY, null);
          await refresh(true); toast("Welcome to " + data.name); location.hash = "#/group/" + data.id;
        } else if (kind === "rename") {
          const { error } = await sb.from("groups").update({ name: f.name.value.trim() }).eq("id", f.dataset.group);
          if (error) throw error;
          await refresh(true); toast("Renamed");
        } else if (kind === "rename-me") {
          const { error } = await sb.from("profiles").update({ display_name: f.name.value.trim() }).eq("id", myId());
          if (error) throw error;
          await refresh(true); toast("Saved");
        } else if (kind === "share") {
          const S = A.S(); const r = S.results.find((x) => x.id === f.dataset.result);
          const ids = [...f.querySelectorAll('input[name="g"]:checked:not(:disabled)')].map((x) => x.value);
          if (!ids.length) throw new Error("Choose a group to share with");
          const row = shareRow(r, A.danceById(r.dance), A.levelById(r.level), f);
          const { error } = await sb.from("wins").insert(ids.map((gid) => Object.assign({ group_id: gid, user_id: myId() }, row)));
          if (error) throw error;
          S.shared = S.shared || {}; S.shared[r.id] = (S.shared[r.id] || []).concat(ids); A.save();
          await refresh(true); toast("Shared! 🎉"); location.hash = ids.length === 1 ? "#/group/" + ids[0] : "#/friends";
        }
      } catch (err) { fail(err); }
      if (btn && document.body.contains(btn)) btn.disabled = false;
    });

    // ---------- buttons ----------
    document.addEventListener("click", async (e) => {
      const t = e.target.closest("[data-f], [data-cheer]"); if (!t || !sb) return;
      const card = t.closest("[data-win]"); const winId = card && card.dataset.win;
      const w = winId && F.wins.find((x) => x.id === winId);
      const gid = (location.hash.match(/^#\/group\/([^/?]+)/) || [])[1];
      try {
        if (t.dataset.cheer) {
          const mine = w.cheers.find((c) => c.user_id === myId() && c.kind === t.dataset.cheer);
          t.disabled = true;
          const res = mine ? await sb.from("cheers").delete().eq("id", mine.id) : await sb.from("cheers").insert({ win_id: w.id, user_id: myId(), kind: t.dataset.cheer });
          if (res.error) throw res.error;
          if (!mine && MESSAGES.some((m) => m.k === t.dataset.cheer)) F.openMsg = "";
          await refresh(true); return;
        }
        switch (t.dataset.f) {
          case "retry": F.err = ""; refresh(true); break;
          case "restart": F.step = "email"; rerender(); break;
          case "msgs": F.openMsg = F.openMsg === w.id ? "" : w.id; rerender(); break;
          case "invite": {
            const link = inviteLink(t.dataset.code);
            const text = `Join my group "${t.dataset.name}" on Pocket Irish Dance, so we can cheer on each other's dancers. Invite code: ${t.dataset.code}`;
            if (navigator.share) { try { await navigator.share({ title: "Pocket Irish Dance", text, url: link }); } catch (err) { /* closed */ } }
            else { await navigator.clipboard.writeText(text + "\n" + link); toast("Invite copied. Paste it in a text or WhatsApp."); }
            break;
          }
          case "unshare": {
            if (!confirm(w.user_id === myId() ? "Un-share this win? It will disappear for everyone in the group." : "Remove this win from the group?")) return;
            const { error } = await sb.from("wins").delete().eq("id", w.id); if (error) throw error;
            const S = A.S(); if (S.shared) Object.keys(S.shared).forEach((k) => { S.shared[k] = S.shared[k].filter((g) => g !== w.group_id || w.user_id !== myId()); }); A.save();
            await refresh(true); toast("Removed"); break;
          }
          case "report": {
            if (!confirm("Report this post to the Pocket Irish Dance team? They'll review it.")) return;
            const { error } = await sb.from("reports").insert({ win_id: w.id, group_id: w.group_id, reporter_id: myId(), reason: "Reported from app" });
            if (error) throw error; toast("Thanks. We'll take a look."); break;
          }
          case "remove": {
            if (!confirm(`Remove ${t.dataset.name} from this group?`)) return;
            const { error } = await sb.from("group_members").delete().eq("group_id", gid).eq("user_id", t.dataset.user); if (error) throw error;
            await refresh(true); toast("Removed"); break;
          }
          case "newcode": {
            if (!confirm("Make a new invite code? The old one will stop working.")) return;
            const { error } = await sb.rpc("new_group_code", { g: gid }); if (error) throw error;
            await refresh(true); toast("New code made"); break;
          }
          case "leave": {
            if (!confirm("Leave this group? Wins you shared there will be removed.")) return;
            const myWins = F.wins.filter((x) => x.group_id === gid && x.user_id === myId()).map((x) => x.id);
            if (myWins.length) { const d = await sb.from("wins").delete().in("id", myWins); if (d.error) throw d.error; }
            const { error } = await sb.rpc("leave_group", { g: gid }); if (error) throw error;
            const S = A.S(); if (S.shared) Object.keys(S.shared).forEach((k) => { S.shared[k] = S.shared[k].filter((g) => g !== gid); }); A.save();
            await refresh(true); toast("You left the group"); location.hash = "#/friends"; break;
          }
          case "download": {
            const me = myId();
            const data = {
              app: "pocket-irish-dance", downloaded: new Date().toISOString(), email: F.user.email,
              profile: F.profile,
              groups: F.groups.map((g) => ({ name: g.name, role: (F.members.find((m) => m.group_id === g.id && m.user_id === me) || {}).role })),
              wins_shared: F.wins.filter((x) => x.user_id === me).map(({ profiles, cheers, ...x }) => x),
              cheers_sent: F.wins.flatMap((x) => x.cheers.filter((c) => c.user_id === me).map((c) => ({ kind: c.kind, created_at: c.created_at, on_win: x.id })))
            };
            const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
            a.download = "pocket-irish-dance-friends-data.json"; document.body.appendChild(a); a.click(); a.remove(); break;
          }
          case "signout": await sb.auth.signOut(); toast("Signed out"); location.hash = "#/friends"; break;
          case "delete": {
            if (!confirm("Delete your Friends account and everything you shared? This can't be undone.")) return;
            const { error } = await sb.rpc("delete_my_account"); if (error) throw error;
            const S = A.S(); S.shared = {}; A.save();
            await sb.auth.signOut({ scope: "local" }).catch(() => {});
            toast("Your account was deleted"); location.hash = "#/friends"; break;
          }
        }
      } catch (err) { fail(err); t.disabled = false; }
    });
  };
})();
