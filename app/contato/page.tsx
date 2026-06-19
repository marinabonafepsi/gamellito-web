import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-3xl px-6 py-28 space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground font-display">Contato e parcerias</h1>
          <p className="text-sm text-muted-foreground font-body">
            Para conversar sobre parcerias, implementação em serviços de saúde,
            projetos de pesquisa ou outras colaborações, preencha o formulário
            abaixo ou escreva para o e-mail institucional da Gamellito Ltda.
          </p>
        </header>

        <form className="space-y-4 rounded-2xl bg-card p-6 border border-border">
          <div className="space-y-1 text-sm">
            <label htmlFor="nome" className="font-medium text-foreground font-body">
              Nome
            </label>
            <input
              id="nome"
              name="nome"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40 transition font-body placeholder:text-muted-foreground"
              placeholder="Seu nome completo"
            />
          </div>
          <div className="space-y-1 text-sm">
            <label htmlFor="email" className="font-medium text-foreground font-body">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40 transition font-body placeholder:text-muted-foreground"
              placeholder="seuemail@exemplo.com"
            />
          </div>
          <div className="space-y-1 text-sm">
            <label htmlFor="tipo" className="font-medium text-foreground font-body">
              Tipo de interesse
            </label>
            <select
              id="tipo"
              name="tipo"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40 transition font-body"
            >
              <option>Serviço de saúde</option>
              <option>Universidade / pesquisa</option>
              <option>Escola / educação</option>
              <option>Família / pessoa cuidadora</option>
              <option>Outro</option>
            </select>
          </div>
          <div className="space-y-1 text-sm">
            <label htmlFor="mensagem" className="font-medium text-foreground font-body">
              Mensagem
            </label>
            <textarea
              id="mensagem"
              name="mensagem"
              rows={4}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40 transition font-body placeholder:text-muted-foreground"
              placeholder="Conte um pouco sobre o contexto e a ideia da parceria."
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors font-body"
          >
            Enviar mensagem
          </button>
        </form>

        <p className="text-xs text-muted-foreground font-body">
          Observação: nesta primeira versão do site, o formulário é apenas
          ilustrativo. A implementação do envio seguro das mensagens será feita em
          uma próxima etapa.
        </p>
      </div>

      <FooterSection />
    </div>
  );
}
