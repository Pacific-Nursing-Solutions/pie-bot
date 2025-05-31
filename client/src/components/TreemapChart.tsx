import { useState } from 'react';

interface TreemapChartProps {
  data: any[];
  title: string;
}

interface Investment {
  name: string;
  symbol: string;
  change: number;
  value: number;
}

const TreemapChart = ({ data, title }: TreemapChartProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'Day' | 'Week' | 'Month' | 'Year'>('Day');

  // Investment data with position values for proportional sizing
  const investments: Investment[] = [
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

  // Simple treemap layout algorithm (squarified treemap approximation)
  const createTreemapLayout = () => {
    const container = { width: 600, height: 400 };
    const sortedData = [...investments].sort((a, b) => b.value - a.value);
    
    const rectangles: Array<Investment & { x: number; y: number; width: number; height: number }> = [];
    
    let x = 0, y = 0;
    let rowHeight = 0;
    const padding = 2;
    
    for (let i = 0; i < sortedData.length; i++) {
      const item = sortedData[i];
      const area = (item.value / totalValue) * (container.width * container.height);
      const aspectRatio = container.width / container.height;
      
      // Simple width/height calculation based on area
      let width = Math.sqrt(area * aspectRatio);
      let height = area / width;
      
      // Adjust for remaining space
      if (x + width > container.width) {
        x = 0;
        y += rowHeight + padding;
        rowHeight = 0;
      }
      
      // Clamp to remaining space
      if (x + width > container.width) {
        width = container.width - x;
        height = area / width;
      }
      
      if (y + height > container.height) {
        height = container.height - y;
      }
      
      rectangles.push({
        ...item,
        x,
        y,
        width: Math.max(width - padding, 20),
        height: Math.max(height - padding, 20)
      });
      
      x += width;
      rowHeight = Math.max(rowHeight, height);
    }
    
    return rectangles;
  };

  const rectangles = createTreemapLayout();

  const getColor = (change: number) => {
    // Gradient from bright red (losses) through neutral to bright green (gains)
    if (change > 0) {
      // Positive changes: light green to bright green
      const intensity = Math.min(change / 10, 1); // Normalize to 0-1
      const lightness = 75 - (intensity * 40); // 75% to 35% lightness
      const saturation = 40 + (intensity * 50); // 40% to 90% saturation
      return `hsl(120, ${saturation}%, ${lightness}%)`;
    } else if (change < 0) {
      // Negative changes: light red to bright red
      const intensity = Math.min(Math.abs(change) / 10, 1); // Normalize to 0-1
      const lightness = 75 - (intensity * 40); // 75% to 35% lightness
      const saturation = 40 + (intensity * 50); // 40% to 90% saturation
      return `hsl(0, ${saturation}%, ${lightness}%)`;
    }
    return '#f5f5f5'; // Very light gray for zero change
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
        <div className="relative w-full h-96 overflow-hidden">
          <svg width="100%" height="100%" viewBox="0 0 600 400" className="bg-gray-50 dark:bg-gray-800 rounded">
            {rectangles.map((rect) => (
              <g key={rect.symbol}>
                <rect
                  x={rect.x}
                  y={rect.y}
                  width={rect.width}
                  height={rect.height}
                  fill={getColor(rect.change)}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="transition-opacity hover:opacity-80"
                />
                {rect.width > 30 && rect.height > 25 && (
                  <>
                    <text
                      x={rect.x + rect.width / 2}
                      y={rect.y + rect.height / 2 - 6}
                      textAnchor="middle"
                      fontSize={rect.width > 60 ? "12" : "10"}
                      fontWeight="bold"
                      fill={Math.abs(rect.change) > 3 ? '#ffffff' : '#000000'}
                    >
                      {rect.symbol}
                    </text>
                    <text
                      x={rect.x + rect.width / 2}
                      y={rect.y + rect.height / 2 + 8}
                      textAnchor="middle"
                      fontSize={rect.width > 60 ? "10" : "8"}
                      fill={Math.abs(rect.change) > 3 ? '#ffffff' : '#000000'}
                    >
                      {rect.change >= 0 ? '+' : ''}{rect.change.toFixed(1)}%
                    </text>
                    {rect.height > 35 && rect.width > 50 && (
                      <text
                        x={rect.x + rect.width / 2}
                        y={rect.y + rect.height / 2 + 20}
                        textAnchor="middle"
                        fontSize="8"
                        fill={Math.abs(rect.change) > 3 ? '#ffffff' : '#000000'}
                        opacity="0.8"
                      >
                        {formatValue(rect.value)}
                      </text>
                    )}
                  </>
                )}
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TreemapChart;