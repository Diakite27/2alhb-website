"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus } from "lucide-react";

export default function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past the hero
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-40 sm:hidden"
        >
          <div className="bg-green-dark/95 backdrop-blur-md border-t border-white/10 px-4 py-3 flex items-center justify-between gap-3">
            <a
              href="#register"
              className="flex-1 bg-orange text-white py-2.5 rounded-xl font-semibold text-sm text-center flex items-center justify-center gap-2 hover:bg-orange-dark transition-colors"
            >
              <UserPlus size={16} />
              Rejoindre la 2ALHB
            </a>
            <button
              onClick={() => setDismissed(true)}
              className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white transition-colors"
              aria-label="Fermer"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
