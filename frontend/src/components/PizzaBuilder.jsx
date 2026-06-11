import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import PizzaCanvas from './PizzaCanvas';
import { ArrowRight, ArrowLeft, ShoppingCart, Check, Info, Sparkles } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PizzaBuilder = () => {
  const { addToCart } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Built Pizza Config State
  const [selectedBase, setSelectedBase] = useState('');
  const [selectedSauce, setSelectedSauce] = useState('');
  const [selectedCheese, setSelectedCheese] = useState('');
  const [selectedVeggies, setSelectedVeggies] = useState([]);

  useEffect(() => {
    const fetchAvailable = async () => {
      try {
        const response = await axios.get(`${API_URL}/inventory/available`);
        if (response.data.success) {
          const data = response.data.data;
          setAvailableIngredients(data);

          const bases = data.filter(item => item.type === 'base');
          const sauces = data.filter(item => item.type === 'sauce');
          const cheeses = data.filter(item => item.type === 'cheese');

          if (bases.length > 0) setSelectedBase(bases[0].name);
          if (sauces.length > 0) setSelectedSauce(sauces[0].name);
          if (cheeses.length > 0) setSelectedCheese(cheeses[0].name);
        }
      } catch (error) {
        console.error('Failed to load ingredients:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailable();
  }, []);

  const getIngredientsByType = (type) => availableIngredients.filter((item) => item.type === type);

  const toggleVeggie = (vegName) => {
    setSelectedVeggies((prev) =>
      prev.includes(vegName) ? prev.filter((v) => v !== vegName) : [...prev, vegName]
    );
  };

  const getPrice = (type, name) => getIngredientsByType(type).find((i) => i.name === name)?.price || 0;
  const getVeggiesPrice = () => selectedVeggies.reduce((acc, veg) => acc + getPrice('veg', veg), 0);
  const calculatedPrice = getPrice('base', selectedBase) + getPrice('sauce', selectedSauce) + getPrice('cheese', selectedCheese) + getVeggiesPrice();

  const handleAddToCart = () => {
    addToCart({ base: selectedBase, sauce: selectedSauce, cheese: selectedCheese, vegetables: selectedVeggies, price: calculatedPrice, quantity: 1 });
    setMessage('🍕 Added to cart!');
    setTimeout(() => { setMessage(''); setCurrentStep(0); setSelectedVeggies([]); }, 2500);
  };

  const goToStep = (idx) => { setDirection(idx > currentStep ? 1 : -1); setCurrentStep(idx); };

  const steps = [
    { title: 'Base',   desc: 'Choose your crust' },
    { title: 'Sauce',  desc: 'Pick a flavor' },
    { title: 'Cheese', desc: 'Select the melt' },
    { title: 'Veggies',desc: 'Add some crunch' },
  ];

  const renderSelectionGrid = (type, selectedValue, onSelect, isMulti = false) => {
    const items = getIngredientsByType(type);
    if (items.length === 0) return <p className="text-sm text-[var(--color-text-tertiary)] italic py-4">Out of stock.</p>;

    return (
      <div className="grid grid-cols-2 gap-4">
        {items.map((item, idx) => {
          const isSelected = isMulti ? selectedValue.includes(item.name) : selectedValue === item.name;
          return (
            <motion.button
              key={item.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => isMulti ? onSelect(item.name) : onSelect(item.name)}
              className={`relative p-4 rounded-2xl border text-left transition-all duration-300 group ${isSelected ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)]' : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-primary)]/50'}`}
              style={{
                boxShadow: isSelected ? '0 4px 15px rgba(250,163,7,0.1)' : '0 2px 4px rgba(0,0,0,0.02)',
              }}
            >
              {isSelected && (
                <motion.div
                  layoutId={`check-${type}`}
                  className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center"
                >
                  <Check size={12} strokeWidth={3} />
                </motion.div>
              )}
              <h4 className={`font-bold transition-colors pr-6 ${isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)]'}`}>{item.name}</h4>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1 mb-2 leading-relaxed">
                {item.calories ? `${item.calories} kcal` : 'Fresh & delicious'}
              </p>
              <p className="text-sm font-extrabold text-[var(--color-primary)]">+₹{item.price}</p>
            </motion.button>
          );
        })}
      </div>
    );
  };

  if (loading) return (
    <div className="h-[500px] flex items-center justify-center bg-[var(--color-surface)] rounded-3xl border border-[var(--color-border)] shadow-sm">
      <div className="w-10 h-10 rounded-full border-[3px] border-[var(--color-border)] border-t-[var(--color-primary)] animate-spin-loader" />
    </div>
  );

  return (
    <div className="bg-[var(--color-surface)] rounded-[32px] overflow-hidden shadow-2xl border border-[var(--color-border)] flex flex-col lg:flex-row">
      
      {/* LEFT: Canvas & Visualizer */}
      <div className="lg:w-[45%] relative bg-[var(--color-bg)] p-10 flex flex-col items-center justify-center overflow-hidden border-r border-[var(--color-border)]">
        <div className="absolute inset-0 bg-gradient-mesh opacity-[0.05] pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-[400px]">
          <PizzaCanvas base={selectedBase} sauce={selectedSauce} cheese={selectedCheese} vegetables={selectedVeggies} />
        </div>

        <div className="mt-10 text-center relative z-10 bg-[var(--color-surface)]/60 backdrop-blur-md py-3 px-6 rounded-2xl border border-[var(--color-border)] shadow-sm">
          <p className="text-xs font-bold text-[var(--color-text-tertiary)] tracking-widest uppercase mb-1">Live Preview</p>
          <h3 className="text-xl font-extrabold text-[var(--color-text-primary)] flex items-center justify-center gap-2">
            Total: <span className="text-transparent bg-clip-text bg-gradient-primary">₹{calculatedPrice}</span>
          </h3>
        </div>
      </div>

      {/* RIGHT: Controls & Steps */}
      <div className="lg:w-[55%] flex flex-col bg-[var(--color-surface)] relative">
        {/* Stepper Header */}
        <div className="px-8 py-6 border-b border-[var(--color-border)] flex items-center justify-between">
          <div className="flex gap-2">
            {steps.map((s, i) => (
              <button
                key={i}
                onClick={() => goToStep(i)}
                className="group flex flex-col items-start px-3 py-2 rounded-xl transition-all hover:bg-[var(--color-bg)]"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    currentStep === i ? 'bg-[var(--color-primary)] text-white shadow-md' :
                    currentStep > i ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-[var(--color-bg)] text-[var(--color-text-tertiary)]'
                  }`}>
                    {currentStep > i ? <Check size={10} /> : i + 1}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${currentStep === i ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'}`}>
                    {s.title}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 p-8 overflow-y-auto" style={{ maxHeight: '500px' }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              initial={{ opacity: 0, x: direction * 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-6">
                <h2 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-2 font-display tracking-tight">
                  {steps[currentStep].title}
                </h2>
                <p className="text-[var(--color-text-secondary)] font-medium">{steps[currentStep].desc}</p>
              </div>

              {currentStep === 0 && renderSelectionGrid('base', selectedBase, setSelectedBase)}
              {currentStep === 1 && renderSelectionGrid('sauce', selectedSauce, setSelectedSauce)}
              {currentStep === 2 && renderSelectionGrid('cheese', selectedCheese, setSelectedCheese)}
              {currentStep === 3 && (
                <>
                  <div className="flex items-center gap-2 mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-xl text-sm font-semibold border border-indigo-100 dark:border-indigo-800/30">
                    <Info size={16} /> Select as many toppings as you like!
                  </div>
                  {renderSelectionGrid('veg', selectedVeggies, toggleVeggie, true)}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-bg)] flex items-center justify-between">
          <button
            onClick={() => goToStep(currentStep - 1)}
            disabled={currentStep === 0}
            className={`btn ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'btn-secondary'} rounded-full px-6 py-3 text-sm font-bold shadow-sm`}
          >
            <ArrowLeft size={16} /> Back
          </button>

          {currentStep < 3 ? (
            <button
              onClick={() => goToStep(currentStep + 1)}
              className="btn btn-primary-gradient rounded-full px-8 py-3 text-sm font-bold shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="btn btn-primary rounded-full px-8 py-3 text-sm font-bold shadow-lg shadow-indigo-200 dark:shadow-none relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                <ShoppingCart size={16} /> Add to Cart — ₹{calculatedPrice}
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          )}
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-[var(--color-text-primary)] text-[var(--color-bg)] px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 font-bold text-sm"
          >
            <span className="text-green-400 text-lg">✓</span> {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PizzaBuilder;
