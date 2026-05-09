import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  query, 
  where,
  addDoc,
  Timestamp,
  serverTimestamp,
  writeBatch
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
      const q = collection(db, PRODUCTS_COLLECTION);
      const snapshot = await getDocs(q);
      
      // If we have items in code that aren't in DB, seed them
      if (snapshot.size < INITIAL_INVENTORY.length) {
        await this.seedProducts();
        // Fetch again to get everything
        const updatedSnapshot = await getDocs(q);
        return updatedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      }
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
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

  async addProduct(product: Omit<Product, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), product);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, PRODUCTS_COLLECTION);
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
  }
};
