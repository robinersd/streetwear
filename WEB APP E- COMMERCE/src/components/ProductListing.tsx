import { motion } from 'motion/react';
import { ShoppingBag } from 'lucide-react';
import { Product } from '../App';

interface ProductListingProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function ProductListing({ products, onProductClick, onAddToCart }: ProductListingProps) {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl sm:text-5xl text-white mb-4">LATEST DROPS</h2>
          <p className="text-white/70 text-lg">Limited edition streetwear collection - {products.length} products</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-purple-500/50 transition-all duration-300"
            >
              <div 
                className="aspect-square overflow-hidden cursor-pointer"
                onClick={() => onProductClick(product)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              <div className="p-6">
                <div className="mb-2">
                  <span className="text-xs text-purple-400 uppercase tracking-wider">{product.category}</span>
                </div>
                <h3 
                  className="text-white text-xl mb-2 cursor-pointer hover:text-purple-400 transition-colors"
                  onClick={() => onProductClick(product)}
                >
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
                      ${product.price}
                    </span>
                    <div className="text-xs text-white/50 mt-1">Stock: {product.stock}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    ADD
                  </button>
                </div>
              </div>

              {/* Hover Effect Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
