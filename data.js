// All app content lives here, so it can be edited without touching the screens.
// Anything marked check: true is a draft that still needs Shannon's (or a teacher's) review.

window.PID_DATA = {
  version: "0.3 draft",

  organizations: [
    {
      id: "clrg",
      name: "CLRG",
      fullName: "An Coimisiún le Rincí Gaelacha",
      say: "un KUM-ish-oon le RIN-kee GAY-luh-kuh",
      active: true, pick: true,
      where: "Worldwide. Based in Dublin, with regions across Ireland, Great Britain, North America, Australia, mainland Europe and beyond.",
      summary: "The largest Irish dance organization. If your school's teacher has the letters TCRG after their name, you dance under CLRG.",
      teachers: "TCRG (teacher), ADCRG (adjudicator, or judge)",
      majors: "Regional Oireachtas, Nationals, All-Irelands, World Championships (Oireachtas Rince na Cruinne)",
      link: "https://www.clrg.ie",
      rulesLink: "https://www.clrg.ie/wp-content/uploads/2026/09/CLRG_Rules_V6_Sept26.pdf",
      rulesName: "CLRG Official Rulebook (V6, September 2026)"
    },
    {
      id: "idtana",
      name: "IDTANA",
      fullName: "Irish Dance Teachers' Association of North America",
      active: true,
      partOf: "CLRG",
      where: "United States, Canada and Mexico.",
      summary: "The association of CLRG teachers in North America. It looks after the feis rules there, including the level names and how dancers move up, and its regions run the regional Oireachtas championships each year.",
      teachers: "Members are CLRG-qualified teachers",
      majors: "Regional Oireachtas events and the feis rules in North America"
    },
    {
      id: "comhdhail",
      name: "An Comhdháil",
      fullName: "An Comhdháil Múinteoirí Rince Gaelacha",
      say: "un KOH-loy",
      active: true, pick: true,
      where: "Mainly Ireland, with schools in Great Britain and elsewhere.",
      summary: "The second-largest Irish dance organization, with its own teachers, grades and championships. Its grades use Irish names: Bun Grád (Beginners A, B and C), Meán Grád (Pre-Open) and Ard Grád (Open).",
      teachers: "Its own registered teachers, organised in local branches",
      majors: "Provincial Championships / Qualifiers and the World Championships",
      link: "https://www.irishdancingorg.com",
      rulesLink: "https://web.irishdancingorg.com/index.php/policies/rulebook",
      rulesName: "An Comhdháil public rulebook"
    },
    {
      id: "wida",
      name: "WIDA",
      fullName: "World Irish Dance Association",
      active: true, pick: true,
      where: "Mainly mainland Europe, with members in other countries.",
      summary: "An independent organization whose feiseanna are open to dancers from any organization, and to independent dancers with no school. All WIDA feiseanna are run the same way.",
      teachers: "TCRG and TMRF teacher exams",
      majors: "National Oireachtasaí, the International and World Championships",
      link: "https://www.irish.dance",
      rulesLink: "https://www.irish.dance/competition-rules",
      rulesName: "WIDA competition rules"
    },
    {
      id: "crn",
      name: "CRN",
      fullName: "Cumann Rince Náisiúnta",
      say: "KUM-un RIN-kuh NAW-shoon-tuh",
      active: true, pick: true,
      where: "Ireland, the UK, mainland Europe (including the Netherlands and Belgium), the USA, Canada and Australia.",
      summary: "Founded in Ireland in 1982. CRN describes itself as an open platform: its feiseanna welcome dancers from all over the world. Its teachers are encouraged to choreograph new work while keeping the traditions of Irish dance.",
      teachers: "TMCRN (part-qualified teacher), ODCRN (fully qualified teacher), ADCRN (adjudicator, or judge)",
      majors: "Irish Open Championships, North American Open Championships and the World Open Championships (Craobhacha Oscailte na Cruinne). Regional championships are the qualifiers.",
      link: "https://www.crn.ie",
      schoolsLink: "https://www.crn.ie/find-a-class/",
      rulesHow: "CRN's Rules of Competition aren't published online. CRN asks people to contact them for a copy, so ask your teacher, who has them.",
      contactLink: "https://www.crn.ie/contact-us/"
    },
    {
      id: "crdm",
      name: "CRDM",
      fullName: "Cumann Rince Dea Mheasa",
      say: "KUM-un RIN-kuh dyah VASS-uh",
      active: true, pick: true,
      where: "Ireland, England, Scotland and the Isle of Man, with some feiseanna in the USA.",
      summary: "Founded in 2002 by 8 teachers. All CRDM feiseanna run under CRDM's own rules, and your teacher enters your dancer (CRDM doesn't take entries from parents). Good to know: CRDM teachers also use the titles TCRG and ADCRG, so those letters alone don't tell you a school is CLRG.",
      teachers: "TMRF and TCRG (teachers) and ADCRG (adjudicator, or judge), from CRDM's own exams",
      majors: "World Championships, All Ireland Championships, British Nationals and American Nationals",
      link: "https://www.crdm.ie",
      schoolsLink: "https://www.crdm.ie/crdm-member-schools/",
      rulesLink: "https://www.crdm.ie/competition-rules/",
      rulesName: "CRDM competition rules"
    }
  ],

  regions: [
    "United States", "Canada", "Mexico", "Great Britain", "Ireland", "Australia", "Other"
  ],

  dances: [
    { id: "reel", name: "Reel", shoe: "soft" },
    { id: "lightjig", name: "Light jig", shoe: "soft" },
    { id: "slipjig", name: "Slip jig", shoe: "soft" },
    { id: "singlejig", name: "Single jig", shoe: "soft" },
    { id: "treblejig", name: "Treble jig", shoe: "hard" },
    { id: "hornpipe", name: "Hornpipe", shoe: "hard" },
    { id: "tradset", name: "Traditional set", shoe: "hard" },
    { id: "set", name: "Own choice set", shoe: "hard" },
    { id: "prelim", name: "Preliminary Championship", shoe: "champ" },
    { id: "open", name: "Open Championship", shoe: "champ" },
    { id: "adultchamp", name: "Adult Championship", shoe: "champ", orgs: ["clrg"] },
    { id: "advadultchamp", name: "Advanced Adult Championship", shoe: "champ", orgs: ["clrg"] }
  ],

  // CLRG in North America. Confirmed by Shannon on Nov 23: Beginner 1 / Beginner 2 names,
  // the moving-up placings, and moving up one dance at a time at the lower levels.
  levels: [
    {
      org: "clrg", id: "b1", order: 1, name: "Beginner 1", alt: "Bun Grád in the CLRG rulebook; sometimes called First Feis",
      danced: "Reel, light jig, often single jig and slip jig",
      moveUp: "Place 1st, 2nd or 3rd in a dance, then move up in that dance",
      moveUpPlace: 3, perDance: true,
      parents: "School costume or a simple outfit, soft shoes only"
    },
    {
      org: "clrg", id: "b2", order: 2, name: "Beginner 2", alt: "also called Advanced Beginner; Tús Grád in the CLRG rulebook",
      danced: "Soft shoe dances plus treble jig and hornpipe",
      moveUp: "Place 1st, 2nd or 3rd in a dance",
      moveUpPlace: 3, perDance: true,
      parents: "Hard shoes are usually bought around here"
    },
    {
      org: "clrg", id: "novice", order: 3, name: "Novice",
      danced: "All the main dances, plus a traditional set at some feiseanna",
      moveUp: "Place 1st or 2nd in a dance",
      moveUpPlace: 2, perDance: true,
      parents: "Solo dress and wig rules start to matter"
    },
    {
      org: "clrg", id: "pw", order: 4, name: "Open Prizewinner",
      danced: "Same dances, with more advanced steps",
      moveUp: "Win 1st in a dance",
      moveUpPlace: 1, perDance: true,
      parents: "Often the last stage before championships"
    },
    {
      org: "clrg", id: "pc", order: 5, name: "Preliminary Championship",
      danced: "One competition of two rounds: soft shoe, then hard shoe. A panel of judges watches both rounds. For each round one judge is picked at random, and that judge's placings count as everyone's round placing. The overall place comes from all the judges' scores added up, so it can differ from the round placings.",
      moveUp: "Win twice, or meet your region's rules. In the US Southern Region it takes 3 wins to move up to Open",
      perDance: false, check: true,
      parents: "Recalls and Oireachtas qualification come into play"
    },
    {
      org: "clrg", id: "oc", order: 6, name: "Open Championship",
      danced: "Like Preliminary Championship but with three rounds: soft shoe, hard shoe, and a set round (own choice set). Each round is placed by one judge picked at random; the overall place comes from all the judges' scores added up. Judged by a panel (3, or 5 at majors). The path to Nationals, All-Irelands and Worlds.",
      moveUp: "The top level",
      perDance: false,
      parents: "The highest costs and the most travel"
    },
    // Adult championships (CLRG in North America). From the IDTANA adults page (idtana.org/adults)
    // and the 2026 IDTANA Southern Region Oireachtas syllabus, read Nov 25 2026. Regions differ, so marked check.
    // adult: true keeps them off the youth ladder's "next level" (Open does not lead to Adult).
    {
      org: "clrg", id: "adc", order: 7, adult: true, name: "Adult Championship",
      alt: "for dancers 18 and over; also called Adult Champ",
      danced: "One competition, usually three rounds: hard shoe, soft shoe, and a traditional set. Like other championships, a panel of judges decides one overall place. Who can enter: dancers who started Irish dance at 18 or older, or came back after 5 or more years away, and haven't danced at a high youth level recently (in the Southern Region, no top 3 in Preliminary Championship in the last 10 years and no Open Championship in the last 15).",
      moveUp: "Usually your teacher decides when to move up to Advanced Adult Championship. Rules differ by region",
      perDance: false, check: true,
      parents: "Adults only dance adult competitions. Adult Champ is not a step towards youth Open Championship"
    },
    {
      org: "clrg", id: "aadc", order: 8, adult: true, name: "Advanced Adult Championship",
      alt: "also called Advanced Adult Champ; some feiseanna split it into Advanced Adult Prelim and Advanced Adult Open",
      danced: "One competition, usually three rounds: hard shoe, soft shoe, and a set dance (own choice set). Judged by a panel, with one overall place. For adults who placed top 3 in Preliminary Championship, or danced Open Championship, as a youth dancer (in the Southern Region, within the last 10 and 15 years).",
      moveUp: "The top adult level. Once an adult dances Advanced Adult, they can't go back to youth competitions",
      perDance: false, check: true,
      parents: "Recalls work like other championships: at the Southern Region Oireachtas, only recalled dancers dance the set round"
    },
    // WIDA, from the official competition rules (irish.dance/competition-rules), read Nov 23 2026.
    {
      org: "wida", id: "w_b", order: 1, name: "Beginner",
      alt: "the very youngest can start with the Jump 2-3 competition",
      danced: "Solo dances at beginner speed, plus the Beginner Premiership (reel and light jig)",
      moveUp: "Win 1st place in a dance with 5 or more dancers, then move up in that dance",
      moveUpPlace: 1, minEntrants: 5, perDance: true,
      parents: "Every beginner reel dancer is placed and gets a medal"
    },
    {
      org: "wida", id: "w_p", order: 2, name: "Primary",
      danced: "Solo dances, plus the Primary Premiership (reel and light jig)",
      moveUp: "Win 1st place in a dance with 5 or more dancers",
      moveUpPlace: 1, minEntrants: 5, perDance: true,
      parents: "Treble jig and hornpipe can be danced at beginner or open speed until the end of 2026; open speed only from 2027"
    },
    {
      org: "wida", id: "w_i", order: 3, name: "Intermediate",
      danced: "Solo dances, plus the Intermediate Premiership (reel and treble jig; under-12s may dance light jig instead until the end of 2026)",
      moveUp: "Win 1st place in a dance with 5 or more dancers. After winning 4 Intermediate dances (2 of them hard shoe), move on to Preliminary Championship",
      moveUpPlace: 1, minEntrants: 5, perDance: true,
      parents: "The step before championships"
    },
    {
      org: "wida", id: "w_o", order: 4, name: "Open",
      danced: "The top grade for solo dances",
      moveUp: "The top solo grade",
      perDance: true,
      parents: "A dancer can be Open in some dances and lower in others"
    },
    {
      org: "wida", id: "w_pc", order: 5, name: "Preliminary Championship",
      danced: "Two rounds: reel or slip jig, then treble jig or hornpipe. Only at local feiseanna.",
      moveUp: "Win 3 Preliminary Championships with at least 5 dancers (at least 3 in America and Australasia)",
      perDance: false,
      parents: "Every competitor is placed, and 1st to 5th get a trophy"
    },
    {
      org: "wida", id: "w_oc", order: 6, name: "Open Championship",
      danced: "Two rounds, and a recall to dance a Modern Set if the judges choose. The path to Oireachtas, Internationals and Worlds.",
      moveUp: "The top level. Winning one moves all of a dancer's solo dances up to Open",
      perDance: false,
      parents: "Qualifying for Worlds starts at your National Oireachtas the year before",
      // From irish.dance/syllabi and irish.dance/competition-rules, read Nov 25 2026.
      older: "WIDA has no separate adult championship, but its age groups go up to Senior, and there is an Over 45 Open Championship (from 2027: hornpipe, reel, Jockey to the Fair and a modern jig set). Dancers over 25 dance 8 fewer bars in each dance."
    },
    // An Comhdháil, from its public rulebook (web.irishdancingorg.com/index.php/policies/rulebook), read Nov 23 2026.
    {
      org: "comhdhail", id: "ac_a", order: 1, name: "Beginners A", alt: "Bun Grád",
      danced: "Basic steps in reel, light jig, slip jig, single jig, hornpipe, treble jig and traditional sets",
      moveUp: "Win 1st place in a dance with at least 10 dancers, then move up in that dance",
      moveUpPlace: 1, minEntrants: 10, perDance: true,
      parents: "Class costume only; no solo costumes in Beginners A, B or C"
    },
    {
      org: "comhdhail", id: "ac_b", order: 2, name: "Beginners B", alt: "Bun Grád",
      danced: "Slightly harder versions of the basic steps",
      moveUp: "Win 1st place in a dance with at least 10 dancers",
      moveUpPlace: 1, minEntrants: 10, perDance: true,
      parents: "Beginner figure (team) dances are open to Beginners A and B"
    },
    {
      org: "comhdhail", id: "ac_c", order: 3, name: "Beginners C", alt: "Bun Grád",
      danced: "A further step up from Beginners B",
      moveUp: "Win 1st place in a dance with at least 10 dancers",
      moveUpPlace: 1, minEntrants: 10, perDance: true,
      parents: "Beginner cup competitions let a dancer move a dance up by winning the cup"
    },
    {
      org: "comhdhail", id: "ac_po", order: 4, name: "Pre-Open", alt: "Meán Grád",
      danced: "Solo dances in a set age group; a dancer may dance one year above their age",
      moveUp: "Win 1st place in a dance with at least 5 dancers",
      moveUpPlace: 1, minEntrants: 5, perDance: true,
      parents: "Win in an older age group and you can come back to it the next year"
    },
    {
      org: "comhdhail", id: "ac_open", order: 5, name: "Open", alt: "Ard Grád",
      danced: "Open to everyone, in your own age group",
      moveUp: "The top grade for solo dances. Dancing an Open solo is needed before entering a Championship",
      perDance: true,
      parents: "A dancer can be Open in some dances and lower in others"
    },
    {
      org: "comhdhail", id: "ac_ch", order: 6, name: "Championship",
      danced: "A light and a heavy dance, judged by 1 or 3 adjudicators (5 at the World Championships). Open Championship starts at Under 10.",
      moveUp: "Win with 1 judge: Open in those dances for the year. Win with 3 judges: Open in every dance for life",
      perDance: false,
      parents: "Provincial Championships are the route to the World Championships"
    },
    // CRDM, from its public competition rules (crdm.ie/competition-rules, CRDM019, CRDM023, CRDM033, CRDM094),
    // read Nov 25 2026. Grade names as printed in CRDM feis results.
    {
      org: "crdm", id: "cd_a", order: 1, name: "Beginner A",
      danced: "Solo dances, plus the A Award (for dancers with 3 or more dances in Beginner A)",
      moveUp: "Win 1st place in a dance with 6 or more dancers, then move up in that dance. With fewer than 6, a dancer can win that dance 3 times before moving up",
      moveUpPlace: 1, minEntrants: 6, perDance: true,
      parents: "No solo dress: a class costume, or a skirt or trousers and top. Beginner A dancers may dance again if they stop or miss the start"
    },
    {
      org: "crdm", id: "cd_b", order: 2, name: "Beginner B",
      danced: "Solo dances, plus the B Award (for dancers with 2 or more dances in Beginner B)",
      moveUp: "Win 1st place in a dance with 6 or more dancers, or win it 3 times with fewer",
      moveUpPlace: 1, minEntrants: 6, perDance: true,
      parents: "Still a class costume, or a skirt or trousers and top"
    },
    {
      org: "crdm", id: "cd_i", order: 3, name: "Intermediate",
      danced: "Solo dances, plus the Intermediate Award",
      moveUp: "Win 1st place in a dance with 6 or more dancers, or win it 3 times with fewer",
      moveUpPlace: 1, minEntrants: 6, perDance: true,
      parents: "Winning a Preliminary or Premiership Championship ends the Intermediate Award for your dancer"
    },
    {
      org: "crdm", id: "cd_o", order: 4, name: "Open",
      danced: "The top grade for solo dances",
      moveUp: "The top solo grade",
      perDance: true,
      parents: "A dancer can be Open in some dances and lower in others"
    },
    {
      org: "crdm", id: "cd_pc", order: 5, name: "Preliminary Championship",
      alt: "and the Premiership Championship, from age 9",
      danced: "Two rounds in front of 3 judges, heavy round first. Ages 7 and 8: reel and light or slip jig. Age 9 and up: reel and treble jig. The Premiership (age 9 and up) is slip jig and a traditional set (boys dance a reel)",
      moveUp: "Winning moves those 2 dances to Open. After 3 wins a dancer can't enter it again",
      perDance: false,
      parents: "For dancers aged 7 and up who haven't won an Open Championship with a modern set under 3 or more judges"
    },
    {
      org: "crdm", id: "cd_oc", order: 6, name: "Open Championship",
      danced: "Age 9 and up: at least 2 rounds in front of 3 or more judges, one of them a modern set dance. Under 9s have their own Open cups and awards",
      moveUp: "The top level. Winning one moves all of a dancer's dances to Open",
      perDance: false,
      parents: "Qualifying for the All Irelands, British Nationals and Worlds runs through the regional championships"
    }
  ],

  glossaryGroups: [
    { id: "events", name: "Competitions" },
    { id: "dance", name: "Dances, shoes & costume" },
    { id: "moves", name: "Moves & technique" },
    { id: "people", name: "People & organizations" }
  ],

  glossary: [
    // Competitions and events
    { g: "events", term: "Feis", say: "fesh", means: "A local Irish dance competition, usually one day", why: "Most of your weekends will revolve around these" },
    { g: "events", term: "Feiseanna", say: "FESH-uh-nuh", means: "Plural of feis", why: "You'll see it on calendars and registration sites" },
    { g: "events", term: "Oireachtas", alt: "Regionals", say: "oh-ROCK-tus", means: "The regional championship, held once a year", why: "Qualifying dancers compete for places at Nationals and Worlds" },
    { g: "events", term: "Nationals", means: "National championship (for example North American Nationals or the Great Britain Championships)", why: "Usually needs a qualifying result for championship dancers" },
    { g: "events", term: "All-Irelands", means: "The All-Ireland Championships, held in Ireland", why: "A major championship open to dancers from abroad" },
    { g: "events", orgs: ["clrg"], term: "Worlds", alt: "Oireachtas Rince na Cruinne", say: "oh-ROCK-tus RIN-kuh nuh KRIN-yuh", means: "The CLRG World Championships", why: "Qualification only, usually through a regional or national event" },
    { g: "events", term: "Grades", alt: "grade competitions", means: "All the levels below championship (Beginner 1, Beginner 2, Novice, Open Prizewinner). Each dance is its own competition, split by level and age", why: "Where most dancers spend their first years. Not the same as grade exams" },
    { g: "events", term: "Championship", alt: "Prelim, Open", means: "Prelim (PC) and Open (OC) competitions. PC is 2 rounds (soft shoe, hard shoe); OC adds a 3rd, the set round (own choice set). Judged by a panel, with one overall place", why: "Unlike grades, where every dance is its own competition with its own award" },
    { g: "events", term: "Round placing", means: "In a championship, where your dancer placed in one round. One judge from the panel is picked at random for each round, and that judge's placings are given to every dancer for that round", why: "Round places can look very different from the overall place, because the other judges may have seen it differently" },
    { g: "events", term: "Overall place", means: "A dancer's final championship result, from every judge's scores for every round added together. It isn't worked out from the round placings", why: "This is the place that counts for awards, moving up and qualifying" },
    { g: "events", term: "Marshalling", alt: "side stage, marshal", means: "Lining dancers up in order before they go on stage. A marshal is the volunteer who does it", why: "Get to the stage early; if your dancer misses their turn, they may not get to dance" },
    { g: "events", term: "Recall", means: "Being called back after the first rounds to dance the final round", why: "A recall is itself an achievement worth celebrating" },
    { g: "events", term: "Placement", alt: "podium", means: "Finishing high enough to be called up for an award", why: "How many places are awarded depends on the size of the competition" },
    { g: "events", term: "Raw score", alt: "marks", means: "Points each judge gives", why: "What the score tracker can log" },
    { g: "events", term: "Irish points", means: "Placings converted into points so different judges can be combined", why: "Explains why the winner isn't always the dancer with the highest raw marks" },
    { g: "events", term: "Ceili", say: "KAY-lee", means: "A group dance, or a social dance night", why: "Team dances at feiseanna and championships" },
    { g: "events", term: "Figure dance", alt: "team dance", means: "A choreographed group dance, often 4 to 16 dancers", why: "Team practice adds to the schedule" },
    { g: "events", term: "Stage", alt: "adjudicator's table", means: "Where each competition is held at a feis", why: "Check the stage number in the program" },
    { g: "events", term: "Competitor number", alt: "competitor card", means: "The number your dancer wears", why: "Pin it to the costume; you'll use it to look up results" },
    { g: "events", term: "Results posting", means: "Results on paper boards at the venue, or published online afterwards", why: "What parents photograph for the score tracker" },
    { g: "events", term: "Syllabus", means: "The list of competitions, ages and fees at a feis", why: "Read it before you register" },
    { g: "events", term: "U8 / 15O", alt: "age groups, under, over", means: "How age groups are written on a syllabus. U means under, so U8 is under 8. O means and over, so 15O is 15 and over", why: "Each feis says which date it uses to work out age, so check before you enter" },
    { g: "events", term: "Light round", alt: "soft shoe round", means: "The soft shoe round of a championship: a reel or a slip jig", why: "Usually the first round your dancer dances" },
    { g: "events", term: "Heavy round", alt: "hard shoe round", means: "The hard shoe round of a championship: a treble jig or a hornpipe", why: "Usually the second round" },
    { g: "events", term: "Specials", alt: "special competitions, trophy dance", means: "Extra competitions at a feis that don't count toward moving up, such as a trophy dance, a traditional set or a treble reel", why: "A fun way to dance more, but they add to your entry fees" },
    { g: "events", term: "School feis", means: "A small feis that only the host school's own dancers can enter", why: "A friendly place for a first competition" },
    { g: "events", term: "Blackout feis", means: "A feis where solo dresses and fancy costumes aren't allowed, and dancers wear simple outfits, usually black", why: "Cheaper and quicker to get ready for. The syllabus will say if it's one" },
    { g: "events", term: "Parade of Champions", means: "A walk-on at the end of a feis where the winners of each age group come out and dance a step in turn. It isn't judged", why: "A proud moment if your dancer won their competition" },
    { g: "events", term: "Perpetual trophy", means: "A trophy the winner keeps for a while and then hands back, usually after a year, so it can be won again", why: "Look after it and return it on time; some feiseanna ask for a deposit" },
    { g: "events", term: "Sash", alt: "belt", means: "An award worn across the body, often given to the top dancers in a competition. Boys sometimes get a belt instead", why: "Great for photos, and a keepsake" },
    { g: "events", term: "Blocking", means: "When a dancer keeps moving into a spot in front of another dancer, so the judge sees them more", why: "Teachers coach dancers to use the stage well and not to block others" },
    { g: "events", term: "Fleadh", say: "flah", means: "A festival of Irish music, sometimes with dancing or dance competitions", why: "A fun day out that's different from a feis" },
    { g: "events", term: "Majors", alt: "major championships", means: "The big championships above a local feis, such as the Oireachtas, Nationals, the All-Irelands and Worlds. They run over several days and usually need a qualifying result", why: "The teacher usually enters dancers for these, and travel is often involved" },
    { g: "events", orgs: ["clrg"], term: "NAIDC", alt: "North American Nationals, NANs", means: "The North American Irish Dance Championships, held each summer and hosted in turn by the North American regions", why: "A second route to qualifying for Worlds, after the Oireachtas" },
    { g: "events", orgs: ["clrg"], term: "World qualifier", alt: "WQ", means: "A dancer who has earned a place at Worlds. Most qualify at their Oireachtas, and some at Nationals or the All-Irelands", why: "Qualifying places are limited, so it's a big moment" },
    { g: "events", orgs: ["clrg"], term: "National qualifier", alt: "NQ", means: "A dancer who has earned a place at Nationals in their solo competition, usually through an Oireachtas result", why: "In North America, check the deadlines with your teacher" },
    { g: "events", orgs: ["clrg"], term: "World medal holder", alt: "WMH", means: "A dancer who placed high enough at Worlds to win a medal", why: "They're usually qualified for the next year's Worlds without needing to qualify again", check: true },
    { g: "events", term: "First Feis", alt: "Tír na nÓg", say: "teer nuh NOGE", means: "A first competition for the very youngest or newest dancers, with short dances and a prize for everyone", why: "A gentle, low-pressure way to start. Not every feis offers it" },
    { g: "events", term: "Adult competitions", alt: "adult grades, adult championship", means: "Competitions for people who started dancing as adults, or who haven't competed as a child for several years", why: "Each organization sets its own age and eligibility rules", check: true },
    { g: "events", orgs: ["clrg"], term: "Masters", means: "Adult competitions, in some North American regions, for adults who danced as children", why: "Only some regions offer them, so check your regional syllabus" },
    { g: "events", term: "Shows", alt: "Riverdance, Lord of the Dance", means: "Performances, from local St. Patrick's Day shows to touring stage shows like Riverdance (1994) and Lord of the Dance (1996), which made Irish dance famous worldwide", why: "Many schools perform in the community, and some dancers go on to dance professionally" },

    // Dances, shoes and costume
    { g: "dance", term: "Soft shoe", means: "Light, lace-up dances: reel, light jig, slip jig, single jig", why: "The first dances most beginners learn" },
    { g: "dance", term: "Hard shoe", alt: "heavy shoe, jig shoe", means: "Dances in shoes with fiberglass tips and heels that make rhythm: treble jig, hornpipe, treble reel", why: "A second pair of shoes, usually bought a bit later" },
    { g: "dance", term: "Ghillies", alt: "pumps, pomps", say: "GILL-eez", means: "Soft, laced shoes worn by girls and women", why: "Need replacing as feet grow; check the fit with the teacher" },
    { g: "dance", term: "Reel shoes", means: "Soft shoes for boys, like a jazz shoe with a heel that clicks", why: "The boys' equivalent of ghillies" },
    { g: "dance", term: "Reel", means: "A fast soft shoe dance in 2/4 or 4/4 time", why: "Usually the first competition dance" },
    { g: "dance", term: "Light jig", means: "A quick soft shoe dance in 6/8", why: "Often danced at beginner levels" },
    { g: "dance", term: "Slip jig", means: "A graceful soft shoe dance in 9/8", why: "Mostly danced by girls" },
    { g: "dance", term: "Single jig", alt: "hop jig", means: "A soft shoe jig in 6/8 or 12/8", why: "Whether it's offered varies by region" },
    { g: "dance", term: "Treble jig", alt: "heavy jig", say: "TREB-ul", means: "A slow, heavy shoe jig", why: "A core hard shoe dance" },
    { g: "dance", term: "Hornpipe", means: "A heavy shoe dance in 2/4 or 4/4", why: "A core hard shoe dance" },
    { g: "dance", term: "Set dance", means: "A hard shoe dance to a set tune. There are traditional sets and own choice sets", why: "Appears from the middle levels upward" },
    { g: "dance", term: "Traditional set", alt: "trad set", means: "A set dance with set steps that every school learns, like St. Patrick's Day or The Blackbird", why: "Danced at the lower and middle grades" },
    { g: "dance", term: "Own choice set", alt: "open set, contemporary set, non-traditional set", means: "A set dance where the dancer picks the tune and dances their teacher's own steps", why: "This is the set danced in championship rounds, not a traditional set" },
    { g: "dance", term: "Steps", means: "Short choreographed sections of a dance, each about 8 bars a side", why: "Teachers give new steps as dancers move up" },
    { g: "dance", term: "School costume", alt: "class costume, school dress", means: "The dress or outfit in your school's colors", why: "Usually worn until a dancer moves into a solo dress" },
    { g: "dance", term: "Solo dress", means: "A dancer's own competition dress", why: "One of the biggest costs; rules govern when it's allowed" },
    { g: "dance", term: "Wig", means: "A curled wig worn in competition, usually by girls", why: "Often from the middle levels; check age and level rules" },
    { g: "dance", term: "Poodle socks", means: "Long white ribbed socks", why: "Held up with sock glue" },
    { g: "dance", term: "Sock glue", means: "Roll-on adhesive that keeps socks in place", why: "Bring it to every feis" },
    { g: "dance", term: "Treble reel", means: "A hard shoe dance to fast reel music, packed with rhythm", why: "Popular in shows. At a feis it's usually a special or fun competition, not a main dance" },
    { g: "dance", term: "Traditional speed", alt: "fast jig, fast hornpipe", means: "A treble jig or hornpipe danced at a quicker speed, used by newer dancers", why: "Your dancer's level decides which speed they dance, so check the syllabus", check: true },
    { g: "dance", orgs: ["clrg"], term: "Contrasting set", means: "A set dance in the opposite rhythm to the dancer's hard shoe round: a jig-time set after a hornpipe, or a hornpipe set after a treble jig", why: "Some major championships ask for it in the set round; local feiseanna usually don't", check: true },
    { g: "dance", term: "Two-hand", means: "A team dance for a pair of dancers", why: "Often a dancer's first team competition" },
    { g: "dance", term: "Eight-hand", alt: "four-hand, six-hand", means: "A céilí team named for its size: 4, 6 or 8 dancers, dancing a traditional céilí dance", why: "Teams don't have to be evenly split between boys and girls" },
    { g: "dance", term: "Dance drama", means: "A team dance that tells a story, with character costumes and props", why: "Usually a special event at a major or a large feis" },
    { g: "dance", term: "Blackout costume", alt: "blackout", means: "A plain all-black outfit worn instead of a costume, with simpler hair and make-up", why: "A cheaper option, but whether it's allowed depends on your organization and the dancer's level", check: true },
    { g: "dance", term: "Buckles", means: "Decorations, often sparkly, on the front strap of hard shoes", why: "Small and easy to lose, so pack a spare" },
    { g: "dance", term: "Headband", alt: "tiara, crown", means: "A decorated band that holds a wig in place and matches the dress", why: "Often bought with a solo dress or wig" },
    { g: "dance", term: "Waistcoat", alt: "vest, cummerbund", means: "Boys' costume: usually trousers, a shirt and tie, and a vest or waistcoat, sometimes with a sash (cummerbund) in the school colors", why: "Boys' costumes cost much less than dresses, but still need to fit well" },
    { g: "dance", term: "Rince", say: "RIN-kuh", means: "The Irish word for dance", why: "It's in the names of schools, organizations and events, like Oireachtas Rince na Cruinne" },
    { g: "dance", term: "Sean nós", say: "shan nohss", means: "An older, more relaxed style of Irish dance, close to the floor and often made up on the spot. The name means old style", why: "You may see it at music sessions and festivals rather than a feis" },
    { g: "dance", term: "Festival dancing", means: "A traditional style of Irish dance with simpler costumes and its own competitions, mainly in Northern Ireland", why: "If you hear of festival dancing, it's a different style from feis dancing" },
    { g: "dance", term: "Lilting", means: "Singing the rhythm of the steps out loud, like da-da-dum, to teach or remember them", why: "You'll hear dancers lilting their steps in the car or kitchen" },
    { g: "dance", term: "Elastics", alt: "shoe straps, white tape", means: "Bands or straps that go over the shoes to keep them on while dancing", why: "Pack spares, because a shoe coming off can cost a place" },
    { g: "dance", term: "Kick pants", alt: "bloomers, dance briefs", means: "Shorts worn under a dance dress or skirt", why: "Often need to match the dress or be a set color" },
    { g: "dance", term: "Kilt", means: "A pleated skirt-style garment that was the usual costume for boys and men for much of the 1900s", why: "You'll see it in older photos; most boys wear trousers today" },
    { g: "dance", term: "Ceol", say: "kyole", means: "The Irish word for music", why: "It often appears in school, camp and event names" },
    { g: "dance", term: "Damhsa", say: "DOW-suh", means: "Another Irish word for dance, like rince", why: "You'll see it in names, such as CRN's teacher diploma" },
    { g: "dance", term: "Comhghairdeas", say: "co-HAR-juss", means: "Irish for congratulations", why: "You may see it on medals, sashes and certificates" },
    { g: "dance", term: "Tan", means: "Spray or bottled tan for legs", why: "Rules on makeup and tan vary by age and level" },

    // Moves and technique
    { g: "moves", term: "Turnout", means: "Feet and legs turned outward from the hips, so the toes point out to the sides", why: "Judges look closely at it; it's one of the first things teachers correct" },
    { g: "moves", term: "Carriage", means: "How the upper body is held: straight back, still shoulders, arms close to the sides", why: "Good carriage makes the footwork stand out" },
    { g: "moves", term: "Cross", alt: "crossed feet", means: "Legs crossed so one foot sits in front of the other, with the feet turned out", why: "Tight crossing is a sign of good technique, and judges watch for it" },
    { g: "moves", term: "Treble", alt: "batter, rally", say: "TREB-ul", means: "A quick brush and tap of the foot that makes fast rhythm sounds, mostly in hard shoe", why: "You'll hear teachers count trebles in class" },
    { g: "moves", term: "Click", means: "Hitting the heels of the hard shoes together in the air to make a sharp sound", why: "A crowd favorite in hard shoe steps" },
    { g: "moves", term: "Cut", means: "Bringing the foot up sharply in front of the body, as high as the dancer can", why: "Shows strength and control, especially in soft shoe" },
    { g: "moves", term: "Toe stand", means: "Balancing up on the tips of the hard shoes, sometimes walking or turning on them", why: "An advanced move that needs strong ankles; some organizations limit it for younger dancers", check: true },
    { g: "moves", term: "Leap", alt: "bird, stag leap", means: "A big jump across the stage. A bird has one leg straight out and the other tucked under; a stag has the front leg bent", why: "Leaps add height and drama to soft shoe steps" },
    { g: "moves", term: "Rising step", alt: "jig step, rise and grind", means: "A common soft shoe step pattern: a hop, then hopping back, then hopping back again", why: "One of the first patterns beginners learn" },
    { g: "moves", term: "Sevens", alt: "sidestep", means: "A travelling step that goes sideways or on a diagonal over seven counts", why: "Used in both solo steps and team dances" },
    { g: "moves", term: "Threes", alt: "hop 1-2-3, skips", means: "A basic three-count step, done in place or travelling, that later grows into leaps", why: "A building block of almost every dance" },
    { g: "moves", term: "Lead around", alt: "lead round", means: "A short circling section at the start of a step or dance", why: "Beginners often learn this first" },
    { g: "moves", term: "Drum", alt: "roll, drumroll", means: "A very fast toe-heel-toe pattern in hard shoes", why: "Makes the rattling sound you hear in hard shoe" },
    { g: "moves", term: "Rocks", means: "Crossing the feet and rocking side to side on the ankles", why: "A classic move that needs strong ankles" },
    { g: "moves", term: "Flutters", alt: "butterflies, scissors", means: "A jump straight up with pointed feet, where the legs cross past each other two or more times in the air", why: "A jump that looks impressive" },
    { g: "moves", term: "Point and bow", means: "Pointing the foot and bowing to the judge and the musician at the end of a dance", why: "It's polite stage manners, and judges notice it" },
    { g: "moves", term: "Hop back", means: "A small hop backward on one foot, often linking two moves", why: "One of the basics in early steps" },

    // People and organizations
    { g: "people", orgs: ["clrg"], term: "CLRG", alt: "An Coimisiún", say: "un KUM-ish-oon", means: "An Coimisiún le Rincí Gaelacha, the largest Irish dance organization, based in Dublin", why: "Sets the rules your dancer competes under" },
    { g: "people", orgs: ["clrg", "crdm"], term: "TCRG", means: "A certified teacher. Mostly CLRG, but CRDM uses the same title for its own teachers", why: "Your dancer competes as their TCRG's pupil. Families register for regular feiseanna themselves, but the TCRG registers dancers for majors like the Oireachtas, Nationals and Worlds" },
    { g: "people", orgs: ["clrg", "crdm"], term: "ADCRG", means: "A certified adjudicator (judge). Mostly CLRG, but CRDM uses the same title for its own judges", why: "The people scoring your dancer" },
    { g: "people", orgs: ["clrg"], term: "SDCRG", means: "A certified CLRG examiner, who can run grade exams", why: "Mostly relevant to teachers" },
    { g: "people", orgs: ["clrg"], term: "ADCRG-BG", means: "A CLRG teacher and judge who can also examine the first 10 grade exams, but isn't a full examiner (SDCRG)", why: "Mostly relevant if your school does grade exams" },
    { g: "people", term: "Adjudicator", means: "A judge", why: "In grades one judge places each dance. Championships use a panel: usually 3, 5 at major championships, and 6 at the All-Irelands with 5 counting" },
    { g: "people", orgs: ["clrg"], term: "Region", means: "A geographic area under CLRG with its own regional body and Oireachtas", why: "Your region decides your Oireachtas and some local rules" },
    { g: "people", orgs: ["clrg"], term: "IDTANA", means: "Irish Dance Teachers' Association of North America, the body for CLRG teachers in North America", why: "Its regions run the North American Oireachtas events" },
    { g: "people", orgs: ["clrg"], term: "Grade exam", alt: "Grád", say: "grawd", means: "Optional CLRG exams in dance skills and knowledge", why: "Some schools encourage them; separate from competitions" },
    { g: "events", orgs: ["clrg"], term: "Bun Grád / Tús Grád", say: "bun grawd / toos grawd", means: "The CLRG rulebook's names for the first two grades (Beginner and Advanced Beginner)", why: "Special costume, make-up and filming rules apply to these grades", check: true },
    { g: "events", orgs: ["clrg"], term: "Restyling", means: "A 3-month wait before a dancer who changes school can compete again", why: "Plan around it if you're thinking of changing schools" },
    { g: "events", orgs: ["comhdhail"], term: "Bun Grád", say: "bun grawd", means: "An Comhdháil's beginner grades: Beginners A, B and C", why: "Win a dance with 10 or more dancers to move up" },
    { g: "events", orgs: ["comhdhail"], term: "Meán Grád", say: "MAWN grawd", means: "Pre-Open, the middle grade", why: "Danced in age groups; win with 5 or more dancers to move up" },
    { g: "events", orgs: ["comhdhail"], term: "Ard Grád", say: "AWRD grawd", means: "Open, the top solo grade", why: "Needed before entering a Championship", check: true },
    { g: "events", orgs: ["comhdhail"], term: "Restyling", means: "A 3-month wait before a dancer who moves into or within An Comhdháil can compete", why: "Starts when the new teacher's branch gets the registration form" },
    { g: "events", orgs: ["comhdhail"], term: "Provincial Championship", alt: "Qualifier", means: "The championship a dancer must dance to qualify for the World Championships", why: "Dancers may only enter one each season" },
    { g: "events", orgs: ["comhdhail"], term: "Cup competition", means: "A special competition at beginner or Pre-Open level; the winner moves up in that dance", why: "Only one cup per grade per feis" },
    { g: "events", orgs: ["comhdhail"], term: "NCH", alt: "Non-Championship Holder", means: "A competition for dancers who haven't won a Championship, with a light and a heavy dance", why: "Winning makes the dancer Open in those dances" },
    { g: "events", orgs: ["wida"], term: "Premiership", means: "A WIDA competition where a dancer does two dances and the scores are added together (for example reel and light jig)", why: "Your dancer can enter one premiership per feis, at the grade they're in for most of their dances" },
    { g: "events", orgs: ["wida"], term: "Jump 2-3", means: "A first competition for the youngest WIDA dancers: 16 jump 2-3s or promenade steps", why: "From 2027 it's for under-7s only" },
    { g: "events", orgs: ["wida"], term: "Yafers", means: "The online system used to enter every WIDA feis", why: "Entries are non-refundable once paid" },
    { g: "dance", orgs: ["wida"], term: "Modern set", means: "A set dance to modern music, used as a third round in WIDA Open Championships", why: "Only recalled dancers dance it" },
    { g: "people", orgs: ["clrg", "wida", "crdm"], term: "TMRF", means: "A teacher qualification. In CLRG it's a céilí teacher's certificate, for teaching team dances only. WIDA and CRDM use the title for their own teachers too", why: "Teachers with only TMRF can still compete themselves" },
    { g: "people", orgs: ["crn"], term: "ODCRN", means: "A fully qualified CRN teacher (Oide Damhsa diploma)", why: "The CRN version of a teacher's title" },
    { g: "people", orgs: ["crn"], term: "TMCRN", means: "A CRN teacher who has passed Part 1 of the ODCRN teacher diploma", why: "A certified, part-qualified CRN teacher" },
    { g: "people", orgs: ["crn"], term: "ADCRN", means: "A CRN adjudicator (judge)", why: "The people scoring your dancer at CRN feiseanna" },
    { g: "events", orgs: ["crn"], term: "Féile", say: "FAY-luh", means: "A festival or competition. CRN and others use it for many of their local competitions", why: "A féile works like a feis for your dancer" },
    { g: "events", orgs: ["crn"], term: "Feis Host", means: "The website CRN uses for feis entries (crn.feishost.com)", why: "Upcoming CRN feiseanna are listed there" },
    { g: "events", orgs: ["crdm"], term: "A Award / B Award", means: "CRDM competitions in front of 1 judge for beginner dancers: A for dancers with 3 or more dances in Beginner A, B for 2 or more in Beginner B", why: "Your dancer must also dance at least 2 solos that day to enter" },
    { g: "events", orgs: ["crdm"], term: "Intermediate Award", means: "A CRDM award competition in front of 1 judge, for dancers who haven't won it, or a Preliminary, Premiership or Open Championship", why: "Winning it moves your dancer up in the Award and in that solo dance" },
    { g: "events", orgs: ["crdm"], term: "Premiership Championship", means: "A CRDM championship for dancers aged 9 and up who haven't won an Open Championship: slip jig and a traditional set (boys dance a reel) in front of 3 judges", why: "Winning it counts like a Preliminary Championship win" },
    { g: "events", orgs: ["crdm"], term: "1 Adjudicator Championship", means: "A CRDM championship with one judge", why: "Winning it makes your dancer Open in both dances, and it's part of qualifying for the CRDM Worlds" },
    { g: "events", orgs: ["crdm"], term: "Championship points", means: "CRDM's points for championship placings: 100 for 1st, 75 for 2nd, 65 for 3rd, down to 1 point for 50th", why: "How CRDM turns championship placings into points" },
    { g: "people", term: "Open platform", alt: "independent, unaffiliated", means: "A feis or organization open to dancers from any organization, or a teacher or school that isn't part of any organization", why: "Check with your teacher first: some organizations limit which open platform events their dancers can enter" },
    { g: "people", orgs: ["clrg", "comhdhail"], term: "The Split", means: "The 1969 split when An Comhdháil separated from CLRG to become its own organization", why: "Explains why there are two big organizations with similar names and rules" },
    { g: "people", term: "Feis committee", means: "The volunteers running a particular feis", why: "Contact them about entries, schedules and results" }
  ],

  // Rules library. CLRG entries summarise the CLRG Official Rulebook V6 (Sept 2026).
  // CLRG's rulebook doesn't set grades or moving up: in North America those feis rules
  // now come from IDTANA (the North American Feis Commission is no longer active).
  // Its feis rules aren't added yet (draft: true).
  rules: [
    { orgId: "clrg", topic: "Moving up", draft: true, levels: ["b1"], regions: ["United States", "Canada", "Mexico"], org: "IDTANA",
      q: "How does my dancer move up from Beginner 1?",
      a: "By placing 1st, 2nd or 3rd in a dance. They move up in that dance only, so a dancer can be Beginner 2 in reel and still Beginner 1 in light jig." },
    { orgId: "clrg", topic: "Moving up", draft: true, levels: ["b2"], regions: ["United States", "Canada", "Mexico"], org: "IDTANA",
      q: "How does my dancer move up from Beginner 2?",
      a: "By placing 1st, 2nd or 3rd in a dance. Again, this is one dance at a time." },
    { orgId: "clrg", topic: "Moving up", draft: true, levels: ["novice"], regions: ["United States", "Canada", "Mexico"], org: "IDTANA",
      q: "How does my dancer move up from Novice?",
      a: "By placing 1st or 2nd in a dance, one dance at a time." },
    { orgId: "clrg", topic: "Moving up", draft: true, levels: ["pw"], regions: ["United States", "Canada", "Mexico"], org: "IDTANA",
      q: "How does my dancer move up from Open Prizewinner?",
      a: "By winning 1st place in a dance. Once a dancer has moved up in enough dances, they can start dancing Preliminary Championship." },
    { orgId: "clrg", topic: "Moving up", draft: true, levels: ["pc"], regions: ["United States"], org: "IDTANA Southern Region",
      q: "How does my dancer move up from Prelim to Open in the Southern Region?",
      a: "In the US Southern Region, a dancer needs 3 Preliminary Championship wins to move up to Open Championship. Other regions set their own rules, so check with your teacher if you dance elsewhere." },
    { orgId: "clrg", topic: "Entering competitions", sec: "1.1", levels: [], regions: [], org: "CLRG",
      q: "Who registers my dancer for a CLRG feis?",
      a: "For a regular feis, you do: families register their own dancer, usually online. It's wise to check with your teacher (TCRG) first about which feis and which dances. For majors such as the Oireachtas, Nationals and Worlds, the teacher registers the dancer, not the family. Either way, your dancer must be taught by a CLRG-registered teacher (a TCRG for solos, a TCRG or TMRF for teams)." },
    { orgId: "clrg", topic: "Entering competitions", sec: "1.1, 3.1", levels: [], regions: [], org: "CLRG",
      q: "Can my dancer also compete in other organizations' competitions?",
      a: "No. Dancers of a CLRG teacher may not compete in events that aren't run under CLRG, apart from a few CLRG recognises (such as Scór) and approved \"open platform\" events. Check with your teacher before entering anything else." },
    { orgId: "clrg", topic: "At the feis", sec: "2.7", levels: [], regions: [], org: "CLRG",
      q: "Can I film or photograph my dancer?",
      a: "Only in the first two grades (Beginner and Advanced Beginner, called Bun Grád and Tús Grád in the rulebook), and only if local law and your region allow it. In every other grade, photos and video of dancers dancing are forbidden." },
    { orgId: "clrg", topic: "At the feis", sec: "5.4", levels: [], regions: [], org: "CLRG",
      q: "What is the \"arms up\" check side stage?",
      a: "Before each round, dancers lining up side stage must be able to raise their arms to shoulder height. A dancer whose costume stops this isn't allowed to dance. Arm or posture aids (\"carriage aids\") are banned, apart from medical ones." },
    { orgId: "clrg", topic: "Steps and technique", sec: "4.2", levels: [], regions: [], org: "CLRG",
      q: "When can my dancer dance on their toes (en pointe)?",
      a: "Not at all up to and including the Under 12 age group. Dancers moving into Under 13 in January may start from 1 September the year before." },
    { orgId: "clrg", topic: "Shoes and costume", sec: "5.1.8", levels: ["b1", "b2"], regions: [], org: "CLRG",
      q: "What can my dancer wear at Beginner and Advanced Beginner?",
      a: "Up to and including Under 12, only a school class costume, or a simple outfit: blouse or shirt with a skirt or trousers, a polo top with a skirt or trousers, or a bodysuit with a skirt. No low-cut tops or short tight skirts." },
    { orgId: "clrg", topic: "Shoes and costume", sec: "5.2", levels: [], regions: [], org: "CLRG",
      q: "When can my dancer wear make-up?",
      a: "No make-up for anyone in the Under 10 age group or younger, in solos or teams; that includes false eyelashes and tan on the face. No make-up in the first two grades up to and including Under 12. It goes by the competition's age group, not the dancer's own age." },
    { orgId: "clrg", topic: "Shoes and costume", sec: "5.1.3–5.1.13", levels: [], regions: [], org: "CLRG",
      q: "What are the rules for dresses?",
      a: "Necklines at the collarbone or higher, a full front, sides and back, and sleeves. Underwear must cover the midriff. Skirts over bodysuits should reach mid-thigh at the back. No feathers and no cartoon characters. If a dress is too short, judges can ask for thick black tights." },
    { orgId: "clrg", topic: "Shoes and costume", sec: "5.1.1–5.1.2", levels: ["pc", "oc"], regions: [], org: "CLRG",
      q: "Can a championship dress show names or past wins?",
      a: "No. In championships judged by 3 or more adjudicators, solo costumes and headwear can't have names, initials, or designs that show past achievements (such as globes)." },
    { orgId: "clrg", topic: "Shoes and costume", sec: "5.3", levels: [], regions: [], org: "CLRG",
      q: "What are the rules for hard shoes?",
      a: "Heels can be at most 1.5 inches high and made of leather, plastic or fiberglass, with no metal except the nails or screws holding them on. Altering shoes, wearing them on the wrong feet, or adding heels and tips to soft shoes can get a dancer disqualified." },
    { orgId: "clrg", topic: "Changing schools", sec: "2.1", levels: [], regions: [], org: "CLRG",
      q: "What happens if we change schools?",
      a: "Your dancer has a 3-month \"restyling\" break from competing, whether they come from a CLRG school or another organization. It starts on the date the transfer notice is posted or emailed. Competing during it can add up to 3 more months." },
    { orgId: "clrg", topic: "Changing schools", sec: "2.1.3, 2.1.5", levels: [], regions: [], org: "CLRG",
      q: "Are there exceptions to the 3-month restyling?",
      a: "Yes. It doesn't apply to a beginner who spent 3 months or less at their first school, or to a dancer who hasn't been to any Irish dance class for at least a year. For anything else you can appeal using the form on clrg.ie." },
    { orgId: "clrg", topic: "Grade exams", sec: "6.3", levels: [], regions: [], org: "CLRG",
      q: "What are grade exams?",
      a: "Optional CLRG exams in dance skills, from Grade 1 up to Grade 10, separate from competitions. Your teacher has to request them." },

    // ----- An Comhdháil: plain-language summaries of its public rulebook (read Nov 23 2026) -----
    { orgId: "comhdhail", topic: "Entering competitions", sec: "4.1, 4.3", levels: [], regions: [], org: "An Comhdháil",
      q: "Which age group does my dancer dance in?",
      a: "Their age on 1 January decides it for the whole year. Every dancer's birth certificate must be registered with the local branch secretary." },
    { orgId: "comhdhail", topic: "Entering competitions", sec: "4.2", levels: [], regions: [], org: "An Comhdháil",
      q: "Can my dancer enter other organizations' competitions?",
      a: "Dancers who live outside Ireland and the UK may enter open platform competitions that aren't registered with An Comhdháil." },
    { orgId: "comhdhail", topic: "At the feis", sec: "10.1", levels: [], regions: [], org: "An Comhdháil",
      q: "Can I film or photograph my dancer?",
      a: "No. Any unofficial photos or video of a dancer while they're competing are forbidden, on phones, tablets or cameras. Live coverage is allowed at the World Championships." },
    { orgId: "comhdhail", topic: "At the feis", sec: "5.10, 5.12", levels: [], regions: [], org: "An Comhdháil",
      q: "What if my dancer falls or a lace comes undone?",
      a: "If a dance is interrupted by the dancer's own mishap (a lace, a fall, a wig), they can dance again once. A second mishap of the same kind means disqualification. Dancers who stop because someone else fell aren't penalised." },
    { orgId: "comhdhail", topic: "At the feis", sec: "5.9", levels: [], regions: [], org: "An Comhdháil",
      q: "Are any moves banned?",
      a: "Dancing en pointe is banned up to and including Under 14 (it's allowed from the September before Under 15), and horizontal split jumps are banned for safety. Either one means disqualification." },
    { orgId: "comhdhail", topic: "Moving up", sec: "5.1–5.3, 5.7", levels: ["ac_a", "ac_b", "ac_c"], regions: [], org: "An Comhdháil",
      q: "When does my dancer move up from Beginners A, B or C?",
      a: "When they win 1st place in a dance with at least 10 dancers, they move up in that dance. With fewer dancers, the judge decides whether to give a 1st place or just an award, based on the standard." },
    { orgId: "comhdhail", topic: "Moving up", sec: "5.4, 5.7", levels: ["ac_po"], regions: [], org: "An Comhdháil",
      q: "How does Pre-Open work?",
      a: "Pre-Open (Meán Grád) is danced in age groups, and a dancer may dance one year above their age. Winning 1st with at least 5 dancers moves them up in that dance. Win in an older age group and you can dance it again the next year." },
    { orgId: "comhdhail", topic: "Moving up", sec: "4.5", levels: ["ac_a", "ac_b", "ac_c", "ac_po"], regions: [], org: "An Comhdháil",
      q: "My dancer won, but we already paid for the next feis. Can they still dance that grade?",
      a: "No. Once a dancer wins 1st place in a dance, they can't dance it in that grade again, even if entries are already paid." },
    { orgId: "comhdhail", topic: "Moving up", sec: "4.11–4.12", levels: ["ac_a", "ac_b", "ac_c", "ac_po"], regions: [], org: "An Comhdháil",
      q: "What are cup competitions?",
      a: "Special competitions at beginner and Pre-Open level. Your dancer must be in that grade for the dance and have danced a matching solo there. Only one cup per grade per feis, and the winner moves up in that dance." },
    { orgId: "comhdhail", topic: "Championships", sec: "4.6–4.8", levels: ["ac_open", "ac_ch"], regions: [], org: "An Comhdháil",
      q: "When can my dancer enter a Championship?",
      a: "After dancing at least one Open solo (not the treble reel) at that feis, plus both solo dances in the Championship. Open Championships start at Under 10 (Under 9 at Provincials). A Championship is a light and a heavy dance." },
    { orgId: "comhdhail", topic: "Championships", sec: "4.6, 4.9", levels: ["ac_ch"], regions: [], org: "An Comhdháil",
      q: "What happens when my dancer wins a Championship?",
      a: "With 1 judge, they become Open in the dances they danced for that year. With 3 judges, they're Open in every dance for life, and can't go back to Beginners or Pre-Open unless they win no Open medal for two years and apply to be re-graded." },
    { orgId: "comhdhail", topic: "Championships", sec: "5.8", levels: ["ac_po", "ac_open"], regions: [], org: "An Comhdháil",
      q: "What is a Non-Championship Holder (NCH) competition?",
      a: "A competition for dancers who haven't won a Championship, with a light and a heavy dance and one judge. The winner becomes Open in those dances and can't enter NCH again." },
    { orgId: "comhdhail", topic: "Championships", sec: "7.1, 8.1, 8.2", levels: ["ac_ch"], regions: [], org: "An Comhdháil",
      q: "How does my dancer qualify for the World Championships?",
      a: "By dancing at a Provincial Championship or Qualifier (only one per season). If something outside your control stops them, tell your branch in writing within 10 days. Schools must also enter figure championships at Provincials to take part in team events at Worlds." },
    { orgId: "comhdhail", topic: "Shoes and costume", sec: "2.1–2.2", levels: ["ac_a", "ac_b", "ac_c"], regions: [], org: "An Comhdháil",
      q: "When can my dancer wear a solo costume?",
      a: "Not in Beginners A, B or C. Up to and including Under 9, a class figure costume is the only class costume allowed." },
    { orgId: "comhdhail", topic: "Shoes and costume", sec: "2.9–2.11", levels: [], regions: [], org: "An Comhdháil",
      q: "When can my dancer wear make-up?",
      a: "No face make-up up to and including age 12, and in team competitions for Under 12 and below. No glitter on the face at any age." },
    { orgId: "comhdhail", topic: "Shoes and costume", sec: "2.4–2.8, 4.6", levels: [], regions: [], org: "An Comhdháil",
      q: "What are the other costume and shoe rules?",
      a: "Dance shoes must be black (white laces are fine). No arm aids. No names or initials on solo costumes, and no designs showing past wins (such as globes). Wear the number in the centre of the costume. Boys over 11 wear soft shoes for the reel." },
    { orgId: "comhdhail", topic: "Changing schools", sec: "3.1–3.9", levels: [], regions: [], org: "An Comhdháil",
      q: "What happens if we change schools?",
      a: "Dancers moving into or within An Comhdháil have a 3-month restyling period before they can compete, starting when the new teacher's branch receives the form. For brand-new beginners it only applies after a month of classes, and not if the old class closed. After restyling, they must dance a Provincial Championship before the World Championships." },
    { orgId: "comhdhail", topic: "Penalties", sec: "9.1–9.2", levels: [], regions: [], org: "An Comhdháil",
      q: "What if my dancer is entered in the wrong grade or age?",
      a: "It's taken seriously: dancing in the wrong grade means a 3-month suspension, and in the wrong age group a 12-month suspension. Double-check entries." },

    // ----- WIDA: plain-language summaries of irish.dance/competition-rules (read Nov 23 2026) -----
    { orgId: "wida", topic: "Entering competitions", sec: "1.1", levels: [], regions: [], org: "WIDA",
      q: "Who can dance at a WIDA feis?",
      a: "Anyone. WIDA feiseanna are open to dancers from every organization, and to independent dancers who aren't with a school." },
    { orgId: "wida", topic: "Entering competitions", sec: "1.6–1.7", levels: [], regions: [], org: "WIDA",
      q: "How do I enter, and can I get a refund?",
      a: "All entries go through the Yafers website. Once paid, entries can't be refunded, even for illness or injury. You only get money back if the feis itself is cancelled." },
    { orgId: "wida", topic: "Entering competitions", sec: "1.8", levels: [], regions: [], org: "WIDA",
      q: "Which age group does my dancer dance in?",
      a: "Their age on 1 January decides it for the whole year. A dancer who was 9 on 1 January dances Under 10 all year. Yafers works it out for you, and small age groups can be merged on the day." },
    { orgId: "wida", topic: "At the feis", sec: "2.3", levels: [], regions: [], org: "WIDA",
      q: "Can I film or photograph my dancer?",
      a: "Not while anyone is dancing. Photos and video are only allowed during award ceremonies, introductions and breaks. This protects children, and anyone filming will be asked to delete it and leave." },
    { orgId: "wida", topic: "At the feis", sec: "2.5–2.6", levels: [], regions: [], org: "WIDA",
      q: "Can I help or coach my dancer from the side of the stage?",
      a: "No. Parents and teachers can't give directions while a dancer is competing, and only the dancers in that competition can wait at the side of the stage." },
    { orgId: "wida", topic: "At the feis", sec: "2.1–2.2", levels: [], regions: [], org: "WIDA",
      q: "Can I use hairspray in the hall?",
      a: "No, because of allergies. Do hair before you go into the dancing hall. Smoking, vaping and alcohol aren't allowed in the hall either." },
    { orgId: "wida", topic: "At the feis", sec: "3.3–3.4", levels: [], regions: [], org: "WIDA",
      q: "What should my dancer know about lining up and awards?",
      a: "Dancers go on stage in number order, and a dancer who arrives late may not be allowed to dance. To collect an award they must be in full costume, shoes included." },
    { orgId: "wida", topic: "At the feis", sec: "3.5–3.9, 16, 18.1", levels: [], regions: [], org: "WIDA",
      q: "What gets a dancer only 1 point for a round?",
      a: "Starting early, stopping and not carrying on, bumping into someone on purpose, dancing a step on one foot but not the other, or a costume problem such as a wig or shoe falling off or a lace coming undone. Beginners get some leeway on starting and stopping." },
    { orgId: "wida", topic: "At the feis", sec: "3.2", levels: [], regions: [], org: "WIDA",
      q: "Who gets a medal or trophy?",
      a: "Everyone in Jump 2-3 and the beginner reel is placed and gets a medal. Other solos award 1st to 3rd, and up to half the dancers when there are 10 or more. In premierships and championships everyone is placed, and 1st to 5th get trophies." },
    { orgId: "wida", topic: "Moving up", sec: "5.3–5.6", levels: ["w_b", "w_p", "w_i"], regions: [], org: "WIDA",
      q: "When does my dancer move up a grade?",
      a: "When they win 1st place in a dance with 5 or more dancers, they must move up in that dance. With fewer than 5 dancers, the teacher can choose to move them up. It's one dance at a time." },
    { orgId: "wida", topic: "Moving up", sec: "5.8", levels: ["w_b", "w_p", "w_i", "w_o"], regions: [], org: "WIDA",
      q: "Can my dancer move back down a grade?",
      a: "No. Once they move up, they stay up, and they must dance the new grade from their very next feis. If they're already entered at the lower grade, the teacher must tell that feis within 2 days. The only exception is a break of ten years or more." },
    { orgId: "wida", topic: "Moving up", sec: "5.2", levels: ["w_b", "w_p", "w_i"], regions: [], org: "WIDA",
      q: "Can my dancer enter two grades at one feis?",
      a: "Yes, they can also enter one grade up in the same dance and age group. For example, Beginner and Primary reel at the same feis." },
    { orgId: "wida", topic: "Moving up", sec: "5.7, 3.1", levels: ["w_b"], regions: [], org: "WIDA",
      q: "What about very young dancers?",
      a: "Under-5 competitions have no grades, so nobody moves up from them. The Jump 2-3 competition is for the youngest dancers (up to Under 11 now, Under 7 only from 2027). Jump 2-3 dancers may also dance the Beginner reel, but nothing else." },
    { orgId: "wida", topic: "Premierships and championships", sec: "10–11", levels: ["w_b", "w_p", "w_i"], regions: [], org: "WIDA",
      q: "What is a premiership, and which one does my dancer enter?",
      a: "Two dances with the scores added together: reel and light jig at Beginner and Primary, reel and treble jig at Intermediate. Your dancer enters the premiership for the grade they're in for at least 2 of reel, light jig and treble jig, and only one per feis. They must also dance at least 2 solos that day. Winning one (with 5 or more dancers) moves both dances up." },
    { orgId: "wida", topic: "Premierships and championships", sec: "11.8", levels: ["w_i", "w_pc"], regions: [], org: "WIDA",
      q: "When does my dancer start Preliminary Championship?",
      a: "After winning 4 dances at Intermediate, at least 2 of them hard shoe dances (light jig and single jig count too). Until then they stay in the Intermediate Premiership." },
    { orgId: "wida", topic: "Premierships and championships", sec: "12.2, 13.5", levels: ["w_pc", "w_oc"], regions: [], org: "WIDA",
      q: "When does my dancer move to Open Championship?",
      a: "After winning 3 Preliminary Championships with at least 5 dancers (at least 3 in America and Australasia). Winning an Open Championship moves all their solo dances up to Open too, apart from hard shoe for young dancers who only danced soft shoe." },
    { orgId: "wida", topic: "Premierships and championships", sec: "14–15", levels: ["w_oc"], regions: [], org: "WIDA",
      q: "How does my dancer qualify for the World Championships?",
      a: "The year before, they dance an Open solo championship or a premiership plus 2 solos at their own National Oireachtas. To dance an Open championship at an Oireachtas, they also need to have danced at a normal local feis in the 12 months before. Injured dancers can ask for an exemption once every 3 years." },
    { orgId: "wida", topic: "Shoes and costume", sec: "18.2, 18.4", levels: [], regions: [], org: "WIDA",
      q: "What shoes are allowed?",
      a: "Soft shoes must be all black with black laces and no sparkle. Hard shoes must be all black with black laces (a white strap is fine), with no buckles or sparkle. A dancer who breaks the costume or shoe rules can't place in the top 3." },
    { orgId: "wida", topic: "Shoes and costume", sec: "18.3, 18.5", levels: [], regions: [], org: "WIDA",
      q: "What are the rules for dresses?",
      a: "No school names or personal names on any costume. Class dresses should be simpler than solo dresses, and Celtic designs are strongly recommended. Jewellery worn for religious reasons must be taped down." },
    { orgId: "wida", topic: "Shoes and costume", sec: "2.7", levels: [], regions: [], org: "WIDA",
      q: "What should my dancer wear between rounds?",
      a: "Change in the changing rooms. If a dress is unzipped between rounds, wear a crop top or bodysuit underneath, keep arms in the sleeves and the front covered." },
    { orgId: "wida", topic: "Changing schools", sec: "19", levels: [], regions: [], org: "WIDA",
      q: "What happens if we change schools?",
      a: "Your dancer can keep competing straight away, with no ban. The new teacher tells the old teacher in writing. Your dancer can't use the old school's steps (except traditional sets), so they compete once they've learned the new school's steps." },

    // ----- CRDM: plain-language summaries of crdm.ie/competition-rules (read Nov 25 2026) -----
    { orgId: "crdm", topic: "Entering competitions", sec: "CRDM020 1.3, CRDM094", levels: [], regions: [], org: "CRDM",
      q: "How do I enter a CRDM feis?",
      a: "Through your teacher. CRDM only takes entries from its registered teachers (and teachers on its approved visitors list), not from parents. All fees are paid in advance; you can't pay on the day. Questions about entries also go through your teacher." },
    { orgId: "crdm", topic: "Entering competitions", sec: "CRDM094", levels: [], regions: [], org: "CRDM",
      q: "What if a feis is cancelled or moved?",
      a: "If a feis is cancelled and rescheduled to a date that doesn't suit your child, you're entitled to a full refund of the fee. If a one-day feis becomes two days, dancers whose day changed get a refund. CRDM doesn't cover travel or hotel costs." },
    { orgId: "crdm", topic: "Entering competitions", sec: "CRDM019", levels: [], regions: [], org: "CRDM",
      q: "Which age group does my dancer dance in?",
      a: "Their age on the day of the feis decides it." },
    { orgId: "crdm", topic: "At the feis", sec: "CRDM020 1.4, CRDM094", levels: [], regions: [], org: "CRDM",
      q: "Can I film or photograph my dancer?",
      a: "No. Cameras and phones aren't allowed during competitions, to protect children. Photos are only allowed during the prize giving." },
    { orgId: "crdm", topic: "At the feis", sec: "CRDM094", levels: [], regions: [], org: "CRDM",
      q: "When should my dancer be ready?",
      a: "In costume and ready to dance 30 minutes before their competition is scheduled. The hall must be silent while anyone is dancing, so don't move about during a competition." },
    { orgId: "crdm", topic: "At the feis", sec: "CRDM020 1.5–2.3", levels: [], regions: [], org: "CRDM",
      q: "What behaviour is expected from families?",
      a: "No smoking, vaping or alcohol. Children shouldn't run around or shout, and parents are responsible for them. Dancers applaud every competitor when results are called, and there's no booing or shouting at the stage. Bullying leads to a warning and removal from the venue, and repeated bullying to a ban from CRDM events. CRDM also forbids posting on the Voy forum." },
    { orgId: "crdm", topic: "At the feis", sec: "CRDM094", levels: [], regions: [], org: "CRDM",
      q: "What if my dancer stops or misses the start?",
      a: "Only Beginner A dancers are allowed to dance again. Everyone else can't redance." },
    { orgId: "crdm", topic: "Moving up", sec: "CRDM094", levels: ["cd_a", "cd_b", "cd_i"], regions: [], org: "CRDM",
      q: "When does my dancer move up a grade?",
      a: "When they win 1st place in a dance with 6 or more dancers, they move up in that dance. If there were fewer than 6, they can win that dance in that grade 3 times before they must move up. It's one dance at a time." },
    { orgId: "crdm", topic: "Moving up", sec: "CRDM094, CRDM019", levels: [], regions: [], org: "CRDM",
      q: "How many competitions can my dancer enter?",
      a: "Solos in up to 3 different grades, and at most 3 awards or championships at one feis (not two of the same grade). To enter an award or 1 Adjudicator Championship, your dancer must also dance at least 2 solo dances that day. Boys may enter only 1 championship." },
    { orgId: "crdm", topic: "Awards and championships", sec: "CRDM019", levels: ["cd_a", "cd_b", "cd_i"], regions: [], org: "CRDM",
      q: "What are the A, B and Intermediate Awards?",
      a: "Competitions in front of 1 judge. The A Award is for dancers with 3 or more solo dances in Beginner A, the B Award for 2 or more in Beginner B, and the Intermediate Award for dancers who haven't won it or any championship. Winning one means moving up to the next Award and moving that dance up too. With fewer than 6 dancers, a winner can enter that Award again at the next championship feis." },
    { orgId: "crdm", topic: "Awards and championships", sec: "CRDM019, CRDM023", levels: ["cd_i", "cd_pc"], regions: [], org: "CRDM",
      q: "Who can dance the Preliminary or Premiership Championship?",
      a: "Preliminary: dancers aged 7 and up who haven't won an Open Championship with a modern set under 3 or more judges. Premiership: the same, from age 9. Both are danced 2 at a time in front of 3 judges, heavy round first. Winning moves those 2 dances to Open, and after 3 wins (Preliminary and Premiership wins added together) a dancer can't enter again." },
    { orgId: "crdm", topic: "Awards and championships", sec: "CRDM019, CRDM094", levels: ["cd_pc", "cd_oc"], regions: [], org: "CRDM",
      q: "When can my dancer dance an Open Championship?",
      a: "When they're no longer eligible for the A or B Award. From age 9 it's at least 2 rounds in front of 3 or more judges, one of them a modern set dance. Winning one moves all of a dancer's dances to Open, and they can't enter the Intermediate Award, Preliminary or Premiership again. Under 9s have their own Open cups and awards." },
    { orgId: "crdm", topic: "Awards and championships", sec: "CRDM023 8–10", levels: ["cd_pc", "cd_oc"], regions: [], org: "CRDM",
      q: "How does my dancer qualify for the All Irelands, British Nationals or Worlds?",
      a: "All Irelands and British Nationals: dance at 4 or more CRDM feiseanna (1 for dancers in remote places), and dance a reel for it to count. Worlds: your dancer can't be eligible for the A or B Award, and must dance 2 Open Championships at regional championships plus a 1 Adjudicator Championship at a regional grade feis (one qualifying championship for remote dancers)." },
    { orgId: "crdm", topic: "Shoes and costume", sec: "CRDM032", levels: [], regions: [], org: "CRDM",
      q: "What shoes are allowed?",
      a: "Black leather or patent soft shoes for light dances and black hard shoes for heavy dances. No coloured or sparkly shoes, even for prize giving. No buckles or elastic on soft shoes, and buckles on hard shoes can be at most 2 inches by 1 inch." },
    { orgId: "crdm", topic: "Shoes and costume", sec: "CRDM033", levels: [], regions: [], org: "CRDM",
      q: "What are the costume rules?",
      a: "Beginner A and B dancers can't wear a solo dress: a class costume, or a skirt or trousers and top with sleeves, also during results. Shoulders must be covered, skirts no shorter than mid-thigh at the back, and costumes no shorter than your dancer's hand held at their side. White bubble socks or black tights (at least 70 denier). No feathers. Change in the changing rooms." },
    { orgId: "crdm", topic: "Changing schools", sec: "CRDM094", levels: [], regions: [], org: "CRDM",
      q: "What happens if we change schools?",
      a: "A dancer can't be judged by their old teacher for 2 years. If they move to a school in another organization, any perpetual trophies must go back to the feis organiser straight away." },

    // ----- CRN: its Rules of Competition aren't published online (crn.ie, checked Nov 25 2026) -----
    { orgId: "crn", topic: "Entering competitions", levels: [], regions: [], org: "CRN",
      q: "Where can I read CRN's rules?",
      a: "CRN's Rules of Competition aren't on its website. CRN says to contact them for a copy, and your teacher will have them. Every CRN feis is run under those rules and CRN's Code of Ethics." },
    { orgId: "crn", topic: "Entering competitions", levels: [], regions: [], org: "CRN",
      q: "Can dancers from other organizations dance at CRN feiseanna?",
      a: "CRN calls itself an open platform and says its feiseanna welcome dancers from all over the world. Check the feis syllabus and with your teacher before entering." }
  ],

  // Parent checklists. Each item has a short key (k) so ticks stay put if items are reordered.
  // Items are ideas gathered from parent tips, feis vendors and Irish Dancing Magazine, written fresh for the app.
  checklists: [
    {
      id: "new", name: "Just started", icon: "🌱",
      blurb: "The first few months. What to ask, what to buy, and what can wait.",
      sections: [
        { title: "Ask the teacher", items: [
          { k: "org", t: "Which organization does the school belong to?", tip: "CLRG, An Comhdháil, WIDA and others each have their own rules and levels. The app shows the right ones once you pick." },
          { k: "lvl", t: "What level does my dancer start at, and which dances are they learning?" },
          { k: "fees", t: "What are the yearly costs?", tip: "Ask about class fees, registration, shoes, school costume rental and feis entry fees so there are no surprises." },
          { k: "when", t: "When does the school usually send dancers to their first feis?" },
          { k: "comm", t: "How does the school share news: app, email, or a parent group chat?" }
        ]},
        { title: "Buy (only what you need)", items: [
          { k: "soft", t: "Soft shoes (ghillies for girls, reel shoes for boys)", tip: "Have the teacher check the fit. They should be snug, like a second skin, and will stretch." },
          { k: "socks", t: "White socks for class (poodle socks come later for feiseanna)" },
          { k: "wear", t: "Class wear the school asks for, often shorts or leggings and a school t-shirt" },
          { k: "bottle", t: "A named water bottle and a bag that's just for dance" },
          { k: "wait", t: "Hold off on hard shoes, wigs and dresses until the teacher says", tip: "Lots of families buy too early. Second-hand is very common for all of these." }
        ]},
        { title: "Get settled", items: [
          { k: "name", t: "Write your dancer's name inside both shoes" },
          { k: "prac", t: "Agree a little home practice routine, even 10 minutes a few times a week" },
          { k: "buddy", t: "Find a 'been there' parent at the school you can text questions to" },
          { k: "app", t: "Add your dancer in this app's score tracker so you're ready for results" }
        ]}
      ]
    },
    {
      id: "enter", name: "Entering a feis", icon: "📝",
      blurb: "Two to six weeks out. Picking a feis and getting the entry right.",
      sections: [
        { title: "Choose and enter", items: [
          { k: "ok", t: "Check with the teacher that your dancer is ready and which feis to go to" },
          { k: "syl", t: "Read the syllabus", tip: "It lists the competitions by number, the age groups, the fees, the entry deadline and any special rules." },
          { k: "age", t: "Work out your dancer's competition age", tip: "Most feiseanna use the dancer's age on January 1 of the year, not their age on the day." },
          { k: "comps", t: "Enter only the dances and level the teacher approved" },
          { k: "deadline", t: "Register before the deadline", tip: "For a regular feis you register your dancer yourself, usually online, after checking with the teacher. Late entries often cost extra, and some feiseanna cap entries or close early." },
          { k: "confirm", t: "Save the confirmation email and any competitor number" }
        ]},
        { title: "Plan the day", items: [
          { k: "where", t: "Look up the venue, parking and drive time" },
          { k: "sched", t: "Watch for the stage schedule, often posted a few days before", tip: "Screenshot it. Wi-Fi at venues can be poor." },
          { k: "hotel", t: "Book a hotel early if it's far away" },
          { k: "costume", t: "Confirm what to wear with the school: class costume, skirt and top, or school outfit" },
          { k: "ride", t: "Make a plan for siblings and who's driving" }
        ]},
        { title: "The week before", items: [
          { k: "fit", t: "Try on the whole outfit, shoes included, in case your dancer has grown" },
          { k: "shoes", t: "Clean and check shoes: laces, straps and buckles" },
          { k: "hair", t: "Do a practice run of the competition hair or wig", tip: "Wig and bun pins take practice. A trial run saves a stressful morning." },
          { k: "rest", t: "Ask the teacher whether to practice right up to the day or ease off" },
          { k: "sleep", t: "Protect sleep the last two nights" }
        ]}
      ]
    },
    {
      id: "bag", name: "Pack the feis bag", icon: "🎒",
      blurb: "The packing list. Pack the night before and keep this list in the bag.",
      sections: [
        { title: "Shoes and socks", items: [
          { k: "soft", t: "Soft shoes" },
          { k: "hard", t: "Hard shoes (if your dancer dances them)" },
          { k: "socks", t: "Poodle socks or tights, plus a spare pair", tip: "Socks get dirty and laddered tights happen. Keep a clean pair in a zip bag." },
          { k: "glue", t: "Sock glue, in a sealed bag so it can't leak" },
          { k: "laces", t: "Spare laces, plus a spare buckle or strap for hard shoes" },
          { k: "tape", t: "Electrical tape and sports tape", tip: "Used to secure laces and straps, and to fix almost anything in a hurry." },
          { k: "grip", t: "Something for slippery stages (ask the teacher what's allowed)" },
          { k: "marker", t: "A black marker to touch up scuffs on hard shoes" },
          { k: "flats", t: "Comfortable shoes or slides for walking around between dances" }
        ]},
        { title: "Costume and number", items: [
          { k: "costume", t: "Costume or school outfit, on a hanger in a garment bag" },
          { k: "under", t: "Dance briefs, bloomers or shorts, and a spare" },
          { k: "cover", t: "A cover-up or zip jacket to wear over the costume" },
          { k: "pins", t: "Safety pins or number clips for the competitor number" },
          { k: "num", t: "The competitor number, if you got it ahead of time" },
          { k: "crown", t: "Headpiece, tiara or brooch, if your dancer wears one" }
        ]},
        { title: "Hair, wig and makeup", items: [
          { k: "wig", t: "Wig or bun wig, in its box or a bag so curls don't crush" },
          { k: "bobby", t: "Lots of hair pins and wig grips" },
          { k: "bands", t: "Hair ties and a headband for the wig" },
          { k: "spray", t: "Hairspray and a brush" },
          { k: "makeup", t: "Makeup and tan, only if allowed for your dancer's age and level", tip: "Rules on makeup and tan depend on the organization and the dancer's age. Check the Rules section." },
          { k: "wipes", t: "Baby wipes and makeup wipes" }
        ]},
        { title: "Fix-it kit", items: [
          { k: "sew", t: "Needle, thread and small scissors" },
          { k: "crystal", t: "Spare crystals and glue, sealed in their own bag" },
          { k: "stain", t: "A stain pen" },
          { k: "zips", t: "Zip-top bags to keep everything sorted and dry" }
        ]},
        { title: "First aid and comfort", items: [
          { k: "plasters", t: "Plasters (band-aids) and blister pads" },
          { k: "meds", t: "Pain relief and any regular medicine your dancer needs" },
          { k: "ice", t: "An instant ice pack" },
          { k: "deo", t: "Deodorant (the thing everyone forgets)" },
          { k: "tissue", t: "Tissues and hand sanitizer" },
          { k: "warm", t: "A warm layer and a blanket; halls can be cold" },
          { k: "fun", t: "A book, cards or something quiet to pass the waiting time" }
        ]},
        { title: "Food and drink", items: [
          { k: "water", t: "Plenty of water, plus a sports drink for long days" },
          { k: "snacks", t: "Snacks that won't stain or crumble on the costume", tip: "Think bananas, crackers, cereal bars, pretzels. Skip anything red, orange or sticky near the costume." },
          { k: "lunch", t: "A packed lunch; venue food lines can be long" },
          { k: "allergy", t: "Any allergy needs covered, since feis food is limited" },
          { k: "coffee", t: "Coffee or snacks for you too" }
        ]},
        { title: "Phone and paperwork", items: [
          { k: "sched", t: "Stage schedule screenshot and entry confirmation" },
          { k: "charge", t: "A charged phone and a power bank" },
          { k: "cash", t: "Some cash for parking, programs, raffles or vendors" },
          { k: "pen", t: "A pen and the teacher's phone number" }
        ]}
      ]
    },
    {
      id: "day", name: "Feis day", icon: "☘️",
      blurb: "Step by step, from the parking lot to the car ride home.",
      sections: [
        { title: "Morning", items: [
          { k: "breakfast", t: "A good breakfast before the costume goes on" },
          { k: "hairfirst", t: "Hair, wig and any makeup done before leaving, or allow extra time at the venue" },
          { k: "early", t: "Arrive at least 45 minutes before your first competition", tip: "Stages can run early, and parking and check-in take longer than you'd think." }
        ]},
        { title: "At the venue", items: [
          { k: "checkin", t: "Check in at the registration desk and collect the competitor number" },
          { k: "number", t: "Pin the number on the front where the judge can see it" },
          { k: "stage", t: "Find your dancer's stage and check which competition it's on now" },
          { k: "camp", t: "Set up a base near the school's group, without blocking walkways" },
          { k: "teacher", t: "Let the teacher know you've arrived" },
          { k: "warm", t: "Warm up: gentle moving, skips and pointing feet, not long stretches on a cold floor" }
        ]},
        { title: "Before each dance", items: [
          { k: "side", t: "Get to side stage when the competition before yours starts", tip: "If your dancer misses their turn, the competition usually won't wait." },
          { k: "check", t: "Quick check: shoes tied and taped, socks up, number straight, wig secure" },
          { k: "calm", t: "Keep it short and positive. One focus point, then a hug" },
          { k: "watch", t: "Watch, cheer, and don't film unless the feis allows it" }
        ]},
        { title: "After dancing", items: [
          { k: "next", t: "Check the next competition time and stage" },
          { k: "change", t: "Cover up the costume to eat and drink" },
          { k: "results", t: "Find out where results are posted or announced", tip: "Results may go up on a board, be read out at awards, or appear online. Some feiseanna also give out comment sheets." },
          { k: "photo", t: "Photograph the results and any comment sheets" },
          { k: "track", t: "Add the results to the score tracker in this app" }
        ]},
        { title: "The ride home", items: [
          { k: "proud", t: "Start with 'I loved watching you dance'" },
          { k: "listen", t: "Let your dancer talk first; save feedback for another day" },
          { k: "judge", t: "Don't pick apart the judging", tip: "Each judge sees things a little differently. If you have questions, ask the teacher privately later." },
          { k: "teach", t: "Share the results and comment sheets with the teacher" },
          { k: "unpack", t: "Unpack, air out shoes and hang up the costume that night" }
        ]}
      ]
    },
    {
      id: "manners", name: "Feis manners", icon: "🤝",
      blurb: "The unwritten rules. Good habits that other families will notice.",
      sections: [
        { title: "Around the hall", items: [
          { k: "seats", t: "Don't save rows of seats or spread bags across chairs" },
          { k: "walk", t: "Keep doorways, stairs and side stage clear" },
          { k: "cross", t: "Never walk in front of a stage while a dancer is on it" },
          { k: "quiet", t: "Keep voices down near the stages" },
          { k: "video", t: "Follow the feis's photo and video rules", tip: "Most competitions ban filming dancers on stage to protect children and choreography." },
          { k: "tidy", t: "Clean up your spot before you leave" }
        ]},
        { title: "Being a good sport", items: [
          { k: "clap", t: "Clap for every dancer, not just your school's" },
          { k: "win", t: "Celebrate wins warmly but not loudly; the child beside you may be heartbroken" },
          { k: "online", t: "Never criticize judges, dancers or other schools, including online" },
          { k: "judges", t: "Never approach a judge about a result", tip: "Questions about marks go to your teacher. Organizations have their own process for formal concerns." },
          { k: "thanks", t: "Thank the volunteers, musicians and stage helpers" },
          { k: "welcome", t: "Help the family who looks lost; you were new once too" }
        ]}
      ]
    },
    {
      id: "solo", name: "Moving up and solo dress", icon: "👗",
      blurb: "When your dancer moves up a level and the bigger costume questions start.",
      sections: [
        { title: "Before you buy", items: [
          { k: "rules", t: "Check the rules for when a solo dress, wig and makeup are allowed", tip: "It depends on your organization, region and level. Some beginner levels don't allow them at all." },
          { k: "teacher", t: "Talk to the teacher before ordering anything" },
          { k: "budget", t: "Set a budget, and decide new or second-hand", tip: "Second-hand dresses are very common and keep their value. Many sell again later." },
          { k: "time", t: "For a new made-to-order dress, allow several months" },
          { k: "try", t: "Try second-hand dresses on in person, or get a return window if buying online" }
        ]},
        { title: "When it arrives", items: [
          { k: "fit", t: "Check the fit with the teacher, and ask about room to grow" },
          { k: "length", t: "Check skirt length so it can't catch on kicks" },
          { k: "store", t: "Store it hung up in a breathable garment bag, away from sunlight" },
          { k: "wig", t: "Buy a wig that matches your dancer's hair color, and learn to pin it" },
          { k: "tan", t: "If tan is used, do a test run well before a feis" }
        ]},
        { title: "Moving up", items: [
          { k: "move", t: "Learn your organization's moving-up rules for each dance" },
          { k: "levels", t: "Update your dancer's levels in the score tracker" },
          { k: "fees", t: "Expect higher entry fees and longer days at higher levels" },
          { k: "shoes", t: "Check shoe size every few months while your dancer is growing" }
        ]}
      ]
    },
    {
      id: "champ", name: "Championship season", icon: "🏆",
      blurb: "Oireachtas, regionals and nationals. Bigger events with more planning.",
      sections: [
        { title: "Months before", items: [
          { k: "elig", t: "Confirm your dancer is eligible and how entries are made", tip: "In CLRG, the teacher (TCRG) registers dancers for majors like the Oireachtas, Nationals and Worlds, not the parent. Make sure they have everything they need from you in time." },
          { k: "hotel", t: "Book the hotel as soon as the venue is announced" },
          { k: "time", t: "Ask for time off work and school if needed" },
          { k: "learn", t: "Learn how recalls and qualifying places work for this event" },
          { k: "costs", t: "Budget for entry, travel, hotel, food, extra lessons and costume care" }
        ]},
        { title: "Weeks before", items: [
          { k: "sched", t: "Find your dancer's day and approximate time" },
          { k: "costume", t: "Get the dress cleaned, crystals checked and any repairs done" },
          { k: "wig", t: "Book wig styling or tan appointments if you use them" },
          { k: "shoes", t: "Make sure shoes are broken in, not brand new" },
          { k: "extra", t: "Keep up extra classes or workshops the school offers" }
        ]},
        { title: "At the event", items: [
          { k: "food", t: "Pack enough food and drink for a long day" },
          { k: "rest", t: "Plan rest between rounds: feet up, quiet, away from the crowd" },
          { k: "recall", t: "Know where and when recalls are posted" },
          { k: "results", t: "Save the results link so you can follow the rounds" },
          { k: "track", t: "Record each round and the overall result in the score tracker", tip: "Each round placing is from one judge. The overall result is from the whole panel." }
        ]},
        { title: "Whatever happens", items: [
          { k: "proud", t: "Tell your dancer you're proud of the work they put in" },
          { k: "talk", t: "Let the teacher explain results; ask privately if you have questions" },
          { k: "plan", t: "Talk about goals for next season after a few days off" }
        ]}
      ]
    },
    {
      id: "major", name: "Traveling to a major", icon: "✈️",
      blurb: "Nationals, Worlds or any big trip away from home.",
      sections: [
        { title: "Well ahead", items: [
          { k: "pass", t: "Check passports and visas, and check expiry dates" },
          { k: "insure", t: "Get travel insurance that covers the costume and luggage" },
          { k: "book", t: "Book flights and the hotel early; host cities fill up" },
          { k: "near", t: "Stay close to the venue if you can, to make rest breaks easy" }
        ]},
        { title: "Packing", items: [
          { k: "carry", t: "Carry the dress, shoes and wig in hand luggage, never checked", tip: "If a suitcase goes missing, you can replace clothes but not a solo dress the day before." },
          { k: "spares", t: "Double up on spares: socks, glue, pins, laces, tape" },
          { k: "liquids", t: "Pack tan, hairspray and glue to fit airline liquid rules, or buy at the venue" },
          { k: "plug", t: "A plug adapter for hair tools and chargers" },
          { k: "medic", t: "Any regular medicine in hand luggage" }
        ]},
        { title: "When you get there", items: [
          { k: "jet", t: "Plan around jet lag; arrive a few days early if you can" },
          { k: "venue", t: "Visit the venue ahead of the day to find stages and changing rooms" },
          { k: "practice", t: "Ask the teacher about practice space and timing" },
          { k: "routine", t: "Keep meals and sleep as normal as possible" },
          { k: "fun", t: "Plan something fun for after, whatever the result" }
        ]}
      ]
    }
  ]
  ,
  // Judges' comment themes and practice tips. Words are matched in lower case.
  // Tips are general practice ideas, not medical advice: the screen tells parents to check with the teacher.
  commentThemes: [
    { id: "turnout", name: "Turnout", icon: "🦶",
      words: ["turnout", "turn out", "turned out", "turn-out", "t/o", "feet turned", "turn your feet", "rotation"],
      why: "Judges want feet and knees turned out from the hips, not twisted from the knees.",
      tips: [
        "Clamshells: lie on one side, knees bent, and open the top knee like a book. 2 sets of 10 each side.",
        "Turnout check in front of a mirror: stand in first position and look at the knees. They should point the same way as the toes.",
        "Practice threes and sevens slowly, watching that the heels lead forward and the toes stay out."
      ] },
    { id: "toes", name: "Pointed toes", icon: "🩰",
      words: ["point", "pointed", "toes", "toe", "feet not pointed", "sickle", "sickled"],
      why: "A strong point makes every kick and lift look finished.",
      tips: [
        "Point and flex: sitting with legs out straight, point and flex both feet slowly. 2 sets of 15.",
        "Towel scrunches: scrunch a towel toward you with the toes to build foot strength.",
        "Film a kick at slow speed and check the foot is pointed at the top of every kick."
      ] },
    { id: "ontoes", name: "Stay up on toes", icon: "⬆️",
      words: ["on toes", "on your toes", "up on toes", "balls of", "heels down", "dropping heels", "drop heels", "heels touching", "on ball", "flat"],
      why: "In soft shoe, dancers should stay high on the balls of the feet, with heels off the floor.",
      tips: [
        "Calf raises: rise up and down slowly on both feet, then one foot. 2 sets of 15.",
        "Hold a balance up on the toes for 20 seconds, then 30, holding the counter for help at first.",
        "Mark through the reel or light jig slowly, only on the balls of the feet."
      ] },
    { id: "cross", name: "Crossing", icon: "❌",
      words: ["cross", "crossed", "crossing", "cross your feet", "uncrossed", "not crossed"],
      why: "Feet should cross tightly at the ankles and knees, so there is no daylight between the legs.",
      tips: [
        "Stand in a tight fifth position with legs crossed and hold for 30 seconds, squeezing the inner thighs together.",
        "Hold a sheet of paper between the knees during slow practice of a step, so it doesn't drop.",
        "Check crossing in the mirror on every landing, not just the starting position."
      ] },
    { id: "height", name: "Height and lift", icon: "🦘",
      words: ["height", "elevation", "lift", "higher", "jump", "leaps", "leap", "get up", "more air", "kick higher"],
      why: "Judges look for height on leaps and strong, high kicks.",
      tips: [
        "Skipping rope: 3 short rounds of 1 minute, staying on the toes.",
        "Gentle hamstring stretch after practice (never before warming up): sit, legs straight, reach toward the toes and hold 20 seconds.",
        "Practice leaps over a low, soft object to aim for height, not distance."
      ] },
    { id: "timing", name: "Timing", icon: "🎵",
      words: ["timing", "rhythm", "beat", "rush", "rushing", "rushed", "behind the music", "ahead of the music", "off time"],
      why: "Steps need to land exactly with the music, without rushing or falling behind.",
      tips: [
        "Clap the rhythm of each step along with the music before dancing it.",
        "Practice with a metronome or practice music at a slower speed, then build up.",
        "Count out loud while marking the steps, so the counts match the beats."
      ] },
    { id: "posture", name: "Posture and arms", icon: "🧍",
      words: ["posture", "arms", "arm", "shoulders", "shoulder", "hands", "fists", "back straight", "stand tall", "lean", "leaning", "head up", "chin", "upper body", "carriage", "hunch"],
      why: "Irish dance needs a still, tall upper body with arms close to the sides.",
      tips: [
        "Wall check: stand with heels, back and head touching a wall for 30 seconds to feel tall posture.",
        "Plank: 3 holds of 20 to 30 seconds to build the core that keeps the upper body still.",
        "Dance one step holding a light scarf in each hand, pressed to the sides, to stop arms swinging."
      ] },
    { id: "knees", name: "Straight knees", icon: "🦵",
      words: ["knee", "knees", "bent", "straight legs", "straighten", "legs straight", "soft knees"],
      why: "Legs should be straight on kicks and landings unless the step asks for a bend.",
      tips: [
        "Straight leg raises: lie on your back and lift one straight leg slowly. 2 sets of 10 each side.",
        "Practice kicks slowly at the barre or a counter, checking the knee locks straight each time.",
        "Film a step side-on and look for bent knees on landings."
      ] },
    { id: "sound", name: "Clean sounds (hard shoe)", icon: "🔊",
      words: ["sound", "sounds", "clarity", "beats", "trebles", "treble", "clicks", "click", "louder", "quiet", "muffled", "rhythm in feet", "drums"],
      why: "In hard shoe, every beat should be heard clearly and evenly.",
      tips: [
        "Practice trebles slowly on a hard floor, listening for each separate sound.",
        "Record the hard shoe step on a phone and listen back without watching.",
        "Do drills of 8 trebles on each foot, staying even before going faster."
      ] },
    { id: "travel", name: "Travel and stage use", icon: "🧭",
      words: ["travel", "travelling", "traveling", "use the stage", "cover the stage", "cramped", "move more"],
      why: "Judges like to see the dancer use the whole stage with confident travel.",
      tips: [
        "Mark out the stage size at home with tape and practice covering it.",
        "Pick a spot to travel to before each step starts.",
        "Ask the teacher which steps should travel more, and practice those sections."
      ] },
    { id: "stamina", name: "Stamina", icon: "💪",
      words: ["stamina", "tired", "tiring", "faded", "fade", "energy", "ran out", "finish strong", "second step"],
      why: "The last step should look as strong as the first.",
      tips: [
        "Dance the full step twice through with no break, once or twice a week.",
        "Short bursts of skipping or running, with rests, build stamina safely.",
        "Rest days, sleep, water and a snack before dancing all matter too."
      ] },
    { id: "presentation", name: "Presentation and confidence", icon: "🌟",
      words: ["presentation", "confidence", "confident", "smile", "performance", "perform", "stage presence", "nervous", "expression", "sell it", "bow"],
      why: "A confident start, finish and bow help judges enjoy the whole dance.",
      tips: [
        "Practice the bow and walk on and off as part of every run-through.",
        "Dance for family as an 'audience' at home to get used to being watched.",
        "Pick one thing to focus on before each dance, rather than everything at once."
      ] }
  ]

};
