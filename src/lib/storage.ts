import { User, Pharmacy, Product, Order, CartItem } from './types';

const KEYS = {
  users: 'pharma_users',
  pharmacies: 'pharma_pharmacies',
  products: 'pharma_products',
  orders: 'pharma_orders',
  session: 'pharma_session',
  cart: 'pharma_cart',
  seeded: 'pharma_seeded',
};

function get<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function set<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Users
export const getUsers = () => get<User>(KEYS.users);
export const saveUsers = (users: User[]) => set(KEYS.users, users);
export const addUser = (user: User) => { const u = getUsers(); u.push(user); saveUsers(u); };
export const updateUser = (user: User) => {
  const users = getUsers().map(u => u.id === user.id ? user : u);
  saveUsers(users);
};
export const findUser = (username: string, password: string, role: string) =>
  getUsers().find(u => u.username === username && u.password === password && u.role === role);
export const getUserById = (id: string) => getUsers().find(u => u.id === id);

// Pharmacies
export const getPharmacies = () => get<Pharmacy>(KEYS.pharmacies);
export const savePharmacies = (p: Pharmacy[]) => set(KEYS.pharmacies, p);
export const addPharmacy = (p: Pharmacy) => { const all = getPharmacies(); all.push(p); savePharmacies(all); };
export const getPharmacyById = (id: string) => getPharmacies().find(p => p.id === id);
export const updatePharmacy = (p: Pharmacy) => {
  const all = getPharmacies().map(x => x.id === p.id ? p : x);
  savePharmacies(all);
};

// Products
export const getProducts = () => get<Product>(KEYS.products);
export const saveProducts = (p: Product[]) => set(KEYS.products, p);
export const getProductsByPharmacy = (pharmacyId: string) => getProducts().filter(p => p.pharmacyId === pharmacyId);
export const addProduct = (p: Product) => { const all = getProducts(); all.push(p); saveProducts(all); };
export const updateProduct = (p: Product) => {
  const all = getProducts().map(x => x.id === p.id ? p : x);
  saveProducts(all);
};
export const deleteProduct = (id: string) => {
  saveProducts(getProducts().filter(p => p.id !== id));
};

// Orders
export const getOrders = () => get<Order>(KEYS.orders);
export const saveOrders = (o: Order[]) => set(KEYS.orders, o);
export const addOrder = (o: Order) => { const all = getOrders(); all.push(o); saveOrders(all); };
export const getOrdersByCustomer = (customerId: string) => getOrders().filter(o => o.customerId === customerId);
export const getOrdersByPharmacy = (pharmacyId: string) => getOrders().filter(o => o.pharmacyId === pharmacyId);
export const updateOrder = (o: Order) => {
  const all = getOrders().map(x => x.id === o.id ? o : x);
  saveOrders(all);
};

// Cart
export const getCart = (): CartItem[] => {
  try { return JSON.parse(localStorage.getItem(KEYS.cart) || '[]'); } catch { return []; }
};
export const saveCart = (cart: CartItem[]) => localStorage.setItem(KEYS.cart, JSON.stringify(cart));
export const clearCart = () => localStorage.removeItem(KEYS.cart);

// Session
export const getSession = (): User | null => {
  try { const s = localStorage.getItem(KEYS.session); return s ? JSON.parse(s) : null; } catch { return null; }
};
export const setSession = (user: User) => localStorage.setItem(KEYS.session, JSON.stringify(user));
export const clearSession = () => localStorage.removeItem(KEYS.session);

// Generate ID
export const genId = () => Math.random().toString(36).substring(2, 10) + Date.now().toString(36);

