import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

const StrengthBar = ({ password }) => {
  const checks = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/, /.{8,}/];
  const score  = checks.filter(r => r.test(password)).length;
  const colors = ['#EF4444','#F59E0B','#F59E0B','#10B981','#10B981'];
  const labels = ['Very Weak','Weak','Fair','Strong','Very Strong'];
  if (!password) return null;
  return (
    <div className="mt-3">
      <div className="flex gap-1">
        {[1,2,3,4,5].map(i => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{ background: i <= score ? colors[score - 1] : 'var(--color-border)' }}
          />
        ))}
      </div>
      <p className="text-xs mt-1.5 font-bold" style={{ color: colors[score - 1] || 'var(--color-text-tertiary)' }}>
        {password ? labels[score - 1] || 'Very Weak' : ''}
      </p>
    </div>
  );
};

const Register = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [confirm, setConfirm]         = useState('');
  const [showPwd, setShowPwd]         = useState(false);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState('');
  const [loading, setLoading]         = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) return setError('Passwords do not match.');
    if (password.length < 6)  return setError('Password must be at least 6 characters.');
    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);
    if (result?.success) {
      setSuccess(result.message);
      setName(''); setEmail(''); setPassword(''); setConfirm('');
    } else {
      setError(result?.message || 'Registration failed. Try a different email.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[var(--color-bg)] transition-colors duration-500">
      
      {/* Sleek Mesh Gradient Background */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
      
      {/* Decorative blurred orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-primary)] rounded-full blur-[150px] opacity-20 pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#FAA307] rounded-full blur-[150px] opacity-10 pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }} />

      {/* Floating UI Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[
          { icon: <User size={20} />, size: 60, top: '15%', left: '15%', delay: 0 },
          { icon: <Lock size={24} />, size: 80, top: '75%', left: '10%', delay: 1.5 },
          { icon: <div className="text-2xl font-display font-black text-white">Join</div>, size: 70, top: '25%', left: '80%', delay: 0.5 },
          { icon: <div className="w-8 h-8 rounded-full border-4 border-white/20" />, size: 60, top: '80%', left: '85%', delay: 2 }
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
              Create Account
            </h2>
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">
              Join PizzaHub and start customizing today.
            </p>
          </motion.div>

          {/* Messages */}
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
            {success && (
              <motion.div
                className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center gap-3 text-emerald-600 text-sm font-medium text-center"
                initial={{ opacity: 0, height: 0, scale: 0.9 }} animate={{ opacity: 1, height: 'auto', scale: 1 }} exit={{ opacity: 0, height: 0, scale: 0.9 }}
              >
                <CheckCircle size={32} />
                <span>{success}</span>
                <Link to="/login" className="mt-2 w-full btn btn-primary py-3 rounded-xl text-white font-bold">Go to Sign In</Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          {!success && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--color-text-tertiary)] group-focus-within:text-[var(--color-primary)] transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-3.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all placeholder:text-[var(--color-text-tertiary)]"
                  />
                </div>
              </motion.div>

              {/* Email */}
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--color-text-tertiary)] group-focus-within:text-[var(--color-primary)] transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all placeholder:text-[var(--color-text-tertiary)]"
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Password</label>
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
                <StrengthBar password={password} />
              </motion.div>

              {/* Confirm Password */}
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                <label className="block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--color-text-tertiary)] group-focus-within:text-[var(--color-primary)] transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Re-enter password"
                    className={`w-full pl-11 pr-12 py-3.5 bg-[var(--color-bg)] border ${confirm && confirm === password ? 'border-emerald-500 focus:ring-emerald-500' : confirm && confirm !== password ? 'border-red-500 focus:ring-red-500' : 'border-[var(--color-border)] focus:ring-[var(--color-primary)]'} rounded-xl text-sm font-medium text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:border-transparent transition-all placeholder:text-[var(--color-text-tertiary)]`}
                  />
                  {confirm && confirm === password && (
                    <CheckCircle size={18} className="absolute inset-y-0 right-0 pr-4 mt-3.5 text-emerald-500" />
                  )}
                </div>
              </motion.div>

              {/* Submit */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="pt-2">
                <button
                  type="submit" disabled={loading}
                  className="w-full btn btn-primary-gradient py-4 rounded-xl text-base flex items-center justify-center gap-2 group relative overflow-hidden"
                >
                  {loading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin-loader" />
                  ) : (
                    <>Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                  )}
                  <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                </button>
              </motion.div>
            </form>
          )}

          {/* Footer Links */}
          {!success && (
            <motion.p
              className="text-center text-sm font-medium mt-8 text-[var(--color-text-secondary)]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            >
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[var(--color-primary)] hover:underline">
                Sign in
              </Link>
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
