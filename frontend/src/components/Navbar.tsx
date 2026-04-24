"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Sun, Moon } from "lucide-react";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import type { NavItem } from "@/lib/constants";
import { useTheme } from "./ThemeProvider";

function DesktopDropdown({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(null);

  const handleEnter = () => {
    if (timeout.current) clearTimeout(timeout.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeout.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        className="flex items-center gap-1 text-sm font-medium text-foreground dark:text-gray-200 hover:text-orange transition-colors py-2"
        onClick={() => setOpen(!open)}
      >
        {item.label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && item.children && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-64 sm:w-72 bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-gray-100 dark:border-dark-border overflow-hidden z-50"
          >
            <div className="p-2">
              {item.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 rounded-xl hover:bg-orange/5 transition-colors group"
                >
                  <span className="text-sm font-semibold text-green dark:text-green-light group-hover:text-orange transition-colors">
                    {child.label}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                    {child.description}
                  </p>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileDropdown({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-foreground font-medium hover:text-orange transition-colors"
      >
        {item.label}
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && item.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pl-4 pt-2 space-y-2">
              {item.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={onClose}
                  className="block py-2"
                >
                  <span className="text-sm font-semibold text-green">{child.label}</span>
                  <p className="text-xs text-gray-500">{child.description}</p>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Track active section
      const sections = ["about", "testimonials", "events", "register", "contact"];
      let current = "";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) current = `#${id}`;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-dark-bg/95 backdrop-blur-md shadow-lg"
          : "bg-white dark:bg-dark-bg shadow-sm dark:shadow-none dark:border-b dark:border-dark-border"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt={SITE_NAME}
              width={56}
              height={56}
              className="rounded-full group-hover:scale-105 transition-transform sm:w-[70px] sm:h-[70px]"
            />
            <div>
              <span className="text-xl font-bold tracking-tight">
                <span className="text-orange">2A</span>
                <span className="text-green">LHB</span>
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <DesktopDropdown key={link.label} item={link} />
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors py-2 ${
                    activeSection === link.href
                      ? "text-orange"
                      : "text-foreground dark:text-gray-200 hover:text-orange"
                  }`}
                >
                  {link.label}
                  {activeSection === link.href && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-orange rounded-full"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              )
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
              aria-label="Changer de thème"
            >
              {theme === "dark" ? (
                <Sun size={18} className="text-orange" />
              ) : (
                <Moon size={18} className="text-foreground" />
              )}
            </button>
            <Link
              href="#register"
              className="bg-orange text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-orange-dark transition-all hover:shadow-lg hover:scale-105"
            >
              Rejoindre
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
            aria-label="Menu"
          >
            {isOpen ? (
              <X className="text-foreground dark:text-gray-200" size={24} />
            ) : (
              <Menu className="text-foreground dark:text-gray-200" size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-dark-card shadow-lg border-t border-gray-100 dark:border-dark-border overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <MobileDropdown
                    key={link.label}
                    item={link}
                    onClose={() => setIsOpen(false)}
                  />
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-foreground dark:text-gray-200 font-medium hover:text-orange transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
              <Link
                href="#register"
                onClick={() => setIsOpen(false)}
                className="block bg-orange text-white text-center px-5 py-3 rounded-full font-semibold hover:bg-orange-dark transition-colors"
              >
                Rejoindre
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
