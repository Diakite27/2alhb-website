"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Send, Mail, MapPin, CheckCircle } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/contact/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
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
                  <p className="font-medium text-green dark:text-green-light">contact@2alhb.ci</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange/10 rounded-xl flex items-center justify-center">
                  <MapPin className="text-orange" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p className="font-medium text-green dark:text-green-light">
                    Lycée Houphouët-Boigny, Korhogo — Côte d&apos;Ivoire
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
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-orange text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-dark transition-all flex items-center gap-2 disabled:opacity-60"
                >
                  <Send size={18} />
                  {status === "loading" ? "Envoi..." : "Envoyer"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
