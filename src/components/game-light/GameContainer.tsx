"use client";

import { GameHUD } from "@/components/game-light/GameHUD";
import { GameScene } from "@/components/game-light/GameScene";
import { FRIDGE_SNACK_COUNT } from "@/components/game-light/fridgeSnacks";
import { useFridgeGame } from "@/hooks/useFridgeGame";

export function GameContainer() {
  const { state, toggleFridge, selectSnack } = useFridgeGame();

  return (
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
          onToggleFridge={toggleFridge}
          onSelectSnack={selectSnack}
          snackPickCount={state.snackPickCount}
        />

        <p className="font-body text-center text-sm text-gamellito-space/80 max-w-xl mx-auto leading-relaxed">
          <strong>Como jogar:</strong> toque na geladeira para abrir, escolha um lanche e feche de novo para manter a{" "}
          <strong>sequência</strong> e ganhar mais pontos. Experimente os {FRIDGE_SNACK_COUNT} lanches para completar a
          variedade.
        </p>
      </div>
    </section>
  );
}
