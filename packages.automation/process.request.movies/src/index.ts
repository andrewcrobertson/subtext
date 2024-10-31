import type { RequestHandler } from '@get-subtext/automation.process.request';
import { GetMovieRequestHandler } from './services/GetMovieRequestHandler';
import type { MovieReader, MovieWriter } from './services/GetMovieRequestHandler.types';

export type { Movie } from './services/Common.types';
export type { MovieReader, MovieWriter } from './services/GetMovieRequestHandler.types';

export interface CreateRequestHandlerOptions {
  movieReader: MovieReader;
  movieWriter: MovieWriter;
}

export const createRequestHandler = ({ movieReader, movieWriter }: CreateRequestHandlerOptions): RequestHandler => {
  return new GetMovieRequestHandler(movieReader, movieWriter);
};
