import type { Movie } from '$lib/isomorphic.types/Movie';
import { getSixMonthsAgo } from '$lib/isomorphic.utils/date';
import fs from 'fs';
import { find, orderBy } from 'lodash-es';
import path from 'path';

export class DataAccess {
  private movies: Movie[] = [];

  public constructor(private readonly dirPath: string) {}

  public getIndex() {
    const sixMonthsAgo = getSixMonthsAgo().toISOString();
    const movies = this.getMovies();
    const recentMovies: { id: string; title: string; posterFileName: string }[] = [];
    const olderMovies: { id: string; title: string; posterFileName: string }[] = [];

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
    const subtitles = movie.subtitles.length === 0 ? [] : movie.subtitles[0].lines;
    return { title: movie!.title, subtitles };
  }

  private getMovies() {
    if (this.movies.length === 0) {
      const moviesRaw: Movie[] = [];

      const files = fs.readdirSync(this.dirPath);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (path.extname(file) === '.json') {
          moviesRaw.push(JSON.parse(fs.readFileSync(path.join(this.dirPath, file), 'utf-8')));
        }
      }

      const movies = orderBy(moviesRaw, ['releaseDate', 'releaseYear', 'title'], ['desc', 'desc', 'asc']);
      this.movies = movies;
    }

    return this.movies;
  }
}
