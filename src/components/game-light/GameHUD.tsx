import { appUi } from "@/components/game-light/appUiAssets";
import { FRIDGE_SNACK_COUNT } from "@/components/game-light/fridgeSnacks";

interface GameHUDProps {
  openCount: number;
  score: number;
  /** 0–100 */
  satisfaction: number;
  streak: number;
  snacksTriedCount: number;
}

/**
 * HUD: progresso lúdico + “satisfação” + sequência + variedade de lanches.
 */
export function GameHUD({
  openCount,
  score,
  satisfaction,
  streak,
  snacksTriedCount,
}: GameHUDProps) {
  const satWidth = `${Math.round(satisfaction)}%`;

  return (
    <div className="space-y-3">
      <article className="rounded-3xl border-2 border-gamellito-hospital-purple/40 overflow-hidden shadow-[0_12px_28px_-18px_rgba(50,25,97,0.55)] bg-gradient-to-b from-white/97 to-[rgba(250,248,255,0.95)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4">
          <div className="flex items-center gap-3 rounded-2xl bg-gamellito-bg-yellow/40 border border-gamellito-hospital-purple/25 p-3">
            <div className="h-12 w-12 shrink-0 rounded-xl bg-white/90 border border-gamellito-hospital-purple/30 p-1.5 flex items-center justify-center">
              <img src={appUi.geladeira} alt="" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="font-display text-gamellito-space text-lg leading-tight">Aberturas</p>
              <p className="font-body text-xs text-gamellito-space/70">{openCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-gamellito-orange/15 border border-gamellito-orange/30 p-3">
            <div className="h-12 w-12 shrink-0 rounded-xl bg-white/90 border border-gamellito-orange/35 p-1.5 flex items-center justify-center">
              <img src={appUi.heart} alt="" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="font-display text-gamellito-space text-lg leading-tight">Pontos</p>
              <p className="font-body text-xs text-gamellito-space/70">{score} pts</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-violet-100/80 border border-gamellito-hospital-purple/25 p-3">
            <div className="h-12 w-12 shrink-0 rounded-xl bg-white/90 border border-violet-400/40 p-1.5 flex items-center justify-center font-display text-xl text-violet-700">
              ×{streak}
            </div>
            <div>
              <p className="font-display text-gamellito-space text-lg leading-tight">Sequência</p>
              <p className="font-body text-xs text-gamellito-space/70">
                Abra → lanche → feche sem pular
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-gamellito-health-green/15 border border-gamellito-health-green/30 p-3">
            <div className="h-12 w-12 shrink-0 rounded-xl bg-white/90 border border-gamellito-health-green/35 p-1.5 flex items-center justify-center">
              <img src={appUi.faceIcon} alt="" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="font-display text-gamellito-space text-lg leading-tight">Variedade</p>
              <p className="font-body text-xs text-gamellito-space/70">
                {snacksTriedCount}/{FRIDGE_SNACK_COUNT} lanches
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="font-body text-xs uppercase tracking-wide text-gamellito-space/75 font-semibold">
              Satisfação
            </p>
            <span className="font-body text-xs text-gamellito-space/60">{Math.round(satisfaction)}%</span>
          </div>
          <div
            className="relative h-3 rounded-full overflow-hidden border border-gamellito-hospital-purple/20"
            style={{
              backgroundImage: `url(${appUi.progressBarTex})`,
              backgroundRepeat: "repeat-x",
              backgroundSize: "auto 100%",
            }}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 via-gamellito-orange to-gamellito-health-green transition-all duration-500"
              style={{ width: satWidth }}
            />
          </div>
        </div>
      </article>
    </div>
  );
}
