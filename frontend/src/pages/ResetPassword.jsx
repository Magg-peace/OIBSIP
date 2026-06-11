import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Lock, ArrowRight, CheckCircle, AlertCircle, EyeOff, Eye } from 'lucide-react';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!token) return setError('Missing or invalid reset token.');
    if (password !== confirmPassword) return setError('Passwords do not match');
    if (password.length < 6) return setError('Password must be at least 6 characters long');

    setLoading(true);
    const result = await resetPassword(token, password);
    setLoading(false);

    if (result.success) {
      setMessage(result.message);
      setPassword('');
      setConfirmPassword('');
    } else {
      setError(result.message);
    }
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

          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[var(--color-primary)] to-[#FAA307] rounded-2xl flex items-center justify-center shadow-lg mb-6 shadow-[var(--color-primary)]/30">
              <Lock size={28} className="text-white filter drop-shadow-md" />
            </div>
            <h2 className="text-3xl font-black mb-2 font-display tracking-tight text-[var(--color-text-primary)]">New Password</h2>
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">Create a secure password for your account</p>
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

          {message ? (
            <motion.div
              className="text-center py-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <motion.div
                className="w-20 h-20 mx-auto bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center border-2 border-emerald-500/20 shadow-lg shadow-emerald-500/20 mb-6"
              >
                <CheckCircle size={40} />
              </motion.div>
              <h3 className="text-2xl font-black font-display mb-2 text-[var(--color-text-primary)]">Password Updated!</h3>
              <p className="text-sm mb-8 text-[var(--color-text-secondary)] font-medium leading-relaxed">{message}</p>
              <Link to="/login" className="btn btn-primary-gradient w-full flex items-center justify-center gap-2 group relative overflow-hidden" style={{ padding: '14px', borderRadius: '12px' }}>
                Proceed to Login <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Password */}
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">New Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--color-text-tertiary)] group-focus-within:text-[var(--color-primary)] transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPwd ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters"
                    className="w-full pl-11 pr-12 py-3.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all placeholder:text-[var(--color-text-tertiary)]"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors">
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </motion.div>

              {/* Confirm Password */}
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Confirm New Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--color-text-tertiary)] group-focus-within:text-[var(--color-primary)] transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password"
                    className={`w-full pl-11 pr-4 py-3.5 bg-[var(--color-bg)] border ${confirmPassword && confirmPassword === password ? 'border-emerald-500 focus:ring-emerald-500' : confirmPassword && confirmPassword !== password ? 'border-red-500 focus:ring-red-500' : 'border-[var(--color-border)] focus:ring-[var(--color-primary)]'} rounded-xl text-sm font-medium text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-[var(--color-text-tertiary)]`}
                  />
                  {confirmPassword && confirmPassword === password && (
                    <CheckCircle size={18} className="absolute inset-y-0 right-0 pr-4 mt-3.5 text-emerald-500" />
                  )}
                </div>
              </motion.div>

              {/* Submit */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="pt-2">
                <button
                  type="submit" disabled={loading}
                  className="w-full btn btn-primary-gradient py-4 rounded-xl text-base flex items-center justify-center gap-2 group relative overflow-hidden"
                >
                  {loading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin-loader" />
                  ) : (
                    <>Change Password <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                  )}
                  <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                </button>
              </motion.div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
