"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { AssetImage } from "@/components/SiteAssets";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Heart,
  BookOpen,
  AlertCircle,
  Users,
  Apple,
  Activity,
  School,
  MessageCircle,
  Stethoscope,
  GraduationCap,
  ShieldCheck,
  Clock,
  FileText,
  Baby,
  BookMarked,
} from "@/components/icons";
import { trackIntent } from "@/lib/trackIntent";
import GamButton from "@/components/ds/GamButton";

/* ═══════════════════════════════════════════════════════
   DADOS — PAIS E FAMÍLIA
════════════════════════════════════════════════════════ */


const primeirosDias = [
  {
    dia: "Dias 1–3",
    titulo: "Absorver o diagnóstico",
    texto: "Foque no essencial: insulina, monitoramento básico e descanso. Não tente aprender tudo de uma vez.",
  },
  {
    dia: "Semana 1",
    titulo: "Equipe multidisciplinar",
    texto: "Conheça o endocrinologista, a nutricionista e a enfermeira educadora. Anote todas as dúvidas.",
  },
  {
    dia: "Semana 2–3",
    titulo: "Rotina de monitoramento",
    texto: "Comece a registrar as medições. Apps como mySugr ajudam a visualizar padrões glicêmicos.",
  },
  {
    dia: "Mês 1",
    titulo: "Comunicar a escola",
    texto: "Leve um plano de manejo escrito. A escola tem obrigação legal de acolher a criança com DM1.",
  },
];

const dicasDiarias = [
  {
    icon: Activity,
    titulo: "Monitoramento da glicemia",
    texto:
      "Verifique a glicemia conforme orientação médica — antes das refeições, antes de dormir e sempre que houver sintomas de hipo ou hiperglicemia. Mantenha um diário ou use um app para registrar os resultados.",
  },
  {
    icon: Apple,
    titulo: "Alimentação equilibrada",
    texto:
      "Não existe uma dieta proibida, mas sim uma dieta balanceada com contagem de carboidratos. Trabalhe com nutricionista especializado em DM1 para elaborar um plano alimentar que a criança goste e que respeite a rotina da família.",
  },
  {
    icon: AlertCircle,
    titulo: "Reconhecer hipoglicemia",
    texto:
      "Tremor, suor frio, palidez, irritabilidade e confusão mental são sinais de hipoglicemia (glicemia baixa). Tenha sempre gel de glicose, suco ou sachê de mel à mão. Em caso de inconsciência, chame o SAMU (192).",
  },
  {
    icon: School,
    titulo: "Comunicar a escola",
    texto:
      'Converse com diretores e professores. Providencie um "plano de manejo" por escrito com orientações sobre monitoramento, sintomas, kit de emergência e contatos. A Lei Federal nº 13.230/2015 protege a criança com DM1 na escola.',
  },
  {
    icon: Heart,
    titulo: "Saúde emocional da criança",
    texto:
      "Crianças com doenças crônicas têm risco maior de ansiedade e depressão. Mantenha diálogo aberto, valorize conquistas pequenas e busque acompanhamento psicológico quando necessário.",
  },
  {
    icon: Users,
    titulo: "Rede de apoio familiar",
    texto:
      "Envolva avós, tios e cuidadores no aprendizado sobre DM1. Quanto mais adultos souberem o manejo básico, mais segura e livre será a vida da criança.",
  },
];

const adolescenciaItems = [
  {
    titulo: "Autonomia progressiva",
    texto: "Adolescentes precisam assumir o próprio manejo gradualmente. Evite superproteger — o excesso de controle gera rebeldia em relação ao tratamento.",
  },
  {
    titulo: "Baladas e festas",
    texto: "Álcool pode mascarar sintomas de hipoglicemia. Oriente sobre os riscos com empatia, não com proibições absolutas. Tenha um plano combinado com o adolescente.",
  },
  {
    titulo: "Saúde mental digital",
    texto: "Redes sociais podem gerar comparação e angústia. Incentive grupos online de jovens com DM1 — a identificação com pares é poderosa nessa fase.",
  },
  {
    titulo: "Esportes e atividades",
    texto: "A prática esportiva é muito benéfica. Monitore a glicemia antes e depois, leve gel de glicose e avise o professor/treinador sobre o DM1.",
  },
];

