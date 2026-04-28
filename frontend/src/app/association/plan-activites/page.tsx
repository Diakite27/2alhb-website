"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Calendar,
  Users,
  GraduationCap,
  Heart,
  Trophy,
  Globe,
  ChevronDown,
  CheckCircle2,
  Clock,
  Target,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";

type Quarter = "Q1" | "Q2" | "Q3" | "Q4";

interface Activity {
  title: string;
  description: string;
  date: string;
  status: "done" | "in-progress" | "upcoming";
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

interface QuarterData {
  label: string;
  period: string;
  activities: Activity[];
}

const plan: Record<Quarter, QuarterData> = {
  Q1: {
    label: "1er Trimestre",
    period: "Janvier — Mars 2026",
    activities: [
      {
        title: "Assemblée Générale Ordinaire",
        description: "Bilan de l'année écoulée, adoption du budget prévisionnel et renouvellement partiel du bureau.",
        date: "Janvier 2026",
        status: "done",
        icon: Users,
      },
      {
        title: "Campagne d'adhésion",
        description: "Lancement de la campagne annuelle de recrutement de nouveaux membres. Objectif : 100 nouveaux adhérents.",
        date: "Février 2026",
        status: "done",
        icon: Target,
      },
      {
        title: "Journée portes ouvertes au lycée",
        description: "Visite du Lycée HOUPHOUËT-BOIGNY de Korhogo avec les anciens. Échanges avec les élèves actuels et le corps enseignant.",
        date: "Mars 2026",
        status: "done",
        icon: GraduationCap,
      },
    ],
  },
  Q2: {
    label: "2e Trimestre",
    period: "Avril — Juin 2026",
    activities: [
      {
        title: "Programme de mentorat — Cohorte 2",
        description: "Lancement de la deuxième cohorte de mentorat. Jumelage de 30 jeunes diplômés avec des aînés expérimentés.",
        date: "Avril 2026",
        status: "in-progress",
        icon: Users,
      },
      {
        title: "Forum Emploi & Insertion",
        description: "Salon professionnel réservé aux membres. Stands d'entreprises partenaires, ateliers CV et simulations d'entretien.",
        date: "Mai 2026",
        status: "upcoming",
        icon: Trophy,
      },
      {
        title: "Dîner Gala Annuel",
        description: "Soirée de gala réunissant toutes les générations. Remise de prix d'excellence et levée de fonds pour le lycée.",
        date: "Juin 2026",
        status: "upcoming",
        icon: Heart,
      },
    ],
  },
  Q3: {
    label: "3e Trimestre",
    period: "Juillet — Septembre 2026",
    activities: [
      {
        title: "Tournoi sportif inter-promotions",
        description: "Compétitions de football, basketball et athlétisme entre promotions. Moment de convivialité et de retrouvailles.",
        date: "Juillet 2026",
        status: "upcoming",
        icon: Trophy,
      },
      {
        title: "Action solidaire — Rentrée scolaire",
        description: "Distribution de kits scolaires, bourses d'études et rénovation d'une salle de classe du lycée.",
        date: "Septembre 2026",
        status: "upcoming",
        icon: Heart,
      },
      {
        title: "Retrouvailles promotions 2000-2010",
        description: "Week-end dédié aux promotions 2000 à 2010. Visite du lycée, déjeuner et soirée de retrouvailles.",
        date: "Septembre 2026",
        status: "upcoming",
        icon: Users,
      },
    ],
  },
  Q4: {
    label: "4e Trimestre",
    period: "Octobre — Décembre 2026",
    activities: [
      {
        title: "Conférence annuelle",
        description: "Conférence thématique ouverte au public. Intervenants : anciens élèves devenus leaders dans leurs domaines.",
        date: "Octobre 2026",
        status: "upcoming",
        icon: GraduationCap,
      },
      {
        title: "Expansion diaspora",
        description: "Création des antennes 2ALHB à Paris, Dakar et Casablanca. Nomination des responsables diaspora.",
        date: "Novembre 2026",
        status: "upcoming",
        icon: Globe,
      },
      {
        title: "Bilan annuel & Fête de fin d'année",
        description: "Présentation du bilan des activités, célébration des réussites de l'année et lancement du plan 2027.",
        date: "Décembre 2026",
        status: "upcoming",
        icon: Calendar,
      },
    ],
  },
};

const quarters: Quarter[] = ["Q1", "Q2", "Q3", "Q4"];

const statusConfig = {
  done: { label: "Réalisé", color: "bg-green text-white", icon: CheckCircle2 },
  "in-progress": { label: "En cours", color: "bg-orange text-white", icon: Clock },
  upcoming: { label: "À venir", color: "bg-gray-200 dark:bg-dark-border text-gray-600 dark:text-gray-400", icon: Calendar },
};

function AnimSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ y: 30, opacity: 0 }} animate={inView ? { y: 0, opacity: 1 } : {}} transition={{ duration: 0.4, delay }} className={className}>
      {children}
    </motion.div>
  );
}

