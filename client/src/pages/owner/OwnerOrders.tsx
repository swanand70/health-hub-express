import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Check, X, Package, Truck, Eye } from 'lucide-react';

const _API = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://health-hub-express.onrender.com/api' : 'http://localhost:5000/api');
const API_URL = _API.includes('/api') ? _API.replace(/\/$/, '') : `${_API.replace(/\/$/, '')}/api`;

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Accepted: 'bg-blue-100 text-blue-700',
  Rejected: 'bg-red-100 text-red-700',
  Ready: 'bg-purple-100 text-purple-700',
  Shipped: 'bg-indigo-100 text-indigo-700',
  Delivered: 'bg-green-100 text-green-700',
};

export default function OwnerOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [viewPrescription, setViewPrescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/orders/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to load orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      toast.error('Could not fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const changeStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error("Status update failed");
      toast.success(`Order marked as ${status}`);
      fetchOrders();
    } catch (err) {
      toast.error('Status update failed');
    }
  };

  if (loading) return <div className="p-6 text-gray-400">Loading orders...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Incoming Orders</h1>
      <div className="space-y-4">
        {orders.map(order => {
          const customerName = order.customer?.name || order.customer?.fullName || 'Unknown Customer';
          return (
            <div key={order._id} className="bg-white rounded-xl border p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-gray-800">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-500">Customer: {customerName} • {order.deliveryAddress}</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <Badge className={`${statusColors[order.status] || 'bg-gray-100'} border-0`}>{order.status.toUpperCase()}</Badge>
              </div>

              {order.type === 'prescription' ? (
                <div className="mb-3">
                  <Badge className="bg-orange-100 text-orange-700 border-0 mb-2">📋 Prescription Order</Badge>
                  {order.prescriptionImage && (
                    <Button variant="outline" size="sm" onClick={() => setViewPrescription(order.prescriptionImage)}>
                      <Eye className="h-3 w-3 mr-1" /> View Prescription
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-1 mb-3">
                  {order.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.medicine?.name || 'Unknown Item'} × {item.quantity}</span>
                      <span className="font-medium">₹{item.priceAtPurchase * item.quantity}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t">
                <span className="font-bold text-teal-700">₹{order.totalAmount}</span>
                <div className="flex gap-2">
                  {order.status === 'Pending' && (
                    <>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => changeStatus(order._id, 'Accepted')}>
                        <Check className="h-3 w-3 mr-1" /> Accept
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => changeStatus(order._id, 'Rejected')}>
                        <X className="h-3 w-3 mr-1" /> Reject
                      </Button>
                    </>
                  )}
                  {order.status === 'Accepted' && (
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => changeStatus(order._id, 'Shipped')}>
                      <Truck className="h-3 w-3 mr-1" /> Mark Shipped
                    </Button>
                  )}
                  {order.status === 'Shipped' && (
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={() => changeStatus(order._id, 'Delivered')}>
                      <Package className="h-3 w-3 mr-1" /> Mark Delivered
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {orders.length === 0 && <p className="text-center text-gray-400 py-10">No orders yet</p>}
      </div>

      <Dialog open={!!viewPrescription} onOpenChange={() => setViewPrescription(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Prescription Image</DialogTitle></DialogHeader>
          {viewPrescription && <img src={viewPrescription} alt="Prescription" className="w-full rounded" />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
