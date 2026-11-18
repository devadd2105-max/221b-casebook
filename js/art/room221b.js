// 221B Baker Street: the sitting room, painted in SVG.
import { SHARED_DEFS, PAL, hot, booksRow, gasLamp, lightTint, dustAndFog, finish, rng } from './common.js';

function rain(x, y, w, h, n, seed) {
  const r = rng(seed);
  let s = '';
  for (let i = 0; i < n; i++) {
    const px = x + r() * w, py = y + r() * h, l = 14 + r() * 26, d = 0.45 + r() * 0.5, dl = -r() * 2;
    s += `<line x1="${px.toFixed(0)}" y1="${py.toFixed(0)}" x2="${(px - 4).toFixed(0)}" y2="${(py + l).toFixed(0)}" class="rain" style="animation-duration:${d.toFixed(2)}s;animation-delay:${dl.toFixed(2)}s"/>`;
  }
  return s;
}

function windowArt(t) {
  const x = 150, y = 120, w = 330, h = 400;
  const night = t.night;
  const street = `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${t.sky})"/>
    <g opacity="${0.9}">
      <rect x="${x}" y="${y + 190}" width="${w}" height="210" fill="#10151f"/>
      <path d="M${x} ${y + 190} h40 v-70 h30 v70 h20 v-40 h26 v40 h44 v-90 h34 v90 h40 v-60 h28 v60 h68 v210 h-330z" fill="#0b0f18"/>
      ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${x + 48 + i * 40}" y="${y + 140 + (i % 3) * 14}" width="7" height="9" fill="${night > 0.2 ? '#ffd58a' : '#3a3f4a'}" opacity="${night > 0.2 ? 0.85 : 0.5}"/>`).join('')}
      <g>
        <circle cx="${x + 245}" cy="${y + 262}" r="60" fill="url(#gasGlow)" class="gaspulse"/>
        <rect x="${x + 242}" y="${y + 268}" width="5" height="120" fill="#06080c"/>
        <rect x="${x + 236}" y="${y + 252}" width="17" height="22" fill="#ffe7a8" opacity="${0.6 + night * 0.4}"/>
      </g>
      <path d="M${x + 20} ${y + 395} q40 -30 60 -4 M${x + 140} ${y + 396} q38 -26 70 -4" stroke="#1c2230" stroke-width="3" fill="none"/>
      <rect x="${x}" y="${y + 340}" width="${w}" height="70" fill="#0a0e16" opacity=".8"/>
      <ellipse cx="${x + 180}" cy="${y + 330}" rx="190" ry="40" fill="#b9c4cf" opacity=".18" class="fogdrift"/>
    </g>
    <g clip-path="url(#winClip)">${rain(x, y - 20, w, h + 20, 46, 11)}</g>`;
  return `
  <clipPath id="winClip"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath>
  <rect x="${x - 26}" y="${y - 30}" width="${w + 52}" height="${h + 56}" fill="#2a180c" stroke="#150c07" stroke-width="3"/>
  ${street}
  <g stroke="#2a180c" stroke-width="9"><path d="M${x + w / 2} ${y} v${h} M${x} ${y + h * 0.42} h${w}"/></g>
  <g stroke="#6b4a2e" stroke-width="2.5" opacity=".7"><path d="M${x + w / 2 - 3} ${y} v${h} M${x} ${y + h * 0.42 - 3} h${w}"/></g>
  <rect x="${x - 34}" y="${y + h + 22}" width="${w + 68}" height="16" fill="#4a2d18" stroke="#150c07" stroke-width="2"/>
  <!-- velvet curtains -->
  <path d="M${x - 70} ${y - 60} h104 v${h + 120} q-40 18 -52 -4 q-30 20 -52 4z" fill="url(#velvet)"/>
  <path d="M${x + w - 34} ${y - 60} h104 v${h + 120} q-40 18 -52 -4 q-30 20 -52 4z" fill="url(#velvet)"/>
  <g stroke="#2a0608" stroke-width="2" opacity=".6"><path d="M${x - 50} ${y - 50} v${h + 110} M${x - 28} ${y - 50} v${h + 110} M${x + w + 6} ${y - 50} v${h + 110} M${x + w + 30} ${y - 50} v${h + 110}"/></g>
  <rect x="${x - 90}" y="${y - 80}" width="${w + 180}" height="28" fill="#2a180c" stroke="${PAL.brassDk}" stroke-width="2"/>
  <g fill="${PAL.brass}"><circle cx="${x - 90}" cy="${y - 66}" r="9"/><circle cx="${x + w + 90}" cy="${y - 66}" r="9"/></g>`;
}

function fireplace() {
  const x = 780, y = 300, w = 330, h = 330;
  return `
  <!-- overmantel mirror -->
  <rect x="${x + 40}" y="130" width="250" height="150" fill="#2a180c" stroke="${PAL.brassDk}" stroke-width="3"/>
  <rect x="${x + 52}" y="142" width="226" height="126" fill="#33414a"/>
  <path d="M${x + 52} 268 L${x + 130} 142 h40 L${x + 92} 268z" fill="#c9d3d8" opacity=".10"/>
  <rect x="${x + 52}" y="142" width="226" height="126" fill="url(#fireGlow)" opacity=".35" class="firepulse"/>
  <!-- surround -->
  <rect x="${x - 20}" y="${y - 22}" width="${w + 40}" height="30" fill="#161210" stroke="#050403" stroke-width="2"/>
  <rect x="${x - 4}" y="${y + 8}" width="34" height="${h - 8}" fill="#1a1512"/>
  <rect x="${x + w - 30}" y="${y + 8}" width="34" height="${h - 8}" fill="#1a1512"/>
  <rect x="${x + 30}" y="${y + 8}" width="${w - 60}" height="${h - 8}" fill="#070504"/>
  <path d="M${x + 30} ${y + 8} h${w - 60} q-20 40 -50 44 h-${w - 160} q-30 -4 -50 -44z" fill="#0d0a08"/>
  <!-- fire -->
  <g transform="translate(${x + w / 2},${y + h - 30})">
    <ellipse cx="0" cy="-10" rx="120" ry="26" fill="#2a0c04"/>
    <g class="flame f1"><path d="M-50 0 C-60 -50 -20 -70 -26 -120 C-6 -90 24 -70 22 -30 C40 -50 48 -20 50 0z" fill="#d7471a"/></g>
    <g class="flame f2"><path d="M-30 0 C-40 -38 -4 -52 -8 -98 C14 -72 34 -50 30 -18 C40 -28 42 -8 36 0z" fill="#ff8a2a"/></g>
    <g class="flame f3"><path d="M-12 0 C-18 -24 0 -34 -2 -64 C10 -46 20 -30 14 0z" fill="#ffd36a"/></g>
    <g fill="#3a1608"><ellipse cx="-70" cy="-6" rx="30" ry="12"/><ellipse cx="62" cy="-4" rx="34" ry="13"/><ellipse cx="0" cy="-2" rx="40" ry="12"/></g>
    <g fill="#ff7a2a" class="embers"><circle cx="-60" cy="-8" r="3"/><circle cx="40" cy="-6" r="3"/><circle cx="8" cy="-4" r="2.4"/><circle cx="-24" cy="-3" r="2"/></g>
  </g>
  <rect x="${x + 30}" y="${y + h - 14}" width="${w - 60}" height="14" fill="#2a2420"/>
  <!-- mantel things -->
  <g>
    <rect x="${x + 6}" y="${y - 74}" width="52" height="52" rx="4" fill="#3a2a18" stroke="${PAL.brass}" stroke-width="2"/>
    <circle cx="${x + 32}" cy="${y - 48}" r="19" fill="#f1e6c8" stroke="#2a1a0a" stroke-width="2"/>
    <path d="M${x + 32} ${y - 48} v-13 M${x + 32} ${y - 48} l9 5" stroke="#1a1208" stroke-width="2.4"/>
    <path d="M${x + 96} ${y - 22} q-4 -34 14 -48 q-6 30 28 22z" fill="#6a4a22" stroke="#2a1a0a" stroke-width="2"/>
    <path d="M${x + 96} ${y - 22} h50" stroke="#2a1a0a" stroke-width="3"/>
    <path d="M${x + 112} ${y - 70} q10 -14 -2 -30 q14 6 8 22" fill="none" stroke="#9aa7b3" stroke-width="2.4" opacity=".6" class="smoke"/>
    <g class="hanginglet"><rect x="${x + 190}" y="${y - 64}" width="48" height="42" fill="#e9dcbd" stroke="#8a7a56" stroke-width="1.4"/><path d="M${x + 196} ${y - 52} h34 M${x + 196} ${y - 44} h28 M${x + 196} ${y - 36} h32" stroke="#5a4a2a" stroke-width="1.6"/></g>
    <path d="M${x + 214} ${y - 70} l8 36 l-3 10" stroke="#a9b2b8" stroke-width="3" fill="none"/>
    <path d="M${x + 212} ${y - 74} l10 4 l-3 6z" fill="#3a2a18"/>
    <rect x="${x + 262}" y="${y - 52}" width="14" height="30" fill="#9db3a5" stroke="#1a2a22" stroke-width="2"/>
    <rect x="${x + 258}" y="${y - 24}" width="22" height="4" fill="${PAL.brass}"/>
  </g>
  <rect x="${x + 60}" y="${y - 74}" width="22" height="2" opacity="0"/>`;
}

function vrWall() {
  // the V.R. in bullet-pocks, above the sofa end
  const dots = [[0, 0], [14, 0], [28, 0], [42, 0], [14, 34], [28, 34], [-14, -22], [-14, -52], [-14, 42], [0, 60], [14, 60], [28, 60], [42, 60]];
  const pts = [
    // V
    [0, 0], [10, 26], [20, 52], [30, 26], [40, 0],
    // R
    [66, 0], [66, 18], [66, 36], [66, 54], [78, 0], [92, 6], [92, 24], [78, 30], [90, 42], [98, 54],
  ];
  return `<g transform="translate(560,430)" opacity=".95">${pts.map(([a, b]) => `<circle cx="${a}" cy="${b}" r="3.4" fill="#120808"/><circle cx="${a}" cy="${b}" r="6" fill="none" stroke="#2a1a1a" stroke-width="1" opacity=".6"/>`).join('')}</g>`;
}

function bookcase() {
  const x = 1330, y = 110, w = 270, h = 540;
  let rows = '';
  for (let i = 0; i < 5; i++) {
    const ry = y + 18 + i * 102;
    rows += `<rect x="${x + 12}" y="${ry}" width="${w - 24}" height="88" fill="#0c0806"/>`;
    rows += booksRow(x + 14, ry + 6, w - 28, 80, 90 + i * 7);
    rows += `<rect x="${x + 8}" y="${ry + 88}" width="${w - 16}" height="9" fill="#3a2416" stroke="#150c07" stroke-width="1.5"/>`;
  }
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#2a180c" stroke="#150c07" stroke-width="3"/>${rows}
  <rect x="${x - 6}" y="${y - 14}" width="${w + 12}" height="16" fill="#3a2416" stroke="#150c07" stroke-width="2"/>
  <!-- Persian slipper-ish scrapbooks on the floor -->
  <rect x="${x + 20}" y="${y + h - 4}" width="90" height="30" fill="#5a1418" stroke="#120808" stroke-width="2"/><rect x="${x + 26}" y="${y + h - 18}" width="80" height="16" fill="#2a2f4a" stroke="#120808" stroke-width="2"/>`;
}

