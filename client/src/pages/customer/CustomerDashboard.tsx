import { useState, useEffect } from 'react';
import CustomerSidebar from '@/components/CustomerSidebar';
import BrowseMedicines from './BrowseMedicines';
import Cart from './Cart';
import CustomerOrders from './Orders';
import UploadPrescription from './UploadPrescription';
import CustomerProfile from './Profile';
import { useAuth } from '@/contexts/AuthContext';
import MedicineCard from '@/components/MedicineCard';
import { getCart, saveCart } from '@/lib/storage';
import { toast } from 'sonner';
import { MapPin, Pill, TrendingUp } from 'lucide-react';

const _API = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://health-hub-express.onrender.com/api' : 'http://localhost:5000/api');
const API_URL = _API.includes('/api') ? _API.replace(/\/$/, '') : `${_API.replace(/\/$/, '')}/api`;

export default function CustomerDashboard() {
  const [page, setPage] = useState('home');
  const { user } = useAuth();

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [pharmacies, setPharmacies] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/medicines`)
      .then(res => res.json())
      .then(data => {
        setAllProducts(data);

        // Extract unique pharmacies from the populated medicine data
        const uniquePharmacies = new Map();
        data.forEach((med: any) => {
          if (med.pharmacy && !uniquePharmacies.has(med.pharmacy._id)) {
            uniquePharmacies.set(med.pharmacy._id, {
              id: med.pharmacy._id,
              name: med.pharmacy.pharmacyName || med.pharmacy.name || 'Unknown',
              address: med.pharmacy.address || 'Address not listed'
            });
          }
        });
        setPharmacies(Array.from(uniquePharmacies.values()));
      })
      .catch(console.error);
  }, []);

  const featured = allProducts.slice(0, 4);

  const addToCart = (product: any) => {
    const cart = getCart();
    const productId = product.id || product._id;
    const existing = cart.find((c: any) => c.productId === productId);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        productId: productId,
        pharmacyId: product.pharmacy?._id || product.pharmacyId || "default",
        quantity: 1
      });
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
          <div className="bg-gradient-to-r from-teal-600 to-emerald-500 rounded-2xl p-6 text-white shadow-md">
            <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.name || user?.fullName || 'Guest'}! 👋</h1>
            <p className="text-teal-100">Order medicines, upload prescriptions, and manage your health.</p>
          </div>

          {/* Featured medicines */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-teal-600" />
              <h2 className="text-lg font-semibold text-gray-800">Featured Medicines</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featured.map(p => (
                <MedicineCard key={p.id || p._id} product={p} onAddToCart={addToCart} />
              ))}
            </div>
            {featured.length === 0 && <p className="text-gray-400">Loading featured catalog...</p>}
          </div>

          {/* Nearby pharmacies */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-teal-600" />
              <h2 className="text-lg font-semibold text-gray-800">Active Pharmacies</h2>
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
                    </div>
                  </div>
                </div>
              ))}
              {pharmacies.length === 0 && <p className="text-gray-400">Loading active pharmacies...</p>}
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
