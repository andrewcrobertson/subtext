import { join } from 'lodash-es';

export class GitHubService {
  public constructor(
    private readonly token: string,
    private readonly baseApi: string
  ) {}

  public async submitAddMovieRequestIssue(userId: string, imdbId: string) {
    try {
      const lines = [`:id: ${userId}`, ':robot: This issue is automated.', ":pray: Please don't edit this issue."];
      const issueData = { title: imdbId, body: join(lines, '\n'), labels: ['add'] };

      const url = `${this.baseApi}/issues`;
      const headers = { Authorization: `token ${this.token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' };
      const body = JSON.stringify(issueData);
      const response = await fetch(url, { method: 'POST', headers, body });

      return response.ok;
    } catch {}

    return false;
  }
}
