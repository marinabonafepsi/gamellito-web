export default function ParaFamiliasPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-white">Para famílias</h1>
        <p className="text-sm text-slate-200">
          Este espaço foi pensado para quem cuida de crianças e adolescentes
          com diabetes tipo 1: mães, pais, responsáveis, avós, irmãos.
        </p>
      </header>

      <section className="space-y-3 rounded-2xl bg-slate-900/70 p-6 border border-slate-800">
        <h2 className="text-xl font-semibold text-white">
          Cuidar também pode ser aventura
        </h2>
        <p className="text-sm text-slate-200">
          Nos jogos e histórias do Gamellito, o tratamento aparece misturado com
          missões, personagens e mundos coloridos. A ideia não é esconder a
          doença, mas encontrar jeitos mais leves de falar dela no dia a dia.
        </p>
      </section>
    </div>
  );
}

