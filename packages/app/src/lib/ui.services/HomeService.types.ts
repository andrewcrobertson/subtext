export interface LoadOutputMovie {
  imdbId: string;
  title: string;
  releaseDate: string | null;
  releaseYear: string | null;
  posterUrl: string | null;
  rated: string | null;
  genres: string[];
  directors: string[];
  writers: string[];
  actors: string[];
  runTime: number | null;
  plot: string | null;
  subtitleCount: number;
  isOnMyList: boolean;
}

export interface LoadOutput {
  myListMovies: LoadOutputMovie[];
}
