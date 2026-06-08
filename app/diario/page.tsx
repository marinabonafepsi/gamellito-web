"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { EditarRegistroModal, type Registro } from "@/components/diario/EditarRegistroModal";

type Periodo = "1" | "7" | "30";

const ROTULO_LABEL: Record<string, string> = {
  jejum: "Jejum",
  antes: "Antes de comer",
  depois: "Depois de comer",
  dormir: "Antes de dormir",
  outro: "Outro",
};

function formatarDataHora(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function DiarioPage() {
  const [periodo, setPeriodo] = useState<Periodo>("7");
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [editando, setEditando] = useState<Registro | null>(null);
  const [confirmandoApagar, setConfirmandoApagar] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    const res = await fetch(`/api/registros?periodo=${periodo}`);
    if (res.ok) {
      const data = await res.json() as Registro[];
      setRegistros(data);
    }
    setCarregando(false);
  }, [periodo]);

  useEffect(() => { carregar(); }, [carregar]);

  async function apagar(id: string) {
    const res = await fetch(`/api/registros?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setRegistros((prev) => prev.filter((r) => r.id !== id));
    }
    setConfirmandoApagar(null);
  }

  function aoSalvarEdicao(atualizado: Registro) {
    setRegistros((prev) =>
      prev.map((r) => (r.id === atualizado.id ? atualizado : r))
    );
    setEditando(null);
  }

  return (
    <>
      {/* Modal de edição */}
      {editando && (
        <EditarRegistroModal
          registro={editando}
          onSalvo={aoSalvarEdicao}
          onCancelar={() => setEditando(null)}
        />
      )}

      {/* Modal de confirmação de apagar */}
      {confirmandoApagar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-card rounded-3xl border border-border shadow-2xl p-6 flex flex-col gap-4 text-center">
            <p className="font-display font-bold text-lg text-foreground">Apagar este registro?</p>
            <p className="text-sm text-muted-foreground font-body">Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmandoApagar(null)}
                className="flex-1 rounded-full border border-border py-2.5 font-body font-medium text-muted-foreground hover:bg-muted transition-colors">
                Cancelar
              </button>
              <button onClick={() => apagar(confirmandoApagar)}
                className="flex-1 rounded-full bg-destructive py-2.5 font-display font-bold text-destructive-foreground hover:opacity-90 transition-opacity">
                Apagar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {/* Cabeçalho + botão novo registro */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <h1 className="text-3xl font-display font-bold text-primary-foreground">
            Meu Diário
          </h1>
          <Link
            href="/diario/lancar"
            className="rounded-full bg-primary px-5 py-2.5 font-display font-bold text-primary-foreground hover:opacity-90 transition-opacity text-sm"
          >
            + Novo registro
          </Link>
        </div>

        {/* Filtro de período */}
        <div className="flex gap-2 mb-6">
          {(["1", "7", "30"] as Periodo[]).map((p) => (
            <button key={p} onClick={() => setPeriodo(p)}
              className={`rounded-full px-4 py-2 text-sm font-body font-medium transition-colors
                ${periodo === p
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary-foreground/10 text-primary-foreground/80 hover:bg-primary-foreground/20"
                }`}
            >
              {p === "1" ? "Hoje" : p === "7" ? "7 dias" : "30 dias"}
            </button>
          ))}
        </div>

        {/* Lista de registros */}
        {carregando ? (
          <p className="text-primary-foreground/60 font-body text-center py-12">Carregando…</p>
        ) : registros.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center gap-4">
            <span className="text-5xl">📒</span>
            <p className="text-primary-foreground/70 font-body">
              Nenhum registro neste período.
            </p>
            <Link href="/diario/lancar"
              className="rounded-full bg-primary px-6 py-3 font-display font-bold text-primary-foreground hover:opacity-90 transition-opacity">
              Fazer o primeiro registro
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {registros.map((r) => (
              <li key={r.id}
                className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl border border-primary-foreground/10 p-4 flex items-start gap-4">

                {/* Valor — exibido sem interpretação */}
                <div className="shrink-0 w-16 text-center">
                  <span className="text-2xl font-display font-bold text-primary-foreground">
                    {r.valor}
                  </span>
                  <p className="text-xs text-primary-foreground/50 font-body">mg/dL</p>
                </div>

                {/* Detalhes */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body font-medium text-primary-foreground">
                    {ROTULO_LABEL[r.rotulo] ?? r.rotulo}
                  </p>
                  <p className="text-xs text-primary-foreground/60 font-body">
                    {formatarDataHora(r.data_hora)} · {r.lancado_por}
                  </p>
                  {r.observacao && (
                    <p className="text-xs text-primary-foreground/70 font-body mt-1 italic">
                      {r.observacao}
                    </p>
                  )}
                </div>

                {/* Ações */}
                <div className="flex flex-col gap-1 shrink-0">
                  <button onClick={() => setEditando(r)}
                    className="text-xs font-body text-primary-foreground/60 hover:text-primary-foreground transition-colors px-2 py-1">
                    Editar
                  </button>
                  <button onClick={() => setConfirmandoApagar(r.id)}
                    className="text-xs font-body text-destructive/70 hover:text-destructive transition-colors px-2 py-1">
                    Apagar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Links para outras seções */}
        {registros.length > 0 && (
          <div className="flex gap-4 mt-8 justify-center flex-wrap">
            <Link href="/diario/grafico"
              className="text-sm font-body text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              Ver gráfico →
            </Link>
            <Link href="/diario/exportar"
              className="text-sm font-body text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              Exportar PDF →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
