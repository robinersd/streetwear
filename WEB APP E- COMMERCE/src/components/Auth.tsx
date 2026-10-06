import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Lock, Mail, Github, Facebook, Linkedin, Eye, EyeOff, Sparkles } from 'lucide-react';
import { createClient } from '../utils/supabase/client';
import { getAuthErrorMessage, submitAuthentication } from '../utils/supabase/auth';

interface AuthProps {
  mode: 'login' | 'signup';
  onToggleMode: () => void;
  onSuccess: (user: any) => void;
}

export function Auth({ mode, onToggleMode, onSuccess }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const supabase = createClient();

  const handleFillDemo = () => {
    setEmail('demo@streetwear.com');
    setPassword('password123');
    setError('');
    setMessage('Demo credentials loaded! Click "Login" below to enter.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await submitAuthentication(supabase, mode, { email, password, username });
      if (result.user) {
        onSuccess(result.user);
      } else {
        setMessage(result.message);
      }
    } catch (err: any) {
      setError(getAuthErrorMessage(err));
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl grid md:grid-cols-2 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Left Side - Welcome */}
        <div className="p-12 flex flex-col justify-center bg-gradient-to-br from-pink-500/20 to-purple-500/20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl sm:text-4xl text-white mb-4">
              Hello, Welcome To
              <br />
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 text-transparent bg-clip-text">
                StreetWear!
              </span>
            </h2>
            <p className="text-white/70 mb-8">
              {mode === 'login' 
                ? "Don't have an account?" 
                : "Already have an account?"}
            </p>
            <button
              onClick={() => {
                setError('');
                setMessage('');
                onToggleMode();
              }}
              disabled={loading}
              className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-white/20 transition-all"
            >
              {mode === 'login' ? 'Register' : 'Login'}
            </button>
          </motion.div>
        </div>

        {/* Right Side - Form */}
        <div className="p-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-3xl text-white mb-6 text-center">
              {mode === 'login' ? 'Login' : 'Sign Up'}
            </h3>

            {mode === 'login' && (
              <div className="mb-6 flex justify-center">
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl text-purple-200 text-xs transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                  <span>Use Demo Account (demo@streetwear.com)</span>
                </button>
              </div>
            )}

            {error && (
              <div role="alert" className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
                {error}
              </div>
            )}

            {message && (
              <div role="status" className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-300 text-sm">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === 'signup' && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <User className="w-5 h-5 text-white/50" />
                  </div>
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500/50 transition-all"
                    required
                  />
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Mail className="w-5 h-5 text-white/50" />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500/50 transition-all"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Lock className="w-5 h-5 text-white/50" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  minLength={mode === 'signup' ? 6 : undefined}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500/50 transition-all"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5 text-white/50 hover:text-white transition-colors" /> : <Eye className="w-5 h-5 text-white/50 hover:text-white transition-colors" />}
                </button>
              </div>

              {mode === 'login' && (
                <div className="text-right">
                  <button 
                    type="button" 
                    onClick={() => setMessage('You can sign in with demo@streetwear.com / password123, or click "Register" to create your own account.')}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Sign Up')}
              </button>
            </form>

            <div className="mt-8">
              <p className="text-white/60 text-center mb-4 text-sm">
                or login with social platforms
              </p>
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setMessage('Social login is disabled in demo mode. Please sign in with email and password.')}
                  className="p-3 bg-red-500/80 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-all"
                >
                  <Mail className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setMessage('Facebook login is disabled in demo mode. Please sign in with email and password.')}
                  className="p-3 bg-blue-500/80 backdrop-blur-md rounded-full text-white hover:bg-blue-500 transition-all"
                >
                  <Facebook className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setMessage('Github login is disabled in demo mode. Please sign in with email and password.')}
                  className="p-3 bg-gray-800/80 backdrop-blur-md rounded-full text-white hover:bg-gray-800 transition-all"
                >
                  <Github className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setMessage('LinkedIn login is disabled in demo mode. Please sign in with email and password.')}
                  className="p-3 bg-blue-600/80 backdrop-blur-md rounded-full text-white hover:bg-blue-600 transition-all"
                >
                  <Linkedin className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
