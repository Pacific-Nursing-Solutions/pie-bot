import { useState } from 'react';

interface PortfolioPosition {
  name: string;
  symbol: string;
  value: number;
  change: number;
  percentage: number; // Percentage of total portfolio
}

interface TreemapChartProps {
  data: any[];
  title: string;
}

const TreemapChart = ({ data, title }: TreemapChartProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'Day' | 'Week' | 'Month' | 'Year'>('Week');

  // Portfolio positions based on actual investment data
  const portfolioPositions: PortfolioPosition[] = [
    { name: 'TechStart Inc.', symbol: 'TSI', value: 2450000, change: 8.5, percentage: 35.2 },
    { name: 'AI Solutions LLC', symbol: 'AIS', value: 980000, change: 3.2, percentage: 14.1 },
    { name: 'GreenTech Ventures', symbol: 'GTV', value: 890000, change: -2.1, percentage: 12.8 },
    { name: 'BioTech Alpha', symbol: 'BTA', value: 650000, change: 5.7, percentage: 9.3 },
    { name: 'FinTech Partners', symbol: 'FTP', value: 520000, change: -1.8, percentage: 7.5 },
    { name: 'CloudOps Inc.', symbol: 'COI', value: 450000, change: 4.2, percentage: 6.5 },
    { name: 'DataFlow Corp', symbol: 'DFC', value: 380000, change: -0.9, percentage: 5.5 },
    { name: 'CyberSec Ltd', symbol: 'CSL', value: 290000, change: 2.1, percentage: 4.2 },
    { name: 'RoboTech Ventures', symbol: 'RTV', value: 210000, change: -3.4, percentage: 3.0 },
    { name: 'SpaceTech Alpha', symbol: 'STA', value: 125000, change: 1.8, percentage: 1.8 }
  ];

  // Calculate proportional sizes based on portfolio percentage
  const calculateSize = (position: PortfolioPosition) => {
    // Base the size on the percentage of portfolio
    const minSize = 80;
    const maxSize = 200;
    const sizeRange = maxSize - minSize;
    return minSize + (position.percentage / 100) * sizeRange;
  };

  const getBackgroundColor = (change: number) => {
    if (change > 0) {
      // Green shades for gains
      if (change > 5) return '#16a34a'; // Dark green for big gains
      if (change > 2) return '#22c55e'; // Medium green
      return '#86efac'; // Light green for small gains
    } else if (change < 0) {
      // Red shades for losses
      if (change < -5) return '#dc2626'; // Dark red for big losses
      if (change < -2) return '#ef4444'; // Medium red
      return '#fca5a5'; // Light red for small losses
    }
    return '#e5e7eb'; // Neutral gray for no change
  };

  const getTextColor = (change: number) => {
    return Math.abs(change) > 1 ? '#ffffff' : '#000000';
  };

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--subtle-border)] rounded-lg">
      <div className="px-6 py-4 border-b border-[var(--grid-line)]">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-[var(--text-primary)]">{title}</h3>
          <div className="flex gap-2">
            {(['Day', 'Week', 'Month', 'Year'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  selectedPeriod === period
                    ? 'bg-[var(--primary-brown)] text-white'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--subtle-border)]'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {portfolioPositions.map((position) => {
            const size = calculateSize(position);
            const bgColor = getBackgroundColor(position.change);
            const textColor = getTextColor(position.change);
            
            return (
              <div
                key={position.symbol}
                className="relative rounded-lg border border-white/20 p-3 hover:scale-105 transition-transform cursor-pointer"
                style={{
                  backgroundColor: bgColor,
                  color: textColor,
                  minHeight: `${Math.max(size * 0.7, 80)}px`,
                  flexBasis: `${Math.max(size * 0.6, 120)}px`
                }}
                title={`${position.name} - ${formatValue(position.value)} (${position.percentage}% of portfolio)`}
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="font-bold text-sm mb-1">{position.symbol}</div>
                    <div className="text-xs opacity-90 mb-2 leading-tight">
                      {position.name.length > 15 ? position.name.substring(0, 15) + '...' : position.name}
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="text-xs font-medium mb-1">
                      {position.change >= 0 ? '+' : ''}{position.change.toFixed(1)}%
                    </div>
                    <div className="text-xs opacity-80">
                      {position.percentage}% of portfolio
                    </div>
                    <div className="text-xs opacity-80">
                      {formatValue(position.value)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Portfolio Summary */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[var(--grid-line)]">
          <div className="text-center">
            <div className="text-sm text-[var(--text-secondary)]">Total Value</div>
            <div className="text-lg font-bold text-[var(--text-primary)]">
              {formatValue(portfolioPositions.reduce((sum, pos) => sum + pos.value, 0))}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-[var(--text-secondary)]">Gainers</div>
            <div className="text-lg font-bold text-green-600">
              {portfolioPositions.filter(pos => pos.change > 0).length}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-[var(--text-secondary)]">Losers</div>
            <div className="text-lg font-bold text-red-600">
              {portfolioPositions.filter(pos => pos.change < 0).length}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-[var(--text-secondary)]">Avg Return</div>
            <div className={`text-lg font-bold ${
              portfolioPositions.reduce((sum, pos) => sum + pos.change, 0) / portfolioPositions.length >= 0 
                ? 'text-green-600' : 'text-red-600'
            }`}>
              {((portfolioPositions.reduce((sum, pos) => sum + pos.change, 0) / portfolioPositions.length)).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="px-6 py-3 border-t border-[var(--grid-line)] flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-[var(--text-secondary)]">Losses</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span className="text-[var(--text-secondary)]">Neutral</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-[var(--text-secondary)]">Gains</span>
        </div>
      </div>
    </div>
  );
};

export default TreemapChart;