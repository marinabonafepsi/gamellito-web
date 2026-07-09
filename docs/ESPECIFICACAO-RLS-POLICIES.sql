-- =============================================================================
-- ESPECIFICAÇÃO TÉCNICA - Row Level Security (RLS) Policies
-- Arquitetura Multi-Portal Gamellito
-- =============================================================================
-- Data: 2026-06-24
-- Status: Rascunho Técnico
-- Descrição: Todas as políticas RLS por tabela, role e operação
-- =============================================================================

-- ENABLE RLS (executar para cada tabela)
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profissionais ENABLE ROW LEVEL SECURITY;
ALTER TABLE instituicoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE grupos_membros ENABLE ROW LEVEL SECURITY;
ALTER TABLE consentimento_granular ENABLE ROW LEVEL SECURITY;
ALTER TABLE convites ENABLE ROW LEVEL SECURITY;
ALTER TABLE loja_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventario_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE registros ENABLE ROW LEVEL SECURITY;


-- =============================================================================
-- TABELA: auth.users
-- =============================================================================
-- Usuários podem ver apenas sua própria conta (exceto admin)

-- Admin vê todos os usuários
CREATE POLICY "admin_select_all_users" ON auth.users
  FOR SELECT
  USING (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
    OR id = auth.uid()
  );

