"use client";

import { motion } from "framer-motion";

interface AnimSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function AnimSection({ children, className = "", delay = 0 }: AnimSectionProps) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
