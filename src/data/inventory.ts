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
  },
  {
    id: 'p8',
    sku: 'GYM-VTG-008',
    name: 'Retro Mesh Training Shorts',
    description: 'Heavyweight mesh training shorts from the 1980s. Boxy fit with classic athletic stripes and drawstring.',
    price: 3200.00,
    currency: 'PKR',
    category: 'Gymwear',
    images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=800'],
    stock: 12,
    order: 8,
    metadata: {
      seoTitle: 'Vintage Mesh Gym Shorts - KAAM25',
      seoDescription: 'Authentic 80s mesh training shorts for gym or street.',
      tags: ['gymwear', '80s', 'athletic']
    }
  },
  {
    id: 'p9',
    sku: 'CPX-CAR-009',
    name: 'Military Surplus 6-Pocket Cargos',
    description: 'Rugged ripstop cotton cargo pants with six tactical pockets. Adjustable hems and reinforced knees.',
    price: 7800.00,
    currency: 'PKR',
    category: 'Six-Pockets',
    images: ['https://images.unsplash.com/photo-1621072156002-e2fcced0b170?auto=format&fit=crop&q=80&w=800'],
    stock: 7,
    order: 9,
    metadata: {
      seoTitle: 'Military 6-Pocket Cargo Pants - KAAM25',
      seoDescription: 'Durable ripstop cotton cargos with six-pocket utility.',
      tags: ['six-pockets', 'cargo', 'military', 'utility']
    }
  },
  {
    id: 'p10',
    sku: 'OVR-HOD-010',
    name: 'Heavyweight Oversized Hoodie',
    description: 'Supreme comfort with this 500GSM heavyweight fleece hoodie. Extreme drop shoulders and cropped body for a modern silhouette.',
    price: 8900.00,
    currency: 'PKR',
    category: 'Oversized',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800'],
    stock: 15,
    order: 10,
    metadata: {
      seoTitle: 'Heavyweight Oversized Hoodie - KAAM25',
      seoDescription: 'Modern oversized fit heavyweight fleece hoodie.',
      tags: ['oversized', 'hoodie', 'streetwear', 'fleece']
    }
  },
  {
    id: 'p11',
    sku: 'TEE-BXY-011',
    name: 'Boxy Essential Tee',
    description: 'The perfect foundation piece. Heavily washed cotton with a boxy, slightly cropped fit and mock neck collar.',
    price: 2800.00,
    currency: 'PKR',
    category: 'T-Shirts',
    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800'],
    stock: 20,
    order: 11,
    metadata: {
      seoTitle: 'Boxy Essential T-Shirt - KAAM25',
      seoDescription: 'Premium cotton boxy fit t-shirt for daily rotation.',
      tags: ['tshirt', 'boxy', 'essential']
    }
  },
  {
    id: 'p12',
    sku: 'BOT-CAR-012',
    name: 'Tech Ripstop Bottoms',
    description: 'Lightweight tech-focused bottom with water-resistant finish and adjustable cinch hems. Multi-pocket utility.',
    price: 6200.00,
    currency: 'PKR',
    category: 'Bottoms',
    images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800'],
    stock: 10,
    order: 12,
    metadata: {
      seoTitle: 'Tech Ripstop Bottoms - KAAM25',
      seoDescription: 'Utility-focused tech ripstop trousers.',
      tags: ['bottoms', 'techwear', 'utility']
    }
  },
  {
    id: 'p13',
    sku: 'TEE-OVR-013',
    name: 'Vintage Wash Oversized Tee',
    description: 'Ultra-heavy 300GSM cotton tee with a natural sun-faded wash. Dropped shoulders and a relaxed neck for the ultimate oversized silhouette.',
    price: 3500.00,
    currency: 'PKR',
    category: 'Oversized',
    images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7dc7a?auto=format&fit=crop&q=80&w=800'],
    stock: 12,
    order: 13,
    metadata: {
      seoTitle: 'Vintage Wash Oversized Tee - KAAM25',
      seoDescription: 'Premium heavyweight oversized vintage wash t-shirt.',
      tags: ['oversized', 'tee', 'vintage-wash']
    }
  },
  {
    id: 'p14',
    sku: 'SKT-CAR-014',
    name: 'Urban Tactical Six-Pockets',
    description: 'Modern interpretation of classic cargo pants. Six functional pockets with reinforced stitching and weather-resistant fabric.',
    price: 8500.00,
    currency: 'PKR',
    category: 'Six-Pockets',
    images: ['https://images.unsplash.com/photo-1621072156002-e2fcced0b170?auto=format&fit=crop&q=80&w=800'],
    stock: 5,
    order: 14,
    metadata: {
      seoTitle: 'Urban Tactical Cargo Pants - KAAM25',
      seoDescription: 'Tactical six-pocket cargo pants for urban exploration.',
      tags: ['six-pockets', 'tactical', 'cargo']
    }
  },
  {
    id: 'p15',
    sku: 'GYM-SET-015',
    name: 'Reactive Training Set',
    description: 'High-performance gymwear set featuring moisture-wicking technology and 4-way stretch fabric for maximum mobility.',
    price: 5800.00,
    currency: 'PKR',
    category: 'Gymwear',
    images: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800'],
    stock: 8,
    order: 15,
    metadata: {
      seoTitle: 'Reactive Training Gym Set - KAAM25',
      seoDescription: 'Performance focused gymwear set for athletes.',
      tags: ['gymwear', 'training', 'performance']
    }
  }
];
