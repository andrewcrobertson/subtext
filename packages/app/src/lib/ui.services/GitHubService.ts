import { join } from 'lodash-es';
import type { MyIdService } from './MyIdService';

export class GitHubService {
  public constructor(
    private readonly token: string,
    private readonly myIdService: MyIdService
  ) {}

  public async submitIssie(imdbId: string) {
    try {
      const myId = await this.myIdService.getId();
      const lines = [`:id: ${myId}`, ':robot: This issue is automated.', ":pray: Please don't edit this issue."];
      const issueData = { title: imdbId, body: join(lines, '\n'), labels: ['add'] };

      const response = await fetch('https://api.github.com/repos/andrewcrobertson/subtext/issues', {
        method: 'POST',
        headers: { Authorization: `token ${this.token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
        body: JSON.stringify(issueData),
      });
    } catch {}

    return false;
  }
}
