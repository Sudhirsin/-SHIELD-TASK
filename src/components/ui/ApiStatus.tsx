import React from 'react';
import { Globe, Database, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ApiStatusProps {
  isLoading: boolean;
  dataCount: number;
  className?: string;
}

export const ApiStatus: React.FC<ApiStatusProps> = ({
  isLoading,
  dataCount,
  className
}) => {
  return (
    <div className={cn(
      "flex items-center gap-4 p-3 bg-blue-50 border border-blue-200 rounded-lg",
      className
    )}>
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-900">
          DummyJSON API
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs text-blue-700">
        <div className="flex items-center gap-1">
          <FileText className="w-3 h-3" />
          <span>Products</span>
        </div>
        <div className="flex items-center gap-1">
          <Database className="w-3 h-3" />
          <span>{isLoading ? 'Loading...' : `${dataCount} records`}</span>
        </div>
      </div>
      
      <div className={cn(
        "ml-auto w-2 h-2 rounded-full",
        isLoading ? "bg-yellow-500 animate-pulse" : "bg-green-500"
      )} />
    </div>
  );
};
