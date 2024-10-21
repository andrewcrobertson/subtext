import type { SearchResult } from '../../types/Imdb';

const apiUrl = `https://www.omdbapi.com`;

export class OmdbManager {
  public constructor(private readonly apiKey: string) {}

  public async getInfo(imdbId: string) {
    const response = await fetch(`${apiUrl}/?i=${imdbId}&apikey=${this.apiKey}`);
    const json: SearchResult = await response.json();

    return { imdbId, title: json.Title, poster: json.Poster, year: json.Year, releaseDate: json.Released };
  }
}
