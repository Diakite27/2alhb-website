"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function PageLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-green-dark flex flex-col items-center justify-center"
        >
          {/* Pulsing logo */}
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/logo.png"
              alt="2ALHB"
              width={100}
              height={100}
              className="rounded-full"
              priority
            />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-center"
          >
            <h2 className="text-2xl font-bold text-white">
              <span className="text-orange">2A</span>
              <span className="text-green-light">LHB</span>
            </h2>
            <p className="text-white/40 text-sm mt-1">L&apos;empreinte de l&apos;excellence</p>
          </motion.div>

          {/* Loading bar */}
          <motion.div className="mt-8 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="h-full bg-orange rounded-full"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
