import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';
import type { TableData, TableColumn, SortConfig } from '../../types/table';
import { cn } from '../../lib/utils';

type SearchColumn = keyof TableData | 'all';

interface EnhancedDataTableProps {
  data: TableData[];
  columns: TableColumn[];
  searchPlaceholder?: string;
  className?: string;
}

export const EnhancedDataTable: React.FC<EnhancedDataTableProps> = ({
  data,
  columns,
  searchPlaceholder = 'Search across all columns...',
  className
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchColumn, setSearchColumn] = useState<SearchColumn>('all');

  // Get searchable columns
  const searchableColumns = useMemo(() => 
    columns.filter(col => col.searchable !== false), 
    [columns]
  );

  // Enhanced sorting with better date and string handling
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      // Special handling for dates
      if (sortConfig.key === 'date') {
        const aDate = new Date(aValue as string);
        const bDate = new Date(bValue as string);
        if (sortConfig.direction === 'asc') {
          return aDate.getTime() - bDate.getTime();
        } else {
          return bDate.getTime() - aDate.getTime();
        }
      }

      // Special handling for names (case-insensitive)
      if (sortConfig.key === 'name') {
        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();
        if (sortConfig.direction === 'asc') {
          return aStr.localeCompare(bStr);
        } else {
          return bStr.localeCompare(aStr);
        }
      }

      // Default sorting for other fields
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  // Enhanced search across all columns
  const filteredData = useMemo(() => {
    if (!searchTerm) {
      return sortedData;
    }

    return sortedData.filter(row => {
      // If a specific column is selected, search only in that column
      if (searchColumn && searchColumn !== 'all') {
        const value = row[searchColumn];
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      }
      
      // Search across all columns
      return Object.values(row).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [sortedData, searchTerm, searchColumn]);

  const handleSort = (key: keyof TableData) => {
    const column = columns.find(col => col.key === key);
    if (!column?.sortable) return;

    setSortConfig(prevConfig => {
      if (prevConfig.key === key) {
        // Cycle through: asc -> desc -> null
        if (prevConfig.direction === 'asc') {
          return { key, direction: 'desc' };
        } else if (prevConfig.direction === 'desc') {
          return { key: null, direction: null };
        }
      }
      return { key, direction: 'asc' };
    });
  };

  const getSortIcon = (key: keyof TableData) => {
    if (sortConfig.key !== key) {
      return <div className="w-4 h-4" />; // Placeholder for alignment
    }

    if (sortConfig.direction === 'asc') {
      return <ChevronUp className="w-4 h-4 text-blue-600" />;
    } else if (sortConfig.direction === 'desc') {
      return <ChevronDown className="w-4 h-4 text-blue-600" />;
    }

    return <div className="w-4 h-4" />;
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200'
    };

    return (
      <span className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        statusStyles[status as keyof typeof statusStyles] || statusStyles.inactive
      )}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderCellValue = (column: TableColumn, value: any, row: TableData) => {
    if (column.render) {
      return column.render(value, row);
    }

    switch (column.key) {
      case 'status':
        return getStatusBadge(value);
      case 'amount':
        return formatCurrency(value);
      case 'date':
        return formatDate(value);
      default:
        return value;
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Enhanced Search Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={searchColumn === 'all' ? 'Search across all columns...' : searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="sm:w-56">
          <select
            value={searchColumn}
            onChange={(e) => setSearchColumn(e.target.value as SearchColumn)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">🔍 Search All Columns</option>
            {searchableColumns.map(column => (
              <option key={column.key} value={column.key}>
                Search by {column.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                      column.sortable !== false && "cursor-pointer hover:bg-gray-100 select-none transition-colors"
                    )}
                    onClick={() => column.sortable !== false && handleSort(column.key)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{column.label}</span>
                      {column.sortable !== false && (
                        <div className="ml-2">
                          {getSortIcon(column.key)}
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? (
                      <div>
                        <p>No results found for "{searchTerm}"</p>
                        <p className="text-sm mt-1">
                          {searchColumn === 'all' ? 'Try a different search term' : `Try searching in a different column`}
                        </p>
                      </div>
                    ) : (
                      'No data available'
                    )}
                  </td>
                </tr>
              ) : (
                filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {renderCellValue(column, row[column.key], row)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Results Summary */}
      {filteredData.length > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm text-gray-600">
          <div>
            Showing <span className="font-medium">{filteredData.length}</span> of{' '}
            <span className="font-medium">{data.length}</span> results
          </div>
          {searchTerm && (
            <div className="text-blue-600">
              🔍 Searching for "{searchTerm}" 
              {searchColumn !== 'all' && ` in ${searchableColumns.find(col => col.key === searchColumn)?.label}`}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
