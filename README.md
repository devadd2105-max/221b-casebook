# Casebook 221B: The Marlowe Star

A browser detective game played entirely as Sherlock Holmes, starting in the sitting room at 221B Baker Street, Sunday 12 October 1890.

Sir Alistair Marlowe's diamond has vanished from a locked safe. You have a telegram and five days. There is no menu of choices: type anything you would say or do.

> ask Mary what she saw on the back stairs; then go to Peabody & Sons

## How it plays

- **Free text.** Questions, travel, examinations, telegrams, tailing a suspect, waiting, accusing. Typos are forgiven; commands can be chained with `;` or `then`.
- **Open investigation.** Interview anyone, search the study, send Watson to the papers (you pick which), cross-reference the note's paper against five makers, wire Mycroft, hire the Baker Street Irregulars.
- **A living clock.** Cab fares, travel time, shop hours, people's schedules, and a thief who grows wary.
- **The ending is yours.** Name the culprit, then hand him to Lestrade or let him go. A 1000-point score and a report on the most ideal route follow.

## Run it

No build step. Serve the folder and open `index.html`:

    python3 -m http.server 8000

## Test

    node --test tests/play.test.mjs

## Notes

Witnesses are scripted: a data-driven option registry with fuzzy parsing of topic, tone, names, offers and times, not a live language model. Design notes are in `docs/DESIGN.md`. More cases are planned.

MIT licensed.
