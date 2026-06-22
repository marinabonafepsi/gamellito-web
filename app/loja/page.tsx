"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { AssetImage, siteAssets } from "@/components/SiteAssets";
import { X } from "@/components/icons";
import { track } from "@/lib/analytics";

/* ═══════════════════════════════════════════════════════
   TIPOS
════════════════════════════════════════════════════════ */
type Disponibilidade = "disponivel" | "em-breve";

interface Produto {
  id: string;
  nome: string;
  subtitulo: string;
  descricao: string;
  tag: string;
  tagColor: string;
  asset: keyof typeof siteAssets;
  disponibilidade: Disponibilidade;
  cta?: string;
  ctaHref?: string;
}

/* ═══════════════════════════════════════════════════════
   PRODUTOS
════════════════════════════════════════════════════════ */
const produtosDisponiveis: Produto[] = [
  {
    id: "sherlockito",
    nome: "Sherlockito",
    subtitulo: "O detetive do diabetes — jogo digital",
    descricao:
      "Jogo digital onde a criança investiga pistas sobre DM1 com o Sherlockito. Aprende sobre glicemia, alimentação e insulina resolvendo mistérios. Gratuito, roda no navegador.",
    tag: "Disponível agora",
    tagColor: "bg-gamellito-health-green",
    asset: "controleVideogame",
    disponibilidade: "disponivel",
    cta: "Jogar grátis",
    ctaHref: "/jogar",
  },
  {
    id: "jogo-geladeira",
    nome: "Jogo da Geladeira",
    subtitulo: "Mini-jogo de contagem de carboidratos",
    descricao:
      "Escolha os alimentos certos para o Gamellito sem estourar a meta de carboidratos. Jogo rápido, educativo e viciante — direto no site.",
    tag: "Disponível agora",
    tagColor: "bg-gamellito-health-green",
    asset: "geladeira",
    disponibilidade: "disponivel",
    cta: "Jogar agora",
    ctaHref: "/#jogos",
  },
];

const produtosEmBreve: Produto[] = [
  {
    id: "livro-dm1",
    nome: "Livro Ilustrado",
    subtitulo: "Enfrentando o Diabetes Tipo 1",
    descricao:
      "Série de livros infantis com as aventuras do Gamellito. Linguagem acessível para crianças de 5 a 14 anos aprenderem sobre DM1 de forma leve.",
    tag: "Mais pedido",
    tagColor: "bg-gamellito-orange",
    asset: "gamellitoEAmigos",
    disponibilidade: "em-breve",
  },
  {
    id: "pelucia-gamellito",
    nome: "Pelúcia Gamellito",
    subtitulo: "O alien fofo com DM1",
    descricao:
      "A pelúcia oficial do Gamellito. Material macio e seguro — o companheiro perfeito para crianças que vivem com DM1 se sentirem acompanhadas.",
    tag: "Muito pedido",
    tagColor: "bg-gamellito-orange",
    asset: "gamellitoCorpinho",
    disponibilidade: "em-breve",
  },
  {
    id: "pelucia-pancreas",
    nome: "Pelúcia Pâncreas Preguiçoso",
    subtitulo: "O vilão mais fofo do universo",
    descricao:
      "O Pâncreas Preguiçoso em versão pelúcia. Perfeito para explicar o DM1 de forma lúdica para crianças e famílias.",
    tag: "Fan favorite",
    tagColor: "bg-gamellito-hospital-purple",
    asset: "pancreasPreguicoso",
    disponibilidade: "em-breve",
  },
  {
    id: "kit-gadgets",
    nome: "Kit Gadgets Personalizados",
    subtitulo: "Case + adesivos para sensor e bomba",
    descricao:
      "Case para glicosímetro, adesivos para bomba de insulina e sensor CGM (Libre, Dexcom) com estilo Gamellito. Cuidar da saúde pode ser estiloso.",
    tag: "Em desenvolvimento",
    tagColor: "bg-gamellito-blue",
    asset: "maeGamellitoGlicemia",
    disponibilidade: "em-breve",
  },
  {
    id: "kit-educativo",
    nome: "Kit Educativo Completo",
    subtitulo: "Livro + Pelúcia + Jogo + Guia",
    descricao:
      "O kit completo para famílias, escolas e ambulatórios. Inclui livro, pelúcia, jogo de tabuleiro e guia para educadores.",
    tag: "Para profissionais",
    tagColor: "bg-gamellito-orange",
    asset: "medicoMaeGamellito",
    disponibilidade: "em-breve",
  },
  {
    id: "curso-primeiros-passos",
    nome: "Curso Primeiros Passos",
    subtitulo: "Acolhimento para famílias no diagnóstico",
    descricao:
      "6 aulas curtas para famílias que acabaram de receber o diagnóstico de DM1. Linguagem acolhedora, sem jargão médico, com materiais em PDF.",
    tag: "Planejado",
    tagColor: "bg-gamellito-mae-red",
    asset: "balao",
    disponibilidade: "em-breve",
  },
];

