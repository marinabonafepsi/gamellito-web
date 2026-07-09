-- ============================================================================
-- Adiciona o papel 'dm1' (pessoa com diabetes tipo 1, sem ser o responsável)
-- Reaproveita o mesmo dashboard/diário do perfil 'familia'
-- ============================================================================
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_role_check;

ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_role_check
  CHECK (role IN ('admin', 'familia', 'dm1', 'profissional', 'educador', 'instituicao'));
