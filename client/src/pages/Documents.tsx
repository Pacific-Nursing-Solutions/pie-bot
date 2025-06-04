import { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { 
  Plus, 
  Search, 
  ChevronDown, 
  ChevronUp,
  FileText,
  Download,
  Eye,
  Edit3,
  ExternalLink,
  User,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Check
} from 'lucide-react';

interface Document {
  id: number;
  name: string;
  type: string;
  companyName: string;
  status: 'Draft' | 'Review' | 'Signed' | 'Executed' | 'Expired';
  category: 'Legal' | 'Financial' | 'Compliance' | 'Equity' | 'Fundraising';
  createdDate: string;
  lastModified: string;
  signedDate?: string;
  signatories: {
    name: string;
    role: string;
    status: 'Pending' | 'Signed' | 'Declined';
    signedDate?: string;
  }[];
  size: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const companyDropdownRef = useRef<HTMLDivElement>(null);
  
  const [documents] = useState<Document[]>([
    {
      id: 1,
      name: "Series A Term Sheet",
      type: "PDF",
      companyName: "TechStart Inc.",
      status: 'Signed',
      category: 'Fundraising',
      createdDate: "2024-01-15",
      lastModified: "2024-02-01",
      signedDate: "2024-02-01",
      signatories: [
        { name: "John Founder", role: "CEO", status: 'Signed', signedDate: "2024-01-30" },
        { name: "Sarah Investor", role: "Lead Investor", status: 'Signed', signedDate: "2024-02-01" },
        { name: "Mike Partner", role: "Co-Founder", status: 'Signed', signedDate: "2024-01-31" }
      ],
      size: "2.3 MB",
      description: "Series A funding terms and conditions",
      priority: 'High'
    },
    {
      id: 2,
      name: "Equity Distribution Agreement",
      type: "PDF",
      companyName: "TechStart Inc.",
      status: 'Review',
      category: 'Equity',
      createdDate: "2024-02-10",
      lastModified: "2024-02-15",
      signatories: [
        { name: "John Founder", role: "CEO", status: 'Signed', signedDate: "2024-02-12" },
        { name: "Mike Partner", role: "Co-Founder", status: 'Pending' },
        { name: "Lisa Employee", role: "CTO", status: 'Pending' }
      ],
      size: "1.8 MB",
      description: "Updated equity distribution for new team members",
      priority: 'Critical'
    },
    {
      id: 3,
      name: "Financial Audit Report Q4 2023",
      type: "PDF",
      companyName: "AI Solutions LLC",
      status: 'Executed',
      category: 'Financial',
      createdDate: "2024-01-05",
      lastModified: "2024-01-20",
      signedDate: "2024-01-20",
      signatories: [
        { name: "David CFO", role: "CFO", status: 'Signed', signedDate: "2024-01-18" },
        { name: "External Auditor", role: "Auditor", status: 'Signed', signedDate: "2024-01-20" }
      ],
      size: "5.2 MB",
      description: "Comprehensive financial audit for Q4 2023",
      priority: 'Medium'
    },
    {
      id: 4,
      name: "Employee Stock Option Plan",
      type: "PDF",
      companyName: "TechStart Inc.",
      status: 'Draft',
      category: 'Legal',
      createdDate: "2024-02-20",
      lastModified: "2024-02-22",
      signatories: [
        { name: "John Founder", role: "CEO", status: 'Pending' },
        { name: "Legal Counsel", role: "Attorney", status: 'Pending' }
      ],
      size: "3.1 MB",
      description: "Employee equity incentive program structure",
      priority: 'High'
    },
    {
      id: 5,
      name: "Compliance Certificate 2024",
      type: "PDF",
      companyName: "GreenTech Ventures",
      status: 'Expired',
      category: 'Compliance',
      createdDate: "2023-12-01",
      lastModified: "2023-12-15",
      signedDate: "2023-12-15",
      signatories: [
        { name: "Alex CEO", role: "CEO", status: 'Signed', signedDate: "2023-12-10" },
        { name: "Compliance Officer", role: "Compliance", status: 'Signed', signedDate: "2023-12-15" }
      ],
      size: "1.2 MB",
      description: "Annual compliance certification document",
      priority: 'Low'
    }
  ]);

  const statuses = ['All', 'Draft', 'Review', 'Signed', 'Executed', 'Expired'];
  
  // Get unique companies from documents
  const companiesSet = new Set(documents.map(doc => doc.companyName));
  const allCompanies: string[] = [];
  companiesSet.forEach(company => allCompanies.push(company));

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target as Node)) {
        setIsCompanyDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCompanyToggle = (company: string) => {
    setSelectedCompanies(prev => 
      prev.includes(company) 
        ? prev.filter(c => c !== company)
        : [...prev, company]
    );
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || doc.status === selectedStatus;
    const matchesCompany = selectedCompanies.length === 0 || selectedCompanies.includes(doc.companyName);
    return matchesSearch && matchesStatus && matchesCompany;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Signed':
      case 'Executed':
        return <CheckCircle className="w-4 h-4 text-accessible-orange" />;
      case 'Review':
        return <AlertCircle className="w-4 h-4 text-accessible-blue" />;
      case 'Expired':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'High':
        return 'bg-orange-100 text-accessible-orange dark:bg-orange-900 dark:text-orange-200';
      case 'Medium':
        return 'bg-blue-100 text-accessible-blue dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-0">
      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <button className="flex items-center px-3 py-2 text-accessible-blue hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors">
              ← Back to Dashboard
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Documents</h1>
        </div>
        
        <button className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Upload Document
        </button>
      </div>

      {/* Documents List */}
      <div className="card-default">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
            Document Library
          </h2>
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-accessible-blue transition-colors"
          >
            {isMinimized ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>

        {!isMinimized && (
          <div className="p-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents, companies, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              {/* Company Selection Dropdown */}
              <div className="relative" ref={companyDropdownRef}>
                <button
                  onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
                  className="flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 min-w-[140px]"
                >
                  <span className="text-sm">
                    {selectedCompanies.length === 0 
                      ? 'All Companies' 
                      : selectedCompanies.length === 1 
                        ? selectedCompanies[0]
                        : `${selectedCompanies.length} Companies`
                    }
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isCompanyDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCompanyDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-full min-w-[200px] bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50">
                    <div className="p-2 space-y-1">
                      {selectedCompanies.length > 0 && (
                        <>
                          <button
                            onClick={() => setSelectedCompanies([])}
                            className="w-full text-left px-2 py-1 text-sm text-accessible-blue hover:bg-blue-50 dark:hover:bg-blue-950 rounded"
                          >
                            Clear All
                          </button>
                          <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                        </>
                      )}
                      {allCompanies.map((company) => (
                        <label
                          key={company}
                          className="flex items-center px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-600 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCompanies.includes(company)}
                            onChange={() => handleCompanyToggle(company)}
                            className="mr-2 h-4 w-4 text-accessible-blue border-gray-300 dark:border-gray-600 rounded focus:ring-accessible-blue"
                          />
                          <span className="text-sm text-gray-900 dark:text-gray-100 flex-1">
                            {company}
                          </span>
                          {selectedCompanies.includes(company) && (
                            <Check className="w-4 h-4 text-accessible-blue ml-2" />
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Documents Grid */}
            <div className="grid gap-4 md:gap-6">
              {filteredDocuments.map((document) => (
                <div key={document.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="w-10 h-10 bg-accessible-blue rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{document.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{document.description}</p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>{document.companyName}</span>
                          <span>{document.size}</span>
                          <span className={`px-2 py-1 rounded-full ${getPriorityColor(document.priority)}`}>
                            {document.priority}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <div className="flex items-center space-x-2 mb-1">
                        {getStatusIcon(document.status)}
                        <div className={`text-sm font-medium ${
                          document.status === 'Signed' || document.status === 'Executed' ? 'text-accessible-orange' :
                          document.status === 'Expired' ? 'text-red-600 dark:text-red-400' :
                          document.status === 'Review' ? 'text-accessible-blue' :
                          'text-gray-600 dark:text-gray-400'
                        }`}>
                          {document.status}
                        </div>
                      </div>
                      {document.signedDate && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Signed: {new Date(document.signedDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Signatories */}
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Signatories</h4>
                    <div className="flex flex-wrap gap-2">
                      {document.signatories.map((signatory, index) => (
                        <div key={index} className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs ${
                          signatory.status === 'Signed' ? 'bg-orange-100 text-accessible-orange dark:bg-orange-900 dark:text-orange-200' :
                          signatory.status === 'Declined' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          'bg-blue-100 text-accessible-blue dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          <User className="w-3 h-3" />
                          <span>{signatory.name} ({signatory.role})</span>
                          {signatory.status === 'Signed' && signatory.signedDate && (
                            <span>- {new Date(signatory.signedDate).toLocaleDateString()}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Created: {new Date(document.createdDate).toLocaleDateString()}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-accessible-orange transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-accessible-blue transition-colors" title="Edit">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-accessible-orange transition-colors" title="Download">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-accessible-blue transition-colors" title="External Link">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredDocuments.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No documents found matching your criteria.</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Try adjusting your search or use the terminal to create new documents.
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

export default Documents;