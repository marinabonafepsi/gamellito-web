"use client";

import Image from "next/image";
import { siteAssets, type SiteAssetKey } from "@/components/SiteAssets";

export type GamellitoVariant = "contente" | "furioso";

const ASSETS: Record<GamellitoVariant, string> = {
  contente: siteAssets.gamellitoContente,
  furioso: siteAssets.gamellitoFurioso,
};

export const GAMELLITO_ASSET_KEYS: SiteAssetKey[] = [
  "gamellitoContente",
  "gamellitoFurioso",
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
