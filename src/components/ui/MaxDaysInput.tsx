import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MaxDaysInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export const MaxDaysInput: React.FC<MaxDaysInputProps> = ({
  value,
  onChange,
  min = 1,
  max = 90,
  className
}) => {
  const [inputValue, setInputValue] = useState(value.toString());
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Validate input
    const numValue = parseInt(newValue, 10);
    const valid = !isNaN(numValue) && numValue >= min && numValue <= max;
    setIsValid(valid);

    // Only call onChange if valid
    if (valid) {
      onChange(numValue);
    }
  };

  const handleBlur = () => {
    // Reset to last valid value if input is invalid
    if (!isValid) {
      setInputValue(value.toString());
      setIsValid(true);
    }
  };

  const handleKeyDown = (e: React.KeyEvent<HTMLInputElement>) => {
    // Allow only numbers, backspace, delete, arrow keys
    if (
      !/[0-9]/.test(e.key) &&
      !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Settings className="w-4 h-4" />
        <label htmlFor="max-days-input" className="font-medium">
          Max Days:
        </label>
      </div>
      
      <div className="relative">
        <input
          id="max-days-input"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-16 px-2 py-1 text-sm text-center border rounded-md",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            "transition-colors",
            isValid 
              ? "border-gray-300 bg-white" 
              : "border-red-300 bg-red-50 text-red-900"
          )}
          placeholder="10"
          title={`Enter a number between ${min} and ${max}`}
        />
        
        {!isValid && (
          <div className="absolute top-full left-0 mt-1 text-xs text-red-600 whitespace-nowrap">
            Must be {min}-{max}
          </div>
        )}
      </div>
      
      <div className="text-xs text-gray-500">
        ({min}-{max})
      </div>
    </div>
  );
};
