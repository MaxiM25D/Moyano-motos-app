export const addCalendarMonths = (value, months) => {
  const source = new Date(value);
  const targetMonthIndex = source.getUTCMonth() + Number(months);
  const targetYear = source.getUTCFullYear() + Math.floor(targetMonthIndex / 12);
  const targetMonth = ((targetMonthIndex % 12) + 12) % 12;
  const lastDayOfTargetMonth = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
  const result = new Date(source);

  result.setUTCFullYear(targetYear, targetMonth, Math.min(source.getUTCDate(), lastDayOfTargetMonth));
  return result;
};
