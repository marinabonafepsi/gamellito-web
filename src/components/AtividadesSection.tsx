"use client";

import { motion } from "framer-motion";
import { AssetImage } from "@/components/SiteAssets";
import { PersonagemAnimado } from "@/components/PersonagemAnimado";

const passos = [
  {
    numero: "01",
    asset: "gamellitoCorpinho" as const,
    titulo: "A criança joga",
    descricao:
      "Através de jogos e dinâmicas lúdicas, a criança aprende sobre o manejo do diabetes de forma divertida e sem medo.",
  },
  {
    numero: "02",
    asset: "bicicleta" as const,
    titulo: "Pratica o autocuidado",
    descricao:
      "Cada atividade reforça hábitos reais: alimentação, monitoramento da glicose e prática de exercícios no dia a dia.",
    animado: true,
  },
  {
    numero: "03",
    asset: "gamellitoEAmigos" as const,
    titulo: "Compartilha com a família",
    descricao:
      "O aprendizado se expande para toda a família e equipe de saúde, criando uma rede de apoio forte e duradoura.",
  },
];

const AtividadesSection = () => {
  return (
    <section
      id="como-funciona"
      data-track-section="como-funciona"
      className="py-24 bg-background"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary font-body font-semibold text-sm uppercase tracking-wider mb-3">
            Como funciona
          </p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Do jogo ao{" "}
            <span className="text-primary">autocuidado real</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
            O método Gamellito transforma cada atividade em um passo concreto
            rumo à autonomia da criança com DM1.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10">
          {passos.map((passo, i) => (
            <motion.div
              key={passo.numero}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-6 relative">
                <span className="absolute -top-3 -left-4 text-6xl font-display font-bold text-primary/10 select-none">
                  {passo.numero}
                </span>
                {passo.animado ? (
                  <PersonagemAnimado>
                    <AssetImage
                      asset={passo.asset}
                      alt={passo.titulo}
                      className="w-36 h-auto"
                      width={144}
                      height={120}
                    />
                  </PersonagemAnimado>
                ) : (
                  <AssetImage
                    asset={passo.asset}
                    alt={passo.titulo}
                    className="w-36 h-auto"
                    width={144}
                    height={120}
                  />
                )}
              </div>
              <h3 className="font-display font-bold text-xl text-foreground mb-3">
                {passo.titulo}
              </h3>
              <p className="text-muted-foreground font-body leading-relaxed text-sm">
                {passo.descricao}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AtividadesSection;
