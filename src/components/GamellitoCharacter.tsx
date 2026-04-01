"use client";

import Image from "next/image";
import { siteAssets, type SiteAssetKey } from "@/components/SiteAssets";

/** Variantes do personagem com asset próprio; use assetKey para qualquer outro do SiteAssets (ex.: gamellitoCorpinho). */
export type GamellitoVariant = "contente" | "furioso" | "corpinho";

const ASSETS: Record<GamellitoVariant, string> = {
  contente: siteAssets.gamellitoContente,
  furioso: siteAssets.gamellitoFurioso,
  corpinho: siteAssets.gamellitoCorpinho,
};

/** Chaves de SiteAssets que são formas do Gamellito (personagem) — para usar em assetKey */
export const GAMELLITO_ASSET_KEYS: SiteAssetKey[] = [
  "gamellitoContente",
  "gamellitoFurioso",
  "gamellitoCorpinho",
];

interface GamellitoCharacterProps {
  /** Variante pré-definida (contente, furioso, corpinho). */
  variant?: GamellitoVariant;
  /** Se definido, usa este asset do SiteAssets em vez de variant — permite qualquer nova forma registrada. */
  assetKey?: SiteAssetKey;
  className?: string;
  width?: number;
  height?: number;
  alt?: string;
  /** Se true, usa <img> em vez de Next/Image (SVGs grandes podem não ter dimensions fixas) */
  useImg?: boolean;
}

const defaultAlt: Record<GamellitoVariant, string> = {
  contente: "Gamellito contente - mascote",
  furioso: "Gamellito furioso - mascote",
  corpinho: "Gamellito - personagem corpo inteiro",
};

export default function GamellitoCharacter({
  variant = "contente",
  assetKey,
  className = "",
  width,
  height,
  alt,
  useImg = true,
}: GamellitoCharacterProps) {
  const src = assetKey ? siteAssets[assetKey] : ASSETS[variant];
  const resolvedAlt =
    alt ?? (assetKey ? "Gamellito" : defaultAlt[variant]);

  if (useImg) {
    return (
      <img
        src={src}
        alt={resolvedAlt}
        className={className}
        width={width}
        height={height}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={resolvedAlt}
      className={className}
      width={width ?? 400}
      height={height ?? 500}
    />
  );
}
