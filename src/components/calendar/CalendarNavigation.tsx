import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMonthYearDisplay } from '../../lib/dateUtils';
import { cn } from '../../lib/utils';

interface CalendarNavigationProps {
  currentMonth: Date;
  timezone: string;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  className?: string;
}

export const CalendarNavigation: React.FC<CalendarNavigationProps> = ({
  currentMonth,
  timezone,
  onPreviousMonth,
  onNextMonth,
  className
}) => {
  const monthYearDisplay = getMonthYearDisplay(currentMonth, timezone);

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <button
        type="button"
        onClick={onPreviousMonth}
        className={cn(
          "w-8 h-8 flex items-center justify-center rounded-md",
          "hover:bg-gray-100 focus:bg-gray-100 focus:outline-none",
          "transition-colors"
        )}
        aria-label="Previous month"
      >
        <ChevronLeft className="w-4 h-4 text-gray-600" />
      </button>

      <h2 className="text-lg font-semibold text-gray-900">
        {monthYearDisplay}
      </h2>

      <button
        type="button"
        onClick={onNextMonth}
        className={cn(
          "w-8 h-8 flex items-center justify-center rounded-md",
          "hover:bg-gray-100 focus:bg-gray-100 focus:outline-none",
          "transition-colors"
        )}
        aria-label="Next month"
      >
        <ChevronRight className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
};
