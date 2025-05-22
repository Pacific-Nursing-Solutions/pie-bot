import { useState } from 'react';
import { Link } from 'wouter';
import { Plus, Building2, Users, Calculator, Bot } from 'lucide-react';

interface Company {
  id: number;
  name: string;
  entityType: string;
  founded: string;
  valuation: number;
  authorizedShares: number;
  stakeholders: number;
}

const Portfolio = () => {
  const [companies] = useState<Company[]>([
    {
      id: 1,
      name: "TechStart Inc.",
      entityType: "Delaware C-Corp",
      founded: "2024",
      valuation: 5000000,
      authorizedShares: 10000000,
      stakeholders: 3
    },
    {
      id: 2,
      name: "AI Solutions LLC",
      entityType: "Wyoming LLC",
      founded: "2023",
      valuation: 2500000,
      authorizedShares: 0,
      stakeholders: 2
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Company Portfolio
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage your companies and their equity structures
              </p>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Plus className="w-4 h-4 mr-2" />
              Add Company
            </button>
          </div>
        </div>
      </div>

      {/* Company Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div
              key={company.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Building2 className="w-8 h-8 text-blue-600 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {company.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {company.entityType}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Founded:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{company.founded}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Valuation:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      ${company.valuation.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Stakeholders:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {company.stakeholders}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Link href={`/company/${company.id}/pie-bot`}>
                    <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors">
                      <Bot className="w-4 h-4 mr-2" />
                      Pie Bot (Equity Management)
                    </button>
                  </Link>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Link href={`/company/${company.id}/dashboard`}>
                      <button className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                        <Calculator className="w-4 h-4 mr-1" />
                        Dashboard
                      </button>
                    </Link>
                    
                    <Link href={`/company/${company.id}/stakeholders`}>
                      <button className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                        <Users className="w-4 h-4 mr-1" />
                        Team
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {companies.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No companies</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating your first company.
            </p>
            <div className="mt-6">
              <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Company
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;