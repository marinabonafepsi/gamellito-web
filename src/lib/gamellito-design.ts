/**
 * Design system oficial do Gamellito.
 * Derivado do guia visual do livro (Roger Cartoons) e do Design System exportado.
 */

/** Paleta primária oficial */
export const GAMELLITO_PALETTE = {
  /** Amarelo-sol — cor dominante (capa/energia) */
  sun:    "#FFC400",
  /** Laranja Gamellito — mascote, CTAs, botões primários */
  orange: "#F26A00",
  /** Lilás — fundos de seção, divisores */
  lilac:  "#9B8CF0",
  /** Roxo — texto em cream/yellow, títulos secundários */
  purple: "#6E59C9",
  /** Creme — halos, cards, respiro sobre amarelo */
  cream:  "#FFF3C9",
  /** Tinta — contorno cartoon + texto principal */
  ink:    "#2B2233",
  /** Branco */
  white:  "#FFFFFF",
} as const;

/** Acentos "game" — usados em doses pequenas (bolinhas coloridas) */
export const GAME_ACCENT_COLORS = {
  red:     "#EE2B2B",
  blue:    "#37B6E6",
  green:   "#8DC63F",
  pink:    "#F25CA2",
  magenta: "#C82FA0",
} as const;

/** Estados derivados */
export const GAMELLITO_STATES = {
  sunDeep:    "#E5A800",
  orangeDeep: "#D25A00",
  lilacSoft:  "#C7BEF7",
  creamDeep:  "#FBE7A6",
} as const;

/** Cores do personagem Gamellito (SVGs) */
export const GAMELLITO_COLORS = {
  body:     GAMELLITO_PALETTE.orange,
  bodyDark: "#D25A00",
  accent:   GAMELLITO_PALETTE.sun,
  outline:  GAMELLITO_PALETTE.ink,
} as const;

/** HSL para uso com CSS/Tailwind (legado) */
export const GAMELLITO_HSL = {
  orange:          "26 100% 47%",
  sun:             "47 100% 50%",
  lilac:           "252 77% 75%",
  purple:          "252 77% 57%",
  maeRed:          "358 76% 50%",
  hospitalPurple:  "252 77% 57%",
  bgYellow:        "47 100% 50%",
  healthGreen:     "88 55% 51%",
} as const;

/**
 * Variantes do personagem registradas no site.
 */
export const GAMELLITO_VARIANTS = [
  "contente",
  "furioso",
  "corpinho",
] as const;

export type GamellitoVariantName = (typeof GAMELLITO_VARIANTS)[number];
