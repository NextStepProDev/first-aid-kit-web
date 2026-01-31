import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { cn } from '../../utils/cn';

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <main
        className={cn(
          'pt-16 min-h-screen flex flex-col transition-all duration-200',
          'lg:pl-64'
        )}
      >
        <div className="flex-1 w-full p-4 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
}
