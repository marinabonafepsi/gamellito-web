"use client";

import { motion } from "framer-motion";
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
} from "@/components/icons";

/* ─────────────────────────────────────────── */
/* Data                                        */
/* ─────────────────────────────────────────── */

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

/* ─────────────────────────────────────────── */
/* Page Component                             */
/* ─────────────────────────────────────────── */

export default function ParaFamiliasPage() {
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
            className="flex flex-col md:flex-row items-center gap-8"
          >
            <div className="flex-1">
              <p className="text-gamellito-orange font-body font-semibold text-sm uppercase tracking-wider mb-3">
                Espaço para famílias
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mb-5 leading-tight">
                Você não está sozinho nessa jornada
              </h1>
              <p className="font-body text-primary-foreground/90 text-lg leading-relaxed">
                Receber o diagnóstico de Diabetes Tipo 1 no filho é uma virada de chave.
                Aqui você encontra informações confiáveis, dicas práticas e apoio para
                navegar esse caminho com mais segurança e leveza.
              </p>
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
        </div>
      </section>

      {/* ── O que é DM1 ── */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground">
                Entendendo o Diabetes Tipo 1
              </h2>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                titulo: "O que acontece no corpo",
                texto:
                  "No DM1, o sistema imunológico ataca as células beta do pâncreas — as responsáveis por produzir insulina. Sem insulina, a glicose (açúcar) não consegue entrar nas células para gerar energia e se acumula no sangue. Por isso a reposição de insulina é essencial e contínua.",
              },
              {
                titulo: "DM1 ≠ DM2",
                texto:
                  "O Diabetes Tipo 1 é autoimune e não está relacionado à alimentação ou estilo de vida. Já o Tipo 2 está associado à resistência à insulina, geralmente em adultos. As causas, o tratamento e o manejo são diferentes — não confunda as informações.",
              },
              {
                titulo: "Sinais de alerta que levaram ao diagnóstico",
                texto:
                  "Sede excessiva (polidipsia), urina frequente (poliúria), perda de peso sem causa aparente, cansaço intenso e visão turva são os principais sintomas. Em casos graves, a cetoacidose diabética (CAD) pode ser a primeira manifestação.",
              },
              {
                titulo: "O tratamento atual",
                texto:
                  "Insulinoterapia (múltiplas aplicações ou bomba de insulina), monitoramento da glicemia (glicosímetro ou sensor contínuo), alimentação balanceada com contagem de carboidratos e atividade física regular. O controle é possível e uma vida plena também.",
              },
            ].map((card, i) => (
              <motion.div
                key={card.titulo}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-2xl p-6 border border-border"
              >
                <h3 className="font-display font-bold text-lg text-foreground mb-2">
                  {card.titulo}
                </h3>
                <p className="font-body text-muted-foreground leading-relaxed text-sm">
                  {card.texto}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Jornada emocional ── */}
      <section className="py-16 px-4 bg-muted/40">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gamellito-mae-red/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-gamellito-mae-red" />
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground">
                A jornada emocional dos pais
              </h2>
            </div>
            <p className="font-body text-muted-foreground leading-relaxed max-w-2xl">
              O que você está sentindo tem nome — e muitas famílias passaram ou passam
              pelo mesmo. Reconhecer essas fases ajuda a pedir ajuda no momento certo.
            </p>
          </motion.div>

          <div className="space-y-4">
            {emocoesItems.map((item, i) => (
              <motion.div
                key={item.fase}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-4 bg-card rounded-2xl p-5 border border-border"
              >
                <span className="text-3xl flex-shrink-0 mt-0.5">{item.emoji}</span>
                <div>
                  <h3 className="font-display font-bold text-foreground mb-1">
                    {item.fase}
                  </h3>
                  <p className="font-body text-muted-foreground text-sm leading-relaxed">
                    {item.texto}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 bg-gamellito-purple/10 border border-gamellito-purple/20 rounded-2xl p-6"
          >
            <p className="font-body text-foreground leading-relaxed">
              <strong className="font-semibold">Lembre-se:</strong> buscar apoio
              psicológico não é fraqueza — é autocuidado. Pais que cuidam da própria saúde
              mental cuidam melhor dos filhos. Pergunte à equipe de saúde se há
              acompanhamento psicológico disponível no seu serviço.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Dicas do dia a dia ── */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gamellito-health-green/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-gamellito-health-green" />
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground">
                No dia a dia: guia prático
              </h2>
            </div>
            <p className="font-body text-muted-foreground leading-relaxed max-w-2xl">
              Pequenas ações consistentes fazem toda a diferença no controle do DM1.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {dicasDiarias.map((dica, i) => (
              <motion.div
                key={dica.titulo}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-2xl p-6 border border-border group hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <dica.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-foreground mb-2">
                  {dica.titulo}
                </h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">
                  {dica.texto}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gamellito pode ajudar ── */}
      <section className="py-16 px-4 bg-gamellito-space">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center gap-8"
          >
            <AssetImage
              asset="maeGamellitoGlicemia"
              alt="Mãe monitorando glicemia com Gamellito"
              className="w-44 h-auto flex-shrink-0"
              width={176}
              height={130}
            />
            <div>
              <h2 className="font-display text-3xl font-bold text-primary mb-4">
                Como o Gamellito pode ajudar sua família
              </h2>
              <p className="font-body text-primary-foreground/90 leading-relaxed mb-4">
                Os jogos e histórias do Gamellito foram criados para tornar o aprendizado
                sobre DM1 mais leve e significativo. Nos cenários e personagens, o
                tratamento aparece misturado com missões, mundo colorido e muito humor —
                porque criança aprende melhor brincando.
              </p>
              <ul className="space-y-2 font-body text-primary-foreground/80 text-sm">
                {[
                  "Reforça conceitos de glicemia, insulina e alimentação de forma lúdica",
                  "Reduz o estigma e o medo em torno do diagnóstico",
                  "Estimula a autonomia e a adesão ao tratamento",
                  "Pode ser usado em casa, na escola e no ambulatório",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="/jogos/experimente"
                className="inline-block mt-6 px-6 py-3 bg-primary text-primary-foreground font-body font-semibold rounded-xl hover:bg-primary/90 transition-colors"
              >
                Experimente os jogos
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gamellito-blue/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-gamellito-blue" />
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground">
                Perguntas frequentes
              </h2>
            </div>
            <p className="font-body text-muted-foreground">
              Dúvidas comuns de pais que acabaram de receber o diagnóstico.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-3">
              {faqItems.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="bg-card rounded-2xl border border-border px-5 data-[state=open]:border-primary/30"
                >
                  <AccordionTrigger className="font-display font-semibold text-foreground text-left hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="font-body text-muted-foreground leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* ── Recursos ── */}
      <section className="py-16 px-4 bg-muted/40">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gamellito-orange/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-gamellito-orange" />
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground">
                Redes de apoio e recursos
              </h2>
            </div>
            <p className="font-body text-muted-foreground">
              Você não precisa descobrir tudo sozinho. Essas organizações e comunidades
              podem fazer diferença.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            {recursosLinks.map((rec, i) => (
              <motion.a
                key={rec.nome}
                href={rec.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-2xl p-5 border border-border hover:border-primary/40 hover:shadow-md transition-all group"
              >
                <h3 className="font-display font-bold text-foreground group-hover:text-primary transition-colors mb-1">
                  {rec.nome}
                </h3>
                <p className="font-body text-muted-foreground text-sm">
                  {rec.descricao}
                </p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Contato ── */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <AssetImage
              asset="gamellitoContente"
              alt="Gamellito contente"
              className="w-24 h-auto mx-auto mb-6"
              width={96}
              height={96}
            />
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Tem dúvidas ou quer saber mais?
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">
              Entre em contato com a equipe Gamellito. Podemos conversar sobre como levar
              o método Gamellito para o ambulatório, escola ou comunidade da sua família.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:gamellitoltda@gmail.com"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body font-semibold rounded-xl hover:bg-primary/90 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Fale conosco
              </a>
              <a
                href="https://instagram.com/gamellito"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border text-foreground font-body font-semibold rounded-xl hover:border-primary/40 hover:text-primary transition-colors"
              >
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
