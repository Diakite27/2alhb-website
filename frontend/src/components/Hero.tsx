"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { SITE_FULL_NAME } from "@/lib/constants";
import CounterStats from "./CounterStats";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[75svh] sm:h-[85vh] flex flex-col overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-dark via-green to-green-light" />

      {/* Animated shapes */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-1/3 w-64 h-64 bg-orange/10 rounded-full blur-2xl"
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -40, 0],
            x: [0, i % 2 === 0 ? 20 : -20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5 + i * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
          className="absolute w-2 h-2 bg-orange/40 rounded-full"
          style={{
            top: `${20 + i * 12}%`,
            left: `${10 + i * 15}%`,
          }}
        />
      ))}

      {/* Main content */}
      <motion.div
        className="relative z-10 flex-1 flex items-center justify-center pt-20 sm:pt-24 pb-4"
        style={{ opacity: textOpacity, y: textY }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          {/* Logo with glow effect */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative inline-block mb-6"
          >
            {/* Glow ring */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-orange/30 rounded-full blur-xl scale-125"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-3 border-2 border-dashed border-white/20 rounded-full"
            />
            <Image
              src="/images/logo.png"
              alt="2ALHB"
              width={120}
              height={120}
              className="relative rounded-full shadow-2xl border-4 border-white/20"
              priority
            />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4"
          >
            <span className="text-orange">2A</span>
            <span className="text-green-light">LHB</span>
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="text-sm sm:text-lg md:text-xl text-white mb-1 sm:mb-2 font-semibold drop-shadow-lg px-2"
          >
            {SITE_FULL_NAME}
          </motion.p>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xs sm:text-base md:text-lg font-semibold italic mb-6 sm:mb-10 drop-shadow-md"
          >
            <span className="text-orange">Connecter les anciens</span>
            <span className="text-white/60">, </span>
            <span className="text-white">inspirer les générations futures</span>
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.75 }}
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
              className="border-2 border-white/30 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-lg font-semibold hover:bg-white/10 transition-all"
            >
              En savoir plus
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats — anchored to bottom */}
      <div className="relative z-10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <CounterStats />
        </div>
      </div>
    </section>
  );
}
