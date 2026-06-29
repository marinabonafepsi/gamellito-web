"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { RecompensaSalvar } from "@/components/diario/RecompensaSalvar";

type Rotulo = "jejum" | "antes" | "depois" | "dormir" | "outro";

const ROTULOS: { id: Rotulo; emoji: string; label: string }[] = [
  { id: "jejum",  emoji: "🌅", label: "Jejum"          },
  { id: "antes",  emoji: "🍽️", label: "Antes de comer" },
  { id: "depois", emoji: "🍽️", label: "Depois de comer" },
  { id: "dormir", emoji: "🌙", label: "Antes de dormir" },
  { id: "outro",  emoji: "🩸", label: "Outro"           },
];

export default function LancarPage() {
  const router = useRouter();

  const [valor,      setValor]      = useState("");
  const [rotulo,     setRotulo]     = useState<Rotulo | null>(null);
  const [observacao, setObservacao] = useState("");
  const [salvando,   setSalvando]   = useState(false);
  const [erro,       setErro]       = useState<string | null>(null);
  const [recompensa, setRecompensa] = useState(false);

  const esconderRecompensa = useCallback(() => {
    setRecompensa(false);
    router.push("/diario");
  }, [router]);

  async function salvar() {
    setErro(null);
    if (!valor || Number(valor) <= 0) { setErro("Digite o valor da glicemia."); return; }
    if (!rotulo) { setErro("Escolha o momento da medição."); return; }

    setSalvando(true);
    const res = await fetch("/api/registros", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        valor: Number(valor),
        data_hora: new Date().toISOString(),
        rotulo,
        observacao: observacao.trim() || null,
        lancado_por: "eu",
      }),
    });
    setSalvando(false);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setErro(err.error ?? "Erro ao salvar. Tente novamente.");
      return;
    }

    setRecompensa(true);
  }

  return (
    <>
      <RecompensaSalvar visivel={recompensa} onFim={esconderRecompensa} />

      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="font-display font-bold text-3xl" style={{ color: "#6E59C9" }}>
            Registrar glicemia
          </h1>
          <button onClick={() => router.back()} className="ds-btn ds-btn--ghost ds-btn--sm">
            ← Voltar
          </button>
        </div>

        {/* Giant value input */}
        <div className="ds-card p-8 flex flex-col items-center gap-2" style={{ textAlign: "center" }}>
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="0"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="ds-input-value"
          />
          <span className="font-display font-bold text-lg" style={{ color: "#6B7280" }}>
            mg/dL
          </span>
        </div>

        {/* Período */}
        <div>
          <p className="font-display font-semibold text-base mb-3" style={{ color: "#6E59C9" }}>
            Quando foi a medição?
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {ROTULOS.map(({ id, emoji, label }) => {
              const ativo = rotulo === id;
              return (
                <button
                  key={id}
                  onClick={() => setRotulo(id)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    padding: "16px 8px",
                    border: "3px solid #2B2233",
                    borderRadius: 18,
                    boxShadow: ativo ? "2px 2px 0 #2B2233" : "3px 3px 0 #2B2233",
                    cursor: "pointer",
                    background: ativo ? "#F26A00" : "#FFFFFF",
                    color: ativo ? "#FFFFFF" : "#2B2233",
                    transform: ativo ? "translate(1px,1px)" : "none",
                    transition: "all 120ms cubic-bezier(0.22,1,0.36,1)",
                  }}
                >
                  <span style={{ fontSize: 26 }}>{emoji}</span>
                  <span style={{ fontSize: 11, fontWeight: 800, textAlign: "center", lineHeight: 1.2 }}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Observação */}
        <div>
          <p className="font-display font-semibold text-base mb-3" style={{ color: "#6E59C9" }}>
            Observação{" "}
            <span className="font-normal text-sm" style={{ color: "#6B7280" }}>(opcional)</span>
          </p>
          <textarea
            rows={2}
            placeholder="Ex.: depois do lanche, antes de brincar…"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            className="ds-textarea"
          />
        </div>

        {erro && (
          <p className="text-sm font-body rounded-2xl border-2 px-4 py-3"
             style={{ borderColor: "#DC2626", background: "#FEF2F2", color: "#DC2626" }}>
            {erro}
          </p>
        )}

        {/* Save */}
        <button
          onClick={salvar}
          disabled={salvando}
          className="ds-btn ds-btn--lg w-full"
          style={{ background: "#8DC63F", color: "#2B2233" }}
        >
          {salvando ? "Salvando…" : "Salvar · Ganhe 10 🪙"}
        </button>
      </div>
    </>
  );
}
