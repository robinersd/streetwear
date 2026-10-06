import { motion } from 'motion/react';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { CartItem } from '../App';

interface CartProps {
  cart: CartItem[];
  onUpdateQuantity: (id: number, size: string, newQuantity: number) => void;
  onRemoveItem: (id: number, size: string) => void;
  total: number;
  onCheckout: () => void;
}

export function Cart({ cart, onUpdateQuantity, onRemoveItem, total, onCheckout }: CartProps) {
  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-32 h-32 mx-auto mb-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-white/30" />
          </div>
          <h2 className="text-3xl text-white mb-4">Your Cart is Empty</h2>
          <p className="text-white/60 mb-8">Start adding some fresh items to your collection!</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-4xl sm:text-5xl text-white mb-2">SHOPPING CART</h2>
          <p className="text-white/70">{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <motion.div
                key={`${item.id}-${item.selectedSize}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all"
              >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-white text-xl mb-2">{item.name}</h3>
                      <div className="flex items-center gap-4 text-white/60 mb-2">
                        <span>Size: {item.selectedSize}</span>
                        <span className="text-xs text-purple-400">{item.category}</span>
                      </div>
                      <span className="text-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
                        ${item.price}
                      </span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3 bg-white/5 rounded-xl p-1">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-white w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id, item.selectedSize)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Cart Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-8">
              <h3 className="text-2xl text-white mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-white/70">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Shipping</span>
                  <span className="text-green-400">FREE</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Tax (10%)</span>
                  <span>${(total * 0.1).toFixed(2)}</span>
                </div>
                
                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between text-2xl">
                    <span className="text-white">Total</span>
                    <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
                      ${(total * 1.1).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={onCheckout}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                PROCEED TO CHECKOUT
              </button>

              <p className="text-white/40 text-sm text-center mt-4">
                Secure checkout powered by StreetWear
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
