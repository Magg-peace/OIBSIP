import React from 'react';
import { motion } from 'framer-motion';
import { Search, HelpCircle, Book, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HelpCenter = () => {
  const [expandedIndex, setExpandedIndex] = React.useState(null);

  const articles = [
    {
      question: 'How long does delivery usually take?',
      answer: 'Our standard delivery time is 30-45 minutes. For large orders (5+ pizzas) or during peak hours, it may take up to 60 minutes. You can track your order in real-time on your dashboard.'
    },
    {
      question: 'What if my pizza arrives cold?',
      answer: 'We use state-of-the-art insulated delivery bags to ensure your pizza arrives piping hot. If your pizza is cold upon arrival, please contact support within 15 minutes of delivery for a full refund or a fresh replacement.'
    },
    {
      question: 'Can I cancel my order after placing it?',
      answer: 'You can cancel your order within 5 minutes of placing it for a full refund. Once the restaurant begins preparing your pizza (In Kitchen status), the order can no longer be cancelled.'
    },
    {
      question: 'Do you offer gluten-free crusts?',
      answer: 'Yes! We offer a premium cauliflower-based gluten-free crust for all our medium-sized pizzas. Please note that while we take precautions, our kitchens do process wheat flour.'
    },
    {
      question: 'How does the loyalty program work?',
      answer: 'You earn 10 points for every $1 spent. Collect 1000 points to redeem a free large pizza of your choice! Points automatically apply to your account when logged in.'
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black font-display text-[var(--color-text-primary)] mb-6 tracking-tight">How can we help?</h1>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" size={20} />
            <input 
              type="text" 
              placeholder="Search for answers (e.g. 'refund', 'delivery time')" 
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl py-4 pl-12 pr-6 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition-colors shadow-lg shadow-black/5"
            />
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Book, title: 'Getting Started', desc: 'Learn how to build your first pizza and place an order.' },
            { icon: HelpCircle, title: 'FAQs', desc: 'Answers to our most commonly asked questions.' },
            { icon: MessageCircle, title: 'Contact Support', desc: 'Can\'t find what you need? Reach out to us.' },
          ].map((item, i) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel p-6 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] mb-4 group-hover:scale-110 transition-transform">
                <item.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">{item.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-panel rounded-2xl p-8 border border-[var(--color-border)]"
        >
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Popular Articles</h2>
          <div className="space-y-4">
            {articles.map((article, index) => (
              <div key={index} className="border border-[var(--color-border)] rounded-xl overflow-hidden transition-all duration-300">
                <button 
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 bg-[var(--color-surface)] hover:bg-[var(--color-primary)]/5 transition-colors text-left"
                >
                  <span className={`font-medium transition-colors ${expandedIndex === index ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'}`}>
                    {article.question}
                  </span>
                  <motion.div
                    animate={{ rotate: expandedIndex === index ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight size={16} className={expandedIndex === index ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-tertiary)]'} />
                  </motion.div>
                </button>
                <motion.div 
                  initial={false}
                  animate={{ height: expandedIndex === index ? 'auto' : 0, opacity: expandedIndex === index ? 1 : 0 }}
                  className="overflow-hidden bg-[var(--color-bg)]"
                >
                  <p className="p-4 text-sm text-[var(--color-text-secondary)] leading-relaxed border-t border-[var(--color-border)]">
                    {article.answer}
                  </p>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HelpCenter;
