"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User, Mail, Phone, MapPin, Briefcase, Building2,
  GraduationCap, Edit3, Save, LogOut, Shield, Calendar,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth";
import { authApi } from "@/lib/api";

export default function EspaceMembrePage() {
  const { user, token, isLoading, logout, refreshProfile } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    profession: "",
    company: "",
    city: "",
    country: "",
    bio: "",
    linkedin: "",
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/connexion");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        profession: user.profession,
        company: user.company,
        city: user.city,
        country: user.country,
        bio: user.bio,
        linkedin: user.linkedin,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    try {
      await authApi.updateProfile(token, form);
      await refreshProfile();
      setEditing(false);
    } catch {
      // handle error
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (isLoading || !user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-24 flex items-center justify-center">
          <div className="text-gray-400">Chargement...</div>
        </main>
      </>
    );
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border dark:bg-dark-card dark:text-gray-200 focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none transition-all text-sm";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gradient-to-r from-green-dark to-green rounded-3xl p-8 sm:p-10 mb-8 text-white"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center overflow-hidden shrink-0">
                {user.photo ? (
                  <img src={user.photo} alt={user.first_name} className="w-full h-full object-cover" />
                ) : (
                  <User className="text-white" size={32} />
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">
                  {user.first_name} {user.last_name}
                </h1>
                <p className="text-white/60 text-sm mt-1">
                  {user.profession}{user.company && ` — ${user.company}`}
                </p>
                <div className="flex flex-wrap gap-3 mt-3">
                  <span className="text-xs bg-white/15 px-3 py-1 rounded-full">
                    {user.membership_type === "adherent" ? "Membre Adhérent" : "Membre Simple"}
                  </span>
                  {user.promotion_year && (
                    <span className="text-xs bg-orange/30 px-3 py-1 rounded-full">
                      Promotion {user.promotion_year}
                    </span>
                  )}
                  <span className={`text-xs px-3 py-1 rounded-full ${user.is_approved ? "bg-green-light/30" : "bg-orange/30"}`}>
                    {user.is_approved ? "Approuvé" : "En attente"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(!editing)}
                  className="p-2.5 bg-white/15 rounded-xl hover:bg-white/25 transition-colors"
                  title="Modifier le profil"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2.5 bg-white/15 rounded-xl hover:bg-red-500/50 transition-colors"
                  title="Déconnexion"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Profile info / edit */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-dark-card rounded-2xl p-8 shadow-sm"
          >
            <h2 className="text-lg font-bold text-green dark:text-green-light mb-6">
              {editing ? "Modifier le profil" : "Informations personnelles"}
            </h2>

            {editing ? (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prénom</label>
                    <input name="first_name" value={form.first_name} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label>
                    <input name="last_name" value={form.last_name} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Téléphone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LinkedIn</label>
                    <input name="linkedin" value={form.linkedin} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profession</label>
                    <input name="profession" value={form.profession} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Entreprise</label>
                    <input name="company" value={form.company} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ville</label>
                    <input name="city" value={form.city} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pays</label>
                    <input name="country" value={form.country} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                  <textarea name="bio" rows={3} value={form.bio} onChange={handleChange} className={`${inputClass} resize-none`} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-orange text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-dark transition-all flex items-center gap-2 disabled:opacity-60"
                  >
                    <Save size={16} />
                    {saving ? "Enregistrement..." : "Enregistrer"}
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-6 py-3 rounded-xl border border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-border transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                <InfoItem icon={Mail} label="Email" value={user.email} />
                <InfoItem icon={Phone} label="Téléphone" value={user.phone || "—"} />
                <InfoItem icon={Briefcase} label="Profession" value={user.profession || "—"} />
                <InfoItem icon={Building2} label="Entreprise" value={user.company || "—"} />
                <InfoItem icon={MapPin} label="Ville" value={user.city || "—"} />
                <InfoItem icon={MapPin} label="Pays" value={user.country} />
                <InfoItem icon={GraduationCap} label="Promotion" value={user.promotion_year ? String(user.promotion_year) : "—"} />
                <InfoItem icon={Shield} label="Type" value={user.membership_type === "adherent" ? "Adhérent" : "Simple"} />
                <InfoItem icon={Calendar} label="Membre depuis" value={new Date(user.created_at).toLocaleDateString("fr-FR")} />
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 bg-orange/10 rounded-lg flex items-center justify-center shrink-0">
        <Icon className="text-orange" size={16} />
      </div>
      <div>
        <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
        <p className="text-sm font-medium text-green dark:text-green-light">{value}</p>
      </div>
    </div>
  );
}
