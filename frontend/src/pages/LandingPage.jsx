import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Play, Star, CheckCircle, Clock, Shield, Award } from 'lucide-react';

const pizzas = [
  {
    id: 1,
    name: 'Classic Margherita',
    desc: 'Fresh mozzarella, vibrant San Marzano tomato sauce, and aromatic basil on a perfectly baked wood-fired crust. The timeless classic.',
    price: '$18.00',
    calories: '850 kcal',
    rating: 4.9,
    img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=100',
    color: '#E85D04',
    ingredients: ['🍅', '🌿', '🧀', '🤌']
  },
  {
    id: 2,
    name: 'Smoky BBQ Chicken',
    desc: 'Tender wood-smoked chicken with caramelized onions, melted cheddar, and our signature rich hickory BBQ sauce.',
    price: '$24.00',
    calories: '1120 kcal',
    rating: 4.8,
    img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=100',
    color: '#DC2F02',
    ingredients: ['🍗', '🧅', '🔥', '🧀']
  },
  {
    id: 3,
    name: 'Truffle Mushroom',
    desc: 'Wild roasted mushrooms, creamy white garlic sauce, fresh thyme, and a decadent drizzle of white truffle oil.',
    price: '$26.00',
    calories: '940 kcal',
    rating: 5.0,
    img: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=100',
    color: '#D4A373',
    ingredients: ['🍄', '🧀', '🌿', '🧄']
  },
  {
    id: 4,
    name: 'Spicy Pepperoni',
    desc: 'Crispy double-cupped pepperoni, crushed red pepper flakes, hot honey drizzle, and rich mozzarella.',
    price: '$22.00',
    calories: '1050 kcal',
    rating: 4.9,
    img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=100',
    color: '#9D0208',
    ingredients: ['🍕', '🌶️', '🧀', '🔥']
  }
];

const categories = [
  "MARGHERITA", "PEPPERONI", "TRUFFLE", "BBQ CHICKEN", "VEGGIE", "FARMHOUSE", "SPINACH", "CHEESE BURST"
];

