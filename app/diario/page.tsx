import Link from "next/link";

export default function DiarioPage() {
  return (
    <div className="text-center py-16">
      <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
        📒 Diário do Gamellito
      </h1>
      <p className="text-lg text-primary-foreground/80 font-body">
        Diário chegando em breve.
      </p>
      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-body font-semibold text-primary-foreground/90 hover:text-primary transition-colors"
        >
          ← Voltar para o site
        </Link>
      </div>
    </div>
  );
}
