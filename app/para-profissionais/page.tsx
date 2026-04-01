export default function ParaProfissionaisPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-white">
          Para profissionais de saúde e educadores
        </h1>
        <p className="text-sm text-slate-200">
          O universo Gamellito foi desenvolvido em diálogo com práticas
          clínicas, pesquisa em saúde coletiva e experiências de extensão
          universitária.
        </p>
      </header>

      <section className="space-y-3 rounded-2xl bg-slate-900/70 p-6 border border-slate-800">
        <h2 className="text-xl font-semibold text-white">
          Como utilizar o Gamellito
        </h2>
        <ul className="list-disc pl-5 text-sm text-slate-200 space-y-2">
          <li>Em sessões individuais com crianças e adolescentes.</li>
          <li>Em grupos educativos com famílias.</li>
          <li>
            Em projetos de educação em saúde em escolas e comunidades.
          </li>
        </ul>
      </section>
    </div>
  );
}

