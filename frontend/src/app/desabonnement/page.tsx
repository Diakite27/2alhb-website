"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MailX, CheckCircle, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import PageHeader from "@/components/PageHeader";
import { newsletterApi } from "@/lib/api";

function UnsubscribeForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const prefill = searchParams.get("email");
    if (prefill) setEmail(prefill);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setMessage("");
    try {
      await newsletterApi.unsubscribe(email);
      setStatus("success");
      setMessage("Vous avez été désabonné avec succès. Vous ne recevrez plus nos communications.");
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error && err.message
          ? err.message
          : "Une erreur est survenue. Vérifiez votre adresse et réessayez."
      );
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border dark:bg-dark-card dark:text-gray-200 focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none transition-all text-sm";

  if (status === "success") {
    return (
      <div className="bg-green/5 dark:bg-green/10 rounded-2xl p-10 text-center">
        <CheckCircle className="text-green dark:text-green-light mx-auto mb-4" size={48} />
        <h3 className="text-xl font-bold text-green dark:text-green-light mb-2">Désabonnement confirmé</h3>
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-orange/10 rounded-xl flex items-center justify-center shrink-0">
          <MailX className="text-orange" size={22} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-green dark:text-green-light">Se désabonner</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Confirmez votre adresse pour ne plus recevoir nos communications.
          </p>
        </div>
      </div>

      {status === "error" && message && (
        <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm mb-4">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          className={inputClass}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-orange text-white py-3.5 rounded-xl font-semibold hover:bg-orange-dark transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <MailX size={18} />
          {status === "loading" ? "Traitement..." : "Confirmer le désabonnement"}
        </button>
      </form>
    </div>
  );
}

export default function DesabonnementPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          title="Désabonnement"
          subtitle="Gérez vos préférences de communication avec la 2ALHB."
          breadcrumbs={[{ label: "Désabonnement", href: "/desabonnement" }]}
        />

        <section className="py-16 bg-gray-50 dark:bg-dark-bg">
          <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<p className="text-center text-gray-400">Chargement...</p>}>
              <UnsubscribeForm />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
