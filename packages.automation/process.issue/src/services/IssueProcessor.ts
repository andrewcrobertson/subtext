import { IssueGateway } from './IssueProcessor.types';

export class IssueProcessor implements IssueProcessor {
  public constructor(private readonly issueGateway: IssueGateway) {}

  public async processIssue(issueId: string) {
    const maybeIssueText = await this.issueGateway.getIssue(issueId);
    if (maybeIssueText === null) return;
  }
}
