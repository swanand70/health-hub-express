import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getPharmacyById, updatePharmacy } from '@/lib/storage';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function OwnerProfile() {
  const { user, updateProfile } = useAuth();
  const pharmacy = getPharmacyById(user?.pharmacyId || '');
  const [form, setForm] = useState({ ...user! });
  const [pharmForm, setPharmForm] = useState({ ...pharmacy! });

  const handleSave = () => {
    updateProfile(form);
    if (pharmacy) {
      updatePharmacy({ ...pharmForm, ownerId: user!.id });
    }
    toast.success('Profile updated');
  };

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Profile Settings</h1>
      <div className="bg-white rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-gray-700">Personal Info</h2>
        <div><Label>Full Name</Label><Input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} /></div>
        <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>

        {pharmacy && (
          <>
            <h2 className="font-semibold text-gray-700 pt-4">Pharmacy Details</h2>
            <div><Label>Pharmacy Name</Label><Input value={pharmForm.name} onChange={e => setPharmForm({ ...pharmForm, name: e.target.value })} /></div>
            <div><Label>Address</Label><Input value={pharmForm.address} onChange={e => setPharmForm({ ...pharmForm, address: e.target.value })} /></div>
            <div><Label>License Number</Label><Input value={pharmForm.licenseNumber} disabled className="bg-gray-50" /></div>
          </>
        )}

        <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}
