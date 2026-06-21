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
      <div className="w-full max-w-md bg-card rounded-3xl border-2 border-gamellito-hospital-purple/25 shadow-2xl p-8 md:p-10 flex flex-col gap-6">

        <div className="text-center">
          <AssetImage asset="gamellitoCorpinho" alt="Gamellito" className="w-16 h-auto mx-auto" width={64} height={64} />
          <h1 className="text-2xl font-display font-bold text-foreground mt-3">
            Antes de começar
          </h1>
          <p className="text-sm font-body mt-2 text-muted-foreground">
            Leia como seus dados são usados neste diário.
          </p>
        </div>

        <div className="rounded-2xl p-5 text-sm font-body leading-relaxed flex flex-col gap-3 bg-muted/60 border border-border">
          <p className="text-foreground">
            <strong>O que coletamos:</strong>{" "}
            seu e-mail de cadastro e os registros de glicemia que você digitar
            (valor, data/hora, rótulo e observação opcional).
          </p>
          <p className="text-foreground">
            <strong>Para que serve:</strong>{" "}
            guardar seus registros com segurança para levar o histórico
            organizado à consulta médica.
          </p>
          <p className="text-foreground">
            <strong>O que não fazemos:</strong>{" "}
            não interpretamos valores, não emitimos alertas clínicos e não
            compartilhamos seus dados com terceiros sem sua autorização.
          </p>
          <p className="text-foreground">
            <strong>Seus direitos (LGPD art. 18):</strong>{" "}
            você pode apagar todos os seus dados a qualquer momento em
            Conta → Apagar todos os dados.
          </p>
          <p className="text-foreground">
            <strong>Dados de crianças:</strong>{" "}
            ao continuar, você declara ser pai, mãe ou responsável legal
            pela criança cujos dados serão registrados, conforme LGPD art. 14.
          </p>
          <p className="text-xs pt-2 text-muted-foreground border-t border-border">
            Versão 1.0 — Política de privacidade completa: <em>[link pendente — validação jurídica em andamento]</em>
          </p>
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={aceito}
            onChange={(e) => setAceito(e.target.checked)}
            className="mt-1 h-5 w-5 shrink-0 rounded cursor-pointer accent-primary"
          />
          <span className="text-sm font-body leading-relaxed text-foreground">
            Li e aceito o uso dos meus dados conforme descrito acima.
            Declaro ser responsável legal pela criança cujos registros
            serão incluídos neste diário.
          </span>
        </label>

        {erro && (
          <p className="text-sm font-body bg-destructive/10 text-destructive px-3 py-2 rounded-xl">
            {erro}
          </p>
        )}

        <button
          onClick={confirmar}
          disabled={!aceito || salvando}
          className="w-full bg-primary text-primary-foreground rounded-full font-display font-bold text-base py-3 hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {salvando ? "Registrando…" : "Aceitar e acessar o diário →"}
        </button>

      </div>
    </div>
  );
}
