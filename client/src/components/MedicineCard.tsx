import { Product } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, AlertTriangle } from 'lucide-react';

interface Props {
  product: Product;
  onAddToCart?: (product: Product) => void;
  showActions?: boolean;
}

export default function MedicineCard({ product, onAddToCart, showActions = true }: Props) {
  const categoryColors: Record<string, string> = {
    otc: 'bg-green-100 text-green-700',
    prescription: 'bg-orange-100 text-orange-700',
    wellness: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow duration-200 flex flex-col">
      <div className="flex items-start justify-between mb-2">
        <Badge
          className={(categoryColors[product.category ?? ""] || "bg-gray-100 text-gray-600") + " border-0 text-xs"}
        >
          {product.category ? product.category.toUpperCase() : "MED"}
        </Badge>

        {product.prescriptionRequired && (
          <Badge className="bg-red-100 text-red-600 border-0 text-xs">
            <AlertTriangle className="h-3 w-3 mr-1" /> Rx Required
          </Badge>
        )}
      </div>

      <div className="h-20 flex items-center justify-center bg-gray-50 rounded-lg mb-3">
        <div className="text-3xl">💊</div>
      </div>

      <h3 className="font-semibold text-gray-800 text-sm mb-1">{product.name}</h3>
      <p className="text-xs text-gray-500 mb-3 flex-1 line-clamp-2">{product.description}</p>

      <div className="flex items-center justify-between mt-auto">
        <span className="text-lg font-bold text-teal-700">₹{product.price}</span>
        {showActions && !product.prescriptionRequired && (
          <Button
            size="sm"
            className="bg-teal-600 hover:bg-teal-700 text-xs"
            onClick={() => onAddToCart?.(product)}
          >
            <ShoppingCart className="h-3 w-3 mr-1" /> Add
          </Button>
        )}
        {showActions && product.prescriptionRequired && (
          <span className="text-xs text-orange-600 font-medium">Prescription needed</span>
        )}
      </div>

      {product.quantity !== undefined && product.quantity < 10 && (
        <p className="text-xs text-red-500 mt-2">
          ⚠ Only {product.quantity} left
        </p>
      )}

    </div>
  );
}
