import React from 'react';
import { motion } from 'framer-motion';

const TermsOfService = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto glass-panel rounded-3xl p-8 md:p-12 border border-[var(--color-border)]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-block px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold uppercase tracking-wider mb-6">Legal</div>
          <h1 className="text-4xl md:text-5xl font-black font-display text-[var(--color-text-primary)] mb-6 tracking-tight">Terms of Service</h1>
          <p className="text-[var(--color-text-secondary)] mb-8">Last updated: June 11, 2026</p>
          
          <div className="prose prose-invert max-w-none text-[var(--color-text-secondary)] space-y-6">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using the PizzaHub website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
            
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mt-8 mb-4">2. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.</p>

            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mt-8 mb-4">3. Ordering and Pricing</h2>
            <p>All orders are subject to availability and acceptance. Prices are subject to change without notice. We reserve the right to refuse or cancel any order for any reason, including limitations on quantities available for purchase.</p>

            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mt-8 mb-4">4. Intellectual Property</h2>
            <p>All content on the PizzaHub website, including text, graphics, logos, and software, is the property of PizzaHub and is protected by intellectual property laws. You may not use, reproduce, or distribute any content without our prior written permission.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
