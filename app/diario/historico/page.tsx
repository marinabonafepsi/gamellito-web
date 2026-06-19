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
  const [periodo,    setPeriodo]    = useState<Periodo>("7");
  const [registros,  setRegistros]  = useState<Registro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [editando,   setEditando]   = useState<Registro | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    const param = periodo === "hoje" ? "1" : periodo;
    const res = await fetch(`/api/registros?periodo=${param}`);
    if (res.ok) {
      const data = await res.json() as Registro[];
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
            <h1 className="text-2xl font-display font-bold text-foreground">
              Histórico
            </h1>
            <p className="text-sm font-body text-primary">
              Seus registros de glicemia
            </p>
          </div>
          <Link
            href="/diario/lancar"
            className="bg-primary text-primary-foreground rounded-full font-display font-bold text-xs px-4 py-2 hover:bg-primary/90 transition-colors"
          >
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
              className={`rounded-full px-3 py-1.5 text-xs font-body font-medium transition-colors ${
                periodo === id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {carregando ? (
          <div className="text-center py-16 font-body text-muted-foreground">
            Carregando…
          </div>
        ) : registros.length === 0 ? (
          <div className="bg-card rounded-3xl border-2 border-gamellito-hospital-purple/25 shadow-2xl text-center py-12 px-6">
            <p className="font-body text-foreground mb-4">
              Nenhum registro neste período.
            </p>
            <Link
              href="/diario/lancar"
              className="inline-block bg-primary text-primary-foreground rounded-full font-display font-bold px-6 py-3 hover:bg-primary/90 transition-colors"
            >
              Adicionar o primeiro
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {registros.map((r) => (
              <div key={r.id} className="bg-card rounded-2xl border border-border flex items-start gap-4 p-4">
                {/* Valor em destaque */}
                <div className="flex-shrink-0 w-20 text-center rounded-2xl py-2 bg-gamellito-yellow border-2 border-gamellito-space/30">
                  <span className="font-display font-bold text-2xl text-gamellito-space">
                    {r.valor}
                  </span>
                  <div className="text-xs font-body text-gamellito-space/70">
                    mg/dL
                  </div>
                </div>

                {/* Detalhes */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-body font-semibold text-foreground">
                    {ROTULO_LABEL[r.rotulo] ?? r.rotulo}
                  </div>
                  <div className="text-xs font-body mt-0.5 text-muted-foreground">
                    {formatarDataHora(r.data_hora)} · {r.lancado_por}
                  </div>
                  {r.observacao && (
                    <div className="text-xs font-body mt-1 italic text-muted-foreground">
                      {r.observacao}
                    </div>
                  )}
                </div>

                {/* Ações */}
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setEditando(r)}
                    className="border border-border text-foreground rounded-full font-body text-xs px-3 py-1.5 hover:border-primary/40 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => apagar(r.id)}
                    className="border border-destructive/40 text-destructive rounded-full font-body text-xs px-3 py-1.5 hover:border-destructive transition-colors"
                  >
                    Apagar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/diario" className="text-sm font-body text-muted-foreground hover:underline">
            ← Voltar
          </Link>
        </div>
      </div>
    </>
  );
}
