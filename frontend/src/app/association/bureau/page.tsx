"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

interface BureauMember {
  name: string;
  role: string;
  initials: string;
  category: "direction" | "commission";
}

const bureauMembers: BureauMember[] = [
  { name: "À définir", role: "Président(e)", initials: "PR", category: "direction" },
  { name: "À définir", role: "Vice-Président(e)", initials: "VP", category: "direction" },
  { name: "À définir", role: "Secrétaire Général(e)", initials: "SG", category: "direction" },
  { name: "À définir", role: "Secrétaire Général(e) Adjoint(e)", initials: "SA", category: "direction" },
  { name: "À définir", role: "Trésorier(ère)", initials: "TR", category: "direction" },
  { name: "À définir", role: "Trésorier(ère) Adjoint(e)", initials: "TA", category: "direction" },
  { name: "À définir", role: "Responsable Organisation", initials: "RO", category: "commission" },
  { name: "À définir", role: "Responsable Communication", initials: "RC", category: "commission" },
  { name: "À définir", role: "Commission Insertion Professionnelle", initials: "CI", category: "commission" },
  { name: "À définir", role: "Commission Solidarité & Entraide", initials: "CS", category: "commission" },
  { name: "À définir", role: "Responsable Diaspora", initials: "RD", category: "commission" },
  { name: "À définir", role: "Commission Consultative", initials: "CC", category: "commission" },
];

function AnimSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ y: 40, opacity: 0 }} animate={inView ? { y: 0, opacity: 1 } : {}} transition={{ duration: 0.4, delay }} className={className}>
      {children}
    </motion.div>
  );
}

const direction = bureauMembers.filter((m) => m.category === "direction");
const commissions = bureauMembers.filter((m) => m.category === "commission");

export default function BureauPage() {
  return (
    <>
      <PageHeader
        title="Le Bureau Exécutif"
        subtitle="Les femmes et les hommes qui portent la vision de la 2ALHB au quotidien."
        breadcrumbs={[
          { label: "L'Association", href: "#" },
          { label: "Le Bureau", href: "/association/bureau" },
        ]}
      />

      <section className="py-20 bg-white dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimSection className="max-w-3xl mb-16">
            <p className="text-body text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              Élu par l&apos;Assemblée Générale, le bureau exécutif assure la
              gestion de l&apos;amicale et coordonne l&apos;ensemble des activités.
              Chaque membre apporte son expertise et son énergie au service du
              collectif.
            </p>
          </AnimSection>

          {/* Direction */}
          <AnimSection className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-8 bg-orange rounded-full" />
              <h2 className="text-2xl font-bold text-green dark:text-green-light">La Direction</h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {direction.map((member, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-gray-50 dark:bg-dark-card hover:bg-orange/5 dark:hover:bg-orange/10 transition-all group cursor-default"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-green to-green-light rounded-xl flex items-center justify-center shrink-0 group-hover:from-orange group-hover:to-orange-dark transition-all">
                    <span className="text-white font-bold text-sm">{member.initials}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-green dark:text-green-light group-hover:text-orange transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimSection>

          {/* Commissions */}
          <AnimSection>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-8 bg-green rounded-full" />
              <h2 className="text-2xl font-bold text-green dark:text-green-light">Les Commissions</h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {commissions.map((member, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-gray-50 dark:bg-dark-card hover:bg-green/5 dark:hover:bg-green/10 transition-all group cursor-default"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-orange/80 to-orange rounded-xl flex items-center justify-center shrink-0 group-hover:from-green group-hover:to-green-light transition-all">
                    <span className="text-white font-bold text-sm">{member.initials}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-green dark:text-green-light group-hover:text-orange transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimSection>
        </div>
      </section>

      {/* CTA — different style */}
      <section className="py-16 bg-gray-50 dark:bg-dark-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimSection>
            <div className="bg-gradient-to-r from-green-dark to-green rounded-3xl p-10 sm:p-14 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-white">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                  Envie de vous impliquer ?
                </h2>
                <p className="text-white/60">
                  Rejoignez une commission ou proposez vos idées pour faire vivre l&apos;amicale.
                </p>
              </div>
              <Link
                href="/association/adhesion"
                className="bg-orange text-white px-8 py-4 rounded-full font-semibold hover:bg-orange-dark transition-all hover:scale-105 shadow-lg flex items-center gap-2 shrink-0"
              >
                Rejoindre la 2ALHB <ArrowRight size={18} />
              </Link>
            </div>
          </AnimSection>
        </div>
      </section>
    </>
  );
}
