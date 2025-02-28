
import React, { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />

        <motion.main 
          className="flex-1 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {children}
          <Footer />
        </motion.main>
      </div>
    </div>
  );
}
