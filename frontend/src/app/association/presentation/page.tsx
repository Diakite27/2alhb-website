"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Heart,
  GraduationCap,
  Briefcase,
  Users,
  HandHeart,
  Globe,
  Shield,
  Trophy,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

const timeline = [
  {
    year: "2024",
    title: "Naissance de la 2ALHB",
    description:
      "Fondation officielle conformément à l'ordonnance n°2024-368. Un groupe d'anciens élèves passionnés décide de structurer les liens qui les unissent.",
    color: "bg-orange",
  },
  {
    year: "2024",
    title: "Assemblée constitutive",
    description:
      "Adoption des statuts, du règlement intérieur et élection du premier bureau exécutif. La 2ALHB prend forme.",
    color: "bg-green",
  },
  {
    year: "2025",
    title: "Premiers pas concrets",
    description:
      "Lancement des programmes de mentorat, premières retrouvailles inter-promotions et mise en place des commissions.",
    color: "bg-orange",
  },
  {
    year: "2025",
    title: "Le réseau grandit",
    description:
      "Développement des antennes à l'international, partenariats stratégiques et premières actions de solidarité envers le lycée.",
    color: "bg-green",
  },
];

const objectives = [
  {
    icon: Heart,
    title: "Tisser des liens durables",
    description:
      "Créer un espace où chaque ancien élève retrouve la chaleur de ses années au lycée, quelle que soit sa promotion.",
  },
  {
    icon: GraduationCap,
    title: "Cultiver l'excellence",
    description:
      "Offrir des formations, séminaires et échanges pour que chaque membre continue de grandir professionnellement.",
  },
  {
    icon: HandHeart,
    title: "Redonner au lycée",
    description:
      "Bourses d'études, fournitures, infrastructures — investir dans l'avenir des élèves actuels du LHB.",
  },
  {
    icon: Briefcase,
    title: "Connecter les talents",
    description:
      "Un réseau professionnel vivant où opportunités, partenariats et conseils circulent librement.",
  },
  {
    icon: Users,
    title: "Accompagner la relève",
    description:
      "Mentorat, coaching carrière et mise en relation pour faciliter l'insertion des jeunes diplômés.",
  },
  {
    icon: Globe,
    title: "Rayonner au-delà",
    description:
      "Porter les valeurs du LHB dans l'engagement citoyen, le développement communautaire et l'action sociale.",
  },
];

const values = [
  {
    icon: Heart,
    title: "Fraternité",
    description: "Un lien indéfectible qui transcende les générations et les frontières.",
    gradient: "from-orange/20 to-orange/5",
  },
  {
    icon: Trophy,
    title: "Excellence",
    description: "L'ambition permanente de se dépasser et d'inspirer par l'exemple.",
    gradient: "from-green/20 to-green/5",
  },
  {
    icon: Shield,
    title: "Solidarité",
    description: "La force du collectif au service de chaque membre, dans les succès comme les épreuves.",
    gradient: "from-orange/20 to-orange/5",
  },
];

function AnimSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ y: 40, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.7, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function PresentationPage() {
  return (
    <>
      <PageHeader
        title="Qui sommes-nous ?"
        subtitle="L'histoire d'une amicale bâtie sur la fraternité, l'excellence et la solidarité entre anciens du Lycée Houphouët-Boigny."
        breadcrumbs={[
          { label: "L'Association", href: "#" },
          { label: "Présentation", href: "/association/presentation" },
        ]}
      />

      {/* Intro — asymmetric layout */}
      <section className="py-20 bg-white dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            <AnimSection className="lg:col-span-3">
              <span className="inline-flex items-center gap-2 text-orange font-semibold text-sm mb-4 bg-orange/10 dark:bg-orange/10 px-4 py-1.5 rounded-full">
                <Sparkles size={14} />
                Notre identité
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-green dark:text-green-light mb-6 leading-tight">
                Plus qu&apos;une association,<br />
                <span className="text-orange">une famille.</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg mb-4">
                La 2ALHB rassemble les anciens élèves du Lycée Houphouët-Boigny
                autour d&apos;une vision commune : perpétuer les valeurs qui ont forgé
                des générations de leaders ivoiriens.
              </p>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                Apolitique, laïque et indépendante, notre amicale est un espace
                de retrouvailles, d&apos;entraide et d&apos;ambition partagée. Que vous
                soyez de la promotion 1980 ou 2024, vous êtes chez vous.
              </p>
            </AnimSection>

            <AnimSection className="lg:col-span-2" delay={0.2}>
              <div className="relative">
                <div className="bg-gradient-to-br from-green to-green-dark rounded-3xl p-8 text-white">
                  <h3 className="text-5xl font-bold mb-2">40+</h3>
                  <p className="text-white/70 mb-6">promotions représentées</p>
                  <div className="h-px bg-white/20 mb-6" />
                  <h3 className="text-5xl font-bold mb-2">500+</h3>
                  <p className="text-white/70 mb-6">membres à travers le monde</p>
                  <div className="h-px bg-white/20 mb-6" />
                  <h3 className="text-5xl font-bold text-orange mb-2">85%</h3>
                  <p className="text-white/70">taux d&apos;insertion professionnelle</p>
                </div>
                <div className="absolute -bottom-4 -right-4 w-full h-full bg-orange/10 rounded-3xl -z-10" />
              </div>
            </AnimSection>
          </div>
        </div>
      </section>

      {/* Timeline — horizontal on desktop */}
      <section className="py-20 bg-gray-50 dark:bg-dark-card overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-green dark:text-green-light mb-4">
              Notre parcours
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
              Les étapes clés qui ont construit la 2ALHB
            </p>
          </AnimSection>

          <div className="relative">
            {/* Horizontal line — desktop */}
            <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-green/15 dark:bg-green/25" />

            <div className="grid lg:grid-cols-4 gap-8">
              {timeline.map((item, i) => (
                <AnimSection key={i} delay={i * 0.15}>
                  <div className="relative text-center lg:text-left">
                    {/* Dot */}
                    <div className="hidden lg:flex absolute top-14 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full ring-4 ring-white dark:ring-dark-card items-center justify-center z-10">
                      <div className={`w-5 h-5 rounded-full ${item.color}`} />
                    </div>

                    <span className={`inline-block text-sm font-bold text-white px-3 py-1 rounded-full mb-4 ${item.color}`}>
                      {item.year}
                    </span>
                    <div className="lg:mt-12 bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="font-bold text-green dark:text-green-light text-lg mb-2">{item.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </AnimSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Objectives — staggered cards */}
      <section className="py-20 bg-white dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimSection className="mb-16">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-green dark:text-green-light mb-3">
                  Ce qui nous anime
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-lg">
                  Six engagements concrets qui guident chacune de nos actions
                </p>
              </div>
              <Link
                href="/association/adhesion"
                className="flex items-center gap-2 text-orange font-semibold hover:gap-3 transition-all"
              >
                Nous rejoindre <ArrowRight size={18} />
              </Link>
            </div>
          </AnimSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectives.map((obj, i) => (
              <AnimSection key={obj.title} delay={i * 0.08}>
                <div className="relative p-8 rounded-2xl border border-gray-100 dark:border-dark-border hover:border-orange/30 transition-all duration-300 group hover:shadow-lg h-full dark:bg-dark-card">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-orange group-hover:text-white transition-all">
                      <obj.icon className="text-orange group-hover:text-white transition-colors" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-green dark:text-green-light text-lg mb-2 group-hover:text-orange transition-colors">
                        {obj.title}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{obj.description}</p>
                    </div>
                  </div>
                  {/* Subtle number */}
                  <span className="absolute top-4 right-4 text-6xl font-bold text-gray-100 dark:text-dark-border group-hover:text-orange/10 transition-colors select-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* Values — full-width cards */}
      <section className="py-20 bg-gray-50 dark:bg-dark-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-green dark:text-green-light mb-4">
              Nos valeurs fondatrices
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
              Trois piliers sur lesquels repose tout ce que nous construisons
            </p>
          </AnimSection>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((val, i) => (
              <AnimSection key={val.title} delay={i * 0.15}>
                <div className={`relative rounded-3xl p-10 bg-gradient-to-b ${val.gradient} h-full text-center overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 dark:bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-white dark:bg-dark-bg rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <val.icon className="text-orange" size={36} />
                    </div>
                    <h3 className="text-2xl font-bold text-green dark:text-green-light mb-4">{val.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{val.description}</p>
                  </div>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-green-dark relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-green-light/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <AnimSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Prêt à rejoindre l&apos;aventure ?
            </h2>
            <p className="text-white/60 text-lg mb-10">
              Que vous soyez à Abidjan, Paris, Dakar ou ailleurs — votre place
              est parmi nous.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/association/adhesion"
                className="bg-orange text-white px-8 py-4 rounded-full font-semibold hover:bg-orange-dark transition-all hover:scale-105 shadow-lg"
              >
                Devenir membre
              </Link>
              <Link
                href="/association/bureau"
                className="border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all"
              >
                Découvrir le bureau
              </Link>
            </div>
          </AnimSection>
        </div>
      </section>
    </>
  );
}
