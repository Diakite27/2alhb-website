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
    title: "Dispositions constitutives et générales",
    articles: 5,
    content: [
      "Article 1 : Il est créé une Association à but non lucratif dénommée « Amicale des Anciens du Lycée Houphouët-Boigny », en abrégé « 2ALHB » conformément à l'ordonnance n°2024-368.",
      "Article 2 : Le siège social de l'Association est établi à Korhogo, dans la Région du Poro, en Côte d'Ivoire.",
      "Article 3 : L'Association est instituée afin de maintenir les liens fraternels, promouvoir l'excellence, soutenir le lycée, créer un réseau professionnel et favoriser l'insertion des jeunes diplômés.",
      "Article 4 : L'association est explicitement constituée comme une Association sans but lucratif. Aucune distribution de bénéfices n'est autorisée.",
      "Article 5 : L'Association se finance par les droits d'adhésion (5 000 FCFA), les cotisations mensuelles (5 000 FCFA) ou annuelles (60 000 FCFA), les dons, subventions et produits d'événements.",
    ],
  },
  {
    number: 2,
    title: "Adhésion et catégories de membres",
    articles: 7,
    content: [
      "Article 6 : L'Association comprend quatre catégories de membres : Membres Adhérents, Membres Simples, Membres d'Honneur et Membres Collectifs.",
      "Article 7 : Les Membres Adhérents sont les anciens élèves ayant versé le droit d'adhésion et cotisant régulièrement. Ils disposent du droit de vote.",
      "Article 8 : Les Membres Simples participent sans droit de vote. Adhésion validée par formulaire et paiement de 5 000 FCFA.",
      "Article 9 : Les Membres d'Honneur sont des personnalités distinguées désignées par le Bureau. Ils ne versent aucune cotisation.",
      "Article 10 : Les Membres Collectifs sont des entreprises ou organisations partenaires. Cotisation négociée au cas par cas.",
      "Article 11 : Un Membre Simple peut devenir Adhérent à tout moment en versant sa cotisation. Délai d'un an avant changement de statut.",
      "Article 12 : Perte de qualité après 3 mois d'impayé (mensuel) ou au 1er février (annuel). Exclusion possible pour manquement grave.",
    ],
  },
  {
    number: 3,
    title: "Assemblée Générale",
    articles: 7,
    content: [
      "Article 13 : L'Assemblée Générale est l'organe suprême et souverain. Composée des Membres Adhérents (votants), Simples, d'Honneur, Collectifs et du Conseil des Sages.",
      "Article 14 : L'AG ordinaire se réunit obligatoirement en juin. Rapport moral, audit, comptes, budget et élections.",
      "Article 15 : AG extraordinaire convocable par le Président ou sur demande de 35% des Membres Adhérents.",
      "Article 16 : Convocation 15 jours minimum avant la date. Toute AG sans convocation régulière est nulle.",
      "Article 17 : Quorum de 51% des Adhérents. Majorité simple pour décisions courantes, 2/3 pour modifications statutaires.",
      "Article 18 : Procuration écrite autorisée. Maximum une procuration par membre.",
      "Article 19 : Procès-verbal obligatoire, conservé 20 ans minimum.",
    ],
  },
  {
    number: 4,
    title: "Bureau Exécutif",
    articles: 12,
    content: [
      "Article 20 : Le Bureau est composé de 5 membres élus : Président, Vice-Président, Secrétaire Général, Trésorier, Commissaire Aux Comptes. Mandat de 3 ans renouvelable une fois.",
      "Article 21 : Le Président représente l'association, préside les réunions et convoque les AG.",
      "Article 22 : Le Vice-Président remplace le Président et coordonne les Commissions Thématiques.",
      "Article 23 : Le Secrétaire Général gère l'administration, les PV, la correspondance et l'annuaire.",
      "Article 24 : Le Trésorier gère les finances avec double signature obligatoire (Président + Trésorier).",
      "Article 25 : Le Commissaire Aux Comptes audite les comptes trimestriellement et certifie les comptes annuels.",
      "Article 26 : Éligibilité : 2 ans d'adhésion minimum, cotisations à jour, parrainage de 2 membres.",
      "Article 27 : Élection par Comité Électoral de 7 membres. Candidatures 30 jours avant, campagne de 15 jours.",
      "Article 28 : Réunions mensuelles obligatoires. Quorum de 3 membres.",
      "Article 29 : Dépenses courantes jusqu'à 500 000 FCFA sans AG. Au-delà, AG extraordinaire requise.",
      "Article 30 : Le Bureau ne peut pas modifier les statuts, dissoudre l'association ni distribuer des bénéfices.",
      "Article 31 : Révocation par AG extraordinaire à majorité des 2/3 uniquement.",
    ],
  },
  {
    number: 5,
    title: "Conseil des Sages",
    articles: 10,
    content: [
      "Article 32 : Organe consultatif et de médiation composé de 3 à 9 personnalités.",
      "Article 33 : Membres fondateurs (permanent), anciens du Bureau, anciens proviseurs et professeurs distingués.",
      "Article 34 : Désignation sur proposition du Bureau ou de 50 Adhérents. Ratification par l'AG.",
      "Article 35 : Mandat sans limitation de durée. Membres fondateurs irrévocables.",
      "Article 36 : Droits de consultation, de regard sur les finances, de médiation, de parole et d'initiative.",
      "Article 37 : Obligations de confidentialité, de participation et d'impartialité.",
      "Article 38 : Réunions minimum 2 fois par an.",
      "Article 39 : Incompatibilité avec le Bureau Exécutif. Engagement bénévole.",
      "Article 40 : Révocation par AG extraordinaire à majorité simple.",
      "Article 41 : Le Conseil éclaire les travaux de l'AG et du Bureau sans empiéter sur leur autorité.",
    ],
  },
  {
    number: 6,
    title: "Commissions Thématiques",
    articles: 3,
    content: [
      "Article 42 : Six commissions obligatoires sous l'autorité du Bureau. Présidents nommés parmi les Adhérents.",
      "Article 43 : Soutien Scolaire & Bourses, Événements & Réseautage, Infrastructure & Équipements, Insertion Professionnelle, Communication & Média, Mémoire & Archives.",
      "Article 44 : Réunions trimestrielles minimum. Coordination inter-commissions par le Secrétaire Général.",
    ],
  },
  {
    number: 7,
    title: "Gestion financière et dispositions finales",
    articles: 14,
    content: [
      "Article 45 : Exercice financier du 1er janvier au 31 décembre.",
      "Article 46 : Comptes bancaires avec double signature. Paiements par virement ou mobile money uniquement, jamais en espèces.",
      "Article 47 : Rapports financiers trimestriels. Audit annuel par le Commissaire Aux Comptes.",
      "Article 48 : Budget prévisionnel voté en AG. Respect strict des priorités budgétaires.",
      "Article 49 : Excédents réinvestis dans les missions statutaires. Distribution interdite.",
      "Article 50 : Transparence financière. Documents consultables par tout Adhérent sous 15 jours.",
      "Article 51 : Le Règlement Intérieur ne peut contredire les statuts.",
      "Article 52 : Modification des statuts uniquement par AG extraordinaire à majorité des 2/3.",
      "Article 53 : Dissolution par AG extraordinaire à 2/3. Biens remis à une structure publique.",
      "Article 54 : Interdictions absolues : distribution de bénéfices, dépenses >500k sans AG, modification des statuts par le Bureau.",
      "Article 55 : Partenariats autorisés avec organisations similaires.",
      "Article 56 : Statuts en vigueur dès approbation par l'AG Constitutive.",
      "Article 57 : L'AG extraordinaire tranche les litiges d'interprétation.",
      "Article 58 : Premier mandat de 2 ou 3 ans selon décision de l'AG Constitutive.",
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
                  <p>Version 1.0 — Adopté le 20 avril 2026</p>
                  <p>{chapters.reduce((acc, c) => acc + c.articles, 0)} articles en {chapters.length} chapitres</p>
                </div>
              </div>
              <a
                href="/statuts-2alhb.pdf"
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
                Les présents statuts constituent l&apos;acte fondateur et le cadre de
                gouvernance de l&apos;association dénommée Amicale des Anciens du Lycée
                Houphouët-Boigny, en abrégé 2ALHB. Ils sont établis pour une durée
                indéterminée. L&apos;Association est expressément déclarée apolitique,
                laïque et non confessionnelle.
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
