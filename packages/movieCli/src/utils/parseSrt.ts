import { join } from 'lodash';
import { timeToMilliseconds } from './parseTime';

export interface SubtitleBlock {
  index: number;
  start: number;
  end: number;
  text: string;
}

export const parseSrt3 = (srtContent: string): string => {
  const blocks = parseSrt2(srtContent);
  const lines: string[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const { start, end, text } = blocks[i];
    lines.push(`${start} ${end} ${text}`);
  }

  return join(lines, '\n');
};

export const parseSrt2 = (srtContent: string): SubtitleBlock[] => {
  const blocks: SubtitleBlock[] = [];

  const subtitleChunks = srtContent.split(/\n\s*\n/);
  subtitleChunks.forEach((chunk) => {
    const lines = chunk.trim().split('\n');
    if (lines.length >= 3) {
      const index = parseInt(lines[0], 10);
      const [startTime, endTime] = lines[1].split(' --> ').map((s) => s.trim());
      const text = lines
        .slice(2)
        .map((s) => s.trim())
        .join('<br />');
      blocks.push({ index, start: timeToMilliseconds(startTime), end: timeToMilliseconds(endTime), text });
    }
  });

  return blocks;
};

export const parseSrt = (srtContent: string): string[] => {
  const blocks: string[] = [];

  const subtitleChunks = srtContent.split(/\n\s*\n/);
  subtitleChunks.forEach((chunk) => {
    const lines = chunk.trim().split('\n');
    if (lines.length >= 3) {
      const index = parseInt(lines[0], 10);
      const [startTime, endTime] = lines[1].split(' --> ').map((s) => s.trim());
      const text = lines
        .slice(2)
        .map((s) => s.trim())
        .join('\n');
      blocks.push(`${timeToMilliseconds(startTime)} ${timeToMilliseconds(endTime)} ${text}`);
    }
  });

  return blocks;
};
