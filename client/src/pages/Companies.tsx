import { useState } from 'react';
import { Link } from 'wouter';
import { 
  Building2, 
  TrendingUp, 
  Users, 
  Plus, 
  Search,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';

interface Company {
  id: number;
  name: string;
  entityType: string;
  userEquityPercentage: number;
  userDebtPosition: number;
  marketCap: number;
  userEquityValue: number;
  stockClasses: Array<{
    class: string;
    shares: number;
    percentage: number;
    value: number;
  }>;
  lastValuation: {
    amount: number;
    date: string;
  };
  status: 'Active' | 'Exited' | 'Failed';
  industry: string;
  founded: string;
  lastActivity: string;
}

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const [companies] = useState<Company[]>([
    {
      id: 1,
      name: "TechStart Inc.",
      entityType: "Delaware C-Corp",
      userEquityPercentage: 15.5,
      userDebtPosition: 50000,
      marketCap: 8000000,
      userEquityValue: 1240000,
      stockClasses: [
        { class: "Common", shares: 150000, percentage: 12.5, value: 900000 },
        { class: "Preferred Series A", shares: 25000, percentage: 3.0, value: 340000 }
      ],
      lastValuation: { amount: 8000000, date: "2024-01-15" },
      status: 'Active',
      industry: 'Technology',
      founded: '2022',
      lastActivity: '2 hours ago'
    },
    {
      id: 2,
      name: "AI Solutions LLC",
      entityType: "Wyoming LLC",
      userEquityPercentage: 25.0,
      userDebtPosition: 0,
      marketCap: 3500000,
      userEquityValue: 875000,
      stockClasses: [
        { class: "Membership Units", shares: 2500, percentage: 25.0, value: 875000 }
      ],
      lastValuation: { amount: 3500000, date: "2024-02-01" },
      status: 'Active',
      industry: 'Artificial Intelligence',
      founded: '2023',
      lastActivity: '1 day ago'
    },
    {
      id: 3,
      name: "GreenTech Ventures",
      entityType: "Delaware C-Corp",
      userEquityPercentage: 8.2,
      userDebtPosition: 25000,
      marketCap: 2200000,
      userEquityValue: 180400,
      stockClasses: [
        { class: "Common", shares: 82000, percentage: 8.2, value: 180400 }
      ],
      lastValuation: { amount: 2200000, date: "2023-11-20" },
      status: 'Exited',
      industry: 'Clean Energy',
      founded: '2021',
      lastActivity: '3 months ago'
    }
  ]);

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = showActiveOnly ? company.status === 'Active' : true;
    return matchesSearch && matchesStatus;
  });

  const totalValue = companies.reduce((sum, company) => sum + company.userEquityValue, 0);
  const activeCompanies = companies.filter(c => c.status === 'Active').length;

  return (
    <div className="space-y-6">
      {/* Command Hints */}
      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 border-l-4 border-orange-500">
        <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-2">💡 Terminal Commands for Companies:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
          <code className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">equity split techstart</code>
          <code className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">create agreement founders</code>
          <code className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">valuation DCF</code>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <button className="flex items-center px-3 py-2 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950 rounded-lg transition-colors">
              ← Back to Dashboard
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Companies</h1>
        </div>
        
        <button className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Add Company
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Portfolio Value</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">${totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Companies</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{activeCompanies}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Equity %</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {(companies.reduce((sum, c) => sum + c.userEquityPercentage, 0) / companies.length).toFixed(1)}%
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Debt</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            (${companies.reduce((sum, c) => sum + c.userDebtPosition, 0).toLocaleString()})
          </p>
        </div>
      </div>

      {/* Companies List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Your Companies</h2>
            <button 
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >
              {isMinimized ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies or industries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showActiveOnly}
                onChange={(e) => setShowActiveOnly(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">Active only</span>
            </label>
          </div>
        </div>

        {!isMinimized && (
          <div className="p-6">
            <div className="space-y-4">
              {filteredCompanies.map((company) => (
                <div key={company.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg font-bold">{company.name.charAt(0)}</span>
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{company.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            company.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            company.status === 'Exited' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {company.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <span>{company.entityType}</span>
                          <span>•</span>
                          <span>{company.industry}</span>
                          <span>•</span>
                          <span>Founded {company.founded}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        ${company.userEquityValue.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {company.userEquityPercentage}% equity
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Last activity: {company.lastActivity}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Market Cap:</span>
                        <span className="font-medium ml-1">${company.marketCap.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Stock Classes:</span>
                        <span className="font-medium ml-1">{company.stockClasses.length}</span>
                      </div>
                      {company.userDebtPosition > 0 && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Debt:</span>
                          <span className="font-medium ml-1">(${company.userDebtPosition.toLocaleString()})</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link href={`/company/${company.id}/dashboard`}>
                        <button className="px-3 py-1 text-sm bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors">
                          View Dashboard
                        </button>
                      </Link>
                      <button className="p-1 text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredCompanies.length === 0 && (
                <div className="text-center py-12">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No companies found matching your criteria.</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Try adjusting your search or use the terminal to create a new company.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;