import React, { useState, useEffect } from 'react';
import { orderService } from '../services/productService';
import { Order } from '../types';
import { motion } from 'motion/react';
import { Loader2, Package, Calendar, User, CreditCard, ChevronRight, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OrdersPage: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
    } else if (isAdmin) {
      fetchOrders();
    }
  }, [user, loading, isAdmin, navigate]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await orderService.getAllOrders();
      // Sort by date descending
      const sorted = data.sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      });
      setOrders(sorted);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: 'pending' | 'completed' | 'cancelled') => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Status update failed');
    }
  };

  if (loading || (!isAdmin && !loading)) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-8 gap-4">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500">Accessing Secure Archive...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Return to Store
          </Link>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase">Order Archive</h1>
          <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mt-2 underline underline-offset-8 decoration-white/10">Full history of archive acquisitions</p>
        </header>

        {isLoading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-6">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500">Syncing sales data...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-32 text-center border border-dashed border-white/10">
            <Package className="w-12 h-12 text-neutral-700 mx-auto mb-6" />
            <p className="text-sm font-bold uppercase tracking-widest text-neutral-500">No orders logged in the system yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#111111] border border-white/10 overflow-hidden hover:border-white/20 transition-all group"
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-col lg:flex-row justify-between gap-8">
                    {/* Order Meta */}
                    <div className="flex-1 space-y-6">
                      <div className="flex items-center justify-between lg:justify-start lg:gap-12 pb-6 border-b border-white/5">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Order Reference</span>
                          <div className="text-sm font-black uppercase tracking-tight font-mono">#{order.id.substring(0, 8)}</div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Date</span>
                          <div className="flex items-center gap-2 text-xs font-bold text-white/80">
                            <Calendar className="w-3 h-3 text-orange-500" />
                            {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Recent'}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Status</span>
                          <div className="flex items-center gap-3">
                            <div className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full inline-block ${
                              order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                              order.status === 'pending' ? 'bg-orange-500/10 text-orange-500' :
                              'bg-red-500/10 text-red-500'
                            }`}>
                              {order.status}
                            </div>
                            <select 
                              value={order.status}
                              onChange={(e) => handleUpdateStatus(order.id, e.target.value as any)}
                              className="bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-widest p-1 focus:outline-none focus:border-orange-500 transition-colors"
                            >
                              <option value="pending" className="bg-black text-orange-500">PENDING</option>
                              <option value="completed" className="bg-black text-emerald-500">COMPLETED</option>
                              <option value="cancelled" className="bg-black text-red-500">CANCELLED</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8 pt-2">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                            <User className="w-3 h-3" /> Customer Intelligence
                          </div>
                          <div className="bg-white/5 p-4 space-y-2">
                            <div className="text-xs font-bold uppercase">{order.shippingInfo.fullName}</div>
                            <div className="text-[10px] text-neutral-500 break-all">{order.shippingInfo.address}, {order.shippingInfo.city}</div>
                            <div className="text-[10px] text-neutral-500">{order.shippingInfo.phone}</div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                            <CreditCard className="w-3 h-3" /> Transaction Data
                          </div>
                          <div className="bg-white/5 p-4 flex justify-between items-center">
                            <div className="space-y-1">
                               <div className="text-[9px] font-bold text-neutral-500 uppercase">{order.paymentMethod}</div>
                               <div className="text-xl font-black tracking-tighter">Rs. {order.total.toLocaleString()}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="lg:w-80 space-y-4">
                      <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4">Acquired Items ({order.items.length})</div>
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex gap-4 items-center bg-white/5 p-3 group/item">
                            <div className="w-12 h-12 bg-black shrink-0 border border-white/5 grayscale group-hover/item:grayscale-0 transition-all">
                              <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                               <div className="text-[10px] font-black uppercase truncate group-hover/item:text-orange-500 transition-colors">{item.product.name}</div>
                               <div className="text-[9px] font-bold text-neutral-500 mt-1 uppercase">QTY: {item.quantity} / Rs. {item.product.price.toLocaleString()}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
