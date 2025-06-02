import { useState } from 'react';
import { Link, useParams } from 'wouter';
import { 
  Building2, 
  ArrowLeft,
  Wallet,
  Plus,
  Shield,
  ExternalLink
} from 'lucide-react';
import WalletManager from '@/components/WalletManager';

const CompanyWallets = () => {
  const { id } = useParams<{ id: string }>();
  const [walletsExpanded, setWalletsExpanded] = useState(false);
  
  // Mock company data - in production this would come from your API
  const [company] = useState({
    id: parseInt(id || '1'),
    name: "TechStart Inc.",
    entityType: "Delaware C-Corp",
    industry: "Technology",
  });

  return (
    <div className="space-y-6">
      {/* Command Hints */}
      <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-4 border-l-4 border-emerald-300">
        <h3 className="font-medium text-emerald-800 dark:text-emerald-200 mb-2">💡 Terminal Commands for Wallets:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
          <code className="bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded text-emerald-700 dark:text-emerald-300">wallet create company</code>
          <code className="bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded text-emerald-700 dark:text-emerald-300">ens register techstart</code>
          <code className="bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded text-emerald-700 dark:text-emerald-300">transfer tokens 1000</code>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <button className="flex items-center px-3 py-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-lg transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </button>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {company.name} Wallets
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {company.entityType} • {company.industry}
              </p>
            </div>
          </div>
        </div>

        <Link href={`/company/${company.id}/dashboard`}>
          <button className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            <ExternalLink className="w-4 h-4 mr-2" />
            Company Dashboard
          </button>
        </Link>
      </div>

      {/* Wallets - Collapsible */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <button 
          className="w-full px-6 py-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          onClick={() => setWalletsExpanded(!walletsExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Wallet className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Wallets
              </h2>
            </div>
            <div className="text-gray-400">
              {walletsExpanded ? '−' : '+'}
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-left">
            Manage wallets for {company.name}. Connect company accounts, import existing wallets, or create new ones.
          </p>
        </button>
        
        {walletsExpanded && (
          <div className="p-6">
            <WalletManager 
              walletType="company" 
              companyId={company.id}
              companyName={company.name}
            />
          </div>
        )}
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              Company Wallet Security
            </h3>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <p>• Company wallets are managed separately from personal wallets</p>
              <p>• Multi-signature capabilities available for enhanced security</p>
              <p>• All transactions require proper authorization levels</p>
              <p>• ENS domains can be registered directly for company branding</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyWallets;