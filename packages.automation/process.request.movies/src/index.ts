import type { RequestHandler } from '@get-subtext/automation.process.request';
import { GetMovieRequestHandler } from './services/GetMovieRequestHandler';

export interface CreateRequestHandlerOptions {}

export const createRequestHandler = ({}: CreateRequestHandlerOptions): RequestHandler => {
  return new GetMovieRequestHandler();
};
