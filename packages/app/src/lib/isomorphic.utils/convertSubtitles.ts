import { compact, map } from 'lodash-es';

export const parseSubtitleLine = (input: string) => {
  const match = input.match(/^(\d+)\s+(\d+)\s+(.+)$/);
  if (!match) return null;

  const start = parseInt(match[1], 10);
  const end = parseInt(match[2], 10);
  const text = match[3].replace(/\n/g, '<br>');
  return { start, end, text };
};

export const convertSubtitles = (lines: string[]) => compact(map(lines, (l) => parseSubtitleLine(l)));
