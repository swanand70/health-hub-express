import { useState } from 'react';
import CustomerSidebar from '@/components/CustomerSidebar';
import BrowseMedicines from './BrowseMedicines';
import Cart from './Cart';
import CustomerOrders from './Orders';
import UploadPrescription from './UploadPrescription';
import CustomerProfile from './Profile';
import { getPharmacies, getProducts } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';
import MedicineCard from '@/components/MedicineCard';
import { CartItem } from '@/lib/types';
import { getCart, saveCart } from '@/lib/storage';
import { toast } from 'sonner';
import { MapPin, Pill, TrendingUp } from 'lucide-react';

export default function CustomerDashboard() {
  const [page, setPage] = useState('home');
  const { user } = useAuth();
  const pharmacies = getPharmacies();
  const allProducts = getProducts();
  const featured = allProducts.slice(0, 4);

  const addToCart = (product: any) => {
    const cart = getCart();
    const existing = cart.find(c => c.productId === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ productId: product.id, pharmacyId: product.pharmacyId, quantity: 1 });
    }
    saveCart(cart);
    toast.success(`${product.name} added to cart`);
  };

  const renderPage = () => {
    switch (page) {
      case 'browse': return <BrowseMedicines onAddToCart={addToCart} />;
      case 'cart': return <Cart />;
      case 'orders': return <CustomerOrders />;
      case 'prescription': return <UploadPrescription />;
      case 'profile': return <CustomerProfile />;
      default: return (
        <div className="p-6 space-y-6">
          {/* Welcome banner */}
          <div className="bg-gradient-to-r from-teal-600 to-emerald-500 rounded-2xl p-6 text-white">
            <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.fullName}! 👋</h1>
            <p className="text-teal-100">Order medicines, upload prescriptions, and manage your health.</p>
          </div>

          {/* Featured medicines */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-teal-600" />
              <h2 className="text-lg font-semibold text-gray-800">Featured Medicines</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featured.map(p => <MedicineCard key={p.id} product={p} onAddToCart={addToCart} />)}
            </div>
          </div>

          {/* Nearby pharmacies */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-teal-600" />
              <h2 className="text-lg font-semibold text-gray-800">Nearby Pharmacies</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pharmacies.map(ph => (
                <div key={ph.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setPage('browse')}>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-teal-50 rounded-lg flex items-center justify-center">
                      <Pill className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{ph.name}</h3>
                      <p className="text-sm text-gray-500">{ph.address}</p>
                      <p className="text-xs text-gray-400">{ph.phone}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <CustomerSidebar active={page} onNavigate={setPage} />
      <main className="flex-1 overflow-y-auto">{renderPage()}</main>
    </div>
  );
}
