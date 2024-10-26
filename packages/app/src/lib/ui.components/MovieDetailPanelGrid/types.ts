export type { MyListEventDetail } from '$lib/ui.components/MovieDetailPanel/types';

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