const LandingPage = () => {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  // Automatic Carousel
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setDir(1);
      setIdx((prev) => (prev + 1) % pizzas.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const next = () => { setDir(1); setIdx((i) => (i + 1) % pizzas.length); setIsPaused(true); };
  const prev = () => { setDir(-1); setIdx((i) => (i - 1 + pizzas.length) % pizzas.length); setIsPaused(true); };

  const p = pizzas[idx];

  const textVar = {
    enter: (d) => ({ opacity: 0, y: d > 0 ? 20 : -20, filter: 'blur(8px)' }),
    center: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
    exit: (d) => ({ opacity: 0, y: d > 0 ? -20 : 20, filter: 'blur(8px)', transition: { duration: 0.4 } })
  };

  const pizzaVar = {
    enter: (d) => ({ opacity: 0, scale: 0.8, rotate: d > 0 ? 45 : -45 }),
    center: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
    exit: (d) => ({ opacity: 0, scale: 1.1, rotate: d > 0 ? -45 : 45, transition: { duration: 0.8 } })
  };

  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-text-primary)] font-sans transition-colors duration-800">
      
      {/* ───────────────────────────────────────────────────────── */}
      {/* 1. HERO SECTION (100vh, fixed rotation)                   */}
      {/* ───────────────────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[850px] overflow-hidden flex flex-col">
        
        {/* Dynamic Background Glow */}
        <div className="absolute inset-0 pointer-events-none transition-colors duration-1000 z-0" 
             style={{ background: `radial-gradient(circle at 50% 100%, ${p.color}40 0%, transparent 60%)` }} />
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay z-0" />

        {/* Navigation */}
        <nav className="flex items-center justify-between px-6 md:px-12 py-6 relative z-50">
          <div className="text-2xl font-black tracking-tighter flex items-center gap-2 font-display">
            <span className="text-3xl drop-shadow-md">🍕</span>
            PizzaHub<span style={{ color: p.color }}>.</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">How it Works</a>
            <a href="#features" className="text-sm font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">Why Us</a>
            <a href="#stats" className="text-sm font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">Stats</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden md:block text-sm font-bold text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors">User Login</Link>
            <Link to="/admin-login" className="hidden md:block text-sm font-bold text-[var(--color-text-tertiary)] hover:text-[var(--color-primary)] transition-colors">Admin Login</Link>
            <Link to="/register" className="px-6 py-2.5 rounded-full text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95" style={{ background: p.color, boxShadow: `0 8px 25px ${p.color}66` }}>
              Order Now
            </Link>
          </div>
        </nav>

        {/* Floating Ingredients */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          <motion.div className="absolute top-[10%] left-[8%] md:left-[15%] text-6xl drop-shadow-2xl hover:scale-125 transition-transform duration-300 pointer-events-auto cursor-pointer" animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} style={{ filter: 'blur(1px)' }}>{p.ingredients[0]}</motion.div>
          <motion.div className="absolute top-[20%] right-[8%] md:right-[15%] text-7xl drop-shadow-2xl hover:scale-125 transition-transform duration-300 pointer-events-auto cursor-pointer" animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>{p.ingredients[1]}</motion.div>
          <motion.div className="absolute bottom-[40%] left-[5%] md:left-[12%] text-5xl drop-shadow-2xl hover:scale-125 transition-transform duration-300 pointer-events-auto cursor-pointer" animate={{ y: [0, -10, 0], rotate: [0, -5, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}>{p.ingredients[2]}</motion.div>
          <motion.div className="absolute bottom-[35%] right-[5%] md:right-[12%] text-6xl drop-shadow-2xl hover:scale-125 transition-transform duration-300 pointer-events-auto cursor-pointer" animate={{ y: [0, 15, 0], rotate: [0, 10, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }} style={{ filter: 'blur(1px)' }}>{p.ingredients[3]}</motion.div>
        </div>

        {/* Main Hero Content */}
        <div className="flex-1 flex flex-col items-center justify-start relative z-20 w-full pt-12 md:pt-20 px-4">
          
          {/* Text Showcase */}
          <div className="text-center max-w-4xl mx-auto relative z-30 mb-8 mt-2 md:mt-6 pb-[350px]">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={p.id}
                custom={dir}
                variants={textVar}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full relative z-40"
              >
                <div className="flex items-center justify-center gap-4 mb-6">
                  <span className="px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase border flex items-center gap-2"
                        style={{ color: p.color, borderColor: `${p.color}40`, background: `${p.color}10` }}>
                    <Star size={14} className="fill-current" /> Made Fresh
                  </span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black mb-4 font-display uppercase tracking-tight max-w-[800px] mx-auto leading-[1.1]">
                  <span className="text-[var(--color-text-primary)] block">{p.name.split(' ')[0]}</span>
                  <span className="bg-gradient-to-r text-transparent bg-clip-text block" style={{ backgroundImage: `linear-gradient(to right, ${p.color}, #FAA307)` }}>
                    {p.name.split(' ').slice(1).join(' ')}
                  </span>
                </h1>
                
                <p className="text-[var(--color-text-secondary)] text-sm md:text-base leading-relaxed font-medium max-w-2xl mx-auto mt-6">
                  {p.desc}
                </p>
                
                <div className="mt-10 mb-8 flex flex-col items-center justify-center gap-6">
                  <Link to="/dashboard" 
                        className="group relative px-8 py-3 rounded-full text-white font-black flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl"
                        style={{ backgroundColor: p.color, boxShadow: `0 0 30px ${p.color}66` }}>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                    <motion.div animate={{ opacity: [0.9, 1, 0.9] }} transition={{ duration: 2, repeat: Infinity }}>
                      Customize Pizza
                    </motion.div>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Massive Rotating Pizza Section */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[100vw] h-[350px] md:h-[500px] pointer-events-none z-10 flex justify-center items-end">
            
            {/* Concentric Rings */}
            <div className="absolute bottom-[-300px] md:bottom-[-400px] w-[800px] h-[800px] md:w-[1300px] md:h-[1300px] rounded-full border border-[var(--color-border)] opacity-50" />
            <div className="absolute bottom-[-250px] md:bottom-[-300px] w-[700px] h-[700px] md:w-[1100px] md:h-[1100px] rounded-full border border-[var(--color-border)] opacity-30 border-dashed animate-spin-slow" style={{ animationDuration: '30s' }} />

            {/* Rotating Text Ring */}
            <div className="absolute bottom-[-275px] md:bottom-[-350px] w-[750px] h-[750px] md:w-[1200px] md:h-[1200px] animate-spin-slow pointer-events-auto" style={{ animationDuration: '40s' }}>
              <svg viewBox="0 0 1000 1000" className="w-full h-full">
                <path id="text-curve" d="M 100 500 A 400 400 0 1 1 900 500 A 400 400 0 1 1 100 500" fill="transparent" />
                <text className="text-[14px] font-black uppercase" style={{ opacity: 0.85 }}>
                  <textPath href="#text-curve" startOffset="0%" textAnchor="start">
                    {[...categories, ...categories, ...categories, ...categories].map((cat, i) => {
                      const isActive = p.name.toUpperCase().includes(cat);
                      return (
                        <tspan key={i} fill={isActive ? p.color : 'var(--color-text-tertiary)'} style={{ letterSpacing: '8px', opacity: isActive ? 1 : 0.4 }}>
                          {isActive ? ` • ${cat} • ` : ` ${cat} `}
                        </tspan>
                      )
                    })}
                  </textPath>
                </text>
              </svg>
            </div>

            {/* Left / Right Nav Buttons */}
            <button onClick={prev} className="absolute left-[5%] md:left-[15%] bottom-[150px] md:bottom-[200px] z-50 w-14 h-14 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-primary)] shadow-xl hover:scale-110 active:scale-95 transition-all pointer-events-auto">
              <ChevronLeft size={24} />
            </button>
            <button onClick={next} className="absolute right-[5%] md:right-[15%] bottom-[150px] md:bottom-[200px] z-50 w-14 h-14 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-primary)] shadow-xl hover:scale-110 active:scale-95 transition-all pointer-events-auto">
              <ChevronRight size={24} />
            </button>

            {/* The Pizza Wheel Container */}
            <div className="relative w-[400px] h-[200px] md:w-[800px] md:h-[400px] overflow-hidden pointer-events-auto z-40">
              
              {/* Soft Glow Behind Pizza */}
              <div className="absolute top-[80%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none" 
                   style={{ background: `radial-gradient(${p.color}80, transparent 70%)`, filter: 'blur(100px)', opacity: 0.5, zIndex: -1 }} />

              <div className="absolute top-0 left-0 w-[400px] h-[400px] md:w-[800px] md:h-[800px] animate-spin-slow" style={{ animationDuration: '25s' }}>
                <AnimatePresence initial={false} custom={dir}>
                  <motion.div
                    key={p.id}
                    custom={dir}
                    variants={pizzaVar}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0 rounded-full overflow-hidden border-[16px] border-[var(--color-surface)] shadow-[0_30px_60px_rgba(0,0,0,0.3)]"
                    style={{ boxShadow: `0 20px 80px ${p.color}40` }}
                  >
                    <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="w-full h-full">
                      <img src={p.img} alt={p.name} className="w-full h-full object-cover scale-[1.05]" />
                    </motion.div>
                    <div className="absolute inset-0 bg-white/10 mix-blend-overlay rounded-full" />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

          </div>

          {/* Scroll Down Indicator */}
          <motion.div 
            className="absolute bottom-[30px] md:bottom-[50px] right-[5%] z-50 flex flex-col items-center justify-center pointer-events-auto"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <a href="#how-it-works" className="text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] flex flex-col items-center gap-2 transition-colors">
              <span style={{ writingMode: 'vertical-rl' }}>Explore</span>
              <ArrowRight size={14} className="rotate-90" />
            </a>
          </motion.div>

        </div>
      </section>

      {/* ───────────────────────────────────────────────────────── */}
      {/* 2. HOW IT WORKS SECTION (Bento Box Layout)                */}
      {/* ───────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black font-display mb-4 text-[var(--color-text-primary)]">Crafting Perfection</h2>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-lg">Four simple steps to build your absolute dream pizza. Interactive, dynamic, and freshly baked just for you.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Bento Item 1 */}
          <div className="md:col-span-8 card relative overflow-hidden group border border-[var(--color-border)] hover:border-[#FAA307] transition-all bg-[var(--color-surface)] shadow-lg hover:shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all duration-500 text-9xl">🍕</div>
            <div className="relative z-10 flex flex-col justify-end h-full min-h-[250px]">
              <div className="text-[#FAA307] font-black text-sm tracking-widest mb-2">01</div>
              <h3 className="text-3xl font-black mb-3 text-[var(--color-text-primary)]">Choose Your Canvas</h3>
              <p className="text-[var(--color-text-secondary)] max-w-sm">Start with our signature hand-tossed thin crust, rich cheese burst, or the classic deep pan. The foundation of flavor.</p>
            </div>
          </div>
          
          {/* Bento Item 2 */}
          <div className="md:col-span-4 card relative overflow-hidden group border border-[var(--color-border)] hover:border-red-500 transition-all bg-[var(--color-surface)] shadow-lg hover:shadow-2xl">
            <div className="absolute -bottom-10 -right-10 opacity-20 group-hover:-rotate-12 group-hover:scale-110 transition-all duration-500 text-9xl">🥫</div>
            <div className="relative z-10">
              <div className="text-red-500 font-black text-sm tracking-widest mb-2">02</div>
              <h3 className="text-2xl font-black mb-3 text-[var(--color-text-primary)]">Signature Sauce</h3>
              <p className="text-[var(--color-text-secondary)] text-sm">Rich san marzano tomato, spicy BBQ, or creamy garlic alfredo.</p>
            </div>
          </div>

          {/* Bento Item 3 */}
          <div className="md:col-span-4 card relative overflow-hidden group border border-[var(--color-border)] hover:border-yellow-400 transition-all bg-[var(--color-surface)] shadow-lg hover:shadow-2xl">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 group-hover:rotate-12 group-hover:scale-125 transition-all duration-500 text-[10rem]">🧀</div>
            <div className="relative z-10 h-full flex flex-col justify-end min-h-[200px]">
              <div className="text-yellow-500 font-black text-sm tracking-widest mb-2">03</div>
              <h3 className="text-2xl font-black mb-3 text-[var(--color-text-primary)]">Melted Perfection</h3>
              <p className="text-[var(--color-text-secondary)] text-sm">Fresh mozzarella, aged cheddar, and premium parmesan blend.</p>
            </div>
          </div>

          {/* Bento Item 4 */}
          <div className="md:col-span-8 card relative overflow-hidden group border border-[var(--color-border)] hover:border-green-500 transition-all bg-[var(--color-surface)] shadow-lg hover:shadow-2xl">
            <div className="absolute -right-4 top-4 flex gap-4 opacity-40 group-hover:opacity-100 transition-all duration-700">
              <span className="text-5xl animate-bounce-slow">🍄</span>
              <span className="text-5xl animate-float">🌶️</span>
              <span className="text-5xl animate-pulse-slow">🫒</span>
            </div>
            <div className="relative z-10 flex flex-col justify-end h-full min-h-[200px]">
              <div className="text-green-500 font-black text-sm tracking-widest mb-2">04</div>
              <h3 className="text-3xl font-black mb-3 text-[var(--color-text-primary)]">Crown Jewels</h3>
              <p className="text-[var(--color-text-secondary)] max-w-sm">Top it off with farm-fresh organic vegetables and premium meats sourced from local farms.</p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/dashboard" className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-[var(--color-primary)] text-white font-black rounded-full hover:scale-105 transition-transform shadow-xl shadow-[var(--color-primary)]/30 text-lg group">
            Start Building Now
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>


      {/* ───────────────────────────────────────────────────────── */}
      {/* 3. WHY CHOOSE US SECTION                                  */}
      {/* ───────────────────────────────────────────────────────── */}
      <section id="features" className="py-32 relative overflow-hidden">
        {/* Background glow for the section */}
        <div className="absolute top-1/2 left-0 w-full h-[500px] bg-[var(--color-primary)] opacity-5 blur-[120px] -translate-y-1/2 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-black font-display mb-6 leading-tight">Premium Quality,<br/><span className="text-[var(--color-primary)]">Lightning Delivery.</span></h2>
              <p className="text-[var(--color-text-secondary)] mb-10 text-lg leading-relaxed">We don't just make pizza, we craft experiences. From hand-kneaded dough to real-time socket delivery tracking, every step is optimized for perfection.</p>
              
              <div className="space-y-8">
                {[
                  { title: 'Fresh Ingredients Daily', icon: Shield, desc: 'We source our veggies and meats locally every morning.' },
                  { title: 'Real-Time Tracking', icon: Clock, desc: 'Watch your pizza move from oven to doorstep live.' },
                  { title: 'Secure Payments', icon: CheckCircle, desc: 'Fully encrypted Razorpay checkout experience.' }
                ].map((f, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all duration-300">
                      <f.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-1">{f.title}</h4>
                      <p className="text-[var(--color-text-secondary)]">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Creative Image Composition */}
            <motion.div 
              className="relative h-[600px] w-full"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              {/* Decorative rings behind image */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-[var(--color-primary)] rounded-full opacity-20 border-dashed animate-spin-slow" />
              
              <div className="absolute inset-4 rounded-[4rem] overflow-hidden shadow-2xl border border-[var(--color-border)]">
                <img src="https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=800&q=80" alt="Pizza Making" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Floating review card over image */}
              <motion.div 
                className="absolute bottom-12 -left-8 bg-[var(--color-surface)] p-6 rounded-3xl shadow-2xl border border-[var(--color-border)] max-w-[250px] glass-panel"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex gap-1 text-yellow-500 mb-2">
                  <Star size={16} className="fill-current" /><Star size={16} className="fill-current" /><Star size={16} className="fill-current" /><Star size={16} className="fill-current" /><Star size={16} className="fill-current" />
                </div>
                <p className="text-sm font-bold mb-3">"Best pizza I've ever had. The crust is unbelievable."</p>
                <div className="text-xs text-[var(--color-text-tertiary)] font-bold uppercase tracking-wider">— Sarah Jenkins</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────── */}
      {/* 4. STATISTICS SECTION (Dense Bento)                       */}
      {/* ───────────────────────────────────────────────────────── */}
      <section id="stats" className="py-20 px-6 relative overflow-hidden bg-[var(--color-bg)]">
        <div className="absolute inset-0 bg-gradient-mesh opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { val: '50K+', label: 'Total Orders', color: 'from-[#FAA307] to-yellow-500' },
              { val: '25K+', label: 'Happy Customers', color: 'from-green-400 to-emerald-600' },
              { val: '120+', label: 'Pizza Varieties', color: 'from-[var(--color-primary)] to-purple-600' },
              { val: '15', label: 'Awards Won', color: 'from-pink-500 to-rose-600' },
            ].map((stat, i) => (
              <div key={i} className="glass-panel p-6 md:p-8 rounded-3xl text-center border border-[var(--color-border)] hover:-translate-y-2 transition-transform duration-300 group shadow-lg hover:shadow-2xl bg-[var(--color-surface)]/80 backdrop-blur-xl">
                <div className={`text-4xl md:text-5xl font-black mb-2 bg-gradient-to-br ${stat.color} text-transparent bg-clip-text group-hover:scale-110 transition-transform`}>
                  {stat.val}
                </div>
                <div className="text-xs font-black tracking-widest text-[var(--color-text-secondary)] uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────── */}
      {/* 5. FOOTER                                                 */}
      {/* ───────────────────────────────────────────────────────── */}
      <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)] py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="text-2xl font-black tracking-tighter flex items-center gap-2 font-display mb-4">
              <span>🍕</span> PizzaHub.
            </div>
            <p className="text-[var(--color-text-secondary)] max-w-sm mb-6">
              The world's most advanced pizza building experience. Powered by real-time sockets and premium ingredients.
            </p>
            <div className="flex items-center gap-4 text-[var(--color-text-tertiary)]">
              <div className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-colors cursor-pointer"><Award size={18} /></div>
              <div className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-colors cursor-pointer"><Clock size={18} /></div>
              <div className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-colors cursor-pointer"><Shield size={18} /></div>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-[var(--color-text-secondary)] text-sm">
              <li><Link to="/dashboard" className="hover:text-[var(--color-primary)]">Pizza Builder</Link></li>
              <li><Link to="/login" className="hover:text-[var(--color-primary)]">User Login</Link></li>
              <li><Link to="/register" className="hover:text-[var(--color-primary)]">Create Account</Link></li>
              <li><Link to="/admin-login" className="hover:text-[var(--color-primary)]">Admin Portal</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Contact Info</h4>
            <ul className="space-y-3 text-[var(--color-text-secondary)] text-sm">
              <li>123 Pizza Street, Food City</li>
              <li>support@pizzahub.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-[var(--color-border)] text-center text-[var(--color-text-tertiary)] text-sm flex flex-col md:flex-row items-center justify-between">
          <p>© {new Date().getFullYear()} PizzaHub. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
