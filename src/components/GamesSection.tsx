"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, BookOpen, Puzzle, ChefHat, X } from "@/components/icons";
import { siteAssets } from "@/components/SiteAssets";
import { GamellitoSprite } from "@/components/GamellitoSprite";
import { track } from "@/lib/analytics";

const games = [
  {
    icon: Smartphone,
    title: "Gamellito Adventures",
    description: "Jogo para celular e tablet onde as crianças cuidam do Gamellito, aprendendo contagem de carboidratos, insulinoterapia e monitoramento de glicose.",
    tag: "Mobile Game",
    color: "bg-primary",
    emoji: "📱",
  },
  {
    icon: Puzzle,
    title: "Jogo de Tabuleiro",
    description: "Versão física que promove interação em grupo, ideal para oficinas educativas em hospitais e escolas.",
    tag: "Board Game",
    color: "bg-gamellito-green",
    emoji: "🎲",
  },
  {
    icon: BookOpen,
    title: "Livros Ilustrados",
    description: '"Enfrentando o Diabetes Tipo 1" — série de livros infantis com as aventuras do Gamellito, ilustrações de Roger Cartoons.',
    tag: "Livros",
    color: "bg-gamellito-blue",
    emoji: "📚",
  },
  {
    icon: ChefHat,
    title: "Oficinas Culinárias",
    description: "Atividades práticas onde crianças aprendem sobre alimentação saudável e contagem de carboidratos de forma divertida.",
    tag: "Oficinas",
    color: "bg-gamellito-pink",
    emoji: "🍳",
  },
];

/* ── Modal fake door ── */
function FakeDoorModal({ item, onClose }: { item: typeof games[0]; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gamellito-space/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-md bg-card rounded-3xl p-8 shadow-2xl border-2 border-gamellito-hospital-purple/30"
        initial={{ scale: 0.88, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", damping: 22, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X size={20} />
        </button>
        <div className="text-5xl text-center mb-4">{item.emoji}</div>
        <h2 className="font-display text-2xl font-bold text-foreground text-center mb-2">
          {item.title}
        </h2>
        <p className="font-body text-muted-foreground text-center text-sm leading-relaxed mb-6">
          Este conteúdo está em desenvolvimento! Seu interesse nos ajuda a
          priorizar o que lançar primeiro. 🚀
        </p>
        <div className="flex flex-col gap-3">
          <a
            href="mailto:gamellitoltda@gmail.com?subject=Tenho interesse: {{ item.title }}"
            className="w-full text-center px-6 py-3 bg-primary text-primary-foreground font-body font-semibold rounded-full hover:bg-primary/90 transition-colors"
            onClick={onClose}
          >
            Me avise quando lançar
          </a>
          <button type="button" onClick={onClose} className="w-full px-6 py-3 border border-border text-foreground font-body rounded-full hover:border-primary/40 transition-colors">
            Voltar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

const GamesSection = () => {
  const [activeModal, setActiveModal] = useState<typeof games[0] | null>(null);

  async function handleGameClick(game: typeof games[0]) {
    await track("game_interest", window.location.pathname, {
      game: game.title,
      tag: game.tag,
    });
    setActiveModal(game);
  }

  async function handlePlayClick() {
    await track("play_button", window.location.pathname, { source: "games_section_cta" });
    setActiveModal(games[0]);
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
              Nossos <span className="text-primary">Jogos & Soluções</span>
            </h2>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto font-body mb-6">
              De jogos digitais a livros e oficinas — todo um ecossistema lúdico
              para educação em saúde.
            </p>
            <button
              type="button"
              onClick={handlePlayClick}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-display font-bold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Experimente um jogo
            </button>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center gap-6"
            >
              <img
                src={siteAssets.controleVideogame}
                alt="Controle de videogame"
                className="w-44 md:w-56 h-auto opacity-90"
              />
              <GamellitoSprite className="drop-shadow-2xl" />
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-4">
              {games.map((game, i) => (
                <motion.button
                  key={game.title}
                  type="button"
                  onClick={() => handleGameClick(game)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="text-left bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-5 border border-primary-foreground/10 hover:border-primary/40 hover:bg-primary-foreground/15 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl ${game.color} flex items-center justify-center`}>
                      <game.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="text-xs font-body font-bold text-primary uppercase tracking-wider">
                      {game.tag}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-primary-foreground text-lg mb-2">
                    {game.title}
                  </h3>
                  <p className="text-sm text-primary-foreground/90 font-body leading-relaxed">
                    {game.description}
                  </p>
                  <span className="inline-block mt-3 text-xs text-primary font-body font-semibold group-hover:underline">
                    Saber mais →
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default GamesSection;
