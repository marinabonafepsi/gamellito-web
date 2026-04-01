"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { appUi } from "@/components/game-light/appUiAssets";
import { FRIDGE_SNACKS } from "@/components/game-light/fridgeSnacks";

interface GameSceneProps {
  message: string;
  fridgeOpen: boolean;
  onToggleFridge: () => void;
  onSelectSnack: (snackId: string) => void;
  snackPickCount: number;
}

/** Fundo da sala */
const ROOM_BG = "/demo-game/room-bg.png";
const ROOM_BG_FALLBACK = "/assets/bg-casa-gamellito.png";

/**
 * Cena: geladeira com animação, painel interior com spring, Gamellito comemora ao escolher lanche.
 */
export function GameScene({
  message,
  fridgeOpen,
  onToggleFridge,
  onSelectSnack,
  snackPickCount,
}: GameSceneProps) {
  const [bgSrc, setBgSrc] = useState(ROOM_BG);

  const gamellitoSrc = useMemo(() => "/assets/gamellito-feliz-mao-na-barriga.svg", []);

  return (
    <article className="rounded-[28px] border-2 border-gamellito-hospital-purple/35 bg-card overflow-hidden shadow-[0_12px_30px_-18px_rgba(37,17,83,0.6)]">
      <div className="relative w-full aspect-[155/100] min-h-[240px] max-h-[min(52vh,440px)]">
        <img
          src={bgSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          onError={() => {
            if (bgSrc === ROOM_BG) setBgSrc(ROOM_BG_FALLBACK);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gamellito-space/10 via-transparent to-gamellito-space/20 pointer-events-none" />

        <motion.div
          className="absolute z-[2] pointer-events-none select-none
            left-[18%] sm:left-[22%] bottom-[5%] sm:bottom-[6%]
            w-[13%] sm:w-[14%] max-h-[42%] h-auto
            drop-shadow-[0_6px_12px_rgba(0,0,0,0.28)]"
          animate={fridgeOpen ? { rotate: [0, -5, 5, -3, 0], opacity: 0.45 } : { rotate: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
        >
          <img
            src="/assets/geladeira.svg"
            alt=""
            aria-hidden
            className="w-full h-full max-h-[42%] object-contain object-bottom"
          />
        </motion.div>

        <button
          type="button"
          onClick={onToggleFridge}
          aria-expanded={fridgeOpen}
          aria-label={fridgeOpen ? "Fechar a geladeira" : "Abrir a geladeira"}
          className="absolute z-[5] left-[14%] sm:left-[18%] bottom-[4%] sm:bottom-[5%] w-[22%] min-w-[48px] min-h-[48px] max-w-[200px] h-[48%] max-h-[280px]
            rounded-2xl border-2 border-transparent hover:border-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gamellito-orange
            bg-transparent cursor-pointer touch-manipulation active:scale-[0.99] transition-transform"
        />

        <AnimatePresence>
          {fridgeOpen && (
            <motion.div
              key="fridge-panel"
              role="region"
              aria-label="Interior da geladeira"
              initial={{ opacity: 0, y: 20, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ type: "spring", damping: 24, stiffness: 320 }}
              className="absolute z-[6] left-[12%] sm:left-[14%] bottom-[12%] sm:bottom-[14%] w-[min(52%,280px)] max-h-[55%] rounded-2xl overflow-hidden border-2 border-white/40 shadow-xl bg-white/95"
            >
              <div className="relative w-full aspect-[4/3] bg-violet-100/80">
                <img
                  src={appUi.fridgePageImage}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = appUi.geladeira;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
                <p className="absolute top-2 left-2 right-2 font-display text-sm text-white drop-shadow-md">
                  O que vamos pegar?
                </p>
                <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1.5 justify-center">
                  {FRIDGE_SNACKS.map((s) => (
                    <motion.button
                      key={s.id}
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onSelectSnack(s.id)}
                      className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-full bg-gamellito-orange/95 text-white font-body text-xs font-semibold shadow-md hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white touch-manipulation"
                    >
                      {s.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className="absolute z-[3] left-1/2 bottom-[6%] sm:bottom-[7%] -translate-x-1/2
            w-[min(22%,120px)] sm:w-[min(20%,130px)] max-w-[28vmin] pointer-events-none flex justify-center"
        >
          <motion.img
            key={snackPickCount}
            src={gamellitoSrc}
            alt="Gamellito"
            initial={false}
            animate={snackPickCount > 0 ? { scale: [1, 1.15, 1] } : { scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full h-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
          />
        </div>
      </div>

      <div className="relative z-10 p-4 md:p-6 bg-gradient-to-b from-card to-card/95">
        <div className="relative rounded-[24px] border-2 border-gamellito-hospital-purple/35 bg-white/95 p-4 shadow-[0_10px_20px_-16px_rgba(0,0,0,0.4)] overflow-hidden max-w-2xl mx-auto">
          <img
            src="/assets/balao-pensamento.svg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
          />
          <p className="relative font-display text-xl text-gamellito-space">Gamellito</p>
          <p className="relative font-body text-sm md:text-base text-foreground mt-1 leading-relaxed">{message}</p>
        </div>
      </div>
    </article>
  );
}
