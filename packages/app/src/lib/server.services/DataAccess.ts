import type { Movie } from '$lib/isomorphic.types/Movie';
import { getSixMonthsAgo } from '$lib/isomorphic.utils/date';
import fs from 'fs';
import { filter, find, orderBy } from 'lodash-es';
import path from 'path';

export class DataAccess {
  private movies: Movie[] = [];

  public constructor(private readonly dirPath: string) {}

  public getIndex() {
    const sixMonthsAgo = getSixMonthsAgo();
    const movies = this.getMovies();
    const recent = filter(movies, (m) => m.releaseDate !== null && m.releaseDate > sixMonthsAgo.toISOString());
    return recent;
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
