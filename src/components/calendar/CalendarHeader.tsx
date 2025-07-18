import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { TimezoneSelector } from './TimezoneSelector';
import { formatDateRange } from '../../lib/dateUtils';
import type { DateRange } from '../../types/calendar';
import { cn } from '../../lib/utils';

interface CalendarHeaderProps {
  selectedRange: DateRange;
  timezone: string;
  onTimezoneChange: (timezone: string) => void;
  className?: string;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  selectedRange,
  timezone,
  onTimezoneChange,
  className
}) => {
  const displayText = formatDateRange(selectedRange, timezone) || 'Select date range';

  return (
    <div className={cn("space-y-3", className)}>
      {/* Timezone Selector */}
      <TimezoneSelector
        selectedTimezone={timezone}
        onTimezoneChange={onTimezoneChange}
      />
      
      {/* Selected Date Display */}
      <div className="relative">
        <div className={cn(
          "w-full h-10 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md",
          "flex items-center justify-between",
          "text-sm text-gray-700"
        )}>
          <span className="truncate">
            {displayText}
          </span>
          <CalendarIcon className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
        </div>
      </div>
    </div>
  );
};
