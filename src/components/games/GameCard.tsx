import Link from "next/link";
import type { Game } from "@/lib/games";

type Props = {
  game: Game;
};

export function GameCard({ game }: Props) {
  return (
    <article className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-lg">
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-foreground">{game.nome}</h2>
        <p className="text-sm text-muted-foreground">{game.resumo}</p>
        <p className="text-xs text-muted-foreground">
          Público-alvo: <span className="font-medium">{game.publicoAlvo}</span>
        </p>
        <p className="text-xs text-muted-foreground">
          Em saúde:{" "}
          <span className="font-medium">{game.objetivosEmSaude}</span>
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span className="rounded-full bg-muted px-3 py-1 text-[0.7rem] uppercase tracking-wide">
          {game.status === "disponivel"
            ? "Disponível"
            : game.status === "em_pesquisa"
            ? "Em pesquisa"
            : "Em teste"}
        </span>
        <Link
          href={`/jogos/${game.slug}`}
          className="text-primary hover:text-primary/80 font-semibold"
        >
          Ver detalhes
        </Link>
      </div>
    </article>
  );
}
