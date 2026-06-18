"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { EditarRegistroModal, type Registro } from "@/components/diario/EditarRegistroModal";

type Periodo = "hoje" | "7" | "30";

const PERIODOS: { id: Periodo; label: string }[] = [
  { id: "hoje", label: "Hoje" },
  { id: "7",    label: "7 dias" },
  { id: "30",   label: "30 dias" },
];

const ROTULO_LABEL: Record<string, string> = {
  jejum:  "Jejum",
  antes:  "Antes de comer",
  depois: "Depois de comer",
  dormir: "Antes de dormir",
  outro:  "Outro",
};

function formatarDataHora(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function HistoricoPage() {
  const [periodo,   setPeriodo]   = useState<Periodo>("7");
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [editando,  setEditando]  = useState<Registro | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    const param = periodo === "hoje" ? "1" : periodo;
    const res = await fetch(`/api/registros?periodo=${param}`);
    if (res.ok) {
      const data = await res.json() as Registro[];
      // Filtro adicional para "hoje" — apenas registros do dia atual
      if (periodo === "hoje") {
        const hoje = new Date().toDateString();
        setRegistros(data.filter((r) => new Date(r.data_hora).toDateString() === hoje));
      } else {
        setRegistros(data);
      }
    }
    setCarregando(false);
  }, [periodo]);

  useEffect(() => { carregar(); }, [carregar]);

  async function apagar(id: string) {
    const ok = window.confirm("Apagar este registro? Esta ação não pode ser desfeita.");
    if (!ok) return;
    await fetch(`/api/registros?id=${id}`, { method: "DELETE" });
    setRegistros((prev) => prev.filter((r) => r.id !== id));
  }

  function aoSalvarEdicao(atualizado: Registro) {
    setRegistros((prev) => prev.map((r) => (r.id === atualizado.id ? atualizado : r)));
    setEditando(null);
  }

  return (
    <>
      {editando && (
        <EditarRegistroModal
          registro={editando}
          onSalvo={aoSalvarEdicao}
          onCancelar={() => setEditando(null)}
        />
      )}

      <div className="max-w-lg mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold" style={{ color: "#2B2233" }}>
              Histórico
            </h1>
            <p className="text-sm font-body" style={{ color: "#6E59C9" }}>
              Seus registros de glicemia
            </p>
          </div>
          <Link href="/diario/lancar" className="ds-btn ds-btn--sm">
            + Registrar
          </Link>
        </header>

        {/* Filtro de período */}
        <div className="flex gap-2 mb-6">
          {PERIODOS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setPeriodo(id)}
              className={`ds-label ${periodo === id ? "ds-label--active" : ""}`}
            >
              {label}
            </button>
          ))}
        </div>

        {carregando ? (
          <div className="text-center py-16 font-body" style={{ color: "rgba(43,34,51,0.5)" }}>
            Carregando…
          </div>
        ) : registros.length === 0 ? (
          <div className="ds-card ds-card--cream text-center py-12 px-6">
            <p className="font-body mb-4" style={{ color: "#2B2233" }}>
              Nenhum registro neste período.
            </p>
            <Link href="/diario/lancar" className="ds-btn">
              Adicionar o primeiro
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {registros.map((r) => (
              <div key={r.id} className="ds-card ds-card--flat flex items-start gap-4 p-4">
                {/* Valor em destaque */}
                <div
                  className="flex-shrink-0 w-20 text-center rounded-ds-md py-2"
                  style={{ background: "#FFC400", border: "2px solid #2B2233" }}
                >
                  <span className="font-display font-bold text-2xl" style={{ color: "#2B2233" }}>
                    {r.valor}
                  </span>
                  <div className="text-xs font-body" style={{ color: "#2B2233", opacity: 0.7 }}>
                    mg/dL
                  </div>
                </div>

                {/* Detalhes */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-body font-semibold" style={{ color: "#2B2233" }}>
                    {ROTULO_LABEL[r.rotulo] ?? r.rotulo}
                  </div>
                  <div className="text-xs font-body mt-0.5" style={{ color: "rgba(43,34,51,0.6)" }}>
                    {formatarDataHora(r.data_hora)} · {r.lancado_por}
                  </div>
                  {r.observacao && (
                    <div className="text-xs font-body mt-1 italic" style={{ color: "rgba(43,34,51,0.7)" }}>
                      {r.observacao}
                    </div>
                  )}
                </div>

                {/* Ações */}
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setEditando(r)}
                    className="ds-btn ds-btn--ghost ds-btn--sm"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => apagar(r.id)}
                    className="ds-btn ds-btn--ghost ds-btn--sm"
                    style={{ color: "#991B1B" }}
                  >
                    Apagar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/diario" className="text-sm font-body hover:underline" style={{ color: "rgba(43,34,51,0.6)" }}>
            ← Voltar
          </Link>
        </div>
      </div>
    </>
  );
}
