"use client";

import { motion } from "framer-motion";
import Link from "next/link";
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
  Baby,
  BookMarked,
  Smartphone,
  ChefHat,
} from "@/components/icons";
import { trackIntent } from "@/lib/trackIntent";

/* ── Dados ── */

const stats = [
  { numero: "2.000+", descricao: "crianças alcançadas" },
  { numero: "12 anos", descricao: "de pesquisa e desenvolvimento" },
  { numero: "3 prêmios", descricao: "internacionais" },
  { numero: "USP + UEL", descricao: "parceiras científicas" },
];

const desafios = [
  {
    icon: Heart,
    titulo: "O diagnóstico muda tudo",
    texto: "Choque, medo e incerteza são reações normais. A maioria das famílias se sente perdida nos primeiros dias — e não precisam estar.",
  },
  {
    icon: AlertCircle,
    titulo: "Rotina que parece impossível",
    texto: "Insulina, monitoramento, contagem de carboidratos… tantos conceitos novos chegando ao mesmo tempo, para pais e crianças.",
  },
  {
    icon: School,
    titulo: "A escola não sabe o que fazer",
    texto: "Professores sem preparo e família sem apoio deixam a criança no meio. A integração escolar é um dos maiores desafios do DM1.",
  },
];

const recursos = [
  {
    titulo: "Jogo digital",
    descricao: "Crianças de 5 a 14 anos aprendem sobre insulina, glicemia e carboidratos brincando — no celular ou tablet.",
    icon: Smartphone,
    tag: "Em desenvolvimento",
  },
  {
    titulo: "Livros ilustrados",
    descricao: "A série 'Enfrentando o Diabetes Tipo 1' explica o DM1 com personagens cativantes e linguagem acessível para crianças.",
    icon: BookOpen,
    tag: "Disponível",
  },
  {
    titulo: "Oficinas culinárias",
    descricao: "Atividades práticas onde crianças aprendem alimentação saudável e contagem de carboidratos de forma lúdica e segura.",
    icon: ChefHat,
    tag: "Para escolas e ambulatórios",
  },
];

const primeirosPassos = [
  {
    periodo: "Dias 1–3",
    titulo: "Absorver o diagnóstico",
    texto: "Foque no essencial: insulina, monitoramento básico e descanso. Não tente aprender tudo de uma vez.",
  },
  {
    periodo: "Semana 1",
    titulo: "Equipe multidisciplinar",
    texto: "Conheça o endocrinologista, a nutricionista e a enfermeira educadora. Anote todas as dúvidas.",
  },
  {
    periodo: "Semanas 2–3",
    titulo: "Rotina de monitoramento",
    texto: "Comece a registrar as medições. Registros ajudam a visualizar padrões glicêmicos e orientar ajustes.",
  },
  {
    periodo: "Mês 1",
    titulo: "Comunicar a escola",
    texto: "Leve um plano de manejo escrito. A escola tem obrigação legal de acolher a criança com DM1 (Lei nº 13.230/2015).",
  },
];

