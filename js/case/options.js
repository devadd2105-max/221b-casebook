// The open registry of things Holmes can do. The parser maps whatever he types onto these.
// kind: ask | examine | service | paper
// need: facts[], anyFacts[], notFacts[], flags[], notFlags[], tone ('gentle'|'harsh'|'confront'), pay (shillings),
//       mention[] (persons/places he must name), evidence ('thin'|'sound'|'airtight'), alertBelow, alertAtLeast, days [a,b], from (minute)
// Text lines: a string is narration; ['Name', 'words'] is speech.

const S = 's'; // marker for readability only

export const OPTIONS = [];
const add = (o) => { OPTIONS.push({ minutes: 10, cost: 0, gives: [], flags: [], need: {}, topics: [], ...o }); };

// ======================================================================= WATSON
add({ id: 'w_help', kind: 'ask', who: 'watson', topics: ['greet'], minutes: 1, text: [['Watson', 'Where would you have me begin, Holmes? Sir Alistair’s wire is on the table. The Star is gone from the safe at Marlowe House, and we have until Friday afternoon before whoever took it is beyond our reach.'], 'You may say anything you like. Go where you please, ask whom you please, examine what you please. Nothing here is a menu.'] });
add({ id: 'w_view', kind: 'ask', who: 'watson', topics: ['character', 'theft'], minutes: 2, text: [['Watson', 'An inside affair, I should guess. Safes do not open themselves, and the note is far too polite for a common cracksman.'], ['Watson', 'But I have been wrong before. You will want facts, not my guesses.']] });
add({ id: 'w_expert', kind: 'ask', who: 'watson', topics: ['hand'], minutes: 3, learnsP: ['finch'], learnsPl: ['finch_chambers'],
  text: [['Watson', 'There is a man in Gray’s Inn, Finch, whom the Yard calls in when a signature is in dispute. He will not say two hands are one on a hunch; give him the note and something the suspect wrote in his own natural way, and he will tell you.']] });
add({ id: 'w_papers_ask', kind: 'ask', who: 'watson', topics: ['police', 'servants'], minutes: 2, text: [['Watson', 'I could read you the morning papers if you like. The reputable ones will be careful; the penny sheets will tell you anything at all.']] });

// ======================================================================= MRS. HUDSON
add({ id: 'h_tea', kind: 'ask', who: 'hudson', topics: ['greet', 'theft', 'evening'], minutes: 3, text: [['Mrs. Hudson', 'Oh, Mr. Holmes, there is a boy from the telegraph office with another wire, and a kipper for you, and Dr. Watson says you are not to go out without your overcoat.'], 'She sniffs at the smell of the chemical table, and withdraws with great dignity.'] });

// ======================================================================= SIR ALISTAIR
add({
  id: 'sa_story', kind: 'ask', who: 'sir_alistair', topics: ['theft', 'evening', 'greet', 'guests', 'note'], minutes: 25,
  gives: ['guest_list', 'note_text'], flags: ['has_note'], learnsP: ['pell', 'ashby', 'gradwell'],
  text: [
    'Sir Alistair is a heavy, handsome man who has not slept. He tells the story in the order a man tells it who has told it three times already.',
    ['Sir Alistair', 'We dined at eight, Mr. Holmes: myself, my brother-in-law Ashby, Gradwell the collector, and my secretary Pell. Gradwell left at ten. I went to the study at eleven to look at the Star, as I do every Saturday. The safe stood open. In its place lay this.'],
    'He hands you a half-sheet of cream paper, folded once. In an extraordinarily careful hand it reads: “I regret the inconvenience. The Star will be in better hands.” You turn it over under the lamp. It is yours now.',
  ],
});
add({
  id: 'sa_key', kind: 'ask', who: 'sir_alistair', topics: ['key', 'combination', 'safe'], minutes: 15, gives: ['key_one', 'combo_few', 'safe_clean'],
  text: [['Sir Alistair', 'The safe is a Chubb with a letter-dial. The combination is known to me, and to Pell, who has done my papers for six years. There is one key, Mr. Holmes, here on my watch-chain. It has never left me.'], 'He taps the chain as he says it, the way a man touches a thing he is sure of.'],
});
add({
  id: 'sa_key_confront', kind: 'ask', who: 'sir_alistair', topics: ['key', 'safe', 'combination', 'theft'], minutes: 12, gives: ['key_two'],
  need: { facts: ['key_one', 'tench_dup'], tone: 'confront' },
  text: [
    'You tell him that a locksmith in Clerkenwell cut a second Chubb key in July.',
    ['Sir Alistair', 'July? ... Good God. In July I had my coat at the tailor’s for a week, with the watch-chain in the pocket. And Pell, as my secretary, has charge of my wardrobe errands.'],
    'He sits down heavily. He had not wanted to follow the thought, and now it follows him.',
  ],
});
add({
  id: 'sa_pell', kind: 'ask', who: 'sir_alistair', topics: ['character', 'employer', 'evening'], minutes: 12, gives: ['pell_left_early'], learnsP: ['hodge'], learnsPl: ['pell_lodging'],
  text: [['Sir Alistair', 'Pell is a quiet, careful young man. He left the table before the port, which I did not remark at the time: he had the Debrett proofs to see to. I would trust him with my life, Mr. Holmes. I have, in a way, for six years.'], 'He is certain; but a certain man is not always an exact one. He adds that Pell lodges in Percy Street, Bloomsbury, in the house of a Mrs. Hodge.'],
});
add({
  id: 'sa_sister', kind: 'ask', who: 'sir_alistair', topics: ['sister', 'debts'], minutes: 6, learnsP: ['matron'],
  text: [['Sir Alistair', 'Pell has a sister in Torquay, an invalid; he once asked for a week’s leave to see her. A sad business. I pay him well.'], 'You note “Torquay” and let it lie.'],
});
add({
  id: 'sa_ashby', kind: 'ask', who: 'sir_alistair', topics: ['quarrel', 'character'], minutes: 8, gives: ['ashby_quarrel'], learnsPl: ['ashby_rooms'], learnsP: ['ashby'],
  text: [['Sir Alistair', 'My brother-in-law and I had words at dinner about my late wife’s bequest. Cuthbert thinks the Star ought to have gone to him. He keeps rooms in Jermyn Street. He drinks more than he should.']],
});
add({
  id: 'sa_gradwell', kind: 'ask', who: 'sir_alistair', topics: ['sale', 'value', 'quarrel'], minutes: 8, gives: ['gradwell_offer'], learnsPl: ['gradwell_gallery'], learnsP: ['gradwell'],
  text: [['Sir Alistair', 'Gradwell has wanted the Star for ten years. He asked again on Saturday. I said what I always say. He took it ill, and left at ten.']],
});
add({
  id: 'sa_sale_denial', kind: 'ask', who: 'sir_alistair', topics: ['sale', 'insurance'], minutes: 10, gives: ['sale_denied'], learnsP: ['fenwick'], learnsPl: ['insurance_office'],
  text: [['Sir Alistair', 'Sell the Star? Never. It was my grandfather’s. As to insurance, Fenwick at the Royal Exchange Assurance has handled it for years, and I pay what he asks.'], 'He answers a little too quickly, and looks at the fire.'],
});
add({
  id: 'sa_sale_confess', kind: 'ask', who: 'sir_alistair', topics: ['sale', 'insurance', 'theft'], minutes: 15, gives: ['sale_secret', 'sale_ruined', 'pell_unaware_sale'], learnsP: ['van_hoorn'],
  need: { anyFacts: ['insurance_raised', 'press_city', 'sale_secret'], tone: 'confront' },
  text: [
    'You lay the insurance figure and the Dutch rumour on the table. He is silent for some time.',
    ['Sir Alistair', 'Very well. I had sold it, Mr. Holmes. Fourteen thousand pounds to Van Hoorn of Amsterdam, delivery on Monday. The money was to clear my brother-in-law’s debts and keep him quiet. Now I have lost the sale and I stand to lose my name if the Assurance suspects me.'],
    'It is the confession of a man who gains nothing from the theft. The insurers will see otherwise, and you cross him off.',
  ],
});
add({ id: 'sa_curse', kind: 'ask', who: 'sir_alistair', topics: ['curse', 'value'], minutes: 6, text: [['Sir Alistair', 'There is a legend that it brings ill-luck to whoever sells it. My grandfather believed it. I am not superstitious, Mr. Holmes, but I confess I do not like what has happened.']] });
add({ id: 'sa_stonewall', kind: 'ask', who: 'sir_alistair', topics: [], minutes: 5, text: [['Sir Alistair', 'I have told you all I know on that, Mr. Holmes. Ask what you like; I have nothing to hide.']] });

