import { join } from 'lodash-es';
import type { MyIdService } from './MyIdService';

export class GitHubService {
  public constructor(
    private readonly token: string,
    private readonly myIdService: MyIdService
  ) {}

  public async submitIssue(imdbIdOrUrl: string) {
    try {
      const imdbId = this.parseImdbIdOrUrl(imdbIdOrUrl) ?? 'Unknown';
      const myId = await this.myIdService.getId();
      const lines = [`:id: ${myId}`, ':robot: This issue is automated.', ":pray: Please don't edit this issue."];
      const issueData = { title: imdbId, body: join(lines, '\n'), labels: ['add'] };

      const response = await fetch('https://api.github.com/repos/andrewcrobertson/subtext/issues', {
        method: 'POST',
        headers: { Authorization: `token ${this.token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
        body: JSON.stringify(issueData),
      });

      return response.ok;
    } catch {}

    return false;
  }

  private parseImdbIdOrUrl(value: string) {
    const match = value.match(/tt\d{7,8}/);
    return match ? match[0] : null;
  }
}