// Seed data
export function seedData() {
  if (localStorage.getItem(KEYS.seeded)) return;

  const owner1Id = 'owner1';
  const owner2Id = 'owner2';
  const cust1Id = 'cust1';
  const pharm1Id = 'pharm1';
  const pharm2Id = 'pharm2';

  const users: User[] = [
    { id: owner1Id, role: 'owner', username: 'medplus', password: 'pass123', fullName: 'Rajesh Kumar', phone: '9876543210', address: 'MG Road, Bangalore', pharmacyId: pharm1Id, licenseNumber: 'KA-PH-2024-001' },
    { id: owner2Id, role: 'owner', username: 'apollo', password: 'pass123', fullName: 'Priya Sharma', phone: '9876543211', address: 'Koramangala, Bangalore', pharmacyId: pharm2Id, licenseNumber: 'KA-PH-2024-002' },
    { id: cust1Id, role: 'customer', username: 'john', password: 'pass123', fullName: 'John Doe', phone: '9876543212', address: '123 Main St, Bangalore', dob: '1995-06-15', gender: 'male' },
  ];

  const pharmacies: Pharmacy[] = [
    { id: pharm1Id, name: 'MedPlus Pharmacy', address: '42 MG Road, Bangalore 560001', phone: '9876543210', ownerId: owner1Id, licenseNumber: 'KA-PH-2024-001' },
    { id: pharm2Id, name: 'Apollo Pharmacy', address: '15 Koramangala, Bangalore 560034', phone: '9876543211', ownerId: owner2Id, licenseNumber: 'KA-PH-2024-002' },
  ];

  const products: Product[] = [
    { id: 'p1', pharmacyId: pharm1Id, name: 'Crocin 500mg', description: 'Paracetamol tablets for fever and pain relief', category: 'otc', price: 30, quantity: 200, prescriptionRequired: false },
    { id: 'p2', pharmacyId: pharm1Id, name: 'Vicks VapoRub', description: 'Topical ointment for cold relief', category: 'otc', price: 95, quantity: 150, prescriptionRequired: false },
    { id: 'p3', pharmacyId: pharm1Id, name: 'Dolo-650', description: 'Paracetamol 650mg for fever', category: 'otc', price: 35, quantity: 300, prescriptionRequired: false },
    { id: 'p4', pharmacyId: pharm1Id, name: 'Amoxicillin 500mg', description: 'Antibiotic capsules – prescription required', category: 'prescription', price: 120, quantity: 80, prescriptionRequired: true },
    { id: 'p5', pharmacyId: pharm1Id, name: 'Neutrogena Sunscreen SPF50', description: 'Ultra sheer dry-touch sunscreen', category: 'wellness', price: 450, quantity: 60, prescriptionRequired: false },
    { id: 'p6', pharmacyId: pharm2Id, name: 'Cetirizine 10mg', description: 'Antihistamine for allergy relief', category: 'otc', price: 25, quantity: 250, prescriptionRequired: false },
    { id: 'p7', pharmacyId: pharm2Id, name: 'Azithromycin 250mg', description: 'Antibiotic – prescription required', category: 'prescription', price: 180, quantity: 40, prescriptionRequired: true },
    { id: 'p8', pharmacyId: pharm2Id, name: 'ORS Powder', description: 'Oral rehydration salts', category: 'otc', price: 20, quantity: 500, prescriptionRequired: false },
    { id: 'p9', pharmacyId: pharm2Id, name: 'Himalaya Liv.52', description: 'Herbal liver care supplement', category: 'wellness', price: 160, quantity: 90, prescriptionRequired: false },
    { id: 'p10', pharmacyId: pharm2Id, name: 'Volini Spray', description: 'Pain relief spray for muscles', category: 'otc', price: 220, quantity: 70, prescriptionRequired: false },
  ];

  const now = new Date().toISOString();
  const orders: Order[] = [
    {
      id: 'ord1', customerId: cust1Id, pharmacyId: pharm1Id,
      items: [{ productId: 'p1', productName: 'Crocin 500mg', quantity: 2, price: 30 }, { productId: 'p2', productName: 'Vicks VapoRub', quantity: 1, price: 95 }],
      total: 155, status: 'delivered', type: 'regular', deliveryMethod: 'delivery', createdAt: now, updatedAt: now,
    },
    {
      id: 'ord2', customerId: cust1Id, pharmacyId: pharm2Id,
      items: [{ productId: 'p6', productName: 'Cetirizine 10mg', quantity: 3, price: 25 }],
      total: 75, status: 'pending', type: 'regular', deliveryMethod: 'pickup', createdAt: now, updatedAt: now,
    },
  ];

  saveUsers(users);
  savePharmacies(pharmacies);
  saveProducts(products);
  saveOrders(orders);
  localStorage.setItem(KEYS.seeded, 'true');
}
