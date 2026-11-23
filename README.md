# Pocket Irish Dance

A pocket guide to Irish dance for parents: the words (with how to say them), the level ladder, the organizations, plain-language rules, parent checklists, and a private score tracker.

It's an installable web app: open the link on a phone and choose "Add to Home Screen". It works offline after the first visit.

## Where things are

| File | What it holds |
| --- | --- |
| `data.js` | All the content: glossary, levels, organizations, rules, checklists. Edit this to change wording. |
| `app.js` | The screens and the score tracker. |
| `styles.css` | Colors and layout. |
| `manifest.webmanifest`, `sw.js`, `icons/` | What makes it installable and work offline. |

## Privacy

Score tracker results and photos are saved only on the parent's own phone (browser storage). Nothing is sent to a server. Parents can save a backup file from Settings.

## Status

First test version. Content marked "draft, to check" still needs review, and the rules library holds example entries until the official rulebooks are added.

When changing any file, bump `VERSION` in `sw.js` so installed copies pick up the update.
