"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { UserPlus, CheckCircle, AlertCircle, Shield, Users, Briefcase, Heart } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import FAQ from "@/components/FAQ";

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  promotion: string;
  country: string;
  profession: string;
  bio: string;
  accept_rules: boolean;
}

const initialForm: FormData = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  promotion: "",
  country: "Côte d'Ivoire",
  profession: "",
  bio: "",
  accept_rules: false,
};

const benefits = [
  { icon: Users, title: "Réseau actif", description: "Accédez à un annuaire de 500+ anciens élèves à travers le monde" },
  { icon: Briefcase, title: "Opportunités", description: "Offres d'emploi, stages et partenariats partagés en exclusivité" },
  { icon: Heart, title: "Solidarité", description: "Entraide entre membres pour les projets personnels et professionnels" },
  { icon: Shield, title: "Mentorat", description: "Accompagnement par des aînés expérimentés dans votre domaine" },
];

function AnimSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ y: 40, opacity: 0 }} animate={inView ? { y: 0, opacity: 1 } : {}} transition={{ duration: 0.4, delay }} className={className}>
      {children}
    </motion.div>
  );
}

export default function AdhesionPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.accept_rules) {
      setErrorMsg("Vous devez accepter les statuts et le règlement intérieur.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("success");
    setForm(initialForm);
  };

  const inputClass =
    "w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-dark-border focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none transition-all text-sm bg-white dark:bg-dark-card dark:text-gray-200";

  return (
    <>
      <PageHeader
        title="Devenir membre"
        subtitle="Rejoignez la grande famille des anciens du Lycée Houphouët-Boigny et accédez à un réseau d'exception."
        breadcrumbs={[
          { label: "L'Association", href: "#" },
          { label: "Adhésion", href: "/association/adhesion" },
        ]}
      />

      {/* Benefits */}
      <section className="py-16 bg-white dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <AnimSection key={b.title} delay={i * 0.1}>
                <div className="flex items-start gap-4 p-6 rounded-2xl bg-gray-50 dark:bg-dark-card h-full">
                  <div className="w-11 h-11 bg-orange/10 rounded-lg flex items-center justify-center shrink-0">
                    <b.icon className="text-orange" size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-green dark:text-green-light mb-1">{b.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{b.description}</p>
                  </div>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 bg-gray-50 dark:bg-dark-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Left — info */}
            <AnimSection className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-green dark:text-green-light mb-4">
                Demande d&apos;adhésion
              </h2>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
                Remplissez ce formulaire pour soumettre votre candidature.
                Le bureau examinera votre demande et vous recevrez une
                confirmation par email.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-green/10 rounded-full flex items-center justify-center">
                    <span className="text-green font-bold text-xs">1</span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">Remplissez le formulaire</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-green/10 rounded-full flex items-center justify-center">
                    <span className="text-green font-bold text-xs">2</span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">Le bureau valide votre demande</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-orange/10 rounded-full flex items-center justify-center">
                    <span className="text-orange font-bold text-xs">3</span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">Bienvenue dans la 2ALHB !</span>
                </div>
              </div>
            </AnimSection>

            {/* Right — form */}
            <AnimSection className="lg:col-span-3" delay={0.15}>
              {status === "success" ? (
                <div className="bg-white dark:bg-dark-bg rounded-3xl p-12 text-center shadow-sm">
                  <CheckCircle className="text-green dark:text-green-light mx-auto mb-4" size={56} />
                  <h3 className="text-2xl font-bold text-green dark:text-green-light mb-2">Demande envoyée !</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Votre candidature a été soumise. Vous recevrez une réponse du bureau sous 48h.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-bg rounded-3xl p-8 sm:p-10 shadow-sm space-y-5">
                  {status === "error" && (
                    <div className="flex items-center gap-2 bg-red-50 text-red-600 p-4 rounded-xl text-sm">
                      <AlertCircle size={18} />
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Prénom *</label>
                      <input name="first_name" required value={form.first_name} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom *</label>
                      <input name="last_name" required value={form.last_name} onChange={handleChange} className={inputClass} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                      <input name="email" type="email" required value={form.email} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone *</label>
                      <input name="phone" type="tel" required value={form.phone} onChange={handleChange} className={inputClass} placeholder="+225 07 08 09 10 11" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Promotion / Année *</label>
                      <input name="promotion" required value={form.promotion} onChange={handleChange} className={inputClass} placeholder="Ex: 1998" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Pays de résidence *</label>
                      <input name="country" required value={form.country} onChange={handleChange} className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Profession</label>
                    <input name="profession" value={form.profession} onChange={handleChange} className={inputClass} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Quelques mots sur vous (optionnel)</label>
                    <textarea name="bio" rows={3} value={form.bio} onChange={handleChange} className={`${inputClass} resize-none`} />
                  </div>

                  <div className="flex items-start gap-3 pt-2">
                    <input
                      type="checkbox"
                      name="accept_rules"
                      checked={form.accept_rules}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 text-orange border-gray-300 rounded focus:ring-orange"
                    />
                    <label className="text-sm text-gray-600 dark:text-gray-400">
                      J&apos;accepte les{" "}
                      <Link href="/association/statuts" className="text-orange font-medium hover:underline">statuts</Link>{" "}
                      et le{" "}
                      <Link href="/association/reglement" className="text-orange font-medium hover:underline">règlement intérieur</Link>{" "}
                      de la 2ALHB. *
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-orange text-white py-4 rounded-xl font-semibold text-lg hover:bg-orange-dark transition-all flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
                  >
                    <UserPlus size={20} />
                    {status === "loading" ? "Envoi en cours..." : "Soumettre ma demande"}
                  </button>
                </form>
              )}
            </AnimSection>
          </div>
        </div>
      </section>

      <FAQ />
    </>
  );
}
