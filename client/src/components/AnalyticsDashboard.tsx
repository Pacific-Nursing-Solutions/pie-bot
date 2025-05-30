import { useState } from 'react';
import { KPICard, CompactMetric, DataTable, Sparkline } from './DataVisualization';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Users,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Zap
} from 'lucide-react';

interface MetricCard {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: any;
  color: string;
}

interface SystemAlert {
  id: number;
  type: 'warning' | 'success' | 'info' | 'critical';
  message: string;
  timestamp: string;
  action?: string;
}

const AnalyticsDashboard = () => {
  const [timeframe, setTimeframe] = useState('7d');

  const metrics: MetricCard[] = [
    {
      title: "Portfolio Performance",
      value: "+23.4%",
      change: 5.2,
      changeLabel: "vs last month",
      icon: TrendingUp,
      color: "text-emerald-500"
    },
    {
      title: "Active Commands",
      value: "1,247",
      change: 12.3,
      changeLabel: "commands executed",
      icon: Zap,
      color: "text-sky-500"
    },
    {
      title: "Equity Operations",
      value: "89",
      change: -2.1,
      changeLabel: "this week",
      icon: Target,
      color: "text-amber-500"
    },
    {
      title: "System Health",
      value: "99.8%",
      change: 0.3,
      changeLabel: "uptime",
      icon: Activity,
      color: "text-violet-500"
    }
  ];

  const systemAlerts: SystemAlert[] = [
    {
      id: 1,
      type: 'warning',
      message: 'MakerDAO vault approaching liquidation threshold',
      timestamp: '2 min ago',
      action: 'debt analyze'
    },
    {
      id: 2,
      type: 'success',
      message: 'Series A term sheet successfully generated and signed',
      timestamp: '15 min ago'
    },
    {
      id: 3,
      type: 'info',
      message: 'New ENS subdomain registered: voting.founder.eth',
      timestamp: '1 hour ago'
    },
    {
      id: 4,
      type: 'critical',
      message: 'Compliance certificate expired for GreenTech Ventures',
      timestamp: '3 hours ago',
      action: 'create agreement compliance'
    }
  ];

  const recentActivity = [
    {
      type: 'recent',
      title: 'Series A term sheet signed',
      company: 'TechStart Inc.',
      amount: '$2M',
      timestamp: '15 min ago',
      status: 'completed'
    },
    {
      type: 'recent',
      title: 'Equity distribution updated',
      company: 'AI Solutions LLC',
      details: '4 new stakeholders added',
      timestamp: '2 hours ago',
      status: 'completed'
    },
    {
      type: 'recent',
      title: 'MakerDAO vault liquidation risk',
      company: 'Personal',
      amount: '$85K exposure',
      timestamp: '3 hours ago',
      status: 'warning'
    }
  ];

  const upcomingActivity = [
    {
      type: 'upcoming',
      title: 'Board meeting scheduled',
      company: 'TechStart Inc.',
      details: 'Quarterly review and Series A discussion',
      timestamp: 'Tomorrow, 2:00 PM',
      status: 'scheduled'
    },
    {
      type: 'upcoming',
      title: 'Compliance certificate renewal',
      company: 'GreenTech Ventures',
      details: 'Annual certification expires soon',
      timestamp: 'In 3 days',
      status: 'urgent'
    },
    {
      type: 'upcoming',
      title: 'Pool distribution payment',
      company: 'Startup Accelerator Pool',
      amount: '$125K distribution',
      timestamp: 'March 31, 2024',
      status: 'scheduled'
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20';
      case 'success':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20';
      default:
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20';
    }
  };

  return (
    <div className="space-y-6 bg-[var(--dashboard-bg)] min-h-screen p-6">
      {/* Executive Summary - Key Performance Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <KPICard
          title="Monthly Recurring Revenue"
          subtitle="vs $45K target"
          value={38500}
          target={45000}
          max={60000}
          unit="$"
          trend={{
            direction: 'up',
            percentage: 12.3,
            period: 'vs last month'
          }}
          ranges={{
            poor: 20000,
            satisfactory: 35000,
            good: 50000
          }}
        />
        
        <KPICard
          title="Cash Runway"
          subtitle="vs 18 month target"
          value={14}
          target={18}
          max={24}
          unit=" months"
          trend={{
            direction: 'down',
            percentage: 2.1,
            period: 'vs last quarter'
          }}
          ranges={{
            poor: 6,
            satisfactory: 12,
            good: 20
          }}
        />
      </div>

      {/* Operational Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <CompactMetric
          label="Active Users"
          value="1,247"
          change={{ value: "+12.3%", direction: "up" }}
          sparkline={[980, 1050, 1120, 1180, 1240, 1220, 1247]}
          icon={<Users className="w-4 h-4" />}
        />
        
        <CompactMetric
          label="Command Executions"
          value="89"
          change={{ value: "+5.7%", direction: "up" }}
          sparkline={[67, 72, 78, 81, 85, 87, 89]}
          icon={<Zap className="w-4 h-4" />}
        />
        
        <CompactMetric
          label="System Uptime"
          value="99.8%"
          change={{ value: "0.0%", direction: "neutral" }}
          sparkline={[99.6, 99.7, 99.8, 99.8, 99.9, 99.8, 99.8]}
          icon={<Activity className="w-4 h-4" />}
        />
        
        <CompactMetric
          label="Portfolio Value"
          value="$3.17M"
          change={{ value: "+23.4%", direction: "up" }}
          sparkline={[2.8, 2.9, 3.0, 3.1, 3.15, 3.16, 3.17]}
          icon={<DollarSign className="w-4 h-4" />}
        />
      </div>

      {/* Data Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataTable
          title="Recent Transactions"
          headers={["Date", "Type", "Amount", "Status"]}
          rows={[
            ["2024-05-30", "Equity Distribution", "$125K", "Completed"],
            ["2024-05-29", "Series A", "$2M", "Completed"],
            ["2024-05-28", "MakerDAO Vault", "$85K", "Warning"],
            ["2024-05-27", "Pool Distribution", "$50K", "Scheduled"],
            ["2024-05-26", "Advisory Shares", "$15K", "Completed"]
          ]}
        />
        
        <DataTable
          title="Company Performance Summary"
          headers={["Company", "Valuation", "Change", "Runway"]}
          rows={[
            ["TechStart Inc.", "$12.5M", "+15.3%", "14 mo"],
            ["AI Solutions LLC", "$8.2M", "+8.7%", "18 mo"],
            ["GreenTech Ventures", "$5.1M", "-2.1%", "12 mo"],
            ["Startup Pool", "$15.8M", "+12.4%", "N/A"]
          ]}
        />
      </div>

      {/* System Alerts - Redesigned with soft colors */}
      <div className="bg-[var(--card-bg)] border border-[var(--subtle-border)] rounded-lg">
        <div className="px-6 py-4 border-b border-[var(--grid-line)]">
          <h3 className="text-lg font-medium text-[var(--text-primary)]">System Alerts</h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded border ${getAlertStyle(alert.type)}`}>
                <div className="flex items-start space-x-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{alert.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-[var(--text-muted)]">{alert.timestamp}</span>
                      {alert.action && (
                        <button className="text-xs bg-[var(--dashboard-bg)] hover:bg-[var(--subtle-border)] px-2 py-1 rounded transition-colors">
                          Run: {alert.action}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional KPI Section with more Bullet Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <KPICard
          title="Equity Pool Utilization"
          subtitle="vs 80% allocation target"
          value={68}
          target={80}
          max={100}
          unit="%"
          compact={true}
          ranges={{
            poor: 40,
            satisfactory: 60,
            good: 85
          }}
        />
        
        <KPICard
          title="Active Stakeholders"
          subtitle="vs 50 target capacity"
          value={34}
          target={50}
          max={75}
          unit=" people"
          compact={true}
          ranges={{
            poor: 20,
            satisfactory: 40,
            good: 60
          }}
        />
        
        <KPICard
          title="Compliance Score"
          subtitle="vs 95% target"
          value={89}
          target={95}
          max={100}
          unit="%"
          compact={true}
          trend={{
            direction: 'down',
            percentage: 3.2,
            period: 'needs attention'
          }}
          ranges={{
            poor: 70,
            satisfactory: 85,
            good: 95
          }}
        />
      </div>

    </div>
  );
};
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'completed' ? 'bg-emerald-500' : 
                    activity.status === 'warning' ? 'bg-amber-500' : 'bg-slate-400'
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{activity.title}</h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{activity.timestamp}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{activity.company}</span>
                      {activity.amount && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{activity.amount}</span>
                        </>
                      )}
                      {activity.details && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{activity.details}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Upcoming Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'urgent' ? 'bg-red-500' : 
                    activity.status === 'scheduled' ? 'bg-blue-500' : 'bg-slate-400'
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{activity.title}</h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{activity.timestamp}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{activity.company}</span>
                      {activity.amount && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{activity.amount}</span>
                        </>
                      )}
                      {activity.details && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{activity.details}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">System Alerts</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border ${getAlertStyle(alert.type)}`}>
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{alert.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{alert.timestamp}</span>
                        {alert.action && (
                          <button className="text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-2 py-1 rounded transition-colors">
                            Run: {alert.action}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Portfolio Performance</h3>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="24h">24 Hours</option>
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
              <option value="90d">90 Days</option>
            </select>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 font-medium">Portfolio Performance Chart</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Real-time analytics showing {timeframe} performance trends
              </p>
              <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">+23.4%</p>
                  <p className="text-xs text-gray-500">Total Return</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">$3.17M</p>
                  <p className="text-xs text-gray-500">Portfolio Value</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">89</p>
                  <p className="text-xs text-gray-500">Operations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Companies Managed</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">3</p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Investment Pools</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">3</p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Total Managed</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">$3.9M</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;