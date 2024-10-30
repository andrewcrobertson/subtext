export interface LoadInput {
  userId: string;
  imdbId: string;
  force: boolean;
}

export interface RemoveInput {
  userId: string;
  imdbId: string;
  dir: string;
}

export interface FlagInput {
  userId: string;
  imdbId: string;
  subtitleId: string;
  reason: string;
}

export interface IndexInput {
  userId: string;
}

export interface ToMovieResponseSubtitle {
  subtitleId: string;
  source: string;
  author: string | null;
  zipFileName: string | null;
  subtitleFileName: string;
  subtextFileName: string;
  subtextValue: string;
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
  movieData: ToMovieResponseIndex;
  subtitles: ToMovieResponseSubtitle[];
}

export interface MovieIndexRaw {
  imdbId: string;
  title: string;
  releaseDate: string | null;
  releaseYear: number | null;
}

export interface QueryIndex {
  pageNumber: number;
  pageCount: number;
  imdbIds: string[];
}