// ======================================================================= PELL
add({
  id: 'p_evening', kind: 'ask', who: 'pell', topics: ['evening', 'theft', 'greet', 'guests'], minutes: 12, gives: ['pell_library'],
  text: [['Pell', 'I left the table at about a quarter past nine, Mr. Holmes. I had the Debrett proofs to finish. I sat in the library until nearly eleven. I never went near the study.'], 'He is tall and stooping, with an inked second finger and an unnaturally steady voice. He speaks like a man reading from a page.'],
});
add({
  id: 'p_debt_denial', kind: 'ask', who: 'pell', topics: ['debts', 'sister', 'character'], minutes: 8, gives: ['debt_denied'], alert: 4, notAfterGentle: true,
  text: [['Pell', 'I live on my salary, and I have no debts. Sir Alistair pays me handsomely.'], 'The words are quite smooth. His hand, on the back of the chair, is not.'],
});
add({
  id: 'p_sister_gentle', kind: 'ask', who: 'pell', topics: ['sister', 'debts', 'lodging', 'character'], minutes: 10, gives: ['pell_sister'], flags: ['pell_softened'], need: { tone: 'gentle' },
  text: [['Pell', 'My sister Hannah is in Torquay. She is dying, sir. It costs forty pounds a quarter. I will not have that spoken of among the servants.'], 'You speak kindly, and it is the kindness, not the questions, that makes his eyes go bright. He says no more.'],
  refuse: ['He looks at you coldly: whatever he feels, he will not lay it before a stranger.'],
});
add({
  id: 'p_paper', kind: 'ask', who: 'pell', topics: ['paper', 'letters', 'hand', 'ink'], minutes: 6, gives: ['pell_denies_paper'],
  text: [['Pell', 'I use the house stationery, Mr. Holmes. It is Sir Alistair’s own. I would not spend my own money on better.']],
});
add({
  id: 'p_write', kind: 'ask', who: 'pell', topics: ['hand'], minutes: 10, gives: ['pell_letters_sample'], flags: ['has_pell_sample'], alert: 10, need: { notFlags: ['has_pell_sample'] },
  text: [
    'You ask Mr. Pell, with perfect courtesy, to write out a short passage for your notebook, as a favour; you are collecting the handwriting of the household for the Yard.',
    'He does it without comment. The sample is a clean, neat hand. You fold it away, noting the way the t-bar is cramped to the left.',
  ],
});
add({
  id: 'p_stairs', kind: 'ask', who: 'pell', topics: ['stairs', 'evening', 'light', 'theft'], minutes: 12, alert: 25, flags: ['pell_shaken'],
  need: { facts: ['mary_stairs', 'pell_library'], tone: 'confront' },
  text: [
    'You tell him that a maid saw him on the back stairs at half past ten, with his coat on.',
    ['Pell', 'She is mistaken. It was dark. I ... was in the library.'],
    'He has gone the colour of the blotting paper. The pen in his hand clicks against the inkwell. He knows you know. From this moment he will be watching you, and watching the clock.',
  ],
  refuse: ['“The library, Mr. Holmes. I told you.” He repeats it exactly, as if it were a hymn.'],
});
add({
  id: 'p_confess', kind: 'ask', who: 'pell', topics: ['theft', 'stairs', 'debts', 'sister', 'key', 'paper', 'hand', 'evening', 'note'], minutes: 20, alert: 0, flags: ['pell_confessed'], gives: ['stone_debretts'],
  need: { evidence: 'sound', tone: 'confront', alertBelow: 60 },
  text: [
    'You set the facts before him one by one, calmly, as a man lays out a hand of cards: the key, the stairs, the paper, the hand, the debt. When you reach his sister’s name he stops you with a raised palm.',
    ['Pell', 'Enough. I did it. Crake would have had me broken by Michaelmas, and Hannah would have died in a charity ward. I meant ... I meant to send it back, when she was safe. I swear to God I never meant to keep it.'],
    ['Pell', 'It is at my lodgings. In the Debrett on the shelf. Take it. I am tired, Mr. Holmes. I have not slept for a week.'],
    'You say nothing for a while. In the hush of the study you can hear the clock, and Sir Alistair’s step in the hall.',
  ],
  refuse: ['He listens to all of it, and answers none of it. He has the face of a man who knows exactly how far a guess can reach.'],
});
add({ id: 'p_stonewall', kind: 'ask', who: 'pell', topics: [], minutes: 6, alert: 2, text: [['Pell', 'I am sorry, Mr. Holmes. I am at Sir Alistair’s disposal, but I cannot help you with that.']] });

