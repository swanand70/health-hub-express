import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const emptyProduct = (): Partial<Product> & { inStock?: number } => ({
  name: '', description: '', category: 'otc', price: 0, inStock: 0, prescriptionRequired: false
});

export default function Inventory() {
  const { token } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Product> & { inStock?: number }>(emptyProduct());
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/medicines/inventory/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setProducts(await res.json());
      }
    } catch (err) {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [token]);

  const openAdd = () => { setEditing(emptyProduct()); setIsEdit(false); setModalOpen(true); };
  const openEdit = (p: any) => { setEditing({ ...p, inStock: p.inStock }); setIsEdit(true); setModalOpen(true); };

  const handleSave = async () => {
    if (!editing.name) { toast.error('Name is required'); return; }
    
    try {
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit ? `${API_URL}/medicines/${editing._id}` : `${API_URL}/medicines`;
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editing)
      });

      if (!res.ok) throw new Error("Failed to save product");
      
      toast.success(isEdit ? 'Product updated' : 'Product added');
      setModalOpen(false);
      fetchInventory();
    } catch (err) {
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this medicine?")) return;
    try {
      const res = await fetch(`${API_URL}/medicines/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete product");
      toast.success('Product deleted');
      fetchInventory();
    } catch (err) {
      toast.error('Failed to delete product');
    }
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
              <TableHead>Qty in Stock</TableHead>
              <TableHead>Rx</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-6 text-gray-400">Loading...</TableCell></TableRow>
            ) : products.map(p => (
              <TableRow key={p._id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell><Badge variant="secondary" className="text-xs">{(p.category || 'other').toUpperCase()}</Badge></TableCell>
                <TableCell>₹{p.price}</TableCell>
                <TableCell>
                  <span className={p.inStock < 10 ? 'text-red-600 font-bold' : ''}>{p.inStock}</span>
                </TableCell>
                <TableCell>{p.prescriptionRequired ? '✅' : '—'}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p._id)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!loading && products.length === 0 && <p className="p-6 text-center text-gray-400">No products. Add your first medicine.</p>}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{isEdit ? 'Edit Medicine' : 'Add Medicine'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input value={editing.name || ''} onChange={e => setEditing({ ...editing, name: e.target.value })} /></div>
            <div><Label>Description</Label><Input value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Price (₹)</Label><Input type="number" value={editing.price || 0} onChange={e => setEditing({ ...editing, price: Number(e.target.value) })} /></div>
              <div><Label>Quantity</Label><Input type="number" value={editing.inStock || 0} onChange={e => setEditing({ ...editing, inStock: Number(e.target.value) })} /></div>
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
