// The people, places, objects and vocabulary of The Adventure of the Marlowe Star.

// ---------------------------------------------------------------- people
// look: used by the portrait painter. role: shown in the casebook.
export const PEOPLE = {
  watson: {
    name: 'Dr. John Watson', short: 'Watson', role: 'My friend and chronicler', known: true,
    names: ['watson', 'john watson', 'doctor', 'doctor watson', 'doc', 'john', 'my friend'],
    look: { skin: '#e8c4a0', hair: '#5a3d22', facial: 'mustache', hat: 'none', coat: '#5b4630', collar: '#f1ead8', build: 'broad' },
  },
  hudson: {
    name: 'Mrs. Hudson', short: 'Mrs. Hudson', role: 'Our landlady', known: true,
    names: ['hudson', 'mrs hudson', 'landlady at baker street', 'housekeeper at baker street'],
    look: { skin: '#ecd0b2', hair: '#cfcfcf', facial: 'none', hat: 'cap', coat: '#3d3d4a', collar: '#f1ead8', gender: 'f' },
  },
  sir_alistair: {
    name: 'Sir Alistair Marlowe', short: 'Sir Alistair', role: 'Owner of the Marlowe Star', known: true, home: 'marlowe_house',
    names: ['sir alistair', 'alistair', 'alistair marlowe', 'marlowe', 'sir marlowe', 'the owner', 'owner', 'baronet', 'client', 'our client', 'host'],
    look: { skin: '#e2b894', hair: '#d8d8d4', facial: 'sideburns', hat: 'none', coat: '#2f3a2f', collar: '#f1ead8', build: 'broad' },
  },
  pell: {
    name: 'Mr. Julian Pell', short: 'Pell', role: "Sir Alistair's secretary", home: 'marlowe_house',
    names: ['julian pell', 'pell', 'the secretary', 'secretary', 'sir alistair secretary', 'clerk'],
    look: { skin: '#ecd0b4', hair: '#2a1d14', facial: 'mustache', hat: 'none', coat: '#24272f', collar: '#f6f1e2', build: 'slim' },
  },
  ashby: {
    name: 'Mr. Cuthbert Ashby', short: 'Ashby', role: "Sir Alistair's brother-in-law", home: 'ashby_rooms',
    names: ['cuthbert ashby', 'ashby', 'cuthbert', 'brother in law', 'the brother in law', 'late wife brother', 'wife brother'],
    look: { skin: '#e6b99a', hair: '#8c5a35', facial: 'beard', hat: 'none', coat: '#5a2a2a', collar: '#efe6d0', build: 'round' },
  },
  gradwell: {
    name: 'Mr. Lucian Gradwell', short: 'Gradwell', role: 'Rival collector, dealer in gems', home: 'gradwell_gallery',
    names: ['lucian gradwell', 'gradwell', 'lucian', 'the collector', 'rival collector', 'rival', 'dealer', 'collector'],
    look: { skin: '#e8c8a8', hair: '#1c1c1c', facial: 'mustache', hat: 'top', coat: '#1d2a3c', collar: '#f6f1e2', build: 'slim' },
  },
  mary: {
    name: 'Mary Dunn', short: 'Mary', role: 'Housemaid at Marlowe House', home: 'marlowe_house',
    names: ['mary dunn', 'mary', 'dunn', 'the housemaid', 'housemaid', 'maid', 'the maid'],
    look: { skin: '#f0d3b8', hair: '#6b3f26', facial: 'none', hat: 'cap', coat: '#33384a', collar: '#f6f1e2', gender: 'f' },
  },
  reeve: {
    name: 'Thomas Reeve', short: 'Reeve', role: 'Footman at Marlowe House', home: 'marlowe_house',
    names: ['thomas reeve', 'reeve', 'tom reeve', 'thomas', 'the footman', 'footman'],
    look: { skin: '#e9c8a6', hair: '#c79a4a', facial: 'none', hat: 'none', coat: '#7a1f24', collar: '#f6f1e2', build: 'slim' },
  },
  pargeter: {
    name: 'Mrs. Pargeter', short: 'Mrs. Pargeter', role: 'Housekeeper at Marlowe House', home: 'marlowe_house',
    names: ['pargeter', 'mrs pargeter', 'the housekeeper', 'housekeeper'],
    look: { skin: '#ead0b2', hair: '#9a9a9a', facial: 'none', hat: 'cap', coat: '#1f1f26', collar: '#f6f1e2', gender: 'f', build: 'broad' },
  },
  tull: {
    name: 'Joseph Tull', short: 'Tull', role: 'Coachman at Marlowe House', home: 'marlowe_house',
    names: ['joseph tull', 'tull', 'the coachman', 'coachman', 'joseph'],
    look: { skin: '#dcae8a', hair: '#7a7a7a', facial: 'sideburns', hat: 'bowler', coat: '#3a3326', collar: '#e8dfc8', build: 'broad' },
  },
  lestrade: {
    name: 'Inspector Lestrade', short: 'Lestrade', role: 'Scotland Yard', known: true, home: 'scotland_yard',
    names: ['lestrade', 'inspector lestrade', 'inspector', 'the inspector', 'the yard', 'scotland yard man', 'the police', 'police'],
    look: { skin: '#e2b894', hair: '#2a2018', facial: 'mustache', hat: 'bowler', coat: '#2a2a30', collar: '#efe6d0', build: 'slim' },
  },
  mycroft: {
    name: 'Mycroft Holmes', short: 'Mycroft', role: 'My brother, of the Diogenes Club', known: true, home: 'diogenes',
    names: ['mycroft', 'mycroft holmes', 'my brother', 'brother', 'the government', 'whitehall'],
    look: { skin: '#e8c8a8', hair: '#3a3a3a', facial: 'none', hat: 'none', coat: '#2c2c34', collar: '#f6f1e2', build: 'broad' },
  },
  wiggins: {
    name: 'Wiggins and the Irregulars', short: 'Wiggins', role: 'The Baker Street Irregulars', known: true,
    names: ['wiggins', 'the irregulars', 'irregulars', 'baker street irregulars', 'the boys', 'boys', 'urchins', 'street arabs', 'my street urchins', 'the urchins', 'the lads', 'lads', 'gang'],
    look: { skin: '#d7ae8a', hair: '#3b2a1a', facial: 'none', hat: 'cap', coat: '#4a4238', collar: '#bfb49c', build: 'slim' },
  },
  peabody: {
    name: 'Mr. Ezekiel Peabody', short: 'Peabody', role: 'Stationer, Holborn', home: 'peabody_shop',
    names: ['peabody', 'ezekiel peabody', 'the stationer', 'stationer', 'peabody and sons', 'shopkeeper at holborn'],
    look: { skin: '#e8c4a0', hair: '#bdbdbd', facial: 'beard', hat: 'none', coat: '#4a3a2a', collar: '#efe6d0', glasses: true, build: 'round' },
  },
  tench: {
    name: 'Josiah Tench', short: 'Tench', role: 'Locksmith, Clerkenwell', home: 'tench_shop',
    names: ['tench', 'josiah tench', 'the locksmith', 'locksmith'],
    look: { skin: '#d9ad88', hair: '#4a3a2a', facial: 'mustache', hat: 'cap', coat: '#46372a', collar: '#c8bba0', build: 'broad' },
  },
  crake: {
    name: 'Septimus Crake', short: 'Crake', role: 'Moneylender, Soho', home: 'crake_office',
    names: ['septimus crake', 'crake', 'the moneylender', 'moneylender', 'lender', 'usurer'],
    look: { skin: '#e0bd9c', hair: '#222', facial: 'none', hat: 'top', coat: '#1a1a1a', collar: '#e8dfc8', glasses: true, build: 'slim' },
  },
  moss: {
    name: 'Abel Moss', short: 'Moss', role: 'Pawnbroker and dealer, Lambeth', home: 'moss_shop',
    names: ['abel moss', 'moss', 'the pawnbroker', 'pawnbroker', 'the fence', 'fence', 'receiver'],
    look: { skin: '#dcb592', hair: '#3d2f22', facial: 'beard', hat: 'cap', coat: '#3a3a2a', collar: '#cfc3a6', build: 'round' },
  },
  hodge: {
    name: 'Mrs. Hodge', short: 'Mrs. Hodge', role: "Pell's landlady, Bloomsbury", home: 'pell_lodging',
    names: ['hodge', 'mrs hodge', 'the landlady', 'landlady', 'pell landlady'],
    look: { skin: '#ecd0b2', hair: '#7a6a5a', facial: 'none', hat: 'cap', coat: '#4a3340', collar: '#efe6d0', gender: 'f', build: 'broad' },
  },
  finch: {
    name: 'Mr. Ambrose Finch', short: 'Finch', role: 'Expert in handwriting, Gray\'s Inn', home: 'finch_chambers',
    names: ['ambrose finch', 'finch', 'the handwriting expert', 'handwriting expert', 'the expert', 'calligrapher', 'graphologist'],
    look: { skin: '#e8c8a8', hair: '#9a9a9a', facial: 'sideburns', hat: 'none', coat: '#3a2f44', collar: '#f1ead8', glasses: true, build: 'slim' },
  },
  fenwick: {
    name: 'Mr. Fenwick', short: 'Fenwick', role: 'Clerk at the Royal Exchange Assurance', home: 'insurance_office',
    names: ['fenwick', 'mr fenwick', 'the insurance clerk', 'insurance clerk', 'underwriter', 'the insurer'],
    look: { skin: '#ecd0b4', hair: '#6a4a2a', facial: 'mustache', hat: 'none', coat: '#2c3a46', collar: '#f6f1e2', glasses: true, build: 'slim' },
  },
  van_hoorn: {
    name: 'Mynheer Van Hoorn', short: 'Van Hoorn', role: 'Diamond merchant of Amsterdam', remote: true,
    names: ['van hoorn', 'mynheer van hoorn', 'hoorn', 'the dutch dealer', 'dutch dealer', 'dutchman', 'the dutchman', 'the buyer', 'buyer', 'amsterdam dealer'],
    look: { skin: '#e8c8a8', hair: '#8a8a8a', facial: 'beard', hat: 'none', coat: '#2a2a3a', collar: '#f1ead8', build: 'broad' },
  },
  matron: {
    name: 'The Matron, Torquay', short: 'The Matron', role: 'Sanatorium at Torquay', remote: true,
    names: ['matron', 'the matron', 'sanatorium', 'the sanatorium', 'torquay', 'hannah', 'hannah pell', 'pell sister', 'sister of pell'],
    look: { skin: '#f0d3b8', hair: '#d0d0d0', facial: 'none', hat: 'cap', coat: '#e8e8ee', collar: '#ffffff', gender: 'f' },
  },
};

