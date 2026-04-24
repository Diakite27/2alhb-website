"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Heart,
  GraduationCap,
  Briefcase,
  Users,
  HandHeart,
  Trophy,
} from "lucide-react";

const objectives = [
  {
    icon: Heart,
    title: "Fraternité",
    description:
      "Maintenir et renforcer les liens fraternels, de solidarité et d'amitié entre tous les anciens élèves, indépendamment de leur promotion.",
  },
  {
    icon: GraduationCap,
    title: "Excellence académique",
    description:
      "Promouvoir l'excellence par des programmes d'échanges, formations complémentaires et séminaires thématiques.",
  },
  {
    icon: HandHeart,
    title: "Soutien au lycée",
    description:
      "Soutenir le Lycée Houphouët-Boigny par des donations, bourses d'études et travaux d'infrastructure.",
  },
  {
    icon: Briefcase,
    title: "Réseau professionnel",
    description:
      "Créer un réseau actif facilitant l'entraide, les partenariats économiques et les opportunités de carrière.",
  },
  {
    icon: Users,
    title: "Mentorat & Insertion",
    description:
      "Accompagner les jeunes diplômés par le mentorat, le conseil en carrière et l'accès à l'emploi.",
  },
  {
    icon: Trophy,
    title: "Mémoire collective",
    description:
      "Perpétuer l'histoire du lycée en documentant ses archives, photographies et témoignages.",
  },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="py-12 lg:py-16 bg-gray-50 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-green dark:text-green-light mb-4">
            Notre Mission
          </h2>
          <div className="w-20 h-1 bg-orange mx-auto mb-6 rounded-full" />
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            L&apos;Amicale des Anciens du Lycée Houphouët-Boigny œuvre pour la
            solidarité, l&apos;excellence et le rayonnement de notre alma mater.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {objectives.map((obj, i) => (
            <motion.div
              key={obj.title}
              initial={{ y: 40, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.35, delay: 0.05 + i * 0.06 }}
              className="rounded-2xl p-7 group cursor-default transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-orange/10 dark:bg-orange/20 group-hover:bg-orange/20 dark:group-hover:bg-orange/30 transition-colors">
                <obj.icon className="text-orange" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-green dark:text-green-light">
                {obj.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                {obj.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
