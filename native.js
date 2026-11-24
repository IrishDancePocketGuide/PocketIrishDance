// iPhone app extras. In a normal browser everything here quietly does nothing,
// so the website keeps working exactly as before. Inside the App Store app
// (built from ios-app/ with Capacitor) it adds: feis reminders, the iPhone
// share sheet, haptic taps, and saving backup files.
(function () {
  "use strict";
  const C = window.Capacitor;
  const isApp = !!(C && C.isNativePlatform && C.isNativePlatform());
  const P = (isApp && C.Plugins) || {};
  // Where the live website lives. Used for invite links and fresh feis listings,
  // because inside the app the page address is the phone itself.
  const publicUrl = ((window.PID_CONFIG && window.PID_CONFIG.publicUrl) || "https://irishdancepocketguide.github.io/PocketIrishDance/").replace(/\/?$/, "/");

  function haptic(kind) {
    if (!P.Haptics) return;
    try { kind === "success" ? P.Haptics.notification({ type: "SUCCESS" }) : P.Haptics.impact({ style: "LIGHT" }); } catch (e) { /* ignore */ }
  }

  // Returns true when the share sheet opened (or was closed by the parent).
  async function share(opts) {
    if (P.Share) {
      try { await P.Share.share({ title: opts.title, text: opts.text, url: opts.url, dialogTitle: opts.title }); } catch (e) { /* closed */ }
      return true;
    }
    if (navigator.share) { try { await navigator.share(opts); } catch (e) { /* closed */ } return true; }
    return false;
  }

  // Backup files: a browser download on the web, the share sheet in the app
  // (so parents can save to Files, AirDrop it, or email it to themselves).
  async function saveFile(name, text) {
    if (P.Filesystem && P.Share) {
      const res = await P.Filesystem.writeFile({ path: name, data: text, directory: "CACHE", encoding: "utf8" });
      try { await P.Share.share({ title: "Pocket Irish Dance backup", files: [res.uri], dialogTitle: "Save your backup" }); } catch (e) { /* closed */ }
      return;
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: "application/json" })); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
  }

  // ---------- feis reminders ----------
  // Two gentle reminders per feis: a week before (entries, hotel, costume),
  // and the evening before (pack the feis bag).
  function idFor(key, n) {
    let h = 0; for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0;
    return (Math.abs(h) % 100000000) * 10 + n; // stays inside the 32-bit range iOS needs
  }
  function at(dateStr, daysBefore, hour) {
    const d = new Date(dateStr + "T00:00:00"); d.setDate(d.getDate() - daysBefore); d.setHours(hour, 0, 0, 0); return d;
  }
  async function remind(feis) {
    const LN = P.LocalNotifications; if (!LN) return { ok: false };
    let perm = await LN.checkPermissions();
    if (perm.display !== "granted") perm = await LN.requestPermissions();
    if (perm.display !== "granted") return { ok: false, denied: true };
    const key = feis.name + "|" + feis.start; const now = Date.now();
    const list = [
      { id: idFor(key, 1), title: `${feis.name} is one week away`, body: "Check your entries, travel and costume, and look at the feis checklist.", at: at(feis.start, 7, 18) },
      { id: idFor(key, 2), title: `${feis.name} is tomorrow`, body: "Time to pack the feis bag. Open the checklist so nothing gets left behind. Good luck! ☘️", at: at(feis.start, 1, 18) }
    ].filter((n) => n.at.getTime() > now + 60000);
    if (!list.length) return { ok: false, tooLate: true };
    await LN.schedule({ notifications: list.map((n) => ({ id: n.id, title: n.title, body: n.body, schedule: { at: n.at, allowWhileIdle: true }, extra: { open: "#/guide" } })) });
    return { ok: true, count: list.length };
  }
  async function cancelReminder(feis) {
    const LN = P.LocalNotifications; if (!LN) return;
    const key = feis.name + "|" + feis.start;
    await LN.cancel({ notifications: [{ id: idFor(key, 1) }, { id: idFor(key, 2) }] });
  }
  if (P.LocalNotifications) {
    // Tapping a reminder opens the parent checklists.
    try { P.LocalNotifications.addListener("localNotificationActionPerformed", (a) => { const to = a && a.notification && a.notification.extra && a.notification.extra.open; if (to) location.hash = to; }); } catch (e) { /* ignore */ }
  }

  if (isApp) {
    document.documentElement.classList.add("native-app");
    if (P.SplashScreen) { window.addEventListener("load", () => { try { P.SplashScreen.hide(); } catch (e) { /* ignore */ } }); }
  }

  window.PID_NATIVE = { isApp, publicUrl, haptic, share, saveFile, remind, cancelReminder, canRemind: !!P.LocalNotifications };
})();