-- Admin pode insertar novos usuários
CREATE POLICY "admin_insert_users" ON auth.users
  FOR INSERT
  WITH CHECK (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- Admin pode atualizar todos, usuário comum apenas si mesmo
CREATE POLICY "users_update_own" ON auth.users
  FOR UPDATE
  USING (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
    OR id = auth.uid()
  );

-- Usuário comum vê apenas si mesmo
CREATE POLICY "user_select_self" ON auth.users
  FOR SELECT
  USING (id = auth.uid());

-- Usuário não pode deletar (apenas admin)
CREATE POLICY "admin_delete_users" ON auth.users
  FOR DELETE
  USING (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );


-- =============================================================================
-- TABELA: profissionais
-- =============================================================================
-- Profissional vê apenas seu próprio registro
-- Admin vê todos

-- Profissional vê seu próprio perfil
CREATE POLICY "profissional_select_own" ON profissionais
  FOR SELECT
  USING (
    usuario_id = auth.uid()
    OR (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- Admin pode insertar profissionais
CREATE POLICY "admin_insert_profissional" ON profissionais
  FOR INSERT
  WITH CHECK (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- Profissional pode atualizar seu próprio perfil
CREATE POLICY "profissional_update_own" ON profissionais
  FOR UPDATE
  USING (
    usuario_id = auth.uid()
    OR (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- Profissional pode deletar seu próprio perfil
CREATE POLICY "profissional_delete_own" ON profissionais
  FOR DELETE
  USING (
    usuario_id = auth.uid()
    OR (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- Familia/Educador pode ver profissionais verificados (para compartilhamento)
CREATE POLICY "public_view_verified_profissionais" ON profissionais
  FOR SELECT
  USING (
    verificado = true
    AND (SELECT role FROM auth.users WHERE id = auth.uid()) IN ('familia', 'educador', 'instituicao')
  );


-- =============================================================================
-- TABELA: instituicoes
-- =============================================================================
-- Admin da instituição vê sua instituição
-- Usuários do tenant veem dados básicos
-- Admin global vê tudo

-- Admin da instituição vê sua própria instituição
CREATE POLICY "instituicao_admin_select_own" ON instituicoes
  FOR SELECT
  USING (
    id = (SELECT tenant_id FROM auth.users WHERE id = auth.uid())
    OR admin_id = auth.uid()
  );

-- Admin global vê tudo
CREATE POLICY "global_admin_select_instituicoes" ON instituicoes
  FOR SELECT
  USING (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- Apenas admin global pode insertar instituições
CREATE POLICY "admin_insert_instituicao" ON instituicoes
  FOR INSERT
  WITH CHECK (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- Admin da instituição pode atualizar sua própria
CREATE POLICY "instituicao_admin_update_own" ON instituicoes
  FOR UPDATE
  USING (
    admin_id = auth.uid()
    OR (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- Apenas admin global pode deletar instituições
CREATE POLICY "admin_delete_instituicao" ON instituicoes
  FOR DELETE
  USING (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );


-- =============================================================================
-- TABELA: permissoes
-- =============================================================================
-- Usuário vê permissões onde é dono ou receptor
-- Admin vê tudo

-- Usuário vê permissões ativas onde é dono
CREATE POLICY "permissao_select_as_owner" ON permissoes
  FOR SELECT
  USING (
    usuario_dono_id = auth.uid()
    AND revogada_em IS NULL
  );

-- Usuário vê permissões ativas onde é receptor
CREATE POLICY "permissao_select_as_receiver" ON permissoes
  FOR SELECT
  USING (
    usuario_acesso_id = auth.uid()
    AND revogada_em IS NULL
  );

-- Admin vê tudo
CREATE POLICY "admin_select_permissoes" ON permissoes
  FOR SELECT
  USING (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- Apenas dono pode insertar (conceder permissão)
CREATE POLICY "permissao_insert_as_owner" ON permissoes
  FOR INSERT
  WITH CHECK (
    usuario_dono_id = auth.uid()
  );

-- Dono pode revogar sua própria permissão
CREATE POLICY "permissao_revoke_as_owner" ON permissoes
  FOR UPDATE
  USING (
    usuario_dono_id = auth.uid()
  );

-- Dono pode deletar sua permissão
CREATE POLICY "permissao_delete_as_owner" ON permissoes
  FOR DELETE
  USING (
    usuario_dono_id = auth.uid()
  );


-- =============================================================================
-- TABELA: grupos
-- =============================================================================
-- Admin da instituição vê grupos de seu tenant
-- Educador vê apenas seus grupos
-- Alunos veem grupos onde estão inscritos

-- Admin da instituição vê todos os grupos
CREATE POLICY "instituicao_admin_select_grupos" ON grupos
  FOR SELECT
  USING (
    instituicao_id = (SELECT tenant_id FROM auth.users WHERE id = auth.uid())
  );

-- Educador vê apenas seus grupos
CREATE POLICY "educador_select_own_grupos" ON grupos
  FOR SELECT
  USING (
    educador_id = auth.uid()
  );

-- Membros veem grupos onde estão inscritos
CREATE POLICY "membro_select_grupos" ON grupos
  FOR SELECT
  USING (
    id IN (
      SELECT grupo_id FROM grupos_membros
      WHERE usuario_id = auth.uid() AND removido_em IS NULL
    )
  );

-- Apenas admin da instituição pode criar grupos
CREATE POLICY "instituicao_admin_insert_grupos" ON grupos
  FOR INSERT
  WITH CHECK (
    instituicao_id = (SELECT tenant_id FROM auth.users WHERE id = auth.uid())
    AND (SELECT role FROM auth.users WHERE id = auth.uid()) IN ('admin', 'instituicao')
  );

-- Admin ou educador responsável pode atualizar
CREATE POLICY "grupo_update_admin_or_educador" ON grupos
  FOR UPDATE
  USING (
    instituicao_id = (SELECT tenant_id FROM auth.users WHERE id = auth.uid())
    OR educador_id = auth.uid()
  );

-- Admin pode deletar
CREATE POLICY "instituicao_admin_delete_grupos" ON grupos
  FOR DELETE
  USING (
    instituicao_id = (SELECT tenant_id FROM auth.users WHERE id = auth.uid())
  );


-- =============================================================================
-- TABELA: grupos_membros
-- =============================================================================
-- Admin vê membros de seus grupos
-- Membros veem outros membros do mesmo grupo

-- Admin da instituição vê membros
CREATE POLICY "instituicao_admin_select_membros" ON grupos_membros
  FOR SELECT
  USING (
    grupo_id IN (
      SELECT id FROM grupos
      WHERE instituicao_id = (SELECT tenant_id FROM auth.users WHERE id = auth.uid())
    )
    AND removido_em IS NULL
  );

-- Membro vê outros membros do grupo
CREATE POLICY "membro_select_grupo_membros" ON grupos_membros
  FOR SELECT
  USING (
    grupo_id IN (
      SELECT grupo_id FROM grupos_membros
      WHERE usuario_id = auth.uid() AND removido_em IS NULL
    )
    AND removido_em IS NULL
  );

-- Admin pode insertar membros
CREATE POLICY "admin_insert_membro" ON grupos_membros
  FOR INSERT
  WITH CHECK (
    grupo_id IN (
      SELECT id FROM grupos
      WHERE instituicao_id = (SELECT tenant_id FROM auth.users WHERE id = auth.uid())
    )
  );

-- Admin pode atualizar membros
CREATE POLICY "admin_update_membro" ON grupos_membros
  FOR UPDATE
  USING (
    grupo_id IN (
      SELECT id FROM grupos
      WHERE instituicao_id = (SELECT tenant_id FROM auth.users WHERE id = auth.uid())
    )
  );

-- Admin pode remover membros
CREATE POLICY "admin_delete_membro" ON grupos_membros
  FOR DELETE
  USING (
    grupo_id IN (
      SELECT id FROM grupos
      WHERE instituicao_id = (SELECT tenant_id FROM auth.users WHERE id = auth.uid())
    )
  );


-- =============================================================================
-- TABELA: permissoes (Compartilhamento de Dados)
-- =============================================================================
-- Familia compartilha com profissional
-- Profissional acessa registros de pacientes com permissão

-- Profissional vê permissões ativas recebidas
CREATE POLICY "profissional_view_shared_access" ON permissoes
  FOR SELECT
  USING (
    usuario_acesso_id = auth.uid()
    AND revogada_em IS NULL
    AND (expira_em IS NULL OR expira_em > now())
  );


-- =============================================================================
-- TABELA: consentimento_granular
-- =============================================================================
-- Rastreamento de consentimentos de compartilhamento de dados

-- Criança/responsável vê seus consentimentos dados
CREATE POLICY "crianca_select_own_consentimentos" ON consentimento_granular
  FOR SELECT
  USING (
    usuario_crianca_id = auth.uid()
  );

-- Profissional vê consentimentos que recebeu
CREATE POLICY "profissional_select_consentimentos_dados" ON consentimento_granular
  FOR SELECT
  USING (
    usuario_profissional_id = auth.uid()
  );

-- Apenas criança/responsável pode insertar consentimento
CREATE POLICY "crianca_insert_consentimento" ON consentimento_granular
  FOR INSERT
  WITH CHECK (
    usuario_crianca_id = auth.uid()
  );

-- Criança pode revogar seu consentimento
CREATE POLICY "crianca_revoke_consentimento" ON consentimento_granular
  FOR UPDATE
  USING (
    usuario_crianca_id = auth.uid()
  );

-- Admin global vê todos consentimentos
CREATE POLICY "admin_view_all_consentimentos" ON consentimento_granular
  FOR SELECT
  USING (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );


-- =============================================================================
-- TABELA: convites
-- =============================================================================
-- Remetente vê convites que enviou
-- Destinatário pode aceitar convite usando token

-- Remetente vê convites que enviou
CREATE POLICY "remetente_select_convites" ON convites
  FOR SELECT
  USING (
    usuario_remetente_id = auth.uid()
  );

-- Apenas remetente pode criar convites
CREATE POLICY "remetente_insert_convite" ON convites
  FOR INSERT
  WITH CHECK (
    usuario_remetente_id = auth.uid()
  );

-- Convites públicos podem ser vistos por token (sem RLS)
-- Ver lógica na aplicação para validação de token
CREATE POLICY "public_select_convite_by_token" ON convites
  FOR SELECT
  USING (true);  -- Validação via aplicação

-- Remetente pode atualizar seus convites
CREATE POLICY "remetente_update_convite" ON convites
  FOR UPDATE
  USING (
    usuario_remetente_id = auth.uid()
  );


-- =============================================================================
-- TABELA: loja_items
-- =============================================================================
-- Todos podem ver itens ativos da loja
-- Apenas admin pode gerenciar catálogo

-- Todos veem itens ativos
CREATE POLICY "all_select_loja_items_active" ON loja_items
  FOR SELECT
  USING (
    ativo = true
  );

-- Admin vê todos itens (ativos e inativos)
CREATE POLICY "admin_select_all_loja_items" ON loja_items
  FOR SELECT
  USING (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- Apenas admin pode insertar itens
CREATE POLICY "admin_insert_loja_item" ON loja_items
  FOR INSERT
  WITH CHECK (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- Apenas admin pode atualizar
CREATE POLICY "admin_update_loja_item" ON loja_items
  FOR UPDATE
  USING (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- Apenas admin pode deletar
CREATE POLICY "admin_delete_loja_item" ON loja_items
  FOR DELETE
  USING (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );


-- =============================================================================
-- TABELA: inventario_usuario
-- =============================================================================
-- Usuário vê apenas seu inventário
-- Admin vê tudo

-- Usuário vê seu próprio inventário
CREATE POLICY "usuario_select_own_inventario" ON inventario_usuario
  FOR SELECT
  USING (
    usuario_id = auth.uid()
  );

-- Admin vê todo inventário
CREATE POLICY "admin_select_all_inventario" ON inventario_usuario
  FOR SELECT
  USING (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- Sistema (ou usuario) insere na compra
CREATE POLICY "usuario_insert_inventario" ON inventario_usuario
  FOR INSERT
  WITH CHECK (
    usuario_id = auth.uid()
    OR (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- Usuário pode atualizar seu inventário (ativo/inativo)
CREATE POLICY "usuario_update_own_inventario" ON inventario_usuario
  FOR UPDATE
  USING (
    usuario_id = auth.uid()
  );

-- Admin pode deletar
CREATE POLICY "admin_delete_inventario" ON inventario_usuario
  FOR DELETE
  USING (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );


-- =============================================================================
-- TABELA: registros (Glicemia, Alimentação, etc.)
-- =============================================================================
-- Familia insere e vê seus próprios registros
-- Profissional vê registros se tem permissão
-- Educador vê registros se membro do mesmo grupo

-- Familia vê seus próprios registros
CREATE POLICY "familia_select_own_registros" ON registros
  FOR SELECT
  USING (
    familia_id = auth.uid()
    AND (SELECT role FROM auth.users WHERE id = auth.uid()) = 'familia'
  );

-- Familia insere seus próprios registros
CREATE POLICY "familia_insert_own_registros" ON registros
  FOR INSERT
  WITH CHECK (
    familia_id = auth.uid()
    AND (SELECT role FROM auth.users WHERE id = auth.uid()) = 'familia'
  );

-- Familia atualiza seus próprios registros
CREATE POLICY "familia_update_own_registros" ON registros
  FOR UPDATE
  USING (
    familia_id = auth.uid()
    AND (SELECT role FROM auth.users WHERE id = auth.uid()) = 'familia'
  );

-- Familia deleta seus próprios registros
CREATE POLICY "familia_delete_own_registros" ON registros
  FOR DELETE
  USING (
    familia_id = auth.uid()
    AND (SELECT role FROM auth.users WHERE id = auth.uid()) = 'familia'
  );

-- Profissional vê registros com permissão
CREATE POLICY "profissional_select_registros_com_permissao" ON registros
  FOR SELECT
  USING (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'profissional'
    AND EXISTS (
      SELECT 1 FROM permissoes
      WHERE permissoes.usuario_dono_id = registros.familia_id
      AND permissoes.usuario_acesso_id = auth.uid()
      AND permissoes.tipo_acesso IN ('readonly', 'comment', 'full')
      AND permissoes.revogada_em IS NULL
      AND (permissoes.expira_em IS NULL OR permissoes.expira_em > now())
    )
    AND EXISTS (
      SELECT 1 FROM consentimento_granular
      WHERE consentimento_granular.usuario_crianca_id = registros.familia_id
      AND consentimento_granular.usuario_profissional_id = auth.uid()
      AND consentimento_granular.consentimento_dado = true
      AND consentimento_granular.revogado_em IS NULL
      AND (
        consentimento_granular.tipo_consentimento = 'todos'
        OR (registros.tipo = 'glicemia' AND consentimento_granular.tipo_consentimento = 'registros_glicemia')
        OR (registros.tipo = 'alimentacao' AND consentimento_granular.tipo_consentimento = 'registros_alimentacao')
      )
    )
  );

-- Profissional pode adicionar comentários se tem permissão 'comment' ou 'full'
CREATE POLICY "profissional_comment_registros" ON registros
  FOR UPDATE
  USING (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'profissional'
    AND EXISTS (
      SELECT 1 FROM permissoes
      WHERE permissoes.usuario_dono_id = registros.familia_id
      AND permissoes.usuario_acesso_id = auth.uid()
      AND permissoes.tipo_acesso IN ('comment', 'full')
      AND permissoes.revogada_em IS NULL
    )
  );

-- Profissional pode editar registros se tem permissão 'full'
CREATE POLICY "profissional_full_edit_registros" ON registros
  FOR UPDATE
  USING (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'profissional'
    AND EXISTS (
      SELECT 1 FROM permissoes
      WHERE permissoes.usuario_dono_id = registros.familia_id
      AND permissoes.usuario_acesso_id = auth.uid()
      AND permissoes.tipo_acesso = 'full'
      AND permissoes.revogada_em IS NULL
    )
  );

-- Educador vê registros de alunos do mesmo grupo
CREATE POLICY "educador_select_grupo_registros" ON registros
  FOR SELECT
  USING (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'educador'
    AND EXISTS (
      SELECT 1 FROM grupos_membros gm
      INNER JOIN grupos g ON gm.grupo_id = g.id
      WHERE gm.usuario_id = registros.familia_id
      AND gm.removido_em IS NULL
      AND g.educador_id = auth.uid()
    )
  );

-- Admin vê tudo
CREATE POLICY "admin_select_all_registros" ON registros
  FOR SELECT
  USING (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );


-- =============================================================================
-- FUNÇÃO HELPER: Verificar Permissão
-- =============================================================================
-- Função para usar em queries e triggers
CREATE OR REPLACE FUNCTION has_access_to_registro(
  p_familia_id UUID,
  p_tipo_acesso VARCHAR,
  p_usuario_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM permissoes
    WHERE usuario_dono_id = p_familia_id
    AND usuario_acesso_id = p_usuario_id
    AND tipo_acesso = p_tipo_acesso
    AND revogada_em IS NULL
    AND (expira_em IS NULL OR expira_em > now())
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;


-- =============================================================================
-- FUNÇÃO HELPER: Limpar Permissões Expiradas (Cron Job)
-- =============================================================================
CREATE OR REPLACE FUNCTION cleanup_expired_permissoes()
RETURNS void AS $$
BEGIN
  UPDATE permissoes
  SET revogada_em = now()
  WHERE revogada_em IS NULL
  AND expira_em IS NOT NULL
  AND expira_em < now();

  UPDATE convites
  SET expirado = true
  WHERE expirado = false
  AND expira_em < now();
END;
$$ LANGUAGE plpgsql;

-- Executar diariamente:
-- SELECT cron.schedule('cleanup-expired-permissions', '0 2 * * *', 'SELECT cleanup_expired_permissoes()');


-- =============================================================================
-- NOTAS IMPORTANTES
-- =============================================================================
/*
1. CACHE DE PERMISSÕES
   - Implementar cache em Redis para permissões (TTL 5 minutos)
   - Invalidar cache quando permissões são alteradas
   - Evita múltiplas queries ao banco em cada requisição

2. CONSENTIMENTO GRANULAR
   - Sempre verificar consentimento_granular + permissoes
   - Registrar IP e user_agent para auditoria LGPD
   - Implementar UI clara para revogar consentimentos

3. PERFORMANCE
   - Índices já definidos em ESPECIFICACAO-TECNICA-ERD.md
   - Considerar materialized view para "profissionais com acesso"
   - Usar prepared statements na aplicação

4. AUDITORIA
   - Adicionar audit_log trigger em tabelas críticas
   - Registrar: who, what, when, from_where
   - Manter por 2 anos (LGPD compliance)

5. TESTING
   - Testar cada policy com role diferente
   - Testar transições de estado (ativo → revogado)
   - Testar expiração de permissões
   - Load test com 10k+ usuários
*/
