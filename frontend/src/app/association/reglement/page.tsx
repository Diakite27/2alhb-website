"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { FileText, Download, ChevronDown, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

interface Title {
  number: number;
  title: string;
  articles: number;
  content: string[];
}

const titles: Title[] = [
  {
    number: 1,
    title: "Modalités d'adhésion – Maintien – Démission",
    articles: 3,
    content: [
      "Article 1 : L'adhésion à la 2ALHB est ouverte à tout ancien élève du Lycée Houphouët-Boigny, sur présentation d'une demande écrite ou numérique.",
      "Article 2 : Le maintien de la qualité de membre est conditionné au respect des statuts et du présent règlement.",
      "Article 3 : Tout membre souhaitant démissionner adresse une lettre au bureau exécutif.",
    ],
  },
  {
    number: 2,
    title: "Administration de l'amicale",
    articles: 6,
    content: [
      "Article 4 : L'amicale est administrée par un bureau exécutif élu en Assemblée Générale.",
      "Article 5 : Le bureau se réunit au moins une fois par trimestre.",
      "Article 6 : Les décisions sont prises à la majorité simple des membres présents.",
    ],
  },
  {
    number: 3,
    title: "Contrôle et transparence",
    articles: 3,
    content: [
      "Article 10 : Un commissaire aux comptes est désigné par l'Assemblée Générale.",
      "Article 11 : Il vérifie les comptes et présente un rapport annuel.",
      "Article 12 : Tout membre peut demander communication des comptes.",
    ],
  },
  {
    number: 4,
    title: "Frais de déplacement et communication",
    articles: 2,
    content: [
      "Article 13 : Les frais de déplacement engagés dans le cadre des missions de l'amicale peuvent être remboursés sur justificatifs.",
      "Article 14 : Les frais de communication sont pris en charge par le budget de fonctionnement.",
    ],
  },
];

function AnimSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ y: 30, opacity: 0 }} animate={inView ? { y: 0, opacity: 1 } : {}} transition={{ duration: 0.6, delay }} className={className}>
      {children}
    </motion.div>
  );
}

function TitleCard({ title, index }: { title: Title; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <AnimSection delay={index * 0.05}>
      <div className={`rounded-2xl overflow-hidden transition-all duration-300 ${open ? "bg-white dark:bg-dark-card shadow-md ring-1 ring-green/20" : "bg-white dark:bg-dark-card shadow-sm hover:shadow-md"}`}>
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center gap-5 p-6 text-left"
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold transition-colors ${open ? "bg-green text-white" : "bg-orange/10 text-orange"}`}>
            {title.number}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-green dark:text-green-light">Titre {title.number} : {title.title}</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500">{title.articles} articles</p>
          </div>
          <ChevronDown
            size={18}
            className={`text-gray-400 dark:text-gray-500 shrink-0 transition-transform duration-300 ${open ? "rotate-180 text-green" : ""}`}
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 space-y-3">
                <div className="h-px bg-gray-100 dark:bg-dark-border mb-4" />
                {title.content.map((article, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-1 bg-green/30 rounded-full shrink-0 mt-1" style={{ minHeight: 20 }} />
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{article}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimSection>
  );
}

export default function ReglementPage() {
  return (
    <>
      <PageHeader
        title="Règlement Intérieur"
        subtitle="Les modalités pratiques qui encadrent la vie quotidienne de l'amicale."
        breadcrumbs={[
          { label: "L'Association", href: "#" },
          { label: "Règlement", href: "/association/reglement" },
        ]}
      />

      <section className="py-20 bg-gray-50 dark:bg-dark-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Meta bar */}
          <AnimSection>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-10 p-5 bg-white dark:bg-dark-card rounded-2xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="text-orange" size={20} />
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p>Version 1.0 — Mars 2025</p>
                  <p>{titles.reduce((acc, t) => acc + t.articles, 0)} articles en {titles.length} titres</p>
                </div>
              </div>
              <a
                href="#"
                className="flex items-center gap-2 bg-orange text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-orange-dark transition-colors"
              >
                <Download size={16} />
                Télécharger le PDF
              </a>
            </div>
          </AnimSection>

          {/* Preamble */}
          <AnimSection>
            <div className="relative bg-white dark:bg-dark-card rounded-2xl p-8 shadow-sm mb-8 overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-orange rounded-l-2xl" />
              <h3 className="font-bold text-green dark:text-green-light text-lg mb-3">Préambule</h3>
              <p className="text-body text-gray-600 dark:text-gray-400 leading-relaxed">
                Le présent règlement intérieur complète et précise les statuts de la
                2ALHB. Il s&apos;applique à tous les membres de l&apos;association et
                détermine les conditions d&apos;application des statuts adoptés par
                l&apos;Assemblée Générale.
              </p>
            </div>
          </AnimSection>

          {/* Titles */}
          <div className="space-y-3 mb-10">
            {titles.map((title, i) => (
              <TitleCard key={title.number} title={title} index={i} />
            ))}
          </div>

          {/* Note */}
          <AnimSection>
            <div className="bg-green/5 dark:bg-green/10 border border-green/15 rounded-2xl p-6 mb-12">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-green dark:text-green-light">Note :</span>{" "}
                Ceci est un extrait du règlement intérieur. Pour la version complète,
                téléchargez le document PDF ci-dessus.
              </p>
            </div>
          </AnimSection>

          {/* Related doc */}
          <AnimSection>
            <h3 className="font-bold text-green dark:text-green-light mb-4">Document associé</h3>
            <Link
              href="/association/statuts"
              className="flex items-center justify-between p-5 bg-white dark:bg-dark-card rounded-2xl shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green/10 rounded-lg flex items-center justify-center">
                  <FileText className="text-green dark:text-green-light" size={20} />
                </div>
                <div>
                  <span className="font-semibold text-green dark:text-green-light group-hover:text-orange transition-colors">
                    Statuts de la 2ALHB
                  </span>
                  <p className="text-sm text-gray-400 dark:text-gray-500">Les règles fondamentales de l&apos;association</p>
                </div>
              </div>
              <ArrowRight className="text-orange" size={18} />
            </Link>
          </AnimSection>
        </div>
      </section>
    </>
  );
}
