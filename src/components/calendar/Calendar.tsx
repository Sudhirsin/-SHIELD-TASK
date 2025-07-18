import React, { useState, useCallback } from 'react';
import { CalendarHeader } from './CalendarHeader';
import { CalendarNavigation } from './CalendarNavigation';
import { CalendarGrid } from './CalendarGrid';
import { CalendarFooter } from './CalendarFooter';
import { Tooltip } from '../ui/Tooltip';
import { navigateMonth } from '../../lib/dateUtils';
import type { CalendarProps, DateRange } from '../../types/calendar';
import { cn } from '../../lib/utils';

export const Calendar: React.FC<CalendarProps> = ({
  onDateSelect,
  onCancel,
  onConfirm,
  initialTimezone = 'Europe/Moscow',
  restrictionDays = 90,
  maxDays = 10,
  dateMessages = [],
  isRangeMode = true,
  className
}) => {
  const [selectedRange, setSelectedRange] = useState<DateRange>({ start: null, end: null });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [timezone, setTimezone] = useState(initialTimezone);
  const [showMaxDaysTooltip, setShowMaxDaysTooltip] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState('');

  const handleDateClick = useCallback((date: Date) => {
    if (!isRangeMode) {
      // Single date selection
      const newRange = { start: date, end: date };
      setSelectedRange(newRange);
      onDateSelect?.(newRange);
      return;
    }

    // Range selection logic
    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      // Start new range
      const newRange = { start: date, end: null };
      setSelectedRange(newRange);
      onDateSelect?.(newRange);
    } else if (selectedRange.start && !selectedRange.end) {
      // Complete the range
      const start = selectedRange.start;
      const end = date;
      
      // Ensure start is before end
      const newRange = start <= end 
        ? { start, end } 
        : { start: end, end: start };
      
      setSelectedRange(newRange);
      onDateSelect?.(newRange);
    }
  }, [selectedRange, isRangeMode, onDateSelect]);

  const handlePreviousMonth = useCallback(() => {
    setCurrentMonth(prev => navigateMonth(prev, 'prev'));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth(prev => navigateMonth(prev, 'next'));
  }, []);

  const handleTimezoneChange = useCallback((newTimezone: string) => {
    setTimezone(newTimezone);
  }, []);

  const handleCancel = useCallback(() => {
    setSelectedRange({ start: null, end: null });
    onCancel?.();
  }, [onCancel]);

  const handleConfirm = useCallback(() => {
    onConfirm?.(selectedRange);
  }, [selectedRange, onConfirm]);

  const handleMaxDaysExceeded = useCallback((date: Date, maxDaysLimit: number) => {
    const message = `Maximum ${maxDaysLimit} days allowed. Please select a shorter range.`;
    setTooltipMessage(message);
    setShowMaxDaysTooltip(true);

    // Hide tooltip after 3 seconds
    setTimeout(() => {
      setShowMaxDaysTooltip(false);
    }, 3000);
  }, []);

  return (
    <div className={cn(
      "w-full max-w-md mx-auto bg-white border border-gray-200 rounded-xl shadow-lg p-4",
      "space-y-4",
      className
    )}>
      {/* Timezone selector */}
      <div className="border-b border-gray-200 pb-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Timezone
        </label>
        <select
          value={timezone}
          onChange={(e) => handleTimezoneChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="Asia/Calcutta">Asia/Calcutta (GMT+5:30)</option>
          <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
          <option value="Europe/Moscow">Europe/Moscow (GMT+3)</option>
          <option value="Europe/London">Europe/London (GMT+0)</option>
          <option value="America/New_York">America/New_York (GMT-5)</option>
          <option value="America/Los_Angeles">America/Los_Angeles (GMT-8)</option>
          <option value="Australia/Sydney">Australia/Sydney (GMT+10)</option>
        </select>
      </div>

      {/* Month navigation */}
      <CalendarNavigation
        currentMonth={currentMonth}
        timezone={timezone}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
      />

      {/* Calendar grid */}
      <Tooltip
        content={tooltipMessage}
        show={showMaxDaysTooltip}
        position="top"
      >
        <CalendarGrid
          currentMonth={currentMonth}
          timezone={timezone}
          selectedRange={selectedRange}
          restrictionDays={restrictionDays}
          maxDays={maxDays}
          dateMessages={dateMessages}
          onDateClick={handleDateClick}
          onMaxDaysExceeded={handleMaxDaysExceeded}
        />
      </Tooltip>

      {/* Footer with selected range and actions */}
      <CalendarFooter
        selectedRange={selectedRange}
        timezone={timezone}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </div>
  );
};