function watson() {
  // Watson in the armchair, reading, to the right of the fire.
  const x = 1060, y = 450;
  return `<g id="watson" class="watson">
  <!-- armchair back -->
  <path d="M${x - 40} ${y + 360} v-250 q0 -70 70 -70 h170 q70 0 70 70 v250z" fill="#3a0f14" stroke="#150506" stroke-width="3"/>
  <path d="M${x - 10} ${y + 330} v-220 q0 -40 40 -40 h150 q40 0 40 40 v220z" fill="#5a1a20"/>
  <g fill="${PAL.brass}"><circle cx="${x + 60}" cy="${y + 160}" r="3"/><circle cx="${x + 100}" cy="${y + 160}" r="3"/><circle cx="${x + 140}" cy="${y + 160}" r="3"/><circle cx="${x + 80}" cy="${y + 200}" r="3"/><circle cx="${x + 120}" cy="${y + 200}" r="3"/></g>
  <!-- body -->
  <path d="M${x + 30} ${y + 330} v-120 q0 -50 40 -60 h60 q40 10 40 60 v120z" fill="#5b4630" stroke="#2a1f12" stroke-width="2"/>
  <path d="M${x + 76} ${y + 150} l12 60 l12 -60z" fill="#f1ead8"/>
  <path d="M${x + 88} ${y + 160} v50" stroke="#7a1f25" stroke-width="5"/>
  <!-- head -->
  <ellipse cx="${x + 100}" cy="${y + 90}" rx="34" ry="40" fill="#e8c4a0" stroke="#7a5a3a" stroke-width="2"/>
  <path d="M${x + 66} ${y + 82} q0 -42 34 -44 q36 2 34 44 q-12 -22 -34 -22 q-22 0 -34 22z" fill="#5a3d22"/>
  <path d="M${x + 80} ${y + 106} q20 -10 40 0 q-4 8 -20 6 q-16 2 -20 -6z" fill="#5a3d22"/><path d="M${x + 92} ${y + 118} q8 4 16 0" stroke="#7a3a2a" stroke-width="2" fill="none"/><path d="M${x + 100} ${y + 94} v10" stroke="#b08a66" stroke-width="2"/>
  <circle cx="${x + 88}" cy="${y + 90}" r="2.5" fill="#1a120a"/><circle cx="${x + 112}" cy="${y + 90}" r="2.5" fill="#1a120a"/>
  <!-- newspaper -->
  <g class="paper-sway"><path d="M${x + 30} ${y + 190} l70 -26 l76 26 l-8 100 l-68 -20 l-70 20z" fill="#e6dcc0" stroke="#7a6a4a" stroke-width="2"/>
  <path d="M${x + 44} ${y + 210} h40 M${x + 44} ${y + 226} h44 M${x + 44} ${y + 242} h38 M${x + 114} ${y + 210} h40 M${x + 114} ${y + 226} h44 M${x + 114} ${y + 242} h36" stroke="#6a5a3a" stroke-width="2" opacity=".7"/>
  <rect x="${x + 42}" y="${y + 190}" width="40" height="12" fill="#2a2418" opacity=".7"/></g>
  </g>`;
}