export const PERSON_ORDER = Object.keys(PEOPLE);

// ---------------------------------------------------------------- places
// pos: map position on a 1000 x 640 sheet. kind: which backdrop the painter uses.
export const PLACES = {
  baker_street: {
    name: '221B Baker Street', short: 'Baker Street', district: 'Marylebone', pos: [420, 150], kind: 'baker', known: true,
    names: ['221b', 'baker street', 'home', 'my rooms', 'our rooms', 'sitting room', 'rooms', 'back home', 'lodgings at baker street'],
    blurb: 'Our sitting room, Mrs. Hudson’s staircase and the smell of last night’s pipe.',
  },
  marlowe_house: {
    name: 'Marlowe House, Campden Hill', short: 'Marlowe House', district: 'Kensington', pos: [130, 300], kind: 'house', known: true,
    names: ['marlowe house', 'campden hill', 'the house', 'sir alistair house', 'the scene', 'scene of the crime', 'the hall', 'kensington'],
    blurb: 'A tall red-brick house behind a laurel hedge, its blinds half drawn.',
  },
  marlowe_study: {
    name: 'The study at Marlowe House', short: 'The study', district: 'Kensington', pos: [130, 300], kind: 'study', parent: 'marlowe_house', known: true,
    names: ['the study', 'study', 'sir alistair study', 'library', 'the library', 'safe room'],
    blurb: 'Green walls, a great mahogany desk, and a safe let into the chimney breast.',
  },
  scotland_yard: {
    name: 'New Scotland Yard', short: 'Scotland Yard', district: 'Westminster', pos: [540, 430], kind: 'yard', known: true,
    names: ['scotland yard', 'new scotland yard', 'the yard', 'police station', 'police headquarters', 'headquarters', 'embankment'],
    blurb: 'The new red-and-white building on the Embankment.',
  },
  diogenes: {
    name: 'The Diogenes Club, Pall Mall', short: 'Diogenes Club', district: 'Pall Mall', pos: [430, 395], kind: 'club', known: true,
    names: ['diogenes club', 'the diogenes', 'diogenes', 'pall mall', 'the club', 'strangers room', 'club'],
    blurb: 'The most unsociable club in London, where speech is forbidden outside the Strangers’ Room.',
  },
  gradwell_gallery: {
    name: 'Gradwell’s Gallery, Bond Street', short: 'Gradwell’s Gallery', district: 'Mayfair', pos: [400, 290], kind: 'gallery',
    names: ['gradwell gallery', 'gradwell house', 'gradwell shop', 'bond street', 'the gallery'],
    blurb: 'Cases of cut stones under glass and a doorman in a plum coat.',
  },
  ashby_rooms: {
    name: 'Mr. Ashby’s rooms, Jermyn Street', short: 'Ashby’s rooms', district: 'St James’s', pos: [475, 345], kind: 'rooms',
    names: ['ashby rooms', 'ashby house', 'jermyn street', 'jermyn', 'ashby lodgings', 'ashby place'],
    blurb: 'Bachelor rooms above a hatter’s, with a decanter always at hand.',
  },
  crake_office: {
    name: 'Crake’s office, Dean Street', short: 'Crake’s office', district: 'Soho', pos: [520, 285], kind: 'office',
    names: ['crake office', 'crake shop', 'dean street', 'soho', 'moneylender office'],
    blurb: 'A brass plate, a barred window and a very quiet staircase.',
  },
  pell_lodging: {
    name: 'Pell’s lodgings, Percy Street', short: 'Pell’s lodgings', district: 'Bloomsbury', pos: [590, 205], kind: 'lodging',
    names: ['pell lodging', 'pell room', 'pell digs', 'percy street', 'bloomsbury', 'lodgings', 'lodging', 'the lodging', 'his lodgings', 'his rooms', 'his room'],
    blurb: 'A narrow house of brown brick; the second-floor back belongs to Mr. Pell.',
  },
  finch_chambers: {
    name: 'Finch’s chambers, Gray’s Inn', short: 'Finch’s chambers', district: 'Holborn', pos: [660, 238], kind: 'study2',
    names: ['finch chambers', 'finch rooms', 'grays inn', 'gray inn', 'finch office'],
    blurb: 'Up three flights, among pens, magnifiers and the smell of old gum arabic.',
  },
  peabody_shop: {
    name: 'Peabody & Sons, Stationers, Holborn', short: 'Peabody’s', district: 'Holborn', pos: [715, 275], kind: 'stationer',
    names: ['peabody shop', 'peabody and sons', 'stationers', 'stationers shop', 'holborn', 'the stationers', 'stationery shop', 'paper shop'],
    blurb: 'Reams of paper stacked to the ceiling and a ledger as long as a coffin.',
  },
  tench_shop: {
    name: 'Tench the locksmith, Clerkenwell', short: 'Tench’s workshop', district: 'Clerkenwell', pos: [775, 205], kind: 'locksmith',
    names: ['tench shop', 'tench workshop', 'clerkenwell', 'locksmith shop', 'locksmiths'],
    blurb: 'A workshop hung with a thousand keys that open nothing in particular.',
  },
  insurance_office: {
    name: 'Royal Exchange Assurance, Cornhill', short: 'The Assurance office', district: 'The City', pos: [830, 320], kind: 'insurance',
    names: ['insurance office', 'assurance office', 'royal exchange', 'royal exchange assurance', 'cornhill', 'the city', 'city', 'lloyds', 'insurance company'],
    blurb: 'Marble floors, brass grilles and clerks who never raise their voices.',
  },
  moss_shop: {
    name: 'Moss the pawnbroker, Lambeth Walk', short: 'Moss’s shop', district: 'Lambeth', pos: [600, 520], kind: 'pawn',
    names: ['moss shop', 'pawn shop', 'pawnshop', 'lambeth', 'lambeth walk', 'the pawnshop'],
    blurb: 'Three brass balls over a door that has seen a great many hard-luck stories.',
  },
};

