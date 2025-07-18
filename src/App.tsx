import { useState, useEffect, useCallback } from 'react';
import { Database, Calendar as CalendarIcon } from 'lucide-react';
import { DatePicker } from './components/calendar/DatePicker';
import { EnhancedDataTable } from './components/table/EnhancedDataTable';
import { LoadingOverlay } from './components/ui/LoadingSpinner';
import { MaxDaysInput } from './components/ui/MaxDaysInput';
import { ApiStatus } from './components/ui/ApiStatus';
import { DateInfo } from './components/ui/DateInfo';
import { fetchTableData, getDefaultDateRange, formatDateForApi } from './services/api';
import type { DateRange, DateMessage } from './types/calendar';
import type { TableData, TableColumn } from './types/table';

function App() {
  // State management
  const [selectedRange, setSelectedRange] = useState<DateRange>({ start: null, end: null });
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(false);
  const [timezone] = useState('Europe/Moscow');
  const [maxDays, setMaxDays] = useState(10);
  const [lastFetchedRange, setLastFetchedRange] = useState<DateRange>({ start: null, end: null });

  // Date messages for calendar (can be configured for business rules)
  const dateMessages: DateMessage[] = [];

  // Data fetching function
  const fetchData = useCallback(async (dateRange: DateRange, tz: string) => {
    if (!dateRange.start || !dateRange.end) return;

    setLoading(true);
    try {
      const startFormatted = formatDateForApi(dateRange.start, tz);
      const endFormatted = formatDateForApi(dateRange.end, tz);

      const response = await fetchTableData({
        startDate: startFormatted,
        endDate: endFormatted,
        timezone: tz
      });

      setTableData(response.data);
      setLastFetchedRange(dateRange);
    } catch (error) {
      console.error('Error fetching data:', error);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize with default date range (past 7 days) but don't fetch data
  useEffect(() => {
    const defaultRange = getDefaultDateRange(timezone);
    const initialRange: DateRange = {
      start: defaultRange.start,
      end: defaultRange.end
    };

    setSelectedRange(initialRange);
    setLoading(false); // Set loading to false since we're not fetching initially
  }, []); // Only run on mount

  // Table column configuration
  const tableColumns: TableColumn[] = [
    {
      key: 'name',
      label: 'Product Name',
      sortable: true,
      searchable: true
    },
    {
      key: 'date',
      label: 'Created Date',
      sortable: true,
      searchable: true
    },
    {
      key: 'amount',
      label: 'Price ($)',
      sortable: true,
      searchable: true
    },
    {
      key: 'status',
      label: 'Availability',
      sortable: true,
      searchable: true
    }
  ];

  const handleDateSelect = (range: DateRange) => {
    setSelectedRange(range);
    console.log('Date selected:', range);
    // Data will be fetched only when user clicks "Go" button
  };

  const handleMaxDaysChange = (newMaxDays: number) => {
    setMaxDays(newMaxDays);
    console.log('Max days changed to:', newMaxDays);
  };

  // Manual data fetch triggered by "Go" button
  // This gives users control over when API calls are made
  const handleFetchData = useCallback(async () => {
    if (!selectedRange.start || !selectedRange.end) {
      console.warn('Please select a valid date range');
      return;
    }

    await fetchData(selectedRange, timezone);
    setLastFetchedRange(selectedRange);
  }, [selectedRange, timezone, fetchData]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Product Data Dashboard
          </h1>
          <p className="text-gray-600">
            Select a date range and click "Go" to fetch product data from DummyJSON API
          </p>
        </div>

        {/* Date Range Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Select Date Range
            </h2>
            <p className="text-gray-600 text-sm">
              Default: Past 7 days • Timezone: {timezone} • Max: {maxDays} days
            </p>
            <p className="text-gray-500 text-xs mt-1">
              💡 Tip: Select dates from 2024 to see real product creation dates (May-June 2024)
            </p>
          </div>

          {/* Max Days Configuration */}
          <div className="flex justify-center mb-4">
            <MaxDaysInput
              value={maxDays}
              onChange={handleMaxDaysChange}
              min={1}
              max={90}
            />
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-sm">
              <DatePicker
                selectedRange={selectedRange}
                onDateSelect={handleDateSelect}
                onConfirm={handleFetchData}
                initialTimezone={timezone}
                restrictionDays={365}
                maxDays={maxDays}
                dateMessages={dateMessages}
                isRangeMode={true}
              />
            </div>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Product Results
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {selectedRange.start && selectedRange.end ? (
                    `Showing products from ${selectedRange.start.toLocaleDateString()} to ${selectedRange.end.toLocaleDateString()}`
                  ) : (
                    'Select a date range to view products'
                  )}
                </p>
              </div>

              {loading && (
                <div className="flex items-center gap-2 text-blue-600 text-sm">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Fetching from API...
                </div>
              )}
            </div>
          </div>

          {/* API Status */}
          <div className="mb-4">
            <ApiStatus
              isLoading={loading}
              dataCount={tableData.length}
            />
          </div>

          {/* Date Information */}
          <div className="mb-6">
            <DateInfo
              dataCount={tableData.length}
              selectedRange={selectedRange}
            />
          </div>

          {loading ? (
            <LoadingOverlay message="Fetching data from DummyJSON API..." />
          ) : tableData.length === 0 && lastFetchedRange.start ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Database className="w-16 h-16 mx-auto mb-4" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Products Found
              </h3>
              <p className="text-gray-600 mb-4">
                No products found for the selected date range.
              </p>
              <p className="text-sm text-gray-500">
                Try selecting a different date range or check your internet connection.
              </p>
            </div>
          ) : tableData.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <CalendarIcon className="w-16 h-16 mx-auto mb-4" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Ready to Fetch Products
              </h3>
              <p className="text-gray-600 mb-4">
                Select a date range above and click "Go" to fetch product data.
              </p>
              <p className="text-sm text-gray-500">
                Product data will be fetched from DummyJSON API
              </p>
            </div>
          ) : (
            <EnhancedDataTable
              data={tableData}
              columns={tableColumns}
              searchPlaceholder="Search across all columns..."
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
