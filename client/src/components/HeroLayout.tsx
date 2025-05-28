import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import PersistentPieBot from "./PersistentPieBot";

interface HeroLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

export function CollapsibleSection({ 
  title, 
  children, 
  defaultExpanded = false,
  className = ""
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow mb-6 ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-t-lg"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {isExpanded ? 'Click to collapse' : 'Click to expand'}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </button>
      
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
}

export default function HeroLayout({ children, pageTitle }: HeroLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Page Header */}
      {pageTitle && (
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {pageTitle}
            </h1>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Pie Bot - Always Central */}
        <div className="mb-8">
          <PersistentPieBot defaultState="integrated" />
        </div>

        {/* Collapsible Content Around Pie Bot */}
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}