const links = [
  {
    nome: "ANAD – Associação Nacional de Assistência ao Diabético",
    url: "https://www.anad.org.br",
    descricao: "Suporte, informação e defesa dos direitos de pessoas com diabetes.",
  },
  {
    nome: "SBD – Sociedade Brasileira de Diabetes",
    url: "https://www.diabetes.org.br",
    descricao: "Diretrizes clínicas e orientações para pacientes e famílias.",
  },
  {
    nome: "JDRF Brasil",
    url: "https://jdrf.org.br",
    descricao: "Organização focada em pesquisa e cura do Diabetes Tipo 1.",
  },
  {
    nome: "Gamellito no Instagram",
    url: "https://instagram.com/gamellitoltda",
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

/* ── Página ── */

const sentimentosDiagnostico = [
  {
    svg: "/characters/gamellito-diagnostico-medo.svg",
    fase: "Medo e choque",
    texto: "A primeira reação é normal. O diagnóstico chega de surpresa e o medo é uma resposta saudável — não uma fraqueza.",
    cor: "#F26A00",
  },
  {
    svg: "/characters/gamellito-diagnostico-tristeza.svg",
    fase: "Tristeza",
    texto: 'Sentir luto pelo "antes" do diagnóstico é esperado. Dar espaço para esse sentimento faz parte da cura emocional.',
    cor: "#9B8CF0",
  },
  {
    svg: "/characters/gamellito-diagnostico-raiva.svg",
    fase: "Raiva e culpa",
    texto: '"Por que comigo?" ou "Será que foi culpa minha?" são perguntas comuns. Ninguém é responsável pelo DM1.',
    cor: "#E27400",
  },
  {
    svg: "/characters/gamellito-diagnostico-adaptacao.svg",
    fase: "Adaptação",
    texto: "Com o tempo, o DM1 se torna parte da rotina. Crianças e famílias se adaptam — e o Gamellito está aqui nessa jornada.",
    cor: "#2B9956",
  },
];

export default function ParaFamiliasPage() {
  function handlePartnershipClick() {
    window.location.href = "mailto:gamellitoltda@gmail.com?subject=Quero%20saber%20sobre%20parceria";
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-28 pb-16 bg-gamellito-space px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1"
            >
              <p className="text-gamellito-orange font-body font-semibold text-sm uppercase tracking-wider mb-3">
                Para famílias com DM1
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mb-5 leading-tight">
                Você não está sozinho nessa jornada
              </h1>
              <p className="font-body text-primary-foreground/90 text-lg leading-relaxed mb-8 max-w-xl">
                O Gamellito é o aliado lúdico da sua família — jogos, livros e
                recursos para transformar o diagnóstico de DM1 em superação.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/jogos/experimente"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-display font-bold rounded-full hover:bg-primary/90 transition-colors"
                >
                  Experimentar o jogo
                </Link>
                <a
                  href="mailto:gamellitoltda@gmail.com"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary-foreground/30 text-primary-foreground font-body font-semibold rounded-full hover:border-primary hover:text-primary transition-colors"
                >
                  Fale conosco
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-shrink-0"
            >
              <AssetImage
                asset="medicoMaeGamellito"
                alt="Médico e família com o Gamellito"
                className="w-56 md:w-72 h-auto"
                width={288}
                height={220}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 bg-gamellito-space/90 border-t border-primary-foreground/10 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, i) => (
              <motion.div
                key={s.numero}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="font-display text-3xl font-bold text-primary mb-1">
                  {s.numero}
                </div>
                <div className="font-body text-sm text-primary-foreground/70">
                  {s.descricao}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Desafio ── */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm font-body font-semibold text-primary uppercase tracking-wider mb-2">
              O que as famílias enfrentam
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              O diagnóstico de DM1 não avisa
            </h2>
            <p className="font-body text-muted-foreground mt-3 max-w-xl mx-auto">
              Em minutos, a vida muda. Os primeiros meses são os mais difíceis — mas não precisam ser solitários.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {desafios.map((d, i) => (
              <motion.div
                key={d.titulo}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl border border-border p-6 flex flex-col gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-gamellito-orange/10 flex items-center justify-center flex-shrink-0">
                  <d.icon className="w-5 h-5 text-gamellito-orange" />
                </div>
                <h3 className="font-display font-bold text-foreground text-lg">
                  {d.titulo}
                </h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">
                  {d.texto}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Sentimentos normais do diagnóstico */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 mb-4"
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {sentimentosDiagnostico.map((s, i) => (
              <motion.div
                key={s.fase}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl border border-border p-5 flex flex-col items-center text-center gap-4"
                style={{ borderTopColor: s.cor, borderTopWidth: 3 }}
              >
                <img
                  src={s.svg}
                  alt={s.fase}
                  className="w-28 h-auto"
                  loading="lazy"
                />
                <div>
                  <p className="font-display font-bold text-foreground mb-1" style={{ color: s.cor }}>{s.fase}</p>
                  <p className="font-body text-muted-foreground text-sm leading-relaxed">{s.texto}</p>
                </div>
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

      {/* ── Como ajudamos ── */}
      <section className="py-20 px-4 bg-gamellito-bg-yellow/30">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm font-body font-semibold text-primary uppercase tracking-wider mb-2">
              Nossos recursos
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              O Gamellito ao lado da sua família
            </h2>
            <p className="font-body text-muted-foreground mt-3 max-w-xl mx-auto">
              Ferramentas lúdicas criadas para transformar o manejo do DM1 em algo que a criança entende — e abraça.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {recursos.map((r, i) => (
              <motion.div
                key={r.titulo}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl border border-border p-6 flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <r.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-body font-semibold text-muted-foreground bg-muted rounded-full px-3 py-1">
                    {r.tag}
                  </span>
                </div>
                <h3 className="font-display font-bold text-foreground text-lg">
                  {r.titulo}
                </h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">
                  {r.descricao}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Primeiros passos ── */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-sm font-body font-semibold text-primary uppercase tracking-wider mb-2">
              Guia prático
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Os primeiros 30 dias
            </h2>
            <p className="font-body text-muted-foreground mt-3 max-w-xl">
              Não tente aprender tudo de uma vez. Esta linha do tempo ajuda a organizar as primeiras semanas.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gamellito-orange/25 hidden sm:block" />
            <div className="space-y-5">
              {primeirosPassos.map((p, i) => (
                <motion.div
                  key={p.periodo}
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
                      {p.periodo}
                    </span>
                    <h3 className="font-display font-bold text-foreground mt-1 mb-2">
                      {p.titulo}
                    </h3>
                    <p className="font-body text-muted-foreground text-sm leading-relaxed">
                      {p.texto}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Links de apoio ── */}
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
                className="px-8 py-3 bg-primary text-primary-foreground font-body font-semibold rounded-full hover:bg-primary/90 transition-colors"
              >
                🩺 Solicitar demonstração
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

      <FooterSection />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SEÇÃO: ECOSSISTEMA GAMELLITO
════════════════════════════════════════════════════════ */

const cursosPreview = [
  {
    emoji: "🌱",
    titulo: "Primeiros Passos",
    subtitulo: "Para diagnóstico recente",
    descricao: "Do choque do diagnóstico à primeira rotina em casa. Um curso curto, acolhedor e com base clínica — criado para a semana mais difícil da sua vida.",
    cor: "gamellito-health-green",
    tag: "Em breve",
  },
  {
    emoji: "👩‍🍳",
    titulo: "Cozinha do Gamellito",
    subtitulo: "Oficinas de nutrição ao vivo",
    descricao: "Receitas adaptadas, contagem de carboidratos sem drama e culinária que a criança vai querer participar. Ao vivo com a equipe de nutrição da UEL.",
    cor: "gamellito-orange",
    tag: "Em breve",
  },
  {
    emoji: "🤝",
    titulo: "Comunidade Gamellito",
    subtitulo: "Suporte contínuo para sua família",
    descricao: "Lives com a equipe multidisciplinar, biblioteca de recursos, espaço para tirar dúvidas e conexão com outras famílias que entendem o que você vive.",
    cor: "gamellito-yellow",
    tag: "Em breve",
  },
];

function EcosistemaSection() {
  return (
    <section className="py-20 px-4 bg-gamellito-space relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gamellito-orange/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gamellito-health-green/5 rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto max-w-4xl relative">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="inline-block bg-gamellito-orange/20 text-gamellito-orange font-body font-semibold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            Soluções do ecossistema
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary mb-5 leading-tight">
            Um ecossistema completo —<br className="hidden sm:block" />
            <span className="text-gamellito-orange"> para famílias, escolas e saúde</span>
          </h2>
          <p className="font-body text-primary-foreground/75 text-lg leading-relaxed max-w-2xl mx-auto">
            Estamos construindo um espaço onde famílias com DM1 encontram acolhimento, aprendizado e comunidade — tudo com a leveza e o rigor clínico que são a alma do Gamellito.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {cursosPreview.map((curso, i) => (
            <motion.div key={curso.titulo} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative bg-white/6 border border-white/12 rounded-2xl p-6 flex flex-col gap-4 overflow-hidden">
              <span className="absolute top-4 right-4 bg-white/10 text-primary-foreground/60 font-body text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
                🔒 {curso.tag}
              </span>
              <div className="text-4xl">{curso.emoji}</div>
              <div>
                <p className="font-body text-xs font-semibold uppercase tracking-wider text-primary-foreground/50 mb-1">{curso.subtitulo}</p>
                <h3 className="font-display font-bold text-primary text-xl mb-2">{curso.titulo}</h3>
                <p className="font-body text-primary-foreground/65 text-sm leading-relaxed">{curso.descricao}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="bg-white/5 border border-white/15 rounded-3xl p-8 md:p-10 text-center">
          <AssetImage asset="gamellitoContente" alt="Gamellito contente" className="w-20 h-auto mx-auto mb-5" width={80} height={80} />
          <h3 className="font-display text-2xl md:text-3xl font-bold text-primary mb-3">Cadastre-se e seja o primeiro a saber</h3>
          <p className="font-body text-primary-foreground/70 leading-relaxed mb-8 max-w-lg mx-auto">
            Os cursos estão em desenvolvimento — mas você já pode criar sua conta gratuita no ecossistema Gamellito. Quando os conteúdos chegarem, você será o primeiro a acessar. E sua conta já serve para acompanhar o Diário do Gamellito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <a href="/diario/login" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gamellito-orange text-white font-body font-bold rounded-full hover:bg-gamellito-orange/90 transition-colors text-base shadow-lg shadow-gamellito-orange/20">
              ✨ Criar minha conta gratuita
            </a>
            <a href="/diario/login" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-white/20 text-primary-foreground/80 font-body font-semibold rounded-full hover:border-primary/50 hover:text-primary transition-colors text-base">
              Já tenho conta — entrar
            </a>
          </div>
          <p className="font-body text-primary-foreground/35 text-xs">Gratuito. Sem spam. Só atualizamos quando há novidade real.</p>
        </motion.div>
      </div>
    </section>
  );
}

