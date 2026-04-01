import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  orderId?: string;
  onSuccess: (paymentId: string) => void;
  onFailure: () => void;
}

const _API = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://health-hub-express.onrender.com/api' : 'http://localhost:5000/api');
const API_URL = _API.includes('/api') ? _API.replace(/\/$/, '') : `${_API.replace(/\/$/, '')}/api`;

export default function PaymentDialog({ 
  isOpen, 
  onClose, 
  amount, 
  orderId,
  onSuccess,
  onFailure 
}: PaymentDialogProps) {
  const { token } = useAuth();

  useEffect(() => {
    // Load Razorpay script dynamically
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    try {
      // Step 1: Create Razorpay order on backend
      const response = await fetch(`${API_URL}/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          amount: amount,
          orderId: orderId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment order');
      }

      const data = await response.json();

      // Step 2: Configure Razorpay options
      const options = {
        key: data.keyId,
        amount: data.amount * 100, // Amount in paise
        currency: data.currency,
        name: 'Health Hub Express',
        description: 'Medicine Order Payment',
        order_id: data.orderId,
        handler: async (response: any) => {
          // Step 3: Verify payment on backend
          try {
            const verifyResponse = await fetch(`${API_URL}/payment/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderId
              })
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            const verifyData = await verifyResponse.json();
            toast.success('Payment successful!');
            onSuccess(verifyData.paymentId);
            onClose();
          } catch (err: any) {
            toast.error(err.message || 'Payment verification failed');
            onFailure();
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#0d9488' // Teal color
        },
        modal: {
          ondismiss: function() {
            toast.info('Payment cancelled');
            onFailure();
          }
        }
      };

      // Step 4: Open Razorpay checkout
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || 'Failed to initiate payment');
      onFailure();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Payment Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6 space-y-4">
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Total Amount</p>
            <p className="text-3xl font-bold text-teal-700">₹{amount.toFixed(2)}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-600">Payment Methods:</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="border rounded p-2 text-center text-xs bg-gray-50">UPI</div>
              <div className="border rounded p-2 text-center text-xs bg-gray-50">Cards</div>
              <div className="border rounded p-2 text-center text-xs bg-gray-50">Net Banking</div>
              <div className="border rounded p-2 text-center text-xs bg-gray-50">Wallets</div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePayment}
              className="flex-1 bg-teal-600 hover:bg-teal-700"
            >
              Pay Now
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-2">
            Secured by Razorpay
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
