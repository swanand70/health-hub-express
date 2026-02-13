import { useState } from 'react';
import { getPharmacies, getProductsByPharmacy } from '@/lib/storage';
import { Product } from '@/lib/types';
import MedicineCard from '@/components/MedicineCard';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, Store } from 'lucide-react';

interface Props { onAddToCart: (p: Product) => void; }

export default function BrowseMedicines({ onAddToCart }: Props) {
  const pharmacies = getPharmacies();
  const [selectedPharmacy, setSelectedPharmacy] = useState(pharmacies[0]?.id || '');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const products = getProductsByPharmacy(selectedPharmacy);
  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'all' || p.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold text-gray-800">Browse Medicines</h1>

      {/* Pharmacy selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <Store className="h-5 w-5 text-teal-600" />
        {pharmacies.map(ph => (
          <button
            key={ph.id}
            onClick={() => setSelectedPharmacy(ph.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedPharmacy === ph.id ? 'bg-teal-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {ph.name}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input placeholder="Search medicines..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Category tabs */}
      <Tabs value={category} onValueChange={setCategory}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="otc">OTC</TabsTrigger>
          <TabsTrigger value="prescription">Prescription</TabsTrigger>
          <TabsTrigger value="wellness">Wellness</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(p => <MedicineCard key={p.id} product={p} onAddToCart={onAddToCart} />)}
      </div>
      {filtered.length === 0 && <p className="text-center text-gray-400 py-10">No medicines found</p>}
    </div>
  );
}
