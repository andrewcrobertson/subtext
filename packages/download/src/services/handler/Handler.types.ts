export interface RunInput {
  metaDir: string;
  subtitleDir: string;
  posterDir: string;
}

export interface ToMovieResponseSubtitle {
  source: string;
  author: string | null;
  zipFileName: string | null;
  subtitleFileName: string;
  shaFileName: string;
}

export interface ToMovieResponse {
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
  subtitles: ToMovieResponseSubtitle[];
  files: Record<string, string>;
}