const faqItems = [
  {
    q: "DM1 tem cura?",
    a: "Ainda não. O Diabetes Tipo 1 é uma doença autoimune e crônica, em que o pâncreas para de produzir insulina. O tratamento atual é a reposição de insulina, aliada ao monitoramento da glicemia e hábitos de vida saudáveis. Pesquisas de célula-tronco e pâncreas artificial estão avançando, mas nenhuma tem aprovação clínica ampla ainda.",
  },
  {
    q: "Meu filho pode praticar esportes?",
    a: "Sim! A atividade física é muito benéfica para crianças com DM1 — melhora a sensibilidade à insulina, o humor e a qualidade de vida. É necessário monitorar a glicemia antes, durante e após o exercício e ajustar doses com o endocrinologista. Informe o professor/treinador sobre o DM1.",
  },
  {
    q: "Como explicar o DM1 para meu filho?",
    a: 'Use linguagem simples e adequada à idade. Diga que o pâncreas dele precisa de uma "ajudinha" para usar o açúcar do sangue, e que a insulina faz esse papel. Evite carregar a doença de drama — crianças tendem a refletir a ansiedade dos pais. Livros, jogos e histórias (como as do Gamellito!) ajudam muito.',
  },
  {
    q: "E se a glicemia ficar muito alta na escola?",
    a: "Oriente a escola a contatar os pais ou responsáveis imediatamente e a não oferecer comida enquanto aguarda instruções. Se a criança estiver consciente e com nível elevado, hidratação com água é indicada. O endocrinologista deve orientar o protocolo específico para o seu filho.",
  },
  {
    q: "Com que frequência devo ir ao endocrinologista?",
    a: "Em geral, consultas a cada 3 meses são recomendadas para crianças com DM1. A hemoglobina glicada (HbA1c) é avaliada nessas consultas e indica o controle glicêmico dos últimos 2–3 meses. Siga o calendário definido pela equipe de saúde.",
  },
  {
    q: "Existe alguma comunidade de apoio para pais?",
    a: "Sim! A ANAD (Associação Nacional de Assistência ao Diabético) e grupos regionais de pais de crianças com DM1 são recursos valiosos. Redes sociais também têm grupos ativos. Trocar experiências com outras famílias reduz a sensação de isolamento.",
  },
  {
    q: "Bombas de insulina e sensores são indicados para crianças?",
    a: "Cada caso é avaliado pelo endocrinologista. Bombas de insulina (infusão contínua) e sensores de glicose em tempo real (CGM) têm se mostrado muito eficazes em crianças, melhorando o controle e a qualidade de vida. Converse com a equipe médica sobre as opções disponíveis e cobertura do plano de saúde.",
  },
  {
    q: "Como lidar com o DM1 na adolescência?",
    a: "A adolescência é um período de desafios específicos: resistência ao tratamento, pressão dos pares e maior autonomia. Mantenha o diálogo aberto, envolva o adolescente nas decisões sobre o tratamento e busque um endocrinologista que saiba se comunicar com essa faixa etária. Psicólogos especializados em doenças crônicas também fazem diferença.",
  },
];

const recursosLinks = [
  {
    nome: "ANAD – Associação Nacional de Assistência ao Diabético",
    url: "https://www.anad.org.br",
    descricao: "Suporte, informação e defesa dos direitos de pessoas com diabetes.",
  },
  {
    nome: "SBD – Sociedade Brasileira de Diabetes",
    url: "https://www.diabetes.org.br",
    descricao: "Diretrizes clínicas, artigos e orientações para pacientes e famílias.",
  },
  {
    nome: "JDRF Brasil",
    url: "https://jdrf.org.br",
    descricao: "Organização focada em pesquisa e cura do Diabetes Tipo 1.",
  },
  {
    nome: "Gamellito no Instagram",
    url: "https://instagram.com/gamellito",
    descricao: "Conteúdo lúdico e educativo sobre DM1 para crianças e famílias.",
  },
];

/* ═══════════════════════════════════════════════════════
   DADOS — EDUCADORES E ESCOLAS
════════════════════════════════════════════════════════ */

const alertasEscola = [
  {
    tipo: "Hipoglicemia (glicemia baixa)",
    cor: "gamellito-mae-red",
    sinais: ["Tremor ou agitação", "Suor frio e palidez", "Dificuldade de concentração", "Irritabilidade súbita", "Confusão mental"],
    acao: "Ofereça 15g de carboidrato de ação rápida (suco de laranja, gel de glicose). Aguarde 15 min e reavalie. Se não melhorar ou houver inconsciência, chame SAMU (192).",
  },
  {
    tipo: "Hiperglicemia (glicemia alta)",
    cor: "gamellito-orange",
    sinais: ["Sede excessiva", "Urina frequente", "Cansaço e sonolência", "Hálito frutado", "Dor de cabeça"],
    acao: "Permita que a criança beba água e contate os pais/responsáveis. Não restrinja idas ao banheiro. Em caso de vômitos ou respiração acelerada, procure emergência imediatamente.",
  },
];

const direitosEscolares = [
  {
    lei: "Lei Federal nº 13.230/2015",
    texto: "Garante à criança com DM1 o direito de realizar testes de glicemia e aplicar insulina nas dependências da escola.",
  },
  {
    lei: "Lei nº 11.347/2006",
    texto: "Assegura às pessoas com DM a distribuição gratuita de medicamentos e materiais necessários pelo SUS.",
  },
  {
    lei: "Nota Técnica MEC/2016",
    texto: "Orienta escolas a elaborarem Plano de Atendimento Individual (PAI) para alunos com condições de saúde crônicas.",
  },
];

const comoUsarGamellitoEscola = [
  {
    icon: Activity,
    titulo: "Plataforma + minigames",
    texto: "Acesso à plataforma Gamellito com trilha de atividades por faixa etária — o jogo que a criança já ama, agora integrado à rotina escolar.",
  },
  {
    icon: BookMarked,
    titulo: "Kit físico completo",
    texto: "Livro ilustrado, jogo de tabuleiro, cartazes e Guia do Professor — material concreto para usar em sala sem improvisar.",
  },
  {
    icon: GraduationCap,
    titulo: "Formação de educadores",
    texto: "Oficina presencial ou online: como identificar sinais de DM1, acolher o aluno e agir com segurança em emergências.",
  },
  {
    icon: Users,
    titulo: "Inclusão para toda a turma",
    texto: "Rodas de conversa, histórias e jogos que ensinam empatia para todas as crianças — não só as com DM1.",
  },
];

/* ═══════════════════════════════════════════════════════
   DADOS — ENFERMAGEM E SAÚDE
════════════════════════════════════════════════════════ */

