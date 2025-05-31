import { useState } from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';

interface TreemapChartProps {
  data: any[];
  title: string;
}

const TreemapChart = ({ data, title }: TreemapChartProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'Day' | 'Week' | 'Month' | 'Year'>('Week');

  // Flatten investment data for R-style heatmap display
  const investmentData = [
    { name: 'TechStart Inc.', symbol: 'TSI', value: 2450000, change: 8.5 },
    { name: 'AI Solutions LLC', symbol: 'AIS', value: 980000, change: 3.2 },
    { name: 'GreenTech Ventures', symbol: 'GTV', value: 890000, change: -2.1 },
    { name: 'BioTech Alpha', symbol: 'BTA', value: 650000, change: 5.7 },
    { name: 'FinTech Partners', symbol: 'FTP', value: 520000, change: -1.8 },
    { name: 'CloudOps Inc.', symbol: 'COI', value: 450000, change: 4.2 },
    { name: 'DataFlow Corp', symbol: 'DFC', value: 380000, change: -0.9 },
    { name: 'CyberSec Ltd', symbol: 'CSL', value: 290000, change: 2.1 },
    { name: 'RoboTech Ventures', symbol: 'RTV', value: 200000, change: -3.4 },
    { name: 'SpaceTech Alpha', symbol: 'STA', value: 325000, change: 1.8 },
    { name: 'QuantumCore Ltd', symbol: 'QCL', value: 260000, change: -1.2 },
    { name: 'MedTech Solutions', symbol: 'MTS', value: 180000, change: 0.3 }
  ];

  // R-style heatmap color gradient (like ggplot2)
  const getHeatmapColor = (value: number, min: number, max: number) => {
    // Normalize value between 0 and 1
    const normalized = (value - min) / (max - min);
    
    // R ggplot2 style gradient: white to steelblue equivalent
    const r = Math.round(255 - (normalized * 185)); // 255 to 70
    const g = Math.round(255 - (normalized * 125)); // 255 to 130
    const b = Math.round(255 - (normalized * 75));  // 255 to 180
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Find min and max values for color scaling
  const values = investmentData.map(item => item.change);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  // Custom treemap content component
  const CustomizedContent = (props: any) => {
    const { depth, x, y, width, height, payload } = props;
    
    if (payload && payload.change !== undefined) {
      const change = payload.change;
      
      // R-style gradient coloring
      const backgroundColor = getHeatmapColor(change, minValue, maxValue);
      
      // Text color based on background brightness
      const brightness = (0.299 * 70 + 0.587 * 130 + 0.114 * 180) / 255;
      const textColor = brightness > 0.5 ? '#000000' : '#ffffff';
      
      const fontSize = Math.min(width / 6, height / 3, 14);
      const smallFontSize = Math.min(width / 8, height / 4, 10);
      
      return (
        <g>
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            style={{
              fill: backgroundColor,
              stroke: '#ffffff',
              strokeWidth: 1,
              strokeOpacity: 0.8,
            }}
          />
          <text
            x={x + width / 2}
            y={y + height / 2 - 8}
            textAnchor="middle"
            fill={textColor}
            fontSize={fontSize}
            fontWeight="600"
          >
            {payload.symbol}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 8}
            textAnchor="middle"
            fill={textColor}
            fontSize={smallFontSize}
          >
            {`${change >= 0 ? '+' : ''}${change.toFixed(1)}%`}
          </text>
        </g>
      );
    }
    return null;
  };

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  // Calculate total portfolio metrics
  const totalValue = investmentData.reduce((sum, inv) => sum + inv.value, 0);
  const gainers = investmentData.filter(inv => inv.change > 0).length;
  const losers = investmentData.filter(inv => inv.change < 0).length;
  const avgReturn = investmentData.reduce((sum, inv) => sum + inv.change, 0) / investmentData.length;

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
      
      <div className="h-80 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={[{ name: 'Portfolio', children: investmentData }]}
            dataKey="value"
            aspectRatio={4/3}
            stroke="#fff"
            fill="#8884d8"
            content={<CustomizedContent />}
            animationBegin={0}
            animationDuration={800}
          >
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#f8f9fa', 
                border: '1px solid #dee2e6',
                borderRadius: '6px',
                color: '#333'
              }}
              formatter={(value: any, name: string, props: any) => {
                const payload = props.payload;
                if (payload.change !== undefined) {
                  return [
                    <div key="tooltip">
                      <div>Value: {formatValue(value)}</div>
                      <div>Change: {payload.change >= 0 ? '+' : ''}{payload.change.toFixed(1)}%</div>
                      {payload.symbol && <div>Symbol: {payload.symbol}</div>}
                    </div>,
                    payload.name
                  ];
                }
                return [formatValue(value), name];
              }}
            />
          </Treemap>
        </ResponsiveContainer>
      </div>
      
      {/* Portfolio Summary */}
      <div className="px-6 py-4 border-t border-[var(--grid-line)] grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-sm text-[var(--text-secondary)]">Total Value</div>
          <div className="text-lg font-bold text-[var(--text-primary)]">
            {formatValue(totalValue)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-[var(--text-secondary)]">Gainers</div>
          <div className="text-lg font-bold text-green-600">
            {gainers}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-[var(--text-secondary)]">Losers</div>
          <div className="text-lg font-bold text-red-600">
            {losers}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-[var(--text-secondary)]">Avg Return</div>
          <div className={`text-lg font-bold ${avgReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {avgReturn.toFixed(1)}%
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