-- Migration 009: Enable RLS and Create All Policies
-- Row Level Security for multi-tenant isolation and data protection
--
-- NOTE: this project never modifies auth.users directly (Supabase's hosted
-- Postgres doesn't allow it — not even from the SQL Editor, auth.users is
-- owned by supabase_auth_admin). Role/tenant_id live on user_profiles
-- instead, which the app already writes to at signup, so every "admin sees
-- everything" / multi-tenant policy below reads from user_profiles.

-- ============================================================================
-- STEP 1: ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE registros ENABLE ROW LEVEL SECURITY;
ALTER TABLE profissionais ENABLE ROW LEVEL SECURITY;
ALTER TABLE instituicoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE grupos_membros ENABLE ROW LEVEL SECURITY;
ALTER TABLE consentimentos_granular ENABLE ROW LEVEL SECURITY;
ALTER TABLE convites ENABLE ROW LEVEL SECURITY;
ALTER TABLE loja_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventario_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE humor_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_events ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 3: USER_PROFILES POLICIES
-- ============================================================================

-- User vê seu próprio perfil
CREATE POLICY "profiles_select_own" ON user_profiles
  FOR SELECT USING (user_id = auth.uid());

-- Public consegue ver info básica de profissionais verificados
CREATE POLICY "profiles_select_public" ON user_profiles
  FOR SELECT USING (role = 'profissional' AND verificado = true);

-- User atualiza seu próprio perfil
CREATE POLICY "profiles_update_own" ON user_profiles
  FOR UPDATE USING (user_id = auth.uid());

-- Admin vê tudo
CREATE POLICY "profiles_admin_select" ON user_profiles
  FOR SELECT USING (
    (SELECT role FROM user_profiles WHERE user_id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- STEP 4: REGISTROS (GLICEMIA) POLICIES - CRITICAL
-- ============================================================================

-- FAMILIA: Vê APENAS seus próprios registros
CREATE POLICY "registros_familia_select" ON registros
  FOR SELECT USING (familia_id = auth.uid());

-- FAMILIA: Pode inserir novos registros
CREATE POLICY "registros_familia_insert" ON registros
  FOR INSERT WITH CHECK (familia_id = auth.uid());

-- FAMILIA: Pode atualizar registros próprios
CREATE POLICY "registros_familia_update" ON registros
  FOR UPDATE USING (familia_id = auth.uid());

-- FAMILIA: Pode deletar registros próprios
CREATE POLICY "registros_familia_delete" ON registros
  FOR DELETE USING (familia_id = auth.uid());

-- PROFISSIONAL: Vê registros apenas de pacientes que compartilharam
-- Valida permissão, tipo_acesso, e data de expiração
CREATE POLICY "registros_profissional_select" ON registros
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM permissoes
      WHERE permissoes.usuario_dono = registros.familia_id
        AND permissoes.usuario_acesso = auth.uid()
        AND tipo_acesso IN ('readonly', 'comment', 'full')
        AND (permissoes.expira_em IS NULL OR permissoes.expira_em > now())
        AND permissoes.revogado_em IS NULL
    )
  );

