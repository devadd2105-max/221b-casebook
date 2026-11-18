// What each newspaper says, and when. Watson reads aloud; the paper decides how much to trust.
// Sunday (day 0) brings only Saturday’s editions; the theft is in the press from Monday.

export const PAPER_PROFILE = {
  times: { reliability: 'weighty and accurate, slow to speculate', tone: 'sober' },
  telegraph: { reliability: 'accurate, a little breathless', tone: 'brisk' },
  morning_post: { reliability: 'reliable on society, silent on anything else', tone: 'genteel' },
  pall_mall: { reliability: 'well sourced, with its own opinions', tone: 'clever' },
  city_press: { reliability: 'sound on money, and always a day ahead of the gossip', tone: 'dry' },
  police_news: { reliability: 'sensational, and wrong about as often as it is right', tone: 'lurid' },
};

// each entry: { from: minute the edition is available, gives: [fact ids], lines: [...] }
export const PAPER_EDITIONS = {
  times: [
    { from: 0, gives: [], lines: ['Watson unfolds Saturday’s Times. There is a long article on the Egyptian debt and a short one on the new Bank Holiday regulations. Nothing, naturally, on Marlowe House.'] },
    { from: 1440, gives: ['press_theft', 'press_times_rumour'], lines: ['Watson clears his throat and reads the Monday Times with great dignity.', ['Watson', '“A theft of the most serious kind has occurred at Marlowe House, Campden Hill. The Marlowe Star, a blue-white diamond of sixty-two carats, brought from Rangoon in 1819 by the present owner’s grandfather, was removed from the owner’s safe on Saturday night. The police are making inquiries.”'], 'The Times prints what is known, and not a word more. It will not name a suspect, which is why you may believe it.'] },
  ],
  telegraph: [
    { from: 0, gives: [], lines: ['Saturday’s Daily Telegraph: a good deal about the Chilean question and a column about omnibus horses. Nothing of use.'] },
    { from: 1440, gives: ['press_theft'], lines: ['Watson reads the Telegraph, which is quicker and warmer than the Times.', ['Watson', '“The Marlowe Star has vanished! Entrance by force is not suspected, the safe being found locked, and the household has been questioned.”'], 'The facts are the same, only breathless.'] },
  ],
  morning_post: [
    { from: 0, gives: [], lines: ['Saturday’s Morning Post: the Court Circular, a long notice of a wedding at St George’s, Hanover Square, and a list of dinners to be given that night. You find Sir Alistair’s name there, among half a dozen others.'] },
    { from: 1440, gives: ['press_theft', 'press_party'], lines: ['The Morning Post, as always, is concerned with the people rather than the crime.', ['Watson', '“The dinner at Marlowe House on Saturday was attended by Mr. Cuthbert Ashby, Mr. Lucian Gradwell, Mr. Julian Pell and others, and was ... ‘quiet, indeed, to the point of constraint’.”'], 'A society paper, but society knows who sat at table.'] },
  ],
  pall_mall: [
    { from: 0, gives: [], lines: ['Saturday’s Pall Mall Gazette is entirely devoted to a quarrel about the Eastern Question. You find nothing on the case.'] },
    { from: 1440, gives: ['press_theft', 'press_gazette'], lines: ['The Pall Mall Gazette has an editorial, and an opinion.', ['Watson', '“Scotland Yard is understood to have ‘no strong theory’. It is reported that the safe was opened without violence, which will give the public pause.”'], 'The editor has a friend at the Yard. He has repeated what the friend said, which is something.'] },
  ],
  city_press: [
    { from: 0, gives: ['press_city'], lines: ['Watson reads the City Press, which is on the table because Mrs. Hudson wraps the fish in it.', ['Watson', '“It is understood in Hatton Garden that a Dutch house has been ‘buying largely’ of late, and that the premiums on certain well-known private collections have been revised upwards at the Royal Exchange.”'], 'Not a word of the Star. But a Dutch house buying largely, and a revised premium, might be about anything. Or about one thing.'] },
    { from: 1440, gives: ['press_city', 'press_theft'], lines: ['The City Press again, with the theft on page six.', ['Watson', '“The loss of the Marlowe Star is regarded in the City with some concern. A Dutch house, it is said, has been ‘buying largely’ of late, and insurances on collections have recently risen.”'], 'Money speaks first in the City, and plainly.'] },
  ],
  police_news: [
    { from: 0, gives: [], lines: ['Saturday’s Illustrated Police News: a woodcut of a man being chased by a bull, a murder in Whitechapel and a ghost at Greenwich. Nothing relevant.'] },
    { from: 1440, gives: ['press_junk', 'press_junk_ashby'], lines: ['Watson holds the Illustrated Police News at arm’s length, as one holds a dead rat.', ['Watson', '“‘THE STAR OF DEATH! Fenian Anarchists, or a Masked Foreigner? The Curse of Marlowe House! A Gentleman of the Family Said to be Under Suspicion!’ There is a woodcut of a man in a mask climbing a drainpipe.”'], 'It cites no source, and the drainpipe does not exist; you have been to Marlowe House, or you will go. Mark the whole thing as noise.'] },
  ],
};
