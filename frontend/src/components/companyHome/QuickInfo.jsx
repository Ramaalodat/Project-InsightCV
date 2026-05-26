import React from 'react';
import { motion } from 'framer-motion';
import './QuickInfo.css';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function QuickInfo() {
  const cards = [
    { title: 'AI-Powered Talent Matching', emoji: '🧠' },
    { title: 'Flexible Ad Management', emoji: '💼' },
    { title: 'Direct Candidate Contact (Email / WhatsApp)', emoji: '🤝' },
  ];

  return (
    <section className="quick-info">
      <div className="quick-info-content">
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="quick-info-grid">
          {cards.map((c) => (
            <motion.div key={c.title} variants={item} className="quick-info-card">
              <div className="quick-info-icon">{c.emoji}</div>
              <h3 className="quick-info-title">{c.title}</h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
