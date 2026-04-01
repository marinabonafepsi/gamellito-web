export type GameStatus = "disponivel" | "em_pesquisa" | "em_teste";

export type Game = {
  slug: string;
  nome: string;
  resumo: string;
  publicoAlvo: string;
  objetivosEmSaude: string;
  linkJogo: string;
  status: GameStatus;
};

export const games: Game[] = [
  {
    slug: "gamellito-adventures",
    nome: "Gamellito Adventures",
    resumo:
      "Uma aventura digital para crianças e adolescentes aprenderem, de forma leve, a cuidar do diabetes tipo 1.",
    publicoAlvo: "crianças, adolescentes e famílias",
    objetivosEmSaude:
      "Fortalecer a adesão ao tratamento, dar linguagem para falar da doença e apoiar a autonomia.",
    linkJogo: "https://gamellito.org.br",
    status: "disponivel",
  },
];

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((game) => game.slug === slug);
}