// ======================================================================= ASHBY
add({ id: 'as_evening', kind: 'ask', who: 'ashby', topics: ['evening', 'theft', 'greet', 'quarrel'], minutes: 12, gives: ['ashby_quarrel'], learnsP: ['crake'], learnsPl: ['crake_office'],
  text: [['Ashby', 'Oh, I quarrelled with Alistair, I quarrel with Alistair every month. I was in the billiard room by ten, I confess, quite drunk. Ask the servants. Ask Mrs. Pargeter. They had to put a rug on me.'], ['Ashby', 'If you want my opinion, it is somebody in the house. Pell has been jumping at shadows since Michaelmas. There were men at the door asking for him, Crake’s men, if I know a Soho coat when I see one.']] });
add({ id: 'as_sale', kind: 'ask', who: 'ashby', topics: ['sale', 'insurance', 'value'], minutes: 8, learnsP: ['van_hoorn', 'fenwick'], learnsPl: ['insurance_office'], text: [['Ashby', 'Alistair has been writing to Amsterdam, you know. He thinks I do not read his post. A Dutchman, with a name like a sneeze. Hoorn, I believe. Do not tell him I said so.']] });
add({ id: 'as_stone', kind: 'ask', who: 'ashby', topics: [], minutes: 5, text: [['Ashby', 'I am sorry, Mr. Holmes, my head is not what it was. Come back when I have had my breakfast.']] });

// ======================================================================= GRADWELL
add({ id: 'g_evening', kind: 'ask', who: 'gradwell', topics: ['evening', 'theft', 'greet', 'guests'], minutes: 12, gives: ['gradwell_cleared_note'],
  text: [['Gradwell', 'I left at ten, Mr. Holmes. Tull put me in my carriage and I was at the Club by half past. Ask half the Club. As for Whatman, I buy it by the gross. My blue is a joke in Bond Street.'], 'He is elegant, brisk and openly delighted that Sir Alistair is in trouble.'] });
add({ id: 'g_offer', kind: 'ask', who: 'gradwell', topics: ['sale', 'value', 'quarrel', 'character'], minutes: 8, gives: ['gradwell_offer', 'gradwell_pell_asked'],
  text: [['Gradwell', 'I have offered for the Star every year since 1880. And Pell, now, that quiet fellow: in August he asked me privately what such a stone would fetch from a man who asked no questions. I laughed. I wonder now.']] });
add({ id: 'g_fence', kind: 'ask', who: 'gradwell', topics: ['fence', 'professional', 'boat'], minutes: 8, learnsP: ['moss'], learnsPl: ['moss_shop'], gives: ['moss_known'],
  text: [['Gradwell', 'A stone like that cannot be sold in England; it would be recognised in an hour. It would be cut or carried abroad. If it moves, it moves through men like Abel Moss, in Lambeth. He buys anything and sells it across the water within the week.']] });
add({ id: 'g_stonewall', kind: 'ask', who: 'gradwell', topics: [], minutes: 5, text: [['Gradwell', 'You flatter me, Mr. Holmes, but I know nothing about that.']] });

// ======================================================================= THE SERVANTS
add({ id: 'm_deflect', kind: 'ask', who: 'mary', topics: ['stairs', 'evening', 'light', 'theft', 'greet'], minutes: 8,
  text: [['Mary', 'I was carrying ice up for the gentlemen, sir. I saw nothing, sir. Nothing.'], 'Her eyes, as she says it, travel to the door of the back stairs and back again, twice.'] });
add({ id: 'm_gentle', kind: 'ask', who: 'mary', topics: ['stairs', 'evening', 'light', 'theft', 'greet', 'servants'], minutes: 10, gives: ['mary_stairs'], flags: ['mary_spoke'], need: { tone: 'gentle' },
  text: [
    'You send her a kind word, and do not look at her. A girl who has been afraid of her own tongue for a day will talk to a man who does not stare.',
    ['Mary', 'It was about half past ten, sir. I was on the back stairs with the ice. Mr. Pell came down past me from the study end. He had his coat on, and he was white as a plate. He did not speak. I did not think of it till now, sir, and I was afraid it would look as if I was accusing him.'],
  ] });
add({ id: 'm_pay', kind: 'ask', who: 'mary', topics: ['stairs', 'evening', 'light', 'theft', 'greet', 'servants'], minutes: 8, gives: ['mary_stairs'], cost: 2, need: { pay: 2 },
  text: [
    'A couple of shillings changes hands. She looks at the coins as though they are a charge against her.',
    ['Mary', 'Half past ten, sir, the back stairs. Mr. Pell came down past me with his coat on. He was white. I would not have said, only you asked.'],
  ] });
add({ id: 'm_harsh', kind: 'ask', who: 'mary', topics: ['stairs', 'evening', 'theft'], minutes: 6, need: { tone: 'harsh' }, flags: ['mary_frightened'],
  text: ['Your tone is sharper than it should be. The girl shuts like a drawer.', ['Mary', 'I know nothing, sir. Please, sir.']] });

