export interface MovieSubtitles {
  source: string;
  author: string | null;
  zipFileName: string | null;
  subtitleFileName: string;
  subtitleFileText: string;
}

export interface Movie {
  imdbId: string;
  title: string;
  posterUrl: string | null;
  releaseDate: string | null;
  releaseYear: number | null;
  rated: string | null;
  genres: string[];
  directors: string[];
  writers: string[];
  actors: string[];
  runTimeMins: number | null;
  plot: string | null;
  subtitles: MovieSubtitles[];
}
