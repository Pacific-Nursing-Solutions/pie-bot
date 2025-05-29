import { useState } from 'react';
import { Link } from 'wouter';
import { 
  TrendingUp, 
  Plus, 
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Target,
  Clock,
  Users2,
  DollarSign,
  Calendar,
  Briefcase
} from 'lucide-react';

interface FundraisingRound {
  id: number;
  companyName: string;
  roundType: string;
  status: 'Planning' | 'Active' | 'Closed' | 'On Hold';
  targetAmount: number;
  raisedAmount: number;
  valuation: number;
  leadInvestor?: string;
  totalInvestors: number;
  startDate: string;
  targetCloseDate: string;
  useOfFunds: {
    category: string;
    percentage: number;
    amount: number;
  }[];
  documents: {
    name: string;
    status: 'Draft' | 'Completed' | 'Signed';
  }[];
}

const Fundraising = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const [rounds] = useState<FundraisingRound[]>([
    {
      id: 1,
      companyName: "TechStart Inc.",
      roundType: "Series A",
      status: 'Active',
      targetAmount: 2000000,
      raisedAmount: 1200000,
      valuation: 8000000,
      leadInvestor: "Acme Ventures",
      totalInvestors: 8,
      startDate: "2024-01-15",
      targetCloseDate: "2024-06-15",
      useOfFunds: [
        { category: "Product Development", percentage: 60, amount: 1200000 },
        { category: "Marketing & Sales", percentage: 25, amount: 500000 },
        { category: "Operations", percentage: 15, amount: 300000 }
      ],
      documents: [
        { name: "Term Sheet", status: 'Signed' },
        { name: "Due Diligence Package", status: 'Completed' },
        { name: "Subscription Agreement", status: 'Draft' }
      ]
    },
    {
      id: 2,
      companyName: "AI Solutions LLC",
      roundType: "Seed",
      status: 'Planning',
      targetAmount: 500000,
      raisedAmount: 0,
      valuation: 3500000,
      totalInvestors: 0,
      startDate: "2024-03-01",
      targetCloseDate: "2024-08-01",
      useOfFunds: [
        { category: "Product Development", percentage: 70, amount: 350000 },
        { category: "Team Expansion", percentage: 20, amount: 100000 },
        { category: "Marketing", percentage: 10, amount: 50000 }
      ],
      documents: [
        { name: "Pitch Deck", status: 'Draft' },
        { name: "Financial Model", status: 'Draft' },
        { name: "Market Analysis", status: 'Completed' }
      ]
    },
    {
      id: 3,
      companyName: "GreenTech Ventures",
      roundType: "Series B",
      status: 'Closed',
      targetAmount: 5000000,
      raisedAmount: 5000000,
      valuation: 22000000,
      leadInvestor: "Green Capital",
      totalInvestors: 15,
      startDate: "2023-06-01",
      targetCloseDate: "2023-11-20",
      useOfFunds: [
        { category: "Manufacturing Scale", percentage: 50, amount: 2500000 },
        { category: "Market Expansion", percentage: 30, amount: 1500000 },
        { category: "R&D", percentage: 20, amount: 1000000 }
      ],
      documents: [
        { name: "Term Sheet", status: 'Signed' },
        { name: "Due Diligence Package", status: 'Signed' },
        { name: "Subscription Agreement", status: 'Signed' }
      ]
    }
  ]);

  const filteredRounds = rounds.filter(round => {
    const matchesSearch = round.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         round.roundType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = showActiveOnly ? round.status === 'Active' || round.status === 'Planning' : true;
    return matchesSearch && matchesStatus;
  });

  const totalTarget = rounds.reduce((sum, round) => sum + round.targetAmount, 0);
  const totalRaised = rounds.reduce((sum, round) => sum + round.raisedAmount, 0);
  const activeRounds = rounds.filter(r => r.status === 'Active' || r.status === 'Planning').length;

  return (
    <div className="space-y-6">
      {/* Command Hints */}
      <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-4 border-l-4 border-emerald-300">
        <h3 className="font-medium text-emerald-800 dark:text-emerald-200 mb-2">💡 Terminal Commands for Fundraising:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
          <code className="bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded text-emerald-700 dark:text-emerald-300">fund techstart</code>
          <code className="bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded text-emerald-700 dark:text-emerald-300">create agreement term-sheet</code>
          <code className="bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded text-emerald-700 dark:text-emerald-300">valuation series-a</code>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <button className="flex items-center px-3 py-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950 rounded-lg transition-colors">
              ← Back to Dashboard
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Fundraising</h1>
        </div>
        
        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Start New Round
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Target</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">${totalTarget.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Raised</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">${totalRaised.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Rounds</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{activeRounds}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {rounds.length > 0 ? ((totalRaised / totalTarget) * 100).toFixed(0) : 0}%
          </p>
        </div>
      </div>

      {/* Fundraising Rounds */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Fundraising Rounds</h2>
            <button 
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              {isMinimized ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies or round types..."
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
              {filteredRounds.map((round) => (
                <div key={round.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {round.companyName} - {round.roundType}
                          </h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            round.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            round.status === 'Planning' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            round.status === 'Closed' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' :
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {round.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <span>Target: ${round.targetAmount.toLocaleString()}</span>
                          <span>•</span>
                          <span>Valuation: ${round.valuation.toLocaleString()}</span>
                          {round.leadInvestor && (
                            <>
                              <span>•</span>
                              <span>Lead: {round.leadInvestor}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        ${round.raisedAmount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {((round.raisedAmount / round.targetAmount) * 100).toFixed(0)}% of target
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>Fundraising Progress</span>
                      <span>${round.raisedAmount.toLocaleString()} / ${round.targetAmount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((round.raisedAmount / round.targetAmount) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Round Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-xs mb-1">
                        <Target className="w-3 h-3 mr-1" />
                        Target Close
                      </div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        {new Date(round.targetCloseDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-xs mb-1">
                        <Users2 className="w-3 h-3 mr-1" />
                        Investors
                      </div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        {round.totalInvestors}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-xs mb-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        Started
                      </div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        {new Date(round.startDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-xs mb-1">
                        <Briefcase className="w-3 h-3 mr-1" />
                        Documents
                      </div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        {round.documents.filter(d => d.status === 'Signed').length}/{round.documents.length}
                      </div>
                    </div>
                  </div>

                  {/* Use of Funds */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Use of Funds</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {round.useOfFunds.map((fund, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600 dark:text-gray-400">{fund.category}:</span>
                          <span className="font-medium">{fund.percentage}% (${fund.amount.toLocaleString()})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Documents Status */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Document Status</h4>
                    <div className="flex flex-wrap gap-2">
                      {round.documents.map((doc, index) => (
                        <span key={index} className={`px-2 py-1 text-xs rounded ${
                          doc.status === 'Signed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          doc.status === 'Completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {doc.name}: {doc.status}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Days remaining: {Math.max(0, Math.ceil((new Date(round.targetCloseDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link href={`/fundraising/${round.id}/dashboard`}>
                        <button className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
                          Manage Round
                        </button>
                      </Link>
                      <button className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredRounds.length === 0 && (
                <div className="text-center py-12">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No fundraising rounds found matching your criteria.</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Try adjusting your search or use the terminal to initiate a new fundraising round.
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

export default Fundraising;