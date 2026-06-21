"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "@/components/icons";
import { track } from "@/lib/analytics";
import { createClient } from "@/lib/supabase/client";

const navLinks = [
  { label: "Início",        href: "/#inicio" },
  { label: "Sobre",         href: "/#sobre" },
  { label: "Para Famílias", href: "/para-familias" },
  { label: "Contato",       href: "/#contato" },
  { label: "Loja",          href: "/loja" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  function handleNavClick(label: string, href: string) {
    track("nav_click", window.location.pathname, { label, href });
    setIsOpen(false);
  }

  const ctaHref = isLoggedIn ? "/diario" : "/diario/login";
  const ctaLabel = isLoggedIn ? "Diário" : "Login";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 overflow-hidden">
      {/* Navbar background SVG */}
      <img
        src="/characters/gamellito-navbar-bg.svg"
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover object-left"
      />
      <div className="relative container mx-auto px-4 py-2 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3" onClick={() => handleNavClick("Logo", "/")}>
          <img src="/characters/gamellito-logo.svg" alt="Gamellito" className="w-14 h-14 object-contain" />
          <span className="font-display text-3xl font-bold text-primary">
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
              {link.label === "Loja" ? "🛍️ Loja" : link.label}
            </a>
          ))}
          <a
            href={ctaHref}
            onClick={() => handleNavClick(ctaLabel, ctaHref)}
            className="inline-flex items-center px-6 py-2.5 rounded-full font-display font-bold text-sm text-white transition-all duration-100 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
            style={{
              background: "#F26A00",
              border: "3px solid #2B2233",
              boxShadow: "4px 4px 0 #2B2233",
            }}
          >
            {ctaLabel}
          </a>
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
            className="md:hidden overflow-hidden" style={{ background: "#6F567E" }}
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              <a
                href={ctaHref}
                onClick={() => handleNavClick(ctaLabel, ctaHref)}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full font-display font-bold text-sm text-white mb-1 transition-all duration-100 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
                style={{
                  background: "#F26A00",
                  border: "3px solid #2B2233",
                  boxShadow: "4px 4px 0 #2B2233",
                }}
              >
                {ctaLabel}
              </a>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => handleNavClick(link.label, link.href)}
                  className="font-body text-base font-semibold text-primary-foreground/95 hover:text-primary transition-colors py-2"
                >
                  {link.label === "Loja" ? "🛍️ Loja" : link.label}
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
