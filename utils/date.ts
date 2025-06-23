import { DateRange } from "@/types/DateRange";

export const now = new Date();
export const oneYearAgo = new Date();
oneYearAgo.setFullYear(now.getFullYear() - 1);
export const sixMonthsAgo = new Date();
sixMonthsAgo.setMonth(now.getMonth() - 6);
export const threeMonthsAgo = new Date();
threeMonthsAgo.setMonth(now.getMonth() - 3);
export const oneMonthAgo = new Date();
oneMonthAgo.setMonth(now.getMonth() - 1);
export const oneWeekAgo = new Date();
oneWeekAgo.setDate(now.getDate() - 7);

export const dateRangeValuesToString = (dateRange: {
  from: Date;
  to: Date;
}): string => {
  const params = new URLSearchParams();
  if (dateRange.from) {
    params.append("dateFrom", dateRange.from.toISOString());
  }
  if (dateRange.to) {
    params.append("dateTo", dateRange.to.toISOString());
  }
  return params.toString();
};

export const getRandomDate = (start: Date, end: Date) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};
export const oneDay = 24 * 60 * 60 * 1000;
export const countDaysBetweenTwoDates = (dateRange: DateRange) => {
  return Math.round(
    Math.abs((dateRange.to.valueOf() - dateRange.from.valueOf()) / oneDay)
  );
};
export const formatDate = (date: string | Date) => {
  if (!date) return "";
  const d = new Date(date);
  return d
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");
};
