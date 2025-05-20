import { useState } from 'react';
import { Stakeholder } from '@/types';

interface StakeholdersListProps {
  stakeholders: Stakeholder[];
}

const StakeholdersList = ({ stakeholders }: StakeholdersListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Filter stakeholders based on search term
  const filteredStakeholders = stakeholders.filter(stakeholder => 
    stakeholder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stakeholder.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stakeholder.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate stakeholders
  const paginatedStakeholders = filteredStakeholders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredStakeholders.length / pageSize);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="bg-white dark:bg-[#293145] rounded-lg shadow-md p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg dark:text-white">Stakeholders</h3>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <span className="material-icons text-gray-400 text-sm">search</span>
            </span>
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-8 pr-4 py-1.5 text-sm rounded-md bg-gray-100 dark:bg-[#1c2333] text-gray-700 dark:text-gray-300 border-0 focus:ring-1 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <span className="material-icons">filter_list</span>
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Equity Type</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ownership %</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Shares</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedStakeholders.map((stakeholder) => (
              <tr key={stakeholder.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                      {stakeholder.avatarInitials}
                    </div>
                    <div className="ml-2">
                      <div className="text-sm font-medium dark:text-white">{stakeholder.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{stakeholder.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="text-sm dark:text-white">{stakeholder.role}</div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    stakeholder.equityType === 'Common Stock' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {stakeholder.equityType}
                  </span>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-sm dark:text-white">{stakeholder.ownershipPercentage}%</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm dark:text-white">{formatNumber(stakeholder.shares)}</td>
                <td className="px-3 py-3 whitespace-nowrap text-sm">
                  <button className="text-primary dark:text-primary-light hover:text-primary-dark">
                    <span className="material-icons text-sm">edit</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-between items-center mt-4 text-sm">
        <div className="text-gray-500 dark:text-gray-400">
          Showing {paginatedStakeholders.length} of {filteredStakeholders.length} stakeholders
        </div>
        <div className="flex items-center space-x-2">
          <button 
            className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          >
            Previous
          </button>
          <button 
            className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default StakeholdersList;