export const PLACE_ORDER = Object.keys(PLACES);

export function parentPlace(id) { return PLACES[id]?.parent ?? id; }

export function travelMinutes(a, b) {
  const A = PLACES[parentPlace(a)], B = PLACES[parentPlace(b)];
  if (!A || !B) return 0;
  if (parentPlace(a) === parentPlace(b)) return a === b ? 0 : 2;
  const d = Math.hypot(A.pos[0] - B.pos[0], A.pos[1] - B.pos[1]);
  return Math.round(14 + d * 0.085);
}

export function travelFare(a, b) {
  if (parentPlace(a) === parentPlace(b)) return 0;
  const A = PLACES[parentPlace(a)], B = PLACES[parentPlace(b)];
  const d = Math.hypot(A.pos[0] - B.pos[0], A.pos[1] - B.pos[1]);
  return 1 + Math.floor(d / 190);
}

// ---------------------------------------------------------------- objects
// Things Holmes can look at. `at` is the place he must be in.
export const OBJECTS = {
  telegram: { at: 'baker_street', names: ['telegram', 'wire', 'case file', 'casefile', 'the message from sir alistair', 'sir alistair message'] },
  specimens: { at: 'baker_street', names: ['specimen', 'specimens', 'sample book', 'sample books', 'paper samples', 'specimen cards', 'paper specimens', 'watermarks', 'my collection of papers', 'index of papers'] },
  lens: { at: 'baker_street', names: ['microscope', 'chemical table', 'chemicals', 'retort', 'acid'] },
  note: { at: null, names: ['the note', 'note', 'robbers note', 'thiefs note', 'the letter', 'the message', 'the scrap', 'the paper', 'the slip'] },
  safe: { at: 'marlowe_study', names: ['safe', 'the safe', 'strongbox', 'steel door', 'iron door', 'strong box'] },
  keyhole: { at: 'marlowe_study', names: ['keyhole', 'key hole', 'the lock', 'safe lock', 'lock of the safe', 'wards', 'lock'] },
  window: { at: 'marlowe_study', names: ['study window', 'window', 'the window', 'sash', 'catch', 'latch', 'window latch'] },
  desk: { at: 'marlowe_study', names: ['desk', 'the desk', 'writing desk', 'pigeonholes', 'drawers'] },
  copybook: { at: 'marlowe_study', names: ['copy book', 'copybook', 'letter book', 'letterbook', 'correspondence', 'letters on the desk', 'press copy book', 'secretary papers', 'secretary letters'] },
  blotter: { at: 'marlowe_study', names: ['blotter', 'blotting paper', 'blotting pad', 'blotting'] },
  fireplace: { at: 'marlowe_study', names: ['fireplace', 'hearth', 'grate', 'ashes', 'ash', 'cinders', 'chimney'] },
  carpet: { at: 'marlowe_study', names: ['carpet', 'rug', 'floor', 'floorboards', 'footprints', 'foot prints', 'footmarks', 'tracks'] },
  under_desk: { at: 'marlowe_study', names: ['under the desk', 'beneath the desk', 'behind the desk', 'underneath the desk', 'wastepaper basket', 'wastebasket', 'waste paper', 'bin'] },
  bookcases: { at: 'marlowe_study', names: ['bookcase', 'bookcases', 'bookshelves', 'books in the study', 'shelves in the study'] },
  study_door: { at: 'marlowe_study', names: ['study door', 'the door', 'door of the study', 'door'] },
  back_stairs: { at: 'marlowe_house', names: ['back stairs', 'back staircase', 'servants stairs', 'servant stairs', 'stairs', 'staircase', 'passage', 'corridor', 'landing'] },
  side_door: { at: 'marlowe_house', names: ['side door', 'garden door', 'garden', 'flowerbed', 'flower bed', 'lawn', 'path', 'cigar ends', 'cigarette ends', 'cigarette end', 'the garden'] },
  hall: { at: 'marlowe_house', names: ['dining room', 'drawing room', 'billiard room', 'hall'] },
  lodging_books: { at: 'pell_lodging', names: ['bookshelf', 'bookshelves', 'books', 'book', 'volumes', 'volume', 'debrett', 'debretts', 'peerage', 'shelf', 'shelves', 'hollow book', 'hollow volume'] },
  lodging_desk: { at: 'pell_lodging', names: ['desk in his room', 'table', 'writing table', 'writing desk', 'papers', 'letters', 'correspondence', 'drawer', 'drawers'] },
  lodging_bed: { at: 'pell_lodging', names: ['bed', 'mattress', 'trunk', 'box', 'portmanteau', 'luggage', 'wardrobe', 'bag', 'cupboard'] },
  lodging_grate: { at: 'pell_lodging', names: ['grate', 'fireplace', 'ashes', 'burnt papers', 'cinders'] },
  shop_ledger: { at: 'peabody_shop', names: ['ledger', 'order book', 'sales book', 'day book', 'daybook', 'account book'] },
};

