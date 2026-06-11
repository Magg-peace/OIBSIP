import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const VerifyEmail = () => {
  const [searchParams]  = useSearchParams();
  const token           = searchParams.get('token');
  const { verifyEmailToken } = useAuth();
  const [status,  setStatus]  = useState('verifying');
  const [message, setMessage] = useState('');
  const hasAttempted = React.useRef(false);

  useEffect(() => {
    (async () => {
      if (hasAttempted.current) return;
      hasAttempted.current = true;
      
      if (!token) { setStatus('error'); setMessage('Verification token is missing.'); return; }
      const result = await verifyEmailToken(token);
      if (result?.success) { setStatus('success'); setMessage(result.message); }
      else { setStatus('error'); setMessage(result?.message || 'Verification failed.'); }
    })();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[var(--color-bg)] transition-colors duration-500">
      {/* Sleek Mesh Gradient Background */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
      
      {/* Decorative blurred orbs */}
      <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-[var(--color-primary)] rounded-full blur-[150px] opacity-20 pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] bg-[#FAA307] rounded-full blur-[150px] opacity-10 pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <motion.div
        className="w-full max-w-md z-10"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.34,1.56,0.64,1] }}
      >
        <div className="glass-panel rounded-3xl p-10 text-center shadow-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-2xl relative overflow-hidden">
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[#FAA307]" />

          {status === 'verifying' && (
            <div className="flex flex-col items-center gap-5">
              <motion.div
                className="w-20 h-20 rounded-full border-[4px] border-[var(--color-border)] border-t-[var(--color-primary)] animate-spin"
              />
              <h2 className="text-2xl font-black font-display text-[var(--color-text-primary)] mt-2">Verifying Email…</h2>
              <p className="text-sm text-[var(--color-text-secondary)] font-medium">Please wait while we activate your account.</p>
            </div>
          )}

          {status === 'success' && (
            <motion.div
              className="flex flex-col items-center gap-5"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <motion.div
                className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center border-2 border-emerald-500/20 shadow-lg shadow-emerald-500/20"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <div>
                <h2 className="text-2xl font-black font-display mb-2 text-[var(--color-text-primary)]">Account Verified!</h2>
                <p className="text-sm font-medium text-[var(--color-text-secondary)]">{message}</p>
              </div>
              <Link to="/login" className="btn btn-primary-gradient w-full mt-4" style={{ padding: '14px', borderRadius: '12px' }}>
                Continue to Sign In
              </Link>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              className="flex flex-col items-center gap-5"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center border-2 border-red-500/20 shadow-lg shadow-red-500/20">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-black font-display mb-2 text-[var(--color-text-primary)]">Verification Failed</h2>
                <p className="text-sm font-medium text-red-500">{message}</p>
              </div>
              <div className="flex flex-col gap-3 w-full mt-4">
                <Link to="/register" className="btn btn-secondary w-full" style={{ padding: '12px', borderRadius: '12px' }}>
                  Create New Account
                </Link>
                <Link to="/login" className="text-sm font-bold text-[var(--color-primary)] hover:underline mt-2">
                  Back to Login
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
