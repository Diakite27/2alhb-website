"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  breadcrumbs?: { label: string; href: string }[];
}

export default function PageHeader({ title, subtitle, breadcrumbs }: PageHeaderProps) {
  return (
    <section className="relative pt-24 sm:pt-28 pb-14 sm:pb-20 overflow-hidden">
      {/* Geometric background */}
      <div className="absolute inset-0 bg-green-dark" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-orange/10 clip-diagonal hidden sm:block" />
      <div className="absolute bottom-0 left-0 w-48 sm:w-72 h-48 sm:h-72 bg-orange/5 rounded-full -translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-10 right-10 w-24 sm:w-40 h-24 sm:h-40 border-2 border-white/10 rounded-full hidden sm:block" />
      <div className="absolute top-20 right-20 w-12 sm:w-20 h-12 sm:h-20 border border-orange/20 rounded-full hidden sm:block" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {breadcrumbs && (
          <motion.nav
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-sm text-white/60 mb-8"
          >
            <Link href="/" className="hover:text-orange transition-colors">
              <Home size={14} />
            </Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                <ChevronRight size={12} />
                <Link href={crumb.href} className="hover:text-orange transition-colors">
                  {crumb.label}
                </Link>
              </span>
            ))}
          </motion.nav>
        )}

        <div className="max-w-2xl">
          <motion.h1
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
          >
            {title}
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 bg-orange rounded-full mb-6"
          />
          <motion.p
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/70 text-lg"
          >
            {subtitle}
          </motion.p>
        </div>
      </div>

      <style jsx>{`
        .clip-diagonal {
          clip-path: polygon(30% 0, 100% 0, 100% 100%, 0% 100%);
        }
      `}</style>
    </section>
  );
}