// ---------------------------------------------------------------- newspapers
export const PAPERS = {
  times: { name: 'The Times', names: ['the times', 'times', 'london times', 'thunderer'] },
  telegraph: { name: 'The Daily Telegraph', names: ['daily telegraph', 'the telegraph', 'telegraph', 'the daily telegraph'] },
  morning_post: { name: 'The Morning Post', names: ['morning post', 'the morning post', 'the post', 'society column', 'society pages'] },
  pall_mall: { name: 'The Pall Mall Gazette', names: ['pall mall gazette', 'the pall mall gazette', 'the gazette', 'gazette', 'pall mall paper'] },
  city_press: { name: 'The City Press', names: ['city press', 'the city press', 'financial paper', 'financial news', 'the financial news', 'financial times', 'the city paper', 'finance pages', 'money pages', 'city pages'] },
  police_news: { name: 'The Illustrated Police News', names: ['illustrated police news', 'the illustrated police news', 'police news', 'penny dreadful', 'the rag', 'scandal sheet', 'sensational paper', 'penny paper', 'gutter press', 'the police news'] },
};
export const PAPER_ORDER = Object.keys(PAPERS);

// ---------------------------------------------------------------- the five paper makers
export const MAKERS = {
  whatman: { name: 'Whatman', line: 'Turkey Mill Wove', tint: '#eef3f6', laid: false, mark: 'wreath', weight: 'heavy', note: 'bluish, hand-made, smooth wove with no laid lines' },
  joynson: { name: 'Joynson', line: 'Crown Laid', tint: '#efe3c4', laid: true, mark: 'crown', weight: 'medium', note: 'cream, with fine laid lines and a crown watermark' },
  portal: { name: 'Portal', line: 'Laverstoke Bank', tint: '#f4f4f0', laid: true, mark: 'wave', weight: 'thin', note: 'very thin, crisp and white, a wavy-line mark' },
  dickinson: { name: 'Dickinson', line: 'Royal Bath', tint: '#f1ead2', laid: false, mark: 'shield', weight: 'medium', note: 'cream wove with a shield, no laid lines' },
  spicer: { name: 'Spicer', line: 'Imperial Plain', tint: '#f6efdc', laid: false, mark: 'star', weight: 'heavy', note: 'thick cream wove with a small star' },
};
export const MAKER_ORDER = Object.keys(MAKERS);

