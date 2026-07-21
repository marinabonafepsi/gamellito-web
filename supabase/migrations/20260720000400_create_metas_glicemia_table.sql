-- Migration: Create metas_glicemia table
-- Faixa-alvo de glicemia por momento do dia, definida pelo profissional de
-- saúde responsável (não é um cálculo do Gamellito nem um valor genérico).
-- Decisão de produto de 2026-07-20: o Diário passa a mostrar essa faixa de
-- forma pedagógica no app da família — mas só quando ela vier de um médico
-- de verdade, nunca um default inventado pelo software.

CREATE TABLE IF NOT EXISTS metas_glicemia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  familia_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  momento TEXT NOT NULL CHECK (momento IN ('jejum', 'antes', 'depois', 'dormir')),
  min INTEGER NOT NULL CHECK (min > 0),
  max INTEGER NOT NULL CHECK (max > min),
  definido_por UUID NOT NULL REFERENCES auth.users(id),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (familia_id, momento)
);

CREATE INDEX IF NOT EXISTS idx_metas_glicemia_familia ON metas_glicemia(familia_id);

COMMENT ON TABLE metas_glicemia IS 'Faixa-alvo de glicemia por momento do dia, definida por um profissional com acesso ao paciente (nunca gerada pelo Gamellito)';
COMMENT ON COLUMN metas_glicemia.definido_por IS 'user_id do profissional que definiu/atualizou esta faixa';

ALTER TABLE metas_glicemia ENABLE ROW LEVEL SECURITY;

-- FAMILIA: só leitura da própria faixa (quem define é o profissional)
DROP POLICY IF EXISTS "metas_glicemia_familia_select" ON metas_glicemia;
CREATE POLICY "metas_glicemia_familia_select" ON metas_glicemia
  FOR SELECT USING (familia_id = auth.uid());

-- PROFISSIONAL: vê e define faixas apenas de pacientes que compartilharam
-- acesso de nível 'comment' ou 'full' (readonly não basta pra escrever)
DROP POLICY IF EXISTS "metas_glicemia_profissional_select" ON metas_glicemia;
CREATE POLICY "metas_glicemia_profissional_select" ON metas_glicemia
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM permissoes
      WHERE permissoes.usuario_dono = metas_glicemia.familia_id
        AND permissoes.usuario_acesso = auth.uid()
        AND tipo_acesso IN ('readonly', 'comment', 'full')
        AND (permissoes.expira_em IS NULL OR permissoes.expira_em > now())
        AND permissoes.revogado_em IS NULL
    )
  );

DROP POLICY IF EXISTS "metas_glicemia_profissional_insert" ON metas_glicemia;
CREATE POLICY "metas_glicemia_profissional_insert" ON metas_glicemia
  FOR INSERT WITH CHECK (
    definido_por = auth.uid()
    AND EXISTS (
      SELECT 1 FROM permissoes
      WHERE permissoes.usuario_dono = metas_glicemia.familia_id
        AND permissoes.usuario_acesso = auth.uid()
        AND tipo_acesso IN ('comment', 'full')
        AND (permissoes.expira_em IS NULL OR permissoes.expira_em > now())
        AND permissoes.revogado_em IS NULL
    )
  );

DROP POLICY IF EXISTS "metas_glicemia_profissional_update" ON metas_glicemia;
CREATE POLICY "metas_glicemia_profissional_update" ON metas_glicemia
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM permissoes
      WHERE permissoes.usuario_dono = metas_glicemia.familia_id
        AND permissoes.usuario_acesso = auth.uid()
        AND tipo_acesso IN ('comment', 'full')
        AND (permissoes.expira_em IS NULL OR permissoes.expira_em > now())
        AND permissoes.revogado_em IS NULL
    )
  );

-- ADMIN: vê e mexe em tudo
DROP POLICY IF EXISTS "metas_glicemia_admin_all" ON metas_glicemia;
CREATE POLICY "metas_glicemia_admin_all" ON metas_glicemia
  FOR ALL USING (
    (SELECT role FROM user_profiles WHERE user_id = auth.uid()) = 'admin'
  );
