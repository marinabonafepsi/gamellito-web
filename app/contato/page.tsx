export default function ContatoPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-white">Contato e parcerias</h1>
        <p className="text-sm text-slate-200">
          Para conversar sobre parcerias, implementação em serviços de saúde,
          projetos de pesquisa ou outras colaborações, preencha o formulário
          abaixo ou escreva para o e-mail institucional da Gamellito Ltda.
        </p>
      </header>

      <form className="space-y-4 rounded-2xl bg-slate-900/70 p-6 border border-slate-800">
        <div className="space-y-1 text-sm">
          <label htmlFor="nome" className="font-medium text-slate-100">
            Nome
          </label>
          <input
            id="nome"
            name="nome"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-gamellitoTeal"
            placeholder="Seu nome completo"
          />
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="email" className="font-medium text-slate-100">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-gamellitoTeal"
            placeholder="seuemail@exemplo.com"
          />
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="tipo" className="font-medium text-slate-100">
            Tipo de interesse
          </label>
          <select
            id="tipo"
            name="tipo"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-gamellitoTeal"
          >
            <option>Serviço de saúde</option>
            <option>Universidade / pesquisa</option>
            <option>Escola / educação</option>
            <option>Família / pessoa cuidadora</option>
            <option>Outro</option>
          </select>
        </div>
        <div className="space-y-1 text-sm">
          <label htmlFor="mensagem" className="font-medium text-slate-100">
            Mensagem
          </label>
          <textarea
            id="mensagem"
            name="mensagem"
            rows={4}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-gamellitoTeal"
            placeholder="Conte um pouco sobre o contexto e a ideia da parceria."
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-gamellitoPink px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-pink-300 transition"
        >
          Enviar mensagem
        </button>
      </form>

      <p className="text-xs text-slate-400">
        Observação: nesta primeira versão do site, o formulário é apenas
        ilustrativo. A implementação do envio seguro das mensagens será feita em
        uma próxima etapa.
      </p>
    </div>
  );
}

