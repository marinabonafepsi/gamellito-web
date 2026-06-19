import Link from "next/link";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { GameContainer } from "@/components/game-light/GameContainer";

/**
 * URL do jogo embedado. Use variável de ambiente para apontar para seu jogo
 * (ex.: share web game). Padrão: minijogo local em /demo-game/
 * @see docs/JOGO-EMBED.md
 */
const GAME_EMBED_URL = process.env.NEXT_PUBLIC_GAME_EMBED_URL || "/demo-game/";
const GAME_MODE = process.env.NEXT_PUBLIC_GAME_MODE || "light";

export default function ExperimentePage() {
  return (
    <div className="min-h-screen bg-gamellito-space flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-2">
            Experimente o Gamellito
          </h1>
          <p className="text-lg text-primary-foreground/90 font-body max-w-xl mx-auto">
            Abra a geladeira, escolha um lanche e ganhe estrelas. Modo leve pensado
            para crianças experimentarem sem sair do site.
          </p>
        </header>

        {GAME_MODE === "embed" ? (
          <section
            className="rounded-2xl overflow-hidden border-2 border-gamellito-hospital-purple/40 bg-black/20 shadow-xl mx-auto"
            style={{ maxWidth: "min(100%, 900px)" }}
          >
            <iframe
              src={GAME_EMBED_URL}
              title="Jogo Gamellito — experimente a geladeira"
              className="w-full aspect-[3/2] md:aspect-video border-0 block"
              allow="fullscreen; gamepad"
              sandbox="allow-scripts allow-same-origin"
            />
          </section>
        ) : (
          <GameContainer />
        )}

        <div className="text-center mt-6">
          <Link
            href="/#jogos"
            className="inline-flex items-center gap-2 font-body font-semibold text-primary-foreground/90 hover:text-primary transition-colors"
          >
            ← Voltar para o site
          </Link>
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
