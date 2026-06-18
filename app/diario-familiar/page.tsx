import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diário de Glicemia — Gamellito",
  description:
    "Registre as glicemias do seu filho com DM1 de forma simples e organizada. Leve o histórico pronto para a consulta médica.",
};

const beneficios = [
  { icone: "📝", titulo: "Registro simples", texto: "Anote valor, momento e quem registrou em segundos, direto do celular." },
  { icone: "📊", titulo: "Histórico organizado", texto: "Veja os últimos 7, 14 ou 30 dias em uma lista clara e fácil de ler." },
  { icone: "📄", titulo: "Pronto para a consulta", texto: "Exporte um relatório em PDF para apresentar à equipe de saúde." },
  { icone: "🔒", titulo: "Só a sua família vê", texto: "Cada família acessa apenas seus próprios registros. Nenhum dado é compartilhado." },
];

export default function DiarioFamiliarPage() {
  return (
    <main style={{ background: "#FFF3C9", minHeight: "100vh" }}>

      {/* Hero */}
      <section className="container mx-auto px-4 pt-16 pb-12 flex flex-col items-center text-center gap-6">
        <div className="flex gap-2 items-center justify-center">
          <span
            className="text-xs font-body font-bold px-3 py-1 rounded-full"
            style={{ background: "#FFC400", color: "#2B2233", border: "2px solid #2B2233", boxShadow: "2px 2px 0 #2B2233" }}
          >
            GRATUITO • EM TESTE
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight max-w-2xl" style={{ color: "#2B2233" }}>
          Diário de glicemia<br />
          <span style={{ color: "#F26A00" }}>para famílias com DM1</span>
        </h1>

        <p className="text-lg font-body max-w-xl leading-relaxed" style={{ color: "rgba(43,34,51,0.75)" }}>
          Registre as medições do seu filho de forma simples e organizada.
          Leve o histórico impresso para a consulta — sem planilhas, sem papel perdido.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <Link
            href="/diario/login"
            className="flex-1 py-4 px-6 rounded-full text-center font-display font-bold text-lg transition-all"
            style={{
              background: "#F26A00",
              color: "#ffffff",
              border: "3px solid #2B2233",
              boxShadow: "4px 4px 0 #2B2233",
            }}
          >
            Quero experimentar →
          </Link>
        </div>

        <p className="text-xs font-body" style={{ color: "rgba(43,34,51,0.5)" }}>
          Sem cartão de crédito. Acesso com e-mail ou Google.
        </p>
      </section>

      {/* Preview mockup */}
      <section className="container mx-auto px-4 pb-16 flex justify-center">
        <div
          className="w-full max-w-sm rounded-3xl p-6 flex flex-col gap-4"
          style={{ background: "#ffffff", border: "3px solid #2B2233", boxShadow: "6px 6px 0 #2B2233" }}
        >
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-lg" style={{ color: "#2B2233" }}>📒 Hoje</span>
            <span className="text-xs font-body px-3 py-1 rounded-full" style={{ background: "#FFF3C9", border: "2px solid #2B2233", color: "#2B2233" }}>
              3 registros
            </span>
          </div>
          {[
            { valor: "142", rotulo: "Antes de comer", hora: "07:30", por: "mãe" },
            { valor: "98",  rotulo: "Depois de comer", hora: "09:45", por: "pai" },
            { valor: "115", rotulo: "Antes de dormir", hora: "21:00", por: "mãe" },
          ].map((r) => (
            <div
              key={r.hora}
              className="flex items-center gap-3 p-3 rounded-2xl"
              style={{ border: "2px solid #2B2233" }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center font-display font-bold text-xl shrink-0"
                style={{ background: "#FFC400", border: "2px solid #2B2233", color: "#2B2233" }}
              >
                {r.valor}
              </div>
              <div className="flex flex-col">
                <span className="font-body font-semibold text-sm" style={{ color: "#2B2233" }}>{r.rotulo}</span>
                <span className="font-body text-xs" style={{ color: "rgba(43,34,51,0.5)" }}>{r.hora} · registrado pela {r.por}</span>
              </div>
            </div>
          ))}
          <div
            className="text-xs font-body text-center pt-2"
            style={{ borderTop: "2px solid #2B2233", color: "rgba(43,34,51,0.5)" }}
          >
            mg/dL · dados fictícios para demonstração
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section style={{ background: "#2B2233" }} className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-10" style={{ color: "#FFC400" }}>
            Por que usar o diário?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {beneficios.map((b) => (
              <div
                key={b.titulo}
                className="rounded-2xl p-6 flex flex-col gap-3"
                style={{ background: "#FFF3C9", border: "3px solid #FFC400", boxShadow: "4px 4px 0 #FFC400" }}
              >
                <span className="text-3xl">{b.icone}</span>
                <h3 className="font-display font-bold text-lg" style={{ color: "#2B2233" }}>{b.titulo}</h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: "rgba(43,34,51,0.75)" }}>{b.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer obrigatório */}
      <section className="py-8" style={{ background: "#FFF3C9", borderTop: "3px solid #2B2233" }}>
        <div className="container mx-auto px-4 max-w-xl text-center">
          <p className="text-xs font-body leading-relaxed" style={{ color: "rgba(43,34,51,0.6)" }}>
            O Diário do Gamellito é uma ferramenta de <strong>organização de registros</strong> e não substitui
            orientação médica. Nenhum valor é interpretado como alto, baixo ou adequado pelo sistema.
            Produto em fase de testes — uso exclusivo com dados fictícios até validação legal concluída.
          </p>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-16" style={{ background: "#FFC400" }}>
        <div className="container mx-auto px-4 flex flex-col items-center gap-6 text-center">
          <h2 className="text-3xl font-display font-bold" style={{ color: "#2B2233" }}>
            Quer testar gratuitamente?
          </h2>
          <p className="font-body max-w-md" style={{ color: "rgba(43,34,51,0.75)" }}>
            Crie sua conta em 30 segundos com e-mail ou Google. Sem instalar nada.
          </p>
          <Link
            href="/diario/login"
            className="py-4 px-10 rounded-full font-display font-bold text-lg transition-all"
            style={{
              background: "#F26A00",
              color: "#ffffff",
              border: "3px solid #2B2233",
              boxShadow: "4px 4px 0 #2B2233",
            }}
          >
            Criar conta grátis →
          </Link>
        </div>
      </section>
    </main>
  );
}
