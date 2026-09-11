"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, Quote } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import AnimSection from "@/components/AnimSection";
import { api, BureauMember } from "@/lib/api";
import { useApiList } from "@/lib/hooks";

const FALLBACK_BUREAU: BureauMember[] = [
  { id: 1, display_name: "SORHO Fougnigué Mohamed", role: "Président", initials: "SM", category: "direction", photo_url: null, message: "", bio: "", order: 1 },
  { id: 2, display_name: "COULIBALY Tchanga Guy Roland Kévin", role: "Vice-Président", initials: "CK", category: "direction", photo_url: null, message: "", bio: "", order: 2 },
  { id: 3, display_name: "OUATTARA Kahafoa Désiré", role: "Secrétaire Général", initials: "OD", category: "direction", photo_url: null, message: "", bio: "", order: 3 },
  { id: 4, display_name: "DIARRASSOUBA Dognimin Drissa", role: "Trésorier", initials: "DD", category: "direction", photo_url: null, message: "", bio: "", order: 4 },
  { id: 5, display_name: "TUO Nawa Moise", role: "Commissaire Aux Comptes", initials: "TM", category: "direction", photo_url: null, message: "", bio: "", order: 5 },
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

function MemberCard({ member, onClick }: { member: BureauMember; onClick: () => void }) {
  const hasDetails = member.message || member.bio;
  
  return (
    <div
      onClick={hasDetails ? onClick : undefined}
      className={`group bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all ${hasDetails ? "cursor-pointer" : "cursor-default"}`}
    >
      {/* Photo portrait 3:4 */}
      <div className="aspect-[3/4] relative overflow-hidden bg-gray-100 dark:bg-gray-800">
        {member.photo_url ? (
          <img
            src={member.photo_url}
            alt={member.display_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green to-green-light group-hover:from-orange group-hover:to-orange-dark transition-all flex items-center justify-center">
            <span className="text-white font-bold text-4xl">{member.initials}</span>
          </div>
        )}
        {hasDetails && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-medium bg-orange px-4 py-2 rounded-full">
              Voir le profil
            </span>
          </div>
        )}
      </div>
      
      {/* Info */}
      <div className="p-5 text-center">
        <h3 className="font-bold text-green dark:text-green-light group-hover:text-orange transition-colors text-lg">
          {member.display_name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{member.role}</p>
      </div>
    </div>
  );
}

function MemberModal({ member, onClose }: { member: BureauMember; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-dark-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header avec photo */}
        <div className="relative">
          <div className="aspect-[16/9] overflow-hidden rounded-t-3xl bg-gray-100 dark:bg-gray-800">
            {member.photo_url ? (
              <img
                src={member.photo_url}
                alt={member.display_name}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-green to-green-light flex items-center justify-center">
                <span className="text-white font-bold text-6xl">{member.initials}</span>
              </div>
            )}
          </div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 dark:bg-dark-bg/90 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-dark-bg transition-colors shadow-lg"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-green dark:text-green-light">
              {member.display_name}
            </h2>
            <p className="text-orange font-medium mt-1">{member.role}</p>
          </div>
          
          {/* Mot du membre */}
          {member.message && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Quote size={20} className="text-orange" />
                <h3 className="font-bold text-green dark:text-green-light">Mot du {member.role}</h3>
              </div>
              <div className="bg-gray-50 dark:bg-dark-bg rounded-2xl p-6 border-l-4 border-orange">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                  {member.message}
                </p>
              </div>
            </div>
          )}
          
          {/* Biographie */}
          {member.bio && (
            <div>
              <h3 className="font-bold text-green dark:text-green-light mb-4">Biographie</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                {member.bio}
              </p>
            </div>
          )}
          
          {/* Si pas de message ni bio */}
          {!member.message && !member.bio && (
            <p className="text-center text-gray-400 dark:text-gray-500 italic">
              Aucune information complémentaire disponible pour le moment.
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function BureauPage() {
  const { data: bureauMembers } = useApiList(() => api.getBureau(), FALLBACK_BUREAU);
  const [selectedMember, setSelectedMember] = useState<BureauMember | null>(null);

  const direction = bureauMembers.filter((m) => m.category === "direction");
  const president = direction.find((m) => m.role.toLowerCase().includes("président") && !m.role.toLowerCase().includes("vice"));

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
          {/* Mot du Président */}
          {president?.message && (
            <AnimSection className="mb-20">
              <div className="bg-gradient-to-br from-green-dark to-green rounded-3xl p-8 md:p-12 text-white">
                <div className="flex flex-col lg:flex-row gap-8 items-center">
                  {/* Photo du président */}
                  <div className="w-48 h-64 shrink-0 rounded-2xl overflow-hidden shadow-2xl">
                    {president.photo_url ? (
                      <img
                        src={president.photo_url}
                        alt={president.display_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange to-orange-dark flex items-center justify-center">
                        <span className="text-white font-bold text-3xl">{president.initials}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Mot */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <Quote size={32} className="text-orange" />
                      <h2 className="text-2xl font-bold">Mot du Président</h2>
                    </div>
                    <p className="text-white/90 leading-relaxed text-lg whitespace-pre-line mb-6">
                      {president.message}
                    </p>
                    <div className="border-t border-white/20 pt-4">
                      <p className="font-bold text-orange">{president.display_name}</p>
                      <p className="text-white/60 text-sm">{president.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimSection>
          )}

          <AnimSection className="max-w-3xl mb-16">
            <p className="text-body text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              Élu par l&apos;Assemblée Générale, le Bureau Exécutif est composé
              de {direction.length}{" "}membres élus pour un mandat de 3 ans renouvelable une fois. Il
              assure la gestion de l&apos;amicale et coordonne l&apos;ensemble des
              activités.
            </p>
          </AnimSection>

          {/* Direction */}
          <AnimSection className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-8 bg-orange rounded-full" />
              <h2 className="text-2xl font-bold text-green dark:text-green-light">La Direction</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {direction.map((member, i) => (
                <MemberCard
                  key={member.id ?? i}
                  member={member}
                  onClick={() => setSelectedMember(member)}
                />
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

      {/* Modal */}
      <AnimatePresence>
        {selectedMember && (
          <MemberModal
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
