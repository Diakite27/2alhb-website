"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Globe, TrendingUp, GraduationCap } from "lucide-react";
import { FALLBACK_STATS } from "@/lib/constants";
import type { SiteStats } from "@/lib/api";

function useCounter(end: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start]);

  return count;
}

const statItems = [
  { key: "members_count" as const, label: "Membres", icon: Users, suffix: "+" },
  { key: "countries_count" as const, label: "Pays", icon: Globe, suffix: "+" },
  { key: "insertion_rate" as const, label: "Taux d'insertion", icon: TrendingUp, suffix: "%" },
  { key: "promotions_count" as const, label: "Promotions", icon: GraduationCap, suffix: "" },
];

function StatCard({
  value,
  label,
  icon: Icon,
  suffix,
  started,
  index,
}: {
  value: number;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  suffix: string;
  started: boolean;
  index: number;
}) {
  const count = useCounter(value, 2000, started);

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={started ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="flex flex-col items-center gap-1 sm:gap-2 p-3 sm:p-6 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl"
    >
      <Icon className="text-orange" size={22} />
      <span className="text-xl sm:text-3xl md:text-4xl font-bold text-white">
        {count}
        {suffix}
      </span>
      <span className="text-[10px] sm:text-sm text-white/70 leading-tight text-center">{label}</span>
    </motion.div>
  );
}

export default function CounterStats() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [stats, setStats] = useState<SiteStats>(FALLBACK_STATS);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/stats/`)
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => {
        /* use fallback */
      });
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 max-w-4xl mx-auto">
      {statItems.map((item, i) => (
        <StatCard
          key={item.key}
          value={stats[item.key]}
          label={item.label}
          icon={item.icon}
          suffix={item.suffix}
          started={isInView}
          index={i}
        />
      ))}
    </div>
  );
}
