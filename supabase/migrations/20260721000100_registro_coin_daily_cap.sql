-- Migration: Anti-farm de coins por registro de glicemia — gap documentado no
-- handoff de design de 2026-07-21 (design-system-oficia/project/HANDOFF-NOTES.md):
-- "o +15 (e afins) ao confirmar uma glicemia NÃO pode ser explorável [...]
-- Aplicar um cap diário de coins por registro [...] Validar no backend — nunca
-- confiar na contagem do cliente." Hoje /api/registros credita
-- incrementar_coins() sem nenhum teto, então uma criança podia forjar
-- registros repetidos pra farmar coins ilimitadas.
--
-- ESCOPO: este migration só resolve o teto diário (enforced no banco, não na
-- API route). A regra mais rica do doc — "dar coin só nas medições
-- esperadas/agendadas ou vinculadas a missão" — depende de ligar `registros`
-- a `missoes`/agenda, o que ainda não existe no schema; fica como próximo
-- passo, não bloqueia este fix.

-- ============================================================================
-- coin_config: teto diário de coins vindas de reason='registro'
-- ============================================================================
INSERT INTO coin_config (key, value, descricao) VALUES
  ('rule.registro_daily_coin_cap', 120, 'Teto diário de coins ganhas via registros de glicemia (reason=registro), anti-farm. Editável sem deploy.')
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- RPC: creditar_coins_registro — substitui a chamada direta a
-- incrementar_coins() que /api/registros fazia. Credita no máximo o que
-- falta pro teto diário (pode creditar 0 se o teto já foi atingido) e
-- devolve o valor efetivamente creditado, pra API não mentir pro cliente
-- sobre quantas coins ele ganhou.
--
-- Lock em user_profiles (mesmo padrão de gastar_coins) serializa chamadas
-- concorrentes do mesmo usuário, evitando corrida que burlaria o teto.
-- ============================================================================
CREATE OR REPLACE FUNCTION creditar_coins_registro(
  p_user_id UUID,
  p_quantidade INTEGER,
  p_registro_id UUID DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cap INTEGER;
  v_ganho_hoje INTEGER;
  v_a_creditar INTEGER;
BEGIN
  PERFORM 1 FROM user_profiles WHERE user_id = p_user_id FOR UPDATE;

  SELECT value INTO v_cap FROM coin_config WHERE key = 'rule.registro_daily_coin_cap';

  SELECT COALESCE(SUM(amount), 0) INTO v_ganho_hoje
  FROM coin_transactions
  WHERE user_id = p_user_id
    AND reason = 'registro'
    AND created_at >= date_trunc('day', now());

  v_a_creditar := LEAST(p_quantidade, GREATEST(v_cap - v_ganho_hoje, 0));

  IF v_a_creditar > 0 THEN
    PERFORM incrementar_coins(p_user_id, v_a_creditar, 'registro', p_registro_id);
  END IF;

  RETURN v_a_creditar;
END;
$$;

GRANT EXECUTE ON FUNCTION creditar_coins_registro(UUID, INTEGER, UUID) TO authenticated;
