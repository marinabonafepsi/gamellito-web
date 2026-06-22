"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AssetImage } from "@/components/SiteAssets";

export default function ConsentimentoPage() {
  const router = useRouter();
  const [aceito, setAceito] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function confirmar() {
    if (!aceito) return;
    setSalvando(true);
    setErro(null);

    const res = await fetch("/api/auth/consentimento", { method: "POST" });

    if (!res.ok) {
      setErro("Erro ao registrar consentimento. Tente novamente.");
      setSalvando(false);
      return;
    }

    router.replace("/diario");
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="ds-card w-full max-w-md p-8 md:p-10 flex flex-col gap-6">

        <div className="text-center">
          <AssetImage asset="gamellitoCorpinho" alt="Gamellito" className="w-16 h-auto mx-auto" width={64} height={64} />
          <h1 className="text-2xl font-display font-bold mt-3" style={{ color: "#2B2233" }}>
            Antes de começar
          </h1>
          <p className="text-sm font-body mt-2" style={{ color: "#6B7280" }}>
            Leia como seus dados são usados neste diário.
          </p>
        </div>

        <div className="rounded-2xl p-5 text-sm font-body leading-relaxed flex flex-col gap-3" style={{ background: "#FFF3C9", border: "2px solid #2B223320" }}>
          <p style={{ color: "#2B2233" }}>
            <strong>O que coletamos:</strong>{" "}
            seu e-mail de cadastro e os registros de glicemia que você digitar
            (valor, data/hora, rótulo e observação opcional).
          </p>
          <p style={{ color: "#2B2233" }}>
            <strong>Para que serve:</strong>{" "}
            guardar seus registros com segurança para levar o histórico
            organizado à consulta médica.
          </p>
          <p style={{ color: "#2B2233" }}>
            <strong>O que não fazemos:</strong>{" "}
            não interpretamos valores, não emitimos alertas clínicos e não
            compartilhamos seus dados com terceiros sem sua autorização.
          </p>
          <p style={{ color: "#2B2233" }}>
            <strong>Seus direitos (LGPD art. 18):</strong>{" "}
            você pode apagar todos os seus dados a qualquer momento em
            Conta → Apagar todos os dados.
          </p>
          <p style={{ color: "#2B2233" }}>
            <strong>Dados de crianças:</strong>{" "}
            ao continuar, você declara ser pai, mãe ou responsável legal
            pela criança cujos dados serão registrados, conforme LGPD art. 14.
          </p>
          <p className="text-xs pt-2" style={{ color: "#6B7280", borderTop: "1px solid #2B223320" }}>
            Versão 1.0 — Política de privacidade completa: <em>[link pendente — validação jurídica em andamento]</em>
          </p>
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={aceito}
            onChange={(e) => setAceito(e.target.checked)}
            className="mt-1 h-5 w-5 shrink-0 rounded cursor-pointer accent-[#F26A00]"
          />
          <span className="text-sm font-body leading-relaxed" style={{ color: "#2B2233" }}>
            Li e aceito o uso dos meus dados conforme descrito acima.
            Declaro ser responsável legal pela criança cujos registros
            serão incluídos neste diário.
          </span>
        </label>

        {erro && (
          <p className="text-sm font-body rounded-xl px-3 py-2" style={{ background: "#FEF2F2", color: "#DC2626" }}>
            {erro}
          </p>
        )}

        <button
          onClick={confirmar}
          disabled={!aceito || salvando}
          className="ds-btn ds-btn--lg w-full"
        >
          {salvando ? "Registrando…" : "Aceitar e acessar o diário →"}
        </button>

      </div>
    </div>
  );
}
