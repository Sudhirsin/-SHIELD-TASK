import type { TableData } from '../types/table';

// DummyJSON API interfaces

interface DummyJSONProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  tags: string[];
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Array<{
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }>;
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
}

interface DummyJSONResponse {
  products: DummyJSONProduct[];
  total: number;
  skip: number;
  limit: number;
}

// Function to generate random date within range
const generateRandomDateInRange = (startDate: Date, endDate: Date): string => {
  const start = startDate.getTime();
  const end = endDate.getTime();
  const randomTime = start + Math.random() * (end - start);
  return new Date(randomTime).toISOString().split('T')[0]; // YYYY-MM-DD format
};

export interface ApiRequest {
  startDate: string; // Format: 2024-12-15 00:00:00 +0300
  endDate: string;   // Format: 2024-12-15 23:59:59 +0300
  timezone: string;
}

export interface ApiResponse {
  data: TableData[];
  total: number;
  dateRange: {
    start: string;
    end: string;
    timezone: string;
  };
}

// Utility function to format date with timezone for API
export const formatDateForApi = (date: Date, timezone: string): string => {
  // Get timezone offset in format +0300 or -0500
  const getTimezoneOffset = (tz: string): string => {
    const timezoneOffsets: Record<string, string> = {
      'Asia/Calcutta': '+0530',
      'Asia/Dubai': '+0400',
      'Europe/Moscow': '+0300',
      'Europe/London': '+0000',
      'America/New_York': '-0500',
      'America/Los_Angeles': '-0800',
      'Australia/Sydney': '+1000'
    };
    return timezoneOffsets[tz] || '+0000';
  };

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const offset = getTimezoneOffset(timezone);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${offset}`;
};

// Fetch products from DummyJSON API
// Using limit parameter to control response size for better performance
const fetchProducts = async (limit: number = 30): Promise<DummyJSONProduct[]> => {
  try {
    const response = await fetch(`https://dummyjson.com/products?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: DummyJSONResponse = await response.json();
    return data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Transform DummyJSON products to our table format
const transformProductsToTableData = (
  products: DummyJSONProduct[],
  startDate: Date,
  endDate: Date
): TableData[] => {
  const tableData: TableData[] = [];

  // Limit to reasonable number for better UX
  const limitedProducts = products.slice(0, 25);

  limitedProducts.forEach((product) => {
    // Use actual product creation date from meta.createdAt
    let productDate: Date;

    if (product.meta?.createdAt) {
      // Parse the ISO timestamp from DummyJSON
      productDate = new Date(product.meta.createdAt);
      console.log(`📅 Product "${product.title}" created at: ${product.meta.createdAt} (parsed: ${productDate.toLocaleDateString()})`);
    } else {
      // Fallback to random date if no creation date available
      productDate = new Date(generateRandomDateInRange(startDate, endDate));
      console.log(`📅 Product "${product.title}" using generated date: ${productDate.toLocaleDateString()}`);
    }

    // Check if product date falls within the selected date range
    const isInRange = productDate >= startDate && productDate <= endDate;
    console.log(`🔍 Product "${product.title}" date ${productDate.toLocaleDateString()} in range ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}? ${isInRange}`);

    if (isInRange) {
      tableData.push({
        id: product.id.toString(),
        name: product.title,
        date: productDate.toISOString().split('T')[0], // YYYY-MM-DD format
        amount: product.price,
        status: getStatusFromAvailability(product.availabilityStatus || (product.stock > 0 ? 'In Stock' : 'Low Stock'))
      });
    }
  });

  console.log(`✅ Filtered ${tableData.length} products within date range from ${limitedProducts.length} total products`);
  return tableData;
};

// Convert product availability to our status format
const getStatusFromAvailability = (availability: string): 'active' | 'inactive' | 'pending' | 'completed' => {
  switch (availability.toLowerCase()) {
    case 'in stock':
      return 'active';
    case 'low stock':
      return 'pending';
    case 'out of stock':
      return 'inactive';
    default:
      return 'completed';
  }
};

// Main API function with DummyJSON products
export const fetchTableData = async (request: ApiRequest): Promise<ApiResponse> => {
  console.log('🚀 API Request:', request);

  try {
    // Parse dates for filtering
    const startDate = new Date(request.startDate.split(' ')[0]);
    const endDate = new Date(request.endDate.split(' ')[0]);

    // Fetch products from DummyJSON API
    const products = await fetchProducts(30);

    console.log(`📊 Fetched ${products.length} products from DummyJSON`);

    // First, try to use actual product creation dates
    const transformedData = transformProductsToTableData(products, startDate, endDate);

    let finalData = transformedData;

    // If no products match the selected date range (likely because DummyJSON dates are from 2024
    // but user selected dates from 2025), create a mixed approach
    if (transformedData.length === 0) {
      console.log('📅 No products found with actual dates in selected range');
      console.log(`📅 Selected range: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`);
      console.log('📅 Creating products with simulated dates in selected range...');

      finalData = products.slice(0, 15).map((product) => {
        const simulatedDate = generateRandomDateInRange(startDate, endDate);
        console.log(`🔄 Product "${product.title}": Original date ${product.meta?.createdAt || 'N/A'} → Simulated date ${simulatedDate}`);

        return {
          id: product.id.toString(),
          name: product.title,
          date: simulatedDate,
          amount: product.price,
          status: getStatusFromAvailability(product.availabilityStatus || (product.stock > 0 ? 'In Stock' : 'Low Stock'))
        };
      });

      console.log(`✅ Generated ${finalData.length} products with simulated dates in range`);
    } else {
      console.log(`✅ Found ${finalData.length} products with actual dates in selected range`);
    }

    // Simulate additional network delay for realism
    await new Promise(resolve => setTimeout(resolve, 500));

    const usingSimulatedDates = transformedData.length === 0;

    const response: ApiResponse = {
      data: finalData,
      total: finalData.length,
      dateRange: {
        start: request.startDate,
        end: request.endDate,
        timezone: request.timezone
      }
    };

    // Add metadata about date handling
    if (usingSimulatedDates) {
      console.log('ℹ️  Note: Using simulated dates because DummyJSON product creation dates (2024) don\'t match selected range');
    } else {
      console.log('ℹ️  Note: Using actual product creation dates from DummyJSON API');
    }

    console.log('✅ API Response:', {
      ...response,
      data: `${response.data.length} records`
    });

    return response;

  } catch (error) {
    console.error('❌ API Error:', error);

    // Fallback response in case of API failure
    return {
      data: [],
      total: 0,
      dateRange: {
        start: request.startDate,
        end: request.endDate,
        timezone: request.timezone
      }
    };
  }
};

// Utility function to get default date range (past 7 days)
export const getDefaultDateRange = (timezone: string) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);

  // Set time to start and end of day
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  return {
    start: startDate,
    end: endDate,
    startFormatted: formatDateForApi(startDate, timezone),
    endFormatted: formatDateForApi(endDate, timezone)
  };
};
