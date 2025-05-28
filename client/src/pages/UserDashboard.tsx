import { useState } from 'react';
import { Link } from 'wouter';
import { 
  ChevronDown, 
  ChevronUp, 
  ChevronRight,
  Copy,
  Settings,
  Plus,
  Shield,
  ExternalLink,
  Building2,
  Users,
  TrendingUp,
  FileText
} from 'lucide-react';

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
  type: string;
  returns: number;
  totalCommitted: number;
  deployed: number;
  companies: number;
}

const UserDashboard = () => {
  const [isPortfolioMinimized, setIsPortfolioMinimized] = useState(false);
  const [isWalletsMinimized, setIsWalletsMinimized] = useState(false);
  const [showPoolSection, setShowPoolSection] = useState(true);
  
  // Portfolio data
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
      lastValuation: { amount: 3500000, date: "2024-02-01" }
    }
  ]);

  const [poolPositions] = useState<PoolPosition[]>([
    {
      id: 1,
      name: "Startup Accelerator Pool",
      type: "Early Stage",
      returns: 125000,
      totalCommitted: 500000,
      deployed: 350000,
      companies: 8
    },
    {
      id: 2,
      name: "AI/ML Investment Pool",
      type: "Sector Focus",
      returns: 87000,
      totalCommitted: 250000,
      deployed: 180000,
      companies: 5
    }
  ]);

  const totalNetWorth = 3879000;
  const totalPortfolioValue = 3174000;
  const totalPoolValue = 705000;

  return (
    <div className="space-y-6">
      {/* Quick Navigation */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <Link href="/companies">
          <button className="flex items-center px-4 py-2 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors">
            <Building2 className="w-4 h-4 mr-2" />
            Companies
          </button>
        </Link>
        <Link href="/pools">
          <button className="flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors">
            <Users className="w-4 h-4 mr-2" />
            Pools
          </button>
        </Link>
        <Link href="/fundraising">
          <button className="flex items-center px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
            <TrendingUp className="w-4 h-4 mr-2" />
            Fundraising
          </button>
        </Link>
        <Link href="/documents">
          <button className="flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
            <FileText className="w-4 h-4 mr-2" />
            Documents
          </button>
        </Link>
      </div>

      {/* Portfolio Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Portfolio Overview
          </h2>
          <button 
            onClick={() => setIsPortfolioMinimized(!isPortfolioMinimized)}
            className="p-2 text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
          >
            {isPortfolioMinimized ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>

        {!isPortfolioMinimized && (
          <div className="p-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Net Worth</h3>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">${totalNetWorth.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Company Equity</h3>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">${totalPortfolioValue.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Pool Returns</h3>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">${totalPoolValue.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Companies</h3>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{companyPositions.length}</p>
              </div>
            </div>

            {/* Company Positions Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Company</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Equity %</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Value</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Market Cap</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companyPositions.map((company) => (
                    <tr key={company.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-xs font-bold">{company.name.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">{company.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{company.entityType}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-right font-medium">{company.userEquityPercentage}%</td>
                      <td className="py-3 text-right font-medium">${company.userEquityValue.toLocaleString()}</td>
                      <td className="py-3 text-right">${company.marketCap.toLocaleString()}</td>
                      <td className="py-3 text-right">
                        <Link href={`/company/${company.id}/dashboard`}>
                          <button className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 text-sm">
                            View Details
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Wallets Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Wallet Management
          </h2>
          <button 
            onClick={() => setIsWalletsMinimized(!isWalletsMinimized)}
            className="p-2 text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
          >
            {isWalletsMinimized ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>

        {!isWalletsMinimized && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Wallet */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Personal Wallet</h3>
                  <div className="text-right">
                    <div className="text-lg font-bold">$7.94K</div>
                    <div className="text-sm text-gray-500">($85K) = $7.86K</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>ETH Balance:</span>
                    <span>1.52 ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span>NFTs:</span>
                    <span>3 items</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ENS Domains:</span>
                    <span>founder.eth</span>
                  </div>
                </div>
              </div>

              {/* Company Wallet */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">TechStart Wallet</h3>
                  <div className="text-right">
                    <div className="text-lg font-bold">$2.4M</div>
                    <div className="text-sm text-gray-500">($450K) = $1.95M</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>ETH Balance:</span>
                    <span>125.8 ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Company NFTs:</span>
                    <span>2 items</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ENS Domain:</span>
                    <span>techstart.founder.eth</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pool Positions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mr-3">
              Pool Positions
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {poolPositions.length} positions
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/pools">
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </Link>
            <button 
              onClick={() => setShowPoolSection(!showPoolSection)}
              className="p-2 text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >
              {showPoolSection ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {showPoolSection && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {poolPositions.map((pool) => (
                <Link key={pool.id} href={`/pool/${pool.id}`}>
                  <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-950/50 transition-colors cursor-pointer">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{pool.name}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Returns</span>
                        <span className="font-medium text-purple-600 dark:text-purple-400">${pool.returns.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Committed</span>
                        <span className="font-medium">${pool.totalCommitted.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Companies</span>
                        <span className="font-medium">{pool.companies}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;