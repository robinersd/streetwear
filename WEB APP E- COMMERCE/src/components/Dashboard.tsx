import { motion } from 'motion/react';
import { Package, ShoppingBag, User, TrendingUp } from 'lucide-react';
import { ProductListing } from './ProductListing';
import { Product } from '../App';

interface DashboardProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  user: any;
}

export function Dashboard({ products, onProductClick, onAddToCart, user }: DashboardProps) {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl sm:text-5xl text-white mb-4">
            Welcome back, <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
              {user?.user_metadata?.username || user?.email?.split('@')[0] || 'User'}
            </span>!
          </h1>
          <p className="text-white/70 text-lg">Explore our latest streetwear collection</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Package className="w-8 h-8 text-purple-400" />
              <span className="text-white/50 text-sm">Total</span>
            </div>
            <div className="text-3xl bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text mb-2">
              {products.length}
            </div>
            <div className="text-white/60 text-sm">Available Products</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-cyan-400" />
              <span className="text-white/50 text-sm">New</span>
            </div>
            <div className="text-3xl bg-gradient-to-r from-purple-500 to-cyan-500 text-transparent bg-clip-text mb-2">
              12
            </div>
            <div className="text-white/60 text-sm">New Arrivals</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <ShoppingBag className="w-8 h-8 text-pink-400" />
              <span className="text-white/50 text-sm">Categories</span>
            </div>
            <div className="text-3xl bg-gradient-to-r from-cyan-500 to-pink-500 text-transparent bg-clip-text mb-2">
              6
            </div>
            <div className="text-white/60 text-sm">Product Categories</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <User className="w-8 h-8 text-purple-400" />
              <span className="text-white/50 text-sm">Account</span>
            </div>
            <div className="text-3xl bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text mb-2">
              Active
            </div>
            <div className="text-white/60 text-sm">Member Status</div>
          </motion.div>
        </div>

        {/* Product Listing */}
        <ProductListing 
          products={products}
          onProductClick={onProductClick}
          onAddToCart={onAddToCart}
        />
      </div>
    </div>
  );
}
