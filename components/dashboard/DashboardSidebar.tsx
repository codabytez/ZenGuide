'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'convex/react';
import { useAuthActions } from '@convex-dev/auth/react';
import { api } from '@/convex/_generated/api';

import {
  Compass, LayoutDashboard, Map, BarChart3,
  Settings, LogOut, Plus, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const DashboardSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Convex hooks
  const currentUser = useQuery(api.userSettings.getCurrentUser);
  const { signOut } = useAuthActions();

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // On mobile, check saved state or default to collapsed
      if (mobile) {
        const saved = localStorage.getItem('sidebar-collapsed-mobile');
        setIsCollapsed(saved === 'false' ? false : true); // Default collapsed on mobile
      } else {
        const saved = localStorage.getItem('sidebar-collapsed-desktop');
        setIsCollapsed(saved === 'true');
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    requestAnimationFrame(() => setIsMounted(true));

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-collapse sidebar on mobile when pathname changes
  useEffect(() => {
    if (isMobile && isMounted) {
      // Only update if not already collapsed
      if (!isCollapsed) {
        setTimeout(() => {
          setIsCollapsed(true);
          localStorage.setItem('sidebar-collapsed-mobile', 'true');
        }, 0);
      }
    }
  }, [pathname, isMobile, isMounted, isCollapsed]);

  // Save collapsed state to localStorage when it changes (separate keys for mobile/desktop)
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    const storageKey = isMobile ? 'sidebar-collapsed-mobile' : 'sidebar-collapsed-desktop';
    localStorage.setItem(storageKey, String(newState));
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { path: '/dashboard/tours', icon: Map, label: 'Tours' },
    { path: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === path;
    }
    // For other paths, check if the current path starts with the nav path
    return pathname.startsWith(path);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  // Get user initials
  const getUserInitial = () => {
    if (!currentUser?.name) return 'U';
    return currentUser.name.charAt(0).toUpperCase();
  };

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isMobile && !isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleCollapse}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? '80px' : '256px' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`h-screen bg-card border-r border-border flex flex-col relative ${
          isMobile ? 'fixed left-0 top-0 z-50' : 'shrink-0'
        }`}
      >
        {/* Collapse Toggle */}
        {isMounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="absolute -right-3 top-7 z-10 h-6 w-6 rounded-full border border-border bg-card shadow-sm hover:bg-muted"
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
            <div className="w-9 h-9 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center shrink-0">
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
              <Plus className="w-4 h-4 shrink-0" />
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
              <item.icon className="w-5 h-5 shrink-0" />
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
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary-foreground">
                    {currentUser ? getUserInitial() : '...'}
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
                    <p className="text-sm font-medium text-foreground truncate">
                      {currentUser?.name || 'Loading...'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {currentUser?.email || ''}
                    </p>
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
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">
                  {currentUser ? getUserInitial() : '...'}
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
    </>
  );
};

export default DashboardSidebar;