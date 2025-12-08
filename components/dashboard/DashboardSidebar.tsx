'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Compass, LayoutDashboard, Map, BarChart3, 
  Settings, LogOut, Plus 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardSidebar: React.FC = () => {
  const pathname = usePathname();
  
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
    <aside className="w-64 h-screen bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Compass className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-foreground">ZenGuide</span>
        </Link>
      </div>

      {/* Create Tour Button */}
      <div className="p-4">
        <Link href="/dashboard/tours/new">
          <Button className="w-full gap-2">
            <Plus className="w-4 h-4" />
            New Tour
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
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
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
      </div>
    </aside>
  );
};

export default DashboardSidebar;
