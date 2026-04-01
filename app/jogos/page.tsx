import { games } from "@/lib/games";
import { GameCard } from "@/components/games/GameCard";

export default function JogosPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-white">Jogos Gamellito</h1>
        <p className="text-sm text-slate-200 max-w-2xl">
          Aqui você encontra os jogos digitais do universo Gamellito. Eles foram
          pensados para mediar conversas sobre o diabetes tipo 1 entre
          crianças, famílias e equipes de saúde.
        </p>
      </header>
      <section className="grid gap-6 md:grid-cols-2">
        {games.map((game) => (
          <GameCard key={game.slug} game={game} />
        ))}
      </section>
    </div>
  );
}

