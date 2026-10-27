"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  MapPin,
  Building2,
  ExternalLink,
  Search,
  Filter,
  CalendarDays,
  Users,
  CheckCircle,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import PageHeader from "@/components/PageHeader";
import { api, JobOffer } from "@/lib/api";
import { useApiList } from "@/lib/hooks";
import { useAuth } from "@/lib/auth";

const FALLBACK_JOBS: JobOffer[] = [
  {
    id: 1,
    title: "Ingénieur Développement Full Stack",
    company: "Tech Solutions CI",
    location: "Abidjan, Côte d'Ivoire",
    job_type: "cdi",
    sector: "Informatique",
    description: "Nous recherchons un développeur Full Stack expérimenté pour rejoindre notre équipe produit.",
    missions: "- Développer des applications web et mobile\n- Participer aux code reviews\n- Contribuer à l'architecture technique",
    profile: "Passionné par le développement, autonome et rigoureux. Bon esprit d'équipe.",
    skills: "React, Node.js, PostgreSQL, Git, Docker",
    education: "Bac+5 en Informatique ou équivalent. Minimum 3 ans d'expérience.",
    apply_url: "",
    posted_by_info: null, posted_by_name: "Kouadio Yao Marc — Promotion 1998",
    poster_email: "",
    is_active: true,
    created_at: "2026-04-20",
  },
  {
    id: 2,
    title: "Responsable Administratif et Financier",
    company: "Groupe SIFCA",
    location: "Abidjan, Côte d'Ivoire",
    job_type: "cdi",
    sector: "Finance",
    description: "Poste de RAF pour superviser la comptabilité, le contrôle de gestion et la trésorerie.",
    missions: "- Superviser la comptabilité générale\n- Gérer la trésorerie\n- Produire les reportings financiers",
    profile: "Leader naturel avec excellentes capacités d'analyse et de synthèse.",
    skills: "Comptabilité, Contrôle de gestion, SAP, Excel avancé",
    education: "BAC+5 en finance/comptabilité avec 5 ans d'expérience minimum.",
    apply_url: "",
    posted_by_info: null, posted_by_name: "Traoré Aminata — Promotion 2005",
    poster_email: "",
    is_active: true,
    created_at: "2026-04-18",
  },
];

const typeLabels: Record<string, { label: string; color: string }> = {
  cdi: { label: "CDI", color: "bg-green text-white" },
  cdd: { label: "CDD", color: "bg-blue-600 text-white" },
  stage: { label: "Stage", color: "bg-orange text-white" },
  freelance: { label: "Freelance", color: "bg-purple-600 text-white" },
};

function formatDate(dateStr: string) {
  const now = new Date();
  const posted = new Date(dateStr);
  const diffDays = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  return posted.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function AnimSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.4, delay }} className={className}>
      {children}
    </motion.div>
  );
}

