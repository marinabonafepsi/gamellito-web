"use client";

import { motion } from "framer-motion";
import { Trophy } from "@/components/icons";
import { AssetImage } from "@/components/SiteAssets";

const awards = [
  {
    year: "2017",
    title: "Games for Health",
    location: "Utah, USA",
    detail: "Melhor game de Doenças Crônicas",
  },
  {
    year: "2019",
    title: "Diabetes Challenge",
    location: "São Paulo, Brasil",
    detail: "Destaque em inovação",
  },
  {
    year: "2021",
    title: "Games for Change",
    location: "América Latina",
    detail: "Impacto social através de jogos",
  },
];

const AwardsSection = () => {
  return (
    <section id="premios" className="py-24 bg-gamellito-space relative overflow-hidden">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-gamellito-yellow animate-twinkle"
          style={{
            top: `${((i * 29 + 7) % 97) + 1}%`,
            left: `${((i * 37 + 59) % 97) + 1}%`,
            animationDelay: `${((i * 71) % 280) / 100 + 0.2}s`,
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
            Prêmios <span className="text-gamellito-yellow">Internacionais</span>
          </h2>
          <p className="text-lg text-primary-foreground/90 max-w-xl mx-auto font-body mb-6">
            Reconhecido mundialmente por sua contribuição à educação em saúde
            através de jogos.
          </p>
          <AssetImage
            asset="gamellitoEAmigos"
            alt="Gamellito e amigos — conquistas e parcerias"
            className="w-40 h-auto mx-auto opacity-90"
            width={160}
            height={100}
          />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {awards.map((award, i) => (
            <motion.div
              key={award.year}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-full bg-gamellito-yellow/20 flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-gamellito-yellow" />
              </div>
              <div className="font-display text-3xl font-bold text-primary mb-2">
                {award.year}
              </div>
              <h3 className="font-display font-bold text-xl text-primary-foreground mb-1">
                {award.title}
              </h3>
              <p className="text-sm text-primary-foreground/90 font-body mb-1">
                {award.location}
              </p>
              <p className="text-xs text-gamellito-yellow font-body font-semibold">
                {award.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AwardsSection;
