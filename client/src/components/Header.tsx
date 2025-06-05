import { useState } from 'react';
import { Link } from 'wouter';
import { Briefcase } from 'lucide-react';
import { useDarkMode } from '@/hooks/use-dark-mode';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { theme, toggleTheme } = useDarkMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white dark:bg-[#293145] shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          {/* Logo */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-primary dark:text-white">Pie Bot</h1>
        </Link>
        
        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white transition">
            Dashboard
          </Link>
          <Link href="/documentation" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white transition">
            Documentation
          </Link>
          <Link href="/settings" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white transition">
            Settings
          </Link>
          <Button className="flex items-center space-x-1">
            <span className="material-icons text-sm">account_circle</span>
            <span>Sign In</span>
          </Button>
        </nav>
        
        {/* Dark mode toggle */}
        <button 
          className="fixed top-5 right-5 z-50 bg-white dark:bg-[#293145] p-2 rounded-full shadow-md"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span className={`material-icons text-gray-800 dark:text-gray-200 ${theme === 'dark' ? 'hidden' : 'block'}`}>dark_mode</span>
          <span className={`material-icons text-gray-800 dark:text-gray-200 ${theme === 'dark' ? 'block' : 'hidden'}`}>light_mode</span>
        </button>
        
        {/* Mobile menu button */}
        <button className="md:hidden text-gray-700 dark:text-gray-300" onClick={toggleMobileMenu}>
          <span className="material-icons">menu</span>
        </button>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-4 py-3 space-y-3 bg-white dark:bg-[#293145] shadow-inner">
          <Link href="/dashboard" className="block text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white transition">
            Dashboard
          </Link>
          <Link href="/documentation" className="block text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white transition">
            Documentation
          </Link>
          <Link href="/settings" className="block text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white transition">
            Settings
          </Link>
          <Button className="flex items-center space-x-1">
            <span className="material-icons text-sm">account_circle</span>
            <span>Sign In</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
