import { motion } from 'motion/react';
import { Target, Users, Award, TrendingUp } from 'lucide-react';

export function About() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl sm:text-6xl text-white mb-6">ABOUT STREETWEAR</h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Redefining urban fashion with cutting-edge designs and uncompromising quality
          </p>
        </motion.div>

        {/* Our Story */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12"
        >
          <h2 className="text-3xl text-white mb-6">Our Story</h2>
          <div className="space-y-4 text-white/70 leading-relaxed">
            <p>
              Founded in 2020, StreetWear emerged from the vibrant underground culture of urban fashion enthusiasts 
              who believed that style should be bold, authentic, and accessible. What started as a small collective 
              of designers and artists has grown into a global movement.
            </p>
            <p>
              We're not just selling clothes – we're creating a lifestyle. Every piece in our collection is carefully 
              crafted to blend cutting-edge design with street culture influences, from cyberpunk aesthetics to 
              classic hip-hop vibes.
            </p>
            <p>
              Our mission is simple: to empower individuals to express themselves through unique, high-quality 
              streetwear that doesn't compromise on style or comfort. We believe fashion is a form of self-expression, 
              and everyone deserves to look and feel their best.
            </p>
          </div>
        </motion.div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: Target,
              title: 'Our Mission',
              description: 'Deliver premium streetwear that defines urban culture and individual expression'
            },
            {
              icon: Users,
              title: 'Community First',
              description: '50K+ satisfied customers worldwide who trust our brand and quality'
            },
            {
              icon: Award,
              title: 'Quality Guarantee',
              description: '100% authentic products with rigorous quality control and satisfaction guarantee'
            },
            {
              icon: TrendingUp,
              title: 'Innovation',
              description: 'Constantly pushing boundaries with new designs and sustainable materials'
            }
          ].map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                <value.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl text-white mb-3">{value.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12"
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '500+', label: 'Products' },
              { number: '50K+', label: 'Happy Customers' },
              { number: '100+', label: 'Countries' },
              { number: '4.9★', label: 'Average Rating' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl sm:text-5xl bg-gradient-to-r from-pink-400 to-purple-400 text-transparent bg-clip-text mb-2">
                  {stat.number}
                </div>
                <div className="text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-16 text-center"
        >
          <h2 className="text-3xl text-white mb-6">Why Choose Us?</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                title: 'Premium Quality',
                description: 'Only the finest materials and craftsmanship in every piece'
              },
              {
                title: 'Fast Shipping',
                description: 'Free worldwide shipping on all orders with express options'
              },
              {
                title: '24/7 Support',
                description: 'Our dedicated team is always here to help you'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all"
              >
                <h3 className="text-xl text-white mb-3">{feature.title}</h3>
                <p className="text-white/60 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
