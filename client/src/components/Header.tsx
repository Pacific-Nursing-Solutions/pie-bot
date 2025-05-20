import { useState } from 'react';
import { Link } from 'wouter';
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
        <div className="flex items-center space-x-2">
          {/* Logo */}
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <span className="material-icons text-white">pie_chart</span>
          </div>
          <h1 className="text-2xl font-bold text-primary dark:text-white">Pie Bot</h1>
        </div>
        
        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/dashboard">
            <a className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white transition">Dashboard</a>
          </Link>
          <Link href="/documentation">
            <a className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white transition">Documentation</a>
          </Link>
          <Link href="/settings">
            <a className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white transition">Settings</a>
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
          <Link href="/dashboard">
            <a className="block text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white transition">Dashboard</a>
          </Link>
          <Link href="/documentation">
            <a className="block text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white transition">Documentation</a>
          </Link>
          <Link href="/settings">
            <a className="block text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white transition">Settings</a>
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
