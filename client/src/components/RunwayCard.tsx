import { FinancialData } from '@/types';

interface RunwayCardProps {
  financialData: FinancialData;
}

const RunwayCard = ({ financialData }: RunwayCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate percentage of runway used/remaining
  const runwayPercentage = Math.min(Math.round((financialData.runwayMonths / 36) * 100), 100);

  return (
    <div className="bg-white dark:bg-[#293145] rounded-lg shadow-md p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg dark:text-white">Financial Runway</h3>
        <button className="text-primary dark:text-primary-light text-sm flex items-center">
          <span className="material-icons text-sm mr-1">refresh</span>
          Update
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Remaining Runway</p>
            <p className="font-medium text-accent dark:text-accent-light">{financialData.runwayMonths} months</p>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-1">
            <div 
              className="bg-accent h-2.5 rounded-full" 
              style={{ width: `${runwayPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Burn Rate</p>
          <p className="font-medium dark:text-white">{formatCurrency(financialData.burnRate)}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Cash Balance</p>
          <p className="font-medium dark:text-white">{formatCurrency(financialData.cashBalance)}</p>
        </div>
        
        <div className="pt-2">
          <button className="w-full py-2 text-primary dark:text-primary-light border border-primary dark:border-primary-light rounded flex items-center justify-center hover:bg-primary hover:bg-opacity-10 transition">
            <span className="material-icons text-sm mr-1">analytics</span>
            Run Detailed Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default RunwayCard;
