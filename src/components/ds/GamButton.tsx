"use client";

import { useEffect } from "react";

interface GamButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "sun" | "lilac" | "ghost" | "ink";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}

/**
 * Button usando o Gamellito Design System.
 * Renderiza um <a> se href for fornecido, caso contrário um <button>.
 */
export default function GamButton({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}: GamButtonProps) {
  useEffect(() => {
    // Garante que o bundle do design system foi carregado
    // e os componentes estão disponíveis em window
    const script = document.querySelector('script[src*="_ds_bundle"]');
    if (!script) {
      const s = document.createElement("script");
      s.src = "/design-system/_ds_bundle.js";
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  const baseClass = `gm-btn gm-btn--${variant} gm-btn--${size} ${className}`;

  if (href) {
    return (
      <a href={href} className={baseClass}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClass}
    >
      {children}
    </button>
  );
}
