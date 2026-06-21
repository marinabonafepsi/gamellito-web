export type GameStatus = "disponivel" | "em_desenvolvimento" | "em_pesquisa";

export type GameGenre =
  | "aventura"
  | "stealth"
  | "encontre"
  | "tower-defense"
  | "cartas"
  | "memoria"
  | "domino";

export type Game = {
  slug: string;
  nome: string;
  tagline: string;
  resumo: string;
  genero: GameGenre;
  publicoAlvo: string;
  linkJogo?: string;
  status: GameStatus;
  cor: string;
  emoji: string;
};

export const games: Game[] = [
  {
    slug: "gamellito-adventures",
    nome: "Gamellito Adventures",
    tagline: "Ajude Mellito a controlar o DM1 e voltar pra casa",
    resumo:
      "Mellito é um extraterrestre laranja que descobriu que tem diabetes. Perdido no espaço, ele envia um sinal — e a criança que recebe vira sua parceira de cuidado. Insulina, alimentação, atividade física: tudo vira missão.",
    genero: "aventura",
    publicoAlvo: "6–14 anos",
    linkJogo: "https://gamellito.org.br",
    status: "disponivel",
    cor: "gamellito-orange",
    emoji: "🚀",
  },
  {
    slug: "ninja-do-colchao",
    nome: "Ninja do Colchão",
    tagline: "Saia de casa sem ser pego — sem derrubar nada",
    resumo:
      "O Gamellito precisa levar o colchão pra fora de casa sem ser descoberto. Mas a mãe está na cozinha, a vó no corredor, o cachorro farejando e o vasinho no meio do caminho. Furtividade, timing e muito cuidado.",
    genero: "stealth",
    publicoAlvo: "7–14 anos",
    status: "em_desenvolvimento",
    cor: "gamellito-purple",
    emoji: "🥷",
  },
  {
    slug: "sherlokito",
    nome: "Sherlokito",
    tagline: "Encontre o Gamellito escondido no mundo do diabetes",
    resumo:
      "Cenas cheias de detalhes do universo DM1 — ambulatório, escola, festa de aniversário, praia com sensor. Em cada cena, o Gamellito está escondido. Quanto mais você procura, mais aprende sobre o dia a dia de quem vive com DM1.",
    genero: "encontre",
    publicoAlvo: "5–12 anos",
    status: "em_desenvolvimento",
    cor: "gamellito-yellow",
    emoji: "🔍",
  },
  {
    slug: "formigas-no-colchao",
    nome: "Formigas no Colchão",
    tagline: "Defenda o colchão das formigas — onda após onda",
    resumo:
      "As formigas descobriram o colchão e estão vindo em hordas. O Gamellito defende o território usando itens do seu mundo — insulina, lanceta, gel de glicose — como torres de defesa. Quanto mais ondas, mais você aprende sobre o arsenal do DM1.",
    genero: "tower-defense",
    publicoAlvo: "8–16 anos",
    status: "em_pesquisa",
    cor: "gamellito-health-green",
    emoji: "🐜",
  },
  {
    slug: "uno-dm1",
    nome: "UNO DM1",
    tagline: "O clássico reimaginado no universo do diabetes",
    resumo:
      "Cartas de insulina, glicemia, carboidrato e cuidado diário. As regras do UNO que todo mundo conhece, com conceitos do DM1 que viram conversa natural durante a partida. Para jogar em família, na escola ou no ambulatório.",
    genero: "cartas",
    publicoAlvo: "7+ anos",
    status: "em_pesquisa",
    cor: "gamellito-mae-red",
    emoji: "🃏",
  },
];

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((game) => game.slug === slug);
}

export function getGamesByStatus(status: GameStatus): Game[] {
  return games.filter((game) => game.status === status);
}
