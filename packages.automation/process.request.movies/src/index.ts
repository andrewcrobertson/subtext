import type { RequestHandler } from '@get-subtext/automation.process.request';
import { GetMovieRequestHandler } from './services/GetMovieRequestHandler';
import type { MovieReader } from './services/GetMovieRequestHandler.types';

export type { MovieReader } from './services/GetMovieRequestHandler.types';

export interface CreateRequestHandlerOptions {
  movieReader: MovieReader;
}

export const createRequestHandler = ({ movieReader }: CreateRequestHandlerOptions): RequestHandler => {
  return new GetMovieRequestHandler(movieReader);
};
