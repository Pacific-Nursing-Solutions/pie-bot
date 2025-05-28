import { useState } from 'react';
import { Link } from 'wouter';
import { TrendingUp, Building2, Users, FileText, DollarSign, Percent, ChevronRight, Plus, Bell, ChevronDown, ChevronUp, Zap, Settings, Wallet, Copy, ExternalLink, Download, Shield } from 'lucide-react';
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
  const [isHeaderMinimized, setIsHeaderMinimized] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userWallet, setUserWallet] = useState({
    address: "0x742d35Cc6635C0532925a3b8D46c6E4e4c4e7b98",
    ensName: "founder.eth",
    connected: true,
    provider: "MetaMask",
    totalValue: "$7.94K",
    tokens: [
      { name: "ETH", symbol: "ETH", balance: "1.5168", value: "$4.01K", icon: "⟐" },
      { name: "WETH", symbol: "WETH", balance: "1", value: "$2.64K", icon: "🌯" },
      { name: "ATXBT", symbol: "ATXBT", balance: "5529.6545", value: "$1.27K", icon: "🟣" },
      { name: "TechStart Token", symbol: "TSI", balance: "15000", value: "$450", icon: "🥧" },
      { name: "USDC", symbol: "USDC", balance: "125.50", value: "$125", icon: "💵" },
    ],
    debts: [
      { platform: "Aave", type: "ETH Loan", amount: "$45K", rate: "3.2%", status: "active" },
      { platform: "Compound", type: "USDC Borrow", amount: "$12K", rate: "2.8%", status: "active" },
      { platform: "MakerDAO", type: "DAI Vault", amount: "$28K", rate: "5.5%", status: "liquidating" }
    ],
    nfts: [
      { 
        id: 1, 
        collection: "Founders Club", 
        name: "Founder #2847", 
        image: "🎨", 
        value: "$2.3K",
        tokenized: false,
        ownership: "100%"
      },
      { 
        id: 2, 
        collection: "TechStart Genesis", 
        name: "Genesis Pass #156", 
        image: "🚀", 
        value: "$1.8K",
        tokenized: true,
        ownership: "45%",
        totalShares: 1000,
        ownedShares: 450
      },
      { 
        id: 3, 
        collection: "AI Art Collective", 
        name: "Neural Network #3421", 
        image: "🧠", 
        value: "$890",
        tokenized: false,
        ownership: "100%"
      }
    ],
    ensSubdomains: [
      { name: "wallet.founder.eth", status: "active", linked: true },
      { name: "company.founder.eth", status: "active", linked: false },
      { name: "investment.founder.eth", status: "pending", linked: false }
    ]
  });
  const [showAssets, setShowAssets] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showNFTs, setShowNFTs] = useState(false);
  const [showENSManager, setShowENSManager] = useState(false);
  const [showDebts, setShowDebts] = useState(false);
  
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
      {/* Compact Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  🥧 Pie Bot
                </h1>
              </div>
              
              {/* Navigation Icons */}
              <div className="flex items-center space-x-2">
                <Link href="/company-positions">
                  <button className="p-3 bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors" title="Company Positions">
                    <Building2 className="w-5 h-5" />
                  </button>
                </Link>
                <Link href="/pools">
                  <button className="p-3 bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors" title="Pool Positions">
                    <Users className="w-5 h-5" />
                  </button>
                </Link>
                <Link href="/fundraising">
                  <button className="p-3 bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors" title="Fundraising">
                    <TrendingUp className="w-5 h-5" />
                  </button>
                </Link>
                <Link href="/documents">
                  <button className="p-3 bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors" title="Documents">
                    <FileText className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Notifications Bell */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-3 bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full"></span>
                </button>
                
                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">🔔 Notifications & To-Do</h3>
                    </div>
                    <div className="p-4 max-h-96 overflow-y-auto space-y-3">
                      <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-400">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Review Series A documents for TechStart Inc.
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Due: May 30, 2024 • Priority: High
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            AI/ML Syndicate quarterly update available
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            New: May 22, 2024 • Action: Review performance
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-400">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            FinTech Startup board meeting invitation
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            June 5, 2024 • Action: Confirm attendance
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-400">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Update equity distribution calculations
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Task: Use Pie Bot to recalculate equity splits
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Minimize/Expand Button */}
              <button 
                onClick={() => setIsHeaderMinimized(!isHeaderMinimized)}
                className="p-3 bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors"
                title={isHeaderMinimized ? "Expand Portfolio Summary" : "Minimize Portfolio Summary"}
              >
                {isHeaderMinimized ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Portfolio Dashboard - CoinMarketCap Style */}
          {!isHeaderMinimized && (
            <div className="pb-4">
              <div className="bg-gray-900 dark:bg-gray-950 rounded-lg overflow-hidden">
                {/* Consolidated Header Row */}
                <div className="grid grid-cols-4 gap-4 p-3 bg-slate-700 dark:bg-slate-800">
                  <div className="text-center">
                    <p className="text-xs text-slate-300 mb-1">Total Net Worth</p>
                    <p className="text-lg font-bold text-white">${totalNetWorth.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-300 mb-1">Company Equity</p>
                    <p className="text-lg font-bold text-white">${totalPortfolioValue.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-300 mb-1">Pool Returns</p>
                    <p className="text-lg font-bold text-white">${totalPoolValue.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-300 mb-1">Companies</p>
                    <p className="text-lg font-bold text-white">{companyPositions.length}</p>
                  </div>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-1 px-3 py-2 bg-gray-800 text-xs font-medium text-gray-300 border-b border-gray-700">
                  <div className="col-span-1">#</div>
                  <div className="col-span-3">Company</div>
                  <div className="col-span-1 text-right">Value</div>
                  <div className="col-span-1 text-right">1d %</div>
                  <div className="col-span-1 text-right">7d %</div>
                  <div className="col-span-1 text-right">30d %</div>
                  <div className="col-span-2 text-right">Equity %</div>
                  <div className="col-span-1 text-right">Volume</div>
                  <div className="col-span-1 text-right">Last 7d</div>
                </div>

                {/* Company Rows */}
                {companyPositions.map((company, index) => (
                  <Link key={company.id} href={`/company/${company.id}/dashboard`}>
                    <div className="grid grid-cols-12 gap-1 px-3 py-2 hover:bg-gray-800 transition-colors border-b border-gray-800 text-sm cursor-pointer">
                      <div className="col-span-1 text-gray-400 font-medium">{index + 1}</div>
                      
                      <div className="col-span-3 flex items-center">
                        <div className="w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center mr-2">
                          <span className="text-white text-xs font-bold">{company.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm">{company.name}</div>
                          <div className="text-gray-400 text-xs">{company.entityType.split(' ')[0]}</div>
                        </div>
                      </div>

                      <div className="col-span-1 text-right">
                        <div className="text-white font-medium">${(company.userEquityValue / 1000).toFixed(0)}K</div>
                      </div>

                      <div className="col-span-1 text-right">
                        <span className="text-green-400">▲2.45%</span>
                      </div>

                      <div className="col-span-1 text-right">
                        <span className="text-red-400">▼1.23%</span>
                      </div>

                      <div className="col-span-1 text-right">
                        <span className="text-green-400">▲8.67%</span>
                      </div>

                      <div className="col-span-2 text-right">
                        <div className="text-white font-medium">{company.userEquityPercentage}%</div>
                        <div className="text-gray-400 text-xs">${(company.marketCap / 1000000).toFixed(1)}M MC</div>
                      </div>

                      <div className="col-span-1 text-right">
                        <div className="text-white text-xs">${(Math.random() * 500 + 100).toFixed(0)}K</div>
                        <div className="text-gray-400 text-xs">24h</div>
                      </div>

                      <div className="col-span-1 text-right">
                        <div className="w-12 h-6 bg-gray-700 rounded flex items-center justify-center">
                          <div className="text-xs text-green-400">📈</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}

                {/* Pool Positions */}
                {poolPositions.map((pool, index) => (
                  <Link key={pool.id} href={`/pool/${pool.id}`}>
                    <div className="grid grid-cols-12 gap-1 px-3 py-2 hover:bg-gray-800 transition-colors border-b border-gray-800 text-sm cursor-pointer">
                      <div className="col-span-1 text-gray-400 font-medium">{companyPositions.length + index + 1}</div>
                      
                      <div className="col-span-3 flex items-center">
                        <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center mr-2">
                          <span className="text-white text-xs font-bold">P</span>
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm">{pool.name}</div>
                          <div className="text-gray-400 text-xs">{pool.type}</div>
                        </div>
                      </div>

                      <div className="col-span-1 text-right">
                        <div className="text-white font-medium">${(pool.returns / 1000).toFixed(0)}K</div>
                      </div>

                      <div className="col-span-1 text-right">
                        <span className="text-green-400">▲1.89%</span>
                      </div>

                      <div className="col-span-1 text-right">
                        <span className="text-green-400">▲3.45%</span>
                      </div>

                      <div className="col-span-1 text-right">
                        <span className="text-green-400">▲12.3%</span>
                      </div>

                      <div className="col-span-2 text-right">
                        <div className="text-white font-medium">${(pool.totalCommitted / 1000).toFixed(0)}K</div>
                        <div className="text-gray-400 text-xs">{pool.companies} cos</div>
                      </div>

                      <div className="col-span-1 text-right">
                        <div className="text-white text-xs">${(pool.deployed / 1000).toFixed(0)}K</div>
                        <div className="text-gray-400 text-xs">dep</div>
                      </div>

                      <div className="col-span-1 text-right">
                        <div className="w-12 h-6 bg-gray-700 rounded flex items-center justify-center">
                          <div className="text-xs text-green-400">📊</div>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Pie Bot - Star of the Show */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              🥧 Pie Bot
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Your AI-powered investment assistant - ask about anything in your portfolio
            </p>
          </div>
          <SimplePieBot />
        </div>

        {/* Personal Wallet Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
          <div className="p-6">
            {/* Wallet Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mr-3">Wallet</h2>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{userWallet.totalValue}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Total Assets</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-red-600 dark:text-red-400">-$85K</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Total Debt</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">$7.86K</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Net Worth</div>
                </div>
                <button 
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Base Network Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs font-bold">B</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">Base</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-gray-100">{userWallet.totalValue}</span>
              </div>
              
              <div className="mt-2 p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-purple-700 dark:text-purple-300">Wallet mode on:</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(userWallet.address)}
                    className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="font-mono text-sm text-purple-700 dark:text-purple-300">
                  {userWallet.ensName || `${userWallet.address.slice(0, 8)}...${userWallet.address.slice(-6)}`}
                </p>
              </div>
            </div>

            {/* Main Token (ETH) */}
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors mb-4">
              <div className="flex items-center">
                <span className="text-xl mr-3">⟐</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">ETH</span>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900 dark:text-gray-100">{userWallet.tokens[0].balance}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{userWallet.tokens[0].value}</div>
              </div>
            </div>

            {/* Assets Section */}
            <div>
              <button 
                onClick={() => setShowAssets(!showAssets)}
                className="flex items-center justify-between w-full p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-gray-700 dark:text-gray-300 mr-2">↳</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">Assets</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showAssets ? 'rotate-180' : ''}`} />
              </button>

              {showAssets && (
                <div className="mt-2 space-y-2">
                  {userWallet.tokens.slice(1).map((token, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors ml-6">
                      <div className="flex items-center">
                        <span className="text-lg mr-3">{token.icon}</span>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{token.symbol}</div>
                          {token.balance !== '1' && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">{token.balance}</div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900 dark:text-gray-100">{token.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* NFTs Section */}
            <div className="mt-4">
              <button 
                onClick={() => setShowNFTs(!showNFTs)}
                className="flex items-center justify-between w-full p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-gray-700 dark:text-gray-300 mr-2">↳</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">NFTs</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({userWallet.nfts.length})</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showNFTs ? 'rotate-180' : ''}`} />
              </button>

              {showNFTs && (
                <div className="mt-2 space-y-2">
                  {userWallet.nfts.map((nft) => (
                    <div key={nft.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors ml-6">
                      <div className="flex items-center">
                        <span className="text-lg mr-3">{nft.image}</span>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{nft.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{nft.collection}</div>
                          {nft.tokenized && (
                            <div className="flex items-center mt-1">
                              <span className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded">
                                Tokenized
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                {nft.ownedShares}/{nft.totalShares} shares
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900 dark:text-gray-100">{nft.value}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{nft.ownership}</div>
                        {nft.tokenized && (
                          <button className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 mt-1">
                            Manage Shares
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <div className="ml-6 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <button className="w-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                      <Plus className="w-4 h-4 mr-2" />
                      <span className="text-sm">Import NFT or Create Tokenized Asset</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Debt & Lending Section */}
            <div className="mt-4">
              <button 
                onClick={() => setShowDebts(!showDebts)}
                className="flex items-center justify-between w-full p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-gray-700 dark:text-gray-300 mr-2">↳</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">Debt Positions</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({userWallet.debts.length})</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showDebts ? 'rotate-180' : ''}`} />
              </button>

              {showDebts && (
                <div className="mt-2 space-y-2">
                  {userWallet.debts.map((debt, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors ml-6">
                      <div className="flex items-center">
                        <span className="text-lg mr-3">🏦</span>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{debt.type}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{debt.platform}</div>
                          <div className="flex items-center mt-1">
                            <span className={`text-xs px-2 py-1 rounded ${
                              debt.status === 'active' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                              debt.status === 'liquidating' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                              'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                            }`}>
                              {debt.status}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                              APR: {debt.rate}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900 dark:text-gray-100">{debt.amount}</div>
                        <button className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 mt-1">
                          {debt.status === 'liquidating' ? 'Add Collateral' : 'Manage'}
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="ml-6 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <button className="w-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                      <Plus className="w-4 h-4 mr-2" />
                      <span className="text-sm">Open New Lending Position</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ENS Management Section */}
            <div className="mt-4">
              <button 
                onClick={() => setShowENSManager(!showENSManager)}
                className="flex items-center justify-between w-full p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-gray-700 dark:text-gray-300 mr-2">↳</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">ENS Subdomains</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({userWallet.ensSubdomains.length})</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showENSManager ? 'rotate-180' : ''}`} />
              </button>

              {showENSManager && (
                <div className="mt-2 space-y-2">
                  {userWallet.ensSubdomains.map((subdomain, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors ml-6">
                      <div className="flex items-center">
                        <span className="text-lg mr-3">🌐</span>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{subdomain.name}</div>
                          <div className="flex items-center mt-1">
                            <span className={`text-xs px-2 py-1 rounded ${
                              subdomain.status === 'active' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                              subdomain.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                              'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
                            }`}>
                              {subdomain.status}
                            </span>
                            {subdomain.linked && (
                              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded ml-2">
                                Linked
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <button className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300">
                          {subdomain.linked ? 'Manage' : 'Link Wallet'}
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="ml-6 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <button className="w-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                      <Plus className="w-4 h-4 mr-2" />
                      <span className="text-sm">Create New Subdomain</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Wallet Settings</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center p-3 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors">
                    <Shield className="w-5 h-5 text-orange-500 mr-3" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">Backup Recovery Phrase</span>
                  </button>
                  
                  <button className="w-full flex items-center p-3 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors">
                    <Plus className="w-5 h-5 text-orange-500 mr-3" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">Connect Additional Wallet</span>
                  </button>

                  <button className="w-full flex items-center p-3 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors">
                    <ExternalLink className="w-5 h-5 text-orange-500 mr-3" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">View on Block Explorer</span>
                  </button>

                  {/* NFT & Tokenization Settings */}
                  <div className="border-t pt-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">NFT & Tokenization</h4>
                    
                    <button className="w-full flex items-center p-3 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors mb-2">
                      <span className="text-orange-500 mr-3">🎨</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Create Fractional NFT</span>
                    </button>

                    <button className="w-full flex items-center p-3 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors">
                      <span className="text-orange-500 mr-3">🔗</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Deploy Share Contract</span>
                    </button>
                  </div>

                  {/* ENS Settings */}
                  <div className="border-t pt-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">ENS Management</h4>
                    
                    <button className="w-full flex items-center p-3 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors mb-2">
                      <span className="text-orange-500 mr-3">🌐</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Register New Subdomain</span>
                    </button>

                    <button className="w-full flex items-center p-3 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors mb-2">
                      <span className="text-orange-500 mr-3">⚙️</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Manage DNS Records</span>
                    </button>

                    <button className="w-full flex items-center p-3 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors">
                      <span className="text-orange-500 mr-3">📜</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">ENS Scroll Contracts</span>
                    </button>
                  </div>

                  {/* Identity & KYC Integration */}
                  <div className="border-t pt-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Identity Verification</h4>
                    
                    <button className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors mb-2">
                      <div className="flex items-center">
                        <span className="text-orange-500 mr-3">🆔</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">Connect Dentity</span>
                      </div>
                      <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">Verified</span>
                    </button>

                    <button className="w-full flex items-center p-3 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors">
                      <span className="text-orange-500 mr-3">🛡️</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Manage KYC Status</span>
                    </button>
                  </div>

                  {/* Crowdfunding Integration */}
                  <div className="border-t pt-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Crowdfunding Platforms</h4>
                    
                    <button className="w-full flex items-center p-3 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors mb-2">
                      <span className="text-orange-500 mr-3">🚀</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Connect Kickstarter</span>
                    </button>

                    <button className="w-full flex items-center p-3 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors mb-2">
                      <span className="text-orange-500 mr-3">💡</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Connect Indiegogo</span>
                    </button>

                    <button className="w-full flex items-center p-3 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors">
                      <span className="text-orange-500 mr-3">🌱</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Connect Republic</span>
                    </button>
                  </div>

                  {/* Onchain Lending & Investing */}
                  <div className="border-t pt-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">DeFi Integration</h4>
                    
                    <button className="w-full flex items-center p-3 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors mb-2">
                      <span className="text-orange-500 mr-3">🏦</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Connect Aave</span>
                    </button>

                    <button className="w-full flex items-center p-3 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors mb-2">
                      <span className="text-orange-500 mr-3">🔄</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Connect Compound</span>
                    </button>

                    <button className="w-full flex items-center p-3 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors">
                      <span className="text-orange-500 mr-3">💰</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Connect MakerDAO</span>
                    </button>
                  </div>

                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      🥧 Pie Bot has automated control for equity operations and smart contract deployments
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Company Wallet Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
          <div className="p-6">
            {/* Company Wallet Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mr-3">TechStart Inc. Wallet</h2>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900 dark:text-gray-100">$2.4M</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Total Assets</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-red-600 dark:text-red-400">-$450K</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Total Debt</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">$1.95M</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Net Worth</div>
                </div>
                <button className="p-2 text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Base Network Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs font-bold">B</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">Base</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-gray-100">$2.4M</span>
              </div>
              
              <div className="mt-2 p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-purple-700 dark:text-purple-300">Company wallet:</span>
                  <button className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="font-mono text-sm text-purple-700 dark:text-purple-300">
                  techstart.founder.eth
                </p>
              </div>
            </div>

            {/* Main Token (ETH) */}
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors mb-4">
              <div className="flex items-center">
                <span className="text-xl mr-3">⟐</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">ETH</span>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900 dark:text-gray-100">125.8</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">$1.8M</div>
              </div>
            </div>

            {/* Company Assets Section */}
            <div>
              <button className="flex items-center justify-between w-full p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center">
                  <span className="text-gray-700 dark:text-gray-300 mr-2">↳</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">Company Assets</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500 transition-transform" />
              </button>

              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors ml-6">
                  <div className="flex items-center">
                    <span className="text-lg mr-3">🥧</span>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">TSI Token</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">1M tokens</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900 dark:text-gray-100">$450K</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors ml-6">
                  <div className="flex items-center">
                    <span className="text-lg mr-3">💵</span>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">USDC</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">150K</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900 dark:text-gray-100">$150K</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Company NFTs Section */}
            <div className="mt-4">
              <button className="flex items-center justify-between w-full p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center">
                  <span className="text-gray-700 dark:text-gray-300 mr-2">↳</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">Company NFTs</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">(2)</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500 transition-transform" />
              </button>

              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors ml-6">
                  <div className="flex items-center">
                    <span className="text-lg mr-3">🏢</span>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">Company Logo NFT</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Brand Collection</div>
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                        Fully Owned
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900 dark:text-gray-100">$15K</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">100%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors ml-6">
                  <div className="flex items-center">
                    <span className="text-lg mr-3">🎨</span>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">AI Art #4567</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Digital Assets</div>
                      <div className="flex items-center mt-1">
                        <span className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded">
                          Tokenized
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          600/1000 shares
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900 dark:text-gray-100">$28K</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">60%</div>
                    <button className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 mt-1">
                      Manage Shares
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Debt Section */}
            <div className="mt-4">
              <button className="flex items-center justify-between w-full p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center">
                  <span className="text-gray-700 dark:text-gray-300 mr-2">↳</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">Company Debt</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">(3)</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500 transition-transform" />
              </button>

              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors ml-6">
                  <div className="flex items-center">
                    <span className="text-lg mr-3">🏦</span>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">Bridge Loan</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Traditional Lender</div>
                      <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                        Active
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900 dark:text-gray-100">$300K</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">7.5% APR</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors ml-6">
                  <div className="flex items-center">
                    <span className="text-lg mr-3">🔄</span>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">DeFi Loan</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Compound</div>
                      <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                        Active
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900 dark:text-gray-100">$150K</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">4.2% APR</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pool Positions Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Recent Pool Activity
            </h2>
            <Link href="/pools">
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                View All Pools <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </Link>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {poolPositions.slice(0, 2).map((pool) => (
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
          </div>
        </div>

        {/* Integrations Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <Zap className="w-5 h-5 text-orange-500 mr-2" />
              Integrations
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* DocuSign */}
              <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <FileText className="w-6 h-6 text-orange-500 mr-2" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">DocuSign</h3>
                  </div>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Digital contract signing and document management
                </p>
                <button className="text-orange-600 dark:text-orange-400 text-sm font-medium hover:text-orange-700 dark:hover:text-orange-300">
                  Configure →
                </button>
              </div>

              {/* Hubstaff */}
              <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Users className="w-6 h-6 text-orange-500 mr-2" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Hubstaff</h3>
                  </div>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Time tracking for equity-based compensation
                </p>
                <button className="text-orange-600 dark:text-orange-400 text-sm font-medium hover:text-orange-700 dark:hover:text-orange-300">
                  Configure →
                </button>
              </div>

              {/* QuickBooks */}
              <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <DollarSign className="w-6 h-6 text-orange-500 mr-2" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">QuickBooks</h3>
                  </div>
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Accounting software integration for financial data
                </p>
                <button className="text-orange-600 dark:text-orange-400 text-sm font-medium hover:text-orange-700 dark:hover:text-orange-300">
                  Connect →
                </button>
              </div>

              {/* Xero */}
              <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <TrendingUp className="w-6 h-6 text-orange-500 mr-2" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Xero</h3>
                  </div>
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Alternative accounting platform integration
                </p>
                <button className="text-orange-600 dark:text-orange-400 text-sm font-medium hover:text-orange-700 dark:hover:text-orange-300">
                  Connect →
                </button>
              </div>

              {/* Ethereum */}
              <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Building2 className="w-6 h-6 text-orange-500 mr-2" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Ethereum</h3>
                  </div>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Blockchain equity tokenization and smart contracts
                </p>
                <button className="text-orange-600 dark:text-orange-400 text-sm font-medium hover:text-orange-700 dark:hover:text-orange-300">
                  Configure →
                </button>
              </div>

              {/* Banking APIs */}
              <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <DollarSign className="w-6 h-6 text-orange-500 mr-2" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Banking APIs</h3>
                  </div>
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Direct bank account integration for financial tracking
                </p>
                <button className="text-orange-600 dark:text-orange-400 text-sm font-medium hover:text-orange-700 dark:hover:text-orange-300">
                  Connect →
                </button>
              </div>

              {/* Legal Platforms */}
              <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <FileText className="w-6 h-6 text-orange-500 mr-2" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Legal Platforms</h3>
                  </div>
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Connect with legal service providers for compliance
                </p>
                <button className="text-orange-600 dark:text-orange-400 text-sm font-medium hover:text-orange-700 dark:hover:text-orange-300">
                  Explore →
                </button>
              </div>

              {/* Add New Integration */}
              <div className="border-2 border-dashed border-orange-300 dark:border-orange-700 rounded-lg p-4 hover:border-orange-400 dark:hover:border-orange-600 transition-colors">
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Plus className="w-8 h-8 text-orange-500 mb-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Add Integration</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Connect new services to your workflow
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;