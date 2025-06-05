import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SimplePieBot from '@/components/SimplePieBot';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="text-center my-10">
          <h1 className="text-4xl font-bold mb-4 text-primary dark:text-primary-light">
            Manage Your Company's Equity with Pie Bot
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            Your all-in-one solution for managing company equity with blockchain integration
            and document generation capabilities.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <Link href="/dashboard">
              <Button className="text-lg px-6 py-3">
                Go to Dashboard
              </Button>
            </Link>
            <a href="https://github.com/pie-bot/docs" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="text-lg px-6 py-3">
                <span className="material-icons mr-2">description</span>
                Documentation
              </Button>
            </a>
          </div>
        </div>
        
        <SimplePieBot />
        
        <section className="my-12">
          <h2 className="text-2xl font-semibold mb-6 text-center dark:text-white">
            Key Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#293145] p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <span className="material-icons text-primary text-2xl mr-2">business</span>
                <h3 className="text-xl font-medium dark:text-white">Multiple Entity Support</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Support for both LLC and C-Corp models with appropriate equity structures and governance models.
              </p>
            </div>
            
            <div className="bg-white dark:bg-[#293145] p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center mr-2">
                  <span className="text-xl">💼</span>
                </div>
                <h3 className="text-xl font-medium dark:text-white">Equity Visualization</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Interactive charts and tables to visualize equity distribution among founders, investors, and option pools.
              </p>
            </div>
            
            <div className="bg-white dark:bg-[#293145] p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <span className="material-icons text-primary text-2xl mr-2">domain</span>
                <h3 className="text-xl font-medium dark:text-white">Blockchain Integration</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Tokenize equity shares on the Ethereum blockchain for transparent and secure ownership records.
              </p>
            </div>
            
            <div className="bg-white dark:bg-[#293145] p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <span className="material-icons text-primary text-2xl mr-2">description</span>
                <h3 className="text-xl font-medium dark:text-white">Document Generation</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Generate legal documents for equity agreements, funding rounds, and governance with e-signature capabilities.
              </p>
            </div>
            
            <div className="bg-white dark:bg-[#293145] p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <span className="material-icons text-primary text-2xl mr-2">timeline</span>
                <h3 className="text-xl font-medium dark:text-white">Financial Tools</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Calculate runway, track burn rates, and create financial projections for your business.
              </p>
            </div>
            
            <div className="bg-white dark:bg-[#293145] p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <span className="material-icons text-primary text-2xl mr-2">input</span>
                <h3 className="text-xl font-medium dark:text-white">Command-Line Interface</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Powerful CLI for advanced users to manage equity operations through simple text commands.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
