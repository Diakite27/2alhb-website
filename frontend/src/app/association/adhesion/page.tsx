"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { UserPlus, CheckCircle, AlertCircle, Shield, Users, Briefcase, Heart } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import FAQ from "@/components/FAQ";
import { api, AssociationInfo } from "@/lib/api";
import { useApiData } from "@/lib/hooks";
import { formatPrice } from "@/lib/constants";

const FALLBACK_INFO: AssociationInfo = {
  name: "2ALHB",
  full_name: "Amicale des Anciens du Lycée HOUPHOUËT-BOIGNY de Korhogo",
  slogan: "Connecter les anciens, inspirer les générations futures",
  email: "contact@2alhb.ci",
  phone: "+225 07 00 00 00 00",
  address: "Lycée HOUPHOUËT-BOIGNY de Korhogo\nCôte d'Ivoire",
  facebook_url: "https://facebook.com/2alhb",
  linkedin_url: "https://linkedin.com/company/2alhb",
  adhesion_fee: 5000,
  monthly_fee: 5000,
  annual_fee: 60000,
};

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  promotion: string;
  country: string;
  city: string;
  profession: string;
  bio: string;
  membership_type: "simple" | "adherent";
  cotisation_mode: "mensuelle" | "annuelle";
  accept_rules: boolean;
  accept_data: boolean;
}

