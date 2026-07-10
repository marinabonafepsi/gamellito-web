-- Migration: Create medicamentos table
-- Posologia atual informada pelo responsável no app. Gestão completa
-- (lembretes, cálculo de dose, etc.) fica para depois — por ora é só um
-- registro estruturado do que a família já preenche manualmente hoje,
-- visível também para profissionais com permissão de acesso ao paciente.

CREATE TABLE IF NOT EXISTS medicamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  familia_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('basal', 'bolus', 'outro')),
  dose TEXT NOT NULL,
  horarios TEXT NOT NULL,
  desde DATE,
  observacao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_medicamentos_familia ON medicamentos(familia_id, ativo);

COMMENT ON TABLE medicamentos IS 'Posologia atual informada pelo responsável no app (dado manual, não gestão automatizada)';
COMMENT ON COLUMN medicamentos.tipo IS 'basal (insulina de ação lenta) | bolus (ação rápida) | outro';
COMMENT ON COLUMN medicamentos.ativo IS 'false = descontinuado (mantém histórico sem aparecer na posologia atual)';

ALTER TABLE medicamentos ENABLE ROW LEVEL SECURITY;

-- FAMILIA: CRUD completo dos próprios medicamentos
DROP POLICY IF EXISTS "medicamentos_familia_select" ON medicamentos;
CREATE POLICY "medicamentos_familia_select" ON medicamentos
  FOR SELECT USING (familia_id = auth.uid());

DROP POLICY IF EXISTS "medicamentos_familia_insert" ON medicamentos;
CREATE POLICY "medicamentos_familia_insert" ON medicamentos
  FOR INSERT WITH CHECK (familia_id = auth.uid());

DROP POLICY IF EXISTS "medicamentos_familia_update" ON medicamentos;
CREATE POLICY "medicamentos_familia_update" ON medicamentos
  FOR UPDATE USING (familia_id = auth.uid());

DROP POLICY IF EXISTS "medicamentos_familia_delete" ON medicamentos;
CREATE POLICY "medicamentos_familia_delete" ON medicamentos
  FOR DELETE USING (familia_id = auth.uid());

-- PROFISSIONAL: vê medicamentos apenas de pacientes que compartilharam
-- (mesma checagem que registros_profissional_select em 009)
DROP POLICY IF EXISTS "medicamentos_profissional_select" ON medicamentos;
CREATE POLICY "medicamentos_profissional_select" ON medicamentos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM permissoes
      WHERE permissoes.usuario_dono = medicamentos.familia_id
        AND permissoes.usuario_acesso = auth.uid()
        AND tipo_acesso IN ('readonly', 'comment', 'full')
        AND (permissoes.expira_em IS NULL OR permissoes.expira_em > now())
        AND permissoes.revogado_em IS NULL
    )
  );

-- ADMIN: vê tudo
DROP POLICY IF EXISTS "medicamentos_admin_all" ON medicamentos;
CREATE POLICY "medicamentos_admin_all" ON medicamentos
  FOR ALL USING (
    (SELECT role FROM user_profiles WHERE user_id = auth.uid()) = 'admin'
  );
