"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, MapPin, ArrowRight, Clock, Users } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import PageHeader from "@/components/PageHeader";

interface EventItem {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: "gala" | "sport" | "forum" | "retrouvailles" | "solidarite";
  isFeatured?: boolean;
}

const EVENTS: EventItem[] = [
  {
    id: 1,
    title: "Dîner Gala Annuel 2ALHB",
    description:
      "Retrouvailles et célébration de l'excellence. Une soirée de gala réunissant toutes les générations d'anciens élèves autour d'un dîner prestigieux.",
    date: "2026-06-15",
    time: "19:00",
    location: "Hôtel Ivoire, Abidjan",
    category: "gala",
    isFeatured: true,
  },
  {
    id: 2,
    title: "Tournoi Sportif Inter-Promotions",
    description:
      "Football, basketball et athlétisme. Un moment de convivialité et de compétition amicale entre promotions du LHB.",
    date: "2026-07-20",
    time: "08:00",
    location: "Stade du Lycée HB, Korhogo",
    category: "sport",
    isFeatured: true,
  },
  {
    id: 3,
    title: "Forum Mentorat & Insertion",
    description:
      "Accompagnement des jeunes diplômés par les aînés. Ateliers CV, simulations d'entretien, networking et partage d'expériences.",
    date: "2026-08-10",
    time: "09:00",
    location: "Salle de conférence, Plateau, Abidjan",
    category: "forum",
    isFeatured: true,
  },
  {
    id: 4,
    title: "Retrouvailles Promotion 2000-2005",
    description:
      "Un week-end dédié aux promotions 2000 à 2005. Visite du lycée, déjeuner convivial et soirée de retrouvailles.",
    date: "2026-09-12",
    time: "10:00",
    location: "Lycée Houphouët-Boigny, Korhogo",
    category: "retrouvailles",
  },
  {
    id: 5,
    title: "Journée de Solidarité — Rentrée Scolaire",
    description:
      "Distribution de fournitures scolaires et de bourses aux élèves méritants du LHB. Mobilisation de tous les membres.",
    date: "2026-09-28",
    time: "08:30",
    location: "Lycée Houphouët-Boigny, Korhogo",
    category: "solidarite",
  },
  {
    id: 6,
    title: "Afterwork Networking — Abidjan",
    description:
      "Soirée décontractée pour élargir son réseau professionnel. Échanges entre anciens de toutes promotions dans un cadre convivial.",
    date: "2026-10-18",
    time: "18:30",
    location: "Rooftop Le Plateau, Abidjan",
    category: "forum",
  },
  {
    id: 7,
    title: "Assemblée Générale Annuelle",
    description:
      "Bilan de l'année, élection du bureau, présentation des projets à venir. Tous les membres sont invités à participer.",
    date: "2026-12-14",
    time: "09:00",
    location: "Salle polyvalente, Korhogo",
    category: "retrouvailles",
  },
];

const categoryLabels: Record<string, { label: string; color: string }> = {
  gala: { label: "Gala", color: "bg-orange text-white" },
  sport: { label: "Sport", color: "bg-green text-white" },
  forum: { label: "Forum", color: "bg-blue-600 text-white" },
  retrouvailles: { label: "Retrouvailles", color: "bg-purple-600 text-white" },
  solidarite: { label: "Solidarité", color: "bg-pink-600 text-white" },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function AnimSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ y: 40, opacity: 0 }} animate={inView ? { y: 0, opacity: 1 } : {}} transition={{ duration: 0.6, delay }} className={className}>
      {children}
    </motion.div>
  );
}