add({ id: 'r_light', kind: 'ask', who: 'reeve', topics: ['light', 'garden', 'evening', 'theft', 'greet'], minutes: 8, gives: ['reeve_light', 'reeve_not_at_door'],
  text: [['Reeve', 'I was in the garden having a smoke, sir, from ten to a quarter past eleven. I saw the study lamp lit at twenty-five to eleven. I saw no one at the side door. I could not see the back stairs from there, sir.']] });
add({ id: 'r_callers', kind: 'ask', who: 'reeve', topics: ['debts', 'callers', 'lodging', 'character', 'servants', 'letters'], minutes: 8, gives: ['pell_dunned'], learnsP: ['crake'], learnsPl: ['crake_office'],
  text: [['Reeve', 'There were two men at the area door last month, sir, asking for Mr. Pell. Neat black coats. I sent them off. Mr. Pell was shaking after, sir. He went into the pantry and shut the door.']] });
add({ id: 'r_stonewall', kind: 'ask', who: 'reeve', topics: [], minutes: 4, text: [['Reeve', 'Sorry, sir, I don’t know anything about that.']] });

add({ id: 'pa_house', kind: 'ask', who: 'pargeter', topics: ['evening', 'guests', 'servants', 'character', 'theft'], minutes: 12, gives: ['ashby_billiards', 'pargeter_pell'],
  text: [['Mrs. Pargeter', 'Mr. Ashby was in the billiard room at ten and still there at half past, flat in a chair with a rug on, and I looked in myself. Mr. Gradwell left in his carriage. Mr. Pell has been grey as a ghost these two months, and ate nothing on Saturday. He has the look of a man who owes.']] });
add({ id: 'pa_stonewall', kind: 'ask', who: 'pargeter', topics: [], minutes: 4, text: [['Mrs. Pargeter', 'It is not for me to say, sir.']] });

add({ id: 't_gradwell', kind: 'ask', who: 'tull', topics: ['evening', 'guests', 'theft', 'greet', 'garden'], minutes: 8, gives: ['gradwell_left', 'tull_pell'],
  text: [['Tull', 'Mr. Gradwell had his carriage at ten sharp, sir. I put him in. Later, half past eleven or so, Mr. Pell came out into the yard and asked had anybody been in the back lane. Looked fit to drop.']] });
add({ id: 't_stonewall', kind: 'ask', who: 'tull', topics: [], minutes: 4, text: [['Tull', 'Horses I know, sir. That I don’t.']] });

// ======================================================================= PEABODY & SONS
add({ id: 'pe_paper', kind: 'ask', who: 'peabody', topics: ['paper', 'greet', 'note'], minutes: 12, gives: ['paper_peabody'],
  text: [['Peabody', 'Joynson’s Crown Laid? We sell it, sir; a good cream laid, the crown is stamped in the mould. There are but five houses in London that keep it. We are the nearest to the Inns of Court.'], 'He peers at the note over his spectacles and clicks his tongue in appreciation.'] });
add({ id: 'pe_ledger_cold', kind: 'ask', who: 'peabody', topics: ['customers', 'paper', 'letters'], minutes: 6,
  text: [['Peabody', 'My customers are my customers, sir. I do not discuss them. Ask the Commissioner for a warrant and I shall oblige. If you have a particular name in mind, Mr. Holmes, I might tell you whether it is familiar. I shall not offer one.']] });
add({ id: 'pe_ledger', kind: 'ask', who: 'peabody', topics: ['customers', 'paper', 'letters', 'note'], minutes: 18, gives: ['paper_ledger_pell'], cost: 3, learnsP: [], need: { mention: ['pell'], anyFacts: ['paper_joynson', 'paper_peabody'] },
  text: [
    'You name Mr. Pell. Mr. Peabody weighs the name, and a half-crown, and the fact that you have not asked for anything he cannot decently give.',
    ['Peabody', 'A young gentleman of that name, yes, in Percy Street. Takes a quire of Joynson Crown Laid on the first of every month, since the spring. Pays in coin. I remember because it is unusual for a clerk to be so particular about his paper.'],
    'He opens the ledger and shows you three entries in his own hand.',
  ],
  refuse: ['“I do not discuss my customers, sir.” You will need to give him a reason, and perhaps a name to confirm.'] });

// ======================================================================= TENCH
add({ id: 'te_cold', kind: 'ask', who: 'tench', topics: ['key', 'safe', 'duplicate', 'greet'], minutes: 8, gives: ['tench_dup_vague'],
  text: [['Tench', 'A Chubb duplicate in July? I might have. I cut a lot of keys, sir. For gentlemen. I don’t ask who.'], 'He wipes his hands on a rag. He is not unhelpful; he is merely a man who has never been paid for names.'] });
add({ id: 'te_pell', kind: 'ask', who: 'tench', topics: ['key', 'safe', 'duplicate', 'character', 'theft'], minutes: 10, gives: ['tench_dup', 'key_two'], need: { mention: ['pell'] },
  text: [
    ['You', 'Was it Mr. Pell?'],
    ['Tench', 'Pell. That was the name. Tall, stooping, inky second finger. Brought me a wax impression in a snuffbox in July and said it was for his master. Paid in advance. I thought nothing of it, sir. I do not think of such things.'],
  ] });
add({ id: 'te_pay', kind: 'ask', who: 'tench', topics: ['key', 'safe', 'duplicate', 'character', 'theft'], minutes: 8, gives: ['tench_dup', 'key_two'], cost: 5, need: { pay: 5 },
  text: [
    'Five shillings crosses the bench. His memory sharpens.',
    ['Tench', 'Tall man, stooping, ink on the second finger, name of Pell. July, a Chubb. I should have asked more, but he paid before I did.'],
  ] });

// ======================================================================= CRAKE
add({ id: 'cr_cold', kind: 'ask', who: 'crake', topics: ['debts', 'greet', 'character'], minutes: 8,
  text: [['Crake', 'I lend to gentlemen who can bear it, Mr. Holmes. I do not discuss them. Good morning. My time is dear, and my memory, I find, is dearer.'], 'A very quiet man, who smiles as if he has measured your pockets.'] });
