// The verdict, the points, and the report on the most ideal way to have done it.
import { FACTS, CONTRADICTIONS } from './case/facts.js';
import { PEOPLE } from './case/world.js';
import { weighEvidence } from './evidence.js';
import { hasFact, hasFlag, deadlineNow } from './state.js';
import { START, clockText, dayOf } from './clock.js';

export const SUSPECTS = ['sir_alistair', 'pell', 'ashby', 'gradwell', 'mary', 'reeve', 'pargeter', 'tull'];

export const RANKS = [
  [900, 'The Consulting Detective', 'Even Mycroft would call that elegant.'],
  [750, 'Gentleman Consultant', 'Few in London could have done it so cleanly.'],
  [550, 'Hansom-cab Detective', 'The right man, by a respectable road.'],
  [300, 'Scotland Yard Constable', 'Justice was done, if by the long way round.'],
  [0, 'Amateur Enquirer', 'You have the right instinct. Now sharpen the method.'],
];
export const rankFor = (n) => RANKS.find((r) => n >= r[0]);

export function accuse(s, suspect, verdict = null) {
  const ev = weighEvidence(s);
  const contradictions = CONTRADICTIONS.filter((c) => hasFact(s, c.a) && hasFact(s, c.b));
  const used = s.t - START;
  const budget = deadlineNow(s) - START;
  const r = { suspect, correct: suspect === 'pell', verdict, ev, contradictions, parts: [], total: 0, kind: null };

  if (!r.correct) {
    r.kind = 'wrong';
    const accused = PEOPLE[suspect]?.name ?? 'an innocent man';
    r.parts.push({ label: 'Evidence', pts: 0, max: 350, note: 'Nothing in the casebook points at ' + accused + '.' });
    r.total = Math.min(60, contradictions.length * 10);
    r.parts.push({ label: 'Insight', pts: r.total, max: 150, note: 'Contradictions you exposed along the way.' });
    r.rank = rankFor(r.total);
    return r;
  }
  r.kind = s.fled ? 'fled' : 'solved';
  const evPts = { airtight: 350, sound: 250, thin: 100, flimsy: 20, none: 0 }[ev.grade];
  const fac = { airtight: 1, sound: 0.85, thin: 0.5, flimsy: 0.25, none: 0.1 }[ev.grade];   // a lucky guess earns little for being quick
  const speed = Math.round(fac * 200 * Math.max(0, 1 - used / budget) ** 0.8);
  const economy = Math.round(fac * Math.max(0, Math.round(100 - s.stats.spent * 0.9 - Math.min(30, s.hints * 5))));
  const insight = Math.min(150, contradictions.length * 30);
  const recovered = hasFlag(s, 'stone_found');
  const recovery = recovered ? 100 : 0;
  const informed = hasFact(s, 'pell_sister') || hasFact(s, 'sister_matron') || hasFact(s, 'pell_debt');
  let verdictPts = 0, vnote = '';
  if (r.kind === 'fled') { verdictPts = 0; vnote = 'He was beyond your reach before you named him.'; }
  else if (verdict === 'mercy') { verdictPts = informed ? 90 : 50; vnote = informed ? 'A mercy given knowing what drove him to it.' : 'A mercy given without knowing the reasons for it.'; }
  else if (verdict === 'prosecute') { verdictPts = 70; vnote = 'The law takes its course.'; }
  verdictPts = Math.round(verdictPts * (ev.grade === 'airtight' || ev.grade === 'sound' ? 1 : fac + 0.25));
  r.parts.push({ label: 'Evidence', pts: evPts, max: 350, note: `Your case was ${ev.grade}.` });
  r.parts.push({ label: 'Speed', pts: speed, max: 200, note: `Solved in ${formatSpan(used)} of the ${formatSpan(budget)} allowed.` });
  r.parts.push({ label: 'Economy', pts: economy, max: 100, note: `You spent ${s.stats.spent}s${s.hints ? ` and asked Watson for ${s.hints} nudge${s.hints > 1 ? 's' : ''}` : ''}.` });
  r.parts.push({ label: 'Insight', pts: insight, max: 150, note: `${contradictions.length} of ${CONTRADICTIONS.length} lies exposed.` });
  r.parts.push({ label: 'Recovery', pts: recovery, max: 100, note: recovered ? 'The Marlowe Star was recovered.' : 'The stone was not recovered.' });
  r.parts.push({ label: 'Verdict', pts: verdictPts, max: 100, note: vnote });
  r.total = Math.min(1000, r.parts.reduce((a, p) => a + p.pts, 0));
  r.rank = rankFor(r.total);
  return r;
}

export function escaped(s) {
  const ev = weighEvidence(s);
  const total = { airtight: 120, sound: 80, thin: 40, flimsy: 10, none: 0 }[ev.grade] + Math.min(60, 12 * CONTRADICTIONS.filter((c) => hasFact(s, c.a) && hasFact(s, c.b)).length);
  return { kind: 'escaped', ev, total, rank: rankFor(total), parts: [{ label: 'Evidence', pts: total, max: 350, note: 'Pell sailed at five.' }] };
}

