"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { AssetImage } from "@/components/SiteAssets";
import { X } from "@/components/icons";
import { track } from "@/lib/analytics";

/* ══════════════════════════════════════════
   PRODUTOS
══════════════════════════════════════════ */
const produtos = [
  {
    id: "livro-dm1",
    emoji: "📚",
    nome: "Livro Ilustrado",
    subtitulo: '"As Aventuras de Gamellito"',
    descricao:
      "Série infantil com as aventuras do Gamellito, ilustrações de Roger Cartoons. Linguagem acessível para crianças de 5 a 14 anos aprenderem sobre DM1 de forma leve e divertida.",
    tag: "Mais querido",
    cor: "bg-gamellito-orange",
  },
  {
    id: "pelucia-gamellito",
    emoji: "🧸",
    nome: "Pelúcia Gamellito",
    subtitulo: "O alien fofo com DM1",
    descricao:
      "A pelúcia oficial do Gamellito! Material macio e seguro. O companheiro perfeito para crianças que vivem com DM1 se sentirem acompanhadas.",
    tag: "Novo",
    cor: "bg-gamellito-health-green",
  },
  {
    id: "pelucia-pancreas",
    emoji: "💜",
    nome: "Pelúcia Pâncreas Preguiçoso",
    subtitulo: "O vilão mais fofo do universo",
    descricao:
      "O Pâncreas Preguiçoso em versão pelúcia! Perfeito para explicar o DM1 de forma lúdica para crianças e famílias. Excelente recurso educativo.",
    tag: "Fan favorite",
    cor: "bg-gamellito-hospital-purple",
  },
  {
    id: "kit-gadgets",
    emoji: "🩺",
    nome: "Kit Gadgets Personalizados",
    subtitulo: "Case + adesivos para sensor e bomba",
    descricao:
      "Case para glicosímetro, adesivos para bomba de insulina e sensor CGM (Libre, Dexcom) — tudo com estilo Gamellito. Porque cuidar da saúde pode ser estiloso!",
    tag: "Personalizado",
    cor: "bg-gamellito-blue",
  },
  {
    id: "kit-educativo",
    emoji: "🎒",
    nome: "Kit Educativo Completo",
    subtitulo: "Livro + Pelúcia + Jogo + Guia",
    descricao:
      "O kit completo para famílias, escolas e ambulatórios. Inclui livro, pelúcia, jogo de tabuleiro e guia para educadores — tudo em uma caixa.",
    tag: "Kit completo",
    cor: "bg-gamellito-orange",
  },
  {
    id: "curso-primeiros-passos",
    emoji: "🎓",
    nome: "Curso Primeiros Passos",
    subtitulo: "Acolhimento para famílias no diagnóstico",
    descricao:
      "6 aulas curtas (~45 min total) para famílias que acabaram de receber o diagnóstico de DM1. Linguagem acolhedora, sem jargão médico, com materiais em PDF.",
    tag: "Em breve",
    cor: "bg-gamellito-mae-red",
  },
];