add({ id: 'cr_pell', kind: 'ask', who: 'crake', topics: ['debts', 'sister', 'character', 'theft'], minutes: 12, gives: ['pell_debt'], need: { mention: ['pell'], anyFacts: ['pell_dunned', 'pell_sister', 'gradwell_pell_asked', 'mary_stairs', 'tench_dup'] },
  text: [
    'You name Mr. Pell and lay what you know on the desk, quietly. Crake reads it as a man reads a rival’s balance sheet.',
    ['Crake', 'Three hundred pounds in March at fifteen per cent, on his own note of hand. Due Michaelmas. Unpaid. I sent two men; I do not employ the other kind. If you are asking whether I wish to see him ruined, Mr. Holmes: yes, in due course, and on my terms.'],
  ],
  refuse: ['“I do not discuss my clients.” You will need to bring more than a surname.'] });
add({ id: 'cr_pay', kind: 'ask', who: 'crake', topics: ['debts', 'character'], minutes: 8, gives: ['pell_debt'], cost: 40, need: { pay: 40, mention: ['pell'] },
  text: ['You lay forty shillings on the desk. It is a small insult and a larger inducement.', ['Crake', 'Three hundred pounds, March, fifteen per cent, due Michaelmas, unpaid. His own note of hand.']] });

// ======================================================================= MOSS
add({ id: 'mo_cold', kind: 'ask', who: 'moss', topics: ['fence', 'professional', 'greet', 'theft'], minutes: 8,
  text: [['Moss', 'I am a respectable pawnbroker, Mr. Holmes. Silver spoons and Sunday suits. Is there anything you wish to pledge? Come back with something heavier than manners, or with a purse, and we may find I remember more.']] });
add({ id: 'mo_stone', kind: 'ask', who: 'moss', topics: ['fence', 'theft', 'professional', 'police'], minutes: 15, gives: ['stone_moss'], flags: ['stone_found'], need: { facts: ['stone_moved'], tone: 'harsh' },
  text: [
    'You tell him quietly what Inspector Lestrade would do to his licence, and his lease, and his back room.',
    ['Moss', 'It came on Wednesday night, sir, from a gentleman I did not know. I have not sold it. I would not have dared. It is in the back room, in a stocking.'],
    'He fetches it himself. In the dull light of the shop the Marlowe Star is the only clean thing in the room.',
  ] });
add({ id: 'mo_pay', kind: 'ask', who: 'moss', topics: ['fence', 'theft', 'professional'], minutes: 12, gives: ['stone_moss'], flags: ['stone_found'], cost: 60, need: { facts: ['stone_moved'], pay: 60 },
  text: ['Three pounds in sovereigns. A bad bargain on any principle but one.', ['Moss', 'In the back room, sir. I never saw it, you never saw me.']] });

// ======================================================================= MRS. HODGE
add({ id: 'ho_cold', kind: 'ask', who: 'hodge', topics: ['lodging', 'character', 'greet', 'theft', 'evening'], minutes: 8,
  text: [['Mrs. Hodge', 'Mr. Pell is a very quiet gentleman and I will not have him troubled. He pays on the dot. I answer those who come to me kindly, sir, and only those.']] });
add({ id: 'ho_gentle', kind: 'ask', who: 'hodge', topics: ['lodging', 'character', 'greet', 'theft', 'evening', 'letters'], minutes: 12, gives: ['hodge_heavy', 'hodge_parcel'], flags: ['hodge_door'], need: { tone: 'gentle' },
  text: [
    'You are courteous, and say it is a matter in which Mr. Pell’s employer wishes to spare him embarrassment. She wavers, and gives.',
    ['Mrs. Hodge', 'He came in at midnight Saturday, sir, locked his door and burned a candle till dawn. He has not slept since. A man from Lambeth left a card on Wednesday. If it is for Sir Alistair’s good I will let you up, but you must be quick, and not break anything.'],
  ] });
add({ id: 'ho_pay', kind: 'ask', who: 'hodge', topics: ['lodging', 'character', 'greet', 'theft', 'evening', 'letters'], minutes: 8, gives: ['hodge_heavy'], flags: ['hodge_door'], cost: 4, need: { pay: 4 },
  text: [['Mrs. Hodge', 'Four shillings is four shillings, sir. Up the stairs, second floor back. And I never saw you.']] });
add({ id: 'ho_warrant', kind: 'ask', who: 'hodge', topics: ['lodging', 'warrant'], minutes: 6, flags: ['hodge_door'], need: { flags: ['warrant'] },
  text: [['Mrs. Hodge', 'A warrant! Well, I never. Up you go, gentlemen. Second floor back.']] });

// ======================================================================= FINCH
add({ id: 'fi_note_only', kind: 'ask', who: 'finch', topics: ['hand', 'note', 'paper', 'ink', 'greet'], minutes: 20, gives: ['hand_disguised'], cost: 5, need: { flags: ['has_note'], notFlags: ['has_pell_sample'] },
  text: [['Finch', 'A disguised hand, Mr. Holmes; the copperplate is perfect and nobody writes so. A man is hiding behind a schoolmaster. I can tell you he cramps his t-bars to the left. But I can only say whose hand it is if you bring me a sample of the suspect’s.']] });
add({ id: 'fi_match', kind: 'ask', who: 'finch', topics: ['hand', 'note', 'paper', 'ink', 'greet'], minutes: 25, gives: ['hand_disguised', 'hand_matches_pell'], cost: 5, need: { flags: ['has_note', 'has_pell_sample'] },
  text: [['Finch', 'Ah. The same hand, Mr. Holmes. Look: the cramped t-bar, the ligature of the th. He has disguised the slant and forgotten the habits. I will swear to it before any bench in England.']] });
add({ id: 'fi_cold', kind: 'ask', who: 'finch', topics: ['hand', 'greet'], minutes: 8, text: [['Finch', 'A handwriting, sir? Bring me something to compare with something, and I shall be delighted. I cannot read tea-leaves.']] });

