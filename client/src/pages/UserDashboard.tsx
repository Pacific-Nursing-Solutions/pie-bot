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
    balance: "2.4567",
    connected: true,
    provider: "MetaMask"
  });
  const [showRecoveryPhrase, setShowRecoveryPhrase] = useState(false);
  
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

          {/* Portfolio Summary - Collapsible */}
          {!isHeaderMinimized && (
            <div className="pb-4">
              <div className="bg-orange-50 dark:bg-orange-950/50 rounded-lg p-4 border border-orange-100 dark:border-orange-900">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-orange-600 mr-2" />
                    <div>
                      <p className="text-xs font-medium text-orange-700 dark:text-orange-300">Total Net Worth</p>
                      <p className="text-lg font-bold text-orange-900 dark:text-orange-100">
                        ${totalNetWorth.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Building2 className="w-5 h-5 text-orange-600 mr-2" />
                    <div>
                      <p className="text-xs font-medium text-orange-700 dark:text-orange-300">Company Equity</p>
                      <p className="text-lg font-bold text-orange-900 dark:text-orange-100">
                        ${totalPortfolioValue.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-orange-600 mr-2" />
                    <div>
                      <p className="text-xs font-medium text-orange-700 dark:text-orange-300">Pool Returns</p>
                      <p className="text-lg font-bold text-orange-900 dark:text-orange-100">
                        ${totalPoolValue.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-orange-600 mr-2" />
                    <div>
                      <p className="text-xs font-medium text-orange-700 dark:text-orange-300">Companies</p>
                      <p className="text-lg font-bold text-orange-900 dark:text-orange-100">
                        {companyPositions.length}
                      </p>
                    </div>
                  </div>
                </div>
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
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <Wallet className="w-5 h-5 text-orange-500 mr-2" />
              Personal Wallet
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Wallet Info */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${userWallet.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {userWallet.connected ? 'Connected' : 'Disconnected'}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      ({userWallet.provider})
                    </span>
                  </div>
                  <button className="text-orange-600 dark:text-orange-400 text-sm font-medium hover:text-orange-700 dark:hover:text-orange-300 flex items-center">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View on Explorer
                  </button>
                </div>

                <div className="bg-orange-50 dark:bg-orange-950/30 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Wallet Address</span>
                    <button 
                      onClick={() => navigator.clipboard.writeText(userWallet.address)}
                      className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="font-mono text-sm text-gray-900 dark:text-gray-100 break-all">
                    {userWallet.address}
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-950/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">ETH Balance</span>
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {userWallet.balance} ETH
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ≈ ${(parseFloat(userWallet.balance) * 2340).toFixed(2)} USD
                      </p>
                    </div>
                    <div className="text-right">
                      <button className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-sm font-medium mb-2 block w-full">
                        Send
                      </button>
                      <button className="px-3 py-2 border border-orange-600 text-orange-600 dark:text-orange-400 rounded-md hover:bg-orange-50 dark:hover:bg-orange-950 text-sm font-medium block w-full">
                        Receive
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wallet Controls */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Wallet Management</h3>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowRecoveryPhrase(!showRecoveryPhrase)}
                    className="w-full flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-950/50 transition-colors"
                  >
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 text-orange-500 mr-3" />
                      <span className="font-medium text-gray-900 dark:text-gray-100">Recovery Phrase</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </button>

                  {showRecoveryPhrase && (
                    <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-3">
                        ⚠️ Keep your recovery phrase secure and never share it with anyone
                      </p>
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {['abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse', 'access', 'accident'].map((word, idx) => (
                          <div key={idx} className="bg-white dark:bg-gray-700 p-2 rounded text-center text-sm font-mono">
                            <span className="text-gray-400 mr-1">{idx + 1}.</span>
                            {word}
                          </div>
                        ))}
                      </div>
                      <button className="w-full px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm font-medium flex items-center justify-center">
                        <Download className="w-4 h-4 mr-2" />
                        Download Backup
                      </button>
                    </div>
                  )}

                  <button className="w-full flex items-center p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-950/50 transition-colors">
                    <Plus className="w-5 h-5 text-orange-500 mr-3" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">Connect Additional Wallet</span>
                  </button>

                  <button className="w-full flex items-center p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-950/50 transition-colors">
                    <Settings className="w-5 h-5 text-orange-500 mr-3" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">Wallet Settings</span>
                  </button>
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                    🥧 Pie Bot Control
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Allow Pie Bot to manage wallet transactions for automated equity operations
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Smart Contract Control</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
                    </label>
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