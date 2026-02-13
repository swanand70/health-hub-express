import { useState } from 'react';
import OwnerSidebar from '@/components/OwnerSidebar';
import Inventory from './Inventory';
import OwnerOrders from './OwnerOrders';
import Analytics from './Analytics';
import OwnerProfile from './OwnerProfile';
import { useAuth } from '@/contexts/AuthContext';
import { getOrdersByPharmacy, getProductsByPharmacy } from '@/lib/storage';
import StatsCard from '@/components/StatsCard';
import { ShoppingCart, DollarSign, AlertTriangle, Clock } from 'lucide-react';

export default function OwnerDashboard() {
  const [page, setPage] = useState('overview');
  const { user } = useAuth();
  const pharmacyId = user?.pharmacyId || '';
  const orders = getOrdersByPharmacy(pharmacyId);
  const products = getProductsByPharmacy(pharmacyId);

  const revenue = orders.filter(o => o.status !== 'rejected').reduce((s, o) => s + o.total, 0);
  const pending = orders.filter(o => o.status === 'pending').length;
  const lowStock = products.filter(p => p.quantity < 10).length;

  const renderPage = () => {
    switch (page) {
      case 'inventory': return <Inventory />;
      case 'orders': return <OwnerOrders />;
      case 'analytics': return <Analytics />;
      case 'profile': return <OwnerProfile />;
      default: return (
        <div className="p-6 space-y-6">
          <h1 className="text-xl font-bold text-gray-800">Dashboard Overview</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Total Orders" value={orders.length} icon={ShoppingCart} color="teal" />
            <StatsCard title="Revenue" value={`₹${revenue}`} icon={DollarSign} color="green" />
            <StatsCard title="Pending Orders" value={pending} icon={Clock} color="orange" />
            <StatsCard title="Low Stock Items" value={lowStock} icon={AlertTriangle} color="red" />
          </div>

          {/* Recent orders */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Recent Orders</h2>
            <div className="bg-white rounded-xl border">
              {orders.slice(0, 5).map(order => (
                <div key={order.id} className="p-4 border-b last:border-b-0 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-gray-500">{order.items.length} items • ₹{order.total}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>{order.status.toUpperCase()}</span>
                </div>
              ))}
              {orders.length === 0 && <p className="p-6 text-center text-gray-400">No orders yet</p>}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <OwnerSidebar active={page} onNavigate={setPage} />
      <main className="flex-1 overflow-y-auto">{renderPage()}</main>
    </div>
  );
}
