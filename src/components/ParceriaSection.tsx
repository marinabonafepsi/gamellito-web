"use client";

import { motion } from "framer-motion";
import { AssetImage } from "@/components/SiteAssets";
import { track } from "@/lib/analytics";

const ParceriaSection = () => {
  return (
    <section
      id="parceria"
      data-track-section="parceria"
      className="py-24 bg-gamellito-space relative overflow-hidden"
    >
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-gamellito-yellow animate-twinkle opacity-50"
          style={{
            top: `${((i * 19 + 37) % 95) + 2}%`,
            left: `${((i * 31 + 53) % 95) + 2}%`,
            animationDelay: `${((i * 67) % 280) / 100}s`,
          }}
        />
      ))}

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center gap-12"
        >
          <AssetImage
            asset="medicoMaeGamellito"
            alt="Parceria Gamellito"
            className="w-44 h-auto flex-shrink-0"
            width={176}
            height={130}
          />

          <div>
            <p className="text-gamellito-orange font-body font-semibold text-sm uppercase tracking-wider mb-3">
              🤝 Patrocínio e parceria
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-5 leading-tight">
              Leve o Gamellito mais longe.
            </h2>
            <p className="font-body text-primary-foreground/85 text-lg leading-relaxed mb-4">
              Patrocinar o Gamellito é levar cuidado real a quem mais precisa —
              com método reconhecido internacionalmente e relatório de impacto
              concreto para apresentar.
            </p>
            <ul className="space-y-2 font-body text-primary-foreground/75 text-sm mb-8">
              {[
                "Associe sua marca a um projeto com evidência clínica real",
                "Relatório de impacto personalizado (HbA1c, adesão, alcance)",
                "Visibilidade em escolas, ambulatórios e eventos de saúde",
                "Alinhamento ao ODS 3.4.1 da Agenda 2030 ONU",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:gamellitoltda@gmail.com?subject=Quero conversar sobre parceria com o Gamellito"
                onClick={() => track("nav_click", "/", { label: "parceria_cta", href: "mailto" })}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-body font-semibold rounded-xl hover:bg-primary/90 transition-colors"
              >
                💬 Quero conversar
              </a>
              <a
                href="/parcerias-uel"
                className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-primary-foreground/30 text-primary-foreground font-body font-semibold rounded-xl hover:border-primary transition-colors"
              >
                Ver parceria UEL →
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ParceriaSection;