/* ══════════════════════════════════════════
   MODAL FAKE DOOR
══════════════════════════════════════════ */
function ProductModal({
  produto,
  onClose,
}: {
  produto: (typeof produtos)[0];
  onClose: () => void;
}) {
  const [done, setDone] = useState(false);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gamellito-space/80 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-md bg-card rounded-3xl p-8 shadow-2xl border-2 border-gamellito-hospital-purple/25"
        initial={{ scale: 0.88, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", damping: 22, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X size={20} />
        </button>

        <div className="text-5xl text-center mb-3">{produto.emoji}</div>
        <h2 className="font-display text-2xl font-bold text-foreground text-center mb-1">{produto.nome}</h2>
        <p className="font-body text-muted-foreground text-center text-sm mb-5">{produto.subtitulo}</p>

        {done ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
            <div className="text-4xl mb-2">🎉</div>
            <p className="font-body font-semibold text-foreground">Anotamos seu interesse!</p>
            <p className="font-body text-muted-foreground text-sm mt-1">Te avisamos quando a loja abrir.</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <div className="bg-muted/60 rounded-2xl p-4 text-center">
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                🚧 Nossa loja está em construção! Estamos validando a demanda para garantir os melhores produtos.
              </p>
            </div>
            <a
              href={`mailto:gamellitoltda@gmail.com?subject=Interesse: ${produto.nome}&body=Olá! Tenho interesse em: ${produto.nome}. Me avise quando a loja abrir!`}
              className="block w-full text-center px-6 py-3 bg-primary text-primary-foreground font-body font-semibold rounded-full hover:bg-primary/90 transition-colors"
              onClick={() => setDone(true)}
            >
              Me avise quando abrir
            </a>
            <button type="button" onClick={onClose} className="w-full px-6 py-3 border border-border text-foreground font-body rounded-full hover:border-primary/40 transition-colors">
              Continuar explorando
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   PAGE
══════════════════════════════════════════ */
export default function LojaPage() {
  const [activeProduct, setActiveProduct] = useState<(typeof produtos)[0] | null>(null);

  async function handleClick(produto: (typeof produtos)[0]) {
    await track("product_interest", "/loja", { product_id: produto.id, product_name: produto.nome });
    setActiveProduct(produto);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <AnimatePresence>
        {activeProduct && <ProductModal produto={activeProduct} onClose={() => setActiveProduct(null)} />}
      </AnimatePresence>

      {/* ── Hero ── */}
      <section
        data-track-section="loja-hero"
        className="pt-28 pb-20 bg-gamellito-space relative overflow-hidden"
      >
        {[...Array(14)].map((_, i) => (
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
                🛍️ Ecossistema Gamellito
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mb-5 leading-tight">
                Produtos que tornam o DM1{" "}
                <span className="text-gamellito-orange">mais leve</span>
              </h1>
              <p className="font-body text-primary-foreground/85 text-lg leading-relaxed mb-6 max-w-xl">
                Livros, pelúcias, gadgets e cursos — tudo pensado com carinho
                para crianças, famílias e profissionais que vivem o DM1 no dia a dia.
              </p>
              <div className="inline-flex items-center gap-2 bg-gamellito-orange/20 border border-gamellito-orange/40 rounded-full px-5 py-2">
                <span className="text-gamellito-orange font-body font-semibold text-sm">
                  🚧 Loja em construção — registre seu interesse!
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <AssetImage
                asset="gamellitoContente"
                alt="Gamellito feliz"
                className="w-44 h-auto drop-shadow-2xl"
                width={176}
                height={176}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Produtos ── */}
      <section data-track-section="loja-produtos" className="py-24 bg-background px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              O que está chegando
            </h2>
            <p className="font-body text-muted-foreground max-w-xl mx-auto">
              Clique em qualquer produto para registrar seu interesse — isso nos ajuda a decidir o que produzir primeiro!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtos.map((produto, i) => (
              <motion.button
                key={produto.id}
                type="button"
                onClick={() => handleClick(produto)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="text-left w-full bg-card rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all group"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`${produto.cor} text-white font-display text-xs px-3 py-1 rounded-full`}>
                    {produto.tag}
                  </span>
                  <span className="text-3xl">{produto.emoji}</span>
                </div>

                <h3 className="font-display font-bold text-xl text-foreground mb-1">{produto.nome}</h3>
                <p className="font-body text-xs text-muted-foreground mb-3">{produto.subtitulo}</p>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-5">{produto.descricao}</p>

                <div className="flex items-center justify-end">
                  <span className="font-body text-sm font-semibold text-primary group-hover:underline">
                    Tenho interesse →
                  </span>
                </div>
              </motion.button>
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
                Cada produto vendido reinveste diretamente em pesquisa, novos jogos e materiais educativos.
                Você compra um livro para seu filho — e ajuda a levar educação em saúde para mais crianças
                em ambulatórios públicos.
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
            <div className="text-5xl mb-4">🎁</div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Quer ser avisado no lançamento?
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
