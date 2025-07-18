export interface TableData {
  id: string;
  name: string;
  date: string;
  amount: number;
  status: 'active' | 'inactive' | 'pending' | 'completed';
}

export interface TableColumn {
  key: keyof TableData;
  label: string;
  sortable?: boolean;
  searchable?: boolean;
  render?: (value: any, row: TableData) => React.ReactNode;
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig {
  key: keyof TableData | null;
  direction: SortDirection;
}

export type SearchColumn = keyof TableData | 'all';

export interface TableProps {
  data: TableData[];
  columns: TableColumn[];
  searchPlaceholder?: string;
  className?: string;
}
