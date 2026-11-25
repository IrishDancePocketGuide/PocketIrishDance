/* Irish counties map game: the app names a county and you tap it on a map of Ireland.
   Two ways to play: find the county itself, or (easier) tap the province it's in.
   10 random counties each game. Works offline. Best scores stay on this phone.
   Map: Natural Earth (public domain), simplified. Northern Ireland's county lines are
   rebuilt from district boundaries, so they are close but not survey-exact. */
(function () {
  "use strict";

  const MAP = {"w":512,"h":662,"counties":[
    {"n":"Antrim","p":"Ulster","d":"M399 77l3 1 4 16 -1 14 1 6 9 1 10 -4 4 4 -5 7 -2 6 4 2 0 4 -6 5 -3 11 4 1 5 -1 12 -1 8 -2 4 -3 8 -9 3 -6 -2 -4 8 -12 11 -5 3 -6 -1 -10 -5 -5 -4 2 -9 -16 -5 -5 -5 -2 0 -11 -8 -3 2 -7 0 -9 -6 -7 -6 -2 -9 2 -9 -5 -6 2 -6 -3 -4 2 -5 5 -7 1 -11 5 9 9 5 10 4 11 3 11z"},
    {"n":"Armagh","p":"Ulster","d":"M395 225l13 -4 4 2 6 -2 1 -6 6 -1 2 0 -2 -3 -4 -9 -3 -15 1 -2 -2 -2 0 -8 -2 -10 5 1 2 -3 4 -13 -5 1 -4 -1 -3 1 -4 -4 -10 1 -3 -2 2 9 -6 2 -4 -2 -4 3 -2 7 -7 -1 -3 12 -4 2 4 16 8 8 4 -3 7 5 -3 9 0 8z"},
    {"n":"Carlow","p":"Leinster","d":"M355 434l-3 5 -2 7 4 3 4 -1 4 6 1 11 5 5 -2 9 2 10 6 -2 4 -10 4 -6 1 -7 6 -5 7 -2 -2 -5 5 -5 -8 -13 3 -7 9 5 6 -4 -1 -9 -3 1 -6 -3 -13 -4 -3 7 -11 3 -6 -4 0 10z"},
    {"n":"Cavan","p":"Ulster","d":"M298 245l6 8 5 4 4 8 6 5 5 -3 4 -2 9 5 6 -4 15 5 5 -2 3 -4 -4 -6 3 -8 3 2 10 -2 4 -4 -6 -4 -7 -11 -13 -12 -1 -4 -12 3 -11 -2 -7 -3 -7 -1 -5 -4 -6 3 -10 -2 -3 -5 -7 -5 -13 -1 -3 -3 0 -8 -2 -3 -5 -1 -4 5 -6 5 4 8 7 3 11 11 2 -2 6 3 15 13 1 7z"},
    {"n":"Clare","p":"Munster","d":"M158 375l-7 -3 0 5 -9 4 -9 -7 -2 1 -7 11 -10 19 -2 5 8 0 1 3 -7 6 -7 21 -9 2 -4 4 -21 20 -5 1 -7 5 19 -2 5 -2 1 -4 15 -5 8 3 9 2 10 4 3 -4 11 -2 9 -12 4 -8 5 -4 4 14 6 -1 12 4 12 2 6 -2 7 -6 0 -6 3 -2 3 -6 0 -4 -1 -5 3 -5 -2 -8 10 -1 1 -7 -10 0 -5 -2 -2 -3 -6 -5 -10 0 -5 2 -6 7 -10 0 -2 -14 -10 -6 -2 -5z"},
    {"n":"Cork","p":"Munster","d":"M66 606l-6 -1 -7 4 3 5 -5 4 -9 1 2 4 -1 4 -7 2 0 3 7 -2 5 2 9 -4 7 -6 23 -3 9 -6 1 -5 7 5 3 6 -14 4 -2 2 -17 8 -1 7 20 -10 -8 10 -8 4 -5 5 -2 9 11 -5 4 -6 4 3 7 -2 1 -3 8 -2 5 -3 3 2 -2 6 7 6 8 -6 5 4 3 -6 7 -1 2 -3 13 -2 6 3 4 -2 4 -7 9 1 7 3 -1 -7 -5 -5 12 2 10 -2 5 -8 13 -3 7 -7 -1 -13 -3 -10 5 -2 9 4 1 7 -3 1 -2 5 12 0 11 -3 2 -6 12 -4 -4 -5 7 -5 1 -6 -7 0 -2 -6 -7 -6 -6 -14 -9 -2 5 -11 -4 -4 -4 -8 -8 0 -5 -5 -4 0 -4 4 -10 2 -5 -1 -6 -5 -8 -10 -14 -1 -7 5 -2 4 -10 4 -4 -3 -9 -3 -10 6 -4 6 -1 6 2 6 2 9 4 9 -3 5 0 5 8 3 0 4 -11 2 -7 7 3 7 -5 6 -10 4 -3 5 -17 2 -7 6 -5 1 -5 6 -5 1z"},
    {"n":"Derry","p":"Ulster","d":"M315 76l4 4 10 1 -1 4 7 1 9 11 4 1 8 -3 7 2 1 6 -2 2 -2 6 12 -2 6 1 8 6 12 -5 3 1 4 -4 1 -14 -4 -16 -3 -1 -1 0 -3 -11 -4 -11 -5 -10 -9 -9 -12 1 -6 -4 -2 3 -1 7 -3 11 -5 5 -7 0 -10 -4 -5 3 -6 1 -5 7z"},
    {"n":"Donegal","p":"Ulster","d":"M315 76l0 -10 5 -7 6 -1 5 -3 2 -7 6 -7 5 -3 7 -5 8 -4 1 -3 -20 -9 -5 -7 -13 -6 -3 10 -4 4 -4 -1 -6 4 -3 12 7 9 -1 8 3 4 -2 5 -9 0 -2 -4 5 -5 1 -6 -5 -8 -4 -4 0 -6 -3 -5 -11 4 -3 7 4 2 5 -4 3 12 -14 -9 -4 10 -4 -3 -1 -5 -9 -5 -2 5 -13 8 -10 -3 -5 9 1 8 -5 -1 -4 5 -1 5 -4 1 5 7 -3 9 5 2 -2 7 -9 -1 -6 4 2 10 -10 0 -9 6 -7 5 2 7 8 3 2 4 8 0 9 -2 4 4 3 -6 4 6 10 -5 5 1 11 -2 -2 6 -8 6 0 4 -5 4 3 4 -6 4 5 2 8 0 11 -6 5 -7 11 2 4 -2 10 -9 4 -2 -11 -5 -9 -4 0 -4 6 -8 8 5 3 -1 8 -6 4 1 6 -3 0 -6 7 -9 3 -6 -1 -6zM211 66l-4 -2 -3 6 8 0z"},
    {"n":"Down","p":"Ulster","d":"M427 214l1 1 8 1 2 3 9 2 4 4 12 -10 4 -12 1 -11 8 -3 9 0 7 -2 5 -7 0 -12 -3 -3 -8 1 3 -10 -1 -9 -7 -8 3 -6 10 8 3 7 0 7 -3 7 6 10 6 -8 -1 -6 3 -7 -4 -8 -1 -9 -4 -5 -2 -9 -4 -4 -12 2 -5 -2 -8 6 -7 7 -3 6 -8 9 -4 3 -8 2 -12 1 -4 13 -2 3 -5 -1 2 10 0 8 2 2 -1 2 3 15 4 9z"},
    {"n":"Dublin","p":"Leinster","d":"M450 364l-2 -4 1 -10 -6 -2 -6 -6 0 -4 10 -6 -2 -8 0 -4 5 -12 -2 -6 -8 -5 -3 -5 -4 1 -2 5 -5 5 -7 -2 -3 5 9 10 -3 8 -3 1 -7 9 -6 18 6 9 8 3 5 5 6 -7 5 3 5 -2 5 3z"},
    {"n":"Fermanagh","p":"Ulster","d":"M242 156l1 4 8 10 7 4 6 10 5 1 2 3 0 8 3 3 13 1 7 5 3 5 10 2 6 -3 5 4 7 1 6 -4 0 -7 3 -5 7 -2 1 -5 -6 -7 1 -7 -6 1 -2 -5 -4 -1 -1 -6 -4 -5 -5 -1 -9 6 -5 -4 -2 -13 3 -10 -5 1 -7 -3 -3 -5 -4 2 -10 9 -4 2 -11 -2 -5 7zM314 205l-6 3 0 -6 -5 -6 -7 -4 6 -5 4 7 4 1zM292 171l-3 -6 -15 -11 -15 0 4 -6 11 -5 9 1 -1 5 8 13z"},
    {"n":"Galway","p":"Connacht","d":"M90 298l-8 0 -8 -3 -7 3 -8 -1 -2 7 -9 -2 -4 4 3 6 4 5 1 6 -9 1 3 5 8 0 2 4 7 1 4 -1 1 -6 5 5 -4 11 5 1 4 4 6 -2 6 -10 7 9 0 8 10 8 6 -1 5 -2 33 -2 5 -2 4 7 5 3 -3 10 -4 1 -2 4 2 5 10 6 2 14 10 0 6 -7 5 -2 10 0 6 5 2 3 5 2 10 0 -1 -4 6 -5 1 -8 8 -1 7 -12 6 -3 10 -6 0 -5 -7 -7 -9 0 -5 -6 0 -4 -5 -4 1 -5 -2 -8 -3 -6 -1 -16 -9 -6 -2 -4 3 -4 -8 -5 -3 -5 -9 0 -6 3 -3 3 -10 3 -6 -2 -7 3 -6 0 -9 17 -9 11 -9 0 0 4 5 3 11 4 -2 6 3 7 -4 3 -6 -7 3 -2 -2 -7 -13 -3 -18 -14 16 -4 -4 0 -2 -4 -10 0 -9 -4 -4 -3zM87 359l5 1 2 -3 -3 -5 -5 2zM93 383l-2 -6 -5 -2 -6 3 12 5z"},
    {"n":"Kerry","p":"Munster","d":"M134 517l-2 -3 -9 -6 2 -5 -2 -5 0 -8 3 -7 -6 -13 -8 0 -14 0 -4 -1 -6 4 -1 10 -7 6 -10 4 -7 1 1 5 7 3 1 11 -2 10 -3 3 -8 -1 -10 -6 -6 5 -7 1 0 -9 -11 3 -4 5 -5 1 -1 8 -8 -1 -3 6 2 8 4 1 8 -4 8 -2 10 3 14 -3 28 -1 -2 4 -10 1 -4 -2 -2 10 -11 5 -10 1 -14 7 -3 4 4 8 -12 4 -3 7 5 1 0 9 8 -6 3 -4 5 2 0 8 8 8 7 -6 3 1 7 -4 7 0 9 -4 4 -3 11 -4 -2 5 -7 0 -13 14 4 11 5 -1 5 -6 5 -1 7 -6 17 -2 3 -5 10 -4 5 -6 -3 -7 7 -7 11 -2 0 -4 -8 -3 0 -5 3 -5 -4 -9 -2 -9 -2 -6 1 -6zM21 577l-5 -2 -7 4 6 2z"},
    {"n":"Kildare","p":"Leinster","d":"M412 334l-7 -2 -4 2 -11 -5 -9 0 -4 3 -5 -1 -4 -6 -7 0 -8 7 -2 5 0 2 9 9 -3 10 -4 3 4 4 -2 4 -6 3 1 5 3 8 1 8 -3 6 3 5 8 3 4 7 0 5 6 4 11 -3 3 -7 0 -3 -5 -9 7 -12 8 -4 6 -7 5 -10 5 -7 -6 -9z"},
    {"n":"Kilkenny","p":"Leinster","d":"M362 522l-1 -2 -2 -3 2 -9 6 -12 1 -7 -2 -10 2 -9 -5 -5 -1 -11 -4 -6 -4 1 -4 -3 2 -7 3 -5 -7 -5 -3 -7 -5 -3 -6 6 -4 -1 -11 10 -5 2 -13 -5 -4 5 -5 1 4 8 7 4 12 22 0 10 3 3 -4 4 6 7 1 8 2 8 6 4 5 7 6 4 5 -4 5 2 5 1z"},
    {"n":"Laois","p":"Leinster","d":"M292 437l5 -1 4 -5 13 5 5 -2 11 -10 4 1 6 -6 5 3 3 7 7 5 11 -5 0 -10 0 -5 -4 -7 -8 -3 -3 -5 3 -6 -1 -8 -3 -8 -1 -5 -2 2 -7 0 -5 3 -7 0 -1 -5 -5 -6 -4 0 -2 4 -7 -1 -13 4 -2 3 5 8 -9 14 -1 6 -3 4 6 7 -4 4 0 8z"},
    {"n":"Leitrim","p":"Connacht","d":"M229 154l-8 1 -3 7 6 2 0 6 -3 6 4 9 1 10 -1 5 6 8 7 1 5 6 2 -1 9 4 -4 9 1 10 -3 4 1 6 11 3 0 7 6 8 8 -3 5 2 2 -7 9 -10 8 -2 2 -8 -1 -7 -15 -13 -6 -3 -2 2 -11 -11 -7 -3 -4 -8 6 -5 4 -5 -6 -10 -7 -4 -8 -10 -1 -4 -8 0z"},
    {"n":"Limerick","p":"Munster","d":"M240 520l3 -5 -2 -7 -3 -2 -4 -7 -7 -4 -6 -1 -3 -3 2 -5 15 -6 0 -8 4 -16 -5 1 -6 -5 -3 1 -12 -1 -3 -11 -3 2 0 6 -7 6 -6 2 -12 -2 -3 1 -18 2 -3 4 -8 0 -13 4 -8 4 -9 0 6 13 -3 7 0 8 2 5 -2 5 9 6 2 3 10 -6 9 3 4 3 10 -4 2 -4 7 -5 14 1 8 10 6 5 5 1 10 -2 4 -4 4 0 5 5z"},
    {"n":"Longford","p":"Leinster","d":"M266 265l4 7 -5 2 -7 15 0 8 6 12 4 -2 6 2 13 2 6 -2 3 -6 6 -6 -1 -6 6 -7 8 -6 5 -2 -1 -6 -6 -5 -4 -8 -5 -4 -6 -8 -8 2 -9 10 -2 7 -5 -2z"},
    {"n":"Louth","p":"Leinster","d":"M388 248l10 7 3 10 6 6 5 0 -1 8 15 0 6 -2 -1 -16 1 -7 -11 -3 -3 -5 1 -8 2 -7 4 -1 12 5 4 0 3 -4 -1 -5 -4 -1 -11 -10 -1 -1 -2 0 -6 1 -1 6 -6 2 -4 -2 -13 4 4 1 2 8 -5 1 -3 4 0 6z"},
    {"n":"Mayo","p":"Connacht","d":"M130 309l4 1 3 9 9 0 9 -11 9 -17 6 0 7 -3 3 -3 9 -5 2 -11 -4 -4 3 -11 5 1 1 -5 -5 -4 1 -7 9 1 -1 -9 -5 -3 -13 10 -7 0 -4 -8 -5 1 -7 -3 1 -4 8 -11 -4 -5 -6 -1 -7 2 -4 -4 -7 -9 0 -8 -5 -6 -7 -3 -5 4 -14 -3 -17 -2 -8 -3 -6 1 2 6 -5 6 1 5 -5 4 -3 -2 7 -8 -8 -2 -3 -4 -8 5 -3 7 1 5 -4 11 1 5 4 -1 1 -7 3 -6 5 -5 4 14 -3 4 0 5 7 4 0 5 4 4 1 6 -7 3 -2 10 2 5 5 -2 10 -5 14 1 5 5 -6 8 6 4 -19 3 -5 -1 -10 3 0 3 -2 9 1 7 12 7 9 1 11 0 4 3 9 4 10 0 2 4zM115 303l-1 -5 6 -4 8 -11 2 5 -3 13 -3 3zM137 226l4 4 -2 4 -5 -1 0 -5 -3 -5 1 -8 6 5zM67 238l1 -5 -4 -6 -8 0 -8 3 -4 -1 -4 3 3 4 10 -1 3 2 0 8 3 0 6 6 2 -2z"},
    {"n":"Meath","p":"Leinster","d":"M437 292l-2 -2 -3 -13 -6 2 -15 0 1 -8 -5 0 -6 -6 -3 -10 -10 -7 -6 -1 -4 4 -10 2 -3 -2 -3 8 4 6 -3 4 -5 2 -15 -5 -6 4 -9 -5 -4 2 5 3 6 8 1 4 12 6 4 4 4 -4 7 3 -7 24 -3 1 -2 7 -11 6 11 8 2 -5 8 -7 7 0 4 6 5 1 4 -3 9 0 11 5 4 -2 7 2 7 -9 3 -1 3 -8 -9 -10 3 -5 7 2 5 -5 2 -5z"},
    {"n":"Monaghan","p":"Ulster","d":"M382 247l6 1 5 -3 0 -6 3 -4 5 -1 -2 -8 -4 -1 -6 -4 0 -8 3 -9 -7 -5 -4 3 -8 -8 -4 -16 -6 -8 -6 -4 -6 -2 -7 11 -7 2 -1 7 6 7 -1 5 -7 2 -3 5 0 7 -6 4 7 3 11 2 12 -3 1 4 13 12 7 11z"},
    {"n":"Offaly","p":"Leinster","d":"M251 372l7 6 6 3 3 6 -2 7 -6 11 3 3 -7 10 6 7 12 -11 0 -4 4 -4 9 2 3 -4 1 -6 9 -14 -5 -8 2 -3 13 -4 7 1 2 -4 4 0 5 6 1 5 7 0 5 -3 7 0 2 -2 6 -3 2 -4 -4 -4 4 -3 3 -10 -9 -9 0 -2 -11 -8 -4 4 -5 2 -10 8 -8 3 -4 -2 -3 2 -5 -11 -5 -3 -5 2 -3 5 -15 4 -9 -4 -6 6 -4 9 7 7 0 5z"},
    {"n":"Roscommon","p":"Connacht","d":"M254 354l4 -9 6 -6 1 -5 -2 -9 -4 -7 -1 -6 -5 -9 2 -2 -2 -7 5 -5 7 -15 5 -2 -4 -7 -6 -8 0 -7 -11 -3 -1 -6 3 -4 -1 -10 4 -9 -9 -4 -2 1 -9 11 -5 3 -3 4 -6 1 -1 6 5 2 1 4 -8 0 -2 2 -7 -3 -2 -4 -5 -1 -9 -1 -1 7 5 4 -1 5 -5 -1 -3 11 4 4 -2 11 -9 5 -3 3 6 2 10 -3 3 -3 6 -3 9 0 3 5 8 5 -3 4 2 4 9 6 1 16 3 6 2 8 -1 5 5 4 0 4 5 6z"},
    {"n":"Sligo","p":"Connacht","d":"M221 155l-6 4 -16 12 -5 2 0 4 10 0 7 8 -11 1 -2 5 -6 -3 -6 1 -13 0 -6 -4 -11 -1 -4 11 -5 3 0 7 4 4 7 -2 6 1 4 5 -8 11 -1 4 7 3 5 -1 4 8 7 0 13 -10 5 3 1 9 5 1 2 4 7 3 2 -2 8 0 -1 -4 -5 -2 1 -6 6 -1 3 -4 5 -3 9 -11 -5 -6 -7 -1 -6 -8 1 -5 -1 -10 -4 -9 3 -6 0 -6 -6 -2z"},
    {"n":"Tipperary","p":"Munster","d":"M248 532l9 1 3 -6 22 3 1 -7 -3 -2 1 -10 19 -4 11 3 12 1 -2 -8 -1 -8 -6 -7 4 -4 -3 -3 0 -10 -12 -22 -7 -4 -4 -8 -4 -10 0 -8 4 -4 -6 -7 -9 -2 -4 4 0 4 -12 11 -6 -7 7 -10 -3 -3 6 -11 2 -7 -3 -6 -6 -3 -7 -6 -6 3 -7 12 -8 14 2 6 -3 2 0 1 -7 7 -9 14 0 4 -3 6 3 11 12 1 3 -1 6 5 5 -1 -4 16 0 8 -15 6 -2 5 3 3 6 1 7 4 4 7 3 2 2 7 -3 5 4 8z"},
    {"n":"Tyrone","p":"Ulster","d":"M287 132l3 5 7 3 5 -1 -3 10 2 13 5 4 9 -6 5 1 4 5 1 6 4 1 2 5 6 -1 7 -2 7 -11 6 2 6 4 6 8 4 -2 3 -12 7 1 2 -7 4 -3 4 2 6 -2 -2 -9 -3 -2 8 -14 -1 -13 0 -5 -3 -1 -12 5 -8 -6 -6 -1 -12 2 2 -6 2 -2 -1 -6 -7 -2 -8 3 -4 -1 -9 -11 -7 -1 1 -4 -10 -1 -4 -4 -4 4 1 6 -3 6 -7 9 0 6 -6 3 -4 -1 -8 6 -3 1 -8 -5 -6 8 0 4 9 4z"},
    {"n":"Waterford","p":"Munster","d":"M274 571l2 4 11 2 1 -5 8 -1 5 -2 0 -6 3 -6 -8 -3 13 -4 7 -4 20 -2 8 0 5 -6 5 1 -2 5 7 0 7 -8 -4 -14 -7 3 -5 -1 -5 -2 -5 4 -6 -4 -5 -7 -6 -4 -12 -1 -11 -3 -19 4 -1 10 3 2 -1 7 -22 -3 -3 6 -9 -1 -5 11 9 2 6 14 7 6 2 6z"},
    {"n":"Westmeath","p":"Leinster","d":"M319 270l1 6 -5 2 -8 6 -6 7 1 6 -6 6 -3 6 -6 2 -13 -2 -6 3 -2 10 -3 3 2 9 -1 5 9 4 15 -4 3 -5 5 -2 5 3 5 11 3 -2 4 2 8 -3 10 -8 5 -2 4 -4 11 -6 2 -7 3 -1 7 -24 -7 -3 -4 4 -4 -4 -12 -6 -1 -4 -6 -8 -5 -3z"},
    {"n":"Wexford","p":"Leinster","d":"M399 447l-5 5 2 5 -7 2 -6 5 -1 7 -4 6 -4 10 -6 2 -1 7 -6 12 -2 9 2 3 8 11 3 10 7 -5 4 -5 7 -1 8 2 4 4 11 -4 13 3 5 -10 -8 -9 -7 -2 1 -8 9 0 -1 -6 5 -9 3 -4 8 -13 -1 -20 6 -13 -2 -3 -7 -4 -6 1 -7 -1 -3 3 -4 7 -9 8z"},
    {"n":"Wicklow","p":"Leinster","d":"M412 361l-5 7 -5 10 -6 7 -8 4 -7 12 5 9 0 3 13 4 6 3 3 -1 1 9 -6 4 -9 -5 -3 7 8 13 9 5 9 -8 4 -7 3 -3 7 1 6 -1 7 4 2 3 -1 -4 3 -8 5 -10 7 -15 -5 -8 1 -17 -5 -9 -1 -6 -4 2 -5 -3 -5 2 -5 -3 -6 7 -5 -5z"}],"provinces":{"Leinster":{"d":"M437 292l-2 -2 -3 -13 -1 -16 1 -7 -11 -3 -3 -5 1 -8 2 -7 4 -1 12 5 4 0 3 -4 -1 -5 -4 -1 -11 -10 -1 -1 -2 0 -6 1 -1 6 -6 2 -4 -2 -13 4 4 1 2 8 -5 1 -3 4 0 6 -5 3 -6 -1 -4 4 -10 2 -3 -2 -3 8 4 6 -3 4 -5 2 -15 -5 -6 4 -9 -5 -4 2 -5 3 -6 -5 -4 -8 -5 -4 -6 -8 -8 2 -9 10 -2 7 -5 -2 -8 3 4 7 -5 2 -7 15 0 8 6 12 4 -2 6 2 -6 3 -2 10 -3 3 2 9 -1 5 -6 6 -4 9 7 7 0 5 -10 6 7 6 6 3 3 6 -2 7 -6 11 3 3 -7 10 6 7 12 -11 0 -4 4 -4 9 2 6 7 -4 4 0 8 4 10 4 8 7 4 12 22 0 10 3 3 -4 4 6 7 1 8 2 8 6 4 5 7 6 4 5 -4 5 2 5 1 7 -3 -1 -2 8 11 3 10 7 -5 4 -5 7 -1 8 2 4 4 11 -4 13 3 5 -10 -8 -9 -7 -2 1 -8 9 0 -1 -6 5 -9 3 -4 8 -13 -1 -20 6 -13 -1 -4 3 -8 5 -10 7 -15 -5 -8 1 -17 -5 -9 -1 -6 -2 -4 1 -10 -6 -2 -6 -6 0 -4 10 -6 -2 -8 0 -4 5 -12 -2 -6 -8 -5z","c":[354,375]},"Munster":{"d":"M274 571l2 4 11 2 1 -5 8 -1 5 -2 0 -6 3 -6 -8 -3 13 -4 7 -4 20 -2 8 0 5 -6 5 1 -2 5 7 0 7 -8 -4 -14 -7 3 -5 -1 -5 -2 -5 4 -6 -4 -5 -7 -6 -4 -2 -8 -1 -8 -6 -7 4 -4 -3 -3 0 -10 -12 -22 -7 -4 -4 -8 -4 -10 0 -8 4 -4 -6 -7 -9 -2 -4 4 0 4 -12 11 -6 -7 7 -10 -3 -3 6 -11 2 -7 -3 -6 -6 -3 -7 -6 -6 3 -7 12 -8 14 2 6 -3 2 0 1 -7 7 -9 14 -1 -5 3 -5 -2 -8 10 -1 1 -7 -10 0 -5 -2 -2 -3 -6 -5 -10 0 -5 2 -6 7 -10 0 -2 -14 -10 -6 -2 -5 2 -4 -7 -3 0 5 -9 4 -9 -7 -2 1 -7 11 -10 19 -2 5 8 0 1 3 -7 6 -7 21 -9 2 -4 4 -21 20 -5 1 -7 5 19 -2 5 -2 1 -4 15 -5 8 3 9 2 10 4 3 -4 11 -2 9 -12 4 -8 5 -4 4 14 6 -1 12 4 -3 1 -18 2 -3 4 -8 0 -13 4 -8 4 -9 0 -8 0 -14 0 -4 -1 -6 4 -1 10 -7 6 -10 4 -7 1 1 5 7 3 1 11 -2 10 -3 3 -8 -1 -10 -6 -6 5 -7 1 0 -9 -11 3 -4 5 -5 1 -1 8 -8 -1 -3 6 2 8 4 1 8 -4 8 -2 10 3 14 -3 28 -1 -2 4 -10 1 -4 -2 -2 10 -11 5 -10 1 -14 7 -3 4 4 8 -12 4 -3 7 5 1 0 9 8 -6 3 -4 5 2 0 8 8 8 7 -6 3 1 7 -4 7 0 9 -4 4 -3 11 -4 -2 5 -7 0 -13 14 -6 -1 -7 4 3 5 -5 4 -9 1 2 4 -1 4 -7 2 0 3 7 -2 5 2 9 -4 7 -6 23 -3 9 -6 1 -5 7 5 3 6 -14 4 -2 2 -17 8 -1 7 20 -10 -8 10 -8 4 -5 5 -2 9 11 -5 4 -6 4 3 7 -2 1 -3 8 -2 5 -3 3 2 -2 6 7 6 8 -6 5 4 3 -6 7 -1 2 -3 13 -2 6 3 4 -2 4 -7 9 1 7 3 -1 -7 -5 -5 12 2 10 -2 5 -8 13 -3 7 -7 -1 -13 -3 -10 5 -2 9 4 1 7 -3 1 -2 5 12 0 11 -3 2 -6 12 -4 -4 -5 7 -5zM21 577l-5 -2 -7 4 6 2z","c":[200,514]},"Connacht":{"d":"M254 354l4 -9 6 -6 1 -5 -2 -9 -4 -7 -1 -6 -5 -9 2 -2 -2 -7 5 -5 7 -15 5 -2 -4 -7 8 -3 5 2 2 -7 9 -10 8 -2 2 -8 -1 -7 -15 -13 -6 -3 -2 2 -11 -11 -7 -3 -4 -8 6 -5 4 -5 -6 -10 -7 -4 -8 -10 -1 -4 -8 0 -5 -2 -8 1 -6 4 -16 12 -5 2 0 4 10 0 7 8 -11 1 -2 5 -6 -3 -6 1 -13 0 -6 -4 -11 -1 -4 11 -5 3 0 7 -7 -9 0 -8 -5 -6 -7 -3 -5 4 -14 -3 -17 -2 -8 -3 -6 1 2 6 -5 6 1 5 -5 4 -3 -2 7 -8 -8 -2 -3 -4 -8 5 -3 7 1 5 -4 11 1 5 4 -1 1 -7 3 -6 5 -5 4 14 -3 4 0 5 7 4 0 5 4 4 1 6 -7 3 -2 10 2 5 5 -2 10 -5 14 1 5 5 -6 8 6 4 -19 3 -5 -1 -10 3 0 3 -2 9 1 7 12 7 9 1 -8 0 -8 -3 -7 3 -8 -1 -2 7 -9 -2 -4 4 3 6 4 5 1 6 -9 1 3 5 8 0 2 4 7 1 4 -1 1 -6 5 5 -4 11 5 1 4 4 6 -2 6 -10 7 9 0 8 10 8 6 -1 5 -2 33 -2 5 -2 4 7 5 3 -3 10 -4 1 -2 4 2 5 10 6 2 14 10 0 6 -7 5 -2 10 0 6 5 2 3 5 2 10 0 -1 -4 6 -5 1 -8 8 -1 7 -12 6 -3 10 -6 0 -5zM130 309l4 1 3 9 0 4 5 3 11 4 -2 6 3 7 -4 3 -6 -7 3 -2 -2 -7 -13 -3 -18 -14zM115 303l-1 -5 6 -4 8 -11 2 5 -3 13 -3 3zM137 226l4 4 -2 4 -5 -1 0 -5 -3 -5 1 -8 6 5zM87 359l5 1 2 -3 -3 -5 -5 2zM93 383l-2 -6 -5 -2 -6 3 12 5zM67 238l1 -5 -4 -6 -8 0 -8 3 -4 -1 -4 3 3 4 10 -1 3 2 0 8 3 0 6 6 2 -2z","c":[166,278]},"Ulster":{"d":"M242 156l1 4 8 10 7 4 6 10 -4 5 -6 5 4 8 7 3 11 11 2 -2 6 3 15 13 1 7 -2 8 6 8 5 4 4 8 6 5 5 -3 4 -2 9 5 6 -4 15 5 5 -2 3 -4 -4 -6 3 -8 3 2 10 -2 4 -4 6 1 5 -3 0 -6 3 -4 5 -1 -2 -8 -4 -1 13 -4 4 2 6 -2 1 -6 6 -1 2 0 1 1 8 1 2 3 9 2 4 4 12 -10 4 -12 1 -11 8 -3 9 0 7 -2 5 -7 0 -12 -3 -3 -8 1 3 -10 -1 -9 -7 -8 3 -6 10 8 3 7 0 7 -3 7 6 10 6 -8 -1 -6 3 -7 -4 -8 -1 -9 -4 -5 -2 -9 -4 -4 -12 2 -5 -2 -8 6 -7 7 -2 -4 8 -12 11 -5 3 -6 -1 -10 -5 -5 -4 2 -9 -16 -5 -5 -5 -2 0 -11 -8 -3 2 -7 0 -9 -6 -7 -6 -2 -9 2 -9 -5 -6 2 -6 -3 -4 2 -5 5 -7 1 -11 5 -12 1 -6 -4 -2 3 -1 7 -3 11 -5 5 -7 0 -10 -4 2 -7 6 -7 5 -3 7 -5 8 -4 1 -3 -20 -9 -5 -7 -13 -6 -3 10 -4 4 -4 -1 -6 4 -3 12 7 9 -1 8 3 4 -2 5 -9 0 -2 -4 5 -5 1 -6 -5 -8 -4 -4 0 -6 -3 -5 -11 4 -3 7 4 2 5 -4 3 12 -14 -9 -4 10 -4 -3 -1 -5 -9 -5 -2 5 -13 8 -10 -3 -5 9 1 8 -5 -1 -4 5 -1 5 -4 1 5 7 -3 9 5 2 -2 7 -9 -1 -6 4 2 10 -10 0 -9 6 -7 5 2 7 8 3 2 4 8 0 9 -2 4 4 3 -6 4 6 10 -5 5 1 11 -2 -2 6 -8 6 0 4 -5 4 3 4 -6 4 5 2zM417 150l-3 1 -4 -4 -10 1 -3 -2 -3 -2 8 -14 -1 -13 0 -5 4 -4 1 6 9 1 10 -4 4 4 -5 7 -2 6 4 2 0 4 -6 5zM314 205l-6 3 0 -6 -5 -6 -7 -4 6 -5 4 7 4 1zM292 171l-3 -6 -15 -11 -15 0 4 -6 11 -5 9 1 -1 5 8 13zM211 66l-4 -2 -3 6 8 0z","c":[319,136]}}};
  const IRISH = {
    Antrim: "Aontroim", Armagh: "Ard Mhacha", Carlow: "Ceatharlach", Cavan: "An Cabhán", Clare: "An Clár", Cork: "Corcaigh",
    Derry: "Doire", Donegal: "Dún na nGall", Down: "An Dún", Dublin: "Baile Átha Cliath", Fermanagh: "Fear Manach", Galway: "Gaillimh",
    Kerry: "Ciarraí", Kildare: "Cill Dara", Kilkenny: "Cill Chainnigh", Laois: "Laois", Leitrim: "Liatroim", Limerick: "Luimneach",
    Longford: "An Longfort", Louth: "Lú", Mayo: "Maigh Eo", Meath: "An Mhí", Monaghan: "Muineachán", Offaly: "Uíbh Fhailí",
    Roscommon: "Ros Comáin", Sligo: "Sligeach", Tipperary: "Tiobraid Árann", Tyrone: "Tír Eoghain", Waterford: "Port Láirge",
    Westmeath: "An Iarmhí", Wexford: "Loch Garman", Wicklow: "Cill Mhantáin"
  };
  const PROV = {
    Leinster: { ga: "Laighin", count: 12 }, Munster: { ga: "An Mhumhain", count: 6 },
    Connacht: { ga: "Connachta", count: 5 }, Ulster: { ga: "Ulaidh", count: 9 }
  };
  const PROV_ORDER = ["Ulster", "Connacht", "Leinster", "Munster"];
  const COUNTIES = MAP.counties;
  const TOTAL = 10;
  const KEY = "pid.counties";
  const MODES = {
    county: { label: "Find the county", ask: "Find" },
    province: { label: "Pick the province (easier)", ask: "Which province is" }
  };

  const ls = {
    load() { try { return Object.assign({ best: {}, played: 0, mode: "county" }, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { return { best: {}, played: 0, mode: "county" }; } },
    save(N) { try { localStorage.setItem(KEY, JSON.stringify(N)); } catch (e) { /* still playable */ } }
  };
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const nice = (n) => n === "Derry" ? "Derry (Londonderry)" : n;
  const cty = (n) => `County ${nice(n)}`;

  window.PID_COUNTIES = function (A) {
    const { esc } = A;
    let N = ls.load();
    let game = null; // { mode, order, round, score, pick, answered, picks: [{ok, pick}] }

    function newGame(mode) {
      const order = shuffle(COUNTIES.map((_, i) => i)).slice(0, TOTAL);
      game = { mode, order, round: 0, score: 0, pick: null, answered: false, picks: [] };
      N.mode = mode; ls.save(N);
    }

    // The map. In county mode every county can be tapped; in province mode the four provinces are tapped.
    function mapSvg(opts) {
      const o = opts || {};
      const cls = (c) => {
        const k = ["cm-c", "p-" + c.p.toLowerCase()];
        if (o.mode === "province" || o.shadeProv) k.push("prov");
        if (o.mark && o.mark[c.n]) k.push(o.mark[c.n]);
        return k.join(" ");
      };
      const counties = COUNTIES.map((c, i) => `<path class="${cls(c)}" d="${c.d}" ${o.mode === "county" ? `data-cm="${i}"` : ""}/>`).join("");
      const provs = o.mode === "province"
        ? PROV_ORDER.map((p) => `<path class="cm-p${o.provMark && o.provMark[p] ? " " + o.provMark[p] : ""}" d="${MAP.provinces[p].d}" data-cmp="${p}"/>`).join("")
        : "";
      const labels = o.provLabels ? PROV_ORDER.map((p) => { const [x, y] = MAP.provinces[p].c; return `<text class="cm-lab" x="${x}" y="${y}">${p}</text>`; }).join("") : "";
      return `<svg class="cm-map${o.small ? " small" : ""}" viewBox="0 0 ${MAP.w} ${MAP.h}" role="img" aria-label="Map of the island of Ireland with its 32 counties">${counties}${provs}${labels}</svg>`;
    }

    function bestText(mode) { const b = (N.best || {})[mode]; return b ? `Your best: ${b} of ${TOTAL}` : ""; }

    function screen() {
      N = ls.load();
      const head = { title: "Irish counties", tab: "home", back: true };
      if (!game) {
        return Object.assign(head, { html: `
          <section class="card nd-intro">
            ${mapSvg({ shadeProv: true, small: true, provLabels: true })}
            <h3>Can you find the counties of Ireland?</h3>
            <p class="muted">We'll name ${TOTAL} of Ireland's 32 counties. Tap each one on the map. Lots of feiseanna and dance schools are named after them!</p>
            <div class="stack">
              <button type="button" class="btn block" data-cm-start="county">Find the county</button>
              <button type="button" class="btn ghost block" data-cm-start="province">Easier: pick the province</button>
            </div>
            ${N.best && (N.best.county || N.best.province) ? `<p class="small muted" style="margin:10px 0 0">${N.best.county ? `Counties best: ${N.best.county} of ${TOTAL}` : ""}${N.best.county && N.best.province ? " · " : ""}${N.best.province ? `Provinces best: ${N.best.province} of ${TOTAL}` : ""}</p>` : ""}
          </section>
          <section class="card">
            <h3 style="margin-top:0">The four provinces</h3>
            <p class="small muted" style="margin:0">Ireland's 32 counties are grouped into four provinces: Ulster (Ulaidh) in the north, Connacht (Connachta) in the west, Leinster (Laighin) in the east and Munster (An Mhumhain) in the south. Six of Ulster's counties are in Northern Ireland.</p>
          </section>` });
      }
      if (game.round >= TOTAL) {
        const sc = game.score;
        return Object.assign(head, { html: `
          <section class="card tq-done">
            <div class="tq-big">${sc === TOTAL ? "☘️☘️☘️" : sc >= 7 ? "☘️☘️" : "☘️"}</div>
            <h3>${sc} of ${TOTAL} right</h3>
            <p class="muted">${sc === TOTAL ? "Perfect! You know your way around Ireland." : sc >= 7 ? "Great job! You'd make a fine tour guide." : "Have another go. The map gets easier every time."}</p>
            <p class="small">${esc(bestText(game.mode) || "")}</p>
            <div class="stack">
              <button type="button" class="btn block" data-cm-start="${game.mode}">Play again</button>
              <button type="button" class="btn ghost block" data-cm-start="${game.mode === "county" ? "province" : "county"}">${game.mode === "county" ? "Try the province game" : "Try finding the counties"}</button>
            </div>
          </section>
          <h3 class="tq-review-h">This round's counties</h3>
          ${game.order.map((ci, i) => { const c = COUNTIES[ci]; const r = game.picks[i] || {}; return `<div class="card tq-review"><strong>${r.ok ? "✓" : "✗"} ${esc(cty(c.n))}</strong> <span class="small muted">(${esc(IRISH[c.n])})</span><div class="small muted">In ${esc(c.p)}${r.ok ? "." : game.mode === "county" ? `. You tapped ${esc(nice(COUNTIES[r.pick].n))}.` : `. You picked ${esc(r.pick)}.`}</div></div>`; }).join("")}` });
      }
      const c = COUNTIES[game.order[game.round]];
      const q = game.mode === "county"
        ? `Find <strong>${esc(cty(c.n))}</strong>`
        : `Which province is <strong>${esc(cty(c.n))}</strong> in?`;
      return Object.assign(head, { html: `
        <div class="row between ws-stats small"><span>County ${game.round + 1} of ${TOTAL}</span><span>${game.score} right</span></div>
        <div class="tq-dots">${game.order.map((_, i) => `<i class="${i < game.round ? (game.picks[i].ok ? "ok" : "no") : i === game.round ? "now" : ""}"></i>`).join("")}</div>
        <p class="cm-q">${q}</p>
        <div class="cm-wrap" id="cmWrap">${mapSvg({ mode: game.mode, provLabels: false })}</div>
        <div id="cmBar" class="cm-bar"><p class="small muted" style="margin:0;text-align:center">${game.mode === "county" ? "Tap a county on the map" : "Tap a province on the map"}</p></div>` });
    }

    // Select (first tap), so a slip of the finger on a small county can be fixed before checking.
    function select(v) {
      if (!game || game.answered) return;
      game.pick = v;
      const wrap = document.getElementById("cmWrap"); if (!wrap) return;
      wrap.querySelectorAll(".sel").forEach((el) => el.classList.remove("sel"));
      const sel = game.mode === "county" ? `[data-cm="${v}"]` : `[data-cmp="${v}"]`;
      const el = wrap.querySelector(sel); if (el) { el.classList.add("sel"); el.parentNode.appendChild(el); }
      const label = game.mode === "county" ? "This one" : esc(v);
      document.getElementById("cmBar").innerHTML = `<button type="button" class="btn block" data-cm-check>${game.mode === "county" ? "Check my answer" : `Check: ${label}`}</button>`;
    }

    function check() {
      if (!game || game.answered || game.pick === null) return;
      const ci = game.order[game.round]; const c = COUNTIES[ci];
      const ok = game.mode === "county" ? game.pick === ci : game.pick === c.p;
      game.answered = true; game.picks[game.round] = { ok, pick: game.pick }; if (ok) game.score++;
      const wrap = document.getElementById("cmWrap");
      if (game.mode === "county") {
        const mark = { [c.n]: "right" }; if (!ok) mark[COUNTIES[game.pick].n] = "wrong";
        wrap.innerHTML = mapSvg({ mode: "done", mark });
      } else {
        const provMark = { [c.p]: "right" }; if (!ok) provMark[game.pick] = "wrong";
        wrap.innerHTML = mapSvg({ mode: "province", provMark, mark: { [c.n]: "target" } });
      }
      const last = game.round + 1 >= TOTAL;
      const wrongName = game.mode === "county" && !ok ? nice(COUNTIES[game.pick].n) : null;
      const head = ok ? "Yes! 😀" : game.mode === "county" ? `That's ${esc(wrongName)}. ${esc(nice(c.n))} is shown in teal.` : `Not quite. It's in ${esc(c.p)}.`;
      document.getElementById("cmBar").innerHTML = `<div class="tq-why"><p><strong>${head}</strong> ${esc(cty(c.n))} (${esc(IRISH[c.n])} in Irish) is in ${esc(c.p)} (${esc(PROV[c.p].ga)}), one of its ${PROV[c.p].count} counties.</p><button type="button" class="btn block" data-cm-next>${last ? "See my score" : "Next county"}</button></div>`;
      if (navigator.vibrate) try { navigator.vibrate(ok ? 15 : [10, 40, 10]); } catch (e) { /* ignore */ }
      try { document.getElementById("cmBar").scrollIntoView({ behavior: "smooth", block: "end" }); } catch (e) { /* ignore */ }
    }

    function next() {
      game.round++; game.answered = false; game.pick = null;
      if (game.round >= TOTAL) {
        N.played = (N.played || 0) + 1;
        N.best = N.best || {};
        const prev = N.best[game.mode] || 0;
        const newBest = game.score > prev;
        if (newBest) N.best[game.mode] = game.score;
        ls.save(N);
        if (game.score === TOTAL && window.PID_CELEBRATE) setTimeout(() => window.PID_CELEBRATE("Perfect!", `All ${TOTAL} counties right. ☘️`, { shamrocks: true }), 300);
        else if (newBest && prev) A.toast(`New best: ${game.score} of ${TOTAL}`);
      }
      A.rerender();
      try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }
    }

    document.getElementById("app").addEventListener("click", (e) => {
      const t = e.target.closest("[data-cm-start], [data-cm], [data-cmp], [data-cm-check], [data-cm-next]"); if (!t) return;
      if (t.dataset.cmStart !== undefined) { newGame(t.dataset.cmStart === "province" ? "province" : "county"); A.rerender(); try { window.scrollTo(0, 0); } catch (err) { /* ignore */ } return; }
      if (t.dataset.cm !== undefined) { select(Number(t.dataset.cm)); return; }
      if (t.dataset.cmp !== undefined) { select(t.dataset.cmp); return; }
      if (t.dataset.cmCheck !== undefined) { check(); return; }
      if (t.dataset.cmNext !== undefined) next();
    });
    window.addEventListener("hashchange", () => { if (!/^#\/games\/counties/.test(location.hash)) game = null; });
    window.PID_COUNTIES.current = () => game; // for tests
    window.PID_COUNTIES.data = () => ({ COUNTIES, PROV }); // for tests

    return {
      screen,
      status() {
        N = ls.load(); const b = N.best || {};
        if (!b.county && !b.province) return "Tap 10 counties on the map";
        return [b.county ? `Counties best: ${b.county} of ${TOTAL}` : "", b.province ? `Provinces best: ${b.province} of ${TOTAL}` : ""].filter(Boolean).join(" · ");
      }
    };
  };
})();