-- ADMIN: Vê tudo
CREATE POLICY "registros_admin_select" ON registros
  FOR SELECT USING (
    (SELECT role FROM user_profiles WHERE user_id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- STEP 5: PROFISSIONAIS POLICIES
-- ============================================================================

-- Public consegue ver profissionais verificados
CREATE POLICY "profissionais_select_public" ON profissionais
  FOR SELECT USING (verificado = true);

-- Profissional vê seu próprio perfil
CREATE POLICY "profissionais_select_own" ON profissionais
  FOR SELECT USING (id = auth.uid());

-- Profissional atualiza seu próprio perfil
CREATE POLICY "profissionais_update_own" ON profissionais
  FOR UPDATE USING (id = auth.uid());

-- Admin vê tudo
CREATE POLICY "profissionais_admin_all" ON profissionais
  FOR ALL USING (
    (SELECT role FROM user_profiles WHERE user_id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- STEP 6: INSTITUICOES POLICIES (MULTI-TENANT)
-- ============================================================================

-- Gestor consegue ver sua instituição
CREATE POLICY "instituicoes_select_own" ON instituicoes
  FOR SELECT USING (
    gestor_id = auth.uid()
    OR id = (SELECT tenant_id FROM user_profiles WHERE user_id = auth.uid())
  );

-- Gestor consegue atualizar sua instituição
CREATE POLICY "instituicoes_update_own" ON instituicoes
  FOR UPDATE USING (gestor_id = auth.uid());

-- Membros da instituição conseguem ver dados básicos
CREATE POLICY "instituicoes_select_member" ON instituicoes
  FOR SELECT USING (
    id = (SELECT tenant_id FROM user_profiles WHERE user_id = auth.uid())
  );

-- Admin vê tudo
CREATE POLICY "instituicoes_admin_all" ON instituicoes
  FOR ALL USING (
    (SELECT role FROM user_profiles WHERE user_id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- STEP 7: PERMISSOES POLICIES
-- ============================================================================

-- Usuario_dono vê permissões que CONCEDEU
CREATE POLICY "permissoes_dono_select" ON permissoes
  FOR SELECT USING (usuario_dono = auth.uid());

-- Usuario_dono consegue inserir
CREATE POLICY "permissoes_dono_insert" ON permissoes
  FOR INSERT WITH CHECK (usuario_dono = auth.uid());

-- Usuario_dono consegue deletar
CREATE POLICY "permissoes_dono_delete" ON permissoes
  FOR DELETE USING (usuario_dono = auth.uid());

-- Usuario_acesso vê permissões que TEM
CREATE POLICY "permissoes_acesso_select" ON permissoes
  FOR SELECT USING (usuario_acesso = auth.uid());

-- Admin vê tudo
CREATE POLICY "permissoes_admin_select" ON permissoes
  FOR SELECT USING (
    (SELECT role FROM user_profiles WHERE user_id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- STEP 8: GRUPOS POLICIES
-- ============================================================================

-- Membro consegue ver seu grupo
CREATE POLICY "grupos_select_member" ON grupos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM grupos_membros
      WHERE grupos_membros.grupo_id = grupos.id
        AND grupos_membros.usuario_id = auth.uid()
    )
  );

-- Gestor consegue atualizar grupo
CREATE POLICY "grupos_update_gestor" ON grupos
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM grupos_membros
      WHERE grupos_membros.grupo_id = grupos.id
        AND grupos_membros.usuario_id = auth.uid()
        AND grupos_membros.papel = 'gestor'
    )
  );

-- Gestor da instituição consegue inserir grupo
CREATE POLICY "grupos_insert_gestor_instituicao" ON grupos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM instituicoes
      WHERE instituicoes.id = grupos.instituicao_id
        AND instituicoes.gestor_id = auth.uid()
    )
  );

-- Admin vê tudo
CREATE POLICY "grupos_admin_all" ON grupos
  FOR ALL USING (
    (SELECT role FROM user_profiles WHERE user_id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- STEP 9: GRUPOS_MEMBROS POLICIES
-- ============================================================================

-- Membro consegue ver a si mesmo
CREATE POLICY "grupos_membros_select_own" ON grupos_membros
  FOR SELECT USING (usuario_id = auth.uid());

-- Gestor consegue ver todos os membros do seu grupo
CREATE POLICY "grupos_membros_select_gestor" ON grupos_membros
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM grupos_membros gm2
      WHERE gm2.grupo_id = grupos_membros.grupo_id
        AND gm2.usuario_id = auth.uid()
        AND gm2.papel = 'gestor'
    )
  );

-- Gestor consegue adicionar membros
CREATE POLICY "grupos_membros_insert_gestor" ON grupos_membros
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM grupos_membros gm2
      WHERE gm2.grupo_id = grupos_membros.grupo_id
        AND gm2.usuario_id = auth.uid()
        AND gm2.papel = 'gestor'
    )
  );

-- Gestor consegue remover membros
CREATE POLICY "grupos_membros_delete_gestor" ON grupos_membros
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM grupos_membros gm2
      WHERE gm2.grupo_id = grupos_membros.grupo_id
        AND gm2.usuario_id = auth.uid()
        AND gm2.papel = 'gestor'
    )
  );

