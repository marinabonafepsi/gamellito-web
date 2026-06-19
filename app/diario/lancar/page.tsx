"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { RecompensaSalvar } from "@/components/diario/RecompensaSalvar";

type Rotulo = "jejum" | "antes" | "depois" | "dormir" | "outro";

const ROTULOS: { id: Rotulo; label: string }[] = [
  { id: "jejum",  label: "Jejum" },
  { id: "antes",  label: "Antes de comer" },
  { id: "depois", label: "Depois de comer" },
  { id: "dormir", label: "Antes de dormir" },
  { id: "outro",  label: "Outro" },
];

function hojeLocal(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function LancarPage() {
  const router = useRouter();

  const [valor,      setValor]      = useState("");
  const [dataHora,   setDataHora]   = useState(hojeLocal());
  const [rotulo,     setRotulo]     = useState<Rotulo | null>(null);
  const [observacao, setObservacao] = useState("");
  const [lancadoPor, setLancadoPor] = useState("");
  const [salvando,   setSalvando]   = useState(false);
  const [erro,       setErro]       = useState<string | null>(null);
  const [recompensa, setRecompensa] = useState(false);

  const esconderRecompensa = useCallback(() => {
    setRecompensa(false);
    router.push("/diario");
  }, [router]);

  async function salvar() {
    setErro(null);

    if (!valor || Number(valor) <= 0) {
      setErro("Digite o valor da glicemia.");
      return;
    }
    if (!rotulo) {
      setErro("Escolha um rótulo para este registro.");
      return;
    }
    if (!lancadoPor.trim()) {
      setErro("Informe quem está registrando (ex.: mãe, pai, criança).");
      return;
    }

    setSalvando(true);

    const res = await fetch("/api/registros", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        valor: Number(valor),
        data_hora: new Date(dataHora).toISOString(),
        rotulo,
        observacao: observacao.trim() || null,
        lancado_por: lancadoPor.trim(),
      }),
    });

    setSalvando(false);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setErro((err as { error?: string }).error ?? "Erro ao salvar. Tente novamente.");
      return;
    }

    setRecompensa(true);
  }

  return (
    <>
      <RecompensaSalvar visivel={recompensa} onFim={esconderRecompensa} />

      <div className="max-w-lg mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">
            Registrar glicemia
          </h1>
          <p className="text-sm font-body mt-1 text-primary">
            Preencha os campos e toque em Salvar.
          </p>
        </header>

        <div className="bg-card rounded-3xl border-2 border-gamellito-hospital-purple/25 shadow-2xl p-6 flex flex-col gap-6">
          {/* Valor */}
          <div className="flex flex-col gap-2">
            <label htmlFor="valor" className="text-sm font-body font-semibold text-foreground">
              Valor da glicemia (mg/dL)
            </label>
            <input
              id="valor"
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="120"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-2xl font-display font-bold text-foreground text-center focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Data e hora */}
          <div className="flex flex-col gap-2">
            <label htmlFor="data_hora" className="text-sm font-body font-semibold text-foreground">
              Data e hora
            </label>
            <input
              id="data_hora"
              type="datetime-local"
              value={dataHora}
              onChange={(e) => setDataHora(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Rótulos */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-body font-semibold text-foreground">
              Momento
            </span>
            <div className="flex flex-wrap gap-2">
              {ROTULOS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setRotulo(id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-body font-medium transition-colors ${
                    rotulo === id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Quem registra */}
          <div className="flex flex-col gap-2">
            <label htmlFor="lancado_por" className="text-sm font-body font-semibold text-foreground">
              Registrado por
            </label>
            <input
              id="lancado_por"
              type="text"
              placeholder="Ex.: mãe, pai, criança"
              value={lancadoPor}
              onChange={(e) => setLancadoPor(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Observação opcional */}
          <div className="flex flex-col gap-2">
            <label htmlFor="observacao" className="text-sm font-body font-semibold text-foreground">
              Observação{" "}
              <span className="font-normal text-muted-foreground">(opcional)</span>
            </label>
            <textarea
              id="observacao"
              rows={3}
              placeholder="Ex.: após atividade física, mal-estar…"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          {erro && (
            <p className="text-sm font-body border border-destructive bg-destructive/10 text-destructive rounded-2xl px-4 py-3">
              {erro}
            </p>
          )}

          <button
            onClick={salvar}
            disabled={salvando}
            className="w-full mt-2 bg-primary text-primary-foreground rounded-full font-display font-bold text-base py-3.5 hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {salvando ? "Salvando…" : "Salvar registro"}
          </button>

          <button
            onClick={() => router.back()}
            className="text-sm font-body text-center text-muted-foreground hover:underline"
          >
            ← Cancelar
          </button>
        </div>
      </div>
    </>
  );
}