function table() {
  const x = 300, y = 620;
  return `<g id="table">
  <!-- tablecloth -->
  <path d="M${x - 40} ${y + 30} h520 l30 150 h-580z" fill="#3a1218" stroke="#180608" stroke-width="3"/>
  <path d="M${x - 40} ${y + 30} h520" stroke="${PAL.brass}" stroke-width="2" opacity=".6"/>
  <ellipse cx="${x + 220}" cy="${y + 28}" rx="280" ry="34" fill="#4a2a18" stroke="#150c07" stroke-width="3"/>
  <ellipse cx="${x + 220}" cy="${y + 24}" rx="262" ry="28" fill="#5a3a22"/>
  <!-- telegram -->
  <g class="tele"><path d="M${x + 20} ${y + 14} l86 -10 l12 36 l-88 10z" fill="#e9dcbd" stroke="#8a7a56" stroke-width="1.5"/><path d="M${x + 34} ${y + 22} h60 M${x + 36} ${y + 30} h54" stroke="#5a2a1a" stroke-width="2"/></g>
  <!-- specimen books -->
  <g><rect x="${x + 150}" y="${y - 6}" width="96" height="14" fill="#2f4a3a" stroke="#0a1a12" stroke-width="2"/><rect x="${x + 154}" y="${y - 20}" width="90" height="14" fill="#5a1418" stroke="#2a0608" stroke-width="2"/><rect x="${x + 158}" y="${y - 34}" width="84" height="14" fill="#2a2f4a" stroke="#0a0c1a" stroke-width="2"/><rect x="${x + 162}" y="${y - 47}" width="78" height="13" fill="#6a4a1e" stroke="#2a1a08" stroke-width="2"/><rect x="${x + 166}" y="${y - 59}" width="72" height="12" fill="#3b1f2a" stroke="#180a10" stroke-width="2"/>
  <g fill="${PAL.brass}" opacity=".7"><rect x="${x + 168}" y="${y - 3}" width="40" height="2"/><rect x="${x + 168}" y="${y - 17}" width="40" height="2"/></g></g>
  <!-- chemistry -->
  <g class="chem">
    <path d="M${x + 340} ${y + 22} v-60 h18 v60z" fill="#b8e0d0" opacity=".45" stroke="#d8f0e6" stroke-width="1.4"/>
    <path d="M${x + 340} ${y + 22} v-26 h18 v26z" fill="#4aa58a" opacity=".6"/>
    <path d="M${x + 378} ${y + 24} q-34 -2 -22 -40 h10 q-6 30 32 40z" fill="#e8c8a8" opacity=".35" stroke="#e8d8c0" stroke-width="1.3"/>
    <path d="M${x + 410} ${y + 24} v-48 q0 -10 10 -10 h8 q10 0 10 10 v48z" fill="#c0a0e0" opacity=".4" stroke="#e0d0f0" stroke-width="1.4"/>
    <path d="M${x + 426} ${y - 38} q-4 -20 8 -34" stroke="#cfd8e0" stroke-width="2" fill="none" opacity=".55" class="smoke"/>
    <path d="M${x + 316} ${y + 20} l22 -16 M${x + 316} ${y + 20} h28" stroke="#c9a24a" stroke-width="3"/>
  </g>
  <!-- lens -->
  <g><circle cx="${x + 80}" cy="${y + 60}" r="24" fill="#cfe0e8" opacity=".35" stroke="${PAL.brass}" stroke-width="5"/><path d="M${x + 96} ${y + 76} l28 24" stroke="#5a3a1e" stroke-width="8" stroke-linecap="round"/></g>
  <!-- candle/lamp on table -->
  <g><circle cx="${x + 460}" cy="${y - 20}" r="90" fill="url(#gasGlow)" class="gaspulse"/><rect x="${x + 452}" y="${y - 22}" width="16" height="44" fill="#d8c898" stroke="#6a5a3a" stroke-width="1.5"/><path d="M${x + 460} ${y - 26} q-8 -16 0 -28 q8 12 0 28z" fill="#ffd36a" class="flame f3"/></g>
  </g>`;
}

