import React from 'react';
import { Info, Calendar, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DateInfoProps {
  dataCount: number;
  selectedRange: {
    start: Date | null;
    end: Date | null;
  };
  className?: string;
}

export const DateInfo: React.FC<DateInfoProps> = ({
  dataCount,
  selectedRange,
  className
}) => {
  if (!selectedRange.start || !selectedRange.end || dataCount === 0) {
    return null;
  }

  // Check if selected dates are in 2024 (when DummyJSON products were created)
  const selectedYear = selectedRange.start.getFullYear();
  const isUsingRealDates = selectedYear === 2024;

  return (
    <div className={cn(
      "flex items-start gap-3 p-3 rounded-lg border",
      isUsingRealDates 
        ? "bg-green-50 border-green-200" 
        : "bg-blue-50 border-blue-200",
      className
    )}>
      <div className="flex-shrink-0 mt-0.5">
        {isUsingRealDates ? (
          <Clock className="w-4 h-4 text-green-600" />
        ) : (
          <Calendar className="w-4 h-4 text-blue-600" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Info className="w-3 h-3 text-gray-500" />
          <span className={cn(
            "text-xs font-medium",
            isUsingRealDates ? "text-green-800" : "text-blue-800"
          )}>
            Date Information
          </span>
        </div>
        
        <p className={cn(
          "text-xs leading-relaxed",
          isUsingRealDates ? "text-green-700" : "text-blue-700"
        )}>
          {isUsingRealDates ? (
            <>
              <strong>Using real product creation dates</strong> from DummyJSON API.
              Products shown were actually created on May 23, 2024 and fall within your selected range.
            </>
          ) : (
            <>
              <strong>Using simulated dates</strong> because DummyJSON products were created on May 23, 2024,
              but you selected dates from {selectedYear}. Product data is real, but dates are generated
              to match your selected range.
            </>
          )}
        </p>
      </div>
    </div>
  );
};