-- Admin vê tudo
CREATE POLICY "grupos_membros_admin_all" ON grupos_membros
  FOR ALL USING (
    (SELECT role FROM user_profiles WHERE user_id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- STEP 10: CONSENTIMENTOS_GRANULAR POLICIES
-- ============================================================================

-- User vê seus próprios consentimentos
CREATE POLICY "consentimentos_select_own" ON consentimentos_granular
  FOR SELECT USING (usuario_id = auth.uid());

-- User consegue inserir/atualizar seus consentimentos
CREATE POLICY "consentimentos_insert_own" ON consentimentos_granular
  FOR INSERT WITH CHECK (usuario_id = auth.uid());

CREATE POLICY "consentimentos_update_own" ON consentimentos_granular
  FOR UPDATE USING (usuario_id = auth.uid());

-- Admin vê tudo (auditoria)
CREATE POLICY "consentimentos_admin_select" ON consentimentos_granular
  FOR SELECT USING (
    (SELECT role FROM user_profiles WHERE user_id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- STEP 11: CONVITES POLICIES
-- ============================================================================

-- Remetente vê convites que enviou
CREATE POLICY "convites_select_remetente" ON convites
  FOR SELECT USING (remetente_id = auth.uid());

-- Remetente consegue inserir
CREATE POLICY "convites_insert_remetente" ON convites
  FOR INSERT WITH CHECK (remetente_id = auth.uid());

-- Destinatário consegue ver convites recebidos
CREATE POLICY "convites_select_destinatario" ON convites
  FOR SELECT USING (
    destinatario_id = auth.uid()
    OR destinatario_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Destinatário consegue aceitar/rejeitar
CREATE POLICY "convites_update_destinatario" ON convites
  FOR UPDATE USING (
    destinatario_id = auth.uid()
    OR destinatario_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Admin vê tudo
CREATE POLICY "convites_admin_all" ON convites
  FOR ALL USING (
    (SELECT role FROM user_profiles WHERE user_id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- STEP 12: LOJA_ITEMS POLICIES
-- ============================================================================

-- Public consegue ver todos os itens ativos
CREATE POLICY "loja_items_select_public" ON loja_items
  FOR SELECT USING (ativo = true);

-- Admin gerencia items
CREATE POLICY "loja_items_admin_all" ON loja_items
  FOR ALL USING (
    (SELECT role FROM user_profiles WHERE user_id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- STEP 13: INVENTARIO_USUARIO POLICIES
-- ============================================================================

-- User vê seu próprio inventário
CREATE POLICY "inventario_select_own" ON inventario_usuario
  FOR SELECT USING (usuario_id = auth.uid());

-- User consegue inserir (comprar) items
CREATE POLICY "inventario_insert_own" ON inventario_usuario
  FOR INSERT WITH CHECK (usuario_id = auth.uid());

-- User consegue atualizar inventário
CREATE POLICY "inventario_update_own" ON inventario_usuario
  FOR UPDATE USING (usuario_id = auth.uid());

-- Admin vê tudo
CREATE POLICY "inventario_admin_all" ON inventario_usuario
  FOR ALL USING (
    (SELECT role FROM user_profiles WHERE user_id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- STEP 14: CLINICAL_NOTES POLICIES
-- ============================================================================

-- Profissional vê notas que criou
CREATE POLICY "clinical_notes_select_author" ON clinical_notes
  FOR SELECT USING (criado_por = auth.uid());

-- Profissional consegue criar notas
CREATE POLICY "clinical_notes_insert_author" ON clinical_notes
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profissionais WHERE id = auth.uid())
    AND criado_por = auth.uid()
  );

-- Dono consegue ver notas sobre seus registros
CREATE POLICY "clinical_notes_select_owner" ON clinical_notes
  FOR SELECT USING (usuario_dono = auth.uid());

-- Admin vê tudo
CREATE POLICY "clinical_notes_admin_all" ON clinical_notes
  FOR ALL USING (
    (SELECT role FROM user_profiles WHERE user_id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- STEP 15: HUMOR_LOGS POLICIES
-- ============================================================================

-- User vê seu próprio humor log
CREATE POLICY "humor_select_own" ON humor_logs
  FOR SELECT USING (user_id = auth.uid());

-- User consegue inserir novo humor
CREATE POLICY "humor_insert_own" ON humor_logs
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Admin vê tudo
CREATE POLICY "humor_admin_all" ON humor_logs
  FOR ALL USING (
    (SELECT role FROM user_profiles WHERE user_id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- STEP 16: PRODUCT_EVENTS POLICIES (Analytics - service_role only)
-- ============================================================================

-- Nenhum usuario consegue acessar diretamente (sem policies = default-deny)
-- Apenas service_role consegue inserir (no backend)

-- ============================================================================
-- VALIDAÇÃO
-- ============================================================================

-- Verificar que RLS foi habilitado em todas as tabelas
-- Execute em SQL Editor para validar:
/*
SELECT tablename,
       EXISTS(SELECT 1 FROM pg_policies WHERE pg_policies.tablename = pg_tables.tablename) as has_policies
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
*/
