-- Migration: Fase 2 do sistema "Amigos do Gamellito" — concessão automática de
-- certificações de trilha ao completar o último módulo de um nível, ver
-- supabase/migrations/20260720000200_create_certifications_coins_ledger.sql.

-- 'registro' = coins do diário de glicemia (src/app/api/registros/route.ts),
-- que até aqui caía em 'legacy' por falta de uma categoria própria no ledger.
ALTER TABLE coin_transactions DROP CONSTRAINT coin_transactions_reason_check;
ALTER TABLE coin_transactions ADD CONSTRAINT coin_transactions_reason_check CHECK (reason IN (
  'module', 'registro', 'certification', 'streak', 'referral', 'redemption',
  'cashback', 'feedback', 'expiry', 'migration_backfill', 'legacy', 'admin_adjustment'
));

-- ============================================================================
-- RPC: verificar_e_conceder_certificacao — chamada após marcar um módulo como
-- concluído. Se esse módulo pertence a uma trilha com certificação (N1-N4) e
-- era o último módulo pendente dela, concede o certificado + credita as
-- coins do nível. Idempotente: retorna NULL se não há nada novo a conceder
-- (nível incompleto, sem certificação associada, ou já concedido antes).
-- ============================================================================
CREATE OR REPLACE FUNCTION verificar_e_conceder_certificacao(p_user_id UUID, p_modulo_id TEXT)
RETURNS certifications
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_trilha_id UUID;
  v_certificacao certifications%ROWTYPE;
  v_total_modulos INT;
  v_concluidos INT;
BEGIN
  SELECT trilha_id INTO v_trilha_id FROM modulos WHERE id = p_modulo_id;
  IF v_trilha_id IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT * INTO v_certificacao FROM certifications
    WHERE trilha_id = v_trilha_id AND type = 'trail' AND ativo = true
    LIMIT 1;
  IF v_certificacao.id IS NULL THEN
    RETURN NULL;
  END IF;

  IF EXISTS (
    SELECT 1 FROM user_certifications
    WHERE user_id = p_user_id AND certification_id = v_certificacao.id
  ) THEN
    RETURN NULL;
  END IF;

  SELECT count(*) INTO v_total_modulos FROM modulos WHERE trilha_id = v_trilha_id AND ativo = true;
  IF v_total_modulos = 0 THEN
    RETURN NULL;
  END IF;

  SELECT count(*) INTO v_concluidos
  FROM modulo_progresso mp
  JOIN modulos m ON m.id = mp.modulo_id
  WHERE mp.user_id = p_user_id AND m.trilha_id = v_trilha_id AND m.ativo = true;

  IF v_concluidos < v_total_modulos THEN
    RETURN NULL;
  END IF;

  INSERT INTO user_certifications (user_id, certification_id)
  VALUES (p_user_id, v_certificacao.id)
  ON CONFLICT (user_id, certification_id) DO NOTHING;

  IF NOT FOUND THEN
    RETURN NULL; -- corrida: outra request concedeu entre o EXISTS acima e aqui
  END IF;

  IF v_certificacao.coin_reward > 0 THEN
    PERFORM incrementar_coins(p_user_id, v_certificacao.coin_reward, 'certification', v_certificacao.id);
  END IF;

  RETURN v_certificacao;
END;
$$;

GRANT EXECUTE ON FUNCTION verificar_e_conceder_certificacao(UUID, TEXT) TO authenticated;
