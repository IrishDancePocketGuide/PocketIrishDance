// All app content lives here, so it can be edited without touching the screens.
// Anything marked check: true is a draft that still needs Shannon's (or a teacher's) review.

window.PID_DATA = {
  version: "0.2 draft",

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
      link: "https://www.clrg.ie"
    },
    {
      id: "nafc",
      name: "North American Feis Commission",
      fullName: "North American Feis Commission",
      active: true,
      partOf: "CLRG",
      where: "United States, Canada and Mexico.",
      summary: "Not a separate organization from CLRG. It writes the feis rules for CLRG competitions in North America, including the level names and how dancers move up.",
      teachers: "Same as CLRG",
      majors: "Sets the rules for local feiseanna"
    },
    {
      id: "idtana",
      name: "IDTANA",
      fullName: "Irish Dance Teachers' Association of North America",
      active: true,
      partOf: "CLRG",
      where: "United States, Canada and Mexico.",
      summary: "The association of CLRG teachers in North America. Its regions run the regional Oireachtas championships each year.",
      teachers: "Members are CLRG-qualified teachers",
      majors: "Regional Oireachtas events in North America"
    },
    {
      id: "comhdhail",
      name: "An Comhdháil",
      fullName: "An Comhdháil Múinteoirí Rince Gaelacha",
      say: "un KOH-loy",
      active: true, pick: true,
      where: "Mainly Ireland, with schools in Great Britain and elsewhere.",
      summary: "The second-largest Irish dance organization, with its own teachers, rules and championships. Its words, levels and rules are being added to the app.",
      link: "https://www.irishdancingorg.com",
      check: true
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
      rulesLink: "https://www.irish.dance/competition-rules"
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
    { id: "prelim", name: "Preliminary Championship", shoe: "champ" },
    { id: "open", name: "Open Championship", shoe: "champ" }
  ],

  // CLRG in North America. Confirmed by Shannon on Nov 23: Beginner 1 / Beginner 2 names,
  // the moving-up placings, and moving up one dance at a time at the lower levels.
  levels: [
    {
      org: "clrg", id: "b1", order: 1, name: "Beginner 1", alt: "sometimes called First Feis",
      danced: "Reel, light jig, often single jig and slip jig",
      moveUp: "Place 1st, 2nd or 3rd in a dance, then move up in that dance",
      moveUpPlace: 3, perDance: true,
      parents: "School costume or a simple outfit, soft shoes only"
    },
    {
      org: "clrg", id: "b2", order: 2, name: "Beginner 2", alt: "also called Advanced Beginner",
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
      danced: "Two or three rounds: soft shoe, hard shoe, often a set. Judged by a panel.",
      moveUp: "Win twice, or meet your region's rules",
      perDance: false, check: true,
      parents: "Recalls and Oireachtas qualification come into play"
    },
    {
      org: "clrg", id: "oc", order: 6, name: "Open Championship",
      danced: "Three rounds, panel of judges. The path to Nationals, All-Irelands and Worlds.",
      moveUp: "The top level",
      perDance: false,
      parents: "The highest costs and the most travel"
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
      parents: "Qualifying for Worlds starts at your National Oireachtas the year before"
    }
  ],

  glossaryGroups: [
    { id: "events", name: "Competitions" },
    { id: "dance", name: "Dances, shoes & costume" },
    { id: "people", name: "People & organizations" }
  ],

  glossary: [
    // Competitions and events
    { g: "events", term: "Feis", say: "fesh", means: "A local Irish dance competition, usually one day", why: "Most of your weekends will revolve around these" },
    { g: "events", term: "Feiseanna", say: "FESH-uh-nuh", means: "Plural of feis", why: "You'll see it on calendars and registration sites" },
    { g: "events", term: "Oireachtas", say: "oh-ROCK-tus", means: "The regional championship, held once a year", why: "Qualifying dancers compete for places at Nationals and Worlds" },
    { g: "events", term: "Nationals", means: "National championship (for example North American Nationals or the Great Britain Championships)", why: "Usually needs a qualifying result for championship dancers" },
    { g: "events", term: "All-Irelands", means: "The All-Ireland Championships, held in Ireland", why: "A major championship open to dancers from abroad" },
    { g: "events", orgs: ["clrg"], term: "Worlds", alt: "Oireachtas Rince na Cruinne", say: "oh-ROCK-tus RIN-kuh nuh KRIN-yuh", means: "The CLRG World Championships", why: "Qualification only, usually through a regional or national event" },
    { g: "events", term: "Grades", alt: "grade competitions", means: "All the levels below championship (Beginner 1, Beginner 2, Novice, Open Prizewinner). Each dance is its own competition, split by level and age", why: "Where most dancers spend their first years. Not the same as grade exams" },
    { g: "events", term: "Championship", means: "Prelim and Open competitions, danced in rounds and judged by a panel", why: "Brings recalls, marks and placements to more dancers" },
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

    // Dances, shoes and costume
    { g: "dance", term: "Soft shoe", means: "Light, lace-up dances: reel, light jig, slip jig, single jig", why: "The first dances most beginners learn" },
    { g: "dance", term: "Hard shoe", alt: "heavy shoe", means: "Dances in shoes with fiberglass tips and heels that make rhythm: treble jig, hornpipe, treble reel", why: "A second pair of shoes, usually bought a bit later" },
    { g: "dance", term: "Ghillies", say: "GILL-eez", means: "Soft, laced shoes worn by girls and women", why: "Need replacing as feet grow; check the fit with the teacher" },
    { g: "dance", term: "Reel shoes", means: "Soft shoes for boys, like a jazz shoe with a heel that clicks", why: "The boys' equivalent of ghillies" },
    { g: "dance", term: "Reel", means: "A fast soft shoe dance in 2/4 or 4/4 time", why: "Usually the first competition dance" },
    { g: "dance", term: "Light jig", means: "A quick soft shoe dance in 6/8", why: "Often danced at beginner levels" },
    { g: "dance", term: "Slip jig", means: "A graceful soft shoe dance in 9/8", why: "Mostly danced by girls", check: true },
    { g: "dance", term: "Single jig", alt: "hop jig", means: "A soft shoe jig in 6/8 or 12/8", why: "Whether it's offered varies by region" },
    { g: "dance", term: "Treble jig", say: "TREB-ul", means: "A slow, heavy shoe jig", why: "A core hard shoe dance" },
    { g: "dance", term: "Hornpipe", means: "A heavy shoe dance in 2/4 or 4/4", why: "A core hard shoe dance" },
    { g: "dance", term: "Set dance", alt: "traditional set", means: "A set piece of music and steps, traditional or contemporary", why: "Appears from the middle levels upward" },
    { g: "dance", term: "Steps", means: "Short choreographed sections of a dance, each about 8 bars a side", why: "Teachers give new steps as dancers move up" },
    { g: "dance", term: "School costume", means: "The dress or outfit in your school's colors", why: "Usually worn until a dancer moves into a solo dress" },
    { g: "dance", term: "Solo dress", means: "A dancer's own competition dress", why: "One of the biggest costs; rules govern when it's allowed" },
    { g: "dance", term: "Wig", means: "A curled wig worn in competition, usually by girls", why: "Often from the middle levels; check age and level rules" },
    { g: "dance", term: "Poodle socks", means: "Long white ribbed socks", why: "Held up with sock glue" },
    { g: "dance", term: "Sock glue", means: "Roll-on adhesive that keeps socks in place", why: "Bring it to every feis" },
    { g: "dance", term: "Tan", means: "Spray or bottled tan for legs", why: "Rules on makeup and tan vary by age and level", check: true },

    // People and organizations
    { g: "people", orgs: ["clrg"], term: "CLRG", alt: "An Coimisiún", say: "un KUM-ish-oon", means: "An Coimisiún le Rincí Gaelacha, the largest Irish dance organization, based in Dublin", why: "Sets the rules your dancer competes under" },
    { g: "people", orgs: ["clrg"], term: "TCRG", means: "A certified CLRG teacher", why: "Only a TCRG can enter dancers in CLRG competitions" },
    { g: "people", orgs: ["clrg"], term: "ADCRG", means: "A certified CLRG adjudicator (judge)", why: "The people scoring your dancer" },
    { g: "people", orgs: ["clrg"], term: "SDCRG", means: "A certified CLRG examiner", why: "Mostly relevant to teachers", check: true },
    { g: "people", term: "Adjudicator", means: "A judge", why: "Championships use panels of three or more" },
    { g: "people", orgs: ["clrg"], term: "Region", means: "A geographic area under CLRG with its own regional body and Oireachtas", why: "Your region decides your Oireachtas and some local rules" },
    { g: "people", orgs: ["clrg"], term: "IDTANA", means: "Irish Dance Teachers' Association of North America, the body for CLRG teachers in North America", why: "Its regions run the North American Oireachtas events" },
    { g: "people", orgs: ["clrg"], term: "North American Feis Commission", means: "Sets feis rules for CLRG competitions in North America", why: "Its rules define levels and moving up in the US, Canada and Mexico" },
    { g: "people", orgs: ["clrg"], term: "Grade exam", alt: "Grád", say: "grawd", means: "Optional CLRG exams in dance skills and knowledge", why: "Some schools encourage them; separate from competitions" },
    { g: "events", orgs: ["wida"], term: "Premiership", means: "A WIDA competition where a dancer does two dances and the scores are added together (for example reel and light jig)", why: "Your dancer can enter one premiership per feis, at the grade they're in for most of their dances" },
    { g: "events", orgs: ["wida"], term: "Jump 2-3", means: "A first competition for the youngest WIDA dancers: 16 jump 2-3s or promenade steps", why: "From 2027 it's for under-7s only" },
    { g: "events", orgs: ["wida"], term: "Yafers", means: "The online system used to enter every WIDA feis", why: "Entries are non-refundable once paid" },
    { g: "dance", orgs: ["wida"], term: "Modern set", means: "A set dance to modern music, used as a third round in WIDA Open Championships", why: "Only recalled dancers dance it" },
    { g: "people", orgs: ["wida"], term: "TMRF", means: "A WIDA teacher qualification", why: "Teachers with only TMRF can still compete themselves" },
    { g: "people", term: "Feis committee", means: "The volunteers running a particular feis", why: "Contact them about entries, schedules and results" }
  ],

  // Rules library. These are DRAFT examples to show how the library will work.
  // Real entries will be written from the official rulebooks Shannon sends.
  rules: [
    {
      q: "How does my dancer move up from Beginner 1?",
      a: "By placing 1st, 2nd or 3rd in a dance. They move up in that dance only, so a dancer can be Beginner 2 in reel and still Beginner 1 in light jig.",
      orgId: "clrg", levels: ["b1"], regions: ["United States", "Canada", "Mexico"], org: "North American Feis Commission", topic: "Moving up"
    },
    {
      q: "How does my dancer move up from Beginner 2?",
      a: "By placing 1st, 2nd or 3rd in a dance. Again, this is one dance at a time.",
      orgId: "clrg", levels: ["b2"], regions: ["United States", "Canada", "Mexico"], org: "North American Feis Commission", topic: "Moving up"
    },
    {
      q: "How does my dancer move up from Novice?",
      a: "By placing 1st or 2nd in a dance, one dance at a time.",
      orgId: "clrg", levels: ["novice"], regions: ["United States", "Canada", "Mexico"], org: "North American Feis Commission", topic: "Moving up"
    },
    {
      q: "How does my dancer move up from Open Prizewinner?",
      a: "By winning 1st place in a dance. Once a dancer has moved up in enough dances, they can start dancing Preliminary Championship.",
      orgId: "clrg", levels: ["pw"], regions: ["United States", "Canada", "Mexico"], org: "North American Feis Commission", topic: "Moving up", check: true
    },
    {
      q: "When does my dancer need hard shoes?",
      a: "Usually at Beginner 2, when treble jig and hornpipe are added. Ask your teacher before buying, because fit matters and they may suggest a brand.",
      orgId: "clrg", levels: ["b1", "b2"], regions: [], org: "CLRG", topic: "Shoes and costume"
    },
    {
      q: "Can my daughter wear a wig or a solo dress at the lower levels?",
      a: "There are rules about costume, wigs and makeup at the beginner levels, and they change often. This answer will be filled in from the current rulebook.",
      orgId: "clrg", levels: ["b1", "b2", "novice"], regions: [], org: "CLRG", topic: "Shoes and costume", check: true
    },
    {
      q: "Who is allowed to enter my dancer in a CLRG feis?",
      a: "A CLRG-registered teacher (TCRG). Registration normally goes through your school, so ask your teacher before you sign up for a feis.",
      orgId: "clrg", levels: [], regions: [], org: "CLRG", topic: "Entering competitions"
    },
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
      a: "Your dancer can keep competing straight away, with no ban. The new teacher tells the old teacher in writing. Your dancer can't use the old school's steps (except traditional sets), so they compete once they've learned the new school's steps." }
  ],

  checklists: [
    {
      id: "started", name: "Just started",
      items: [
        "Find out which organization your school belongs to (ask: is your teacher a TCRG?)",
        "Ask what level your dancer starts at and which dances they're learning",
        "Buy soft shoes (ghillies or reel shoes) with your teacher's advice on fit",
        "Join the school's parent group or mailing list",
        "Ask when the school expects dancers to try their first feis",
        "Set up your dancer's profile in this app"
      ]
    },
    {
      id: "firstfeis", name: "First feis",
      items: [
        "Check with your teacher that your dancer is ready and which dances to enter",
        "Read the feis syllabus: competitions, age group and fees",
        "Register before the deadline (usually through an online feis registration site)",
        "Plan the outfit your school uses for beginners",
        "Pack: shoes, poodle socks, sock glue, safety pins for the number, water, snacks",
        "Arrive early and pick up the competitor number",
        "Find your dancer's stage in the program",
        "Photograph the results and add them to the score tracker"
      ]
    },
    {
      id: "solodress", name: "First solo dress",
      items: [
        "Check the current rules on when a solo dress is allowed at your dancer's level",
        "Ask your teacher before ordering; many schools have guidance on styles and makers",
        "Decide new versus second-hand and set a budget",
        "Allow plenty of time for a made-to-order dress",
        "Ask about wig, tan and makeup rules for that level and age"
      ]
    },
    {
      id: "oireachtas", name: "Oireachtas season",
      items: [
        "Confirm your dancer is eligible and entered through the school",
        "Book travel and a hotel early; they fill up fast",
        "Check the schedule for your dancer's competition day and time",
        "Plan costume, wig and tan for the day",
        "Learn how recalls and qualifying places work",
        "Record the result and any recall in the score tracker"
      ]
    },
    {
      id: "major", name: "Traveling to a major",
      items: [
        "Check passports and visas well ahead for travel abroad",
        "Carry the dress, shoes and wig in hand luggage",
        "Pack spares: socks, sock glue, hair pins, safety pins, laces",
        "Note the time difference for practice and rest",
        "Save the results website so you can follow other rounds"
      ]
    }
  ]
};
