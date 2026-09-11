export const BASE_URL = 'https://www.nikhilsnayak.dev';

export const FEED_PATH = '/rss.xml';

export const FEED_ALTERNATE_TYPES = {
  'application/rss+xml': `${BASE_URL}${FEED_PATH}`,
};

export const SITE_INTRO =
  'I build things for the web and often find myself asking, “does this really need to be so complicated?”';

export const WRITING_INTRO =
  'I usually write when something finally clicks. Mostly code, sometimes the path that got me here.';

export const NAME_MARK_GLYPHS = [
  ['10001', '11001', '11001', '10101', '10011', '10011', '10001'],
  ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  [],
  ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
];

export const NOT_FOUND_GLYPHS = [
  ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
];
