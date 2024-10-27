export interface LoadInput {
  userId: string;
  imdbId: string;
  logDir: string;
  force: boolean;
}

export interface RemoveInput {
  userId: string;
  imdbId: string;
  logDir: string;
  dataDir: string;
}

export interface FlagInput {
  userId: string;
  imdbId: string;
  subtitleFileName: string;
  reason: string;
  logDir: string;
}

export interface MergeInput {
  userId: string;
  logDir: string;
  dataDir: string;
}

export interface ToMovieResponseSubtitle {
  subTextId: string;
  source: string;
  author: string | null;
  zipFileName: string | null;
  subtitleFileName: string;
  subTextFileName: string;
  subTextValue: string;
}

export interface ToMovieResponseIndex {
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
}

export interface ToMovieResponse {
  index: ToMovieResponseIndex;
  subtitles: ToMovieResponseSubtitle[];
}
