import { useState, useEffect } from 'react';
import { getCart, saveCart, clearCart } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://health-hub-express.onrender.com/api' : 'http://localhost:5000/api');

export default function Cart() {
  const { user, token } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCartState] = useState(getCart());
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || "");

  useEffect(() => {
    fetch(`${API_URL}/medicines`)
      .then(res => res.json())
      .then(data => {
        const normalized = data.map((p: any) => ({
          ...p,
          id: p._id,
        }));
        setProducts(normalized);
      })
      .catch(console.error);
  }, []);

  const cartWithDetails = cart.map((item: any) => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter((i: any) => i.product);

  const total = cartWithDetails.reduce((sum: number, i: any) => sum + (i.product.price * i.quantity), 0);

  const updateQty = (productId: string, delta: number) => {
    const updated = cart.map((c: any) => {
      if (c.productId === productId) {
        const newQ = c.quantity + delta;
        return newQ > 0 ? { ...c, quantity: newQ } : c;
      }
      return c;
    });
    saveCart(updated);
    setCartState(updated);
  };

  const removeItem = (productId: string, cartItemProduct: any) => {
    const updated = cart.filter((c: any) => c.productId !== productId);
    saveCart(updated);
    setCartState(updated);
    toast.info('Item removed');
  };

  const checkout = async () => {
    if (!user || cartWithDetails.length === 0) return;
    if (!deliveryAddress.trim()) {
      return toast.error("Please provide a delivery address.");
    }

    setIsCheckingOut(true);

    try {
      // Group by pharmacy because Backend schema handles 1 pharmacy per Order
      const byPharmacy: Record<string, typeof cartWithDetails> = {};
      cartWithDetails.forEach((item: any) => {
        const pid = item.product.pharmacy?._id || item.product.pharmacy || item.pharmacyId;
        if (!byPharmacy[pid]) byPharmacy[pid] = [];
        byPharmacy[pid].push(item);
      });

      // Fire order requests for each pharmacy
      const promises = Object.entries(byPharmacy).map(([pharmacyId, items]) => {
        const orderPayload = {
          pharmacyId,
          deliveryAddress,
          items: items.map((i: any) => ({
            medicineId: i.productId,
            quantity: i.quantity
          }))
        };

        return fetch(`${API_URL}/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(orderPayload)
        }).then(res => {
          if (!res.ok) throw new Error("Order failed for a pharmacy");
          return res.json();
        });
      });

      await Promise.all(promises);

      clearCart();
      setCartState([]);
      toast.success('Sequence Complete! Orders placed successfully.');
    } catch (err: any) {
      toast.error('Failed to place one or more orders. Check stock.');
      console.error(err);
    } finally {
      setIsCheckingOut(false);
    }
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
        {cartWithDetails.map((item: any) => {
          const pharmacyObj = item.product.pharmacy;
          const pharmacyName = pharmacyObj?.pharmacyName || pharmacyObj?.name || 'Unknown Pharmacy';

          return (
            <div key={item.productId} className="bg-white rounded-xl border p-4 flex items-center gap-4 shadow-sm">
              <div className="h-14 w-14 bg-teal-50 rounded-lg flex items-center justify-center text-2xl">💊</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-800 text-sm">{item.product.name}</h3>
                <p className="text-sm text-teal-600 font-bold">₹{item.product.price}</p>
                <p className="text-xs text-gray-400 font-medium">From: {pharmacyName}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQty(item.productId, -1)} className="h-7 w-7 rounded-full border flex items-center justify-center hover:bg-gray-100"><Minus className="h-3 w-3" /></button>
                <span className="w-6 text-center font-medium text-sm">{item.quantity}</span>
                <button onClick={() => updateQty(item.productId, 1)} className="h-7 w-7 rounded-full border flex items-center justify-center hover:bg-gray-100"><Plus className="h-3 w-3" /></button>
              </div>
              <span className="font-bold text-gray-800 w-16 text-right">₹{item.product.price * item.quantity}</span>
              <button onClick={() => removeItem(item.productId, item)} className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-white rounded-xl border p-4 shadow-sm">
        <p className="text-sm font-medium text-gray-700 mb-2">Delivery Address</p>
        <textarea
          className="w-full border rounded-md p-2 text-sm focus:ring-teal-500 focus:border-teal-500"
          rows={3}
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          placeholder="Enter complete delivery address..."
        />
      </div>

      {/* Total & checkout */}
      <div className="mt-4 bg-white rounded-xl border p-4 flex items-center justify-between shadow-sm">
        <div>
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="text-2xl font-bold text-teal-700">₹{total}</p>
        </div>
        <Button
          className="bg-teal-600 hover:bg-teal-700 px-8 disabled:opacity-50"
          onClick={checkout}
          disabled={isCheckingOut}
        >
          {isCheckingOut ? 'Processing...' : 'Place Order'}
        </Button>
      </div>
    </div>
  );
}
