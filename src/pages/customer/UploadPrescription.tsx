import { useState } from 'react';
import { getPharmacies, addOrder, genId } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, Image as ImageIcon } from 'lucide-react';

export default function UploadPrescription() {
  const { user } = useAuth();
  const pharmacies = getPharmacies();
  const [selectedPharmacy, setSelectedPharmacy] = useState(pharmacies[0]?.id || '');
  const [prescriptionImage, setPrescriptionImage] = useState<string>('');
  const [note, setNote] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPrescriptionImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!prescriptionImage) { toast.error('Please upload a prescription image'); return; }
    if (!user) return;

    const now = new Date().toISOString();
    addOrder({
      id: genId(),
      customerId: user.id,
      pharmacyId: selectedPharmacy,
      items: [],
      total: 0,
      status: 'pending',
      type: 'prescription',
      prescriptionImage,
      deliveryMethod: 'delivery',
      createdAt: now,
      updatedAt: now,
    });

    toast.success('Prescription submitted! The pharmacy will review it.');
    setPrescriptionImage('');
    setNote('');
  };

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Upload Prescription</h1>

      <div className="space-y-4">
        <div>
          <Label>Select Pharmacy</Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
            value={selectedPharmacy}
            onChange={e => setSelectedPharmacy(e.target.value)}
          >
            {pharmacies.map(ph => (
              <option key={ph.id} value={ph.id}>{ph.name}</option>
            ))}
          </select>
        </div>

        <div>
          <Label>Prescription Image</Label>
          <div className="mt-1 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-teal-400 transition-colors">
            {prescriptionImage ? (
              <div className="space-y-2">
                <img src={prescriptionImage} alt="Prescription" className="max-h-48 mx-auto rounded" />
                <Button variant="outline" size="sm" onClick={() => setPrescriptionImage('')}>Remove</Button>
              </div>
            ) : (
              <label className="cursor-pointer space-y-2 block">
                <Upload className="h-10 w-10 text-gray-300 mx-auto" />
                <p className="text-sm text-gray-500">Click to upload prescription</p>
                <p className="text-xs text-gray-400">JPG, PNG up to 5MB</p>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            )}
          </div>
        </div>

        <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={handleSubmit}>
          <ImageIcon className="h-4 w-4 mr-2" /> Submit Prescription
        </Button>
      </div>
    </div>
  );
}
