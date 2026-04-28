"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LogIn, AlertCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth";

export default function ConnexionPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      router.push("/espace-membre");
    } catch {
      setError("Identifiants incorrects. Vérifiez votre nom d'utilisateur et mot de passe.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-dark-border dark:bg-dark-card dark:text-gray-200 focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none transition-all text-sm";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-dark-bg pt-24 pb-16">
        <div className="max-w-md mx-auto px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-dark-card rounded-3xl p-8 sm:p-10 shadow-sm"
          >
            <div className="text-center mb-8">
              <Image
                src="/images/logo.png"
                alt="2ALHB"
                width={60}
                height={60}
                className="mx-auto rounded-full mb-4"
              />
              <h1 className="text-2xl font-bold text-green dark:text-green-light">
                Espace Membre
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Connectez-vous à votre compte
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm mb-6">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Nom d&apos;utilisateur
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className={inputClass}
                  placeholder="Votre nom d'utilisateur"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={inputClass}
                    placeholder="Votre mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange text-white py-3.5 rounded-xl font-semibold hover:bg-orange-dark transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <LogIn size={18} />
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Pas encore membre ?{" "}
                <Link href="/association/adhesion" className="text-orange font-medium hover:underline">
                  Demander une adhésion
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
