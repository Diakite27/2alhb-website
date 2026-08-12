"use client";

import OfficialDocumentView from "@/components/OfficialDocumentView";

export default function StatutsPage() {
  return (
    <OfficialDocumentView
      documentType="statuts"
      accent="orange"
      defaultTitle="Statuts de la 2ALHB"
      defaultSubtitle="Le cadre juridique et organisationnel qui structure notre association."
      breadcrumbLabel="Statuts"
      relatedDoc={{
        href: "/association/reglement",
        title: "Règlement Intérieur",
        description: "Les règles pratiques de fonctionnement",
      }}
    />
  );
}
