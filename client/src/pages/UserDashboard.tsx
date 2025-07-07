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
  BarChart3,
  Wallet,
  Edit3,
  Check,
  X,
  Calculator
} from 'lucide-react';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import ModernWalletManager from '../components/ModernWalletManager';

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
  const [isPortfolioMinimized, setIsPortfolioMinimized] = useState(true);
  const [isWalletsMinimized, setIsWalletsMinimized] = useState(false);
  const [isAnalyticsMinimized, setIsAnalyticsMinimized] = useState(true);
  const [showPoolSection, setShowPoolSection] = useState(true);
  const [showCompensationSection, setShowCompensationSection] = useState(false);
  const [showCompensationDetails, setShowCompensationDetails] = useState(false);
  const [compensationPeriod, setCompensationPeriod] = useState<'7d' | '30d' | '1y'>('30d');

  // Wallet account management
  const [activeWalletId, setActiveWalletId] = useState('personal');
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const [editingWalletId, setEditingWalletId] = useState<string | null>(null);
  const [editingWalletName, setEditingWalletName] = useState('');

  const [walletAccounts, setWalletAccounts] = useState([
    { id: 'personal', name: 'Personal Wallet', type: 'personal', connected: true },
    { id: 'acme-corp', name: 'ACME Corp', type: 'company', connected: true },
    { id: 'startup-llc', name: 'Startup LLC', type: 'company', connected: false },
    { id: 'investment-fund', name: 'Investment Fund', type: 'company', connected: true }
  ]);

  const activeWallet = walletAccounts.find(w => w.id === activeWalletId);

  const handleWalletSwitch = (walletId: string) => {
    setActiveWalletId(walletId);
    setShowWalletDropdown(false);
  };

  const startEditingWallet = (walletId: string, currentName: string) => {
    setEditingWalletId(walletId);
    setEditingWalletName(currentName);
  };

  const saveWalletName = () => {
    setWalletAccounts(prev => prev.map(wallet =>
      wallet.id === editingWalletId
        ? { ...wallet, name: editingWalletName }
        : wallet
    ));
    setEditingWalletId(null);
    setEditingWalletName('');
  };

  const cancelEditingWallet = () => {
    setEditingWalletId(null);
    setEditingWalletName('');
  };

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
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-0">

      {/* Quick Navigation */}
      <div className="card-default p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Access</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/companies" className="flex items-center p-3 bg-orange-50 dark:bg-gray-700 rounded-lg hover:bg-orange-100 dark:hover:bg-gray-600 transition-colors">
            <Building2 className="w-5 h-5 text-accessible-orange mr-2" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Companies</span>
          </Link>
          <Link href="/documents" className="flex items-center p-3 bg-blue-50 dark:bg-gray-700 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors">
            <FileText className="w-5 h-5 text-accessible-blue mr-2" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Documents</span>
          </Link>
          <Link href="/settings" className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Settings</span>
          </Link>
          <Link href="/calculator" className="flex items-center p-3 bg-green-50 dark:bg-gray-700 rounded-lg hover:bg-green-100 dark:hover:bg-gray-600 transition-colors">
            <Calculator className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Loan Calculator</span>
          </Link>

        </div>
      </div>


      {/* Holdings Overview */}
      <div className="card-default">
        <div className="px-4 sm:px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
            Portfolio
          </h2>
          <button
            onClick={() => setIsPortfolioMinimized(!isPortfolioMinimized)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-accessible-blue transition-colors"
          >
            {isPortfolioMinimized ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>

        {!isPortfolioMinimized && (
          <div className="p-6">
            {/* Portfolio Summary - Always Visible */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Company</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Value</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hidden lg:table-cell"></th>
                    <th className="text-right py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hidden sm:table-cell"></th>
                    <th className="text-right py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hidden md:table-cell">% Equity</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hidden xl:table-cell">Circulating Supply</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-600 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Portfolio Summary Row - Always Visible */}
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-orange-50 dark:bg-gray-800">
                    <td className="py-4 w-1/4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-xs font-bold">P</span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-gray-100">Total Portfolio</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{companyPositions.length} companies</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-right font-semibold w-1/6">${companyPositions.reduce((sum, c) => sum + c.userEquityValue, 0).toLocaleString()}</td>
                    <td className="py-4 text-center hidden lg:table-cell w-1/3">
                      <div className="text-xs flex flex-row justify-center space-x-6">
                        <div className="status-positive">1D: +2.1%</div>
                        <div className="status-positive">7D: +5.8%</div>
                        <div className="status-negative">30D: -1.2%</div>
                      </div>
                    </td>
                    <td className="py-4 text-center hidden sm:table-cell w-1/8">
                      <div className="w-20 h-12 mx-auto">
                        <svg viewBox="0 0 80 48" className="w-full h-full">
                          <path
                            d={(() => {
                              const seed = 12345; // Fixed seed for consistent but random-looking data
                              let lastPrice = 24;
                              const trend = 0.98 + Math.random() * 0.04; // Slight upward trend

                              return Array.from({ length: 40 }, (_, i) => {
                                const x = i * 2;
                                // Create realistic price movement
                                const volatility = 0.8 + Math.sin(i * 0.1) * 0.3;
                                const randomWalk = (Math.sin(seed + i * 1.7) + Math.sin(seed + i * 3.2) + Math.sin(seed + i * 0.8)) / 3;
                                const priceChange = randomWalk * volatility * trend;
                                lastPrice = Math.max(8, Math.min(40, lastPrice + priceChange));

                                const scaledY = 48 - (lastPrice / 48) * 48;
                                return `${i === 0 ? 'M' : 'L'}${x},${scaledY}`;
                              }).join(' ');
                            })()}
                            stroke="#22c55e"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </td>
                    <td className="py-4 text-center hidden md:table-cell w-1/8">
                      <div className="text-blue-400 font-medium">100%</div>
                    </td>
                    <td className="py-4 text-center hidden xl:table-cell w-1/6">
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                          {companyPositions.reduce((sum, c) => sum + Math.floor(c.marketCap / 1000), 0).toLocaleString()}M Tokens
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                          <div className="bg-orange-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">68% of max supply</div>
                      </div>
                    </td>
                    <td className="py-4 text-right w-1/6">
                      <button
                        onClick={() => setShowPoolSection(!showPoolSection)}
                        className="text-accessible-blue hover:text-blue-800 dark:hover:text-blue-300 text-sm flex items-center justify-end transition-colors duration-200"
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
                          // Calculate equity position display
                          const marketCapPercentage = (company.userEquityValue / company.marketCap) * 100;
                          const totalShares = Math.floor(company.userEquityValue / 10); // Mock shares calculation

                          return (
                            <tr key={company.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="py-3 w-1/4">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white text-xs font-bold">{company.name.charAt(0)}</span>
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900 dark:text-gray-100">{company.name}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{company.userEquityPercentage}% equity</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 text-right font-medium w-1/6">${company.userEquityValue.toLocaleString()}</td>
                              <td className="py-3 text-center hidden lg:table-cell w-1/3">
                                <div className="text-xs flex flex-row justify-center space-x-6">
                                  <div className={valuePerformance.daily >= 0 ? 'text-accessible-orange font-medium' : 'text-red-600 dark:text-red-400 font-medium'}>
                                    1D: {valuePerformance.daily >= 0 ? '+' : ''}{valuePerformance.daily.toFixed(1)}%
                                  </div>
                                  <div className={valuePerformance.weekly >= 0 ? 'text-accessible-orange font-medium' : 'text-red-600 dark:text-red-400 font-medium'}>
                                    7D: {valuePerformance.weekly >= 0 ? '+' : ''}{valuePerformance.weekly.toFixed(1)}%
                                  </div>
                                  <div className={valuePerformance.monthly >= 0 ? 'text-accessible-orange font-medium' : 'text-red-600 dark:text-red-400 font-medium'}>
                                    30D: {valuePerformance.monthly >= 0 ? '+' : ''}{valuePerformance.monthly.toFixed(1)}%
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 text-center hidden sm:table-cell w-1/8">
                                <div className="w-20 h-12 mx-auto">
                                  <svg viewBox="0 0 80 48" className="w-full h-full">
                                    <path
                                      d={(() => {
                                        const companySeed = (company.id * 7919) + 54321; // Unique seed per company
                                        let lastPrice = 20 + (index * 4); // Different starting prices
                                        const trendDirection = valuePerformance.monthly >= 0 ? 1.02 : 0.98;
                                        const volatilityFactor = 0.6 + (index * 0.2); // Different volatility per company

                                        return Array.from({ length: 40 }, (_, i) => {
                                          const x = i * 2;

                                          // Create unique market behavior per company
                                          const marketCycle = Math.sin(companySeed + i * 0.15) * 0.7;
                                          const shortTermNoise = Math.sin(companySeed + i * 2.1) * 0.3;
                                          const momentum = Math.sin(companySeed + i * 0.05) * 0.4;

                                          const combinedSignal = (marketCycle + shortTermNoise + momentum) / 3;
                                          const priceChange = combinedSignal * volatilityFactor * trendDirection;

                                          lastPrice = Math.max(5, Math.min(43, lastPrice + priceChange));

                                          const scaledY = 48 - (lastPrice / 48) * 48;
                                          return `${i === 0 ? 'M' : 'L'}${x},${scaledY}`;
                                        }).join(' ');
                                      })()}
                                      stroke={valuePerformance.monthly >= 0 ? '#2A9D8F' : '#E76F51'}
                                      strokeWidth="2"
                                      fill="none"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </div>
                              </td>
                              <td className="py-3 text-center hidden md:table-cell w-1/8">
                                <div className="text-[#F4A261] font-medium">{company.userEquityPercentage}%</div>
                              </td>
                              <td className="py-3 text-center hidden xl:table-cell w-1/6">
                                <div className="text-center">
                                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                                    {Math.floor(company.marketCap / 1000).toLocaleString()}M {company.name.split(' ')[0].toUpperCase()}
                                  </div>
                                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                                    <div
                                      className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full"
                                      style={{ width: `${55 + (index * 10)}%` }}
                                    ></div>
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">{55 + (index * 10)}% of max supply</div>
                                </div>
                              </td>
                              <td className="py-3 text-right w-1/6">
                                <Link href={`/company/${company.id}/dashboard`}>
                                  <button className="text-[#F4A261] hover:text-[#FFD166] text-sm flex items-center justify-end">
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
      <div className="card-default">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Compensation & Contributions
            </h2>
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {(['7d', '30d', '1y'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setCompensationPeriod(period)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${compensationPeriod === period
                    ? 'bg-slate-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-slate-600 dark:hover:text-slate-400'
                    }`}
                >
                  {period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : '1 Year'}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setShowCompensationSection(!showCompensationSection)}
            className="p-2 text-gray-500 hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
          >
            {showCompensationSection ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>

        {showCompensationSection && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-3 px-3 text-sm font-medium text-gray-600 dark:text-gray-400 w-1/5">Company</th>
                    <th className="text-right py-3 px-3 text-sm font-medium text-gray-600 dark:text-gray-400 w-1/6">Time Contributed</th>
                    <th className="text-right py-3 px-3 text-sm font-medium text-gray-600 dark:text-gray-400 w-1/6">Capital Contributed</th>
                    <th className="text-right py-3 px-3 text-sm font-medium text-gray-600 dark:text-gray-400 w-1/6">Total Earned</th>
                    <th className="text-right py-3 px-3 text-sm font-medium text-gray-600 dark:text-gray-400 w-1/6">Cash Compensation</th>
                    <th className="text-right py-3 px-3 text-sm font-medium text-gray-600 dark:text-gray-400 w-1/6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Total Compensation Row */}
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-4 px-3">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">Total</div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">Compensation</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{companyPositions.length} companies</div>
                      </div>
                    </td>
                    <td className="py-4 px-3 text-right font-semibold text-gray-900 dark:text-gray-100">4,200h</td>
                    <td className="py-4 px-3 text-right font-semibold text-gray-900 dark:text-gray-100">$275K</td>
                    <td className="py-4 px-3 text-right font-semibold text-gray-900 dark:text-gray-100">$805K</td>
                    <td className="py-4 px-3 text-right font-semibold text-gray-900 dark:text-gray-100">$385K</td>
                    <td className="py-4 px-3 text-right">
                      <button
                        onClick={() => setShowCompensationDetails(!showCompensationDetails)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 cursor-pointer"
                      >
                        {showCompensationDetails ? 'Collapse ↑' : 'Expand ↓'}
                      </button>
                    </td>
                  </tr>

                  {/* Individual Company Rows */}
                  {showCompensationDetails && companyPositions.map((company) => {
                    // Generate mock compensation data
                    const timeContributed = Math.floor(Math.random() * 2000) + 500; // 500-2500 hours
                    const capitalContributed = Math.floor(Math.random() * 100000) + 10000; // $10K-$110K
                    const totalEarned = Math.floor(Math.random() * 500000) + 100000; // $100K-$600K
                    const cashComp = Math.floor(totalEarned * (0.3 + Math.random() * 0.4)); // 30-70%
                    const equityComp = totalEarned - cashComp;

                    return (
                      <tr key={company.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="py-3 px-3">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">{company.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{company.entityType}</div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-medium text-gray-900 dark:text-gray-100">{timeContributed.toLocaleString()}h</td>
                        <td className="py-3 px-3 text-right font-medium text-gray-900 dark:text-gray-100">${capitalContributed.toLocaleString()}</td>
                        <td className="py-3 px-3 text-right font-medium text-gray-900 dark:text-gray-100">${totalEarned.toLocaleString()}</td>
                        <td className="py-3 px-3 text-right font-medium text-gray-900 dark:text-gray-100">${cashComp.toLocaleString()}</td>
                        <td className="py-3 px-3 text-right font-medium text-gray-900 dark:text-gray-100">${equityComp.toLocaleString()}</td>
                      </tr>
                    );
                  })}

                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Analytics Dashboard */}
      <div className="card-default">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mr-3">
              Holdings Dashboard
            </h2>

          </div>
          <button
            onClick={() => setIsAnalyticsMinimized(!isAnalyticsMinimized)}
            className="p-2 text-gray-500 hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
          >
            {isAnalyticsMinimized ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {!isAnalyticsMinimized && (
          <div className="p-6">
            <AnalyticsDashboard />
          </div>
        )}
      </div>

      {/* Wallets Section */}
      <div className="card-default">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Wallets</h2>

            {/* Wallet Account Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowWalletDropdown(!showWalletDropdown)}
                className="btn-primary flex items-center space-x-2"
              >
                <Wallet className="w-4 h-4" />
                <span className="font-medium">{activeWallet?.name}</span>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${activeWallet?.connected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {/* Dropdown Menu */}
              {showWalletDropdown && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Switch Account</p>
                  </div>

                  <div className="max-h-64 overflow-y-auto">
                    {walletAccounts.map((wallet) => (
                      <div key={wallet.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div
                          className="flex items-center space-x-3 flex-1 cursor-pointer"
                          onClick={() => handleWalletSwitch(wallet.id)}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${wallet.type === 'personal'
                            ? 'bg-orange-100 dark:bg-orange-900'
                            : 'bg-orange-100 dark:bg-orange-900'
                            }`}>
                            {wallet.type === 'personal' ? (
                              <Wallet className={`w-4 h-4 ${wallet.type === 'personal' ? 'text-orange-500' : 'text-orange-600 dark:text-orange-400'}`} />
                            ) : (
                              <Building2 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                            )}
                          </div>

                          <div className="flex-1">
                            {editingWalletId === wallet.id ? (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={editingWalletName}
                                  onChange={(e) => setEditingWalletName(e.target.value)}
                                  className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
                                  autoFocus
                                />
                                <button
                                  onClick={saveWalletName}
                                  className="p-1 status-positive hover:text-green-800 dark:hover:text-green-300"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={cancelEditingWallet}
                                  className="p-1 status-negative hover:text-red-800 dark:hover:text-red-300"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-gray-900 dark:text-gray-100">{wallet.name}</span>
                                  {wallet.id === activeWalletId && (
                                    <span className="px-2 py-0.5 text-xs bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full">Active</span>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2 mt-1">
                                  <div className={`w-2 h-2 rounded-full ${wallet.connected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {wallet.connected ? 'Connected' : 'Disconnected'}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {editingWalletId !== wallet.id && (
                          <button
                            onClick={() => startEditingWallet(wallet.id, wallet.name)}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-2"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                    <button className="w-full flex items-center justify-center space-x-2 py-2 text-sm text-orange-500 hover:text-orange-600 transition-colors">
                      <Plus className="w-4 h-4" />
                      <span>Add New Wallet</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsWalletsMinimized(!isWalletsMinimized)}
            className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {isWalletsMinimized ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {!isWalletsMinimized && (
          <div className="p-6">
            <ModernWalletManager
              walletType={activeWallet?.type === 'personal' ? 'personal' : 'company'}
              companyName={activeWallet?.type === 'company' ? activeWallet.name : undefined}
            />
          </div>
        )}
      </div>


    </div>
  );
};

export default UserDashboard;