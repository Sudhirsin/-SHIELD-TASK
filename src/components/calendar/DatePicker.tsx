import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from './Calendar';
import { formatDateRange, getTimezoneOffset } from '../../lib/dateUtils';
import type { DateRange, CalendarProps } from '../../types/calendar';
import { cn } from '../../lib/utils';

interface DatePickerProps extends Omit<CalendarProps, 'onCancel'> {
  selectedRange: DateRange;
  onConfirm?: () => void;
  placeholder?: string;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  selectedRange,
  onDateSelect,
  onConfirm,
  initialTimezone = 'Europe/Moscow',
  restrictionDays = 90,
  maxDays = 10,
  dateMessages = [],
  isRangeMode = true,
  placeholder = 'Select date range',
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [timezone, setTimezone] = useState(initialTimezone);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLButtonElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close popup on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const handleInputClick = () => {
    setIsOpen(!isOpen);
  };

  const handleDateSelectInternal = (range: DateRange) => {
    onDateSelect?.(range);
  };

  const handleConfirm = (range: DateRange) => {
    onDateSelect?.(range);
    setIsOpen(false);
    // Trigger data fetch when user clicks "Go"
    onConfirm?.();
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const getDisplayText = (): string => {
    if (!selectedRange.start && !selectedRange.end) {
      return placeholder;
    }
    
    const formattedRange = formatDateRange(selectedRange, timezone);
    return formattedRange || placeholder;
  };

  const hasSelection = selectedRange.start || selectedRange.end;

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      {/* Input Field */}
      <button
        ref={inputRef}
        type="button"
        onClick={handleInputClick}
        className={cn(
          "w-full h-12 px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          "hover:border-gray-400 transition-colors",
          "flex items-center justify-between",
          isOpen && "border-blue-500 ring-2 ring-blue-500"
        )}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label="Open date picker"
      >
        <span className={cn(
          "text-sm truncate",
          hasSelection ? "text-gray-900" : "text-gray-500"
        )}>
          {getDisplayText()}
        </span>
        <CalendarIcon className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
      </button>

      {/* Calendar Popup */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40 bg-black bg-opacity-25 sm:bg-transparent" />
          
          {/* Calendar Container */}
          <div className={cn(
            "absolute z-50 mt-2",
            "left-0 right-0 sm:left-auto sm:right-auto sm:w-auto",
            "max-h-[calc(100vh-100px)] overflow-auto"
          )}>
            <Calendar
              onDateSelect={handleDateSelectInternal}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
              initialTimezone={timezone}
              restrictionDays={restrictionDays}
              maxDays={maxDays}
              dateMessages={dateMessages}
              isRangeMode={isRangeMode}
              className="shadow-xl border-2 border-gray-200"
            />
          </div>
        </>
      )}
    </div>
  );
};
