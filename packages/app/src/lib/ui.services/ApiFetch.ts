import type * as T from './Api.types';

export class ApiFetch implements T.Api {
  public constructor(private readonly baseUrl: string) {}

  public async getReleaseDateAsc(pageNumber: number): Promise<T.GetReleaseDateAscOutput | null> {
    const url = `${this.baseUrl}/queries/release-date-asc/${pageNumber}/index.json`;
    const res = await fetch(url);
    if (res.status === 404) return null;
    const data: T.GetReleaseDateAscOutput = await res.json();
    return data;
  }

  public async getMovie(imdbId: string): Promise<T.GetMovieOutput | null> {
    const url = `${this.baseUrl}/movies/${imdbId}/index.json`;
    const res = await fetch(url);
    if (res.status === 404) return null;
    const data: T.GetMovieOutput = await res.json();
    return data;
  }

  public async getSubtitle(imdbId: string, subtitleId: string): Promise<T.GetSubtitleMetaOutput | null> {
    const url = `${this.baseUrl}/movies/${imdbId}/subtitles/${subtitleId}/index.json`;
    const res = await fetch(url);
    if (res.status === 404) return null;
    const data: T.GetSubtitleMetaOutput = await res.json();
    return data;
  }

  public async getSubtitleFile(imdbId: string, subtitleId: string, fileName: string): Promise<string | null> {
    const url = `${this.baseUrl}/movies/${imdbId}/subtitles/${subtitleId}/${fileName}`;
    const res = await fetch(url);
    if (res.status === 404) return null;
    const data = await res.text();
    return data;
  }
}
