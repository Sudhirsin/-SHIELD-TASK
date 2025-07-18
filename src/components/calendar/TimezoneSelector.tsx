import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { TIMEZONES, getTimezoneOffset } from '../../lib/dateUtils';
import { cn } from '../../lib/utils';

interface TimezoneSelectorProps {
  selectedTimezone: string;
  onTimezoneChange: (timezone: string) => void;
  className?: string;
}

export const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({
  selectedTimezone,
  onTimezoneChange,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = TIMEZONES.find(tz => tz.value === selectedTimezone) || TIMEZONES[0];
  const currentOffset = getTimezoneOffset(selectedTimezone);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen(!isOpen);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full h-10 px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          "hover:border-gray-400 transition-colors",
          isOpen && "border-blue-500 ring-2 ring-blue-500"
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-900 truncate">
            {selectedOption.label.replace(/\(.*\)/, `(${currentOffset})`)}
          </span>
          <ChevronDown 
            className={cn(
              "w-4 h-4 text-gray-400 transition-transform",
              isOpen && "transform rotate-180"
            )} 
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          <ul role="listbox" className="py-1">
            {TIMEZONES.map((timezone) => {
              const offset = getTimezoneOffset(timezone.value);
              const isSelected = timezone.value === selectedTimezone;
              
              return (
                <li key={timezone.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onTimezoneChange(timezone.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100",
                      "focus:outline-none transition-colors",
                      isSelected && "bg-blue-50 text-blue-600"
                    )}
                    role="option"
                    aria-selected={isSelected}
                  >
                    {timezone.label.replace(/\(.*\)/, `(${offset})`)}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
