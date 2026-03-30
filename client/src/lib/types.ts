export interface User {
  id: string;
  role: 'customer' | 'pharmacist';
  email?: string;
  username?: string; // keeping just to not break existing strict frontend code before we refactor all
  password?: string;
  fullName?: string;
  name?: string;

  // optional fields
  phone?: string;
  address?: string;
  pharmacyName?: string;
  pharmacyId?: string;
  licenseNumber?: string;
  dob?: string;
  gender?: string;
}

export interface Product {
  id: string;
  _id?: string;
  name: string;
  description?: string;
  category?: 'otc' | 'prescription' | 'wellness';
  price: number;
  quantity?: number;
  prescriptionRequired?: boolean;
  pharmacyId?: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  ownerId: string;
  licenseNumber: string;
}

export interface CartItem {
  productId: string;
  pharmacyId: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  pharmacyId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'accepted' | 'rejected' | 'ready' | 'delivered';
  type: 'regular' | 'prescription';
  prescriptionImage?: string;
  deliveryMethod: 'delivery' | 'pickup';
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}
