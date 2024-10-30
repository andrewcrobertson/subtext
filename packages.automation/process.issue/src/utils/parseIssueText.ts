import { parse } from 'yaml';
import { ParseIssueTextOutput, ParseOutputEnum } from './parseIssueText.types';

export const parseIssueText = (text: string): ParseIssueTextOutput => {
  const separatorIndex = text.indexOf('===');

  if (separatorIndex === -1) return { code: ParseOutputEnum.NoSeparatorFound };

  const yamlContent = text.slice(separatorIndex + 3).trim();

  try {
    const data = parse(yamlContent) as Record<string, any>;
    return { code: ParseOutputEnum.Successful, data };
  } catch (e) {
    return { code: ParseOutputEnum.CouldNotParseYaml };
  }
};
