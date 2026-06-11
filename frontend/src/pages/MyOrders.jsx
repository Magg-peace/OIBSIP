import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ClipboardList, Clock, ArrowLeft, ExternalLink, Download } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const statusBadge = (status) => {
  switch (status) {
    case 'Order Received':  return 'badge badge-info';
    case 'In Kitchen':      return 'badge badge-warning';
    case 'Sent To Delivery':return 'badge badge-primary';
    case 'Delivered':       return 'badge badge-success';
    default:                return 'badge badge-gray';
  }
};

const statusEmoji = (status) => {
  const map = {
    'Order Received':   '📦',
    'In Kitchen':       '👨‍🍳',
    'Sent To Delivery': '🛵',
    'Delivered':        '✅',
  };
  return map[status] || '📋';
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_URL}/orders/my-orders`);
        if (res.data.success) setOrders(res.data.data);
      } catch {
        setError('Failed to load your orders.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[var(--color-bg)] transition-colors duration-500">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-3 border-[var(--color-primary)] border-t-transparent animate-spin-loader" style={{ borderWidth: '3px' }} />
          <p className="text-sm font-bold text-[var(--color-text-secondary)]">Loading orders…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container min-h-screen bg-[var(--color-bg)] transition-colors duration-500 pt-8 px-6">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-bold mb-6 text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors">
        <ArrowLeft size={16} />
        Back to Menu
      </Link>

      <motion.div
        className="flex items-center gap-3 mb-8"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
          <ClipboardList size={22} className="text-[var(--color-primary)]" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold font-display text-[var(--color-text-primary)]">Order History</h1>
          <p className="text-sm font-bold text-[var(--color-text-secondary)]">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>
      </motion.div>

      {error && <div className="alert alert-error mb-6">{error}</div>}

      {orders.length === 0 ? (
        <motion.div
          className="card text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-bold mb-2 font-display text-[var(--color-text-primary)]">No orders yet</h2>
          <p className="text-sm font-medium mb-8 text-[var(--color-text-secondary)]">Place your first order using the Pizza Builder!</p>
          <Link to="/dashboard" className="btn btn-primary-gradient inline-flex">Order Now 🍕</Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card card-highlight group"
              style={{ padding: '20px' }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{statusEmoji(order.status)}</span>
                  <div>
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <span className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                      <span className={statusBadge(order.status)}>{order.status}</span>
                    </div>
                    <p className="text-xs flex items-center gap-1.5 mb-1" style={{ color: 'var(--color-text-tertiary)' }}>
                      <Clock size={11} />
                      {new Date(order.created_at || order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      {order.items.length} pizza{order.items.length > 1 ? 's' : ''}
                      {order.items.map(it => ` · ${it.base} base`).join('')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 border-t md:border-t-0 pt-3 md:pt-0 mt-3 md:mt-0" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="mr-2">
                    <p className="text-[10px] font-semibold uppercase mb-0.5" style={{ color: 'var(--color-text-tertiary)' }}>Total Paid</p>
                    <p className="font-extrabold text-lg" style={{ color: 'var(--color-primary)' }}>₹{(order.total_amount || order.totalAmount || 0).toFixed(0)}</p>
                  </div>
                  
                  <button 
                    onClick={() => {
                      const printWindow = window.open('', '', 'width=800,height=600');
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>Invoice #${order._id.slice(-8).toUpperCase()}</title>
                            <style>
                              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
                              .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
                              .logo { font-size: 24px; font-weight: 900; color: #f97316; }
                              table { border-collapse: collapse; margin-top: 20px; width: 100%; }
                              th, td { border-bottom: 1px solid #eee; padding: 12px; text-align: left; }
                              th { color: #888; font-size: 12px; text-transform: uppercase; }
                              .total { font-size: 20px; font-weight: bold; margin-top: 30px; text-align: right; color: #f97316; }
                            </style>
                          </head>
                          <body>
                            <div class="header">
                              <div class="logo">🍕 PizzaHub Invoice</div>
                              <div style="text-align:right">
                                <b>Order ID:</b> #${order._id.slice(-8).toUpperCase()}<br/>
                                <b>Date:</b> ${new Date(order.created_at || order.createdAt).toLocaleString()}<br/>
                                <b>Status:</b> ${order.status}
                              </div>
                            </div>
                            <h3>Order Details</h3>
                            <table>
                              <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
                              ${order.items.map(it => `
                                <tr>
                                  <td><b>Custom Pizza</b><br><small>${it.base}, ${it.sauce}, ${it.cheese}</small></td>
                                  <td>${it.quantity || 1}</td>
                                  <td>₹${(it.price * (it.quantity || 1)).toFixed(2)}</td>
                                </tr>
                              `).join('')}
                            </table>
                            <div class="total">Grand Total: ₹${(order.total_amount || order.totalAmount || 0).toFixed(2)}</div>
                            <script>
                              window.onload = function() { window.print(); }
                            </script>
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-[var(--color-bg)] hover:bg-[var(--color-border)] rounded-lg text-xs font-bold transition-colors border border-[var(--color-border)]"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    <Download size={14} /> PDF
                  </button>

                  <Link
                    to={`/orders/${order._id}`}
                    className="flex items-center gap-1.5 px-3 py-2 bg-[var(--color-bg)] hover:bg-[var(--color-border)] rounded-lg text-xs font-bold transition-colors border border-[var(--color-border)]"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    <ExternalLink size={14} />
                    Track
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
