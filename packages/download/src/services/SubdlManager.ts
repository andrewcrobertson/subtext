import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import type { SearchResult, Subtitle } from '../../types/Subdl';
import { parseSrt, SubtitleBlock } from '../utils/parseSrt';

const zipUrl = `https://dl.subdl.com`;
const apiUrl = `https://api.subdl.com/api/v1/subtitles`;

export class SubdlManager {
  public constructor(
    private readonly apiKey: string,
    private readonly stagingDir: string
  ) {}

  public async getInfo(imdbId: string) {
    const options: any[] = [];
    const subdlInfo = await this.fetchSubdlInfo(imdbId);

    if (subdlInfo.status) {
      for (let i = 0; i < subdlInfo.subtitles.length; i++) {
        const subtitle = subdlInfo.subtitles[i];
        try {
          const subtitleInfo = await this.getSubtitleInfo(subtitle);
          options.push(...subtitleInfo);
        } catch (err) {
          console.log(err);
        }
      }

      return { imdbId, title: subdlInfo.results[0].name, releaseDate: subdlInfo.results[0].release_date, year: subdlInfo.results[0].year, options };
    } else {
      return { imdbId, title: null, releaseDate: null, year: null, options: [] };
    }
  }

  private async fetchSubdlInfo(imdbId: string) {
    const response = await fetch(`${apiUrl}?api_key=${this.apiKey}&imdb_id=${imdbId}&type=movie&languages=EN`);
    const json: SearchResult = await response.json();
    return json;
  }

  private async getSubtitleInfo(subtitle: Subtitle) {
    fs.mkdirSync(this.stagingDir, { recursive: true });

    const basename = path.basename(subtitle.url);
    const id = path.parse(basename).name;
    const zipFilePath = path.resolve(this.stagingDir, basename);
    const extractFilePath = path.resolve(this.stagingDir, id);

    if (!fs.existsSync(zipFilePath)) {
      const url = `${zipUrl}${subtitle.url}`;
      const response = await fetch(url);
      const fileStream = fs.createWriteStream(zipFilePath);
      await promisify(pipeline)(response.body as unknown as NodeJS.ReadableStream, fileStream);
    }

    const zip = new AdmZip(zipFilePath);
    zip.extractAllTo(extractFilePath, true);

    const subtitles: { author: string; zipFile: string; srtFile: string; subtitles: SubtitleBlock[] }[] = [];
    const files = await fs.promises.readdir(extractFilePath);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fullPath = path.join(extractFilePath, file);

      if (path.extname(file) === '.srt') {
        const content = await fs.promises.readFile(fullPath, 'utf-8');
        subtitles.push({ author: subtitle.author, zipFile: basename, srtFile: file, subtitles: parseSrt(content) });
      }
    }

    return subtitles;
  }
}
