import { useState } from 'react';
import { Link, useRoute } from 'wouter';
import { ArrowLeft, Building2 } from 'lucide-react';
import SimplePieBot from '../components/SimplePieBot';

interface Company {
  id: number;
  name: string;
  entityType: string;
  founded: string;
  valuation: number;
}

const CompanyPieBot = () => {
  const [match, params] = useRoute('/company/:id/pie-bot');
  const companyId = params?.id;

  // In a real app, this would fetch from API based on companyId
  const [company] = useState<Company>({
    id: parseInt(companyId || '1'),
    name: "TechStart Inc.",
    entityType: "Delaware C-Corp",
    founded: "2024",
    valuation: 5000000
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with Company Context */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link href={`/company/${companyId}/dashboard`}>
                <button className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>
              <div className="flex items-center">
                <Building2 className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {company.name} - Pie Bot
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Equity Management & Dynamic Splits
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href={`/company/${companyId}/dashboard`}>
                <button className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                  Dashboard
                </button>
              </Link>
              <Link href="/portfolio">
                <button className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                  Portfolio
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Pie Bot Component */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <SimplePieBot />
      </div>
    </div>
  );
};

export default CompanyPieBot;