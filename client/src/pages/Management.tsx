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
  Wallet,
  Scale,
  FileText,
  Building,
  Plus,
  AlertTriangle,
  Gavel
} from 'lucide-react';
import WalletManager from '@/components/WalletManager';

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

interface LegalAction {
  id: number;
  type: 'board_meeting' | 'shareholder_resolution' | 'equity_distribution' | 'incorporation' | 'amendment';
  title: string;
  description: string;
  company: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  requiredApprovals?: string[];
  documents?: string[];
}

interface CompanyFormation {
  entityType: 'delaware_c_corp' | 'delaware_llc' | 'wyoming_llc' | 'cayman_islands' | 'singapore_pte';
  jurisdiction: string;
  name: string;
  dynamicEquity: {
    enabled: boolean;
    factors: {
      timeCommitment: number;
      capitalContribution: number;
      ideaContribution: number;
      executionRisk: number;
    };
    vestingSchedule: {
      cliffMonths: number;
      vestingYears: number;
    };
  };
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
  const [showContributionDetails, setShowContributionDetails] = useState(false);
  const [contributionTimeframe, setContributionTimeframe] = useState<'week' | 'month' | 'year' | 'all-time'>('month');
  const [employeeActivityPeriod, setEmployeeActivityPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [isLegalActionsMinimized, setIsLegalActionsMinimized] = useState(false);
  const [showCompanyFormation, setShowCompanyFormation] = useState(false);
  const [selectedCalendarProvider, setSelectedCalendarProvider] = useState<'google' | 'apple' | 'outlook' | null>(null);

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
    },
    {
      id: 5,
      name: "Dentity",
      type: "Identity Verification",
      status: 'disconnected',
      description: "Decentralized identity verification and KYC",
      lastSync: "Never"
    },
    {
      id: 6,
      name: "Worldcoin",
      type: "Identity Verification",
      status: 'disconnected',
      description: "Proof of personhood and identity verification",
      lastSync: "Never"
    },
    {
      id: 7,
      name: "Civic",
      type: "Identity Verification",
      status: 'disconnected',
      description: "Identity verification and compliance solutions",
      lastSync: "Never"
    },
    {
      id: 8,
      name: "BrightID",
      type: "Identity Verification",
      status: 'disconnected',
      description: "Social identity network for humans",
      lastSync: "Never"
    }
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const [legalActions] = useState<LegalAction[]>([
    {
      id: 1,
      type: 'board_meeting',
      title: 'Quarterly Board Meeting Q1 2024',
      description: 'Review financial performance, approve equity grants, discuss strategic initiatives',
      company: 'TechStart Inc.',
      dueDate: '2024-04-15',
      priority: 'high',
      status: 'pending',
      requiredApprovals: ['CEO', 'CFO', 'Independent Director'],
      documents: ['Financial Report', 'Equity Grant Proposals']
    },
    {
      id: 2,
      type: 'shareholder_resolution',
      title: 'Employee Stock Option Plan Amendment',
      description: 'Increase option pool from 15% to 20% for employee incentives',
      company: 'TechStart Inc.',
      dueDate: '2024-04-30',
      priority: 'medium',
      status: 'in_progress',
      requiredApprovals: ['Majority Shareholders'],
      documents: ['Amended ESOP', 'Shareholder Consent Forms']
    },
    {
      id: 3,
      type: 'equity_distribution',
      title: 'Founder Equity Finalization',
      description: 'Finalize equity distribution based on dynamic equity calculations',
      company: 'AI Solutions LLC',
      dueDate: '2024-04-10',
      priority: 'urgent',
      status: 'overdue',
      documents: ['Equity Distribution Agreement', 'Vesting Schedules']
    },
    {
      id: 4,
      type: 'incorporation',
      title: 'Form New AI Research Subsidiary',
      description: 'Incorporate Delaware C-Corp for AI research and development activities',
      company: 'New Entity',
      dueDate: '2024-05-15',
      priority: 'medium',
      status: 'pending',
      documents: ['Articles of Incorporation', 'Bylaws', 'Initial Resolutions']
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

      {/* Wallet Management */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Wallet Management</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Connect your X account to wallets and manage both personal and company wallets
          </p>
        </div>
        <div className="p-6">
          <WalletManager walletType="personal" />
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-3 text-sm font-medium text-gray-600 dark:text-gray-400">Company</th>
                    <th className="text-left py-3 px-3 text-sm font-medium text-gray-600 dark:text-gray-400">Description</th>
                    <th className="text-right py-3 px-3 text-sm font-medium text-gray-600 dark:text-gray-400">Amount</th>
                    <th className="text-right py-3 px-3 text-sm font-medium text-gray-600 dark:text-gray-400">Equity %</th>
                    <th className="text-right py-3 px-3 text-sm font-medium text-gray-600 dark:text-gray-400">Equity Value</th>
                    <th className="text-right py-3 px-3 text-sm font-medium text-gray-600 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Total Contributions Row */}
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-4 px-3">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">Total</div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">Contributions</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{personalContributions.length} contributions</div>
                      </div>
                    </td>
                    <td className="py-4 px-3 text-gray-500 dark:text-gray-400">Time, capital, and IP contributions</td>
                    <td className="py-4 px-3 text-right font-semibold text-gray-900 dark:text-gray-100">$240K</td>
                    <td className="py-4 px-3 text-right font-semibold text-gray-900 dark:text-gray-100">80%</td>
                    <td className="py-4 px-3 text-right font-semibold text-gray-900 dark:text-gray-100">$1.55M</td>
                    <td className="py-4 px-3 text-right">
                      <button 
                        onClick={() => setShowContributionDetails(!showContributionDetails)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 cursor-pointer"
                      >
                        {showContributionDetails ? 'Collapse ↑' : 'Expand ↓'}
                      </button>
                    </td>
                  </tr>

                  {/* Individual Contribution Rows */}
                  {showContributionDetails && personalContributions.map((contribution) => (
                    <tr key={contribution.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-3 px-3">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{contribution.company}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{contribution.date} • {contribution.type.toUpperCase()}</div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-sm text-gray-600 dark:text-gray-400">{contribution.description}</div>
                        {contribution.project && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Project: {contribution.project}</div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-gray-900 dark:text-gray-100">
                        {contribution.amount.toLocaleString()} {contribution.unit}
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-gray-900 dark:text-gray-100">
                        {contribution.equityPercentage}%
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-gray-900 dark:text-gray-100">
                        ${contribution.equityValue.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-gray-900 dark:text-gray-100">
                        -
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Employee Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Employee Activity</h2>
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {(['week', 'month', 'year'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setEmployeeActivityPeriod(period)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    employeeActivityPeriod === period
                      ? 'bg-violet-600 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400'
                  }`}
                >
                  {period === 'week' ? 'Week' : period === 'month' ? 'Month' : 'Year'}
                </button>
              ))}
            </div>
          </div>
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

      {/* Legal Actions & Company Formation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Legal Actions & Compliance</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowCompanyFormation(true)}
                className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm"
              >
                <Building className="w-4 h-4 mr-1" />
                Form Company
              </button>
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {(['google', 'apple', 'outlook'] as const).map((provider) => (
                  <button
                    key={provider}
                    onClick={() => setSelectedCalendarProvider(provider)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedCalendarProvider === provider
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    {provider === 'google' ? 'Google' : provider === 'apple' ? 'Apple' : 'Outlook'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsLegalActionsMinimized(!isLegalActionsMinimized)}
            className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {isLegalActionsMinimized ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>

        {!isLegalActionsMinimized && (
          <div className="p-6">
            {/* Urgent Actions Alert */}
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3" />
                <div>
                  <h3 className="font-semibold text-red-800 dark:text-red-300">Action Required</h3>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    1 overdue action, 2 actions due within 7 days
                  </p>
                </div>
              </div>
            </div>

            {/* Legal Actions Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {legalActions.map((action) => (
                <div key={action.id} className={`border rounded-lg p-4 ${
                  action.status === 'overdue' ? 'border-red-300 bg-red-50 dark:bg-red-900/10' :
                  action.priority === 'urgent' ? 'border-orange-300 bg-orange-50 dark:bg-orange-900/10' :
                  action.priority === 'high' ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/10' :
                  'border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {action.type === 'board_meeting' && <Gavel className="w-4 h-4 text-blue-600" />}
                      {action.type === 'shareholder_resolution' && <Scale className="w-4 h-4 text-purple-600" />}
                      {action.type === 'equity_distribution' && <TrendingUp className="w-4 h-4 text-green-600" />}
                      {action.type === 'incorporation' && <Building className="w-4 h-4 text-orange-600" />}
                      {action.type === 'amendment' && <FileText className="w-4 h-4 text-gray-600" />}
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        action.priority === 'urgent' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                        action.priority === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                        action.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                      }`}>
                        {action.priority.toUpperCase()}
                      </span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      action.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      action.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      action.status === 'overdue' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                    }`}>
                      {action.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{action.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Company: </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{action.company}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Due: </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{action.dueDate}</span>
                    </div>
                  </div>

                  {action.requiredApprovals && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Required Approvals:</p>
                      <div className="flex flex-wrap gap-1">
                        {action.requiredApprovals.map((approval, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded">
                            {approval}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {action.documents && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Documents:</p>
                      <div className="flex flex-wrap gap-1">
                        {action.documents.map((doc, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded">
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      View Details
                    </button>
                    <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                      Schedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Company Formation Modal */}
      {showCompanyFormation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Form New Company</h2>
              <button 
                onClick={() => setShowCompanyFormation(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company Name
                </label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Enter company name"
                />
              </div>

              {/* Entity Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Entity Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100">
                  <option value="">Select entity type</option>
                  <option value="delaware_c_corp">Delaware C-Corporation</option>
                  <option value="delaware_llc">Delaware LLC</option>
                  <option value="wyoming_llc">Wyoming LLC</option>
                  <option value="cayman_islands">Cayman Islands</option>
                  <option value="singapore_pte">Singapore Pte Ltd</option>
                </select>
              </div>

              {/* Dynamic Equity Settings */}
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Dynamic Equity Configuration</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="enableDynamicEquity" className="rounded" />
                    <label htmlFor="enableDynamicEquity" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Dynamic Equity Distribution
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Time Commitment Weight
                      </label>
                      <input type="range" min="0" max="100" defaultValue="40" className="w-full" />
                      <span className="text-xs text-gray-500">40%</span>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Capital Contribution Weight
                      </label>
                      <input type="range" min="0" max="100" defaultValue="30" className="w-full" />
                      <span className="text-xs text-gray-500">30%</span>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Idea Contribution Weight
                      </label>
                      <input type="range" min="0" max="100" defaultValue="20" className="w-full" />
                      <span className="text-xs text-gray-500">20%</span>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Execution Risk Weight
                      </label>
                      <input type="range" min="0" max="100" defaultValue="10" className="w-full" />
                      <span className="text-xs text-gray-500">10%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Cliff Period (months)
                      </label>
                      <input type="number" min="0" max="24" defaultValue="12" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-gray-100" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Vesting Period (years)
                      </label>
                      <input type="number" min="1" max="8" defaultValue="4" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-gray-100" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Calendar Integration */}
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Calendar Integration</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Connect your calendar to receive automated reminders for legal deadlines and board meetings.
                </p>
                <div className="flex space-x-2">
                  <button className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Connect Google Calendar
                  </button>
                  <button className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Connect Apple Calendar
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Create Company
                </button>
                <button 
                  onClick={() => setShowCompanyFormation(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
            <div className="space-y-2">
              {integrations.map((integration) => (
                <div 
                  key={integration.id} 
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => setSelectedIntegration(integration)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      integration.status === 'connected' ? 'bg-green-500' :
                      integration.status === 'pending' ? 'bg-yellow-500' :
                      'bg-gray-400'
                    }`}></div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{integration.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{integration.type}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(integration.status)}`}>
                    {integration.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Integration Details Popup */}
        {selectedIntegration && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedIntegration(null)}>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-violet-400 to-violet-500 rounded-lg flex items-center justify-center text-white">
                    {selectedIntegration.name[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{selectedIntegration.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedIntegration.type}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(selectedIntegration.status)}`}>
                  {selectedIntegration.status}
                </span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4">{selectedIntegration.description}</p>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last sync: {selectedIntegration.lastSync}
                </p>
              </div>
              
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => setSelectedIntegration(null)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
                  {selectedIntegration.status === 'connected' ? 'Manage' : 'Connect'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Management;