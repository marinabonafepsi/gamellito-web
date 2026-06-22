"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "@/components/icons";
import { track } from "@/lib/analytics";
import { createClient } from "@/lib/supabase/client";

const navLinks = [
  { label: "Início",        href: "/#inicio" },
  { label: "Sobre",         href: "/#sobre" },
  { label: "Ecossistema",   href: "/para-familias" },
  { label: "Contato",       href: "/#contato" },
  { label: "Loja",          href: "/loja" },
];

const Navbar = () => {
  const [isOpen,    setIsOpen]    = useState(false);
  const [loggedIn,  setLoggedIn]  = useState(false);

  useEffect(() => {
    const client = createClient();
    client.auth.getUser().then(({ data }) => setLoggedIn(!!data.user));
    const { data: { subscription } } = client.auth.onAuthStateChange((_, session) => {
      setLoggedIn(!!session?.user);
    });
    return () => subscription.unsubscribe();
  }, []);

  function handleNavClick(label: string, href: string) {
    track("nav_click", window.location.pathname, { label, href });
    setIsOpen(false);
  }

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
        <a href="/" className="flex items-center gap-4 min-w-0" onClick={() => handleNavClick("Logo", "/")}>
          <img src="/characters/gamellito-logo.svg" alt="Gamellito" className="w-20 h-20 object-contain flex-shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="font-display text-4xl font-bold text-primary leading-tight break-words">
              Gamellito
            </span>
            <span className="font-body text-base font-semibold text-primary/90">
              LTDA
            </span>
          </div>
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
          {loggedIn ? (
            <a
              href="/diario"
              onClick={() => handleNavClick("Diário", "/diario")}
              className="inline-flex items-center px-5 py-2 rounded-full bg-primary text-white font-body font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              📖 Diário
            </a>
          ) : (
            <a
              href="/diario/login"
              onClick={() => handleNavClick("Login", "/diario/login")}
              className="inline-flex items-center px-5 py-2 rounded-full bg-primary text-white font-body font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              Login
            </a>
          )}
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
              {loggedIn ? (
                <a
                  href="/diario"
                  onClick={() => handleNavClick("Diário", "/diario")}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-primary text-white font-body font-semibold text-sm hover:bg-primary/90 transition-colors mb-1"
                >
                  📖 Voltar ao Diário
                </a>
              ) : (
                <a
                  href="/diario/login"
                  onClick={() => handleNavClick("Login", "/diario/login")}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-primary text-white font-body font-semibold text-sm hover:bg-primary/90 transition-colors mb-1"
                >
                  Login
                </a>
              )}
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
