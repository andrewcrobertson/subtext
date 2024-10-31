import { Movie } from './Common.types';

export interface ReadResponseOk {
  success: true;
  data: Movie;
  errors: Error[];
}

export interface ReadResponseFail {
  success: false;
  data: null;
  errors: Error[];
}

export type ReadResponse = ReadResponseOk | ReadResponseFail;

export interface MovieReader {
  read: (imdbId: string) => Promise<ReadResponse>;
}

export interface MovieWriter {
  write: (userId: string, movie: Movie) => Promise<void>;
}
