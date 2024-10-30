export interface WriteMovieDataInputMovie {
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

export interface WriteSubtitleDataInputSubtitle {
  subtitleId: string;
  source: string;
  author: string | null;
  zipFileName: string | null;
  subtitleFileName: string;
  subtextFileName: string;
}

export interface GetMovieDataResponse {
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

export interface WriteIndexDataInputMovie {
  pageNumber: number
  pageCount: number
  imdbIds: string[];
}
