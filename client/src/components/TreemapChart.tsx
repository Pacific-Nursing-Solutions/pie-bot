import { useState } from 'react';
import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';

interface TreemapData {
  name: string;
  value: number;
  gain: number;
  isGain: boolean;
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

    // Handle undefined payload or missing properties
    if (!payload || depth !== 1) {
      return (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: '#c8956d',
            stroke: '#fff',
            strokeWidth: 1,
            strokeOpacity: 1,
            fillOpacity: 0.8,
          }}
        />
      );
    }

    const isGain = payload.isGain || false;
    const name = payload.name || '';
    const gain = payload.gain || 0;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: isGain ? '#86efac' : '#fca5a5',
            stroke: '#fff',
            strokeWidth: 2,
            strokeOpacity: 1,
            fillOpacity: 0.8,
          }}
        />
        {width > 60 ? (
          <text 
            x={x + width / 2} 
            y={y + height / 2} 
            textAnchor="middle"
            fill="#fff"
            fontSize={width > 80 ? 12 : 10}
            fontWeight="bold"
          >
            {name}
          </text>
        ) : null}
        {height > 40 ? (
          <text 
            x={x + width / 2} 
            y={y + height / 2 + 15} 
            textAnchor="middle"
            fill="#fff"
            fontSize={9}
          >
            {isGain ? '+' : ''}${(gain / 1000).toFixed(0)}K
          </text>
        ) : null}
      </g>
    );
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