"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Qui peut adhérer à la 2ALHB ?",
    answer:
      "Tout ancien élève du Lycée Houphouët-Boigny, quelle que soit sa promotion ou son lieu de résidence actuel, peut demander à adhérer à l'amicale.",
  },
  {
    question: "L'adhésion est-elle payante ?",
    answer:
      "L'inscription est gratuite. Une cotisation annuelle peut être demandée pour financer les activités de l'amicale. Le montant est fixé par l'Assemblée Générale.",
  },
  {
    question: "Comment se déroule la validation ?",
    answer:
      "Après soumission du formulaire, le bureau exécutif examine votre demande. Vous recevez une confirmation par email sous 48h. En cas de besoin, le bureau peut vous contacter pour vérification.",
  },
  {
    question: "Quels sont les avantages d'être membre ?",
    answer:
      "Accès à l'annuaire des anciens, invitations aux événements exclusifs, programmes de mentorat, partage d'opportunités professionnelles, et participation aux actions de solidarité envers le lycée.",
  },
  {
    question: "Je suis à l'étranger, puis-je participer ?",
    answer:
      "Absolument ! La 2ALHB a des membres dans plusieurs pays. Vous pouvez participer aux événements en ligne, rejoindre les groupes de la diaspora et contribuer à distance aux projets de l'amicale.",
  },
  {
    question: "Comment puis-je m'impliquer davantage ?",
    answer:
      "Vous pouvez rejoindre une commission (insertion, solidarité, communication, organisation), proposer des événements ou devenir mentor pour les jeunes diplômés. Contactez le bureau pour en savoir plus.",
  },
];

function FAQCard({ item, index }: { item: FAQItem; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div
        className={`rounded-2xl overflow-hidden transition-all duration-300 ${
          open
            ? "bg-white dark:bg-dark-card shadow-md ring-1 ring-orange/20"
            : "bg-white dark:bg-dark-card shadow-sm hover:shadow-md"
        }`}
      >
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-start gap-4 p-5 text-left"
        >
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
              open ? "bg-orange text-white" : "bg-orange/10 text-orange"
            }`}
          >
            <HelpCircle size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-green dark:text-green-light text-sm sm:text-base pr-4">
              {item.question}
            </h3>
          </div>
          <ChevronDown
            size={18}
            className={`text-gray-400 shrink-0 mt-1 transition-transform duration-300 ${
              open ? "rotate-180 text-orange" : ""
            }`}
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
              <div className="px-5 pb-5 pl-17">
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed ml-12">
                  {item.answer}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function FAQ() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-16 bg-gray-50 dark:bg-dark-card">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-green dark:text-green-light mb-4">
            Questions fréquentes
          </h2>
          <div className="w-16 h-1 bg-orange mx-auto rounded-full" />
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQCard key={i} item={faq} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
