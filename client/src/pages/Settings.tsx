import { useState } from 'react';
import { Link } from 'wouter';
import { 
  Settings as SettingsIcon,
  Plug,
  Shield,
  Bell,
  User,
  Palette,
  Database,
  Key,
  Zap,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Plus,
  ExternalLink
} from 'lucide-react';

interface Integration {
  id: number;
  name: string;
  category: string;
  description: string;
  status: 'connected' | 'available' | 'coming-soon';
  icon: string;
  setupComplexity: 'easy' | 'medium' | 'advanced';
  features: string[];
  website: string;
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState('integrations');
  const [isIntegrationsMinimized, setIsIntegrationsMinimized] = useState(false);

  const integrations: Integration[] = [
    {
      id: 1,
      name: "Hubstaff",
      category: "Time Tracking",
      description: "Employee time tracking and productivity monitoring",
      status: 'connected',
      icon: "H",
      setupComplexity: 'easy',
      features: ["Time tracking", "Productivity insights", "Team monitoring"],
      website: "hubstaff.com"
    },
    {
      id: 2,
      name: "QuickBooks",
      category: "Accounting",
      description: "Financial data sync for accounting and reporting",
      status: 'available',
      icon: "Q",
      setupComplexity: 'advanced',
      features: ["Financial sync", "Expense tracking", "Tax reporting"],
      website: "quickbooks.com"
    },
    {
      id: 3,
      name: "DocuSign",
      category: "Legal",
      description: "Digital signature workflows for legal documents",
      status: 'connected',
      icon: "D",
      setupComplexity: 'easy',
      features: ["Digital signatures", "Document workflows", "Legal compliance"],
      website: "docusign.com"
    },
    {
      id: 4,
      name: "Slack",
      category: "Communication",
      description: "Team communication and automated notifications",
      status: 'available',
      icon: "S",
      setupComplexity: 'easy',
      features: ["Team chat", "Notifications", "File sharing"],
      website: "slack.com"
    },
    {
      id: 5,
      name: "Carta",
      category: "Legal",
      description: "Cap table management and equity administration",
      status: 'connected',
      icon: "C",
      setupComplexity: 'advanced',
      features: ["Cap table sync", "Equity tracking", "Investor relations"],
      website: "carta.com"
    },
    {
      id: 6,
      name: "X (Twitter)",
      category: "Communication",
      description: "Social media engagement and company updates",
      status: 'available',
      icon: "X",
      setupComplexity: 'easy',
      features: ["Social posting", "Engagement tracking", "Brand monitoring"],
      website: "x.com"
    },
    {
      id: 7,
      name: "Farcaster",
      category: "Communication",
      description: "Decentralized social network protocol integration",
      status: 'available',
      icon: "F",
      setupComplexity: 'medium',
      features: ["Decentralized social", "Web3 engagement", "Protocol integration"],
      website: "farcaster.xyz"
    }
  ];

  const categories = Array.from(new Set(integrations.map(i => i.category)));
  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const availableCount = integrations.filter(i => i.status === 'available').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'available':
        return 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300';
      case 'coming-soon':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'easy':
        return 'text-emerald-600';
      case 'medium':
        return 'text-amber-600';
      case 'advanced':
        return 'text-red-600';
      default:
        return 'text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Command Hints */}
      <div className="bg-slate-50 dark:bg-slate-950/20 rounded-lg p-4 border-l-4 border-slate-300">
        <h3 className="font-medium text-slate-800 dark:text-slate-200 mb-2">💡 Terminal Commands for Settings:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
          <code className="bg-slate-100 dark:bg-slate-900/30 px-2 py-1 rounded text-slate-700 dark:text-slate-300">deploy integration notion</code>
          <code className="bg-slate-100 dark:bg-slate-900/30 px-2 py-1 rounded text-slate-700 dark:text-slate-300">generate report integrations</code>
          <code className="bg-slate-100 dark:bg-slate-900/30 px-2 py-1 rounded text-slate-700 dark:text-slate-300">create agreement api</code>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <button className="flex items-center px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-lg transition-colors">
              ← Back to Dashboard
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        </div>
      </div>

      {/* Settings Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('integrations')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'integrations'
                ? 'border-slate-500 text-slate-600 dark:text-slate-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Plug className="w-4 h-4 inline mr-2" />
            Integrations
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'security'
                ? 'border-slate-500 text-slate-600 dark:text-slate-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Shield className="w-4 h-4 inline mr-2" />
            Security
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'notifications'
                ? 'border-slate-500 text-slate-600 dark:text-slate-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Bell className="w-4 h-4 inline mr-2" />
            Notifications
          </button>
        </nav>
      </div>

      {activeTab === 'integrations' && (
        <>
          {/* Integration Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Connected</h3>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{connectedCount}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Available</h3>
              <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">{availableCount}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</h3>
              <p className="text-2xl font-bold text-slate-600 dark:text-slate-400">{categories.length}</p>
            </div>
          </div>

          {/* Available Integrations */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Available Integrations</h2>
              <button 
                onClick={() => setIsIntegrationsMinimized(!isIntegrationsMinimized)}
                className="p-2 text-gray-500 hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
              >
                {isIntegrationsMinimized ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
              </button>
            </div>

            {!isIntegrationsMinimized && (
              <div className="p-6">
                {categories.map((category) => (
                  <div key={category} className="mb-8 last:mb-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {integrations
                        .filter(integration => integration.category === category)
                        .map((integration) => (
                          <div key={integration.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-slate-400 to-slate-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                  {integration.icon}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{integration.name}</h4>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{integration.website}</p>
                                </div>
                              </div>
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(integration.status)}`}>
                                {integration.status === 'coming-soon' ? 'Coming Soon' : integration.status}
                              </span>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{integration.description}</p>

                            <div className="mb-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Setup Complexity:</span>
                                <span className={`text-xs font-medium ${getComplexityColor(integration.setupComplexity)}`}>
                                  {integration.setupComplexity}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {integration.features.slice(0, 2).map((feature, index) => (
                                  <span key={index} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded">
                                    {feature}
                                  </span>
                                ))}
                                {integration.features.length > 2 && (
                                  <span className="text-xs text-slate-500 dark:text-slate-400">
                                    +{integration.features.length - 2} more
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              {integration.status === 'connected' ? (
                                <button className="flex items-center text-emerald-600 text-sm font-medium">
                                  <Check className="w-4 h-4 mr-1" />
                                  Connected
                                </button>
                              ) : integration.status === 'available' ? (
                                <button className="flex items-center text-sky-600 hover:text-sky-700 text-sm font-medium">
                                  <Plus className="w-4 h-4 mr-1" />
                                  Connect
                                </button>
                              ) : (
                                <span className="text-slate-500 text-sm">Coming Soon</span>
                              )}
                              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                <ExternalLink className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'security' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Security Settings</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">API Key Management</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage your API keys and access tokens</p>
              </div>
              <button className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
                Manage Keys
              </button>
            </div>
            <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security to your account</p>
              </div>
              <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                Enable 2FA
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Notification Preferences</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Email Notifications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive important updates via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 dark:peer-focus:ring-slate-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-slate-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Push Notifications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get real-time alerts in your browser</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 dark:peer-focus:ring-slate-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-slate-600"></div>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;