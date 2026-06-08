"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { AssetImage } from "@/components/SiteAssets";
import { X, Heart, ShieldCheck, Stethoscope } from "@/components/icons";
import { track } from "@/lib/analytics";

/* ═══════════════════════════════════════════════════════
   PRODUTOS
════════════════════════════════════════════════════════ */

const produtos = [
  {
    id: "livro-dm1",
    emoji: "📚",
    nome: "Livro Ilustrado",
    subtitulo: "Enfrentando o Diabetes Tipo 1",
    descricao:
      "Série de livros infantis com as aventuras do Gamellito, ilustrações de Roger Cartoons. Linguagem acessível para crianças de 5 a 14 anos aprenderem sobre DM1 de forma leve e divertida.",
    preco: "R$ 45,00",
    tag: "Mais querido",
    tagColor: "bg-gamellito-orange",
    cor: "from-gamellito-orange/20 to-gamellito-bg-yellow/30",
    borda: "border-gamellito-orange/30",
    destaque: true,
  },
  {
    id: "pelucia-gamellito",
    emoji: "🧸",
    nome: "Pelúcia Gamellito",
    subtitulo: "Personagem principal — alien fofo",
    descricao:
      "A pelúcia oficial do Gamellito! Feita com material macio e seguro para crianças. O companheiro perfeito para as aventuras de quem vive com DM1.",
    preco: "R$ 89,00",
    tag: "Novo",
    tagColor: "bg-gamellito-health-green",
    cor: "from-gamellito-health-green/15 to-gamellito-blue/10",
    borda: "border-gamellito-health-green/30",
    destaque: false,
  },
  {
    id: "pelucia-pancreas",
    emoji: "💜",
    nome: "Pelúcia Pâncreas Preguiçoso",
    subtitulo: "O vilão mais fofo do universo",
    descricao:
      "O Pâncreas Preguiçoso em versão pelúcia! Perfeito para explicar o DM1 de forma lúdica. Excelente recurso educativo para clínicas e escolas também.",
    preco: "R$ 79,00",
    tag: "Fan favorite",
    tagColor: "bg-gamellito-hospital-purple",
    cor: "from-gamellito-hospital-purple/15 to-gamellito-mae-red/10",
    borda: "border-gamellito-hospital-purple/30",
    destaque: false,
  },
  {
    id: "kit-gadgets",
    emoji: "🩺",
    nome: "Kit Gadgets Personalizados",
    subtitulo: "Case de glicosímetro + adesivos",
    descricao:
      "Case personalizada para glicosímetro, adesivos para bomba de insulina e sensor, porta-seringa decorado — tudo com o estilo Gamellito. Porque cuidar da saúde pode ser estiloso!",
    preco: "R$ 120,00",
    tag: "Personalizado",
    tagColor: "bg-gamellito-blue",
    cor: "from-gamellito-blue/15 to-gamellito-health-green/10",
    borda: "border-gamellito-blue/30",
    destaque: false,
  },
  {
    id: "kit-educativo",
    emoji: "🎒",
    nome: "Kit Educativo Completo",
    subtitulo: "Livro + Pelúcia + Jogo + Guia para Pais",
    descricao:
      "O kit completo para famílias, escolas e ambulatórios. Inclui livro ilustrado, pelúcia do Gamellito, versão impressa do jogo de tabuleiro e guia para educadores e pais.",
    preco: "R$ 249,00",
    tag: "Melhor custo-benefício",
    tagColor: "bg-gamellito-orange",
    cor: "from-gamellito-orange/10 to-gamellito-health-green/10",
    borda: "border-gamellito-orange/25",
    destaque: false,
  },
  {
    id: "adesivos-customizados",
    emoji: "🎨",
    nome: "Adesivos & Patches",
    subtitulo: "Personalize seu sensor e bomba",
    descricao:
      "Adesivos e patches divertidos para CGM (Libre, Dexcom) e bombas de insulina. Designs exclusivos Gamellito, à prova d'água, 100% personalizáveis com o nome da criança.",
    preco: "R$ 35,00",
    tag: "Em breve",
    tagColor: "bg-muted-foreground",
    cor: "from-muted/40 to-muted/20",
    borda: "border-border",
    destaque: false,
  },
];

/* ═══════════════════════════════════════════════════════
   MODAL FAKE DOOR
════════════════════════════════════════════════════════ */

