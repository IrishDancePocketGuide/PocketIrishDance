# Pocket Irish Dance

A pocket guide to Irish dance for parents: the words (with how to say them), the level ladder, the organizations, plain-language rules, parent checklists, and a private score tracker.

It's an installable web app: open the link on a phone and choose "Add to Home Screen". It works offline after the first visit.

## Where things are

| File | What it holds |
| --- | --- |
| `index.html` | The website at pocketirishdance.com: what the app does and how to add it to a home screen. The installed app and app links skip it and go to `app.html`. |
| `app.html` | The app itself. |
| `site/` | Screenshots and fonts (Fraunces and Nunito, SIL Open Font License) used on the website. |
| `data.js` | All the content: glossary, levels, organizations, rules, checklists. Edit this to change wording. |
| `app.js` | The screens and the score tracker. |
| `rhythm.js`, `audio/` | Rhythm tap. The music is played from real accordion and piano notes in `audio/` (from the FluidR3 GM SoundFont by Frank Wen, CC BY 3.0, via github.com/gleitz/midi-js-soundfonts; rebuilt with `scripts/build-music.py`). The tunes are originals written for the app. |
| `reader.js` | Reads a results screenshot or photo and suggests results to save. |
| `vendor/ocr/` | The open-source text reader (Tesseract.js 7.0.0, Apache 2.0) and its English data, kept with the app so photos are read on the phone and never uploaded. |
| `friends.js` | Friends: private invite-only groups, shared wins and cheers (online, via Supabase). |
| `legal.js` | The privacy policy and terms of use (shown at `#/privacy` and `#/terms`). Change the company name and governing-law state at the top once the LLC is formed. |
| `config.js` | The Supabase project address and public key for Friends. Empty means Friends shows "coming soon". |
| `supabase/schema.sql` | The Friends database and its privacy rules. Run once in the Supabase SQL Editor. |
| `vendor/supabase/` | The Supabase browser library (supabase-js 2.118.0, MIT). |
| `styles.css` | Colors and layout. |
| `guide/`, `feis/`, `sitemap.xml` | Pages for search engines: the parent guide (levels, rules, words, organizations, checklists and answers to common parent questions) made from `data.js`, and the feis calendar by country, state or province and organization made from `feis.json` by `scripts/build-guides.mjs`. Don't edit them by hand: run `node scripts/build-guides.mjs` after changing `data.js` (the "Build parent guide pages" GitHub Action also does it on main, and the feis calendar Action rebuilds them every 6 hours so past feiseanna drop off). Styles in `site/guide.css`. |
| `robots.txt` | Tells search engines they're welcome and where the sitemap is. `app.html` is marked noindex; the website and guide pages are what show in search. |
| `manifest.webmanifest`, `sw.js`, `icons/` | What makes it installable and work offline. |

## Privacy

Score tracker results and photos are saved only on the parent's own phone (browser storage). Reading a results photo also happens on the phone. Nothing is sent to a server. Parents can save a backup file from Settings.

Friends is the only online part, and only for parents who sign up. A parent shares one win at a time (first name or nickname, dance, level, placing, feis and date) with private groups joined by invite code. The database rules in `supabase/schema.sql` make sure people only see their own groups.

### Setting up Friends

1. Run `supabase/schema.sql` in the Supabase SQL Editor.
2. In Authentication > Emails, edit the Magic Link template so it shows the code: `Your Pocket Irish Dance code is {{ .Token }}`. (Codes work inside the installed app; links would open the browser instead.)
3. Put the Project URL and publishable key in `config.js`.

## Web address

The app lives at https://pocketirishdance.com (GitHub Pages custom domain, set in the repository's Settings > Pages). Namecheap DNS holds four A records for `@` (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153) and a CNAME `www` → `irishdancepocketguide.github.io`, alongside the Resend email records. The old github.io address redirects there. Results are saved per web address, so anyone moving from the old address restores a backup file.

All paths in the app are relative, so it works at either address. Supabase's Site URL and Redirect URLs must include the current address for sign-in emails.

## Search engines

Register the site with Google Search Console and Bing Webmaster Tools using the pocketirishdance@gmail.com account, and submit the sitemap at https://pocketirishdance.com/sitemap.xml. The social preview image is `site/social.png` (1200×630).

## Status

First test version. Content marked "draft, to check" still needs review, and the rules library holds example entries until the official rulebooks are added.

When changing any file, bump `VERSION` in `sw.js` so installed copies pick up the update.
