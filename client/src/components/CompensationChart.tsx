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
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Monthly Total Compensation
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Total</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Cash</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Equity</span>
          </div>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="month" 
              className="text-gray-600 dark:text-gray-400"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              className="text-gray-600 dark:text-gray-400"
              tick={{ fontSize: 12 }}
              tickFormatter={formatCurrency}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [formatCurrency(value), name]}
              labelClassName="text-gray-900 dark:text-gray-100"
              contentStyle={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--subtle-border)',
                borderRadius: '8px',
                color: 'var(--text-primary)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="totalCompensation" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              name="Total Compensation"
            />
            <Line 
              type="monotone" 
              dataKey="cashCompensation" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
              name="Cash Compensation"
            />
            <Line 
              type="monotone" 
              dataKey="equityCompensation" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
              name="Equity Compensation"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(data[data.length - 1]?.totalCompensation || 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Latest Month Total</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(data[data.length - 1]?.cashCompensation || 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Latest Month Cash</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {formatCurrency(data[data.length - 1]?.equityCompensation || 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Latest Month Equity</div>
        </div>
      </div>
    </div>
  );
};

export default CompensationChart;