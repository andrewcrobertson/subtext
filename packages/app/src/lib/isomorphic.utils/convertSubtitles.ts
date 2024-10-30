import { compact, join, map, split, trim } from 'lodash-es';

export const parseSubtitleLine = (input: string) => {
  const [startRaw, endRaw, ...textRaw] = input.split(' ');
  const start = parseInt(startRaw, 10);
  const end = parseInt(endRaw, 10);
  const text = trim(join(textRaw, ' '));
  return { start, end, text };
};

export const convertSubtitles = (lines: string) => {
  return compact(map(split(lines, '\n'), (l) => parseSubtitleLine(l)));
};
