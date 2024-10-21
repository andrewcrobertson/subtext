export const formatMsAsTime = (ms: number) => {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);

  const hoursStr = hours.toString();
  const minutesStr = (minutes < 10 ? '0' : '') + minutes.toString();
  const secondsStr = (seconds < 10 ? '0' : '') + seconds.toString();

  return `${hoursStr}:${minutesStr}:${secondsStr}`;
};
