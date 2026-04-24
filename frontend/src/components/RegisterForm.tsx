"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { UserPlus, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  promotion: string;
  profession: string;
  company: string;
  city: string;
  country: string;
  username: string;
  password: string;
  password_confirm: string;
}

const initialForm: FormData = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  promotion: "",
  profession: "",
  company: "",
  city: "",
  country: "Côte d'Ivoire",
  username: "",
  password: "",
  password_confirm: "",
};

export default function RegisterForm() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/members/register/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        const firstError = Object.values(data).flat().join(", ");
        throw new Error(firstError || "Erreur lors de l'inscription");
      }

      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border dark:bg-dark-card dark:text-gray-200 focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none transition-all text-sm";

  return (
    <section id="register" className="py-14 lg:py-24 bg-gradient-to-br from-green-dark via-green to-green-light relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-64 sm:w-96 h-64 sm:h-96 bg-orange/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Image
            src="/logo.png"
            alt="2ALHB"
            width={80}
            height={80}
            className="mx-auto mb-6 rounded-full border-2 border-white/20"
          />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Rejoindre la 2ALHB
          </h2>
          <div className="w-20 h-1 bg-orange mx-auto mb-6 rounded-full" />
          <p className="text-white/80 max-w-xl mx-auto text-lg">
            Inscrivez-vous et connectez-vous au réseau des anciens du Lycée Houphouët-Boigny
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          {status === "success" ? (
            <div className="bg-white rounded-3xl p-12 text-center">
              <CheckCircle className="text-green mx-auto mb-4" size={64} />
              <h3 className="text-2xl font-bold text-green mb-2">Inscription réussie !</h3>
              <p className="text-gray-600">
                Votre demande a été envoyée. Vous recevrez une confirmation après validation.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl">
              {status === "error" && (
                <div className="flex items-center gap-2 bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm">
                  <AlertCircle size={18} />
                  {errorMsg}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input name="last_name" placeholder="Nom *" required value={form.last_name} onChange={handleChange} className={inputClass} />
                <input name="first_name" placeholder="Prénom(s) *" required value={form.first_name} onChange={handleChange} className={inputClass} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input name="email" type="email" placeholder="Email *" required value={form.email} onChange={handleChange} className={inputClass} />
                <input name="phone" type="tel" placeholder="Téléphone" value={form.phone} onChange={handleChange} className={inputClass} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input name="promotion" placeholder="Promotion / Année" value={form.promotion} onChange={handleChange} className={inputClass} />
                <input name="profession" placeholder="Profession" value={form.profession} onChange={handleChange} className={inputClass} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input name="company" placeholder="Entreprise / Organisation" value={form.company} onChange={handleChange} className={inputClass} />
                <input name="city" placeholder="Ville" value={form.city} onChange={handleChange} className={inputClass} />
              </div>

              <div className="mb-4">
                <input name="country" placeholder="Pays" value={form.country} onChange={handleChange} className={inputClass} />
              </div>

              <hr className="my-6 border-gray-100" />

              <div className="mb-4">
                <input name="username" placeholder="Nom d'utilisateur *" required value={form.username} onChange={handleChange} className={inputClass} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <input name="password" type="password" placeholder="Mot de passe *" required value={form.password} onChange={handleChange} className={inputClass} />
                <input name="password_confirm" type="password" placeholder="Confirmer le mot de passe *" required value={form.password_confirm} onChange={handleChange} className={inputClass} />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-orange text-white py-4 rounded-xl font-semibold text-lg hover:bg-orange-dark transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <UserPlus size={20} />
                {status === "loading" ? "Inscription en cours..." : "S'inscrire"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
