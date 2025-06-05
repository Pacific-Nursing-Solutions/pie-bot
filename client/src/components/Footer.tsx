import { Link } from 'wouter';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-[#293145] shadow-inner py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center">
                <span className="text-lg">🤖</span>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pie Bot Equity Management</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">© {new Date().getFullYear()} Pie Bot. All rights reserved.</p>
          </div>
          
          <div className="flex space-x-6">
            <Link href="/documentation">
              <a className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition">Documentation</a>
            </Link>
            <Link href="/api">
              <a className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition">API</a>
            </Link>
            <Link href="/support">
              <a className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition">Support</a>
            </Link>
            <Link href="/privacy">
              <a className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition">Privacy Policy</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
