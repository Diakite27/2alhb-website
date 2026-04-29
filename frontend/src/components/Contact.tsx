"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Send, Mail, MapPin, CheckCircle } from "lucide-react";
import { api, AssociationInfo } from "@/lib/api";
import { useApiData } from "@/lib/hooks";

const FALLBACK_INFO: AssociationInfo = {
  name: "2ALHB",
  full_name: "Amicale des Anciens du Lycée HOUPHOUËT-BOIGNY de Korhogo",
  slogan: "Connecter les anciens, inspirer les générations futures",
  email: "contact@2alhb.ci",
  phone: "+225 07 00 00 00 00",
  address: "Lycée HOUPHOUËT-BOIGNY de Korhogo\nCôte d'Ivoire",
  facebook_url: "https://facebook.com/2alhb",
  linkedin_url: "https://linkedin.com/company/2alhb",
  whatsapp: "+2250700000000",
  adhesion_fee: 5000,
  monthly_fee: 5000,
  annual_fee: 60000,
};

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { data: info } = useApiData(() => api.getInfo(), FALLBACK_INFO);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      await api.contact({ ...form });
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setErrorMsg("Une erreur est survenue. Veuillez réessayer.");
      setStatus("error");
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border dark:bg-dark-card dark:text-gray-200 focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none transition-all text-sm";

  return (
    <section id="contact" className="py-14 lg:py-20 bg-white dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-green dark:text-green-light mb-4">
            Contactez-nous
          </h2>
          <div className="w-20 h-1 bg-orange mx-auto mb-6 rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Info */}
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-green dark:text-green-light mb-4">
                Restons en contact
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Vous avez une question, une suggestion ou souhaitez rejoindre
                l&apos;amicale ? N&apos;hésitez pas à nous écrire.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange/10 rounded-xl flex items-center justify-center">
                  <Mail className="text-orange" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-green dark:text-green-light">{info.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange/10 rounded-xl flex items-center justify-center">
                  <MapPin className="text-orange" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p className="font-medium text-green dark:text-green-light">
                    {info.address.replace(/\n/g, " — ")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {status === "success" ? (
              <div className="bg-green/5 dark:bg-green/10 rounded-2xl p-12 text-center">
                <CheckCircle className="text-green dark:text-green-light mx-auto mb-4" size={48} />
                <h3 className="text-xl font-bold text-green dark:text-green-light mb-2">Message envoyé !</h3>
                <p className="text-gray-600 dark:text-gray-400">Nous vous répondrons dans les plus brefs délais.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {status === "error" && errorMsg && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm">
                    {errorMsg}
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  <input name="name" placeholder="Votre nom *" required value={form.name} onChange={handleChange} className={inputClass} />
                  <input name="email" type="email" placeholder="Votre email *" required value={form.email} onChange={handleChange} className={inputClass} />
                </div>
                <input name="subject" placeholder="Sujet *" required value={form.subject} onChange={handleChange} className={inputClass} />
                <textarea
                  name="message"
                  placeholder="Votre message *"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className={`${inputClass} resize-none`}
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="bg-orange text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-dark transition-all flex items-center gap-2 disabled:opacity-60"
                  >
                    <Send size={18} />
                    {status === "loading" ? "Envoi..." : "Envoyer"}
                  </button>
                  <a
                    href={`https://wa.me/${info.whatsapp?.replace(/[^0-9+]/g, "") || ""}?text=${encodeURIComponent("Bonjour 2ALHB, je vous contacte depuis le site web.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center gap-2"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp
                  </a>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
