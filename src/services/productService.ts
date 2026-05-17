import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  query, 
  where,
  addDoc,
  deleteDoc,
  Timestamp,
  serverTimestamp,
  writeBatch,
  orderBy // Added for server-side sorting query support
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, Order, CartItem, ShippingInfo } from '../types';
import { INITIAL_INVENTORY } from '../data/inventory';

const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    try {
      // Create a native Firestore query that sorts by the order property
      const q = query(
        collection(db, PRODUCTS_COLLECTION), 
        orderBy('order', 'asc')
      );
      const snapshot = await getDocs(q);
      
      let products: Product[] = [];
      if (snapshot.empty) {
        await this.seedProducts();
        const updatedSnapshot = await getDocs(q);
        products = updatedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      } else {
        products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      }

      // Maintained your client-side sorting fallback structure for structural safety
      return products.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, PRODUCTS_COLLECTION);
      return [];
    }
  },

  async getProduct(id: string): Promise<Product | null> {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as Product;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `${PRODUCTS_COLLECTION}/${id}`);
      return null;
    }
  },

  async seedProducts() {
    const batch = writeBatch(db);
    INITIAL_INVENTORY.forEach(product => {
      const ref = doc(db, PRODUCTS_COLLECTION, product.id);
      batch.set(ref, product);
    });
    await batch.commit();
  },

  async addProduct(productData: Omit<Product, 'id'>): Promise<string> {
    try {
      const docRef = doc(collection(db, PRODUCTS_COLLECTION));
      const productWithId = { ...productData, id: docRef.id };
      await setDoc(docRef, productWithId);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, PRODUCTS_COLLECTION);
      throw error;
    }
  },

  async updateProduct(id: string, productData: Partial<Product>): Promise<void> {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      await setDoc(docRef, productData, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${PRODUCTS_COLLECTION}/${id}`);
      throw error;
    }
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${PRODUCTS_COLLECTION}/${id}`);
      throw error;
    }
  }
};

export const orderService = {
  async createOrder(userId: string, items: CartItem[], total: number, shippingInfo: ShippingInfo, paymentMethod: string): Promise<string> {
    try {
      const orderData = {
        userId,
        items,
        total,
        status: 'pending',
        paymentMethod,
        shippingInfo,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, ORDERS_COLLECTION), orderData);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, ORDERS_COLLECTION);
      return '';
    }
  },

  async getOrders(userId: string): Promise<Order[]> {
    try {
      const q = query(collection(db, ORDERS_COLLECTION), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, ORDERS_COLLECTION);
      return [];
    }
  },

  async getAllOrders(): Promise<Order[]> {
    try {
      const q = collection(db, ORDERS_COLLECTION);
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, ORDERS_COLLECTION);
      return [];
    }
  },

  async updateOrderStatus(orderId: string, status: 'pending' | 'completed' | 'cancelled'): Promise<void> {
    try {
      const docRef = doc(db, ORDERS_COLLECTION, orderId);
      await setDoc(docRef, { status, updatedAt: serverTimestamp() }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${ORDERS_COLLECTION}/${orderId}`);
      throw error;
    }
  }
};