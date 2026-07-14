-- Migration: Create jogos table
-- Catálogo de jogos educativos, gerenciado pelo painel admin (/admin/jogos)
-- e exibido publicamente em /jogos.

CREATE TABLE IF NOT EXISTS jogos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  imagem_url TEXT,
  url_jogo TEXT,
  categoria TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  ordem INT NOT NULL DEFAULT 0,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_jogos_ativo ON jogos(ativo);
CREATE INDEX IF NOT EXISTS idx_jogos_ordem ON jogos(ordem);

COMMENT ON TABLE jogos IS 'Catálogo de jogos educativos exibido em /jogos';
COMMENT ON COLUMN jogos.url_jogo IS 'Link para o jogo; se nulo, exibido como "em breve"';
COMMENT ON COLUMN jogos.ordem IS 'Ordem de exibição no catálogo público (crescente)';

ALTER TABLE jogos ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa (inclusive anônima) vê os jogos ativos
CREATE POLICY "jogos_select_ativos" ON jogos
  FOR SELECT USING (ativo = true);

-- Admin gerencia o catálogo (usa a função SECURITY DEFINER para evitar
-- recursão de RLS em user_profiles — ver migration
-- 20260709000030_fix_remaining_admin_policy_recursion.sql)
CREATE POLICY "jogos_admin_all" ON jogos
  FOR ALL USING (public.current_user_role() = 'admin');
