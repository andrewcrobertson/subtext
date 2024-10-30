export interface GetRecentMoviesOutput {
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

export interface SearchMoviesOutput {
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

export interface GetMyListMoviesOutput {
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

export interface GetMovieOutput {
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

export interface GetMovieWithSubtitlesOutput {
  imdbId: string;
  title: string;
  runTime: number | null;
  subtitles: GetMovieWithSubtitlesOutputSubtitle[];
}

export interface GetMovieWithSubtitlesOutputSubtitle {
  subtitleId: string;
  source: string;
  author: string;
  frames: GetMovieWithSubtitlesOutputSubtitleFrame[];
}

export interface GetMovieWithSubtitlesOutputSubtitleFrame {
  start: number;
  end: number;
  text: string;
}

export interface Gateway {
  getRecentMovies: () => Promise<GetRecentMoviesOutput[]>;
  searchMovies: (query: string) => Promise<SearchMoviesOutput[]>;
  getMovie: (imdbId: string) => Promise<GetMovieOutput | null>;
  getMovieWithSubtitles: (imdbId: string) => Promise<GetMovieWithSubtitlesOutput | null>;
  getMyListMovies: (userId: string) => Promise<GetMyListMoviesOutput[]>;
  addToMyList: (userId: string, imdbId: string) => Promise<void>;
  removeFromMyList: (userId: string, imdbId: string) => Promise<void>;
  submitAddMovieRequestIssue: (userId: string, imdbId: string) => Promise<boolean>;
}
