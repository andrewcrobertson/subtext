export interface MovieRaw {
  imdbId: string;
  title: string;
  releaseDate: string | null;
  releaseYear: number | null;
  posterFileName: string | null;
  rated: string | null;
  genres: string[];
  directors: string[];
  writers: string[];
  actors: string[];
  runTime: number | null;
  plot: string | null;
  subtitleIds: string[];
  isAvailable: boolean;
}

export interface MovieSubtitle {
  source: string;
  author: string | null;
  zipFileName: string | null;
  subtitleFileName: string;
  shaFileName: string;
}

export interface Movie {
  imdbId: string;
  title: string | null;
  releaseDate: string | null;
  releaseYear: number | null;
  posterFileName: string | null;
  rated: string | null;
  genres: string[];
  directors: string[];
  writers: string[];
  actors: string[];
  runTime: number | null;
  plot: string | null;
  subtitles: MovieSubtitle[];
}
