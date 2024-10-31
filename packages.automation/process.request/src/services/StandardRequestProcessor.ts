import { get, isNil } from 'lodash-es';
import { parseRequestText } from '../utils/parseRequestText';
import { RequestGateway, RequestHandler, RequestProcessor } from './RequestProcessor.types';

export class StandardRequestProcessor implements RequestProcessor {
  public constructor(
    private readonly separator: string,
    private readonly requestGateway: RequestGateway,
    private readonly requestHandlers: Record<string, RequestHandler>
  ) {}

  public async process(requestId: string) {
    const requestText = await this.requestGateway.getRequest(requestId);
    if (requestText === null) return;

    try {
      const data = parseRequestText(requestText, this.separator);
      await this.doProcess(requestId, data);
    } catch (cause) {
      throw new Error(`RequestProcessor: process '${requestId}' failed`, { cause });
    }
  }

  private async doProcess(requestId: string, data: Record<string, any>) {
    const type = get(data, 'type', null);
    if (type === null) throw new Error(`Could not find type on data`);

    const requestHandler = this.requestHandlers[type];
    if (isNil(requestHandler)) throw new Error(`Couldn't find handler for type '${type}'`);

    const message = await requestHandler.handleRequest(requestId, data);
    await this.requestGateway.closeRequest(requestId, message);
  }
}
