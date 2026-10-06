import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

interface AddToCartAnimationProps {
  productImage: string;
  triggerAnimation: boolean;
  onComplete: () => void;
}

export function AddToCartAnimation({ productImage, triggerAnimation, onComplete }: AddToCartAnimationProps) {
  const [cartIconPosition, setCartIconPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Get cart icon position
    const cartButton = document.querySelector('[data-cart-button]');
    if (cartButton) {
      const rect = cartButton.getBoundingClientRect();
      setCartIconPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      });
    }
  }, []);

  if (!triggerAnimation) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed z-[9999] pointer-events-none"
        initial={{ 
          opacity: 1, 
          scale: 1,
          x: window.innerWidth / 2 - 50,
          y: window.innerHeight / 2 - 50
        }}
        animate={{ 
          opacity: 0,
          scale: 0.2,
          x: cartIconPosition.x - 50,
          y: cartIconPosition.y - 50
        }}
        exit={{ opacity: 0 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.43, 0.13, 0.23, 0.96]
        }}
        onAnimationComplete={onComplete}
      >
        <div className="w-24 h-24 relative">
          <img 
            src={productImage} 
            alt="Product flying to cart"
            className="w-full h-full object-cover rounded-2xl shadow-2xl border-2 border-purple-500"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-2xl" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