export function formatSpan(m) {
  const d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60), mm = Math.round(m % 60);
  const parts = [];
  if (d) parts.push(`${d} day${d > 1 ? 's' : ''}`);
  if (h) parts.push(`${h} h`);
  if (!d && mm) parts.push(`${mm} min`);
  return parts.join(' ') || '0 min';
}

// ---------------------------------------------------------------- epilogues
export function epilogue(r, s) {
  if (r.kind === 'wrong') {
    const who = PEOPLE[r.suspect]?.name ?? 'the wrong man';
    return [
      `You name ${who}. Lestrade, ever willing, makes the arrest. By the evening ${who.split(' ').pop()} has been released with an apology, and Pell, who had been sitting very still in the corner of the room, has quietly gone.`,
      'The Marlowe Star is not seen again in England. It is a long time before you can look at a blue-white stone without remembering it.',
    ];
  }
  if (r.kind === 'fled') {
    return ['You name Julian Pell, and the room is silent. It is Watson who says it: the boat sailed an hour since.', 'The Star is not recovered. Lestrade sends a wire to the Antwerp police, and they sit in London and wait for an answer that does not come.'];
  }
  const recovered = hasFlag(s, 'stone_found');
  const lines = [];
  lines.push(recovered
    ? 'Sir Alistair weeps openly, and sets the Marlowe Star back in its safe with his own hands, and for the first time in his life checks the key twice.'
    : 'Pell is taken. The Marlowe Star is not at once to be found; Lestrade will spend a week in the pawnshops of Lambeth before he sees it again.');
  if (r.verdict === 'mercy') {
    lines.push('You let him go. You say nothing of your reasons, and Lestrade, who has learned not to ask, closes his notebook. Julian Pell leaves for Torquay by the night train. A year later a card comes to Baker Street from a village in Devon: “Hannah is better. I shall not forget.”');
    lines.push('Watson says nothing for a long time, and then puts the kettle on, which, for Watson, is a speech.');
  } else {
    lines.push('Lestrade takes him down in a four-wheeler. At the Old Bailey the evidence holds, as evidence you gathered holds. He is sentenced to five years’ penal servitude, and writes to his sister every week from Pentonville.');
    lines.push('Watson publishes it in the Strand, under the title of “The Adventure of the Blue-White Diamond”. You are rather annoyed. The royalties are not unwelcome.');
  }
  return lines;
}

// ---------------------------------------------------------------- the ideal route
export const IDEAL_COMMANDS = [
  'go to marlowe house',
  'interview sir alistair',
  'ask sir alistair about the key',
  'ask sir alistair about pell',
  'ask mary gently what she saw on the back stairs',
  'ask reeve about the men who called at the door',
  'examine under the desk',
  'ask pell gently about his sister',
  'go home',
  'compare the note with joynson',
  'go to percy street',
  'ask mrs hodge gently about her lodger',
  'examine the books',
];

export const IDEAL_NARRATIVE = [
  ['Marlowe House first, and Sir Alistair himself', 'He holds the one thing the thief handled: the note. Take it, and let him tell you who sat at the table and where the key lives.'],
  ['The maid, not the master', 'Mary Dunn passed Pell on the back stairs. A girl who is afraid will tell it to a man who is kind. Sharpness would have shut her up.'],
  ['Money and a sister', 'Reeve saw the moneylender’s men at the door; Pell, spoken to gently, speaks of his dying sister. Those two together are a motive.'],
  ['The scrap behind the desk, and the paper', 'The torn corner and the note itself share a crown watermark. At Baker Street, Joynson’s Crown Laid is found in minutes.'],
  ['The landlady, kindly', 'Mrs. Hodge will let a courteous caller up. The hollow Debrett holds the Star, and nobody has been warned.'],
];

export function reportLines(s, r) {
  const missed = [];
  const key = [
    ['mary_stairs', 'The maid on the back stairs placed Pell at the scene.'],
    ['tench_dup', 'The Clerkenwell locksmith made a second key for Pell.'],
    ['paper_ledger_pell', 'Peabody’s ledger tied Pell to the paper.'],
    ['hand_matches_pell', 'Finch would have sworn the disguised hand was Pell’s.'],
    ['pell_debt', 'Crake held Pell’s note for £300.'],
    ['pell_sister', 'Pell’s dying sister explains the debt.'],
    ['boat_booked', 'The booked steamer as “Mr. J. Peters” showed he meant to run.'],
    ['stone_debretts', 'The Star itself lay in a hollowed Debrett’s at Percy Street.'],
  ];
  for (const [f, txt] of key) if (!hasFact(s, f)) missed.push(txt);
  return missed;
}
