import Link from "next/link";
import type { Game } from "@/lib/games";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  disponivel:         { label: "Disponível",         color: "bg-[#8DC63F] text-[#2B2233]" },
  em_desenvolvimento: { label: "Em desenvolvimento", color: "bg-[#9B8CF0] text-white"     },
  em_pesquisa:        { label: "Em pesquisa",        color: "bg-[#FFC400] text-[#2B2233]" },
};

type Props = { game: Game };

export function GameCard({ game }: Props) {
  const status = STATUS_LABELS[game.status] ?? { label: game.status, color: "bg-[#FFF3C9] text-[#2B2233]" };

  return (
    <article className="flex flex-col justify-between bg-white rounded-2xl border-[3px] border-[#2B2233] shadow-[4px_4px_0_#2B2233] p-5 hover:-translate-y-px hover:shadow-[5px_5px_0_#2B2233] transition-all duration-[120ms]">
      <div className="space-y-2">
        <h2 className="text-xl font-display font-bold text-[#2B2233]">{game.nome}</h2>
        <p className="text-sm font-body text-[#2B2233]/70">{game.resumo}</p>
        <p className="text-xs font-body text-[#2B2233]/60">
          Público-alvo: <span className="font-semibold text-[#6E59C9]">{game.publicoAlvo}</span>
        </p>
        <p className="text-xs font-body text-[#2B2233]/60">
          Gênero: <span className="font-semibold text-[#6E59C9]">{game.genero}</span>
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className={`rounded-full px-3 py-1 text-[0.7rem] font-display font-bold uppercase tracking-wide border-[2px] border-[#2B2233] ${status.color}`}>
          {status.label}
        </span>
        <Link
          href={`/jogos/${game.slug}`}
          className="rounded-full px-4 py-1.5 text-sm font-display font-bold bg-[#F26A00] text-white border-[2px] border-[#2B2233] shadow-[2px_2px_0_#2B2233] hover:-translate-y-px hover:shadow-[3px_3px_0_#2B2233] transition-all duration-[120ms]"
        >
          Ver detalhes →
        </Link>
      </div>
    </article>
  );
}
