"use client";

import { useEffect } from "react";

interface GamCardProps {
  children: React.ReactNode;
  surface?: "white" | "cream" | "sun" | "lilac";
  halo?: boolean;
  flat?: boolean;
  dots?: boolean;
  className?: string;
}

/**
 * Card usando o Gamellito Design System.
 * Renderiza um card com outline cartoon, pop shadow, e animações.
 */
export default function GamCard({
  children,
  surface = "white",
  halo = false,
  flat = false,
  dots = false,
  className = "",
}: GamCardProps) {
  useEffect(() => {
    // Garante que o bundle do design system foi carregado
    const script = document.querySelector('script[src*="_ds_bundle"]');
    if (!script) {
      const s = document.createElement("script");
      s.src = "/design-system/_ds_bundle.js";
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  const classes = [
    "gm-card",
    `gm-card--${surface}`,
    halo && "gm-card--halo",
    flat && "gm-card--flat",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {dots && (
        <div className="gm-card__dots" aria-hidden="true">
          {["var(--game-red)", "var(--game-blue)", "var(--game-green)", "var(--game-pink)"].map(
            (color, i) => (
              <span key={i} style={{ background: color }} />
            )
          )}
        </div>
      )}
      {children}
    </div>
  );
}
