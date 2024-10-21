import { parseTime } from './parseTime';

export interface SubtitleSection {
  start: number;
  end: number;
  text: string;
}

export const parseSrt = (data: string) => {
  const pattern = /(\d+)\n(\d{2}):(\d{2}):(\d{2}),(\d{3}) --> (\d{2}):(\d{2}):(\d{2}),(\d{3})\n([\s\S]+?)(?=\n\n|\n*$)/g;
  let result;
  const subtitles: SubtitleSection[] = [];

  while ((result = pattern.exec(data)) !== null) {
    subtitles.push({
      start: parseTime(result[2], result[3], result[4], result[5]),
      end: parseTime(result[6], result[7], result[8], result[9]),
      text: result[10].replace(/\n/g, '<br>'),
    });
  }
  return subtitles;
};
