"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
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
  description: string;
  color: string;
}

const commissions: Commission[] = [
  { name: "Soutien scolaire & bourses", initials: "SB", description: "Bourses d'études, mentorat académique, parrainage et soutien scolaire.", color: "from-green to-green-light" },
  { name: "Événements & réseautage", initials: "ER", description: "Gala, retrouvailles, cérémonies, tournois et activités de cohésion.", color: "from-orange to-orange-dark" },
  { name: "Infrastructure & équipements", initials: "IE", description: "Mobilisation de ressources pour les besoins, travaux et équipements du lycée.", color: "from-green to-green-light" },
  { name: "Insertion pro & carrière", initials: "IP", description: "Job board, forum carrière, mentorat et diffusion d'opportunités d'emploi.", color: "from-orange to-orange-dark" },
  { name: "Communication & média", initials: "CM", description: "Site web, réseaux sociaux, newsletter, presse et documents officiels.", color: "from-green to-green-light" },
  { name: "Mémoire & archives", initials: "MA", description: "Collecte, conservation, annuaire, revue annuelle et mémoire du lycée.", color: "from-orange to-orange-dark" },
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
              Élu par l&apos;Assemblée Générale, le Bureau Exécutif est composé
              de {direction.length}{" "}membres élus pour un mandat de 3 ans renouvelable une fois. Il
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
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                    {member.photo_url ? (
                      <img src={member.photo_url} alt={member.display_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green to-green-light flex items-center justify-center group-hover:from-orange group-hover:to-orange-dark transition-all">
                        <span className="text-white font-bold text-sm">{member.initials}</span>
                      </div>
                    )}
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
          <AnimSection className="mb-16" delay={0.1}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-8 bg-orange rounded-full" />
              <h2 className="text-2xl font-bold text-green dark:text-green-light">Les Commissions Thématiques</h2>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
              6 commissions obligatoires (Article 43). D&apos;autres commissions peuvent être créées au besoin par le Bureau Exécutif.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {commissions.map((commission, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-gray-50 dark:bg-dark-card hover:bg-orange/5 dark:hover:bg-orange/10 transition-all group cursor-default border border-gray-100 dark:border-gray-800"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${commission.color} flex items-center justify-center shrink-0`}>
                      <span className="text-white font-bold text-xs">{commission.initials}</span>
                    </div>
                    <h3 className="font-bold text-green dark:text-green-light group-hover:text-orange transition-colors text-sm">
                      {commission.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {commission.description}
                  </p>
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
