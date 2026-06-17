"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Calendar, Briefcase, FileText, Users } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Event, JobOffer } from "@/lib/api";

interface SearchResult {
  type: "event" | "job";
  id: number;
  title: string;
  subtitle: string;
  href: string;
}

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (value.trim().length < 2) {
      setResults([]);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      setLoading(true);
      const searchResults: SearchResult[] = [];

      try {
        // Search events
        const events = await api.getEvents();
        events.results
          .filter((e) => e.title.toLowerCase().includes(value.toLowerCase()) || e.location.toLowerCase().includes(value.toLowerCase()))
          .slice(0, 3)
          .forEach((e) => {
            searchResults.push({
              type: "event",
              id: e.id,
              title: e.title,
              subtitle: e.location,
              href: `/evenements/${e.id}`,
            });
          });
      } catch {}

      try {
        // Search jobs
        const jobs = await api.getJobs(`search=${encodeURIComponent(value)}`);
        jobs.results.slice(0, 3).forEach((j) => {
          searchResults.push({
            type: "job",
            id: j.id,
            title: j.title,
            subtitle: `${j.company} — ${j.location}`,
            href: `/emplois/${j.id}`,
          });
        });
      } catch {}

      setResults(searchResults);
      setLoading(false);
    }, 300);
  };

  const close = () => {
    setOpen(false);
    setQuery("");
    setResults([]);
  };

  const iconForType = (type: string) => {
    switch (type) {
      case "event": return <Calendar size={14} className="text-orange" />;
      case "job": return <Briefcase size={14} className="text-orange" />;
      default: return <FileText size={14} className="text-orange" />;
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
        aria-label="Rechercher"
      >
        <Search size={18} className="text-foreground dark:text-gray-200" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
            onClick={close}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg bg-white dark:bg-dark-card rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Input */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-dark-border">
                <Search size={20} className="text-gray-400 shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Rechercher un événement, une offre..."
                  className="flex-1 bg-transparent outline-none text-sm text-foreground dark:text-gray-200 placeholder-gray-400"
                />
                <button onClick={close} className="text-gray-400 hover:text-gray-600">
                  <X size={18} />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto">
                {loading && (
                  <div className="p-4 text-center text-sm text-gray-400">Recherche...</div>
                )}

                {!loading && query.length >= 2 && results.length === 0 && (
                  <div className="p-6 text-center text-sm text-gray-400">
                    Aucun résultat pour &ldquo;{query}&rdquo;
                  </div>
                )}

                {results.length > 0 && (
                  <div className="p-2">
                    {results.map((r) => (
                      <Link
                        key={`${r.type}-${r.id}`}
                        href={r.href}
                        onClick={close}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-border transition-colors"
                      >
                        <div className="w-8 h-8 bg-orange/10 rounded-lg flex items-center justify-center shrink-0">
                          {iconForType(r.type)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-green dark:text-green-light truncate">{r.title}</p>
                          <p className="text-xs text-gray-400 truncate">{r.subtitle}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {!loading && query.length < 2 && (
                  <div className="p-6 text-center text-sm text-gray-400">
                    Tapez au moins 2 caractères
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
