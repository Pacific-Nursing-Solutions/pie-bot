interface WalletHolding {
  company: string;
  walletAddress: string;
  equityValue: number;
  percentage: number;
}

interface WalletSnapshotProps {
  holdings: WalletHolding[];
}

const WalletSnapshot = ({ holdings }: WalletSnapshotProps) => {
  // Filter wallets with >$100K equity
  const significantHoldings = holdings.filter(holding => holding.equityValue > 100000);

  if (significantHoldings.length === 0) {
    return null;
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--subtle-border)] rounded-lg p-6">
      <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">High-Value Wallet Holdings</h3>
      <div className="space-y-3">
        {significantHoldings.map((holding, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-[var(--grid-line)] last:border-b-0">
            <div>
              <div className="text-sm font-medium text-[var(--text-primary)]">{holding.company}</div>
              <div className="text-xs text-[var(--text-muted)]">{formatAddress(holding.walletAddress)}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                ${(holding.equityValue / 1000).toFixed(0)}K
              </div>
              <div className="text-xs text-[var(--text-secondary)]">
                {holding.percentage}% equity
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletSnapshot;