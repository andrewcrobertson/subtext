import { parse } from 'yaml';

export const parseRequestText = (requestText: string, separator: string): Record<string, any> => {
  const separatorIndex = requestText.indexOf(separator);
  if (separatorIndex === -1) throw new Error(`No separator found`);

  const yamlContent = requestText.slice(separatorIndex + 3).trim();
  try {
    const data = parse(yamlContent) as Record<string, any>;
    return data;
  } catch (cause) {
    throw new Error(`Could not parse yaml`, { cause });
  }
};
