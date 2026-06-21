import Link from "next/link";

export default function DiarioPage() {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-3xl border-[3px] border-[#2B2233] shadow-[4px_4px_0_#2B2233] p-8 text-center">
        <span className="text-5xl">📒</span>
        <h1 className="text-3xl font-display font-bold text-[#2B2233] mt-3 mb-2">
          Diário do Gamellito
        </h1>
        <p className="font-body text-[#2B2233]/60 mb-8">
          Organize os registros para levar à consulta.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/diario/lancar"
            className="w-full flex items-center justify-center rounded-full bg-[#F26A00] border-[3px] border-[#2B2233] shadow-[3px_3px_0_#2B2233] py-3 font-display font-bold text-white hover:-translate-y-px hover:shadow-[4px_4px_0_#2B2233] active:translate-y-0.5 active:shadow-[1px_1px_0_#2B2233] transition-all"
          >
            + Registrar glicemia
          </Link>
          <Link
            href="/diario/historico"
            className="w-full flex items-center justify-center rounded-full border-[2px] border-[#2B2233] bg-white text-[#2B2233] py-3 font-display font-bold hover:-translate-y-px hover:shadow-[2px_2px_0_#2B2233] transition-all"
          >
            Ver histórico
          </Link>
          <Link
            href="/diario/exportar"
            className="w-full flex items-center justify-center rounded-full border-[2px] border-[#2B2233] bg-white text-[#2B2233] py-3 font-display font-bold hover:-translate-y-px hover:shadow-[2px_2px_0_#2B2233] transition-all"
          >
            Exportar PDF
          </Link>
        </div>

        <div className="mt-6">
          <Link
            href="/diario/conta"
            className="text-sm font-body text-[#2B2233]/50 hover:text-[#2B2233] transition-colors"
          >
            Minha conta
          </Link>
        </div>
      </div>
    </div>
  );
}
