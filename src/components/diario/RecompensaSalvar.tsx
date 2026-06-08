"use client";

import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";

interface Props {
  visivel: boolean;
  onFim: () => void;
}

/**
 * Microcomemoração ao salvar um registro.
 * Celebra O ATO DE REGISTRAR — nunca o valor.
 * REGRA Nº 1: nenhuma mensagem avalia ou interpreta o número digitado.
 */
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
        className={`
          flex flex-col items-center gap-3
          bg-card/95 backdrop-blur-sm rounded-3xl
          border-2 border-gamellito-health-green/60
          shadow-2xl px-10 py-8
          ${reducedMotion ? "" : "animate-gamellito-celebrate"}
        `}
      >
        {/* Personagem comemorando */}
        <span className="text-6xl" role="img" aria-label="Gamellito comemorando">
          🎉
        </span>

        {/* Mensagem: celebra o registro, NUNCA o valor */}
        <p className="font-display font-bold text-2xl text-foreground">
          Boa! Anotado!
        </p>
        <p className="font-body text-sm text-muted-foreground text-center max-w-[200px]">
          Mais um registro no seu diário 📒
        </p>

        {/* Confete visual simples em CSS — respeita prefers-reduced-motion */}
        {!reducedMotion && (
          <div className="flex gap-2 mt-1" aria-hidden="true">
            {["#E8540A", "#F5C518", "#27AE60", "#E8540A", "#F5C518"].map(
              (cor, i) => (
                <span
                  key={i}
                  className="inline-block w-2 h-2 rounded-full animate-bounce"
                  style={{
                    backgroundColor: cor,
                    animationDelay: `${i * 80}ms`,
                    animationDuration: "0.6s",
                  }}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
