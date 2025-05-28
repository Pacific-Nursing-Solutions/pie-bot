import { useState } from 'react';
import { Link } from 'wouter';
import { 
  FileText, 
  Plus, 
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Download,
  Eye,
  Edit3,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  XCircle
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
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isMinimized, setIsMinimized] = useState(false);
  
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
        { name: "Green CEO", role: "CEO", status: 'Signed', signedDate: "2023-12-15" },
        { name: "Regulatory Body", role: "Regulator", status: 'Signed', signedDate: "2023-12-15" }
      ],
      size: "1.2 MB",
      description: "Annual compliance certification - needs renewal",
      priority: 'Critical'
    }
  ]);

  const categories = ['All', 'Legal', 'Financial', 'Compliance', 'Equity', 'Fundraising'];
  const statuses = ['All', 'Draft', 'Review', 'Signed', 'Executed', 'Expired'];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || doc.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Signed':
      case 'Executed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Review':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
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
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'Medium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const totalDocuments = documents.length;
  const pendingSignatures = documents.reduce((sum, doc) => 
    sum + doc.signatories.filter(s => s.status === 'Pending').length, 0
  );
  const completedDocuments = documents.filter(d => d.status === 'Signed' || d.status === 'Executed').length;
  const expiredDocuments = documents.filter(d => d.status === 'Expired').length;

  return (
    <div className="space-y-6">
      {/* Command Hints */}
      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border-l-4 border-blue-500">
        <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Terminal Commands for Documents:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
          <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">create agreement founders</code>
          <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">generate report legal</code>
          <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">equity split techstart</code>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <button className="flex items-center px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors">
              ← Back to Dashboard
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Documents</h1>
        </div>
        
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Upload Document
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Documents</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalDocuments}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Signatures</h3>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{pendingSignatures}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{completedDocuments}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Expired</h3>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{expiredDocuments}</p>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Document Library</h2>
            <button 
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {isMinimized ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
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
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {!isMinimized && (
          <div className="p-6">
            <div className="space-y-4">
              {filteredDocuments.map((document) => (
                <div key={document.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{document.name}</h3>
                          {getStatusIcon(document.status)}
                          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(document.priority)}`}>
                            {document.priority}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>{document.companyName}</span>
                          <span>•</span>
                          <span>{document.category}</span>
                          <span>•</span>
                          <span>{document.size}</span>
                          <span>•</span>
                          <span>Modified {new Date(document.lastModified).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{document.description}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        document.status === 'Signed' || document.status === 'Executed' ? 'text-green-600 dark:text-green-400' :
                        document.status === 'Expired' ? 'text-red-600 dark:text-red-400' :
                        document.status === 'Review' ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-gray-600 dark:text-gray-400'
                      }`}>
                        {document.status}
                      </div>
                      {document.signedDate && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
                          signatory.status === 'Signed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          signatory.status === 'Declined' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
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
                      <button className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="Edit">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="Download">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="External Link">
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