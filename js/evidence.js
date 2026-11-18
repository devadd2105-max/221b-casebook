// What the casebook adds up to.
import { FACTS, CONTRADICTIONS } from './case/facts.js';

export const KINDS = ['means', 'motive', 'opportunity', 'identity'];

export function weighEvidence(state, suspect = 'pell') {
  const by = { means: 0, motive: 0, opportunity: 0, identity: 0 };
  let misleading = 0;
  const items = [];
  for (const id of Object.keys(state.facts)) {
    const f = FACTS[id];
    if (!f) continue;
    if (f.kind === 'claim' && f.truth === false) continue; // a lie is only evidence once it is refuted
    if (f.tags && suspect === 'pell') {
      for (const k of KINDS) if (f.tags[k]) { by[k] += f.tags[k]; items.push({ id, k, w: f.tags[k] }); }
    }
  }
  const capped = {};
  let total = 0, cats = 0;
  for (const k of KINDS) { capped[k] = Math.min(3, by[k]); total += capped[k]; if (capped[k] >= 1) cats++; }
  let grade = 'none';
  if (total >= 10 && cats >= 4) grade = 'airtight';
  else if (total >= 7 && cats >= 3) grade = 'sound';
  else if (total >= 3) grade = 'thin';
  else if (total > 0) grade = 'flimsy';
  return { by: capped, raw: by, total, cats, grade, misleading, items };
}

export const GRADE_RANK = { none: 0, flimsy: 1, thin: 2, sound: 3, airtight: 4 };
export const atLeast = (grade, min) => GRADE_RANK[grade] >= GRADE_RANK[min];

export function exposedContradictions(state) {
  return CONTRADICTIONS.filter((c) => state.facts[c.a] && state.facts[c.b]);
}

/** Which red herrings has Holmes properly cleared? */
export function clearedPeople(state) {
  const out = new Set();
  for (const id of Object.keys(state.facts)) {
    const f = FACTS[id];
    if (f?.clears) f.clears.forEach((p) => out.add(p));
  }
  return [...out];
}
