import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip, Legend } from 'recharts';

interface CombinedMetricsProps {
  revenueData: number[];
  runwayData: number[];
}

const CombinedMetrics = ({ revenueData, runwayData }: CombinedMetricsProps) => {
  const chartData = revenueData.map((revenue, index) => ({
    index,
    revenue,
    runway: runwayData[index] || 0
  }));

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--subtle-border)] rounded-lg p-6">
      <div className="grid grid-cols-2 gap-6 mb-4">
        <div>
          <h3 className="text-sm text-[var(--text-secondary)] mb-1">Monthly Recurring Revenue</h3>
          <div className="text-2xl font-light text-[var(--text-primary)]">$38.5K</div>
        </div>
        <div>
          <h3 className="text-sm text-[var(--text-secondary)] mb-1">Cash Runway</h3>
          <div className="text-2xl font-light text-[var(--text-primary)]">14 months</div>
        </div>
      </div>
      
      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <YAxis 
              yAxisId="revenue"
              orientation="left"
              domain={['dataMin - 1000', 'dataMax + 1000']}
              tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
              axisLine={false}
              tickLine={false}
              width={35}
              tickFormatter={(value) => `${(value/1000).toFixed(0)}K`}
            />
            <YAxis 
              yAxisId="runway"
              orientation="right"
              domain={['dataMin - 1', 'dataMax + 1']}
              tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
              axisLine={false}
              tickLine={false}
              width={25}
              tickFormatter={(value) => `${value}m`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card-bg)', 
                border: '1px solid var(--subtle-border)',
                borderRadius: '6px',
                fontSize: '12px'
              }}
              formatter={(value, name) => [
                name === 'revenue' ? `$${value.toLocaleString()}` : `${value} months`,
                name === 'revenue' ? 'Revenue' : 'Runway'
              ]}
            />
            <Line
              yAxisId="revenue"
              type="monotone"
              dataKey="revenue"
              stroke="#c8956d"
              strokeWidth={2}
              dot={{ fill: '#c8956d', strokeWidth: 0, r: 2 }}
              activeDot={{ r: 3, fill: '#c8956d' }}
            />
            <Line
              yAxisId="runway"
              type="monotone"
              dataKey="runway"
              stroke="#e4a574"
              strokeWidth={2}
              dot={{ fill: '#e4a574', strokeWidth: 0, r: 2 }}
              activeDot={{ r: 3, fill: '#e4a574' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-2">
        <span>Jan 2024</span>
        <span>May 2024</span>
      </div>
    </div>
  );
};

export default CombinedMetrics;