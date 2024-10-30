export interface IssueGateway {
  getIssue: (issueId: string) => Promise<string | null>;
  closeIssue: (issueId: string, message: string) => Promise<string>;
}

export interface IssueProcessor {
  processIssue: (issueId: string) => Promise<string>;
}
