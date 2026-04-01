"use client";

import { motion } from "framer-motion";
import { Smartphone, BookOpen, Puzzle, ChefHat } from "@/components/icons";
import { AssetImage, siteAssets } from "@/components/SiteAssets";

const games = [
  {
    icon: Smartphone,
    title: "Gamellito Adventures",
    description:
      "Jogo para celular e tablet onde as crianças cuidam do Gamellito, aprendendo contagem de carboidratos, insulinoterapia e monitoramento de glicose.",
    tag: "Mobile Game",
    color: "bg-primary",
  },
  {
    icon: Puzzle,
    title: "Jogo de Tabuleiro",
    description:
      "Versão física que promove interação em grupo, ideal para oficinas educativas em hospitais e escolas.",
    tag: "Board Game",
    color: "bg-gamellito-green",
  },
  {
    icon: BookOpen,
    title: "Livros Ilustrados",
    description:
      '"Enfrentando o Diabetes Tipo 1" — série de livros infantis com as aventuras do Gamellito, com ilustrações de Roger Cartoons.',
    tag: "Livros",
    color: "bg-gamellito-blue",
  },
  {
    icon: ChefHat,
    title: "Oficinas Culinárias",
    description:
      "Atividades práticas onde crianças aprendem sobre alimentação saudável e contagem de carboidratos de forma divertida.",
    tag: "Oficinas",
    color: "bg-gamellito-pink",
  },
];

const GamesSection = () => {
  return (
    <section id="jogos" className="py-24 bg-gamellito-space relative overflow-hidden">
      {/* Stars - valores determinísticos por índice para evitar hydration mismatch */}
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
            🎮 Nossos <span className="text-primary">Jogos & Soluções</span>
          </h2>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto font-body mb-6">
            De jogos digitais a livros e oficinas — todo um ecossistema lúdico
            para educação em saúde.
          </p>
          <a
            href="/jogos/experimente"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-display font-bold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            🎮 Experimente um jogo
          </a>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Game mockup + asset controle videogame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-6"
          >
            <img
              src={siteAssets.controleVideogame}
              alt="Controle de videogame - jogos Gamellito"
              className="w-32 md:w-40 h-auto opacity-90"
            />
            <AssetImage
              asset="gamellitoContente"
              alt="Gamellito — mascote do jogo Gamellito Adventures"
              className="w-64 md:w-80 h-auto drop-shadow-2xl animate-float"
            />
          </motion.div>

          {/* Game cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {games.map((game, i) => (
              <motion.div
                key={game.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-5 border border-primary-foreground/10 hover:border-primary/40 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl ${game.color} flex items-center justify-center`}
                  >
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
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GamesSection;
