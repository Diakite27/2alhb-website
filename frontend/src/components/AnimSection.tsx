"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface AnimSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function AnimSection({ children, className = "", delay = 0 }: AnimSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ y: 30, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
