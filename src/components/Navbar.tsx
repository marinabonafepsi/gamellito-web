"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "@/components/icons";
import { track } from "@/lib/analytics";
import { createClient } from "@/lib/supabase/client";
import UserMenu from "@/components/UserMenu";
import CoinsButton from "@/components/CoinsButton";

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
      <div className="relative container mx-auto px-6 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3 min-w-0" onClick={() => handleNavClick("Logo", "/")} title="Voltar para home">
          <img src="/characters/gamellito-logo.svg" alt="Gamellito" className="h-14 w-14 object-contain flex-shrink-0" />
          <div className="flex flex-col gap-0 min-w-0">
            <span className="font-display text-2xl font-bold text-gamellito-orange leading-tight">Gamellito</span>
            <span className="font-body text-xs font-bold text-white leading-tight">Ltda.</span>
          </div>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => handleNavClick(link.label, link.href)}
              className="gm-btn gm-btn--nav gm-btn--md"
            >
              {link.label}
            </a>
          ))}
          {loggedIn ? (
            <div className="flex items-center gap-3">
              <CoinsButton />
              <UserMenu />
            </div>
          ) : (
            <a
              href="/diario/login"
              onClick={() => handleNavClick("Login", "/diario/login")}
              className="gm-btn gm-btn--primary gm-btn--md"
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
                <div className="flex items-center gap-3 mb-1">
                  <UserMenu />
                  <span className="font-body text-sm font-semibold text-primary-foreground/80">Minha conta</span>
                </div>
              ) : (
                <a
                  href="/diario/login"
                  onClick={() => handleNavClick("Login", "/diario/login")}
                  className="ds-btn w-full justify-center"
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
