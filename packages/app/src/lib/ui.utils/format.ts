export const formatIsoDate = (isoString: string | null, dflt = ''): string =>
  isoString === null ? dflt : new Date(isoString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
