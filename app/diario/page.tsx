import Link from "next/link";

const DOT_COLORS = ["#EE2B2B", "#37B6E6", "#8DC63F", "#F25CA2"];

export default function DiarioPage() {
  return (
    <div className="max-w-md mx-auto">
      <div className="ds-card ds-card--sun relative p-8 text-center">
        {/* Game-dots */}
        <div className="ds-dots justify-center mb-4" aria-hidden="true">
          {DOT_COLORS.map((c, i) => (
            <span key={i} style={{ background: c }} />
          ))}
        </div>

        <h1 className="text-3xl md:text-4xl font-display font-bold mb-3" style={{ color: "#2B2233" }}>
          Diário do Gamellito
        </h1>
        <p className="font-body mb-8" style={{ color: "#2B2233", opacity: 0.75 }}>
          Organize os registros para levar à consulta.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/diario/lancar" className="ds-btn ds-btn--lg w-full justify-center">
            + Registrar glicemia
          </Link>
          <Link href="/diario/historico" className="ds-btn ds-btn--ghost w-full justify-center">
            Ver histórico
          </Link>
          <Link href="/diario/grafico" className="ds-btn ds-btn--ghost w-full justify-center">
            Ver gráfico
          </Link>
          <Link href="/diario/exportar" className="ds-btn ds-btn--ghost w-full justify-center">
            Exportar PDF
          </Link>
        </div>

        <div className="mt-6">
          <Link
            href="/diario/conta"
            className="text-sm font-body hover:underline"
            style={{ color: "rgba(43,34,51,0.55)" }}
          >
            Minha conta
          </Link>
        </div>
      </div>
    </div>
  );
}
