import AdmZip from 'adm-zip';
import { toPairs } from 'lodash';
import path from 'path';
import type * as T from './SubdlApi.types';

export class SubdlApi {
  public constructor(
    private readonly apiUrlBase: string,
    private readonly subdlZipUrlBase: string,
    private readonly apiKey: string
  ) {}

  public async search(imdbId: string): Promise<T.SearchResponse> {
    const output: T.SearchResponse = { imdbId, title: null, releaseDate: null, releaseYear: null, subtitles: [] };

    const fetchSearchRes = await this.fetchSearch(imdbId);

    for (let i = 0; i < fetchSearchRes.subtitles.length; i++) {
      const subtitle = fetchSearchRes.subtitles[i];
      const author = subtitle.author ?? null;
      const zipFileName = path.basename(subtitle.url);
      const url = `${this.subdlZipUrlBase}${subtitle.url}`;

      try {
        const fetchZipRes = await this.fetchZip(url);
        const extractZipRes = await this.extractZip(url, fetchZipRes);
        const subtitleFilePairs = toPairs(extractZipRes);
        for (let i = 0; i < subtitleFilePairs.length; i++) {
          const [subtitleFileName, subtitleFileText] = subtitleFilePairs[i];
          output.subtitles.push({ success: true, data: { author, zipFileName, subtitleFileName, subtitleFileText }, errors: [] });
        }
      } catch (err) {
        output.subtitles.push({ success: false, data: null, errors: [<any>err] });
      }
    }

    for (let i = 0; i < fetchSearchRes.results.length; i++) {
      const result = fetchSearchRes.results[i];
      output.title = result.name ?? null;
      output.releaseDate = result.release_date ?? null;
      output.releaseYear = result.year ?? null;
    }

    return output;
  }

  private async fetchSearch(imdbId: string): Promise<T.ApiSearchResponse> {
    const logUrl = `${this.apiUrlBase}?imdb_id=${imdbId}&type=movie&languages=EN&api_key=*****`;

    try {
      const url = `${this.apiUrlBase}?imdb_id=${imdbId}&type=movie&languages=EN&api_key=${this.apiKey}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Subdl: fetch '${logUrl}' returned status '${response.status}'`);

      const data = (await response.json()) as T.ApiSearchResponse;
      if (!data.status) throw new Error(`Subdl: fetch '${logUrl}' returned status 'false'`);

      return data;
    } catch (cause) {
      throw new Error(`Subdl: fetch '${logUrl}' failed`, { cause });
    }
  }

  private async fetchZip(url: string): Promise<ArrayBuffer> {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Subdl: fetch '${url}' returned status '${response.status}'`);

      const data = await response.arrayBuffer();
      return data;
    } catch (cause) {
      const message = 'Subdl Error: zip fetch unexpected error';
      throw new Error(`Subdl: fetch '${url}' failed`, { cause });
    }
  }

  private async extractZip(url: string, arrayBuffer: ArrayBuffer): Promise<Record<string, string>> {
    const data: Record<string, string> = {};
    try {
      const zip = new AdmZip(Buffer.from(arrayBuffer));
      const entries = zip.getEntries();
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        data[entry.entryName] = entry.getData().toString();
      }

      return data;
    } catch (cause) {
      throw new Error(`Subdl: extracting zip from '${url}' failed`, { cause });
    }
  }
}
