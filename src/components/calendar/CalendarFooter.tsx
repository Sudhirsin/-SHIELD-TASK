import React from 'react';
import { formatDateInTimezone } from '../../lib/dateUtils';
import type { DateRange } from '../../types/calendar';
import { cn } from '../../lib/utils';

interface CalendarFooterProps {
  selectedRange: DateRange;
  timezone: string;
  onCancel: () => void;
  onConfirm: () => void;
  className?: string;
}

export const CalendarFooter: React.FC<CalendarFooterProps> = ({
  selectedRange,
  timezone,
  onCancel,
  onConfirm,
  className
}) => {
  const hasSelection = selectedRange.start || selectedRange.end;
  const hasCompleteRange = selectedRange.start && selectedRange.end;

  const formatSelectedRange = (): string => {
    if (!selectedRange.start) return '';
    
    const startFormatted = formatDateInTimezone(selectedRange.start, timezone, 'dd MMM yyyy');
    
    if (!selectedRange.end) {
      return startFormatted;
    }
    
    const endFormatted = formatDateInTimezone(selectedRange.end, timezone, 'dd MMM yyyy');
    return `${startFormatted} - ${endFormatted}`;
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Selected Range Display */}
      {hasSelection && (
        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-center">
          <span className="text-sm text-gray-700">
            {formatSelectedRange()}
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className={cn(
            "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300",
            "rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500",
            "transition-colors"
          )}
        >
          Cancel
        </button>
        
        <button
          type="button"
          onClick={onConfirm}
          disabled={!hasCompleteRange}
          className={cn(
            "px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent",
            "rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
            "transition-colors",
            !hasCompleteRange && "opacity-50 cursor-not-allowed hover:bg-blue-600"
          )}
        >
          Go
        </button>
      </div>
    </div>
  );
};
