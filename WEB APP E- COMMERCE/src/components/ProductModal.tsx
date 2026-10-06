import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Check } from 'lucide-react';
import { Product } from '../App';
import { AddToCartAnimation } from './AddToCartAnimation';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, size: string) => void;
}

export function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [added, setAdded] = useState(false);
  const [showFlyingAnimation, setShowFlyingAnimation] = useState(false);

  const handleAddToCart = () => {
    // Trigger flying animation
    setShowFlyingAnimation(true);
    
    // Add to cart after a short delay
    setTimeout(() => {
      onAddToCart(product, selectedSize);
      setAdded(true);
      
      // Close modal and reset
      setTimeout(() => {
        setAdded(false);
        onClose();
      }, 500);
    }, 100);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-4xl text-white mb-4">{product.name}</h2>
                <p className="text-white/70 mb-6 leading-relaxed">
                  {product.description}
                </p>

                {/* Size Selector */}
                <div className="mb-8">
                  <label className="block text-white/90 mb-3 text-sm uppercase tracking-wider">
                    Select Size
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-3 rounded-xl border-2 transition-all ${
                          selectedSize === size
                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 border-transparent text-white'
                            : 'bg-white/5 border-white/20 text-white hover:border-purple-500/50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="text-5xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-transparent bg-clip-text mb-8">
                  ${product.price}
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`w-full py-4 rounded-2xl text-white text-lg transition-all flex items-center justify-center gap-3 ${
                  added
                    ? 'bg-green-500'
                    : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-lg hover:shadow-purple-500/50'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-6 h-6" />
                    ADDED TO CART
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-6 h-6" />
                    ADD TO CART
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Flying Animation */}
        {showFlyingAnimation && (
          <AddToCartAnimation
            productImage={product.image}
            triggerAnimation={showFlyingAnimation}
            onComplete={() => setShowFlyingAnimation(false)}
          />
        )}
      </div>
    </AnimatePresence>
  );
}