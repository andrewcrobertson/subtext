import { convertSubtitles } from '$lib/isomorphic.utils/convertSubtitles';
import { compact, filter, includes, lowerCase, map, orderBy, uniq } from 'lodash-es';
import type { Api } from './Api.types';
import type * as T from './Gateway.types';
import type { GitHubService } from './GitHubService';
import type { ImageLoader } from './ImageLoader';
import type { MyListMovieIdManager } from './MyListMovieIdManager';

export class Gateway implements T.Gateway {
  private extraImdbIds: string[] = [];

  public constructor(
    private readonly baseUrl: string,
    private readonly showNRecentMovies: number,
    private readonly searchNRecentMovies: number,
    private readonly api: Api,
    private readonly gitHubService: GitHubService,
    private readonly myListMovieIdManager: MyListMovieIdManager,
    private readonly imageLoader: ImageLoader
  ) {}

  public async getRecentMovies(): Promise<T.GetRecentMoviesOutput[]> {
    const imdbIds = await this.queryAllMovies(this.showNRecentMovies);
    const movies = await Promise.all(map(imdbIds, (imdbId) => this.getMovie(imdbId)));
    const moviesCompact = compact(movies);
    const moviesSorted = orderBy(moviesCompact, ['releaseDate', 'releaseYear', 'title'], ['desc', 'desc', 'asc']);
    const output: T.GetRecentMoviesOutput[] = moviesSorted;
    return output;
  }

  public async searchMovies(query: string): Promise<T.SearchMoviesOutput[]> {
    const queryLower = lowerCase(query);
    const imdbIds = await this.queryAllMovies(this.searchNRecentMovies);
    const movies = await Promise.all(map(imdbIds, (imdbId) => this.getMovie(imdbId)));
    const moviesCompact = compact(movies);
    const moviesSorted = orderBy(moviesCompact, ['releaseDate', 'releaseYear', 'title'], ['desc', 'desc', 'asc']);
    const output: T.SearchMoviesOutput[] = filter(moviesSorted, (m) => includes(lowerCase(m.title), queryLower));
    return output;
  }

  public async getMyListMovies(userId: string): Promise<T.GetMyListMoviesOutput[]> {
    const imdbIds = await this.myListMovieIdManager.get();
    const movies = await Promise.all(map(imdbIds, (imdbId) => this.getMovie(imdbId)));
    const output: T.GetMyListMoviesOutput[] = compact(movies);
    return output;
  }

  public async addToMyList(userId: string, imdbId: string): Promise<void> {
    this.extraImdbIds.push(imdbId);
    await this.myListMovieIdManager.add(imdbId);
  }

  public async removeFromMyList(userId: string, imdbId: string): Promise<void> {
    await this.myListMovieIdManager.remove(imdbId);
  }

  public async getMovie(imdbId: string): Promise<T.GetMovieOutput | null> {
    const movie = await this.doGetMovie(imdbId);
    return movie === null ? null : movie;
  }

  public async getMovieWithSubtitles(imdbId: string): Promise<T.GetMovieWithSubtitlesOutput | null> {
    const movie = await this.api.getMovie(imdbId);
    if (movie === null || !movie.isAvailable || movie.subtitleIds.length === 0) return null;

    const subtitlesRaw = await Promise.all(map(movie.subtitleIds, (subtitleId) => this.getSubtitles(imdbId, subtitleId)));
    const subtitles = compact(subtitlesRaw);

    const { title, runTime } = movie;
    return { imdbId, title, runTime, subtitles };
  }

  public async submitAddMovieRequestIssue(userId: string, imdbId: string) {
    this.extraImdbIds.push(imdbId);
    return await this.gitHubService.submitAddMovieRequestIssue(userId, imdbId);
  }

  public async queryAllMovies(maxMovies: number): Promise<string[]> {
    const output: string[] = this.extraImdbIds;

    let idx = 1;
    while (true) {
      const page = await this.api.getReleaseDateAsc(idx);
      if (page === null) break;
      for (let i = 0; i < page.imdbIds.length; i++) {
        output.push(page.imdbIds[i]);
        if (output.length >= maxMovies) break;
      }

      if (idx >= page.pageCount) break;
      idx++;
    }

    return uniq(output);
  }

  private async doGetMovie(imdbId: string): Promise<T.GetRecentMoviesOutput | T.GetMovieOutput | null> {
    const movie = await this.api.getMovie(imdbId);
    if (movie === null || !movie.isAvailable) return null;

    const { posterFileName, subtitleIds, isAvailable, ...rest } = movie;
    const posterUrl = this.getPosterUrl(imdbId, posterFileName);
    const subtitleCount = subtitleIds.length;

    const myListMovieIds = await this.myListMovieIdManager.get();
    const isOnMyList = includes(myListMovieIds, movie.imdbId);

    await this.preloadImage(posterUrl);
    return { posterUrl, subtitleCount, isOnMyList, ...rest };
  }

  private async getSubtitles(imdbId: string, subtitleId: string) {
    const subtitleMeta = await this.api.getSubtitle(imdbId, subtitleId);
    if (subtitleMeta === null) return null;

    const { zipFileName, subtitleFileName, subtextFileName, ...rest } = subtitleMeta;
    const subtitleFile = await this.api.getSubtitleFile(imdbId, subtitleId, subtextFileName);
    const frames = convertSubtitles(subtitleFile ?? '');

    return { ...rest, frames };
  }

  private getPosterUrl(imdbId: string, posterFileName: string | null) {
    if (posterFileName === null) return null;
    const posterUrl = `${this.baseUrl}/movies/${imdbId}/${posterFileName}`;
    return posterUrl;
  }

  private async preloadImage(url: string | null) {
    if (url !== null) {
      try {
        await this.imageLoader.load(url);
      } catch {}
    }
  }
}
