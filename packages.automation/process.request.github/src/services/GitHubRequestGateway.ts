import type { RequestGateway } from '@get-subtext/automation.process.request';
import { find, isEmpty } from 'lodash-es';
import { GetIssueResponse } from './GitHubRequestGateway.types';

export class GitHubRequestGateway implements RequestGateway {
  public constructor(
    private readonly apiUrlBase: string,
    private readonly token: string,
    private readonly label: string
  ) {}

  public async getRequest(requestId: string) {
    const number = requestId;
    const issue: GetIssueResponse = await this.get(`/issues/${number}`);
    const label = find(issue.labels, (l) => l.name === this.label);

    return isEmpty(label) ? null : issue.body;
  }

  public async closeRequest(requestId: string, message: string) {
    const number = requestId;
    await this.addComment(requestId, message);
    await this.patch(`/issues/${number}`, { state: 'closed' });
  }

  private async addComment(requestId: string, comment: string) {
    const number = requestId;
    await this.post(`/issues/${number}/comments`, { body: comment });
  }

  private async get(urlPath: string) {
    const url = `${this.apiUrlBase}${urlPath}`;
    const headers = this.getHeaders();
    const response = await fetch(url, { headers });
    const json = await response.json();
    return json;
  }

  private async patch(urlPath: string, body: any) {
    const url = `${this.apiUrlBase}${urlPath}`;
    const headers = this.getHeaders();
    const response = await fetch(url, { method: 'PATCH', headers, body: JSON.stringify(body) });
    const json = await response.json();
    return json;
  }

  private async post(urlPath: string, body: any) {
    const url = `${this.apiUrlBase}${urlPath}`;
    const headers = this.getHeaders();
    const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
    const json = await response.json();
    return json;
  }

  private getHeaders() {
    const headers = { Authorization: `token ${this.token}`, Accept: 'application/vnd.github.v3+json' };
    return headers;
  }
}