const initialForm: FormData = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  promotion: "",
  country: "Côte d'Ivoire",
  city: "",
  profession: "",
  bio: "",
  membership_type: "simple",
  cotisation_mode: "mensuelle",
  accept_rules: false,
  accept_data: false,
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
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const { data: info } = useApiData(() => api.getInfo(), FALLBACK_INFO);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg("La photo ne doit pas dépasser 2 Mo.");
        setStatus("error");
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Field-level validation
    const errors: string[] = [];

    if (!form.first_name.trim()) errors.push("Le prénom est requis");
    if (!form.last_name.trim()) errors.push("Le nom est requis");
    if (!form.email.trim()) errors.push("L'email est requis");
    if (!form.phone.trim()) errors.push("Le téléphone est requis");
    if (!form.promotion.trim()) errors.push("La promotion est requise");
    if (!form.country.trim()) errors.push("Le pays de résidence est requis");
    if (!form.city.trim()) errors.push("La ville est requise");
    if (!form.profession.trim()) errors.push("La profession est requise");

    if (form.membership_type === "adherent" && !form.cotisation_mode) {
      errors.push("Choisissez un mode de cotisation (mensuelle ou annuelle)");
    }

    if (!form.accept_rules) errors.push("Vous devez accepter les statuts et le règlement intérieur");
    if (!form.accept_data) errors.push("Vous devez consentir à la collecte de vos données");

    if (errors.length > 0) {
      setErrorMsg(errors.join(" • "));
      setStatus("error");
      document.getElementById("adhesion-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setStatus("loading");
    try {
      if (photoFile) {
        // Use FormData when there's a photo
        const formData = new FormData();
        formData.append("first_name", form.first_name);
        formData.append("last_name", form.last_name);
        formData.append("email", form.email);
        formData.append("phone", form.phone);
        formData.append("promotion", form.promotion);
        formData.append("country", form.country);
        formData.append("city", form.city);
        formData.append("profession", form.profession);
        formData.append("bio", form.bio);
        formData.append("membership_type", form.membership_type);
        formData.append("cotisation_mode", form.cotisation_mode);
        formData.append("photo", photoFile);

        const res = await api.register(formData);
        if (res instanceof Response && !res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.detail || `Erreur ${res.status}`);
        }
      } else {
        // JSON when no photo
        await api.register({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone,
          promotion: form.promotion,
          country: form.country,
          city: form.city,
          profession: form.profession,
          bio: form.bio,
          membership_type: form.membership_type,
          cotisation_mode: form.cotisation_mode,
        });
      }
      setStatus("success");
      setForm(initialForm);
      setPhotoFile(null);
      setPhotoPreview(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Une erreur est survenue. Veuillez réessayer.";
      setErrorMsg(message);
      setStatus("error");
      document.getElementById("adhesion-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const inputClass =
    "w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-dark-border focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none transition-all text-sm bg-white dark:bg-dark-card dark:text-gray-200";

  return (
    <>
      <PageHeader
        title="Devenir membre"
        subtitle="Rejoignez la grande famille des anciens du Lycée HOUPHOUËT-BOIGNY de Korhogo et accédez à un réseau d'exception."
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
              <p className="text-body text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
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
                <form id="adhesion-form" onSubmit={handleSubmit} className="bg-white dark:bg-dark-bg rounded-3xl p-8 sm:p-10 shadow-sm space-y-5">
                  {status === "error" && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm">
                      <div className="flex items-center gap-2 font-semibold mb-1">
                        <AlertCircle size={16} />
                        Veuillez corriger les erreurs suivantes :
                      </div>
                      <p>{errorMsg}</p>
                    </div>
                  )}

                  {/* Membership type selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Type de membre *</label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {/* Membre Simple */}
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, membership_type: "simple" }))}
                        className={`text-left p-4 rounded-xl border-2 transition-all ${
                          form.membership_type === "simple"
                            ? "border-orange bg-orange/5 dark:bg-orange/10"
                            : "border-gray-200 dark:border-dark-border hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-green dark:text-green-light">Membre Simple</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            form.membership_type === "simple" ? "border-orange" : "border-gray-300"
                          }`}>
                            {form.membership_type === "simple" && <div className="w-2.5 h-2.5 rounded-full bg-orange" />}
                          </div>
                        </div>
                        <p className="text-orange font-bold text-lg">{formatPrice(info.adhesion_fee)} FCFA</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Droit d&apos;adhésion unique</p>
                      </button>

                      {/* Membre Adhérent */}
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, membership_type: "adherent" }))}
                        className={`text-left p-4 rounded-xl border-2 transition-all ${
                          form.membership_type === "adherent"
                            ? "border-orange bg-orange/5 dark:bg-orange/10"
                            : "border-gray-200 dark:border-dark-border hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-green dark:text-green-light">Membre Adhérent</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            form.membership_type === "adherent" ? "border-orange" : "border-gray-300"
                          }`}>
                            {form.membership_type === "adherent" && <div className="w-2.5 h-2.5 rounded-full bg-orange" />}
                          </div>
                        </div>
                        <p className="text-orange font-bold text-lg">{formatPrice(info.adhesion_fee)} FCFA <span className="text-xs font-normal text-gray-400">+ cotisation</span></p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Adhésion + cotisation mensuelle ou annuelle</p>
                      </button>
                    </div>
                  </div>

                  {/* Info card based on selection */}
                  {form.membership_type === "simple" ? (
                    <div className="bg-green/5 dark:bg-green/10 border border-green/20 rounded-xl p-4">
                      <h4 className="font-semibold text-green dark:text-green-light text-sm mb-2">Membre Simple</h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-orange rounded-full shrink-0" />
                          Droit d&apos;adhésion : <strong>{formatPrice(info.adhesion_fee)} FCFA</strong> (paiement unique)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-orange rounded-full shrink-0" />
                          Accès au réseau et à l&apos;annuaire des anciens
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-orange rounded-full shrink-0" />
                          Invitations aux événements de l&apos;amicale
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-orange/5 dark:bg-orange/10 border border-orange/20 rounded-xl p-4">
                        <h4 className="font-semibold text-orange text-sm mb-2">Membre Adhérent — Avantages complets</h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-orange rounded-full shrink-0" />
                            Droit d&apos;adhésion : <strong>{formatPrice(info.adhesion_fee)} FCFA</strong>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-orange rounded-full shrink-0" />
                            Tous les avantages du membre simple
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-orange rounded-full shrink-0" />
                            Droit de vote en Assemblée Générale
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-orange rounded-full shrink-0" />
                            Accès aux programmes de mentorat et d&apos;insertion
                          </li>
                        </ul>
                      </div>

                      {/* Cotisation mode */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mode de cotisation *</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, cotisation_mode: "mensuelle" }))}
                            className={`p-3 rounded-xl border-2 text-center transition-all ${
                              form.cotisation_mode === "mensuelle"
                                ? "border-orange bg-orange/5 dark:bg-orange/10"
                                : "border-gray-200 dark:border-dark-border hover:border-gray-300"
                            }`}
                          >
                            <p className="font-bold text-green dark:text-green-light">{formatPrice(info.monthly_fee)} FCFA</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">/ mois</p>
                          </button>
                          <button
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, cotisation_mode: "annuelle" }))}
                            className={`p-3 rounded-xl border-2 text-center transition-all relative ${
                              form.cotisation_mode === "annuelle"
                                ? "border-orange bg-orange/5 dark:bg-orange/10"
                                : "border-gray-200 dark:border-dark-border hover:border-gray-300"
                            }`}
                          >
                            <p className="font-bold text-green dark:text-green-light">{formatPrice(info.annual_fee)} FCFA</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">/ an</p>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <hr className="border-gray-100 dark:border-dark-border" />

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

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Ville *</label>
                      <input name="city" required value={form.city} onChange={handleChange} className={inputClass} placeholder="Ex: Korhogo" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Profession *</label>
                      <input name="profession" required value={form.profession} onChange={handleChange} className={inputClass} placeholder="Ex: Ingénieur informatique" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Quelques mots sur vous (optionnel)</label>
                    <textarea name="bio" rows={3} value={form.bio} onChange={handleChange} className={`${inputClass} resize-none`} />
                  </div>

                  {/* Photo upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Photo de profil (optionnel)</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-dark-border flex items-center justify-center overflow-hidden shrink-0">
                        {photoPreview ? (
                          <img src={photoPreview} alt="Aperçu" className="w-full h-full object-cover" />
                        ) : (
                          <UserPlus className="text-gray-400" size={24} />
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange/10 file:text-orange hover:file:bg-orange/20 file:cursor-pointer"
                        />
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG. 2 Mo max.</p>
                      </div>
                    </div>
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

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="accept_data"
                      checked={form.accept_data}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 text-orange border-gray-300 rounded focus:ring-orange"
                    />
                    <label className="text-sm text-gray-600 dark:text-gray-400">
                      Je consens à ce que mes données personnelles soient collectées
                      et utilisées par la 2ALHB dans le cadre exclusif de mon adhésion
                      et de la gestion de l&apos;association. Ces données ne seront ni
                      cédées ni partagées à des tiers en dehors de ce cadre. *
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
