import { StandardRequestProcessor } from '$services/GitHubRequestGateway';
import type { RequestGateway, RequestHandler, RequestProcessor } from '$services/GitHubRequestGateway.types';

export type { RequestGateway, RequestHandler, RequestProcessor } from '$services/GitHubRequestGateway.types';

export interface CreateRequestProcessorOptions {
  separator?: string;
  requestGateway: RequestGateway;
  requestHandlers: RequestHandler[];
}

export const createRequestProcessor = ({ separator = '===', requestGateway, requestHandlers }: CreateRequestProcessorOptions): RequestProcessor => {
  return new StandardRequestProcessor(separator, requestGateway, requestHandlers);
};
