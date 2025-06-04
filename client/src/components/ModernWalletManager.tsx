import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { 
  Wallet, 
  Building2, 
  Plus, 
  Copy, 
  ExternalLink, 
  Twitter, 
  Shield, 
  Import,
  Eye,
  EyeOff,
  Send,
  ArrowDownLeft as Receive,
  MoreHorizontal,
  TrendingUp,
  DollarSign,
  RefreshCw,
  Settings,
  Lock,
  Unlock,
  Download,
  Upload,
  QrCode,
  Globe,
  CheckCircle,
  AlertTriangle,
  Info,
  Zap,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Star,
  Filter
} from 'lucide-react';

interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  value: number;
  change24h: number;
  logo?: string;
}

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap' | 'stake';
  amount: string;
  token: string;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'failed';
  hash: string;
  gasUsed?: string;
  gasPrice?: string;
}

interface WalletData {
  id: string;
  address: string;
  ensName?: string;
  type: 'personal' | 'company';
  companyId?: number;
  totalValue: number;
  tokens: TokenBalance[];
  transactions: Transaction[];
  connectedApps: string[];
  isImported: boolean;
  isLocked: boolean;
  network: 'ethereum' | 'polygon' | 'arbitrum' | 'base';
}

interface ModernWalletManagerProps {
  walletType: 'personal' | 'company';
  companyId?: number;
  companyName?: string;
}

