"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Users } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { api, BureauMember } from "@/lib/api";
import { useApiList } from "@/lib/hooks";

const FALLBACK_BUREAU: BureauMember[] = [
  { id: 1, display_name: "SORHO Fougnigué Mohamed", role: "Président", initials: "SM", category: "direction", photo_url: null, order: 1 },
  { id: 2, display_name: "COULIBALY Tchanga Guy Roland Kévin", role: "Vice-Président", initials: "CK", category: "direction", photo_url: null, order: 2 },
  { id: 3, display_name: "OUATTARA Kahafoa Désiré", role: "Secrétaire Général", initials: "OD", category: "direction", photo_url: null, order: 3 },
  { id: 4, display_name: "DIARRASSOUBA Dognimin Drissa", role: "Trésorier", initials: "DD", category: "direction", photo_url: null, order: 4 },
  { id: 5, display_name: "TUO Nawa Moise", role: "Commissaire Aux Comptes", initials: "TM", category: "direction", photo_url: null, order: 5 },
];

interface Commission {
  name: string;
  initials: string;
}

const commissions: Commission[] = [
  { name: "Commission Soutien Scolaire & Bourses d'Études", initials: "SB" },
  { name: "Commission Événements & Réseautage", initials: "ER" },
  { name: "Commission Infrastructure & Équipements", initials: "IE" },
  { name: "Commission Insertion Professionnelle & Carrière", initials: "IP" },
  { name: "Commission Communication & Média", initials: "CM" },
  { name: "Commission Mémoire & Archives", initials: "MA" },
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

export default function BureauPage() {
  const { data: bureauMembers } = useApiList(() => api.getBureau(), FALLBACK_BUREAU);

  const direction = bureauMembers.filter((m) => m.category === "direction");

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
              Élu par l&apos;Assemblée Générale, le Bureau Exécutif est composé de
              5 membres élus pour un mandat de 3 ans renouvelable une fois. Il
              assure la gestion de l&apos;amicale et coordonne l&apos;ensemble des
              activités.
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
                  key={member.id ?? i}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-gray-50 dark:bg-dark-card hover:bg-orange/5 dark:hover:bg-orange/10 transition-all group cursor-default"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-green to-green-light rounded-xl flex items-center justify-center shrink-0 group-hover:from-orange group-hover:to-orange-dark transition-all">
                    <span className="text-white font-bold text-sm">{member.initials}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-green dark:text-green-light group-hover:text-orange transition-colors">
                      {member.display_name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimSection>

          {/* Commissions Thématiques */}
          <AnimSection>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-8 bg-green rounded-full" />
              <h2 className="text-2xl font-bold text-green dark:text-green-light">Les Commissions Thématiques</h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {commissions.map((commission, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-gray-50 dark:bg-dark-card hover:bg-green/5 dark:hover:bg-green/10 transition-all group cursor-default"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-orange/80 to-orange rounded-xl flex items-center justify-center shrink-0 group-hover:from-green group-hover:to-green-light transition-all">
                    <Users className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-green dark:text-green-light group-hover:text-orange transition-colors text-sm">
                      {commission.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Président à nommer</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimSection>
        </div>
      </section>

      {/* CTA */}
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
