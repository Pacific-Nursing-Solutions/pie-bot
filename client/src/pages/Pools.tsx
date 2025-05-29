import { useState } from 'react';
import { Link } from 'wouter';
import { 
  Users, 
  TrendingUp, 
  Plus, 
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  DollarSign,
  Calendar,
  BarChart3
} from 'lucide-react';

interface Pool {
  id: number;
  name: string;
  type: string;
  status: 'Active' | 'Closed' | 'Fundraising';
  totalCommitted: number;
  deployed: number;
  returns: number;
  companies: number;
  fundSize: number;
  investors: number;
  managementFee: number;
  carriedInterest: number;
  fundingPeriod: string;
  vintage: string;
  focus: string;
  geography: string;
}

const Pools = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const [pools] = useState<Pool[]>([
    {
      id: 1,
      name: "Startup Accelerator Pool",
      type: "Early Stage",
      status: 'Active',
      totalCommitted: 500000,
      deployed: 350000,
      returns: 125000,
      companies: 8,
      fundSize: 2000000,
      investors: 12,
      managementFee: 2.0,
      carriedInterest: 20,
      fundingPeriod: "36 months",
      vintage: "2023",
      focus: "B2B SaaS",
      geography: "North America"
    },
    {
      id: 2,
      name: "AI/ML Investment Pool",
      type: "Sector Focus",
      status: 'Active',
      totalCommitted: 250000,
      deployed: 180000,
      returns: 87000,
      companies: 5,
      fundSize: 1500000,
      investors: 8,
      managementFee: 2.0,
      carriedInterest: 20,
      fundingPeriod: "24 months",
      vintage: "2024",
      focus: "AI/ML",
      geography: "Global"
    },
    {
      id: 3,
      name: "Clean Energy Ventures",
      type: "Growth Stage",
      status: 'Closed',
      totalCommitted: 750000,
      deployed: 750000,
      returns: 234000,
      companies: 3,
      fundSize: 5000000,
      investors: 25,
      managementFee: 2.5,
      carriedInterest: 25,
      fundingPeriod: "48 months",
      vintage: "2022",
      focus: "Clean Energy",
      geography: "North America"
    }
  ]);

  const filteredPools = pools.filter(pool => {
    const matchesSearch = pool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pool.focus.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = showActiveOnly ? pool.status === 'Active' : true;
    return matchesSearch && matchesStatus;
  });

  const totalCommitted = pools.reduce((sum, pool) => sum + pool.totalCommitted, 0);
  const totalReturns = pools.reduce((sum, pool) => sum + pool.returns, 0);
  const activePools = pools.filter(p => p.status === 'Active').length;
  const totalCompanies = pools.reduce((sum, pool) => sum + pool.companies, 0);

  return (
    <div className="space-y-6">
      {/* Command Hints */}
      <div className="bg-violet-50 dark:bg-violet-950/20 rounded-lg p-4 border-l-4 border-violet-300">
        <h3 className="font-medium text-violet-800 dark:text-violet-200 mb-2">💡 Terminal Commands for Pools:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
          <code className="bg-violet-100 dark:bg-violet-900/30 px-2 py-1 rounded text-violet-700 dark:text-violet-300">pool create ai-fund</code>
          <code className="bg-violet-100 dark:bg-violet-900/30 px-2 py-1 rounded text-violet-700 dark:text-violet-300">deploy token POOL</code>
          <code className="bg-violet-100 dark:bg-violet-900/30 px-2 py-1 rounded text-violet-700 dark:text-violet-300">generate report pools</code>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <button className="flex items-center px-3 py-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950 rounded-lg transition-colors">
              ← Back to Dashboard
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Investment Pools</h1>
        </div>
        
        <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Create Pool
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Committed</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">${totalCommitted.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Returns</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">${totalReturns.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Pools</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{activePools}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Portfolio Companies</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalCompanies}</p>
        </div>
      </div>

      {/* Pools List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Your Investment Pools</h2>
            <button 
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              {isMinimized ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search pools or focus areas..."
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
            <div className="space-y-6">
              {filteredPools.map((pool) => (
                <div key={pool.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{pool.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            pool.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            pool.status === 'Closed' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}>
                            {pool.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <span>{pool.type}</span>
                          <span>•</span>
                          <span>{pool.focus}</span>
                          <span>•</span>
                          <span>Vintage {pool.vintage}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        +${pool.returns.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {((pool.returns / pool.totalCommitted) * 100).toFixed(1)}% return
                      </div>
                    </div>
                  </div>

                  {/* Pool Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-xs mb-1">
                        <DollarSign className="w-3 h-3 mr-1" />
                        Fund Size
                      </div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        ${pool.fundSize.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-xs mb-1">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Deployed
                      </div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        ${pool.deployed.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-xs mb-1">
                        <Users className="w-3 h-3 mr-1" />
                        Companies
                      </div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        {pool.companies}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-xs mb-1">
                        <BarChart3 className="w-3 h-3 mr-1" />
                        Investors
                      </div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        {pool.investors}
                      </div>
                    </div>
                  </div>

                  {/* Pool Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Management Fee:</span>
                      <span className="font-medium ml-1">{pool.managementFee}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Carried Interest:</span>
                      <span className="font-medium ml-1">{pool.carriedInterest}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Investment Period:</span>
                      <span className="font-medium ml-1">{pool.fundingPeriod}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Geography:</span>
                        <span className="font-medium ml-1">{pool.geography}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Deployment:</span>
                        <span className="font-medium ml-1">
                          {((pool.deployed / pool.totalCommitted) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link href={`/pool/${pool.id}/dashboard`}>
                        <button className="px-3 py-1 text-sm bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors">
                          View Dashboard
                        </button>
                      </Link>
                      <button className="p-1 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredPools.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No pools found matching your criteria.</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Try adjusting your search or use the terminal to create a new pool.
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

export default Pools;