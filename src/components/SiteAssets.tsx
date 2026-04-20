"use client";

/**
 * Caminhos dos assets SVG do site (Gamellito e ilustrações).
 * Use estes paths em img src ou em componentes para manter consistência.
 *
 * ONDE CADA OBJETO FICA BOM (com base no nome/conteúdo):
 * ─────────────────────────────────────────────────────
 * Hero (início)           → gamellitoContente (pose “contente” clássica)
 * Sobre                   → gamellitoEAmigos (quem é o Gamellito / comunidade)
 * Jogos                   → controleVideogame (já usado), gamellitoContente
 * Soluções                → medicoMaeGamellito (comunicação médico-família),
 *                            maeGamellitoGlicemia (monitoramento em casa),
 *                            geladeira (oficinas culinárias / alimentação),
 *                            bicicleta (vida ativa / saúde),
 *                            pancreasPreguicoso (educação diabetes)
 * Dúvidas / FAQ           → gamellitoFurioso (quando "não entendeu nada")
 * Prêmios / Parceiros     → gamellitoEAmigos (juntos, conquistas)
 * Personagem corpo inteiro → gamellitoCorpinho (destaque, hero alternativo)
 * Nav/logo — Gamellito feliz mão na barriga → gamellitoFelizMaoNaBarriga
 */
export const siteAssets = {
  /** Navbar, logo — Gamellito feliz com mão na barriga */
  gamellitoFelizMaoNaBarriga: "/assets/gamellito-feliz-mao-na-barriga.svg",
  /** Hero, CTAs positivos — mascote contente */
  gamellitoContente: "/assets/gamellito-contente.svg",
  /** Dúvidas, FAQ, "não entendeu" – frustração/confusão */
  gamellitoFurioso: "/assets/gamellito-furioso.svg",
  /** Personagem corpo inteiro – destaque, hero, novas variantes */
  gamellitoCorpinho: "/assets/gamellito-corpinho.svg",
  /** Sobre, Parceiros, Prêmios – cenas em grupo */
  gamellitoEAmigos: "/assets/gamellito-e-amigos.svg",
  /** Soluções / Educação – explicar diabetes (pâncreas) */
  pancreasPreguicoso: "/assets/pancreas-preguicoso.svg",
  /** Soluções – vida ativa, atividade física */
  bicicleta: "/assets/bicicleta.svg",
  /** Jogos – gamificação, jogos digitais */
  controleVideogame: "/assets/controle-videogame.svg",
  /** Soluções – médico + família, "não entendeu nada" */
  medicoMaeGamellito: "/assets/medico-mae-gamellito.svg",
  /** Soluções – oficinas culinárias, alimentação, carboidratos */
  geladeira: "/assets/geladeira.svg",
  /** Soluções – monitoramento glicemia, família, cuidado em casa */
  maeGamellitoGlicemia: "/assets/mae-gamellito-glicemia.svg",
  /** DM1 vs DM2 / "fique atento" – olho desconfiado */
  olhoDesconfiado: "/assets/olho-desconfiado.svg",
  /** Dica / pensamento – balão de fala */
  balao: "/assets/balao-pensamento.svg",
  /** Tratamento DM1 – seringa de insulina */
  seringa: "/assets/app-ui/Seringa.png",
  /** Tratamento DM1 – glicosímetro */
  glicosimetro: "/assets/app-ui/Glicosimetro.png",
} as const;

export type SiteAssetKey = keyof typeof siteAssets;

interface AssetImageProps {
  asset: SiteAssetKey;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export function AssetImage({ asset, alt, className, width, height }: AssetImageProps) {
  const src = siteAssets[asset];
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
    />
  );
}
