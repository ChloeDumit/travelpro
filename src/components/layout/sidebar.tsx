import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import {
  Home,
  PanelRight,
  Users,
  ShoppingBag,
  FileText,
  CreditCard,
  Settings,
  DollarSign,
  Briefcase,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { UserRole } from '../../types';
import { useAuth } from '../../contexts/auth-context';

interface SidebarProps {
  userRole: UserRole;
}

const SidebarLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof NavLink>
>(({ className, children, ...props }, ref) => (
  <NavLink
    ref={ref}
    className={({ isActive }) =>
      cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
        isActive
          ? 'bg-primary-100 text-primary-900 font-medium'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
        className
      )
    }
    {...props}
  >
    {children}
  </NavLink>
));
SidebarLink.displayName = 'SidebarLink';

export function Sidebar({ userRole }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div
      className={cn(
        'fixed inset-y-0 left-0 z-20 flex flex-col border-r bg-white transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <Link to="/dashboard">
          <h2 className="text-xl font-bold text-primary-900">TravelPro</h2>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
        >
          {collapsed ? <PanelRight size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-auto p-3">
        <nav className="flex flex-col gap-1">
          <SidebarLink to="/dashboard">
            <Home size={20} />
            {!collapsed && <span>Inicio</span>}
          </SidebarLink>

          {(userRole === 'admin' || userRole === 'sales') && (
            <>
              <SidebarLink to="/sales">
                <ShoppingBag size={20} />
                {!collapsed && <span>Ventas</span>}
              </SidebarLink>
              <SidebarLink to="/clients">
                <Briefcase size={20} />
                {!collapsed && <span>Clientes</span>}
              </SidebarLink>
              {/* <SidebarLink to="/clients">
                <Users size={20} />
                {!collapsed && <span>Clients</span>}
              </SidebarLink> */}
            </>
          )}

          {/* {(userRole === 'admin' || userRole === 'finance') && (
            <>
              <SidebarLink to="/invoices">
                <FileText size={20} />
                {!collapsed && <span>Invoices</span>}
              </SidebarLink>
              <SidebarLink to="/payments">
                <CreditCard size={20} />
                {!collapsed && <span>Payments</span>}
              </SidebarLink>
              <SidebarLink to="/supplier-payments">
                <DollarSign size={20} />
                {!collapsed && <span>Supplier Payments</span>}
              </SidebarLink>
            </>
          )} */}

          {userRole === 'admin' && (
<>
            <SidebarLink to="/suppliers">
              <Users size={20} />
              {!collapsed && <span>Proveedores</span>}
            </SidebarLink>
            <SidebarLink to="/users">
              <Users size={20} />
              {!collapsed && <span>Usuarios</span>}
            </SidebarLink>
            </>
          )}

          {/* <SidebarLink to="/settings">
            <Settings size={20} />
            {!collapsed && <span>Settings</span>}
          </SidebarLink> */}
        </nav>
      </div>

      <div className="border-t p-3">
        <button
          onClick={handleLogout}
          className={cn(
            'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-danger-500 transition-colors hover:bg-danger-50 hover:text-danger-700'
          )}
        >
          <LogOut size={20} />
          {!collapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  );
}