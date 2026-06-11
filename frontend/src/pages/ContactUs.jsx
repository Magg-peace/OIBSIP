import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactUs = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold uppercase tracking-wider mb-6">Get in Touch</div>
          <h1 className="text-4xl md:text-5xl font-black font-display text-[var(--color-text-primary)] mb-6 tracking-tight">Contact Our Team</h1>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto text-lg">We'd love to hear from you. Whether you have a question about our menu, need help with an order, or just want to say hi.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="glass-panel p-8 rounded-3xl border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] mb-6">
                <Mail size={24} />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Email Us</h3>
              <p className="text-[var(--color-text-secondary)] mb-4">Our friendly team is here to help.</p>
              <a href="mailto:hello@pizzahub.com" className="text-[var(--color-primary)] font-semibold hover:underline">hello@pizzahub.com</a>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] mb-6">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Visit Us</h3>
              <p className="text-[var(--color-text-secondary)] mb-4">Come say hello at our HQ.</p>
              <p className="text-[var(--color-text-primary)] font-medium">100 Pizza Hub Avenue<br/>Tech District, San Francisco 94105</p>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] mb-6">
                <Phone size={24} />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Call Us</h3>
              <p className="text-[var(--color-text-secondary)] mb-4">Mon-Fri from 8am to 11pm.</p>
              <p className="text-[var(--color-text-primary)] font-medium">+1 (555) 000-0000</p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel p-8 md:p-10 rounded-3xl border border-[var(--color-border)]"
          >
            <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Send us a message</h3>
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); import('react-hot-toast').then(m => m.toast.success('Message sent! We will get back to you soon.')); e.target.reset(); }}>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--color-text-secondary)]">First name</label>
                  <input required type="text" className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl py-3 px-4 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition-colors" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--color-text-secondary)]">Last name</label>
                  <input required type="text" className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl py-3 px-4 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition-colors" placeholder="Doe" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-secondary)]">Email</label>
                <input required type="email" className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl py-3 px-4 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition-colors" placeholder="john@example.com" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-secondary)]">Message</label>
                <textarea required rows={5} className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl py-3 px-4 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition-colors resize-none" placeholder="Leave us a message..." />
              </div>

              <button type="submit" className="w-full py-4 rounded-xl font-bold text-white bg-[var(--color-primary)] hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                <Send size={18} /> Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
