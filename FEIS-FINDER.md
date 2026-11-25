# Feis finder

The app's feis calendar has two parts:

1. **Official lists**, read every 6 hours by `scripts/update-feis.mjs` (WIDA, An Comhdháil, IDTANA national list, CRN on Feis Host, CRDM competition dates).
2. **Found feiseanna**, in `feis-found.json`: smaller feiseanna, often run by a local school, that appear on a
   regional calendar or a school's own website. A weekly Claude task finds these, Shannon approves them,
   and the updater merges them into `feis.json`.

This file is the procedure for the weekly finder.

## Rules

- Never use Planxti (Shannon's decision, Nov 2026).
- Read only public pages. Respect robots.txt. One visit per page, no logins, no forms.
- Only add a feis when a page states its name **and** its date for an upcoming year. No guessing dates
  from last year's feis.
- Only Irish dance feiseanna (not ceili nights, workshops, exams, shows or other dance styles).
- Keep a link to the page where it was found (the school's feis page if there is one).
- Shannon approves every batch before it goes into `feis-found.json` (unless she changes that).

## Where to look

Start with the CLRG regional calendars, which list most local school feiseanna in North America:

| Region | Page |
| --- | --- |
| Eastern Canada | https://www.idtac-er.com/regional-feiseanna |
| Western Canada | https://www.wcidta.ca/feis-dates |
| Mid-America | https://midamericaregion.com/region-information/feis-calendar/ (currently only points elsewhere) |
| Mid-Atlantic | https://www.mid-atlanticregion.com/feis-info |
| New England | https://www.neidt.org/feiseanna |
| Southern US | https://www.idtana-southernregion.com/calendar |
| Western US | https://www.westernusregion.com/feiseanna |

Then search the web for school-hosted feiseanna in the app's markets (US, Canada, UK, Ireland, Australia,
Mexico, mainland Europe), for example `"feis" 2027 "Irish dance" <state or county>`,
`"feis" "syllabus" 2027`, `"open feis" 2027`. Open each promising page and confirm the date there.

## Deciding the organization

- `clrg`: page or host mentions CLRG, An Coimisiún, TCRG, ADCRG, IDTANA, NAFC or a CLRG region,
  or the feis is on a CLRG regional calendar.
- `comhdhail`: mentions An Comhdháil / irishdancingorg.com.
- `wida`: mentions WIDA / irish.dance.
- `crn`: mentions CRN / Cumann Rince Náisiúnta / crn.ie.
- `crdm`: mentions CRDM / Cumann Rince Dea Mheasa / crdm.ie.
- Anything else (ICDTA, independent): leave it out for now and mention it to Shannon.

## Record format (`feis-found.json` → `events`)

```json
{
  "org": "clrg",
  "name": "Salish Sea Feis",
  "start": "2027-02-06",
  "end": "2027-02-06",
  "place": "Mary Winspear Centre, Sidney, BC, Canada",
  "host": "O'Brien School of Irish Dance",
  "url": "https://obrienirishdance.com",
  "foundOn": "the Western Canada region calendar",
  "checked": "2026-11-24"
}
```

Skip anything already in `feis.json` (same date and a similar name). Remove entries whose page now
says the feis is cancelled.
