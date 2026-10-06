import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onShopNow: () => void;
}

export function Hero({ onShopNow }: HeroProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl sm:text-7xl lg:text-8xl text-white mb-6 tracking-tight">
            URBAN
            <br />
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-transparent bg-clip-text">
              STYLE
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-white/80 mb-12 max-w-2xl mx-auto">
            Experience the future of streetwear. Exclusive drops, limited editions, and cutting-edge designs.
          </p>
          
          <motion.button
            onClick={onShopNow}
            className="group relative px-12 py-4 bg-white/10 backdrop-blur-xl border border-white/30 rounded-full text-white text-lg overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center gap-3">
              Get started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/50 via-purple-500/50 to-cyan-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto"
        >
          <div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
            <div className="text-4xl mb-2 bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
              500+
            </div>
            <div className="text-white/70 text-sm">Products</div>
          </div>
          
          <div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
            <div className="text-4xl mb-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-transparent bg-clip-text">
              50K+
            </div>
            <div className="text-white/70 text-sm">Customers</div>
          </div>
          
          <div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
            <div className="text-4xl mb-2 bg-gradient-to-r from-cyan-500 to-pink-500 text-transparent bg-clip-text">
              100%
            </div>
            <div className="text-white/70 text-sm">Authentic</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}