// ---------------------------------------------------------------- vocabulary
// topic id -> phrases that signal it. The matcher stems words and forgives small typos.
export const TOPICS = {
  greet: ['hello', 'good morning', 'good day', 'good afternoon', 'good evening', 'introduce', 'who are you', 'yourself', 'background', 'your work', 'your position'],
  theft: ['theft', 'robbery', 'stolen', 'stole', 'steal', 'disappear', 'vanish', 'missing', 'star', 'diamond', 'stone', 'jewel', 'gem', 'marlowe star', 'crime', 'burglary', 'happened', 'what happened', 'tell me everything', 'your story', 'the loss', 'discover', 'found it gone', 'found it missing'],
  evening: ['evening', 'night', 'saturday', 'dinner', 'the party', 'whereabout', 'alibi', 'were you', 'was he', 'was she', 'left the room', 'leave the room', 'absent', 'absence', 'excuse', 'timeline', 'sequence of events', 'what time', 'what did you do', 'movements', 'who left', 'after dinner', 'during the party'],
  guests: ['guest', 'invite', 'attend', 'who was there', 'company', 'who came', 'who dined', 'list of', 'names of', 'present that night'],
  combination: ['combination', 'combo', 'code', 'dial', 'who knows', 'who could open', 'who knew', 'who had access', 'access to the safe', 'open the safe', 'knew the number', 'knows the number'],
  key: ['key', 'duplicate', 'spare', 'cut a key', 'copied the key', 'second key', 'only key', 'other key', 'watch chain', 'brass'],
  safe: ['safe', 'strongbox', 'strong box', 'vault'],
  note: ['note', 'regret', 'inconvenience', 'better hands', 'message left', 'calling card'],
  paper: ['paper', 'stationery', 'watermark', 'vellum', 'laid paper', 'quire', 'ream', 'writing paper', 'crown laid', 'joynson', 'whatman', 'portal', 'dickinson', 'spicer', 'cream paper', 'sold paper', 'notepaper', 'who buys', 'who bought', 'purchase of paper', 'customers'],
  hand: ['handwriting', 'penmanship', 'copperplate', 'scrawl', 'forger', 'forgery', 'slant', 'letterform', 'script', 'disguised', 'whose hand', 'compare the writing', 'written by', 'writer of', 'the hand'],
  ink: ['ink', 'nib', 'blotter', 'blotting'],
  debts: ['debt', 'owe', 'owed', 'money trouble', 'loan', 'borrow', 'creditor', 'moneylender', 'usury', 'interest', 'bankrupt', 'poor', 'in need of money', 'arrears', 'fees', 'finances', 'penniless', 'in trouble', 'repay', 'repayment', 'lend', 'lent'],
  sister: ['sister', 'hannah', 'torquay', 'sanatorium', 'sanitarium', 'invalid', 'consumption', 'family', 'relation', 'ill', 'illness', 'sick'],
  sale: ['sale', 'sell', 'selling', 'sold', 'buyer', 'dutch', 'amsterdam', 'van hoorn', 'offer', 'price', 'purchase', 'negotiation', 'bargain', 'agreement', 'contract'],
  insurance: ['insurance', 'insured', 'policy', 'underwriter', 'premium', 'assurance', 'lloyd', 'cover'],
  quarrel: ['quarrel', 'argument', 'dispute', 'angry', 'argued', 'feud', 'temper', 'shout', 'inherit', 'inheritance', 'bequest', 'will', 'heirloom', 'legacy', 'row', 'bad blood', 'grudge', 'enemy', 'enemies', 'motive'],
  stairs: ['stair', 'staircase', 'back stairs', 'landing', 'corridor', 'passage', 'saw anyone', 'saw anything', 'ghost', 'figure', 'on the stairs', 'servants stair', 'ice', 'carrying'],
  garden: ['garden', 'smoking', 'smoke', 'cigarette', 'cigar', 'side door', 'boots', 'muddy', 'flowerbed', 'lawn', 'outside', 'terrace'],
  light: ['light', 'lamp', 'lit', 'glow', 'candle', 'gaslight', 'lighted', 'illuminated', 'window of the study'],
  servants: ['servant', 'staff', 'household', 'domestic', 'butler', 'who works', 'who lives'],
  boat: ['boat', 'steamer', 'passage', 'ticket', 'harwich', 'antwerp', 'continent', 'abroad', 'sail', 'sailing', 'liverpool street', 'flee', 'fled', 'escape', 'leave the country', 'depart', 'booking', 'passenger', 'manifest', 'passport', 'ship', 'port', 'sailed', 'departure', 'travel'],
  fence: ['pawn', 'pawnbroker', 'fence', 'receiver', 'hock', 'sell the stone', 'stolen goods', 'dealer in stolen', 'market', 'underworld', 'buy stolen', 'traffic in'],
  professional: ['cracksman', 'burglar', 'professional', 'safebreaker', 'safe breaker', 'housebreaker', 'cracksmen', 'gang', 'known thief', 'known thieves', 'criminals', 'underworld'],
  record: ['record', 'criminal record', 'convicted', 'prison', 'magistrate', 'known to the police', 'file on', 'charge sheet', 'previous', 'form', 'past'],
  warrant: ['warrant', 'search warrant', 'search his', 'arrest', 'detain', 'custody', 'hold him', 'take him in', 'search the lodging', 'search the room'],
  police: ['police', 'yard', 'scotland yard', 'inspector', 'reported', 'constable', 'official', 'the law', 'report it', 'reported to'],
  curse: ['curse', 'cursed', 'ghost', 'omen', 'superstition', 'legend', 'ghostly', 'haunted', 'unlucky', 'bad luck'],
  value: ['value', 'worth', 'history', 'provenance', 'carat', 'cut', 'origin', 'famous', 'how big', 'description', 'what does it look like'],
  character: ['trust', 'trusted', 'loyal', 'honest', 'character', 'reputation', 'opinion', 'think of', 'suspect', 'suspicion', 'who do you suspect', 'blame', 'capable', 'tell me about him', 'tell me about her', 'what sort of'],
  employer: ['employer', 'master', 'the baronet', 'your master', 'your employer', 'wages', 'salary', 'paid', 'position'],
  lodging: ['lodger', 'lodging', 'rooms', 'rent', 'visitors', 'callers', 'comes and goes', 'habits', 'hours', 'late', 'returns', 'came home', 'heavy', 'parcel', 'package', 'bundle'],
  letters: ['letters', 'post', 'postman', 'envelope', 'wrote', 'writes', 'correspond', 'received'],
  customers: ['customers', 'regular', 'who buys', 'who bought', 'ledger', 'order', 'orders', 'sales', 'accounts', 'sold to', 'purchaser', 'bought'],
  warn: ['warn', 'threaten', 'caution'],
  callers: ['caller', 'called', 'visitor', 'men at the door', 'at the door', 'area door', 'came asking', 'asked for him', 'strangers', 'men who called', 'men in black', 'unwelcome', 'tradesmen', 'dun', 'dunned', 'bailiff', 'bailiffs'],
};

