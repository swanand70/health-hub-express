import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getProductsByPharmacy, addProduct, updateProduct, deleteProduct, genId } from '@/lib/storage';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const emptyProduct = (): Partial<Product> => ({
  name: '', description: '', category: 'otc', price: 0, quantity: 0, prescriptionRequired: false
});

export default function Inventory() {
  const { user } = useAuth();
  const pharmacyId = user?.pharmacyId || '';
  const [products, setProducts] = useState(getProductsByPharmacy(pharmacyId));
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Product>>(emptyProduct());
  const [isEdit, setIsEdit] = useState(false);

  const refresh = () => setProducts(getProductsByPharmacy(pharmacyId));

  const openAdd = () => { setEditing(emptyProduct()); setIsEdit(false); setModalOpen(true); };
  const openEdit = (p: Product) => { setEditing({ ...p }); setIsEdit(true); setModalOpen(true); };

  const handleSave = () => {
    if (!editing.name) { toast.error('Name is required'); return; }
    if (isEdit) {
      updateProduct(editing as Product);
      toast.success('Product updated');
    } else {
      addProduct({ ...editing, id: genId(), pharmacyId } as Product);
      toast.success('Product added');
    }
    setModalOpen(false);
    refresh();
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    toast.success('Product deleted');
    refresh();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800">Inventory Management</h1>
        <Button className="bg-teal-600 hover:bg-teal-700" onClick={openAdd}><Plus className="h-4 w-4 mr-1" /> Add Medicine</Button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Rx</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell><Badge variant="secondary" className="text-xs">{p.category.toUpperCase()}</Badge></TableCell>
                <TableCell>₹{p.price}</TableCell>
                <TableCell>
                  <span className={p.quantity < 10 ? 'text-red-600 font-bold' : ''}>{p.quantity}</span>
                </TableCell>
                <TableCell>{p.prescriptionRequired ? '✅' : '—'}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {products.length === 0 && <p className="p-6 text-center text-gray-400">No products. Add your first medicine.</p>}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{isEdit ? 'Edit Medicine' : 'Add Medicine'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input value={editing.name || ''} onChange={e => setEditing({ ...editing, name: e.target.value })} /></div>
            <div><Label>Description</Label><Input value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Price (₹)</Label><Input type="number" value={editing.price || 0} onChange={e => setEditing({ ...editing, price: Number(e.target.value) })} /></div>
              <div><Label>Quantity</Label><Input type="number" value={editing.quantity || 0} onChange={e => setEditing({ ...editing, quantity: Number(e.target.value) })} /></div>
            </div>
            <div>
              <Label>Category</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value as any })}>
                <option value="otc">OTC</option>
                <option value="prescription">Prescription</option>
                <option value="wellness">Wellness</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="rx" checked={editing.prescriptionRequired || false} onChange={e => setEditing({ ...editing, prescriptionRequired: e.target.checked })} />
              <Label htmlFor="rx">Prescription Required</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
