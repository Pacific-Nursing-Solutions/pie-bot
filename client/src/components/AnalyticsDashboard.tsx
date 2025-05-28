import { useState } from 'react';
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
      color: "text-green-600"
    },
    {
      title: "Active Commands",
      value: "1,247",
      change: 12.3,
      changeLabel: "commands executed",
      icon: Zap,
      color: "text-blue-600"
    },
    {
      title: "Equity Operations",
      value: "89",
      change: -2.1,
      changeLabel: "this week",
      icon: Target,
      color: "text-orange-600"
    },
    {
      title: "System Health",
      value: "99.8%",
      change: 0.3,
      changeLabel: "uptime",
      icon: Activity,
      color: "text-purple-600"
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
      command: 'equity split techstart',
      result: 'Calculated distribution for 4 stakeholders',
      timestamp: '5 min ago',
      success: true
    },
    {
      command: 'deploy token TSI',
      result: 'Contract deployed to Base: 0x1234...5678',
      timestamp: '12 min ago',
      success: true
    },
    {
      command: 'fund ai-solutions',
      result: 'Fundraising package prepared, 3 documents generated',
      timestamp: '28 min ago',
      success: true
    },
    {
      command: 'debt analyze',
      result: 'Found $85K total debt across 3 protocols',
      timestamp: '45 min ago',
      success: true
    },
    {
      command: 'valuation series-a',
      result: 'DCF analysis complete: $8.2M valuation',
      timestamp: '1 hour ago',
      success: true
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
    <div className="space-y-6">
      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${metric.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metric.value}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`flex items-center space-x-1 ${
                    metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change >= 0 ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">
                      {Math.abs(metric.change)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{metric.changeLabel}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Command Activity & System Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Command Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Command Activity</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Live</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.success ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono">
                        {activity.command}
                      </code>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{activity.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{activity.result}</p>
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
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center space-x-3">
            <Target className="w-8 h-8" />
            <div>
              <p className="text-orange-100">Companies Managed</p>
              <p className="text-3xl font-bold">3</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8" />
            <div>
              <p className="text-purple-100">Investment Pools</p>
              <p className="text-3xl font-bold">3</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center space-x-3">
            <DollarSign className="w-8 h-8" />
            <div>
              <p className="text-green-100">Total Managed</p>
              <p className="text-3xl font-bold">$3.9M</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;