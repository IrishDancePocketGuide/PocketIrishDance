/* Privacy policy and terms of use, shown at #/privacy and #/terms.
   EDIT HERE when the company is formed:
   - operator: the legal name, for example "Pocket Irish Dance LLC".
   - lawState: the US state whose laws govern the terms, for example "Wyoming". Leave "" to leave that sentence out.
   - updated: the date these were last changed (YYYY-MM-DD).
   These were written in plain language as a starting point. They are not legal advice: have a lawyer check them before launch. */
window.PID_LEGAL = (function () {
  const L = {
    operator: "Pocket Irish Dance",
    lawState: "",
    email: "pocketirishdance@gmail.com",
    updated: "2026-11-25"
  };

  const mail = `<a href="mailto:${L.email}">${L.email}</a>`;
  const when = new Date(L.updated + "T12:00:00").toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
  const sec = (h, body) => `<h2 style="margin-top:22px">${h}</h2><div class="card stack small">${body}</div>`;

  L.privacy = () => `
    <p class="muted" style="margin-top:0">Last updated ${when}</p>
    <div class="card stack small">
      <p style="margin-top:0"><strong>The short version.</strong> Your dancers, results, photos and notes stay on your phone. We never see them. If you choose to use Friends, we keep your email address and the wins you choose to share, so your friends can see them. If you choose to share a dancer's results with their teacher, we keep a copy of those results so that teacher, and only that teacher, can see them. We don't sell anything about you, there are no adverts, and nothing follows you around the web. We only count visits, with no cookies and nothing that identifies you.</p>
      <p style="margin-bottom:0">This policy explains what ${L.operator} ("we", "us") does with information in the Pocket Irish Dance app and at pocketirishdance.com.</p>
    </div>

    ${sec("What stays on your phone", `
      <p style="margin-top:0">These are saved only in the app's storage on your own phone or computer. They are not sent to us or anyone else, unless you choose to share a dancer's results with their teacher (see below):</p>
      <ul>
        <li>your organization, region and level settings</li>
        <li>your dancers' names and levels</li>
        <li>competition results, rounds, judges, marks and notes</li>
        <li>photos and screenshots of results</li>
        <li>checklist ticks</li>
      </ul>
      <p><strong>Reading results photos.</strong> When you add a photo or screenshot, the app reads the text on your phone. The photo is not uploaded anywhere.</p>
      <p style="margin-bottom:0"><strong>Backups.</strong> A backup file you save is yours. It goes wherever you choose to keep it. Because we never hold this information, we can't recover it if your phone is lost or the app's storage is cleared, so please save a backup now and then. You can remove it at any time by deleting a dancer or result, or by clearing the app's data on your phone.</p>`)}

    ${sec("Friends (only if you sign up)", `
      <p style="margin-top:0">Friends is optional. If you create an account, we keep:</p>
      <ul>
        <li>your email address, to send you sign-in codes (there are no passwords)</li>
        <li>the name you choose to show your friends</li>
        <li>the groups you start or join</li>
        <li>each win you choose to share: the first name or nickname you enter, the dance, level, placing, feis and date, exactly as shown in the preview before you share</li>
        <li>the cheers you send and receive</li>
      </ul>
      <p><strong>Who can see it.</strong> Only people in the same private group. Groups can only be joined with an invite code. Nothing you share is public.</p>
      <p style="margin-bottom:0"><strong>Your choices.</strong> You can un-share a win, leave a group, download your data or delete your account at any time in Friends › Your account. Deleting your account removes everything you put online straight away.</p>`)}

    ${sec("Sharing results with your dancer's teacher (only if you agree)", `
      <p style="margin-top:0">You can pick each dancer's school in the app. Picking a school shares nothing. Schools come from the organizations' public school lists, or are added by parents.</p>
      <p><strong>Teachers are checked.</strong> A teacher can ask to be the teacher for a school. We check each one by hand, for example against the school's own website and the teaching credentials they send us, before they can see anything. A school has one checked teacher in the app at a time, and we show you their name before you decide.</p>
      <p><strong>Off until you agree.</strong> Nothing is shared with a teacher unless you agree, for one dancer at a time, to share with that named teacher. Once you agree, all of that dancer's results are shared, including new ones you add, until you turn it off.</p>
      <p>For each shared dancer, we keep and the teacher can see:</p>
      <ul>
        <li>the dancer's name, as you type it when you agree (for example a first name and the first letter of the surname)</li>
        <li>for each result: the feis, date, dance, level, placing, number of dancers, score, recall, each judge's name and placing, and the judges' written comments</li>
      </ul>
      <p><strong>Never shared:</strong> photos, your own notes, the journal, what you wrote about judges, other dancers you haven't chosen to share, and your email address.</p>
      <p><strong>Stopping.</strong> You can stop sharing at any time on the dancer's School page. Everything shared for that dancer is deleted straight away. Deleting the dancer, changing school or deleting your account does the same. If the school's teacher changes or leaves the app, sharing stops and the new teacher sees nothing unless you agree again.</p>
      <p><strong>Teachers' own information.</strong> If you ask to be a school's teacher, we keep the name, qualification and details you give us, and your email address, to check your request. Families at that school see your name once you're approved. To help us check requests, our school list also keeps the teacher names and school contact details that the dance organizations publish on their own public school lists. Only our team sees these.</p>
      <p style="margin-bottom:0">Our team approves teachers, but doesn't look at families' shared results.</p>`)}

    ${sec("Counting visits", `
      <p style="margin-top:0">To know whether the app is helping anyone, we count how often the website is visited and the app is opened, whether it was opened from a home screen, and which sections and games are used. We use <strong>GoatCounter</strong>, a privacy-friendly counter, for this.</p>
      <ul>
        <li>No cookies, and nothing is saved on your phone for it.</li>
        <li>No ID for you or your device, and no advertising or cross-site tracking.</li>
        <li>Only the name of what happened is sent, like "Game: Feis day bingo". Never your dancers, results, judges, notes, searches or anything you type.</li>
        <li>GoatCounter also sees the browser and device type, screen size, country (worked out from your IP address, which it does not keep) and, for the website, the name of the site that linked you here. We only ever see totals.</li>
      </ul>
      <p style="margin-bottom:0">Nothing is counted if your browser is set to "Do Not Track" or Global Privacy Control, or while you're offline.</p>`)}

    ${sec("Companies that help us run the app", `
      <p style="margin-top:0">We use a small number of service providers. They may only use information to provide their service to us.</p>
      <ul>
        <li><strong>Supabase</strong> stores Friends accounts, groups, shared wins and cheers, schools, teacher requests and results shared with teachers, in a data centre in the United States.</li>
        <li><strong>Resend</strong> sends the sign-in code emails, so it receives your email address.</li>
        <li><strong>GitHub Pages</strong> delivers the app's pages to your phone.</li>
        <li><strong>GoatCounter</strong> counts visits, as described above.</li>
      </ul>
      <p style="margin-bottom:0">Like any website, these providers may briefly record technical details such as your IP address and device type, to keep their services secure and working. We don't use these details to track you.</p>`)}

    ${sec("What we don't do", `
      <ul style="margin:0">
        <li>We don't sell or rent your information, or "share" it for advertising.</li>
        <li>We don't show adverts.</li>
        <li>We don't use cookies, advertising trackers or tracking that follows you to other websites.</li>
        <li>We don't use your information to train AI.</li>
      </ul>`)}

    ${sec("Children", `
      <p style="margin-top:0">Pocket Irish Dance is made for parents, guardians and dance teachers, not for children. Accounts are only for adults aged 18 or over, and children should not create accounts.</p>
      <p>Parents may record their own children's competition details on their own phone, where we can't see them. If a parent shares a win through Friends, only the first name or nickname they type and the result are shared, and only with their private groups. If a parent agrees to share a dancer's results with their teacher, only that checked teacher can see them, and the parent can stop at any time.</p>
      <p style="margin-bottom:0">We don't knowingly collect personal information directly from children. If you think a child has created an account, email us and we will delete it.</p>`)}

    ${sec("How long we keep it", `
      <p style="margin:0">We keep Friends information until you delete it or delete your account. Our providers may keep copies in their backups and logs for a limited time before they are deleted. If an account is not used for two years, we may delete it.</p>`)}

    ${sec("Your rights", `
      <p style="margin-top:0">Wherever you live, you can ask to see, correct, download or delete the information we hold about you. Most of this you can do yourself in Friends › Your account. For anything else, email ${mail}. We'll answer within 30 days.</p>
      <p><strong>UK, Ireland and Europe.</strong> We use your information to provide Friends when you ask us to (to perform our agreement with you), and with your consent when you share a win or share a dancer's results with their teacher. You can withdraw consent by un-sharing, stopping sharing with the teacher, or deleting your account. Your information is stored in the United States, protected by our providers' data protection agreements, including the standard contractual clauses. You can complain to your data protection authority, such as the ICO in the UK or the Data Protection Commission in Ireland.</p>
      <p><strong>United States.</strong> We don't sell or share personal information, so there is nothing to opt out of. California residents have the right to know, delete and correct, and we won't treat you differently for using them.</p>
      <p style="margin-bottom:0"><strong>Canada and Australia.</strong> You can access and correct your information, and complain to the Office of the Privacy Commissioner of Canada or the Office of the Australian Information Commissioner.</p>`)}

    ${sec("Security", `
      <p style="margin:0">Information is sent over encrypted connections. The database only lets people see their own groups, and only lets a checked teacher see the results families agreed to share with them. No system is perfectly secure, so please don't share anything you wouldn't want friends to see. If something goes wrong that affects your information, we'll tell you.</p>`)}

    ${sec("Links to other websites", `
      <p style="margin:0">The app links to organization websites, and the judge look-up button opens a web search. Those sites have their own privacy policies.</p>`)}

    ${sec("Changes and contact", `
      <p style="margin-top:0">If we change this policy, we'll update the date above, and tell Friends members in the app before any important change.</p>
      <p style="margin-bottom:0">Questions or requests: ${mail}</p>`)}

    <p class="center small" style="margin-top:22px"><a href="#/terms">Terms of use</a></p>`;

  L.terms = () => `
    <p class="muted" style="margin-top:0">Last updated ${when}</p>
    <div class="card stack small">
      <p style="margin:0">These terms are an agreement between you and ${L.operator} ("we", "us"). By using the Pocket Irish Dance app or pocketirishdance.com, you agree to them. Please also read our <a href="#/privacy">privacy policy</a>.</p>
    </div>

    ${sec("A guide, not the official rules", `
      <p style="margin-top:0">Pocket Irish Dance is an independent, free guide for parents. It is not made by, endorsed by or connected to CLRG, An Comhdháil, WIDA, IDTANA, CRN, CRDM or any other Irish dance organization, school or feis. Their names belong to them.</p>
      <p style="margin-bottom:0">We work hard to keep things accurate, but rules, levels and feis dates change and differ by region. Always check anything important with your teacher, the feis syllabus and the organization's current official rules.</p>`)}

    ${sec("Your results and backups", `
      <p style="margin-top:0">Results, photos and notes are kept on your phone, and you are responsible for them. Please save a backup file now and then: we can't recover them if they are lost.</p>
      <p style="margin-bottom:0">The app's photo reader can misread results. Check what it suggests before you save it.</p>`)}

    ${sec("Using Friends", `
      <p style="margin-top:0">To use Friends or teacher sharing you must be a parent, guardian or dance teacher aged 18 or over. Keep your email account secure, as sign-in codes are sent there.</p>
      <p>Please be kind. You agree to:</p>
      <ul>
        <li>share only your own family's results, or results you have permission to share</li>
        <li>never use a dancer's full name, or share anything about another family's child</li>
        <li>not use the app to harass, shame or criticize dancers, teachers, judges or families</li>
        <li>not try to get into groups or accounts that aren't yours, or to disrupt the app</li>
      </ul>
      <p style="margin-bottom:0">We may remove shared content, or suspend or close an account, if these terms are broken or to keep people safe. You can delete your account at any time.</p>`)}

    ${sec("Teachers", `
      <p style="margin-top:0">If you ask to be a school's teacher in the app, you must really teach at that school, and give us true details so we can check. We may decline or remove a teacher at any time, for example if a family tells us something is wrong.</p>
      <p style="margin-bottom:0">Results families share with you are for helping their dancers. Don't pass them on, publish them, or use them for anything else, and don't pressure families to share. Families can stop sharing at any time.</p>`)}

    ${sec("Notes about judges", `
      <p style="margin:0">Judge history and notes are private to your phone, to help you understand your own dancer's results. Please don't publish them or use them to target any judge.</p>`)}

    ${sec("Our content", `
      <p style="margin:0">The app's text, design and logo belong to us. You're welcome to use the app for your family and share links to it, but please don't copy it to build another product. Open-source parts of the app are used under their own licences.</p>`)}

    ${sec("No guarantees", `
      <p style="margin-top:0">The app is provided free and "as is". We don't promise it will always be available, error free or right for your situation, and we may change or stop features.</p>
      <p style="margin-bottom:0">As far as the law allows, we are not responsible for indirect losses, lost data, or decisions made using the app, and our total responsibility to you is limited to $50. Nothing in these terms takes away rights you have under the consumer laws where you live, including in the UK, Ireland, the EU and Australia.</p>`)}

    ${sec("Changes and contact", `
      <p style="margin-top:0">We may update these terms. We'll change the date above, and tell Friends members in the app before any important change. If you keep using the app after that, the new terms apply.</p>
      ${L.lawState ? `<p>These terms are governed by the laws of the State of ${L.lawState}, USA, except where the law where you live says otherwise.</p>` : ""}
      <p style="margin-bottom:0">Questions: ${mail}</p>`)}

    <p class="center small" style="margin-top:22px"><a href="#/privacy">Privacy policy</a></p>`;

  return L;
})();
