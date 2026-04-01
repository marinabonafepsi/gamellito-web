/**
 * Design system do personagem e do site Gamellito.
 * Alinhado ao guia visual do livro (Roger Cartoons) e às variantes do personagem.
 */

/** Paleta Foundations do guia (livro) — hex para SVGs e design */
export const GAMELLITO_PALETTE = {
  /** Gamellito Orange — protagonista e CTAs principais */
  orange: "#FF8C00",
  /** Mãe Red — personagem de apoio e alertas importantes */
  maeRed: "#E31E24",
  /** Hospital Purple — ambientes de cuidado, Doutor Lagartão */
  hospitalPurple: "#A881C0",
  /** BG Yellow — planos de fundo e áreas de destaque */
  bgYellow: "#FFD700",
  /** Health Green — ícones de nutrição e sucesso */
  healthGreen: "#8CC63F",
} as const;

/** Cores oficiais do personagem Gamellito (SVGs) */
export const GAMELLITO_COLORS = {
  body: GAMELLITO_PALETTE.orange,
  bodyDark: "#F06105",
  accent: "#FFBC00",
  outline: "#000000",
} as const;

/** Cores em HSL para uso com CSS/Tailwind */
export const GAMELLITO_HSL = {
  body: "33 100% 50%",
  bodyDark: "24 95% 49%",
  accent: "43 100% 51%",
  orange: "33 100% 50%",
  maeRed: "358 76% 50%",
  hospitalPurple: "277 35% 64%",
  bgYellow: "51 100% 50%",
  healthGreen: "88 55% 51%",
} as const;

/**
 * Variantes do personagem registradas no site.
 * Ao adicionar uma nova forma: coloque o SVG em public/assets,
 * registre em SiteAssets.tsx e adicione aqui (opcional, para documentação).
 */
export const GAMELLITO_VARIANTS = [
  "contente",   // rostinho feliz
  "furioso",    // frustrado/confuso (FAQ)
  "corpinho",   // corpo inteiro
  // Adicione novas variantes aqui conforme criar (ex: "surpreso", "dormindo")
] as const;

export type GamellitoVariantName = (typeof GAMELLITO_VARIANTS)[number];

/**
 * Para criar novas formas do Gamellito:
 * 1. Edite ou crie um SVG (pode usar currentColor nos fills para trocar cor via CSS).
 * 2. Salve em public/assets com nome kebab-case (ex: gamellito-surpreso.svg).
 * 3. Adicione em src/components/SiteAssets.tsx em siteAssets.
 * 4. Se for variante do personagem principal, adicione em GamellitoCharacter (variant ou asset).
 * 5. Opcional: adicione o nome em GAMELLITO_VARIANTS acima.
 *
 * Dica: em SVGs novos, use fill="currentColor" ou variáveis CSS (--gamellito-body etc.)
 * para permitir que o site troque cores sem editar o arquivo.
 */
