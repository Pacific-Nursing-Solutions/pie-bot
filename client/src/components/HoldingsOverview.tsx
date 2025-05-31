import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface HoldingPosition {
  id: number;
  name: string;
  symbol: string;
  change24h: number;
  change7d: number;
  marketCap: number;
  volume24h: number;
  supply: number;
  sparklineData: { value: number }[];
}

interface HoldingsOverviewProps {
  positions: HoldingPosition[];
  portfolioSparkline: { value: number }[];
}

const HoldingsOverview = ({ positions, portfolioSparkline }: HoldingsOverviewProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatNumber = (num: number): string => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatPercentage = (num: number): string => {
    const formatted = num.toFixed(2);
    return num >= 0 ? `+${formatted}%` : `${formatted}%`;
  };

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--subtle-border)] rounded-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--grid-line)]">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-[var(--text-primary)]">Holdings Overview</h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Portfolio Overview - Single Line */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[var(--primary-brown)] to-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div>
              <span className="font-semibold text-lg text-[var(--text-primary)]">Total Portfolio</span>
              <div className="text-sm text-[var(--text-secondary)]">{positions.length} companies</div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="font-bold text-xl text-[var(--text-primary)]">
                {formatNumber(positions.reduce((sum, p) => sum + p.marketCap * 0.35, 0))}
              </div>
              <div className="text-green-500 text-sm font-medium">
                +2.3% today
              </div>
            </div>
            
            <div className="w-24 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={portfolioSparkline}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoldingsOverview;