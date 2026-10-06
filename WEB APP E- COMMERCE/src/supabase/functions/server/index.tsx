import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', logger(console.log));
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// ===================
// PRODUCTS ENDPOINTS
// ===================

// Get all products
app.get('/make-server-48a815c5/products', async (c) => {
  try {
    const products = await kv.getByPrefix('product:');
    return c.json({ success: true, products });
  } catch (error) {
    console.log('Error fetching products:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get single product
app.get('/make-server-48a815c5/products/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const product = await kv.get(`product:${id}`);
    
    if (!product) {
      return c.json({ success: false, error: 'Product not found' }, 404);
    }
    
    return c.json({ success: true, product });
  } catch (error) {
    console.log('Error fetching product:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Initialize products (call once to seed data)
app.post('/make-server-48a815c5/products/init', async (c) => {
  try {
    const products = [
      {
        id: 1,
        name: 'CYBER HOODIE',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1760126130338-4e6c9043ee2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwZmFzaGlvbiUyMGhvb2RpZXxlbnwxfHx8fDE3NjM4MzYyODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
        description: 'Premium oversized hoodie with cyberpunk-inspired graphics. Made from high-quality cotton blend for ultimate comfort.',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        category: 'Tops',
        stock: 50
      },
      {
        id: 2,
        name: 'URBAN TEE',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1638260699633-dc52ea9dbe77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHRzaGlydCUyMHVyYmFufGVufDF8fHx8MTc2Mzg3ODAxOHww&ixlib=rb-4.1.0&q=80&w=1080',
        description: 'Classic black tee with minimalist street design. 100% organic cotton, breathable and durable.',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        category: 'Tops',
        stock: 100
      },
      {
        id: 3,
        name: 'NEON RUNNERS',
        price: 189.99,
        image: 'https://images.unsplash.com/photo-1760302318631-a8d342cd4951?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMGZhc2hpb24lMjBzdHJlZXR3ZWFyfGVufDF8fHx8MTc2Mzg3ODAxN3ww&ixlib=rb-4.1.0&q=80&w=1080',
        description: 'Limited edition sneakers with reflective neon accents. Designed for style and performance.',
        sizes: ['7', '8', '9', '10', '11', '12'],
        category: 'Footwear',
        stock: 30
      },
      {
        id: 4,
        name: 'DENIM JACKET',
        price: 159.99,
        image: 'https://images.unsplash.com/photo-1635815171008-5f1b358bb2f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGphY2tldCUyMHVyYmFufGVufDF8fHx8MTc2Mzg3ODAxN3ww&ixlib=rb-4.1.0&q=80&w=1080',
        description: 'Vintage-inspired denim jacket with modern streetwear touches. Perfect layering piece.',
        sizes: ['S', 'M', 'L', 'XL'],
        category: 'Jackets',
        stock: 40
      },
      {
        id: 5,
        name: 'CARGO PANTS',
        price: 99.99,
        image: 'https://images.unsplash.com/photo-1758267928031-a87e5a5c6c5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJnbyUyMHBhbnRzJTIwc3RyZWV0d2VhcnxlbnwxfHx8fDE3NjM3OTAxNjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
        description: 'Tactical cargo pants with multiple pockets and adjustable straps. Urban utility meets style.',
        sizes: ['28', '30', '32', '34', '36'],
        category: 'Bottoms',
        stock: 60
      },
      {
        id: 6,
        name: 'STREET CAP',
        price: 39.99,
        image: 'https://images.unsplash.com/photo-1527813972756-2890936000e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwY2FwJTIwaGF0fGVufDF8fHx8MTc2Mzc3NTEzMnww&ixlib=rb-4.1.0&q=80&w=1080',
        description: 'Embroidered snapback cap with adjustable strap. Complete your streetwear look.',
        sizes: ['ONE SIZE'],
        category: 'Accessories',
        stock: 80
      },
      {
        id: 7,
        name: 'BOMBER JACKET',
        price: 179.99,
        image: 'https://images.unsplash.com/photo-1760126070359-5b82710274fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib21iZXIlMjBqYWNrZXQlMjBzdHJlZXR3ZWFyfGVufDF8fHx8MTc2Mzg4MTY0NXww&ixlib=rb-4.1.0&q=80&w=1080',
        description: 'Classic bomber jacket with premium materials and modern fit. Essential outerwear for any season.',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        category: 'Jackets',
        stock: 35
      },
      {
        id: 8,
        name: 'URBAN TRACKSUIT',
        price: 149.99,
        image: 'https://images.unsplash.com/photo-1760736534395-f020b0500f3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFja3N1aXQlMjB1cmJhbiUyMGZhc2hpb258ZW58MXx8fHwxNzYzODgxNjQ1fDA&ixlib=rb-4.1.0&q=80&w=1080',
        description: 'Complete tracksuit set with matching top and bottom. Comfortable and stylish for everyday wear.',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        category: 'Sets',
        stock: 45
      },
      {
        id: 9,
        name: 'WINTER BEANIE',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1555359501-970608ae0b17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFuaWUlMjB3aW50ZXIlMjBoYXR8ZW58MXx8fHwxNzYzODgxNjQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        description: 'Cozy knit beanie with embroidered logo. Keep warm while looking fresh.',
        sizes: ['ONE SIZE'],
        category: 'Accessories',
        stock: 120
      },
      {
        id: 10,
        name: 'URBAN BACKPACK',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1610659592009-088d5c2c4776?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWNrcGFjayUyMHVyYmFuJTIwc3R5bGV8ZW58MXx8fHwxNzYzODgxNjQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        description: 'Durable backpack with multiple compartments. Perfect for daily commute or travel.',
        sizes: ['ONE SIZE'],
        category: 'Accessories',
        stock: 55
      },
      {
        id: 11,
        name: 'RETRO SUNGLASSES',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1663585703603-9be01a72a62a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5nbGFzc2VzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjM4MjMxMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        description: 'Classic retro sunglasses with UV protection. Complete your outfit with style.',
        sizes: ['ONE SIZE'],
        category: 'Accessories',
        stock: 70
      },
      {
        id: 12,
        name: 'SPORT WATCH',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1762513461072-5008c7f6511d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRjaCUyMGFjY2Vzc29yaWVzfGVufDF8fHx8MTc2Mzg1MTA2Mnww&ixlib=rb-4.1.0&q=80&w=1080',
        description: 'Premium sport watch with digital display. Combines functionality with urban style.',
        sizes: ['ONE SIZE'],
        category: 'Accessories',
        stock: 25
      }
    ];

    // Store each product in KV store
    for (const product of products) {
      if (!(await kv.get(`product:${product.id}`))) {
        await kv.set(`product:${product.id}`, product);
      }
    }

    return c.json({ success: true, message: 'Products initialized', count: products.length });
  } catch (error) {
    console.log('Error initializing products:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ===================
// CART ENDPOINTS
// ===================

// Get user's cart
app.get('/make-server-48a815c5/cart/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const cart = await kv.get(`cart:${userId}`) || { items: [] };
    return c.json({ success: true, cart });
  } catch (error) {
    console.log('Error fetching cart:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Add to cart
app.post('/make-server-48a815c5/cart/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const { productId, selectedSize, quantity } = await c.req.json();
    
    const cart = await kv.get(`cart:${userId}`) || { items: [] };
    const product = await kv.get(`product:${productId}`);
    
    if (!product) {
      return c.json({ success: false, error: 'Product not found' }, 404);
    }
    
    const existingItemIndex = cart.items.findIndex(
      (item: any) => item.id === productId && item.selectedSize === selectedSize
    );
    
    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        ...product,
        selectedSize,
        quantity
      });
    }
    
    await kv.set(`cart:${userId}`, cart);
    return c.json({ success: true, cart });
  } catch (error) {
    console.log('Error adding to cart:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update cart item quantity
app.put('/make-server-48a815c5/cart/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const { productId, selectedSize, quantity } = await c.req.json();
    
    const cart = await kv.get(`cart:${userId}`) || { items: [] };
    
    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (item: any) => !(item.id === productId && item.selectedSize === selectedSize)
      );
    } else {
      const itemIndex = cart.items.findIndex(
        (item: any) => item.id === productId && item.selectedSize === selectedSize
      );
      
      if (itemIndex >= 0) {
        cart.items[itemIndex].quantity = quantity;
      }
    }
    
    await kv.set(`cart:${userId}`, cart);
    return c.json({ success: true, cart });
  } catch (error) {
    console.log('Error updating cart:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Remove from cart
app.delete('/make-server-48a815c5/cart/:userId/:productId/:size', async (c) => {
  try {
    const userId = c.req.param('userId');
    const productId = parseInt(c.req.param('productId'));
    const size = c.req.param('size');
    
    const cart = await kv.get(`cart:${userId}`) || { items: [] };
    cart.items = cart.items.filter(
      (item: any) => !(item.id === productId && item.selectedSize === size)
    );
    
    await kv.set(`cart:${userId}`, cart);
    return c.json({ success: true, cart });
  } catch (error) {
    console.log('Error removing from cart:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Clear cart
app.delete('/make-server-48a815c5/cart/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    await kv.set(`cart:${userId}`, { items: [] });
    return c.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    console.log('Error clearing cart:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ===================
// ORDERS ENDPOINT
// ===================

app.post('/make-server-48a815c5/orders', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }
    
    const { items, total, shippingAddress } = await c.req.json();
    
    const order = {
      id: `order:${user.id}:${Date.now()}`,
      userId: user.id,
      items,
      total,
      shippingAddress,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    await kv.set(order.id, order);
    
    // Clear user's cart after order
    await kv.set(`cart:${user.id}`, { items: [] });
    
    return c.json({ success: true, order });
  } catch (error) {
    console.log('Error creating order:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get user orders
app.get('/make-server-48a815c5/orders', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ success: false, error: 'Unauthorized' }, 401);
    }
    
    const allOrders = await kv.getByPrefix(`order:${user.id}`);
    return c.json({ success: true, orders: allOrders });
  } catch (error) {
    console.log('Error fetching orders:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ===================
// AUTH ENDPOINTS
// ===================

app.post('/make-server-48a815c5/signup', async (c) => {
  try {
    const { email, password, username } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { username },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });
    
    if (error) {
      console.log('Signup error:', error);
      return c.json({ success: false, error: error.message }, 400);
    }
    
    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.log('Error during signup:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Contact form submission
app.post('/make-server-48a815c5/contact', async (c) => {
  try {
    const { name, email, subject, message } = await c.req.json();
    
    const contact = {
      id: `contact:${Date.now()}`,
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString()
    };
    
    await kv.set(contact.id, contact);
    
    return c.json({ success: true, message: 'Contact form submitted successfully' });
  } catch (error) {
    console.log('Error submitting contact form:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Health check
app.get('/make-server-48a815c5/health', (c) => {
  return c.json({ success: true, message: 'StreetWear API is running' });
});

Deno.serve(app.fetch);
