
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  User, 
  Settings, 
  HelpCircle, 
  Menu, 
  Search,
  X
} from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <motion.header
      className={`sticky top-0 z-50 w-full border-b ${
        scrolled ? 'bg-background/80 backdrop-blur-md' : 'bg-background'
      } transition-all duration-200`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link to="/dashboard" className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 10 }}
              transition={{ duration: 0.2 }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="32" height="32" rx="8" fill="#4F46E5" />
                <path d="M8 8H24V12H8V8Z" fill="white" />
                <path d="M8 14H18V18H8V14Z" fill="white" />
                <path d="M8 20H24V24H8V20Z" fill="white" />
              </svg>
            </motion.div>
            <span className="text-xl font-bold">Modulus</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <div className="relative rounded-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="h-9 w-64 rounded-md border border-input bg-background pl-8 pr-3 text-sm ring-offset-background transition-colors focus:outline-none focus:ring-1"
            />
          </div>
          <nav className="flex items-center gap-6">
            <Link to="/dashboard" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link to="/dashboard/stock" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Inventory
            </Link>
            <Link to="/dashboard/orders" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Orders
            </Link>
            <Link to="/dashboard/customers" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Customers
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative rounded-full p-2 hover:bg-accent transition-colors"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </motion.button>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative rounded-full bg-primary/10 p-1"
          >
            <User size={20} className="text-primary" />
          </motion.div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          className="md:hidden absolute top-16 inset-x-0 bg-background border-b shadow-lg z-50"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4 flex flex-col gap-4">
            <div className="relative rounded-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search..."
                className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-sm ring-offset-background"
              />
            </div>
            <nav className="flex flex-col gap-3">
              <Link to="/dashboard" className="text-sm font-medium px-3 py-2 rounded-md hover:bg-accent">
                Dashboard
              </Link>
              <Link to="/dashboard/stock" className="text-sm font-medium px-3 py-2 rounded-md hover:bg-accent">
                Inventory
              </Link>
              <Link to="/dashboard/orders" className="text-sm font-medium px-3 py-2 rounded-md hover:bg-accent">
                Orders
              </Link>
              <Link to="/dashboard/customers" className="text-sm font-medium px-3 py-2 rounded-md hover:bg-accent">
                Customers
              </Link>
            </nav>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Navbar;
