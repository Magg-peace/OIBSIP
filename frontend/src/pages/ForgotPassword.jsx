import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Send } from 'lucide-react';

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [email,   setEmail]   = useState('');
  const [message, setMessage] = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage(''); setLoading(true);
    const result = await forgotPassword(email);
    setLoading(false);
    if (result?.success) { setMessage(result.message); setEmail(''); }
    else setError(result?.message || 'Request failed.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[var(--color-bg)] transition-colors duration-500">
      
      {/* Sleek Mesh Gradient Background */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
      
      {/* Decorative blurred orbs */}
      <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-[var(--color-primary)] rounded-full blur-[150px] opacity-20 pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] bg-[#FAA307] rounded-full blur-[150px] opacity-10 pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
      >
        <div className="glass-panel rounded-3xl p-8 md:p-10 shadow-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-2xl relative overflow-hidden">
          
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[#FAA307]" />

          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-tertiary)] hover:text-[var(--color-primary)] mb-8 transition-colors uppercase tracking-wider">
            <ArrowLeft size={16} /> Back to Login
          </Link>

          {message ? (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <motion.div
                className="w-20 h-20 mx-auto bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center border-2 border-emerald-500/20 shadow-lg shadow-emerald-500/20 mb-6"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <CheckCircle size={40} />
              </motion.div>
              <h2 className="text-2xl font-black font-display mb-2 text-[var(--color-text-primary)]">Check your inbox!</h2>
              <p className="text-sm mb-8 text-[var(--color-text-secondary)] font-medium leading-relaxed">{message}</p>
              <Link to="/login" className="btn btn-primary-gradient w-full" style={{ padding: '14px', borderRadius: '12px' }}>
                Return to Login
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[var(--color-primary)] to-[#FAA307] rounded-2xl flex items-center justify-center shadow-lg mb-6 shadow-[var(--color-primary)]/30">
                  <Mail size={28} className="text-white filter drop-shadow-md" />
                </div>
                <h2 className="text-3xl font-black mb-2 font-display tracking-tight text-[var(--color-text-primary)]">Forgot Password?</h2>
                <p className="text-sm font-medium text-[var(--color-text-secondary)]">
                  Enter your email and we'll send you a secure reset link.
                </p>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-500 text-sm font-medium"
                    initial={{ opacity: 0, height: 0, scale: 0.9 }} animate={{ opacity: 1, height: 'auto', scale: 1 }} exit={{ opacity: 0, height: 0, scale: 0.9 }}
                  >
                    <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                  <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--color-text-tertiary)] group-focus-within:text-[var(--color-primary)] transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email" required value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full pl-11 pr-4 py-3.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all placeholder:text-[var(--color-text-tertiary)]"
                    />
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn btn-primary-gradient py-4 rounded-xl text-base flex items-center justify-center gap-2 group relative overflow-hidden"
                  >
                    {loading ? (
                      <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin-loader" />
                    ) : (
                      <><Send size={18} className="group-hover:translate-x-1 transition-transform" /> Send Reset Link</>
                    )}
                    {/* Shine effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                  </button>
                </motion.div>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
