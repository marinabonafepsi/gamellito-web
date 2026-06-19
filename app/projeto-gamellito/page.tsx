export default function ProjetoGamellitoPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-foreground">Projeto Gamellito</h1>
        <p className="text-sm text-muted-foreground">
          O Gamellito nasce de um projeto acadêmico multiprofissional em uma
          universidade pública, articulando psicologia, saúde coletiva, jogos
          digitais e educação em saúde.
        </p>
      </header>

      <section className="space-y-3 rounded-2xl bg-card p-6 border border-border">
        <h2 className="text-xl font-semibold text-foreground">Origem universitária</h2>
        <p className="text-sm text-muted-foreground">
          Construído em diálogo com crianças, famílias e equipes de saúde, o
          Gamellito foi testado e aprimorado em contexto de hospital
          universitário e projetos de extensão, recebendo reconhecimento em
          eventos de games e saúde.
        </p>
      </section>
    </div>
  );
}
