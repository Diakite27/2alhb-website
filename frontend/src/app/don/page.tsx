"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { HeartHandshake, Phone, Copy, Check, Info, CheckCircle, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import PageHeader from "@/components/PageHeader";
import { api, AssociationInfo } from "@/lib/api";
import { useApiData } from "@/lib/hooks";

const FALLBACK_INFO: AssociationInfo = {
  name: "2ALHB",
  full_name: "Amicale des Anciens du Lycée HOUPHOUËT-BOIGNY de Korhogo",
  slogan: "Connecter les anciens, inspirer les générations futures",
  email: "contact@2alhb.ci",
  phone: "+225 07 00 00 00 00",
  address: "Korhogo, Côte d'Ivoire",
  facebook_url: "",
  linkedin_url: "",
  whatsapp: "",
  adhesion_fee: 5000,
  monthly_fee: 5000,
  annual_fee: 60000,
  orange_money_enabled: true,
  orange_money_number: "+225 07 07 442 080",
  wave_enabled: true,
  wave_number: "+225 07 07 442 080",
};

type Method = "orange_money" | "wave";

interface PaymentMethod {
  value: Method;
  label: string;
  logo: string;
  number: string;
}

export default function DonPage() {
  const { data: info } = useApiData(() => api.getInfo(), FALLBACK_INFO);
  const [copied, setCopied] = useState(false);
  const [method, setMethod] = useState<Method | null>(null);
  const [form, setForm] = useState({
    amount: "",
    full_name: "",
    email: "",
    phone: "",
    transaction_reference: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Moyens de paiement activés depuis l'admin.
  const methods = useMemo<PaymentMethod[]>(() => {
    const list: PaymentMethod[] = [];
    if (info.orange_money_enabled) {
      list.push({
        value: "orange_money",
        label: "Orange Money",
        logo: "/images/logo-om.png",
        number: info.orange_money_number,
      });
    }
    if (info.wave_enabled) {
      list.push({
        value: "wave",
        label: "Wave",
        logo: "/images/logo-wave.png",
        number: info.wave_number,
      });
    }
    return list;
  }, [info]);

  // Moyen sélectionné (par défaut le premier activé).
  const selectedMethod = method ?? (methods[0]?.value ?? null);
  const activeMethod = methods.find((m) => m.value === selectedMethod) ?? null;
  const donationNumber = activeMethod?.number ?? "";

  const handleCopy = async () => {
    if (!donationNumber) return;
    try {
      await navigator.clipboard.writeText(donationNumber.replace(/\s+/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard indisponible : on ignore silencieusement
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMethod) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      await api.donate({
        full_name: form.full_name,
        email: form.email,
        phone: form.phone || undefined,
        method: selectedMethod,
        amount: Number(form.amount),
        transaction_reference: form.transaction_reference || undefined,
        message: form.message || undefined,
      });
      setStatus("success");
    } catch (err) {
      setErrorMsg(
        err instanceof Error && err.message
          ? err.message
          : "Une erreur est survenue. Veuillez réessayer."
      );
      setStatus("error");
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border dark:bg-dark-card dark:text-gray-200 focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none transition-all text-sm";
  const labelClass =
    "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";

  const noMethodAvailable = methods.length === 0;

  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          title="Faire un don"
          subtitle="Soutenez les actions de solidarité et d'excellence de la 2ALHB."
          breadcrumbs={[{ label: "Faire un don", href: "/don" }]}
        />

        <section className="py-16 bg-gray-50 dark:bg-dark-bg">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-2">
              <HeartHandshake className="text-orange" size={28} />
              <h2 className="text-2xl font-bold text-green dark:text-green-light">
                Faire un don par Mobile Money
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Envoyez votre don via Mobile Money au numéro ci-dessous, puis renseignez le
              formulaire pour que nous puissions suivre votre don et vous adresser un reçu.
            </p>

            {noMethodAvailable ? (
              <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-10 text-center">
                <Info className="text-gray-300 dark:text-gray-600 mx-auto mb-3" size={40} />
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  Les dons en ligne ne sont pas disponibles pour le moment.
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                  Merci de revenir plus tard ou de contacter le bureau.
                </p>
              </div>
            ) : (
              <>
                {/* Bloc numéro à créditer (du moyen sélectionné) */}
                <div className="bg-green/5 dark:bg-green/10 border border-green/15 rounded-2xl p-5 mb-8">
                  <div className="flex items-center gap-4 mb-4 flex-wrap">
                    {methods.map((m) => (
                      <div
                        key={m.value}
                        className="w-14 h-14 bg-white dark:bg-dark-card rounded-xl flex items-center justify-center p-2 shadow-sm"
                      >
                        <Image src={m.logo} alt={m.label} width={40} height={40} className="object-contain" />
                      </div>
                    ))}
                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                      {methods.map((m) => m.label).join(" & ")} accepté{methods.length > 1 ? "s" : ""}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                    Numéro à créditer{activeMethod ? ` (${activeMethod.label})` : ""}
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-2 text-2xl font-bold text-green dark:text-green-light">
                      <Phone size={20} className="text-orange" />
                      {donationNumber}
                    </span>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 border border-green/30 text-green dark:text-green-light px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green/10 transition-colors"
                    >
                      {copied ? <Check size={15} /> : <Copy size={15} />}
                      {copied ? "Copié !" : "Copier"}
                    </button>
                  </div>

                  <div className="flex items-start gap-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
                    <Info size={15} className="shrink-0 mt-0.5 text-gray-400" />
                    <span>
                      Indiquez votre nom lors du transfert. Conservez la référence de la
                      transaction (SMS de confirmation) : elle nous aide à retrouver votre don
                      plus vite.
                    </span>
                  </div>
                </div>

                {status === "success" ? (
                  <div className="bg-green/5 dark:bg-green/10 rounded-2xl p-10 text-center">
                    <CheckCircle className="text-green dark:text-green-light mx-auto mb-4" size={48} />
                    <h3 className="text-xl font-bold text-green dark:text-green-light mb-2">Merci pour votre don !</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Votre déclaration a bien été enregistrée. Le bureau vérifiera la
                      transaction et vous adressera un reçu par email.
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold text-green dark:text-green-light mb-4">
                      J&apos;ai déjà envoyé mon don — je le déclare :
                    </h3>

                    {status === "error" && errorMsg && (
                      <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm mb-5">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Moyen utilisé — seulement les moyens activés */}
                      <div>
                        <label className={labelClass}>Moyen utilisé *</label>
                        <div className={`grid gap-3 ${methods.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                          {methods.map((m) => (
                            <button
                              key={m.value}
                              type="button"
                              onClick={() => setMethod(m.value)}
                              className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                                selectedMethod === m.value
                                  ? "border-green bg-green/5 dark:bg-green/10"
                                  : "border-gray-200 dark:border-dark-border hover:border-green/40"
                              }`}
                            >
                              <span className="w-8 h-8 bg-white dark:bg-dark-card rounded-md flex items-center justify-center p-1 shadow-sm shrink-0">
                                <Image src={m.logo} alt={m.label} width={24} height={24} className="object-contain" />
                              </span>
                              <span className="font-medium text-gray-700 dark:text-gray-200 flex-1">{m.label}</span>
                              {selectedMethod === m.value && <Check size={18} className="text-green shrink-0" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Montant */}
                      <div>
                        <label className={labelClass}>Montant envoyé (FCFA) *</label>
                        <input
                          name="amount"
                          type="number"
                          min="1"
                          required
                          value={form.amount}
                          onChange={handleChange}
                          placeholder="Ex : 25000"
                          className={inputClass}
                        />
                      </div>

                      {/* Nom + Email */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Nom complet *</label>
                          <input name="full_name" required value={form.full_name} onChange={handleChange} placeholder="Votre nom" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Email *</label>
                          <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="Pour votre reçu" className={inputClass} />
                        </div>
                      </div>

                      {/* Téléphone + Référence */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Téléphone (émetteur)</label>
                          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Numéro ayant servi au transfert" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Référence de transaction</label>
                          <input name="transaction_reference" value={form.transaction_reference} onChange={handleChange} placeholder="ID du SMS de confirmation" className={inputClass} />
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label className={labelClass}>Message (optionnel)</label>
                        <textarea name="message" rows={3} value={form.message} onChange={handleChange} placeholder="Un mot à nous laisser..." className={`${inputClass} resize-none`} />
                      </div>

                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full bg-orange text-white py-3.5 rounded-xl font-semibold hover:bg-orange-dark transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        <HeartHandshake size={18} />
                        {status === "loading" ? "Envoi..." : "Déclarer mon don"}
                      </button>
                    </form>
                  </>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
