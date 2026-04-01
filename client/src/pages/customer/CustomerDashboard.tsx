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
import { MapPin, Pill, TrendingUp, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const _API = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://health-hub-express.onrender.com/api' : 'http://localhost:5000/api');
const API_URL = _API.includes('/api') ? _API.replace(/\/$/, '') : `${_API.replace(/\/$/, '')}/api`;

export default function CustomerDashboard() {
  const [page, setPage] = useState('home');
  const { user } = useAuth();

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPharmacy, setSelectedPharmacy] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/medicines`);
        if (!response.ok) {
          throw new Error('Failed to fetch medicines');
        }
        const data = await response.json();
        setAllProducts(data);

        // Extract unique pharmacies from the populated medicine data
        const uniquePharmacies = new Map();
        data.forEach((med: any) => {
          if (med.pharmacy && med.pharmacy._id) {
            const pharmacyId = med.pharmacy._id;
            if (!uniquePharmacies.has(pharmacyId)) {
              uniquePharmacies.set(pharmacyId, {
                id: pharmacyId,
                name: med.pharmacy.pharmacyName || med.pharmacy.name || 'Unknown Pharmacy',
                address: med.pharmacy.address || 'Address not listed',
                medicineCount: 1
              });
            } else {
              const existing = uniquePharmacies.get(pharmacyId);
              existing.medicineCount += 1;
            }
          }
        });
        setPharmacies(Array.from(uniquePharmacies.values()));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        toast.error('Failed to load medicines');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products based on search, category, and pharmacy
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (product.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           (product.category || '').toLowerCase() === selectedCategory.toLowerCase();
    const matchesPharmacy = selectedPharmacy === 'all' || 
                           (product.pharmacy?._id === selectedPharmacy);
    return matchesSearch && matchesCategory && matchesPharmacy;
  });

  // Get unique categories from available products
  const categories = ['all', ...new Set(allProducts.map(p => p.category).filter(Boolean))];

  const featured = filteredProducts.slice(0, 8);

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
          <div className="bg-gradient-to-r from-teal-600 to-emerald-500 rounded-2xl p-8 text-white shadow-lg">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || user?.fullName || 'Guest'}! 👋</h1>
            <p className="text-teal-100 text-lg">Browse medicines from all registered pharmacies</p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search medicines..."
                  className="pl-9 focus:ring-teal-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Categories</option>
                  <option value="otc">OTC</option>
                  <option value="prescription">Prescription</option>
                  <option value="wellness">Wellness</option>
                </select>
              </div>

              {/* Pharmacy Filter */}
              <select
                value={selectedPharmacy}
                onChange={(e) => setSelectedPharmacy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
              >
                <option value="all">All Pharmacies</option>
                {pharmacies.map(ph => (
                  <option key={ph.id} value={ph.id}>{ph.name}</option>
                ))}
              </select>
            </div>

            {/* Active Filters Display */}
            {(searchQuery || selectedCategory !== 'all' || selectedPharmacy !== 'all') && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-500">Active filters:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchQuery('')}>
                    Search: {searchQuery} ✕
                  </Badge>
                )}
                {selectedCategory !== 'all' && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory('all')}>
                    Category: {selectedCategory.toUpperCase()} ✕
                  </Badge>
                )}
                {selectedPharmacy !== 'all' && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedPharmacy('all')}>
                    Pharmacy ✕
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedPharmacy('all');
                  }}
                  className="text-xs"
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
              <p className="ml-4 text-gray-600">Loading medicines...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-600 font-medium mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="destructive">
                Retry
              </Button>
            </div>
          )}

          {/* Results Count */}
          {!loading && !error && (
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Available Medicines ({filteredProducts.length})
              </h2>
              {filteredProducts.length > 0 && (
                <Badge variant="outline" className="text-sm">
                  From {pharmacies.length} pharmacies
                </Badge>
              )}
            </div>
          )}

          {/* Featured medicines / All Products Grid */}
          {!loading && !error && (
            <>
              {featured.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {featured.map(p => (
                    <MedicineCard key={p._id || p.id} product={p} onAddToCart={addToCart} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <Pill className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No medicines found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedPharmacy('all');
                    }}
                    variant="outline"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Pharmacy Directory */}
          {!loading && !error && pharmacies.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-teal-600" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Registered Pharmacies ({pharmacies.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pharmacies.map(ph => (
                  <div 
                    key={ph.id} 
                    className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-teal-300 transition-all cursor-pointer group"
                    onClick={() => setSelectedPharmacy(ph.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 bg-teal-50 rounded-lg flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                        <Pill className="h-6 w-6 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{ph.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{ph.address}</p>
                        <Badge variant="secondary" className="text-xs">
                          {ph.medicineCount} medicine{ph.medicineCount !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