// ======================================================================= FENWICK
add({ id: 'fe_ins', kind: 'ask', who: 'fenwick', topics: ['insurance', 'sale', 'value', 'greet', 'theft'], minutes: 12, gives: ['insurance_raised'],
  text: [['Fenwick', 'Sir Alistair raised the Marlowe Star from eight thousand to twenty thousand pounds in September, Mr. Holmes. He lodged a claim on Sunday. We do not like it, and we are examining it.'], 'He says this in the voice of a man who would very much like you to prove something.'] });
add({ id: 'fe_cold', kind: 'ask', who: 'fenwick', topics: [], minutes: 4, text: [['Fenwick', 'I regret I am not at liberty to say, sir.']] });

// ======================================================================= LESTRADE
add({ id: 'l_state', kind: 'ask', who: 'lestrade', topics: ['theft', 'police', 'greet', 'professional', 'record'], minutes: 12, gives: ['no_cracksman', 'pell_no_record'],
  text: [['Lestrade', 'We have been to Marlowe House, Mr. Holmes, and I have had every cracksman in London sat on. Nothing. No gang, no stone offered at the usual places, no record on anyone in the house. I am obliged to say, between ourselves, that I am looking to you.']] });
add({ id: 'l_hand', kind: 'ask', who: 'lestrade', topics: ['hand', 'note', 'paper'], minutes: 10, learnsP: ['finch'], learnsPl: ['finch_chambers'],
  text: [['Lestrade', 'For handwriting we use Ambrose Finch, at Gray’s Inn. He has sent more men to the dock than the hangman has. Five shillings, and he will not lie.']] });
add({ id: 'l_fence', kind: 'ask', who: 'lestrade', topics: ['fence', 'boat'], minutes: 8, learnsP: ['moss'], learnsPl: ['moss_shop'], gives: ['moss_known'],
  text: [['Lestrade', 'Abel Moss, Lambeth Walk. We know he is a receiver and cannot prove it. He will buy any stone that goes through London, and has it abroad inside the week.']] });
add({
  id: 'l_warrant', kind: 'ask', who: 'lestrade', topics: ['warrant', 'police', 'lodging'], minutes: 20, flags: ['warrant'], alert: 10, need: { evidence: 'sound', mention: ['pell'], notFlags: ['warrant'] },
  text: [
    'You lay what you hold before the Inspector. He reads it twice, with his lips moving.',
    ['Lestrade', 'It is good, Mr. Holmes. It will do for a magistrate. I shall have a warrant for Percy Street within the hour; but a warrant is a noisy thing, and if Pell has friends in the Yard’s corridors he will hear of it. Be quick.'],
  ],
  refuse: [['Lestrade', 'A warrant? On what, Mr. Holmes? A name and a feeling? Bring me something I can swear to before a magistrate.']],
});
add({
  id: 'l_boat', kind: 'ask', who: 'lestrade', topics: ['boat'], minutes: 15, gives: ['boat_booked'], need: { mention: ['pell'] }, delay: 0,
  text: [['Lestrade', 'The railway police can look at the Great Eastern passengers’ books. Give me an hour. ... There is a Mr. J. Peters booked on the Friday afternoon boat train for the Antwerp steamer. Paid in coin, one way. It may mean nothing, but it is a coincidence of initials.']] });
add({ id: 'l_stonewall', kind: 'ask', who: 'lestrade', topics: [], minutes: 5, text: [['Lestrade', 'If I knew that, Mr. Holmes, I should not be asking you.']] });

// ======================================================================= MYCROFT (limited favours)
add({ id: 'my_sale', kind: 'ask', who: 'mycroft', topics: ['sale', 'insurance', 'value', 'theft', 'greet'], minutes: 25, favour: true, gives: ['sale_secret'], learnsP: ['van_hoorn'],
  text: [
    'In the Strangers’ Room of the Diogenes Club Mycroft hears you out with his eyes half closed.',
    ['Mycroft', 'Mynheer Van Hoorn of Amsterdam is at the Langham Hotel, here to collect a blue-white stone on Monday against a draft of fourteen thousand pounds on the Bank of England. The Foreign Office has been asked to expedite his luggage. I should say that Sir Alistair has not been quite candid with you, Sherlock.'],
  ] });
add({ id: 'my_boat', kind: 'ask', who: 'mycroft', topics: ['boat', 'warrant', 'record'], minutes: 25, favour: true, gives: ['boat_booked', 'boat_is_pell'], need: { mention: ['pell'] },
  text: [
    ['Mycroft', 'The Great Eastern Railway are obliged to me. ... A Mr. J. Peters, passage taken Wednesday for Friday’s five o’clock boat from Harwich to Antwerp. The clerk describes a tall, grey, stooping young man with an ink-stained finger. He paid in silver, and asked twice whether the passengers were searched.'],
  ],
  refuse: [['Mycroft', 'If you want a particular man’s ticket, Sherlock, name the man.']] });
add({ id: 'my_crake', kind: 'ask', who: 'mycroft', topics: ['debts', 'sister', 'fence'], minutes: 15, favour: true, learnsP: ['crake', 'moss'], learnsPl: ['crake_office', 'moss_shop'], gives: ['moss_known'],
  text: [['Mycroft', 'Septimus Crake of Dean Street lends to clerks and curates at fifteen per cent and sends civil young men to ask for it. Abel Moss, Lambeth, receives what the clerks sometimes find for him. I did not tell you.']] });
add({ id: 'my_stonewall', kind: 'ask', who: 'mycroft', topics: [], minutes: 10, text: [['Mycroft', 'I am afraid it is not, my dear Sherlock, a question for which the Government has an answer.']] });

// ======================================================================= REMOTE (by telegram)
add({ id: 'vh_wire', kind: 'ask', who: 'van_hoorn', topics: ['sale', 'insurance', 'theft', 'value', 'greet'], minutes: 5, cost: 3, gives: ['sale_secret'], delay: 90, remote: true,
  text: ['You wire Amsterdam’s man at the Langham.', ['Van Hoorn', 'I had agreed with Sir Alistair for fourteen thousand pounds, on delivery Monday. I am most displeased. You may tell him I wish to be paid in full on any delivery within the week, and not a day later.']] });
