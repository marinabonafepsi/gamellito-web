"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const DiarioCTA = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border-2 border-primary/30 bg-primary/5 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8"
        >
          {/* Ícone */}
          <div className="shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-primary/10 flex items-center justify-center text-6xl md:text-7xl">
            📒
          </div>

          {/* Texto */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
              Diário do Gamellito
            </h2>
            <p className="text-base text-muted-foreground font-body mb-6 max-w-lg">
              Registre os valores de glicemia do seu filho em segundos e chegue
              organizado à próxima consulta. Um caderno digital simples, feito
              para o dia a dia da família.
            </p>
            <Link
              href="/diario"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-display font-bold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Abrir o Diário →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DiarioCTA;
