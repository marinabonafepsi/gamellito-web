"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChefHat, Gamepad2, GraduationCap, BookOpen, X, ChevronDown,
  Users, School, Stethoscope, ShieldCheck,
} from "@/components/icons";
import { AssetImage, type SiteAssetKey } from "@/components/SiteAssets";
import { PersonagemAnimado } from "@/components/PersonagemAnimado";
import { track } from "@/lib/analytics";

/* ══════════════════════════════════════════
   O QUE FAZEMOS
══════════════════════════════════════════ */
const solutions: Array<{
  icon: typeof ChefHat;
  tag: string;
  tagColor: string;
  title: string;
  description: string;
  extra: string[];
  asset: SiteAssetKey;
  cta?: { label: string };
}> = [
  {
    icon: ChefHat,
    tag: "OFICINAS",
    tagColor: "bg-gamellito-pink",
    title: "Oficinas culinárias e alimentação",
    description:
      "Oficinas que promovem aprendizado prático sobre alimentação saudável e contagem de carboidratos, com participação ativa das crianças. Contribuem para melhoria de parâmetros clínicos e maior conscientização sobre os cuidados com a alimentação.",
    extra: [
      "Atividades presenciais semanais no AEHU/UEL",
      "Contagem de carboidratos na prática",
      "Participação ativa das crianças e famílias",
      "Melhora comprovada em parâmetros clínicos",
    ],
    asset: "geladeira",
  },
  {
    icon: Gamepad2,
    tag: "JOGOS",
    tagColor: "bg-primary",
    title: "Jogos educativos e método Gamellito",
    description:
      "Atividades com o método Gamellito: recursos lúdicos e interativos para facilitar a compreensão do manejo do DM1. Jogos, dinâmicas em grupo e práticas recreativas que estimulam a autonomia e a adesão ao tratamento.",
    extra: [
      "Jogo digital para celular e tablet",
      "Jogo de tabuleiro para grupos e oficinas",
      "Dinâmicas recreativas adaptadas por faixa etária",
      "Desenvolvimento de autonomia e autoestima",
    ],
    asset: "pancreasPreguicoso",
    cta: { label: "Quero conhecer o jogo" },
  },
  {
    icon: GraduationCap,
    tag: "RODAS DE CONVERSA",
    tagColor: "bg-gamellito-blue",
    title: "Rodas de conversa e equipe multidisciplinar",
    description:
      "Intervenções que abordam adesão ao tratamento e reconhecimento de sinais de descompensação glicêmica. Equipe de nutrição, psicologia, artes cênicas, design, educação física, serviço social, odontologia, enfermagem e oftalmologia.",
    extra: [
      "Nutrição, psicologia e enfermagem integradas",
      "Artes cênicas e educação física adaptada",
      "Odontologia, oftalmologia e serviço social",
      "Apoio à adesão ao tratamento de longo prazo",
    ],
    asset: "medicoMaeGamellito",
  },
  {
    icon: BookOpen,
    tag: "MATERIAIS DIGITAIS",
    tagColor: "bg-gamellito-green",
    title: "Materiais educativos e alcance digital",
    description:
      "Jogos, histórias em quadrinhos, vídeos e telenovela educativa em linguagem acessível. Disponibilizados em plataformas digitais, redes sociais e canais institucionais da UEL para ampliar o acesso e reforçar os conteúdos.",
    extra: [
      "Livros ilustrados com as aventuras do Gamellito",
      "Telenovela educativa em linguagem acessível",
      "Histórias em quadrinhos e vídeos animados",
      "Distribuição gratuita via redes e canais da UEL",
    ],
    asset: "maeGamellitoGlicemia",
  },
];

