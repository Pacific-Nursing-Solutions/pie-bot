import { useState } from 'react';

interface StockData {
  symbol: string;
  company?: string;
  price?: number;
  change: number;
  marketCap?: number;
}

interface TreemapChartProps {
  data: any[];
  title: string;
}

const TreemapChart = ({ data, title }: TreemapChartProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'Day' | 'Week' | 'Month' | 'Year'>('Week');

  // Sample stock data that matches the image
  const stockData: StockData[] = [
    { symbol: 'AAPL', company: 'Apple Inc.', price: 130.03, change: -1.39, marketCap: 2.07 },
    { symbol: 'GOOGL', company: 'Alphabet Inc.', change: -2.09 },
    { symbol: 'MSFT', company: 'Microsoft Corp.', change: -0.74 },
    { symbol: 'JNJ', company: 'Johnson & Johnson', change: -0.03 },
    { symbol: 'NVDA', company: 'NVIDIA Corp.', change: -7.14 },
    { symbol: 'BAC', company: 'Bank of America', change: 0.18 },
    { symbol: 'MRK', company: 'Merck & Co.', change: 0.23 },
    { symbol: 'BAC-PE', change: 1.05 },
    { symbol: 'MCD', company: 'McDonald\'s Corp.', change: -0.27 },
    { symbol: 'CSCO', company: 'Cisco Systems', change: 0.11 },
    { symbol: 'DHR', company: 'Danaher Corp.', change: 0.39 },
    { symbol: 'TOM', change: 1.39 },
    { symbol: 'CVX', company: 'Chevron Corp.', change: 1.26 },
    { symbol: 'JPM-PD', change: -0.92 },
    { symbol: 'KO', company: 'Coca-Cola Co.', change: 0.61 },
    { symbol: 'AVGO', company: 'Broadcom Inc.', change: 0.2 },
    { symbol: 'TMUS', company: 'T-Mobile US', change: 0.69 },
    { symbol: 'ADBE', change: -0.09 },
    { symbol: 'BMY', change: -0.48 },
    { symbol: 'SCHW', change: 0.65 },
    { symbol: 'PM', change: 0.35 },
    { symbol: 'META', company: 'Meta Platforms', change: -0.98 },
    { symbol: 'LLY', company: 'Eli Lilly', change: -0.82 },
    { symbol: 'BHP', company: 'BHP Group', change: 1.11 },
    { symbol: 'ACN', change: -0.29 },
    { symbol: 'HON', change: 0.48 },
    { symbol: 'LMT', change: 0.46 },
    { symbol: 'CAT', change: 1.36 },
    { symbol: 'BRK-B', company: 'Berkshire Hathaway', change: -0.31 },
    { symbol: 'V', company: 'Visa Inc.', change: 0.22 },
    { symbol: 'TSLA', company: 'Tesla Inc.', change: -11.41 },
    { symbol: 'NVO', company: 'Novo Nordisk', change: -0.56 },
    { symbol: 'BML-PH', change: -0.31 },
    { symbol: 'ORCL', company: 'Oracle Corp.', change: 0.16 },
    { symbol: 'NEE', change: -0.2 },
    { symbol: 'SAP', change: 0.02 },
    { symbol: 'AXP', change: 0.43 },
    { symbol: 'BML-PG', change: -0.63 },
    { symbol: 'VZ', company: 'Verizon', change: 1.19 },
    { symbol: 'RY', change: 0.51 },
    { symbol: 'TD', change: 0.69 },
    { symbol: 'PLD', change: -0.20 },
    { symbol: 'ASML', company: 'ASML Holding', change: -2.57 },
    { symbol: 'T', company: 'AT&T Inc.', change: 1.52 },
    { symbol: 'C-PJ', change: -0.28 },
    { symbol: 'MDT', change: 0.18 },
    { symbol: 'BNY', change: 0.82 },
    { symbol: 'CI', change: -0.06 },
    { symbol: 'BAC-PK', change: -1.2 },
    { symbol: 'TMO', company: 'Thermo Fisher', change: 0.88 },
    { symbol: 'LIN', company: 'Linde plc', change: -0.12 },
    { symbol: 'CRM', change: 0.94 },
    { symbol: 'BUD', change: 0.62 },
    { symbol: 'AMD', change: -1.90 },
    { symbol: 'JPM-PC', change: -0.87 },
    { symbol: 'PEP', company: 'PepsiCo Inc.', change: 0.44 },
    { symbol: 'DE', change: 1.12 },
    { symbol: 'EQNR', change: 1.45 },
    { symbol: 'WMT', company: 'Walmart Inc.', change: -0.02 }
  ];

  // Calculate tile sizes based on market cap or use equal sizes
  const calculateTileSize = (stock: StockData, index: number) => {
    // Create varied sizes for visual interest
    const baseSizes = [120, 100, 80, 140, 90, 70, 110, 85, 95, 75];
    return baseSizes[index % baseSizes.length] || 90;
  };

  // Arrange tiles in a grid-like pattern
  const arrangeTiles = (): Array<StockData & { x: number; y: number; width: number; height: number }> => {
    const tiles: Array<StockData & { x: number; y: number; width: number; height: number }> = [];
    let x = 0;
    let y = 0;
    let rowHeight = 0;
    const containerWidth = 800; // Approximate container width

    stockData.forEach((stock, index) => {
      const size = calculateTileSize(stock, index);
      
      // Check if we need to wrap to next row
      if (x + size > containerWidth) {
        x = 0;
        y += rowHeight + 2; // 2px gap
        rowHeight = 0;
      }
      
      tiles.push({
        ...stock,
        x,
        y,
        width: size,
        height: 60 + (Math.abs(stock.change) * 2), // Vary height slightly based on change
      });
      
      x += size + 2; // 2px gap
      rowHeight = Math.max(rowHeight, 60 + (Math.abs(stock.change) * 2));
    });
    
    return tiles;
  };

  const tiles = arrangeTiles();

  const getBackgroundColor = (change: number) => {
    if (change > 0) {
      return change > 1 ? '#22c55e' : '#86efac'; // Darker green for bigger gains
    } else {
      return change < -1 ? '#ef4444' : '#fca5a5'; // Darker red for bigger losses
    }
  };

  const getTextColor = (change: number) => {
    return Math.abs(change) > 0.5 ? '#ffffff' : '#000000';
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
      
      <div className="h-80 p-4 overflow-hidden">
        <div className="relative w-full h-full">
          <svg width="100%" height="100%" viewBox="0 0 800 320">
            {tiles.map((tile, index) => (
              <g key={tile.symbol}>
                <rect
                  x={tile.x}
                  y={tile.y}
                  width={tile.width}
                  height={tile.height}
                  fill={getBackgroundColor(tile.change)}
                  stroke="#ffffff"
                  strokeWidth="1"
                  rx="2"
                />
                <text
                  x={tile.x + tile.width / 2}
                  y={tile.y + tile.height / 2 - 8}
                  textAnchor="middle"
                  fill={getTextColor(tile.change)}
                  fontSize={Math.min(tile.width / 8, 14)}
                  fontWeight="bold"
                >
                  {tile.symbol}
                </text>
                <text
                  x={tile.x + tile.width / 2}
                  y={tile.y + tile.height / 2 + 8}
                  textAnchor="middle"
                  fill={getTextColor(tile.change)}
                  fontSize={Math.min(tile.width / 10, 12)}
                >
                  {tile.change >= 0 ? '+' : ''}{tile.change.toFixed(2)}%
                </text>
                {tile.company && tile.width > 100 && (
                  <text
                    x={tile.x + tile.width / 2}
                    y={tile.y + tile.height - 8}
                    textAnchor="middle"
                    fill={getTextColor(tile.change)}
                    fontSize="8"
                    opacity="0.8"
                  >
                    {tile.company.length > 12 ? tile.company.substring(0, 12) + '...' : tile.company}
                  </text>
                )}
              </g>
            ))}
          </svg>
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