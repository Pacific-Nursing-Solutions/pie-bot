import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, TrendingUp, Target, Calendar, DollarSign, Users, Plus } from 'lucide-react';

interface FundraisingRound {
  id: number;
  companyName: string;
  roundType: 'Pre-Seed' | 'Seed' | 'Series A' | 'Series B' | 'Series C' | 'Bridge';
  targetAmount: number;
  raisedAmount: number;
  leadInvestor?: string;
  status: 'Planning' | 'Active' | 'Closing' | 'Closed' | 'Failed';
  deadline: string;
  valuation: number;
  minimumInvestment: number;
  useOfFunds: string[];
  investors: number;
}

const Fundraising = () => {
  const [activeTab, setActiveTab] = useState<'raising' | 'investing'>('raising');
  
  const [fundraisingRounds] = useState<FundraisingRound[]>([
    {
      id: 1,
      companyName: "TechStart Inc.",
      roundType: "Series A",
      targetAmount: 5000000,
      raisedAmount: 3200000,
      leadInvestor: "Venture Capital Partners",
      status: "Active",
      deadline: "2024-06-30",
      valuation: 25000000,
      minimumInvestment: 100000,
      useOfFunds: ["Product Development", "Marketing", "Team Expansion"],
      investors: 8
    },
    {
      id: 2,
      companyName: "AI Solutions LLC",
      roundType: "Seed",
      targetAmount: 2000000,
      raisedAmount: 1800000,
      leadInvestor: "Tech Angels",
      status: "Closing",
      deadline: "2024-05-15",
      valuation: 8000000,
      minimumInvestment: 25000,
      useOfFunds: ["R&D", "Market Validation", "Initial Hiring"],
      investors: 12
    }
  ]);

  const [investmentOpportunities] = useState<FundraisingRound[]>([
    {
      id: 3,
      companyName: "FinTech Revolution",
      roundType: "Series B",
      targetAmount: 15000000,
      raisedAmount: 8500000,
      leadInvestor: "Growth Partners",
      status: "Active",
      deadline: "2024-07-31",
      valuation: 75000000,
      minimumInvestment: 250000,
      useOfFunds: ["International Expansion", "Product Suite", "Acquisitions"],
      investors: 6
    },
    {
      id: 4,
      companyName: "HealthTech Innovations",
      roundType: "Seed",
      targetAmount: 3000000,
      raisedAmount: 1200000,
      leadInvestor: "HealthCare Ventures",
      status: "Active",
      deadline: "2024-08-15",
      valuation: 12000000,
      minimumInvestment: 50000,
      useOfFunds: ["Clinical Trials", "Regulatory Approval", "Team Building"],
      investors: 4
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Closing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Planning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'Failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

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
                  Fundraising
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Manage fundraising rounds and investment opportunities
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              New Round
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('raising')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'raising'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Your Fundraising
              </button>
              <button
                onClick={() => setActiveTab('investing')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'investing'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Investment Opportunities
              </button>
            </nav>
          </div>
        </div>

        {/* Your Fundraising Tab */}
        {activeTab === 'raising' && (
          <div>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Target className="w-8 h-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Rounds</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {fundraisingRounds.filter(r => r.status === 'Active').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Raised</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      ${fundraisingRounds.reduce((sum, r) => sum + r.raisedAmount, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Target className="w-8 h-8 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Target</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      ${fundraisingRounds.reduce((sum, r) => sum + r.targetAmount, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-orange-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Investors</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {fundraisingRounds.reduce((sum, r) => sum + r.investors, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fundraising Rounds */}
            <div className="space-y-6">
              {fundraisingRounds.map((round) => (
                <div key={round.id} className="bg-white dark:bg-gray-800 rounded-lg shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                          {round.companyName} - {round.roundType}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(round.status)}`}>
                            {round.status}
                          </span>
                          {round.leadInvestor && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Lead: {round.leadInvestor}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          ${round.raisedAmount.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          of ${round.targetAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{((round.raisedAmount / round.targetAmount) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(round.raisedAmount / round.targetAmount) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Round Details</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Valuation:</span>
                            <span className="font-medium">${round.valuation.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Min Investment:</span>
                            <span className="font-medium">${round.minimumInvestment.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Deadline:</span>
                            <span className="font-medium">{round.deadline}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Investors:</span>
                            <span className="font-medium">{round.investors}</span>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Use of Funds</p>
                        <div className="flex flex-wrap gap-2">
                          {round.useOfFunds.map((use, idx) => (
                            <span 
                              key={idx}
                              className="inline-flex px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full"
                            >
                              {use}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex space-x-3">
                      <Link href={`/company/${round.id}/dashboard`}>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">
                          Manage Round
                        </button>
                      </Link>
                      <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium">
                        View Dataroom
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Investment Opportunities Tab */}
        {activeTab === 'investing' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Available Investment Opportunities
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Discover and invest in promising startups and growth companies
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {investmentOpportunities.map((opportunity) => (
                <div key={opportunity.id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {opportunity.companyName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {opportunity.roundType} • {opportunity.leadInvestor}
                        </p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(opportunity.status)}`}>
                        {opportunity.status}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                        <span>Funding Progress</span>
                        <span>{((opportunity.raisedAmount / opportunity.targetAmount) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(opportunity.raisedAmount / opportunity.targetAmount) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>${opportunity.raisedAmount.toLocaleString()}</span>
                        <span>${opportunity.targetAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Valuation:</span>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          ${opportunity.valuation.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Min Investment:</span>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          ${opportunity.minimumInvestment.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Deadline:</span>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {opportunity.deadline}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Investors:</span>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {opportunity.investors}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Use of Funds</p>
                      <div className="flex flex-wrap gap-1">
                        {opportunity.useOfFunds.map((use, idx) => (
                          <span 
                            key={idx}
                            className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded"
                          >
                            {use}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium">
                        Invest Now
                      </button>
                      <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Fundraising;