const impactoData = [
  { numero: "2.000+", descricao: "crianças alcançadas desde 2014" },
  { numero: "12 anos", descricao: "de pesquisa e desenvolvimento" },
  { numero: "3 prêmios", descricao: "internacionais (2017, 2019, 2021)" },
  { numero: "USP + UEL", descricao: "parceiras na validação científica" },
];

const metodologiaSaude = [
  {
    icon: BookOpen,
    titulo: "Educação em saúde lúdica",
    texto: "O método Gamellito usa narrativa, jogos e personagens para ensinar conceitos complexos (insulina, glicemia, carboidratos) de forma acessível a crianças de 5 a 14 anos.",
  },
  {
    icon: MessageCircle,
    titulo: "Rodas de conversa",
    texto: "Facilitamos rodas de conversa estruturadas para equipes de enfermagem, endopediatria e multidisciplinares — abordando adesão ao tratamento e manejo familiar.",
  },
  {
    icon: Activity,
    titulo: "Monitoramento de resultados",
    texto: "Nossos instrumentos de avaliação medem autonomia da criança, conhecimento sobre DM1 e adesão ao tratamento antes e depois das intervenções.",
  },
  {
    icon: ShieldCheck,
    titulo: "Embasamento científico",
    texto: "Desenvolvido em parceria com USP e UEL, o método Gamellito é fundamentado em evidências de educação em saúde e psicologia do desenvolvimento infantil.",
  },
];

const ondeAplicar = [
  "Ambulatórios de endocrinologia pediátrica",
  "Enfermarias e UTIs pediátricas",
  "Consultas de enfermagem de rotina",
  "Grupos de educação em diabetes",
  "Programas de saúde escolar",
  "Formação de cuidadores e agentes comunitários",
];

const sentimentosDiagnostico = [
  {
    asset: "diagnosticoMedo",
    fase: "Medo e choque",
    texto: "A primeira reação é normal. O diagnóstico chega de surpresa e o medo é uma resposta saudável — não uma fraqueza.",
    cor: "bg-orange/10 border-orange/30",
  },
  {
    asset: "diagnosticoTristeza",
    fase: "Tristeza",
    texto: 'Sentir luto pelo "antes" do diagnóstico é esperado. Dar espaço para esse sentimento faz parte da cura emocional.',
    cor: "bg-lilac/10 border-lilac/30",
  },
  {
    asset: "diagnosticoRaiva",
    fase: "Raiva e culpa",
    texto: '"Por que comigo?" ou "Será que foi culpa minha?" são perguntas comuns. Ninguém é responsável pelo DM1.',
    cor: "bg-orange/10 border-orange/30",
  },
  {
    asset: "diagnosticoAdaptacao",
    fase: "Adaptação",
    texto: "Com o tempo, o DM1 se torna parte da rotina. Crianças e famílias se adaptam — e o Gamellito está aqui nessa jornada.",
    cor: "bg-green-500/10 border-green-500/30",
  },
];

/* ═══════════════════════════════════════════════════════
   ABAS — componente de navegação
════════════════════════════════════════════════════════ */

type Tab = "familias" | "educadores" | "enfermagem";

const tabs: { id: Tab; label: string }[] = [
  { id: "familias", label: "Pais e Família" },
  { id: "educadores", label: "Educadores e Escolas" },
  { id: "enfermagem", label: "Enfermagem e Saúde" },
];

/* ═══════════════════════════════════════════════════════
   SEÇÃO: PAIS E FAMÍLIA
════════════════════════════════════════════════════════ */

