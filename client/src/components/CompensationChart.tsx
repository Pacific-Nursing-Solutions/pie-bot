import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CompensationDataPoint {
  month: string;
  totalCompensation: number;
  cashCompensation: number;
  equityCompensation: number;
}

interface CompensationChartProps {
  data: CompensationDataPoint[];
}

const CompensationChart = ({ data }: CompensationChartProps) => {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="bg-[#1C1F2B] rounded-lg p-4 sm:p-6 shadow border border-[#2A3441]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
        <h3 className="text-lg font-semibold text-[#E0E1DD]">
          Monthly Total Compensation
        </h3>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#F4A261] rounded-full"></div>
            <span className="text-[#A0A3A8]">Total</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#2A9D8F] rounded-full"></div>
            <span className="text-[#A0A3A8]">Cash</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#FFD166] rounded-full"></div>
            <span className="text-[#A0A3A8]">Equity</span>
          </div>
        </div>
      </div>
      
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="month" 
              className="text-gray-600 dark:text-gray-400"
              tick={{ fontSize: 10 }}
            />
            <YAxis 
              className="text-gray-600 dark:text-gray-400"
              tick={{ fontSize: 10 }}
              tickFormatter={formatCurrency}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [formatCurrency(value), name]}
              labelClassName="text-gray-900 dark:text-gray-100"
              contentStyle={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--subtle-border)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '12px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="totalCompensation" 
              stroke="#F4A261" 
              strokeWidth={2}
              dot={{ fill: '#F4A261', strokeWidth: 1, r: 3 }}
              name="Total Compensation"
            />
            <Line 
              type="monotone" 
              dataKey="cashCompensation" 
              stroke="#2A9D8F" 
              strokeWidth={2}
              dot={{ fill: '#2A9D8F', strokeWidth: 1, r: 2 }}
              name="Cash Compensation"
            />
            <Line 
              type="monotone" 
              dataKey="equityCompensation" 
              stroke="#FFD166" 
              strokeWidth={2}
              dot={{ fill: '#FFD166', strokeWidth: 1, r: 2 }}
              name="Equity Compensation"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-[#F4A261]">
            {formatCurrency(data[data.length - 1]?.totalCompensation || 0)}
          </div>
          <div className="text-xs sm:text-sm text-[#A0A3A8]">Latest Month Total</div>
        </div>
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-[#2A9D8F]">
            {formatCurrency(data[data.length - 1]?.cashCompensation || 0)}
          </div>
          <div className="text-xs sm:text-sm text-[#A0A3A8]">Latest Month Cash</div>
        </div>
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-[#FFD166]">
            {formatCurrency(data[data.length - 1]?.equityCompensation || 0)}
          </div>
          <div className="text-xs sm:text-sm text-[#A0A3A8]">Latest Month Equity</div>
        </div>
      </div>
    </div>
  );
};

export default CompensationChart;