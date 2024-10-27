import { endsWith, map, parseInt, split, trim } from 'lodash';
import type * as T from './OmdbApi.types';

export class OmdbApi {
  public constructor(
    private readonly apiUrlBase: string,
    private readonly apiKey: string
  ) {}

  public async search(imdbId: string): Promise<T.SearchResponse> {
    const fetchSearchRes = await this.fetchSearch(imdbId);

    const output = {
      imdbId,
      title: fetchSearchRes.Title,
      posterUrl: fetchSearchRes.Poster,
      releaseDate: this.parseReleaseDate(fetchSearchRes.Released),
      releaseYear: this.parseReleaseYear(fetchSearchRes.Year),
      rated: fetchSearchRes.Rated,
      genres: map(split(fetchSearchRes.Genre, ','), (g) => trim(g)),
      directors: map(split(fetchSearchRes.Director, ','), (d) => trim(d)),
      writers: map(split(fetchSearchRes.Writer, ','), (w) => trim(w)),
      actors: map(split(fetchSearchRes.Actors, ','), (a) => trim(a)),
      runTimeMins: this.parseRunTime(fetchSearchRes.Runtime),
      plot: fetchSearchRes.Plot,
    };

    return output;
  }

  private async fetchSearch(imdbId: string) {
    const logUrl = `${this.apiUrlBase}/?i=${imdbId}&apikey=*****`;
    try {
      const url = `${this.apiUrlBase}/?i=${imdbId}&apikey=${this.apiKey}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Omdb: fetch '${logUrl}' returned status '${response.status}'`);

      const data = (await response.json()) as T.ApiSearchResponse;
      return data;
    } catch (cause) {
      throw new Error(`Omdb: fetch '${logUrl}' failed`, { cause });
    }
  }

  private parseReleaseDate(date: string) {
    try {
      return new Date(Date.parse(`${date} UTC`)).toISOString();
    } catch (err) {
      console.error(`Could not parse release date: '${date}'`, err);
      return null;
    }
  }

  private parseReleaseYear(year: string) {
    try {
      return parseInt(year, 10);
    } catch (err) {
      console.error(`Could not parse release year: '${year}'`, err);
      return null;
    }
  }

  private parseRunTime(runTime: string) {
    try {
      if (!endsWith(runTime, 'min')) throw new Error(`Invalid run time: ${runTime}`);
      return parseInt(runTime, 10);
    } catch (err) {
      console.error(`Could not parse run time: '${runTime}'`, err);
      return null;
    }
  }
}
