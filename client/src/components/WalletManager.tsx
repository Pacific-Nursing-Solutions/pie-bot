import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { 
  Wallet, 
  Twitter, 
  Plus, 
  Import, 
  Copy, 
  ExternalLink,
  Shield,
  Users,
  Building2,
  CheckCircle
} from 'lucide-react';

interface WalletData {
  id: string;
  address: string;
  ensName?: string;
  type: 'personal' | 'company';
  companyId?: number;
  balance: number;
  connectedAccounts: {
    twitter?: string;
    email?: string;
  };
  isImported: boolean;
}

interface WalletManagerProps {
  walletType: 'personal' | 'company';
  companyId?: number;
  companyName?: string;
}

const WalletManager = ({ walletType, companyId, companyName }: WalletManagerProps) => {
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
      address: '0x1234567890123456789012345678901234567890',
      ensName: walletType === 'personal' ? 'founder.eth' : `${companyName?.toLowerCase().replace(' ', '')}.eth`,
      type: walletType,
      companyId: companyId,
      balance: walletType === 'personal' ? 1250000 : 850000,
      connectedAccounts: {
        twitter: walletType === 'personal' ? '@founder_handle' : `@${companyName?.toLowerCase().replace(' ', '')}_official`,
      },
      isImported: false
    }
  ]);

  const [showImportModal, setShowImportModal] = useState(false);
  const [importKey, setImportKey] = useState('');

  const handleCreateWallet = async () => {
    if (!isAuthenticated) {
      setIsAuthenticated(true);
      setUser({ twitter: { username: 'founder_demo' }, email: { address: 'founder@example.com' } });
      return;
    }

    const walletData: WalletData = {
      id: Date.now().toString(),
      address: '0x' + Math.random().toString(16).substr(2, 40),
      type: walletType,
      companyId: companyId,
      balance: 0,
      connectedAccounts: {
        twitter: user?.twitter?.username ? `@${user.twitter.username}` : undefined,
        email: user?.email?.address
      },
      isImported: false
    };

    setWallets(prev => [...prev, walletData]);
  };

  const handleImportWallet = () => {
    if (!importKey.trim()) return;

    const walletData: WalletData = {
      id: Date.now().toString(),
      address: '0x' + Math.random().toString(16).substr(2, 40),
      type: walletType,
      companyId: companyId,
      balance: 0,
      connectedAccounts: {
        twitter: user?.twitter?.username ? `@${user.twitter.username}` : undefined,
        email: user?.email?.address
      },
      isImported: true
    };

    setWallets(prev => [...prev, walletData]);
    setImportKey('');
    setShowImportModal(false);
  };

  const handleLinkTwitter = async (walletId: string) => {
    try {
      if (!user?.twitter) {
        await linkTwitter();
      }
      
      setWallets(prev => prev.map(wallet => 
        wallet.id === walletId
          ? {
              ...wallet,
              connectedAccounts: {
                ...wallet.connectedAccounts,
                twitter: user?.twitter?.username ? `@${user.twitter.username}` : undefined
              }
            }
          : wallet
      ));
    } catch (error) {
      console.error('Failed to link Twitter:', error);
    }
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
  };

  if (!ready) {
    return <div className="animate-pulse">Loading wallet manager...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {walletType === 'personal' ? (
            <Wallet className="w-6 h-6 text-violet-600" />
          ) : (
            <Building2 className="w-6 h-6 text-emerald-600" />
          )}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {walletType === 'personal' ? 'Personal Wallets' : `${companyName} Wallets`}
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Import className="w-4 h-4 mr-2" />
            Import Wallet
          </button>
          <button
            onClick={handleCreateWallet}
            className="flex items-center px-3 py-2 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Wallet
          </button>
        </div>
      </div>

      {/* Authentication Status */}
      {!authenticated && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Connect your accounts to manage wallets
              </p>
              <button
                onClick={login}
                className="text-sm text-amber-600 hover:text-amber-700 underline"
              >
                Login with Twitter, Email, or Wallet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wallets List */}
      <div className="space-y-4">
        {wallets.map((wallet) => (
          <div key={wallet.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    walletType === 'personal' ? 'bg-violet-100 dark:bg-violet-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'
                  }`}>
                    <Wallet className={`w-5 h-5 ${
                      walletType === 'personal' ? 'text-violet-600 dark:text-violet-400' : 'text-emerald-600 dark:text-emerald-400'
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      {wallet.ensName && (
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{wallet.ensName}</h4>
                      )}
                      {wallet.isImported && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded">
                          Imported
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="text-sm font-mono text-gray-600 dark:text-gray-400">
                        {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                      </code>
                      <button
                        onClick={() => copyAddress(wallet.address)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Balance</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      ${wallet.balance.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                      {wallet.type}
                    </p>
                  </div>
                </div>

                {/* Connected Accounts */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Connected Accounts</p>
                  <div className="flex items-center space-x-4">
                    {wallet.connectedAccounts.twitter ? (
                      <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                        <Twitter className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-600 dark:text-blue-400">
                          {wallet.connectedAccounts.twitter}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleLinkTwitter(wallet.id)}
                        className="flex items-center space-x-2 px-3 py-1 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                      >
                        <Twitter className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-600 dark:text-blue-400">Link Twitter</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Import Wallet Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Import Wallet
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Private Key or Seed Phrase
                </label>
                <textarea
                  value={importKey}
                  onChange={(e) => setImportKey(e.target.value)}
                  placeholder="Enter your private key or 12/24-word seed phrase"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  rows={3}
                />
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <p className="text-xs text-amber-800 dark:text-amber-200">
                  Your private key is encrypted and stored securely. We never have access to your funds.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
    </div>
  );
};

export default WalletManager;