export const getThreeMonthsAgo = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 3);
  return date;
};
