"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Newspaper, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import PageHeader from "@/components/PageHeader";
import { api, NewsArticle } from "@/lib/api";
import { useApiList } from "@/lib/hooks";
import { formatDate } from "@/lib/format";

const FALLBACK_NEWS: NewsArticle[] = [];

function AnimSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ y: 30, opacity: 0 }} animate={inView ? { y: 0, opacity: 1 } : {}} transition={{ duration: 0.5, delay }} className={className}>
      {children}
    </motion.div>
  );
}

export default function ActualitesPage() {
  const { data: articles } = useApiList(() => api.getNews(), FALLBACK_NEWS);

  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          title="Actualités"
          subtitle="Suivez les dernières nouvelles et activités de la 2ALHB."
          breadcrumbs={[{ label: "Actualités", href: "/actualites" }]}
        />

        <section className="py-16 bg-white dark:bg-dark-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {articles.length === 0 ? (
              <div className="text-center py-20">
                <Newspaper className="text-gray-300 dark:text-gray-600 mx-auto mb-4" size={56} />
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  Aucun article publié pour le moment
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                  Les actualités seront bientôt disponibles.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article, i) => (
                  <AnimSection key={article.id} delay={i * 0.05}>
                    <Link
                      href={`/actualites/${article.slug}`}
                      className="block bg-gray-50 dark:bg-dark-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group h-full"
                    >
                      <div className="h-48 bg-gradient-to-br from-orange/80 to-orange-dark flex items-center justify-center overflow-hidden">
                        {article.image ? (
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <Newspaper className="text-white/30" size={64} />
                        )}
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <Clock size={14} className="text-orange" />
                          <span>{formatDate(article.published_at)}</span>
                        </div>

                        <h3 className="text-lg font-bold text-green dark:text-green-light mb-3 group-hover:text-orange transition-colors line-clamp-2">
                          {article.title}
                        </h3>

                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                          {article.excerpt}
                        </p>

                        <span className="flex items-center gap-2 text-orange font-semibold text-sm group-hover:gap-3 transition-all">
                          Lire la suite <ArrowRight size={16} />
                        </span>
                      </div>
                    </Link>
                  </AnimSection>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
