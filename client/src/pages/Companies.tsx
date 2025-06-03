import { useState } from 'react';
import { Link } from 'wouter';
import { 
  Building2, 
  TrendingUp, 
  Users, 
  Plus, 
  Search,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Bot
} from 'lucide-react';

interface Company {
  id: number;
  name: string;
  entityType: string;
  userEquityPercentage: number;
  userDebtPosition: number;
  marketCap: number;
  userEquityValue: number;
  stockClasses: Array<{
    class: string;
    shares: number;
    percentage: number;
    value: number;
  }>;
  lastValuation: {
    amount: number;
    date: string;
  };
  status: 'Active' | 'Exited' | 'Failed';
  industry: string;
  founded: string;
  lastActivity: string;
}

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showFormationForm, setShowFormationForm] = useState(false);
  const [formationType, setFormationType] = useState<'form' | 'import'>('form');
  
  const [companies] = useState<Company[]>([
    {
      id: 1,
      name: "TechStart Inc.",
      entityType: "Delaware C-Corp",
      userEquityPercentage: 15.5,
      userDebtPosition: 50000,
      marketCap: 8000000,
      userEquityValue: 1240000,
      stockClasses: [
        { class: "Common", shares: 150000, percentage: 12.5, value: 900000 },
        { class: "Preferred Series A", shares: 25000, percentage: 3.0, value: 340000 }
      ],
      lastValuation: { amount: 8000000, date: "2024-01-15" },
      status: 'Active',
      industry: 'Technology',
      founded: '2022',
      lastActivity: '2 hours ago'
    },
    {
      id: 2,
      name: "AI Solutions LLC",
      entityType: "Wyoming LLC",
      userEquityPercentage: 25.0,
      userDebtPosition: 0,
      marketCap: 3500000,
      userEquityValue: 875000,
      stockClasses: [
        { class: "Membership Units", shares: 2500, percentage: 25.0, value: 875000 }
      ],
      lastValuation: { amount: 3500000, date: "2024-02-01" },
      status: 'Active',
      industry: 'Artificial Intelligence',
      founded: '2023',
      lastActivity: '1 day ago'
    },
    {
      id: 3,
      name: "GreenTech Ventures",
      entityType: "Delaware C-Corp",
      userEquityPercentage: 8.2,
      userDebtPosition: 25000,
      marketCap: 2200000,
      userEquityValue: 180400,
      stockClasses: [
        { class: "Common", shares: 82000, percentage: 8.2, value: 180400 }
      ],
      lastValuation: { amount: 2200000, date: "2023-11-20" },
      status: 'Exited',
      industry: 'Clean Energy',
      founded: '2021',
      lastActivity: '3 months ago'
    }
  ]);

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = showActiveOnly ? company.status === 'Active' : true;
    return matchesSearch && matchesStatus;
  });

  const totalValue = companies.reduce((sum, company) => sum + company.userEquityValue, 0);
  const activeCompanies = companies.filter(c => c.status === 'Active').length;

  return (
    <div className="space-y-6">

      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <button className="flex items-center px-3 py-2 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950 rounded-lg transition-colors">
              ← Back to Dashboard
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Companies</h1>
        </div>
        
        <button 
          onClick={() => setShowFormationForm(!showFormationForm)}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Company
        </button>
      </div>

      {/* Company Formation Inline Form */}
      {showFormationForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Add Company</h2>
            <button 
              onClick={() => setShowFormationForm(false)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            {/* Formation Type Selection */}
            <div className="mb-6">
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setFormationType('form')}
                  className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    formationType === 'form'
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Form New Company</span>
                  </div>
                </button>
                <button
                  onClick={() => setFormationType('import')}
                  className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    formationType === 'import'
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <ExternalLink className="w-4 h-4" />
                    <span>Import Existing</span>
                  </div>
                </button>
              </div>
            </div>

            {formationType === 'form' ? (
              <WyomingLLCForm onClose={() => setShowFormationForm(false)} />
            ) : (
              <ImportCompanyForm onClose={() => setShowFormationForm(false)} />
            )}
          </div>
        </div>
      )}

      {/* Companies List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Your Companies</h2>
            <button 
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >
              {isMinimized ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies or industries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showActiveOnly}
                onChange={(e) => setShowActiveOnly(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">Active only</span>
            </label>
          </div>
        </div>

        {!isMinimized && (
          <div className="p-6">
            <div className="space-y-4">
              {filteredCompanies.map((company) => (
                <Link 
                  href={`/company/${company.id}/dashboard`}
                  key={company.id} 
                  className="block border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-orange-300 dark:hover:border-orange-600 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg font-bold">{company.name.charAt(0)}</span>
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{company.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            company.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            company.status === 'Exited' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {company.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <span>{company.entityType}</span>
                          <span>•</span>
                          <span>{company.industry}</span>
                          <span>•</span>
                          <span>Founded {company.founded}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        ${company.userEquityValue.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {company.userEquityPercentage}% equity
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Last activity: {company.lastActivity}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Market Cap:</span>
                        <span className="font-medium ml-1">${company.marketCap.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Stock Classes:</span>
                        <span className="font-medium ml-1">{company.stockClasses.length}</span>
                      </div>
                      {company.userDebtPosition > 0 && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Debt:</span>
                          <span className="font-medium ml-1">(${company.userDebtPosition.toLocaleString()})</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                        Click to view dashboard →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}

              {filteredCompanies.length === 0 && (
                <div className="text-center py-12">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No companies found matching your criteria.</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Try adjusting your search or use the terminal to create a new company.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const WyomingLLCForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    jurisdiction: 'wyoming',
    entityType: 'LLC',
    registeredAgent: 'northwest-registered-agent',
    organizer: '',
    organizerAddress: '',
    managementStructure: 'member-managed',
    businessPurpose: 'any lawful business purpose',
    initialMembers: [{ name: '', address: '', ownershipPercent: 100 }],
    expediteProcessing: false,
    totalCost: 241 // $100 state fee + $2 processing + $139 registered agent
  });

  const askPieBot = (question: string) => {
    // Use the global submit function for proper terminal integration
    const terminalSubmit = (window as any).pieTerminalSubmit;
    if (terminalSubmit) {
      terminalSubmit(question);
    }
  };



  const [identityVerification, setIdentityVerification] = useState({
    isVerifying: false,
    isVerified: false,
    verificationId: null as string | null
  });

  const [showIdentityModal, setShowIdentityModal] = useState(false);

  const startIdentityVerification = async () => {
    setIdentityVerification(prev => ({ ...prev, isVerifying: true }));
    
    try {
      const response = await fetch('/api/identity/start-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purpose: 'wyoming_llc_formation' })
      });

      if (response.ok) {
        const data = await response.json();
        setIdentityVerification({
          isVerifying: false,
          isVerified: false,
          verificationId: data.verificationId
        });
        setShowIdentityModal(true);
      } else {
        const error = await response.json();
        alert('Identity verification failed to start: ' + error.message);
        setIdentityVerification(prev => ({ ...prev, isVerifying: false }));
      }
    } catch (error) {
      console.error('Identity verification error:', error);
      alert('Network error starting identity verification');
      setIdentityVerification(prev => ({ ...prev, isVerifying: false }));
    }
  };

  const completeIdentityVerification = async (verificationData: any) => {
    try {
      const response = await fetch('/api/identity/complete-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationId: identityVerification.verificationId,
          ...verificationData
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Auto-populate form with verified identity data
        setFormData(prev => ({
          ...prev,
          organizer: data.fullName,
          organizerAddress: data.address,
          initialMembers: [
            {
              name: data.fullName,
              address: data.address,
              ownershipPercent: 100
            }
          ]
        }));

        setIdentityVerification(prev => ({ ...prev, isVerified: true }));
        setShowIdentityModal(false);
      } else {
        const error = await response.json();
        alert('Identity verification failed: ' + error.message);
      }
    } catch (error) {
      console.error('Identity verification completion error:', error);
      alert('Network error completing identity verification');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/companies/form-wyoming-llc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const newCompany = await response.json();
        console.log('Wyoming LLC formed successfully:', newCompany);
        onClose();
        // Refresh the page or update companies list
        window.location.reload();
      } else {
        const error = await response.json();
        alert('Formation failed: ' + error.message);
      }
    } catch (error) {
      console.error('Formation error:', error);
      alert('Network error during formation process');
    }
  };

  const addMember = () => {
    setFormData(prev => ({
      ...prev,
      initialMembers: [...prev.initialMembers, { name: '', address: '', ownershipPercent: 0 }]
    }));
  };

  const updateMember = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      initialMembers: prev.initialMembers.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    }));
  };

  const removeMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      initialMembers: prev.initialMembers.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-8 h-8 bg-orange-600 text-white rounded-full text-sm font-medium">1</div>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Company Details</span>
        </div>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600 mx-4"></div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-8 h-8 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-full text-sm font-medium">2</div>
          <span className="text-sm text-gray-500 dark:text-gray-400">Review & File</span>
        </div>
      </div>

      {/* Jurisdiction and Entity Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Jurisdiction
            </label>
            <button
              type="button"
              onClick={() => askPieBot("Why is Wyoming such a favored jurisdiction for crypto companies and LLCs? What are the advantages compared to Delaware?")}
              className="p-1 text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950 rounded transition-colors"
              title="Ask Pie Bot about jurisdiction choice"
            >
              <Bot className="w-4 h-4" />
            </button>
          </div>
          <select 
            value={formData.jurisdiction}
            onChange={(e) => setFormData(prev => ({ ...prev, jurisdiction: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="">Select jurisdiction</option>
            <option value="wyoming">Wyoming</option>
            <option value="delaware">Delaware</option>
          </select>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Entity Type
            </label>
            <button
              type="button"
              onClick={() => askPieBot("What are the differences between LLC, C-Corp, and S-Corp? Which entity type is best for crypto and tech startups?")}
              className="p-1 text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950 rounded transition-colors"
              title="Ask Pie Bot about entity types"
            >
              <Bot className="w-4 h-4" />
            </button>
          </div>
          <select 
            value={formData.entityType}
            onChange={(e) => setFormData(prev => ({ ...prev, entityType: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="">Select entity type</option>
            <option value="LLC">LLC</option>
            <option value="C-Corp">C-Corporation</option>
            <option value="S-Corp">S-Corporation</option>
          </select>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Company Name *
          </label>
          <input 
            type="text" 
            required
            value={formData.companyName}
            onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
            placeholder="Enter company name (will add 'LLC' suffix)"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Registered Agent Service
            </label>
            <button
              type="button"
              onClick={() => askPieBot("What is a registered agent and why do I need one? What are the pros and cons of using a professional service vs acting as my own registered agent?")}
              className="p-1 text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950 rounded transition-colors"
              title="Ask Pie Bot about registered agents"
            >
              <Bot className="w-4 h-4" />
            </button>
          </div>
          <select 
            value={formData.registeredAgent}
            onChange={(e) => {
              const agent = e.target.value;
              const agentCost = agent === 'self' ? 0 : 139;
              setFormData(prev => ({ 
                ...prev, 
                registeredAgent: agent,
                totalCost: 102 + agentCost
              }));
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="">Select registered agent</option>
            <option value="northwest-registered-agent">Northwest Registered Agent ($139/year)</option>
            <option value="self">Act as my own registered agent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Organizer Name *
          </label>
          <input 
            type="text" 
            required
            value={formData.organizer}
            onChange={(e) => setFormData(prev => ({ ...prev, organizer: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
            placeholder="Full legal name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Organizer Address *
          </label>
          <input 
            type="text" 
            required
            value={formData.organizerAddress}
            onChange={(e) => setFormData(prev => ({ ...prev, organizerAddress: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
            placeholder="Full address"
          />
        </div>
      </div>

      {/* Management Structure */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Management Structure
          </label>
          <button
            type="button"
            onClick={() => askPieBot("What's the difference between member-managed and manager-managed LLCs? Which structure is better for startups and crypto companies?")}
            className="p-1 text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950 rounded transition-colors"
            title="Ask Pie Bot about management structures"
          >
            <Bot className="w-4 h-4" />
          </button>
        </div>
        <select 
          value={formData.managementStructure}
          onChange={(e) => setFormData(prev => ({ ...prev, managementStructure: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
        >
          <option value="member-managed">Member-Managed</option>
          <option value="manager-managed">Manager-Managed</option>
        </select>
      </div>

      {/* Initial Members */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Initial Members
          </label>
          <button
            type="button"
            onClick={addMember}
            className="flex items-center px-3 py-1 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Member
          </button>
        </div>

        {formData.initialMembers.map((member, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div>
              <input 
                type="text" 
                required
                value={member.name}
                onChange={(e) => updateMember(index, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
                placeholder="Member name"
              />
            </div>
            <div>
              <input 
                type="text" 
                required
                value={member.address}
                onChange={(e) => updateMember(index, 'address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
                placeholder="Address"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="number" 
                required
                min="0"
                max="100"
                value={member.ownershipPercent}
                onChange={(e) => updateMember(index, 'ownershipPercent', parseFloat(e.target.value))}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
                placeholder="% ownership"
              />
              {formData.initialMembers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMember(index)}
                  className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Processing Options */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Formation Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Wyoming State Filing Fee:</span>
            <span>$100.00</span>
          </div>
          <div className="flex justify-between">
            <span>Processing Fee:</span>
            <span>$2.00</span>
          </div>
          <div className="flex justify-between">
            <span>Registered Agent (first year):</span>
            <span>
              {formData.registeredAgent === 'self' ? '$0.00' : 
               formData.registeredAgent === 'northwest-registered-agent' ? '$139.00' : '$0.00'}
            </span>
          </div>
          <div className="border-t border-gray-300 dark:border-gray-600 pt-2 flex justify-between font-medium">
            <span>Total:</span>
            <span>
              ${formData.registeredAgent === 'self' ? '102.00' : 
                formData.registeredAgent === 'northwest-registered-agent' ? '241.00' : '102.00'}
            </span>
          </div>
        </div>
        
        {formData.registeredAgent !== 'self' && (
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded border-l-4 border-blue-400">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              <strong>50-State Coverage:</strong> Your registered agent service will handle compliance in all states where you do business, including annual report filings and important legal notices.
            </p>
          </div>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Form Wyoming LLC
        </button>
      </div>
    </form>
  );
};

const ImportCompanyForm = ({ onClose }: { onClose: () => void }) => {
  const [importData, setImportData] = useState({
    companyName: '',
    entityType: '',
    state: '',
    ein: '',
    address: '',
    founded: '',
    industry: '',
    status: 'Active',
    documents: null as FileList | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        name: importData.companyName,
        entityType: importData.entityType,
        state: importData.state,
        ein: importData.ein || undefined,
        address: importData.address,
        founded: importData.founded,
        industry: importData.industry || 'Technology',
        status: importData.status,
        // Add required fields that might be missing
        jurisdiction: importData.state,
        registeredAgent: 'Self-serve',
        businessPurpose: 'General business purposes'
      };

      const response = await fetch('/api/companies/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const importedCompany = await response.json();
        console.log('Company imported successfully:', importedCompany);
        onClose();
        window.location.reload();
      } else {
        const error = await response.json();
        alert('Import failed: ' + error.message);
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('Network error during import process');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 border-l-4 border-green-400">
        <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">Import Existing Company</h3>
        <p className="text-sm text-green-700 dark:text-green-300">
          Add an existing company to your portfolio. Upload incorporation documents for verification.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Company Name *
          </label>
          <input 
            type="text" 
            required
            value={importData.companyName}
            onChange={(e) => setImportData(prev => ({ ...prev, companyName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
            placeholder="Legal company name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Entity Type *
          </label>
          <select 
            required
            value={importData.entityType}
            onChange={(e) => setImportData(prev => ({ ...prev, entityType: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="">Select entity type</option>
            <option value="LLC">LLC</option>
            <option value="C-Corp">C-Corporation</option>
            <option value="S-Corp">S-Corporation</option>
            <option value="Partnership">Partnership</option>
            <option value="Sole Proprietorship">Sole Proprietorship</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            State of Incorporation *
          </label>
          <input 
            type="text" 
            required
            value={importData.state}
            onChange={(e) => setImportData(prev => ({ ...prev, state: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
            placeholder="e.g., Delaware, Wyoming"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            EIN (Optional)
          </label>
          <input 
            type="text" 
            value={importData.ein}
            onChange={(e) => setImportData(prev => ({ ...prev, ein: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
            placeholder="XX-XXXXXXX"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Founded Year
          </label>
          <input 
            type="number" 
            min="1900"
            max={new Date().getFullYear()}
            value={importData.founded}
            onChange={(e) => setImportData(prev => ({ ...prev, founded: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
            placeholder="YYYY"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Business Address
          </label>
          <input 
            type="text" 
            value={importData.address}
            onChange={(e) => setImportData(prev => ({ ...prev, address: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
            placeholder="Full business address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Industry
          </label>
          <select 
            value={importData.industry}
            onChange={(e) => setImportData(prev => ({ ...prev, industry: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="">Select industry</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Retail">Retail</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Services">Services</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Company Status
          </label>
          <select 
            value={importData.status}
            onChange={(e) => setImportData(prev => ({ ...prev, status: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Dissolved">Dissolved</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Upload Documents (Optional)
        </label>
        <input 
          type="file" 
          multiple
          accept=".pdf,.doc,.docx"
          onChange={(e) => setImportData(prev => ({ ...prev, documents: e.target.files }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Upload incorporation docs, operating agreements, etc. (PDF, DOC, DOCX)
        </p>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Import Company
        </button>
      </div>
    </form>
  );
};

export default Companies;