function JobCard({ job }: { job: JobOffer }) {
  const t = typeLabels[job.job_type] ?? { label: job.job_type, color: "bg-gray-500 text-white" };
  const [expanded, setExpanded] = useState(false);
  
  // Determine if job has detailed fields
  const hasDetails = job.missions || job.profile || job.skills || job.education;
  
  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6 hover:shadow-lg hover:border-orange/20 transition-all group">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${t.color}`}>
          {t.label}
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-dark-border px-2.5 py-1 rounded-full">
          {job.sector}
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">
          {formatDate(job.created_at)}
        </span>
      </div>

      <h3 className="text-lg font-bold text-green dark:text-green-light mb-2 group-hover:text-orange transition-colors">
        {job.title}
      </h3>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400 mb-3">
        <span className="flex items-center gap-1.5">
          <Building2 size={14} className="text-orange shrink-0" />
          {job.company}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin size={14} className="text-orange shrink-0" />
          {job.location}
        </span>
      </div>

      {/* Description générale */}
      {job.description && (
        <p className="text-body text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">
          {job.description}
        </p>
      )}

      {/* Détails structurés (expandable) */}
      {hasDetails && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-orange font-medium hover:underline mb-4 flex items-center gap-1"
          >
            {expanded ? "Masquer les détails" : "Voir les détails"}
            <span className={`transition-transform ${expanded ? "rotate-180" : ""}`}>▼</span>
          </button>

          {expanded && (
            <div className="space-y-4 mb-4 p-4 bg-gray-50 dark:bg-dark-bg rounded-xl">
              {job.missions && (
                <div>
                  <h4 className="text-sm font-semibold text-green dark:text-green-light mb-1">Missions</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">{job.missions}</p>
                </div>
              )}
              {job.profile && (
                <div>
                  <h4 className="text-sm font-semibold text-green dark:text-green-light mb-1">Profil recherché</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">{job.profile}</p>
                </div>
              )}
              {job.skills && (
                <div>
                  <h4 className="text-sm font-semibold text-green dark:text-green-light mb-1">Compétences clés</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">{job.skills}</p>
                </div>
              )}
              {job.education && (
                <div>
                  <h4 className="text-sm font-semibold text-green dark:text-green-light mb-1">Diplôme / Formation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">{job.education}</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Publisher info */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-xl mb-4">
        <div className="w-8 h-8 bg-green/10 rounded-full flex items-center justify-center shrink-0">
          <Users size={14} className="text-green" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-green dark:text-green-light truncate">
            {job.posted_by_name || "Membre 2ALHB"}
          </p>
          <p className="text-[10px] text-gray-400">Référent de l&apos;offre</p>
        </div>
        {job.poster_email && (
          <a
            href={`mailto:${job.poster_email}`}
            className="text-xs text-orange font-medium hover:underline shrink-0"
          >
            Contacter
          </a>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {job.apply_url && (
          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-orange text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-dark transition-all"
          >
            Postuler <ExternalLink size={14} />
          </a>
        )}
        {job.poster_email && (
          <a
            href={`mailto:${job.poster_email}?subject=Candidature : ${encodeURIComponent(job.title)}&body=${encodeURIComponent(`Bonjour,\n\nJe suis intéressé(e) par l'offre "${job.title}" chez ${job.company}.\n\nCordialement`)}`}
            className="flex items-center gap-1.5 border border-orange text-orange px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange/5 transition-all"
          >
            <Mail size={14} /> Envoyer un email
          </a>
        )}
      </div>
    </div>
  );
}

export default function EmploisPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");
  const [jobForm, setJobForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "cdi",
    sector: "",
    description: "",
    missions: "",
    profile: "",
    skills: "",
    education: "",
    posterName: "",
    posterPromotion: "",
    posterEmail: "",
    applyUrl: "",
  });

  const { data: jobs } = useApiList(() => api.getJobs(), FALLBACK_JOBS);
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/connexion");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
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

  const handleJobChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setJobForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("loading");
    setSubmitError("");
    try {
      await api.createJob({
        title: jobForm.title,
        company: jobForm.company,
        location: jobForm.location,
        job_type: jobForm.type,
        sector: jobForm.sector,
        description: jobForm.description,
        missions: jobForm.missions,
        profile: jobForm.profile,
        skills: jobForm.skills,
        education: jobForm.education,
        poster_email: jobForm.posterEmail,
        apply_url: jobForm.applyUrl || undefined,
      }, token || undefined);
      setSubmitStatus("success");
    } catch {
      setSubmitError("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
      setSubmitStatus("error");
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border dark:bg-dark-card dark:text-gray-200 focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none transition-all text-sm";

  const filtered = jobs.filter((job) => {
    const matchSearch =
      search === "" ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.sector.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || job.job_type === filterType;
    return matchSearch && matchType;
  });

  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          title="Offres d'emploi"
          subtitle="Les membres de la 2ALHB partagent des opportunités professionnelles pour la communauté."
          breadcrumbs={[{ label: "Emplois", href: "/emplois" }]}
        />

        {/* Search & filters */}
        <section className="py-8 bg-white dark:bg-dark-bg border-b border-gray-100 dark:border-dark-border sticky top-16 sm:top-20 z-30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un poste, entreprise, secteur..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border dark:bg-dark-card dark:text-gray-200 focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none transition-all text-sm"
                />
              </div>
              <div className="relative">
                <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-9 pr-8 py-3 rounded-xl border border-gray-200 dark:border-dark-border dark:bg-dark-card dark:text-gray-200 focus:border-orange outline-none text-sm appearance-none bg-white dark:bg-dark-card"
                >
                  <option value="all">Tous les types</option>
                  <option value="cdi">CDI</option>
                  <option value="cdd">CDD</option>
                  <option value="stage">Stage</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Job listings */}
        <section className="py-12 bg-gray-50 dark:bg-dark-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimSection className="flex items-center justify-between mb-8">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {filtered.length} offre{filtered.length > 1 ? "s" : ""} disponible{filtered.length > 1 ? "s" : ""}
              </p>
            </AnimSection>

            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <Briefcase className="text-gray-300 dark:text-gray-600 mx-auto mb-4" size={48} />
                <p className="text-gray-500 dark:text-gray-400 font-medium">Aucune offre ne correspond à votre recherche</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Essayez avec d&apos;autres mots-clés</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((job, i) => (
                  <AnimSection key={job.id} delay={i * 0.05}>
                    <JobCard job={job} />
                  </AnimSection>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA — Share a job */}
        <section id="publier" className="py-16 bg-white dark:bg-dark-bg">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimSection>
              {showForm ? (
                submitStatus === "success" ? (
                  <div className="bg-green/5 dark:bg-green/10 rounded-3xl p-12 text-center">
                    <CheckCircle className="text-green dark:text-green-light mx-auto mb-4" size={56} />
                    <h3 className="text-2xl font-bold text-green dark:text-green-light mb-2">Offre soumise !</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Votre offre sera publiée après validation par le bureau. Merci pour votre contribution.
                    </p>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-dark-border p-8 sm:p-10">
                    <h2 className="text-2xl font-bold text-green dark:text-green-light mb-2">Publier une offre</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
                      Remplissez ce formulaire pour partager une opportunité avec la communauté.
                    </p>

                    {submitStatus === "error" && submitError && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm mb-6">
                        {submitError}
                      </div>
                    )}

                    <form onSubmit={handleSubmitJob} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Intitulé du poste *</label>
                          <input name="title" required value={jobForm.title} onChange={handleJobChange} className={inputClass} placeholder="Ex: Développeur Full Stack" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Entreprise *</label>
                          <input name="company" required value={jobForm.company} onChange={handleJobChange} className={inputClass} placeholder="Ex: Tech Solutions CI" />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Lieu *</label>
                          <input name="location" required value={jobForm.location} onChange={handleJobChange} className={inputClass} placeholder="Ex: Abidjan, Côte d'Ivoire" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Type de contrat *</label>
                          <select name="type" required value={jobForm.type} onChange={handleJobChange} className={inputClass}>
                            <option value="cdi">CDI</option>
                            <option value="cdd">CDD</option>
                            <option value="stage">Stage</option>
                            <option value="freelance">Freelance</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Secteur *</label>
                          <input name="sector" required value={jobForm.sector} onChange={handleJobChange} className={inputClass} placeholder="Ex: Informatique" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email de contact *</label>
                          <input name="posterEmail" type="email" required value={jobForm.posterEmail} onChange={handleJobChange} className={inputClass} placeholder="votre@email.com" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description générale</label>
                        <textarea name="description" rows={3} value={jobForm.description} onChange={handleJobChange} className={`${inputClass} resize-none`} placeholder="Présentation générale du poste et de l'entreprise..." />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Missions *</label>
                        <textarea name="missions" required rows={4} value={jobForm.missions} onChange={handleJobChange} className={`${inputClass} resize-none`} placeholder="- Mission 1&#10;- Mission 2&#10;- Mission 3" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Profil recherché *</label>
                        <textarea name="profile" required rows={3} value={jobForm.profile} onChange={handleJobChange} className={`${inputClass} resize-none`} placeholder="Qualités et caractéristiques du candidat idéal..." />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Compétences clés *</label>
                        <textarea name="skills" required rows={3} value={jobForm.skills} onChange={handleJobChange} className={`${inputClass} resize-none`} placeholder="Compétences techniques et soft skills requises..." />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Diplôme / Formation</label>
                        <textarea name="education" rows={2} value={jobForm.education} onChange={handleJobChange} className={`${inputClass} resize-none`} placeholder="Niveau d'études, diplômes requis, certifications..." />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Lien pour postuler (optionnel)</label>
                        <input name="applyUrl" type="url" value={jobForm.applyUrl} onChange={handleJobChange} className={inputClass} placeholder="https://..." />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={submitStatus === "loading"}
                          className="flex-1 bg-orange text-white py-3.5 rounded-xl font-semibold hover:bg-orange-dark transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                          <Briefcase size={18} />
                          {submitStatus === "loading" ? "Envoi..." : "Soumettre l'offre"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowForm(false)}
                          className="px-6 py-3.5 rounded-xl border border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-dark-border transition-colors"
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  </div>
                )
              ) : (
                <div className="bg-gradient-to-r from-green-dark to-green rounded-3xl p-10 sm:p-14 text-center">
                  <Briefcase className="text-orange mx-auto mb-4" size={40} />
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                    Vous recrutez ?
                  </h2>
                  <p className="text-white/60 mb-8 max-w-lg mx-auto">
                    Partagez vos offres d&apos;emploi avec la communauté des anciens du
                    Lycée HOUPHOUËT-BOIGNY de Korhogo. C&apos;est gratuit et réservé aux membres.
                  </p>
                  <button
                    onClick={() => {
                      if (!user) {
                        router.push("/connexion");
                        return;
                      }
                      setShowForm(true);
                    }}
                    className="bg-orange text-white px-8 py-4 rounded-full font-semibold hover:bg-orange-dark transition-all hover:scale-105 shadow-lg"
                  >
                    Publier une offre
                  </button>
                </div>
              )}
            </AnimSection>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
