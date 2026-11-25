/* Simple, private visitor counting with GoatCounter (goatcounter.com).
   - No cookies, nothing saved on the phone, no ID for the person, no IP address kept.
   - It only sends the name of what happened, like "App opened from home screen" or "Game: Trivia".
   - Never sends dancers, results, judges, notes, searches or anything typed.
   - Skipped when the browser asks not to be tracked (Do Not Track or Global Privacy Control),
     when offline, and anywhere other than pocketirishdance.com (so tests don't count).
   See the numbers at https://pocketirishdance.goatcounter.com */
(function () {
  "use strict";
  var ENDPOINT = "https://pocketirishdance.goatcounter.com/count";
  var SITES = ["pocketirishdance.com", "www.pocketirishdance.com"];

  function allowed() {
    if (SITES.indexOf(location.hostname) < 0) return false;
    if (navigator.globalPrivacyControl) return false;
    if (navigator.doNotTrack === "1" || window.doNotTrack === "1") return false;
    if (navigator.onLine === false) return false;
    return true;
  }

  // path: a short fixed name. title: the plain label shown on the dashboard. event: true for things that happen (not pages).
  function count(path, title, event) {
    try {
      if (!allowed()) return;
      var q = "p=" + encodeURIComponent(path) + "&t=" + encodeURIComponent(title || path) + "&rnd=" + Math.random().toString(36).slice(2);
      if (event) q += "&e=true";
      // Only the website name of where a visitor came from (like facebook.com), never the full link.
      if (!event && document.referrer) {
        try { var r = new URL(document.referrer).hostname; if (r && SITES.indexOf(r) < 0) q += "&r=" + encodeURIComponent(r); } catch (e) {}
      }
      var img = new Image();
      img.referrerPolicy = "no-referrer";
      img.src = ENDPOINT + "?" + q;
    } catch (e) {}
  }

  function installed() {
    return (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
  }

  // App sections and games that get counted. Only these exact names are ever sent.
  var SECTIONS = {
    words: "Words", levels: "Levels", orgs: "Organizations", rules: "Rules", guide: "Guides and checklists",
    scores: "Scores", workon: "Work on", feis: "Feis calendar", schools: "School finder", friends: "Friends",
    games: "Games", settings: "Settings", search: "Search"
  };
  var GAMES = {
    trivia: "Daily feis trivia", wordsearch: "Daily word search", bingo: "Feis day bingo", rhythm: "Rhythm tap",
    namedance: "Name that dance", gaelic: "Learning Irish", symbols: "Irish symbols", counties: "Irish counties"
  };

  window.PID_COUNT = {
    // The website (index.html).
    website: function () { count("website", "Website visit"); },

    // The app (app.html): counts each open, and again when it comes back after 30 minutes away.
    app: function () {
      var how = function () { return installed() ? ["open-home-screen", "App opened from home screen"] : ["open-browser", "App opened in a browser"]; };
      var opened = function () { var h = how(); count(h[0], h[1], true); };
      opened();
      var hiddenAt = 0;
      document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "hidden") hiddenAt = Date.now();
        else if (hiddenAt && Date.now() - hiddenAt > 30 * 60 * 1000) { hiddenAt = 0; opened(); }
      });

      // Android and computers tell us when someone adds the app. iPhones don't, so use "App opened from home screen" there.
      window.addEventListener("appinstalled", function () { count("installed", "App installed", true); });

      var last = "";
      function screen() {
        var parts = location.hash.replace(/^#\/?/, "").split("?")[0].split("/");
        var key = parts[0] === "games" && GAMES[parts[1]] ? "game-" + parts[1] : SECTIONS[parts[0]] ? "section-" + parts[0] : "";
        if (!key || key === last) { last = key; return; }
        last = key;
        if (key.indexOf("game-") === 0) count(key, "Game: " + GAMES[parts[1]], true);
        else count(key, "Section: " + SECTIONS[parts[0]], true);
      }
      window.addEventListener("hashchange", screen);
      screen();
    },

    // Also counted from the website's install button.
    installed: function () { count("installed", "App installed", true); }
  };
})();
