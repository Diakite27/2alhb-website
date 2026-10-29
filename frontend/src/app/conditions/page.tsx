"use client";

import {
  Target, CheckCircle2, XCircle, HeartHandshake, Copyright, ShieldAlert, Scale, Mail,
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

export default function ConditionsPage() {
  const { data: info } = useApiData(() => api.getInfo(), FALLBACK_INFO);

  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          title="Conditions d'utilisation"
          subtitle="Les règles qui encadrent l'accès et l'utilisation du site de la 2ALHB."
          breadcrumbs={[{ label: "Conditions d'utilisation", href: "/conditions" }]}
        />

        <section className="py-16 bg-gray-50 dark:bg-dark-bg">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="bg-green/5 dark:bg-green/10 border border-green/15 rounded-2xl p-6 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Les présentes conditions générales d&apos;utilisation (CGU) régissent
              l&apos;accès et l&apos;utilisation du site internet de la 2ALHB. En accédant à
              ce site, vous acceptez sans réserve les présentes conditions. Si vous ne les
              acceptez pas, veuillez ne pas utiliser ce site.
            </div>

            <LegalSection icon={<Target size={20} />} title="Article 1 — Objet du site" index={0}>
              <p>Le site de la 2ALHB a pour objectif de :</p>
              <LegalList
                items={[
                  "Présenter l'amicale, sa mission et ses valeurs",
                  "Informer sur les événements, actualités et activités",
                  "Permettre l'adhésion et la gestion de l'espace membre",
                  "Permettre de soutenir les actions de l'amicale par des dons",
                  "Faciliter la mise en relation et le partage d'offres d'emploi entre membres",
                ]}
              />
              <p>
                L&apos;accès au site est gratuit. L&apos;utilisateur est responsable de son
                équipement informatique et de sa connexion internet.
              </p>
            </LegalSection>

            <LegalSection icon={<CheckCircle2 size={20} />} title="Article 2 — Utilisations autorisées" index={1}>
              <p>L&apos;utilisateur est notamment autorisé à :</p>
              <LegalList
                items={[
                  "Consulter les informations publiées sur le site",
                  "Utiliser le formulaire de contact pour nous joindre",
                  "Adhérer à l'amicale et accéder à son espace membre",
                  "Effectuer des dons via Mobile Money de manière sécurisée",
                  "Partager les contenus du site sur les réseaux sociaux",
                  "Télécharger les documents mis à disposition",
                ]}
              />
            </LegalSection>

            <LegalSection icon={<XCircle size={20} />} title="Article 3 — Utilisations interdites" index={2}>
              <p>Il est strictement interdit de :</p>
              <LegalList
                items={[
                  "Utiliser le site à des fins illégales ou non autorisées",
                  "Tenter d'accéder de manière non autorisée aux systèmes informatiques",
                  "Transmettre des virus ou tout code de nature destructrice",
                  "Collecter les informations personnelles d'autres utilisateurs",
                  "Publier du contenu diffamatoire, injurieux ou contraire à l'ordre public",
                  "Reproduire ou utiliser les contenus du site sans autorisation",
                  "Usurper l'identité de la 2ALHB ou de ses membres",
                ]}
              />
              <p>
                Ces comportements sont notamment susceptibles de constituer des infractions
                au sens de la loi n°2013-451 du 19 juin 2013 relative à la lutte contre la
                cybercriminalité en Côte d&apos;Ivoire.
              </p>
            </LegalSection>

            <LegalSection icon={<HeartHandshake size={20} />} title="Article 4 — Dons en ligne" index={3}>
              <p>Les dons effectués via le site sont :</p>
              <LegalList
                items={[
                  "Volontaires et définitifs (non remboursables sauf erreur technique)",
                  "Effectués via Mobile Money (Orange Money / Wave)",
                  "Utilisés conformément aux missions de la 2ALHB",
                ]}
              />
              <p>
                Un reçu peut être délivré sur demande. En cas de problème lors d&apos;un don,
                contactez-nous à <a href={`mailto:${info.email}`}>{info.email}</a>.
              </p>
            </LegalSection>

            <LegalSection icon={<Copyright size={20} />} title="Article 5 — Propriété intellectuelle" index={4}>
              <p>
                L&apos;ensemble du contenu du site (textes, images, logos, vidéos, etc.) est
                protégé par le droit de la propriété intellectuelle.
              </p>
              <p>
                Toute reproduction, représentation ou diffusion, totale ou partielle, du
                contenu de ce site, sur quelque support ou par tout procédé que ce soit, est
                interdite sans l&apos;autorisation préalable et écrite de la 2ALHB. Le
                non-respect de cette interdiction constitue une contrefaçon.
              </p>
            </LegalSection>

            <LegalSection icon={<ShieldAlert size={20} />} title="Article 6 — Limitation de responsabilité" index={5}>
              <p>
                La 2ALHB s&apos;efforce d&apos;assurer l&apos;exactitude des informations
                diffusées mais ne peut garantir leur exhaustivité ou leur mise à jour
                permanente. La 2ALHB ne saurait être tenue responsable :
              </p>
              <LegalList
                items={[
                  "Des dommages résultant de l'utilisation du site",
                  "De l'interruption temporaire ou définitive du site",
                  "Du contenu des sites externes vers lesquels des liens pointent",
                  "Des virus ou autres éléments nuisibles",
                ]}
              />
            </LegalSection>

            <LegalSection icon={<Scale size={20} />} title="Article 7 — Droit applicable et litiges" index={6}>
              <p>
                Les présentes CGU sont régies par le droit ivoirien, notamment la loi
                n°2013-450 du 19 juin 2013 relative à la protection des données à caractère
                personnel et la loi n°2013-451 du 19 juin 2013 relative à la lutte contre la
                cybercriminalité.
              </p>
              <p>
                En cas de litige, une solution amiable sera recherchée avant toute action
                judiciaire. À défaut, les tribunaux de Côte d&apos;Ivoire seront seuls
                compétents. La 2ALHB se réserve le droit de modifier les présentes CGU à tout
                moment ; les modifications prennent effet dès leur publication.
              </p>
            </LegalSection>

            <LegalSection icon={<Mail size={20} />} title="Contact" index={7}>
              <p>Pour toute question concernant ces conditions d&apos;utilisation :</p>
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
