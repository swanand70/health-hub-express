import { getOrdersByCustomer, getPharmacyById } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-blue-100 text-blue-700',
  rejected: 'bg-red-100 text-red-700',
  ready: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
};

export default function CustomerOrders() {
  const { user } = useAuth();
  const orders = getOrdersByCustomer(user?.id || '').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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
          const pharmacy = getPharmacyById(order.pharmacyId);
          return (
            <div key={order.id} className="bg-white rounded-xl border p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-400">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-sm text-gray-600">{pharmacy?.name}</p>
                </div>
                <div className="text-right">
                  <Badge className={`${statusColors[order.status]} border-0`}>{order.status.toUpperCase()}</Badge>
                  <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="space-y-1">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.productName} × {item.quantity}</span>
                    <span className="text-gray-800 font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t flex justify-between items-center">
                <span className="text-sm text-gray-500">{order.deliveryMethod === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'} • {order.type}</span>
                <span className="font-bold text-teal-700">₹{order.total}</span>
              </div>
              {order.prescriptionImage && (
                <div className="mt-2">
                  <img src={order.prescriptionImage} alt="Prescription" className="h-20 rounded border" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
