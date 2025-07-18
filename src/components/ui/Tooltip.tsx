import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  show?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  type?: 'info' | 'warning' | 'error' | 'success';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  show = false,
  position = 'top',
  type = 'info',
  className
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (show && containerRef.current && tooltipRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      let x = 0;
      let y = 0;

      switch (position) {
        case 'top':
          x = containerRect.left + (containerRect.width / 2) - (tooltipRect.width / 2);
          y = containerRect.top - tooltipRect.height - 8;
          break;
        case 'bottom':
          x = containerRect.left + (containerRect.width / 2) - (tooltipRect.width / 2);
          y = containerRect.bottom + 8;
          break;
        case 'left':
          x = containerRect.left - tooltipRect.width - 8;
          y = containerRect.top + (containerRect.height / 2) - (tooltipRect.height / 2);
          break;
        case 'right':
          x = containerRect.right + 8;
          y = containerRect.top + (containerRect.height / 2) - (tooltipRect.height / 2);
          break;
      }

      setTooltipPosition({ x, y });
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [show, position]);

  const getTooltipColors = () => {
    switch (type) {
      case 'error':
        return { bg: 'bg-red-600', arrow: 'bg-red-600' };
      case 'warning':
        return { bg: 'bg-yellow-600', arrow: 'bg-yellow-600' };
      case 'success':
        return { bg: 'bg-green-600', arrow: 'bg-green-600' };
      case 'info':
      default:
        return { bg: 'bg-blue-600', arrow: 'bg-blue-600' };
    }
  };

  const colors = getTooltipColors();

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      {children}

      {show && (
        <div
          ref={tooltipRef}
          className={cn(
            "fixed z-50 px-3 py-2 text-sm text-white rounded-md shadow-lg",
            "transition-opacity duration-200",
            "max-w-xs break-words",
            colors.bg,
            isVisible ? "opacity-100" : "opacity-0"
          )}
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
          }}
          role="tooltip"
        >
          {content}

          {/* Arrow */}
          <div
            className={cn(
              "absolute w-2 h-2 transform rotate-45",
              colors.arrow,
              position === 'top' && "bottom-[-4px] left-1/2 -translate-x-1/2",
              position === 'bottom' && "top-[-4px] left-1/2 -translate-x-1/2",
              position === 'left' && "right-[-4px] top-1/2 -translate-y-1/2",
              position === 'right' && "left-[-4px] top-1/2 -translate-y-1/2"
            )}
          />
        </div>
      )}
    </div>
  );
};
