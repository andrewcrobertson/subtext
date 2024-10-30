export class GitHubApi {
  public constructor(
    private readonly apiUrlBase: string,
    private readonly uiUrlBase: string,
    private readonly token: string
  ) {}

  public getIssueUrl(issueNumber: number) {
    return `${this.uiUrlBase}/issues/${issueNumber}`;
  }

  public async getIssue(number: number) {
    const issue: any = await this.get(`/issues/${number}`);
    return issue;
  }

  public async addComment(issueNumber: number, comment: string) {
    await this.post(`/issues/${issueNumber}/comments`, { body: comment });
  }

  public async close(issueNumber: number) {
    await this.patch(`/issues/${issueNumber}`, { state: 'closed' });
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
