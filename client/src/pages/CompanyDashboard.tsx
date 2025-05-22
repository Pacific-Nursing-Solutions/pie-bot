import { useState } from 'react';
import { Link, useRoute } from 'wouter';
import { ArrowLeft, Bot, Users, Calculator, FileText, TrendingUp } from 'lucide-react';

interface Company {
  id: number;
  name: string;
  entityType: string;
  founded: string;
  valuation: number;
  authorizedShares: number;
  stakeholders: number;
}

const CompanyDashboard = () => {
  const [match, params] = useRoute('/company/:id/dashboard');
  const companyId = params?.id;

  // In a real app, this would fetch from API based on companyId
  const [company] = useState<Company>({
    id: parseInt(companyId || '1'),
    name: "TechStart Inc.",
    entityType: "Delaware C-Corp",
    founded: "2024",
    valuation: 5000000,
    authorizedShares: 10000000,
    stakeholders: 3
  });

  const quickActions = [
    {
      title: "Pie Bot",
      description: "Manage equity splits and tokenization",
      icon: Bot,
      href: `/company/${companyId}/pie-bot`,
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Team Management",
      description: "View and manage stakeholders",
      icon: Users,
      href: `/company/${companyId}/stakeholders`,
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Financial Reports",
      description: "View financial metrics and runway",
      icon: TrendingUp,
      href: `/company/${companyId}/financials`,
      color: "bg-purple-600 hover:bg-purple-700"
    },
    {
      title: "Legal Documents",
      description: "Access agreements and contracts",
      icon: FileText,
      href: `/company/${companyId}/documents`,
      color: "bg-orange-600 hover:bg-orange-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link href="/portfolio">
                <button className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {company.name}
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {company.entityType} • Founded {company.founded}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Company Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Valuation</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  ${company.valuation.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Stakeholders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {company.stakeholders}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calculator className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Authorized Shares</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {company.authorizedShares.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <div className={`${action.color} rounded-lg p-6 text-white hover:shadow-lg transition-all duration-200 cursor-pointer`}>
                  <action.icon className="w-8 h-8 mb-3" />
                  <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Recent Activity
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <Bot className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Equity configuration updated
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    New stakeholder added
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Founder agreement generated
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;