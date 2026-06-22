"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { AssetImage } from "@/components/SiteAssets";
import { games, type Game } from "@/lib/games";
import {
  Gamepad2,
  Globe,
  Puzzle,
  FlaskConical,
  Heart,
  Users,
} from "@/components/icons";

/* ═══════════════════════════════════════════════════════
   DADOS
════════════════════════════════════════════════════════ */

const generoLabel: Record<string, string> = {
  aventura: "Aventura digital",
  stealth: "Furtividade",
  encontre: "Encontre o personagem",
  "tower-defense": "Torre de defesa",
  cartas: "Jogo de cartas",
  memoria: "Memória",
  domino: "Dominó",
};

const statusLabel: Record<string, string> = {
  disponivel: "Disponível",
  em_desenvolvimento: "Em desenvolvimento",
  em_pesquisa: "Em pesquisa",
};

const statusColor: Record<string, string> = {
  disponivel: "bg-gamellito-health-green text-white",
  em_desenvolvimento: "bg-gamellito-purple/20 text-gamellito-purple",
  em_pesquisa: "bg-gamellito-yellow/20 text-gamellito-orange",
};

const jogosExternos = [
  {
    nome: "Domelito",
    origem: "UEMS",
    resumo:
      "Dominó educativo sobre hábitos alimentares e controle glicêmico. Desenvolvido para uso em ações de extensão comunitária com crianças e famílias.",
    url: "https://periodicosonline.uems.br/barbaqua/article/view/4391",
    emoji: "🁣",
  },
  {
    nome: "Serious Games DM1",
    origem: "SciELO / pesquisa acadêmica",
    resumo:
      "Jogos sérios construídos especificamente para adolescentes com DM1, abordando adesão ao tratamento e autogestão.",
    url: "https://www.scielo.br/j/ape/a/cFFNhcDFFMmsLLyrJJMLkjC/?lang=pt",
    emoji: "🎓",
  },
];

const universoPersonagens = [
  { emoji: "🥷", nome: "Gamellito", papel: "O protagonista — tem DM1 e não deixa a doença mandar nele" },
  { emoji: "👩", nome: "Mãe", papel: "Sempre por perto — protetora, amorosa e às vezes no caminho errado" },
  { emoji: "👵", nome: "Vó", papel: "No corredor. Sempre. Sem exceção" },
  { emoji: "🐶", nome: "Cachorro", papel: "Farejaaaaaa tudo. O delator mais fofo do universo" },
  { emoji: "🪴", nome: "Vasinho", papel: "Pequeno, quieto, e o maior obstáculo de todos" },
];

/* ═══════════════════════════════════════════════════════
   COMPONENTE: CARD DE JOGO
════════════════════════════════════════════════════════ */