add({ id: 'ma_wire', kind: 'ask', who: 'matron', topics: ['sister', 'debts', 'lodging', 'greet', 'character'], minutes: 5, cost: 3, gives: ['pell_sister', 'sister_matron'], delay: 180, remote: true,
  text: ['You wire the sanatorium at Torquay.', ['The Matron', 'Miss Hannah Pell is here. Her brother has paid her fees faithfully, at forty pounds a quarter, though his last draft was returned unpaid this month. She is very ill, Mr. Holmes; he comes when he can. He is the best of brothers.']] });

// ======================================================================= EXAMINATION: BAKER STREET
add({ id: 'x_telegram', kind: 'examine', obj: 'telegram', minutes: 2, text: ['The wire from Sir Alistair Marlowe, handed in at Kensington at 7.12:', ['Telegram', 'MARLOWE STAR STOLEN FROM SAFE LAST NIGHT STOP NOTE LEFT STOP POLICE INFORMED STOP BEG YOU COME AT ONCE STOP MARLOWE HOUSE CAMPDEN HILL'], 'Nothing else. No names, no hours. You have the Star, a safe, and a note. It is a beginning.'], gives: ['theft'] });
add({ id: 'x_note', kind: 'examine', obj: 'note', minutes: 6, need: { flags: ['has_note'] }, gives: ['note_text'],
  text: ['A half-sheet of cream paper, laid lines running across, a crown faintly visible against the lamp. The ink is blue-black, the hand a very deliberate copperplate: the work of someone writing slowly, and not in his own hand.', 'You put it beside the specimen books on the table and hold the lens over it.'],
  refuse: ['You do not have the thief’s note yet. Sir Alistair has it.'] });
add({ id: 'x_lens', kind: 'examine', obj: 'lens', minutes: 10, text: ['You amuse yourself for a quarter of an hour with the reagents. Nothing in the case calls for a chemical analysis, but a pipe and an acid are a good way to settle one’s thinking.'] });

// ======================================================================= EXAMINATION: THE STUDY
add({ id: 'x_safe', kind: 'examine', obj: 'safe', minutes: 20, gives: ['safe_clean', 'theft'], flags: ['safe_seen'],
  text: ['A Chubb, set into the chimney breast, door standing open. You go over the edges with the lens. No jemmy-mark, no drill, no acid. The dial is clean and quite untouched by anything but the proper fingers.', 'It was opened with its key and its combination. This is not a cracksman’s work.'] });
add({ id: 'x_keyhole', kind: 'examine', obj: 'keyhole', minutes: 20, gives: ['safe_clean'], learnsP: ['tench'], learnsPl: ['tench_shop'],
  text: ['In the keyhole’s wards you find a trace of bright brass, finer than the maker’s own work. A key cut by hand, filed by a man who knows his trade.', 'There are very few London locksmiths who will file a Chubb blank without questions. Tench of Clerkenwell is the likeliest.'] });
add({ id: 'x_window', kind: 'examine', obj: 'window', minutes: 15, gives: ['window_latched'],
  text: ['The sash is latched from inside; the catch is old and has not been moved. Outside, the ivy that climbs beneath is whole, the dust on the sill undisturbed, and the flowerbed shows no mark.', 'Nobody came in this way.'] });
add({ id: 'x_door', kind: 'examine', obj: 'study_door', minutes: 8, gives: ['door_unforced'], text: ['Lock and jamb are clean. The key was in the lock, on the inside, until the master unlocked it at eleven. Whoever came, was let in by the house, not by force.'] });
add({ id: 'x_carpet', kind: 'examine', obj: 'carpet', minutes: 20, gives: ['upstairs_candle'], text: ['You go down on hands and knees with the lens. A spatter of hot wax lies by the desk, and a trail of grey cigar ash leads, very faintly, to the servants’ door at the back.', 'The thief left by the back stairs.'] });
add({ id: 'x_blotter', kind: 'examine', obj: 'blotter', minutes: 12, gives: ['blotter_reversed'], text: ['You hold the blotter to the glass in the window. Pressed into it, reversed, are the words “better hands”, and a faint “regret”.', 'The note was composed here, at this desk, last night.'] });
add({ id: 'x_under_desk', kind: 'examine', obj: 'under_desk', minutes: 15, gives: ['scrap_trial'], text: ['Behind the desk, wedged against the skirting, is a torn corner of cream paper. Held to the light it shows part of a crown watermark, and in the margin a pen-trial: three copperplate capitals, written to test the nib.', 'The thief practised his hand here before writing it out.'] });
add({ id: 'x_copybook', kind: 'examine', obj: 'copybook', minutes: 20, gives: ['pell_letters_sample'], flags: ['has_pell_sample'], text: ['The press copy-book holds the secretary’s letters in his own hand. They are fair copies, careful and rounded. Hundreds of them.', 'You take a handful of leaves; Sir Alistair will not miss them. You will want an expert to compare these with the note.'] });
add({ id: 'x_desk', kind: 'examine', obj: 'desk', minutes: 15, text: ['Letters from Amsterdam, pushed to the back of a pigeonhole; Whatman writing-paper in a rack; a drawer containing three spare keys to the garden gate and nothing for a safe. Nothing that explains itself yet.'], learnsP: ['van_hoorn'] });
add({ id: 'x_fireplace', kind: 'examine', obj: 'fireplace', minutes: 10, text: ['The grate is laid but unlit. Nothing in the ashes; whoever planned this planned it well.'] });
add({ id: 'x_books', kind: 'examine', obj: 'bookcases', minutes: 10, text: ['Law, genealogy and gemmology; a long run of Debrett’s Peerage in red cloth, newly corrected. A very orderly man has ordered them.'] });

