"use client";

import { motion } from "framer-motion";

interface LegalSectionProps {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
  index?: number;
}

/** Carte de section pour les pages légales (mentions, confidentialité, conditions). */
export default function LegalSection({ icon, title, children, index = 0 }: LegalSectionProps) {
  return (
    <motion.section
      initial={{ y: 24, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
      className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6 sm:p-8"
    >
      <div className="flex items-center gap-3 mb-4">
        {icon && (
          <span className="w-10 h-10 rounded-xl bg-orange/10 dark:bg-orange/20 flex items-center justify-center text-orange shrink-0">
            {icon}
          </span>
        )}
        <h2 className="text-lg sm:text-xl font-bold text-green dark:text-green-light">{title}</h2>
      </div>
      <div className="text-gray-600 dark:text-gray-400 text-sm sm:text-[15px] leading-relaxed space-y-3 [&_a]:text-orange [&_a]:font-medium [&_a:hover]:underline [&_strong]:text-green dark:[&_strong]:text-green-light">
        {children}
      </div>
    </motion.section>
  );
}

/** Liste à puces stylée pour les pages légales. */
export function LegalList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-orange mt-2 shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
