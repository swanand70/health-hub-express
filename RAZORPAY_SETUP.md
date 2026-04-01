# 🚀 Razorpay Payment Gateway Setup Guide

## Step 1: Create Razorpay Account

1. Visit https://dashboard.razorpay.com/
2. Sign up for a test account (free)
3. Complete the registration process

## Step 2: Get API Keys

1. Go to **Settings** → **API Keys**
2. Click on **Generate Test Key**
3. You will receive:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret** (keep this secure!)

## Step 3: Update Environment Variables

Open `server/.env` and replace the placeholder values:

```env
RAZORPAY_KEY_ID=rzp_test_your_actual_key_id_here
RAZORPAY_KEY_SECRET=your_actual_secret_key_here
```

## Step 4: Restart Server

Stop the backend server (Ctrl+C) and restart it:

```bash
cd server
node server.js
```

## Step 5: Test Payment Flow

1. Open your application at http://localhost:8080
2. Login as a customer
3. Add medicines to cart
4. Go to Cart page
5. Enter delivery address
6. Click **"Pay & Place Order"**
7. Razorpay payment modal will open
8. Choose any payment method:
   - UPI
   - Credit/Debit Cards
   - Net Banking
   - Wallets

## 🧪 Test Card Details (for testing)

- **Card Number**: 4111 1111 1111 1111
- **CVV**: Any 3 digits
- **Expiry**: Any future date
- **OTP**: Will be shown in test mode

## 📱 Payment Features

✅ **Multiple Payment Methods**: UPI, Cards, Net Banking, Wallets  
✅ **Secure Transactions**: SHA-256 signature verification  
✅ **Real-time Updates**: Instant payment confirmation  
✅ **Order Tracking**: Payment ID stored with orders  
✅ **Automatic Verification**: Backend payment validation  

## 🔒 Security Notes

- Never expose `RAZORPAY_KEY_SECRET` in frontend code
- Always verify payment signatures on backend
- Use HTTPS in production
- Store payment IDs for transaction tracking

## 💡 Important Notes

1. **Test Mode**: Currently using test keys - no real money transactions
2. **Production**: Replace with live keys before going live
3. **Webhooks**: Consider setting up Razorpay webhooks for automatic updates
4. **Refunds**: Implement refund logic if needed

## 🎨 Customization

The payment dialog is themed with your brand color (Teal #0d9488).  
To customize, edit `client/src/components/PaymentDialog.tsx`:

```javascript
theme: {
  color: '#0d9488' // Change to your brand color
}
```

## 📊 Payment Flow

1. User clicks "Pay & Place Order"
2. Orders created in database (payment: Pending)
3. Razorpay checkout opens
4. User completes payment
5. Backend verifies payment signature
6. Orders updated to "Paid" status
7. Cart cleared
8. Success notification shown

## ⚠️ Troubleshooting

**Payment not working?**
- Check if Razorpay script loads (check browser console)
- Verify API keys are correct in `.env`
- Ensure server is running on port 5000

**Signature verification failed?**
- Make sure `RAZORPAY_KEY_SECRET` matches your Key ID
- Restart server after updating `.env`

**Orders stuck in Pending?**
- Check browser console for errors
- Verify backend logs for payment verification

---

**Need Help?** Contact support or check Razorpay documentation:
https://razorpay.com/docs/payments/
