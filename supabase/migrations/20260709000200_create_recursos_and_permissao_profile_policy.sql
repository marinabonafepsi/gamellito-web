-- Migration: recursos (biblioteca de atividades/materiais) + fix de RLS
--
-- Contexto: os painéis "Atividades para a turma" (educador) e "Materiais do
-- método" (profissional) no dashboard eram conteúdo estático hardcoded em
-- DashboardShell.tsx. Esta migration cria um catálogo real e curado.
--
-- Também corrige um bug real de RLS: profissional/paciente/[id]/page.tsx já
-- consulta `user_profiles.name` do paciente pelo id, mas nenhuma policy hoje
-- permite isso além do próprio dono/admin — a consulta sempre retornava
-- vazio para profissionais reais. A policy abaixo espelha a mesma checagem
-- que `registros_profissional_select` já usa (via permissoes ativa).

-- ============================================================================
-- RECURSOS — catálogo curado de atividades/materiais por papel
-- ============================================================================
CREATE TABLE IF NOT EXISTS recursos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  papel_alvo TEXT NOT NULL CHECK (papel_alvo IN ('educador', 'profissional')),
  categoria TEXT NOT NULL CHECK (categoria IN ('atividade', 'material')),
  titulo TEXT NOT NULL,
  descricao TEXT,
  icone TEXT,
  acao_label TEXT NOT NULL DEFAULT 'Abrir' CHECK (acao_label IN ('Abrir', 'Baixar')),
  url TEXT,
  ordem INT NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_recursos_papel_categoria ON recursos(papel_alvo, categoria, ordem)
  WHERE ativo = true;

COMMENT ON TABLE recursos IS 'Catálogo curado de atividades/materiais mostrado nos dashboards de educador e profissional';

ALTER TABLE recursos ENABLE ROW LEVEL SECURITY;

-- Qualquer usuário autenticado pode ver recursos ativos (conteúdo não sensível)
CREATE POLICY "recursos_select_ativo" ON recursos
  FOR SELECT USING (ativo = true);

-- Admin gerencia o catálogo
CREATE POLICY "recursos_admin_all" ON recursos
  FOR ALL USING (
    (SELECT role FROM user_profiles WHERE user_id = auth.uid()) = 'admin'
  );

-- Seed: mesmo conteúdo que já estava hardcoded na UI
INSERT INTO recursos (papel_alvo, categoria, titulo, descricao, icone, acao_label, ordem) VALUES
  ('educador', 'atividade', 'Roda de conversa sobre DM1', 'Roteiro de 20 min para toda a turma', '/assets/balao-pensamento.svg', 'Abrir', 1),
  ('educador', 'atividade', 'Jogo do Gamellito em sala', 'Dinâmica com o tabuleiro impresso', '/assets/gamellito-board-game.svg', 'Abrir', 2),
  ('educador', 'atividade', 'Cartaz de sinais de alerta', 'Hipo e hiper para fixar na parede', '/assets/olho-desconfiado.svg', 'Baixar', 3),
  ('profissional', 'material', 'Instrumentos de avaliação', 'Antes e depois da intervenção', '/assets/gamellito-seringa.svg', 'Baixar', 1),
  ('profissional', 'material', 'Roteiro de rodas de conversa', 'Estruturado por faixa etária', '/assets/balao-pensamento.svg', 'Baixar', 2)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- USER_PROFILES — permitir que quem recebeu permissão (educador/profissional)
-- veja o nome do usuário que compartilhou os dados
-- ============================================================================
CREATE POLICY "profiles_select_via_permissao" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM permissoes
      WHERE permissoes.usuario_dono = user_profiles.user_id
        AND permissoes.usuario_acesso = auth.uid()
        AND permissoes.revogado_em IS NULL
        AND (permissoes.expira_em IS NULL OR permissoes.expira_em > now())
    )
  );
