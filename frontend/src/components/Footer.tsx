"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone, Send, Calendar, ArrowRight } from "lucide-react";
import { SITE_FULL_NAME } from "@/lib/constants";

const recentEvents = [
  { title: "Dîner Gala Annuel", date: "15 Juin 2026", href: "/evenements" },
  { title: "Tournoi Inter-Promotions", date: "20 Juil. 2026", href: "/evenements" },
  { title: "Forum Mentorat", date: "10 Août 2026", href: "/evenements" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-green-dark text-white">
      {/* Newsletter banner */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-1">
                Restez informé
              </h3>
              <p className="text-white/50 text-sm">
                Recevez les actualités et événements de la 2ALHB
              </p>
            </div>
            {subscribed ? (
              <p className="text-orange font-medium text-sm">
                ✓ Merci pour votre inscription !
              </p>
            ) : (
              <form onSubmit={handleNewsletter} className="flex w-full lg:w-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  required
                  className="flex-1 lg:w-72 px-4 py-3 rounded-l-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm outline-none focus:border-orange transition-colors"
                />
                <button
                  type="submit"
                  className="bg-orange px-5 py-3 rounded-r-xl font-medium text-sm hover:bg-orange-dark transition-colors flex items-center gap-2"
                >
                  <Send size={16} />
                  <span className="hidden sm:inline">S&apos;inscrire</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"
                alt="2ALHB"
                width={44}
                height={44}
                className="rounded-full"
              />
              <span className="text-xl font-bold">
                <span className="text-orange">2A</span>LHB
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-5">
              {SITE_FULL_NAME} — L&apos;empreinte de l&apos;excellence et de la fraternité.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com/2alhb"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-orange transition-colors"
                aria-label="Facebook"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a
                href="https://linkedin.com/company/2alhb"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-orange transition-colors"
                aria-label="LinkedIn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a
                href="mailto:contact@2alhb.ci"
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-orange transition-colors"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold mb-4">L&apos;Association</h3>
            <ul className="space-y-2.5 text-white/50 text-sm">
              <li><Link href="/association/presentation" className="hover:text-orange transition-colors">Présentation</Link></li>
              <li><Link href="/association/bureau" className="hover:text-orange transition-colors">Le Bureau</Link></li>
              <li><Link href="/association/adhesion" className="hover:text-orange transition-colors">Adhésion</Link></li>
              <li><Link href="/association/statuts" className="hover:text-orange transition-colors">Statuts</Link></li>
              <li><Link href="/association/reglement" className="hover:text-orange transition-colors">Règlement</Link></li>
            </ul>
          </div>

          {/* Recent events */}
          <div>
            <h3 className="font-bold mb-4">Prochains événements</h3>
            <ul className="space-y-3">
              {recentEvents.map((event) => (
                <li key={event.title}>
                  <Link href={event.href} className="group flex items-start gap-3">
                    <Calendar size={14} className="text-orange mt-0.5 shrink-0" />
                    <div>
                      <span className="text-sm text-white/70 group-hover:text-orange transition-colors block leading-tight">
                        {event.title}
                      </span>
                      <span className="text-xs text-white/40">{event.date}</span>
                    </div>
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/evenements" className="flex items-center gap-1 text-orange text-xs font-medium hover:gap-2 transition-all">
                  Voir tout <ArrowRight size={12} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <ul className="space-y-3 text-white/50 text-sm">
              <li className="flex items-start gap-3">
                <Mail size={14} className="text-orange mt-0.5 shrink-0" />
                <span>contact@2alhb.ci</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={14} className="text-orange mt-0.5 shrink-0" />
                <span>+225 07 00 00 00 00</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={14} className="text-orange mt-0.5 shrink-0" />
                <span>Lycée Houphouët-Boigny<br />Korhogo — Côte d&apos;Ivoire</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} 2ALHB. Tous droits réservés.
          </p>
          <p className="text-white/25 text-xs">
            Association apolitique, laïque et non confessionnelle
          </p>
        </div>
      </div>
    </footer>
  );
}
