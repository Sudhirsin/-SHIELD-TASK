# Product Data Dashboard

A React-based dashboard application that fetches and displays product data from the DummyJSON API with advanced date filtering, search capabilities, and timezone support.

## 🎯 Key Features

### Core Functionality
- **Manual Data Fetching**: Click "Go" to fetch data (no automatic fetching)
- **Real API Integration**: Uses DummyJSON products API
- **Smart Date Handling**: Uses real product creation dates when available
- **Advanced Search**: Search across all columns or specific columns
- **Data Sorting**: Sort by any column (ascending/descending)

### Date Management
- **Interactive Calendar**: Date range selection with timezone support
- **Configurable Max Days**: User can set maximum range (1-90 days)
- **Smart Date Logic**: 
  - Select 2024 dates → Real product creation timestamps
  - Other dates → Simulated data within selected range

### Search & Filter
- **Global Search**: Search across all columns simultaneously
- **Column-Specific Search**: Target specific fields (Product Name, Date, Price, Status)
- **Real-Time Filtering**: Results update as you type

## 🛠 Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns with timezone support
- **API**: DummyJSON (https://dummyjson.com/products)

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/Sudhirsin/-SHIELD-TASK.git
cd -SHIELD-TASK

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:2222
```

## 📖 Usage Guide

### Basic Workflow
1. **Select Date Range**: Use calendar to choose start/end dates
2. **Configure Max Days**: Adjust maximum range (optional)
3. **Click "Go"**: Fetch product data from API
4. **Search & Filter**: Use search box to find specific products
5. **Sort Data**: Click column headers to sort results

### Date Selection Tips
- **Real Data**: Select dates from 2024 for actual product timestamps
- **Demo Data**: Select other dates for simulated data
- **Range Limits**: Configure 1-90 days based on needs

## 🏗 Architecture

### Project Structure
```
src/
├── components/
│   ├── calendar/     # Date picker components
│   ├── table/        # Data table with search/sort
│   └── ui/           # Reusable UI components
├── lib/              # Utility functions
├── services/         # API integration
├── types/            # TypeScript definitions
└── App.tsx           # Main application
```

### Key Components
- **DatePicker**: Advanced calendar with range selection
- **EnhancedDataTable**: Feature-rich table with search/sort
- **ApiStatus**: Shows API connection status
- **DateInfo**: Explains real vs simulated dates
- **MaxDaysInput**: Configurable range limits

## 🔧 API Integration

**Endpoint**: `https://dummyjson.com/products?limit=30`

**Data Mapping**:
- Product Name ← `title`
- Created Date ← `meta.createdAt` (real) or generated
- Price ← `price`
- Availability ← `availabilityStatus` mapped to status colors

**Status Mapping**:
- In Stock → Active (green)
- Low Stock → Pending (yellow)  
- Out of Stock → Inactive (red)

## 💡 Interview Highlights

This project demonstrates:

### Technical Skills
- **React Best Practices**: Hooks, TypeScript, component composition
- **API Integration**: Real HTTP calls with error handling
- **State Management**: Complex state with useCallback/useEffect
- **Date Handling**: Timezone-aware date logic
- **Search/Filter**: Advanced table functionality

### User Experience
- **Manual Control**: User-initiated data fetching
- **Clear Feedback**: Loading states, error handling
- **Professional UI**: Clean, responsive design
- **Data Transparency**: Clear indication of real vs simulated data

### Code Quality
- **TypeScript**: Full type safety
- **Clean Architecture**: Separation of concerns
- **Error Handling**: Graceful failure management
- **Professional Polish**: Comprehensive user guidance

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 UI/UX Features

- **Responsive Design**: Works on all screen sizes
- **Loading States**: Professional loading indicators
- **Empty States**: Helpful messages when no data
- **Error Handling**: User-friendly error messages
- **Visual Feedback**: Color-coded status indicators
- **Accessibility**: Proper ARIA labels and keyboard support

## 🔄 Development Workflow

The project follows conventional commit standards:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation updates
- `refactor:` - Code refactoring

## 📞 Contact

**Developer**: Sudhir  
**Email**: lion.sud.k@gmail.com  
**Repository**: https://github.com/Sudhirsin/-SHIELD-TASK

---

**Created for interview purposes** - Demonstrates modern React development with real API integration and professional UX patterns.
