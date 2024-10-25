import type { Movie } from '$lib/isomorphic.types/Movie';
import { getThreeMonthsAgo } from '$lib/isomorphic.utils/date';
import fs from 'fs';
import { find, first, get, isEmpty, orderBy } from 'lodash-es';
import path from 'path';

export class DataAccess {
  private movies: Movie[] = [];
  private subtitles: Record<string, string> = {};

  public constructor(private readonly dirPath: string) {}

  public getIndex() {
    const sixMonthsAgo = getThreeMonthsAgo().toISOString();
    const movies = this.getMovies();
    const recentMovies: { id: string; title: string; posterFileName: string; hasSubtitles: boolean }[] = [];
    const olderMovies: { id: string; title: string; posterFileName: string; hasSubtitles: boolean }[] = [];

    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];
      const movieBasic = { id: movie.imdbId, title: movie.title!, posterFileName: movie.posterFileName!, hasSubtitles: movie.subtitles.length > 0 };
      if (movie.releaseDate !== null && movie.releaseDate > sixMonthsAgo) {
        recentMovies.push(movieBasic);
      } else {
        olderMovies.push(movieBasic);
      }
    }

    return { recentMovies, olderMovies };
  }

  public getView(id: string) {
    const movies = this.getMovies();
    const movie = find(movies, (m) => m.imdbId === id)!;

    const title = get(movie, ['title'], 'Uknown');
    const subtitles = this.getSubtitle(get(first(get(movie, 'subtitles', [])), 'shaFileName', ''));
    return { title, subtitles };
  }

  private getMovies() {
    if (this.movies.length === 0) {
      const moviesRaw: Movie[] = [];

      const metaDir = path.resolve(this.dirPath, 'meta');
      const files = fs.readdirSync(metaDir);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (path.extname(file) === '.json') {
          const movie: Movie = JSON.parse(fs.readFileSync(path.join(metaDir, file), 'utf-8'));
          if (movie.subtitles.length > 0) moviesRaw.push(movie);
        }
      }

      const movies = orderBy(moviesRaw, ['releaseDate', 'releaseYear', 'title'], ['desc', 'desc', 'asc']);
      this.movies = movies;
    }

    return this.movies;
  }

  private getSubtitles() {
    if (isEmpty(this.subtitles)) {
      const subtitlesDir = path.resolve(this.dirPath, 'subtitles');
      const files = fs.readdirSync(subtitlesDir);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.subtitles[file] = fs.readFileSync(path.join(subtitlesDir, file), 'utf-8');
      }
    }

    return this.subtitles;
  }

  private getSubtitle(fileName: string) {
    const subtitles = this.getSubtitles();
    return subtitles[fileName];
  }
}