function violin() {
  return `<g transform="translate(690,300) rotate(-6) scale(.8)">
  <path d="M30 0 c28 0 40 22 28 44 c24 12 20 52 -10 62 c-28 8 -56 -4 -56 -30 c0 -16 10 -24 18 -30 c-16 -22 0 -46 20 -46z" fill="#8a4a1e" stroke="#2a1208" stroke-width="3"/>
  <path d="M30 -2 v-90" stroke="#1a0e08" stroke-width="7"/><circle cx="30" cy="-98" r="9" fill="#2a1208"/>
  <path d="M26 20 v70 M34 20 v70" stroke="#e8dcc0" stroke-width="1" opacity=".7"/>
  <path d="M10 112 L90 -40" stroke="#c9a24a" stroke-width="3" opacity=".9"/>
  </g>`;
}

function door() {
  return `<rect x="0" y="100" width="110" height="560" fill="#2a180c" stroke="#150c07" stroke-width="3"/>
  <rect x="14" y="116" width="82" height="200" fill="#3a2416" stroke="#150c07" stroke-width="2"/><rect x="14" y="336" width="82" height="290" fill="#3a2416" stroke="#150c07" stroke-width="2"/>
  <circle cx="86" cy="420" r="8" fill="${PAL.brass}"/>
  <rect x="42" y="200" width="30" height="20" fill="${PAL.brass}" opacity=".85"/><text x="57" y="215" font-size="12" text-anchor="middle" fill="#2a1a08" font-family="serif" font-weight="700">221B</text>`;
}