function ProductModal({
  produto,
  onClose,
}: {
  produto: (typeof produtos)[0];
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

        <div className="text-5xl text-center mb-3">{produto.emoji}</div>
        <h2 className="font-display text-2xl font-bold text-foreground text-center mb-1">
          {produto.nome}
        </h2>
        <p className="font-body text-muted-foreground text-center text-sm mb-2">
          {produto.subtitulo}
        </p>
        <p className="font-display text-3xl font-bold text-primary text-center mb-4">
          {produto.preco}
        </p>

        {notifyDone ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <div className="text-4xl mb-2">🎉</div>
            <p className="font-body font-semibold text-foreground">
              Anotamos seu interesse!
            </p>
            <p className="font-body text-muted-foreground text-sm mt-1">
              Te avisamos assim que a loja abrir.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <div className="bg-muted/60 rounded-xl p-4 text-center">
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                🚧 Nossa loja está em construção! Estamos validando a demanda
                para garantir os melhores produtos pra vocês.
              </p>
            </div>
            <a
              href={`mailto:gamellitoltda@gmail.com?subject=Interesse na loja: ${produto.nome}&body=Olá! Tenho interesse em comprar: ${produto.nome} (${produto.preco}). Por favor me avise quando a loja abrir!`}
              className="block w-full text-center px-6 py-3 bg-primary text-primary-foreground font-body font-semibold rounded-xl hover:bg-primary/90 transition-colors"
              onClick={() => { setNotifyDone(true); }}
            >
              💌 Me avise quando abrir
            </a>
            <button
              type="button"
              onClick={onClose}
              className="w-full px-6 py-3 border border-border text-foreground font-body rounded-xl hover:border-primary/40 transition-colors"
            >
              Continuar explorando
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════════════ */

export default function LojaPage() {
  const [activeProduct, setActiveProduct] = useState<(typeof produtos)[0] | null>(null);

  async function handleProductClick(produto: (typeof produtos)[0]) {
    await track("product_interest", "/loja", {
      product_id: produto.id,
      product_name: produto.nome,
      price: produto.preco,
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
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center gap-8"
          >
            <div className="flex-1">
              <p className="text-gamellito-orange font-body font-semibold text-sm uppercase tracking-wider mb-3">
                🛍️ Ecossistema Gamellito
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mb-5 leading-tight">
                Produtos que tornam o DM1{" "}
                <span className="text-gamellito-orange">mais leve e divertido</span>
              </h1>
              <p className="font-body text-primary-foreground/90 text-lg leading-relaxed mb-6">
                Livros, pelúcias, gadgets personalizados e kits educativos — tudo
                pensado com muito carinho para crianças, famílias e profissionais
                de saúde que vivem o DM1 no dia a dia.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: Heart, label: "Feito com amor" },
                  { icon: ShieldCheck, label: "Seguro para crianças" },
                  { icon: Stethoscope, label: "Validado clinicamente" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5">
                    <item.icon className="w-4 h-4 text-primary" />
                    <span className="font-body text-sm text-primary-foreground/90">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0">
              <AssetImage
                asset="gamellitoContente"
                alt="Gamellito feliz na loja"
                className="w-48 h-auto drop-shadow-2xl"
                width={192}
                height={192}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Banner "em breve" ── */}
      <section className="py-4 bg-gamellito-orange">
        <p className="font-body font-semibold text-white text-center text-sm">
          🚧 Loja em construção — registre seu interesse e seja o primeiro a saber quando abrirmos!
        </p>
      </section>

      {/* ── Produtos ── */}
      <section
        data-track-section="loja-produtos"
        className="py-20 px-4 bg-background"
      >
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
              Clique em qualquer produto para registrar seu interesse — isso nos
              ajuda a decidir o que produzir primeiro!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtos.map((produto, i) => (
              <motion.button
                key={produto.id}
                type="button"
                onClick={() => handleProductClick(produto)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`text-left w-full bg-gradient-to-br ${produto.cor} rounded-2xl p-6 border-2 ${produto.borda} hover:scale-[1.02] hover:shadow-lg transition-all group relative overflow-hidden`}
              >
                {/* Tag */}
                <span className={`absolute top-4 right-4 ${produto.tagColor} text-white font-display text-xs px-2.5 py-1 rounded-full`}>
                  {produto.tag}
                </span>

                <div className="text-4xl mb-4">{produto.emoji}</div>

                <h3 className="font-display font-bold text-xl text-foreground mb-1">
                  {produto.nome}
                </h3>
                <p className="font-body text-xs text-muted-foreground mb-3">
                  {produto.subtitulo}
                </p>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                  {produto.descricao}
                </p>

                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl font-bold text-primary">
                    {produto.preco}
                  </span>
                  <span className="font-body text-sm font-semibold text-primary group-hover:underline">
                    Tenho interesse →
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Por que a loja importa ── */}
      <section
        data-track-section="loja-missao"
        className="py-16 px-4 bg-gamellito-space"
      >
        <div className="container mx-auto max-w-4xl">
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
                A loja como motor do ecossistema
              </h2>
              <p className="font-body text-primary-foreground/85 leading-relaxed mb-4">
                Cada produto vendido financia diretamente o desenvolvimento de
                novos jogos, materiais educativos e pesquisa sobre DM1 infantil.
                É um ciclo virtuoso: você compra um livro fofo para seu filho e
                ajuda a levar educação em saúde para mais 10 crianças em
                ambulatórios públicos.
              </p>
              <ul className="space-y-2 font-body text-primary-foreground/75 text-sm">
                {[
                  "Receita reinvestida em pesquisa e novos jogos",
                  "Parcerias com ambulatórios para doação de kits",
                  "Produtos desenvolvidos com crianças com DM1",
                  "Design acessível e linguagem inclusiva",
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

      {/* ── CTA newsletter ── */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-5xl mb-4">🎁</div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Quer ser avisado no lançamento?
            </h2>
            <p className="font-body text-muted-foreground mb-6">
              Quem registrar interesse recebe 10% de desconto na primeira compra.
            </p>
            <a
              href="mailto:gamellitoltda@gmail.com?subject=Quero ser avisado sobre a Loja Gamellito&body=Olá! Quero ser avisado quando a loja do Gamellito abrir. Obrigado!"
              onClick={() => track("product_interest", "/loja", { source: "cta_newsletter" })}
              className="inline-block px-8 py-4 bg-gamellito-orange text-white font-body font-semibold rounded-xl hover:bg-gamellito-orange/90 transition-colors text-lg"
            >
              📧 Me avise no lançamento
            </a>
          </motion.div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
