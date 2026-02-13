import { useAuth } from '@/contexts/AuthContext';
import { getOrdersByPharmacy, getProductsByPharmacy } from '@/lib/storage';
import StatsCard from '@/components/StatsCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingCart, TrendingUp, AlertTriangle } from 'lucide-react';

export default function Analytics() {
  const { user } = useAuth();
  const pharmacyId = user?.pharmacyId || '';
  const orders = getOrdersByPharmacy(pharmacyId);
  const products = getProductsByPharmacy(pharmacyId);

  const revenue = orders.filter(o => o.status !== 'rejected').reduce((s, o) => s + o.total, 0);
  const delivered = orders.filter(o => o.status === 'delivered').length;
  const lowStock = products.filter(p => p.quantity < 10);

  // Simple monthly aggregation
  const monthlyData: Record<string, number> = {};
  orders.forEach(o => {
    const month = new Date(o.createdAt).toLocaleString('default', { month: 'short' });
    monthlyData[month] = (monthlyData[month] || 0) + 1;
  });
  const chartData = Object.entries(monthlyData).map(([month, count]) => ({ month, orders: count }));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold text-gray-800">Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Revenue" value={`₹${revenue}`} icon={DollarSign} color="green" />
        <StatsCard title="Total Orders" value={orders.length} icon={ShoppingCart} color="teal" />
        <StatsCard title="Delivered" value={delivered} icon={TrendingUp} color="blue" />
        <StatsCard title="Low Stock Items" value={lowStock.length} icon={AlertTriangle} color="red" />
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Orders Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#0d9488" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Low stock alerts */}
      {lowStock.length > 0 && (
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">⚠️ Low Stock Alerts</h2>
          <div className="space-y-2">
            {lowStock.map(p => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <span className="text-sm text-gray-700">{p.name}</span>
                <span className="text-sm font-bold text-red-600">{p.quantity} remaining</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
