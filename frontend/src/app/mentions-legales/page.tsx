"use client";

import { Building2, FileText, Server, Copyright, Scale } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import PageHeader from "@/components/PageHeader";
import LegalSection from "@/components/LegalSection";
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

export default function MentionsLegalesPage() {
  const { data: info } = useApiData(() => api.getInfo(), FALLBACK_INFO);

  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          title="Mentions légales"
          subtitle="Informations légales relatives au site de la 2ALHB."
          breadcrumbs={[{ label: "Mentions légales", href: "/mentions-legales" }]}
        />

        <section className="py-16 bg-gray-50 dark:bg-dark-bg">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <LegalSection icon={<Building2 size={20} />} title="Éditeur du site" index={0}>
              <p>
                Le présent site est édité par la <strong>{info.full_name}</strong> (2ALHB),
                association à but non lucratif, apolitique, laïque et non confessionnelle,
                régie par la loi ivoirienne sur les associations.
              </p>
              <p>
                <strong>Email :</strong> {info.email}
                <br />
                <strong>Téléphone :</strong> {info.phone}
                <br />
                <strong>Adresse :</strong> {info.address}
              </p>
            </LegalSection>

            <LegalSection icon={<FileText size={20} />} title="Directeur de la publication" index={1}>
              <p>
                La publication du site est assurée par le Bureau exécutif de la 2ALHB,
                représenté par son Président en exercice.
              </p>
            </LegalSection>

            <LegalSection icon={<Server size={20} />} title="Hébergement" index={2}>
              <p>
                Le site est hébergé par un prestataire d&apos;hébergement professionnel.
                Les coordonnées complètes de l&apos;hébergeur peuvent être obtenues sur
                demande à l&apos;adresse {info.email}.
              </p>
            </LegalSection>

            <LegalSection icon={<Copyright size={20} />} title="Propriété intellectuelle" index={3}>
              <p>
                L&apos;ensemble du contenu de ce site (textes, images, graphismes, logo,
                icônes, etc.) est la propriété exclusive de la 2ALHB ou de ses partenaires,
                sauf mention contraire.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication ou adaptation
                de tout ou partie des éléments du site, quel que soit le moyen ou le procédé
                utilisé, est interdite sans autorisation écrite préalable de la 2ALHB.
              </p>
              <p>
                Toute exploitation non autorisée du site ou de l&apos;un des éléments qu&apos;il
                contient sera considérée comme constitutive d&apos;une contrefaçon et
                poursuivie conformément aux dispositions des lois en vigueur.
              </p>
            </LegalSection>

            <LegalSection icon={<Scale size={20} />} title="Droit applicable" index={4}>
              <p>
                Les présentes mentions légales sont régies par le droit ivoirien. En cas de
                litige, et à défaut de résolution amiable, les tribunaux de Côte d&apos;Ivoire
                seront seuls compétents.
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
