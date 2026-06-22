"use client";

import { useState } from "react";

type Rotulo = "jejum" | "antes" | "depois" | "dormir" | "outro";

const ROTULOS: { id: Rotulo; label: string }[] = [
  { id: "jejum", label: "Jejum" },
  { id: "antes", label: "Antes de comer" },
  { id: "depois", label: "Depois de comer" },
  { id: "dormir", label: "Antes de dormir" },
  { id: "outro", label: "Outro" },
];

export interface Registro {
  id: string;
  valor: number;
  data_hora: string;
  rotulo: Rotulo;
  observacao: string | null;
  lancado_por: string;
}

interface Props {
  registro: Registro;
  onSalvo: (atualizado: Registro) => void;
  onCancelar: () => void;
}

function toDatetimeLocal(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EditarRegistroModal({ registro, onSalvo, onCancelar }: Props) {
  const [valor, setValor] = useState(String(registro.valor));
  const [dataHora, setDataHora] = useState(toDatetimeLocal(registro.data_hora));
  const [rotulo, setRotulo] = useState<Rotulo>(registro.rotulo);
  const [observacao, setObservacao] = useState(registro.observacao ?? "");
  const [lancadoPor, setLancadoPor] = useState(registro.lancado_por);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function salvar() {
    setErro(null);
    if (!valor || Number(valor) <= 0) { setErro("Valor inválido."); return; }

    setSalvando(true);
    const res = await fetch("/api/registros", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: registro.id,
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
      setErro((err as { error?: string }).error ?? "Erro ao salvar.");
      return;
    }

    const atualizado = await res.json() as Registro;
    onSalvo(atualizado);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="ds-card w-full max-w-md p-6 flex flex-col gap-4">
        <h2 className="font-display font-bold text-xl" style={{ color: "#2B2233" }}>Editar registro</h2>

        {/* Valor */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-body font-medium" style={{ color: "#6B7280" }}>Valor (mg/dL)</label>
          <input
            type="number" inputMode="numeric" value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="ds-input-number"
          />
        </div>

        {/* Data/hora */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-body font-medium" style={{ color: "#6B7280" }}>Data e hora</label>
          <input
            type="datetime-local" value={dataHora}
            onChange={(e) => setDataHora(e.target.value)}
            className="ds-input"
          />
        </div>

        {/* Rótulo */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-body font-medium" style={{ color: "#6B7280" }}>Momento</span>
          <div className="flex flex-wrap gap-2">
            {ROTULOS.map(({ id, label }) => (
              <button key={id} type="button" onClick={() => setRotulo(id)}
                className={`ds-label${rotulo === id ? " ds-label--active" : ""}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Lançado por */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-body font-medium" style={{ color: "#6B7280" }}>Registrado por</label>
          <input
            type="text" value={lancadoPor}
            onChange={(e) => setLancadoPor(e.target.value)}
            className="ds-input"
          />
        </div>

        {/* Observação */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-body font-medium" style={{ color: "#6B7280" }}>Observação (opcional)</label>
          <textarea rows={2} value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            className="ds-textarea"
          />
        </div>

        {erro && (
          <p className="text-sm font-body rounded-xl px-3 py-2" style={{ background: "#FEF2F2", color: "#DC2626" }}>
            {erro}
          </p>
        )}

        <div className="flex gap-3 pt-1">
          <button onClick={onCancelar} className="ds-btn ds-btn--ghost flex-1">
            Cancelar
          </button>
          <button onClick={salvar} disabled={salvando} className="ds-btn flex-1">
            {salvando ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
