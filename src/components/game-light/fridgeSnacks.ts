/** Lanches da geladeira — bônus e texto reativo (estilo jogo casual / app). */
export type FridgeSnackDef = {
  id: string;
  label: string;
  /** Pontos extra ao escolher (além do bônus base). */
  bonusPoints: number;
  /** Frase curta no balão ao escolher. */
  reaction: string;
};

export const FRIDGE_SNACKS: readonly FridgeSnackDef[] = [
  {
    id: "banana",
    label: "Banana",
    bonusPoints: 2,
    reaction: "Energia de banana! Ótima para o lanche.",
  },
  {
    id: "agua",
    label: "Água",
    bonusPoints: 1,
    reaction: "Hidratar é sempre uma boa ideia!",
  },
  {
    id: "sanduiche",
    label: "Sanduíche",
    bonusPoints: 3,
    reaction: "Sanduíche nutritivo — delícia!",
  },
  {
    id: "iogurte",
    label: "Iogurte",
    bonusPoints: 2,
    reaction: "Iogurte geladinho — o Gamellito aprova!",
  },
] as const;

export const FRIDGE_SNACK_COUNT = FRIDGE_SNACKS.length;

export function getSnackById(id: string): FridgeSnackDef | undefined {
  return FRIDGE_SNACKS.find((s) => s.id === id);
}
