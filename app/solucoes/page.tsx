export default function SolucoesPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-foreground">
          Soluções estratégicas em saúde pública
        </h1>
        <p className="text-sm text-muted-foreground">
          O Gamellito é uma tecnologia educacional criada para apoiar políticas
          públicas e serviços de saúde no cuidado ao diabetes tipo 1 em
          crianças e adolescentes.
        </p>
      </header>

      <section className="space-y-3 rounded-2xl bg-card p-6 border border-border">
        <h2 className="text-xl font-semibold text-foreground">Método Gamellito</h2>
        <p className="text-sm text-muted-foreground">
          Mais do que um jogo isolado, o Gamellito se organiza como um método
          que combina jogos digitais, materiais impressos, oficinas e rodas de
          conversa. A proposta é criar um espaço protegido para simbolizar o
          adoecimento, o tratamento e o projeto de vida.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl bg-card p-6 border border-border">
        <h2 className="text-xl font-semibold text-foreground">
          Para gestores e serviços de saúde
        </h2>
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
          <li>Implementação em ambulatórios de pediatria e endocrinologia.</li>
          <li>
            Uso em grupos educativos com famílias e adolescentes em transição
            para serviços de adulto.
          </li>
          <li>
            Possibilidade de projetos de extensão e pesquisa em parceria com
            universidades.
          </li>
        </ul>
      </section>
    </div>
  );
}
