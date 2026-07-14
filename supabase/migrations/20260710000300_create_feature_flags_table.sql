-- Migration: Create feature_flags table
-- Permite ligar uma feature nova só para o admin (testar em produção) antes
-- de liberar geral virando `ativo_geral`.

CREATE TABLE IF NOT EXISTS feature_flags (
  chave TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  ativo_geral BOOLEAN NOT NULL DEFAULT false,
  visivel_admin BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE feature_flags IS 'Flags para testar features em produção antes de liberar geral';
COMMENT ON COLUMN feature_flags.ativo_geral IS 'Se true, a feature vale para todo mundo';
COMMENT ON COLUMN feature_flags.visivel_admin IS 'Se true (e ativo_geral for false), só o admin vê a feature ativa';

ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

-- Qualquer usuário autenticado pode ler as flags (necessário para gatear UI
-- no client/server); só o valor booleano é exposto, nada sensível.
CREATE POLICY "feature_flags_select_autenticado" ON feature_flags
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Admin gerencia as flags (usa a função SECURITY DEFINER para evitar
-- recursão de RLS em user_profiles — ver migration
-- 20260709000030_fix_remaining_admin_policy_recursion.sql)
CREATE POLICY "feature_flags_admin_all" ON feature_flags
  FOR ALL USING (public.current_user_role() = 'admin');
