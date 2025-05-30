import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface EquityDataPoint {
  month: string;
  growth: number;
  distributions: number;
}

interface EquityGrowthChartProps {
  data: EquityDataPoint[];
}

const EquityGrowthChart = ({ data }: EquityGrowthChartProps) => {
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--subtle-border)] rounded-lg p-6">
      <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Equity Performance</h3>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card-bg)', 
                border: '1px solid var(--subtle-border)',
                borderRadius: '6px',
                fontSize: '12px'
              }}
              formatter={(value, name) => [
                `${value}%`, 
                name === 'growth' ? 'Growth' : 'Distributions'
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="growth" 
              stroke="#c8956d" 
              strokeWidth={2}
              dot={{ fill: '#c8956d', strokeWidth: 0, r: 3 }}
              activeDot={{ r: 4, fill: '#c8956d' }}
            />
            <Line 
              type="monotone" 
              dataKey="distributions" 
              stroke="#e4a574" 
              strokeWidth={2}
              dot={{ fill: '#e4a574', strokeWidth: 0, r: 3 }}
              activeDot={{ r: 4, fill: '#e4a574' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#c8956d]"></div>
          <span className="text-sm text-[var(--text-secondary)]">Growth</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#e4a574]"></div>
          <span className="text-sm text-[var(--text-secondary)]">Distributions</span>
        </div>
      </div>
    </div>
  );
};

export default EquityGrowthChart;