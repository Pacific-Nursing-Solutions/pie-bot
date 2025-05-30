import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface DistributionDataPoint {
  period: string;
  amount: number;
}

interface DistributionsChartProps {
  data: DistributionDataPoint[];
}

const DistributionsChart = ({ data }: DistributionsChartProps) => {
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--subtle-border)] rounded-lg p-6">
      <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Distribution Payments</h3>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis 
              dataKey="period" 
              tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
              axisLine={false}
              tickLine={false}
              label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card-bg)', 
                border: '1px solid var(--subtle-border)',
                borderRadius: '6px',
                fontSize: '12px'
              }}
              formatter={(value) => [`$${value.toLocaleString()}`, 'Distribution']}
            />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#c8956d" 
              strokeWidth={2}
              dot={{ fill: '#c8956d', strokeWidth: 0, r: 3 }}
              activeDot={{ r: 4, fill: '#c8956d' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DistributionsChart;