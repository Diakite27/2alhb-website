"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, User, ArrowLeft, Newspaper } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { api, NewsArticle } from "@/lib/api";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    api
      .getNewsArticle(slug)
      .then((data) => {
        setArticle(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-dark-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back link */}
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 text-orange font-medium mb-8 hover:gap-3 transition-all"
          >
            <ArrowLeft size={18} /> Retour aux actualités
          </Link>

          {loading && (
            <div className="text-center py-20">
              <div className="w-8 h-8 border-4 border-orange border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <Newspaper className="text-gray-300 dark:text-gray-600 mx-auto mb-4" size={48} />
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Article introuvable
              </p>
              <Link
                href="/actualites"
                className="text-orange font-medium mt-4 inline-block"
              >
                Voir toutes les actualités
              </Link>
            </div>
          )}

          {article && (
            <motion.article
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header */}
              <h1 className="text-3xl sm:text-4xl font-bold text-green dark:text-green-light mb-4">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-8">
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-orange" />
                  {formatDate(article.published_at)}
                </span>
                {article.author_name && (
                  <span className="flex items-center gap-1.5">
                    <User size={14} className="text-orange" />
                    {article.author_name}
                  </span>
                )}
              </div>

              {/* Image */}
              {article.image && (
                <div className="rounded-2xl overflow-hidden mb-8">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-auto max-h-[400px] object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {article.content}
              </div>
            </motion.article>
          )}
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
