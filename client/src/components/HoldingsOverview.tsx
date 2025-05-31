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

      {/* Portfolio Overview */}
      <div className="px-6 py-4 border-b border-[var(--grid-line)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-[var(--primary-brown)] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <div>
              <span className="font-medium text-[var(--text-primary)]">Total Portfolio</span>
              <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                <span className="text-red-500">-2.8%</span>
                <span className="text-red-500">-5.2%</span>
                <span>{formatNumber(4160000)}</span>
              </div>
            </div>
          </div>
          <div className="w-32 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={portfolioSparkline}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#c8956d"
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Individual Positions */}
      {isExpanded && (
        <div className="divide-y divide-[var(--grid-line)]">
          {/* Headers */}
          <div className="px-6 py-3 text-xs text-[var(--text-secondary)] grid grid-cols-12 gap-4">
            <div className="col-span-1">#</div>
            <div className="col-span-3">Name</div>
            <div className="col-span-1">24h %</div>
            <div className="col-span-1">7d %</div>
            <div className="col-span-2">Market Cap</div>
            <div className="col-span-2">Volume(24h)</div>
            <div className="col-span-1">Supply</div>
            <div className="col-span-1">Last 7 Days</div>
          </div>

          {/* Position Rows */}
          {positions.map((position) => (
            <div key={position.id} className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-[var(--subtle-border)] transition-colors">
              <div className="col-span-1">
                <span className="text-sm text-[var(--text-secondary)]">{position.id}</span>
              </div>
              
              <div className="col-span-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[var(--primary-brown)] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">{position.symbol[0]}</span>
                  </div>
                  <div>
                    <div className="font-medium text-[var(--text-primary)]">{position.name}</div>
                    <div className="text-xs text-[var(--text-secondary)]">{position.symbol}</div>
                  </div>
                </div>
              </div>

              <div className="col-span-1">
                <span className={`text-sm font-medium ${position.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatPercentage(position.change24h)}
                </span>
              </div>

              <div className="col-span-1">
                <span className={`text-sm font-medium ${position.change7d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatPercentage(position.change7d)}
                </span>
              </div>

              <div className="col-span-2">
                <span className="text-sm text-[var(--text-primary)]">{formatNumber(position.marketCap)}</span>
              </div>

              <div className="col-span-2">
                <span className="text-sm text-[var(--text-primary)]">{formatNumber(position.volume24h)}</span>
              </div>

              <div className="col-span-1">
                <span className="text-sm text-[var(--text-primary)]">{formatNumber(position.supply)}</span>
              </div>

              <div className="col-span-1">
                <div className="w-20 h-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={position.sparklineData}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={position.change7d >= 0 ? '#22c55e' : '#ef4444'}
                        strokeWidth={1.5}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HoldingsOverview;