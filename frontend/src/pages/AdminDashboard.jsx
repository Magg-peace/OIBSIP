import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  LayoutDashboard, ShoppingBag, PackageSearch, PenTool, Users, Activity, Settings, LogOut,
  Flame, Truck, CheckCircle2, AlertCircle, Pizza, Clock, ArrowRight, Bell, Search, Star
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityFeed, setActivityFeed] = useState([
    { id: 1, text: 'System Online. Kitchen ready.', time: 'Just now', type: 'system' }
  ]);

  const fetchDashboardData = async () => {
    try {
      const ordersRes = await axios.get(`${API_URL}/orders`);
      const inventoryRes = await axios.get(`${API_URL}/inventory`);

      if (ordersRes.data.success) setOrders(ordersRes.data.data);
      if (inventoryRes.data.success) setInventory(inventoryRes.data.data);
    } catch (err) {
      console.error('Failed to load admin dataset:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket'] });
    
    socket.on('newOrder', (newOrder) => {
      setOrders((prev) => [newOrder, ...prev]);
      addActivity(`New Order #${newOrder._id.slice(-4).toUpperCase()} received`, 'order');
    });
    
    socket.on('orderUpdated', (updated) => {
      setOrders((prev) => prev.map((ord) => (ord._id === updated._id ? updated : ord)));
      addActivity(`Order #${updated._id.slice(-4).toUpperCase()} is now ${updated.status}`, 'update');
    });
    
    return () => socket.disconnect();
  }, []);

  const addActivity = (text, type) => {
    setActivityFeed(prev => [{ id: Date.now(), text, time: 'Just now', type }, ...prev].slice(0, 5));
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`${API_URL}/orders/${orderId}/status`, { status: newStatus });
      if (response.data.success) {
        setOrders(orders.map((o) => (o._id === orderId ? response.data.data : o)));
        addActivity(`Updated #${orderId.slice(-4).toUpperCase()} to ${newStatus}`, 'update');
      }
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  // Metrics
  const ordersToday = orders.length; // In a real app, filter by today's date
  const inKitchen = orders.filter(o => o.status === 'In Kitchen').length;
  const outForDelivery = orders.filter(o => o.status === 'Sent To Delivery').length;
  const delivered = orders.filter(o => o.status === 'Delivered').length;
  const received = orders.filter(o => o.status === 'Order Received').length;
  
  const lowStockItems = inventory.filter(i => i.quantity <= i.threshold);
  const lowStockCount = lowStockItems.length;

  if (loading) {
    return <div className="min-h-screen bg-[#161925] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-transparent border-t-[#FF8E8B] animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#12141D] text-white flex font-sans relative overflow-hidden">
      
      {/* Pizza Themed Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay z-0" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#FF8E8B] rounded-full blur-[200px] opacity-[0.05] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#FAA307] rounded-full blur-[150px] opacity-[0.03] pointer-events-none z-0" />

      {/* Sidebar */}
      <div className="w-[240px] bg-[#1A1D27] flex flex-col fixed h-full left-0 top-0 border-r border-[#2A2E43] z-20 shadow-2xl">
        <div className="p-6">
          <h1 className="text-2xl font-black text-white mb-0.5 tracking-tight flex items-center gap-2">
            <span>🍕</span> PizzaHub.
          </h1>
          <p className="text-[#FF8E8B] text-[10px] uppercase font-black tracking-widest mt-1">Ops Center</p>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-1">
          <Link to="/admin/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold mb-2 transition-all ${location.pathname === '/admin/dashboard' ? 'bg-gradient-to-r from-[#FF8E8B] to-[#FF6B6B] text-white shadow-[0_4px_20px_rgba(255,142,139,0.3)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <button onClick={() => toast('Live Orders dedicated page coming soon!')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl font-semibold cursor-pointer transition-colors">
            <ShoppingBag size={18} /> Live Orders
          </button>
          <Link to="/admin/inventory" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold cursor-pointer transition-colors ${location.pathname === '/admin/inventory' ? 'bg-gradient-to-r from-[#FF8E8B] to-[#FF6B6B] text-white shadow-[0_4px_20px_rgba(255,142,139,0.3)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <PackageSearch size={18} /> Inventory
          </Link>
          <button onClick={() => toast('Menu Editor coming soon!')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl font-semibold cursor-pointer transition-colors">
            <PenTool size={18} /> Menu Editor
          </button>
        </nav>

        <div className="p-4 px-6 space-y-4 mb-4">
          <div 
            onClick={handleLogout}
            className="flex items-center gap-3 text-gray-400 hover:text-white font-semibold cursor-pointer transition-colors border border-dashed border-[#2A2E43] hover:border-gray-500 rounded-xl px-4 py-2 mt-2"
          >
            <LogOut size={18} /> Logout
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-[240px] p-8 max-w-[1400px] mx-auto w-full relative z-10">
        
        {/* Header */}
        <header className="flex items-end justify-between mb-8 border-b border-[#2A2E43] pb-6">
          <div>
            <h2 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-3">
              Good Morning, {user?.name?.split(' ')[0] || 'Kitchen Lead'} <span className="text-2xl animate-bounce-slow">👨‍🍳</span>
            </h2>
            <p className="text-gray-400 text-sm font-medium">
              Today you've processed <strong className="text-white">{ordersToday} pizzas</strong>. {received} orders waiting for preparation.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => toast('No new notifications!')} className="flex items-center gap-2 bg-[#1A1D27] px-4 py-2 rounded-lg border border-[#2A2E43] text-sm text-gray-300 hover:text-white shadow-lg transition-colors">
              <Bell size={16} /> Notifications
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF8E8B] to-purple-500 flex items-center justify-center text-sm font-bold shadow-md cursor-pointer border-2 border-[#161925]">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* 4 Core Pizza Metrics */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-[#1A1D27] rounded-2xl p-5 border border-[#2A2E43] shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity text-6xl">🍕</div>
            <div className="flex items-center gap-3 text-gray-400 text-xs font-black tracking-wider uppercase mb-3">
              <div className="bg-[#3B82F6]/20 p-2 rounded-lg text-[#3B82F6]"><Pizza size={16} /></div>
              Orders Today
            </div>
            <div className="text-4xl font-black text-white">{ordersToday}</div>
          </div>

          <div className="bg-[#1A1D27] rounded-2xl p-5 border border-[#2A2E43] shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity text-6xl">🔥</div>
            <div className="flex items-center gap-3 text-gray-400 text-xs font-black tracking-wider uppercase mb-3">
              <div className="bg-[#F59E0B]/20 p-2 rounded-lg text-[#F59E0B]"><Flame size={16} /></div>
              Pizzas In Kitchen
            </div>
            <div className="text-4xl font-black text-white">{inKitchen}</div>
          </div>

          <div className="bg-[#1A1D27] rounded-2xl p-5 border border-[#2A2E43] shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity text-6xl">🛵</div>
            <div className="flex items-center gap-3 text-gray-400 text-xs font-black tracking-wider uppercase mb-3">
              <div className="bg-[#10B981]/20 p-2 rounded-lg text-[#10B981]"><Truck size={16} /></div>
              Out for Delivery
            </div>
            <div className="text-4xl font-black text-white">{outForDelivery}</div>
          </div>

          <div className="bg-[#1A1D27] rounded-2xl p-5 border border-[#2A2E43] shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity text-6xl">⚠️</div>
            <div className="flex items-center gap-3 text-[#FF8E8B] text-xs font-black tracking-wider uppercase mb-3">
              <div className="bg-[#FF8E8B]/20 p-2 rounded-lg text-[#FF8E8B]"><AlertCircle size={16} /></div>
              Low Stock Alert
            </div>
            <div className="text-4xl font-black text-[#FF8E8B]">{lowStockCount}</div>
          </div>
        </div>

        {/* Live Orders Flow Board */}
        <div className="bg-[#1A1D27] rounded-2xl p-6 border border-[#2A2E43] shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#FF8E8B] to-[#FAA307]" />
          <h3 className="text-lg font-black text-white mb-6 ml-2 flex items-center gap-2">
            <Activity size={18} className="text-[#FF8E8B]" /> Live Operations Flow
          </h3>
          
          <div className="grid grid-cols-4 gap-4 pl-2">
            <div className="p-4 rounded-xl border border-[#2A2E43] bg-[#12141D] flex flex-col items-center justify-center text-center relative shadow-inner">
              <div className="text-[#3B82F6] font-black text-xs tracking-widest uppercase mb-1">Received</div>
              <div className="text-3xl font-black text-white">{received}</div>
              <ArrowRight className="absolute -right-5 top-1/2 -translate-y-1/2 text-[#2A2E43]" size={24} />
            </div>
            <div className="p-4 rounded-xl border border-[#F59E0B]/30 bg-[#F59E0B]/5 flex flex-col items-center justify-center text-center relative shadow-[0_0_15px_rgba(245,158,11,0.05)]">
              <div className="text-[#F59E0B] font-black text-xs tracking-widest uppercase mb-1">In Kitchen</div>
              <div className="text-3xl font-black text-white">{inKitchen}</div>
              <ArrowRight className="absolute -right-5 top-1/2 -translate-y-1/2 text-[#2A2E43]" size={24} />
            </div>
            <div className="p-4 rounded-xl border border-[#2A2E43] bg-[#12141D] flex flex-col items-center justify-center text-center relative shadow-inner">
              <div className="text-[#10B981] font-black text-xs tracking-widest uppercase mb-1">Delivery</div>
              <div className="text-3xl font-black text-white">{outForDelivery}</div>
              <ArrowRight className="absolute -right-5 top-1/2 -translate-y-1/2 text-[#2A2E43]" size={24} />
            </div>
            <div className="p-4 rounded-xl border border-[#2A2E43] bg-[#12141D] flex flex-col items-center justify-center text-center shadow-inner">
              <div className="text-gray-400 font-black text-xs tracking-widest uppercase mb-1">Delivered</div>
              <div className="text-3xl font-black text-white">{delivered}</div>
            </div>
          </div>
        </div>

        {/* 2-Column Main Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Col: Orders */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* Recent Orders Table */}
            <div className="bg-[#1A1D27] rounded-2xl border border-[#2A2E43] shadow-xl overflow-hidden">
              <div className="p-6 border-b border-[#2A2E43] flex justify-between items-center bg-[#1E2233]/50">
                <h3 className="text-lg font-black text-white">Recent Orders</h3>
                <span onClick={() => toast('Order History page coming soon!')} className="text-xs font-bold text-[#FF8E8B] hover:text-white cursor-pointer transition-colors">View All</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#12141D] text-[10px] font-black text-gray-500 tracking-widest uppercase">
                      <th className="py-4 px-6 border-b border-[#2A2E43]">Order</th>
                      <th className="py-4 px-6 border-b border-[#2A2E43]">Pizza Details</th>
                      <th className="py-4 px-6 border-b border-[#2A2E43]">Status</th>
                      <th className="py-4 px-6 border-b border-[#2A2E43] text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 6).map((order) => (
                      <tr key={order._id} className="border-b border-[#2A2E43]/50 hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-sm text-white mb-0.5">#{order._id.substring(order._id.length - 4).toUpperCase()}</div>
                          <div className="text-[10px] text-gray-500 font-medium flex items-center gap-1"><Clock size={10}/> {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-bold text-sm text-gray-300">
                            {order.items.length}x Custom Pizza
                          </div>
                          <div className="text-[10px] text-gray-500 mt-0.5 max-w-[200px] truncate">
                            {order.items.map(i => i.base).join(', ')}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest border ${
                            order.status === 'Delivered' ? 'text-[#10B981] border-[#10B981]/30 bg-[#10B981]/10' :
                            order.status === 'Order Received' ? 'text-[#3B82F6] border-[#3B82F6]/30 bg-[#3B82F6]/10' :
                            order.status === 'In Kitchen' ? 'text-[#F59E0B] border-[#F59E0B]/30 bg-[#F59E0B]/10' :
                            'text-[#8B5CF6] border-[#8B5CF6]/30 bg-[#8B5CF6]/10'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className="bg-[#12141D] border border-[#2A2E43] text-gray-300 text-xs font-bold px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#FF8E8B] hover:border-gray-500 transition-colors cursor-pointer"
                          >
                            <option value="Order Received">Received</option>
                            <option value="In Kitchen">Kitchen</option>
                            <option value="Sent To Delivery">Delivery</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr><td colSpan="4" className="py-8 text-center text-gray-500 text-sm font-medium">No active orders.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Col: Kitchen Queue, Inventory Health, Activity */}
          <div className="space-y-8">
            
            {/* Kitchen Queue (Visual List) */}
            <div className="bg-[#1A1D27] rounded-2xl border border-[#2A2E43] shadow-xl p-6">
              <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                <Flame size={18} className="text-[#F59E0B]" /> Kitchen Queue
              </h3>
              <div className="space-y-3">
                {orders.filter(o => o.status === 'Order Received' || o.status === 'In Kitchen').slice(0, 4).map((o, idx) => (
                  <div key={o._id} className="p-3 rounded-xl bg-[#12141D] border border-[#2A2E43] flex gap-3 items-center">
                    <div className="w-8 h-8 rounded-full bg-[#1A1D27] flex items-center justify-center font-black text-gray-400 border border-[#2A2E43]">{idx + 1}</div>
                    <div className="flex-1">
                      <div className="font-bold text-sm text-white">{o.items[0]?.base || 'Pizza'} <span className="text-xs text-gray-500">{o.items.length > 1 ? `+${o.items.length-1}` : ''}</span></div>
                      <div className="text-[10px] text-[#F59E0B] font-bold tracking-wider uppercase">Est. 18 mins</div>
                    </div>
                  </div>
                ))}
                {orders.filter(o => o.status === 'Order Received' || o.status === 'In Kitchen').length === 0 && (
                  <p className="text-xs text-gray-500 font-medium">Queue is empty.</p>
                )}
              </div>
            </div>

            {/* Inventory Health */}
            <div className="bg-[#1A1D27] rounded-2xl border border-[#2A2E43] shadow-xl p-6">
              <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                <PackageSearch size={18} className="text-[#10B981]" /> Inventory Health
              </h3>
              <div className="space-y-4">
                {inventory.slice(0, 5).map(item => {
                  const percent = Math.min(100, Math.max(0, (item.quantity / (item.threshold * 3)) * 100));
                  const isLow = item.quantity <= item.threshold;
                  return (
                    <div key={item._id}>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-gray-300">{item.name}</span>
                        <span className={isLow ? 'text-[#FF8E8B]' : 'text-gray-400'}>{item.quantity} left</span>
                      </div>
                      <div className="w-full h-2 bg-[#12141D] rounded-full overflow-hidden border border-[#2A2E43]">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${isLow ? 'bg-[#FF8E8B]' : 'bg-[#10B981]'}`} 
                          style={{ width: `${Math.max(5, percent)}%` }} 
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              <button onClick={() => navigate('/admin/inventory')} className="w-full mt-5 py-2.5 rounded-lg border border-[#2A2E43] text-xs font-bold text-gray-400 hover:text-white hover:bg-[#2A2E43] transition-colors">
                View Full Inventory
              </button>
            </div>

            {/* Recent Activity Feed */}
            <div className="bg-[#1A1D27] rounded-2xl border border-[#2A2E43] shadow-xl p-6">
              <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                <Activity size={18} className="text-[#8B5CF6]" /> Activity Feed
              </h3>
              <div className="space-y-4">
                {activityFeed.map((feed, i) => (
                  <div key={feed.id} className="flex gap-3 items-start relative">
                    {i !== activityFeed.length - 1 && <div className="absolute left-2.5 top-6 bottom-[-16px] w-[1px] bg-[#2A2E43]" />}
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center z-10 flex-shrink-0 mt-0.5 ${
                      feed.type === 'order' ? 'bg-[#3B82F6]/20 text-[#3B82F6]' : 
                      feed.type === 'update' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' : 
                      'bg-gray-700/50 text-gray-400'
                    }`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-current" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-300">{feed.text}</p>
                      <p className="text-[10px] text-gray-500 font-medium mt-0.5">{feed.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
