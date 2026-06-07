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
  Phone,
  Stethoscope,
  GraduationCap,
  ShieldCheck,
  Clock,
  FileText,
  Lightbulb,
  Baby,
  BookMarked,
} from "@/components/icons";
import { trackIntent } from "@/lib/trackIntent";

/* ═══════════════════════════════════════════════════════
   DADOS — PAIS E FAMÍLIA
════════════════════════════════════════════════════════ */

const emocoesItems = [
  {
    emoji: "😰",
    fase: "Choque e negação",
    texto:
      "É normal sentir que o diagnóstico não pode ser verdade. Muitos pais descrevem um entorpecimento nos primeiros dias. Isso é uma resposta natural do organismo a uma notícia impactante.",
  },
  {
    emoji: "😢",
    fase: "Medo e tristeza",
    texto:
      "Preocupações com a saúde do filho, com a hipoglicemia noturna, com a escola — tudo isso aparece ao mesmo tempo. Permitir-se sentir e chorar faz parte do processo.",
  },
  {
    emoji: "😠",
    fase: "Raiva e culpa",
    texto:
      '"Por que meu filho?" É uma pergunta comum. A culpa não tem base — DM1 não é causado por alimentação ou por algo que os pais fizeram ou deixaram de fazer.',
  },
  {
    emoji: "🤝",
    fase: "Adaptação",
    texto:
      "Com tempo e apoio, a rotina começa a se reorganizar. A família aprende a incorporar insulina, monitoramento e alimentação equilibrada na vida cotidiana.",
  },
  {
    emoji: "💪",
    fase: "Empoderamento",
    texto:
      "Muitas famílias chegam a um ponto em que se sentem seguras e competentes no manejo do DM1. Conhecimento e rede de apoio são os maiores aliados.",
  },
];

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
    emoji: "🧠",
    titulo: "Autonomia progressiva",
    texto: "Adolescentes precisam assumir o próprio manejo gradualmente. Evite superproteger — o excesso de controle gera rebeldia em relação ao tratamento.",
  },
  {
    emoji: "🎉",
    titulo: "Baladas e festas",
    texto: "Álcool pode mascarar sintomas de hipoglicemia. Oriente sobre os riscos com empatia, não com proibições absolutas. Tenha um plano combinado com o adolescente.",
  },
  {
    emoji: "📱",
    titulo: "Saúde mental digital",
    texto: "Redes sociais podem gerar comparação e angústia. Incentive grupos online de jovens com DM1 — a identificação com pares é poderosa nessa fase.",
  },
  {
    emoji: "🏃",
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
    icon: Lightbulb,
    titulo: "Aula de ciências",
    texto: "Use os cenários do Gamellito para explicar como o corpo usa energia, o papel do pâncreas e o que é a insulina — de forma visual e lúdica.",
  },
  {
    icon: Users,
    titulo: "Inclusão em sala",
    texto: "Promova rodas de conversa usando os personagens do Gamellito para desmistificar o DM1 e reduzir o estigma entre os colegas.",
  },
  {
    icon: BookMarked,
    titulo: "Material de apoio",
    texto: "Os livros ilustrados do Gamellito podem ser usados em hora de leitura ou como parte do acervo da biblioteca escolar.",
  },
  {
    icon: GraduationCap,
    titulo: "Formação de professores",
    texto: "Solicite uma oficina Gamellito na sua escola — treinamos educadores para apoiar alunos com DM1 com segurança e confiança.",
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

/* ═══════════════════════════════════════════════════════
   ABAS — componente de navegação
════════════════════════════════════════════════════════ */

type Tab = "familias" | "educadores" | "enfermagem";

const tabs: { id: Tab; label: string; emoji: string }[] = [
  { id: "familias", label: "Pais e Família", emoji: "👨‍👩‍👧" },
  { id: "educadores", label: "Educadores e Escolas", emoji: "🏫" },
  { id: "enfermagem", label: "Enfermagem e Saúde", emoji: "🩺" },
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
              <div className="grid md:grid-cols-[1fr_56px_1fr] gap-4 md:gap-6 items-start">
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
                  <div className="text-center mb-4">
                    <span className="inline-block rounded-full bg-gamellito-orange text-white font-display text-sm px-4 py-1 mb-3">Tipo 1</span>
                    <AssetImage asset="gamellitoCorpinho" alt="Personagem Gamellito" className="w-20 h-auto mx-auto" width={80} height={80} />
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
                <div className="flex items-center justify-center py-4 md:py-0 md:mt-16">
                  <span className="font-display text-4xl md:text-5xl text-gamellito-yellow font-bold select-none">≠</span>
                </div>
                <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
                  <div className="text-center mb-4">
                    <span className="inline-block rounded-full bg-gamellito-blue text-white font-display text-sm px-4 py-1 mb-3">Tipo 2</span>
                    <AssetImage asset="olhoDesconfiado" alt="Não confunda DM1 com DM2" className="w-16 h-auto mx-auto opacity-80" width={64} height={64} />
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
              <AssetImage asset="maeGamellitoGlicemia" alt="Mãe e criança monitorando glicemia" className="w-28 h-auto mx-auto block mb-3" width={112} height={80} />
              <span className="inline-block rounded-full bg-gamellito-health-green/15 text-gamellito-health-green text-xs font-display px-3 py-1 mb-3">Capítulo 4</span>
              <h3 className="font-display font-bold text-xl text-gamellito-health-green mb-3">O tratamento atual</h3>
              <p className="font-body text-foreground/70 text-sm leading-relaxed mb-4">
                Não existe cura ainda, mas o controle é muito eficaz. Quatro pilares sustentam uma vida plena com DM1:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { asset: "seringa", label: "Insulinoterapia" },
                  { asset: "glicosimetro", label: "Monitoramento" },
                  { asset: "geladeira", label: "Alimentação" },
                  { asset: "bicicleta", label: "Atividade física" },
                ].map((pilar) => (
                  <div key={pilar.label} className="rounded-xl bg-white/40 dark:bg-white/5 border border-gamellito-health-green/25 p-3 text-center">
                    <AssetImage asset={pilar.asset as any} alt={pilar.label} className="w-9 h-9 mx-auto mb-1 object-contain" width={36} height={36} />
                    <span className="font-display text-xs text-gamellito-health-green font-bold block">{pilar.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Jornada emocional ── */}
      <section className="py-16 px-4 bg-muted/40">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gamellito-mae-red/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-gamellito-mae-red" />
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground">A jornada emocional dos pais</h2>
            </div>
            <p className="font-body text-muted-foreground leading-relaxed max-w-2xl">
              O que você está sentindo tem nome — e muitas famílias passaram ou passam pelo mesmo.
            </p>
          </motion.div>
          <div className="space-y-4">
            {emocoesItems.map((item, i) => (
              <motion.div key={item.fase} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex gap-4 bg-card rounded-2xl p-5 border border-border">
                <span className="text-3xl flex-shrink-0 mt-0.5">{item.emoji}</span>
                <div>
                  <h3 className="font-display font-bold text-foreground mb-1">{item.fase}</h3>
                  <p className="font-body text-muted-foreground text-sm leading-relaxed">{item.texto}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-8 bg-gamellito-purple/10 border border-gamellito-purple/20 rounded-2xl p-6">
            <p className="font-body text-foreground leading-relaxed">
              <strong className="font-semibold">Lembre-se:</strong> buscar apoio psicológico não é fraqueza — é autocuidado. Pais que cuidam da própria saúde mental cuidam melhor dos filhos.
            </p>
          </motion.div>
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
                <span className="text-2xl mb-3 block">{item.emoji}</span>
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
            <AssetImage asset="maeGamellitoGlicemia" alt="Mãe monitorando glicemia com Gamellito" className="w-44 h-auto flex-shrink-0" width={176} height={130} />
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
              <a href="/jogos/experimente" className="inline-block mt-6 px-6 py-3 bg-primary text-primary-foreground font-body font-semibold rounded-xl hover:bg-primary/90 transition-colors">
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
  async function handleGuideClick() {
    await trackIntent("educator_guide_download", "/para-familias");
  }

  return (
    <>
      {/* ── Por que a escola precisa saber ── */}
      <section className="py-16 px-4 bg-gamellito-health-green/5">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gamellito-health-green/15 flex items-center justify-center">
                <School className="w-5 h-5 text-gamellito-health-green" />
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground">
                Por que a escola precisa saber sobre DM1?
              </h2>
            </div>
            <p className="font-body text-muted-foreground leading-relaxed max-w-2xl">
              A criança com DM1 passa até 8 horas por dia na escola. Educadores
              informados fazem toda a diferença na segurança e inclusão do aluno.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { emoji: "⏱️", titulo: "Resposta rápida salva vidas", texto: "Em uma crise de hipoglicemia, cada minuto conta. Professores treinados sabem agir antes da chegada dos pais." },
              { emoji: "🤝", titulo: "Inclusão real", texto: "Um aluno que se sente seguro na escola aprende melhor, faz amigos e desenvolve autonomia no manejo da doença." },
              { emoji: "📋", titulo: "Obrigação legal", texto: "A legislação brasileira obriga as escolas a acolherem e apoiarem alunos com DM1. Estar preparado é cumprir a lei." },
            ].map((item, i) => (
              <motion.div key={item.titulo} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-card rounded-2xl p-6 border border-border text-center">
                <span className="text-4xl block mb-3">{item.emoji}</span>
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
                O que reconhecer em sala de aula
              </h2>
            </div>
            <p className="font-body text-muted-foreground max-w-2xl">
              Dois cenários que educadores devem saber identificar e agir com segurança.
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
                Direitos do aluno com DM1 na escola
              </h2>
            </div>
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

      {/* ── Como usar o Gamellito na escola ── */}
      <section className="py-16 px-4 bg-gamellito-space">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <h2 className="font-display text-3xl font-bold text-primary mb-3">
              Como usar o Gamellito na sua escola
            </h2>
            <p className="font-body text-primary-foreground/80 max-w-2xl">
              O método Gamellito foi desenvolvido para funcionar tanto em casa quanto em contextos educacionais.
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

          {/* CTA fake door */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-primary/15 border border-primary/30 rounded-2xl p-8 text-center">
            <span className="text-4xl block mb-3">📚</span>
            <h3 className="font-display text-2xl font-bold text-primary mb-3">Guia do Educador</h3>
            <p className="font-body text-primary-foreground/80 mb-6 max-w-md mx-auto">
              Um material completo com protocolos, atividades e orientações para educadores. Em breve disponível para download.
            </p>
            <button
              type="button"
              onClick={handleGuideClick}
              className="px-8 py-3 bg-primary text-primary-foreground font-body font-semibold rounded-xl hover:bg-primary/90 transition-colors"
            >
              📥 Quero o Guia do Educador
            </button>
            <p className="font-body text-primary-foreground/50 text-xs mt-3">Em desenvolvimento — seu interesse ajuda a priorizar o lançamento.</p>
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
            <AssetImage asset="medicoMaeGamellito" alt="Equipe Gamellito" className="w-40 h-auto mx-auto mb-6" width={160} height={120} />
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
                className="px-8 py-3 bg-primary text-primary-foreground font-body font-semibold rounded-xl hover:bg-primary/90 transition-colors"
              >
                🩺 Solicitar demonstração
              </button>
              <a
                href="mailto:gamellitoltda@gmail.com"
                className="px-8 py-3 border border-white/20 text-primary-foreground font-body font-semibold rounded-xl hover:border-primary/40 transition-colors"
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
                asset="medicoMaeGamellito"
                alt="Médico e família Gamellito"
                className="w-52 h-auto"
                width={208}
                height={160}
              />
            </div>
          </motion.div>

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
                <span>{tab.emoji}</span>
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

      {/* ── CTA Contato (sempre visível) ── */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <AssetImage asset="gamellitoContente" alt="Gamellito contente" className="w-24 h-auto mx-auto mb-6" width={96} height={96} />
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">Tem dúvidas ou quer saber mais?</h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">
              Entre em contato com a equipe Gamellito. Podemos conversar sobre como levar o método para o ambulatório, escola ou comunidade da sua família.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:gamellitoltda@gmail.com" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body font-semibold rounded-xl hover:bg-primary/90 transition-colors">
                <Phone className="w-4 h-4" />
                Fale conosco
              </a>
              <a href="https://instagram.com/gamellito" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border text-foreground font-body font-semibold rounded-xl hover:border-primary/40 hover:text-primary transition-colors">
                Siga no Instagram
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
