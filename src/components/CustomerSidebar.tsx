import { Home, Pill, ShoppingCart, ClipboardList, Upload, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'browse', label: 'Browse Medicines', icon: Pill },
  { id: 'cart', label: 'My Cart', icon: ShoppingCart },
  { id: 'orders', label: 'My Orders', icon: ClipboardList },
  { id: 'prescription', label: 'Upload Prescription', icon: Upload },
  { id: 'profile', label: 'Profile', icon: User },
];

interface Props {
  active: string;
  onNavigate: (id: string) => void;
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function CustomerSidebar({ active, onNavigate, collapsed, onToggle }: Props) {
  const { logout, user } = useAuth();

  return (
    <aside className={cn(
      "h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shrink-0",
      collapsed ? "w-16" : "w-60"
    )}>
      <div className="p-4 border-b border-gray-100 flex items-center gap-2">
        <div className="h-9 w-9 rounded-full bg-teal-600 flex items-center justify-center shrink-0">
          <Pill className="h-5 w-5 text-white" />
        </div>
        {!collapsed && <span className="font-bold text-teal-800 text-lg">PharmaCare</span>}
      </div>

      {!collapsed && user && (
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-800 truncate">{user.fullName}</p>
          <p className="text-xs text-gray-500">Customer</p>
        </div>
      )}

      <nav className="flex-1 py-2 overflow-y-auto">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
              active === item.id
                ? "bg-teal-50 text-teal-700 border-r-2 border-teal-600 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && item.label}
          </button>
        ))}
      </nav>

      <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 border-t">
        <LogOut className="h-4 w-4" />
        {!collapsed && 'Logout'}
      </button>
    </aside>
  );
}
