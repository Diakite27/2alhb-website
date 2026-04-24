"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { FileText, Download, ChevronDown, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

interface Chapter {
  number: number;
  title: string;
  articles: number;
  content: string[];
}

const chapters: Chapter[] = [
  {
    number: 1,
    title: "Formation et objet de l'association",
    articles: 5,
    content: [
      "Article 1 : Il est créé une Association à but non lucratif dénommée « Amicale des Anciens du Lycée Houphouët-Boigny », en abrégé « 2ALHB ».",
      "Article 2 : L'Association est expressément déclarée apolitique, laïque et non confessionnelle.",
      "Article 3 : L'Association a pour objet de maintenir et renforcer les liens entre les anciens élèves.",
      "Article 4 : Le siège social est fixé à Korhogo, Côte d'Ivoire.",
      "Article 5 : La durée de l'Association est illimitée.",
    ],
  },
  {
    number: 2,
    title: "Conditions d'adhésion – Démission – Radiation",
    articles: 8,
    content: [
      "Article 6 : Peut être membre toute personne ayant été élève du Lycée Houphouët-Boigny.",
      "Article 7 : L'adhésion est soumise à l'approbation du bureau exécutif.",
      "Article 8 : Tout membre peut démissionner par lettre adressée au bureau.",
    ],
  },
  {
    number: 3,
    title: "Assemblée Générale",
    articles: 7,
    content: [
      "Article 14 : L'Assemblée Générale est l'organe suprême de l'Association.",
      "Article 15 : Elle se réunit au moins une fois par an en session ordinaire.",
    ],
  },
  {
    number: 4,
    title: "Président(e) – Bureau Exécutif",
    articles: 10,
    content: [
      "Article 21 : Le bureau exécutif est élu par l'Assemblée Générale pour un mandat de deux ans renouvelable.",
      "Article 22 : Le bureau est composé d'un(e) Président(e), d'un(e) Vice-Président(e), d'un(e) Secrétaire Général(e) et d'un(e) Trésorier(ère).",
    ],
  },
  {
    number: 5,
    title: "Organisation financière",
    articles: 5,
    content: [
      "Article 31 : Les ressources de l'Association comprennent les cotisations, les dons et subventions.",
      "Article 32 : Le Trésorier est responsable de la gestion financière.",
    ],
  },
  {
    number: 6,
    title: "Dispositions diverses",
    articles: 4,
    content: [
      "Article 36 : Les présents statuts peuvent être modifiés par l'Assemblée Générale à la majorité des deux tiers.",
      "Article 37 : La dissolution de l'Association ne peut être prononcée que par l'Assemblée Générale extraordinaire.",
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

function ChapterCard({ chapter, index }: { chapter: Chapter; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <AnimSection delay={index * 0.05}>
      <div className={`rounded-2xl overflow-hidden transition-all duration-300 ${open ? "bg-white dark:bg-dark-card shadow-md ring-1 ring-orange/20" : "bg-white dark:bg-dark-card shadow-sm hover:shadow-md"}`}>
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center gap-5 p-6 text-left"
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold transition-colors ${open ? "bg-orange text-white" : "bg-green/10 text-green dark:text-green-light"}`}>
            {chapter.number}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-green dark:text-green-light">{chapter.title}</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500">{chapter.articles} articles</p>
          </div>
          <ChevronDown
            size={18}
            className={`text-gray-400 dark:text-gray-500 shrink-0 transition-transform duration-300 ${open ? "rotate-180 text-orange" : ""}`}
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
                {chapter.content.map((article, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-1 bg-orange/30 rounded-full shrink-0 mt-1" style={{ minHeight: 20 }} />
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

export default function StatutsPage() {
  return (
    <>
      <PageHeader
        title="Statuts de la 2ALHB"
        subtitle="Le cadre juridique et organisationnel qui structure notre association."
        breadcrumbs={[
          { label: "L'Association", href: "#" },
          { label: "Statuts", href: "/association/statuts" },
        ]}
      />

      <section className="py-20 bg-gray-50 dark:bg-dark-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Meta bar */}
          <AnimSection>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-10 p-5 bg-white dark:bg-dark-card rounded-2xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="text-green dark:text-green-light" size={20} />
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p>Version 1.0 — Mars 2025</p>
                  <p>{chapters.reduce((acc, c) => acc + c.articles, 0)} articles en {chapters.length} chapitres</p>
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
              <div className="absolute top-0 left-0 w-1.5 h-full bg-green rounded-l-2xl" />
              <h3 className="font-bold text-green dark:text-green-light text-lg mb-3">Préambule</h3>
              <p className="text-body text-gray-600 dark:text-gray-400 leading-relaxed">
                Il est créé, par le présent acte, une Association à but non lucratif
                dénommée « Amicale des Anciens du Lycée Houphouët-Boigny », en abrégé
                « 2ALHB » conformément à l&apos;ordonnance n°2024-368 relative à
                l&apos;organisation de la société civile. L&apos;Association est expressément
                déclarée apolitique, laïque et non confessionnelle. Elle ne se place
                sous la tutelle d&apos;aucun parti politique ni d&apos;aucune organisation
                religieuse.
              </p>
            </div>
          </AnimSection>

          {/* Chapters */}
          <div className="space-y-3 mb-10">
            {chapters.map((chapter, i) => (
              <ChapterCard key={chapter.number} chapter={chapter} index={i} />
            ))}
          </div>

          {/* Note */}
          <AnimSection>
            <div className="bg-orange/5 dark:bg-orange/10 border border-orange/15 rounded-2xl p-6 mb-12">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-orange">Note :</span>{" "}
                Ceci est un extrait des statuts. Pour la version complète et officielle,
                téléchargez le document PDF ci-dessus.
              </p>
            </div>
          </AnimSection>

          {/* Related doc */}
          <AnimSection>
            <h3 className="font-bold text-green dark:text-green-light mb-4">Document associé</h3>
            <Link
              href="/association/reglement"
              className="flex items-center justify-between p-5 bg-white dark:bg-dark-card rounded-2xl shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange/10 rounded-lg flex items-center justify-center">
                  <FileText className="text-orange" size={20} />
                </div>
                <div>
                  <span className="font-semibold text-green dark:text-green-light group-hover:text-orange transition-colors">
                    Règlement Intérieur
                  </span>
                  <p className="text-sm text-gray-400 dark:text-gray-500">Les règles pratiques de fonctionnement</p>
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
