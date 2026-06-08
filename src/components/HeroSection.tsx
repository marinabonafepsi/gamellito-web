"use client";

import { motion } from "framer-motion";
import { PersonagemAnimado } from "@/components/PersonagemAnimado";

const HeroSection = () => {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/hero-space-bg.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gamellito-space/40" />
      </div>

      {/* Floating stars - valores determinísticos por índice para evitar hydration mismatch */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-gamellito-yellow animate-twinkle"
          style={{
            top: `${((i * 17 + 23) % 97) + 1}%`,
            left: `${((i * 31 + 47) % 97) + 1}%`,
            animationDelay: `${((i * 47) % 280) / 100 + 0.2}s`,
            width: `${2 + (i * 13) % 3}px`,
            height: `${2 + (i * 11) % 3}px`,
          }}
        />
      ))}

      <div className="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center lg:text-left"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-gamellito-orange font-body font-semibold text-sm uppercase tracking-wider mb-3"
          >
            Educação em saúde lúdica
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-6xl font-display font-bold text-primary-foreground mb-4 leading-tight"
          >
            Cuidar do diabetes pode{" "}
            <span className="text-primary">começar com um sorriso.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative max-w-xl mb-8 rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gamellito-hospital-purple/90" aria-hidden />
            <motion.p
              className="relative z-10 px-5 py-4 text-lg md:text-xl text-primary-foreground font-body"
              style={{ opacity: 1 }}
            >
              Educação em saúde lúdica que transforma o cuidado de crianças,
              adolescentes e famílias que convivem com o diabetes.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <a
              href="#solucoes"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary text-primary-foreground font-display font-bold text-lg hover:opacity-90 transition-opacity animate-pulse-glow"
            >
              🎮 Conheça os programas
            </a>
            <a
              href="#parceria"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full border-2 border-primary-foreground bg-primary-foreground/20 backdrop-blur-md text-primary-foreground font-display font-semibold text-lg hover:bg-primary-foreground/30 transition-colors shadow-[0_0_0_1px_rgba(255,255,255,0.2)]"
            >
              🤝 Seja um parceiro
            </a>
          </motion.div>
        </motion.div>

        {/* Gamellito contente — personagem único com animação de flutuação */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
          className="flex-shrink-0"
        >
          <PersonagemAnimado className="p-0">
            <img
              src="/assets/gamellito-contente.svg"
              alt="Gamellito — mascote"
              className="w-48 md:w-64 lg:w-80 h-auto drop-shadow-2xl max-w-full"
              width={320}
              height={400}
              decoding="async"
              suppressHydrationWarning
            />
          </PersonagemAnimado>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 rounded-full border-2 border-primary-foreground/40 flex items-start justify-center p-1"
        >
          <div className="w-1.5 h-3 rounded-full bg-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
