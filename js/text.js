// Small, dependency-free helpers for understanding what the player types.

const STOP = new Set((
  'the a an to of for and at in on my me i please would could you your is are was were be that this it with ' +
  'about from some any do did does can will shall let us we our by if so then there what who where when how why ' +
  'he she they his her him them mr mrs miss sir dr lady lord just also very quite rather much good old'
).split(' '));

export function norm(s) {
  return String(s ?? '')
    .toLowerCase()
    .replace(/[’`]/g, "'")
    .replace(/'s\b/g, '')
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9£\- ]+/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function stem(w) {
  if (w.length <= 3) return w;
  if (w.endsWith('ies') && w.length > 4) return w.slice(0, -3) + 'y';
  if (/(ss|us|is)$/.test(w)) return w;
  if (w.endsWith('ing') && w.length > 5) return w.slice(0, -3);
  if (w.endsWith('ed') && w.length > 4) return w.slice(0, -2);
  if (w.endsWith('s') && w.length > 3) return w.slice(0, -1);
  return w;
}

export function tokens(text) {
  return norm(text).split(' ').filter(Boolean).map(stem);
}

export function contentTokens(text) {
  return norm(text).split(' ').filter((w) => w && !STOP.has(w)).map(stem);
}

export function lev(a, b) {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (Math.abs(m - n) > 2) return 3;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

/** Do two stemmed words match, allowing a typo in longer words? */
export function same(a, b) {
  if (a === b) return true;
  const len = Math.min(a.length, b.length);
  if (len < 5) return false;
  return lev(a, b) <= (len >= 9 ? 2 : 1);
}

const phraseCache = new Map();
export function phraseTokens(phrase) {
  let t = phraseCache.get(phrase);
  if (!t) {
    t = norm(phrase).split(' ').filter(Boolean).map(stem);
    phraseCache.set(phrase, t);
  }
  return t;
}

/** Index in `toks` where the phrase starts, or -1. `used` marks tokens already consumed. */
export function findPhrase(toks, phrase, used = null) {
  const p = phraseTokens(phrase);
  if (!p.length) return -1;
  for (let i = 0; i + p.length <= toks.length; i++) {
    let ok = true;
    for (let j = 0; j < p.length; j++) {
      if ((used && used[i + j]) || !same(toks[i + j], p[j])) { ok = false; break; }
    }
    if (ok) return i;
  }
  return -1;
}

export const hasAny = (toks, phrases) => phrases.some((p) => findPhrase(toks, p) >= 0);
export const countAny = (toks, phrases) => phrases.filter((p) => findPhrase(toks, p) >= 0).length;

export function titleCase(s) {
  return s.replace(/\b[a-z]/g, (c) => c.toUpperCase());
}
