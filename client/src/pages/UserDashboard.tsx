import { useState } from 'react';
import { Link } from 'wouter';
import { TrendingUp, Building2, Users, FileText, DollarSign, Percent, ChevronRight, Plus } from 'lucide-react';
import SimplePieBot from '../components/SimplePieBot';

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
}

interface PoolPosition {
  id: number;
  name: string;
  type: 'Angel' | 'VC' | 'Syndicate';
  totalCommitted: number;
  deployed: number;
  returns: number;
  companies: number;
}

const UserDashboard = () => {
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
      lastValuation: { amount: 8000000, date: "2024-01-15" }
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
      lastValuation: { amount: 3500000, date: "2024-02-20" }
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
      lastValuation: { amount: 12000000, date: "2024-03-10" }
    }
  ]);

  const [poolPositions] = useState<PoolPosition[]>([
    {
      id: 1,
      name: "Early Stage Tech Fund",
      type: "Angel",
      totalCommitted: 500000,
      deployed: 350000,
      returns: 425000,
      companies: 12
    },
    {
      id: 2,
      name: "AI/ML Syndicate",
      type: "Syndicate",
      totalCommitted: 250000,
      deployed: 200000,
      returns: 280000,
      companies: 8
    }
  ]);

  const totalPortfolioValue = companyPositions.reduce((sum, company) => sum + company.userEquityValue + company.userDebtPosition, 0);
  const totalPoolValue = poolPositions.reduce((sum, pool) => sum + pool.returns, 0);
  const totalNetWorth = totalPortfolioValue + totalPoolValue;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Investment Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Your complete portfolio overview and management center
              </p>
            </div>
            <div className="flex space-x-3">
              <Link href="/fundraising">
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  Fundraising
                </button>
              </Link>
              <Link href="/documents">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Documents
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Net Worth</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  ${totalNetWorth.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Building2 className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Company Equity</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  ${totalPortfolioValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pool Returns</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  ${totalPoolValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Companies</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {companyPositions.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Company Positions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Company Positions
              </h2>
              <Link href="/companies">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </Link>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {companyPositions.map((company) => (
                  <Link key={company.id} href={`/company/${company.id}/dashboard`}>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {company.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {company.entityType}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {company.userEquityPercentage}%
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ${company.userEquityValue.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Market Cap:</span>
                          <span className="ml-2 font-medium">${company.marketCap.toLocaleString()}</span>
                        </div>
                        {company.userDebtPosition > 0 && (
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Debt Position:</span>
                            <span className="ml-2 font-medium">${company.userDebtPosition.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-3">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Stock Classes:</div>
                        {company.stockClasses.map((stockClass, idx) => (
                          <div key={idx} className="text-xs flex justify-between">
                            <span>{stockClass.class}: {stockClass.shares.toLocaleString()} shares</span>
                            <span>{stockClass.percentage}% (${stockClass.value.toLocaleString()})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Pool Positions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Pool Positions
              </h2>
              <Link href="/pools">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </Link>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {poolPositions.map((pool) => (
                  <Link key={pool.id} href={`/pool/${pool.id}`}>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {pool.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {pool.type} • {pool.companies} companies
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">
                            ${pool.returns.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Returns
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Committed:</span>
                          <span className="ml-2 font-medium">${pool.totalCommitted.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Deployed:</span>
                          <span className="ml-2 font-medium">${pool.deployed.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              <button className="w-full mt-4 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 transition-colors flex items-center justify-center">
                <Plus className="w-4 h-4 mr-2" />
                Join New Pool
              </button>
            </div>
          </div>
        </div>

        {/* Pie Bot Command Center */}
        <div className="mt-8">
          <SimplePieBot />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;