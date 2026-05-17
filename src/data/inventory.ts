import { Product } from '../types';

export const INITIAL_INVENTORY: Product[] = [
  {
    id: 'p1',
    sku: 'VTG-90S-001',
    name: '90s Graphic Street Tee',
    description: 'Authentic 1990s oversized fit graphic t-shirt. Single stitch construction with vintage fade.',
    price: 4500.00,
    currency: 'PKR',
    category: 'T-Shirts',
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800'],
    stock: 5,
    order: 1,
    metadata: {
      seoTitle: 'Vintage 90s Graphic Tee - KAAM25',
      seoDescription: 'Authentic vintage 90s streetwear t-shirt.',
      tags: ['vintage', '90s', 'streetwear']
    }
  },
  {
    id: 'p2',
    sku: 'DNM-VTG-002',
    name: 'Classic Rigid Denim Jacket',
    description: 'Heavyweight rigid denim jacket from the early 80s. Boxy fit with natural whiskering and patina.',
    price: 8500.00,
    currency: 'PKR',
    category: 'Outerwear',
    images: ['https://images.unsplash.com/photo-1527010159945-c42509220548?auto=format&fit=crop&q=80&w=800'],
    stock: 2,
    order: 2,
    metadata: {
      seoTitle: 'Vintage Denim Jacket - KAAM25',
      seoDescription: '80s era rigid denim jacket for vintage enthusiasts.',
      tags: ['denim', 'vintage', 'outerwear']
    }
  },
  {
    id: 'p3',
    sku: 'CAR-HRS-003',
    name: 'Faded Chore Work Coat',
    description: 'Classic canvas chore coat with deep indigo fading. Perfect layering piece for all seasons.',
    price: 12500.00,
    currency: 'PKR',
    category: 'Outerwear',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800'],
    stock: 3,
    order: 3,
    metadata: {
      seoTitle: 'Vintage Chore Coat - KAAM25',
      seoDescription: 'Durable faded canvas chore coat for a rugged look.',
      tags: ['workwear', 'chore-coat', 'vintage']
    }
  },
  {
    id: 'p4',
    sku: 'KNW-WOL-004',
    name: 'Hand-Knit Wool Sweater',
    description: 'Extremely soft hand-knitted oversized wool sweater. Thick cable knit pattern with heritage details.',
    price: 7500.00,
    currency: 'PKR',
    category: 'Knitwear',
    images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800'],
    stock: 8,
    order: 4,
    metadata: {
      seoTitle: 'Hand-Knit Vintage Sweater - KAAM25',
      seoDescription: 'Warm cable knit wool sweater for a cozy vintage vibe.',
      tags: ['knitwear', 'warm', 'vintage']
    }
  },
  {
    id: 'p5',
    sku: 'CRP-LVS-005',
    name: 'Vintage 501 Cropped Denim',
    description: 'Perfectly worn-in 501s with a high-waisted fit and custom cropped hem. Natural sun-bleached wash.',
    price: 9500.00,
    currency: 'PKR',
    category: 'Bottoms',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800'],
    stock: 4,
    order: 5,
    metadata: {
      seoTitle: 'Vintage 501 Cropped Denim - KAAM25',
      seoDescription: 'Hand-picked vintage 501 jeans with a custom crop.',
      tags: ['denim', 'levi', 'vintage']
    }
  },
  {
    id: 'p6',
    sku: 'MIL-FLX-006',
    name: '80s Fatigue Field Pant',
    description: 'Authentic military surplus fatigue pants. Durable sateen cotton with adjustable waist tabs.',
    price: 6500.00,
    currency: 'PKR',
    category: 'Bottoms',
    images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800'],
    stock: 6,
    order: 6,
    metadata: {
      seoTitle: 'Vintage Military Fatigue Pants - KAAM25',
      seoDescription: 'Authentic 80s military surplus field trousers.',
      tags: ['military', 'surplus', 'vintage']
    }
  },
  {
    id: 'p7',
    sku: 'SKT-90S-007',
    name: 'Velour Track Jacket',
    description: 'Ultra-soft 90s velour zip-up jacket in deep burgundy. Contrast piping and embroidered crest.',
    price: 5500.00,
    currency: 'PKR',
    category: 'Outerwear',
    images: ['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=800'],
    stock: 3,
    order: 7,
    metadata: {
      seoTitle: 'Vintage Velour Track Jacket - KAAM25',
      seoDescription: 'Classic 90s velour sportswear jacket.',
      tags: ['sportswear', '90s', 'velour']
    }
  }
];
