import { useState } from 'react';
import { DataTable } from './DataVisualization';
import PortfolioChart from './PortfolioChart';
import SimpleMetric from './SimpleMetric';
import WalletSnapshot from './WalletSnapshot';
import EquityGrowthChart from './EquityGrowthChart';
import DistributionsChart from './DistributionsChart';
import { 
  AlertTriangle,
  CheckCircle,
  Clock
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

  const portfolioProjects = [
    { name: 'TechStart Inc.', value: 1250000, change: 15.3, ownership: 18.5 },
    { name: 'AI Solutions LLC', value: 820000, change: 8.7, ownership: 12.2 },
    { name: 'GreenTech Ventures', value: 510000, change: -2.1, ownership: 25.0 },
    { name: 'Startup Pool', value: 1580000, change: 12.4, ownership: 8.3 }
  ];

  // Sample sparkline data for metrics - more realistic variation
  const revenueData = [31200, 28900, 34800, 32100, 39200, 33400, 36900, 35800, 38500];
  const runwayData = [18, 17.2, 16.8, 15.9, 15.1, 14.7, 14.3, 14.1, 14];

  // Wallet holdings data
  const walletHoldings = [
    { company: 'TechStart Inc.', walletAddress: '0x1234...5678', equityValue: 225000, percentage: 18.5 },
    { company: 'AI Solutions LLC', walletAddress: '0xabcd...efgh', equityValue: 100040, percentage: 12.2 },
    { company: 'Startup Pool', walletAddress: '0x9876...1234', equityValue: 131140, percentage: 8.3 }
  ];

  // ROI data - single line showing performance over 30-day increments with realistic variation
  const growthData = [
    { days: '30', roi: 12.3 },
    { days: '60', roi: 8.9 },
    { days: '90', roi: 18.4 },
    { days: '120', roi: 14.2 },
    { days: '150', roi: 21.7 },
    { days: '180', roi: 16.8 },
    { days: '210', roi: 24.1 },
    { days: '240', roi: 19.3 },
    { days: '270', roi: 22.9 },
    { days: '300', roi: 17.6 },
    { days: '330', roi: 25.8 },
    { days: '360', roi: 20.4 }
  ];

  // Distribution payments data with more realistic variation
  const distributionData = [
    { period: 'Dec', amount: 1850 },
    { period: 'Jan', amount: 2400 },
    { period: 'Feb', amount: 1920 },
    { period: 'Mar', amount: 3100 },
    { period: 'Apr', amount: 2650 },
    { period: 'May', amount: 2200 },
    { period: 'Jun', amount: 3850 },
    { period: 'Jul', amount: 2950 },
    { period: 'Aug', amount: 3400 },
    { period: 'Sep', amount: 2750 },
    { period: 'Oct', amount: 4200 },
    { period: 'Nov', amount: 3600 }
  ];

  return (
    <div className="space-y-6 bg-[var(--dashboard-bg)] min-h-screen p-6">
      {/* Portfolio-Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SimpleMetric
          label="Total Portfolio Value"
          value="$4.16M"
          sparklineData={[3800000, 3950000, 4020000, 4100000, 4050000, 4160000, 4180000, 4140000, 4160000]}
          trend="up"
          startDate="Jan 2024"
          endDate="May 2024"
        />
        
        <SimpleMetric
          label="Total Equity Holdings"
          value="16.2%"
          sparklineData={[14.2, 15.1, 15.8, 16.0, 15.6, 16.2, 16.4, 16.1, 16.2]}
          trend="up"
          startDate="Jan 2024"
          endDate="May 2024"
        />
      </div>

      {/* Portfolio Holdings and Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PortfolioChart projects={portfolioProjects} />
        <EquityGrowthChart data={growthData} />
        <DistributionsChart data={distributionData} />
      </div>

      {/* Wallet Snapshot and Individual Ownership */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <WalletSnapshot holdings={walletHoldings} />
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
          {portfolioProjects.map((project) => (
            <PortfolioChart
              key={project.name}
              projects={portfolioProjects}
              showOwnership={true}
              selectedProject={project.name}
            />
          ))}
        </div>
      </div>

      {/* Data Tables Section - Removed financial details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataTable
          title="Recent Activity"
          headers={["Date", "Type", "Company", "Status"]}
          rows={[
            ["2024-05-30", "Equity Distribution", "TechStart Inc.", "Completed"],
            ["2024-05-29", "Series A Signing", "TechStart Inc.", "Completed"],
            ["2024-05-28", "Vault Review", "Personal", "Warning"],
            ["2024-05-27", "Pool Distribution", "Startup Pool", "Scheduled"],
            ["2024-05-26", "Advisory Shares", "GreenTech", "Completed"]
          ]}
        />
        
        <DataTable
          title="Company Performance"
          headers={["Company", "Change", "Runway", "Status"]}
          rows={[
            ["TechStart Inc.", "+15.3%", "14 mo", "Growing"],
            ["AI Solutions LLC", "+8.7%", "18 mo", "Stable"],
            ["GreenTech Ventures", "-2.1%", "12 mo", "Review"],
            ["Startup Pool", "+12.4%", "N/A", "Strong"]
          ]}
        />
      </div>

      {/* System Alerts */}
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