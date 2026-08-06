const ARGENTINA_TIME_ZONE = "America/Argentina/Buenos_Aires";

export const getArgentinaDateParts = (value = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: ARGENTINA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(value);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day)
  };
};

export const getCurrentArgentinaMonthRange = (now = new Date()) => {
  const { year, month, day } = getArgentinaDateParts(now);

  return {
    from: new Date(Date.UTC(year, month - 1, 1)),
    to: new Date(Date.UTC(year, month, 1)),
    today: new Date(Date.UTC(year, month - 1, day))
  };
};
