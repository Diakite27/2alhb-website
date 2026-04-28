"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Briefcase,
  MapPin,
  Clock,
  Building2,
  ExternalLink,
  Search,
  Filter,
  CalendarDays,
  Users,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import PageHeader from "@/components/PageHeader";

interface JobOffer {
  id: number;
  title: string;
  company: string;
  location: string;
  type: "cdi" | "cdd" | "stage" | "freelance";
  sector: string;
  description: string;
  postedAt: string;
  postedBy: string;
  applyUrl?: string;
}

const JOB_OFFERS: JobOffer[] = [
  {
    id: 1,
    title: "Ingénieur Développement Full Stack",
    company: "Tech Solutions CI",
    location: "Abidjan, Côte d'Ivoire",
    type: "cdi",
    sector: "Informatique",
    description:
      "Nous recherchons un développeur Full Stack expérimenté pour rejoindre notre équipe produit. Stack : React, Node.js, PostgreSQL. Minimum 3 ans d'expérience.",
    postedAt: "2026-04-20",
    postedBy: "Kouadio Yao Marc — Promotion 1998",
  },
  {
    id: 2,
    title: "Responsable Administratif et Financier",
    company: "Groupe SIFCA",
    location: "Abidjan, Côte d'Ivoire",
    type: "cdi",
    sector: "Finance",
    description:
      "Poste de RAF pour superviser la comptabilité, le contrôle de gestion et la trésorerie. Profil BAC+5 en finance/comptabilité avec 5 ans d'expérience minimum.",
    postedAt: "2026-04-18",
    postedBy: "Traoré Aminata — Promotion 2005",
  },
  {
    id: 3,
    title: "Stage — Assistant Marketing Digital",
    company: "Orange CI",
    location: "Abidjan, Côte d'Ivoire",
    type: "stage",
    sector: "Marketing",
    description:
      "Stage de 6 mois au sein de l'équipe marketing digital. Gestion des réseaux sociaux, création de contenu et analyse de performance. Étudiant en marketing/communication.",
    postedAt: "2026-04-15",
    postedBy: "Bamba Seydou — Promotion 2010",
  },
  {
    id: 4,
    title: "Médecin Généraliste",
    company: "Clinique Sainte-Anne",
    location: "Korhogo, Côte d'Ivoire",
    type: "cdi",
    sector: "Santé",
    description:
      "Recrutement d'un médecin généraliste pour renforcer l'équipe médicale. Doctorat en médecine requis, inscription à l'Ordre des médecins obligatoire.",
    postedAt: "2026-04-12",
    postedBy: "Dr. Coulibaly Fatou — Promotion 1995",
  },
  {
    id: 5,
    title: "Consultant Juridique",
    company: "Cabinet Koné & Associés",
    location: "Abidjan, Côte d'Ivoire",
    type: "freelance",
    sector: "Droit",
    description:
      "Mission de conseil juridique en droit des affaires et droit OHADA. Profil avocat ou juriste avec 4 ans d'expérience minimum en cabinet.",
    postedAt: "2026-04-10",
    postedBy: "Me. Koné Ibrahim — Promotion 2000",
  },
  {
    id: 6,
    title: "Enseignant de Mathématiques",
    company: "Lycée HOUPHOUËT-BOIGNY de Korhogo",
    location: "Korhogo, Côte d'Ivoire",
    type: "cdd",
    sector: "Éducation",
    description:
      "Le lycée recrute un enseignant de mathématiques pour l'année scolaire 2026-2027. Licence en mathématiques minimum, expérience pédagogique souhaitée.",
    postedAt: "2026-04-08",
    postedBy: "Bureau 2ALHB",
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
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ y: 30, opacity: 0 }} animate={inView ? { y: 0, opacity: 1 } : {}} transition={{ duration: 0.4, delay }} className={className}>
      {children}
    </motion.div>
  );
}

function JobCard({ job }: { job: JobOffer }) {
  const t = typeLabels[job.type];
  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6 hover:shadow-lg hover:border-orange/20 transition-all group">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${t.color}`}>
          {t.label}
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-dark-border px-2.5 py-1 rounded-full">
          {job.sector}
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

      <p className="text-body text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">
        {job.description}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-dark-border">
        <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
          <span className="flex items-center gap-1">
            <CalendarDays size={12} />
            {formatDate(job.postedAt)}
          </span>
          <span className="flex items-center gap-1">
            <Users size={12} />
            {job.postedBy}
          </span>
        </div>
        {job.applyUrl ? (
          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-orange text-sm font-semibold hover:gap-2 transition-all"
          >
            Postuler <ExternalLink size={14} />
          </a>
        ) : (
          <Link
            href="/#contact"
            className="flex items-center gap-1.5 text-orange text-sm font-semibold hover:gap-2 transition-all"
          >
            Contacter <ExternalLink size={14} />
          </Link>
        )}
      </div>
    </div>
  );
}

export default function EmploisPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success">("idle");
  const [jobForm, setJobForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "cdi",
    sector: "",
    description: "",
    posterName: "",
    posterPromotion: "",
    posterEmail: "",
    applyUrl: "",
  });

  const handleJobChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setJobForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("loading");
    // Simulated — will connect to DRF later
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitStatus("success");
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border dark:bg-dark-card dark:text-gray-200 focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none transition-all text-sm";

  const filtered = JOB_OFFERS.filter((job) => {
    const matchSearch =
      search === "" ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.sector.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || job.type === filterType;
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

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Votre nom complet *</label>
                          <input name="posterName" required value={jobForm.posterName} onChange={handleJobChange} className={inputClass} placeholder="Ex: Kouadio Yao Marc" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Votre promotion *</label>
                          <input name="posterPromotion" required value={jobForm.posterPromotion} onChange={handleJobChange} className={inputClass} placeholder="Ex: 1998" pattern="\d{4}" title="Entrez l'année (4 chiffres)" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description du poste *</label>
                        <textarea name="description" required rows={4} value={jobForm.description} onChange={handleJobChange} className={`${inputClass} resize-none`} placeholder="Décrivez le poste, les compétences requises..." />
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
                    onClick={() => setShowForm(true)}
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
