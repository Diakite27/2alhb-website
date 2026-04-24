"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, User } from "lucide-react";
import { FALLBACK_TESTIMONIALS } from "@/lib/constants";
import type { Testimonial } from "@/lib/api";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(FALLBACK_TESTIMONIALS);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/testimonials/`)
      .then((r) => r.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          setTestimonials(data.results);
        }
      })
      .catch(() => {});
  }, []);

  const navigate = (dir: number) => {
    setDirection(dir);
    setCurrent((c) => (c + dir + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const timer = setInterval(() => navigate(1), 6000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testimonials.length]);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0, scale: 0.9 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0, scale: 0.9 }),
  };

  const t = testimonials[current];
  const prevIdx = (current - 1 + testimonials.length) % testimonials.length;
  const nextIdx = (current + 1) % testimonials.length;

  return (
    <section id="testimonials" className="py-14 lg:py-24 bg-white dark:bg-dark-bg relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-green/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-green dark:text-green-light mb-4">
            Paroles d&apos;anciens
          </h2>
          <div className="w-20 h-1 bg-orange mx-auto mb-6 rounded-full" />
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Ce que nos membres disent de la 2ALHB
          </p>
        </motion.div>

        {/* Stacked cards */}
        <div className="max-w-4xl mx-auto relative" style={{ minHeight: 320 }}>
          {/* Background cards for depth effect */}
          <div className="hidden sm:block absolute top-4 left-4 right-4 bottom-0 bg-green/5 rounded-3xl -z-10 transform rotate-1" />
          <div className="hidden sm:block absolute top-8 left-8 right-8 bottom-0 bg-orange/5 rounded-3xl -z-20 transform -rotate-1" />

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="bg-white dark:bg-dark-card rounded-3xl p-8 sm:p-12 shadow-lg border border-gray-100 dark:border-dark-border"
            >
              <Quote className="text-orange/15" size={50} />

              <p className="text-body text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed my-6 italic">
                &ldquo;{t.content}&rdquo;
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-dark-border">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green to-green-light flex items-center justify-center overflow-hidden shrink-0">
                  {t.member.photo ? (
                    <img
                      src={t.member.photo}
                      alt={t.member.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="text-white" size={24} />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-green dark:text-green-light">{t.member.full_name}</h4>
                  <p className="text-orange text-sm font-medium">Promotion {t.member.promotion}</p>
                  <p className="text-gray-400 text-sm">
                    {t.member.profession}
                    {t.member.company && ` — ${t.member.company}`}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-6 mt-10">
          <button
            onClick={() => navigate(-1)}
            className="w-12 h-12 rounded-full bg-green/10 flex items-center justify-center hover:bg-green hover:text-white transition-all"
            aria-label="Précédent"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > current ? 1 : -1);
                  setCurrent(i);
                }}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === current ? "bg-orange w-8" : "bg-gray-200 w-2.5 hover:bg-gray-300"
                }`}
                aria-label={`Témoignage ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => navigate(1)}
            className="w-12 h-12 rounded-full bg-green/10 flex items-center justify-center hover:bg-green hover:text-white transition-all"
            aria-label="Suivant"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