function GameCard({ game, index }: { game: Game; index: number }) {
  const isAvailable = game.status === "disponivel";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-card rounded-2xl border border-border overflow-hidden group hover:border-primary/30 transition-colors flex flex-col"
    >
      <div className="h-1.5 w-full bg-primary opacity-30" />

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-4">
          <span className="text-4xl">{game.emoji}</span>
          <span className={`text-xs font-display px-3 py-1 rounded-full font-semibold ${statusColor[game.status]}`}>
            {statusLabel[game.status]}
          </span>
        </div>

        <span className="text-xs font-body text-muted-foreground uppercase tracking-wider mb-1">
          {generoLabel[game.genero]}
        </span>
        <h3 className="font-display text-xl font-bold text-foreground mb-1">{game.nome}</h3>
        <p className="font-body text-sm text-gamellito-orange font-semibold mb-3 italic">
          &ldquo;{game.tagline}&rdquo;
        </p>
        <p className="font-body text-muted-foreground text-sm leading-relaxed flex-1">{game.resumo}</p>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-xs font-body text-muted-foreground">👶 {game.publicoAlvo}</span>
          {isAvailable && game.linkJogo ? (
            <a
              href={game.linkJogo}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-full hover:bg-primary/90 transition-colors"
            >
              Jogar agora
            </a>
          ) : (
            <span className="text-xs font-body text-muted-foreground italic">
              {game.status === "em_desenvolvimento" ? "Em breve" : "Em pesquisa"}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════════════ */

export default function JogosPage() {
  const disponiveis = games.filter((g) => g.status === "disponivel");
  const emDesenvolvimento = games.filter((g) => g.status === "em_desenvolvimento");
  const emPesquisa = games.filter((g) => g.status === "em_pesquisa");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-28 pb-16 bg-gamellito-space px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center gap-10"
          >
            <div className="flex-1">
              <p className="text-gamellito-orange font-body font-semibold text-sm uppercase tracking-wider mb-3">
                Universo Gamellito
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mb-5 leading-tight">
                Jogos que crescem{" "}
                <span className="text-gamellito-orange">com você</span>
              </h1>
              <p className="font-body text-primary-foreground/85 text-lg leading-relaxed max-w-xl">
                O Gamellito não é um jogo — é um universo. Cada aventura usa o mesmo mundo, os mesmos personagens e a mesma missão: mostrar que viver com DM1 pode ser leve, engraçado e cheio de histórias.
              </p>
            </div>
            <div className="flex-shrink-0">
              <AssetImage
                asset="gamellitoContente"
                alt="Gamellito feliz"
                className="w-44 h-auto drop-shadow-xl"
                width={176}
                height={176}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Personagens do universo ── */}
      <section className="py-14 px-4 bg-gamellito-space border-t border-white/8">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="font-display text-2xl font-bold text-primary mb-2">
              Os personagens do universo
            </h2>
            <p className="font-body text-primary-foreground/70 text-sm max-w-lg">
              Os mesmos personagens aparecem em todos os jogos — cada um com seu jeito único de complicar (e facilitar) a vida do Gamellito.
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-3">
            {universoPersonagens.map((p, i) => (
              <motion.div
                key={p.nome}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white/8 border border-white/12 rounded-2xl px-5 py-4 flex items-center gap-3"
              >
                <span className="text-2xl">{p.emoji}</span>
                <div>
                  <p className="font-display font-bold text-primary text-sm">{p.nome}</p>
                  <p className="font-body text-primary-foreground/60 text-xs leading-snug max-w-[180px]">
                    {p.papel}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Disponível ── */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gamellito-health-green/15 flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-gamellito-health-green" />
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground">Disponível agora</h2>
            </div>
            <p className="font-body text-muted-foreground max-w-xl">
              O primeiro jogo do universo — premiado internacionalmente e desenvolvido com USP e UEL.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {disponiveis.map((game, i) => (
              <GameCard key={game.slug} game={game} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Em desenvolvimento ── */}
      <section className="py-16 px-4 bg-gamellito-purple/5">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gamellito-purple/15 flex items-center justify-center">
                <Puzzle className="w-5 h-5 text-gamellito-purple" />
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground">Em desenvolvimento</h2>
            </div>
            <p className="font-body text-muted-foreground max-w-xl">
              Os próximos capítulos do universo. Ainda não estão prontos, mas já têm nome, personagens e história.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {emDesenvolvimento.map((game, i) => (
              <GameCard key={game.slug} game={game} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Em pesquisa ── */}
      <section className="py-16 px-4 bg-gamellito-yellow/5">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gamellito-yellow/20 flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-gamellito-orange" />
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground">Em pesquisa</h2>
            </div>
            <p className="font-body text-muted-foreground max-w-xl">
              Conceitos que estamos investigando — jogos físicos, adaptações de clássicos e novos formatos para o universo DM1.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {emPesquisa.map((game, i) => (
              <GameCard key={game.slug} game={game} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── No mundo do diabetes ── */}
      <section className="py-16 px-4 bg-muted/40">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gamellito-blue/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-gamellito-blue" />
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground">No mundo do diabetes</h2>
            </div>
            <p className="font-body text-muted-foreground max-w-xl">
              Outros jogos educativos sobre DM1 que existem — pesquisa acadêmica e iniciativas que também usam o lúdico como linguagem de cuidado.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-5">
            {jogosExternos.map((jogo, i) => (
              <motion.a
                key={jogo.nome}
                href={jogo.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{jogo.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-display font-bold text-foreground group-hover:text-primary transition-colors">
                        {jogo.nome}
                      </h3>
                      <span className="text-xs font-body text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {jogo.origem}
                      </span>
                    </div>
                    <p className="font-body text-muted-foreground text-sm leading-relaxed">{jogo.resumo}</p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-4 bg-gamellito-space">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <AssetImage
              asset="gamellitoContente"
              alt="Gamellito contente"
              className="w-20 h-auto mx-auto mb-6"
              width={80}
              height={80}
            />
            <h2 className="font-display text-3xl font-bold text-primary mb-4">
              Quer testar os próximos jogos?
            </h2>
            <p className="font-body text-primary-foreground/80 leading-relaxed mb-8 max-w-xl mx-auto">
              Os jogos em desenvolvimento precisam de crianças, famílias e profissionais de saúde para testar. Se você quer ser dos primeiros a jogar — e ajudar a moldar o universo Gamellito — fala com a gente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:gamellitoltda@gmail.com?subject=Quero%20ser%20testador%20dos%20jogos%20Gamellito"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-body font-semibold rounded-full hover:bg-primary/90 transition-colors"
              >
                <Heart className="w-4 h-4" />
                Quero ser testador
              </a>
              <a
                href="mailto:gamellitoltda@gmail.com?subject=Tenho%20uma%20ideia%20de%20jogo%20para%20o%20Gamellito"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-white/20 text-primary-foreground font-body font-semibold rounded-full hover:border-primary/40 transition-colors"
              >
                <Users className="w-4 h-4" />
                Tenho uma ideia de jogo
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
