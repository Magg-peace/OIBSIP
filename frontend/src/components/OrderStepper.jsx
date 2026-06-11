import React from 'react';
import { motion } from 'framer-motion';
import { Check, ChefHat, ShoppingBag, Truck, CheckCircle2 } from 'lucide-react';

const steps = [
  { label: 'Order Received',   status: 'Order Received',   icon: ShoppingBag,  desc: 'Your order has been placed and confirmed.' },
  { label: 'In Kitchen',       status: 'In Kitchen',       icon: ChefHat,       desc: 'Our chefs are crafting your custom pizza.' },
  { label: 'Sent To Delivery', status: 'Sent To Delivery', icon: Truck,         desc: 'Your pizza is on the way — hot and fresh!' },
  { label: 'Delivered',        status: 'Delivered',        icon: CheckCircle2,  desc: 'Enjoy your pizza! 🍕' },
];

const OrderStepper = ({ currentStatus }) => {
  const currentIdx = steps.findIndex(s => s.status === currentStatus);
  const progressPercent = (currentIdx / (steps.length - 1)) * 100;

  return (
    <div className="w-full py-6">
      {/* Desktop stepper */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between relative mb-6">
          {/* Track line background */}
          <div className="absolute top-5 left-0 right-0 h-0.5 z-0 bg-[var(--color-border)]" style={{ margin: '0 20px' }}>
            
            {/* Filled Progress Line */}
            <motion.div
              className="absolute top-0 left-0 h-full bg-[var(--color-primary)]"
              style={{ transformOrigin: 'left' }}
              initial={{ width: '0%' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
            
            {/* The Animated Pizza Tracker */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 -ml-3 text-2xl drop-shadow-md z-20"
              initial={{ left: '0%' }}
              animate={{ left: `${progressPercent}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            >
              <motion.div
                animate={currentIdx < steps.length - 1 ? { rotate: [0, 15, -15, 0], y: [0, -3, 0] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {currentIdx < steps.length - 1 ? '🚚' : '🍕'}
              </motion.div>
            </motion.div>

          </div>

          {steps.map((step, idx) => {
            const Icon      = step.icon;
            const completed = idx < currentIdx;
            const active    = idx === currentIdx;

            return (
              <motion.div
                key={idx}
                className="flex flex-col items-center z-10 flex-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
              >
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors bg-[var(--color-surface)] relative ${
                    completed || active
                      ? 'border-[var(--color-primary)] text-[var(--color-primary)]' 
                      : 'border-[var(--color-border)] text-[var(--color-text-tertiary)]'
                  }`}
                  animate={active ? { scale: [1, 1.1, 1], boxShadow: ['0 0 0px var(--color-primary)', '0 0 15px var(--color-primary)', '0 0 0px var(--color-primary)'] } : {}}
                  transition={active ? { duration: 2, repeat: Infinity } : {}}
                >
                  {completed ? <Check size={18} strokeWidth={3} /> : <Icon size={18} />}
                </motion.div>
                <p
                  className={`mt-3 text-xs font-bold text-center ${
                    completed || active ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-tertiary)]'
                  }`}
                  style={{ letterSpacing: '0.3px' }}
                >
                  {step.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mobile vertical stepper */}
      <div className="md:hidden space-y-4">
        {steps.map((step, idx) => {
          const Icon      = step.icon;
          const completed = idx < currentIdx;
          const active    = idx === currentIdx;

          return (
            <motion.div
              key={idx}
              className="flex items-start gap-4 relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex flex-col items-center z-10 relative">
                <div 
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors bg-[var(--color-surface)] ${
                    completed || active
                      ? 'border-[var(--color-primary)] text-[var(--color-primary)]' 
                      : 'border-[var(--color-border)] text-[var(--color-text-tertiary)]'
                  }`}
                >
                  {completed ? <Check size={16} strokeWidth={3} /> : <Icon size={16} />}
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-0.5 flex-1 mt-1 min-h-[32px] ${completed ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'}`} />
                )}
                {/* Mobile Active Pizza Indicator */}
                {active && idx < steps.length - 1 && (
                   <motion.div 
                     className="absolute -bottom-2 text-xl z-20 drop-shadow-md bg-[var(--color-bg)] rounded-full"
                     animate={{ y: [0, 5, 0] }}
                     transition={{ duration: 1.5, repeat: Infinity }}
                   >
                     🍕
                   </motion.div>
                )}
              </div>
              <div className="pt-1 pb-4 flex-1">
                <p className={`text-sm font-bold ${completed || active ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-tertiary)]'}`}>
                  {step.label}
                </p>
                {(active || completed) && (
                  <p className="text-xs mt-1 text-[var(--color-text-secondary)]">{step.desc}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStepper;
