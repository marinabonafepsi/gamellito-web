"use client";

import { ReactNode } from "react";

type ButtonVariant = "default" | "sun" | "lilac" | "ghost" | "ink";
type ButtonSize = "sm" | "default" | "lg";

interface GamButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  asLink?: boolean;
  href?: string;
}

export function GamButton({
  children,
  variant = "default",
  size = "default",
  asLink = false,
  href,
  className = "",
  ...props
}: GamButtonProps) {
  const variantClass = variant === "default" ? "" : `ds-btn--${variant}`;
  const sizeClass = size === "default" ? "" : `ds-btn--${size}`;
  const classes = `ds-btn ${variantClass} ${sizeClass} ${className}`.trim();

  if (asLink && href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
