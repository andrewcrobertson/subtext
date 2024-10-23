import { endsWith, get, map, parseInt, split, trim } from 'lodash';
import type { ApiSearchResponse, SearchResponse } from '../../types/OmdbApi';

export class OmdbApi {
  public constructor(
    private readonly apiUrlBase: string,
    private readonly apiKey: string
  ) {}

  public async search(imdbId: string): Promise<SearchResponse> {
    const fetchSearchRes = await this.fetchSearch(imdbId);

    const output = {
      imdbId,
      title: fetchSearchRes.Title,
      posterUrl: fetchSearchRes.Poster,
      releaseDate: this.parseReleaseDate(fetchSearchRes.Released),
      releaseYear: this.parseReleaseYear(fetchSearchRes.Year),
      rated: fetchSearchRes.Rated,
      genres: map(split(fetchSearchRes.Genre, ' '), (g) => trim(g)),
      actors: map(split(fetchSearchRes.Actors, ','), (a) => trim(a)),
      runTimeMins: this.parseRunTime(fetchSearchRes.Runtime),
      plot: fetchSearchRes.Plot,
    };

    return output;
  }

  private async fetchSearch(imdbId: string) {
    try {
      const url = `${this.apiUrlBase}/?i=${imdbId}&apikey=${this.apiKey}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Omdb Error: api fetch returned ${response.status}`);

      const data = (await response.json()) as ApiSearchResponse;
      return data;
    } catch (cause) {
      const causeMessage = get(cause, ['message'], null);
      const message = 'Omdb Error: api fetch unexpected error ' + (causeMessage === null ? '' : `: '${causeMessage}'`);
      throw new Error(message, { cause });
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
      console.error(`Could not parse release year: '${runTime}'`, err);
      return null;
    }
  }
}
