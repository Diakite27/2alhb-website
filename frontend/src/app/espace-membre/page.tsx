"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User, Mail, Phone, MapPin, Briefcase, Building2,
  GraduationCap, Edit3, Save, LogOut, Shield, Calendar,
  Bell, FileText, CreditCard, Users, Search, Download,
  CheckCircle, ExternalLink, MessageSquare, Send,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth";
import { authApi, memberApi } from "@/lib/api";
import type { MemberNotification, MemberDocumentItem, CotisationPaymentItem, MemberPublic } from "@/lib/api";
import { formatPrice } from "@/lib/constants";

type Tab = "profil" | "annuaire" | "notifications" | "documents" | "cotisations" | "temoignage";

const tabs: { id: Tab; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: "profil", label: "Profil", icon: User },
  { id: "annuaire", label: "Annuaire", icon: Users },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "cotisations", label: "Cotisations", icon: CreditCard },
  { id: "temoignage", label: "Mon avis", icon: MessageSquare },
];

export default function EspaceMembrePage() {
  const { user, token, isLoading, logout, refreshProfile } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("profil");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    first_name: "", last_name: "", phone: "", profession: "",
    company: "", city: "", country: "", bio: "", linkedin: "",
  });

  // Data states
  const [notifications, setNotifications] = useState<MemberNotification[]>([]);
  const [documents, setDocuments] = useState<MemberDocumentItem[]>([]);
  const [payments, setPayments] = useState<CotisationPaymentItem[]>([]);
  const [directory, setDirectory] = useState<MemberPublic[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [testimonialText, setTestimonialText] = useState("");
  const [testimonialStatus, setTestimonialStatus] = useState<"idle" | "loading" | "success">("idle");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) router.push("/connexion");
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name, last_name: user.last_name,
        phone: user.phone, profession: user.profession,
        company: user.company, city: user.city,
        country: user.country, bio: user.bio, linkedin: user.linkedin,
      });
    }
  }, [user]);

  // Load data when tab changes
  useEffect(() => {
    if (!token) return;
    if (activeTab === "notifications") {
      memberApi.getNotifications(token).then((r) => {
        setNotifications(r.results);
        setUnreadCount(r.results.filter((n) => !n.is_read).length);
      }).catch(() => {});
    } else if (activeTab === "documents") {
      memberApi.getDocuments(token).then((r) => setDocuments(r.results)).catch(() => {});
    } else if (activeTab === "cotisations") {
      memberApi.getPayments(token).then((r) => setPayments(r.results)).catch(() => {});
    } else if (activeTab === "annuaire") {
      memberApi.getDirectory(token).then((r) => setDirectory(r.results)).catch(() => {});
    }
  }, [activeTab, token]);

  // Also load notification count on mount
  useEffect(() => {
    if (token) {
      memberApi.getNotifications(token).then((r) => {
        setUnreadCount(r.results.filter((n) => !n.is_read).length);
      }).catch(() => {});
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
      setProfilePhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    try {
      if (profilePhoto) {
        // Upload with FormData for photo
        const formData = new FormData();
        Object.entries(form).forEach(([key, val]) => { if (val) formData.append(key, val); });
        formData.append("photo", profilePhoto);
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
        await fetch(`${API_BASE}/auth/profile/`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      } else {
        await authApi.updateProfile(token, form);
      }
      await refreshProfile();
      setEditing(false);
      setProfilePhoto(null);
      setProfilePhotoPreview(null);
    } catch {} finally { setSaving(false); }
  };

  const handleMarkRead = async (id: number) => {
    if (!token) return;
    await memberApi.markRead(token, id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const handleMarkAllRead = async () => {
    if (!token) return;
    await memberApi.markAllRead(token);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const handleSubmitTestimonial = async () => {
    if (!token || !testimonialText.trim()) return;
    setTestimonialStatus("loading");
    try {
      await memberApi.submitTestimonial(token, testimonialText.trim());
      setTestimonialStatus("success");
      setTestimonialText("");
    } catch {
      setTestimonialStatus("idle");
    }
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

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border dark:bg-dark-card dark:text-gray-200 focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none transition-all text-sm";

  const filteredDirectory = directory.filter((m) =>
    searchQuery === "" ||
    m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-gradient-to-r from-green-dark to-green rounded-3xl p-6 sm:p-8 mb-6 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center overflow-hidden shrink-0">
                {user.photo ? <img src={user.photo} alt="" className="w-full h-full object-cover" /> : <User className="text-white" size={28} />}
              </div>
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl font-bold">{user.first_name} {user.last_name}</h1>
                <p className="text-white/60 text-sm">{user.profession}{user.company && ` — ${user.company}`}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs bg-white/15 px-2.5 py-0.5 rounded-full">{user.membership_type === "adherent" ? "Adhérent" : "Simple"}</span>
                  {user.promotion_year && <span className="text-xs bg-orange/30 px-2.5 py-0.5 rounded-full">Promo {user.promotion_year}</span>}
                  <span className={`text-xs px-2.5 py-0.5 rounded-full ${user.is_approved ? "bg-green-light/30" : "bg-orange/30"}`}>{user.is_approved ? "Approuvé" : "En attente"}</span>
                </div>
              </div>
              <button onClick={() => { logout(); router.push("/"); }} className="p-2.5 bg-white/15 rounded-xl hover:bg-red-500/50 transition-colors" title="Déconnexion">
                <LogOut size={18} />
              </button>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-orange text-white shadow-sm"
                    : "bg-white dark:bg-dark-card text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-border"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
                {tab.id === "notifications" && unreadCount > 0 && (
                  <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            {activeTab === "profil" && (
              <div className="bg-white dark:bg-dark-card rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-green dark:text-green-light">{editing ? "Modifier le profil" : "Informations personnelles"}</h2>
                  {!editing && <button onClick={() => setEditing(true)} className="text-orange text-sm font-medium flex items-center gap-1"><Edit3 size={14} /> Modifier</button>}
                </div>
                {editing ? (
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div><label className="block text-xs font-medium text-gray-500 mb-1">Prénom</label><input name="first_name" value={form.first_name} onChange={handleChange} className={inputClass} /></div>
                      <div><label className="block text-xs font-medium text-gray-500 mb-1">Nom</label><input name="last_name" value={form.last_name} onChange={handleChange} className={inputClass} /></div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div><label className="block text-xs font-medium text-gray-500 mb-1">Téléphone</label><input name="phone" value={form.phone} onChange={handleChange} className={inputClass} /></div>
                      <div><label className="block text-xs font-medium text-gray-500 mb-1">LinkedIn</label><input name="linkedin" value={form.linkedin} onChange={handleChange} className={inputClass} /></div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div><label className="block text-xs font-medium text-gray-500 mb-1">Profession</label><input name="profession" value={form.profession} onChange={handleChange} className={inputClass} /></div>
                      <div><label className="block text-xs font-medium text-gray-500 mb-1">Entreprise</label><input name="company" value={form.company} onChange={handleChange} className={inputClass} /></div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div><label className="block text-xs font-medium text-gray-500 mb-1">Ville</label><input name="city" value={form.city} onChange={handleChange} className={inputClass} /></div>
                      <div><label className="block text-xs font-medium text-gray-500 mb-1">Pays</label><input name="country" value={form.country} onChange={handleChange} className={inputClass} /></div>
                    </div>
                    <div><label className="block text-xs font-medium text-gray-500 mb-1">Bio</label><textarea name="bio" rows={3} value={form.bio} onChange={handleChange} className={`${inputClass} resize-none`} /></div>
                    {/* Photo upload */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Photo de profil</label>
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-dark-border flex items-center justify-center overflow-hidden shrink-0">
                          {profilePhotoPreview ? (
                            <img src={profilePhotoPreview} alt="Aperçu" className="w-full h-full object-cover" />
                          ) : user.photo ? (
                            <img src={user.photo} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User className="text-gray-400" size={20} />
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePhotoChange}
                          className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange/10 file:text-orange hover:file:bg-orange/20 file:cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={handleSave} disabled={saving} className="bg-orange text-white px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 disabled:opacity-60"><Save size={14} />{saving ? "..." : "Enregistrer"}</button>
                      <button onClick={() => setEditing(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border text-gray-500 text-sm">Annuler</button>
                    </div>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-5">
                    <InfoItem icon={Mail} label="Email" value={user.email} />
                    <InfoItem icon={Phone} label="Téléphone" value={user.phone || "—"} />
                    <InfoItem icon={Briefcase} label="Profession" value={user.profession || "—"} />
                    <InfoItem icon={Building2} label="Entreprise" value={user.company || "—"} />
                    <InfoItem icon={MapPin} label="Ville" value={`${user.city || "—"}, ${user.country}`} />
                    <InfoItem icon={GraduationCap} label="Promotion" value={user.promotion_year ? String(user.promotion_year) : "—"} />
                    <InfoItem icon={Shield} label="Type" value={user.membership_type === "adherent" ? "Adhérent" : "Simple"} />
                    <InfoItem icon={Calendar} label="Membre depuis" value={new Date(user.created_at).toLocaleDateString("fr-FR")} />
                  </div>
                )}
              </div>
            )}

            {activeTab === "annuaire" && (
              <div className="space-y-4">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher un membre..." className={`${inputClass} pl-10`} />
                </div>
                <p className="text-sm text-gray-400">{filteredDirectory.length} membre{filteredDirectory.length > 1 ? "s" : ""}</p>
                {filteredDirectory.length === 0 ? (
                  <div className="text-center py-12 text-gray-400"><Users size={40} className="mx-auto mb-3 opacity-50" /><p>Aucun membre trouvé</p></div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {filteredDirectory.map((m) => (
                      <div key={m.id} className="bg-white dark:bg-dark-card rounded-xl p-4 flex items-center gap-3 border border-gray-100 dark:border-dark-border">
                        <div className="w-10 h-10 bg-green/10 rounded-full flex items-center justify-center shrink-0">
                          {m.photo ? <img src={m.photo} alt="" className="w-full h-full object-cover rounded-full" /> : <User size={18} className="text-green" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-green dark:text-green-light text-sm truncate">{m.full_name}</p>
                          <p className="text-xs text-gray-400 truncate">{m.profession}{m.city && ` • ${m.city}`}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-3">
                {notifications.length > 0 && unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} className="text-orange text-sm font-medium mb-2">Tout marquer comme lu</button>
                )}
                {notifications.length === 0 ? (
                  <div className="text-center py-12 text-gray-400"><Bell size={40} className="mx-auto mb-3 opacity-50" /><p>Aucune notification</p></div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className={`bg-white dark:bg-dark-card rounded-xl p-4 border transition-all ${n.is_read ? "border-gray-100 dark:border-dark-border" : "border-orange/30 bg-orange/5 dark:bg-orange/10"}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-green dark:text-green-light text-sm">{n.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{n.message}</p>
                          <p className="text-[10px] text-gray-400 mt-2">{new Date(n.created_at).toLocaleDateString("fr-FR")}</p>
                        </div>
                        {!n.is_read && (
                          <button onClick={() => handleMarkRead(n.id)} className="text-orange shrink-0" title="Marquer comme lu"><CheckCircle size={18} /></button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "documents" && (
              <div className="space-y-3">
                {documents.length === 0 ? (
                  <div className="text-center py-12 text-gray-400"><FileText size={40} className="mx-auto mb-3 opacity-50" /><p>Aucun document disponible</p></div>
                ) : (
                  documents.map((doc) => (
                    <a key={doc.id} href={doc.file} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-100 dark:border-dark-border hover:border-orange/30 transition-all group">
                      <div className="w-10 h-10 bg-orange/10 rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="text-orange" size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-green dark:text-green-light text-sm group-hover:text-orange transition-colors truncate">{doc.title}</p>
                        <p className="text-xs text-gray-400">{doc.category_display} • {new Date(doc.published_at).toLocaleDateString("fr-FR")}</p>
                      </div>
                      <Download size={16} className="text-gray-400 group-hover:text-orange shrink-0" />
                    </a>
                  ))
                )}
              </div>
            )}

            {activeTab === "cotisations" && (
              <div className="space-y-4">
                <div className="bg-white dark:bg-dark-card rounded-xl p-5 border border-gray-100 dark:border-dark-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Type de cotisation</p>
                      <p className="font-bold text-green dark:text-green-light">{user.cotisation_mode === "annuelle" ? "Annuelle" : user.cotisation_mode === "mensuelle" ? "Mensuelle" : "Aucune"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Montant</p>
                      <p className="font-bold text-orange">{user.cotisation_mode === "annuelle" ? "60 000" : user.cotisation_mode === "mensuelle" ? "5 000" : "—"} FCFA</p>
                    </div>
                  </div>
                </div>

                <h3 className="font-medium text-green dark:text-green-light text-sm">Historique des paiements</h3>
                {payments.length === 0 ? (
                  <div className="text-center py-8 text-gray-400"><CreditCard size={32} className="mx-auto mb-2 opacity-50" /><p className="text-sm">Aucun paiement enregistré</p></div>
                ) : (
                  <div className="space-y-2">
                    {payments.map((p) => (
                      <div key={p.id} className="flex items-center justify-between bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-100 dark:border-dark-border">
                        <div>
                          <p className="font-medium text-sm text-green dark:text-green-light">{p.period_label}</p>
                          <p className="text-xs text-gray-400">{p.payment_method} • {new Date(p.paid_at).toLocaleDateString("fr-FR")}</p>
                        </div>
                        <span className="font-bold text-orange text-sm">{formatPrice(p.amount)} FCFA</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "temoignage" && (
              <div className="bg-white dark:bg-dark-card rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-lg font-bold text-green dark:text-green-light mb-2">Partagez votre avis</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Votre témoignage pourra être publié sur le site après validation par le bureau.
                </p>

                {testimonialStatus === "success" ? (
                  <div className="text-center py-8">
                    <CheckCircle className="text-green mx-auto mb-3" size={40} />
                    <p className="font-medium text-green dark:text-green-light">Merci pour votre témoignage !</p>
                    <p className="text-sm text-gray-400 mt-1">Il sera publié après validation.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <textarea
                      value={testimonialText}
                      onChange={(e) => setTestimonialText(e.target.value)}
                      rows={5}
                      placeholder="Partagez votre expérience en tant qu'ancien élève du Lycée Houphouët-Boigny, ce que la 2ALHB vous apporte..."
                      className={`${inputClass} resize-none`}
                    />
                    <button
                      onClick={handleSubmitTestimonial}
                      disabled={!testimonialText.trim() || testimonialStatus === "loading"}
                      className="bg-orange text-white px-6 py-3 rounded-xl font-medium text-sm flex items-center gap-2 hover:bg-orange-dark transition-all disabled:opacity-50"
                    >
                      <Send size={16} />
                      {testimonialStatus === "loading" ? "Envoi..." : "Envoyer mon témoignage"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string; size?: number }>; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-orange/10 rounded-lg flex items-center justify-center shrink-0"><Icon className="text-orange" size={14} /></div>
      <div><p className="text-[10px] text-gray-400 uppercase">{label}</p><p className="text-sm font-medium text-green dark:text-green-light">{value}</p></div>
    </div>
  );
}
