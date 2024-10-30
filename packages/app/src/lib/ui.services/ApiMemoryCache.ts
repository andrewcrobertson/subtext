import { isNil } from 'lodash-es';
import type * as T from './Api.types';

export class ApiMemoryCache implements T.Api {
  private releaseDates: Record<number, T.GetReleaseDateAscOutput | null> = {};
  private movies: Record<string, T.GetMovieOutput | null> = {};
  private subtitles: Record<string, T.GetSubtitleMetaOutput | null> = {};
  private subtitleFiles: Record<string, string | null> = {};

  public constructor(private readonly instance: T.Api) {}

  public async getReleaseDateAsc(pageNumber: number): Promise<T.GetReleaseDateAscOutput | null> {
    if (isNil(this.releaseDates[pageNumber])) {
      this.releaseDates[pageNumber] = await this.instance.getReleaseDateAsc(pageNumber);
    }

    return this.releaseDates[pageNumber];
  }

  public async getMovie(imdbId: string): Promise<T.GetMovieOutput | null> {
    if (isNil(this.movies[imdbId])) {
      this.movies[imdbId] = await this.instance.getMovie(imdbId);
    }

    return this.movies[imdbId];
  }

  public async getSubtitle(imdbId: string, subtitleId: string): Promise<T.GetSubtitleMetaOutput | null> {
    if (isNil(this.subtitles[subtitleId])) {
      this.subtitles[subtitleId] = await this.instance.getSubtitle(imdbId, subtitleId);
    }

    return this.subtitles[subtitleId];
  }

  public async getSubtitleFile(imdbId: string, subtitleId: string, fileName: string): Promise<string | null> {
    if (isNil(this.subtitleFiles[subtitleId])) {
      this.subtitleFiles[subtitleId] = await this.instance.getSubtitleFile(imdbId, subtitleId, fileName);
    }

    return this.subtitleFiles[subtitleId];
  }
}
