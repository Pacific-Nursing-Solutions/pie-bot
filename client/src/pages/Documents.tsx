import { Link } from 'wouter';
import { 
  ArrowLeft,
  Upload
} from 'lucide-react';

const Documents = () => {
  const handleUploadDocument = () => {
    // Document upload functionality
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log('File selected:', file.name);
        // Handle file upload logic here
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center text-accessible-blue hover:text-blue-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Documents</h1>
        </div>
        
        <button
          onClick={handleUploadDocument}
          className="btn-primary"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </button>
      </div>

      {/* Terminal-style header for consistency */}
      <div className="bg-gray-900 rounded-lg p-4 text-white font-mono text-sm">
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-orange-500">💡</span>
          <span className="text-blue-400">Terminal Commands for Documents:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-blue-400">create agreement founders</span>
          </div>
          <div>
            <span className="text-yellow-400">generate report legal</span>
          </div>
          <div>
            <span className="text-green-400">equity split techstart</span>
          </div>
        </div>
      </div>

      {/* Document Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-default p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">5</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Documents</div>
        </div>
        <div className="card-default p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">4</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Pending Signatures</div>
        </div>
        <div className="card-default p-4 text-center">
          <div className="text-2xl font-bold text-green-600">2</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
        </div>
        <div className="card-default p-4 text-center">
          <div className="text-2xl font-bold text-red-600">1</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Expired</div>
        </div>
      </div>

      {/* Empty State Message */}
      <div className="card-default p-8 text-center">
        <div className="text-gray-500 dark:text-gray-400 mb-4">
          <Upload className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Document Management
          </h3>
          <p className="text-sm">
            Upload and manage your legal documents, agreements, and contracts.
          </p>
        </div>
        <button
          onClick={handleUploadDocument}
          className="btn-secondary"
        >
          Upload Your First Document
        </button>
      </div>
    </div>
  );
};

export default Documents;