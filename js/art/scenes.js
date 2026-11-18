// Every other place in the game: one painter per kind of room, sharing a kit of props.
import { SHARED_DEFS, PAL, hot, booksRow, gasLamp, lightTint, dustAndFog, finish, rng, esc } from './common.js';
import { room221b } from './room221b.js';
import { PLACES } from '../case/world.js';

const W = 1600, H = 900;

function frame(inner, { hour = 10, cls = '', label = '' } = {}) {
  const t = lightTint(hour);
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" class="scene ${cls}" xmlns="http://www.w3.org/2000/svg" aria-label="${esc(label)}">
  ${SHARED_DEFS}<g transform="translate(0,-90)">${inner}</g>
  <rect width="${W}" height="${H}" fill="${t.overlay}" pointer-events="none"/>
  ${dustAndFog(W, H, 8)}${finish(W, H)}</svg>`;
}

function floor(color = 'url(#planks)', y = 680) {
  return `<rect y="${y}" width="${W}" height="${H - y + 140}" fill="${color}"/><rect y="${y}" width="${W}" height="${H - y + 140}" fill="url(#floorGrad)" opacity=".6"/>`;
}

function sash(x, y, w, h, t, rainy = true) {
  let r = '';
  if (rainy) { const rr = rng(x + y); for (let i = 0; i < 26; i++) { const px = x + rr() * w, py = y + rr() * h; r += `<line x1="${px | 0}" y1="${py | 0}" x2="${(px - 3) | 0}" y2="${(py + 20) | 0}" class="rain" style="animation-duration:${(0.5 + rr() * 0.5).toFixed(2)}s;animation-delay:${(-rr() * 2).toFixed(2)}s"/>`; } }
  return `<rect x="${x - 14}" y="${y - 14}" width="${w + 28}" height="${h + 28}" fill="#2a180c" stroke="#150c07" stroke-width="3"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${t.sky})"/>
  <path d="M${x} ${y + h * 0.55} h${w * 0.2} v-${h * 0.2} h${w * 0.15} v${h * 0.2} h${w * 0.3} v-${h * 0.3} h${w * 0.2} v${h * 0.3} h${w * 0.15} v${h * 0.45} h-${w}z" fill="#0b0f18" opacity=".85"/>
  <g clip-path="inset(0)">${r}</g>
  <path d="M${x + w / 2} ${y} v${h} M${x} ${y + h / 2} h${w}" stroke="#2a180c" stroke-width="7"/>`;
}

function wallpaper(fill = 'url(#damask)', h = 680) {
  return `<rect y="-90" width="${W}" height="${h + 90}" fill="${fill}"/><rect y="-90" width="${W}" height="${h + 90}" fill="url(#hatch)" opacity=".35"/>
  <rect y="${h - 100}" width="${W}" height="100" fill="url(#woodGrad)"/><rect y="${h - 104}" width="${W}" height="8" fill="#6b4a2e"/>`;
}

function desk(x, y, w, color = '#3a2416') {
  return `<g><rect x="${x}" y="${y}" width="${w}" height="24" fill="${color}" stroke="#150c07" stroke-width="3"/>
  <rect x="${x + 14}" y="${y + 24}" width="${w * 0.32}" height="150" fill="#2a180c" stroke="#150c07" stroke-width="3"/>
  <rect x="${x + w - 14 - w * 0.32}" y="${y + 24}" width="${w * 0.32}" height="150" fill="#2a180c" stroke="#150c07" stroke-width="3"/>
  <g fill="${PAL.brass}"><circle cx="${x + 14 + w * 0.16}" cy="${y + 60}" r="5"/><circle cx="${x + 14 + w * 0.16}" cy="${y + 110}" r="5"/><circle cx="${x + w - 14 - w * 0.16}" cy="${y + 60}" r="5"/><circle cx="${x + w - 14 - w * 0.16}" cy="${y + 110}" r="5"/></g></g>`;
}

function sign(x, y, w, text, bg = '#12100e', fg = PAL.brass, size = 34) {
  return `<g><rect x="${x}" y="${y}" width="${w}" height="${size * 1.7}" fill="${bg}" stroke="${PAL.brassDk}" stroke-width="3"/><text x="${x + w / 2}" y="${y + size * 1.15}" text-anchor="middle" font-family="IM Fell English, Georgia, serif" font-size="${size}" fill="${fg}">${esc(text)}</text></g>`;
}

function ledgerBook(x, y, rot = 0) {
  return `<g transform="translate(${x},${y}) rotate(${rot})"><path d="M0 0 l80 -10 l80 10 v10 l-80 -8 l-80 8z" fill="#e6dcc0" stroke="#7a6a4a" stroke-width="2"/><path d="M0 10 l80 -8 l80 8 v14 l-80 -8 l-80 8z" fill="#5a1418" stroke="#2a0608" stroke-width="2"/><path d="M14 -2 l52 -6 M14 6 l52 -6 M94 -8 l52 6 M94 0 l52 6" stroke="#6a5a3a" stroke-width="1.5" opacity=".8"/></g>`;
}

// ------------------------------------------------------------------- the study at Marlowe House
function study(state) {
  const hour = ((state?.t ?? 600) % 1440) / 60;
  const t = lightTint(hour);
  const hots = [
    hot(700, 230, 300, 360, 'Examine the safe', 'the safe', 8),
    hot(1010, 360, 80, 60, 'Examine the keyhole', 'keyhole', 6),
    hot(150, 130, 300, 360, 'Examine the window', 'window', 6),
    hot(430, 560, 520, 150, 'Examine the desk', 'desk', 8),
    hot(500, 690, 460, 170, 'Examine the carpet', 'carpet', 8),
    hot(560, 520, 130, 46, 'Examine the blotter', 'blotter', 6),
    hot(1090, 480, 230, 170, 'Examine the copy-book', 'copy-book', 8),
    hot(720, 790, 220, 90, 'Examine under the desk', 'under the desk', 8),
    hot(40, 160, 90, 520, 'Examine the study door', 'door', 6),
    hot(1330, 130, 250, 500, 'Examine the bookcases', 'books', 8),
    hot(1120, 640, 200, 100, 'Examine the fireplace', 'fireplace', 8),
  ].join('');
  const safeOpen = true;
  return frame(`
  ${wallpaper('url(#wallGreen)')}
  ${floor()}
  <!-- carpet -->
  <path d="M380 760 q420 -60 840 0 l80 140 h-1000z" fill="#14281e"/><path d="M420 790 q380 -50 760 0 l60 110 h-880z" fill="none" stroke="${PAL.brass}" stroke-width="3" opacity=".45"/>
  <!-- chimney breast with safe -->
  <rect x="660" y="120" width="380" height="540" fill="#1a2a20" stroke="#0a1410" stroke-width="3"/>
  <rect x="700" y="230" width="300" height="360" fill="#16120f" stroke="#050403" stroke-width="4"/>
  <rect x="720" y="250" width="260" height="320" fill="${safeOpen ? '#050403' : '#2a2a2e'}"/>
  <path d="M720 250 h260 v320 h-260z" fill="url(#hatch)" opacity=".5"/>
  <g><polygon points="1000,250 1090,214 1090,606 1000,570" fill="#2f3036" stroke="#0a0a0c" stroke-width="4"/><polygon points="1010,270 1080,242 1080,578 1010,550" fill="none" stroke="#4a4c54" stroke-width="2"/><circle cx="1046" cy="410" r="24" fill="#4a4c54" stroke="#0a0a0c" stroke-width="3"/><circle cx="1046" cy="410" r="8" fill="#c9a24a"/><text x="1046" y="330" text-anchor="middle" font-size="15" fill="#a9a18a" font-family="serif" font-weight="700" transform="rotate(-9 1046 330)">CHUBB</text></g>
  <rect x="740" y="480" width="220" height="80" fill="#0d0a08"/><rect x="742" y="500" width="216" height="6" fill="#2a2a2e"/>
  <rect x="800" y="400" width="100" height="60" fill="#0f0c0a" stroke="#2a2a2e" stroke-width="2"/>
  <path d="M830 420 h40 M830 436 h40" stroke="#6a6a70" stroke-width="2" opacity=".5"/>
  <rect x="650" y="106" width="400" height="24" fill="#2a180c" stroke="#150c07" stroke-width="3"/>
  <!-- portrait over safe -->
  <rect x="780" y="40" width="140" height="64" fill="#2a180c" stroke="${PAL.brassDk}" stroke-width="3"/><rect x="790" y="48" width="120" height="48" fill="#3a2a22"/><circle cx="850" cy="64" r="12" fill="#c9a888"/><path d="M826 96 q24 -24 48 0z" fill="#2a2a30"/>
  <!-- window -->
  ${sash(170, 140, 260, 340, t)}
  <path d="M120 120 h60 v400 q-30 16 -60 0z" fill="url(#velvet)" opacity=".92"/><path d="M420 120 h60 v400 q-30 16 -60 0z" fill="url(#velvet)" opacity=".92"/>
  <rect x="150" y="500" width="320" height="16" fill="#4a2d18" stroke="#150c07" stroke-width="2"/>
  <!-- desk -->
  <rect x="420" y="560" width="540" height="22" fill="#3a2416" stroke="#150c07" stroke-width="3"/>
  ${desk(450, 580, 480)}
  <rect x="480" y="540" width="110" height="26" fill="#e6dcc0" stroke="#7a6a4a" stroke-width="2"/><path d="M490 550 h60 M490 558 h40" stroke="#6a5a3a" stroke-width="2"/>
  <rect x="610" y="524" width="170" height="40" fill="#2a2f3a" stroke="#0a0c12" stroke-width="2" transform="skewX(-8)"/>
  <rect x="820" y="532" width="22" height="30" fill="#1a1a22" stroke="#0a0a10" stroke-width="2"/><path d="M832 530 q18 -40 40 -30" stroke="#e6dcc0" stroke-width="4" fill="none"/>
  ${gasLamp(550, 150)}
  <g><circle cx="880" cy="470" r="90" fill="url(#gasGlow)" class="gaspulse"/><rect x="872" y="474" width="16" height="70" fill="#1a3a2a" stroke="#0a1a10" stroke-width="2"/><path d="M850 474 q30 -40 60 0z" fill="#3a6a4a" stroke="#0a1a10" stroke-width="2"/></g>
  <!-- bureau right with copybook -->
  <rect x="1090" y="500" width="230" height="170" fill="#3a2416" stroke="#150c07" stroke-width="3"/>
  <rect x="1100" y="470" width="210" height="34" fill="#4a2d18" stroke="#150c07" stroke-width="3"/>
  <rect x="1130" y="446" width="150" height="26" fill="#5a1418" stroke="#2a0608" stroke-width="2"/><rect x="1140" y="436" width="130" height="12" fill="#e6dcc0" stroke="#7a6a4a" stroke-width="1.5"/>
  <!-- fireplace small -->
  <rect x="1120" y="660" width="200" height="80" fill="#1a1512" stroke="#050403" stroke-width="3"/><rect x="1136" y="676" width="168" height="64" fill="#080605"/>
  <!-- bookcase -->
  <rect x="1330" y="130" width="250" height="500" fill="#2a180c" stroke="#150c07" stroke-width="3"/>
  ${[0, 1, 2, 3].map((i) => booksRow(1342, 146 + i * 118, 226, 100, 40 + i)).join('')}
  <!-- door -->
  <rect x="30" y="150" width="100" height="530" fill="#2a180c" stroke="#150c07" stroke-width="3"/><rect x="44" y="168" width="72" height="210" fill="#3a2416" stroke="#150c07" stroke-width="2"/><rect x="44" y="396" width="72" height="262" fill="#3a2416" stroke="#150c07" stroke-width="2"/><circle cx="106" cy="420" r="7" fill="${PAL.brass}"/>
  <!-- wax spots + ash trail -->
  <g fill="#e8dcc0" opacity=".55"><circle cx="640" cy="790" r="5"/><circle cx="600" cy="810" r="4"/></g>
  <path d="M560 830 q-60 20 -120 40" stroke="#6a6a6a" stroke-width="4" opacity=".28" fill="none"/>
  <g class="hots">${hots}</g>`, { hour, cls: 'study', label: 'The study at Marlowe House' });
}

// ------------------------------------------------------------------- Marlowe House (hall and front)
function house(state) {
  const hour = ((state?.t ?? 600) % 1440) / 60;
  const t = lightTint(hour);
  const hots = [
    hot(1040, 160, 340, 520, 'Examine the back stairs', 'back stairs', 8),
    hot(40, 200, 180, 480, 'Examine the garden and side door', 'side door', 8),
    hot(520, 200, 240, 480, 'Go to the study', 'the study', 8),
    hot(360, 640, 600, 220, 'Look around the hall', 'hall', 8),
  ].join('');
  return frame(`
  ${wallpaper('#2a1a14')}
  <g fill="none" stroke="#3a2416" stroke-width="3" opacity=".7">${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${60 + i * 260}" y="90" width="200" height="380"/>`).join('')}</g>
  ${floor('#d8d4c8', 700)}
  <g opacity=".55">${Array.from({ length: 24 }, (_, i) => `<rect x="${(i % 8) * 200}" y="${700 + Math.floor(i / 8) * 70}" width="200" height="70" fill="${(i + Math.floor(i / 8)) % 2 ? '#1a1a1a' : '#d8d4c8'}"/>`).join('')}</g>
  <rect y="700" width="${W}" height="200" fill="url(#floorGrad)" opacity=".5"/>
  <!-- staircase -->
  <path d="M1040 700 L1380 700 L1380 160 L1260 160 L1040 480z" fill="#2a180c" stroke="#150c07" stroke-width="4"/>
  ${Array.from({ length: 9 }, (_, i) => `<path d="M${1040 + i * 38} ${700 - i * 56} h${340 - i * 38} v14 h-${340 - i * 38}z" fill="#5a3a22" stroke="#150c07" stroke-width="2"/>`).join('')}
  <path d="M1040 480 L1260 160" stroke="${PAL.brass}" stroke-width="6"/><g fill="${PAL.brass}">${Array.from({ length: 7 }, (_, i) => `<circle cx="${1050 + i * 32}" cy="${470 - i * 44}" r="6"/>`).join('')}</g>
  <rect x="1300" y="160" width="90" height="540" fill="#0b0806" opacity=".7"/>
  <!-- study door -->
  <rect x="540" y="200" width="200" height="500" fill="#3a2416" stroke="#150c07" stroke-width="5"/>
  <rect x="560" y="226" width="160" height="200" fill="#4a2d18" stroke="#150c07" stroke-width="3"/><rect x="560" y="446" width="160" height="240" fill="#4a2d18" stroke="#150c07" stroke-width="3"/>
  <circle cx="710" cy="470" r="9" fill="${PAL.brass}"/><rect x="520" y="176" width="240" height="24" fill="#2a180c" stroke="#150c07" stroke-width="3"/>
  <!-- side door to garden -->
  <rect x="50" y="210" width="160" height="470" fill="url(#${t.sky})" stroke="#150c07" stroke-width="5"/>
  <path d="M50 520 h160 v160 h-160z" fill="#142a1a"/><path d="M60 560 q20 -30 40 0 q20 -30 40 0 q20 -30 40 0" stroke="#2f5a43" stroke-width="5" fill="none"/>
  <circle cx="150" cy="380" r="4" fill="#ffd36a" opacity=".5"/>
  <path d="M130 210 v470" stroke="#150c07" stroke-width="6"/>
  <!-- hall table + vase -->
  <rect x="380" y="620" width="260" height="20" fill="#3a2416" stroke="#150c07" stroke-width="3"/><rect x="400" y="640" width="16" height="70" fill="#2a180c"/><rect x="604" y="640" width="16" height="70" fill="#2a180c"/>
  <path d="M470 620 q-14 -50 4 -70 h26 q18 20 4 70z" fill="#274a6a" stroke="#0a1a2a" stroke-width="2"/><path d="M480 550 q-6 -40 -26 -52 M490 550 q2 -50 8 -70 M500 550 q16 -36 40 -40" stroke="#4a7a4a" stroke-width="3" fill="none"/>
  <!-- clock -->
  <g transform="translate(850,360)"><rect x="-28" y="-130" width="56" height="300" fill="#3a2416" stroke="#150c07" stroke-width="4"/><circle cx="0" cy="-90" r="22" fill="#e9dcbd" stroke="${PAL.brass}" stroke-width="3"/><path d="M0 -90 v-14 M0 -90 l10 4" stroke="#1a1208" stroke-width="3"/><rect x="-18" y="-40" width="36" height="140" fill="#1a0e08"/><line x1="0" y1="-34" x2="0" y2="80" stroke="${PAL.brass}" stroke-width="3" class="pend"/><circle cx="0" cy="84" r="9" fill="${PAL.brass}" class="pend"/></g>
  ${gasLamp(430, 200)}${gasLamp(960, 200)}
  <g class="hots">${hots}</g>`, { hour, cls: 'house', label: 'Marlowe House' });
}

// ------------------------------------------------------------------- generic interiors
const KINDS = {
  yard: { wall: '#2a2f2a', label: 'New Scotland Yard', sign: 'SCOTLAND YARD', draw: (x) => `
    ${desk(500, 560, 640, '#2a2018')}${ledgerBook(560, 556)}${ledgerBook(820, 548, 4)}
    <rect x="160" y="150" width="280" height="380" fill="#d8d0b0" stroke="#150c07" stroke-width="5"/><g stroke="#5a4a2a" stroke-width="2" fill="none"><path d="M180 200 q60 40 120 -10 t120 20 M180 280 q80 -20 140 20 t100 -10 M200 360 q60 30 100 0 t110 30"/><path d="M300 170 v340 M180 340 h260" opacity=".4"/></g>
    <g>${Array.from({ length: 6 }, (_, i) => `<rect x="${520 + (i % 3) * 120}" y="${160 + Math.floor(i / 3) * 150}" width="96" height="128" fill="#e6dcc0" stroke="#7a6a4a" stroke-width="2" transform="rotate(${[-2, 1, -1, 2, -3, 1][i]} ${568 + (i % 3) * 120} ${224 + Math.floor(i / 3) * 150})"/><circle cx="${568 + (i % 3) * 120}" cy="${210 + Math.floor(i / 3) * 150}" r="16" fill="#9a8a6a"/>`).join('')}</g>
    <g><circle cx="1280" cy="230" r="70" fill="#c9a24a" stroke="#6a4a1a" stroke-width="5"/><path d="M1280 180 v100 M1230 230 h100" stroke="#6a4a1a" stroke-width="6"/></g>` },
  club: { wall: '#3a1618', label: 'The Diogenes Club', sign: 'SILENCE', draw: () => `
    <rect x="180" y="150" width="1240" height="40" fill="#1a0c0c"/>
    ${[0, 1, 2].map((i) => `<g transform="translate(${260 + i * 400},500)"><path d="M0 0 q0 -120 90 -120 q90 0 90 120 v120 h-180z" fill="#6a1a20" stroke="#220608" stroke-width="3"/><path d="M20 -20 q70 -40 140 0" fill="none" stroke="#2a0608" stroke-width="3" opacity=".7"/><rect x="-14" y="30" width="28" height="90" fill="#4a1418"/><rect x="166" y="30" width="28" height="90" fill="#4a1418"/></g>`).join('')}
    <g><rect x="600" y="260" width="400" height="100" fill="#e9dcbd" stroke="#150c07" stroke-width="4"/><text x="800" y="326" text-anchor="middle" font-family="IM Fell English,serif" font-size="56" fill="#3a1618" letter-spacing="14">SILENCE</text></g>` },
  gallery: { wall: '#10182a', label: 'Gradwell’s Gallery', sign: 'GRADWELL', draw: () => `
    ${Array.from({ length: 4 }, (_, i) => `<g transform="translate(${180 + i * 340},520)"><rect width="280" height="170" fill="#1a1208" stroke="#150c07" stroke-width="4"/><rect x="10" y="10" width="260" height="130" fill="#0a1016" stroke="${PAL.brass}" stroke-width="2" opacity=".95"/>${[0, 1, 2, 3].map((j) => `<g transform="translate(${40 + j * 60},80)"><path d="M0 0 l12 -16 h16 l12 16 l-20 24z" fill="${['#9ad0ff', '#ff7a8a', '#9affc0', '#ffe08a'][(i + j) % 4]}" opacity=".9"/><path d="M12 -16 l8 16 l8 -16" stroke="#fff" stroke-width="1" opacity=".7"/></g>`).join('')}</g>`).join('')}
    <g transform="translate(800,150)"><path d="M0 0 v70" stroke="${PAL.brass}" stroke-width="4"/><path d="M-120 70 h240 q-20 -40 -120 -40 t-120 40z" fill="${PAL.brass}"/>${[-90, -45, 0, 45, 90].map((x) => `<path d="M${x} 70 v30" stroke="${PAL.brass}" stroke-width="3"/><circle cx="${x}" cy="104" r="12" fill="#ffe7a8" opacity=".9"/>`).join('')}</g>` },
  rooms: { wall: '#2a1a2a', label: 'Ashby’s rooms', sign: 'JERMYN ST', draw: () => `
    <g transform="translate(560,520)"><rect width="480" height="24" fill="#3a2416" stroke="#150c07" stroke-width="3"/><rect x="30" y="24" width="20" height="150" fill="#2a180c"/><rect x="430" y="24" width="20" height="150" fill="#2a180c"/>
    <path d="M60 0 q-10 -40 6 -64 h24 q16 24 6 64z" fill="#6a3a18" opacity=".9" stroke="#2a1608" stroke-width="2"/><rect x="72" y="-84" width="10" height="22" fill="#6a3a18"/>
    <path d="M200 0 v-30 h40 v30z" fill="#e9dcbd" opacity=".5" stroke="#fff" stroke-width="1"/><path d="M300 0 q10 -50 26 -50 h20 q16 0 26 50z" fill="#c9a24a" opacity=".7"/></g>
    ${Array.from({ length: 3 }, (_, i) => `<rect x="${220 + i * 340}" y="190" width="160" height="200" fill="#3a2a1a" stroke="${PAL.brassDk}" stroke-width="4"/><path d="M${240 + i * 340} 340 l50 -90 l30 40 l20 -30 l30 80z" fill="#6a4a2a" opacity=".6"/>`).join('')}
    <g transform="translate(1180,480)"><path d="M0 0 q0 -120 90 -120 q90 0 90 120 v140 h-180z" fill="#2a3a2a" stroke="#0a140a" stroke-width="3"/></g>` },
  office: { wall: '#201a14', label: 'Crake’s office', sign: 'S. CRAKE · LOANS', draw: () => `
    <g stroke="#0a0806" stroke-width="6"><rect x="200" y="140" width="260" height="320" fill="#10151f"/><path d="M240 140 v320 M300 140 v320 M360 140 v320 M420 140 v320" /></g>
    ${desk(560, 560, 620, '#201810')}${ledgerBook(640, 556)}
    <g transform="translate(1250,330)"><rect width="200" height="330" fill="#2a2a2e" stroke="#0a0a0c" stroke-width="5"/><circle cx="100" cy="150" r="46" fill="#3a3a42" stroke="#0a0a0c" stroke-width="4"/><circle cx="100" cy="150" r="14" fill="${PAL.brass}"/><text x="100" y="60" text-anchor="middle" font-size="22" fill="#9a9280" font-family="serif" font-weight="700">MILNER</text></g>
    <g transform="translate(700,200)"><rect width="200" height="110" fill="#e9dcbd" stroke="#150c07" stroke-width="3"/><text x="100" y="46" text-anchor="middle" font-family="serif" font-size="22" fill="#2a1a0a">LOANS ARRANGED</text><text x="100" y="80" text-anchor="middle" font-family="serif" font-size="16" fill="#5a4a2a">Discretion assured</text></g>` },
  lodging: { wall: '#2a2218', label: 'Pell’s lodgings', sign: 'PERCY ST', draw: () => `
    <rect x="1030" y="440" width="420" height="140" fill="#3a3a44" stroke="#15151a" stroke-width="4"/><rect x="1040" y="400" width="400" height="60" fill="#8a8a96" stroke="#15151a" stroke-width="3"/><rect x="1030" y="580" width="16" height="100" fill="#2a2a2e"/><rect x="1434" y="580" width="16" height="100" fill="#2a2a2e"/>
    <rect x="230" y="260" width="400" height="14" fill="#3a2416" stroke="#150c07" stroke-width="2"/>${booksRow(236, 190, 388, 70, 77, ['#5a1418', '#2a2f4a', '#1f3a2c', '#6a4a1e'])}
    <rect x="230" y="420" width="400" height="14" fill="#3a2416" stroke="#150c07" stroke-width="2"/>${booksRow(236, 350, 388, 70, 78)}
    <rect x="470" y="352" width="28" height="68" fill="#6a1a20" stroke="#2a0608" stroke-width="2"/><rect x="474" y="362" width="20" height="3" fill="${PAL.brass}"/><circle cx="484" cy="400" r="6" fill="#bfe4ff" opacity=".9"/>
    ${desk(660, 560, 300, '#3a2a18')}<rect x="690" y="540" width="120" height="22" fill="#e9dcbd" stroke="#7a6a4a" stroke-width="2"/><rect x="824" y="500" width="14" height="40" fill="#15151a"/>
    <g><rect x="740" y="200" width="160" height="110" fill="#33414a" stroke="#150c07" stroke-width="4"/><path d="M740 255 h160 M820 200 v110" stroke="#150c07" stroke-width="4"/></g>
    <rect x="1130" y="650" width="260" height="80" fill="#6a4a2a" stroke="#2a180c" stroke-width="3"/><rect x="1146" y="660" width="228" height="12" fill="${PAL.brass}" opacity=".5"/>` },
  study2: { wall: '#2a2230', label: 'Finch’s chambers', sign: 'A. FINCH · EXPERT', draw: () => `
    ${desk(480, 560, 760, '#3a2a30')}
    <g transform="translate(640,500)"><circle cx="40" cy="30" r="40" fill="#cfe0e8" opacity=".35" stroke="${PAL.brass}" stroke-width="6"/><path d="M70 60 l40 40" stroke="#5a3a1e" stroke-width="10" stroke-linecap="round"/></g>
    ${Array.from({ length: 5 }, (_, i) => `<g transform="translate(${180 + i * 250},180) rotate(${[-1.5, 1, -1, 2, -2][i]})"><rect width="190" height="250" fill="#e9dcbd" stroke="#3a2a1a" stroke-width="4"/><path d="M20 50 q30 -30 50 0 t50 0 t40 -10 M20 100 q30 -30 50 0 t50 0 M20 150 q40 -24 60 0 t60 0" stroke="#1a1208" stroke-width="2.5" fill="none" opacity=".75"/></g>`).join('')}
    <rect x="1280" y="300" width="260" height="380" fill="#2a1a1c" stroke="#150c07" stroke-width="4"/>${[0, 1, 2, 3, 4].map((i) => `<rect x="1292" y="${316 + i * 70}" width="236" height="56" fill="#3a2a2c" stroke="#150c07" stroke-width="2"/><circle cx="1410" cy="${344 + i * 70}" r="6" fill="${PAL.brass}"/>`).join('')}` },
  stationer: { wall: '#2f2a1e', label: 'Peabody & Sons', sign: 'PEABODY & SONS', draw: () => `
    ${[0, 1, 2, 3].map((i) => `<rect x="120" y="${150 + i * 120}" width="620" height="14" fill="#3a2416" stroke="#150c07" stroke-width="2"/>${Array.from({ length: 12 }, (_, j) => `<rect x="${130 + j * 50}" y="${86 + i * 120}" width="44" height="64" fill="${['#efe3c4', '#eef3f6', '#f4f4f0', '#f1ead2', '#f6efdc'][(i + j) % 5]}" stroke="#7a6a4a" stroke-width="1.5"/><rect x="${136 + j * 50}" y="${96 + i * 120}" width="32" height="12" fill="${['#2a3a5a', '#5a1418', '#1f3a2c'][(j) % 3]}" opacity=".8"/>`).join('')}`).join('')}
    <g transform="translate(880,520)"><rect width="640" height="32" fill="#4a2d18" stroke="#150c07" stroke-width="4"/><rect x="20" y="32" width="600" height="150" fill="#2a180c" stroke="#150c07" stroke-width="4"/></g>
    ${ledgerBook(1020, 516)}
    ${Array.from({ length: 4 }, (_, i) => `<g transform="translate(${1240 + i * 66},420)"><rect width="46" height="100" fill="#efe3c4" stroke="#7a6a4a" stroke-width="2" rx="6"/><ellipse cx="23" cy="0" rx="23" ry="8" fill="#e6d8b2" stroke="#7a6a4a" stroke-width="2"/></g>`).join('')}` },
  locksmith: { wall: '#251c16', label: 'Tench the locksmith', sign: 'J. TENCH · LOCKS & KEYS', draw: () => `
    ${Array.from({ length: 140 }, (_, i) => { const r = rng(i * 13 + 1); const x = 120 + (i % 20) * 70 + r() * 20, y = 120 + Math.floor(i / 20) * 70 + r() * 10; return `<g transform="translate(${x.toFixed(0)},${y.toFixed(0)}) rotate(${(r() * 20 - 10).toFixed(0)})"><circle cx="0" cy="0" r="9" fill="none" stroke="${i % 5 ? '#8a6a2a' : '#c9a24a'}" stroke-width="3"/><path d="M0 9 v32 M0 30 h10 M0 38 h8" stroke="${i % 5 ? '#8a6a2a' : '#c9a24a'}" stroke-width="3"/></g>`; }).join('')}
    <g transform="translate(300,560)"><rect width="1000" height="26" fill="#4a2d18" stroke="#150c07" stroke-width="4"/><rect x="40" y="26" width="920" height="140" fill="#2a180c" stroke="#150c07" stroke-width="4"/><rect x="120" y="-60" width="70" height="60" fill="#3a3a40" stroke="#0a0a0c" stroke-width="3"/><rect x="146" y="-90" width="14" height="30" fill="#5a5a62"/><path d="M400 -4 h160 l-20 -26 h-100z" fill="#2a2a30" stroke="#0a0a0c" stroke-width="3"/></g>` },
  insurance: { wall: '#2c2a30', label: 'Royal Exchange Assurance', sign: 'ROYAL EXCHANGE ASSURANCE', draw: () => `
    <rect x="140" y="520" width="1320" height="150" fill="#e6e0d2" stroke="#150c07" stroke-width="4"/><rect x="140" y="520" width="1320" height="26" fill="#bdb6a2"/>
    ${Array.from({ length: 16 }, (_, i) => `<path d="M${180 + i * 80} 300 v220" stroke="${PAL.brass}" stroke-width="5"/>`).join('')}<rect x="170" y="296" width="1280" height="14" fill="${PAL.brass}"/>
    <g transform="translate(760,130)"><circle cx="80" cy="80" r="76" fill="#e9dcbd" stroke="${PAL.brass}" stroke-width="8"/><path d="M80 80 v-52 M80 80 l36 20" stroke="#1a1208" stroke-width="5"/></g>` },
  pawn: { wall: '#2a1e16', label: 'Moss the pawnbroker', sign: 'A. MOSS · PAWNBROKER', draw: () => `
    <g>${[0, 1, 2].map((i) => `<circle cx="${760 + i * 56}" cy="${i === 1 ? 130 : 180}" r="26" fill="${PAL.brass}" stroke="#6a4a1a" stroke-width="3"/>`).join('')}</g>
    ${Array.from({ length: 22 }, (_, i) => { const r = rng(i * 7 + 3); const x = 120 + (i % 11) * 130 + r() * 14, y = 240 + Math.floor(i / 11) * 150; return i % 3 === 0 ? `<g transform="translate(${x},${y})"><circle r="30" fill="#c9a24a" opacity=".9"/><circle r="22" fill="#e9dcbd"/><path d="M0 0 v-16 M0 0 l9 5" stroke="#1a1208" stroke-width="2"/></g>` : i % 3 === 1 ? `<g transform="translate(${x},${y + 20})"><path d="M0 0 c14 0 20 12 14 24 c12 6 10 26 -6 30 c-14 4 -28 -2 -28 -14 c0 -8 5 -12 9 -15 c-8 -11 0 -25 11 -25z" fill="#8a4a1e" stroke="#2a1208" stroke-width="2"/></g>` : `<g transform="translate(${x},${y})"><rect x="-22" y="-8" width="44" height="40" fill="#6a1a20" stroke="#2a0608" stroke-width="2"/><rect x="-18" y="-16" width="36" height="12" fill="#3a3a44"/></g>`; }).join('')}
    <g transform="translate(220,560)"><rect width="1160" height="28" fill="#3a2416" stroke="#150c07" stroke-width="4"/><rect x="40" y="28" width="1080" height="160" fill="#201208" stroke="#150c07" stroke-width="4"/>${Array.from({ length: 12 }, (_, i) => `<path d="M${60 + i * 90} -190 v190" stroke="#0a0806" stroke-width="5"/>`).join('')}</g>` },
  baker: null,
};

function interior(kind, placeId, state) {
  const hour = ((state?.t ?? 600) % 1440) / 60;
  const t = lightTint(hour);
  const k = KINDS[kind] || KINDS.office;
  const hots = hotspotsFor(kind);
  const showWindow = !['gallery', 'insurance', 'locksmith', 'stationer', 'pawn', 'club', 'study2', 'yard', 'office'].includes(kind) ? '' : '';
  const hasWin = ['rooms', 'club', 'yard', 'office', 'insurance'].includes(kind);
  return frame(`
  ${wallpaper(k.wall)}
  ${floor()}
  ${hasWin ? sash(1180, 120, 260, 320, t) : ''}
  ${k.draw()}
  ${gasLamp(800, 120)}
  ${sign(560, 118, 480, k.sign, '#0e0c0a', PAL.brass, 34)}
  <circle cx="800" cy="430" r="560" fill="url(#gasGlow)" opacity=".4" pointer-events="none"/>
  <g class="hots">${hots}</g>`, { hour, cls: 'int ' + kind, label: k.label });
}

function hotspotsFor(kind) {
  switch (kind) {
    case 'stationer': return hot(880, 480, 640, 200, 'Look at the ledger', 'ledger', 8) + hot(120, 70, 640, 520, 'Ask about the paper', 'paper stock', 8);
    case 'locksmith': return hot(300, 520, 1000, 200, 'Ask about the Chubb key', 'workbench', 8);
    case 'lodging': return hot(230, 180, 400, 260, 'Examine the books', 'bookshelf', 8) + hot(660, 520, 300, 120, 'Examine the writing table', 'desk', 8) + hot(1030, 400, 420, 300, 'Examine the bed and trunk', 'bed', 8);
    case 'office': return hot(1250, 330, 200, 330, 'Ask about the loan', 'safe', 8) + hot(560, 520, 620, 200, 'Ask about the loan', 'desk', 8);
    case 'study2': return hot(480, 520, 760, 160, 'Examine the handwriting', 'desk', 8);
    default: return '';
  }
}

// ------------------------------------------------------------------- the public entry
export function renderScene(placeId, state) {
  const p = PLACES[placeId];
  if (!p) return room221b(state);
  switch (p.kind) {
    case 'baker': return room221b(state);
    case 'study': return study(state);
    case 'house': return house(state);
    default: return interior(p.kind, placeId, state);
  }
}
