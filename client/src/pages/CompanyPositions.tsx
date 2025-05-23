import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Building2, TrendingUp, Users, Plus, Search } from 'lucide-react';

interface CompanyPosition {
  id: number;
  name: string;
  entityType: string;
  userEquityPercentage: number;
  userDebtPosition: number;
  marketCap: number;
  userEquityValue: number;
  stockClasses: Array<{
    class: string;
    shares: number;
    percentage: number;
    value: number;
  }>;
  lastValuation: {
    amount: number;
    date: string;
  };
  status: 'Active' | 'Exited' | 'Failed';
  industry: string;
}

const CompanyPositions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [companyPositions] = useState<CompanyPosition[]>([
    {
      id: 1,
      name: "TechStart Inc.",
      entityType: "Delaware C-Corp",
      userEquityPercentage: 15.5,
      userDebtPosition: 50000,
      marketCap: 8000000,
      userEquityValue: 1240000,
      stockClasses: [
        { class: "Common", shares: 150000, percentage: 12.5, value: 900000 },
        { class: "Preferred Series A", shares: 25000, percentage: 3.0, value: 340000 }
      ],
      lastValuation: { amount: 8000000, date: "2024-01-15" },
      status: 'Active',
      industry: 'Technology'
    },
    {
      id: 2,
      name: "AI Solutions LLC",
      entityType: "Wyoming LLC",
      userEquityPercentage: 25.0,
      userDebtPosition: 0,
      marketCap: 3500000,
      userEquityValue: 875000,
      stockClasses: [
        { class: "Membership Units", shares: 2500, percentage: 25.0, value: 875000 }
      ],
      lastValuation: { amount: 3500000, date: "2024-02-20" },
      status: 'Active',
      industry: 'Artificial Intelligence'
    },
    {
      id: 3,
      name: "FinTech Startup",
      entityType: "Delaware C-Corp",
      userEquityPercentage: 8.2,
      userDebtPosition: 25000,
      marketCap: 12000000,
      userEquityValue: 984000,
      stockClasses: [
        { class: "Common", shares: 82000, percentage: 6.2, value: 744000 },
        { class: "Preferred Series B", shares: 12000, percentage: 2.0, value: 240000 }
      ],
      lastValuation: { amount: 12000000, date: "2024-03-10" },
      status: 'Active',
      industry: 'Financial Technology'
    }
  ]);

  const filteredCompanies = companyPositions.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValue = companyPositions.reduce((sum, company) => sum + company.userEquityValue + company.userDebtPosition, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link href="/">
                <button className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Company Positions
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Detailed view of your equity positions across all companies
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Position
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Building2 className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Companies</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {companyPositions.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Position Value</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  ${totalValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Positions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {companyPositions.filter(c => c.status === 'Active').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search companies by name or industry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Company Positions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCompanies.map((company) => (
            <div key={company.id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {company.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {company.entityType} • {company.industry}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {company.userEquityPercentage}%
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ${company.userEquityValue.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Market Cap:</span>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      ${company.marketCap.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Last Valuation:</span>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      ${company.lastValuation.amount.toLocaleString()}
                    </p>
                  </div>
                  {company.userDebtPosition > 0 && (
                    <div className="col-span-2">
                      <span className="text-gray-500 dark:text-gray-400">Debt Position:</span>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        ${company.userDebtPosition.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Stock Classes</p>
                  <div className="space-y-2">
                    {company.stockClasses.map((stockClass, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700 dark:text-gray-300">
                          {stockClass.class}: {stockClass.shares.toLocaleString()} shares
                        </span>
                        <span className="font-medium">
                          {stockClass.percentage}% (${stockClass.value.toLocaleString()})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Link href={`/company/${company.id}/dashboard`} className="flex-1">
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">
                      View Details
                    </button>
                  </Link>
                  <Link href={`/company/${company.id}/pie-bot`}>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium">
                      🥧 Pie Bot
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No companies found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search terms or add a new position.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyPositions;