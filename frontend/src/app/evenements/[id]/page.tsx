"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import type { Event } from "@/lib/api";
import { getCategoryStyle } from "@/lib/event-utils";

export default function EventDetailPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = Number(params.id);
    if (id) {
      api.getEvent(id)
        .then((data) => { setEvent(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-28 flex items-center justify-center">
          <p className="text-gray-400">Chargement...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-28 flex flex-col items-center justify-center gap-4">
          <p className="text-gray-500 dark:text-gray-400 text-lg">Événement introuvable</p>
          <Link href="/evenements" className="text-orange font-medium flex items-center gap-2 hover:gap-3 transition-all">
            <ArrowLeft size={16} /> Retour aux événements
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const cat = getCategoryStyle(event.category);
  const date = new Date(event.date);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link href="/evenements" className="inline-flex items-center gap-2 text-orange font-medium mb-6 hover:gap-3 transition-all text-sm">
            <ArrowLeft size={16} /> Tous les événements
          </Link>

          <motion.article
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Header image */}
            <div className="h-56 sm:h-72 bg-gradient-to-br from-green to-green-light rounded-3xl flex items-center justify-center relative overflow-hidden mb-8">
              {event.image ? (
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
              ) : (
                <Calendar className="text-white/20" size={80} />
              )}
              <div className="absolute top-4 left-4">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${cat.color}`}>
                  {cat.label}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-dark-card rounded-2xl p-6 sm:p-10 shadow-sm">
              <h1 className="text-2xl sm:text-3xl font-bold text-green dark:text-green-light mb-4">
                {event.title}
              </h1>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-8">
                <span className="flex items-center gap-2">
                  <Calendar size={16} className="text-orange" />
                  {date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={16} className="text-orange" />
                  {date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin size={16} className="text-orange" />
                  {event.location}
                </span>
              </div>

              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-body text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            </div>
          </motion.article>
        </div>
      </main>
      <Footer />
    </>
  );
}
