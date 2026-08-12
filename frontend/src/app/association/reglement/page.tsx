"use client";

import OfficialDocumentView from "@/components/OfficialDocumentView";

export default function ReglementPage() {
  return (
    <OfficialDocumentView
      documentType="reglement"
      accent="green"
      defaultTitle="Règlement Intérieur"
      defaultSubtitle="Les modalités pratiques qui encadrent la vie quotidienne de l'amicale."
      breadcrumbLabel="Règlement"
      relatedDoc={{
        href: "/association/statuts",
        title: "Statuts de la 2ALHB",
        description: "Les règles fondamentales de l'association",
      }}
    />
  );
}
