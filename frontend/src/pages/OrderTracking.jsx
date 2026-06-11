import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import OrderStepper from '../components/OrderStepper';
import { ArrowLeft, Clock, MapPin, Receipt, CheckCircle, ChefHat, Timer, Flame, Package } from 'lucide-react';

const API_URL    = import.meta.env.VITE_API_URL    || 'http://localhost:5000/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const OrderTracking = () => {
  const { id } = useParams();
  const [order,           setOrder]           = useState(null);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState('');
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_URL}/orders/${id}`);
        if (res.data.success) setOrder(res.data.data);
      } catch {
        setError('Order not found.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const socket = io(SOCKET_URL, { transports: ['websocket'] });
    socket.on('connect', () => { setSocketConnected(true); socket.emit('joinOrderRoom', id); });
    socket.on(`orderStatus_${id}`, data => setOrder(p => p ? { ...p, status: data.status, updatedAt: new Date().toISOString() } : null));
    socket.on('disconnect', () => setSocketConnected(false));
    return () => { socket.emit('leaveOrderRoom', id); socket.disconnect(); };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[var(--color-bg)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-t-[var(--color-primary)] animate-spin-loader" style={{ border: '3px solid var(--color-border)', borderTopColor: 'var(--color-primary)' }} />
          <p className="text-[var(--color-text-tertiary)] text-sm">Fetching order status…</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-[var(--color-bg)]">
        <div className="text-5xl mb-4">⚠️</div>
        <p className="text-lg font-bold mb-4 text-[var(--color-text-primary)]">{error || 'Order not found.'}</p>
        <Link to="/my-orders" className="btn btn-primary">View All Orders</Link>
      </div>
    );
  }

  // Calculate ETA based on status
  let etaMinutes = 35;
  let etaText = "35 mins";
  let statusColor = "var(--color-info)";
  let statusMessage = "Waiting for confirmation";
  
  if (order.status === 'In Kitchen') {
    etaMinutes = 20;
    etaText = "20 mins";
    statusColor = "var(--color-warning)";
    statusMessage = "👨‍🍳 Preparing Fresh";
  } else if (order.status === 'Sent To Delivery') {
    etaMinutes = 10;
    etaText = "10 mins";
    statusColor = "var(--color-primary)";
    statusMessage = "🚚 Rider Assigned";
  } else if (order.status === 'Delivered') {
    etaMinutes = 0;
    etaText = "Arrived";
    statusColor = "var(--color-success)";
    statusMessage = "🏠 Delivered Successfully";
  }

  // Timeline Events Mockup (Ideally driven by backend history array)
  const timelineEvents = [
    { label: 'Order Received', time: new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), done: true },
    { label: 'Pizza In Kitchen', time: order.status === 'Order Received' ? '...' : new Date(new Date(order.createdAt).getTime() + 5*60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), done: ['In Kitchen', 'Sent To Delivery', 'Delivered'].includes(order.status) },
    { label: 'Out For Delivery', time: ['Sent To Delivery', 'Delivered'].includes(order.status) ? new Date(new Date(order.createdAt).getTime() + 20*60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...', done: ['Sent To Delivery', 'Delivered'].includes(order.status) },
    { label: 'Delivered', time: order.status === 'Delivered' ? new Date(order.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...', done: order.status === 'Delivered' }
  ];

  return (
    <div className="page-container bg-[var(--color-bg)] min-h-screen pb-12 pt-6">
      <div className="max-w-6xl mx-auto">
        
        <Link to="/my-orders" className="inline-flex items-center gap-1.5 text-sm font-semibold mb-6 transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
          <ArrowLeft size={16} />
          Back to Orders
        </Link>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black font-display text-[var(--color-text-primary)] tracking-tight">
                Your Pizza Journey
              </h1>
              {socketConnected && (
                <span className="flex h-3 w-3 relative mt-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-[var(--color-text-tertiary)] uppercase tracking-widest">
              Order #{order._id.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Tracker, ETA, Kitchen View */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* The Main Tracker */}
            <motion.div className="card border-[var(--color-border)] shadow-xl relative overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
              <OrderStepper currentStatus={order.status} />
            </motion.div>

            {/* ETA & Live Kitchen View Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* ETA Card */}
              <motion.div className="card shadow-lg bg-[var(--color-surface)] border-[var(--color-border)]" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                    <Timer size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1">Estimated Arrival</p>
                    <div className="text-3xl font-black text-[var(--color-text-primary)]">
                      {etaText}
                    </div>
                    {order.status !== 'Delivered' && (
                      <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                        Arriving by {new Date(new Date().getTime() + etaMinutes*60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Live Kitchen View */}
              <motion.div className="card shadow-lg border-[var(--color-border)] relative overflow-hidden group" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 z-0" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold">
                      <Flame size={18} className="animate-pulse" />
                      Live Kitchen Queue
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded-md bg-white/10 border border-[var(--color-border)] text-[var(--color-text-secondary)]">LIVE</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase mb-1">Your Position</p>
                      <div className="text-4xl font-black text-[var(--color-text-primary)] flex items-baseline gap-1">
                        #2
                        <span className="text-sm font-bold text-[var(--color-text-tertiary)] ml-1">in queue</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase mb-1">Est. Bake Time</p>
                      <p className="text-xl font-bold text-[var(--color-primary)]">7 mins</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Order Timeline */}
            <motion.div className="card shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h3 className="font-bold text-lg mb-6 text-[var(--color-text-primary)]">Order Timeline</h3>
              <div className="space-y-6">
                {timelineEvents.map((ev, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full border-2 z-10 ${ev.done ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'bg-[var(--color-surface)] border-[var(--color-border)]'}`} />
                      {idx !== timelineEvents.length - 1 && (
                        <div className={`w-0.5 h-10 mt-1 ${ev.done ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'}`} />
                      )}
                    </div>
                    <div className="-mt-1.5 flex-1">
                      <div className="flex justify-between items-start">
                        <p className={`font-bold ${ev.done ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-tertiary)]'}`}>
                          {ev.label}
                        </p>
                        <p className={`text-sm font-semibold ${ev.done ? 'text-[var(--color-text-secondary)]' : 'text-[var(--color-text-tertiary)]'}`}>
                          {ev.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* RIGHT COLUMN: Details */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Delivery Card */}
            <motion.div className="card shadow-lg relative overflow-hidden" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: statusColor }} />
              <h3 className="font-bold text-base mb-4 flex items-center gap-2 text-[var(--color-text-primary)]">
                <MapPin size={16} className="text-[var(--color-primary)]" />
                Delivery Details
              </h3>
              
              <div className="mb-5 p-3 rounded-xl flex items-center gap-3 border" style={{ backgroundColor: `color-mix(in srgb, ${statusColor} 10%, transparent)`, borderColor: `color-mix(in srgb, ${statusColor} 20%, transparent)` }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/50 text-xl">
                  {order.status === 'In Kitchen' ? '👨‍🍳' : order.status === 'Sent To Delivery' ? '🛵' : order.status === 'Delivered' ? '🏠' : '📝'}
                </div>
                <div className="font-bold text-[var(--color-text-primary)] text-sm">
                  {statusMessage}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-[var(--color-text-tertiary)]">Customer</p>
                  <p className="text-sm font-bold text-[var(--color-text-primary)]">{order.user?.name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-[var(--color-text-tertiary)]">Address</p>
                  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {order.shippingAddress?.address},<br />
                    {order.shippingAddress?.city} – {order.shippingAddress?.postalCode}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-[var(--color-text-tertiary)]">Phone</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">{order.shippingAddress?.phone}</p>
                </div>
              </div>
            </motion.div>

            {/* Receipt Card with Pizza Thumbnail */}
            <motion.div className="card shadow-lg" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <h3 className="font-bold text-base mb-4 flex items-center gap-2 text-[var(--color-text-primary)]">
                <Receipt size={16} className="text-[var(--color-primary)]" />
                Order Summary
              </h3>
              
              <div className="divide-y divide-[var(--color-border)] mb-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-4 flex gap-4 items-start">
                    {/* Tiny Pizza Visual */}
                    <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/10 flex-shrink-0 flex items-center justify-center border border-[var(--color-border)] relative overflow-hidden">
                       <div className="text-3xl relative z-10">🍕</div>
                       <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-red-500/20" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-bold text-[var(--color-text-primary)] text-sm">Custom Pizza</p>
                        <span className="font-black text-[var(--color-primary)]">₹{(item.price * item.quantity).toFixed(0)}</span>
                      </div>
                      <p className="text-xs font-bold text-[var(--color-text-tertiary)] mb-1">Qty: {item.quantity}</p>
                      <ul className="text-xs text-[var(--color-text-secondary)] space-y-0.5 list-disc list-inside">
                        <li>{item.base} Crust</li>
                        <li>{item.sauce}</li>
                        <li>{item.cheese}</li>
                        {item.vegetables?.length > 0 && (
                          <li className="text-[var(--color-text-tertiary)] italic">+{item.vegetables.join(', ')}</li>
                        )}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-[var(--color-border)] pt-4 space-y-2 bg-[var(--color-surface)]">
                {[
                  { l: 'Subtotal',     v: `₹${order.subtotal?.toFixed(2) || '0.00'}` },
                  { l: 'Tax (5%)',     v: `₹${order.tax?.toFixed(2) || '0.00'}` },
                  { l: 'Delivery',     v: `₹${order.deliveryFee?.toFixed(2) || '0.00'}` },
                ].map(r => (
                  <div key={r.l} className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-secondary)] font-semibold">{r.l}</span>
                    <span className="font-bold text-[var(--color-text-primary)]">{r.v}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center font-extrabold border-t border-[var(--color-border)] pt-4 mt-2">
                  <span className="text-[var(--color-text-primary)] text-base">Grand Total</span>
                  <span className="text-[var(--color-primary)] text-2xl font-black bg-[var(--color-primary)]/10 px-3 py-1 rounded-xl">₹{order.totalAmount?.toFixed(0)}</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
