import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { UserRole } from '../../types';

interface LayoutProps {
  userRole: UserRole;
}

export function Layout({ userRole }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole={userRole} />
      <div className="flex-1 pl-64"> {/* Adjust based on sidebar width */}
        <div className="flex min-h-screen flex-col">
          <Header title="Dashboard" />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
          <footer className="border-t py-4 px-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Travel Agency Backoffice. All rights reserved.
          </footer>
        </div>
      </div>
    </div>
  );
}