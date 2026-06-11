import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, LogOut, Menu, X, ChevronDown, Pizza, ClipboardList, BarChart2, Moon, Sun, RefreshCw } from 'lucide-react';

const Navbar = () => {
  const { user, logout, login }   = useAuth();
  const { cart }           = useCart();
  const navigate           = useNavigate();
  const location           = useLocation();
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  const cartCount = cart.reduce((a, i) => a + i.quantity, 0);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    setProfileOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const userLinks = [
    { to: '/dashboard',  label: 'Menu',       icon: Pizza },
    { to: '/my-orders',  label: 'My Orders',  icon: ClipboardList },
  ];
  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: BarChart2 },
    { to: '/admin/inventory', label: 'Inventory',  icon: ClipboardList },
  ];
  const links = user?.role === 'admin' ? adminLinks : userLinks;

  return (
    <>
      <nav className="sticky top-0 z-50 glass-panel border-b border-[var(--color-border)] transition-colors duration-300" style={{ minHeight: '72px' }}>
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.span
              className="text-2xl"
              whileHover={{ rotate: 15, scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
            >
              🍕
            </motion.span>
            <span className="font-extrabold text-xl font-display tracking-tight transition-colors" style={{ color: 'var(--color-text-primary)' }}>
              PizzaHub
            </span>
          </Link>

          {/* Desktop nav links */}
          {user && (
            <div className="hidden md:flex items-center gap-2">
              {links.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300"
                  style={{
                    color: isActive(to) ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    background: isActive(to) ? (isDark ? 'rgba(79, 70, 229, 0.15)' : '#EEF2FF') : 'transparent',
                  }}
                >
                  <Icon size={16} style={{ color: isActive(to) ? 'var(--color-primary)' : 'var(--color-text-tertiary)' }} />
                  {label}
                </Link>
              ))}
            </div>
          )}

          {/* Right Area */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <>
                {/* Cart */}
                {user.role !== 'admin' && (
                  <Link
                    to="/cart"
                    className="relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                    style={{ 
                      background: isActive('/cart') ? (isDark ? 'rgba(79, 70, 229, 0.15)' : '#EEF2FF') : 'transparent', 
                      color: isActive('/cart') ? 'var(--color-primary)' : 'var(--color-text-secondary)' 
                    }}
                  >
                    <ShoppingCart size={20} />
                    <AnimatePresence>
                      {cartCount > 0 && (
                        <motion.span
                          key={cartCount}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-[var(--color-surface)]"
                          style={{ background: 'var(--color-secondary)' }}
                        >
                          {cartCount > 9 ? '9+' : cartCount}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                )}

                {/* Profile */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-full border transition-all duration-300"
                    style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold text-white shadow-sm">
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm font-bold max-w-[90px] truncate" style={{ color: 'var(--color-text-primary)' }}>
                      {user.name?.split(' ')[0]}
                    </span>
                    <ChevronDown size={14} className={`transition-transform duration-300 mr-2 ${profileOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--color-text-tertiary)' }} />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 top-[calc(100%+8px)] w-64 rounded-2xl overflow-hidden border shadow-[0_10px_40px_rgba(0,0,0,0.2)] backdrop-blur-xl"
                        style={{ background: 'color-mix(in srgb, var(--color-surface) 85%, transparent)', borderColor: 'var(--color-border)' }}
                        onMouseLeave={() => setProfileOpen(false)}
                      >
                        <div className="px-5 py-5 border-b relative" style={{ borderColor: 'var(--color-border)' }}>
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary" />
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-black text-white shadow-lg">
                              {user.name?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-black" style={{ color: 'var(--color-text-primary)' }}>{user.name}</p>
                              <p className="text-xs truncate opacity-70" style={{ color: 'var(--color-text-secondary)' }}>{user.email}</p>
                            </div>
                          </div>
                          <div className="mt-4 flex items-center gap-2">
                            <span className={`inline-flex items-center justify-center px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${user.role === 'admin' ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.role === 'admin' ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
                              {user.role}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-2 space-y-1">
                          {/* Fast Role Switcher for Demo */}
                          <button
                            onClick={async () => {
                              setProfileOpen(false);
                              if (user.role === 'admin') {
                                await login('user@example.com', 'password123');
                                navigate('/dashboard');
                              } else {
                                await login('admin@example.com', 'password123');
                                navigate('/admin/dashboard');
                              }
                            }}
                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-colors border border-amber-500/20 mb-1"
                          >
                            <span className="flex items-center gap-3">
                              <RefreshCw size={16} /> Fast Demo Switch
                            </span>
                            <span className="text-[10px] uppercase tracking-wider opacity-70">To {user.role === 'admin' ? 'User' : 'Admin'}</span>
                          </button>
                          
                          {user.role !== 'admin' && (
                            <>
                              <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-colors hover:bg-[var(--color-primary)]/10 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
                                <Pizza size={16} /> My Pizzas
                              </Link>
                              <Link to="/my-orders" onClick={() => setProfileOpen(false)} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-colors hover:bg-[var(--color-primary)]/10 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
                                <ClipboardList size={16} /> Order History
                              </Link>
                            </>
                          )}
                          <div className="h-px w-full my-1" style={{ background: 'var(--color-border)' }} />
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            <LogOut size={16} />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-5 py-2.5 text-sm font-bold transition-colors hover:text-indigo-600" style={{ color: 'var(--color-text-secondary)' }}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary-gradient px-6 py-2.5 text-sm shadow-md">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-full" style={{ color: 'var(--color-text-secondary)' }}>
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-full border"
              style={{ color: 'var(--color-text-secondary)', background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="md:hidden border-t shadow-2xl absolute w-full"
              style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-6 py-6 space-y-2">
                {user ? (
                  <>
                    {links.map(({ to, label, icon: Icon }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all"
                        style={{
                          color: isActive(to) ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                          background: isActive(to) ? (isDark ? 'rgba(79, 70, 229, 0.15)' : '#EEF2FF') : 'transparent',
                        }}
                      >
                        <Icon size={18} style={{ color: isActive(to) ? 'var(--color-primary)' : 'var(--color-text-tertiary)' }} />
                        {label}
                      </Link>
                    ))}
                    <div className="border-t mt-4 pt-4" style={{ borderColor: 'var(--color-border)' }}>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl text-sm font-bold text-red-600 bg-red-50 dark:bg-red-900/20 transition-colors"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3 pt-2">
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-center w-full px-4 py-3.5 rounded-2xl text-sm font-bold" style={{ color: 'var(--color-text-primary)', background: 'var(--color-bg)' }}>Sign In</Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="btn btn-primary-gradient w-full py-3.5 text-sm shadow-md">Get Started</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      {profileOpen && <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />}
    </>
  );
};

export default Navbar;
