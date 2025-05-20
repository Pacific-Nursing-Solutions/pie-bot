import { Company } from '@/types';

interface CompanyCardProps {
  company: Company;
}

const CompanyCard = ({ company }: CompanyCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-[#293145] rounded-lg shadow-md p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg dark:text-white">Company Overview</h3>
        <span className="material-icons text-gray-500 dark:text-gray-400">more_vert</span>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Company Name</p>
          <p className="font-medium dark:text-white">{company.name}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Entity Type</p>
          <div className="flex items-center">
            <span className="material-icons text-primary dark:text-primary-light mr-1">business</span>
            <p className="font-medium dark:text-white">{company.entityType}</p>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Founded</p>
          <p className="font-medium dark:text-white">{company.founded}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Current Valuation</p>
          <p className="font-medium text-secondary dark:text-secondary-light">{formatCurrency(company.valuation)}</p>
        </div>
        
        <div className="pt-2">
          <button className="w-full py-2 bg-gray-100 dark:bg-[#1c2333] text-gray-700 dark:text-gray-300 rounded flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            <span className="material-icons text-sm mr-1">edit</span>
            Edit Company Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
