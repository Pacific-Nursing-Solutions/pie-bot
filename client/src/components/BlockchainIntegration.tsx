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
      <div className="bg-[#1C1F2B] rounded-lg shadow-md p-5 border border-[#2A3441]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg text-[#E0E1DD]">Blockchain Integration</h3>
          <div className="flex items-center space-x-2">
            <span className="flex items-center text-xs px-2 py-0.5 rounded-full bg-[#2A9D8F]/20 text-[#2A9D8F]">
              <span className="material-icons text-xs mr-1">check_circle</span>
              Connected
            </span>
            <button className="text-[#F4A261] text-sm">
              <span className="material-icons text-sm">settings</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <p className="text-sm text-[#A0A3A8] mb-1">Ethereum Contract Address</p>
              <div className="flex items-center">
                <code className="bg-[#0D1B2A] px-3 py-2 rounded font-mono text-sm flex-grow text-[#E0E1DD]">{tokenInfo.contractAddress}</code>
                <button 
                  className="ml-2 text-[#A0A3A8] hover:text-[#F4A261]" 
                  title="Copy address"
                  onClick={() => navigator.clipboard.writeText(tokenInfo.contractAddress)}
                >
                  <span className="material-icons">content_copy</span>
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-[#A0A3A8] mb-1">Token Name</p>
              <p className="text-[#E0E1DD]">{tokenInfo.name} ({tokenInfo.symbol})</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-[#A0A3A8] mb-1">Total Supply</p>
              <p className="text-[#E0E1DD]">{tokenInfo.totalSupply.toLocaleString()} {tokenInfo.symbol}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-[#A0A3A8] mb-1">Network</p>
              <div className="flex items-center">
                <span className="material-icons text-[#F4A261] mr-1">bolt</span>
                <p className="text-[#E0E1DD]">{tokenInfo.network}</p>
              </div>
            </div>
          </div>
          
          <div>
            <div className="mb-4">
              <p className="text-sm text-[#A0A3A8] mb-1">Recent Token Transfers</p>
              <div className="mt-2 space-y-3">
                {recentTransfers.map((transfer) => (
                  <div key={transfer.id} className="p-3 bg-[#0D1B2A] rounded border border-[#2A3441]">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium text-[#E0E1DD]">
                          {transfer.amount.toLocaleString()} {tokenInfo.symbol} Transfer
                        </div>
                        <div className="text-xs text-[#A0A3A8]">
                          From: {formatAddress(transfer.from)} To: {formatAddress(transfer.to)}
                        </div>
                      </div>
                      <div className="text-xs text-[#A0A3A8]">
                        {formatTimestamp(transfer.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-2">
              <button className="w-full py-2 border border-[#F4A261] text-[#F4A261] rounded hover:bg-[#F4A261]/10 transition flex items-center justify-center">
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
