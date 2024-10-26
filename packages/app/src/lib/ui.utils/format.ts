export const formatIsoDate = (isoString: string | null, dflt = ''): string =>
  isoString === null ? dflt : new Date(isoString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

export const formatText = (text: string | null, dflt = ''): string => (text === null ? dflt : text);

export const formatTextArray = (text: string[], dflt = ''): string => (text.length === 0 ? dflt : text.join(', '));

export const formatRunTime = (runTime: number, dflt = ''): string => (runTime === null ? dflt : `${runTime} mins`);
