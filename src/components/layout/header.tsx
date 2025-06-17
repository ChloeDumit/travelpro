import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '../ui/button';

interface HeaderProps {
  title: string;
  actions?: React.ReactNode;
}

export function Header({ title, actions }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm">
      <div className="flex items-center gap-4">
        {actions}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full absolute right-4"
        >
          <User size={20} />
        </Button>
      </div>
    </header>
  );
}