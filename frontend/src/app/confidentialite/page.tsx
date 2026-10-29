"use client";

import {
  ShieldCheck, Database, Target, Lock, Share2, UserCheck, Cookie, Clock, Mail,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import PageHeader from "@/components/PageHeader";
import LegalSection, { LegalList } from "@/components/LegalSection";
import { api, AssociationInfo } from "@/lib/api";
import { useApiData } from "@/lib/hooks";

const FALLBACK_INFO: AssociationInfo = {
  name: "2ALHB",
  full_name: "Amicale des Anciens du Lycée HOUPHOUËT-BOIGNY de Korhogo",
  slogan: "",
  email: "contact@2alhb.com",
  phone: "+225 07 18 45 57 47",
  address: "Lycée HOUPHOUËT-BOIGNY de Korhogo, Côte d'Ivoire",
  facebook_url: "",
  linkedin_url: "",
  whatsapp: "",
  adhesion_fee: 5000,
  monthly_fee: 5000,
  annual_fee: 60000,
  orange_money_enabled: true,
  orange_money_number: "",
  wave_enabled: true,
  wave_number: "",
};

export default function ConfidentialitePage() {
  const { data: info } = useApiData(() => api.getInfo(), FALLBACK_INFO);

  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          title="Politique de confidentialité"
          subtitle="Comment la 2ALHB collecte, utilise et protège vos données personnelles."
          breadcrumbs={[{ label: "Confidentialité", href: "/confidentialite" }]}
        />

        <section className="py-16 bg-gray-50 dark:bg-dark-bg">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <LegalSection icon={<ShieldCheck size={20} />} title="Notre engagement" index={0}>
              <p>
                La 2ALHB s&apos;engage à protéger la vie privée des utilisateurs de son site
                internet. Cette politique explique comment nous collectons, utilisons et
                protégeons vos informations personnelles, conformément à la loi
                n°2013-450 du 19 juin 2013 relative à la protection des données à caractère
                personnel en Côte d&apos;Ivoire.
              </p>
              <p>
                L&apos;autorité de contrôle compétente est l&apos;Autorité de Régulation des
                Télécommunications de Côte d&apos;Ivoire (ARTCI).
              </p>
            </LegalSection>

            <LegalSection icon={<Database size={20} />} title="Données collectées" index={1}>
              <p>Nous pouvons collecter les informations suivantes :</p>
              <LegalList
                items={[
                  <><strong>Informations de contact</strong> : nom, prénom, email, téléphone (via le formulaire de contact).</>,
                  <><strong>Informations d&apos;adhésion</strong> : données du formulaire d&apos;adhésion (promotion, profession, ville, etc.).</>,
                  <><strong>Informations de don</strong> : nom, email, téléphone et montant. Le paiement est effectué via Mobile Money (Orange Money / Wave) ; aucune donnée bancaire n&apos;est stockée sur nos serveurs.</>,
                  <><strong>Données de navigation</strong> : adresse IP, type de navigateur, pages visitées, durée de visite.</>,
                ]}
              />
              <p>
                Ces données sont collectées uniquement lorsque vous les fournissez
                volontairement ou lors de votre navigation sur notre site.
              </p>
            </LegalSection>

            <LegalSection icon={<Target size={20} />} title="Utilisation des données" index={2}>
              <p>Vos données personnelles sont utilisées pour :</p>
              <LegalList
                items={[
                  "Répondre à vos demandes de contact ou d'information",
                  "Traiter vos adhésions et gérer votre espace membre",
                  "Traiter vos dons et vous adresser un reçu",
                  "Vous informer sur nos activités et événements (avec votre consentement)",
                  "Améliorer notre site et nos services",
                  "Respecter nos obligations légales et réglementaires",
                ]}
              />
              <p>
                Conformément à la loi n°2013-450, le traitement de vos données repose sur les
                principes de légitimité, de finalité déterminée, de proportionnalité, de
                transparence ainsi que de sécurité et de confidentialité.
              </p>
            </LegalSection>

            <LegalSection icon={<Lock size={20} />} title="Sécurité des données" index={3}>
              <p>Nous mettons en œuvre des mesures appropriées pour protéger vos données :</p>
              <LegalList
                items={[
                  "Connexion sécurisée (HTTPS) sur l'ensemble du site",
                  "Accès restreint aux données personnelles",
                  "Stockage sécurisé des informations",
                  "Sensibilisation des membres du bureau à la protection des données",
                ]}
              />
            </LegalSection>

            <LegalSection icon={<Share2 size={20} />} title="Partage des données" index={4}>
              <p>
                La 2ALHB ne vend, ne loue et ne partage pas vos données personnelles avec des
                tiers à des fins commerciales. Vos données peuvent être partagées uniquement :
              </p>
              <LegalList
                items={[
                  "Avec nos prestataires (hébergement, email) dans le cadre strict de leurs missions",
                  "En cas d'obligation légale ou de demande des autorités compétentes",
                  "Avec votre consentement explicite",
                ]}
              />
            </LegalSection>

            <LegalSection icon={<UserCheck size={20} />} title="Vos droits" index={5}>
              <p>
                Conformément à la loi n°2013-450, vous disposez des droits suivants sur vos
                données personnelles :
              </p>
              <LegalList
                items={[
                  <><strong>Droit à l&apos;information</strong> : être informé de la collecte et de l&apos;usage de vos données</>,
                  <><strong>Droit d&apos;accès</strong> : obtenir une copie de vos données</>,
                  <><strong>Droit de rectification</strong> : corriger vos données inexactes</>,
                  <><strong>Droit de suppression</strong> : demander l&apos;effacement de vos données</>,
                  <><strong>Droit d&apos;opposition</strong> : vous opposer, pour motifs légitimes, au traitement</>,
                ]}
              />
              <p>
                Pour exercer ces droits, contactez-nous à{" "}
                <a href={`mailto:${info.email}`}>{info.email}</a>. Vous pouvez aussi vous
                désabonner de nos communications à tout moment via la page{" "}
                <a href="/desabonnement">désabonnement</a>.
              </p>
              <p>
                Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir
                l&apos;ARTCI, autorité de protection des données à caractère personnel.
              </p>
            </LegalSection>

            <LegalSection icon={<Cookie size={20} />} title="Cookies" index={6}>
              <p>
                Notre site peut utiliser des cookies pour améliorer votre expérience de
                navigation. Les cookies sont de petits fichiers texte stockés sur votre
                appareil.
              </p>
              <LegalList
                items={[
                  <><strong>Cookies essentiels</strong> : nécessaires au fonctionnement du site</>,
                  <><strong>Cookies analytiques</strong> : pour comprendre comment les visiteurs utilisent le site</>,
                ]}
              />
              <p>
                Vous pouvez configurer votre navigateur pour refuser les cookies, mais
                certaines fonctionnalités pourraient ne plus fonctionner correctement.
              </p>
            </LegalSection>

            <LegalSection icon={<Clock size={20} />} title="Conservation des données" index={7}>
              <p>
                Vos données sont conservées pour une durée n&apos;excédant pas celle
                nécessaire aux finalités pour lesquelles elles sont collectées :
              </p>
              <LegalList
                items={[
                  "Données de contact : 3 ans après le dernier contact",
                  "Données de don : 10 ans (obligations comptables)",
                  "Données d'adhésion : tant que l'adhésion est active",
                  "Données de navigation : 13 mois maximum",
                ]}
              />
            </LegalSection>

            <LegalSection icon={<Mail size={20} />} title="Contact" index={8}>
              <p>
                Pour toute question relative à cette politique ou pour exercer vos droits :
              </p>
              <p>
                <strong>Email :</strong> <a href={`mailto:${info.email}`}>{info.email}</a>
                <br />
                <strong>Téléphone :</strong> {info.phone}
                <br />
                <strong>Adresse :</strong> {info.address}
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm pt-2">
                Dernière mise à jour : octobre 2026
              </p>
            </LegalSection>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
