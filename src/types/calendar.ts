export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface CalendarDay {
  date: Date;
  zonedDate: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  dayNumber: string;
}

export interface CalendarState {
  selectedRange: DateRange;
  currentMonth: Date;
  timezone: string;
  restrictionDays: number;
  isRangeMode: boolean;
}

export interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
}

export interface DateMessage {
  date: string; // Format: 'YYYY-MM-DD'
  message: string;
  disabled?: boolean;
  type?: 'info' | 'warning' | 'error' | 'success';
}

export interface CalendarProps {
  onDateSelect?: (range: DateRange) => void;
  onCancel?: () => void;
  onConfirm?: (range: DateRange) => void;
  initialTimezone?: string;
  restrictionDays?: number;
  maxDays?: number;
  dateMessages?: DateMessage[];
  isRangeMode?: boolean;
  className?: string;
}
