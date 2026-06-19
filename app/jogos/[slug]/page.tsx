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
        <h1 className="text-3xl font-bold text-foreground">{game.nome}</h1>
        <p className="text-sm text-muted-foreground max-w-2xl">{game.resumo}</p>
      </header>

      <section className="space-y-4 rounded-2xl bg-card p-6 border border-border">
        <h2 className="text-xl font-semibold text-foreground">
          Para crianças e famílias
        </h2>
        <p className="text-sm text-muted-foreground">
          Este jogo foi criado para ajudar a entender, de um jeito lúdico, o
          que é o diabetes tipo 1, o papel da insulina, da alimentação e dos
          cuidados diários. A ideia é que a criança possa se ver como
          protagonista da própria história de cuidado.
        </p>
      </section>

      <section className="space-y-4 rounded-2xl bg-card p-6 border border-border">
        <h2 className="text-xl font-semibold text-foreground">
          Para profissionais de saúde e educadores
        </h2>
        <p className="text-sm text-muted-foreground">
          O Gamellito pode ser utilizado em atendimentos individuais, grupos
          educativos e atividades em escolas. Ele funciona como mediador para
          que crianças e famílias consigam falar das dificuldades, dúvidas e
          sentimentos em torno do tratamento.
        </p>
        <p className="text-sm text-muted-foreground">
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
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Jogar agora
        </a>
        <Link
          href="/jogos"
          className="text-sm text-muted-foreground hover:text-foreground font-semibold"
        >
          Voltar para jogos
        </Link>
      </div>
    </div>
  );
}
