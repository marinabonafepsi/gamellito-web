"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "@/components/icons";
import { siteAssets } from "@/components/SiteAssets";
import { track } from "@/lib/analytics";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const navLinks = [
  { label: "Início",        href: "/#inicio" },
  { label: "Sobre",         href: "/#sobre" },
  { label: "Para Famílias", href: "/para-familias" },
  { label: "Contato",       href: "/#contato" },
  { label: "Loja",          href: "/loja" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);

  function handleNavClick(label: string, href: string) {
    track("nav_click", window.location.pathname, { label, href });
    setIsOpen(false);
  }

  const authButton = user ? (
    <a
      href="/diario"
      onClick={() => handleNavClick("Diário", "/diario")}
      className="font-body font-bold py-2.5 px-5 rounded-full text-center bg-gamellito-yellow text-gamellito-space border-2 border-gamellito-space shadow-[3px_3px_0_#2B2233] text-sm"
    >
      Diário
    </a>
  ) : (
    <a
      href="/diario/login"
      onClick={() => handleNavClick("Login", "/diario/login")}
      className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-primary text-white font-body font-semibold text-sm hover:bg-primary/90 transition-colors"
    >
      Login
    </a>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gamellito-space/95 backdrop-blur-md border-b border-gamellito-purple/30">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2" onClick={() => handleNavClick("Logo", "/")}>
          <img src={siteAssets.gamellitoFelizMaoNaBarriga} alt="Gamellito" className="w-10 h-10 object-contain" />
          <span className="font-display text-2xl font-bold text-primary">
            Gamellito
          </span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => handleNavClick(link.label, link.href)}
              className="font-body text-sm font-semibold text-primary-foreground/95 hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
          {authButton}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-primary-foreground"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-gamellito-space/98 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {authButton}
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => handleNavClick(link.label, link.href)}
                  className="font-body text-base font-semibold text-primary-foreground/95 hover:text-primary transition-colors py-2"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
