import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '../ui/button';

interface HeaderProps {
  actions?: React.ReactNode;
}

export function Header({  actions }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm">
      <div className="flex items-center gap-4">
        {actions}
      </div>
    </header>
  );
}