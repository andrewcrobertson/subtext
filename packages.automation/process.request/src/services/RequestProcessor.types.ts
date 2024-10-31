export interface RequestGateway {
  getRequest: (requestId: string) => Promise<string | null>;
  closeRequest: (requestId: string, message: string) => Promise<void>;
}

export interface RequestHandler {
  handleRequest: (requestId: string, data: Record<string, any>) => Promise<string>;
}

export interface RequestProcessor {
  process: (requestId: string) => Promise<void>;
}
