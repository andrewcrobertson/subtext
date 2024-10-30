import { parseRequestText } from '$utils/parseRequestText';
import { get } from 'lodash-es';
import { RequestGateway, RequestHandler, RequestProcessor } from './RequestProcessor.types';

export class StandardRequestProcessor implements RequestProcessor {
  public constructor(
    private readonly separator: string,
    private readonly requestGateway: RequestGateway,
    private readonly requestHandlers: RequestHandler[]
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

    for (let i = 0; i < this.requestHandlers.length; i++) {
      if (this.requestHandlers[i].type === type) {
        const message = await this.requestHandlers[i].handleRequest(requestId, data);
        this.requestGateway.closeRequest(requestId, message);
        return message;
      }
    }

    throw new Error(`Invalid type '${type}' on data`);
  }
}
