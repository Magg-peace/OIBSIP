import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Cart from './pages/Cart';
import MyOrders from './pages/MyOrders';
import OrderTracking from './pages/OrderTracking';
import AdminDashboard from './pages/AdminDashboard';
import AdminInventory from './pages/AdminInventory';
import LandingPage from './pages/LandingPage';
import HelpCenter from './pages/HelpCenter';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ContactUs from './pages/ContactUs';

/* ── Footer ────────────────────────────────────── */
const Footer = () => {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return import('react-hot-toast').then(m => m.toast.error('Please enter an email address'));
    if (!email.includes('@')) return import('react-hot-toast').then(m => m.toast.error('Please enter a valid email'));
    
    setLoading(true);
    try {
      const { default: axios } = await import('axios');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await axios.post(`${API_URL.replace('/api', '')}/api/newsletter/subscribe`, { email });
      import('react-hot-toast').then(m => m.toast.success(`Welcome to the family! We've sent a welcome email to ${email}.`));
      setEmail('');
    } catch (error) {
      import('react-hot-toast').then(m => m.toast.error('Failed to subscribe. Please try again later.'));
    } finally {
      setLoading(false);
    }
  };


  return (
    <footer className="relative overflow-hidden bg-[var(--color-surface)] border-t border-[var(--color-border)] pt-16 pb-8">
      {/* Decorative background gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-primary)] opacity-[0.03] rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[#FAA307] flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20">
                <span className="text-xl">🍕</span>
              </div>
              <div>
                <h3 className="text-xl font-black font-display tracking-tight text-[var(--color-text-primary)]">PizzaHub</h3>
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--color-primary)]">Premium Experience</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] mb-6 max-w-sm">
              Elevating the pizza delivery experience with premium ingredients, real-time tracking, and a seamless interface. Taste the difference today.
            </p>
            <div className="flex items-center gap-4">
              {[
                { name: 'Twitter', url: 'https://twitter.com' },
                { name: 'Instagram', url: 'https://instagram.com' },
                { name: 'GitHub', url: 'https://github.com' }
              ].map((social) => (
                <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-tertiary)] hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all duration-300">
                  <span className="text-xs font-medium">{social.name[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-sm font-bold text-[var(--color-text-primary)] mb-6">Platform</h4>
            <ul className="space-y-4">
              {[
                { to: '/dashboard', label: 'Pizza Builder' },
                { to: '/cart', label: 'Your Cart' },
                { to: '/my-orders', label: 'Order History' },
                { to: '/dashboard', label: 'Menu Items' }
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors inline-flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-border)] group-hover:bg-[var(--color-primary)] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[var(--color-text-primary)] mb-6">Resources</h4>
            <ul className="space-y-4">
              {[
                { to: '/help', label: 'Help Center' },
                { to: '/privacy', label: 'Privacy Policy' },
                { to: '/terms', label: 'Terms of Service' },
                { to: '/contact', label: 'Contact Us' }
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors inline-flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-border)] group-hover:bg-[var(--color-primary)] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Subscribe */}
          <div>
            <h4 className="text-sm font-bold text-[var(--color-text-primary)] mb-6">Stay Updated</h4>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">Get special offers and pizza updates.</p>
            <form onSubmit={handleSubscribe} className="relative">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                disabled={loading}
                className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl py-3 pl-4 pr-12 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition-colors disabled:opacity-50"
              />
              <button type="submit" disabled={loading} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center hover:bg-orange-600 transition-colors disabled:opacity-50">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '→'}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-[var(--color-border)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--color-text-tertiary)]">
            © {new Date().getFullYear()} PizzaHub. Built with <span className="text-red-500">♥</span> for Pizza Lovers.
          </p>
          <div className="flex items-center gap-3">
            {['🔒 SSL Secured', '⚡ Fast Delivery', '🍕 100% Fresh'].map(badge => (
              <span key={badge} className="px-3 py-1.5 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-xs font-medium text-[var(--color-text-secondary)]">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

/* ── Layout ─────────────────────────────────────── */
const MainLayout = () => {
  const location = useLocation();
  const isFullPage = location.pathname === '/' || location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen" style={{ background: isFullPage ? '#0a0a0a' : 'var(--color-bg)' }}>
      {!isFullPage && <Navbar />}
      
      <main className="flex-grow">
        <Routes>
          {/* Public Static Pages */}
          <Route path="/"               element={<LandingPage />} />
          <Route path="/help"           element={<HelpCenter />} />
          <Route path="/privacy"        element={<PrivacyPolicy />} />
          <Route path="/terms"          element={<TermsOfService />} />
          <Route path="/contact"        element={<ContactUs />} />
          
          {/* Auth */}
          <Route path="/login"          element={<Login />} />
          <Route path="/admin-login"    element={<Login isAdminLogin={true} />} />
          <Route path="/register"       element={<Register />} />
          <Route path="/verify-email"   element={<VerifyEmail />} />
          <Route path="/forgot-password"element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* User */}
          <Route path="/dashboard"      element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/cart"           element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/my-orders"      element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          <Route path="/orders/:id"     element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin/dashboard"  element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/inventory"  element={<ProtectedRoute adminOnly={true}><AdminInventory /></ProtectedRoute>} />

          {/* Default */}
          <Route path="*"  element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isFullPage && <Footer />}
    </div>
  );
};

/* ── App ────────────────────────────────────────── */
function App() {
  return (
    <Router>
      <Toaster position="bottom-right" />
      <AuthProvider>
        <CartProvider>
          <MainLayout />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
