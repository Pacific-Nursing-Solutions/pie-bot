import { useState } from 'react';
import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';

interface TreemapData {
  name: string;
  value: number;
  gain: number;
  isGain: boolean;
  category?: string;
  children?: TreemapData[];
}

interface TreemapChartProps {
  data: TreemapData[];
  title: string;
}

type TimeperiodType = 'day' | 'week' | 'month' | 'year';

const TreemapChart = ({ data, title }: TreemapChartProps) => {
  const [timePeriod, setTimePeriod] = useState<TimeperiodType>('week');
  const CustomizedContent = (props: any) => {
    const { root, depth, x, y, width, height, index, payload, colors } = props;

    if (!payload) {
      return null;
    }

    // Category headers (depth 0)
    if (depth === 0 && payload.children) {
      return (
        <g>
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            style={{
              fill: '#f8f9fa',
              stroke: '#dee2e6',
              strokeWidth: 2,
              fillOpacity: 0.1,
            }}
          />
          <text 
            x={x + 8} 
            y={y + 16} 
            fill="#6c757d"
            fontSize={12}
            fontWeight="bold"
          >
            {payload.category}
          </text>
        </g>
      );
    }

    // Individual investments (depth 1)
    if (depth === 1) {
      const isGain = payload.isGain || false;
      const name = payload.name || '';
      const gain = payload.gain || 0;
      const gainPercent = ((gain / payload.value) * 100).toFixed(2);

      return (
        <g>
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            style={{
              fill: isGain ? '#22c55e' : '#ef4444',
              stroke: '#fff',
              strokeWidth: 1,
              strokeOpacity: 1,
              fillOpacity: 0.8,
            }}
          />
          {width > 50 && height > 30 ? (
            <text 
              x={x + width / 2} 
              y={y + height / 2 - 5} 
              textAnchor="middle"
              fill="#fff"
              fontSize={width > 100 ? 11 : 9}
              fontWeight="bold"
            >
              {name.length > 8 ? name.substring(0, 8) + '...' : name}
            </text>
          ) : null}
          {width > 50 && height > 45 ? (
            <text 
              x={x + width / 2} 
              y={y + height / 2 + 10} 
              textAnchor="middle"
              fill="#fff"
              fontSize={8}
            >
              {isGain ? '+' : ''}{gainPercent}%
            </text>
          ) : null}
        </g>
      );
    }

    return null;
  };

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--subtle-border)] rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-[var(--text-secondary)]">
          {title}
        </h3>
        <div className="flex space-x-1">
          {(['day', 'week', 'month', 'year'] as TimeperiodType[]).map((period) => (
            <button
              key={period}
              onClick={() => setTimePeriod(period)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                timePeriod === period
                  ? 'bg-[var(--primary-brown)] text-white'
                  : 'bg-[var(--subtle-border)] text-[var(--text-secondary)] hover:bg-[var(--grid-line)]'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={data}
            dataKey="value"
            aspectRatio={4/3}
            stroke="#fff"
            fill="#8884d8"
            content={<CustomizedContent />}
          >
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#f8f9fa', 
                border: '1px solid #dee2e6',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#212529',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
              formatter={(value, name, props) => [
                `${props.payload.isGain ? '+' : ''}$${(props.payload.gain / 1000).toFixed(0)}K`,
                `${props.payload.name} ${props.payload.isGain ? 'Gain' : 'Loss'}`
              ]}
            />
          </Treemap>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-300 rounded"></div>
          <span>Gains</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-300 rounded"></div>
          <span>Losses</span>
        </div>
      </div>
    </div>
  );
};

export default TreemapChart;