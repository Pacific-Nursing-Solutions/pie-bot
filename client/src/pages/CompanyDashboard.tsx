import { useState } from 'react';
import { Link, useRoute } from 'wouter';
import { ArrowLeft, Bot, Users, Calculator, FileText, TrendingUp, Wallet, Copy, ExternalLink, Download, Shield, Send, ChevronRight, Settings, Zap, Plus } from 'lucide-react';

interface Company {
  id: number;
  name: string;
  entityType: string;
  founded: string;
  valuation: number;
  authorizedShares: number;
  stakeholders: number;
}

const CompanyDashboard = () => {
  const [match, params] = useRoute('/company/:id/dashboard');
  const companyId = params?.id;
  const [showRecoveryPhrase, setShowRecoveryPhrase] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'wallet' | 'equity' | 'team'>('overview');

  // In a real app, this would fetch from API based on companyId
  const [company] = useState<Company>({
    id: parseInt(companyId || '1'),
    name: "TechStart Inc.",
    entityType: "Delaware C-Corp",
    founded: "2024",
    valuation: 5000000,
    authorizedShares: 10000000,
    stakeholders: 3
  });

  const [companyWallet, setCompanyWallet] = useState({
    address: "0x8ba1f109551bD432803012645Hac136c22C4d7",
    balance: "12.8901",
    equityTokens: "8500000",
    connected: true,
    provider: "Company Vault"
  });

  const quickActions = [
    {
      title: "Pie Bot",
      description: "Manage equity splits and tokenization",
      icon: Bot,
      href: `/company/${companyId}/pie-bot`,
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Team Management",
      description: "View and manage stakeholders",
      icon: Users,
      href: `/company/${companyId}/stakeholders`,
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Financial Reports",
      description: "View financial metrics and runway",
      icon: TrendingUp,
      href: `/company/${companyId}/financials`,
      color: "bg-purple-600 hover:bg-purple-700"
    },
    {
      title: "Legal Documents",
      description: "Access agreements and contracts",
      icon: FileText,
      href: `/company/${companyId}/documents`,
      color: "bg-orange-600 hover:bg-orange-700"
    }
  ];

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
                  {company.name}
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {company.entityType} • Founded {company.founded}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'overview', label: 'Overview', icon: TrendingUp },
              { key: 'wallet', label: 'Company Wallet', icon: Wallet },
              { key: 'equity', label: 'Equity Management', icon: Calculator },
              { key: 'team', label: 'Team', icon: Users }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.key
                    ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Company Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-orange-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Valuation</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      ${company.valuation.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-orange-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Stakeholders</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {company.stakeholders}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Calculator className="w-8 h-8 text-orange-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Authorized Shares</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {company.authorizedShares.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Wallet className="w-8 h-8 text-orange-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Equity Tokens</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {companyWallet.equityTokens}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <Link key={action.title} href={action.href}>
                    <div className={`bg-orange-600 hover:bg-orange-700 rounded-lg p-6 text-white hover:shadow-lg transition-all duration-200 cursor-pointer`}>
                      <action.icon className="w-8 h-8 mb-3" />
                      <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                      <p className="text-sm opacity-90">{action.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Recent Activity
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Bot className="w-5 h-5 text-orange-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Equity tokens minted via Pie Bot
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Wallet className="w-5 h-5 text-orange-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Company wallet connected
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-orange-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Founder agreement generated
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Company Wallet Tab */}
        {activeTab === 'wallet' && (
          <div className="space-y-8">
            {/* Wallet Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                  <Wallet className="w-5 h-5 text-orange-500 mr-2" />
                  {company.name} Company Wallet
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Wallet Status & Balance */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${companyWallet.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {companyWallet.connected ? 'Connected' : 'Disconnected'}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                          ({companyWallet.provider})
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
                          onClick={() => navigator.clipboard.writeText(companyWallet.address)}
                          className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="font-mono text-sm text-gray-900 dark:text-gray-100 break-all">
                        {companyWallet.address}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-orange-50 dark:bg-orange-950/30 rounded-lg p-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">ETH Balance</span>
                        <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                          {companyWallet.balance} ETH
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ≈ ${(parseFloat(companyWallet.balance) * 2340).toFixed(2)} USD
                        </p>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-950/30 rounded-lg p-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Equity Tokens</span>
                        <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                          {companyWallet.equityTokens}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {company.name} (TSI)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Wallet Management */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Wallet Management</h3>
                    
                    <div className="space-y-3">
                      <button 
                        onClick={() => setShowRecoveryPhrase(!showRecoveryPhrase)}
                        className="w-full flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-950/50 transition-colors"
                      >
                        <div className="flex items-center">
                          <Shield className="w-5 h-5 text-orange-500 mr-3" />
                          <span className="font-medium text-gray-900 dark:text-gray-100">Company Recovery Phrase</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      </button>

                      {showRecoveryPhrase && (
                        <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                          <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-3">
                            ⚠️ Company recovery phrase - Store securely with multiple authorized signatories
                          </p>
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            {['business', 'equity', 'token', 'share', 'company', 'founder', 'investor', 'valuation', 'growth', 'profit', 'revenue', 'success'].map((word, idx) => (
                              <div key={idx} className="bg-white dark:bg-gray-700 p-2 rounded text-center text-sm font-mono">
                                <span className="text-gray-400 mr-1">{idx + 1}.</span>
                                {word}
                              </div>
                            ))}
                          </div>
                          <button className="w-full px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm font-medium flex items-center justify-center">
                            <Download className="w-4 h-4 mr-2" />
                            Download Company Backup
                          </button>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                          <Send className="w-4 h-4 mr-2" />
                          Send Tokens
                        </button>
                        <button className="flex items-center justify-center p-3 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950 transition-colors">
                          <Plus className="w-4 h-4 mr-2" />
                          Mint Equity
                        </button>
                      </div>

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
                        Allow Pie Bot to manage company wallet for automated equity distribution and token operations
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Automated Operations</span>
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

            {/* Transaction History */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Recent Transactions
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                    <div className="flex items-center">
                      <Plus className="w-5 h-5 text-green-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Equity tokens minted
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                      </div>
                    </div>
                    <span className="text-green-600 font-medium">+500,000 TSI</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                    <div className="flex items-center">
                      <Send className="w-5 h-5 text-orange-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Tokens distributed to founders
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
                      </div>
                    </div>
                    <span className="text-orange-600 font-medium">-200,000 TSI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs would be implemented similarly */}
        {activeTab === 'equity' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Equity Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Equity distribution and tokenization tools coming soon...
            </p>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Team Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Stakeholder management tools coming soon...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;