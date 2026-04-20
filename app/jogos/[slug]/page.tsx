import Link from "next/link";
import { notFound } from "next/navigation";
import { games, getGameBySlug } from "@/lib/games";

export function generateStaticParams() {
  return games.map((game) => ({ slug: game.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function GameDetailPage({ params }: Props) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    return notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-white">{game.nome}</h1>
        <p className="text-sm text-slate-200 max-w-2xl">{game.resumo}</p>
      </header>

      <section className="space-y-4 rounded-2xl bg-slate-900/70 p-6 border border-slate-800">
        <h2 className="text-xl font-semibold text-white">
          Para crianças e famílias
        </h2>
        <p className="text-sm text-slate-200">
          Este jogo foi criado para ajudar a entender, de um jeito lúdico, o
          que é o diabetes tipo 1, o papel da insulina, da alimentação e dos
          cuidados diários. A ideia é que a criança possa se ver como
          protagonista da própria história de cuidado.
        </p>
      </section>

      <section className="space-y-4 rounded-2xl bg-slate-900/70 p-6 border border-slate-800">
        <h2 className="text-xl font-semibold text-white">
          Para profissionais de saúde e educadores
        </h2>
        <p className="text-sm text-slate-200">
          O Gamellito pode ser utilizado em atendimentos individuais, grupos
          educativos e atividades em escolas. Ele funciona como mediador para
          que crianças e famílias consigam falar das dificuldades, dúvidas e
          sentimentos em torno do tratamento.
        </p>
        <p className="text-sm text-slate-200">
          No contexto de serviços de saúde e projetos de extensão, o jogo pode
          ser articulado com rodas de conversa, materiais impressos e outras
          linguagens, compondo um cuidado mais integral.
        </p>
      </section>

      <div className="flex flex-wrap gap-4">
        <a
          href={game.linkJogo}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-gamellitoTeal px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-300 transition"
        >
          Jogar agora
        </a>
        <Link
          href="/jogos"
          className="text-sm text-slate-200 hover:text-gamellitoYellow font-semibold"
        >
          Voltar para jogos
        </Link>
      </div>
    </div>
  );
}

