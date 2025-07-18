import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  subDays,
  addDays,
  isAfter,
  isBefore
} from 'date-fns';
import { toZonedTime, format as formatTz } from 'date-fns-tz';
import type { DateRange, DateMessage } from '../types/calendar';

export const TIMEZONES = [
  { value: 'Asia/Calcutta', label: 'Asia/Calcutta (GMT+5:30)', offset: '+5:30' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai (GMT+4)', offset: '+4:00' },
  { value: 'Europe/Moscow', label: 'Europe/Moscow (GMT+3)', offset: '+3:00' },
  { value: 'Europe/London', label: 'Europe/London (GMT+0)', offset: '+0:00' },
  { value: 'America/New_York', label: 'America/New_York (GMT-5)', offset: '-5:00' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (GMT-8)', offset: '-8:00' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (GMT+10)', offset: '+10:00' },
];

export const getTimezoneOffset = (timezone: string): string => {
  const now = new Date();
  const zonedDate = toZonedTime(now, timezone);
  const offset = formatTz(zonedDate, 'xxx', { timeZone: timezone });
  return `GMT${offset}`;
};

export const formatDateInTimezone = (date: Date, timezone: string, formatStr: string = 'dd MMM yyyy'): string => {
  const zonedDate = toZonedTime(date, timezone);
  return formatTz(zonedDate, formatStr, { timeZone: timezone });
};

export const formatDateRange = (range: DateRange, timezone: string): string => {
  if (!range.start) return '';
  
  const startFormatted = formatDateInTimezone(range.start, timezone, 'dd MMM');
  const offset = getTimezoneOffset(timezone);
  
  if (!range.end) {
    return `${startFormatted} ${offset}`;
  }
  
  const endFormatted = formatDateInTimezone(range.end, timezone, 'dd MMM yyyy');
  return `${startFormatted} - ${endFormatted} ${offset}`;
};

export const getCalendarDays = (currentMonth: Date, timezone: string) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return days.map(day => {
    const zonedDay = toZonedTime(day, timezone);
    return {
      date: day,
      zonedDate: zonedDay,
      isCurrentMonth: isSameMonth(day, currentMonth),
      isToday: isToday(day),
      dayNumber: format(day, 'd'),
    };
  });
};

export const isDateDisabled = (date: Date, restrictionDays: number = 90): boolean => {
  const today = new Date();

  // Allow dates from 2024 onwards to see real DummyJSON product data
  const minAllowedDate = new Date('2024-01-01');

  // Allow dates up to 30 days in the future
  const maxAllowedDate = addDays(today, 30);

  return isBefore(date, minAllowedDate) || isAfter(date, maxAllowedDate);
};

export const isDateInRange = (date: Date, range: DateRange): boolean => {
  if (!range.start || !range.end) return false;
  return (isAfter(date, range.start) || isSameDay(date, range.start)) && 
         (isBefore(date, range.end) || isSameDay(date, range.end));
};

export const isDateRangeStart = (date: Date, range: DateRange): boolean => {
  return range.start ? isSameDay(date, range.start) : false;
};

export const isDateRangeEnd = (date: Date, range: DateRange): boolean => {
  return range.end ? isSameDay(date, range.end) : false;
};

export const navigateMonth = (currentMonth: Date, direction: 'prev' | 'next'): Date => {
  return direction === 'prev' ? subMonths(currentMonth, 1) : addMonths(currentMonth, 1);
};

export const getMonthYearDisplay = (date: Date, timezone: string): string => {
  return formatDateInTimezone(date, timezone, 'MMM yyyy');
};

export const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const getDaysDifference = (startDate: Date, endDate: Date): number => {
  const timeDifference = endDate.getTime() - startDate.getTime();
  return Math.ceil(timeDifference / (1000 * 3600 * 24)) + 1; // +1 to include both start and end dates
};

export const isRangeExceedsMaxDays = (startDate: Date, endDate: Date, maxDays: number): boolean => {
  const daysDifference = getDaysDifference(startDate, endDate);
  return daysDifference > maxDays;
};

export const getMaxAllowedEndDate = (startDate: Date, maxDays: number): Date => {
  const maxEndDate = new Date(startDate);
  maxEndDate.setDate(startDate.getDate() + maxDays - 1); // -1 because we include the start date
  return maxEndDate;
};

export const formatDateToString = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const getDateMessage = (date: Date, dateMessages: DateMessage[]): DateMessage | null => {
  const dateString = formatDateToString(date);
  return dateMessages.find(msg => msg.date === dateString) || null;
};

export const isDateCustomDisabled = (date: Date, dateMessages: DateMessage[]): boolean => {
  const message = getDateMessage(date, dateMessages);
  return message?.disabled === true;
};
