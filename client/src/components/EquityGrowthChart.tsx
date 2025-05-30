import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface GrowthDataPoint {
  period: string;
  roi30: number;
  roi60: number;
  roi90: number;
}

interface EquityGrowthChartProps {
  data: GrowthDataPoint[];
}

const EquityGrowthChart = ({ data }: EquityGrowthChartProps) => {
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--subtle-border)] rounded-lg p-6">
      <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Trailing ROI Performance</h3>
      
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
              label={{ value: 'ROI %', angle: -90, position: 'insideLeft' }}
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
                name === 'roi30' ? '30-day ROI' : 
                name === 'roi60' ? '60-day ROI' : '90-day ROI'
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="roi30" 
              stroke="#c8956d" 
              strokeWidth={2}
              dot={{ fill: '#c8956d', strokeWidth: 0, r: 2 }}
              activeDot={{ r: 4, fill: '#c8956d' }}
            />
            <Line 
              type="monotone" 
              dataKey="roi60" 
              stroke="#e4a574" 
              strokeWidth={2}
              dot={{ fill: '#e4a574', strokeWidth: 0, r: 2 }}
              activeDot={{ r: 4, fill: '#e4a574' }}
            />
            <Line 
              type="monotone" 
              dataKey="roi90" 
              stroke="#f4b97a" 
              strokeWidth={2}
              dot={{ fill: '#f4b97a', strokeWidth: 0, r: 2 }}
              activeDot={{ r: 4, fill: '#f4b97a' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center space-x-4 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#c8956d]"></div>
          <span className="text-xs text-[var(--text-secondary)]">30-day</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#e4a574]"></div>
          <span className="text-xs text-[var(--text-secondary)]">60-day</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#f4b97a]"></div>
          <span className="text-xs text-[var(--text-secondary)]">90-day</span>
        </div>
      </div>
    </div>
  );
};

export default EquityGrowthChart;