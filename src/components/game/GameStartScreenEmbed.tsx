"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

interface GameStartScreenEmbedProps {
  gameUrl: string;
}

const decorativeAssets = [
  { src: "/assets/gamellito-feliz-mao-na-barriga.svg", alt: "Gamellito feliz" },
  { src: "/assets/gamellito-corpinho.svg", alt: "Gamellito corpo inteiro" },
  { src: "/assets/mae-gamellito-glicemia.svg", alt: "Mae e Gamellito medindo glicemia" },
  { src: "/assets/geladeira.svg", alt: "Geladeira de alimentos" },
  { src: "/assets/medico-mae-gamellito.svg", alt: "Medico, mae e Gamellito" },
  { src: "/assets/controle-videogame.svg", alt: "Controle de videogame" },
  { src: "/assets/bicicleta.svg", alt: "Bicicleta" },
  { src: "/assets/pancreas-preguicoso.svg", alt: "Pancreas preguicoso" },
  { src: "/assets/gamellito-furioso.svg", alt: "Gamellito furioso" },
  { src: "/assets/gamellito-e-amigos.svg", alt: "Gamellito e amigos" },
  { src: "/assets/gamellito-feliz-mao-na-barriga.svg", alt: "Gamellito" },
] as const;

export function GameStartScreenEmbed({ gameUrl }: GameStartScreenEmbedProps) {
  const [started, setStarted] = useState(false);

  const bubbleText = useMemo(
    () =>
      "Vamos brincar e aprender juntos? Cuide do Gamellito, meca a glicemia e mantenha tudo em equilibrio!",
    [],
  );

  if (started) {
    return (
      <section
        className="rounded-3xl overflow-hidden border-2 border-gamellito-hospital-purple/40 bg-black/20 shadow-xl mx-auto"
        style={{ maxWidth: "min(100%, 900px)" }}
      >
        <div className="flex items-center justify-between px-4 py-3 bg-gamellito-space/80 border-b border-primary/40">
          <p className="text-primary-foreground font-display text-sm md:text-base">
            Jogo em andamento
          </p>
          <Button
            type="button"
            variant="secondary"
            className="rounded-full font-display font-bold"
            onClick={() => setStarted(false)}
          >
            Voltar
          </Button>
        </div>
        <iframe
          src={gameUrl}
          title="Jogo Gamellito"
          className="w-full aspect-[3/2] md:aspect-video border-0 block bg-white"
          allow="fullscreen; gamepad"
          sandbox="allow-scripts allow-same-origin"
        />
      </section>
    );
  }

  return (
    <section
      className="relative rounded-3xl overflow-hidden border-2 border-gamellito-hospital-purple/40 bg-card shadow-[0_16px_40px_-16px_rgba(28,16,58,0.45)] mx-auto"
      style={{ maxWidth: "min(100%, 900px)" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-gamellito-bg-yellow/70 via-background to-gamellito-health-green/20" />
      <div className="absolute inset-0 opacity-15">
        <img
          src="/assets/gamellito-e-amigos.svg"
          alt=""
          className="w-full h-full object-cover"
          aria-hidden
        />
      </div>

      <div className="relative z-10 p-5 md:p-8">
        <div className="flex flex-col items-center text-center gap-5">
          <div className="inline-flex items-center rounded-full bg-primary/15 border border-primary/30 px-4 py-1.5">
            <span className="font-display text-sm md:text-base text-gamellito-space">
              Tela Inicial do Jogo
            </span>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/25 blur-xl scale-110" />
            <img
              src="/assets/gamellito-feliz-mao-na-barriga.svg"
              alt="Gamellito principal"
              className="relative w-40 md:w-56 lg:w-64 h-auto drop-shadow-[0_12px_22px_rgba(0,0,0,0.18)]"
            />
          </div>

          <div className="w-full max-w-2xl rounded-[28px] bg-white/95 border-2 border-gamellito-hospital-purple/35 px-5 py-4 shadow-[0_10px_24px_-12px_rgba(89,58,143,0.4)]">
            <p className="font-body text-sm md:text-base text-foreground leading-relaxed">
              {bubbleText}
            </p>
          </div>

          <Button
            type="button"
            onClick={() => setStarted(true)}
            className="rounded-full px-9 h-12 md:h-14 text-base md:text-lg font-display font-bold shadow-[0_8px_0_rgba(176,89,0,0.75),0_14px_24px_-12px_rgba(0,0,0,0.45)] hover:translate-y-[1px] active:translate-y-[2px] transition-transform"
          >
            Jogar
          </Button>
        </div>

        <div className="mt-6 pt-5 border-t border-gamellito-hospital-purple/25">
          <p className="text-xs md:text-sm font-body text-gamellito-space/80 mb-3 text-center">
            Assets da experiencia Gamellito
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-11 gap-2 md:gap-3">
            {decorativeAssets.map((asset) => (
              <div
                key={asset.src}
                className="bg-white/90 border border-gamellito-hospital-purple/30 rounded-2xl p-2 shadow-[0_6px_14px_-10px_rgba(44,24,91,0.45)]"
              >
                <img src={asset.src} alt={asset.alt} className="w-full h-10 object-contain" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
