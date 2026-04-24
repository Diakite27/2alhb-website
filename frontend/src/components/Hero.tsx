"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SITE_FULL_NAME, SITE_SLOGAN } from "@/lib/constants";
import CounterStats from "./CounterStats";

export default function Hero() {
  return (
    <section className="relative h-[75svh] sm:h-[85vh] flex flex-col overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/nav.jpeg"
          alt="Lycée Houphouët-Boigny"
          fill
          className="object-cover object-[center_30%] sm:object-center"
          sizes="100vw"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-green/25 to-black/50" />

      {/* Decorative circles — hidden on mobile */}
      <div className="hidden sm:block absolute -top-40 -right-40 w-96 h-96 bg-orange/10 rounded-full blur-3xl" />
      <div className="hidden sm:block absolute -bottom-40 -left-40 w-96 h-96 bg-orange/5 rounded-full blur-3xl" />

      {/* Main content — centered with room for stats */}
      <div className="relative z-10 flex-1 flex items-center justify-center pt-20 sm:pt-24 pb-4">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          {/* Title */}
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4"
          >
            <span className="text-orange">2A</span>
            <span className="text-green-light">LHB</span>
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-sm sm:text-lg md:text-xl text-white mb-1 sm:mb-2 font-semibold drop-shadow-lg px-2"
          >
            {SITE_FULL_NAME}
          </motion.p>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-xs sm:text-base md:text-lg text-orange font-semibold italic mb-6 sm:mb-10 drop-shadow-md"
          >
            {SITE_SLOGAN}
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0"
          >
            <a
              href="#register"
              className="bg-orange text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-lg font-semibold hover:bg-orange-dark transition-all hover:scale-105 shadow-lg"
            >
              Rejoindre l&apos;amicale
            </a>
            <a
              href="#about"
              className="border-2 border-white/40 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-lg font-semibold hover:bg-white/10 transition-all"
            >
              En savoir plus
            </a>
          </motion.div>
        </div>
      </div>

      {/* Stats — anchored to bottom */}
      <div className="relative z-10 bg-black/30 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <CounterStats />
        </div>
      </div>
    </section>
  );
}
