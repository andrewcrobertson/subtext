export interface Movie {
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

export interface MyListEventDetail {
  id: string;
}

export enum Mode {
  Play = 'Play',
  View = 'View',
}