function QuarterSection({ quarter, data }: { quarter: Quarter; data: QuarterData }) {
  const [open, setOpen] = useState(quarter === "Q2"); // Current quarter open by default

  return (
    <AnimSection>
      <div className={`rounded-2xl overflow-hidden transition-all duration-300 ${open ? "bg-white dark:bg-dark-card shadow-lg ring-1 ring-orange/20" : "bg-white dark:bg-dark-card shadow-sm hover:shadow-md"}`}>
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between p-6 text-left"
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm transition-colors ${open ? "bg-orange text-white" : "bg-green/10 text-green dark:text-green-light"}`}>
              {quarter}
            </div>
            <div>
              <h3 className="font-bold text-green dark:text-green-light text-lg">{data.label}</h3>
              <p className="text-sm text-gray-400 dark:text-gray-500">{data.period}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-gray-400">
              {data.activities.length} activités
            </span>
            <ChevronDown
              size={18}
              className={`text-gray-400 transition-transform duration-300 ${open ? "rotate-180 text-orange" : ""}`}
            />
          </div>
        </button>

        {open && (
          <div className="px-6 pb-6">
            <div className="h-px bg-gray-100 dark:bg-dark-border mb-5" />
            <div className="space-y-4">
              {data.activities.map((activity, i) => {
                const st = statusConfig[activity.status];
                return (
                  <div
                    key={i}
                    className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-dark-bg hover:bg-gray-100 dark:hover:bg-dark-border/50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-orange/10 rounded-lg flex items-center justify-center shrink-0">
                      <activity.icon className="text-orange" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-semibold text-green dark:text-green-light text-sm">
                          {activity.title}
                        </h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.color}`}>
                          {st.label}
                        </span>
                      </div>
                      <p className="text-body text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-1">
                        {activity.description}
                      </p>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{activity.date}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AnimSection>
  );
}

export default function PlanActivitesPage() {
  const done = Object.values(plan).flatMap((q) => q.activities).filter((a) => a.status === "done").length;
  const inProgress = Object.values(plan).flatMap((q) => q.activities).filter((a) => a.status === "in-progress").length;
  const upcoming = Object.values(plan).flatMap((q) => q.activities).filter((a) => a.status === "upcoming").length;
  const total = done + inProgress + upcoming;

  return (
    <>
      <PageHeader
        title="Plan d'activités 2026"
        subtitle="Les projets, événements et actions prévus tout au long de l'année pour faire vivre la 2ALHB."
        breadcrumbs={[
          { label: "L'Association", href: "#" },
          { label: "Plan d'activités", href: "/association/plan-activites" },
        ]}
      />

      {/* Progress overview */}
      <section className="py-10 bg-white dark:bg-dark-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimSection>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-green/5 dark:bg-green/10">
                <span className="text-2xl font-bold text-green dark:text-green-light">{done}</span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Réalisées</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-orange/5 dark:bg-orange/10">
                <span className="text-2xl font-bold text-orange">{inProgress}</span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">En cours</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-gray-50 dark:bg-dark-card">
                <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">{upcoming}</span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">À venir</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span>Progression annuelle</span>
                <span>{Math.round((done / total) * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-dark-border rounded-full overflow-hidden">
                <div className="h-full flex">
                  <div
                    className="bg-green rounded-l-full"
                    style={{ width: `${(done / total) * 100}%` }}
                  />
                  <div
                    className="bg-orange"
                    style={{ width: `${(inProgress / total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </AnimSection>
        </div>
      </section>

      {/* Quarters */}
      <section className="py-10 pb-20 bg-gray-50 dark:bg-dark-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {quarters.map((q) => (
            <QuarterSection key={q} quarter={q} data={plan[q]} />
          ))}
        </div>
      </section>
    </>
  );
}