// ======================================================================= EXAMINATION: THE HOUSE
add({ id: 'x_stairs', kind: 'examine', obj: 'back_stairs', minutes: 15, gives: ['upstairs_candle'], text: ['The back stairs run from the study end to the scullery. On the third tread is a spot of tallow; on the fifth, a smear of grey ash. A man came down in the dark with a candle in one hand and something in the other.'] });
add({ id: 'x_side', kind: 'examine', obj: 'side_door', minutes: 12, gives: ['reeve_not_at_door'], text: ['The flowerbed by the side door is crossed by a single set of boots, a footman’s, with half a dozen cigar-ends under the lilac. The garden door is bolted on the inside. Nobody came in or out this way.'] });
add({ id: 'x_hall', kind: 'examine', obj: 'hall', minutes: 10, text: ['A house of money and good taste, and of very little talk. Nothing to see that is not on show.'] });

// ======================================================================= EXAMINATION: PELL'S LODGING
add({ id: 'x_lodge_books_ok', kind: 'examine', obj: 'lodging_books', minutes: 15, gives: ['stone_debretts'], flags: ['stone_found'], need: { flags: ['hodge_door'], alertBelow: 60 },
  text: ['A narrow shelf of books above the bed: Debrett, Burke, a Torquay guide. One Debrett is a hair too thick. You take it down and open it.', 'The pages have been cut away in a neat well, and in the well, lying on a pad of cotton wool, is the Marlowe Star.', 'It is smaller than you imagined, and a good deal bluer.'],
  refuse: ['You have no right to go through the books of a man’s room without his landlady’s leave.'] });
add({ id: 'x_lodge_books_gone', kind: 'examine', obj: 'lodging_books', minutes: 15, gives: ['stone_moved'], need: { flags: ['hodge_door'], alertAtLeast: 60 },
  text: ['The Debrett on the shelf has been hollowed, neatly, with a razor. The cotton wool is still in it, and still dented. The stone has gone.', 'Someone has taken it in a hurry. There is a Lambeth pawnbroker’s card on the table.'], learnsP: ['moss'], learnsPl: ['moss_shop'] });
add({ id: 'x_lodge_desk', kind: 'examine', obj: 'lodging_desk', minutes: 15, gives: ['paper_pell_lodging'], need: { flags: ['hodge_door'] },
  text: ['On the writing-table, under a pile of proofs, lies a part-used quire of cream laid paper. Held to the window it shows the crown watermark; the top sheet of the quire has been torn off.', 'It is a very good match for the half-sheet in your pocket.'] });
add({ id: 'x_lodge_trunk', kind: 'examine', obj: 'lodging_bed', minutes: 12, gives: ['boat_booked'], need: { flags: ['hodge_door'] },
  text: ['A leather portmanteau, packed and strapped, stands under the bed. In the pocket of the coat on top is a first-class rail and steamer ticket, Liverpool Street to Harwich to Antwerp, Friday, in the name of J. Peters.', 'He is ready to run.'] });
add({ id: 'x_lodge_grate', kind: 'examine', obj: 'lodging_grate', minutes: 10, need: { flags: ['hodge_door'] }, text: ['Ashes of burnt letters and a charred scrap that reads “unless the sum is”. A moneylender’s dunning letter, you think; you take the scrap.'] });

// ======================================================================= EXAMINATION: PEABODY'S
add({ id: 'x_ledger', kind: 'examine', obj: 'shop_ledger', minutes: 20, gives: ['paper_ledger_pell'], need: { mention: ['pell'], anyFacts: ['paper_joynson', 'paper_peabody'] }, cost: 3,
  text: ['The ledger, read at last, shows the Pell entries monthly.'],
  refuse: ['The ledger lies behind the counter, and Mr. Peabody has his hand upon it. He will not open it for a stranger, nor for a general question. Give him a name to confirm, and a reason to believe you have been to the right shop.'] });

// ======================================================================= SERVICES: THE IRREGULARS
add({ id: 'wi_tail_pell', kind: 'service', who: 'wiggins', topics: ['tail', 'lodging'], targets: ['pell'], minutes: 5, cost: 4, delay: 240, gives: ['pell_routine'], alert: 3,
  text: ['You give Wiggins a florin and a description. He touches his cap and is gone before you have finished.'] });
add({ id: 'wi_locksmiths', kind: 'service', who: 'wiggins', topics: ['key', 'safe', 'duplicate'], targets: [], minutes: 5, cost: 4, delay: 300, gives: ['tench_dup_vague'], learnsP: ['tench'], learnsPl: ['tench_shop'],
  text: ['You tell Wiggins to try the locksmiths for a Chubb duplicate cut in July. He sets the boys to the shops of Clerkenwell and Soho.'] });
add({ id: 'wi_lenders', kind: 'service', who: 'wiggins', topics: ['debts', 'sister', 'fence'], targets: ['pell'], minutes: 5, cost: 4, delay: 300, gives: ['pell_dunned'], learnsP: ['crake'], learnsPl: ['crake_office'],
  text: ['You send the boys round the moneylenders of Soho and Holborn with a description of Pell. The street has long ears.'] });
add({ id: 'wi_stationers', kind: 'service', who: 'wiggins', topics: ['paper', 'customers'], targets: [], minutes: 5, cost: 4, delay: 300, gives: ['paper_peabody'], learnsP: ['peabody'], learnsPl: ['peabody_shop'], need: { facts: ['paper_joynson'] },
  text: ['You hand Wiggins the corner of the watermark and tell him to go round the stationers of Holborn and the Inns. He grins; the boys have a great respect for paper.'],
  refuse: ['You do not yet know which paper to ask them to look for. Wiggins waits, unimpressed.'] });
add({ id: 'wi_watch_moss', kind: 'service', who: 'wiggins', topics: ['fence', 'tail'], targets: ['moss_shop'], minutes: 5, cost: 6, delay: 360, gives: ['stone_moved'], learnsP: ['moss'], learnsPl: ['moss_shop'], need: { alertAtLeast: 60 },
  text: ['You have Wiggins’s boys watch the pawnshops of Lambeth.'] });

export const OPTION_INDEX = Object.fromEntries(OPTIONS.map((o) => [o.id, o]));
