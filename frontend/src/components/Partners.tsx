"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

const partners = [
  { name: "Lycée Houphouët-Boigny de Korhogo", logo: "/lhb.jpeg", url: "#" },
  { name: "DRENA Korhogo", logo: "/drena.jpg", url: "#" },
];

// Duplicate for infinite scroll effect
const marqueePartners = [...partners, ...partners, ...partners, ...partners];

export default function Partners() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-16 lg:py-20 bg-white dark:bg-dark-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-green dark:text-green-light mb-4">
            Nos Partenaires
          </h2>
          <div className="w-20 h-1 bg-orange mx-auto mb-6 rounded-full" />
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Ils nous accompagnent dans notre mission
          </p>
        </motion.div>
      </div>

      {/* Marquee infinite scroll */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-dark-bg to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-dark-bg to-transparent z-10" />

        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex gap-6 sm:gap-12 items-center w-max"
        >
          {marqueePartners.map((partner, i) => (
            <a
              key={i}
              href={partner.url}
              className="flex flex-col items-center gap-3 group shrink-0"
            >
              <div className="w-20 sm:w-28 h-20 sm:h-28 rounded-2xl bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-dark-border flex items-center justify-center p-2 sm:p-3 group-hover:border-orange/30 group-hover:shadow-lg transition-all duration-300">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={80}
                  height={80}
                  className="object-contain rounded-lg"
                />
              </div>
              <span className="text-xs text-gray-400 font-medium text-center max-w-[120px] group-hover:text-orange transition-colors">
                {partner.name}
              </span>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
