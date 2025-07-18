import React, { useState } from 'react';
import {
  isDateDisabled,
  isDateInRange,
  isDateRangeStart,
  isDateRangeEnd,
  isRangeExceedsMaxDays,
  getMaxAllowedEndDate,
  getDateMessage,
  isDateCustomDisabled
} from '../../lib/dateUtils';
import { Tooltip } from '../ui/Tooltip';
import type { CalendarDay, DateRange, DateMessage } from '../../types/calendar';
import { cn } from '../../lib/utils';

interface DateCellProps {
  day: CalendarDay;
  selectedRange: DateRange;
  restrictionDays: number;
  maxDays?: number;
  dateMessages?: DateMessage[];
  onClick: (date: Date) => void;
  onMaxDaysExceeded?: (date: Date, maxDays: number) => void;
  className?: string;
}

export const DateCell: React.FC<DateCellProps> = ({
  day,
  selectedRange,
  restrictionDays,
  maxDays,
  dateMessages = [],
  onClick,
  onMaxDaysExceeded,
  className
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const isDisabled = isDateDisabled(day.date, restrictionDays);
  const isCustomDisabled = isDateCustomDisabled(day.date, dateMessages);
  const dateMessage = getDateMessage(day.date, dateMessages);
  const isInRange = isDateInRange(day.date, selectedRange);
  const isRangeStart = isDateRangeStart(day.date, selectedRange);
  const isRangeEnd = isDateRangeEnd(day.date, selectedRange);
  const isSelected = isRangeStart || isRangeEnd;

  // Check if selecting this date would exceed max days
  const wouldExceedMaxDays = selectedRange.start && !selectedRange.end && maxDays &&
    isRangeExceedsMaxDays(selectedRange.start, day.date, maxDays);

  // Check if this date is beyond the max allowed range
  const isBeyondMaxRange = selectedRange.start && !selectedRange.end && maxDays &&
    day.date > getMaxAllowedEndDate(selectedRange.start, maxDays);

  const handleClick = () => {
    if (isDisabled || isCustomDisabled) return;

    // If selecting this date would exceed max days, trigger the callback instead
    if (wouldExceedMaxDays && maxDays) {
      onMaxDaysExceeded?.(day.date, maxDays);
      return;
    }

    onClick(day.date);
  };

  const handleMouseEnter = () => {
    if (dateMessage?.message) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <Tooltip
      content={dateMessage?.message || ''}
      show={showTooltip && Boolean(dateMessage?.message)}
      type={dateMessage?.type || 'info'}
      position="top"
    >
      <button
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={isDisabled || isCustomDisabled || Boolean(isBeyondMaxRange)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "w-11 h-11 flex items-center justify-center text-sm font-medium rounded-md",
          "transition-all duration-150 ease-in-out",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",

          // Base styles
          day.isCurrentMonth
            ? "text-gray-900"
            : "text-gray-400",

          // Disabled state
          (isDisabled || isCustomDisabled || isBeyondMaxRange) && [
            "text-gray-300 cursor-not-allowed",
            "hover:bg-transparent"
          ],

          // Normal hover state (not disabled, not selected)
          !isDisabled && !isCustomDisabled && !isSelected && !isInRange && [
            "hover:bg-gray-100"
          ],

          // Today indicator (if not selected)
          day.isToday && !isSelected && [
            "ring-2 ring-blue-600 ring-inset"
          ],

          // Range states
          isInRange && !isSelected && [
            "bg-blue-100 text-blue-900"
          ],

          // Selected states
          isSelected && [
            "bg-blue-600 text-white hover:bg-blue-700"
          ],

          // Range start/end specific styling
          isRangeStart && selectedRange.end && !isRangeEnd && [
            "rounded-r-none"
          ],

          isRangeEnd && selectedRange.start && !isRangeStart && [
            "rounded-l-none"
          ],

          // Special styling for dates with messages
          dateMessage && !isSelected && [
            dateMessage.type === 'error' && "ring-1 ring-red-300",
            dateMessage.type === 'warning' && "ring-1 ring-yellow-300",
            dateMessage.type === 'success' && "ring-1 ring-green-300",
            dateMessage.type === 'info' && "ring-1 ring-blue-300"
          ],

          className
        )}
        aria-label={`${day.dayNumber}${day.isToday ? ' (today)' : ''}${isSelected ? ' (selected)' : ''}${dateMessage?.message ? ` - ${dateMessage.message}` : ''}`}
        aria-pressed={isSelected}
        tabIndex={day.isCurrentMonth ? 0 : -1}
      >
        {day.dayNumber}
      </button>
    </Tooltip>
  );
};
