import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Package, Trash2, ArrowLeft, Loader2, CheckCircle2, Image as ImageIcon, ShieldAlert } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminPage = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Moved to the top level to adhere strictly to the Rules of Hooks
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    sku: '',
    name: '',
    description: '',
    price: 0,
    currency: 'PKR',
    category: 'T-Shirts',
    images: [''],
    stock: 1,
    order: 0,
    metadata: {
      seoTitle: '',
      seoDescription: '',
      tags: []
    }
  });

  const categories = ['T-Shirts', 'Outerwear', 'Knitwear', 'Bottoms'];

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
    } else if (isAdmin) {
      fetchProducts();
    }
  }, [user, loading, isAdmin, navigate]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || (!isAdmin && !loading)) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-8 gap-4">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500">Verifying Security Protocols...</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'price' || name === 'stock' || name === 'order') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const resetForm = () => {
    setFormData({
      sku: '',
      name: '',
      description: '',
      price: 0,
      currency: 'PKR',
      category: 'T-Shirts',
      images: [''],
      stock: 1,
      order: 0,
      metadata: { seoTitle: '', seoDescription: '', tags: [] }
    });
    setEditingProduct(null);
    setIsAdding(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      sku: product.sku || '',
      name: product.name,
      description: product.description,
      price: product.price,
      currency: product.currency,
      category: product.category,
      images: product.images,
      stock: product.stock,
      order: product.order || 0,
      metadata: product.metadata
    });
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this item from the archive?')) return;
    
    try {
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Delete failed');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= products.length) return;

    const items = [...products];
    const currentItem = { ...items[index] };
    const neighborItem = { ...items[newIndex] };

    // Swap order values
    const tempOrder = currentItem.order || 0;
    currentItem.order = neighborItem.order || 0;
    neighborItem.order = tempOrder;

    // Local update for immediate feedback
    items[index] = neighborItem;
    items[newIndex] = currentItem;
    setProducts(items);

    try {
      // Update both in database
      await Promise.all([
        productService.updateProduct(currentItem.id, { order: currentItem.order }),
        productService.updateProduct(neighborItem.id, { order: neighborItem.order })
      ]);
      fetchProducts(); // Refresh to ensure sync
    } catch (error) {
      console.error('Reorder failed:', error);
      fetchProducts(); // Rollback local state
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        sku: formData.sku || `VTG-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        order: editingProduct ? formData.order : (products.length > 0 ? Math.max(...products.map(p => p.order || 0)) + 1 : 1),
        metadata: {
          ...formData.metadata,
          seoTitle: formData.name,
          seoDescription: formData.description.substring(0, 160)
        }
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, payload);
      } else {
        await productService.addProduct(payload);
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        resetForm();
        fetchProducts();
      }, 1500);
    } catch (error) {
      console.error(error);
      alert('Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-32 pb-20 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Return to Catalog
            </Link>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase">
              {editingProduct ? 'Update Item' : 'Inventory'}
            </h1>
            <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mt-2 underline underline-offset-8 decoration-white/10">Manage heritage archives and stock levels</p>
          </div>
          
          <button 
            onClick={() => {
              if (isAdding) {
                resetForm();
              } else {
                setIsAdding(true);
              }
            }}
            className="bg-white text-black px-8 py-4 font-black uppercase text-xs tracking-[0.3em] hover:bg-orange-500 hover:text-white transition-all flex items-center gap-3"
          >
            {isAdding ? <ArrowLeft className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isAdding ? 'Cancel' : 'Add New Item'}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {isAdding ? (
            <motion.div
              key="add-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-[#111111] border border-white/10 p-12"
            >
              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Garment Name</label>
                      <input 
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="E.G. 90S OVERSIZED FLANNEL"
                        className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Description / Provenance</label>
                      <textarea 
                        required
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="DETAIL THE CONDITION, ERA, AND FIT..."
                        className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-orange-500 transition-colors resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Category</label>
                        <select 
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-orange-500 transition-colors appearance-none"
                        >
                          {categories.map(cat => <option key={cat} value={cat} className="bg-black">{cat}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Price (PKR)</label>
                        <input 
                          required
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-orange-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Image Assets</label>
                        <button type="button" onClick={addImageField} className="text-[9px] font-black uppercase text-orange-500 hover:text-white transition-colors">Add URL +</button>
                      </div>
                      <div className="space-y-4">
                        {formData.images.map((url, idx) => (
                          <div key={idx} className="relative">
                            <input 
                              required
                              value={url}
                              onChange={(e) => handleImageChange(idx, e.target.value)}
                              placeholder="IMAGE URL (UNSPLASH/DIRECT)"
                              className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-orange-500 transition-colors pl-12"
                            />
                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                          </div>
                        ))}
                      </div>
                    </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Inventory Status (Qty)</label>
                        <input 
                          required
                          type="number"
                          name="stock"
                          value={formData.stock}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-orange-500 transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Display Order (Arrangement)</label>
                        <input 
                          required
                          type="number"
                          name="order"
                          value={formData.order}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-orange-500 transition-colors"
                        />
                        <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest leading-relaxed">Determines sequence in catalog. Use lower numbers for priority items.</p>
                      </div>
                    </div>
                  </div>

                <div className="pt-12 border-t border-white/10 flex items-center justify-end">
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="bg-white text-black px-12 py-5 font-black uppercase text-xs tracking-[0.4em] hover:bg-orange-500 hover:text-white transition-all disabled:opacity-20 flex items-center gap-4"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : showSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : 'Commit to Archive'}
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {isLoading ? (
                <div className="col-span-full py-32 flex flex-col items-center justify-center gap-6">
                  <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500">Syncing database...</span>
                </div>
              ) : (
                products.map((product, index) => (
                  <div key={product.id} className="bg-[#111111] border border-white/10 flex overflow-hidden group">
                    <div className="w-24 h-full bg-black flex-shrink-0 border-r border-white/5 grayscale group-hover:grayscale-0 transition-all duration-500 relative">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover opacity-60" />
                      
                      {/* Reorder Controls Overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-between py-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                        <button 
                          disabled={index === 0}
                          onClick={() => handleMove(index, 'up')}
                          className="p-1 hover:text-orange-500 disabled:opacity-0 transition-colors"
                          title="Move Forward"
                        >
                          <svg className="w-4 h-4 fill-current rotate-180" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                        </button>
                        <span className="text-[8px] font-black">{product.order || 0}</span>
                        <button 
                          disabled={index === products.length - 1}
                          onClick={() => handleMove(index, 'down')}
                          className="p-1 hover:text-orange-500 disabled:opacity-0 transition-colors"
                          title="Move Backward"
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                        </button>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col justify-between flex-grow">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                           <span className="text-[8px] font-mono text-neutral-500 uppercase">{product.sku}</span>
                           <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${product.stock > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                             {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                           </span>
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-tight mb-4 group-hover:text-orange-500 transition-colors line-clamp-1">{product.name}</h3>
                        <p className="text-[10px] font-black">Rs. {product.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/5">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">{product.category}</span>
                        <div className="ml-auto flex items-center gap-2">
                           <button 
                             onClick={() => handleEdit(product)}
                             className="text-[9px] font-black uppercase text-neutral-400 hover:text-white transition-colors"
                           >
                             Edit
                           </button>
                           <button 
                             onClick={() => handleDelete(product.id)}
                             className="p-2 hover:bg-white/5 text-neutral-500 hover:text-red-500 transition-colors"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};