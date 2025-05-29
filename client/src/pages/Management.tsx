import { useState } from 'react';
import { Link } from 'wouter';
import { 
  Users, 
  Calendar,
  Clock,
  Briefcase,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Settings,
  DollarSign,
  TrendingDown,
  Activity,
  MessageSquare,
  Wallet
} from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  role: string;
  status: 'active' | 'away' | 'offline';
  hoursToday: number;
  currentProject: string;
  avatar: string;
  company: string;
}

interface Project {
  id: number;
  name: string;
  company: string;
  status: 'active' | 'paused' | 'completed';
  progress: number;
  assignees: string[];
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface Integration {
  id: number;
  name: string;
  type: string;
  status: 'connected' | 'disconnected' | 'pending';
  description: string;
  lastSync: string;
}

interface PersonalContribution {
  id: number;
  company: string;
  type: 'hours' | 'capital' | 'property' | 'ip' | 'sales';
  description: string;
  amount: number;
  unit: string;
  date: string;
  project?: string;
  equityPercentage: number;
  equityValue: number;
}

interface Wallet {
  id: number;
  name: string;
  ensName: string;
  address: string;
  type: 'personal' | 'company';
  balance: number;
}

const Management = () => {
  const [isEmployeesMinimized, setIsEmployeesMinimized] = useState(false);
  const [isProjectsMinimized, setIsProjectsMinimized] = useState(false);
  const [isIntegrationsMinimized, setIsIntegrationsMinimized] = useState(false);
  const [isContributionsMinimized, setIsContributionsMinimized] = useState(false);
  const [contributionTimeframe, setContributionTimeframe] = useState<'week' | 'month' | 'year' | 'all-time'>('month');

  const [employees] = useState<Employee[]>([
    {
      id: 1,
      name: "John Founder",
      role: "CEO",
      status: 'active',
      hoursToday: 6.5,
      currentProject: "Series A Preparation",
      avatar: "JF",
      company: "TechStart Inc."
    },
    {
      id: 2,
      name: "Sarah Developer",
      role: "Lead Developer",
      status: 'active',
      hoursToday: 7.2,
      currentProject: "Product Development",
      avatar: "SD",
      company: "TechStart Inc."
    },
    {
      id: 3,
      name: "Mike Partner",
      role: "Co-Founder",
      status: 'away',
      hoursToday: 4.0,
      currentProject: "Market Research",
      avatar: "MP",
      company: "TechStart Inc."
    },
    {
      id: 4,
      name: "Lisa CTO",
      role: "CTO",
      status: 'active',
      hoursToday: 8.1,
      currentProject: "AI Model Training",
      avatar: "LC",
      company: "AI Solutions LLC"
    }
  ]);

  const [projects] = useState<Project[]>([
    {
      id: 1,
      name: "Series A Preparation",
      company: "TechStart Inc.",
      status: 'active',
      progress: 75,
      assignees: ["John Founder", "Mike Partner"],
      dueDate: "2024-06-15",
      priority: 'critical'
    },
    {
      id: 2,
      name: "Product Development Sprint 3",
      company: "TechStart Inc.",
      status: 'active',
      progress: 60,
      assignees: ["Sarah Developer", "Lisa CTO"],
      dueDate: "2024-03-30",
      priority: 'high'
    },
    {
      id: 3,
      name: "AI Model Training Pipeline",
      company: "AI Solutions LLC",
      status: 'active',
      progress: 40,
      assignees: ["Lisa CTO"],
      dueDate: "2024-04-15",
      priority: 'medium'
    },
    {
      id: 4,
      name: "Market Research Analysis",
      company: "TechStart Inc.",
      status: 'paused',
      progress: 25,
      assignees: ["Mike Partner"],
      dueDate: "2024-04-01",
      priority: 'low'
    }
  ]);

  const [integrations] = useState<Integration[]>([
    {
      id: 1,
      name: "Notion",
      type: "Project Management",
      status: 'connected',
      description: "Project tracking and documentation",
      lastSync: "2 minutes ago"
    },
    {
      id: 2,
      name: "ClickUp",
      type: "Task Management",
      status: 'disconnected',
      description: "Task assignments and time tracking",
      lastSync: "Never"
    },
    {
      id: 3,
      name: "Hubstaff",
      type: "Time Tracking",
      status: 'connected',
      description: "Employee time tracking and productivity",
      lastSync: "5 minutes ago"
    },
    {
      id: 4,
      name: "Slack",
      type: "Communication",
      status: 'pending',
      description: "Team communication and notifications",
      lastSync: "Pending setup"
    }
  ]);

  const [personalContributions] = useState<PersonalContribution[]>([
    {
      id: 1,
      company: "TechStart Inc.",
      type: 'hours',
      description: "Product development and architecture",
      amount: 42,
      unit: "hours",
      date: "2024-03-20",
      project: "Core Platform Build",
      equityPercentage: 35.0,
      equityValue: 875000
    },
    {
      id: 2,
      company: "TechStart Inc.",
      type: 'capital',
      description: "Initial seed funding",
      amount: 50000,
      unit: "USD",
      date: "2024-03-15",
      equityPercentage: 35.0,
      equityValue: 875000
    },
    {
      id: 3,
      company: "AI Solutions LLC",
      type: 'ip',
      description: "Machine learning algorithms and patents",
      amount: 150000,
      unit: "USD estimated",
      date: "2024-03-10",
      equityPercentage: 45.0,
      equityValue: 675000
    },
    {
      id: 4,
      company: "TechStart Inc.",
      type: 'sales',
      description: "Enterprise client acquisition",
      amount: 25000,
      unit: "USD commission",
      date: "2024-03-18",
      project: "Q1 Sales Push",
      equityPercentage: 35.0,
      equityValue: 875000
    },
    {
      id: 5,
      company: "AI Solutions LLC",
      type: 'property',
      description: "Development equipment and servers",
      amount: 15000,
      unit: "USD value",
      date: "2024-03-12",
      equityPercentage: 45.0,
      equityValue: 675000
    }
  ]);

  const [wallets] = useState<Wallet[]>([
    {
      id: 1,
      name: "Personal Portfolio",
      ensName: "founder.eth",
      address: "0x1234...5678",
      type: 'personal',
      balance: 1250000
    },
    {
      id: 2,
      name: "TechStart Operations",
      ensName: "techstart.eth",
      address: "0xabcd...efgh",
      type: 'company',
      balance: 850000
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
        return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30';
      case 'away':
      case 'pending':
        return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30';
      case 'offline':
      case 'disconnected':
        return 'text-slate-600 bg-slate-100 dark:bg-slate-900/30';
      case 'paused':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      default:
        return 'text-slate-600 bg-slate-100 dark:bg-slate-900/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'medium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300';
    }
  };

  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const totalHoursToday = employees.reduce((sum, emp) => sum + emp.hoursToday, 0);
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const connectedIntegrations = integrations.filter(i => i.status === 'connected').length;

  return (
    <div className="space-y-6">
      {/* Command Hints */}
      <div className="bg-violet-50 dark:bg-violet-950/20 rounded-lg p-4 border-l-4 border-violet-300">
        <h3 className="font-medium text-violet-800 dark:text-violet-200 mb-2">💡 Terminal Commands for Management:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
          <code className="bg-violet-100 dark:bg-violet-900/30 px-2 py-1 rounded text-violet-700 dark:text-violet-300">generate report team</code>
          <code className="bg-violet-100 dark:bg-violet-900/30 px-2 py-1 rounded text-violet-700 dark:text-violet-300">deploy integration notion</code>
          <code className="bg-violet-100 dark:bg-violet-900/30 px-2 py-1 rounded text-violet-700 dark:text-violet-300">create project sprint</code>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <button className="flex items-center px-3 py-2 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950 rounded-lg transition-colors">
              ← Back to Dashboard
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Management</h1>
        </div>
        
        <Link href="/settings">
          <button className="flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
            <Settings className="w-4 h-4 mr-2" />
            Manage Integrations
          </button>
        </Link>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">$847K</p>
            </div>
            <DollarSign className="w-8 h-8 text-emerald-500" />
          </div>
          <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2">+12.4% vs last month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Workers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{activeEmployees}</p>
            </div>
            <Users className="w-8 h-8 text-violet-500" />
          </div>
          <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2">+3 new hires this month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sales Growth</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">+18.3%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">$156K new deals closed</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cash Available</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">$2.1M</p>
            </div>
            <Wallet className="w-8 h-8 text-amber-500" />
          </div>
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">18 months runway</p>
        </div>
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Social Media</h3>
            <MessageSquare className="w-6 h-6 text-violet-500" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Posts this week</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">23</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Engagement rate</span>
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">+4.2%</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Burn Rate</h3>
            <TrendingDown className="w-6 h-6 text-red-500" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Monthly burn</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">$118K</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">vs last month</span>
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">-8.1%</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Growth Rate</h3>
            <Activity className="w-6 h-6 text-emerald-500" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Monthly growth</span>
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">+23.8%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Annual target</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">85% reached</span>
            </div>
          </div>
        </div>
      </div>

      {/* ENS Wallets */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">ENS Domain Wallets</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wallets.map((wallet) => (
              <div key={wallet.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{wallet.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    wallet.type === 'personal' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 
                    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                  }`}>
                    {wallet.type}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">ENS Name:</span>
                    <code className="text-sm font-mono text-violet-600 dark:text-violet-400">{wallet.ensName}</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Address:</span>
                    <code className="text-sm font-mono text-gray-500 dark:text-gray-400">{wallet.address}</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Balance:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">${wallet.balance.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Individual Activities */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Your Personal Contributions</h2>
          <div className="flex items-center space-x-4">
            <select
              value={contributionTimeframe}
              onChange={(e) => setContributionTimeframe(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="all-time">All Time</option>
            </select>
            <button 
              onClick={() => setIsContributionsMinimized(!isContributionsMinimized)}
              className="p-2 text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
            >
              {isContributionsMinimized ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {!isContributionsMinimized && (
          <div className="p-6">
            <div className="space-y-4">
              {personalContributions.map((contribution) => (
                <div key={contribution.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          contribution.type === 'hours' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                          contribution.type === 'capital' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' :
                          contribution.type === 'sales' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                          contribution.type === 'ip' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                          'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300'
                        }`}>
                          {contribution.type.toUpperCase()}
                        </span>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{contribution.company}</h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{contribution.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{contribution.description}</p>
                      {contribution.project && (
                        <p className="text-xs text-violet-600 dark:text-violet-400 mb-2">Project: {contribution.project}</p>
                      )}
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {contribution.amount.toLocaleString()} {contribution.unit}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">•</span>
                        <span className="text-violet-600 dark:text-violet-400">
                          {contribution.equityPercentage}% equity
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">•</span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                          ${contribution.equityValue.toLocaleString()} value
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Employee Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Employee Activity</h2>
          <button 
            onClick={() => setIsEmployeesMinimized(!isEmployeesMinimized)}
            className="p-2 text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            {isEmployeesMinimized ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>

        {!isEmployeesMinimized && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {employees.map((employee) => (
                <div key={employee.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {employee.avatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{employee.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{employee.role}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Hours Today:</span>
                      <span className="font-medium">{employee.hoursToday}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Company:</span>
                      <span className="font-medium">{employee.company}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Current Project:</span>
                      <p className="font-medium mt-1">{employee.currentProject}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Active Projects */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Active Projects</h2>
          <button 
            onClick={() => setIsProjectsMinimized(!isProjectsMinimized)}
            className="p-2 text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            {isProjectsMinimized ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>

        {!isProjectsMinimized && (
          <div className="p-6">
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{project.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(project.priority)}`}>
                          {project.priority}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{project.company}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-violet-600 dark:text-violet-400">{project.progress}%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Complete</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-violet-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {project.assignees.map((assignee, index) => (
                        <div key={index} className="w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center text-white text-xs">
                          {assignee.split(' ').map(n => n[0]).join('')}
                        </div>
                      ))}
                      <span className="text-sm text-gray-600 dark:text-gray-400">{project.assignees.length} assigned</span>
                    </div>
                    <button className="text-violet-600 hover:text-violet-700 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Integrations Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Integration Status</h2>
          <button 
            onClick={() => setIsIntegrationsMinimized(!isIntegrationsMinimized)}
            className="p-2 text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            {isIntegrationsMinimized ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>

        {!isIntegrationsMinimized && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {integrations.map((integration) => (
                <div key={integration.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-violet-400 to-violet-500 rounded-lg flex items-center justify-center text-white">
                        {integration.name[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{integration.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{integration.type}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(integration.status)}`}>
                      {integration.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{integration.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Last sync: {integration.lastSync}
                    </span>
                    <button className="text-violet-600 hover:text-violet-700 text-sm font-medium">
                      Configure
                    </button>
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

export default Management;