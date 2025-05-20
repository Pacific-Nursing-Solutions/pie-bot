import { useState } from 'react';
import { EquityDistribution } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EquityVisualizationProps {
  equityData: EquityDistribution[];
  totalShares: number;
}

const EquityVisualization = ({ equityData, totalShares }: EquityVisualizationProps) => {
  const [shareClassFilter, setShareClassFilter] = useState('all');

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="bg-white dark:bg-[#293145] rounded-lg shadow-md p-5 mb-6">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h3 className="font-semibold text-lg dark:text-white">Equity Distribution</h3>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <select 
              className="bg-gray-100 dark:bg-[#1c2333] text-gray-700 dark:text-gray-300 rounded px-3 py-1.5 text-sm border-0 focus:ring-0"
              value={shareClassFilter}
              onChange={(e) => setShareClassFilter(e.target.value)}
            >
              <option value="all">All Share Classes</option>
              <option value="common">Common Stock</option>
              <option value="preferred">Preferred Stock</option>
              <option value="options">Options Pool</option>
            </select>
          </div>
          
          <button className="flex items-center text-primary dark:text-primary-light text-sm">
            <span className="material-icons text-sm mr-1">file_download</span>
            Export
          </button>
        </div>
      </div>
      
      {/* Equity Chart Tab Navigation */}
      <Tabs defaultValue="pie">
        <TabsList className="border-b border-gray-200 dark:border-gray-700 mb-4 space-x-8">
          <TabsTrigger value="pie" className="py-2 px-1 text-sm">
            Ownership Pie
          </TabsTrigger>
          <TabsTrigger value="table" className="py-2 px-1 text-sm">
            Stakeholders Table
          </TabsTrigger>
          <TabsTrigger value="history" className="py-2 px-1 text-sm">
            Historical View
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pie">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="equity-chart col-span-1 md:col-span-2 flex justify-center">
              <div className="relative w-64 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={equityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius={80}
                      paddingAngle={0}
                      dataKey="percentage"
                    >
                      {equityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="chart-center text-center">
                  <div className="text-lg font-semibold dark:text-white">Total Shares</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{formatNumber(totalShares)}</div>
                </div>
              </div>
            </div>
            
            <div className="col-span-1 flex flex-col justify-center">
              <div className="space-y-4">
                {/* Chart Legend */}
                {equityData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-4 h-4 rounded-sm mr-2" style={{ backgroundColor: item.color }}></div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <span className="text-sm dark:text-white">{item.name}</span>
                        <span className="text-sm font-medium dark:text-white">{item.percentage}%</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{formatNumber(item.shares)} shares</div>
                    </div>
                  </div>
                ))}
                
                <div className="pt-4">
                  <button className="w-full py-2 bg-primary text-white rounded hover:bg-primary-dark transition flex items-center justify-center">
                    <span className="material-icons text-sm mr-1">add</span>
                    Add Stakeholder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="table">
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            Stakeholders table view will be implemented in the future update.
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            Historical equity view will be implemented in the future update.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EquityVisualization;
