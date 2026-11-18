// Every fact Holmes can come to know. Each is a line in the casebook.
// kind: 'fact' (true), 'claim' (what somebody said, and it may be false)
// tags: how strongly it bears on Julian Pell, by kind of proof (each kind is capped in evidence.js)
// clears: persons whom the fact takes out of the running.
// who: whose statement it is (for claims) / source: where it came from.

export const FACTS = {
  // ---------------------------------------------------------- the theft itself
  theft: { label: 'The Marlowe Star was taken from the safe at Marlowe House on Saturday night, between about a quarter to ten and half past eleven. A note was left in its place.', kind: 'fact', cat: 'scene' },
  safe_clean: { label: 'The safe was opened with its key and its combination. No tool-mark, no force. Whoever did this had both.', kind: 'fact', cat: 'scene', tags: { means: 1 } },
  combo_few: { label: 'The combination is known to Sir Alistair and, by long habit of work, to his secretary Mr. Pell. Nobody else is supposed to know it.', kind: 'fact', cat: 'scene', tags: { means: 1 } },
  key_one: { label: 'Sir Alistair says he owns the only key, kept on his watch-chain, and that it never leaves him.', kind: 'claim', who: 'sir_alistair', cat: 'scene', truth: false },
  window_latched: { label: 'The study window was latched on the inside and the ivy beneath it is whole. Nobody came in from outside.', kind: 'fact', cat: 'scene', tags: { opportunity: 1 }, clears: ['gradwell'] },
  door_unforced: { label: 'The study door shows no mark on lock or jamb. Whoever entered walked in, and was not stopped by a servant at the front.', kind: 'fact', cat: 'scene' },
  note_text: { label: 'The note reads: “I regret the inconvenience. The Star will be in better hands.” It is written in a very careful copperplate.', kind: 'fact', cat: 'note' },
  blotter_reversed: { label: 'On the study blotter, reversed, are the words “better hands”. The note was composed at Sir Alistair’s own desk, in the house, that night.', kind: 'fact', cat: 'scene', tags: { opportunity: 1 } },
  scrap_trial: { label: 'Behind the desk lay a torn corner of cream laid paper with part of a crown watermark and a pen trial of the same copperplate capitals.', kind: 'fact', cat: 'note', tags: { identity: 1 } },
  upstairs_candle: { label: 'Hot wax on the study carpet and a trail of grey ash to the back-stairs door. The thief left by the servants’ stairs.', kind: 'fact', cat: 'scene' },
  no_cracksman: { label: 'Lestrade has nothing on any known cracksman: no gang is moving, no stone has been offered to the usual receivers.', kind: 'fact', cat: 'outside', clears: [] },

  // ---------------------------------------------------------- the paper
  paper_joynson: { label: 'The note is on Joynson’s Crown Laid: cream, laid-lined, crown watermark. I matched it against my five specimen books.', kind: 'fact', cat: 'note', tags: { identity: 1 } },
  paper_not_whatman: { label: 'It is not Whatman. Whatman is blue-white wove. Sir Alistair’s own letters are on Whatman.', kind: 'fact', cat: 'note', tags: { identity: 1 } },
  paper_peabody: { label: 'Joynson Crown Laid in London is sold at only a handful of stationers. Peabody & Sons of Holborn is the one nearest Bloomsbury.', kind: 'fact', cat: 'note' },
  paper_ledger_pell: { label: 'Peabody’s ledger: Mr. J. Pell, Percy Street, has bought a quire of Joynson Crown Laid every month since the spring. Nobody else on the books has.', kind: 'fact', cat: 'note', tags: { identity: 3 } },
  paper_pell_lodging: { label: 'In Pell’s room: a part-used quire of Joynson Crown Laid with the same crown, and one sheet short at the top.', kind: 'fact', cat: 'note', tags: { identity: 3 } },
  pell_denies_paper: { label: 'Pell says he never buys paper of his own; he uses the house stationery.', kind: 'claim', who: 'pell', cat: 'note', truth: false },
  hand_disguised: { label: 'Finch: the note’s copperplate is a disguise. The forced slant and the looped g hide a habit of cramping the t-bar to the left.', kind: 'fact', cat: 'note' },
  hand_matches_pell: { label: 'Finch compared the note with Pell’s letters from the copy-book: same cramped t-bar, same peculiar ligature of “th”. He will swear to it as one hand.', kind: 'fact', cat: 'note', tags: { identity: 3 } },
  pell_letters_sample: { label: 'The press copy-book in the study holds a run of Pell’s own letters for Sir Alistair: good specimens of his hand.', kind: 'fact', cat: 'scene' },

  // ---------------------------------------------------------- the key
  tench_dup: { label: 'Josiah Tench cut a duplicate of a Chubb safe key in July, from a wax impression, for a tall, stooping gentleman with an inky second finger who gave the name Mr. Pell.', kind: 'fact', cat: 'means', tags: { means: 3 } },
  tench_dup_vague: { label: 'Tench remembers cutting a Chubb duplicate in July for a gentleman. He will not say who without a reason to.', kind: 'fact', cat: 'means', tags: { means: 1 } },
  key_two: { label: 'There are at least two keys to the safe. Sir Alistair’s “only key” is not the only key.', kind: 'fact', cat: 'means' },

  // ---------------------------------------------------------- the evening
  mary_stairs: { label: 'Mary Dunn, carrying ice up the back stairs at about half past ten, passed Mr. Pell coming down from the study side, with his coat on, “white as a plate”. She did not think of it until now.', kind: 'fact', cat: 'witness', tags: { opportunity: 3 } },
  pell_library: { label: 'Pell says he was in the library from dinner until eleven, with the Debrett proofs, and that he never went near the study.', kind: 'claim', who: 'pell', cat: 'witness', truth: false },
  reeve_light: { label: 'Thomas Reeve, smoking in the garden, saw the study lamp lit at about twenty-five to eleven and nobody at the side door.', kind: 'fact', cat: 'witness', tags: { opportunity: 1 } },
  reeve_not_at_door: { label: 'Reeve was in the garden from ten until a quarter past eleven. He is no witness to the back stairs.', kind: 'fact', cat: 'witness' },
  ashby_billiards: { label: 'Ashby was in the billiard room, drunk and asleep in a chair, by ten. Mrs. Pargeter looked in at half past and he had not moved.', kind: 'fact', cat: 'witness', clears: ['ashby'] },
  gradwell_left: { label: 'Gradwell’s carriage left at ten. Tull the coachman put him in it and saw him off down Campden Hill.', kind: 'fact', cat: 'witness', clears: ['gradwell'] },
  ashby_quarrel: { label: 'Ashby and Sir Alistair quarrelled at dinner about Lady Marlowe’s bequest. Ashby feels the Star should have gone to him.', kind: 'fact', cat: 'motive-red' },
  gradwell_offer: { label: 'Gradwell has been trying to buy the Star for years and was refused again on Saturday.', kind: 'fact', cat: 'motive-red' },
  guest_list: { label: 'Dinner at Marlowe House on Saturday: Sir Alistair, Mr. Ashby, Mr. Gradwell, Mr. Pell, and one other guest who left early.', kind: 'fact', cat: 'scene' },
  pell_left_early: { label: 'Pell left the dinner table before the port, said he had proofs to see to, and was not seen again until eleven.', kind: 'fact', cat: 'witness', tags: { opportunity: 1 } },
  pargeter_pell: { label: 'Mrs. Pargeter says Pell has been “grey as a ghost” for weeks and ate nothing on Saturday.', kind: 'fact', cat: 'witness' },
  tull_pell: { label: 'Tull saw Mr. Pell come to the stable yard at half past eleven and ask whether anyone had been in the back lane.', kind: 'fact', cat: 'witness' },

  gradwell_pell_asked: { label: 'Gradwell says that in August Pell asked him, privately, what the Star would fetch from a dealer who asked no questions.', kind: 'fact', cat: 'motive', tags: { motive: 1 } },
  pell_routine: { label: 'The Irregulars: Pell leaves Marlowe House at half past five each evening, goes straight to Percy Street, and does not go out again. On Wednesday he went to Liverpool Street and back.', kind: 'fact', cat: 'flight' },
  gradwell_cleared_note: { label: 'Gradwell writes on pale blue Whatman and has done for twenty years, as every dealer in Bond Street knows.', kind: 'fact', cat: 'note', clears: ['gradwell'] },
  pell_no_record: { label: 'Scotland Yard has nothing against Julian Pell, and nothing against any member of the household.', kind: 'fact', cat: 'outside' },
  moss_known: { label: 'Abel Moss of Lambeth is the Yard’s favourite receiver: he will buy anything that glitters and sell it abroad within the week.', kind: 'fact', cat: 'recovery' },

  // ---------------------------------------------------------- Sir Alistair’s own secrets
  sale_denied: { label: 'Sir Alistair says he has never thought of selling the Star.', kind: 'claim', who: 'sir_alistair', cat: 'sale', truth: false },
  sale_secret: { label: 'Sir Alistair had agreed to sell the Star to Van Hoorn of Amsterdam for fourteen thousand pounds, delivery Monday. He kept it from everybody, even Pell.', kind: 'fact', cat: 'sale' },
  insurance_raised: { label: 'In September Sir Alistair raised the Star’s insurance to twenty thousand pounds, and has just lodged a claim.', kind: 'fact', cat: 'sale' },
  sale_ruined: { label: 'The Dutch price is payable only on delivery. The theft costs Sir Alistair the sale, and the insurers will fight the claim: he has nothing to gain. He did not stage this.', kind: 'fact', cat: 'sale', clears: ['sir_alistair'] },
  pell_unaware_sale: { label: 'Pell did not know of the sale. Nothing in it explains the theft.', kind: 'fact', cat: 'sale' },

  // ---------------------------------------------------------- motive
  debt_denied: { label: 'Pell says he has no debts and lives within his salary.', kind: 'claim', who: 'pell', cat: 'motive', truth: false },
  pell_debt: { label: 'Septimus Crake lent Pell £300 in March at ruinous interest. It fell due at Michaelmas, was not paid, and Crake has sent two men to remind him.', kind: 'fact', cat: 'motive', tags: { motive: 3 } },
  pell_sister: { label: 'The money was for Pell’s sister Hannah, who is dying of consumption at a sanatorium in Torquay. Her fees are due every quarter.', kind: 'fact', cat: 'motive', tags: { motive: 2 } },
  pell_dunned: { label: 'Crake’s men called twice at Marlowe House door, and the footman sent them off. Pell was seen shaking afterwards.', kind: 'fact', cat: 'motive', tags: { motive: 1 } },
  sister_matron: { label: 'The Torquay Matron confirms that Mr. Pell has paid Hannah’s fees without fail, but the last quarter was paid by a draft that bounced.', kind: 'fact', cat: 'motive', tags: { motive: 1 } },

  // ---------------------------------------------------------- flight and the stone
  boat_booked: { label: 'A “Mr. J. Peters” holds a ticket for the Great Eastern boat train from Liverpool Street and the Harwich–Antwerp steamer, Friday afternoon at five.', kind: 'fact', cat: 'flight', tags: { identity: 1 } },
  boat_is_pell: { label: 'Mr. J. Peters is Pell: the booking clerk describes a tall, grey, stooping young man with an inky finger.', kind: 'fact', cat: 'flight', tags: { identity: 2 } },
  stone_debretts: { label: 'The Marlowe Star lies in a hollowed volume of Debrett’s Peerage on Pell’s shelf at Percy Street.', kind: 'fact', cat: 'recovery', tags: { means: 2, identity: 3 } },
  stone_moved: { label: 'Pell took the stone out of his lodging in a hurry and has sold or pledged it to Abel Moss of Lambeth.', kind: 'fact', cat: 'recovery' },
  stone_moss: { label: 'The Marlowe Star is in Abel Moss’s back room, wrapped in a stocking, waiting for a Dutch buyer’s agent.', kind: 'fact', cat: 'recovery' },
  hodge_heavy: { label: 'Mrs. Hodge: Mr. Pell came in near midnight on Saturday, locked his door, and “burned a candle till dawn”. He has not slept since.', kind: 'fact', cat: 'witness', tags: { opportunity: 1 } },
  hodge_parcel: { label: 'Mrs. Hodge says a man from Lambeth called on Wednesday asking for Pell, and left a card.', kind: 'fact', cat: 'recovery' },

  // ---------------------------------------------------------- the newspapers
  press_theft: { label: 'The papers report the theft, and print what the police told them, which is little.', kind: 'fact', cat: 'press' },
  press_party: { label: 'The Morning Post lists the guests at Sir Alistair’s dinner on Saturday: Ashby, Gradwell, Pell and others.', kind: 'fact', cat: 'press' },
  press_city: { label: 'The City Press hints that a Dutch house has been “buying largely” in Hatton Garden, and that Marlowe insurance has risen.', kind: 'fact', cat: 'press' },
  press_junk: { label: 'The Illustrated Police News blames Fenian anarchists, a masked foreigner and the curse of the Star.', kind: 'claim', who: 'police_news', cat: 'press', truth: false },
  press_gazette: { label: 'The Pall Mall Gazette reports that Scotland Yard has “no strong theory” and the safe was opened “without violence”.', kind: 'fact', cat: 'press' },
  press_times_rumour: { label: 'The Times reports the stone’s history: Rangoon, 1819, Marlowe’s grandfather, and a 62-carat blue-white cushion cut.', kind: 'fact', cat: 'press' },
  press_junk_ashby: { label: 'The Illustrated Police News names “a gentleman of the family” as under suspicion. Pure gossip: no source is given.', kind: 'claim', who: 'police_news', cat: 'press', truth: false },
};

// A pair of statements that cannot both be true. Noticing them is worth points.
export const CONTRADICTIONS = [
  { a: 'pell_library', b: 'mary_stairs', label: 'Pell says he was in the library all evening, yet Mary passed him on the back stairs.' },
  { a: 'key_one', b: 'tench_dup', label: 'Sir Alistair swears there is only one key, yet Tench cut a second in July.' },
  { a: 'debt_denied', b: 'pell_debt', label: 'Pell denies any debts, yet Crake holds his note for £300.' },
  { a: 'sale_denied', b: 'sale_secret', label: 'Sir Alistair denies any thought of selling, yet he had agreed a sale to Van Hoorn.' },
  { a: 'pell_denies_paper', b: 'paper_ledger_pell', label: 'Pell says he buys no paper of his own, yet Peabody’s ledger says otherwise.' },
];

export const FACT_ORDER = Object.keys(FACTS);
