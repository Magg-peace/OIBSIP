import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const pizzas = [
  {
    id: 1, emoji: '🍕',
    name: 'Margherita',
    subtitle: 'THE ITALIAN ORIGINAL',
    desc: 'Fresh mozzarella, San Marzano tomatoes, and fragrant basil. Simple, perfect, iconic.',
    price: '₹249',
    tag: 'Bestseller',
  },
  {
    id: 2, emoji: '🌶️',
    name: 'Pepperoni Blast',
    subtitle: 'THE ALL-TIME FAVOURITE',
    desc: 'Crispy pepperoni rounds over a rich tomato base with stretchy mozzarella.',
    price: '₹299',
    tag: 'Spicy',
  },
  {
    id: 3, emoji: '🥗',
    name: 'Veggie Supreme',
    subtitle: 'GARDEN FRESH DELIGHT',
    desc: 'Bell peppers, mushrooms, olives, onions, and sweet corn — bursting with freshness.',
    price: '₹279',
    tag: 'Fresh',
  },
];

const HeroSlider = () => {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => { setDir(1); setIdx(i => (i + 1) % pizzas.length); }, []);
  const prev = useCallback(() => { setDir(-1); setIdx(i => (i - 1 + pizzas.length) % pizzas.length); }, []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next, paused]);

  const p = pizzas[idx];

  const textVar = {
    enter: (d) => ({ opacity: 0, y: 30 }),
    center: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
    exit: (d) => ({ opacity: 0, y: -30, transition: { duration: 0.4 } }),
  };

  const emojiVar = {
    enter: (d) => ({ opacity: 0, scale: 0.8, rotate: d * 45 }),
    center: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
    exit: (d) => ({ opacity: 0, scale: 0.8, rotate: d * -45, transition: { duration: 0.6 } }),
  };

  return (
    <section 
      className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-40"
      style={{ background: '#FAFAFC' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Premium Mesh Gradient Background Blob */}
      <div 
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          background: 'radial-gradient(at 100% 0%, hsla(242,100%,70%,1) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(328,100%,65%,1) 0px, transparent 50%)',
          filter: 'blur(80px)'
        }}
      />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Left Content */}
        <div className="flex flex-col items-start">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={p.id} custom={dir} variants={textVar} initial="enter" animate="center" exit="exit" className="w-full">
              <div className="flex items-center gap-3 mb-6">
                <span className="badge badge-primary">{p.tag}</span>
                <span className="text-[11px] font-bold tracking-[0.2em] text-gray-500 uppercase">{p.subtitle}</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight" style={{ color: '#111827', fontFamily: 'Outfit, sans-serif' }}>
                {p.name}
              </h1>
              
              <p className="text-lg lg:text-xl leading-relaxed text-gray-600 mb-10 max-w-lg font-medium">
                {p.desc}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-wrap items-center gap-6">
            <Link to="/dashboard#pizza-builder" className="btn btn-primary-gradient px-8 py-4 text-base shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              Order Now — {p.price}
              <ArrowRight size={18} className="ml-2" />
            </Link>

            {/* Pagination Lines */}
            <div className="flex gap-3">
              {pizzas.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }}
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: i === idx ? '32px' : '12px',
                    background: i === idx ? '#4F46E5' : '#D1D5DB',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Emoji Area */}
        <div className="relative flex justify-center items-center h-[400px] lg:h-[500px]">
          {/* Controls */}
          <div className="absolute inset-x-0 flex justify-between px-4 z-20 pointer-events-none">
            <button onClick={prev} className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md shadow-lg flex items-center justify-center text-gray-800 hover:text-indigo-600 hover:scale-110 transition-all pointer-events-auto border border-gray-100">
              <ChevronLeft size={24} />
            </button>
            <button onClick={next} className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md shadow-lg flex items-center justify-center text-gray-800 hover:text-indigo-600 hover:scale-110 transition-all pointer-events-auto border border-gray-100">
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Central Glow */}
          <div className="absolute w-[300px] h-[300px] lg:w-[450px] lg:h-[450px] rounded-full bg-gradient-to-tr from-indigo-100 to-pink-100 opacity-60 blur-3xl animate-pulse-glow" />

          <AnimatePresence initial={false} custom={dir}>
            <motion.div
              key={p.id}
              custom={dir}
              variants={emojiVar}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute text-[200px] lg:text-[280px] leading-none select-none drop-shadow-2xl animate-float"
            >
              {p.emoji}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default HeroSlider;
