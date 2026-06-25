"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { RecompensaSalvar } from "@/components/diario/RecompensaSalvar";

type Rotulo = "jejum" | "antes" | "depois" | "dormir" | "outro";

const ROTULOS: { id: Rotulo; label: string; emoji: string }[] = [
  { id: "jejum",  label: "Jejum", emoji: "🌅" },
  { id: "antes",  label: "Antes", emoji: "🍽️" },
  { id: "depois", label: "Depois", emoji: "😋" },
  { id: "dormir", label: "Sono", emoji: "😴" },
  { id: "outro",  label: "Outro", emoji: "❓" },
];

interface Registro {
  valor: number;
  data_hora: string;
}

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
  const [registros,  setRegistros]  = useState<Registro[]>([]);

  // Carregar últimos registros para gráfico
  useEffect(() => {
    async function carregarRegistros() {
      const client = createClient();
      const hoje = new Date();
      const seteDiasAtras = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);

      const { data } = await client
        .from("registros_glicemia")
        .select("valor, data_hora")
        .gte("data_hora", seteDiasAtras.toISOString())
        .order("data_hora", { ascending: true });

      if (data) setRegistros(data as Registro[]);
    }
    carregarRegistros();
  }, []);

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
      setErro("Escolha um momento.");
      return;
    }
    if (!lancadoPor.trim()) {
      setErro("Informe quem está registrando.");
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
      setErro(err.error ?? "Erro ao salvar. Tente novamente.");
      return;
    }

    setRecompensa(true);
  }

  // Calcula min/max para escala do gráfico
  const valores = registros.map((r) => r.valor);
  const minValor = Math.min(...valores, 70);
  const maxValor = Math.max(...valores, 180);
  const range = maxValor - minValor || 1;

  return (
    <>
      <RecompensaSalvar visivel={recompensa} onFim={esconderRecompensa} />

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-display font-bold text-[#2B2233] mb-2">
            Registrar glicemia
          </h1>
          <p className="text-sm font-body text-[#2B2233]/60">
            Preencha os campos abaixo para adicionar um novo registro
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          {/* Formulário */}
          <div className="gm-card gm-card--cream">
            <div className="space-y-6">
              {/* Valor */}
              <div className="flex flex-col gap-2">
                <label htmlFor="valor" className="text-sm font-body font-semibold text-[#2B2233]">
                  Valor (mg/dL)
                </label>
                <input
                  id="valor"
                  type="number"
                  inputMode="numeric"
                  placeholder="120"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  className="px-4 py-3 border-2 border-[#2B2233] rounded-lg font-body text-[#2B2233] placeholder-[#2B2233]/40 focus:outline-none focus:ring-2 focus:ring-[#F26A00] focus:ring-offset-2"
                />
              </div>

              {/* Data e hora */}
              <div className="flex flex-col gap-2">
                <label htmlFor="data_hora" className="text-sm font-body font-semibold text-[#2B2233]">
                  Data e hora
                </label>
                <input
                  id="data_hora"
                  type="datetime-local"
                  value={dataHora}
                  onChange={(e) => setDataHora(e.target.value)}
                  className="px-4 py-3 border-2 border-[#2B2233] rounded-lg font-body text-[#2B2233] focus:outline-none focus:ring-2 focus:ring-[#F26A00] focus:ring-offset-2"
                />
              </div>

              {/* Rótulos */}
              <div className="flex flex-col gap-3">
                <span className="text-sm font-body font-semibold text-[#2B2233]">
                  Momento
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {ROTULOS.map(({ id, label, emoji }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setRotulo(id)}
                      className={`flex flex-col items-center gap-1 py-3 px-2 rounded-lg border-2 transition-all ${
                        rotulo === id
                          ? "border-[#F26A00] bg-[#F26A00]/10"
                          : "border-[#2B2233]/20 bg-white hover:border-[#F26A00]"
                      }`}
                    >
                      <span className="text-xl">{emoji}</span>
                      <span className="text-xs font-body font-semibold text-[#2B2233]">
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quem registra */}
              <div className="flex flex-col gap-2">
                <label htmlFor="lancado_por" className="text-sm font-body font-semibold text-[#2B2233]">
                  Registrado por
                </label>
                <input
                  id="lancado_por"
                  type="text"
                  placeholder="Mãe, pai, criança…"
                  value={lancadoPor}
                  onChange={(e) => setLancadoPor(e.target.value)}
                  className="px-4 py-3 border-2 border-[#2B2233] rounded-lg font-body text-[#2B2233] placeholder-[#2B2233]/40 focus:outline-none focus:ring-2 focus:ring-[#F26A00] focus:ring-offset-2"
                />
              </div>

              {/* Observação */}
              <div className="flex flex-col gap-2">
                <label htmlFor="observacao" className="text-sm font-body font-semibold text-[#2B2233]">
                  Observação{" "}
                  <span className="font-normal text-[#2B2233]/50">(opcional)</span>
                </label>
                <textarea
                  id="observacao"
                  rows={2}
                  placeholder="Ex.: após atividade, teve tosse…"
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  className="px-4 py-3 border-2 border-[#2B2233] rounded-lg font-body text-[#2B2233] placeholder-[#2B2233]/40 focus:outline-none focus:ring-2 focus:ring-[#F26A00] focus:ring-offset-2 resize-none"
                />
              </div>

              {erro && (
                <div className="gm-card gm-card--cream border-2 border-red-500 bg-red-50">
                  <p className="text-sm font-body text-red-600">{erro}</p>
                </div>
              )}

              <button
                onClick={salvar}
                disabled={salvando}
                className="gm-btn gm-btn--primary gm-btn--lg w-full"
              >
                {salvando ? "Salvando…" : "💾 Salvar registro"}
              </button>

              <button
                onClick={() => router.back()}
                className="text-sm font-body text-center text-[#2B2233]/50 hover:text-[#2B2233] transition-colors"
              >
                ← Voltar
              </button>
            </div>
          </div>

          {/* Gráfico dos últimos 7 dias */}
          <div className="gm-card gm-card--sun">
            <h3 className="text-sm font-body font-semibold text-[#2B2233] mb-4">
              Últimos 7 dias
            </h3>

            {registros.length === 0 ? (
              <p className="text-xs font-body text-[#2B2233]/50 text-center py-8">
                Nenhum registro ainda
              </p>
            ) : (
              <div className="space-y-3">
                {/* Mini gráfico */}
                <div className="flex items-end gap-1 h-32 bg-white/30 rounded-lg p-3">
                  {registros.map((r, i) => {
                    const percent = (r.valor - minValor) / range;
                    const height = Math.max(20, percent * 100);
                    const color =
                      r.valor < 70
                        ? "#EE2B2B"
                        : r.valor > 180
                          ? "#F26A00"
                          : "#8DC63F";

                    return (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: `${height}%`,
                          background: color,
                          borderRadius: "4px 4px 0 0",
                        }}
                        title={`${r.valor} mg/dL`}
                      />
                    );
                  })}
                </div>

                {/* Stats */}
                <div className="space-y-2 text-xs font-body text-[#2B2233]">
                  <div className="flex justify-between">
                    <span>Mín:</span>
                    <span className="font-semibold">
                      {Math.min(...valores)} mg/dL
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Máx:</span>
                    <span className="font-semibold">
                      {Math.max(...valores)} mg/dL
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Média:</span>
                    <span className="font-semibold">
                      {Math.round(valores.reduce((a, b) => a + b, 0) / valores.length)} mg/dL
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
