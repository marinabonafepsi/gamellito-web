-- Migration: Missões diárias — base pro app mobile (Android, perfil DM1) e,
-- futuramente, pro site. Ver plano "Gamellito App Android — primeiro momento
-- nativo (Pais + DM1)" de 2026-07-20: o mockup DM1 mostra uma lista de
-- missões do dia com recompensa em coins e uma missão especial "definida
-- pela mamãe" com meta de dias — nenhuma dessas duas coisas existia no banco
-- ainda, então nascem aqui já com RLS/RPC no mesmo padrão de
-- certifications/coin_transactions (20260720000200_create_certifications_coins_ledger.sql).

-- ============================================================================
-- missoes — catálogo. 'sistema' = mesma lista pra todo DM1 (seed abaixo);
-- 'familia' = missão custom criada por quem tem permissão sobre um DM1
-- específico (ex: "Medir sozinho 5 dias → Cineminha", com meta_dias).
-- ============================================================================
CREATE TABLE IF NOT EXISTS missoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  periodo TEXT NOT NULL DEFAULT 'qualquer' CHECK (periodo IN ('manha', 'tarde', 'noite', 'qualquer')),
  icone_slug TEXT,
  coin_reward INTEGER NOT NULL DEFAULT 0 CHECK (coin_reward >= 0),
  escopo TEXT NOT NULL DEFAULT 'sistema' CHECK (escopo IN ('sistema', 'familia')),
  dm1_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  criado_por UUID REFERENCES auth.users(id),
  meta_dias INTEGER CHECK (meta_dias IS NULL OR meta_dias > 0),
  ativo BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (escopo = 'sistema' AND dm1_id IS NULL OR escopo = 'familia' AND dm1_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_missoes_dm1 ON missoes(dm1_id) WHERE dm1_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_missoes_escopo ON missoes(escopo);

COMMENT ON TABLE missoes IS 'Catálogo de missões diárias (sistema = padrão pra todo DM1, familia = custom por dm1_id)';
COMMENT ON COLUMN missoes.meta_dias IS 'Missões tipo streak (ex: "medir sozinho 5 dias") — progresso é COUNT(missao_conclusoes) desse missao_id, sem limite de data';

ALTER TABLE missoes ENABLE ROW LEVEL SECURITY;

-- Qualquer autenticado vê as missões 'sistema' ativas
CREATE POLICY "missoes_sistema_select" ON missoes
  FOR SELECT USING (escopo = 'sistema' AND ativo = true);

-- Missão 'familia' de um dm1_id: o próprio DM1, ou quem tem permissão sobre ele
CREATE POLICY "missoes_familia_select" ON missoes
  FOR SELECT USING (
    escopo = 'familia' AND (
      dm1_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM permissoes
        WHERE permissoes.usuario_dono = missoes.dm1_id
          AND permissoes.usuario_acesso = auth.uid()
          AND tipo_acesso IN ('readonly', 'comment', 'full')
          AND (permissoes.expira_em IS NULL OR permissoes.expira_em > now())
          AND permissoes.revogado_em IS NULL
      )
    )
  );

-- Só quem tem permissão comment/full sobre o dm1_id pode criar missão custom pra ele
CREATE POLICY "missoes_familia_insert" ON missoes
  FOR INSERT WITH CHECK (
    escopo = 'familia'
    AND criado_por = auth.uid()
    AND EXISTS (
      SELECT 1 FROM permissoes
      WHERE permissoes.usuario_dono = missoes.dm1_id
        AND permissoes.usuario_acesso = auth.uid()
        AND tipo_acesso IN ('comment', 'full')
        AND (permissoes.expira_em IS NULL OR permissoes.expira_em > now())
        AND permissoes.revogado_em IS NULL
    )
  );

CREATE POLICY "missoes_admin_all" ON missoes
  FOR ALL USING (public.current_user_role() = 'admin');

-- ============================================================================
-- missao_conclusoes — 1 linha por (usuário, missão, dia). Progresso de
-- missões com meta_dias = COUNT(*) WHERE missao_id = X, sem depender de data.
-- ============================================================================
CREATE TABLE IF NOT EXISTS missao_conclusoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  missao_id UUID NOT NULL REFERENCES missoes(id) ON DELETE CASCADE,
  data DATE NOT NULL DEFAULT current_date,
  concluido_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, missao_id, data)
);