/* ══════════════════════════════════════════
   SETORES DE ATUAÇÃO
══════════════════════════════════════════ */
const setores = [
  {
    icon: Users,
    emoji: "👨‍👩‍👧",
    titulo: "Famílias e Pacientes",
    fase: "Fase 1 — já disponível",
    faseColor: "bg-gamellito-health-green",
    descricao:
      "Curso de acolhimento para diagnóstico recente de DM1, livros ilustrados, app e oficinas online de nutrição. Linguagem acolhedora, sem jargão — para que toda família navegue o diagnóstico com segurança.",
    itens: [
      "Curso Primeiros Passos — 6 aulas de acolhimento",
      "Livro \"As Aventuras de Gamellito\"",
      "Gadgets personalizados para o dia a dia",
      "Comunidade de apoio para pais",
    ],
    cta: "Quero para minha família",
    href: "/para-familias",
    cor: "border-gamellito-health-green/40 hover:border-gamellito-health-green",
    bg: "from-gamellito-health-green/10 to-transparent",
  },
  {
    icon: School,
    emoji: "🏫",
    titulo: "Escolas Privadas",
    fase: "Fase 1 — sem licitação",
    faseColor: "bg-gamellito-blue",
    descricao:
      "Licença anual do método Gamellito + kits educativos + formação de professores. A escola torna-se um espaço de inclusão real para crianças com DM1, com protocolos de emergência e materiais lúdicos em sala.",
    itens: [
      "Licença anual do método Gamellito",
      "Formação de professores e equipe",
      "Kit de materiais impressos e digitais",
      "Protocolo de emergência em sala de aula",
    ],
    cta: "Quero para minha escola",
    href: "/para-familias#educadores",
    cor: "border-gamellito-blue/40 hover:border-gamellito-blue",
    bg: "from-gamellito-blue/10 to-transparent",
  },
  {
    icon: Stethoscope,
    emoji: "🏥",
    titulo: "Clínicas e Operadoras de Saúde",
    fase: "Fase 2 — B2B",
    faseColor: "bg-gamellito-hospital-purple",
    descricao:
      "Programa completo de adesão ao tratamento para ambulatórios de pediatria e endocrinologia. Licença do sistema, treinamento de equipe e relatórios de impacto clínico (HbA1c, idas à emergência).",
    itens: [
      "Programa de adesão ao tratamento",
      "Licença do sistema Gamellito",
      "Treinamento da equipe multidisciplinar",
      "Relatório de impacto clínico (HbA1c)",
    ],
    cta: "Solicitar demonstração",
    href: "/para-familias#saude",
    cor: "border-gamellito-hospital-purple/40 hover:border-gamellito-hospital-purple",
    bg: "from-gamellito-hospital-purple/10 to-transparent",
  },
  {
    icon: ShieldCheck,
    emoji: "🏛️",
    titulo: "Prefeituras e SUS",
    fase: "Fase 3 — impacto máximo",
    faseColor: "bg-gamellito-orange",
    descricao:
      "Programa municipal completo para redes escolares e UBS. Melhora o índice de hemoglobina glicada da população, reduz internações evitáveis e gera dados de impacto para secretarias de saúde apresentarem.",
    itens: [
      "Programa municipal para rede escolar e UBS",
      "Capacitação de agentes de saúde e educadores",
      "Dados de impacto para prestação de contas",
      "Alinhamento ao ODS 3.4.1 da Agenda 2030 ONU",
    ],
    cta: "Quero para meu município",
    href: "/parcerias-uel",
    cor: "border-gamellito-orange/40 hover:border-gamellito-orange",
    bg: "from-gamellito-orange/10 to-transparent",
  },
];

const resultados = [
  "Maior autonomia no manejo do DM1 e adesão às práticas de autocuidado",
  "Melhora no controle glicêmico e redução da variabilidade das glicemias",
  "Fortalecimento do vínculo entre equipe, usuários e famílias",
  "Base para políticas públicas e alinhamento ao ODS 3.4.1 (Agenda 2030 ONU)",
];

/* ══════════════════════════════════════════
   MODAL JOGO FAKE DOOR
══════════════════════════════════════════ */
function GameInterestModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gamellito-space/70 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
        <h2 className="font-display text-2xl font-bold text-foreground text-center mb-3">
          Gamellito Adventures está chegando!
        </h2>
        <p className="font-body text-muted-foreground text-center text-sm leading-relaxed mb-6">
          Estamos desenvolvendo o jogo completo. Seu interesse aqui nos ajuda a
          priorizar o lançamento.
        </p>
        <div className="flex flex-col gap-3">
          <a
            href="mailto:gamellitoltda@gmail.com?subject=Interesse no jogo Gamellito Adventures"
            onClick={onClose}
            className="w-full text-center px-6 py-3 bg-primary text-primary-foreground font-display font-bold rounded-full hover:bg-primary/90 transition-colors"
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

