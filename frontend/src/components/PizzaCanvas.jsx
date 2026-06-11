import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TOPPING_COORDINATES = [
  // Inner ring
  { x: 40, y: 40 }, { x: 60, y: 40 }, { x: 40, y: 60 }, { x: 60, y: 60 }, { x: 50, y: 50 },
  // Middle ring
  { x: 30, y: 50 }, { x: 70, y: 50 }, { x: 50, y: 30 }, { x: 50, y: 70 },
  { x: 35, y: 35 }, { x: 65, y: 35 }, { x: 35, y: 65 }, { x: 65, y: 65 },
  // Outer ring
  { x: 20, y: 50 }, { x: 80, y: 50 }, { x: 50, y: 20 }, { x: 50, y: 80 },
  { x: 25, y: 30 }, { x: 75, y: 30 }, { x: 25, y: 70 }, { x: 75, y: 70 },
  { x: 30, y: 25 }, { x: 70, y: 25 }, { x: 30, y: 75 }, { x: 70, y: 75 }
];

const PizzaCanvas = ({ base, sauce, cheese, vegetables = [] }) => {

  const crustStyles = useMemo(() => {
    let bg = 'url(https://www.transparenttextures.com/patterns/light-paper-fibers.png), radial-gradient(circle at 30% 30%, #e6a953, #b86e24 80%, #5c3008 100%)';
    let bShadow = 'inset 0 0 15px 15px rgba(139,69,19,0.6), inset 0 0 5px 20px rgba(0,0,0,0.4), 0 20px 40px rgba(0,0,0,0.5)';
    if (base?.toLowerCase() === 'cheese burst') {
      bShadow = 'inset 0 0 10px 10px rgba(255,200,0,0.8), inset 0 0 25px 25px rgba(184,110,36,0.9), 0 20px 40px rgba(0,0,0,0.5)';
    } else if (base?.toLowerCase() === 'thin crust') {
      bShadow = 'inset 0 0 5px 5px rgba(139,69,19,0.8), 0 10px 20px rgba(0,0,0,0.3)';
    }
    return { background: bg, boxShadow: bShadow };
  }, [base]);

  const sauceStyles = useMemo(() => {
    switch (sauce?.toLowerCase()) {
      case 'classic tomato': return { background: 'radial-gradient(circle at 40% 40%, #d82b20, #800e07)' };
      case 'spicy marinara': return { background: 'radial-gradient(circle at 40% 40%, #c41e15, #610400)' };
      case 'creamy garlic alfredo': return { background: 'radial-gradient(circle at 40% 40%, #fcf7eb, #d1c7aa)' };
      case 'pesto': return { background: 'radial-gradient(circle at 40% 40%, #4a8222, #1c3b06)' };
      case 'zesty bbq': return { background: 'radial-gradient(circle at 40% 40%, #85370d, #331000)' };
      default: return { background: 'transparent' };
    }
  }, [sauce]);

  const cheeseStyles = useMemo(() => {
    switch (cheese?.toLowerCase()) {
      case 'mozzarella': return { background: 'radial-gradient(circle at 50% 50%, rgba(255,250,220,0.9), rgba(255,240,180,0.7))', mixBlendMode: 'hard-light' };
      case 'cheddar': return { background: 'radial-gradient(circle at 50% 50%, rgba(255,180,50,0.9), rgba(220,130,0,0.8))', mixBlendMode: 'normal' };
      case 'parmesan': return { background: 'radial-gradient(circle at 50% 50%, rgba(255,255,230,0.8), transparent)', mixBlendMode: 'overlay' };
      default: return { background: 'transparent' };
    }
  }, [cheese]);

  const getVegEmoji = (name) => {
    switch(name.toLowerCase()) {
      case 'tomatoes': return '🍅';
      case 'onions': return '🧅';
      case 'bell peppers': return '🫑';
      case 'mushrooms': return '🍄';
      case 'jalapenos': return '🌶️';
      case 'olives': return '🫒';
      case 'spinach': return '🌿';
      case 'sweet corn': return '🌽';
      case 'paneer': return '🧀';
      default: return '🥒';
    }
  };

  return (
    <motion.div
      className="relative w-full max-w-[380px] aspect-square mx-auto flex items-center justify-center rounded-full"
      initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
      animate={{ opacity: 1, rotate: 0, scale: 1 }}
      transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
    >
      {/* Platter / Plate */}
      <div className="absolute inset-[-30px] rounded-full shadow-2xl border border-[var(--color-border)]" style={{ background: 'var(--color-surface)' }} />
      <div className="absolute inset-[-15px] rounded-full shadow-inner bg-gradient-to-br from-white/10 to-black/5" />

      {/* The Crust Base */}
      <motion.div 
        className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center animate-spin-slow pointer-events-none"
        style={crustStyles}
        layout
      >
        {/* The Sauce Layer */}
        <AnimatePresence>
          {sauce && (
            <motion.div
              key={sauce}
              className="absolute w-[86%] h-[86%] rounded-full opacity-90 blur-[2px]"
              style={sauceStyles}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.9 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>

        {/* The Cheese Layer */}
        <AnimatePresence>
          {cheese && (
            <motion.div
              key={cheese}
              className="absolute w-[82%] h-[82%] rounded-full blur-[4px]"
              style={cheeseStyles}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Cheese melt bubbling texture */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay rounded-full" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Toppings Layer */}
        {vegetables.map((veg, vIdx) => {
          // Render multiple instances of each selected vegetable
          const count = 5; 
          return Array.from({ length: count }).map((_, i) => {
            const coordIdx = (vIdx * count + i * 7) % TOPPING_COORDINATES.length;
            const pos = TOPPING_COORDINATES[coordIdx];
            return (
              <motion.div
                key={`${veg}-${i}`}
                className="absolute text-2xl drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
                style={{ 
                  left: `${pos.x}%`, 
                  top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10 + vIdx
                }}
                initial={{ scale: 0, y: -20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ type: 'spring', delay: (vIdx * count + i) * 0.05 }}
              >
                <div style={{ transform: `rotate(${(vIdx*30 + i*45) % 360}deg)` }}>
                  {getVegEmoji(veg)}
                </div>
              </motion.div>
            );
          });
        })}

        {/* Realistic Steam overlay */}
        <div className="absolute inset-0 animate-steam bg-gradient-to-t from-transparent via-white/10 to-transparent blur-md rounded-full pointer-events-none" />
      </motion.div>
    </motion.div>
  );
};

export default PizzaCanvas;
