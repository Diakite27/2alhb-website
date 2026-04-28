"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { UserPlus, ArrowRight, Users, Shield, Briefcase } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { api, AssociationInfo } from "@/lib/api";
import { useApiData } from "@/lib/hooks";
import { formatPrice } from "@/lib/constants";

const FALLBACK_INFO: AssociationInfo = {
  name: "2ALHB",
  full_name: "Amicale des Anciens du Lycée HOUPHOUËT-BOIGNY de Korhogo",
  slogan: "Connecter les anciens, inspirer les générations futures",
  email: "contact@2alhb.ci",
  phone: "+225 07 00 00 00 00",
  address: "Lycée HOUPHOUËT-BOIGNY de Korhogo\nCôte d'Ivoire",
  facebook_url: "https://facebook.com/2alhb",
  linkedin_url: "https://linkedin.com/company/2alhb",
  adhesion_fee: 5000,
  monthly_fee: 5000,
  annual_fee: 60000,
};

const highlights = [
  { icon: Users, text: "Rejoignez 500+ anciens élèves" },
  { icon: Briefcase, text: "Accédez aux offres d'emploi exclusives" },
  { icon: Shield, text: "Bénéficiez du mentorat des aînés" },
];

export default function RegisterForm() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { data: info } = useApiData(() => api.getInfo(), FALLBACK_INFO);

  return (
    <section id="register" className="py-14 lg:py-24 bg-gradient-to-br from-green-dark via-green to-green-light relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-64 sm:w-96 h-64 sm:h-96 bg-orange/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — text */}
          <motion.div
            ref={ref}
            initial={{ y: 30, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Image
              src="/logo.png"
              alt="2ALHB"
              width={70}
              height={70}
              className="rounded-full border-2 border-white/20 mb-6"
            />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Rejoindre la 2ALHB
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-lg">
              Inscrivez-vous et connectez-vous au réseau des anciens du HOUPHOUËT-BOIGNY de Korhogo. Membre simple ou adhérent, trouvez la formule
              qui vous convient.
            </p>

            <ul className="space-y-4 mb-10">
              {highlights.map((h) => (
                <li key={h.text} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <h.icon className="text-orange" size={20} />
                  </div>
                  <span className="text-white/80 text-sm">{h.text}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/association/adhesion"
              className="inline-flex items-center gap-2 bg-orange text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-dark transition-all hover:scale-105 shadow-lg"
            >
              <UserPlus size={20} />
              Demander mon adhésion
              <ArrowRight size={18} />
            </Link>
          </motion.div>

          {/* Right — pricing cards */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Membre Simple */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-bold text-lg">Membre Simple</h3>
                <span className="text-orange font-bold text-xl">{formatPrice(info.adhesion_fee)} FCFA</span>
              </div>
              <p className="text-white/50 text-sm mb-4">Paiement unique — Droit d&apos;adhésion</p>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-orange rounded-full" />
                  Accès au réseau et à l&apos;annuaire
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-orange rounded-full" />
                  Invitations aux événements
                </li>
              </ul>
            </div>

            {/* Membre Adhérent */}
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-orange/30 relative">
              <span className="absolute -top-3 right-4 bg-orange text-white text-xs font-bold px-3 py-1 rounded-full">
                Recommandé
              </span>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-bold text-lg">Membre Adhérent</h3>
                <div className="text-right">
                  <span className="text-orange font-bold text-xl">{formatPrice(info.adhesion_fee)} FCFA</span>
                  <span className="text-white/40 text-xs block">+ cotisation</span>
                </div>
              </div>
              <p className="text-white/50 text-sm mb-4">
                {formatPrice(info.monthly_fee)} FCFA/mois ou {formatPrice(info.annual_fee)} FCFA/an
              </p>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-orange rounded-full" />
                  Tous les avantages du membre simple
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-orange rounded-full" />
                  Droit de vote en Assemblée Générale
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-orange rounded-full" />
                  Programmes de mentorat et d&apos;insertion
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-orange rounded-full" />
                  Accès prioritaire aux offres d&apos;emploi
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
