import { useState, useEffect } from "react";
import MedicineCard from "@/components/MedicineCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Pill } from "lucide-react";
import { Product } from "@/lib/types";

interface Props {
  onAddToCart: (p: Product) => void;
}

const _API = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://health-hub-express.onrender.com/api' : 'http://localhost:5000/api');
const API_URL = _API.includes('/api') ? _API.replace(/\/$/, '') : `${_API.replace(/\/$/, '')}/api`;

export default function BrowseMedicines({ onAddToCart }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [pharmacyFilter, setPharmacyFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/medicines`);
        if (!response.ok) {
          throw new Error('Failed to fetch medicines');
        }
        const data = await response.json();
        
        // Normalize products with proper id mapping
        const normalized = data.map((p: any) => ({
          ...p,
          id: p._id,
          pharmacyId: p.pharmacy?._id || p.pharmacyId
        }));
        setProducts(normalized);

        // Extract unique pharmacies
        const uniquePharmacies = new Map();
        data.forEach((med: any) => {
          if (med.pharmacy && med.pharmacy._id) {
            uniquePharmacies.set(med.pharmacy._id, {
              id: med.pharmacy._id,
              name: med.pharmacy.pharmacyName || 'Unknown Pharmacy',
              address: med.pharmacy.address || 'Address not available'
            });
          }
        });
        setPharmacies(Array.from(uniquePharmacies.values()));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  const filtered = products.filter(p => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      category === "all" ||
      p.category?.toLowerCase() === category.toLowerCase();

    const matchPharmacy =
      pharmacyFilter === "all" ||
      p.pharmacyId === pharmacyFilter;

    return matchSearch && matchCategory && matchPharmacy;
  });

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Browse All Medicines</h1>
        <Badge variant="outline" className="text-sm">
          {filtered.length} medicine{filtered.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by medicine name or description..."
          className="pl-9 bg-white focus:ring-teal-500"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Category Tabs */}
        <Tabs value={category} onValueChange={setCategory}>
          <TabsList className="bg-white border rounded-lg p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700">All</TabsTrigger>
            <TabsTrigger value="otc" className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700">OTC</TabsTrigger>
            <TabsTrigger value="prescription" className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700">Prescription</TabsTrigger>
            <TabsTrigger value="wellness" className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700">Wellness</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Pharmacy Filter */}
        {pharmacies.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={pharmacyFilter}
              onChange={(e) => setPharmacyFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
            >
              <option value="all">All Pharmacies</option>
              {pharmacies.map(ph => (
                <option key={ph.id} value={ph.id}>{ph.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Active Filters */}
      {(search || category !== "all" || pharmacyFilter !== "all") && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-500">Active filters:</span>
          {search && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearch('')}>
              Search: {search} ✕
            </Badge>
          )}
          {category !== "all" && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => setCategory('all')}>
              Category: {category.toUpperCase()} ✕
            </Badge>
          )}
          {pharmacyFilter !== "all" && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => setPharmacyFilter('all')}>
              Pharmacy ✕
            </Badge>
          )}
          <button
            onClick={() => {
              setSearch('');
              setCategory('all');
              setPharmacyFilter('all');
            }}
            className="text-sm text-teal-600 hover:text-teal-700 underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          <p className="ml-4 text-gray-600">Loading medicines...</p>
        </div>
      )}

      {/* Products Grid */}
      {!loading && (
        <>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(p => (
                <MedicineCard key={p.id} product={p} onAddToCart={onAddToCart} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Pill className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No medicines found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
              <button
                onClick={() => {
                  setSearch('');
                  setCategory('all');
                  setPharmacyFilter('all');
                }}
                className="text-teal-600 hover:text-teal-700 underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </>
      )}

      {/* Pharmacy Info Footer */}
      {!loading && pharmacies.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <p className="text-sm text-blue-800">
            💊 Showing medicines from <strong>{pharmacies.length} registered pharmacies</strong>
          </p>
        </div>
      )}
    </div>
  );
}
