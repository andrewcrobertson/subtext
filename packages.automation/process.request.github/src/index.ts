import type { RequestGateway } from '@get-subtext/automation.process.request';
import { GitHubRequestGateway } from './services/GitHubRequestGateway';

export interface CreateRequestGatewayOptions {
  apiUrlBase: string;
  token: string;
  label: string;
}

export const createRequestGateway = ({ apiUrlBase, token, label }: CreateRequestGatewayOptions): RequestGateway => {
  return new GitHubRequestGateway(apiUrlBase, token, label);
};
