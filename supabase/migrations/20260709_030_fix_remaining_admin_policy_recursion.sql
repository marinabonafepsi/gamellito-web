-- Fix: as policies "admin" abaixo ainda usavam a subquery recursiva
-- `(SELECT role FROM user_profiles WHERE user_id = auth.uid())`, incluindo
-- a policy "profiles_admin_select" na PRÓPRIA user_profiles — a raiz do
-- problema. Qualquer leitura de user_profiles (própria ou via subquery de
-- outra tabela) precisa reavaliar todas as policies de SELECT de
-- user_profiles, e essa reavaliação da própria policy recursiva causa
-- 42P17 "infinite recursion detected in policy for relation user_profiles".
-- Isso não ficava restrito a biblioteca_artigos (já corrigido na migration
-- 020): qualquer checagem "admin vê tudo" em qualquer tabela do schema
-- estava (ou ficaria, assim que alguém batesse nesse caminho) quebrada.
--
-- Fix: trocar a subquery por public.current_user_role() (SECURITY DEFINER,
-- já criada na migration 020), que roda como dono da tabela e não reaciona
-- RLS de user_profiles.

DROP POLICY IF EXISTS "profiles_admin_select" ON user_profiles;
CREATE POLICY "profiles_admin_select" ON user_profiles
  FOR SELECT USING (public.current_user_role() = 'admin');

DROP POLICY IF EXISTS "registros_admin_select" ON registros;
CREATE POLICY "registros_admin_select" ON registros
  FOR SELECT USING (public.current_user_role() = 'admin');

DROP POLICY IF EXISTS "profissionais_admin_all" ON profissionais;
CREATE POLICY "profissionais_admin_all" ON profissionais
  FOR ALL USING (public.current_user_role() = 'admin');

DROP POLICY IF EXISTS "instituicoes_admin_all" ON instituicoes;
CREATE POLICY "instituicoes_admin_all" ON instituicoes
  FOR ALL USING (public.current_user_role() = 'admin');

DROP POLICY IF EXISTS "permissoes_admin_select" ON permissoes;
CREATE POLICY "permissoes_admin_select" ON permissoes
  FOR SELECT USING (public.current_user_role() = 'admin');

DROP POLICY IF EXISTS "grupos_admin_all" ON grupos;
CREATE POLICY "grupos_admin_all" ON grupos
  FOR ALL USING (public.current_user_role() = 'admin');

DROP POLICY IF EXISTS "grupos_membros_admin_all" ON grupos_membros;
CREATE POLICY "grupos_membros_admin_all" ON grupos_membros
  FOR ALL USING (public.current_user_role() = 'admin');

DROP POLICY IF EXISTS "consentimentos_admin_select" ON consentimentos_granular;
CREATE POLICY "consentimentos_admin_select" ON consentimentos_granular
  FOR SELECT USING (public.current_user_role() = 'admin');

DROP POLICY IF EXISTS "convites_admin_all" ON convites;
CREATE POLICY "convites_admin_all" ON convites
  FOR ALL USING (public.current_user_role() = 'admin');

DROP POLICY IF EXISTS "loja_items_admin_all" ON loja_items;
CREATE POLICY "loja_items_admin_all" ON loja_items
  FOR ALL USING (public.current_user_role() = 'admin');

DROP POLICY IF EXISTS "inventario_admin_all" ON inventario_usuario;
CREATE POLICY "inventario_admin_all" ON inventario_usuario
  FOR ALL USING (public.current_user_role() = 'admin');

DROP POLICY IF EXISTS "clinical_notes_admin_all" ON clinical_notes;
CREATE POLICY "clinical_notes_admin_all" ON clinical_notes
  FOR ALL USING (public.current_user_role() = 'admin');

DROP POLICY IF EXISTS "humor_admin_all" ON humor_logs;
CREATE POLICY "humor_admin_all" ON humor_logs
  FOR ALL USING (public.current_user_role() = 'admin');

-- recursos vem de uma migration separada (20260709000200) que pode ainda não
-- ter sido aplicada neste banco; só mexe na policy se a tabela já existir.
DO $$
BEGIN
  IF to_regclass('public.recursos') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "recursos_admin_all" ON recursos';
    EXECUTE 'CREATE POLICY "recursos_admin_all" ON recursos FOR ALL USING (public.current_user_role() = ''admin'')';
  END IF;
END $$;