const ModernWalletManager = ({ walletType, companyId, companyName }: ModernWalletManagerProps) => {
  const { 
    ready, 
    authenticated, 
    user, 
    login, 
    logout, 
    linkTwitter, 
    unlinkTwitter,
    createWallet,
    exportWallet
  } = usePrivy();

  const [wallets, setWallets] = useState<WalletData[]>([
    {
      id: '1',
      address: '0x742d35Cc6634C0532925a3b8D404fAaF37686c26',
      ensName: walletType === 'personal' ? 'founder.eth' : `${companyName?.toLowerCase().replace(' ', '')}.eth`,
      type: walletType,
      companyId: companyId,
      totalValue: 125680.42,
      network: 'ethereum',
      tokens: [
        { symbol: 'ETH', name: 'Ethereum', balance: '12.5847', value: 31450.23, change24h: 2.4 },
        { symbol: 'USDC', name: 'USD Coin', balance: '25,000.00', value: 25000.00, change24h: 0.1 },
        { symbol: 'WBTC', name: 'Wrapped Bitcoin', balance: '0.8456', value: 34680.45, change24h: -1.2 },
        { symbol: 'UNI', name: 'Uniswap', balance: '1,245.67', value: 8945.78, change24h: 5.6 }
      ],
      transactions: [
        {
          id: '1',
          type: 'receive',
          amount: '5.0',
          token: 'ETH',
          timestamp: new Date(Date.now() - 3600000),
          status: 'confirmed',
          hash: '0xabcd1234...'
        },
        {
          id: '2',
          type: 'send',
          amount: '1000.0',
          token: 'USDC',
          timestamp: new Date(Date.now() - 7200000),
          status: 'confirmed',
          hash: '0xefgh5678...'
        },
        {
          id: '3',
          type: 'swap',
          amount: '2.5',
          token: 'ETH → USDC',
          timestamp: new Date(Date.now() - 86400000),
          status: 'pending',
          hash: '0xijkl9012...'
        }
      ],
      connectedApps: ['Uniswap', 'Compound', 'Aave'],
      isImported: false,
      isLocked: false
    }
  ]);

  const [selectedWallet, setSelectedWallet] = useState<string | null>(wallets[0]?.id || null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [importKey, setImportKey] = useState('');
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<'tokens' | 'transactions' | 'apps'>('tokens');
  const [networkFilter, setNetworkFilter] = useState<'all' | 'ethereum' | 'polygon' | 'arbitrum' | 'base'>('all');

  const currentWallet = wallets.find(w => w.id === selectedWallet);

  const handleCreateWallet = async () => {
    const newWallet: WalletData = {
      id: Date.now().toString(),
      address: '0x' + Math.random().toString(16).substr(2, 40),
      type: walletType,
      companyId: companyId,
      totalValue: 0,
      network: 'ethereum',
      tokens: [],
      transactions: [],
      connectedApps: [],
      isImported: false,
      isLocked: false
    };

    setWallets(prev => [...prev, newWallet]);
    setSelectedWallet(newWallet.id);
  };

  const handleImportWallet = () => {
    if (!importKey.trim()) return;

    const newWallet: WalletData = {
      id: Date.now().toString(),
      address: '0x' + Math.random().toString(16).substr(2, 40),
      type: walletType,
      companyId: companyId,
      totalValue: 0,
      network: 'ethereum',
      tokens: [],
      transactions: [],
      connectedApps: [],
      isImported: true,
      isLocked: false
    };

    setWallets(prev => [...prev, newWallet]);
    setImportKey('');
    setShowImportModal(false);
    setSelectedWallet(newWallet.id);
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toFixed(4);
  };

  const getNetworkIcon = (network: string) => {
    const icons: { [key: string]: string } = {
      ethereum: '⟠',
      polygon: '⬟',
      arbitrum: '🔷',
      base: '🔵'
    };
    return icons[network] || '⟠';
  };

  if (!ready) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              {walletType === 'personal' ? (
                <Wallet className="w-5 h-5 text-white" />
              ) : (
                <Building2 className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {walletType === 'personal' ? 'Personal Wallet' : `${companyName} Wallet`}
              </h2>
              <p className="text-white/80 text-sm">{wallets.length} wallet{wallets.length !== 1 ? 's' : ''} connected</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setBalanceVisible(!balanceVisible)}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              {balanceVisible ? <Eye className="w-4 h-4 text-white" /> : <EyeOff className="w-4 h-4 text-white" />}
            </button>
            <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
              <Settings className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Wallet Selector */}
      {wallets.length > 1 && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {wallets.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => setSelectedWallet(wallet.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border whitespace-nowrap transition-colors ${
                  selectedWallet === wallet.id
                    ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <span className="text-sm">{getNetworkIcon(wallet.network)}</span>
                <span className="text-sm font-medium">{formatAddress(wallet.address)}</span>
                {wallet.ensName && <span className="text-xs text-gray-500">({wallet.ensName})</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {currentWallet && (
        <>
          {/* Wallet Overview */}
          <div className="px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {currentWallet.ensName || formatAddress(currentWallet.address)}
                  </h3>
                  <span className="text-sm bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-lg">
                    {getNetworkIcon(currentWallet.network)} {currentWallet.network}
                  </span>
                  {currentWallet.isImported && (
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                      Imported
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <code className="text-sm font-mono text-gray-600 dark:text-gray-400">
                    {formatAddress(currentWallet.address)}
                  </code>
                  <button
                    onClick={() => copyAddress(currentWallet.address)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Balance */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Balance</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {balanceVisible ? `$${currentWallet.totalValue.toLocaleString()}` : '••••••'}
                </p>
                <div className="flex items-center justify-center space-x-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm text-emerald-500">+2.4% (24h)</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              <button
                onClick={() => setShowSendModal(true)}
                className="flex flex-col items-center p-4 bg-orange-50 dark:bg-orange-950/30 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-950/50 transition-colors"
              >
                <Send className="w-5 h-5 text-orange-500 mb-2" />
                <span className="text-sm font-medium text-orange-500">Send</span>
              </button>
              <button
                onClick={() => setShowReceiveModal(true)}
                className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors"
              >
                <Receive className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Receive</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors">
                <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Swap</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-orange-50 dark:bg-orange-950/30 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-950/50 transition-colors">
                <Zap className="w-5 h-5 text-orange-500 mb-2" />
                <span className="text-sm font-medium text-orange-500">Stake</span>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center space-x-1 mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {(['tokens', 'transactions', 'apps'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'tokens' && (
              <div className="space-y-3">
                {currentWallet.tokens.map((token, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{token.symbol.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{token.symbol}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{token.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {balanceVisible ? formatBalance(token.balance) : '••••'}
                      </p>
                      <div className="flex items-center space-x-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {balanceVisible ? `$${token.value.toLocaleString()}` : '••••'}
                        </p>
                        <span className={`text-xs ${token.change24h >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {token.change24h >= 0 ? '+' : ''}{token.change24h}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="space-y-3">
                {currentWallet.transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === 'send' ? 'bg-red-100 dark:bg-red-900/30' : 
                        tx.type === 'receive' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 
                        'bg-blue-100 dark:bg-blue-900/30'
                      }`}>
                        {tx.type === 'send' ? (
                          <ArrowUpRight className={`w-5 h-5 ${tx.type === 'send' ? 'text-red-600' : 'text-emerald-600'}`} />
                        ) : tx.type === 'receive' ? (
                          <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <RefreshCw className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">{tx.type}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{tx.token}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {tx.type === 'send' ? '-' : '+'}{tx.amount}
                      </p>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {tx.timestamp.toLocaleTimeString()}
                        </span>
                        <div className={`w-2 h-2 rounded-full ${
                          tx.status === 'confirmed' ? 'bg-emerald-500' : 
                          tx.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'apps' && (
              <div className="space-y-3">
                {currentWallet.connectedApps.map((app, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                        <Globe className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{app}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Connected</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                      Disconnect
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Footer Actions */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
            >
              <Import className="w-4 h-4 mr-2" />
              Import
            </button>
            <button
              onClick={handleCreateWallet}
              className="flex items-center px-3 py-2 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Wallet
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <QrCode className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Import Wallet
              </h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Private Key or Seed Phrase
                </label>
                <textarea
                  value={importKey}
                  onChange={(e) => setImportKey(e.target.value)}
                  placeholder="Enter your private key or 12/24-word seed phrase"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Shield className="w-4 h-4 text-amber-600 mt-0.5" />
                  <p className="text-xs text-amber-800 dark:text-amber-200">
                    Your private key is encrypted and stored securely. We never have access to your funds.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportWallet}
                  className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                  Import Wallet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Send Tokens
              </h3>
              <button
                onClick={() => setShowSendModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recipient Address
                </label>
                <input
                  type="text"
                  placeholder="0x... or ENS name"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="0.00"
                    className="w-full p-3 pr-16 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  <select className="absolute right-2 top-2 bg-transparent border-none text-sm font-medium">
                    <option>ETH</option>
                    <option>USDC</option>
                    <option>WBTC</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={() => setShowSendModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receive Modal */}
      {showReceiveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Receive Tokens
              </h3>
              <button
                onClick={() => setShowReceiveModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-48 h-48 bg-gray-100 dark:bg-gray-700 rounded-xl mx-auto flex items-center justify-center">
                <QrCode className="w-24 h-24 text-gray-400" />
              </div>
              
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Your Address</p>
                <div className="flex items-center justify-center space-x-2">
                  <code className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    {currentWallet?.address}
                  </code>
                  <button
                    onClick={() => copyAddress(currentWallet?.address || '')}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => setShowReceiveModal(false)}
                className="w-full px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernWalletManager;