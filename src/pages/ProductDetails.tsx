import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, Review } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { reviewService } from '../services/reviewService';
import { PRODUCT_SIZES } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Plus, ShoppingBag, Info, Star, ChevronRight, X, Loader2, MessageSquare } from 'lucide-react';
import { LoadingScreen } from '../components/LoadingScreen';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isInspecting, setIsInspecting] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsInspecting(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        }
        
        // Fetch real reviews
        const productReviews = await reviewService.getProductReviews(id);
        setReviews(productReviews);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
        setLoadingReviews(false);
      }
    };
    fetchProductAndReviews();
  }, [id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!product || !id) return;

    setIsSubmitting(true);
    try {
      const reviewData = {
        productId: id,
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || 'User',
        rating: reviewRating,
        comment: reviewComment
      };
      
      const newReviewId = await reviewService.addReview(reviewData);
      
      // Update local state
      const newReview: Review = {
        id: newReviewId,
        ...reviewData,
        createdAt: { toDate: () => new Date() } // Mocking timestamp for immediate UI update
      };
      
      setReviews([newReview, ...reviews]);
      setShowReviewForm(false);
      setReviewComment('');
      setReviewRating(5);
      
      // Update local product rating info
      if (product) {
        const currentCount = product.numReviews || 0;
        const currentRating = product.rating || 0;
        const newCount = currentCount + 1;
        const newRating = ((currentRating * currentCount) + reviewRating) / newCount;
        setProduct({ ...product, rating: newRating, numReviews: newCount });
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingScreen message="Retrieving Archival Data" />;

  if (!product) return <div className="bg-black min-h-screen text-white p-20 uppercase font-black">Item Not Found</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-black text-white p-4 md:p-12 font-sans overflow-x-hidden"
    >
      <AnimatePresence>
        {isInspecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsInspecting(false)}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full h-full flex items-center justify-center"
            >
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="max-w-full max-h-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Header */}
      <div className="flex justify-between items-center mb-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest hover:text-neutral-400 transition"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Grid
        </button>
        {/* Placeholder for alignment */}
        <div className="hidden md:block w-32" /> 
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
        
        {/* Left: Responsive Image Display */}
        <div className="lg:col-span-7">
          <div className="sticky top-24 space-y-4">
            <motion.div 
              layoutId={`product-image-${product.id}`}
              onClick={() => setIsInspecting(true)}
              className="border border-white/10 aspect-[4/5] md:aspect-square grayscale hover:grayscale-0 transition-all duration-700 bg-[#111111] overflow-hidden cursor-zoom-in group relative"
            >
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2 md:gap-4">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(idx)}
                    className={`border transition-all duration-300 aspect-square overflow-hidden ${
                      activeImage === idx ? 'border-orange-500 scale-[0.98]' : 'border-white/10 grayscale hover:grayscale-0 hover:border-white/30'
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Info & Actions */}
        <div className="lg:col-span-5 flex flex-col justify-center py-4 md:py-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-baseline gap-4 mb-4">
               <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase leading-[0.8] tracking-tighter">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center gap-1 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${i < Math.round(product.rating || 4.5) ? 'fill-orange-500 text-orange-500' : 'text-neutral-700'}`} 
                />
              ))}
              <span className="text-[10px] font-mono uppercase text-neutral-500 ml-2 tracking-widest">
                {(product.rating || 0) === 0 ? 'No Ratings' : (product.rating || 0).toFixed(1)} // {product.numReviews || 0} Member Evaluations
              </span>
            </div>

            <div className="flex justify-between items-center border-y border-white/10 py-8 mb-8">
              <span className="font-mono text-[10px] uppercase text-neutral-500">Price Points</span>
              <span className="text-4xl font-black tracking-tighter">Rs. {product.price.toLocaleString()}</span>
            </div>

            <div className="mb-12">
              <span className="block font-mono text-[10px] uppercase text-neutral-500 mb-6 underline underline-offset-8 decoration-white/10">Archival Fit Options</span>
              <div className="flex flex-wrap gap-4">
                {PRODUCT_SIZES.map((size) => {
                  const isAvailable = product.sizes?.includes(size);
                  return (
                    <button
                      key={size}
                      disabled={!isAvailable}
                      onClick={() => isAvailable && setSelectedSize(size)}
                      className={`relative px-8 py-4 text-base font-black uppercase tracking-[0.2em] border transition-all ${
                        selectedSize === size
                          ? 'bg-white text-black border-white'
                          : isAvailable 
                            ? 'bg-transparent text-white border-white hover:border-white/60'
                            : 'bg-transparent text-white border-white cursor-not-allowed'
                      }`}
                    >
                      <span className="relative">
                        {size}
                        {!isAvailable && (
                          <div className="absolute left-[-4px] right-[-4px] top-1/2 h-[1.5px] bg-red-600 -translate-y-1/2" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="text-[12px] md:text-[14px] text-neutral-400 leading-relaxed mb-12 max-w-md">
              {product.description}
            </p>

            <div className="space-y-4">
              <button 
                onClick={() => {
                  if (product.sizes && product.sizes.length > 0 && !selectedSize) {
                    alert('Please select a size');
                    return;
                  }
                  addToCart(product, 1, selectedSize || undefined);
                }}
                className="w-full bg-white text-black py-5 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-3 border border-white"
              >
                <Plus className="w-4 h-4" /> Add to Order
              </button>
              <button 
                onClick={() => {
                  if (product.sizes && product.sizes.length > 0 && !selectedSize) {
                    alert('Please select a size');
                    return;
                  }
                  addToCart(product, 1, selectedSize || undefined);
                  navigate('/checkout');
                }}
                className="w-full bg-orange-500 text-white py-5 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 border border-orange-500"
              >
                <ShoppingBag className="w-4 h-4" /> Buy Now
              </button>
            </div>
            
            {/* Meta Data Section */}
            <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-2 gap-8">
               <div>
                 <span className="block font-mono text-[9px] text-neutral-600 uppercase mb-2">Category</span>
                 <span className="text-[10px] uppercase font-bold tracking-widest">{product.category || 'Standard'}</span>
               </div>
               <div>
                 <span className="block font-mono text-[9px] text-neutral-600 uppercase mb-2">Availability</span>
                 <span className="text-[10px] uppercase font-bold tracking-widest">In Stock</span>
               </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto mt-24 pt-24 border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <h3 className="text-4xl font-black uppercase leading-none tracking-tighter mb-8">Member<br />Feedback</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-5xl font-black leading-none">{(product.rating || 0).toFixed(1)}</div>
                <div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < Math.round(product.rating || 0) ? 'fill-orange-500 text-orange-500' : 'text-neutral-800'}`} />
                    ))}
                  </div>
                  <div className="text-[9px] font-mono uppercase text-neutral-500 tracking-widest mt-1">Based on {product.numReviews || 0} evaluations</div>
                </div>
              </div>
              
              <div className="space-y-2 pt-8">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviews.filter(r => Math.round(r.rating) === star).length;
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-4">
                      <span className="text-[10px] font-mono text-neutral-500 w-2">{star}</span>
                      <div className="flex-1 h-px bg-neutral-800 relative">
                        <div className="absolute left-0 top-0 h-full bg-orange-500" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button 
              onClick={() => {
                if (!user) {
                  navigate('/login');
                } else {
                  setShowReviewForm(true);
                }
              }}
              className="mt-12 w-full py-4 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            >
              Write a Review
            </button>
          </div>

          <div className="lg:col-span-8">
            <AnimatePresence>
              {showReviewForm && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-16 border border-white/10 p-8 bg-[#0a0a0a] overflow-hidden"
                >
                  <div className="flex justify-between items-center mb-8">
                    <h4 className="text-[11px] font-black uppercase tracking-widest">Share Your Experience</h4>
                    <button onClick={() => setShowReviewForm(false)} className="text-neutral-500 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <form onSubmit={handleSubmitReview} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">Rating Intensity</label>
                       <div className="flex gap-2">
                         {[1, 2, 3, 4, 5].map((s) => (
                           <button 
                             key={s} 
                             type="button"
                             onClick={() => setReviewRating(s)}
                             className="p-1"
                           >
                             <Star className={`w-5 h-5 ${s <= reviewRating ? 'fill-orange-500 text-orange-500' : 'text-neutral-800'}`} />
                           </button>
                         ))}
                       </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">Commentary</label>
                      <textarea 
                        required
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Detail your findings..."
                        className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-white transition-colors min-h-[120px] resize-none"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-white text-black py-4 text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Commit Review'}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-12">
              {loadingReviews ? (
                <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-600 uppercase">
                  <Loader2 className="w-3 h-3 animate-spin" /> Synchronizing Feedback...
                </div>
              ) : reviews.length === 0 ? (
                <div className="py-20 border border-white/5 flex flex-col items-center justify-center text-center">
                  <MessageSquare className="w-8 h-8 text-neutral-800 mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-600">No archival observations recorded yet.</p>
                </div>
              ) : (
                reviews.map((review, idx) => (
                  <div key={review.id || idx} className="pb-12 border-b border-white/5 last:border-0 hover:translate-x-2 transition-transform duration-500 group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-2.5 h-2.5 ${i < review.rating ? 'fill-orange-500 text-orange-500' : 'text-neutral-800'}`} />
                          ))}
                        </div>
                        <h4 className="text-[11px] font-black uppercase tracking-widest">{review.userName}</h4>
                      </div>
                      <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest">
                        {review.createdAt?.toDate ? new Date(review.createdAt.toDate()).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                      </span>
                    </div>
                    <p className="text-[13px] text-neutral-400 leading-relaxed max-w-2xl">
                      {review.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};