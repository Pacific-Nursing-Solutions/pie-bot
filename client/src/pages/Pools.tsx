import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Users, TrendingUp, Building2, Plus, Search } from 'lucide-react';

interface Pool {
  id: number;
  name: string;
  type: 'Angel' | 'VC' | 'Syndicate';
  totalCommitted: number;
  deployed: number;
  returns: number;
  companies: number;
  status: 'Active' | 'Closed' | 'Fundraising';
  description: string;
  leadInvestor?: string;
  minimumInvestment: number;
  targetSize: number;
  currentSize: number;
}

const Pools = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pools] = useState<Pool[]>([
    {
      id: 1,
      name: "Early Stage Tech Fund",
      type: "Angel",
      totalCommitted: 500000,
      deployed: 350000,
      returns: 425000,
      companies: 12,
      status: 'Active',
      description: 'Focus on early-stage technology companies with strong product-market fit',
      leadInvestor: 'TechAngels Group',
      minimumInvestment: 25000,
      targetSize: 2000000,
      currentSize: 1250000
    },
    {
      id: 2,
      name: "AI/ML Syndicate",
      type: "Syndicate",
      totalCommitted: 250000,
      deployed: 200000,
      returns: 280000,
      companies: 8,
      status: 'Active',
      description: 'Specialized investments in artificial intelligence and machine learning startups',
      leadInvestor: 'AI Ventures',
      minimumInvestment: 10000,
      targetSize: 500000,
      currentSize: 350000
    },
    {
      id: 3,
      name: "FinTech Innovation Fund",
      type: "VC",
      totalCommitted: 1000000,
      deployed: 800000,
      returns: 950000,
      companies: 15,
      status: 'Fundraising',
      description: 'Series A and B investments in financial technology companies',
      leadInvestor: 'FinVest Partners',
      minimumInvestment: 50000,
      targetSize: 5000000,
      currentSize: 3200000
    }
  ]);

  const filteredPools = pools.filter(pool =>
    pool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pool.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCommitted = pools.reduce((sum, pool) => sum + pool.totalCommitted, 0);
  const totalReturns = pools.reduce((sum, pool) => sum + pool.returns, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link href="/">
                <button className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Investment Pools
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Diversify your portfolio through syndicated investments
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Create Pool
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Pools</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {pools.filter(p => p.status === 'Active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Committed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  ${totalCommitted.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Building2 className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Returns</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  ${totalReturns.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">ROI</p>
                <p className="text-2xl font-bold text-green-600">
                  {totalCommitted > 0 ? `${(((totalReturns - totalCommitted) / totalCommitted) * 100).toFixed(1)}%` : '0%'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search pools by name, type, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Pools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPools.map((pool) => (
            <div key={pool.id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {pool.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        pool.type === 'Angel' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        pool.type === 'VC' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {pool.type}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        pool.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        pool.status === 'Fundraising' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {pool.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      ${pool.returns.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Returns</p>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {pool.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Committed</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      ${pool.totalCommitted.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Deployed</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      ${pool.deployed.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Companies</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {pool.companies}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Min Investment</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      ${pool.minimumInvestment.toLocaleString()}
                    </p>
                  </div>
                </div>

                {pool.leadInvestor && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Lead Investor</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {pool.leadInvestor}
                    </p>
                  </div>
                )}

                {/* Progress Bar for Fund Size */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Fund Progress</span>
                    <span>{((pool.currentSize / pool.targetSize) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(pool.currentSize / pool.targetSize) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>${pool.currentSize.toLocaleString()}</span>
                    <span>${pool.targetSize.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link href={`/pool/${pool.id}`} className="flex-1">
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">
                      View Details
                    </button>
                  </Link>
                  {pool.status === 'Fundraising' && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium">
                      Invest
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPools.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No pools found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search terms or create a new pool.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pools;