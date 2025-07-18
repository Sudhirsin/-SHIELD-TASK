import React from 'react';
import { DateCell } from './DateCell';
import { getCalendarDays, WEEKDAYS } from '../../lib/dateUtils';
import type { CalendarDay, DateRange, DateMessage } from '../../types/calendar';
import { cn } from '../../lib/utils';

interface CalendarGridProps {
  currentMonth: Date;
  timezone: string;
  selectedRange: DateRange;
  restrictionDays: number;
  maxDays?: number;
  dateMessages?: DateMessage[];
  onDateClick: (date: Date) => void;
  onMaxDaysExceeded?: (date: Date, maxDays: number) => void;
  className?: string;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentMonth,
  timezone,
  selectedRange,
  restrictionDays,
  maxDays,
  dateMessages = [],
  onDateClick,
  onMaxDaysExceeded,
  className
}) => {
  const calendarDays = getCalendarDays(currentMonth, timezone);

  return (
    <div className={cn("", className)}>
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((weekday) => (
          <div
            key={weekday}
            className="h-8 flex items-center justify-center text-sm font-medium text-gray-600"
          >
            {weekday}
          </div>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <DateCell
            key={`${day.date.getTime()}-${index}`}
            day={day}
            selectedRange={selectedRange}
            restrictionDays={restrictionDays}
            maxDays={maxDays}
            dateMessages={dateMessages}
            onClick={onDateClick}
            onMaxDaysExceeded={onMaxDaysExceeded}
          />
        ))}
      </div>
    </div>
  );
};
