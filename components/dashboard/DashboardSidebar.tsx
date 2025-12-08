'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, LayoutDashboard, Map, BarChart3, 
  Settings, LogOut, Plus, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardSidebar: React.FC = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load collapsed state from localStorage after mount
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved !== null) {
      setIsCollapsed(saved === 'true');
    }
  }, []);

  // Save collapsed state to localStorage when it changes
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
  };
  
  // TODO: Replace with actual user data from Convex
  const user = {
    name: 'John Doe',
    email: 'john@example.com'
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { path: '/dashboard/tours', icon: Map, label: 'Tours' },
    { path: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    // TODO: Implement logout with Convex
    console.log('Logout');
  };

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '256px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen bg-card border-r border-border flex flex-col relative flex-shrink-0"
    >
      {/* Collapse Toggle */}
      {isMounted && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border border-border bg-card shadow-sm hover:bg-muted"
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
      )}

      {/* Header */}
      <div className="p-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
            <Compass className="w-5 h-5 text-primary-foreground" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="font-display font-bold text-foreground whitespace-nowrap overflow-hidden"
              >
                ZenGuide
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Create Tour Button */}
      <div className="p-4">
        <Link href="/dashboard/tours/new">
          <Button className={`w-full gap-2 ${isCollapsed ? 'px-0 justify-center' : ''}`}>
            <Plus className="w-4 h-4 flex-shrink-0" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  New Tour
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
              isActive(item.path)
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            } ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-medium text-sm whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border">
        {!isCollapsed ? (
          <>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary-foreground">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 min-w-0 overflow-hidden"
                >
                  <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-muted-foreground"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default DashboardSidebar;
