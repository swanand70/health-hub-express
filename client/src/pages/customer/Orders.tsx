import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Accepted: 'bg-blue-100 text-blue-700',
  Rejected: 'bg-red-100 text-red-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
};

export default function CustomerOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/orders/me`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to load orders");
        return res.json();
      })
      .then(data => {
        setOrders(data);
      })
      .catch(err => {
        toast.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <Package className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-600">No orders yet</h2>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-gray-800 mb-4">My Orders</h1>
      <div className="space-y-4">
        {orders.map(order => {
          const pharmacyName = order.pharmacy?.pharmacyName || order.pharmacy?.name || 'Unknown Pharmacy';
          
          return (
            <div key={order._id} className="bg-white rounded-xl border p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-400">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm font-semibold text-gray-700">{pharmacyName}</p>
                </div>
                <div className="text-right">
                  <Badge className={`${statusColors[order.status] || 'bg-gray-100 text-gray-700'} border-0`}>{order.status.toUpperCase()}</Badge>
                  <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="space-y-1 mb-3">
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.medicine?.name || 'Unknown Item'} × {item.quantity}</span>
                    <span className="text-gray-800 font-medium">₹{item.priceAtPurchase * item.quantity}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-3 border-t flex justify-between items-start">
                <div>
                    <span className="text-sm text-gray-500 block mb-1">Delivering to:</span>
                    <span className="text-xs font-medium text-gray-600 max-w-[200px] block">{order.deliveryAddress}</span>
                </div>
                <div className="text-right">
                    <span className="text-sm text-gray-500 block">Total</span>
                    <span className="font-bold text-lg text-teal-700">₹{order.totalAmount}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
