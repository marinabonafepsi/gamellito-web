"use client";

import { useEffect } from "react";

interface GamBadgeProps {
  children: React.ReactNode;
  color?: "sun" | "lilac" | "orange" | "cream" | "ink" | "red" | "blue" | "green" | "pink";
  outline?: boolean;
  dot?: boolean;
  className?: string;
}

/**
 * Badge usando o Gamellito Design System.
 * Para tags, kickers e labels pequenos.
 */
export default function GamBadge({
  children,
  color = "cream",
  outline = false,
  dot = false,
  className = "",
}: GamBadgeProps) {
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
    "gm-badge",
    `gm-badge--${color}`,
    outline && "gm-badge--outline",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes}>
      {dot && <span className="gm-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
