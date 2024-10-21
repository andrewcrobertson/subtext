export const parseTime = (hours: string, minutes: string, seconds: string, milliseconds: string) => {
  return parseInt(hours) * 60 * 60 * 1000 + parseInt(minutes) * 60 * 1000 + parseInt(seconds) * 1000 + parseInt(milliseconds);
};
