import { parse } from 'yaml';

export const parseIssueText = (text: string): Record<string, any> | null => {
  const separatorIndex = text.indexOf('===');

  if (separatorIndex === -1) return null;

  const yamlContent = text.slice(separatorIndex + 3).trim();

  try {
    const output = parse(yamlContent) as Record<string, any>;
    return output;
  } catch (e) {
    return null;
  }
};
