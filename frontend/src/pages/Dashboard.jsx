import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import PizzaBuilder from '../components/PizzaBuilder';
import { ShoppingBag, Clock, CheckCircle, Heart, Star } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [userOrders, setUserOrders] = useState([]);
  
  useEffect(() => {
    // Fetch user orders to calculate stats
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_URL}/orders/my-orders`);
        // If not admin, the backend only returns their own orders
        if (res.data.success) {
          setUserOrders(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch orders for dashboard stats', err);
      }
    };
    fetchOrders();
  }, []);

  const totalOrders = userOrders.length;
  const activeOrders = userOrders.filter(o => ['Order Received', 'In Kitchen', 'Sent To Delivery'].includes(o.status)).length;
  const completedOrders = userOrders.filter(o => o.status === 'Delivered').length;

  const userStats = [
    { label: 'Total Orders', value: totalOrders, icon: ShoppingBag, color: '#4F46E5', bg: '#EEF2FF' },
    { label: 'Active Orders', value: activeOrders, icon: Clock, color: '#F59E0B', bg: '#FEF3C7' },
    { label: 'Completed', value: completedOrders, icon: CheckCircle, color: '#10B981', bg: '#D1FAE5' },
    { label: 'Favorite Pizza', value: 'Margherita', icon: Heart, color: '#EC4899', bg: '#FCE7F3' },
  ];

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }} className="pt-8 transition-colors duration-500">
      
      {/* Welcome Section */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold font-display mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Hello {user?.name?.split(' ')[0] || 'Chef'} 👋
            </h1>
            <p className="text-lg font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              Ready to build your masterpiece today?
            </p>
          </div>
          <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold text-sm">
            <Star size={16} className="fill-current" /> PizzaHub Premium Member
          </div>
        </motion.div>
      </section>

      {/* User Dashboard Cards */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {userStats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card flex items-center gap-4 p-5 hover:border-[var(--color-primary)] transition-all cursor-default"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: stat.bg, color: stat.color }}>
                <stat.icon size={20} />
              </div>
              <div>
                <div className="text-2xl font-black font-display" style={{ color: 'var(--color-text-primary)' }}>{stat.value}</div>
                <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pizza Builder */}
      <section id="pizza-builder" className="py-12 px-6 relative border-t" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-12 text-center"
          >
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 font-display" style={{ color: 'var(--color-text-primary)' }}>
              Interactive{' '}
              <span style={{ color: 'var(--color-primary)' }}>Pizza Builder</span>
            </h2>
            <p className="text-base font-medium max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              Step-by-step customization. Choose your crust, sauce, cheese, and fresh veggies. Watch your pizza come to life instantly.
            </p>
          </motion.div>
          
          <PizzaBuilder />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