function furniture() {
  return `
  <!-- hat stand + coat -->
  <g transform="translate(560,330)" opacity=".95"><path d="M0 0 v310" stroke="#1a0e08" stroke-width="8"/><path d="M-26 20 q26 -14 52 0 M-30 60 q30 -12 60 0" stroke="#1a0e08" stroke-width="6" fill="none"/>
  <path d="M-20 10 q20 -30 40 0 l-6 24 h-28z" fill="#2a2f3a" stroke="#0a0c12" stroke-width="2"/><path d="M-34 70 q34 40 68 0 l-8 -30 h-52z" fill="#3a3a2a"/></g>
  <!-- stag-ear of the deerstalker on hook -->`;
}

export function room221b(state, opts = {}) {
  const hour = ((state?.t ?? 520) % 1440) / 60;
  const t = lightTint(hour);
  const hots = [
    hot(310, 520, 140, 80, 'Examine the telegram', 'telegram', 8),
    hot(470, 500, 110, 90, 'Compare the note with my paper specimens', 'specimens', 8),
    hot(1060, 350, 260, 330, 'Ask Watson what he makes of it', 'Watson', 12),
    hot(640, 190, 150, 220, 'Play the violin', 'violin', 8),
    hot(150, 120, 330, 400, 'Look out of the window', 'window', 6),
    hot(0, 100, 110, 560, 'Go to Marlowe House', 'door', 4),
    hot(600, 450, 200, 120, 'Examine the chemical table', 'chemicals', 8),
  ].join('');
  return `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" class="scene s221" xmlns="http://www.w3.org/2000/svg" aria-label="The sitting room at 221B Baker Street">
  ${SHARED_DEFS}
  <rect width="1600" height="900" fill="#1a0a0c"/>
  <g transform="translate(0,-60)">
  <rect y="-10" width="1600" height="660" fill="url(#damask)"/>
  <rect y="0" width="1600" height="60" fill="#2a180c"/><rect y="52" width="1600" height="10" fill="${PAL.brassDk}" opacity=".7"/>
  <rect y="560" width="1600" height="100" fill="url(#woodGrad)"/><rect y="556" width="1600" height="8" fill="#6b4a2e"/>
  <g stroke="#150c07" stroke-width="2" opacity=".6">${Array.from({ length: 16 }, (_, i) => `<rect x="${i * 100 + 14}" y="580" width="72" height="62" fill="none"/>`).join('')}</g>
  <rect y="650" width="1600" height="360" fill="url(#planks)"/>
  <rect y="650" width="1600" height="360" fill="url(#floorGrad)" opacity=".55"/>
  <!-- rug -->
  <path d="M260 800 q540 -80 1100 0 l60 100 h-1220z" fill="#4a1418" opacity=".95"/>
  <path d="M300 820 q500 -64 1020 0 l40 80 h-1100z" fill="none" stroke="${PAL.brass}" stroke-width="3" opacity=".5"/>
  <path d="M330 850 q480 -50 960 0" stroke="#c98a3a" stroke-width="2" fill="none" opacity=".4"/>
  ${door()}
  ${windowArt(t)}
  ${vrWall()}
  ${fireplace()}
  ${bookcase()}
  ${violin()}
  <g transform="translate(0,-70)">${watson()}${table()}</g>
  ${gasLamp(620, 190)}
  <g class="lightrays" opacity="${0.55 - t.night * 0.5}" filter="url(#soft)"><polygon points="170,140 470,140 820,720 480,720" fill="url(#ray)"/></g>
  <circle cx="945" cy="620" r="460" fill="url(#fireGlow)" class="firepulse" style="mix-blend-mode:screen" opacity=".5"/>
  <g class="hots">${hots}</g>
  </g>
  <rect width="1600" height="900" fill="${t.overlay}" pointer-events="none"/>
  ${dustAndFog(1600, 900)}
  ${finish(1600, 900)}
  </svg>`;
}
