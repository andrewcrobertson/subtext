import { chain, startsWith, trim } from 'lodash';

const titlePrefix = 'Add: ';

export class GithubApi {
  public constructor(
    private readonly url: string,
    private readonly token: string
  ) {}

  public async getOpenIssues(label: string) {
    const issuesRaw = await this.get(`/issues?state=open&labels=${label}`);
    const issues = chain(issuesRaw)
      .filter((i) => startsWith(i.title, titlePrefix))
      .map((i) => ({ gitHubIssueNumber: i.number, imdbId: trim(i.title.substring(titlePrefix.length)) }))
      .value();

    return issues;
  }

  public async addComment(issueNumber: number, comment: string) {
    await this.post(`/issues/${issueNumber}/comments`, { body: comment });
  }

  public async close(issueNumber: number) {
    await this.patch(`/issues/${issueNumber}`, { state: 'closed' });
  }

  public async tagAsDuplicate(issueNumber: number) {
    await this.patch(`/issues/${issueNumber}`, { labels: ['duplicate'] });
  }

  private async get(urlPath: string) {
    const url = `${this.url}${urlPath}`;
    const headers = { Authorization: `token ${this.token}`, Accept: 'application/vnd.gitHub.v3+json' };
    const response = await fetch(url, { headers });
    const json = await response.json();
    return json;
  }

  private async patch(urlPath: string, body: any) {
    const url = `${this.url}${urlPath}`;
    const headers = { Authorization: `token ${this.token}`, Accept: 'application/vnd.gitHub.v3+json' };
    const response = await fetch(url, { method: 'PATCH', headers, body: JSON.stringify(body) });
    const json = await response.json();
    return json;
  }

  private async post(urlPath: string, body: any) {
    const url = `${this.url}${urlPath}`;
    const headers = { Authorization: `token ${this.token}`, Accept: 'application/vnd.gitHub.v3+json' };
    const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
    const json = await response.json();
    return json;
  }
}
