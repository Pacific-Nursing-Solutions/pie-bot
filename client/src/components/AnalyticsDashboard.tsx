import { useState } from 'react';
import { DataTable } from './DataVisualization';
import PortfolioChart from './PortfolioChart';
import SimpleMetric from './SimpleMetric';
import WalletSnapshot from './WalletSnapshot';
import EquityGrowthChart from './EquityGrowthChart';
import DistributionsChart from './DistributionsChart';
import TreemapChart from './TreemapChart';
import HoldingsOverview from './HoldingsOverview';
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

  // Portfolio value data over 30-day increments with major drop at 90 days
  const portfolioValueData = [
    { days: '360', value: 3750000 },
    { days: '330', value: 3900000 },
    { days: '300', value: 3800000 },
    { days: '270', value: 3980000 },
    { days: '240', value: 3950000 },
    { days: '210', value: 4100000 },
    { days: '180', value: 4020000 },
    { days: '150', value: 4050000 },
    { days: '120', value: 3920000 },
    { days: '90', value: 3850000 }, // Big drop 90 days ago
    { days: '60', value: 4140000 },
    { days: '30', value: 4160000 }
  ];

  // Equity holdings percentage over same time periods
  const equityHoldingsData = [
    { days: '360', value: 14.2 },
    { days: '330', value: 15.3 },
    { days: '300', value: 14.9 },
    { days: '270', value: 15.7 },
    { days: '240', value: 15.4 },
    { days: '210', value: 16.0 },
    { days: '180', value: 15.6 },
    { days: '150', value: 15.8 },
    { days: '120', value: 15.2 },
    { days: '90', value: 14.8 }, // Corresponding drop
    { days: '60', value: 16.1 },
    { days: '30', value: 16.2 }
  ];

  // Wallet holdings data - removed pool positions
  const walletHoldings = [
    { company: 'TechStart Inc.', walletAddress: '0x1234...5678', equityValue: 225000, percentage: 18.5 },
    { company: 'AI Solutions LLC', walletAddress: '0xabcd...efgh', equityValue: 100040, percentage: 12.2 },
    { company: 'GreenTech Ventures', walletAddress: '0xdef0...9abc', equityValue: 127500, percentage: 25.0 }
  ];

  // ROI data - single line showing performance over 30-day increments with drop at 90 days
  const growthData = [
    { days: '360', roi: 9.8 },
    { days: '330', roi: 15.3 },
    { days: '300', roi: 11.5 },
    { days: '270', roi: 16.9 },
    { days: '240', roi: 14.2 },
    { days: '210', roi: 18.4 },
    { days: '180', roi: 12.3 },
    { days: '150', roi: 6.8 },
    { days: '120', roi: -2.1 },
    { days: '90', roi: -8.7 }, // Big losing month 90 days ago
    { days: '60', roi: 18.2 },
    { days: '30', roi: 20.4 }
  ];

  // Distribution payments data with same X-axis and drop at 90 days
  const distributionData = [
    { period: '360', amount: 1850 },
    { period: '330', amount: 2850 },
    { period: '300', amount: 1950 },
    { period: '270', amount: 2750 },
    { period: '240', amount: 2200 },
    { period: '210', amount: 3100 },
    { period: '180', amount: 2400 },
    { period: '150', amount: 2650 },
    { period: '120', amount: 1800 },
    { period: '90', amount: 1200 }, // Big drop 90 days ago
    { period: '60', amount: 3400 },
    { period: '30', amount: 3600 }
  ];

  // Holdings overview data
  const holdingsPositions = [
    {
      id: 1,
      name: 'TechStart Inc.',
      symbol: 'TSI',
      change24h: -2.17,
      change7d: -4.24,
      marketCap: 2450000,
      volume24h: 57287083,
      supply: 19870000,
      sparklineData: portfolioValueData.slice(6).map(d => ({ value: d.value / 1000 }))
    },
    {
      id: 2,
      name: 'AI Solutions LLC',
      symbol: 'ASL',
      change24h: -4.36,
      change7d: -1.35,
      marketCap: 980000,
      volume24h: 25371333,
      supply: 12072000,
      sparklineData: portfolioValueData.slice(4).map(d => ({ value: d.value / 2000 }))
    },
    {
      id: 3,
      name: 'GreenTech Ventures',
      symbol: 'GTV',
      change24h: 0.02,
      change7d: 0.02,
      marketCap: 470000,
      volume24h: 10123686,
      supply: 15303000,
      sparklineData: portfolioValueData.slice(2).map(d => ({ value: d.value / 3000 }))
    },
    {
      id: 4,
      name: 'Startup Pool',
      symbol: 'SP',
      change24h: 1.24,
      change7d: 2.15,
      marketCap: 260000,
      volume24h: 5428971,
      supply: 8350000,
      sparklineData: portfolioValueData.map(d => ({ value: d.value / 4000 }))
    }
  ];

  const portfolioSparklineData = portfolioValueData.map(d => ({ value: d.value }));

  return (
    <div className="space-y-6 bg-[var(--dashboard-bg)] min-h-screen p-6">
      {/* Holdings Overview - Full Width */}
      <HoldingsOverview 
        positions={holdingsPositions}
        portfolioSparkline={portfolioSparklineData}
      />

      {/* Market Heatmap */}
      <TreemapChart 
        data={[]}
        title="Market Performance Heatmap"
      />

      {/* Portfolio-Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SimpleMetric
          label="Total Portfolio Value"
          value="$4.16M"
          sparklineData={portfolioValueData}
          trend="up"
          startDate="30 days"
          endDate="360 days"
        />
        
        <SimpleMetric
          label="ROI"
          value="16.2%"
          sparklineData={equityHoldingsData}
          trend="up"
          startDate="30 days"
          endDate="360 days"
        />
      </div>

      {/* Portfolio Holdings and Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PortfolioChart projects={portfolioProjects} />
        <EquityGrowthChart data={growthData} />
        <DistributionsChart data={distributionData} />
      </div>



      {/* Individual Ownership Charts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {portfolioProjects.map((project) => (
          <PortfolioChart
            key={project.name}
            projects={portfolioProjects}
            showOwnership={true}
            selectedProject={project.name}
          />
        ))}
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
          headers={["Company", "Monthly Cashflow", "Runway", "Status"]}
          rows={[
            ["TechStart Inc.", "-$2.4K", "14 mo", "Growing"],
            ["AI Solutions LLC", "+$1.2K", "18 mo", "Stable"],
            ["GreenTech Ventures", "-$850", "12 mo", "Review"],
            ["Startup Pool", "-$450", "N/A", "Strong"]
          ]}
        />
      </div>

      {/* System Alerts */}
      <div className="bg-[var(--card-bg)] border border-[var(--subtle-border)] rounded-lg">
        <div className="px-6 py-4 border-b border-[var(--grid-line)]">
          <h3 className="text-lg font-medium text-[var(--text-primary)]">Performance</h3>
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