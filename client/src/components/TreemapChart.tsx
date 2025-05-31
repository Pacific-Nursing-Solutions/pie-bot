import { useState } from 'react';

interface TreemapChartProps {
  data: any[];
  title: string;
}

const TreemapChart = ({ data, title }: TreemapChartProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'Day' | 'Week' | 'Month' | 'Year'>('Day');

  // Investment data with position values for proportional sizing
  const investments = [
    { name: 'TechStart Inc.', symbol: 'TSI', change: 8.5, value: 2450000 },
    { name: 'AI Solutions LLC', symbol: 'AIS', change: 3.2, value: 980000 },
    { name: 'GreenTech Ventures', symbol: 'GTV', change: -2.1, value: 890000 },
    { name: 'BioTech Alpha', symbol: 'BTA', change: 5.7, value: 650000 },
    { name: 'FinTech Partners', symbol: 'FTP', change: -1.8, value: 520000 },
    { name: 'CloudOps Inc.', symbol: 'COI', change: 4.2, value: 450000 },
    { name: 'DataFlow Corp', symbol: 'DFC', change: -0.9, value: 380000 },
    { name: 'CyberSec Ltd', symbol: 'CSL', change: 2.1, value: 290000 },
    { name: 'RoboTech Ventures', symbol: 'RTV', change: -3.4, value: 200000 },
    { name: 'SpaceTech Alpha', symbol: 'STA', change: 1.8, value: 325000 },
    { name: 'QuantumCore Ltd', symbol: 'QCL', change: -1.2, value: 260000 },
    { name: 'MedTech Solutions', symbol: 'MTS', change: 0.3, value: 180000 }
  ];

  const totalValue = investments.reduce((sum, inv) => sum + inv.value, 0);

  const getColor = (change: number) => {
    if (change > 0) {
      // Green for gains
      return change > 4 ? '#16a34a' : change > 2 ? '#22c55e' : '#86efac';
    } else {
      // Red for losses
      return change < -2 ? '#dc2626' : '#ef4444';
    }
  };

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const getSquareSize = (value: number) => {
    const percentage = (value / totalValue) * 100;
    // Scale from 80px to 180px based on portfolio percentage
    const minSize = 80;
    const maxSize = 180;
    return minSize + (percentage / 40) * (maxSize - minSize); // 40% is roughly max for largest position
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
        <div className="flex flex-wrap gap-2 justify-center">
          {investments.map((investment) => {
            const size = getSquareSize(investment.value);
            return (
              <div
                key={investment.symbol}
                className="flex flex-col items-center justify-center rounded border border-white/20 transition-transform hover:scale-105"
                style={{
                  backgroundColor: getColor(investment.change),
                  color: Math.abs(investment.change) > 1 ? '#ffffff' : '#000000',
                  width: `${size}px`,
                  height: `${size}px`,
                  minWidth: '80px',
                  minHeight: '80px'
                }}
              >
                <div className="text-sm font-bold">{investment.symbol}</div>
                <div className="text-xs">
                  {investment.change >= 0 ? '+' : ''}{investment.change.toFixed(1)}%
                </div>
                <div className="text-xs mt-1 opacity-90">
                  {formatValue(investment.value)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TreemapChart;