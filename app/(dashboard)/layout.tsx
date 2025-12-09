import React from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // TODO: Add authentication check with Convex
  // const isAuthenticated = false;
  // if (!isAuthenticated) {
  //   redirect('/login');
  // }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto md:ml-0">
        {children}
      </main>
    </div>
  );
}
