"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Newspaper, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import TiltCard from "./TiltCard";
import { api, NewsArticle } from "@/lib/api";
import { useApiList } from "@/lib/hooks";
import { formatDate } from "@/lib/format";

const FALLBACK_NEWS: NewsArticle[] = [];

export default function News() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { data: articles, loading } = useApiList(() => api.getNews(), FALLBACK_NEWS);

  // Ne rien afficher pendant le chargement ou s'il n'y a pas d'articles
  if (loading || articles.length === 0) return null;

  // Afficher les 3 derniers articles
  const latestArticles = articles.slice(0, 3);

  return (
    <section id="news" className="py-14 lg:py-24 bg-white dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-green dark:text-green-light mb-4">
            Actualités
          </h2>
          <div className="w-20 h-1 bg-orange mx-auto mb-6 rounded-full" />
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Les dernières nouvelles de la vie de l&apos;amicale
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestArticles.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ y: 40, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <TiltCard className="bg-gray-50 dark:bg-dark-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
                {/* Image ou placeholder */}
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

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <Clock size={14} className="text-orange" />
                    <span>{formatDate(article.published_at)}</span>
                  </div>

                  <h3 className="text-xl font-bold text-green dark:text-green-light mb-3 group-hover:text-orange transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-body text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-1">
                    {article.excerpt}
                  </p>

                  <Link
                    href={`/actualites/${article.slug}`}
                    className="flex items-center gap-2 text-orange font-semibold hover:gap-3 transition-all mt-auto"
                  >
                    Lire la suite <ArrowRight size={16} />
                  </Link>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {articles.length > 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="text-center mt-10"
          >
            <Link
              href="/actualites"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green text-white rounded-xl font-medium hover:bg-green-dark transition-colors"
            >
              Toutes les actualités <ArrowRight size={16} />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
