import { join } from 'lodash-es';

export class GitHubService {
  public constructor(
    private readonly token: string,
    private readonly baseApi: string
  ) {}

  public async submitAddMovieRequestIssue(userId: string, imdbId: string) {
    try {
      const lines = [':robot: This issue is automated.', '', '===', '', 'type: REQUEST_MOVIE', `userId: ${userId}`, `imdbIdId: ${imdbId}`];

      const url = `${this.baseApi}/issues`;
      const headers = { Authorization: `token ${this.token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' };
      const body = { title: imdbId, body: join(lines, '\n'), labels: ['subtext-bot'] };
      const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });

      return response.ok;
    } catch {}

    return false;
  }
}
