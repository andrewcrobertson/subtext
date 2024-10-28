import type { Movie, MovieRaw } from '$lib/isomorphic.types/Movie';
import fs from 'fs';
import { find, first, get, isEmpty, orderBy } from 'lodash-es';
import path from 'path';

export class DataAccess {
  private movies: Movie[] = [];
  private subtitles: Record<string, string> = {};

  public constructor(private readonly dirPath: string) {}

  public async getIndex() {
    const moviesRaw = await this.getMovies();
    const movies: { id: string; title: string; posterFileName: string; hasSubtitles: boolean }[] = [];

    for (let i = 0; i < moviesRaw.length; i++) {
      const movie = moviesRaw[i];
      const movieBasic = { id: movie.imdbId, title: movie.title!, posterFileName: movie.posterFileName!, hasSubtitles: movie.subtitles.length > 0 };
      movies.push(movieBasic);
    }

    return { movies };
  }

  public async search() {
    const moviesRaw = await this.getMovies();
    const movies: {
      id: string;
      title: string;
      releaseDate: string;
      posterFileName: string;
      rated: string;
      genres: string[];
      actors: string[];
      runTime: number;
      plot: string;
    }[] = [];

    for (let i = 0; i < moviesRaw.length; i++) {
      const movie = moviesRaw[i];
      movies.push({
        id: movie.imdbId,
        title: movie.title!,
        releaseDate: movie.releaseDate!,
        posterFileName: movie.posterFileName!,
        rated: movie.rated!,
        genres: movie.genres,
        actors: movie.actors,
        runTime: movie.runTime!,
        plot: movie.plot!,
      });
    }

    return { movies };
  }

  public async getView(id: string) {
    const movies = await this.getMovies();
    const movie = find(movies, (m) => m.imdbId === id)!;

    const title = get(movie, ['title'], 'Uknown');
    const subtitles = this.getSubtitle(get(first(get(movie, 'subtitles', [])), 'shaFileName', ''));
    return { title, subtitles };
  }

  private async getMovies() {
    if (this.movies.length === 0) {
      const moviesRaw: Movie[] = [];

      const indexFilePath = path.resolve(this.dirPath, 'index.json');
      const index = JSON.parse(fs.readFileSync(indexFilePath, 'utf-8'));

      for (let i = 0; i < index.length; i++) {
        const movieId = index[i].imdbId;
        const file = path.resolve(this.dirPath, movieId, 'index.json');
        const movie: MovieRaw = JSON.parse(fs.readFileSync(file, 'utf-8'));
        for (let j = 0; j < movie.subtitleIds.length; j++) {
          const file = path.resolve(this.dirPath, movieId, 'index.json');
        }

        moviesRaw.push({ ...movie, subtitles: [] });
      }

      const movies = orderBy(moviesRaw, ['releaseDate', 'releaseYear', 'title'], ['desc', 'desc', 'asc']);
      this.movies = movies;
    }

    return this.movies;
  }

  private getSubtitles() {
    if (isEmpty(this.subtitles)) {
      const subtitlesDir = path.resolve(this.dirPath, 'subtitles');
      fs.mkdirSync(subtitlesDir, { recursive: true });

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
