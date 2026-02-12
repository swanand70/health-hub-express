import { LayoutDashboard, Package, ClipboardList, BarChart3, User, LogOut, Pill } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'orders', label: 'Orders', icon: ClipboardList },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'profile', label: 'Profile', icon: User },
];

interface Props {
  active: string;
  onNavigate: (id: string) => void;
}

export default function OwnerSidebar({ active, onNavigate }: Props) {
  const { logout, user } = useAuth();

  return (
    <aside className="h-screen w-60 bg-white border-r border-gray-200 flex flex-col shrink-0">
      <div className="p-4 border-b border-gray-100 flex items-center gap-2">
        <div className="h-9 w-9 rounded-full bg-teal-600 flex items-center justify-center">
          <Pill className="h-5 w-5 text-white" />
        </div>
        <span className="font-bold text-teal-800 text-lg">PharmaCare</span>
      </div>

      {user && (
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-800 truncate">{user.fullName}</p>
          <p className="text-xs text-gray-500">Pharmacy Owner</p>
        </div>
      )}

      <nav className="flex-1 py-2">
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
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </nav>

      <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 border-t">
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </aside>
  );
}
