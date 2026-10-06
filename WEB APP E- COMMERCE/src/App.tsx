import { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { ProductListing } from './components/ProductListing';
import { Dashboard } from './components/Dashboard';
import { ProductModal } from './components/ProductModal';
import { Cart } from './components/Cart';
import { Auth } from './components/Auth';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { AddToCartAnimation } from './components/AddToCartAnimation';
import { ShoppingCart, User, X, Menu, Info, Mail, LogOut, Home as HomeIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import bgImage from './assets/homepageBackground.png';
import { createClient } from './utils/supabase/client';
import { apiUrl, publicAnonKey, isSupabaseConfigured } from './utils/supabase/info';
import { DEFAULT_PRODUCTS } from './utils/defaultProducts';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  sizes: string[];
  category: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

type ViewType = 'home' | 'products' | 'cart' | 'auth' | 'about' | 'contact';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const supabase = createClient();
  const API_URL = apiUrl;

  // Check authentication status on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        loadUserCart(session.user.id);
      }
    };
    checkAuth();
    initializeProducts();
  }, []);

  const initializeProducts = async () => {
    if (!isSupabaseConfigured) {
      setProducts(DEFAULT_PRODUCTS);
      setLoading(false);
      return;
    }

    try {
      await fetch(`${API_URL}/products/init`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      const response = await fetch(`${API_URL}/products`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      const data = await response.json();
      
      if (data.success && Array.isArray(data.products) && data.products.length > 0) {
        setProducts(data.products);
      } else {
        setProducts(DEFAULT_PRODUCTS);
      }
    } catch (error) {
      console.warn('Backend server unavailable, loading default streetwear products:', error);
      setProducts(DEFAULT_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  const loadUserCart = async (userId: string) => {
    if (isSupabaseConfigured) {
      try {
        const response = await fetch(`${API_URL}/cart/${userId}`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        });
        const data = await response.json();
        
        if (data.success && data.cart?.items) {
          setCart(data.cart.items);
          return;
        }
      } catch (error) {
        console.warn('Could not fetch remote cart, falling back to local cart:', error);
      }
    }

    try {
      const local = localStorage.getItem(`streetwear_cart_${userId}`);
      if (local) {
        const parsed = JSON.parse(local);
        setCart(parsed.items || []);
        return;
      }
    } catch {
      // ignore
    }
    setCart([]);
  };

  const saveLocalCart = (userId: string, updatedItems: CartItem[]) => {
    try {
      localStorage.setItem(`streetwear_cart_${userId}`, JSON.stringify({ items: updatedItems }));
    } catch (e) {
      console.warn('Failed to save cart to localStorage:', e);
    }
    setCart(updatedItems);
  };

  const addToCart = async (product: Product, size: string) => {
    const userId = user?.id || 'guest';

    const getNewItems = (currentList: CartItem[]) => {
      const existingItemIndex = currentList.findIndex(
        (item) => item.id === product.id && item.selectedSize === size
      );
      if (existingItemIndex >= 0) {
        const updated = [...currentList];
        updated[existingItemIndex] = {
          ...updated[existingItemIndex],
          quantity: updated[existingItemIndex].quantity + 1
        };
        return updated;
      }
      return [...currentList, { ...product, selectedSize: size, quantity: 1 }];
    };

    if (isSupabaseConfigured) {
      try {
        const response = await fetch(`${API_URL}/cart/${userId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            productId: product.id,
            selectedSize: size,
            quantity: 1
          })
        });
        
        const data = await response.json();
        if (data.success && data.cart?.items) {
          saveLocalCart(userId, data.cart.items);
          return;
        }
      } catch (error) {
        console.warn('Error adding to remote cart, saving locally:', error);
      }
    }

    const nextItems = getNewItems(cart);
    saveLocalCart(userId, nextItems);
  };

  const updateQuantity = async (id: number, size: string, newQuantity: number) => {
    const userId = user?.id || 'guest';

    const getNewItems = (currentList: CartItem[]) => {
      if (newQuantity <= 0) {
        return currentList.filter(
          (item) => !(item.id === id && item.selectedSize === size)
        );
      }
      return currentList.map((item) =>
        item.id === id && item.selectedSize === size
          ? { ...item, quantity: newQuantity }
          : item
      );
    };

    if (isSupabaseConfigured) {
      try {
        const response = await fetch(`${API_URL}/cart/${userId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            productId: id,
            selectedSize: size,
            quantity: newQuantity
          })
        });
        
        const data = await response.json();
        if (data.success && data.cart?.items) {
          saveLocalCart(userId, data.cart.items);
          return;
        }
      } catch (error) {
        console.warn('Error updating remote cart, saving locally:', error);
      }
    }

    const nextItems = getNewItems(cart);
    saveLocalCart(userId, nextItems);
  };

  const removeFromCart = async (id: number, size: string) => {
    const userId = user?.id || 'guest';

    const nextItems = cart.filter(
      (item) => !(item.id === id && item.selectedSize === size)
    );

    if (isSupabaseConfigured) {
      try {
        const response = await fetch(`${API_URL}/cart/${userId}/${id}/${encodeURIComponent(size)}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        });
        
        const data = await response.json();
        if (data.success && data.cart?.items) {
          saveLocalCart(userId, data.cart.items);
          return;
        }
      } catch (error) {
        console.warn('Error removing from remote cart, saving locally:', error);
      }
    }

    saveLocalCart(userId, nextItems);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCart([]);
    setCurrentView('home');
  };

  const handleCheckout = async () => {
    if (!user) {
      setCurrentView('auth');
      setAuthMode('login');
      return;
    }

    if (isSupabaseConfigured) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const response = await fetch(`${API_URL}/orders`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token || publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            items: cart,
            total: cartTotal * 1.1,
            shippingAddress: 'User address placeholder'
          })
        });

        const data = await response.json();
        if (data.success) {
          alert('Order placed successfully! Order ID: ' + data.order.id);
          setCart([]);
          localStorage.removeItem(`streetwear_cart_${user.id}`);
          setCurrentView('home');
          return;
        }
      } catch (error) {
        console.warn('Error during remote checkout, completing locally:', error);
      }
    }

    const orderId = 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const ordersKey = `streetwear_orders_${user.id}`;
    try {
      const pastOrders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
      pastOrders.push({
        id: orderId,
        items: cart,
        total: (cartTotal * 1.1).toFixed(2),
        createdAt: new Date().toISOString()
      });
      localStorage.setItem(ordersKey, JSON.stringify(pastOrders));
    } catch (e) {
      console.warn('Could not save order locally:', e);
    }
    localStorage.removeItem(`streetwear_cart_${user.id}`);
    setCart([]);
    alert(`Order placed successfully! Order ID: ${orderId}`);
    setCurrentView('home');
  };

  const cartItemCount = cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Background Image - NO BLUR */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => setCurrentView('home')}
            className="text-2xl sm:text-3xl tracking-wider text-white hover:text-purple-400 transition-colors"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            STREETWEAR
          </button>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setCurrentView('home')}
              className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all"
              title="Home"
            >
              <HomeIcon className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setCurrentView('about')}
              className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all"
              title="About"
            >
              <Info className="w-5 h-5" />
            </button>

            <button
              onClick={() => setCurrentView('contact')}
              className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all"
              title="Contact us"
            >
              <Mail className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setCurrentView('cart')}
              data-cart-button
              className="relative p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              <AnimatePresence>
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-xs"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-white text-sm">
                  {user.user_metadata?.username || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-full text-white hover:bg-red-500/30 transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setCurrentView('auth');
                  setAuthMode('login');
                }}
                className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all"
              >
                <User className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setCurrentView('home');
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-3 bg-white/10 rounded-xl text-white text-left hover:bg-white/20 transition-all"
              >
                HOME
              </button>
              <button
                onClick={() => {
                  setCurrentView('about');
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-3 bg-white/10 rounded-xl text-white text-left hover:bg-white/20 transition-all"
              >
                ABOUT
              </button>
              <button
                onClick={() => {
                  setCurrentView('contact');
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-3 bg-white/10 rounded-xl text-white text-left hover:bg-white/20 transition-all"
              >
                CONTACT US
              </button>
              <button
                onClick={() => {
                  setCurrentView('cart');
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-3 bg-white/10 rounded-xl text-white text-left hover:bg-white/20 transition-all flex items-center justify-between"
              >
                CART
                {cartItemCount > 0 && (
                  <span className="px-2 py-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-xs">
                    {cartItemCount}
                  </span>
                )}
              </button>
              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 bg-red-500/20 rounded-xl text-white text-left hover:bg-red-500/30 transition-all"
                >
                  LOGOUT
                </button>
              ) : (
                <button
                  onClick={() => {
                    setCurrentView('auth');
                    setAuthMode('login');
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 bg-white/10 rounded-xl text-white text-left hover:bg-white/20 transition-all"
                >
                  LOGIN
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        {loading ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-white text-2xl">Loading...</div>
          </div>
        ) : (
          <>
            {currentView === 'home' && !user && (
              <Hero onShopNow={() => {
                setCurrentView('auth');
                setAuthMode('signup');
              }} />
            )}
            
            {currentView === 'home' && user && (
              <Dashboard 
                products={products}
                onProductClick={setSelectedProduct}
                onAddToCart={(product) => addToCart(product, product.sizes[0])}
                user={user}
              />
            )}
            
            {currentView === 'products' && (
              user ? (
                <Dashboard 
                  products={products}
                  onProductClick={setSelectedProduct}
                  onAddToCart={(product) => addToCart(product, product.sizes[0])}
                  user={user}
                />
              ) : (
                <ProductListing 
                  products={products}
                  onProductClick={setSelectedProduct}
                  onAddToCart={(product) => addToCart(product, product.sizes[0])}
                />
              )
            )}
            
            {currentView === 'cart' && (
              <Cart
                cart={cart}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeFromCart}
                total={cartTotal}
                onCheckout={handleCheckout}
              />
            )}
            
            {currentView === 'auth' && (
              <Auth
                mode={authMode}
                onToggleMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                onSuccess={(userData) => {
                  setUser(userData);
                  loadUserCart(userData.id);
                  setCurrentView('home');
                }}
              />
            )}

            {currentView === 'about' && <About />}
            
            {currentView === 'contact' && <Contact />}
          </>
        )}
      </main>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}
    </div>
  );
}
