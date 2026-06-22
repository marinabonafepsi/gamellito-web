import Link from "next/link";

export default function DiarioPage() {
  return (
    <div className="max-w-md mx-auto">
      <div className="ds-card p-8 text-center">
        <h1 className="text-3xl font-display font-bold mb-2" style={{ color: "#2B2233" }}>
          Diário do Gamellito
        </h1>
        <p className="font-body mb-8" style={{ color: "#6B7280" }}>
          Organize os registros para levar à consulta.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/diario/lancar" className="ds-btn ds-btn--lg w-full">
            + Registrar glicemia
          </Link>
          <Link href="/diario/historico" className="ds-btn ds-btn--ghost w-full">
            Ver histórico
          </Link>
          <Link href="/diario/exportar" className="ds-btn ds-btn--ghost w-full">
            Exportar PDF
          </Link>
        </div>

        <div className="mt-6">
          <Link href="/diario/conta" className="text-sm font-body hover:underline" style={{ color: "#6B7280" }}>
            Minha conta
          </Link>
        </div>
      </div>
    </div>
  );
}
