import type { RequestHandler } from '@get-subtext/automation.process.request';

export class GetMovieRequestHandler implements RequestHandler {
  public constructor() {}

  public async handleRequest(requestId: string, data: Record<string, any>) {
    return ':clapper: **Test**';
  }
}
