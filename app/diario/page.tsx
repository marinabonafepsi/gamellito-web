import Link from "next/link";

export default function DiarioPage() {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-card rounded-3xl border-2 border-gamellito-space shadow-[4px_4px_0_#2B2233] p-8 text-center">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Diário do Gamellito
        </h1>
        <p className="font-body text-muted-foreground mb-8">
          Organize os registros para levar à consulta.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/diario/lancar"
            className="w-full flex items-center justify-center rounded-full bg-primary border-2 border-gamellito-space shadow-[3px_3px_0_#2B2233] py-3 font-display font-bold text-primary-foreground hover:-translate-y-px hover:shadow-[4px_4px_0_#2B2233] active:translate-y-0.5 active:shadow-[1px_1px_0_#2B2233] transition-all"
          >
            + Registrar glicemia
          </Link>
          <Link
            href="/diario/historico"
            className="w-full flex items-center justify-center rounded-full border-2 border-gamellito-space bg-card text-foreground py-3 font-display font-bold hover:-translate-y-px hover:shadow-[2px_2px_0_#2B2233] transition-all"
          >
            Ver histórico
          </Link>
          <Link
            href="/diario/exportar"
            className="w-full flex items-center justify-center rounded-full border-2 border-gamellito-space bg-card text-foreground py-3 font-display font-bold hover:-translate-y-px hover:shadow-[2px_2px_0_#2B2233] transition-all"
          >
            Exportar PDF
          </Link>
        </div>

        <div className="mt-6">
          <Link
            href="/diario/conta"
            className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
          >
            Minha conta
          </Link>
        </div>
      </div>
    </div>
  );
}