/* ══════════════════════════════════════════
   MODAL FAKE DOOR
══════════════════════════════════════════ */
function ProductModal({
  produto,
  onClose,
}: {
  produto: Produto;
  onClose: () => void;
}) {
  const [notifyDone, setNotifyDone] = useState(false);

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

        <div className="flex justify-center mb-4">
          <AssetImage asset={produto.asset} alt={produto.nome} className="w-20 h-auto" width={80} height={80} />
        </div>

        <h2 className="font-display text-2xl font-bold text-foreground text-center mb-1">
          {produto.nome}
        </h2>
        <p className="font-body text-muted-foreground text-center text-sm mb-5">
          {produto.subtitulo}
        </p>

        {notifyDone ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <AssetImage asset="gamellitoContente" alt="Gamellito" className="w-14 h-auto mx-auto mb-3" width={56} height={56} />
            <p className="font-display font-bold text-lg text-foreground">
              Anotamos seu interesse!
            </p>
            <p className="font-body text-muted-foreground text-sm mt-1">
              Te avisamos quando isso lançar.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <div className="bg-muted/60 rounded-2xl p-4 text-center">
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Este produto ainda está em desenvolvimento. Seu interesse nos ajuda a
                decidir o que lançar primeiro.
              </p>
            </div>
            <a
              href={`mailto:gamellitoltda@gmail.com?subject=Interesse: ${produto.nome}&body=Olá! Tenho interesse em: ${produto.nome}. Me avise quando lançar!`}
              className="block w-full text-center px-6 py-3 bg-primary text-primary-foreground font-display font-bold rounded-full hover:bg-primary/90 transition-colors"
              onClick={() => setNotifyDone(true)}
            >
              Me avise quando lançar
            </a>
            <button
              type="button"
              onClick={onClose}
              className="w-full px-6 py-3 border border-border text-foreground font-body rounded-full hover:bg-muted transition-colors"
            >
              Continuar explorando
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   CARD — disponível
══════════════════════════════════════════ */
function CardDisponivel({ produto }: { produto: Produto }) {
  return (
    <motion.a
      href={produto.ctaHref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="block bg-card rounded-2xl p-6 border-2 border-gamellito-health-green/40 hover:border-gamellito-health-green hover:shadow-lg transition-all group"
      style={{ boxShadow: "var(--shadow-card)" }}
      onClick={() =>
        track("product_cta", "/loja", { product_id: produto.id, disponivel: true })
      }
    >
      <div className="flex items-start justify-between mb-4">
        <span className={`${produto.tagColor} text-white font-display text-xs px-3 py-1 rounded-full`}>
          {produto.tag}
        </span>
        <AssetImage asset={produto.asset} alt={produto.nome} className="w-14 h-14 object-contain" width={56} height={56} />
      </div>
      <h3 className="font-display font-bold text-xl text-foreground mb-1">{produto.nome}</h3>
      <p className="font-body text-xs text-muted-foreground mb-3">{produto.subtitulo}</p>
      <p className="font-body text-sm text-muted-foreground leading-relaxed mb-5">{produto.descricao}</p>
      <span className="inline-block font-display font-bold text-sm text-gamellito-health-green group-hover:underline">
        {produto.cta} →
      </span>
    </motion.a>
  );
}

/* ══════════════════════════════════════════
   CARD — em breve
══════════════════════════════════════════ */
function CardEmBreve({
  produto,
  index,
  onClick,
}: {
  produto: Produto;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="text-left w-full bg-card rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all group opacity-90 hover:opacity-100"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-start justify-between mb-4">
        <span className={`${produto.tagColor} text-white font-display text-xs px-3 py-1 rounded-full`}>
          {produto.tag}
        </span>
        <AssetImage asset={produto.asset} alt={produto.nome} className="w-14 h-14 object-contain opacity-75 group-hover:opacity-100 transition-opacity" width={56} height={56} />
      </div>
      <h3 className="font-display font-bold text-xl text-foreground mb-1">{produto.nome}</h3>
      <p className="font-body text-xs text-muted-foreground mb-3">{produto.subtitulo}</p>
      <p className="font-body text-sm text-muted-foreground leading-relaxed mb-5">{produto.descricao}</p>
      <span className="font-body text-sm font-semibold text-primary group-hover:underline">
        Tenho interesse →
      </span>
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════════════ */
export default function LojaPage() {
  const [activeProduct, setActiveProduct] = useState<Produto | null>(null);

  async function handleEmBreveClick(produto: Produto) {
    await track("product_interest", "/loja", {
      product_id: produto.id,
      product_name: produto.nome,
    });
    setActiveProduct(produto);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <AnimatePresence>
        {activeProduct && (
          <ProductModal produto={activeProduct} onClose={() => setActiveProduct(null)} />
        )}
      </AnimatePresence>

      {/* ── Hero ── */}
      <section
        data-track-section="loja-hero"
        className="pt-28 pb-16 bg-gamellito-space px-4 relative overflow-hidden"
      >
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gamellito-yellow animate-twinkle opacity-60"
            style={{
              top: `${((i * 17 + 31) % 95) + 2}%`,
              left: `${((i * 29 + 47) % 95) + 2}%`,
              animationDelay: `${((i * 53) % 250) / 100}s`,
            }}
          />
        ))}
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center gap-10"
          >
            <div className="flex-1 text-center md:text-left">
              <p className="text-gamellito-orange font-body font-semibold text-sm uppercase tracking-wider mb-3">
                Ecossistema Gamellito
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mb-5 leading-tight">
                Tudo que o Gamellito{" "}
                <span className="text-gamellito-orange">já criou</span>
              </h1>
              <p className="font-body text-primary-foreground/85 text-lg leading-relaxed mb-6 max-w-xl">
                Começamos com jogos digitais gratuitos. Estamos construindo livros,
                pelúcias e kits — cada passo financiado pelo interesse de vocês.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <div className="inline-flex items-center gap-2 bg-gamellito-health-green/20 border border-gamellito-health-green/40 rounded-full px-4 py-2">
                  <span className="w-2 h-2 rounded-full bg-gamellito-health-green inline-block" />
                  <span className="text-gamellito-health-green font-body font-semibold text-sm">
                    2 produtos disponíveis agora
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 bg-gamellito-orange/20 border border-gamellito-orange/40 rounded-full px-4 py-2">
                  <span className="w-2 h-2 rounded-full bg-gamellito-orange inline-block" />
                  <span className="text-gamellito-orange font-body font-semibold text-sm">
                    6 em desenvolvimento
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 flex gap-4 items-end">
              <AssetImage
                asset="gamellitoCorpinho"
                alt="Gamellito"
                className="w-32 h-auto drop-shadow-2xl"
                width={128}
                height={128}
              />
              <AssetImage
                asset="pancreasPreguicoso"
                alt="Pâncreas Preguiçoso"
                className="w-24 h-auto drop-shadow-xl opacity-80"
                width={96}
                height={96}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Disponíveis agora ── */}
      <section data-track-section="loja-disponivel" className="py-20 bg-background px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="w-3 h-3 rounded-full bg-gamellito-health-green" />
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Disponíveis agora — gratuitos
              </h2>
            </div>
            <p className="font-body text-muted-foreground ml-6">
              Você pode usar hoje, direto no site, sem instalar nada.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {produtosDisponiveis.map((produto) => (
              <CardDisponivel key={produto.id} produto={produto} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Em breve ── */}
      <section data-track-section="loja-em-breve" className="py-20 bg-muted/30 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="w-3 h-3 rounded-full bg-gamellito-orange" />
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Em desenvolvimento
              </h2>
            </div>
            <p className="font-body text-muted-foreground ml-6">
              Clique no que te interessa — isso nos ajuda a decidir o que produzir primeiro.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtosEmBreve.map((produto, i) => (
              <CardEmBreve
                key={produto.id}
                produto={produto}
                index={i}
                onClick={() => handleEmBreveClick(produto)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Missão ── */}
      <section data-track-section="loja-missao" className="py-20 bg-gamellito-space px-4 relative overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gamellito-yellow animate-twinkle opacity-40"
            style={{
              top: `${((i * 23 + 11) % 95) + 2}%`,
              left: `${((i * 37 + 19) % 95) + 2}%`,
              animationDelay: `${((i * 71) % 300) / 100}s`,
            }}
          />
        ))}
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center gap-10"
          >
            <AssetImage
              asset="medicoMaeGamellito"
              alt="Equipe Gamellito"
              className="w-44 h-auto flex-shrink-0"
              width={176}
              height={130}
            />
            <div>
              <h2 className="font-display text-3xl font-bold text-primary mb-4">
                A loja financia o ecossistema
              </h2>
              <p className="font-body text-primary-foreground/85 leading-relaxed mb-4">
                Cada produto vendido reinveste diretamente em pesquisa, novos jogos e
                materiais educativos. Você compra um livro — e ajuda a levar educação em
                saúde para mais crianças em ambulatórios públicos.
              </p>
              <ul className="space-y-2 font-body text-primary-foreground/75 text-sm">
                {[
                  "Receita reinvestida em pesquisa e novos jogos",
                  "Parcerias com ambulatórios para doação de kits",
                  "Produtos desenvolvidos com crianças com DM1",
                  "Validado pela USP e UEL · 5 prêmios internacionais",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <AssetImage asset="gamellitoContente" alt="Gamellito" className="w-16 h-auto mx-auto mb-4" width={64} height={64} />
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Quer ser avisado nos lançamentos?
            </h2>
            <p className="font-body text-muted-foreground mb-6">
              Quem registrar interesse recebe <strong>10% de desconto</strong> na primeira compra.
            </p>
            <a
              href="mailto:gamellitoltda@gmail.com?subject=Quero ser avisado sobre a Loja Gamellito&body=Olá! Quero ser avisado quando a loja abrir."
              onClick={() => track("product_interest", "/loja", { source: "cta_newsletter" })}
              className="inline-block px-8 py-4 bg-gamellito-orange text-white font-body font-semibold rounded-full hover:bg-gamellito-orange/90 transition-colors text-lg"
            >
              Me avise no lançamento
            </a>
          </motion.div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
