"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, ChevronDown, BookOpen, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import AnimSection from "@/components/AnimSection";
import { api, OfficialDocumentData, OfficialDocumentSection } from "@/lib/api";
import { useApiData } from "@/lib/hooks";

type AccentColor = "orange" | "green";

interface SectionCardProps {
  section: OfficialDocumentSection;
  index: number;
  accent: AccentColor;
}

const accentStyles: Record<AccentColor, { badge: string; badgeOpen: string; ring: string; bar: string; chevron: string }> = {
  orange: {
    badge: "bg-green/10 text-green dark:text-green-light",
    badgeOpen: "bg-orange text-white",
    ring: "ring-1 ring-orange/20",
    bar: "bg-orange/30",
    chevron: "text-orange",
  },
  green: {
    badge: "bg-orange/10 text-orange",
    badgeOpen: "bg-green text-white",
    ring: "ring-1 ring-green/20",
    bar: "bg-green/30",
    chevron: "text-green",
  },
};

function SectionCard({ section, index, accent }: SectionCardProps) {
  const [open, setOpen] = useState(false);
  const styles = accentStyles[accent];

  return (
    <AnimSection delay={index * 0.05}>
      <div className={`rounded-2xl overflow-hidden transition-all duration-300 ${open ? `bg-white dark:bg-dark-card shadow-md ${styles.ring}` : "bg-white dark:bg-dark-card shadow-sm hover:shadow-md"}`}>
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center gap-5 p-6 text-left"
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold transition-colors ${open ? styles.badgeOpen : styles.badge}`}>
            {section.number}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-green dark:text-green-light">{section.title}</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500">{section.articles_count} articles</p>
          </div>
          <ChevronDown
            size={18}
            className={`text-gray-400 dark:text-gray-500 shrink-0 transition-transform duration-300 ${open ? `rotate-180 ${styles.chevron}` : ""}`}
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 space-y-3">
                <div className="h-px bg-gray-100 dark:bg-dark-border mb-4" />
                {section.articles.map((article) => (
                  <div key={article.id} className="flex gap-3">
                    <div className={`w-1 ${styles.bar} rounded-full shrink-0 mt-1`} style={{ minHeight: 20 }} />
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{article.content}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimSection>
  );
}

interface OfficialDocumentViewProps {
  documentType: "statuts" | "reglement";
  accent: AccentColor;
  relatedDoc: {
    href: string;
    title: string;
    description: string;
  };
  breadcrumbLabel: string;
  defaultTitle: string;
  defaultSubtitle: string;
}

export default function OfficialDocumentView({
  documentType,
  accent,
  relatedDoc,
  breadcrumbLabel,
  defaultTitle,
  defaultSubtitle,
}: OfficialDocumentViewProps) {
  const { data: doc, loading } = useApiData(
    () => api.getOfficialDocument(documentType),
    null as OfficialDocumentData | null
  );

  const preambleBar = accent === "orange" ? "bg-green" : "bg-orange";
  const noteClasses = accent === "orange"
    ? "bg-orange/5 dark:bg-orange/10 border-orange/15"
    : "bg-green/5 dark:bg-green/10 border-green/15";
  const noteLabel = accent === "orange"
    ? "font-semibold text-orange"
    : "font-semibold text-green dark:text-green-light";

  return (
    <>
      <PageHeader
        title={doc?.title || defaultTitle}
        subtitle={doc?.subtitle || defaultSubtitle}
        breadcrumbs={[
          { label: "L'Association", href: "#" },
          { label: breadcrumbLabel, href: `/association/${documentType === "statuts" ? "statuts" : "reglement"}` },
        ]}
      />

      <section className="py-20 bg-gray-50 dark:bg-dark-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <Loader2 className="text-orange mx-auto animate-spin" size={32} />
            </div>
          ) : doc ? (
            <>
              {/* Meta bar */}
              <AnimSection>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-10 p-5 bg-white dark:bg-dark-card rounded-2xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="text-green dark:text-green-light" size={20} />
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <p>Version {doc.version} — {doc.adopted_date}</p>
                      <p>{doc.total_articles} articles en {doc.sections.length} {doc.section_label.toLowerCase()}s</p>
                    </div>
                  </div>
                  {doc.pdf_url && (
                    <a
                      href={doc.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-orange text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-orange-dark transition-colors"
                    >
                      <Download size={16} />
                      Télécharger le PDF
                    </a>
                  )}
                </div>
              </AnimSection>

              {/* Preamble */}
              {doc.preamble && (
                <AnimSection>
                  <div className="relative bg-white dark:bg-dark-card rounded-2xl p-8 shadow-sm mb-8 overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1.5 h-full ${preambleBar} rounded-l-2xl`} />
                    <h3 className="font-bold text-green dark:text-green-light text-lg mb-3">Préambule</h3>
                    <p className="text-body text-gray-600 dark:text-gray-400 leading-relaxed">
                      {doc.preamble}
                    </p>
                  </div>
                </AnimSection>
              )}

              {/* Sections */}
              <div className="space-y-3 mb-10">
                {doc.sections.map((section, i) => (
                  <SectionCard key={section.id} section={section} index={i} accent={accent} />
                ))}
              </div>

              {/* Note */}
              {doc.note && (
                <AnimSection>
                  <div className={`${noteClasses} border rounded-2xl p-6 mb-12`}>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className={noteLabel}>Note :</span>{" "}
                      {doc.note}
                    </p>
                  </div>
                </AnimSection>
              )}

              {/* Related doc */}
              <AnimSection>
                <h3 className="font-bold text-green dark:text-green-light mb-4">Document associé</h3>
                <Link
                  href={relatedDoc.href}
                  className="flex items-center justify-between p-5 bg-white dark:bg-dark-card rounded-2xl shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange/10 rounded-lg flex items-center justify-center">
                      <FileText className="text-orange" size={20} />
                    </div>
                    <div>
                      <span className="font-semibold text-green dark:text-green-light group-hover:text-orange transition-colors">
                        {relatedDoc.title}
                      </span>
                      <p className="text-sm text-gray-400 dark:text-gray-500">{relatedDoc.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="text-orange" size={18} />
                </Link>
              </AnimSection>
            </>
          ) : (
            <div className="text-center py-20">
              <FileText className="text-gray-300 dark:text-gray-600 mx-auto mb-4" size={56} />
              <p className="text-gray-500 dark:text-gray-400">Document non disponible pour le moment.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
