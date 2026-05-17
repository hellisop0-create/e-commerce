export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  images: string[];
  stock: number;
  order?: number;
  rating?: number;
  numReviews?: number;
  metadata: {
    seoTitle: string;
    seoDescription: string;
    tags: string[];
  };
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: any;
}

export interface ShippingInfo {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod: 'Easypaisa' | 'JazzCash' | 'COD' | 'Wallet'; // Added payment types
  shippingInfo: ShippingInfo;
  createdAt: any;
  updatedAt: any;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
}
