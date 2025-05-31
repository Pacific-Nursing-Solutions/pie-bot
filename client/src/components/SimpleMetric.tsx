import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

interface SimpleMetricProps {
  label: string;
  value: string;
  sparklineData: { days: string; value: number }[];
  trend?: 'up' | 'down' | 'neutral';
  startDate?: string;
  endDate?: string;
}

const SimpleMetric = ({ label, value, sparklineData, trend, startDate, endDate }: SimpleMetricProps) => {
  const chartData = sparklineData;
  
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--subtle-border)] rounded-lg p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-sm text-[var(--text-secondary)] mb-2">{label}</h3>
          <div className="text-3xl font-light text-[var(--text-primary)]">{value}</div>
        </div>
        {trend && (
          <div className={`px-2 py-1 rounded text-xs ${
            trend === 'up' ? 'bg-[var(--data-success)]/10 text-[var(--data-success)]' :
            trend === 'down' ? 'bg-[var(--data-danger)]/10 text-[var(--data-danger)]' :
            'bg-[var(--text-secondary)]/10 text-[var(--text-secondary)]'
          }`}>
            {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
          </div>
        )}
      </div>
      
      <div className="h-16 mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <YAxis 
              domain={['dataMin * 0.95', 'dataMax * 1.05']}
              tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
              axisLine={false}
              tickLine={false}
              width={40}
              tickCount={4}
              tickFormatter={(value) => {
                if (label.includes('Portfolio Value')) {
                  return `$${(value/1000000).toFixed(1)}M`;
                } else if (label.includes('Equity Holdings')) {
                  return `${value.toFixed(1)}%`;
                } else {
                  return `${(value/1000).toFixed(0)}K`;
                }
              }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card-bg)', 
                border: '1px solid var(--subtle-border)',
                borderRadius: '6px',
                fontSize: '12px'
              }}
              formatter={(value) => [`$${value.toLocaleString()}`, label]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#c8956d"
              strokeWidth={2}
              dot={{ fill: '#c8956d', strokeWidth: 0, r: 2 }}
              activeDot={{ r: 4, fill: '#c8956d' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {startDate && endDate && (
        <div className="flex justify-between text-xs text-[var(--text-secondary)]">
          <span>{startDate}</span>
          <span>{endDate}</span>
        </div>
      )}
    </div>
  );
};

export default SimpleMetric;