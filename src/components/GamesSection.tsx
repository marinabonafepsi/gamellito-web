"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "@/components/icons";
import { AssetImage, siteAssets } from "@/components/SiteAssets";
import { track } from "@/lib/analytics";

type GameStatus = "disponivel" | "em-breve";

interface GameItem {
  id: string;
  title: string;
  description: string;
  tag: string;
  tagColor: string;
  asset: keyof typeof siteAssets;
  status: GameStatus;
  cta?: string;
  ctaHref?: string;
}

const games: GameItem[] = [
  {
    id: "sherlockito",
    title: "Sherlockito",
    description:
      "O detetive do diabetes. A criança resolve mistérios investigando pistas sobre glicemia, alimentação e insulina. Gratuito, roda direto no navegador.",
    tag: "Disponível agora",
    tagColor: "bg-gamellito-health-green",
    asset: "controleVideogame",
    status: "disponivel",
    cta: "Jogar grátis",
    ctaHref: "/jogar",
  },
  {
    id: "jogo-geladeira",
    title: "Jogo da Geladeira",
    description:
      "Monte o prato do Gamellito sem estourar a meta de carboidratos. Mini-jogo rápido de contagem — educativo e viciante.",
    tag: "Disponível agora",
    tagColor: "bg-gamellito-health-green",
    asset: "geladeira",
    status: "disponivel",
    cta: "Jogar agora",
    ctaHref: "/#jogos",
  },
  {
    id: "jogo-tabuleiro",
    title: "Jogo de Tabuleiro",
    description:
      "Versão física para grupos — ideal para oficinas em hospitais e escolas. Promove cooperação e educação sobre DM1.",
    tag: "Em desenvolvimento",
    tagColor: "bg-gamellito-orange",
    asset: "gamellitoFurioso",
    status: "em-breve",
  },
  {
    id: "livros",
    title: "Livros Ilustrados",
    description:
      '"Enfrentando o Diabetes Tipo 1" — série infantil com as aventuras do Gamellito, ilustrações de Roger Cartoons.',
    tag: "Em desenvolvimento",
    tagColor: "bg-gamellito-blue",
    asset: "gamellitoEAmigos",
    status: "em-breve",
  },
];

/* ── Modal fake door ── */
function FakeDoorModal({ item, onClose }: { item: GameItem; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gamellito-space/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-md bg-card rounded-3xl p-8 shadow-2xl border-2 border-gamellito-hospital-purple/25"
        initial={{ scale: 0.88, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", damping: 22, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X size={20} />
        </button>
        <div className="flex justify-center mb-4">
          <AssetImage asset={item.asset} alt={item.title} className="w-20 h-auto" width={80} height={80} />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground text-center mb-2">
          {item.title}
        </h2>
        <p className="font-body text-muted-foreground text-center text-sm leading-relaxed mb-6">
          Este produto está em desenvolvimento! Seu interesse nos ajuda a priorizar o que lançar primeiro.
        </p>
        <div className="flex flex-col gap-3">
          <a
            href={`mailto:gamellitoltda@gmail.com?subject=Tenho interesse: ${item.title}`}
            className="w-full text-center px-6 py-3 bg-primary text-primary-foreground font-display font-bold rounded-full hover:bg-primary/90 transition-colors"
            onClick={onClose}
          >
            Me avise quando lançar
          </a>
          <button type="button" onClick={onClose} className="w-full px-6 py-3 border border-border text-foreground font-body rounded-full hover:bg-muted transition-colors">
            Voltar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

const GamesSection = () => {
  const [activeModal, setActiveModal] = useState<GameItem | null>(null);

  async function handleGameClick(game: GameItem) {
    await track("game_interest", window.location.pathname, {
      game: game.title,
      tag: game.tag,
      status: game.status,
    });
    if (game.status === "em-breve") {
      setActiveModal(game);
    }
  }

  return (
    <>
      <AnimatePresence>
        {activeModal && (
          <FakeDoorModal item={activeModal} onClose={() => setActiveModal(null)} />
        )}
      </AnimatePresence>

      <section
        id="jogos"
        data-track-section="jogos"
        className="py-24 bg-gamellito-space relative overflow-hidden"
      >
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gamellito-yellow animate-twinkle"
            style={{
              top: `${((i * 19 + 41) % 97) + 1}%`,
              left: `${((i * 23 + 53) % 97) + 1}%`,
              animationDelay: `${((i * 61) % 280) / 100 + 0.2}s`,
            }}
          />
        ))}

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
              Nosso <span className="text-primary">ecossistema de jogos</span>
            </h2>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto font-body">
              Dois jogos disponíveis hoje. Mais chegando — cada um financiado pelo interesse de vocês.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {games.map((game, i) => {
              const isDisponivel = game.status === "disponivel";
              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className={`rounded-2xl p-5 border flex flex-col ${
                    isDisponivel
                      ? "bg-primary-foreground/10 backdrop-blur-sm border-gamellito-health-green/40"
                      : "bg-primary-foreground/5 backdrop-blur-sm border-primary-foreground/10 opacity-80"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className={`text-xs font-body font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                        isDisponivel
                          ? "bg-gamellito-health-green/20 text-gamellito-health-green"
                          : "bg-gamellito-orange/20 text-gamellito-orange"
                      }`}
                    >
                      {game.tag}
                    </span>
                  </div>

                  <div className="flex justify-center my-3">
                    <AssetImage
                      asset={game.asset}
                      alt={game.title}
                      className={`w-16 h-16 object-contain ${isDisponivel ? "" : "opacity-60"}`}
                      width={64}
                      height={64}
                    />
                  </div>

                  <h3 className="font-display font-bold text-primary-foreground text-lg mb-2">
                    {game.title}
                  </h3>
                  <p className="text-sm text-primary-foreground/80 font-body leading-relaxed flex-1">
                    {game.description}
                  </p>

                  <div className="mt-4">
                    {isDisponivel ? (
                      <a
                        href={game.ctaHref}
                        className="inline-block w-full text-center px-4 py-2 rounded-full bg-gamellito-health-green text-white font-display font-bold text-sm hover:bg-gamellito-health-green/90 transition-colors"
                        onClick={() => track("game_play_click", window.location.pathname, { game: game.id })}
                      >
                        {game.cta}
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleGameClick(game)}
                        className="inline-block w-full text-center px-4 py-2 rounded-full border border-primary-foreground/20 text-primary-foreground/70 font-body text-sm hover:border-primary/40 hover:text-primary transition-colors"
                      >
                        Tenho interesse →
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <a
              href="/loja"
              className="inline-flex items-center gap-2 font-body text-primary-foreground/70 hover:text-primary transition-colors text-sm"
            >
              Ver todos os produtos →
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default GamesSection;
