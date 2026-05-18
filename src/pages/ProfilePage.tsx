import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/productService';
import { Order } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Package, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Loader2, 
  Calendar, 
  CreditCard, 
  MapPin, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowLeft,
  X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { LoadingScreen } from '../components/LoadingScreen';

const ProfilePage: React.FC = () => {
  const { user, signOut, updateProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'settings'>('orders');

  // Cancellation Modal State
  const [cancellingOrder, setCancellingOrder] = useState<Order | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelFormData, setCancelFormData] = useState({
    name: user?.displayName || '',
    phone: '',
    email: user?.email || '',
    reason: ''
  });

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellingOrder) return;

    setIsCancelling(true);
    try {
      await orderService.cancelOrder(cancellingOrder.id, cancelFormData);
      await fetchOrders(); // Refresh list
      setCancellingOrder(null);
      setCancelFormData({
        name: user?.displayName || '',
        phone: '',
        email: user?.email || '',
        reason: ''
      });
    } catch (error) {
      console.error('Cancellation failed:', error);
    } finally {
      setIsCancelling(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    } else if (user) {
      fetchOrders();
      setDisplayName(user.displayName || '');
      setCancelFormData(prev => ({ ...prev, name: user.displayName || '', email: user.email || '' }));
    }
  }, [user, authLoading, navigate]);

  const fetchOrders = async () => {
    if (!user) return;
    setIsLoadingOrders(true);
    try {
      const data = await orderService.getOrders(user.uid);
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
      setIsLoadingOrders(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateProfile({ displayName });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (authLoading || (!user && authLoading)) {
    return <LoadingScreen message="Syncing Profile Data" />;
  }

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const completedOrders = orders.filter(o => o.status === 'completed');
  const cancelledOrders = orders.filter(o => o.status === 'cancelled');

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
           <div>
            <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Storefront
            </Link>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">
              Collector <br className="hidden md:block"/> Profile
            </h1>
            <div className="h-[2px] w-24 bg-orange-500" />
           </div>
           
           <div className="flex bg-white/5 p-1 border border-white/10 rounded-full">
             <button 
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === 'orders' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'
                }`}
             >
               Orders
             </button>
             <button 
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === 'settings' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'
                }`}
             >
               Settings
             </button>
           </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* User Sidebar */}
          <aside className="lg:col-span-1 space-y-8">
            <div className="bg-[#111111] border border-white/10 p-8 flex flex-col items-center text-center">
               <div className="relative group mb-6">
                 <div className="w-24 h-24 rounded-full border-2 border-orange-500/20 p-1 group-hover:border-orange-500 transition-colors">
                    <img 
                      src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} 
                      alt="Avatar" 
                      className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all"
                    />
                 </div>
               </div>
               
               <div className="space-y-1 mb-8">
                 <h2 className="text-xl font-black uppercase tracking-tight">{user?.displayName || 'Collector'}</h2>
                 <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{user?.email}</p>
               </div>

               <div className="w-full space-y-3">
                 <button 
                   onClick={() => {
                      signOut();
                      navigate('/');
                   }}
                   className="w-full py-3 px-4 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
                 >
                   <LogOut className="w-4 h-4" /> Finalize Session
                 </button>
               </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 p-4">
                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">Acquisitions</span>
                <span className="text-2xl font-black">{orders.length}</span>
              </div>
              <div className="bg-white/5 border border-white/10 p-4">
                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">Delivered</span>
                <span className="text-2xl font-black text-emerald-500">{completedOrders.length}</span>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'orders' ? (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-12"
                >
                  {/* Pending Orders Section */}
                  <section>
                    <div className="flex items-center gap-3 mb-8">
                      <Clock className="w-5 h-5 text-orange-500" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">Active Transmissions (Pending)</h3>
                    </div>
                    {pendingOrders.length === 0 ? (
                      <div className="p-8 border border-dashed border-white/5 text-[10px] font-bold text-neutral-700 uppercase tracking-widest">
                        Zero active transmissions detected.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {pendingOrders.map(order => (
                          <OrderCard 
                            key={order.id} 
                            order={order} 
                            onCancel={() => setCancellingOrder(order)}
                          />
                        ))}
                      </div>
                    )}
                  </section>

                  {/* Completed Orders Section */}
                  <section>
                    <div className="flex items-center gap-3 mb-8">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Archived Acquisitions (Success)</h3>
                    </div>
                    {completedOrders.length === 0 ? (
                      <div className="p-8 border border-dashed border-white/5 text-[10px] font-bold text-neutral-700 uppercase tracking-widest">
                        No completed acquisitions found.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {completedOrders.map(order => (
                          <OrderCard key={order.id} order={order} />
                        ))}
                      </div>
                    )}
                  </section>

                  {/* Cancelled/All Section */}
                  {cancelledOrders.length > 0 && (
                    <section>
                      <div className="flex items-center gap-3 mb-8">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500 italic">Terminated Protocols (Cancelled)</h3>
                      </div>
                      <div className="space-y-4">
                        {cancelledOrders.map(order => (
                          <OrderCard key={order.id} order={order} />
                        ))}
                      </div>
                    </section>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="max-w-xl"
                >
                  <section className="bg-[#111111] border border-white/10 p-8 md:p-12">
                    <div className="flex items-center justify-between mb-12">
                      <div>
                        <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Protocol Settings</h3>
                        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest font-mono">Modify your archival identity</p>
                      </div>
                      {!isEditing && (
                        <button 
                          onClick={() => setIsEditing(true)}
                          className="p-3 hover:bg-white/5 border border-white/10 rounded-full transition-colors"
                        >
                          <Edit3 className="w-4 h-4 text-orange-500" />
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <form onSubmit={handleUpdateProfile} className="space-y-8">
                        <div className="space-y-4">
                          <label className="block text-[10px] font-black uppercase text-neutral-500 tracking-widest">Display Identifier</label>
                          <input 
                            type="text" 
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 p-4 text-sm font-bold tracking-tight uppercase focus:outline-none focus:border-orange-500 transition-colors"
                            placeholder="NAME OR ALIAS"
                            required
                          />
                        </div>

                        <div className="flex gap-4">
                          <button 
                            type="submit"
                            disabled={isUpdating}
                            className="flex-1 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-neutral-200 transition-colors disabled:opacity-50"
                          >
                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Apply Protocols'}
                          </button>
                          <button 
                            type="button"
                            onClick={() => {
                              setIsEditing(false);
                              setDisplayName(user?.displayName || '');
                            }}
                            className="px-8 py-4 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-colors"
                          >
                            Abort
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-8">
                        <div className="flex justify-between items-center py-4 border-b border-white/5">
                           <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Public Label</span>
                           <span className="text-sm font-black uppercase">{user?.displayName || 'Not Set'}</span>
                        </div>
                        <div className="flex justify-between items-center py-4 border-b border-white/5">
                           <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">System Email</span>
                           <span className="text-sm font-bold text-white">{user?.email}</span>
                        </div>
                        <div className="flex justify-between items-center py-4 border-b border-white/5">
                           <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Joined Archive</span>
                           <span className="text-sm font-bold text-white">
                             {user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Initial Era'}
                           </span>
                        </div>
                      </div>
                    )}
                  </section>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Cancellation Modal */}
      <AnimatePresence>
        {cancellingOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCancellingOrder(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#111111] border border-white/10 p-8 md:p-12 shadow-2xl"
            >
              <button 
                onClick={() => setCancellingOrder(null)}
                className="absolute top-6 right-6 p-2 text-neutral-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-10">
                <span className="text-[10px] font-black uppercase text-red-500 tracking-[0.3em] block mb-4">Termination Request</span>
                <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-2">Cancel Acquisition</h3>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest font-mono">REFERENCE: #{cancellingOrder.id.substring(0, 8)}</p>
              </div>

              <form onSubmit={handleCancelSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-neutral-500 tracking-widest">Collector Name</label>
                    <input 
                      type="text" 
                      required
                      value={cancelFormData.name}
                      onChange={(e) => setCancelFormData({...cancelFormData, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold uppercase tracking-tight focus:border-red-500 outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-neutral-500 tracking-widest">Phone Protocol</label>
                    <input 
                      type="tel" 
                      required
                      value={cancelFormData.phone}
                      onChange={(e) => setCancelFormData({...cancelFormData, phone: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold uppercase tracking-tight focus:border-red-500 outline-none transition-colors"
                      placeholder="+92 XXX XXXXXXX"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-neutral-500 tracking-widest">System Email</label>
                  <input 
                    type="email" 
                    required
                    value={cancelFormData.email}
                    onChange={(e) => setCancelFormData({...cancelFormData, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold uppercase tracking-tight focus:border-red-500 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-neutral-500 tracking-widest">Reason for Neutralization</label>
                  <textarea 
                    required
                    rows={4}
                    value={cancelFormData.reason}
                    onChange={(e) => setCancelFormData({...cancelFormData, reason: e.target.value})}
                    placeholder="PROVIDE VALID JUSTIFICATION FOR CANCELLATION..."
                    className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold uppercase tracking-tight focus:border-red-500 outline-none transition-colors resize-none"
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="submit"
                    disabled={isCancelling}
                    className="flex-1 py-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Cancellation'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setCancellingOrder(null)}
                    className="px-8 py-4 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-colors"
                  >
                    Abort
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const OrderCard: React.FC<{ order: Order; onCancel?: () => void }> = ({ order, onCancel }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isPending = order.status === 'pending';

  const statusStyles = {
    pending: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    completed: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    cancelled: 'text-red-500 bg-red-500/10 border-red-500/20'
  };

  const statusIcon = {
    pending: <Clock className="w-3 h-3" />,
    completed: <CheckCircle2 className="w-3 h-3" />,
    cancelled: <AlertCircle className="w-3 h-3" />
  };

  return (
    <div className="bg-[#111111] border border-white/10 overflow-hidden hover:border-white/20 transition-all">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-6 cursor-pointer flex flex-wrap items-center justify-between gap-6"
      >
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6 text-neutral-600" />
          </div>
          <div>
            <div className="text-[9px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-1">REFERENCE: #{order.id.substring(0, 8)}</div>
            <div className="flex items-center gap-3">
               <span className="text-lg font-black uppercase tracking-tight leading-none">Rs. {order.total.toLocaleString()}</span>
               <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase flex items-center gap-1.5 border ${statusStyles[order.status]}`}>
                  {statusIcon[order.status]}
                  {order.status}
               </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-8">
          {isPending && onCancel && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onCancel();
              }}
              className="hidden sm:block px-4 py-2 border border-red-500/30 text-red-500 text-[8px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
            >
              Cancel Order
            </button>
          )}
          <div className="hidden sm:block text-right">
             <div className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest mb-1">ACQUISITION DATE</div>
             <div className="text-[10px] font-black uppercase">{order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Recent'}</div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="border-t border-white/5"
          >
            <div className="p-8 bg-black/40 grid grid-cols-1 md:grid-cols-2 gap-12">
               <div>
                 <div className="flex items-center justify-between mb-6">
                    <span className="text-[9px] font-black uppercase text-orange-500 tracking-[0.3em] block">Archive Package Details</span>
                    {isPending && onCancel && (
                      <button 
                        onClick={() => onCancel()}
                        className="sm:hidden px-4 py-2 border border-red-500/30 text-red-500 text-[8px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                      >
                        Cancel
                      </button>
                    )}
                 </div>
                 <div className="space-y-4">
                   {order.items.map((item, idx) => (
                     <div key={idx} className="flex gap-4 items-center group">
                        <div className="w-14 h-14 bg-[#111111] border border-white/10 shrink-0 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                          <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] font-black uppercase truncate group-hover:text-orange-500 transition-colors">{item.product.name}</div>
                          <div className="text-[9px] font-bold text-neutral-500 mt-1 uppercase">QTY: {item.quantity} / SIZE: {item.selectedSize || 'OS'}</div>
                        </div>
                     </div>
                   ))}
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <div className="flex items-center gap-2 text-[9px] font-bold text-neutral-500 uppercase tracking-widest">
                       <MapPin className="w-3 h-3" /> TRANSMISSION DATA
                     </div>
                     <div className="bg-white/5 p-4 space-y-2 border border-white/5">
                        <div className="text-[10px] font-black uppercase">{order.shippingInfo.fullName}</div>
                        <div className="text-[9px] text-neutral-500 uppercase leading-relaxed font-mono">
                          {order.shippingInfo.address}, <br/> {order.shippingInfo.city}, {order.shippingInfo.postalCode}
                        </div>
                        <div className="text-[9px] text-orange-500/50 font-bold">{order.shippingInfo.phone}</div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center gap-2 text-[9px] font-bold text-neutral-500 uppercase tracking-widest">
                       <CreditCard className="w-3 h-3" /> TRANSACTION PROTOCOL
                     </div>
                     <div className="bg-white/5 p-4 border border-white/5 space-y-2">
                        <div className="text-[10px] font-black uppercase tracking-tight">{order.paymentMethod}</div>
                        <div className="text-[9px] text-neutral-500 uppercase font-mono">Final Protocol Value</div>
                        <div className="text-lg font-black tracking-tighter">Rs. {order.total.toLocaleString()}</div>
                     </div>
                  </div>
               </div>
               
               {order.status === 'cancelled' && order.cancellationInfo && (
                 <div className="md:col-span-2 mt-4 p-6 bg-red-500/5 border border-red-500/10">
                   <span className="text-[9px] font-black uppercase text-red-500 tracking-[0.3em] block mb-4">Archival Cancellation Protocol Data</span>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Authorized By</div>
                        <div className="text-[10px] font-black uppercase">{order.cancellationInfo.name}</div>
                        <div className="text-[9px] text-neutral-600 uppercase font-mono">{order.cancellationInfo.email} | {order.cancellationInfo.phone}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Termination Justification</div>
                        <div className="text-[11px] font-medium text-neutral-400 italic">"{order.cancellationInfo.reason}"</div>
                      </div>
                   </div>
                 </div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;
