import { TokenInfo, TokenTransfer } from '@/types';

interface BlockchainIntegrationProps {
  tokenInfo: TokenInfo;
  recentTransfers: TokenTransfer[];
}

const BlockchainIntegration = ({ tokenInfo, recentTransfers }: BlockchainIntegrationProps) => {
  const formatAddress = (address: string) => {
    if (!address || address.length < 10) return address;
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <section className="mb-8">
      <div className="bg-white dark:bg-[#293145] rounded-lg shadow-md p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg dark:text-white">Blockchain Integration</h3>
          <div className="flex items-center space-x-2">
            <span className="flex items-center text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <span className="material-icons text-xs mr-1">check_circle</span>
              Connected
            </span>
            <button className="text-primary dark:text-primary-light text-sm">
              <span className="material-icons text-sm">settings</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Ethereum Contract Address</p>
              <div className="flex items-center">
                <code className="bg-gray-100 dark:bg-[#1c2333] px-3 py-2 rounded font-mono text-sm flex-grow dark:text-gray-300">{tokenInfo.contractAddress}</code>
                <button 
                  className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" 
                  title="Copy address"
                  onClick={() => navigator.clipboard.writeText(tokenInfo.contractAddress)}
                >
                  <span className="material-icons">content_copy</span>
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Token Name</p>
              <p className="dark:text-white">{tokenInfo.name} ({tokenInfo.symbol})</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Supply</p>
              <p className="dark:text-white">{tokenInfo.totalSupply.toLocaleString()} {tokenInfo.symbol}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Network</p>
              <div className="flex items-center">
                <span className="material-icons text-accent mr-1">bolt</span>
                <p className="dark:text-white">{tokenInfo.network}</p>
              </div>
            </div>
          </div>
          
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Recent Token Transfers</p>
              <div className="mt-2 space-y-3">
                {recentTransfers.map((transfer) => (
                  <div key={transfer.id} className="p-3 bg-gray-50 dark:bg-[#1c2333] rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium dark:text-white">
                          {transfer.amount.toLocaleString()} {tokenInfo.symbol} Transfer
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          From: {formatAddress(transfer.from)} To: {formatAddress(transfer.to)}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTimestamp(transfer.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-2">
              <button className="w-full py-2 border border-primary dark:border-primary-light text-primary dark:text-primary-light rounded hover:bg-primary hover:bg-opacity-10 transition flex items-center justify-center">
                <span className="material-icons text-sm mr-1">open_in_new</span>
                View On Etherscan
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlockchainIntegration;