function TabFamilias() {
  return (
    <>
      {/* ── Primeiros 30 dias ── */}
      <section className="py-16 px-4 bg-gamellito-orange/5">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gamellito-orange/15 flex items-center justify-center">
                <Clock className="w-5 h-5 text-gamellito-orange" />
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground">
                Os primeiros 30 dias
              </h2>
            </div>
            <p className="font-body text-muted-foreground leading-relaxed max-w-2xl">
              O diagnóstico é uma virada de chave. Esta linha do tempo ajuda a
              organizar as primeiras semanas sem se sobrecarregar.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gamellito-orange/25 hidden sm:block" />
            <div className="space-y-6">
              {primeirosDias.map((item, i) => (
                <motion.div
                  key={item.dia}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gamellito-orange text-white font-display text-xs flex items-center justify-center text-center leading-tight z-10 shadow-md">
                    {i + 1}
                  </div>
                  <div className="flex-1 bg-card rounded-2xl p-5 border border-border">
                    <span className="text-xs font-display text-gamellito-orange font-semibold uppercase tracking-wider">
                      {item.dia}
                    </span>
                    <h3 className="font-display font-bold text-foreground mt-1 mb-2">
                      {item.titulo}
                    </h3>
                    <p className="font-body text-muted-foreground text-sm leading-relaxed">
                      {item.texto}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Sentimentos normais ── */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <p className="text-sm font-body font-semibold text-primary uppercase tracking-wider mb-2">
              É normal sentir assim
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              Sentimentos normais após o diagnóstico
            </h2>
            <p className="font-body text-muted-foreground max-w-xl">
              O diagnóstico de DM1 provoca uma série de emoções — todas válidas. Reconhecê-las é o primeiro passo.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {sentimentosDiagnostico.map((s, i) => (
              <motion.div
                key={s.fase}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`${s.cor} rounded-2xl border p-5 flex flex-col items-center text-center gap-4`}
              >
                <AssetImage asset={s.asset as any} alt={s.fase} className="w-28 h-auto" width={112} height={112} />
                <div>
                  <p className="font-display font-bold text-foreground mb-1" style={{ color: s.cor }}>{s.fase}</p>
                  <p className="font-body text-muted-foreground text-sm leading-relaxed">{s.texto}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── O que é DM1 ── */}
      <section className="py-16 px-4 bg-[hsl(var(--gamellito-bg-yellow)/0.06)]">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10 gap-4"
          >
            <div>
              <p className="text-sm font-body font-semibold text-primary uppercase tracking-wider mb-1">
                Livro ilustrado
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Entendendo o{" "}
                <span className="text-primary">Diabetes Tipo 1</span>
              </h2>
              <p className="font-body text-muted-foreground mt-2 max-w-md">
                Quatro capítulos para entender o diagnóstico sem complicar.
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 40, rotate: -8 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.2 }}
              className="flex-shrink-0 hidden sm:block"
            >
              <AssetImage
                asset="pancreasPreguicoso"
                alt="Pâncreas preguiçoso — mascote Gamellito"
                className="w-28 h-auto drop-shadow-md"
                width={112}
                height={90}
              />
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Cap 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 bg-gamellito-orange/8 border-2 border-gamellito-orange/25 rounded-2xl p-6 md:p-8"
            >
              <div className="grid md:grid-cols-[1fr_160px] gap-6 items-center">
                <div>
                  <span className="inline-block rounded-full bg-gamellito-orange text-white text-xs font-display px-3 py-1 mb-3">
                    Capítulo 1
                  </span>
                  <h3 className="font-display font-bold text-2xl text-gamellito-orange mb-3">
                    O que acontece no corpo
                  </h3>
                  <p className="font-body text-foreground/80 leading-relaxed mb-4">
                    Normalmente, o pâncreas produz insulina — o "passaporte" que
                    permite ao açúcar do sangue entrar nas células e virar energia.
                    No DM1, o próprio sistema imunológico destrói as células beta
                    que fazem essa insulina.
                  </p>
                  <p className="font-body text-foreground/70 leading-relaxed text-sm">
                    Por isso a reposição de insulina é{" "}
                    <strong>essencial e contínua</strong> — não existe um "período
                    de férias" do tratamento. Mas com o manejo adequado, o corpo
                    funciona muito bem.
                  </p>
                  <span className="inline-block mt-4 rounded-full bg-gamellito-orange/15 text-gamellito-orange text-xs font-display px-3 py-1">
                    Doença autoimune
                  </span>
                </div>
                <div className="flex justify-center">
                  <svg viewBox="0 0 120 200" width="120" height="200" aria-label="Diagrama do corpo mostrando o pâncreas" className="flex-shrink-0">
                    <circle cx="60" cy="22" r="18" fill="#FFE5B4" stroke="#FF8C00" strokeWidth="3" />
                    <circle cx="53" cy="20" r="2.5" fill="#FF8C00" />
                    <circle cx="67" cy="20" r="2.5" fill="#FF8C00" />
                    <path d="M54 27 Q60 32 66 27" stroke="#FF8C00" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <rect x="28" y="44" width="64" height="100" rx="22" fill="#FFF3E0" stroke="#FF8C00" strokeWidth="3" />
                    <ellipse cx="56" cy="84" rx="16" ry="10" fill="#E8003D" fillOpacity="0.18" stroke="#E8003D" strokeWidth="2" />
                    <line x1="50" y1="78" x2="58" y2="86" stroke="#E8003D" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="58" y1="78" x2="50" y2="86" stroke="#E8003D" strokeWidth="2.5" strokeLinecap="round" />
                    <text x="74" y="88" fontSize="7.5" fill="#E8003D" fontFamily="Pangolin, cursive" fontWeight="bold">pâncreas</text>
                    <line x1="56" y1="96" x2="56" y2="112" stroke="#E8003D" strokeWidth="1.5" strokeDasharray="3,2" />
                    <polygon points="52,110 60,110 56,116" fill="#E8003D" opacity="0.7" />
                    <text x="38" y="124" fontSize="7" fill="#E8003D" fontFamily="Pangolin, cursive">insulina?</text>
                    <path d="M76 100 Q82 96 88 100 Q94 104 100 100" stroke="#FF8C00" strokeWidth="1.5" fill="none" opacity="0.6" />
                    <path d="M76 108 Q82 104 88 108 Q94 112 100 108" stroke="#FF8C00" strokeWidth="1.5" fill="none" opacity="0.4" />
                    <text x="76" y="120" fontSize="7" fill="#FF8C00" fontFamily="Pangolin, cursive">glicose↑</text>
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Cap 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 bg-gamellito-space rounded-2xl p-6 md:p-8 overflow-hidden"
            >
              <span className="inline-block rounded-full bg-gamellito-yellow/20 text-gamellito-yellow text-xs font-display px-3 py-1 mb-5">
                Capítulo 2
              </span>
              <div className="grid md:grid-cols-[auto_56px_auto] gap-4 md:gap-6 items-center justify-center">
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="flex flex-col items-center">
                  <AssetImage asset="thinkingTipo1" alt="Gamellito - Tipo 1" className="w-32 h-auto mb-4" width={128} height={128} />
                  <div className="text-center">
                    <span className="inline-block rounded-full bg-gamellito-orange text-white font-display text-sm px-4 py-1 mb-3">Tipo 1</span>
                  </div>
                  <ul className="space-y-2">
                    {["Autoimune — o corpo ataca as próprias células beta", "Surge na infância ou adolescência (e também em adultos)", "Requer insulina todos os dias, sem exceção"].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-primary-foreground/90 font-body text-sm">
                        <span className="w-2 h-2 rounded-full bg-gamellito-orange mt-1.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
                <div className="flex items-center justify-center">
                  <span className="font-display text-4xl md:text-5xl text-gamellito-yellow font-bold select-none">≠</span>
                </div>
                <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="flex flex-col items-center">
                  <AssetImage asset="thinkingTipo2" alt="Gamellito - Tipo 2" className="w-32 h-auto mb-4" width={128} height={128} />
                  <div className="text-center">
                    <span className="inline-block rounded-full bg-gamellito-blue text-white font-display text-sm px-4 py-1 mb-3">Tipo 2</span>
                  </div>
                  <ul className="space-y-2">
                    {["Resistência à insulina — não é autoimune", "Geralmente em adultos, associado ao estilo de vida", "Pode ser tratado com dieta, medicação oral ou insulina"].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-primary-foreground/90 font-body text-sm">
                        <span className="w-2 h-2 rounded-full bg-gamellito-blue mt-1.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
              <p className="font-body text-primary-foreground/60 text-xs mt-6 text-center">
                As causas, o tratamento e o manejo são completamente diferentes — não confunda as informações.
              </p>
            </motion.div>

            {/* Cap 3 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gamellito-mae-red/8 border-2 border-gamellito-mae-red/25 rounded-2xl p-6"
            >
              <span className="inline-block rounded-full bg-gamellito-mae-red/15 text-gamellito-mae-red text-xs font-display px-3 py-1 mb-3">Capítulo 3</span>
              <h3 className="font-display font-bold text-xl text-gamellito-mae-red mb-3">Sinais de alerta</h3>
              <p className="font-body text-foreground/70 text-sm leading-relaxed mb-4">
                Esses sintomas costumam aparecer antes do diagnóstico. Reconhecê-los precocemente pode salvar vidas:
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {["Sede excessiva", "Urina frequente", "Perda de peso", "Cansaço intenso", "Visão turva"].map((s) => (
                  <span key={s} className="rounded-full bg-gamellito-mae-red/15 text-gamellito-mae-red font-display text-xs px-3 py-1">{s}</span>
                ))}
              </div>
              <div className="rounded-xl bg-gamellito-mae-red/15 p-3 mt-2">
                <p className="font-body text-gamellito-mae-red text-xs leading-relaxed">
                  <strong>⚠ Cetoacidose diabética (CAD):</strong> pode ser a primeira manifestação do DM1. Hálito frutado, vômitos e respiração acelerada são sinais de emergência — procure pronto-socorro imediatamente.
                </p>
              </div>
            </motion.div>

            {/* Cap 4 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="bg-gamellito-health-green/8 border-2 border-gamellito-health-green/30 rounded-2xl p-6"
            >
              <AssetImage asset="gamellitoEAmigos" alt="Mãe e criança monitorando glicemia" className="w-28 h-auto mx-auto block mb-3" width={112} height={80} />
              <span className="inline-block rounded-full bg-gamellito-health-green/15 text-gamellito-health-green text-xs font-display px-3 py-1 mb-3">Capítulo 4</span>
              <h3 className="font-display font-bold text-xl text-gamellito-health-green mb-3">O tratamento atual</h3>
              <p className="font-body text-foreground/70 text-sm leading-relaxed mb-4">
                Não existe cura ainda, mas o controle é muito eficaz. Quatro pilares sustentam uma vida plena com DM1:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { asset: "seringaSvg", label: "Insulinoterapia" },
                  { asset: "glicosimetro", label: "Monitoramento" },
                  { asset: "geladeira", label: "Alimentação" },
                  { asset: "bicicleta", label: "Atividade física" },
                ].map((pilar) => (
                  <div key={pilar.label} className="rounded-xl bg-white/40 dark:bg-white/5 border border-gamellito-health-green/25 p-3 text-center">
                    <AssetImage asset={pilar.asset as any} alt={pilar.label} className="w-10 h-10 mx-auto mb-1 object-contain" width={40} height={40} />
                    <span className="font-display text-xs text-gamellito-health-green font-bold block">{pilar.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Dicas do dia a dia ── */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gamellito-health-green/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-gamellito-health-green" />
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground">No dia a dia: guia prático</h2>
            </div>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {dicasDiarias.map((dica, i) => (
              <motion.div key={dica.titulo} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-card rounded-2xl p-6 border border-border group hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <dica.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-foreground mb-2">{dica.titulo}</h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">{dica.texto}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Adolescência com DM1 ── */}
      <section className="py-16 px-4 bg-gamellito-purple/5">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gamellito-purple/15 flex items-center justify-center">
                <Baby className="w-5 h-5 text-gamellito-purple" />
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground">Adolescência com DM1</h2>
            </div>
            <p className="font-body text-muted-foreground leading-relaxed max-w-2xl">
              A adolescência traz desafios específicos para o manejo do DM1. Antecipe-se e prepare a família para essa fase.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-5">
            {adolescenciaItems.map((item, i) => (
              <motion.div key={item.titulo} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-card rounded-2xl p-5 border border-border">
                <h3 className="font-display font-bold text-foreground mb-2">{item.titulo}</h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">{item.texto}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gamellito pode ajudar ── */}
      <section className="py-16 px-4 bg-gamellito-space">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col md:flex-row items-center gap-8">
            <AssetImage asset="empurrandoCaixa" alt="Gamellito empurrando caixa - ação" className="w-56 h-auto flex-shrink-0" width={280} height={180} />
            <div>
              <h2 className="font-display text-3xl font-bold text-primary mb-4">Como o Gamellito pode ajudar sua família</h2>
              <p className="font-body text-primary-foreground/90 leading-relaxed mb-4">
                Os jogos e histórias do Gamellito foram criados para tornar o aprendizado sobre DM1 mais leve e significativo.
              </p>
              <ul className="space-y-2 font-body text-primary-foreground/80 text-sm">
                {["Reforça conceitos de glicemia, insulina e alimentação de forma lúdica", "Reduz o estigma e o medo em torno do diagnóstico", "Estimula a autonomia e a adesão ao tratamento", "Pode ser usado em casa, na escola e no ambulatório"].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <a href="/jogos/experimente" className="inline-block mt-6 px-6 py-3 bg-primary text-primary-foreground font-body font-semibold rounded-full hover:bg-primary/90 transition-colors">
                Experimente os jogos
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gamellito-blue/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-gamellito-blue" />
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground">Perguntas frequentes</h2>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Accordion type="single" collapsible className="space-y-3">
              {faqItems.map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="bg-card rounded-2xl border border-border px-5 data-[state=open]:border-primary/30">
                  <AccordionTrigger className="font-display font-semibold text-foreground text-left hover:no-underline">{item.q}</AccordionTrigger>
                  <AccordionContent className="font-body text-muted-foreground leading-relaxed">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* ── Recursos ── */}
      <section className="py-16 px-4 bg-muted/40">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gamellito-orange/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-gamellito-orange" />
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground">Redes de apoio e recursos</h2>
            </div>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-5">
            {recursosLinks.map((rec, i) => (
              <motion.a key={rec.nome} href={rec.url} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-card rounded-2xl p-5 border border-border hover:border-primary/40 hover:shadow-md transition-all group">
                <h3 className="font-display font-bold text-foreground group-hover:text-primary transition-colors mb-1">{rec.nome}</h3>
                <p className="font-body text-muted-foreground text-sm">{rec.descricao}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   SEÇÃO: EDUCADORES E ESCOLAS
════════════════════════════════════════════════════════ */

function TabEducadores() {
  return (
    <>
      {/* ── Hook narrativo ── */}
      <section className="py-16 px-4 bg-gamellito-health-green/5">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gamellito-health-green/15 flex items-center justify-center">
                <School className="w-5 h-5 text-gamellito-health-green" />
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground">
                A escola faz parte do tratamento
              </h2>
            </div>
            <p className="font-body text-muted-foreground leading-relaxed max-w-2xl">
              A criança com DM1 passa até 8 horas por dia na escola. Quando o professor sabe o que fazer, a criança sente segurança — e os pais respiram. Não é burocracia: é cuidado.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { titulo: "Resposta rápida salva vidas", texto: "Em uma crise de hipoglicemia, cada minuto conta. Professores treinados sabem agir antes da chegada dos pais." },
              { titulo: "Inclusão de verdade", texto: "Um aluno que se sente seguro na escola aprende melhor, faz amigos e desenvolve autonomia no manejo da doença." },
              { titulo: "Obrigação legal", texto: "A legislação brasileira obriga as escolas a acolherem e apoiarem alunos com DM1. Estar preparado é cumprir a lei — e é fazer o bem." },
            ].map((item, i) => (
              <motion.div key={item.titulo} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-card rounded-2xl p-6 border border-border text-center">
                <h3 className="font-display font-bold text-foreground mb-2">{item.titulo}</h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">{item.texto}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Alertas em sala de aula ── */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gamellito-mae-red/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-gamellito-mae-red" />
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground">
                O que reconhecer — e o que fazer
              </h2>
            </div>
            <p className="font-body text-muted-foreground max-w-2xl">
              Dois cenários que qualquer educador pode aprender a identificar e manejar com segurança. Não é preciso ser da área de saúde.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {alertasEscola.map((alerta, i) => (
              <motion.div key={alerta.tipo} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`rounded-2xl p-6 border-2 ${i === 0 ? "bg-gamellito-mae-red/8 border-gamellito-mae-red/25" : "bg-gamellito-orange/8 border-gamellito-orange/25"}`}>
                <h3 className={`font-display font-bold text-xl mb-4 ${i === 0 ? "text-gamellito-mae-red" : "text-gamellito-orange"}`}>
                  {alerta.tipo}
                </h3>
                <p className="font-body text-xs text-foreground/60 uppercase tracking-wider font-semibold mb-2">Sinais</p>
                <ul className="space-y-1.5 mb-5">
                  {alerta.sinais.map((s) => (
                    <li key={s} className="flex items-center gap-2 font-body text-sm text-foreground/80">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${i === 0 ? "bg-gamellito-mae-red" : "bg-gamellito-orange"}`} />
                      {s}
                    </li>
                  ))}
                </ul>
                <div className={`rounded-xl p-3 ${i === 0 ? "bg-gamellito-mae-red/12" : "bg-gamellito-orange/12"}`}>
                  <p className="font-body text-xs font-semibold uppercase tracking-wider mb-1 text-foreground/60">O que fazer</p>
                  <p className={`font-body text-sm leading-relaxed ${i === 0 ? "text-gamellito-mae-red" : "text-gamellito-orange"}`}>
                    {alerta.acao}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Direitos na escola ── */}
      <section className="py-16 px-4 bg-muted/40">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gamellito-blue/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-gamellito-blue" />
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground">
                O que a lei garante — e o que a escola precisa ter
              </h2>
            </div>
            <p className="font-body text-muted-foreground max-w-2xl">
              A família pode exigir. A escola precisa estar pronta. Conheça a legislação que protege o aluno com DM1.
            </p>
          </motion.div>

          <div className="space-y-4">
            {direitosEscolares.map((d, i) => (
              <motion.div key={d.lei} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-card rounded-2xl p-5 border border-border flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gamellito-blue/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gamellito-blue" />
                </div>
                <div>
                  <span className="font-display font-bold text-gamellito-blue text-sm">{d.lei}</span>
                  <p className="font-body text-muted-foreground text-sm leading-relaxed mt-1">{d.texto}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Programa Gamellito na Escola ── */}
      <section className="py-16 px-4 bg-gamellito-space">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <span className="inline-block bg-gamellito-health-green/20 text-gamellito-health-green font-body font-semibold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Programa escolar
            </span>
            <h2 className="font-display text-3xl font-bold text-primary mb-3">
              Gamellito na Escola — o que o programa inclui
            </h2>
            <p className="font-body text-primary-foreground/80 max-w-2xl">
              Não é só informação — é um programa completo para que a escola se torne um espaço de verdade para o aluno com DM1.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5 mb-10">
            {comoUsarGamellitoEscola.map((item, i) => (
              <motion.div key={item.titulo} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-white/8 rounded-2xl p-5 border border-white/15">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-primary mb-2">{item.titulo}</h3>
                <p className="font-body text-primary-foreground/75 text-sm leading-relaxed">{item.texto}</p>
              </motion.div>
            ))}
          </div>

          {/* Evidência + CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white/5 border border-white/15 rounded-3xl p-8 md:p-10">
            <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <p className="font-body text-primary-foreground/60 text-xs uppercase tracking-wider font-semibold mb-2">Evidência clínica</p>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-primary mb-3">
                  77% de redução em emergências hipoglicêmicas na escola
                </h3>
                <p className="font-body text-primary-foreground/70 leading-relaxed mb-6">
                  Em escolas que implementaram o método Gamellito, episódios de emergência caíram drasticamente — resultado de educadores informados e protocolo claro.
                </p>
                <a
                  href="mailto:gamellitoltda@gmail.com?subject=Quero%20o%20Gamellito%20na%20minha%20escola"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gamellito-health-green text-white font-body font-bold rounded-full hover:bg-gamellito-health-green/90 transition-colors text-base shadow-lg shadow-gamellito-health-green/20"
                >
                  Quero o Gamellito na minha escola
                </a>
              </div>
              <div className="flex flex-col gap-4 md:min-w-[140px]">
                {[
                  { numero: "2.000+", label: "crianças alcançadas" },
                  { numero: "12 anos", label: "de pesquisa" },
                  { numero: "USP + UEL", label: "validação científica" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center bg-white/8 rounded-2xl p-4 border border-white/10">
                    <p className="font-display text-xl font-bold text-primary">{stat.numero}</p>
                    <p className="font-body text-primary-foreground/55 text-xs mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   SEÇÃO: ENFERMAGEM E SAÚDE
════════════════════════════════════════════════════════ */

function TabEnfermagem() {
  async function handlePartnershipClick() {
    await trackIntent("nursing_partnership_request", "/para-familias");
  }

  return (
    <>
      {/* ── Impacto em números ── */}
      <section className="py-16 px-4 bg-gamellito-hospital-purple/5">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gamellito-hospital-purple/15 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-gamellito-hospital-purple" />
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground">
                Gamellito como recurso de educação em saúde
              </h2>
            </div>
            <p className="font-body text-muted-foreground max-w-2xl leading-relaxed">
              Desenvolvido em parceria com USP e UEL, o método Gamellito é uma ferramenta
              validada para educação em saúde com crianças com Diabetes Tipo 1.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
            {impactoData.map((item, i) => (
              <motion.div key={item.descricao} initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-card rounded-2xl p-5 border border-border text-center">
                <p className="font-display text-2xl md:text-3xl font-bold text-primary mb-1">{item.numero}</p>
                <p className="font-body text-muted-foreground text-xs leading-relaxed">{item.descricao}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Metodologia ── */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">
              A metodologia em detalhe
            </h2>
            <p className="font-body text-muted-foreground max-w-2xl">
              O método Gamellito integra ludoterapia, narrativa e gamificação para alcançar resultados mensuráveis em educação em saúde.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {metodologiaSaude.map((item, i) => (
              <motion.div key={item.titulo} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-card rounded-2xl p-6 border border-border">
                <div className="w-10 h-10 rounded-xl bg-gamellito-hospital-purple/10 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-gamellito-hospital-purple" />
                </div>
                <h3 className="font-display font-bold text-foreground mb-2">{item.titulo}</h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">{item.texto}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Onde aplicar ── */}
      <section className="py-16 px-4 bg-muted/40">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">
              Onde o Gamellito pode ser aplicado
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {ondeAplicar.map((local, i) => (
              <motion.div key={local} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border">
                <span className="w-2 h-2 rounded-full bg-gamellito-hospital-purple flex-shrink-0" />
                <span className="font-body text-foreground text-sm">{local}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA parceria fake door ── */}
      <section className="py-16 px-4 bg-gamellito-space">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <AssetImage asset="gamellitoEAmigos" alt="Equipe Gamellito" className="w-40 h-auto mx-auto mb-6" width={160} height={120} />
            <h2 className="font-display text-3xl font-bold text-primary mb-4">
              Leve o Gamellito para o seu serviço de saúde
            </h2>
            <p className="font-body text-primary-foreground/80 leading-relaxed mb-8 max-w-xl mx-auto">
              Oferecemos demonstrações, treinamentos e materiais adaptados para equipes de enfermagem, endopediatria e educação em saúde. Entre em contato para saber como implementar o método.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={handlePartnershipClick}
                className="px-8 py-3 bg-primary text-primary-foreground font-body font-semibold rounded-full hover:bg-primary/90 transition-colors"
              >
                Solicitar demonstração
              </button>
              <a
                href="mailto:gamellitoltda@gmail.com"
                className="px-8 py-3 border border-white/20 text-primary-foreground font-body font-semibold rounded-full hover:border-primary/40 transition-colors"
              >
                Fale com a equipe
              </a>
            </div>
            <p className="font-body text-primary-foreground/40 text-xs mt-4">
              Em breve: plataforma de parceiros para instituições de saúde.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   SEÇÃO: ECOSSISTEMA GAMELLITO
════════════════════════════════════════════════════════ */

function EcosistemaSection() {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
            O Gamellito é um ecossistema completo
          </h2>
          <p className="font-body text-lg text-muted-foreground text-center max-w-2xl mx-auto leading-relaxed">
            Integra jogo digital, livros, Diário e programas para acompanhar crianças e adolescentes na jornada do Diabetes Tipo 1.
          </p>
        </motion.div>

        <div className="space-y-6">
          {[
            { titulo: "Jogo Digital", desc: "Aprendizado gamificado sobre DM1, insulina e glicemia de forma lúdica." },
            { titulo: "Livros Ilustrados", desc: "Guias impressos para famílias compreenderem o diagnóstico." },
            { titulo: "Diário do Gamellito", desc: "Rastreamento seguro e sem julgamentos. Registro protegido da jornada." },
            { titulo: "Programas & Formação", desc: "Implementação em escolas, ambulatórios e serviços de saúde." },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-2xl p-6 border border-border hover:border-primary/30 transition-colors"
            >
              <h3 className="font-display font-bold text-lg text-foreground mb-2">{item.titulo}</h3>
              <p className="font-body text-muted-foreground leading-relaxed text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-10">
          <p className="font-body text-muted-foreground mb-6">Quer levar o Gamellito para o seu contexto?</p>
          <GamButton href="mailto:gamellitoltda@gmail.com" variant="primary" size="lg">
            Falar com a equipe
          </GamButton>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE COMPONENT
════════════════════════════════════════════════════════ */

export default function ParaFamiliasPage() {
  const [activeTab, setActiveTab] = useState<Tab>("familias");

  const heroContent: Record<Tab, { titulo: string; subtitulo: string; tag: string }> = {
    familias: {
      tag: "Espaço para famílias",
      titulo: "Você não está sozinho nessa jornada",
      subtitulo: "Informações confiáveis, dicas práticas e apoio para navegar o diagnóstico de DM1 com mais segurança e leveza.",
    },
    educadores: {
      tag: "Para educadores",
      titulo: "A escola faz parte do tratamento",
      subtitulo: "Professores informados são aliados fundamentais para a segurança e inclusão da criança com DM1.",
    },
    enfermagem: {
      tag: "Para profissionais de saúde",
      titulo: "Educação em saúde que transforma",
      subtitulo: "Conheça o método Gamellito e como ele pode ser integrado à sua prática clínica e educativa.",
    },
  };

  const hero = heroContent[activeTab];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-28 pb-0 bg-gamellito-space px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center gap-8 pb-12"
          >
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="text-gamellito-orange font-body font-semibold text-sm uppercase tracking-wider mb-3">
                    {hero.tag}
                  </p>
                  <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mb-5 leading-tight">
                    {hero.titulo}
                  </h1>
                  <p className="font-body text-primary-foreground/90 text-lg leading-relaxed">
                    {hero.subtitulo}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex-shrink-0">
              <AssetImage
                asset="heroGigante"
                alt="Gamellito"
                className="w-56 h-auto"
                width={224}
                height={280}
              />
            </div>
          </motion.div>

          {/* ── Pilares do ecossistema ── */}
          <div className="grid md:grid-cols-3 gap-3 mb-8">
            {(
              [
                { id: "familias", titulo: "Para famílias", desc: "Guia prático, apoio emocional e o Diário do Gamellito." },
                { id: "educadores", titulo: "Para escolas", desc: "Programa completo, kit físico e formação de professores." },
                { id: "enfermagem", titulo: "Para saúde", desc: "Método validado com USP e UEL para equipes clínicas." },
              ] as { id: Tab; titulo: string; desc: string }[]
            ).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveTab(p.id)}
                className={`text-left rounded-2xl p-4 border transition-all ${
                  activeTab === p.id
                    ? "bg-white/12 border-primary/40"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <p className="font-display font-bold text-primary text-sm mb-1">{p.titulo}</p>
                <p className="font-body text-primary-foreground/60 text-xs leading-relaxed">{p.desc}</p>
              </button>
            ))}
          </div>

          {/* ── Navegação por abas ── */}
          <div className="flex gap-2 overflow-x-auto pb-0 -mb-px scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-t-2xl font-body font-semibold text-sm transition-all border-t-2 border-x-2 ${
                  activeTab === tab.id
                    ? "bg-background text-foreground border-gamellito-hospital-purple/30 border-b-background"
                    : "bg-white/8 text-primary-foreground/70 border-transparent hover:bg-white/15"
                }`}
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Conteúdo da aba ativa ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "familias" && <TabFamilias />}
          {activeTab === "educadores" && <TabEducadores />}
          {activeTab === "enfermagem" && <TabEnfermagem />}
        </motion.div>
      </AnimatePresence>

      <EcosistemaSection />

      <FooterSection />
    </div>
  );
}
