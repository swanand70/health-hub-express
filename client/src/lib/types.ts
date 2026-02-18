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
