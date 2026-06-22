"use client";

import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { AssetImage } from "@/components/SiteAssets";

interface Props {
  visivel: boolean;
  onFim: () => void;
}

export function RecompensaSalvar({ visivel, onFim }: Props) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!visivel) return;
    const t = setTimeout(onFim, reducedMotion ? 600 : 1500);
    return () => clearTimeout(t);
  }, [visivel, onFim, reducedMotion]);

  if (!visivel) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
    >
      <div
        className={`ds-card flex flex-col items-center gap-3 px-10 py-8 ${reducedMotion ? "" : "animate-gamellito-celebrate"}`}
        style={{ borderColor: "#27AE60" }}
      >
        <AssetImage asset="gamellitoContente" alt="Gamellito comemorando" className="w-16 h-auto" width={64} height={64} />

        <p className="font-display font-bold text-2xl" style={{ color: "#2B2233" }}>
          Boa! Anotado!
        </p>
        <p className="font-body text-sm text-center max-w-[200px]" style={{ color: "#6B7280" }}>
          Mais um registro no seu diário!
        </p>

        {!reducedMotion && (
          <div className="flex gap-2 mt-1" aria-hidden="true">
            {["#E8540A", "#F5C518", "#27AE60", "#E8540A", "#F5C518"].map(
              (cor, i) => (
                <span
                  key={i}
                  className="inline-block w-2 h-2 rounded-full animate-bounce"
                  style={{ backgroundColor: cor, animationDelay: `${i * 80}ms`, animationDuration: "0.6s" }}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
