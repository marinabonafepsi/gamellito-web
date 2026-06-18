"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Registro } from "@/components/diario/EditarRegistroModal";

type Periodo = "7" | "14" | "30";

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

export default function ExportarPage() {
  const [periodo,    setPeriodo]    = useState<Periodo>("7");
  const [registros,  setRegistros]  = useState<Registro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const dataExportacao = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
  });

  const carregar = useCallback(async () => {
    setCarregando(true);
    const res = await fetch(`/api/registros?periodo=${periodo}`);
    if (res.ok) setRegistros(await res.json() as Registro[]);
    setCarregando(false);
  }, [periodo]);

  useEffect(() => { carregar(); }, [carregar]);

  return (
    <>
      {/* Controles — ocultos na impressão */}
      <div className="print:hidden max-w-lg mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-display font-bold" style={{ color: "#2B2233" }}>
            Exportar registros
          </h1>
          <p className="text-sm font-body mt-1" style={{ color: "#6E59C9" }}>
            Salve como PDF para levar à consulta.
          </p>
        </header>

        {/* Filtro de período */}
        <div className="flex gap-2 mb-6">
          {(["7", "14", "30"] as Periodo[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriodo(p)}
              className={`ds-label ${periodo === p ? "ds-label--active" : ""}`}
            >
              {p} dias
            </button>
          ))}
        </div>

        {carregando ? (
          <p className="font-body text-center py-8" style={{ color: "rgba(43,34,51,0.5)" }}>
            Carregando…
          </p>
        ) : registros.length === 0 ? (
          <div className="ds-card ds-card--cream text-center py-10">
            <p className="font-body" style={{ color: "#2B2233" }}>
              Nenhum registro nos últimos {periodo} dias.
            </p>
          </div>
        ) : (
          <div className="ds-card p-4 mb-6 overflow-x-auto">
            <p className="text-sm font-body mb-3" style={{ color: "rgba(43,34,51,0.6)" }}>
              {registros.length} registro{registros.length !== 1 ? "s" : ""} encontrado{registros.length !== 1 ? "s" : ""}
            </p>
            <PreviewTabela registros={registros} />
          </div>
        )}

        <button
          onClick={() => window.print()}
          disabled={carregando || registros.length === 0}
          className="ds-btn ds-btn--lg w-full"
        >
          Imprimir / Salvar PDF
        </button>

        <div className="mt-4 text-center">
          <Link href="/diario" className="text-sm font-body hover:underline" style={{ color: "rgba(43,34,51,0.6)" }}>
            ← Voltar
          </Link>
        </div>
      </div>

      {/* Área de impressão — só visível ao imprimir */}
      <div className="hidden print:block print:p-8" style={{ fontFamily: "Arial, sans-serif", color: "#000" }}>
        <div style={{ borderBottom: "2px solid #000", paddingBottom: 12, marginBottom: 16 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
            Diário do Gamellito — Registros de glicemia
          </h1>
          <p style={{ fontSize: 13, margin: "4px 0 0", color: "#555" }}>
            Exportado em {dataExportacao} · Últimos {periodo} dias
          </p>
        </div>

        <PreviewTabela registros={registros} print />

        <div style={{ borderTop: "1px solid #ccc", marginTop: 24, paddingTop: 12, fontSize: 11, color: "#555" }}>
          Este documento não substitui orientação médica. Os valores foram registrados pela família
          para organização e apresentação à equipe de saúde.
        </div>
      </div>
    </>
  );
}

function PreviewTabela({ registros, print }: { registros: Registro[]; print?: boolean }) {
  const tdStyle: React.CSSProperties = print
    ? { padding: "6px 8px", borderBottom: "1px solid #ccc", fontSize: 12 }
    : {};
  const thStyle: React.CSSProperties = print
    ? { padding: "6px 8px", borderBottom: "2px solid #000", fontSize: 12, textAlign: "left", fontWeight: 700 }
    : {};

  return (
    <table
      style={print ? { width: "100%", borderCollapse: "collapse" } : undefined}
      className={print ? "" : "w-full text-sm font-body border-collapse"}
    >
      <thead>
        <tr>
          {["Data/Hora", "Valor (mg/dL)", "Momento", "Registrado por", "Observação"].map((h) => (
            <th
              key={h}
              style={print ? thStyle : { color: "#2B2233" }}
              className={print ? "" : "text-left pb-2 font-semibold border-b-2 px-2"}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {registros.map((r) => (
          <tr key={r.id}>
            <td style={tdStyle} className={print ? "" : "py-2 px-2 border-b border-ds-ink/20"}>
              {formatarDataHora(r.data_hora)}
            </td>
            <td style={tdStyle} className={print ? "" : "py-2 px-2 border-b border-ds-ink/20 font-bold"}>
              {r.valor}
            </td>
            <td style={tdStyle} className={print ? "" : "py-2 px-2 border-b border-ds-ink/20"}>
              {ROTULO_LABEL[r.rotulo] ?? r.rotulo}
            </td>
            <td style={tdStyle} className={print ? "" : "py-2 px-2 border-b border-ds-ink/20"}>
              {r.lancado_por}
            </td>
            <td style={tdStyle} className={print ? "" : "py-2 px-2 border-b border-ds-ink/20 text-xs opacity-70"}>
              {r.observacao ?? "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