function FeaturedEvent({ event, index }: { event: EventItem; index: number }) {
  const cat = categoryLabels[event.category];
  return (
    <AnimSection delay={index * 0.1}>
      <div className="bg-white dark:bg-dark-card rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 border border-gray-100 dark:border-dark-border">
        <div className="h-48 bg-gradient-to-br from-green to-green-light relative flex items-center justify-center">
          <Calendar className="text-white/20" size={80} />
          <div className="absolute top-4 left-4">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${cat.color}`}>
              {cat.label}
            </span>
          </div>
          <div className="absolute bottom-4 right-4 bg-white dark:bg-dark-card rounded-xl px-4 py-2 text-center shadow-lg">
            <span className="text-2xl font-bold text-orange block leading-none">
              {new Date(event.date).getDate()}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
              {new Date(event.date).toLocaleDateString("fr-FR", { month: "short" })}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-green dark:text-green-light mb-3 group-hover:text-orange transition-colors">
            {event.title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 leading-relaxed">
            {event.description}
          </p>

          <div className="space-y-2 mb-5">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Calendar size={14} className="text-orange shrink-0" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock size={14} className="text-orange shrink-0" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <MapPin size={14} className="text-orange shrink-0" />
              <span>{event.location}</span>
            </div>
          </div>

          <button className="flex items-center gap-2 text-orange font-semibold text-sm hover:gap-3 transition-all">
            En savoir plus <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </AnimSection>
  );
}

function EventRow({ event, index }: { event: EventItem; index: number }) {
  const cat = categoryLabels[event.category];
  return (
    <AnimSection delay={index * 0.05}>
      <div className="flex flex-col sm:flex-row gap-5 p-5 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border hover:shadow-md hover:border-orange/20 transition-all group">
        {/* Date badge */}
        <div className="w-20 h-20 bg-gray-50 dark:bg-dark-bg rounded-xl flex flex-col items-center justify-center shrink-0">
          <span className="text-2xl font-bold text-orange leading-none">
            {new Date(event.date).getDate()}
          </span>
          <span className="text-xs text-gray-400 uppercase mt-1">
            {new Date(event.date).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${cat.color}`}>
              {cat.label}
            </span>
          </div>
          <h3 className="font-bold text-green dark:text-green-light group-hover:text-orange transition-colors mb-1">
            {event.title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-2">
            {event.description}
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1">
              <Clock size={12} /> {event.time}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={12} /> {event.location}
            </span>
          </div>
        </div>
      </div>
    </AnimSection>
  );
}

export default function EvenementsPage() {
  const featured = EVENTS.filter((e) => e.isFeatured);
  const upcoming = EVENTS.filter((e) => !e.isFeatured);

  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          title="Événements"
          subtitle="Galas, retrouvailles, tournois sportifs, forums professionnels — retrouvez tous les rendez-vous de la 2ALHB."
          breadcrumbs={[{ label: "Événements", href: "/evenements" }]}
        />

        {/* Featured events */}
        <section className="py-16 bg-gray-50 dark:bg-dark-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimSection className="mb-10">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-8 bg-orange rounded-full" />
                <h2 className="text-2xl font-bold text-green dark:text-green-light">
                  À ne pas manquer
                </h2>
              </div>
            </AnimSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((event, i) => (
                <FeaturedEvent key={event.id} event={event} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* All upcoming events */}
        <section className="py-16 bg-white dark:bg-dark-bg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimSection className="mb-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-green rounded-full" />
                  <h2 className="text-2xl font-bold text-green dark:text-green-light">
                    Tous les événements
                  </h2>
                </div>
                <span className="text-sm text-gray-400 dark:text-gray-500">
                  {EVENTS.length} événements
                </span>
              </div>
            </AnimSection>

            <div className="space-y-4">
              {EVENTS.map((event, i) => (
                <EventRow key={event.id} event={event} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gray-50 dark:bg-dark-card">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <AnimSection>
              <Users className="text-orange mx-auto mb-4" size={40} />
              <h2 className="text-2xl font-bold text-green dark:text-green-light mb-4">
                Vous organisez un événement ?
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                Proposez vos idées d&apos;événements au bureau. Retrouvailles de promotion,
                activités sportives, conférences — toutes les initiatives sont les bienvenues.
              </p>
              <Link
                href="/#contact"
                className="inline-block bg-orange text-white px-8 py-4 rounded-full font-semibold hover:bg-orange-dark transition-all hover:scale-105 shadow-lg"
              >
                Nous contacter
              </Link>
            </AnimSection>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
