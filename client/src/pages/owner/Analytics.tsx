import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import StatsCard from '@/components/StatsCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingCart, TrendingUp, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://health-hub-express.onrender.com/api' : 'http://localhost:5000/api');

export default function Analytics() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch(`${API_URL}/orders/me`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/medicines/inventory/me`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (ordersRes.ok && productsRes.ok) {
          setOrders(await ordersRes.json());
          setProducts(await productsRes.json());
        } else {
          toast.error("Failed to load analytics data");
        }
      } catch (err) {
        toast.error("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <div className="p-6 text-gray-400">Loading analytics...</div>;

  const revenue = orders.filter(o => o.status !== 'Rejected').reduce((s, o) => s + (o.totalAmount || 0), 0);
  const delivered = orders.filter(o => o.status === 'Delivered').length;
  const lowStock = products.filter(p => (p.inStock || 0) < 10);

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
              <div key={p._id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <span className="text-sm text-gray-700">{p.name}</span>
                <span className="text-sm font-bold text-red-600">{p.inStock} remaining</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
