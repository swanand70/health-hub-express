import { useState, useEffect } from "react";
import MedicineCard from "@/components/MedicineCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Product } from "@/lib/types";

interface Props {
  onAddToCart: (p: Product) => void;
}

export default function BrowseMedicines({ onAddToCart }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    fetch("https://health-hub-express.onrender.com/api/medicines")
      .then(res => res.json())
      .then(data => {
        const normalized = data.map((p: any) => ({
          ...p,
          id: p._id   // convert Mongo _id → id
        }));
        setProducts(normalized);
      })
      .catch(err => console.log(err));
  }, []);


  const filtered = products.filter(p => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      category === "all" ||
      p.category?.toLowerCase() === category.toLowerCase();

    return matchSearch && matchCategory;
  });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold text-gray-800">Browse Medicines</h1>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search medicines..."
          className="pl-9"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <Tabs value={category} onValueChange={setCategory}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="otc">OTC</TabsTrigger>
          <TabsTrigger value="prescription">Prescription</TabsTrigger>
          <TabsTrigger value="wellness">Wellness</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(p => (
          <MedicineCard key={p.id} product={p} onAddToCart={onAddToCart} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-400 py-10">
          No medicines found
        </p>
      )}
    </div>
  );
}
