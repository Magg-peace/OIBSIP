import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingCart, MapPin, Phone, CreditCard, AlertCircle, Package, Navigation, Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, subtotal, tax, deliveryFee, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress]     = useState('');
  const [city, setCity]           = useState('');
  const [postalCode, setPostal]   = useState('');
  const [phone, setPhone]         = useState('');
  const [payMethod, setPayMethod] = useState('razorpay');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const [detectingLoc, setDetectingLoc] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState([]);

  const ADDONS_LIST = [
    { id: 1, name: 'Extra Ketchup (2x)', price: 5, emoji: '🍅' },
    { id: 2, name: 'Oregano Packets', price: 10, emoji: '🌿' },
    { id: 3, name: 'Chilli Flakes', price: 10, emoji: '🌶️' },
    { id: 4, name: 'Garlic Bread', price: 99, emoji: '🥖' },
    { id: 5, name: 'Coca Cola (330ml)', price: 40, emoji: '🥤' },
    { id: 6, name: 'Cheese Dip', price: 25, emoji: '🧀' },
  ];

  const toggleAddon = (addon) => {
    if (selectedAddons.find(a => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const addonsTotal = selectedAddons.reduce((sum, item) => sum + item.price, 0);
  const finalSubtotal = subtotal + addonsTotal;
  const finalTax = finalSubtotal * 0.05;
  const finalTotalAmount = finalSubtotal + finalTax + (finalSubtotal > 0 ? deliveryFee : 0);

  // Merge selected addons into cart items for backend order creation
  const finalItems = [
    ...cart,
    ...selectedAddons.map(addon => ({
      base: addon.name,
      sauce: 'None',
      cheese: 'None',
      vegetables: [],
      price: addon.price,
      quantity: 1
    }))
  ];

  const handleAutoDetect = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setTimeout(() => setError(''), 4000);
      return;
    }
    setDetectingLoc(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Secure & Free reverse geocoding
          const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          if (res.data && res.data.address) {
            const addr = res.data.address;
            const fetchedCity = addr.city || addr.town || addr.village || addr.county || '';
            const fetchedPin = addr.postcode || '';
            const fetchedStreet = [addr.road, addr.suburb, addr.neighbourhood].filter(Boolean).join(', ');
            
            if (fetchedStreet) setAddress(fetchedStreet);
            if (fetchedCity) setCity(fetchedCity);
            if (fetchedPin) setPostal(fetchedPin);
            
            setSuccess('📍 Location automatically detected!');
            setTimeout(() => setSuccess(''), 3000);
          }
        } catch (err) {
          setError('Failed to fetch precise address. Please enter manually.');
          setTimeout(() => setError(''), 4000);
        } finally {
          setDetectingLoc(false);
        }
      },
      (err) => {
        setError('Location permission denied. Please allow location access or enter manually.');
        setTimeout(() => setError(''), 4000);
        setDetectingLoc(false);
      }
    );
  };

  const handlePinChange = async (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPostal(val);
    
    if (val.length === 6) {
      setPinLoading(true);
      try {
        const res = await axios.get(`https://api.postalpincode.in/pincode/${val}`);
        if (res.data && res.data[0].Status === 'Success') {
          const postOffice = res.data[0].PostOffice[0];
          setCity(postOffice.District);
          if (!address) setAddress(`${postOffice.Name}, ${postOffice.Block}`);
        }
      } catch (err) {
        console.error('Pincode fetch failed', err);
      } finally {
        setPinLoading(false);
      }
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');
    if (!address || !city || !postalCode || !phone) return setError('Please fill in all delivery details.');
    setLoading(true);

    if (payMethod === 'cod') {
      try {
        const res = await axios.post(`${API_URL}/payment/verify`, {
          razorpayOrderId:   `cod_${Date.now()}`,
          razorpayPaymentId: 'cod_payment',
          razorpaySignature: 'mock_signature',
          items: finalItems,
          shippingAddress: { address, city, postalCode, phone },
          subtotal: finalSubtotal, tax: finalTax, deliveryFee, totalAmount: finalTotalAmount,
        });
        if (res.data.success) {
          setSuccess('✓ Order placed successfully! Estimated: 25 minutes');
          clearCart();
          setTimeout(() => navigate(`/orders/${res.data.order._id}`), 1500);
        } else {
          setError('Payment processing failed. Please try again.');
          setLoading(false);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Checkout failed.');
        setLoading(false);
      }
      return;
    }

    try {
      // 1. Create Order on backend
      const { data: orderData } = await axios.post(`${API_URL}/payment/create`, { amount: finalTotalAmount });

      if (!orderData.success) {
        setError('Failed to initiate Razorpay order.');
        setLoading(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_replace_with_real_key', // Enter the Key ID generated from the Dashboard
        amount: orderData.razorpayOrder.amount,
        currency: 'INR',
        name: 'PizzaHub',
        description: 'Test Pizza Order Transaction',
        order_id: orderData.razorpayOrder.id,
        handler: async function (response) {
          try {
            // 2. Verify Payment
            const verifyRes = await axios.post(`${API_URL}/payment/verify`, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              items: finalItems,
              shippingAddress: { address, city, postalCode, phone },
              subtotal: finalSubtotal, tax: finalTax, deliveryFee, totalAmount: finalTotalAmount,
            });

            if (verifyRes.data.success) {
              setSuccess('✓ Payment successful! Order placed. Estimated: 25 minutes');
              clearCart();
              setTimeout(() => navigate(`/orders/${verifyRes.data.order._id}`), 1500);
            } else {
              setError('Payment verification failed.');
              setLoading(false);
            }
          } catch (err) {
            setError(err.response?.data?.message || 'Payment verification failed.');
            setLoading(false);
          }
        },
        prefill: {
          name: 'Test User',
          email: 'test@example.com',
          contact: phone,
        },
        theme: {
          color: '#f97316',
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        setError(response.error.description);
        setLoading(false);
      });
      rzp1.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to open Razorpay checkout.');
      setLoading(false);
    }
  };

  /* Empty cart */
  if (cart.length === 0 && !success) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-[var(--color-bg)] transition-colors duration-500">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
          <div className="text-7xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold mb-2 font-display text-[var(--color-text-primary)]">Your cart is empty</h2>
          <p className="text-sm mb-8 text-[var(--color-text-secondary)]">Add some delicious pizzas from the menu!</p>
          <Link to="/dashboard" className="btn btn-primary-gradient inline-flex items-center gap-2">
            <ShoppingCart size={16} />
            Start Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-container bg-[var(--color-bg)] min-h-screen transition-colors duration-500 pt-8 px-6">
      <motion.h1 className="text-3xl font-extrabold mb-6 font-display text-[var(--color-text-primary)]"
        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
      >
        🛒 Cart & Checkout
      </motion.h1>

      {/* Success banner */}
      <AnimatePresence>
        {success && (
          <motion.div
            className="alert alert-success mb-6"
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          >
            <span className="text-xl">🎉</span>
            <span className="font-semibold">{success}</span>
          </motion.div>
        )}
        {error && (
          <motion.div
            className="alert alert-error mb-6"
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          >
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Cart Items */}
        <div className="lg:col-span-7">
          <div className="card p-0 overflow-hidden border border-[var(--color-border)] shadow-sm">
            <div className="px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
              <h2 className="font-bold text-base text-[var(--color-text-primary)]">
                Cart Items ({cart.length})
              </h2>
            </div>

            <AnimatePresence>
              {cart.map((item, idx) => (
                <motion.div
                  key={idx}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50, height: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between px-6 py-4 border-b last:border-0 transition-colors hover:bg-gray-50"
                  style={{ borderColor: '#F3F4F6' }}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span className="text-3xl">🍕</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold" style={{ color: '#1F2937' }}>Custom Pizza</h3>
                        <span className="badge badge-primary text-[10px]">{item.base}</span>
                      </div>
                      <p className="text-xs truncate mt-0.5" style={{ color: '#9CA3AF' }}>
                        {item.sauce} · {item.cheese}
                        {item.vegetables?.length > 0 && ` · ${item.vegetables.join(', ')}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    {/* Quantity stepper */}
                    <div className="flex items-center gap-1 border border-[var(--color-border)] rounded-lg p-0.5 bg-[var(--color-bg)]">
                      <button
                        onClick={() => updateQuantity(idx, item.quantity - 1)}
                        className="w-7 h-7 rounded-md flex items-center justify-center transition-colors hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)]"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-7 text-center text-sm font-bold text-[var(--color-text-primary)]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(idx, item.quantity + 1)}
                        className="w-7 h-7 rounded-md flex items-center justify-center transition-colors hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)]"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <span className="text-sm font-extrabold min-w-[60px] text-right text-[var(--color-primary)]">
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </span>

                    <button
                      onClick={() => removeFromCart(idx)}
                      className="p-1.5 rounded-lg transition-all hover:bg-red-500/10 text-[var(--color-text-tertiary)] hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm font-bold mt-4 text-[var(--color-primary)] hover:underline">
            + Add another pizza
          </Link>

          {/* Add-ons Section */}
          <div className="mt-8">
            <h3 className="font-bold text-base mb-3 text-[var(--color-text-primary)] flex items-center gap-2">
              <Plus size={16} className="text-[var(--color-primary)]" /> Frequently Added Together
            </h3>
            <div className="flex overflow-x-auto gap-3 pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {ADDONS_LIST.map(addon => {
                const isSelected = selectedAddons.some(a => a.id === addon.id);
                return (
                  <motion.div
                    key={addon.id}
                    className={`flex-shrink-0 w-[140px] snap-center rounded-2xl border-2 p-3 cursor-pointer transition-all ${isSelected ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 shadow-md' : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/50'}`}
                    onClick={() => toggleAddon(addon)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-3xl mb-2">{addon.emoji}</div>
                    <div className="text-xs font-bold text-[var(--color-text-primary)] mb-1 leading-tight">{addon.name}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-extrabold text-[var(--color-primary)]">₹{addon.price}</span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${isSelected ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white' : 'border-[var(--color-border)] text-[var(--color-text-tertiary)]'}`}>
                        {isSelected ? <Minus size={12} /> : <Plus size={12} />}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-20">
          {/* Bill */}
          <motion.div
            className="card border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          >
            <h3 className="font-bold text-base mb-4 text-[var(--color-text-primary)]">
              <Package size={16} className="inline mr-2 text-[var(--color-primary)]" />
              Order Summary
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Subtotal',    val: `₹${finalSubtotal.toFixed(2)}` },
                { label: 'Delivery Fee',val: deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}` },
                { label: 'GST (5%)',    val: `₹${finalTax.toFixed(2)}` },
              ].map(r => (
                <div key={r.label} className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)]">{r.label}</span>
                  <span className={`font-semibold ${r.val === 'FREE' ? 'text-green-500' : 'text-[var(--color-text-primary)]'}`}>{r.val}</span>
                </div>
              ))}
              <div className="divider bg-[var(--color-border)] h-px my-4" />
              <div className="flex justify-between font-black text-lg">
                <span className="text-[var(--color-text-primary)]">Total</span>
                <span className="text-[var(--color-primary)]">₹{finalTotalAmount.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>

          {/* Delivery form */}
          <motion.div
            className="card border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-[var(--color-text-primary)]">
                <MapPin size={16} className="inline mr-2 text-[var(--color-primary)]" />
                Delivery Details
              </h3>
              <button 
                type="button" 
                onClick={handleAutoDetect} 
                disabled={detectingLoc}
                className="text-xs font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1 bg-[var(--color-primary)]/10 px-3 py-1.5 rounded-full transition-colors hover:bg-[var(--color-primary)] hover:text-white"
              >
                {detectingLoc ? <Loader2 size={12} className="animate-spin" /> : <Navigation size={12} />}
                {detectingLoc ? 'Detecting...' : 'Auto Detect'}
              </button>
            </div>
            <form onSubmit={handleCheckout} className="space-y-4">
              <div className="form-group mb-0">
                <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1 block">Phone Number</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
                  <input type="tel" required value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0,10))} placeholder="9876543210" className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg pl-9 pr-4 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
                </div>
              </div>
              <div className="form-group mb-0">
                <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1 block">Street Address</label>
                <input type="text" required value={address} onChange={e => setAddress(e.target.value)} placeholder="Flat No., Street, Locality" className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1 block">PIN Code</label>
                  <div className="relative">
                    <input type="text" required value={postalCode} onChange={handlePinChange} placeholder="560001" className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
                    {pinLoading && <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-primary)] animate-spin" />}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1 block">City</label>
                  <input type="text" required value={city} onChange={e => setCity(e.target.value)} placeholder="Bangalore" className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
                </div>
              </div>

              {/* Payment */}
              <div>
                <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 block mt-2">Payment Method</label>
                <div className="space-y-2">
                  {[
                    { val: 'razorpay', label: '💳 Razorpay (Mock/Test)', badge: 'TEST MODE' },
                    { val: 'cod',      label: '💵 Cash on Delivery',      badge: null },
                  ].map(pm => (
                    <label
                      key={pm.val}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border-2 ${payMethod === pm.val ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10' : 'border-[var(--color-border)] bg-[var(--color-bg)] hover:bg-[var(--color-surface)]'}`}
                    >
                      <input
                        type="radio" name="payment" value={pm.val}
                        checked={payMethod === pm.val}
                        onChange={() => setPayMethod(pm.val)}
                        className="accent-[var(--color-primary)] w-4 h-4"
                      />
                      <span className="text-sm font-bold flex-1 text-[var(--color-text-primary)]">{pm.label}</span>
                      {pm.badge && (
                        <span className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded text-[9px] font-bold tracking-wider">{pm.badge}</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading || cart.length === 0}
                className="btn btn-primary w-full"
                style={{ padding: '14px', borderRadius: '10px', marginTop: '8px' }}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin-loader" />
                ) : (
                  <>
                    <CreditCard size={16} />
                    {payMethod === 'cod' ? 'Place COD Order' : `Pay ₹${finalTotalAmount.toFixed(0)}`}
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
