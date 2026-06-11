import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ClipboardList, Plus, Trash2, Edit2, X, AlertTriangle, ShieldAlert, Sparkles, Filter } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states for Add/Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null if adding
  const [name, setName] = useState('');
  const [type, setType] = useState('base');
  const [quantity, setQuantity] = useState(0);
  const [threshold, setThreshold] = useState(10);
  const [price, setPrice] = useState(0);
  
  // Filters
  const [typeFilter, setTypeFilter] = useState('all');

  const fetchInventory = async () => {
    try {
      const response = await axios.get(`${API_URL}/inventory`);
      if (response.data.success) {
        setInventory(response.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch inventory logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setType('base');
    setQuantity(0);
    setThreshold(10);
    setPrice(0);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setName(item.name);
    setType(item.type);
    setQuantity(item.quantity);
    setThreshold(item.threshold);
    setPrice(item.price);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const payload = { name, type, quantity: Number(quantity), threshold: Number(threshold), price: Number(price) };

    try {
      if (editingItem) {
        // Update Item
        const response = await axios.put(`${API_URL}/inventory/${editingItem._id}`, payload);
        if (response.data.success) {
          setSuccess('Ingredient updated successfully!');
          fetchInventory();
        }
      } else {
        // Add Item
        const response = await axios.post(`${API_URL}/inventory`, payload);
        if (response.data.success) {
          setSuccess('New ingredient added successfully!');
          fetchInventory();
        }
      }
      setModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ingredient?')) return;
    setError('');
    setSuccess('');

    try {
      const response = await axios.delete(`${API_URL}/inventory/${id}`);
      if (response.data.success) {
        setSuccess('Ingredient deleted successfully!');
        fetchInventory();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Delete operation failed.');
    }
  };

  const filteredInventory = inventory.filter((item) => {
    if (typeFilter === 'all') return true;
    return item.type === typeFilter;
  });

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-800 pb-6 mb-8 gap-4">
        <div>
          <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded">
            Stock Operations Room
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white uppercase mt-2 flex items-center gap-2">
            <ClipboardList className="h-8 w-8 text-orange-500" />
            INVENTORY MANAGER
          </h1>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-xl text-sm font-bold text-white transition-all duration-300 shadow-neon-orange"
        >
          <Plus className="h-4 w-4" />
          <span>Add Ingredient</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-semibold">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold">
          {success}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6">
        <Filter className="h-4 w-4 text-gray-500 mr-2" />
        {['all', 'base', 'sauce', 'cheese', 'veg'].map((filter) => (
          <button
            key={filter}
            onClick={() => setTypeFilter(filter)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all duration-300 ${
              typeFilter === filter
                ? 'border-orange-500/40 bg-orange-500/10 text-orange-500'
                : 'border-gray-800 bg-[#111827]/40 text-gray-400 hover:text-white'
            }`}
          >
            {filter === 'veg' ? 'Vegetables' : filter}
          </button>
        ))}
      </div>

      {/* Inventory Table */}
      <div className="bg-[#111827]/85 border border-gray-800 rounded-3xl p-6 shadow-glass">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-800 text-xs font-bold text-gray-500 uppercase">
                <th className="py-3 px-4">Ingredient Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Stock Level</th>
                <th className="py-3 px-4">Min Threshold</th>
                <th className="py-3 px-4">Unit Price (₹)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-sm">
              {filteredInventory.map((item) => {
                const isLowStock = item.quantity <= item.threshold;
                return (
                  <tr key={item._id} className={`hover:bg-gray-800/10 ${isLowStock ? 'bg-orange-500/[0.02]' : ''}`}>
                    <td className="py-4 px-4 font-bold text-white flex items-center space-x-2">
                      <span>{item.name}</span>
                      {isLowStock && (
                        <span className="p-1 bg-amber-500/15 border border-amber-500/20 text-amber-500 rounded text-[10px] flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Low Stock
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-xs uppercase text-gray-400 font-semibold">{item.type}</td>
                    <td className="py-4 px-4">
                      <span className={`font-bold ${isLowStock ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {item.quantity}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-400">{item.threshold}</td>
                    <td className="py-4 px-4 font-extrabold text-orange-500">₹{item.price.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end items-center space-x-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-500/10 rounded-xl transition-all"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredInventory.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500 text-sm">
                    No ingredients listed.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 backdrop-blur-sm p-4">
          <div className="bg-[#111827] border border-gray-800 rounded-3xl w-full max-w-md p-6 relative shadow-glass animate-fade-in">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white bg-gray-800/40 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6">
              {editingItem ? 'Edit Ingredient' : 'Add New Ingredient'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Ingredient Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mozzarella"
                  className="block w-full px-4 py-2.5 bg-[#0b0f19] border border-gray-800 rounded-xl text-gray-200 focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-[#0b0f19] border border-gray-800 rounded-xl text-gray-200 focus:outline-none focus:border-orange-500 text-sm font-semibold"
                >
                  <option value="base">Base Crust</option>
                  <option value="sauce">Sauce</option>
                  <option value="cheese">Cheese Type</option>
                  <option value="veg">Vegetables</option>
                </select>
              </div>

              {/* Quantity & Threshold */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Stock Qty</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="block w-full px-4 py-2.5 bg-[#0b0f19] border border-gray-800 rounded-xl text-gray-200 focus:outline-none focus:border-orange-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Alert Level</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    className="block w-full px-4 py-2.5 bg-[#0b0f19] border border-gray-800 rounded-xl text-gray-200 focus:outline-none focus:border-orange-500 text-sm"
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Unit Price (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-[#0b0f19] border border-gray-800 rounded-xl text-gray-200 focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3 mt-6 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl font-bold text-xs text-gray-400 bg-gray-800/40 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl font-bold text-xs text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-neon-orange"
                >
                  Save Ingredient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;
