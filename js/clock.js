// Time in the game is minutes since midnight on Sunday 12 October 1890.

export const START = 8 * 60 + 40;                 // Sunday, twenty to nine
export const DEADLINE = 5 * 1440 + 17 * 60;       // Friday 5 p.m.: the quarry leaves England
export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const dayOf = (t) => Math.floor(t / 1440);
export const hourOf = (t) => (t % 1440) / 60;

export function clockText(t) {
  const d = dayOf(t);
  const m = Math.floor(t % 1440);
  let h = Math.floor(m / 60);
  const min = m % 60;
  const ampm = h >= 12 ? 'p.m.' : 'a.m.';
  h = h % 12 || 12;
  return `${DAY_NAMES[d % 7]} ${12 + d} October, ${h}.${String(min).padStart(2, '0')} ${ampm}`;
}

export function shortClock(t) {
  const m = Math.floor(t % 1440);
  let h = Math.floor(m / 60);
  const min = m % 60;
  const ampm = h >= 12 ? 'pm' : 'am';
  h = h % 12 || 12;
  return `${h}:${String(min).padStart(2, '0')} ${ampm}`;
}

export const dayName = (t) => DAY_NAMES[dayOf(t) % 7];

export function money(s) {
  const pounds = Math.floor(s / 20);
  const shillings = s % 20;
  if (pounds && shillings) return `£${pounds} ${shillings}s`;
  if (pounds) return `£${pounds}`;
  return `${shillings}s`;
}

/** If the time falls in the small hours, jump to the next morning. Returns [newTime, slept]. */
export function sleepIfLate(t) {
  const h = hourOf(t);
  if (h >= 23 || h < 6) {
    const day = h < 6 ? dayOf(t) : dayOf(t) + 1;
    return [day * 1440 + 8 * 60, true];
  }
  return [t, false];
}
