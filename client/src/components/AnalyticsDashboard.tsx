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

interface SystemAlert {
  id: number;
  type: 'warning' | 'success' | 'info' | 'critical';
  message: string;
  timestamp: string;
  action?: string;
}

const AnalyticsDashboard = () => {
  const [timeframe, setTimeframe] = useState('7d');

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
    </div>
  );
};

export default AnalyticsDashboard;