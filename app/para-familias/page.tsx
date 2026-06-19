"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { AssetImage } from "@/components/SiteAssets";
import { BookOpen, ChefHat, Smartphone, Heart, School, AlertCircle } from "@/components/icons";

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
];

/* ── Página ── */

export default function ParaFamiliasPage() {
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
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-center"
          >
            <h2 className="font-display text-2xl font-bold text-primary">
              Fontes confiáveis de apoio
            </h2>
            <p className="font-body text-primary-foreground/70 mt-2 text-sm">
              Organizações que oferecem informação, suporte e defesa de direitos para famílias com DM1.
            </p>
          </motion.div>
          <div className="flex flex-col gap-3">
            {links.map((l, i) => (
              <motion.a
                key={l.nome}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-primary-foreground/8 hover:bg-primary-foreground/14 border border-primary-foreground/15 rounded-2xl p-4 flex flex-col gap-1 transition-colors group"
              >
                <span className="font-display font-semibold text-primary group-hover:underline">
                  {l.nome}
                </span>
                <span className="font-body text-sm text-primary-foreground/70">
                  {l.descricao}
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="py-20 px-4 bg-background">
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
              Tem dúvidas? Fale com a gente
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">
              Podemos conversar sobre como levar o Gamellito para o dia a dia da sua família, escola ou ambulatório.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:gamellitoltda@gmail.com"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body font-semibold rounded-full hover:bg-primary/90 transition-colors"
              >
                Enviar e-mail
              </a>
              <a
                href="https://instagram.com/gamellito"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border text-foreground font-body font-semibold rounded-full hover:border-primary/40 transition-colors"
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
