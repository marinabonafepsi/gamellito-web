import Link from "next/link";

export default function DiarioPage() {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-card rounded-3xl border-2 border-gamellito-hospital-purple/25 shadow-2xl relative p-8 text-center">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
          Diário do Gamellito
        </h1>
        <p className="font-body text-muted-foreground mb-8">
          Organize os registros para levar à consulta.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/diario/lancar"
            className="w-full flex items-center justify-center bg-primary text-primary-foreground rounded-full font-display font-bold text-base py-3 hover:bg-primary/90 transition-colors"
          >
            + Registrar glicemia
          </Link>
          <Link
            href="/diario/historico"
            className="w-full flex items-center justify-center border border-border text-foreground rounded-full font-body py-3 hover:border-primary/40 transition-colors"
          >
            Ver histórico
          </Link>
          <Link
            href="/diario/grafico"
            className="w-full flex items-center justify-center border border-border text-foreground rounded-full font-body py-3 hover:border-primary/40 transition-colors"
          >
            Ver gráfico
          </Link>
          <Link
            href="/diario/exportar"
            className="w-full flex items-center justify-center border border-border text-foreground rounded-full font-body py-3 hover:border-primary/40 transition-colors"
          >
            Exportar PDF
          </Link>
        </div>

        <div className="mt-6">
          <Link
            href="/diario/conta"
            className="text-sm font-body text-muted-foreground hover:underline"
          >
            Minha conta
          </Link>
        </div>
      </div>
    </div>
  );
}
