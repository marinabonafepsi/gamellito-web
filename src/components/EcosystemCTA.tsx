"use client";

import { motion } from "framer-motion";
import { GamButton } from "@/components/ds";
import { PersonagemAnimado } from "@/components/PersonagemAnimado";
import { AssetImage } from "@/components/SiteAssets";
import { track } from "@/lib/analytics";

const EcosystemCTA = () => {
  return (
    <section
      id="solucoes"
      data-track-section="ecosystem-cta"
      className="py-24 bg-background px-4"
    >
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-8"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Conheça nosso{" "}
              <span className="text-primary">ecossistema</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
              Jogos educativos, livros, pelúcias e muito mais — tudo criado com amor para tornar o cuidado com a saúde uma aventura.
            </p>
          </div>

          <PersonagemAnimado>
            <AssetImage
              asset="gamellitoContente"
              alt="Gamellito feliz"
              className="w-48 h-auto mx-auto"
              width={192}
              height={192}
            />
          </PersonagemAnimado>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <GamButton
              href="/#jogos"
              variant="primary"
              size="lg"
              onClick={() =>
                track("ecosystem_cta_click", window.location.pathname, {
                  target: "jogos",
                })
              }
            >
              Ver jogos
            </GamButton>
            <GamButton
              href="/loja"
              variant="sun"
              size="lg"
              onClick={() =>
                track("ecosystem_cta_click", window.location.pathname, {
                  target: "loja",
                })
              }
            >
              Ir para a loja
            </GamButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default EcosystemCTA;