/* ══════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════ */
const SolutionsSection = () => {
  const [showGameModal, setShowGameModal] = useState(false);
  const [openCard, setOpenCard] = useState<string | null>(null);

  async function handleGameCTA() {
    await track("game_interest", window.location.pathname, { source: "solutions_section" });
    setShowGameModal(true);
  }

  function toggleCard(title: string) {
    setOpenCard((prev) => (prev === title ? null : title));
  }

  return (
    <>
      <AnimatePresence>
        {showGameModal && <GameInterestModal onClose={() => setShowGameModal(false)} />}
      </AnimatePresence>

      {/* ── O que fazemos ── */}
      <section
        id="solucoes"
        data-track-section="solucoes"
        className="py-24 bg-background"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Soluções para{" "}
              <span className="text-primary">Saúde Pública</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-body mb-4">
              Promoção do autocuidado e educação em saúde para crianças e adolescentes com Diabetes Mellitus Tipo 1.
            </p>
            <p className="text-muted-foreground font-body max-w-2xl mx-auto">
              Desde 2023, atividades semanais com foco em prevenção de complicações, reabilitação e fortalecimento do autocuidado.
            </p>
            <PersonagemAnimado>
              <AssetImage
                asset="bicicleta"
                alt="Vida ativa e saúde — Gamellito"
                className="w-44 h-auto"
                width={176}
                height={110}
              />
            </PersonagemAnimado>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {solutions.map((sol, i) => (
              <motion.div
                key={sol.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-card rounded-2xl p-7 border border-border hover:border-primary/30 transition-all group"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${sol.tagColor} flex items-center justify-center flex-shrink-0`}>
                      <sol.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-body font-bold text-primary uppercase tracking-wider">
                      {sol.tag}
                    </span>
                  </div>
                  <AssetImage
                    asset={sol.asset}
                    alt=""
                    className="w-28 h-auto flex-shrink-0"
                    width={112}
                    height={80}
                  />
                </div>
                <h3 className="font-display font-bold text-xl text-foreground mb-3">{sol.title}</h3>
                <p className="text-muted-foreground font-body leading-relaxed text-sm">{sol.description}</p>

                {/* Accordion de detalhes */}
                <AnimatePresence>
                  {openCard === sol.title && (
                    <motion.ul
                      key="extra"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="mt-3 space-y-1.5 overflow-hidden"
                    >
                      {sol.extra.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-muted-foreground font-body text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>

                <div className="mt-4 flex items-center gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={() => toggleCard(sol.title)}
                    className="inline-flex items-center gap-1 text-sm text-primary font-body font-semibold hover:underline"
                  >
                    {openCard === sol.title ? "Ver menos" : "Saber mais"}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${openCard === sol.title ? "rotate-180" : ""}`}
                    />
                  </button>
                  {sol.cta && (
                    <button
                      type="button"
                      onClick={handleGameCTA}
                      className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground font-display font-bold rounded-full hover:bg-primary/90 transition-colors text-sm"
                    >
                      {sol.cta.label}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* resultados + parceria */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 grid md:grid-cols-2 gap-8"
          >
            <div className="bg-card rounded-2xl p-8 border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
              <h4 className="font-display font-bold text-xl text-foreground mb-4">Resultados e impacto</h4>
              <ul className="space-y-3">
                {resultados.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-muted-foreground font-body leading-relaxed">
                    <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-muted rounded-2xl p-8 border border-border">
              <h4 className="font-display font-bold text-xl text-foreground mb-4">Parceria UEL e AEHU</h4>
              <p className="text-muted-foreground font-body leading-relaxed mb-4">
                O projeto é desenvolvido em parceria com a Universidade Estadual de Londrina (UEL) e o Ambulatório de
                Especialidades do Hospital Universitário (AEHU/UEL). São oferecidas 40 vagas mensais para crianças e
                adolescentes com DM1 e seus responsáveis.
              </p>
              <p className="text-sm text-muted-foreground font-body">
                A iniciativa se alinha ao ODS 3.4.1 da Agenda 2030 da ONU.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SETORES DE ATUAÇÃO
      ══════════════════════════════════════════ */}
      <section
        id="setores"
        data-track-section="setores"
        className="py-24 bg-gamellito-space relative overflow-hidden"
      >
        {[...Array(10)].map((_, i) => (
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

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
              Para quem atuamos
            </h2>
            <p className="text-lg text-primary-foreground/85 max-w-3xl mx-auto font-body">
              Do diagnóstico na família ao programa municipal de saúde —
              o ecossistema Gamellito atende todos os setores que precisam
              levar educação em DM1 à vida real.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {setores.map((setor, i) => (
              <motion.div
                key={setor.titulo}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`bg-gradient-to-br ${setor.bg} bg-primary-foreground/5 backdrop-blur-sm rounded-2xl p-7 border-2 ${setor.cor} transition-all`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className={`${setor.faseColor} text-white font-display text-xs px-3 py-1 rounded-full`}>
                      {setor.fase}
                    </span>
                    <div className="flex items-center gap-2 mt-3">
                      <h3 className="font-display font-bold text-xl text-primary-foreground">
                        {setor.titulo}
                      </h3>
                    </div>
                  </div>
                  <setor.icon className="w-8 h-8 text-primary opacity-70 flex-shrink-0 mt-1" />
                </div>

                <p className="font-body text-primary-foreground/80 text-sm leading-relaxed mb-4">
                  {setor.descricao}
                </p>

                <ul className="space-y-1.5 mb-5">
                  {setor.itens.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-primary-foreground/70 font-body text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <a
                  href={setor.href}
                  onClick={() => track("nav_click", window.location.pathname, { label: setor.cta, href: setor.href })}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-display font-bold rounded-full hover:bg-primary/90 transition-colors text-sm"
                >
                  {setor.cta}
                </a>
              </motion.div>
            ))}
          </div>

          {/* números de impacto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { numero: "2.000+", label: "crianças impactadas" },
              { numero: "77%", label: "menos idas à emergência" },
              { numero: "5", label: "prêmios internacionais" },
              { numero: "12+", label: "anos de pesquisa" },
            ].map((stat) => (
              <div key={stat.label} className="text-center bg-primary-foreground/5 rounded-2xl p-5 border border-primary-foreground/10">
                <p className="font-display text-3xl font-bold text-primary mb-1">{stat.numero}</p>
                <p className="font-body text-primary-foreground/70 text-sm">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default SolutionsSection;
