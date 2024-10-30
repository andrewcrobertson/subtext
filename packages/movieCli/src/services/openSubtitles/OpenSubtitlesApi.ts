import * as T from './OpenSubtitlesApi.types';

export class OpenSubtitlesApi {
  public constructor(
    private readonly apiUrlBase: string,
    private readonly apiKey: string
  ) {}

  public async search(imdbId: string): Promise<T.SearchResponse> {
    const output: T.SearchResponse = { imdbId, title: null, posterUrl: null, releaseDate: null, releaseYear: null, subtitles: [] };

    const fetchSearchRes = await this.fetchSearch(imdbId);
    for (let i = 0; i < fetchSearchRes.data.length; i++) {
      const data = fetchSearchRes.data[i];
      if (data.attributes.language !== 'en') continue;

      const author = data.attributes.uploader.name ?? null;
      output.title = data.attributes.feature_details.title ?? null;
      output.releaseYear = data.attributes.feature_details.year ?? null;

      for (let j = 0; j < data.attributes.related_links.length; j++) {
        const relatedLink = data.attributes.related_links[j];
        output.posterUrl = relatedLink.img_url ?? null;
      }

      for (let j = 0; j < data.attributes.files.length; j++) {
        const file = data.attributes.files[j];
        try {
          const fetchUrlRes = await this.fetchUrl(file.file_id);
          const subtitleFileName = fetchUrlRes.file_name;
          const subtitleFileText = await this.fetchSubtitleText(fetchUrlRes.link);
          output.subtitles.push({ success: true, data: { author, subtitleFileName, subtitleFileText }, errors: [] });
        } catch (err) {
          output.subtitles.push({ success: false, data: null, errors: [<any>err] });
        }
      }
    }

    return output;
  }

  private async fetchSearch(imdbId: string): Promise<T.ApiSearchResponse> {
    const url = `${this.apiUrlBase}/subtitles?imdb_id=${imdbId}`;
    const headers = { Accept: 'application/json', 'Api-Key': this.apiKey, 'Content-Type': 'application/json', 'User-Agent': 'subtext v0' };

    try {
      const response = await fetch(url, { headers });
      if (!response.ok) throw new Error(`OpenSubtitles: fetch '${url}' returned status '${response.status}'`);

      const data = (await response.json()) as T.ApiSearchResponse;
      return data;
    } catch (cause) {
      throw new Error(`OpenSubtitles: fetch '${url}' failed`, { cause });
    }
  }

  private async fetchUrl(fileId: number): Promise<T.ApiUrlResponse> {
    const url = `${this.apiUrlBase}/download`;
    const body = { file_id: fileId, sub_format: 'srt' };
    const headers = { Accept: 'application/json', 'Api-Key': this.apiKey, 'Content-Type': 'application/json', 'User-Agent': 'subtext v0' };

    try {
      const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
      if (!response.ok) throw new Error(`OpenSubtitles: fetch '${url}' returned status '${response.status}'`);

      const data = (await response.json()) as T.ApiUrlResponse;
      return data;
    } catch (cause) {
      throw new Error(`OpenSubtitles: fetch '${url}' failed`, { cause });
    }
  }

  private async fetchSubtitleText(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`OpenSubtitles: fetch '${url}' returned status '${response.status}'`);

      const data = await response.text();
      return data;
    } catch (cause) {
      throw new Error(`OpenSubtitles: fetch '${url}' failed`, { cause });
    }
  }
}
