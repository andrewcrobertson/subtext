import AdmZip from 'adm-zip';
import { get, toPairs } from 'lodash';
import path from 'path';
import { ApiSearchResponse, ApiSearchResponseSubtitle, SearchResponse } from '../../types/SubdlApi';

export class SubdlApi {
  public constructor(
    private readonly apiUrlBase: string,
    private readonly subdlZipUrlBase: string,
    private readonly apiKey: string
  ) {}

  public async search(imdbId: string): Promise<SearchResponse> {
    const output: SearchResponse = { imdbId, title: null, releaseDate: null, releaseYear: null, subtitles: [] };

    const fetchSearchRes = await this.fetchSearch(imdbId);

    for (let i = 0; i < fetchSearchRes.subtitles.length; i++) {
      const subtitle = fetchSearchRes.subtitles[i];
      const author = subtitle.author ?? null;
      const zipFile = path.basename(subtitle.url);

      try {
        const fetchZipRes = await this.fetchZip(subtitle);
        const extractZipRes = await this.extractZip(fetchZipRes);
        const srtFilePairs = toPairs(extractZipRes);
        for (let i = 0; i < srtFilePairs.length; i++) {
          const [srtFileName, srtFileText] = srtFilePairs[i];
          output.subtitles.push({ success: true, data: { author, zipFileName: zipFile, srtFileName, srtFileText }, errors: [] });
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

  private async fetchSearch(imdbId: string): Promise<ApiSearchResponse> {
    try {
      const response = await fetch(`${this.apiUrlBase}?api_key=${this.apiKey}&imdb_id=${imdbId}&type=movie&languages=EN`);
      if (!response.ok) throw new Error(`Subdl Error: api fetch returned ${response.status}`);

      const data = (await response.json()) as ApiSearchResponse;
      if (!data.status) throw new Error(`Subdl Error: api fetch returned a status of 'false'`);

      return data;
    } catch (cause) {
      const causeMessage = get(cause, ['message'], null);
      const message = 'Subdl Error: api fetch unexpected error ' + (causeMessage === null ? '' : `: '${causeMessage}'`);
      throw new Error(message, { cause });
    }
  }

  private async fetchZip(subtitle: ApiSearchResponseSubtitle): Promise<ArrayBuffer> {
    try {
      const url = `${this.subdlZipUrlBase}${subtitle.url}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Subdl Error: zip fetch returned ${response.status}`);

      const data = await response.arrayBuffer();
      return data;
    } catch (cause) {
      const causeMessage = get(cause, ['message'], null);
      const message = 'Subdl Error: zip fetch unexpected error ' + (causeMessage === null ? '' : `: '${causeMessage}'`);
      throw new Error(message, { cause });
    }
  }

  private async extractZip(arrayBuffer: ArrayBuffer): Promise<Record<string, string>> {
    const data: Record<string, string> = {};
    try {
      const zip = new AdmZip(Buffer.from(arrayBuffer));
      const entries = zip.getEntries();
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        if (!entry.isDirectory && path.extname(entry.entryName) === '.srt') {
          data[entry.entryName] = entry.getData().toString();
        }
      }

      return data;
    } catch (cause) {
      const causeMessage = get(cause, ['message'], null);
      const message = 'Subdl Error: extract zip unexpected error ' + (causeMessage === null ? '' : `: '${causeMessage}'`);
      throw new Error(message, { cause });
    }
  }
}
