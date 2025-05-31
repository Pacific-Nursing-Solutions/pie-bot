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
  FileText,
  BarChart3
} from 'lucide-react';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

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



const UserDashboard = () => {
  const [isPortfolioMinimized, setIsPortfolioMinimized] = useState(false);
  const [isWalletsMinimized, setIsWalletsMinimized] = useState(false);
  const [isAnalyticsMinimized, setIsAnalyticsMinimized] = useState(false);
  const [showPoolSection, setShowPoolSection] = useState(true);
  const [showCompensationSection, setShowCompensationSection] = useState(false);
  
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

  const totalNetWorth = 3879000;
  const totalPortfolioValue = 3174000;

  return (
    <div className="space-y-6">
      {/* Quick Navigation */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <Link href="/companies">
          <button className="flex items-center px-4 py-2 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-300 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-950/30 transition-colors">
            <Building2 className="w-4 h-4 mr-2" />
            Companies
          </button>
        </Link>
        <Link href="/management">
          <button className="flex items-center px-4 py-2 bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-300 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-950/30 transition-colors">
            <Users className="w-4 h-4 mr-2" />
            Management
          </button>
        </Link>
        <Link href="/documents">
          <button className="flex items-center px-4 py-2 bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-300 rounded-lg hover:bg-sky-100 dark:hover:bg-sky-950/30 transition-colors">
            <FileText className="w-4 h-4 mr-2" />
            Documents
          </button>
        </Link>
        <Link href="/settings">
          <button className="flex items-center px-4 py-2 bg-slate-50 dark:bg-slate-950/20 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-950/30 transition-colors">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>
        </Link>
      </div>

      {/* Holdings Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Your Holdings Overview
          </h2>
          <button 
            onClick={() => setIsPortfolioMinimized(!isPortfolioMinimized)}
            className="p-2 text-gray-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            {isPortfolioMinimized ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>

        {!isPortfolioMinimized && (
          <div className="p-6">
            {/* Portfolio Summary - Always Visible */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Company</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hidden lg:table-cell">Value Performance</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hidden md:table-cell">Equity Performance</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Value</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hidden sm:table-cell">Chart</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Portfolio Summary Row - Always Visible */}
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-800/30 dark:bg-gray-700/30">
                    <td className="py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-amber-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-xs font-bold">P</span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-gray-100">Total Portfolio</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{companyPositions.length} companies</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-right hidden lg:table-cell">
                      <div className="text-xs space-y-1">
                        <div className="text-green-400">1D: +2.1%</div>
                        <div className="text-green-400">7D: +5.8%</div>
                        <div className="text-red-400">30D: -1.2%</div>
                      </div>
                    </td>
                    <td className="py-4 text-right hidden md:table-cell">
                      <div className="text-xs space-y-1">
                        <div className="text-gray-400">1D: 0.0%</div>
                        <div className="text-gray-400">7D: 0.0%</div>
                        <div className="text-gray-400">30D: 0.0%</div>
                      </div>
                    </td>
                    <td className="py-4 text-right font-semibold">${companyPositions.reduce((sum, c) => sum + c.userEquityValue, 0).toLocaleString()}</td>
                    <td className="py-4 text-right hidden sm:table-cell">
                      <div className="w-16 h-8">
                        <svg viewBox="0 0 64 32" className="w-full h-full">
                          <path d="M0,16 L16,20 L32,12 L48,8 L64,14" stroke="#22c55e" strokeWidth="2" fill="none"/>
                        </svg>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <button 
                        onClick={() => setShowPoolSection(!showPoolSection)}
                        className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 text-sm flex items-center"
                      >
                        {showPoolSection ? 'Collapse' : 'Expand'}
                        {showPoolSection ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Individual Holdings - Only When Expanded */}
            {showPoolSection && (
              <div className="mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Company</th>
                        <th className="text-right py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hidden lg:table-cell">Value Performance</th>
                        <th className="text-right py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hidden md:table-cell">Equity Performance</th>
                        <th className="text-right py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Value</th>
                        <th className="text-right py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hidden sm:table-cell">Chart</th>
                        <th className="text-right py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...companyPositions]
                        .sort((a, b) => b.userEquityValue - a.userEquityValue)
                        .map((company, index) => {
                          // Generate performance data for each company
                          const valuePerformance = {
                            daily: (Math.random() - 0.5) * 6,
                            weekly: (Math.random() - 0.5) * 12,
                            monthly: (Math.random() - 0.5) * 20
                          };
                          const equityPerformance = {
                            daily: (Math.random() - 0.5) * 2,
                            weekly: (Math.random() - 0.5) * 4,
                            monthly: (Math.random() - 0.5) * 8
                          };
                          
                          return (
                            <tr key={company.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="py-3">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white text-xs font-bold">{company.name.charAt(0)}</span>
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900 dark:text-gray-100">{company.name}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{company.userEquityPercentage}% equity</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 text-right hidden lg:table-cell">
                                <div className="text-xs space-y-1">
                                  <div className={valuePerformance.daily >= 0 ? 'text-green-600' : 'text-red-600'}>
                                    1D: {valuePerformance.daily >= 0 ? '+' : ''}{valuePerformance.daily.toFixed(1)}%
                                  </div>
                                  <div className={valuePerformance.weekly >= 0 ? 'text-green-600' : 'text-red-600'}>
                                    7D: {valuePerformance.weekly >= 0 ? '+' : ''}{valuePerformance.weekly.toFixed(1)}%
                                  </div>
                                  <div className={valuePerformance.monthly >= 0 ? 'text-green-600' : 'text-red-600'}>
                                    30D: {valuePerformance.monthly >= 0 ? '+' : ''}{valuePerformance.monthly.toFixed(1)}%
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 text-right hidden md:table-cell">
                                <div className="text-xs space-y-1">
                                  <div className={equityPerformance.daily >= 0 ? 'text-green-600' : 'text-red-600'}>
                                    1D: {equityPerformance.daily >= 0 ? '+' : ''}{equityPerformance.daily.toFixed(1)}%
                                  </div>
                                  <div className={equityPerformance.weekly >= 0 ? 'text-green-600' : 'text-red-600'}>
                                    7D: {equityPerformance.weekly >= 0 ? '+' : ''}{equityPerformance.weekly.toFixed(1)}%
                                  </div>
                                  <div className={equityPerformance.monthly >= 0 ? 'text-green-600' : 'text-red-600'}>
                                    30D: {equityPerformance.monthly >= 0 ? '+' : ''}{equityPerformance.monthly.toFixed(1)}%
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 text-right font-medium">${company.userEquityValue.toLocaleString()}</td>
                              <td className="py-3 text-right hidden sm:table-cell">
                                <div className="w-16 h-8">
                                  <svg viewBox="0 0 64 32" className="w-full h-full">
                                    <path 
                                      d={`M0,${16 + Math.sin(index) * 8} L16,${16 + Math.sin(index + 1) * 8} L32,${16 + Math.sin(index + 2) * 8} L48,${16 + Math.sin(index + 3) * 8} L64,${16 + Math.sin(index + 4) * 8}`}
                                      stroke={valuePerformance.monthly >= 0 ? '#22c55e' : '#ef4444'} 
                                      strokeWidth="2" 
                                      fill="none"
                                    />
                                  </svg>
                                </div>
                              </td>
                              <td className="py-3 text-right">
                                <Link href={`/company/${company.id}/dashboard`}>
                                  <button className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 text-sm">
                                    View Details
                                  </button>
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Compensation Tracking */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Compensation & Contributions
          </h2>
          <button 
            onClick={() => setShowCompensationSection(!showCompensationSection)}
            className="p-2 text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
          >
            {showCompensationSection ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {!showCompensationSection && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Company</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Time Contributed</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Capital Contributed</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Total Earned</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Cash Compensation</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Equity Compensation</th>
                  </tr>
                </thead>
                <tbody>
                  {companyPositions.map((company) => {
                    // Generate mock compensation data
                    const timeContributed = Math.floor(Math.random() * 2000) + 500; // 500-2500 hours
                    const capitalContributed = Math.floor(Math.random() * 100000) + 10000; // $10K-$110K
                    const totalEarned = Math.floor(Math.random() * 500000) + 100000; // $100K-$600K
                    const cashComp = Math.floor(totalEarned * (0.3 + Math.random() * 0.4)); // 30-70%
                    const equityComp = totalEarned - cashComp;
                    
                    return (
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
                        <td className="py-3 text-right">
                          <div className="font-medium">{timeContributed.toLocaleString()}h</div>
                          <div className="text-xs text-gray-500">~{Math.floor(timeContributed/40)} weeks</div>
                        </td>
                        <td className="py-3 text-right">
                          <div className="font-medium">${capitalContributed.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">Cash & assets</div>
                        </td>
                        <td className="py-3 text-right font-semibold">${totalEarned.toLocaleString()}</td>
                        <td className="py-3 text-right">
                          <div className="font-medium text-green-600">${cashComp.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">{Math.round((cashComp/totalEarned)*100)}%</div>
                        </td>
                        <td className="py-3 text-right">
                          <div className="font-medium text-blue-600">${equityComp.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">{Math.round((equityComp/totalEarned)*100)}%</div>
                        </td>
                      </tr>
                    );
                  })}
                  
                  {/* Totals Row */}
                  <tr className="border-t-2 border-gray-300 dark:border-gray-600 bg-gray-800/30 dark:bg-gray-700/30">
                    <td className="py-4 font-semibold text-gray-900 dark:text-gray-100">Portfolio Totals</td>
                    <td className="py-4 text-right font-semibold">
                      {companyPositions.reduce((sum) => sum + (Math.floor(Math.random() * 2000) + 500), 0).toLocaleString()}h
                    </td>
                    <td className="py-4 text-right font-semibold">
                      ${companyPositions.reduce((sum) => sum + (Math.floor(Math.random() * 100000) + 10000), 0).toLocaleString()}
                    </td>
                    <td className="py-4 text-right font-semibold">
                      ${companyPositions.reduce((sum) => sum + (Math.floor(Math.random() * 500000) + 100000), 0).toLocaleString()}
                    </td>
                    <td className="py-4 text-right font-semibold text-green-600">
                      ${companyPositions.reduce((sum) => sum + (Math.floor(Math.random() * 200000) + 50000), 0).toLocaleString()}
                    </td>
                    <td className="py-4 text-right font-semibold text-blue-600">
                      ${companyPositions.reduce((sum) => sum + (Math.floor(Math.random() * 300000) + 100000), 0).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Analytics Dashboard */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mr-3">
              Holdings Dashboard
            </h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Live Performance</span>
            </div>
          </div>
          <button 
            onClick={() => setIsAnalyticsMinimized(!isAnalyticsMinimized)}
            className="p-2 text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
          >
            {isAnalyticsMinimized ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>

        {!isAnalyticsMinimized && (
          <div className="p-6">
            <AnalyticsDashboard />
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

  
    </div>
  );
};

export default UserDashboard;