export enum ParseOutputEnum {
  NoSeparatorFound = 'NoSeparatorFound',
  CouldNotParseYaml = 'CouldNotParseYaml',
  Successful = 'Successful',
}

export type ParseIssueTextOutput =
  | { code: ParseOutputEnum.NoSeparatorFound }
  | { code: ParseOutputEnum.CouldNotParseYaml }
  | { code: ParseOutputEnum.Successful; data: Record<string, any> };
