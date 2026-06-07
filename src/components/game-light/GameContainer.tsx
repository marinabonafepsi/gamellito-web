"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameHUD } from "@/components/game-light/GameHUD";
import { GameScene } from "@/components/game-light/GameScene";
import { FRIDGE_SNACK_COUNT } from "@/components/game-light/fridgeSnacks";
import { useFridgeGame } from "@/hooks/useFridgeGame";
import { trackIntent } from "@/lib/trackIntent";

/* ─── Modal fake door ─────────────────────────────────── */

function FakeDoorModal({ onClose }: { onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gamellito-space/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          key="modal"
          className="relative w-full max-w-md bg-card rounded-3xl p-8 shadow-2xl border-2 border-gamellito-hospital-purple/30"
          initial={{ scale: 0.88, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Emoji de foguete */}
          <div className="text-5xl text-center mb-4">🚀</div>

          <h2 className="font-display text-2xl font-bold text-foreground text-center mb-3">
            O Gamellito está chegando!
          </h2>

          <p className="font-body text-muted-foreground text-center leading-relaxed mb-6">
            Estamos finalizando o jogo completo. Mas você já deu um passo
            incrível de chegar até aqui — <strong>seu interesse nos ajuda a
            priorizar o lançamento</strong>! ✨
          </p>

          <div className="flex flex-col gap-3">
            <a
              href="mailto:gamellitoltda@gmail.com?subject=Quero saber quando o jogo lançar!"
              className="w-full text-center px-6 py-3 bg-primary text-primary-foreground font-body font-semibold rounded-xl hover:bg-primary/90 transition-colors"
              onClick={onClose}
            >
              📧 Me avise quando lançar
            </a>
            <button
              type="button"
              onClick={onClose}
              className="w-full px-6 py-3 border border-border text-foreground font-body rounded-xl hover:border-primary/40 transition-colors"
            >
              Voltar para o preview
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── GameContainer ───────────────────────────────────── */

export function GameContainer() {
  const { state } = useFridgeGame();
  const [showModal, setShowModal] = useState(false);

  async function handleFridgeClick() {
    await trackIntent("fridge_click", "/jogos/experimente");
    setShowModal(true);
  }

  async function handleSnackSelect(snackId: string) {
    await trackIntent("snack_select", "/jogos/experimente", { snack: snackId });
    setShowModal(true);
  }

  return (
    <>
      {showModal && <FakeDoorModal onClose={() => setShowModal(false)} />}

      <section
        className="relative rounded-[28px] overflow-hidden border-2 border-gamellito-hospital-purple/40 bg-card shadow-[0_16px_40px_-16px_rgba(28,16,58,0.45)]"
        style={{ maxWidth: "min(100%, 940px)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gamellito-bg-yellow/70 via-background to-gamellito-health-green/15" />

        <div className="relative z-10 p-4 md:p-6 lg:p-7 flex flex-col gap-4">
          <GameHUD
            openCount={state.openCount}
            score={state.score}
            satisfaction={state.satisfaction}
            streak={state.streak}
            snacksTriedCount={state.snacksTriedIds.length}
          />

          <GameScene
            message={state.message}
            fridgeOpen={state.fridgeOpen}
            onToggleFridge={handleFridgeClick}
            onSelectSnack={handleSnackSelect}
            snackPickCount={state.snackPickCount}
          />

          <p className="font-body text-center text-sm text-gamellito-space/80 max-w-xl mx-auto leading-relaxed">
            <strong>Preview do jogo:</strong> toque na geladeira para abrir e
            explore os lanches. O jogo completo está em desenvolvimento!
          </p>
        </div>
      </section>
    </>
  );
}
