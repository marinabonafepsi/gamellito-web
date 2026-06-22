"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "@/components/Modal";
import { identifyUser, isIdentified, track } from "@/lib/analytics";
import { AssetImage } from "@/components/SiteAssets";

interface IdentifyModalProps {
  /** Delay em ms antes de mostrar automaticamente (padrão 45s) */
  autoShowDelay?: number;
  /** Pode ser forçado a abrir externamente */
  forceOpen?: boolean;
  onClose?: () => void;
}

export function IdentifyModal({
  autoShowDelay = 45_000,
  forceOpen = false,
  onClose,
}: IdentifyModalProps) {
  const [visible, setVisible] = useState(false);
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);

  /* Mostrar automaticamente após delay (apenas se não identificado e não mostrado nesta sessão) */
  useEffect(() => {
    if (isIdentified()) return;
    if (sessionStorage.getItem("gml_modal_shown")) return;

    const timer = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem("gml_modal_shown", "true");
      track("identify_modal_shown", window.location.pathname);
    }, autoShowDelay);

    return () => clearTimeout(timer);
  }, [autoShowDelay]);

  /* Forçar abertura externamente */
  useEffect(() => {
    if (forceOpen && !isIdentified()) setVisible(true);
  }, [forceOpen]);

  function handleClose() {
    track("identify_modal_dismissed", window.location.pathname);
    setVisible(false);
    onClose?.();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await identifyUser(name.trim(), email.trim().toLowerCase());
    setLoading(false);
    setDone(true);
    setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 1800);
  }

  return (
    <Modal isOpen={visible} onClose={handleClose} variant="white">
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <AssetImage asset="gamellitoContente" alt="Gamellito" className="w-16 h-auto mx-auto mb-3" width={64} height={64} />
            <h2 className="font-display text-2xl font-bold mb-2" style={{ color: "#2B2233" }}>
              Oba, bem-vindo!
            </h2>
            <p className="font-body text-sm" style={{ color: "#6B7280" }}>
              Agora você faz parte da jornada Gamellito.
            </p>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Mascote */}
            <div className="text-center mb-5">
              <AssetImage asset="gamellitoContente" alt="Gamellito" className="w-14 h-auto mx-auto mb-2" width={56} height={56} />
              <h2 className="font-display text-2xl font-bold mb-1" style={{ color: "#2B2233" }}>
                Quem está explorando por aqui?
              </h2>
              <p className="font-body text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                Nos conte um pouquinho sobre você — assim podemos avisar
                sobre novidades, lançamentos e conteúdo exclusivo.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-body text-sm font-semibold mb-1.5" style={{ color: "#2B2233" }}>
                  Seu nome <span style={{ color: "#6B7280", fontWeight: "normal" }}>(opcional)</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Ana Paula"
                  className="ds-input"
                />
              </div>

              <div>
                <label className="block font-body text-sm font-semibold mb-1.5" style={{ color: "#2B2233" }}>
                  Seu e-mail <span style={{ color: "#EE2B2B" }}>*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@email.com"
                  className="ds-input"
                />
              </div>

              {/* Perfil rápido */}
              <div>
                <p className="font-body text-xs mb-2" style={{ color: "#6B7280" }}>
                  Você é... (opcional)
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Pai/Mãe", "Educador(a)", "Profissional de saúde", "Pessoa com DM1", "Outro"].map(
                    (perfil) => (
                      <button
                        key={perfil}
                        type="button"
                        onClick={() =>
                          setName((n) =>
                            n.includes(`[${perfil}]`)
                              ? n.replace(`[${perfil}]`, "").trim()
                              : `${n} [${perfil}]`.trim()
                          )
                        }
                        className={`ds-label ${name.includes(`[${perfil}]`) ? "ds-label--active" : ""}`}
                      >
                        {perfil}
                      </button>
                    )
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="ds-btn ds-btn--lg w-full"
              >
                {loading ? "Salvando..." : "Entrar na jornada"}
              </button>

              <p className="text-center font-body text-xs" style={{ color: "#9CA3AF" }}>
                Sem spam. Seus dados são usados apenas para personalizar sua
                experiência no Gamellito.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
