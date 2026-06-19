"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "@/components/icons";
import { identifyUser, isIdentified, track } from "@/lib/analytics";

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

  /* Mostrar automaticamente após delay (apenas se não identificado) */
  useEffect(() => {
    if (isIdentified()) return;

    const timer = setTimeout(() => {
      setVisible(true);
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
    <AnimatePresence>
      {visible && (
        <motion.div
          key="identify-backdrop"
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-gamellito-space/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            key="identify-modal"
            className="relative w-full max-w-md bg-card rounded-3xl p-8 shadow-2xl border-2 border-gamellito-hospital-purple/25"
            initial={{ y: 60, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>

            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <div className="text-5xl mb-3">🎉</div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                    Oba, bem-vindo!
                  </h2>
                  <p className="font-body text-muted-foreground">
                    Agora você faz parte da jornada Gamellito.
                  </p>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {/* Mascote */}
                  <div className="text-center mb-5">
                    <div className="text-4xl mb-2">👾</div>
                    <h2 className="font-display text-2xl font-bold text-foreground mb-1">
                      Quem está explorando por aqui?
                    </h2>
                    <p className="font-body text-muted-foreground text-sm leading-relaxed">
                      Nos conte um pouquinho sobre você — assim podemos avisar
                      sobre novidades, lançamentos e conteúdo exclusivo.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block font-body text-sm font-semibold text-foreground mb-1.5">
                        Seu nome <span className="text-muted-foreground font-normal">(opcional)</span>
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Ana Paula"
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                      />
                    </div>

                    <div>
                      <label className="block font-body text-sm font-semibold text-foreground mb-1.5">
                        Seu e-mail <span className="text-gamellito-mae-red">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="voce@email.com"
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                      />
                    </div>

                    {/* Perfil rápido */}
                    <div>
                      <p className="font-body text-xs text-muted-foreground mb-2">
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
                              className={`px-3 py-1 rounded-full text-xs font-body font-semibold border transition-colors ${
                                name.includes(`[${perfil}]`)
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-background text-foreground border-border hover:border-primary/40"
                              }`}
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
                      className="w-full py-3 bg-primary text-primary-foreground font-body font-semibold rounded-full hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                      {loading ? "Salvando..." : "Entrar na jornada"}
                    </button>

                    <p className="text-center font-body text-xs text-muted-foreground">
                      Sem spam. Seus dados são usados apenas para personalizar sua
                      experiência no Gamellito.
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
