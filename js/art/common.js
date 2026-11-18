// Shared bits for the SVG painters.
export function rng(seed) {
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const PAL = {
  walnut: '#3a2416', walnutLt: '#5a3a22', oxblood: '#5a1418', oxbloodLt: '#7d1f25', brass: '#c9a24a', brassDk: '#8a6a2a',
  gas: '#ffd58a', ink: '#12100e', fog: '#9aa7b3', night: '#0d1420', parchment: '#e9dcbd', green: '#1f3a2c', greenLt: '#2f5a43',
};

/** Hotspot: an invisible, clickable region that feeds a command to the game. */
export function hot(x, y, w, h, cmd, label, round = 0) {
  return `<g class="hot" data-cmd="${esc(cmd)}" tabindex="0" role="button" aria-label="${esc(label)}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${round}" class="hot-r"/><text x="${x + w / 2}" y="${y - 10}" class="hot-t" text-anchor="middle">${esc(label)}</text></g>`;
}

export function booksRow(x, y, w, h, seed, palette) {
  const r = rng(seed);
  let out = '', cx = x;
  const cols = palette || ['#5a1418', '#1f3a2c', '#3a2416', '#2a2f4a', '#6a4a1e', '#3b1f2a', '#24403a', '#7a5a2a'];
  while (cx < x + w - 6) {
    const bw = 8 + r() * 14, bh = h * (0.72 + r() * 0.26);
    const c = cols[Math.floor(r() * cols.length)];
    out += `<rect x="${cx.toFixed(1)}" y="${(y + h - bh).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" fill="${c}" stroke="#0a0806" stroke-width="1"/>`;
    out += `<rect x="${(cx + 1.5).toFixed(1)}" y="${(y + h - bh + 6).toFixed(1)}" width="${(bw - 3).toFixed(1)}" height="2" fill="${PAL.brass}" opacity=".55"/>`;
    if (bh > h * 0.8) out += `<rect x="${(cx + 1.5).toFixed(1)}" y="${(y + h - 14).toFixed(1)}" width="${(bw - 3).toFixed(1)}" height="1.6" fill="${PAL.brass}" opacity=".4"/>`;
    cx += bw + 0.6;
  }
  return out;
}

/** A hanging gas bracket with a glowing mantle. */
export function gasLamp(x, y, id = 'g') {
  return `<g>
  <circle cx="${x}" cy="${y}" r="120" fill="url(#gasGlow)" class="gaspulse"/>
  <path d="M${x - 20} ${y + 40} q20 -50 40 0" fill="none" stroke="${PAL.brassDk}" stroke-width="5"/>
  <path d="M${x - 14} ${y + 6} h28 l-6 26 h-16z" fill="#f3e2b4" opacity=".92"/>
  <path d="M${x - 14} ${y + 6} h28" stroke="${PAL.brass}" stroke-width="4"/>
  <ellipse cx="${x}" cy="${y + 20}" rx="10" ry="14" fill="#fff7d8"/>
  </g>`;
}

export const SHARED_DEFS = `
<defs>
  <radialGradient id="gasGlow"><stop offset="0" stop-color="#ffd58a" stop-opacity=".65"/><stop offset=".4" stop-color="#ffb04a" stop-opacity=".2"/><stop offset="1" stop-color="#ffb04a" stop-opacity="0"/></radialGradient>
  <radialGradient id="fireGlow"><stop offset="0" stop-color="#ff9a3a" stop-opacity=".75"/><stop offset=".5" stop-color="#e0561c" stop-opacity=".25"/><stop offset="1" stop-color="#e0561c" stop-opacity="0"/></radialGradient>
  <radialGradient id="vignette" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".78"/></radialGradient>
  <linearGradient id="woodGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a3a22"/><stop offset="1" stop-color="#2a180c"/></linearGradient>
  <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2416"/><stop offset="1" stop-color="#150c07"/></linearGradient>
  <linearGradient id="velvet" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3a0c10"/><stop offset=".5" stop-color="#7d1f25"/><stop offset="1" stop-color="#3a0c10"/></linearGradient>
  <linearGradient id="skyDay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8d9aa6"/><stop offset="1" stop-color="#c9ccc4"/></linearGradient>
  <linearGradient id="skyDusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4160"/><stop offset="1" stop-color="#c68a58"/></linearGradient>
  <linearGradient id="skyNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b14"/><stop offset="1" stop-color="#1c2a40"/></linearGradient>
  <linearGradient id="ray" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cfd9e6" stop-opacity=".28"/><stop offset="1" stop-color="#cfd9e6" stop-opacity="0"/></linearGradient>
  <pattern id="damask" width="80" height="100" patternUnits="userSpaceOnUse">
    <rect width="80" height="100" fill="#4a1014"/>
    <g fill="#6a1a20" opacity=".9"><path d="M40 10 c10 12 10 26 0 38 c-10 -12 -10 -26 0 -38z"/><path d="M0 60 c10 12 10 26 0 38 c-10 -12 -10 -26 0 -38z"/><path d="M80 60 c10 12 10 26 0 38 c-10 -12 -10 -26 0 -38z"/></g>
    <g fill="none" stroke="#a8802e" stroke-width="1.2" opacity=".55"><path d="M40 52 q-18 8 -26 24 M40 52 q18 8 26 24"/><circle cx="40" cy="52" r="3"/><path d="M0 10 q12 4 20 -4 M80 10 q-12 4 -20 -4"/></g>
  </pattern>
  <pattern id="wallGreen" width="60" height="60" patternUnits="userSpaceOnUse">
    <rect width="60" height="60" fill="#1d3527"/><path d="M0 30 h60 M30 0 v60" stroke="#24412f" stroke-width="1"/><circle cx="30" cy="30" r="3" fill="#2a4a37"/>
  </pattern>
  <pattern id="planks" width="140" height="46" patternUnits="userSpaceOnUse"><rect width="140" height="46" fill="#3a2416"/><path d="M0 1h140M0 24h140M70 1v23M25 24v22M110 24v22" stroke="#1a0e08" stroke-width="2"/><path d="M0 12h60M80 36h60" stroke="#4d321e" stroke-width="1" opacity=".5"/></pattern>
  <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 6 L6 0" stroke="#000" stroke-width=".7" opacity=".28"/></pattern>
  <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter>
  <filter id="soft2"><feGaussianBlur stdDeviation="2.2"/></filter>
  <filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0"/></filter>
</defs>`;

export function lightTint(hour) {
  // returns { sky, overlay, lamp } for a given hour of day
  if (hour >= 7 && hour < 16.5) return { sky: 'skyDay', overlay: 'rgba(30,40,60,.12)', night: 0 };
  if (hour >= 16.5 && hour < 19) return { sky: 'skyDusk', overlay: 'rgba(80,40,20,.2)', night: 0.35 };
  return { sky: 'skyNight', overlay: 'rgba(6,10,28,.42)', night: 1 };
}

export function dustAndFog(w, h, seed = 3) {
  const r = rng(seed);
  let motes = '';
  for (let i = 0; i < 34; i++) {
    const x = r() * w, y = r() * h * 0.8, s = 1 + r() * 2.2, d = 6 + r() * 12, dl = -r() * 14;
    motes += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${s.toFixed(1)}" class="mote" style="animation-duration:${d.toFixed(1)}s;animation-delay:${dl.toFixed(1)}s"/>`;
  }
  return `<g class="motes">${motes}</g>
  <g class="fogband"><ellipse cx="400" cy="${h - 30}" rx="900" ry="80" fill="#cfd8e0" opacity=".08"/><ellipse cx="1200" cy="${h - 10}" rx="900" ry="90" fill="#cfd8e0" opacity=".07"/></g>`;
}

export function finish(w, h) {
  return `<rect width="${w}" height="${h}" fill="url(#vignette)" pointer-events="none"/>
  <rect width="${w}" height="${h}" filter="url(#grain)" opacity=".16" pointer-events="none" style="mix-blend-mode:multiply"/>`;
}
