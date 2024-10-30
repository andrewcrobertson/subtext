export interface RequestGateway {
  getRequest: (requestId: string) => Promise<string | null>;
  closeRequest: (requestId: string, message: string) => Promise<string>;
}

export interface RequestHandler {
  type: string;
  handleRequest: (requestId: string, data: Record<string, any>) => Promise<string>;
}

export interface RequestProcessor {
  process: (requestId: string) => Promise<void>;
}