// Words that change how a person will react.
export const TONE_GENTLE = ['please', 'kindly', 'reassure', 'no harm', 'promise', 'assure', 'in confidence', 'discreet', 'discretion', 'safe with me', 'no one will know', 'nobody will know', 'between ourselves', 'confidence', 'gently', 'do not be afraid', 'dont be afraid', 'dont worry', 'do not worry', 'not in trouble', 'no blame', 'you will not be blamed', 'wont be blamed', 'i give you my word', 'my word', 'trust me'];
export const TONE_HARSH = ['threaten', 'or else', 'arrest', 'gaol', 'jail', 'prison', 'liar', 'lying', 'lie to me', 'you are lying', 'demand', 'confess', 'i know you', 'obstruct', 'hang', 'police will', 'inspector will', 'lestrade will'];
export const TONE_CONFRONT = ['saw you', 'mary saw', 'seen you', 'was seen', 'were seen', 'witness', 'someone saw', 'saw him', 'saw her', 'confront', 'show him', 'show her', 'show them', 'show', 'present', 'produce', 'put it to', 'put to', 'lay before', 'explain this', 'explain these', 'how do you explain', 'what do you say to', 'i have here', 'i have found', 'i found', 'evidence', 'proof', 'i know that', 'i know', 'we know', 'it is known', 'knowing that', 'yet', 'but', 'contradict', 'inconsistent', 'untrue', 'at odds'];
export const TONE_PAY = ['pay', 'paying', 'bribe', 'shilling', 'shillings', 'sovereign', 'guinea', 'half crown', 'crown', 'coin', 'reward', 'compensate', 'for your trouble', 'for your time', 'money', 'purse', 'palm'];
