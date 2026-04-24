"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import TiltCard from "./TiltCard";

const DEMO_EVENTS = [
  {
    id: 1,
    title: "Dîner Gala Annuel 2ALHB",
    description:
      "Retrouvailles et célébration de l'excellence. Une soirée de gala réunissant toutes les générations d'anciens élèves.",
    date: "2026-06-15T19:00:00",
    location: "Hôtel Ivoire, Abidjan",
  },
  {
    id: 2,
    title: "Tournoi Sportif Inter-Promotions",
    description:
      "Football, basketball et athlétisme. Un moment de convivialité et de compétition amicale entre promotions.",
    date: "2026-07-20T08:00:00",
    location: "Stade du Lycée HB, Korhogo",
  },
  {
    id: 3,
    title: "Forum Mentorat & Insertion",
    description:
      "Accompagnement des jeunes diplômés par les aînés. Ateliers CV, simulations d'entretien et networking.",
    date: "2026-08-10T09:00:00",
    location: "Salle de conférence, Plateau",
  },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Events() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="events" className="py-14 lg:py-24 bg-gray-50 dark:bg-dark-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-green dark:text-green-light mb-4">
            Événements à venir
          </h2>
          <div className="w-20 h-1 bg-orange mx-auto mb-6 rounded-full" />
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Retrouvailles, galas, tournois sportifs et forums professionnels
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DEMO_EVENTS.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ y: 40, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <TiltCard className="bg-white dark:bg-dark-bg rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                {/* Image placeholder */}
                <div className="h-48 bg-gradient-to-br from-green to-green-light flex items-center justify-center">
                  <Calendar className="text-white/30" size={64} />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-green dark:text-green-light mb-3 group-hover:text-orange transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-body text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Calendar size={16} className="text-orange" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <MapPin size={16} className="text-orange" />
                    <span>{event.location}</span>
                  </div>

                  <button className="flex items-center gap-2 text-orange font-semibold hover:gap-3 transition-all">
                    En savoir plus <ArrowRight size={16} />
                  </button>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
