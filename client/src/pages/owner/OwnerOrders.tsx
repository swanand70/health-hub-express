import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getOrdersByPharmacy, updateOrder, getUserById } from '@/lib/storage';
import { Order } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Check, X, Package, Truck, Eye } from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-blue-100 text-blue-700',
  rejected: 'bg-red-100 text-red-700',
  ready: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
};

export default function OwnerOrders() {
  const { user } = useAuth();
  const pharmacyId = user?.pharmacyId || '';
  const [orders, setOrders] = useState(getOrdersByPharmacy(pharmacyId));
  const [viewPrescription, setViewPrescription] = useState<string | null>(null);

  const refresh = () => setOrders(getOrdersByPharmacy(pharmacyId));

  const changeStatus = (order: Order, status: Order['status']) => {
    updateOrder({ ...order, status, updatedAt: new Date().toISOString() });
    toast.success(`Order marked as ${status}`);
    refresh();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Incoming Orders</h1>
      <div className="space-y-4">
        {orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(order => {
          const customer = getUserById(order.customerId);
          return (
            <div key={order.id} className="bg-white rounded-xl border p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-gray-800">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-xs text-gray-500">Customer: {customer?.fullName || 'Unknown'} • {order.deliveryMethod}</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <Badge className={`${statusColors[order.status]} border-0`}>{order.status.toUpperCase()}</Badge>
              </div>

              {order.type === 'prescription' ? (
                <div className="mb-3">
                  <Badge className="bg-orange-100 text-orange-700 border-0 mb-2">📋 Prescription Order</Badge>
                  {order.prescriptionImage && (
                    <Button variant="outline" size="sm" onClick={() => setViewPrescription(order.prescriptionImage!)}>
                      <Eye className="h-3 w-3 mr-1" /> View Prescription
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-1 mb-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.productName} × {item.quantity}</span>
                      <span className="font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t">
                <span className="font-bold text-teal-700">₹{order.total}</span>
                <div className="flex gap-2">
                  {order.status === 'pending' && (
                    <>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => changeStatus(order, 'accepted')}>
                        <Check className="h-3 w-3 mr-1" /> Accept
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => changeStatus(order, 'rejected')}>
                        <X className="h-3 w-3 mr-1" /> Reject
                      </Button>
                    </>
                  )}
                  {order.status === 'accepted' && (
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={() => changeStatus(order, 'ready')}>
                      <Package className="h-3 w-3 mr-1" /> Mark Ready
                    </Button>
                  )}
                  {order.status === 'ready' && (
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={() => changeStatus(order, 'delivered')}>
                      <Truck className="h-3 w-3 mr-1" /> Mark Delivered
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
