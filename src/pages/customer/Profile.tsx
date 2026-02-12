import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CustomerProfile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ ...user! });

  const handleSave = () => {
    updateProfile(form);
    toast.success('Profile updated');
  };

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Profile Settings</h1>
      <div className="bg-white rounded-xl border p-6 space-y-4">
        <div><Label>Full Name</Label><Input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} /></div>
        <div><Label>Username</Label><Input value={form.username} disabled className="bg-gray-50" /></div>
        <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
        <div><Label>Address</Label><Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
        <div><Label>Date of Birth</Label><Input type="date" value={form.dob || ''} onChange={e => setForm({ ...form, dob: e.target.value })} /></div>
        <div>
          <Label>Gender</Label>
          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.gender || ''} onChange={e => setForm({ ...form, gender: e.target.value })}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}
