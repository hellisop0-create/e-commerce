import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  query, 
  where,
  addDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
  updateDoc,
  increment,
  getDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Review, Product } from '../types';

const REVIEWS_COLLECTION = 'reviews';
const PRODUCTS_COLLECTION = 'products';

export const reviewService = {
  async addReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), {
        ...reviewData,
        createdAt: serverTimestamp()
      });

      // Update product rating and count
      const productRef = doc(db, PRODUCTS_COLLECTION, reviewData.productId);
      const productSnap = await getDoc(productRef);
      
      if (productSnap.exists()) {
        const product = productSnap.data() as Product;
        const currentCount = product.numReviews || 0;
        const currentRating = product.rating || 0;
        
        const newCount = currentCount + 1;
        const newRating = ((currentRating * currentCount) + reviewData.rating) / newCount;
        
        await updateDoc(productRef, {
          rating: newRating,
          numReviews: newCount
        });
      }

      return docRef.id;
    } catch (error) {
      console.error('Error adding review: ', error);
      throw error;
    }
  },

  async getProductReviews(productId: string): Promise<Review[]> {
    try {
      const q = query(
        collection(db, REVIEWS_COLLECTION), 
        where('productId', '==', productId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
    } catch (error) {
      console.error('Error getting reviews: ', error);
      return [];
    }
  },

  async deleteReview(reviewId: string, productId: string, rating: number): Promise<void> {
    try {
      const docRef = doc(db, REVIEWS_COLLECTION, reviewId);
      await deleteDoc(docRef);

      // Optionally update product rating here too, but it's more complex on delete
      // Just decrement count for now
      const productRef = doc(db, PRODUCTS_COLLECTION, productId);
      const productSnap = await getDoc(productRef);
      if (productSnap.exists()) {
        const product = productSnap.data() as Product;
        const currentCount = product.numReviews || 1;
        const currentRating = product.rating || 0;

        if (currentCount > 1) {
          const newCount = currentCount - 1;
          const newRating = ((currentRating * currentCount) - rating) / newCount;
          await updateDoc(productRef, {
            rating: Math.max(0, newRating),
            numReviews: newCount
          });
        } else {
          await updateDoc(productRef, {
            rating: 0,
            numReviews: 0
          });
        }
      }
    } catch (error) {
      console.error('Error deleting review: ', error);
      throw error;
    }
  }
};
