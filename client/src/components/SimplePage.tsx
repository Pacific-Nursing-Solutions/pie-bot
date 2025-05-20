import SimplePieBot from '@/components/SimplePieBot';

const SimplePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Pie Bot - Equity Management Assistant
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Your AI-powered assistant for managing company equity, understanding valuations, 
            and generating financial projections for your startup.
          </p>
        </header>

        <SimplePieBot />
        
        <div className="mt-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">About Pie Bot</h2>
          <p className="mb-3 text-gray-600 dark:text-gray-300">
            Pie Bot is a comprehensive financial management tool designed to handle company equity and related features.
            Ask questions about equity distribution, valuations, vesting schedules, or runway calculations.
          </p>
          
          <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-100">Features:</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
            <li>Assistance with equity distribution among founders and employees</li>
            <li>Guidance on company valuation methods and calculations</li>
            <li>Explanations of vesting schedules and option pools</li>
            <li>Financial runway and burn rate calculations</li>
            <li>Cap table management and dilution explanations</li>
            <li>Document generation for equity agreements (coming soon)</li>
          </ul>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-300">Example Questions:</h4>
            <ul className="list-disc pl-5 mt-2 text-blue-700 dark:text-blue-200">
              <li>"How should I distribute equity among founders?"</li>
              <li>"What's a fair valuation method for my pre-revenue startup?"</li>
              <li>"Explain vesting schedules for equity"</li>
              <li>"How do I calculate my startup's runway?"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplePage;