"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Briefcase, MapPin, Building2, Calendar, ArrowLeft,
  Mail, Phone, User, ExternalLink, GraduationCap,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import type { JobOffer } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const typeLabels: Record<string, { label: string; color: string }> = {
  cdi: { label: "CDI", color: "bg-green text-white" },
  cdd: { label: "CDD", color: "bg-blue-600 text-white" },
  stage: { label: "Stage", color: "bg-orange text-white" },
  freelance: { label: "Freelance", color: "bg-purple-600 text-white" },
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token, isLoading } = useAuth();
  const [job, setJob] = useState<JobOffer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/connexion");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const id = Number(params.id);
    if (id && token) {
      api.getJob(id, token)
        .then((data) => { setJob(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [params.id, token]);

  if (isLoading || !user || loading) {
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

  if (!job) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-28 flex flex-col items-center justify-center gap-4">
          <Briefcase className="text-gray-300" size={48} />
          <p className="text-gray-500 dark:text-gray-400 text-lg">Offre introuvable</p>
          <Link href="/emplois" className="text-orange font-medium flex items-center gap-2 hover:gap-3 transition-all">
            <ArrowLeft size={16} /> Retour aux offres
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const t = typeLabels[job.job_type] ?? { label: job.job_type, color: "bg-gray-500 text-white" };
  const ref = job.posted_by_info;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/emplois" className="inline-flex items-center gap-2 text-orange font-medium mb-6 hover:gap-3 transition-all text-sm">
            <ArrowLeft size={16} /> Toutes les offres
          </Link>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
            {/* Job details */}
            <div className="bg-white dark:bg-dark-card rounded-2xl p-6 sm:p-10 shadow-sm mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${t.color}`}>{t.label}</span>
                <span className="text-xs text-gray-400 bg-gray-100 dark:bg-dark-border px-3 py-1.5 rounded-full">{job.sector}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-green dark:text-green-light mb-4">{job.title}</h1>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <span className="flex items-center gap-2"><Building2 size={16} className="text-orange" />{job.company}</span>
                <span className="flex items-center gap-2"><MapPin size={16} className="text-orange" />{job.location}</span>
                <span className="flex items-center gap-2"><Calendar size={16} className="text-orange" />{new Date(job.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
              </div>

              <div className="border-t border-gray-100 dark:border-dark-border pt-6">
                <h2 className="font-bold text-green dark:text-green-light mb-3">Description du poste</h2>
                <p className="text-body text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{job.description}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mt-8">
                {job.apply_url && (
                  <a href={job.apply_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-orange text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-dark transition-all">
                    Postuler <ExternalLink size={16} />
                  </a>
                )}
                {(ref?.email || job.poster_email) && (
                  <a
                    href={`mailto:${ref?.email || job.poster_email}?subject=Candidature : ${encodeURIComponent(job.title)}&body=${encodeURIComponent(`Bonjour,\n\nJe suis intéressé(e) par l'offre "${job.title}" chez ${job.company}.\n\nCordialement`)}`}
                    className="flex items-center gap-2 border border-orange text-orange px-6 py-3 rounded-xl font-semibold hover:bg-orange/5 transition-all"
                  >
                    <Mail size={16} /> Contacter par email
                  </a>
                )}
              </div>
            </div>

            {/* Referent card */}
            {ref && (
              <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-green dark:text-green-light mb-4">Publié par</h2>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-green/10 flex items-center justify-center overflow-hidden shrink-0">
                    {ref.photo ? (
                      <img src={ref.photo} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="text-green" size={24} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-green dark:text-green-light text-lg">{ref.full_name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {ref.profession}{ref.company && ` — ${ref.company}`}
                    </p>
                    {ref.promotion_year && (
                      <p className="text-xs text-orange font-medium mt-1 flex items-center gap-1">
                        <GraduationCap size={12} /> Promotion {ref.promotion_year}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3 mt-4">
                      {ref.email && (
                        <a href={`mailto:${ref.email}`} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange transition-colors">
                          <Mail size={14} /> {ref.email}
                        </a>
                      )}
                      {ref.phone && (
                        <a href={`tel:${ref.phone}`} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange transition-colors">
                          <Phone size={14} /> {ref.phone}
                        </a>
                      )}
                      {ref.linkedin && (
                        <a href={ref.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange transition-colors">
                          <ExternalLink size={14} /> LinkedIn
                        </a>
                      )}
                    </div>

                    {ref.city && (
                      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                        <MapPin size={12} /> {ref.city}, {ref.country}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
