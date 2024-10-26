export interface Movie {
  id: string;
  title: string;
  releaseDate: string;
  posterFileName: string;
  rated: string;
  genres: string[];
  actors: string[];
  runTime: number;
  plot: string;
  isOnMyList: boolean;
}

export interface MyListEventDetail {
  id: string;
}
