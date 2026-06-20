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

const inputClass =
  "w-full rounded-2xl border-[2px] border-[#2B2233] bg-[#EBF4FF] px-4 py-3 font-body text-[#2B2233] placeholder:text-[#2B2233]/40 focus:outline-none focus:ring-2 focus:ring-[#9B8CF0]/60";

const labelClass = "text-sm font-body font-semibold text-[#6E59C9]";

export default function LancarPage() {
  const router = useRouter();

  const [valor, setValor] = useState("");
  const [dataHora, setDataHora] = useState(hojeLocal());
  const [rotulo, setRotulo] = useState<Rotulo | null>(null);
  const [observacao, setObservacao] = useState("");
  const [lancadoPor, setLancadoPor] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
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
          <h1 className="text-3xl font-display font-bold text-[#2B2233]">
            📝 Registrar glicemia
          </h1>
          <p className="text-sm text-[#2B2233]/60 font-body mt-1">
            Preencha os campos e toque em Salvar.
          </p>
        </header>

        <div className="bg-white rounded-3xl border-[3px] border-[#2B2233] shadow-[4px_4px_0_#2B2233] p-6 md:p-8 flex flex-col gap-6">

          {/* Valor */}
          <div className="flex flex-col gap-2">
            <label htmlFor="valor" className={labelClass}>
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
              className="w-full rounded-2xl border-[2px] border-[#2B2233] bg-[#EBF4FF] px-5 py-5 text-4xl font-display font-bold text-[#2B2233] placeholder:text-[#2B2233]/30 text-center focus:outline-none focus:ring-2 focus:ring-[#9B8CF0]/60"
            />
          </div>

          {/* Data e hora */}
          <div className="flex flex-col gap-2">
            <label htmlFor="data_hora" className={labelClass}>
              Data e hora
            </label>
            <input
              id="data_hora"
              type="datetime-local"
              value={dataHora}
              onChange={(e) => setDataHora(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Rótulos */}
          <div className="flex flex-col gap-2">
            <span className={labelClass}>Momento</span>
            <div className="flex flex-wrap gap-2">
              {ROTULOS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setRotulo(id)}
                  className={`rounded-full px-4 py-2 text-sm font-body font-semibold border-[2px] border-[#2B2233] transition-all
                    ${rotulo === id
                      ? "bg-[#F26A00] text-white shadow-[2px_2px_0_#2B2233]"
                      : "bg-white text-[#2B2233] hover:-translate-y-px hover:shadow-[2px_2px_0_#2B2233]"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Quem registra */}
          <div className="flex flex-col gap-2">
            <label htmlFor="lancado_por" className={labelClass}>
              Registrado por
            </label>
            <input
              id="lancado_por"
              type="text"
              placeholder="Ex.: mãe, pai, criança"
              value={lancadoPor}
              onChange={(e) => setLancadoPor(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Observação */}
          <div className="flex flex-col gap-2">
            <label htmlFor="observacao" className={labelClass}>
              Observação{" "}
              <span className="text-[#2B2233]/40 font-normal">(opcional)</span>
            </label>
            <textarea
              id="observacao"
              rows={3}
              placeholder="Ex.: após atividade física, mal-estar…"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>

          {erro && (
            <p className="text-sm text-[#EE2B2B] font-body bg-[#EE2B2B]/10 rounded-xl px-4 py-3 border-[2px] border-[#EE2B2B]/40">
              {erro}
            </p>
          )}

          <button
            onClick={salvar}
            disabled={salvando}
            className="w-full rounded-full bg-[#F26A00] border-[3px] border-[#2B2233] shadow-[3px_3px_0_#2B2233] py-4 text-lg font-display font-bold text-white hover:-translate-y-px hover:shadow-[4px_4px_0_#2B2233] active:translate-y-0.5 active:shadow-[1px_1px_0_#2B2233] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {salvando ? "Salvando…" : "💾 Salvar registro"}
          </button>

          <button
            onClick={() => router.back()}
            className="text-sm text-[#2B2233]/60 font-body hover:text-[#2B2233] transition-colors text-center"
          >
            ← Cancelar
          </button>
        </div>
      </div>
    </>
  );
}
