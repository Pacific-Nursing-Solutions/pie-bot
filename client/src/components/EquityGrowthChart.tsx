import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface GrowthDataPoint {
  days: string;
  roi: number;
}

interface EquityGrowthChartProps {
  data: GrowthDataPoint[];
}

const EquityGrowthChart = ({ data }: EquityGrowthChartProps) => {
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--subtle-border)] rounded-lg p-6">
      <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">ROI Performance</h3>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis 
              dataKey="days" 
              tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
              axisLine={false}
              tickLine={false}
              label={{ value: 'Days', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
              axisLine={false}
              tickLine={false}
              label={{ value: 'ROI %', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card-bg)', 
                border: '1px solid var(--subtle-border)',
                borderRadius: '6px',
                fontSize: '12px'
              }}
              formatter={(value) => [`${value}%`, 'ROI']}
            />
            <Line 
              type="monotone" 
              dataKey="roi" 
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

export default EquityGrowthChart;