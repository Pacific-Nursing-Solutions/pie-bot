import { useState } from 'react';

interface TreemapChartProps {
  data: any[];
  title: string;
}

const TreemapChart = ({ data, title }: TreemapChartProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'Day' | 'Week' | 'Month' | 'Year'>('Day');

  // Simple investment data for daily change heatmap
  const investments = [
    { name: 'TechStart Inc.', symbol: 'TSI', change: 8.5 },
    { name: 'AI Solutions LLC', symbol: 'AIS', change: 3.2 },
    { name: 'GreenTech Ventures', symbol: 'GTV', change: -2.1 },
    { name: 'BioTech Alpha', symbol: 'BTA', change: 5.7 },
    { name: 'FinTech Partners', symbol: 'FTP', change: -1.8 },
    { name: 'CloudOps Inc.', symbol: 'COI', change: 4.2 },
    { name: 'DataFlow Corp', symbol: 'DFC', change: -0.9 },
    { name: 'CyberSec Ltd', symbol: 'CSL', change: 2.1 },
    { name: 'RoboTech Ventures', symbol: 'RTV', change: -3.4 },
    { name: 'SpaceTech Alpha', symbol: 'STA', change: 1.8 },
    { name: 'QuantumCore Ltd', symbol: 'QCL', change: -1.2 },
    { name: 'MedTech Solutions', symbol: 'MTS', change: 0.3 }
  ];

  const getColor = (change: number) => {
    if (change > 0) {
      // Green for gains
      return change > 4 ? '#16a34a' : change > 2 ? '#22c55e' : '#86efac';
    } else {
      // Red for losses
      return change < -2 ? '#dc2626' : '#ef4444';
    }
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
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {investments.map((investment) => (
            <div
              key={investment.symbol}
              className="aspect-square flex flex-col items-center justify-center rounded border border-white/20 transition-transform hover:scale-105"
              style={{
                backgroundColor: getColor(investment.change),
                color: Math.abs(investment.change) > 1 ? '#ffffff' : '#000000'
              }}
            >
              <div className="text-sm font-bold">{investment.symbol}</div>
              <div className="text-xs">
                {investment.change >= 0 ? '+' : ''}{investment.change.toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TreemapChart;