CREATE INDEX IF NOT EXISTS idx_missao_conclusoes_user ON missao_conclusoes(user_id);
CREATE INDEX IF NOT EXISTS idx_missao_conclusoes_missao ON missao_conclusoes(missao_id);

ALTER TABLE missao_conclusoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "missao_conclusoes_select_own" ON missao_conclusoes
  FOR SELECT USING (user_id = auth.uid());

-- Família/profissional acompanha o progresso do DM1 (ex: card "3/5" no mockup)
CREATE POLICY "missao_conclusoes_select_vinculado" ON missao_conclusoes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM permissoes
      WHERE permissoes.usuario_dono = missao_conclusoes.user_id
        AND permissoes.usuario_acesso = auth.uid()
        AND tipo_acesso IN ('readonly', 'comment', 'full')
        AND (permissoes.expira_em IS NULL OR permissoes.expira_em > now())
        AND permissoes.revogado_em IS NULL
    )
  );

CREATE POLICY "missao_conclusoes_admin_all" ON missao_conclusoes
  FOR ALL USING (public.current_user_role() = 'admin');

-- Sem policy de INSERT direto: toda conclusão passa pela RPC concluir_missao
-- (SECURITY DEFINER abaixo), pra garantir que o crédito de coins e o registro
-- fiquem atômicos e o usuário não possa forjar conclusão de missão alheia.

-- 'missao' precisa entrar no enum de motivos do ledger de coins, mesmo padrão
-- da migration 20260720000300 que adicionou 'registro'.
ALTER TABLE coin_transactions DROP CONSTRAINT coin_transactions_reason_check;
ALTER TABLE coin_transactions ADD CONSTRAINT coin_transactions_reason_check CHECK (reason IN (
  'module', 'registro', 'missao', 'certification', 'streak', 'referral', 'redemption',
  'cashback', 'feedback', 'expiry', 'migration_backfill', 'legacy', 'admin_adjustment'
));

-- ============================================================================
-- RPC: concluir_missao — idempotente (NULL se já concluída na data), credita
-- coin_reward da missão via incrementar_coins.
-- ============================================================================
CREATE OR REPLACE FUNCTION concluir_missao(
  p_user_id UUID,
  p_missao_id UUID,
  p_data DATE DEFAULT current_date
)
RETURNS missao_conclusoes
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_conclusao missao_conclusoes%ROWTYPE;
  v_coin_reward INTEGER;
BEGIN
  SELECT coin_reward INTO v_coin_reward FROM missoes WHERE id = p_missao_id AND ativo = true;
  IF v_coin_reward IS NULL THEN
    RETURN NULL;
  END IF;

  INSERT INTO missao_conclusoes (user_id, missao_id, data)
  VALUES (p_user_id, p_missao_id, p_data)
  ON CONFLICT (user_id, missao_id, data) DO NOTHING
  RETURNING * INTO v_conclusao;

  IF v_conclusao.id IS NULL THEN
    RETURN NULL; -- já concluída nessa data
  END IF;

  IF v_coin_reward > 0 THEN
    PERFORM incrementar_coins(p_user_id, v_coin_reward, 'missao', p_missao_id);
  END IF;

  RETURN v_conclusao;
END;
$$;

GRANT EXECUTE ON FUNCTION concluir_missao(UUID, UUID, DATE) TO authenticated;

-- ============================================================================
-- Seed: missões 'sistema', itens do mockup DM1
-- ============================================================================
INSERT INTO missoes (slug, titulo, periodo, coin_reward, escopo) VALUES
  ('medir-ao-acordar', 'Medir ao acordar', 'manha', 10, 'sistema'),
  ('insulina-basal', 'Insulina basal', 'manha', 10, 'sistema'),
  ('contar-carbo-almoco', 'Contar carbo do almoço', 'tarde', 15, 'sistema'),
  ('medir-antes-lanche', 'Medir antes do lanche', 'tarde', 15, 'sistema'),
  ('insulina-jantar', 'Insulina do jantar', 'noite', 20, 'sistema'),
  ('como-me-senti-hoje', 'Como me senti hoje', 'noite', 10, 'sistema'),
  ('jogar-licao-trilha', 'Jogar 1 lição da trilha', 'qualquer', 20, 'sistema')
ON CONFLICT (slug) DO NOTHING;
