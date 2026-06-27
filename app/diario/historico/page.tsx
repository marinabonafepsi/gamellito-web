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
            <h1 className="text-2xl font-display font-bold text-[#2B2233]">
              Histórico
            </h1>
            <p className="text-sm font-body text-[#6E59C9]">
              Seus registros de glicemia
            </p>
          </div>
          <Link
            href="/diario/lancar"
            className="rounded-full bg-[#F26A00] border-[2px] border-[#2B2233] shadow-[2px_2px_0_#2B2233] font-display font-bold text-xs text-white px-4 py-2 hover:-translate-y-px hover:shadow-[3px_3px_0_#2B2233] transition-all"
          >
            + Registrar
          </Link>
        </header>

        {/* Gráfico */}
        {registros.length > 0 && (
          <div className="bg-white rounded-2xl border-[2px] border-[#2B2233] shadow-[2px_2px_0_#2B2233] p-4 mb-6">
            <p className="text-xs font-body font-semibold text-[#2B2233]/60 mb-3">Últimos valores</p>
            <div className="flex items-end justify-between gap-1 h-32">
              {registros.slice(0, 14).reverse().map((r, i) => {
                const minVal = Math.min(...registros.map(x => x.valor));
                const maxVal = Math.max(...registros.map(x => x.valor));
                const range = maxVal - minVal || 1;
                const percent = ((r.valor - minVal) / range) * 100;
                const color = r.valor < 70 ? "#EE2B2B" : r.valor > 180 ? "#F26A00" : "#8DC63F";

                return (
                  <div
                    key={i}
                    className="flex-1 rounded-t-lg"
                    style={{
                      height: `${Math.max(20, percent)}%`,
                      background: color,
                    }}
                    title={`${r.valor} mg/dL`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-xs font-body text-[#2B2233]/60 mt-2">
              <span>Min: {Math.min(...registros.map(x => x.valor))} mg/dL</span>
              <span>Máx: {Math.max(...registros.map(x => x.valor))} mg/dL</span>
            </div>
          </div>
        )}

        {/* Filtro de período */}
        <div className="flex gap-2 mb-6">
          {PERIODOS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setPeriodo(id)}
              className={`rounded-full px-4 py-1.5 text-sm font-body font-semibold border-[2px] border-[#2B2233] transition-all ${
                periodo === id
                  ? "bg-[#F26A00] text-white shadow-[2px_2px_0_#2B2233]"
                  : "bg-white text-[#2B2233] hover:-translate-y-px hover:shadow-[2px_2px_0_#2B2233]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {carregando ? (
          <div className="text-center py-16 font-body text-[#2B2233]/50">
            Carregando…
          </div>
        ) : registros.length === 0 ? (
          <div className="bg-white rounded-3xl border-[3px] border-[#2B2233] shadow-[4px_4px_0_#2B2233] text-center py-12 px-6">
            <p className="font-body text-[#2B2233] mb-4">
              Nenhum registro neste período.
            </p>
            <Link
              href="/diario/lancar"
              className="inline-block rounded-full bg-[#F26A00] border-[3px] border-[#2B2233] shadow-[3px_3px_0_#2B2233] font-display font-bold text-white px-6 py-3 hover:-translate-y-px hover:shadow-[4px_4px_0_#2B2233] transition-all"
            >
              Adicionar o primeiro
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {registros.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl border-[2px] border-[#2B2233] shadow-[2px_2px_0_#2B2233] flex items-start gap-4 p-4">
                {/* Valor em destaque */}
                <div className="flex-shrink-0 w-20 text-center rounded-2xl py-2 bg-[#FFC400] border-[2px] border-[#2B2233]">
                  <span className="font-display font-bold text-2xl text-[#2B2233]">
                    {r.valor}
                  </span>
                  <div className="text-xs font-body text-[#2B2233]/70">
                    mg/dL
                  </div>
                </div>

                {/* Detalhes */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-body font-semibold text-[#2B2233]">
                    {ROTULO_LABEL[r.rotulo] ?? r.rotulo}
                  </div>
                  <div className="text-xs font-body mt-0.5 text-[#2B2233]/60">
                    {formatarDataHora(r.data_hora)} · {r.lancado_por}
                  </div>
                  {r.observacao && (
                    <div className="text-xs font-body mt-1 italic text-[#2B2233]/50">
                      {r.observacao}
                    </div>
                  )}
                </div>

                {/* Ações */}
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setEditando(r)}
                    className="border-[2px] border-[#2B2233] text-[#2B2233] bg-white rounded-full font-body text-xs px-3 py-1.5 hover:-translate-y-px hover:shadow-[2px_2px_0_#2B2233] transition-all"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => apagar(r.id)}
                    className="border-[2px] border-[#EE2B2B]/60 text-[#EE2B2B] bg-white rounded-full font-body text-xs px-3 py-1.5 hover:bg-[#EE2B2B]/10 transition-colors"
                  >
                    Apagar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/diario" className="text-sm font-body text-[#2B2233]/50 hover:text-[#2B2233] transition-colors">
            ← Voltar
          </Link>
        </div>
      </div>
    </>
  );
}
