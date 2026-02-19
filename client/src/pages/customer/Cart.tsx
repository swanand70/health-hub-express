import { useState, useEffect } from 'react';
import { getCart, saveCart, clearCart, getProducts, getPharmacies, addOrder, genId } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';


export default function Cart() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/medicines")
      .then(res => res.json())
      .then(data => {
        const normalized = data.map((p: any) => ({
          ...p,
          id: p._id
        }));
        setProducts(normalized);
      });
  }, []);

  const [cart, setCartState] = useState(getCart());
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const pharmacies = getPharmacies();

  const cartWithDetails = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(i => i.product);

  const total = cartWithDetails.reduce((sum, i) => sum + (i.product!.price * i.quantity), 0);

  const updateQty = (productId: string, delta: number) => {
    const updated = cart.map(c => {
      if (c.productId === productId) {
        const newQ = c.quantity + delta;
        return newQ > 0 ? { ...c, quantity: newQ } : c;
      }
      return c;
    });
    saveCart(updated);
    setCartState(updated);
  };

  const removeItem = (productId: string) => {
    const updated = cart.filter(c => c.productId !== productId);
    saveCart(updated);
    setCartState(updated);
    toast.info('Item removed');
  };

  const checkout = () => {
    if (!user || cart.length === 0) return;
    // Group by pharmacy
    const byPharmacy: Record<string, typeof cartWithDetails> = {};
    cartWithDetails.forEach(item => {
      const pid = item.pharmacyId;
      if (!byPharmacy[pid]) byPharmacy[pid] = [];
      byPharmacy[pid].push(item);
    });

    const now = new Date().toISOString();
    Object.entries(byPharmacy).forEach(([pharmacyId, items]) => {
      addOrder({
        id: genId(),
        customerId: user.id,
        pharmacyId,
        items: items.map(i => ({
          productId: i.productId,
          productName: i.product!.name,
          quantity: i.quantity,
          price: i.product!.price,
        })),
        total: items.reduce((s, i) => s + i.product!.price * i.quantity, 0),
        status: 'pending',
        type: 'regular',
        deliveryMethod,
        createdAt: now,
        updatedAt: now,
      });
    });

    clearCart();
    setCartState([]);
    toast.success('Order placed successfully!');
  };

  if (cartWithDetails.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-600">Your cart is empty</h2>
        <p className="text-gray-400">Browse medicines and add items to your cart</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-xl font-bold text-gray-800 mb-4">My Cart</h1>

      <div className="space-y-3">
        {cartWithDetails.map(item => (
          <div key={item.productId} className="bg-white rounded-xl border p-4 flex items-center gap-4">
            <div className="h-14 w-14 bg-gray-50 rounded-lg flex items-center justify-center text-2xl">💊</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-800 text-sm">{item.product!.name}</h3>
              <p className="text-sm text-teal-600 font-bold">₹{item.product!.price}</p>
              <p className="text-xs text-gray-400">
                {pharmacies.find(p => p.id === item.pharmacyId)?.name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQty(item.productId, -1)} className="h-7 w-7 rounded-full border flex items-center justify-center hover:bg-gray-100"><Minus className="h-3 w-3" /></button>
              <span className="w-6 text-center font-medium text-sm">{item.quantity}</span>
              <button onClick={() => updateQty(item.productId, 1)} className="h-7 w-7 rounded-full border flex items-center justify-center hover:bg-gray-100"><Plus className="h-3 w-3" /></button>
            </div>
            <span className="font-bold text-gray-800 w-16 text-right">₹{item.product!.price * item.quantity}</span>
            <button onClick={() => removeItem(item.productId)} className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>

      {/* Delivery method */}
      <div className="mt-6 bg-white rounded-xl border p-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Delivery Method</p>
        <div className="flex gap-3">
          {(['delivery', 'pickup'] as const).map(m => (
            <button
              key={m}
              onClick={() => setDeliveryMethod(m)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${deliveryMethod === m ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
            >
              {m === 'delivery' ? '🚚 Home Delivery' : '🏪 Store Pickup'}
            </button>
          ))}
        </div>
      </div>

      {/* Total & checkout */}
      <div className="mt-4 bg-white rounded-xl border p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="text-2xl font-bold text-teal-700">₹{total}</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700 px-8" onClick={checkout}>Place Order</Button>
      </div>
    </div>
  );
}
