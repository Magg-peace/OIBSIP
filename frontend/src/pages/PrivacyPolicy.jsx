import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto glass-panel rounded-3xl p-8 md:p-12 border border-[var(--color-border)]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-block px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold uppercase tracking-wider mb-6">Legal</div>
          <h1 className="text-4xl md:text-5xl font-black font-display text-[var(--color-text-primary)] mb-6 tracking-tight">Privacy Policy</h1>
          <p className="text-[var(--color-text-secondary)] mb-8">Last updated: June 11, 2026</p>
          
          <div className="prose prose-invert max-w-none text-[var(--color-text-secondary)] space-y-6">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mt-8 mb-4">1. Information We Collect</h2>
            <p>At PizzaHub, we collect information that you provide directly to us, such as when you create an account, place an order, or subscribe to our newsletter. This includes your name, email address, phone number, and delivery address.</p>
            
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mt-8 mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process and fulfill your pizza orders</li>
              <li>Send you order confirmations and delivery updates</li>
              <li>Communicate with you about promotions and offers (if opted in)</li>
              <li>Improve our website and customer service</li>
            </ul>

            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mt-8 mb-4">3. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage. Payment information is encrypted and securely processed by our payment partners.</p>

            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mt-8 mb-4">4. Sharing Your Information</h2>
            <p>We do not sell your personal information to third parties. We only share your data with trusted delivery partners to fulfill your orders, or when required by law.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
