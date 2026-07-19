-- Migration: modulo_progresso — conclusão dos módulos interativos da trilha
-- de aprendizado (glossário, sequência, prato, decisão, checklist, stepper,
-- vídeo, pdf). Uma linha por usuário/módulo; reconclusão não gera moedas de novo
-- (ver /api/modulos/[moduloId]/completar).

CREATE TABLE IF NOT EXISTS modulo_progresso (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  modulo_id TEXT NOT NULL,
  estrelas INTEGER NOT NULL DEFAULT 0 CHECK (estrelas BETWEEN 0 AND 3),
  concluido_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, modulo_id)
);

CREATE INDEX IF NOT EXISTS idx_modulo_progresso_user ON modulo_progresso(user_id);

ALTER TABLE modulo_progresso ENABLE ROW LEVEL SECURITY;

CREATE POLICY "modulo_progresso_select_own" ON modulo_progresso
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "modulo_progresso_insert_own" ON modulo_progresso
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "modulo_progresso_update_own" ON modulo_progresso
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "modulo_progresso_admin_all" ON modulo_progresso
  FOR ALL USING (
    (SELECT role FROM user_profiles WHERE user_id = auth.uid()) = 'admin'
  );

GRANT SELECT, INSERT, UPDATE ON modulo_progresso TO authenticated;
