import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';

const Login = ({ isAdminLogin = false }) => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail]       = useState(isAdminLogin ? 'admin@example.com' : 'user@example.com');
  const [password, setPassword] = useState('password123');
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (user) navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard', { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result?.success) setError(result?.message || 'Invalid credentials.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[var(--color-bg)] transition-colors duration-500">
      
      {/* Sleek Mesh Gradient Background */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
      
      {/* Decorative blurred orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-primary)] rounded-full blur-[150px] opacity-20 pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FAA307] rounded-full blur-[150px] opacity-10 pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }} />

      {/* Floating UI Elements (Instead of emojis) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[
          { icon: <Lock size={20} />, size: 60, top: '20%', left: '15%', delay: 0 },
          { icon: <Mail size={24} />, size: 80, top: '70%', left: '10%', delay: 1.5 },
          { icon: <div className="text-2xl font-display font-black text-white">P</div>, size: 50, top: '30%', left: '80%', delay: 0.5 },
          { icon: <div className="w-8 h-8 rounded-full border-4 border-white/20" />, size: 70, top: '65%', left: '85%', delay: 2 }
        ].map((item, i) => (
          <div
            key={i}
            className="absolute flex items-center justify-center text-white/40 shadow-2xl backdrop-blur-md rounded-2xl glass-panel border border-white/10"
            style={{
              width: item.size,
              height: item.size,
              top: item.top,
              left: item.left,
              animation: `floatEmoji ${4 + i}s ease-in-out infinite`,
              animationDelay: `${item.delay}s`,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))'
            }}
          >
            {item.icon}
          </div>
        ))}
      </div>

      {/* Login Card */}
      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
      >
        <div className="glass-panel rounded-3xl p-8 md:p-10 shadow-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-2xl relative overflow-hidden">
          
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[#FAA307]" />

          {/* Header */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[var(--color-primary)] to-[#FAA307] rounded-2xl flex items-center justify-center shadow-lg mb-6 shadow-[var(--color-primary)]/30">
              <span className="text-3xl filter drop-shadow-md">🍕</span>
            </div>
            <h2 className="text-3xl font-black mb-2 font-display tracking-tight text-[var(--color-text-primary)]">
              {isAdminLogin ? 'Admin Access' : 'Welcome Back'}
            </h2>
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">
              {isAdminLogin ? 'Sign in to access the master control panel.' : 'Enter your credentials to continue.'}
            </p>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-500 text-sm font-medium"
                initial={{ opacity: 0, height: 0, scale: 0.9 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.9 }}
              >
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--color-text-tertiary)] group-focus-within:text-[var(--color-primary)] transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@pizzahub.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all placeholder:text-[var(--color-text-tertiary)]"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" className="text-xs font-bold text-[var(--color-primary)] hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--color-text-tertiary)] group-focus-within:text-[var(--color-primary)] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all placeholder:text-[var(--color-text-tertiary)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary-gradient py-4 rounded-xl text-base flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                {loading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin-loader" />
                ) : (
                  <>
                    Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
              </button>
            </motion.div>
          </form>

          {/* Footer Links */}
          {!isAdminLogin && (
            <motion.p
              className="text-center text-sm font-medium mt-8 text-[var(--color-text-secondary)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-[var(--color-primary)] hover:underline">
                Create one now
              </Link>
            </motion.p>
          )}

          {/* Demo Credentials */}
          <motion.div
            className="mt-8 pt-6 border-t border-[var(--color-border)] text-center flex flex-col gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest mb-2">Demo Credentials</p>
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-[var(--color-text-secondary)]">
              <span>{isAdminLogin ? 'admin' : 'user'}@example.com</span>
              <span className="text-[var(--color-border)]">|</span>
              <span>password123</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
