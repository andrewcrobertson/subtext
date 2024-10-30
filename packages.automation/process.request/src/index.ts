import type { RequestGateway, RequestHandler, RequestProcessor } from '$services/RequestProcessor.types';
import { StandardRequestProcessor } from '$services/StandardRequestProcessor';

export interface CreateRequestProcessorOptions {
  separator?: string;
  requestGateway: RequestGateway;
  requestHandlers: RequestHandler[];
}

export const createRequestProcessor = ({ separator = '===', requestGateway, requestHandlers }: CreateRequestProcessorOptions): RequestProcessor => {
  return new StandardRequestProcessor(separator, requestGateway, requestHandlers);
};
