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
          <h1 className="text-3xl font-display font-bold" style={{ color: "#2B2233" }}>
            Registrar glicemia
          </h1>
          <p className="text-sm font-body mt-1" style={{ color: "#F26A00" }}>
            Preencha os campos e toque em Salvar.
          </p>
        </header>

        <div className="ds-card p-6 flex flex-col gap-6">
          {/* Valor */}
          <div className="flex flex-col gap-2">
            <label htmlFor="valor" className="text-sm font-body font-semibold" style={{ color: "#2B2233" }}>
              Valor da glicemia (mg/dL)
            </label>
            <input
              id="valor"
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Ex.: 120"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="ds-input-number"
            />
          </div>

          {/* Data e hora */}
          <div className="flex flex-col gap-2">
            <label htmlFor="data_hora" className="text-sm font-body font-semibold" style={{ color: "#2B2233" }}>
              Data e hora
            </label>
            <input
              id="data_hora"
              type="datetime-local"
              value={dataHora}
              onChange={(e) => setDataHora(e.target.value)}
              className="ds-input"
            />
          </div>

          {/* Rótulos */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-body font-semibold" style={{ color: "#2B2233" }}>
              Momento
            </span>
            <div className="flex flex-wrap gap-2">
              {ROTULOS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setRotulo(id)}
                  className={`ds-label${rotulo === id ? " ds-label--active" : ""}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Quem registra */}
          <div className="flex flex-col gap-2">
            <label htmlFor="lancado_por" className="text-sm font-body font-semibold" style={{ color: "#2B2233" }}>
              Registrado por
            </label>
            <input
              id="lancado_por"
              type="text"
              placeholder="Ex.: mãe, pai, criança"
              value={lancadoPor}
              onChange={(e) => setLancadoPor(e.target.value)}
              className="ds-input"
            />
          </div>

          {/* Observação opcional */}
          <div className="flex flex-col gap-2">
            <label htmlFor="observacao" className="text-sm font-body font-semibold" style={{ color: "#2B2233" }}>
              Observação{" "}
              <span className="font-normal" style={{ color: "#6B7280" }}>(opcional)</span>
            </label>
            <textarea
              id="observacao"
              rows={3}
              placeholder="Ex.: após atividade física, mal-estar…"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="ds-textarea"
            />
          </div>

          {erro && (
            <p className="text-sm font-body border-2 rounded-2xl px-4 py-3" style={{ borderColor: "#DC2626", background: "#FEF2F2", color: "#DC2626" }}>
              {erro}
            </p>
          )}

          <button
            onClick={salvar}
            disabled={salvando}
            className="ds-btn ds-btn--lg w-full mt-2"
          >
            {salvando ? "Salvando…" : "Salvar registro"}
          </button>

          <button
            onClick={() => router.back()}
            className="text-sm font-body text-center hover:underline"
            style={{ color: "#6B7280" }}
          >
            ← Cancelar
          </button>
        </div>
      </div>
    </>
  );
}
