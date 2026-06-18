"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "@/components/icons";
import { siteAssets } from "@/components/SiteAssets";
import { track } from "@/lib/analytics";

const navLinks = [
  { label: "Início",        href: "/#inicio" },
  { label: "Sobre",         href: "/#sobre" },
  { label: "Soluções",      href: "/#solucoes" },
  { label: "Para Famílias", href: "/para-familias" },
  { label: "Loja",          href: "/loja" },
  { label: "Prêmios",       href: "/#premios" },
  { label: "Parceiros",     href: "/#parceiros" },
  { label: "Contato",       href: "/#contato" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  function handleNavClick(label: string, href: string) {
    track("nav_click", window.location.pathname, { label, href });
    setIsOpen(false);
  }

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
              className={`font-body text-sm font-semibold transition-colors ${
                link.label === "Loja"
                  ? "text-gamellito-orange hover:text-gamellito-orange/80"
                  : "text-primary-foreground/95 hover:text-primary"
              }`}
            >
              {link.label}
            </a>
          ))}
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
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => handleNavClick(link.label, link.href)}
                  className={`font-body text-base font-semibold transition-colors py-2 ${
                    link.label === "Loja"
                      ? "text-gamellito-orange"
                      : "text-primary-foreground/95 hover:text-primary"
                  }`}
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
