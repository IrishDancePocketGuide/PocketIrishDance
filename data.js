// All app content lives here, so it can be edited without touching the screens.
// Anything marked check: true is a draft that still needs Shannon's (or a teacher's) review.

window.PID_DATA = {
  version: "0.1 draft",

  organizations: [
    {
      id: "clrg",
      name: "CLRG",
      fullName: "An Coimisiún le Rincí Gaelacha",
      say: "un KUM-ish-oon le RIN-kee GAY-luh-kuh",
      active: true,
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
      active: false,
      where: "Mainly Ireland, with schools in Great Britain and elsewhere.",
      summary: "The second-largest Irish dance organization, with its own teachers, rules and championships. Coming in a later version of the app.",
      link: "https://www.irishdancingorg.com",
      check: true
    },
    {
      id: "wida",
      name: "WIDA",
      fullName: "World Irish Dance Association",
      active: false,
      where: "Mainly mainland Europe, with members in other countries.",
      summary: "An independent organization known for competitions open to dancers from different schools and organizations. Coming in a later version of the app.",
      check: true
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
      id: "b1", order: 1, name: "Beginner 1", alt: "sometimes called First Feis",
      danced: "Reel, light jig, often single jig and slip jig",
      moveUp: "Place 1st, 2nd or 3rd in a dance, then move up in that dance",
      moveUpPlace: 3, perDance: true,
      parents: "School costume or a simple outfit, soft shoes only"
    },
    {
      id: "b2", order: 2, name: "Beginner 2", alt: "also called Advanced Beginner",
      danced: "Soft shoe dances plus treble jig and hornpipe",
      moveUp: "Place 1st, 2nd or 3rd in a dance",
      moveUpPlace: 3, perDance: true,
      parents: "Hard shoes are usually bought around here"
    },
    {
      id: "novice", order: 3, name: "Novice",
      danced: "All the main dances, plus a traditional set at some feiseanna",
      moveUp: "Place 1st or 2nd in a dance",
      moveUpPlace: 2, perDance: true,
      parents: "Solo dress and wig rules start to matter"
    },
    {
      id: "pw", order: 4, name: "Open Prizewinner",
      danced: "Same dances, with more advanced steps",
      moveUp: "Win 1st in a dance",
      moveUpPlace: 1, perDance: true,
      parents: "Often the last stage before championships"
    },
    {
      id: "pc", order: 5, name: "Preliminary Championship",
      danced: "Two or three rounds: soft shoe, hard shoe, often a set. Judged by a panel.",
      moveUp: "Win twice, or meet your region's rules",
      perDance: false, check: true,
      parents: "Recalls and Oireachtas qualification come into play"
    },
    {
      id: "oc", order: 6, name: "Open Championship",
      danced: "Three rounds, panel of judges. The path to Nationals, All-Irelands and Worlds.",
      moveUp: "The top level",
      perDance: false,
      parents: "The highest costs and the most travel"
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
    { g: "events", term: "Worlds", alt: "Oireachtas Rince na Cruinne", say: "oh-ROCK-tus RIN-kuh nuh KRIN-yuh", means: "The CLRG World Championships", why: "Qualification only, usually through a regional or national event" },
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
    { g: "people", term: "CLRG", alt: "An Coimisiún", say: "un KUM-ish-oon", means: "An Coimisiún le Rincí Gaelacha, the largest Irish dance organization, based in Dublin", why: "Sets the rules your dancer competes under" },
    { g: "people", term: "TCRG", means: "A certified CLRG teacher", why: "Only a TCRG can enter dancers in CLRG competitions" },
    { g: "people", term: "ADCRG", means: "A certified CLRG adjudicator (judge)", why: "The people scoring your dancer" },
    { g: "people", term: "SDCRG", means: "A certified CLRG examiner", why: "Mostly relevant to teachers", check: true },
    { g: "people", term: "Adjudicator", means: "A judge", why: "Championships use panels of three or more" },
    { g: "people", term: "Region", means: "A geographic area under CLRG with its own regional body and Oireachtas", why: "Your region decides your Oireachtas and some local rules" },
    { g: "people", term: "IDTANA", means: "Irish Dance Teachers' Association of North America, the body for CLRG teachers in North America", why: "Its regions run the North American Oireachtas events" },
    { g: "people", term: "North American Feis Commission", means: "Sets feis rules for CLRG competitions in North America", why: "Its rules define levels and moving up in the US, Canada and Mexico" },
    { g: "people", term: "Grade exam", alt: "Grád", say: "grawd", means: "Optional CLRG exams in dance skills and knowledge", why: "Some schools encourage them; separate from competitions" },
    { g: "people", term: "Feis committee", means: "The volunteers running a particular feis", why: "Contact them about entries, schedules and results" }
  ],

  // Rules library. These are DRAFT examples to show how the library will work.
  // Real entries will be written from the official rulebooks Shannon sends.
  rules: [
    {
      q: "How does my dancer move up from Beginner 1?",
      a: "By placing 1st, 2nd or 3rd in a dance. They move up in that dance only, so a dancer can be Beginner 2 in reel and still Beginner 1 in light jig.",
      levels: ["b1"], regions: ["United States", "Canada", "Mexico"], org: "North American Feis Commission", topic: "Moving up"
    },
    {
      q: "How does my dancer move up from Beginner 2?",
      a: "By placing 1st, 2nd or 3rd in a dance. Again, this is one dance at a time.",
      levels: ["b2"], regions: ["United States", "Canada", "Mexico"], org: "North American Feis Commission", topic: "Moving up"
    },
    {
      q: "How does my dancer move up from Novice?",
      a: "By placing 1st or 2nd in a dance, one dance at a time.",
      levels: ["novice"], regions: ["United States", "Canada", "Mexico"], org: "North American Feis Commission", topic: "Moving up"
    },
    {
      q: "How does my dancer move up from Open Prizewinner?",
      a: "By winning 1st place in a dance. Once a dancer has moved up in enough dances, they can start dancing Preliminary Championship.",
      levels: ["pw"], regions: ["United States", "Canada", "Mexico"], org: "North American Feis Commission", topic: "Moving up", check: true
    },
    {
      q: "When does my dancer need hard shoes?",
      a: "Usually at Beginner 2, when treble jig and hornpipe are added. Ask your teacher before buying, because fit matters and they may suggest a brand.",
      levels: ["b1", "b2"], regions: [], org: "CLRG", topic: "Shoes and costume"
    },
    {
      q: "Can my daughter wear a wig or a solo dress at the lower levels?",
      a: "There are rules about costume, wigs and makeup at the beginner levels, and they change often. This answer will be filled in from the current rulebook.",
      levels: ["b1", "b2", "novice"], regions: [], org: "CLRG", topic: "Shoes and costume", check: true
    },
    {
      q: "Who is allowed to enter my dancer in a CLRG feis?",
      a: "A CLRG-registered teacher (TCRG). Registration normally goes through your school, so ask your teacher before you sign up for a feis.",
      levels: [], regions: [], org: "CLRG", topic: "Entering competitions"
    }
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
